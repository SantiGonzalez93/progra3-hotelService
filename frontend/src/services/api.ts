import axios from 'axios';
import { Cliente, Empleado, Habitacion, Servicio, Reserva, ReservaRequest, ApiResponse } from '../types';

const API_BASE_URL = 'http://localhost:7080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const clienteService = {
  getAll: async (): Promise<ApiResponse<Cliente>> => {
    const response = await api.get('/cliente');
    return response.data;
  },
  getById: async (id: number): Promise<ApiResponse<Cliente>> => {
    const response = await api.get(`/cliente/${id}`);
    return response.data;
  },
  create: async (cliente: Omit<Cliente, 'id'>): Promise<{estado: boolean, message: string[], data: Cliente}> => {
    const response = await api.post('/cliente', cliente);
    return response.data;
  },
  update: async (cliente: Cliente): Promise<ApiResponse<Cliente>> => {
    const response = await api.put('/cliente', cliente);
    return response.data;
  },
  delete: async (id: number): Promise<ApiResponse<any>> => {
    const response = await api.delete(`/cliente/${id}`);
    return response.data;
  },
};

export const empleadoService = {
  getAll: async (): Promise<ApiResponse<Empleado>> => {
    const response = await api.get('/empleado');
    return response.data;
  },
  getById: async (id: number): Promise<ApiResponse<Empleado>> => {
    const response = await api.get(`/empleado/${id}`);
    return response.data;
  },
  create: async (empleado: Omit<Empleado, 'id'>): Promise<ApiResponse<Empleado>> => {
    const response = await api.post('/empleado', empleado);
    return response.data;
  },
  update: async (empleado: Empleado): Promise<ApiResponse<Empleado>> => {
    const response = await api.put('/empleado', empleado);
    return response.data;
  },
  delete: async (id: number): Promise<ApiResponse<any>> => {
    const response = await api.delete(`/empleado/${id}`);
    return response.data;
  },
};

export const habitacionService = {
  getAll: async (): Promise<ApiResponse<Habitacion>> => {
    const response = await api.get('/habitacion');
    return response.data;
  },
  getById: async (id: number): Promise<ApiResponse<Habitacion>> => {
    const response = await api.get(`/habitacion/${id}`);
    return response.data;
  },
  create: async (habitacion: Omit<Habitacion, 'id'>): Promise<ApiResponse<Habitacion>> => {
    const response = await api.post('/habitacion', habitacion);
    return response.data;
  },
  update: async (habitacion: Habitacion): Promise<ApiResponse<Habitacion>> => {
    const response = await api.put('/habitacion', habitacion);
    return response.data;
  },
  delete: async (id: number): Promise<ApiResponse<any>> => {
    const response = await api.delete(`/habitacion/${id}`);
    return response.data;
  },
};

export const servicioService = {
  getAll: async (): Promise<ApiResponse<Servicio>> => {
    const response = await api.get('/servicio');
    return response.data;
  },
  getById: async (id: number): Promise<ApiResponse<Servicio>> => {
    const response = await api.get(`/servicio/${id}`);
    return response.data;
  },
  create: async (servicio: Omit<Servicio, 'id'>): Promise<ApiResponse<Servicio>> => {
    const response = await api.post('/servicio', servicio);
    return response.data;
  },
  update: async (servicio: Servicio): Promise<ApiResponse<Servicio>> => {
    const response = await api.put('/servicio', servicio);
    return response.data;
  },
  delete: async (id: number): Promise<ApiResponse<any>> => {
    const response = await api.delete(`/servicio/${id}`);
    return response.data;
  },
};

export const reservaService = {
  getAll: async (): Promise<ApiResponse<Reserva>> => {
    const response = await api.get('/reserva');
    return response.data;
  },
  getById: async (id: number): Promise<ApiResponse<Reserva>> => {
    const response = await api.get(`/reserva/${id}`);
    return response.data;
  },
  create: async (reserva: ReservaRequest): Promise<ApiResponse<Reserva>> => {
    const response = await api.post('/reserva', reserva);
    return response.data;
  },
  update: async (reserva: Reserva): Promise<ApiResponse<Reserva>> => {
    const response = await api.put('/reserva', reserva);
    return response.data;
  },
  delete: async (id: number): Promise<ApiResponse<any>> => {
    const response = await api.delete(`/reserva/${id}`);
    return response.data;
  },
};
