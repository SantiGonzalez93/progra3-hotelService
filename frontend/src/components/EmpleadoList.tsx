import React, { useState, useEffect } from 'react';
import { Table, Badge, Alert, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { Empleado } from '../types';
import { empleadoService } from '../services/api';

interface EmpleadoListProps {
  onError: (error: string | null) => void;
  onLoading: (loading: boolean) => void;
}

const EmpleadoList: React.FC<EmpleadoListProps> = ({ onError, onLoading }) => {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEmpleado, setEditingEmpleado] = useState<Empleado | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    cargo: '',
    numeroIdentificacion: '',
    salario: 0,
    fechaContratacion: ''
  });

  const loadEmpleados = async () => {
    try {
      onLoading(true);
      onError(null);
      const response = await empleadoService.getAll();
      setEmpleados(response.data);
    } catch (error) {
      onError('Error al cargar los empleados. Asegúrate de que el backend esté ejecutándose en http://localhost:7080');
    } finally {
      onLoading(false);
    }
  };

  useEffect(() => {
    loadEmpleados();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR');
  };

  const handleShowModal = (empleado?: Empleado) => {
    if (empleado) {
      setEditingEmpleado(empleado);
      setFormData({
        nombre: empleado.nombre,
        cargo: empleado.cargo,
        numeroIdentificacion: empleado.numeroIdentificacion,
        salario: empleado.salario,
        fechaContratacion: empleado.fechaContratacion.split('T')[0] // Formato YYYY-MM-DD
      });
    } else {
      setEditingEmpleado(null);
      setFormData({
        nombre: '',
        cargo: '',
        numeroIdentificacion: '',
        salario: 0,
        fechaContratacion: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingEmpleado(null);
    setFormData({
      nombre: '',
      cargo: '',
      numeroIdentificacion: '',
      salario: 0,
      fechaContratacion: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'salario' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      onLoading(true);
      onError(null);

      const empleadoData = {
        ...formData,
        fechaContratacion: new Date(formData.fechaContratacion).toISOString()
      };

      if (editingEmpleado) {
        await empleadoService.update({ ...empleadoData, id: editingEmpleado.id });
      } else {
        await empleadoService.create(empleadoData);
      }

      await loadEmpleados();
      handleCloseModal();
    } catch (error) {
      onError('Error al guardar el empleado');
    } finally {
      onLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este empleado?')) {
      try {
        onLoading(true);
        onError(null);
        await empleadoService.delete(id);
        await loadEmpleados();
      } catch (error) {
        onError('Error al eliminar el empleado');
      } finally {
        onLoading(false);
      }
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Lista de Empleados</h5>
        <div>
          <Button variant="success" onClick={() => handleShowModal()} className="me-2">
            ➕ Nuevo Empleado
          </Button>
          <Button variant="primary" onClick={loadEmpleados}>
            🔄 Actualizar
          </Button>
        </div>
      </div>

      {empleados.length === 0 ? (
        <Alert variant="info">
          No hay empleados registrados.
        </Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Cargo</th>
              <th>N° Identificación</th>
              <th>Salario</th>
              <th>Fecha Contratación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empleados.map((empleado) => (
              <tr key={empleado.id}>
                <td>{empleado.id}</td>
                <td>
                  <strong>{empleado.nombre}</strong>
                </td>
                <td>
                  <Badge bg="info">{empleado.cargo}</Badge>
                </td>
                <td>{empleado.numeroIdentificacion}</td>
                <td>{formatCurrency(empleado.salario)}</td>
                <td>{formatDate(empleado.fechaContratacion)}</td>
                <td>
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    onClick={() => handleShowModal(empleado)}
                    className="me-1"
                  >
                    ✏️
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    size="sm" 
                    onClick={() => handleDelete(empleado.id)}
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
            {editingEmpleado ? 'Editar Empleado' : 'Nuevo Empleado'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
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
                  <Form.Label>Cargo</Form.Label>
                  <Form.Control
                    type="text"
                    name="cargo"
                    value={formData.cargo}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Número de Identificación</Form.Label>
                  <Form.Control
                    type="text"
                    name="numeroIdentificacion"
                    value={formData.numeroIdentificacion}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Salario</Form.Label>
                  <Form.Control
                    type="number"
                    name="salario"
                    value={formData.salario}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha de Contratación</Form.Label>
                  <Form.Control
                    type="date"
                    name="fechaContratacion"
                    value={formData.fechaContratacion}
                    onChange={handleInputChange}
                    required
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
              {editingEmpleado ? 'Actualizar' : 'Crear'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default EmpleadoList;
