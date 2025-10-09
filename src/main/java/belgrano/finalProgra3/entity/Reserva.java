package belgrano.finalProgra3.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Reserva {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String fechaInicio;
	private String fechaFin;
	@ManyToOne
	@JoinColumn(name = "habitacion")
	private Habitacion habitacion;
	private String clienteId;
    @Enumerated(EnumType.STRING)
    private EstadoReserva estado;


	public enum EstadoReserva {
		CONFIRMADA, PENDIENTE, CANCELADA;
	}


}
