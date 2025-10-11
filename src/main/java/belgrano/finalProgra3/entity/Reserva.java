package belgrano.finalProgra3.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.HashSet;
import java.util.Set;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Reserva {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@NotBlank(message = "La fecha de inicio es obligatoria")
	private String fechaInicio;
	
	@NotBlank(message = "La fecha de fin es obligatoria")
	private String fechaFin;
	
	private int numeroNoches;
	private double precioTotal;
	
	@NotNull(message = "La habitación es obligatoria")
	@ManyToOne
	@JoinColumn(name = "habitacion")
	private Habitacion habitacion;
	
	@NotNull(message = "El cliente es obligatorio")
	@ManyToOne
	@JoinColumn(name = "cliente_id")
	private Cliente cliente;
	
	@ManyToMany
	@JoinTable(
		name = "reserva_servicio",
		joinColumns = @JoinColumn(name = "reserva_id"),
		inverseJoinColumns = @JoinColumn(name = "servicio_id")
	)
	private Set<Servicio> servicios = new HashSet<>();
	
    @NotNull(message = "El estado es obligatorio")
    @Enumerated(EnumType.STRING)
    private EstadoReserva estado;


	public enum EstadoReserva {
		CONFIRMADA, PENDIENTE, CANCELADA;
	}


}
