import React, { useState } from 'react';
import { Container, Navbar, Nav, Card, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Cliente, Empleado, Habitacion, Servicio } from './types';
import { clienteService, empleadoService, habitacionService, servicioService } from './services/api';
import ClienteList from './components/ClienteList';
import EmpleadoList from './components/EmpleadoList';
import HabitacionList from './components/HabitacionList';
import ServicioList from './components/ServicioList';

type TabType = 'clientes' | 'empleados' | 'habitaciones' | 'servicios';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('clientes');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setError(null);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
          <p className="mt-3">Cargando datos...</p>
        </div>
      );
    }

    if (error) {
      return (
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
        </Alert>
      );
    }

    switch (activeTab) {
      case 'clientes':
        return <ClienteList onError={setError} onLoading={setLoading} />;
      case 'empleados':
        return <EmpleadoList onError={setError} onLoading={setLoading} />;
      case 'habitaciones':
        return <HabitacionList onError={setError} onLoading={setLoading} />;
      case 'servicios':
        return <ServicioList onError={setError} onLoading={setLoading} />;
      default:
        return <ClienteList onError={setError} onLoading={setLoading} />;
    }
  };

  return (
    <div className="App">
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#home">
            🏨 Sistema de Gestión de Hotel
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link 
                active={activeTab === 'clientes'} 
                onClick={() => handleTabChange('clientes')}
              >
                👥 Clientes
              </Nav.Link>
              <Nav.Link 
                active={activeTab === 'empleados'} 
                onClick={() => handleTabChange('empleados')}
              >
                👨‍💼 Empleados
              </Nav.Link>
              <Nav.Link 
                active={activeTab === 'habitaciones'} 
                onClick={() => handleTabChange('habitaciones')}
              >
                🏠 Habitaciones
              </Nav.Link>
              <Nav.Link 
                active={activeTab === 'servicios'} 
                onClick={() => handleTabChange('servicios')}
              >
                🛎️ Servicios
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Row>
          <Col>
            <Card>
              <Card.Header>
                <h4 className="mb-0">
                  {activeTab === 'clientes' && '👥 Gestión de Clientes'}
                  {activeTab === 'empleados' && '👨‍💼 Gestión de Empleados'}
                  {activeTab === 'habitaciones' && '🏠 Gestión de Habitaciones'}
                  {activeTab === 'servicios' && '🛎️ Gestión de Servicios'}
                </h4>
              </Card.Header>
              <Card.Body>
                {renderContent()}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default App;
