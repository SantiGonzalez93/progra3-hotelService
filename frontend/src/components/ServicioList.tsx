import React, { useState, useEffect } from 'react';
import { Table, Badge, Alert, Button, Modal, Form, Row, Col, Card } from 'react-bootstrap';
import { Servicio } from '../types';
import { servicioService } from '../services/api';

interface ServicioListProps {
  onError: (error: string | null) => void;
  onLoading: (loading: boolean) => void;
}

const ServicioList: React.FC<ServicioListProps> = ({ onError, onLoading }) => {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingServicio, setEditingServicio] = useState<Servicio | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: 0,
    disponibilidad: true
  });

  const loadServicios = async () => {
    try {
      onLoading(true);
      onError(null);
      const response = await servicioService.getAll();
      setServicios(response.data);
    } catch (error) {
      onError('Error al cargar los servicios. Asegúrate de que el backend esté ejecutándose en http://localhost:7080');
    } finally {
      onLoading(false);
    }
  };

  useEffect(() => {
    loadServicios();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  const handleShowModal = (servicio?: Servicio) => {
    if (servicio) {
      setEditingServicio(servicio);
      setFormData({
        nombre: servicio.nombre,
        descripcion: servicio.descripcion,
        precio: servicio.precio,
        disponibilidad: servicio.disponibilidad
      });
    } else {
      setEditingServicio(null);
      setFormData({
        nombre: '',
        descripcion: '',
        precio: 0,
        disponibilidad: true
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingServicio(null);
    setFormData({
      nombre: '',
      descripcion: '',
      precio: 0,
      disponibilidad: true
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              (name === 'precio' ? parseFloat(value) || 0 : value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      onLoading(true);
      onError(null);

      if (editingServicio) {
        await servicioService.update({ ...formData, id: editingServicio.id });
      } else {
        await servicioService.create(formData);
      }

      await loadServicios();
      handleCloseModal();
    } catch (error) {
      onError('Error al guardar el servicio');
    } finally {
      onLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
      try {
        onLoading(true);
        onError(null);
        await servicioService.delete(id);
        await loadServicios();
      } catch (error) {
        onError('Error al eliminar el servicio');
      } finally {
        onLoading(false);
      }
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Lista de Servicios</h5>
        <div>
          <Button 
            variant={viewMode === 'table' ? 'outline-primary' : 'outline-secondary'} 
            onClick={() => setViewMode('table')}
            className="me-2"
            size="sm"
          >
            📋 Tabla
          </Button>
          <Button 
            variant={viewMode === 'cards' ? 'outline-primary' : 'outline-secondary'} 
            onClick={() => setViewMode('cards')}
            className="me-2"
            size="sm"
          >
            🃏 Tarjetas
          </Button>
          <Button variant="success" onClick={() => handleShowModal()} className="me-2">
            ➕ Nuevo Servicio
          </Button>
          <Button variant="primary" onClick={loadServicios}>
            🔄 Actualizar
          </Button>
        </div>
      </div>

      {servicios.length === 0 ? (
        <Alert variant="info">
          No hay servicios registrados.
        </Alert>
      ) : viewMode === 'table' ? (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Disponibilidad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {servicios.map((servicio) => (
              <tr key={servicio.id}>
                <td>{servicio.id}</td>
                <td>
                  <strong>{servicio.nombre}</strong>
                </td>
                <td>{servicio.descripcion}</td>
                <td>{formatCurrency(servicio.precio)}</td>
                <td>
                  {servicio.disponibilidad ? (
                    <Badge bg="success">Disponible</Badge>
                  ) : (
                    <Badge bg="danger">No Disponible</Badge>
                  )}
                </td>
                <td>
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    onClick={() => handleShowModal(servicio)}
                    className="me-1"
                  >
                    ✏️
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    size="sm" 
                    onClick={() => handleDelete(servicio.id)}
                  >
                    🗑️
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div className="row">
          {servicios.map((servicio) => (
            <div key={servicio.id} className="col-md-6 col-lg-4 mb-3">
              <Card className="h-100">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <strong>{servicio.nombre}</strong>
                  {servicio.disponibilidad ? (
                    <Badge bg="success">Disponible</Badge>
                  ) : (
                    <Badge bg="danger">No Disponible</Badge>
                  )}
                </Card.Header>
                <Card.Body>
                  <p className="card-text">{servicio.descripcion}</p>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="h5 text-primary mb-0">
                      {formatCurrency(servicio.precio)}
                    </span>
                  </div>
                  <div className="d-flex gap-2">
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      onClick={() => handleShowModal(servicio)}
                      className="flex-fill"
                    >
                      ✏️ Editar
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm" 
                      onClick={() => handleDelete(servicio.id)}
                      className="flex-fill"
                    >
                      🗑️ Eliminar
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      )}

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingServicio ? 'Editar Servicio' : 'Nuevo Servicio'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre del Servicio</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Precio</Form.Label>
                  <Form.Control
                    type="number"
                    name="precio"
                    value={formData.precio}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    rows={3}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    name="disponibilidad"
                    label="Disponible"
                    checked={formData.disponibilidad}
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
              {editingServicio ? 'Actualizar' : 'Crear'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default ServicioList;
