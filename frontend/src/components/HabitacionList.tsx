import React, { useState } from 'react';
import { Table, Badge, Alert, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { Habitacion } from '../types';
import { habitacionService } from '../services/api';
import { useAppContext } from '../context/AppContext';

const HabitacionList: React.FC = () => {
  const { habitaciones, addHabitacion, updateHabitacion, removeHabitacion } = useAppContext();
  // Ya no necesitamos el estado local, viene del contexto
  const [showModal, setShowModal] = useState(false);
  const [editingHabitacion, setEditingHabitacion] = useState<Habitacion | null>(null);
  const [formData, setFormData] = useState({
    numero: '' as any,
    tipo: '',
    precioPorNoche: '' as any,
    estado: 'Limpia',
    disponible: true
  });

  // Ya no necesitamos cargar habitaciones, vienen del contexto

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
        numero: '' as any,
        tipo: '',
        precioPorNoche: '' as any,
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
      numero: 0,
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
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const habitacionData = {
        numero: Number(formData.numero),
        tipo: formData.tipo,
        precioPorNoche: Number(formData.precioPorNoche),
        estado: formData.estado,
        disponible: formData.disponible
      };

      if (editingHabitacion) {
        const habitacionActualizada = { ...habitacionData, id: editingHabitacion.id };
        await habitacionService.update(habitacionActualizada);
        updateHabitacion(habitacionActualizada);
      } else {
        const response = await habitacionService.create(habitacionData);
        if (response.estado && response.data) {
          addHabitacion(response.data);
        }
      }

      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar la habitación:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta habitación?')) {
      try {
        const response = await habitacionService.delete(id);
        if (response.estado) {
          removeHabitacion(id);
          alert('Habitación eliminada exitosamente');
        } else {
          alert('Error al eliminar la habitación: ' + (response.message?.join(', ') || 'Error desconocido'));
        }
      } catch (error: any) {
        console.error('Error al eliminar la habitación:', error);
        const errorMessage = error.response?.data?.message?.join(', ') || error.message || 'Error desconocido';
        alert('Error al eliminar la habitación: ' + errorMessage);
      }
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h5 className="mb-1" style={{ color: '#495057', fontWeight: 'bold' }}>Lista de Habitaciones</h5>
          <p className="text-muted mb-0" style={{ fontSize: '14px' }}>Gestiona las habitaciones del hotel</p>
        </div>
        <div className="d-flex gap-2">
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
            ➕ Nueva Habitación
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

      {!habitaciones || habitaciones.length === 0 ? (
        <div 
          className="text-center py-5"
          style={{
            backgroundColor: 'white',
            borderRadius: '15px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            border: '2px dashed #dee2e6'
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '1rem' }}>🏠</div>
          <h5 style={{ color: '#6c757d', marginBottom: '0.5rem' }}>No hay habitaciones registradas</h5>
          <p className="text-muted">Comienza agregando tu primera habitación</p>
        </div>
      ) : (
        <div 
          style={{
            backgroundColor: 'white',
            borderRadius: '15px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden'
          }}
        >
          <Table hover responsive className="mb-0">
            <thead style={{ backgroundColor: '#f8f9fa' }}>
              <tr>
                <th style={{ border: 'none', padding: '1rem', color: '#495057', fontWeight: '600' }}>ID</th>
                <th style={{ border: 'none', padding: '1rem', color: '#495057', fontWeight: '600' }}>Número</th>
                <th style={{ border: 'none', padding: '1rem', color: '#495057', fontWeight: '600' }}>Tipo</th>
                <th style={{ border: 'none', padding: '1rem', color: '#495057', fontWeight: '600' }}>Precio/Noche</th>
                <th style={{ border: 'none', padding: '1rem', color: '#495057', fontWeight: '600' }}>Estado</th>
                <th style={{ border: 'none', padding: '1rem', color: '#495057', fontWeight: '600' }}>Disponible</th>
                <th style={{ border: 'none', padding: '1rem', color: '#495057', fontWeight: '600' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {habitaciones.filter(h => h && h.id).map((habitacion, index) => (
                <tr 
                  key={habitacion.id}
                  style={{ 
                    backgroundColor: index % 2 === 0 ? 'white' : '#f8f9fa',
                    borderBottom: '1px solid #f1f3f4'
                  }}
                >
                  <td style={{ border: 'none', padding: '1rem', color: '#6c757d' }}>{habitacion.id}</td>
                  <td style={{ border: 'none', padding: '1rem' }}>
                    <strong style={{ color: '#495057' }}>#{habitacion.numero}</strong>
                  </td>
                  <td style={{ border: 'none', padding: '1rem', color: '#6c757d' }}>{habitacion.tipo}</td>
                  <td style={{ border: 'none', padding: '1rem', color: '#6c757d', fontWeight: '500' }}>{formatCurrency(habitacion.precioPorNoche)}</td>
                  <td style={{ border: 'none', padding: '1rem' }}>{getEstadoBadge(habitacion.estado, habitacion.disponible)}</td>
                  <td style={{ border: 'none', padding: '1rem' }}>
                    {habitacion.disponible ? (
                      <Badge 
                        style={{ 
                          backgroundColor: '#28a745', 
                          borderRadius: '15px',
                          padding: '4px 12px',
                          fontSize: '12px'
                        }}
                      >
                        Sí
                      </Badge>
                    ) : (
                      <Badge 
                        style={{ 
                          backgroundColor: '#dc3545', 
                          borderRadius: '15px',
                          padding: '4px 12px',
                          fontSize: '12px'
                        }}
                      >
                        No
                      </Badge>
                    )}
                  </td>
                  <td style={{ border: 'none', padding: '1rem' }}>
                    <div className="d-flex gap-1">
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        onClick={() => handleShowModal(habitacion)}
                        style={{ 
                          borderRadius: '20px', 
                          padding: '6px 12px',
                          border: '1px solid #6f42c1',
                          color: '#6f42c1'
                        }}
                      >
                        ✏️
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm" 
                        onClick={() => handleDelete(habitacion.id)}
                        style={{ 
                          borderRadius: '20px', 
                          padding: '6px 12px',
                          border: '1px solid #dc3545',
                          color: '#dc3545'
                        }}
                      >
                        🗑️
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      <Modal 
        show={showModal} 
        onHide={handleCloseModal} 
        size="lg"
        style={{ zIndex: 1050 }}
      >
        <Modal.Header 
          closeButton
          style={{
            background: 'linear-gradient(135deg, #6f42c1 0%, #20c997 100%)',
            color: 'white',
            border: 'none'
          }}
        >
          <Modal.Title style={{ fontWeight: 'bold' }}>
            {editingHabitacion ? '✏️ Editar Habitación' : '➕ Nueva Habitación'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Número de Habitación</Form.Label>
                  <Form.Control
                    type="number"
                    name="numero"
                    value={formData.numero}
                    onChange={handleInputChange}
                    min="1"
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
          <Modal.Footer style={{ backgroundColor: '#f8f9fa', border: 'none' }}>
            <Button 
              variant="outline-secondary" 
              onClick={handleCloseModal}
              style={{ 
                borderRadius: '25px', 
                padding: '8px 20px',
                fontWeight: '500'
              }}
            >
              Cancelar
            </Button>
            <Button 
              variant="primary" 
              type="submit"
              style={{ 
                borderRadius: '25px', 
                padding: '8px 20px',
                fontWeight: '500',
                background: 'linear-gradient(135deg, #6f42c1 0%, #20c997 100%)',
                border: 'none',
                boxShadow: '0 2px 4px rgba(111, 66, 193, 0.3)'
              }}
            >
              {editingHabitacion ? 'Actualizar' : 'Crear'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default HabitacionList;
