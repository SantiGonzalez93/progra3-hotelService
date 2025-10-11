import React, { useState } from 'react';
import { Table, Badge, Alert, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { Empleado } from '../types';
import { empleadoService } from '../services/api';
import { useAppContext } from '../context/AppContext';

const EmpleadoList: React.FC = () => {
  const { empleados, addEmpleado, updateEmpleado, removeEmpleado } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [editingEmpleado, setEditingEmpleado] = useState<Empleado | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    cargo: '',
    numeroIdentificacion: 0,
    salario: 0,
    fechaContratacion: ''
  });

  // Ya no necesitamos cargar empleados, vienen del contexto

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
        numeroIdentificacion: 0,
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
      numeroIdentificacion: 0,
      salario: 0,
      fechaContratacion: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'salario' || name === 'numeroIdentificacion' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const empleadoData = {
        ...formData,
        fechaContratacion: new Date(formData.fechaContratacion).toISOString()
      };

      if (editingEmpleado) {
        const empleadoActualizado = { ...empleadoData, id: editingEmpleado.id };
        await empleadoService.update(empleadoActualizado);
        updateEmpleado(empleadoActualizado);
      } else {
        const response = await empleadoService.create(empleadoData);
        if (response.estado) {
          // El backend devuelve un array, tomamos el primer elemento
          addEmpleado(response.data[0]);
        }
      }

      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar el empleado:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este empleado?')) {
      try {
        await empleadoService.delete(id);
        removeEmpleado(id);
      } catch (error) {
        console.error('Error al eliminar el empleado:', error);
      }
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h5 className="mb-1" style={{ color: '#495057', fontWeight: 'bold' }}>Lista de Empleados</h5>
          <p className="text-muted mb-0" style={{ fontSize: '14px' }}>Gestiona el personal del hotel</p>
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
            ➕ Nuevo Empleado
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

      {empleados.length === 0 ? (
        <div 
          className="text-center py-5"
          style={{
            backgroundColor: 'white',
            borderRadius: '15px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            border: '2px dashed #dee2e6'
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '1rem' }}>👨‍💼</div>
          <h5 style={{ color: '#6c757d', marginBottom: '0.5rem' }}>No hay empleados registrados</h5>
          <p className="text-muted">Comienza agregando tu primer empleado</p>
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
                <th style={{ border: 'none', padding: '1rem', color: '#495057', fontWeight: '600' }}>Nombre</th>
                <th style={{ border: 'none', padding: '1rem', color: '#495057', fontWeight: '600' }}>Cargo</th>
                <th style={{ border: 'none', padding: '1rem', color: '#495057', fontWeight: '600' }}>N° Identificación</th>
                <th style={{ border: 'none', padding: '1rem', color: '#495057', fontWeight: '600' }}>Salario</th>
                <th style={{ border: 'none', padding: '1rem', color: '#495057', fontWeight: '600' }}>Fecha Contratación</th>
                <th style={{ border: 'none', padding: '1rem', color: '#495057', fontWeight: '600' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {empleados.map((empleado, index) => (
                <tr 
                  key={empleado.id}
                  style={{ 
                    backgroundColor: index % 2 === 0 ? 'white' : '#f8f9fa',
                    borderBottom: '1px solid #f1f3f4'
                  }}
                >
                  <td style={{ border: 'none', padding: '1rem', color: '#6c757d' }}>{empleado.id}</td>
                  <td style={{ border: 'none', padding: '1rem' }}>
                    <strong style={{ color: '#495057' }}>{empleado.nombre}</strong>
                  </td>
                  <td style={{ border: 'none', padding: '1rem' }}>
                    <Badge 
                      style={{ 
                        backgroundColor: '#6f42c1', 
                        borderRadius: '15px',
                        padding: '4px 12px',
                        fontSize: '12px'
                      }}
                    >
                      {empleado.cargo}
                    </Badge>
                  </td>
                  <td style={{ border: 'none', padding: '1rem', color: '#6c757d' }}>{empleado.numeroIdentificacion}</td>
                  <td style={{ border: 'none', padding: '1rem', color: '#6c757d', fontWeight: '500' }}>{formatCurrency(empleado.salario)}</td>
                  <td style={{ border: 'none', padding: '1rem', color: '#6c757d' }}>{formatDate(empleado.fechaContratacion)}</td>
                  <td style={{ border: 'none', padding: '1rem' }}>
                    <div className="d-flex gap-1">
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        onClick={() => handleShowModal(empleado)}
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
                        onClick={() => handleDelete(empleado.id)}
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
            {editingEmpleado ? '✏️ Editar Empleado' : '➕ Nuevo Empleado'}
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
                    type="number"
                    name="numeroIdentificacion"
                    value={formData.numeroIdentificacion}
                    onChange={handleInputChange}
                    min="0"
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
              {editingEmpleado ? 'Actualizar' : 'Crear'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default EmpleadoList;
