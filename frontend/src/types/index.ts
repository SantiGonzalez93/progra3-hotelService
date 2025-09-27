export interface Cliente {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  correoElectronico: string;
}

export interface Empleado {
  id: number;
  nombre: string;
  cargo: string;
  numeroIdentificacion: string;
  salario: number;
  fechaContratacion: string;
}

export interface Habitacion {
  id: number;
  numero: string;
  tipo: string;
  precioPorNoche: number;
  estado: string;
  disponible: boolean;
}

export interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  disponibilidad: boolean;
}

export interface Reserva {
  id: number;
  fechaInicio: string;
  fechaFin: string;
  habitacion: number;
  clienteId: string;
  estado: 'CONFIRMADA' | 'PENDIENTE' | 'CANCELADA';
}

export interface Factura {
  id: number;
  reservaId: number;
  total: number;
  detalles: string;
}

export interface ApiResponse<T> {
  estado: boolean;
  message: string[];
  data: T[];
}
