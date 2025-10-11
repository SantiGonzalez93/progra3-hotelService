import React, { useState } from 'react';
import { Container, Navbar, Nav, Card, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Cliente, Empleado, Habitacion, Servicio } from './types';
import { AppProvider, useAppContext } from './context/AppContext';
import ClienteList from './components/ClienteList';
import EmpleadoList from './components/EmpleadoList';
import HabitacionList from './components/HabitacionList';
import ServicioList from './components/ServicioList';
import ReservaWizard from './components/ReservaWizard';

type TabType = 'clientes' | 'empleados' | 'habitaciones' | 'servicios' | 'reservas';

// Componente interno que usa el contexto
const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('clientes');
  const { loading, error } = useAppContext();

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
          <p className="mt-3">Cargando datos iniciales...</p>
        </div>
      );
    }

    if (error) {
      return (
        <Alert variant="danger">
          <Alert.Heading>Error al cargar los datos</Alert.Heading>
          <p>{error}</p>
        </Alert>
      );
    }

    switch (activeTab) {
      case 'clientes':
        return <ClienteList />;
      case 'empleados':
        return <EmpleadoList />;
      case 'habitaciones':
        return <HabitacionList />;
      case 'servicios':
        return <ServicioList />;
      case 'reservas':
        return <ReservaWizard />;
      default:
        return <ClienteList />;
    }
  };

  return (
    <div className="App" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Header con gradiente */}
      <div 
        className="header-gradient"
        style={{
          background: 'linear-gradient(135deg, #6f42c1 0%, #20c997 100%)',
          padding: '1.5rem 0',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Container>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <div 
                className="logo-circle me-3"
                style={{
                  width: '50px',
                  height: '50px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#6f42c1'
                }}
              >
                🏨
              </div>
              <div>
                <h2 className="text-white mb-0" style={{ fontWeight: 'bold' }}>
                  Sistema de Gestión de Hotel
                </h2>
                <p className="text-white mb-0" style={{ fontSize: '14px', opacity: '0.9' }}>
                  Administración integral de reservas y servicios
                </p>
              </div>
            </div>
            <div className="d-flex gap-2">
              <Button 
                variant="light" 
                size="sm"
                style={{ borderRadius: '20px', padding: '8px 16px' }}
              >
                ADMIN
              </Button>
              <Button 
                variant="outline-light" 
                size="sm"
                style={{ borderRadius: '20px', padding: '8px 16px' }}
              >
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </Container>
      </div>

      {/* Navegación */}
      <div style={{ backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <Container>
          <Nav className="nav-tabs nav-justified" style={{ border: 'none' }}>
            <Nav.Item>
              <Nav.Link 
                className={`nav-link-custom ${activeTab === 'clientes' ? 'active' : ''}`}
                onClick={() => handleTabChange('clientes')}
                style={{
                  border: 'none',
                  borderRadius: '0',
                  padding: '1rem 1.5rem',
                  color: activeTab === 'clientes' ? '#6f42c1' : '#6c757d',
                  fontWeight: activeTab === 'clientes' ? 'bold' : 'normal',
                  backgroundColor: activeTab === 'clientes' ? 'transparent' : 'transparent',
                  borderBottom: activeTab === 'clientes' ? '3px solid #6f42c1' : '3px solid transparent'
                }}
              >
                👥 Clientes
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                className={`nav-link-custom ${activeTab === 'empleados' ? 'active' : ''}`}
                onClick={() => handleTabChange('empleados')}
                style={{
                  border: 'none',
                  borderRadius: '0',
                  padding: '1rem 1.5rem',
                  color: activeTab === 'empleados' ? '#6f42c1' : '#6c757d',
                  fontWeight: activeTab === 'empleados' ? 'bold' : 'normal',
                  backgroundColor: activeTab === 'empleados' ? 'transparent' : 'transparent',
                  borderBottom: activeTab === 'empleados' ? '3px solid #6f42c1' : '3px solid transparent'
                }}
              >
                👨‍💼 Empleados
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                className={`nav-link-custom ${activeTab === 'habitaciones' ? 'active' : ''}`}
                onClick={() => handleTabChange('habitaciones')}
                style={{
                  border: 'none',
                  borderRadius: '0',
                  padding: '1rem 1.5rem',
                  color: activeTab === 'habitaciones' ? '#6f42c1' : '#6c757d',
                  fontWeight: activeTab === 'habitaciones' ? 'bold' : 'normal',
                  backgroundColor: activeTab === 'habitaciones' ? 'transparent' : 'transparent',
                  borderBottom: activeTab === 'habitaciones' ? '3px solid #6f42c1' : '3px solid transparent'
                }}
              >
                🏠 Habitaciones
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                className={`nav-link-custom ${activeTab === 'servicios' ? 'active' : ''}`}
                onClick={() => handleTabChange('servicios')}
                style={{
                  border: 'none',
                  borderRadius: '0',
                  padding: '1rem 1.5rem',
                  color: activeTab === 'servicios' ? '#6f42c1' : '#6c757d',
                  fontWeight: activeTab === 'servicios' ? 'bold' : 'normal',
                  backgroundColor: activeTab === 'servicios' ? 'transparent' : 'transparent',
                  borderBottom: activeTab === 'servicios' ? '3px solid #6f42c1' : '3px solid transparent'
                }}
              >
                🛎️ Servicios
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                className={`nav-link-custom ${activeTab === 'reservas' ? 'active' : ''}`}
                onClick={() => handleTabChange('reservas')}
                style={{
                  border: 'none',
                  borderRadius: '0',
                  padding: '1rem 1.5rem',
                  color: activeTab === 'reservas' ? '#6f42c1' : '#6c757d',
                  fontWeight: activeTab === 'reservas' ? 'bold' : 'normal',
                  backgroundColor: activeTab === 'reservas' ? 'transparent' : 'transparent',
                  borderBottom: activeTab === 'reservas' ? '3px solid #6f42c1' : '3px solid transparent'
                }}
              >
                📋 Reservas
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Container>
      </div>

      {/* Contenido principal */}
      <Container className="mt-4">
        <Row>
          <Col>
            <div 
              className="main-card"
              style={{
                backgroundColor: 'white',
                borderRadius: '15px',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden'
              }}
            >
              <div 
                className="card-header-custom"
                style={{
                  background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                  padding: '1.5rem 2rem',
                  borderBottom: '1px solid #dee2e6'
                }}
              >
                <h4 className="mb-0" style={{ color: '#495057', fontWeight: 'bold' }}>
                  {activeTab === 'clientes' && '👥 Gestión de Clientes'}
                  {activeTab === 'empleados' && '👨‍💼 Gestión de Empleados'}
                  {activeTab === 'habitaciones' && '🏠 Gestión de Habitaciones'}
                  {activeTab === 'servicios' && '🛎️ Gestión de Servicios'}
                  {activeTab === 'reservas' && '📋 Sistema de Reservas'}
                </h4>
              </div>
              <div className="p-4">
                {renderContent()}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

// Componente principal que envuelve todo con el contexto
const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
