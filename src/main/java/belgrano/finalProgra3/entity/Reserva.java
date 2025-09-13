package belgrano.finalProgra3.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Reserva {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	private String fechaInicio;
	private String fechaFin;
	// variable de tipo habitacion
	@ManyToOne
	@JoinColumn(name = "habitacion")
	private Habitacion habitacion;
	
	// variable de tipo cliente
	private String clienteId;
	private EstadoReserva estado;

	// Enumeración
	public enum EstadoReserva {
		CONFIRMADA, PENDIENTE, CANCELADA;
	}

	public long getId() {
		return id;
	}

	public String getFechaInicio() {
		return fechaInicio;
	}

	public void setFechaInicio(String fechaInicio) {
		this.fechaInicio = fechaInicio;
	}

	public String getFechaFin() {
		return fechaFin;
	}

	public void setFechaFin(String fechaFin) {
		this.fechaFin = fechaFin;
	}

	// Variable tipo habitacion
	public Habitacion getHabitacion() {
		return habitacion;
	}

	public void setHabitacion(Habitacion habitacion) {
		this.habitacion = habitacion;
	}

	// Variable tipo cliente
	public String getClienteId() {
		return clienteId;
	}

	public void setClienteId(String clienteId) {
		this.clienteId = clienteId;
	}

	// Enumeracion
	public EstadoReserva getEstado() {
		return estado;
	}

	public void setEstado(EstadoReserva estado) {
		this.estado = estado;
	}

}
