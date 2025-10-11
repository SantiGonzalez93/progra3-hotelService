import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Cliente, Empleado, Habitacion, Servicio } from '../types';
import { clienteService, empleadoService, habitacionService, servicioService } from '../services/api';

interface AppContextType {
  // Datos
  clientes: Cliente[];
  empleados: Empleado[];
  habitaciones: Habitacion[];
  servicios: Servicio[];
  
  // Estados de carga
  loading: boolean;
  error: string | null;
  
  // Funciones para actualizar datos
  refreshClientes: () => Promise<void>;
  refreshEmpleados: () => Promise<void>;
  refreshHabitaciones: () => Promise<void>;
  refreshServicios: () => Promise<void>;
  refreshAll: () => Promise<void>;
  
  // Funciones para agregar datos
  addCliente: (cliente: Cliente) => void;
  addEmpleado: (empleado: Empleado) => void;
  addHabitacion: (habitacion: Habitacion) => void;
  addServicio: (servicio: Servicio) => void;
  
  // Funciones para actualizar datos
  updateCliente: (cliente: Cliente) => void;
  updateEmpleado: (empleado: Empleado) => void;
  updateHabitacion: (habitacion: Habitacion) => void;
  updateServicio: (servicio: Servicio) => void;
  
  // Funciones para eliminar datos
  removeCliente: (id: number) => void;
  removeEmpleado: (id: number) => void;
  removeHabitacion: (id: number) => void;
  removeServicio: (id: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // Estados de datos
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  
  // Estados de carga
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para cargar todos los datos
  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Cargando todos los datos...');
      
      const [clientesRes, empleadosRes, habitacionesRes, serviciosRes] = await Promise.all([
        clienteService.getAll(),
        empleadoService.getAll(),
        habitacionService.getAll(),
        servicioService.getAll()
      ]);
      
      if (clientesRes.estado) {
        setClientes(clientesRes.data);
        console.log(`✅ Clientes cargados: ${clientesRes.data.length}`);
      } else {
        throw new Error(`Error al cargar clientes: ${clientesRes.message?.join(', ')}`);
      }
      
      if (empleadosRes.estado) {
        setEmpleados(empleadosRes.data);
        console.log(`✅ Empleados cargados: ${empleadosRes.data.length}`);
      } else {
        throw new Error(`Error al cargar empleados: ${empleadosRes.message?.join(', ')}`);
      }
      
      if (habitacionesRes.estado) {
        setHabitaciones(habitacionesRes.data);
        console.log(`✅ Habitaciones cargadas: ${habitacionesRes.data.length}`);
      } else {
        throw new Error(`Error al cargar habitaciones: ${habitacionesRes.message?.join(', ')}`);
      }
      
      if (serviciosRes.estado) {
        setServicios(serviciosRes.data);
        console.log(`✅ Servicios cargados: ${serviciosRes.data.length}`);
      } else {
        throw new Error(`Error al cargar servicios: ${serviciosRes.message?.join(', ')}`);
      }
      
      console.log('🎉 Todos los datos cargados exitosamente');
      
    } catch (err: any) {
      console.error('❌ Error al cargar datos:', err);
      setError(err.message || 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    loadAllData();
  }, []);

  // Funciones para refrescar datos individuales
  const refreshClientes = async () => {
    try {
      const response = await clienteService.getAll();
      if (response.estado) {
        setClientes(response.data);
      }
    } catch (err) {
      console.error('Error al refrescar clientes:', err);
    }
  };

  const refreshEmpleados = async () => {
    try {
      const response = await empleadoService.getAll();
      if (response.estado) {
        setEmpleados(response.data);
      }
    } catch (err) {
      console.error('Error al refrescar empleados:', err);
    }
  };

  const refreshHabitaciones = async () => {
    try {
      const response = await habitacionService.getAll();
      if (response.estado) {
        setHabitaciones(response.data);
      }
    } catch (err) {
      console.error('Error al refrescar habitaciones:', err);
    }
  };

  const refreshServicios = async () => {
    try {
      const response = await servicioService.getAll();
      if (response.estado) {
        setServicios(response.data);
      }
    } catch (err) {
      console.error('Error al refrescar servicios:', err);
    }
  };

  const refreshAll = async () => {
    await loadAllData();
  };

  // Funciones para agregar datos
  const addCliente = (cliente: Cliente) => {
    setClientes(prev => [...prev, cliente]);
  };

  const addEmpleado = (empleado: Empleado) => {
    setEmpleados(prev => [...prev, empleado]);
  };

  const addHabitacion = (habitacion: Habitacion) => {
    setHabitaciones(prev => [...prev, habitacion]);
  };

  const addServicio = (servicio: Servicio) => {
    setServicios(prev => [...prev, servicio]);
  };

  // Funciones para actualizar datos
  const updateCliente = (cliente: Cliente) => {
    setClientes(prev => prev.map(c => c.id === cliente.id ? cliente : c));
  };

  const updateEmpleado = (empleado: Empleado) => {
    setEmpleados(prev => prev.map(e => e.id === empleado.id ? empleado : e));
  };

  const updateHabitacion = (habitacion: Habitacion) => {
    setHabitaciones(prev => prev.map(h => h.id === habitacion.id ? habitacion : h));
  };

  const updateServicio = (servicio: Servicio) => {
    setServicios(prev => prev.map(s => s.id === servicio.id ? servicio : s));
  };

  // Funciones para eliminar datos
  const removeCliente = (id: number) => {
    setClientes(prev => prev.filter(c => c.id !== id));
  };

  const removeEmpleado = (id: number) => {
    setEmpleados(prev => prev.filter(e => e.id !== id));
  };

  const removeHabitacion = (id: number) => {
    setHabitaciones(prev => prev.filter(h => h.id !== id));
  };

  const removeServicio = (id: number) => {
    setServicios(prev => prev.filter(s => s.id !== id));
  };

  const value: AppContextType = {
    // Datos
    clientes,
    empleados,
    habitaciones,
    servicios,
    
    // Estados
    loading,
    error,
    
    // Funciones de refresh
    refreshClientes,
    refreshEmpleados,
    refreshHabitaciones,
    refreshServicios,
    refreshAll,
    
    // Funciones de agregar
    addCliente,
    addEmpleado,
    addHabitacion,
    addServicio,
    
    // Funciones de actualizar
    updateCliente,
    updateEmpleado,
    updateHabitacion,
    updateServicio,
    
    // Funciones de eliminar
    removeCliente,
    removeEmpleado,
    removeHabitacion,
    removeServicio,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext debe ser usado dentro de un AppProvider');
  }
  return context;
};
