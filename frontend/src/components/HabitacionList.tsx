import React, { useState, useEffect } from 'react';
import { Table, Badge, Alert, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { Habitacion } from '../types';
import { habitacionService } from '../services/api';

interface HabitacionListProps {
  onError: (error: string | null) => void;
  onLoading: (loading: boolean) => void;
}

const HabitacionList: React.FC<HabitacionListProps> = ({ onError, onLoading }) => {
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingHabitacion, setEditingHabitacion] = useState<Habitacion | null>(null);
  const [formData, setFormData] = useState({
    numero: '',
    tipo: '',
    precioPorNoche: 0,
    estado: 'Limpia',
    disponible: true
  });

  const loadHabitaciones = async () => {
    try {
      onLoading(true);
      onError(null);
      const response = await habitacionService.getAll();
      setHabitaciones(response.data);
    } catch (error) {
      onError('Error al cargar las habitaciones. Asegúrate de que el backend esté ejecutándose en http://localhost:7080');
    } finally {
      onLoading(false);
    }
  };

  useEffect(() => {
    loadHabitaciones();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  const getEstadoBadge = (estado: string, disponible: boolean) => {
    if (!disponible) {
      return <Badge bg="danger">Ocupada</Badge>;
    }
    switch (estado) {
      case 'Limpia':
        return <Badge bg="success">Limpia</Badge>;
      case 'En Mantenimiento':
        return <Badge bg="warning">Mantenimiento</Badge>;
      default:
        return <Badge bg="secondary">{estado}</Badge>;
    }
  };

  const handleShowModal = (habitacion?: Habitacion) => {
    if (habitacion) {
      setEditingHabitacion(habitacion);
      setFormData({
        numero: habitacion.numero,
        tipo: habitacion.tipo,
        precioPorNoche: habitacion.precioPorNoche,
        estado: habitacion.estado,
        disponible: habitacion.disponible
      });
    } else {
      setEditingHabitacion(null);
      setFormData({
        numero: '',
        tipo: '',
        precioPorNoche: 0,
        estado: 'Limpia',
        disponible: true
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingHabitacion(null);
    setFormData({
      numero: '',
      tipo: '',
      precioPorNoche: 0,
      estado: 'Limpia',
      disponible: true
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              (name === 'precioPorNoche' ? parseFloat(value) || 0 : value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      onLoading(true);
      onError(null);

      if (editingHabitacion) {
        await habitacionService.update({ ...formData, id: editingHabitacion.id });
      } else {
        await habitacionService.create(formData);
      }

      await loadHabitaciones();
      handleCloseModal();
    } catch (error) {
      onError('Error al guardar la habitación');
    } finally {
      onLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta habitación?')) {
      try {
        onLoading(true);
        onError(null);
        await habitacionService.delete(id);
        await loadHabitaciones();
      } catch (error) {
        onError('Error al eliminar la habitación');
      } finally {
        onLoading(false);
      }
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Lista de Habitaciones</h5>
        <div>
          <Button variant="success" onClick={() => handleShowModal()} className="me-2">
            ➕ Nueva Habitación
          </Button>
          <Button variant="primary" onClick={loadHabitaciones}>
            🔄 Actualizar
          </Button>
        </div>
      </div>

      {habitaciones.length === 0 ? (
        <Alert variant="info">
          No hay habitaciones registradas.
        </Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Número</th>
              <th>Tipo</th>
              <th>Precio/Noche</th>
              <th>Estado</th>
              <th>Disponible</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {habitaciones.map((habitacion) => (
              <tr key={habitacion.id}>
                <td>{habitacion.id}</td>
                <td>
                  <strong>#{habitacion.numero}</strong>
                </td>
                <td>{habitacion.tipo}</td>
                <td>{formatCurrency(habitacion.precioPorNoche)}</td>
                <td>{getEstadoBadge(habitacion.estado, habitacion.disponible)}</td>
                <td>
                  {habitacion.disponible ? (
                    <Badge bg="success">Sí</Badge>
                  ) : (
                    <Badge bg="danger">No</Badge>
                  )}
                </td>
                <td>
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    onClick={() => handleShowModal(habitacion)}
                    className="me-1"
                  >
                    ✏️
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    size="sm" 
                    onClick={() => handleDelete(habitacion.id)}
                  >
                    🗑️
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingHabitacion ? 'Editar Habitación' : 'Nueva Habitación'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Número de Habitación</Form.Label>
                  <Form.Control
                    type="text"
                    name="numero"
                    value={formData.numero}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tipo</Form.Label>
                  <Form.Control
                    type="text"
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleInputChange}
                    placeholder="Ej: Simple, Doble, Suite"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Precio por Noche</Form.Label>
                  <Form.Control
                    type="number"
                    name="precioPorNoche"
                    value={formData.precioPorNoche}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Estado</Form.Label>
                  <Form.Select
                    name="estado"
                    value={formData.estado}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Limpia">Limpia</option>
                    <option value="En Mantenimiento">En Mantenimiento</option>
                    <option value="Ocupada">Ocupada</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    name="disponible"
                    label="Disponible"
                    checked={formData.disponible}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              {editingHabitacion ? 'Actualizar' : 'Crear'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default HabitacionList;
