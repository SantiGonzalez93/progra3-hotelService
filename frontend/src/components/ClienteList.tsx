import React, { useState } from 'react';
import { Table, Badge, Alert, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { Cliente } from '../types';
import { clienteService } from '../services/api';
import { useAppContext } from '../context/AppContext';

const ClienteList: React.FC = () => {
  const { clientes, addCliente, updateCliente, removeCliente } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    correoElectronico: ''
  });

  // Ya no necesitamos cargar clientes, vienen del contexto

  const handleShowModal = (cliente?: Cliente) => {
    if (cliente) {
      setEditingCliente(cliente);
      setFormData({
        nombre: cliente.nombre,
        direccion: cliente.direccion,
        telefono: cliente.telefono,
        correoElectronico: cliente.correoElectronico
      });
    } else {
      setEditingCliente(null);
      setFormData({
        nombre: '',
        direccion: '',
        telefono: '',
        correoElectronico: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCliente(null);
    setFormData({
      nombre: '',
      direccion: '',
      telefono: '',
      correoElectronico: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCliente) {
        const clienteActualizado = { ...formData, id: editingCliente.id };
        await clienteService.update(clienteActualizado);
        updateCliente(clienteActualizado);
      } else {
        const response = await clienteService.create(formData);
        if (response.estado) {
          addCliente(response.data);
        }
      }

      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar el cliente:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      try {
        await clienteService.delete(id);
        removeCliente(id);
      } catch (error) {
        console.error('Error al eliminar el cliente:', error);
      }
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h5 className="mb-1" style={{ color: '#495057', fontWeight: 'bold' }}>Lista de Clientes</h5>
          <p className="text-muted mb-0" style={{ fontSize: '14px' }}>Gestiona la información de tus clientes</p>
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
            ➕ Nuevo Cliente
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

      {clientes.length === 0 ? (
        <div 
          className="text-center py-5"
          style={{
            backgroundColor: 'white',
            borderRadius: '15px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            border: '2px dashed #dee2e6'
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '1rem' }}>👥</div>
          <h5 style={{ color: '#6c757d', marginBottom: '0.5rem' }}>No hay clientes registrados</h5>
          <p className="text-muted">Comienza agregando tu primer cliente</p>
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
                <th style={{ border: 'none', padding: '1rem', color: '#495057', fontWeight: '600' }}>Dirección</th>
                <th style={{ border: 'none', padding: '1rem', color: '#495057', fontWeight: '600' }}>Teléfono</th>
                <th style={{ border: 'none', padding: '1rem', color: '#495057', fontWeight: '600' }}>Email</th>
                <th style={{ border: 'none', padding: '1rem', color: '#495057', fontWeight: '600' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente, index) => (
                <tr 
                  key={cliente.id}
                  style={{ 
                    backgroundColor: index % 2 === 0 ? 'white' : '#f8f9fa',
                    borderBottom: '1px solid #f1f3f4'
                  }}
                >
                  <td style={{ border: 'none', padding: '1rem', color: '#6c757d' }}>{cliente.id}</td>
                  <td style={{ border: 'none', padding: '1rem' }}>
                    <strong style={{ color: '#495057' }}>{cliente.nombre}</strong>
                  </td>
                  <td style={{ border: 'none', padding: '1rem', color: '#6c757d' }}>{cliente.direccion}</td>
                  <td style={{ border: 'none', padding: '1rem', color: '#6c757d' }}>{cliente.telefono}</td>
                  <td style={{ border: 'none', padding: '1rem', color: '#6c757d' }}>{cliente.correoElectronico}</td>
                  <td style={{ border: 'none', padding: '1rem' }}>
                    <div className="d-flex gap-1">
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        onClick={() => handleShowModal(cliente)}
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
                        onClick={() => handleDelete(cliente.id)}
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
            {editingCliente ? '✏️ Editar Cliente' : '➕ Nuevo Cliente'}
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
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Dirección</Form.Label>
                  <Form.Control
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Correo Electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    name="correoElectronico"
                    value={formData.correoElectronico}
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
              {editingCliente ? 'Actualizar' : 'Crear'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default ClienteList;
