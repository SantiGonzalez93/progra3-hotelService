package belgrano.finalProgra3.entity;

import java.util.Set;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Habitacion {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@NotNull(message = "El número de habitación es obligatorio")
	@Min(value = 1, message = "El número de habitación debe ser mayor a 0")
	private int numero;
	
	@NotBlank(message = "El tipo de habitación es obligatorio")
	private String tipo;
	
	@NotNull(message = "El precio por noche es obligatorio")
	@Min(value = 0, message = "El precio por noche debe ser mayor o igual a 0")
	private double precioPorNoche;
	
	@NotBlank(message = "El estado es obligatorio")
	private String estado;
	
	@OneToMany(mappedBy="habitacion") 
	private Set<Reserva> reservas;

	@NotNull(message = "La disponibilidad es obligatoria")
	private boolean disponible;


}
