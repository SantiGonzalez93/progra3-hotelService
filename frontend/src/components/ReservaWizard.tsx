import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Form, Alert, Badge, Modal, Spinner, Table } from 'react-bootstrap';
import { Cliente, Habitacion, Servicio, ReservaRequest, Reserva } from '../types';
import { habitacionService, reservaService, clienteService } from '../services/api';
import { useAppContext } from '../context/AppContext';

const ReservaWizard: React.FC = () => {
  const { clientes, servicios, reservas, addCliente, addReserva, updateReserva, removeReserva, refreshReservas } = useAppContext();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingReserva, setEditingReserva] = useState<Reserva | null>(null);
  
  // Datos del formulario
  const [formData, setFormData] = useState<ReservaRequest>({
    fechaInicio: '',
    fechaFin: '',
    habitacionId: 0,
    clienteId: 0,
    serviciosIds: []
  });

  // Datos de la aplicación
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>([]);
  const [habitacionesDisponibles, setHabitacionesDisponibles] = useState<Habitacion[]>([]);
  const [serviciosDisponibles, setServiciosDisponibles] = useState<Servicio[]>([]);

  // Estados de la reserva
  const [habitacionSeleccionada, setHabitacionSeleccionada] = useState<Habitacion | null>(null);
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState<Servicio[]>([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);
  const [precioTotal, setPrecioTotal] = useState(0);
  const [numeroNoches, setNumeroNoches] = useState(0);

  // Estados para crear nuevo cliente
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [newClientData, setNewClientData] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    correoElectronico: ''
  });
  const [creatingClient, setCreatingClient] = useState(false);

  const steps = [
    { number: 1, title: 'Fechas', icon: '📅' },
    { number: 2, title: 'Habitación', icon: '🏠' },
    { number: 3, title: 'Servicios', icon: '🛎️' },
    { number: 4, title: 'Cliente', icon: '👤' },
    { number: 5, title: 'Confirmación', icon: '✅' }
  ];

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (formData.fechaInicio && formData.fechaFin) {
      calculateNights();
      loadHabitacionesDisponibles();
    }
  }, [formData.fechaInicio, formData.fechaFin]);

  useEffect(() => {
    calculateTotalPrice();
  }, [habitacionSeleccionada, serviciosSeleccionados, numeroNoches]);

  const loadInitialData = async () => {
    try {
      // Los clientes y servicios ya vienen del contexto
      setServiciosDisponibles(servicios.filter(s => s.disponibilidad));
    } catch (error) {
      console.error('Error al cargar los datos iniciales:', error);
    }
  };

  const loadHabitacionesDisponibles = async () => {
    try {
      const response = await habitacionService.getAll();
      const disponibles = response.data.filter(h => h.disponible);
      setHabitacionesDisponibles(disponibles);
    } catch (error) {
      console.error('Error al cargar habitaciones disponibles:', error);
    }
  };

  const calculateNights = () => {
    if (formData.fechaInicio && formData.fechaFin) {
      const inicio = new Date(formData.fechaInicio);
      const fin = new Date(formData.fechaFin);
      const diffTime = Math.abs(fin.getTime() - inicio.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setNumeroNoches(diffDays);
    }
  };

  const calculateTotalPrice = () => {
    let total = 0;
    
    if (habitacionSeleccionada && numeroNoches > 0) {
      total += habitacionSeleccionada.precioPorNoche * numeroNoches;
    }
    
    serviciosSeleccionados.forEach(servicio => {
      total += servicio.precio * numeroNoches;
    });
    
    setPrecioTotal(total);
  };

  const handleDateChange = (field: 'fechaInicio' | 'fechaFin', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleHabitacionSelect = (habitacion: Habitacion) => {
    setHabitacionSeleccionada(habitacion);
    setFormData(prev => ({ ...prev, habitacionId: habitacion.id }));
  };

  const handleServicioToggle = (servicio: Servicio) => {
    setServiciosSeleccionados(prev => {
      const isSelected = prev.some(s => s.id === servicio.id);
      if (isSelected) {
        return prev.filter(s => s.id !== servicio.id);
      } else {
        return [...prev, servicio];
      }
    });
  };

  const handleClienteSelect = (cliente: Cliente) => {
    setClienteSeleccionado(cliente);
    setFormData(prev => ({ ...prev, clienteId: cliente.id }));
  };

  const handleNewClientSubmit = async () => {
    try {
      setCreatingClient(true);
      // Validar campos requeridos
      if (!newClientData.nombre || !newClientData.direccion || !newClientData.telefono || !newClientData.correoElectronico) {
        console.error('Todos los campos son obligatorios');
        return;
      }

      console.log('Creando cliente con datos:', newClientData);

      // Crear el nuevo cliente
      const response = await clienteService.create(newClientData);
      
      console.log('Respuesta del servidor:', response);
      
      if (response.estado) {
        // El backend devuelve un objeto cliente individual, no un array
        const nuevoCliente = response.data;
        
        // Agregar el cliente al contexto global
        addCliente(nuevoCliente);
        
        // Seleccionar automáticamente el nuevo cliente
        setClienteSeleccionado(nuevoCliente);
        setFormData(prev => ({ ...prev, clienteId: nuevoCliente.id }));
        
        // Cerrar el modal y limpiar el formulario
        setShowNewClientModal(false);
        setNewClientData({
          nombre: '',
          direccion: '',
          telefono: '',
          correoElectronico: ''
        });
        
        // Avanzar al siguiente paso automáticamente
        nextStep();
      } else {
        console.error(`Error al crear el cliente: ${response.message?.join(', ') || 'Error desconocido'}`);
      }
    } catch (error: any) {
      console.error('Error completo:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
    } finally {
      setCreatingClient(false);
    }
  };

  const handleNewClientInputChange = (field: string, value: string) => {
    setNewClientData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitReserva = async () => {
    try {
      setLoading(true);
      
      const reservaData = {
        ...formData,
        serviciosIds: serviciosSeleccionados.map(s => s.id)
      };
      
      const response = await reservaService.create(reservaData);
      
      if (response.estado && response.data) {
        // Agregar la reserva al contexto
        addReserva(response.data);
        
        // Reset form
        setFormData({
          fechaInicio: '',
          fechaFin: '',
          habitacionId: 0,
          clienteId: 0,
          serviciosIds: []
        });
        setHabitacionSeleccionada(null);
        setServiciosSeleccionados([]);
        setClienteSeleccionado(null);
        setCurrentStep(1);
        
        alert('¡Reserva creada exitosamente!');
      } else {
        alert('Error al crear la reserva: ' + (response.message?.join(', ') || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error al crear la reserva:', error);
      alert('Error al crear la reserva');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReserva = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta reserva?')) {
      try {
        const response = await reservaService.delete(id);
        if (response.estado) {
          removeReserva(id);
          alert('Reserva eliminada exitosamente');
        } else {
          alert('Error al eliminar la reserva: ' + (response.message?.join(', ') || 'Error desconocido'));
        }
      } catch (error: any) {
        console.error('Error al eliminar la reserva:', error);
        const errorMessage = error.response?.data?.message?.join(', ') || error.message || 'Error desconocido';
        alert('Error al eliminar la reserva: ' + errorMessage);
      }
    }
  };

  const handleEditReserva = (reserva: Reserva) => {
    setEditingReserva(reserva);
    // Pre-llenar el formulario con los datos de la reserva
    const fechaInicio = reserva.fechaInicio.includes('T') ? reserva.fechaInicio.split('T')[0] : reserva.fechaInicio.split(' ')[0];
    const fechaFin = reserva.fechaFin.includes('T') ? reserva.fechaFin.split('T')[0] : reserva.fechaFin.split(' ')[0];
    
    setFormData({
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
      habitacionId: reserva.habitacion.id,
      clienteId: reserva.cliente.id,
      serviciosIds: reserva.servicios.map(s => s.id)
    });
    setHabitacionSeleccionada(reserva.habitacion);
    setServiciosSeleccionados(reserva.servicios);
    setClienteSeleccionado(reserva.cliente);
    setCurrentStep(1); // Empezar desde el principio para poder editar todo
    // Scroll al inicio del wizard
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateReserva = async () => {
    if (!editingReserva) return;
    
    try {
      setLoading(true);
      
      const reservaActualizada: Reserva = {
        ...editingReserva,
        fechaInicio: formData.fechaInicio,
        fechaFin: formData.fechaFin,
        habitacion: habitacionSeleccionada!,
        cliente: clienteSeleccionado!,
        servicios: serviciosSeleccionados,
        numeroNoches: numeroNoches,
        precioTotal: precioTotal
      };
      
      const response = await reservaService.update(reservaActualizada);
      
      if (response.estado && response.data) {
        updateReserva(response.data);
        setEditingReserva(null);
        // Reset form
        setFormData({
          fechaInicio: '',
          fechaFin: '',
          habitacionId: 0,
          clienteId: 0,
          serviciosIds: []
        });
        setHabitacionSeleccionada(null);
        setServiciosSeleccionados([]);
        setClienteSeleccionado(null);
        setCurrentStep(1);
        alert('Reserva actualizada exitosamente');
        // Scroll a la lista de reservas
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      } else {
        alert('Error al actualizar la reserva: ' + (response.message?.join(', ') || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error al actualizar la reserva:', error);
      alert('Error al actualizar la reserva');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR');
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'CONFIRMADA':
        return <Badge bg="success">Confirmada</Badge>;
      case 'PENDIENTE':
        return <Badge bg="warning">Pendiente</Badge>;
      case 'CANCELADA':
        return <Badge bg="danger">Cancelada</Badge>;
      default:
        return <Badge bg="secondary">{estado}</Badge>;
    }
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="text-center">
            <h5 className="mb-4">📅 Selecciona las fechas de tu estadía</h5>
            <Row className="justify-content-center">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha de Check-in</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.fechaInicio}
                    onChange={(e) => handleDateChange('fechaInicio', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha de Check-out</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.fechaFin}
                    onChange={(e) => handleDateChange('fechaFin', e.target.value)}
                    min={formData.fechaInicio || new Date().toISOString().split('T')[0]}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            {numeroNoches > 0 && (
              <Alert variant="info" className="mt-3">
                <strong>Estadía:</strong> {numeroNoches} {numeroNoches === 1 ? 'noche' : 'noches'}
              </Alert>
            )}
          </div>
        );

      case 2:
        return (
          <div>
            <h5 className="mb-4">🏠 Selecciona tu habitación</h5>
            {habitacionesDisponibles.length === 0 ? (
              <Alert variant="warning">
                No hay habitaciones disponibles para las fechas seleccionadas
              </Alert>
            ) : (
              <Row>
                {habitacionesDisponibles.map((habitacion) => (
                  <Col md={6} lg={4} key={habitacion.id} className="mb-3">
                    <Card 
                      className={`h-100 ${habitacionSeleccionada?.id === habitacion.id ? 'border-primary' : ''}`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleHabitacionSelect(habitacion)}
                    >
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="mb-0">Habitación #{habitacion.numero}</h6>
                          <Badge bg="success">Disponible</Badge>
                        </div>
                        <p className="text-muted mb-2">{habitacion.tipo}</p>
                        <p className="h5 text-primary mb-0">
                          {formatCurrency(habitacion.precioPorNoche)}/noche
                        </p>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </div>
        );

      case 3:
        return (
          <div>
            <h5 className="mb-4">🛎️ Selecciona servicios adicionales (opcional)</h5>
            <Row>
              {serviciosDisponibles.map((servicio) => (
                <Col md={6} lg={4} key={servicio.id} className="mb-3">
                  <Card 
                    className={`h-100 ${serviciosSeleccionados.some(s => s.id === servicio.id) ? 'border-primary' : ''}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleServicioToggle(servicio)}
                  >
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="mb-0">{servicio.nombre}</h6>
                        {serviciosSeleccionados.some(s => s.id === servicio.id) && (
                          <Badge bg="primary">Seleccionado</Badge>
                        )}
                      </div>
                      <p className="text-muted small mb-2">{servicio.descripcion}</p>
                      <p className="h6 text-primary mb-0">
                        {formatCurrency(servicio.precio)}/noche
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        );

      case 4:
        return (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="mb-0">👤 Selecciona el cliente</h5>
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={() => setShowNewClientModal(true)}
                style={{ borderRadius: '20px' }}
              >
                ➕ Agregar Nuevo Cliente
              </Button>
            </div>
            
            {clientes.length === 0 ? (
              <Alert variant="info" className="text-center">
                <h6>No hay clientes registrados</h6>
                <p className="mb-3">Haz clic en "Agregar Nuevo Cliente" para crear uno</p>
                <Button 
                  variant="primary"
                  onClick={() => setShowNewClientModal(true)}
                  style={{ borderRadius: '20px' }}
                >
                  ➕ Crear Primer Cliente
                </Button>
              </Alert>
            ) : (
              <Row>
                {clientes.map((cliente) => (
                  <Col md={6} lg={4} key={cliente.id} className="mb-3">
                    <Card 
                      className={`h-100 ${clienteSeleccionado?.id === cliente.id ? 'border-primary' : ''}`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleClienteSelect(cliente)}
                    >
                      <Card.Body>
                        <h6 className="mb-2">{cliente.nombre}</h6>
                        <p className="text-muted small mb-1">{cliente.correoElectronico}</p>
                        <p className="text-muted small mb-0">{cliente.telefono}</p>
                        {clienteSeleccionado?.id === cliente.id && (
                          <Badge bg="primary" className="mt-2">Seleccionado</Badge>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </div>
        );

      case 5:
        return (
          <div>
            <h5 className="mb-4">✅ Confirma tu reserva</h5>
            <Card className="mb-4">
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <h6>📅 Fechas</h6>
                    <p className="mb-1"><strong>Check-in:</strong> {formData.fechaInicio}</p>
                    <p className="mb-1"><strong>Check-out:</strong> {formData.fechaFin}</p>
                    <p className="mb-0"><strong>Noches:</strong> {numeroNoches}</p>
                  </Col>
                  <Col md={6}>
                    <h6>🏠 Habitación</h6>
                    <p className="mb-1"><strong>Número:</strong> #{habitacionSeleccionada?.numero}</p>
                    <p className="mb-1"><strong>Tipo:</strong> {habitacionSeleccionada?.tipo}</p>
                    <p className="mb-0"><strong>Precio/noche:</strong> {formatCurrency(habitacionSeleccionada?.precioPorNoche || 0)}</p>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col md={6}>
                    <h6>👤 Cliente</h6>
                    <p className="mb-1"><strong>Nombre:</strong> {clienteSeleccionado?.nombre}</p>
                    <p className="mb-1"><strong>Email:</strong> {clienteSeleccionado?.correoElectronico}</p>
                    <p className="mb-0"><strong>Teléfono:</strong> {clienteSeleccionado?.telefono}</p>
                  </Col>
                  <Col md={6}>
                    <h6>🛎️ Servicios</h6>
                    {serviciosSeleccionados.length === 0 ? (
                      <p className="text-muted">Sin servicios adicionales</p>
                    ) : (
                      <ul className="list-unstyled mb-0">
                        {serviciosSeleccionados.map(servicio => (
                          <li key={servicio.id} className="mb-1">
                            {servicio.nombre} - {formatCurrency(servicio.precio)}/noche
                          </li>
                        ))}
                      </ul>
                    )}
                  </Col>
                </Row>
                <hr />
                <div className="text-center">
                  <h4 className="text-primary">
                    Total: {formatCurrency(precioTotal)}
                  </h4>
                </div>
              </Card.Body>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      {/* Progress Steps */}
      {editingReserva && (
        <Alert variant="info" className="mb-4">
          <strong>✏️ Editando Reserva #{editingReserva.id}</strong> - Modifica los datos y confirma los cambios
        </Alert>
      )}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center">
          {steps.map((step, index) => (
            <div key={step.number} className="d-flex flex-column align-items-center">
              <div 
                className={`rounded-circle d-flex align-items-center justify-content-center mb-2 ${
                  currentStep >= step.number ? 'bg-primary text-white' : 'bg-light text-muted'
                }`}
                style={{ width: '50px', height: '50px' }}
              >
                <span style={{ fontSize: '20px' }}>{step.icon}</span>
              </div>
              <small className={`text-center ${currentStep >= step.number ? 'text-primary fw-bold' : 'text-muted'}`}>
                {step.title}
              </small>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card className="mb-4">
        <Card.Body>
          {renderStepContent()}
        </Card.Body>
      </Card>

      {/* Navigation Buttons */}
      <div className="d-flex justify-content-between">
        <Button 
          variant="outline-secondary" 
          onClick={prevStep}
          disabled={currentStep === 1}
          style={{ borderRadius: '25px', padding: '8px 20px' }}
        >
          ← Anterior
        </Button>
        
        {currentStep < 5 ? (
          <Button 
            variant="primary" 
            onClick={nextStep}
            disabled={
              (currentStep === 1 && (!formData.fechaInicio || !formData.fechaFin)) ||
              (currentStep === 2 && !habitacionSeleccionada) ||
              (currentStep === 4 && !clienteSeleccionado)
            }
            style={{ 
              borderRadius: '25px', 
              padding: '8px 20px',
              background: 'linear-gradient(135deg, #6f42c1 0%, #20c997 100%)',
              border: 'none'
            }}
          >
            Siguiente →
          </Button>
        ) : (
          <div className="d-flex gap-2">
            {editingReserva && (
              <Button 
                variant="outline-secondary" 
                onClick={() => {
                  setEditingReserva(null);
                  setFormData({
                    fechaInicio: '',
                    fechaFin: '',
                    habitacionId: 0,
                    clienteId: 0,
                    serviciosIds: []
                  });
                  setHabitacionSeleccionada(null);
                  setServiciosSeleccionados([]);
                  setClienteSeleccionado(null);
                  setCurrentStep(1);
                }}
                style={{ borderRadius: '25px', padding: '8px 20px' }}
              >
                Cancelar Edición
              </Button>
            )}
            <Button 
              variant={editingReserva ? "warning" : "success"}
              onClick={editingReserva ? handleUpdateReserva : handleSubmitReserva}
              disabled={loading}
              style={{ borderRadius: '25px', padding: '8px 20px' }}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Procesando...
                </>
              ) : editingReserva ? (
                '✏️ Actualizar Reserva'
              ) : (
                '✅ Confirmar Reserva'
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Lista de Reservas */}
      <div className="mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h5 className="mb-1" style={{ color: '#495057', fontWeight: 'bold' }}>Lista de Reservas</h5>
            <p className="text-muted mb-0" style={{ fontSize: '14px' }}>Gestiona todas las reservas realizadas</p>
          </div>
          <Button 
            variant="outline-primary" 
            onClick={refreshReservas}
            style={{ 
              borderRadius: '25px', 
              padding: '8px 20px',
              fontWeight: '500'
            }}
          >
            🔄 Actualizar
          </Button>
        </div>

        {reservas.length === 0 ? (
          <div 
            className="text-center py-5"
            style={{
              backgroundColor: 'white',
              borderRadius: '15px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              border: '2px dashed #dee2e6'
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '1rem' }}>📋</div>
            <h5 style={{ color: '#6c757d', marginBottom: '0.5rem' }}>No hay reservas registradas</h5>
            <p className="text-muted">Las reservas creadas aparecerán aquí</p>
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
                  <th style={{ border: 'none', padding: '1rem', color: '#495057', fontWeight: '600' }}>Cliente</th>
                  <th style={{ border: 'none', padding: '1rem', color: '#495057', fontWeight: '600' }}>Habitación</th>
                  <th style={{ border: 'none', padding: '1rem', color: '#495057', fontWeight: '600' }}>Fechas</th>
                  <th style={{ border: 'none', padding: '1rem', color: '#495057', fontWeight: '600' }}>Noches</th>
                  <th style={{ border: 'none', padding: '1rem', color: '#495057', fontWeight: '600' }}>Servicios</th>
                  <th style={{ border: 'none', padding: '1rem', color: '#495057', fontWeight: '600' }}>Total</th>
                  <th style={{ border: 'none', padding: '1rem', color: '#495057', fontWeight: '600' }}>Estado</th>
                  <th style={{ border: 'none', padding: '1rem', color: '#495057', fontWeight: '600' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {reservas.map((reserva, index) => (
                  <tr 
                    key={reserva.id}
                    style={{ 
                      backgroundColor: index % 2 === 0 ? 'white' : '#f8f9fa',
                      borderBottom: '1px solid #f1f3f4'
                    }}
                  >
                    <td style={{ border: 'none', padding: '1rem', color: '#6c757d' }}>{reserva.id}</td>
                    <td style={{ border: 'none', padding: '1rem' }}>
                      <strong style={{ color: '#495057' }}>{reserva.cliente.nombre}</strong>
                      <br />
                      <small className="text-muted">{reserva.cliente.correoElectronico}</small>
                    </td>
                    <td style={{ border: 'none', padding: '1rem', color: '#6c757d' }}>
                      <strong>#{reserva.habitacion.numero}</strong> - {reserva.habitacion.tipo}
                    </td>
                    <td style={{ border: 'none', padding: '1rem', color: '#6c757d' }}>
                      <div>{formatDate(reserva.fechaInicio)}</div>
                      <div className="text-muted small">hasta {formatDate(reserva.fechaFin)}</div>
                    </td>
                    <td style={{ border: 'none', padding: '1rem', color: '#6c757d' }}>{reserva.numeroNoches}</td>
                    <td style={{ border: 'none', padding: '1rem', color: '#6c757d' }}>
                      {reserva.servicios.length === 0 ? (
                        <span className="text-muted">Sin servicios</span>
                      ) : (
                        <div>
                          {reserva.servicios.map((s, i) => (
                            <Badge key={s.id} bg="info" className="me-1">
                              {s.nombre}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </td>
                    <td style={{ border: 'none', padding: '1rem', color: '#6c757d', fontWeight: '500' }}>
                      {formatCurrency(reserva.precioTotal)}
                    </td>
                    <td style={{ border: 'none', padding: '1rem' }}>
                      {getEstadoBadge(reserva.estado)}
                    </td>
                    <td style={{ border: 'none', padding: '1rem' }}>
                      <div className="d-flex gap-1">
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          onClick={() => handleEditReserva(reserva)}
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
                          onClick={() => handleDeleteReserva(reserva.id)}
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
      </div>

      {/* Modal para crear nuevo cliente */}
      <Modal show={showNewClientModal} onHide={() => setShowNewClientModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>➕ Agregar Nuevo Cliente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre Completo *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ej: Juan Pérez García"
                    value={newClientData.nombre}
                    onChange={(e) => handleNewClientInputChange('nombre', e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Teléfono *</Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="Ej: 011-4555-0101"
                    value={newClientData.telefono}
                    onChange={(e) => handleNewClientInputChange('telefono', e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Dirección *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ej: Av. Libertador 1234, CABA"
                    value={newClientData.direccion}
                    onChange={(e) => handleNewClientInputChange('direccion', e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Correo Electrónico *</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Ej: juan.perez@email.com"
                    value={newClientData.correoElectronico}
                    onChange={(e) => handleNewClientInputChange('correoElectronico', e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="outline-secondary" 
            onClick={() => setShowNewClientModal(false)}
            style={{ borderRadius: '20px' }}
          >
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            onClick={handleNewClientSubmit}
            disabled={creatingClient || !newClientData.nombre || !newClientData.direccion || !newClientData.telefono || !newClientData.correoElectronico}
            style={{ 
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #6f42c1 0%, #20c997 100%)',
              border: 'none'
            }}
          >
            {creatingClient ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Creando...
              </>
            ) : (
              '✅ Crear Cliente'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ReservaWizard;

