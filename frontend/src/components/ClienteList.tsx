import React, { useState, useEffect } from 'react';
import { Table, Badge, Alert, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { Cliente } from '../types';
import { clienteService } from '../services/api';

interface ClienteListProps {
  onError: (error: string | null) => void;
  onLoading: (loading: boolean) => void;
}

const ClienteList: React.FC<ClienteListProps> = ({ onError, onLoading }) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    correoElectronico: ''
  });

  const loadClientes = async () => {
    try {
      onLoading(true);
      onError(null);
      const response = await clienteService.getAll();
      setClientes(response.data);
    } catch (error) {
      onError('Error al cargar los clientes. Asegúrate de que el backend esté ejecutándose en http://localhost:7080');
    } finally {
      onLoading(false);
    }
  };

  useEffect(() => {
    loadClientes();
  }, []);

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
      onLoading(true);
      onError(null);

      if (editingCliente) {
        await clienteService.update({ ...formData, id: editingCliente.id });
      } else {
        await clienteService.create(formData);
      }

      await loadClientes();
      handleCloseModal();
    } catch (error) {
      onError('Error al guardar el cliente');
    } finally {
      onLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      try {
        onLoading(true);
        onError(null);
        await clienteService.delete(id);
        await loadClientes();
      } catch (error) {
        onError('Error al eliminar el cliente');
      } finally {
        onLoading(false);
      }
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Lista de Clientes</h5>
        <div>
          <Button variant="success" onClick={() => handleShowModal()} className="me-2">
            ➕ Nuevo Cliente
          </Button>
          <Button variant="primary" onClick={loadClientes}>
            🔄 Actualizar
          </Button>
        </div>
      </div>

      {clientes.length === 0 ? (
        <Alert variant="info">
          No hay clientes registrados.
        </Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Dirección</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.id}>
                <td>{cliente.id}</td>
                <td>
                  <strong>{cliente.nombre}</strong>
                </td>
                <td>{cliente.direccion}</td>
                <td>{cliente.telefono}</td>
                <td>{cliente.correoElectronico}</td>
                <td>
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    onClick={() => handleShowModal(cliente)}
                    className="me-1"
                  >
                    ✏️
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    size="sm" 
                    onClick={() => handleDelete(cliente.id)}
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
            {editingCliente ? 'Editar Cliente' : 'Nuevo Cliente'}
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
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              {editingCliente ? 'Actualizar' : 'Crear'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default ClienteList;
