import React, { useState } from 'react';
import { Table, Badge, Alert, Button, Modal, Form, Row, Col, Card } from 'react-bootstrap';
import { Servicio } from '../types';
import { servicioService } from '../services/api';
import { useAppContext } from '../context/AppContext';

const ServicioList: React.FC = () => {
  const { servicios, addServicio, updateServicio, removeServicio } = useAppContext();
  // Ya no necesitamos el estado local, viene del contexto
  const [showModal, setShowModal] = useState(false);
  const [editingServicio, setEditingServicio] = useState<Servicio | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '' as any,
    disponibilidad: true
  });

  // Ya no necesitamos cargar servicios, vienen del contexto

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
        precio: '' as any,
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
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const servicioData = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: Number(formData.precio),
        disponibilidad: formData.disponibilidad
      };

      if (editingServicio) {
        const servicioActualizado = { ...servicioData, id: editingServicio.id };
        await servicioService.update(servicioActualizado);
        updateServicio(servicioActualizado);
      } else {
        const response = await servicioService.create(servicioData);
        if (response.estado && response.data) {
          addServicio(response.data);
        }
      }

      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar el servicio:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
      try {
        await servicioService.delete(id);
        removeServicio(id);
      } catch (error) {
        console.error('Error al eliminar el servicio:', error);
      }
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h5 className="mb-1" style={{ color: '#495057', fontWeight: 'bold' }}>Lista de Servicios</h5>
          <p className="text-muted mb-0" style={{ fontSize: '14px' }}>Gestiona los servicios del hotel</p>
        </div>
        <div className="d-flex gap-2">
          <Button 
            variant={viewMode === 'table' ? 'primary' : 'outline-primary'} 
            onClick={() => setViewMode('table')}
            size="sm"
            style={{ 
              borderRadius: '20px', 
              padding: '6px 16px',
              fontWeight: '500'
            }}
          >
            📋 Tabla
          </Button>
          <Button 
            variant={viewMode === 'cards' ? 'primary' : 'outline-primary'} 
            onClick={() => setViewMode('cards')}
            size="sm"
            style={{ 
              borderRadius: '20px', 
              padding: '6px 16px',
              fontWeight: '500'
            }}
          >
            🃏 Tarjetas
          </Button>
          <Button 
            variant="success" 
            onClick={() => handleShowModal()} 
            style={{ 
              borderRadius: '25px', 
              padding: '8px 20px',
              fontWeight: '500',
              boxShadow: '0 2px 4px rgba(40, 167, 69, 0.3)'
            }}
          >
            ➕ Nuevo Servicio
          </Button>
          <Button 
            variant="outline-primary" 
            onClick={() => window.location.reload()}
            style={{ 
              borderRadius: '25px', 
              padding: '8px 20px',
              fontWeight: '500'
            }}
          >
            🔄 Actualizar
          </Button>
        </div>
      </div>

      {!servicios || servicios.length === 0 ? (
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
            {servicios.filter(s => s && s.id).map((servicio) => (
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
          {servicios.filter(s => s && s.id).map((servicio) => (
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
