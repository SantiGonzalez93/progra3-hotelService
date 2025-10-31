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
  numeroIdentificacion: number;
  salario: number;
  fechaContratacion: string;
}

export interface Habitacion {
  id: number;
  numero: number;
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
  numeroNoches: number;
  precioTotal: number;
  habitacion: Habitacion;
  cliente: Cliente;
  servicios: Servicio[];
  estado: 'CONFIRMADA' | 'PENDIENTE' | 'CANCELADA';
}

export interface ReservaRequest {
  fechaInicio: string;
  fechaFin: string;
  habitacionId: number;
  clienteId: number;
  serviciosIds: number[];
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
