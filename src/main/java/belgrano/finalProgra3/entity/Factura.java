package belgrano.finalProgra3.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Factura {

	@Id	
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;
	
	@OneToOne
	@JoinColumn(name = "reserva_id")
	@NotNull(message = "La reserva es obligatoria")
	private Reserva reserva;
	
	@NotNull(message = "El total es obligatorio")
	@Min(value = 0, message = "El total debe ser mayor o igual a 0")
	private Double total;
	
	private String detalles;
}


