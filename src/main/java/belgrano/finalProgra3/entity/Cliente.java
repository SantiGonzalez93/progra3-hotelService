package belgrano.finalProgra3.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Cliente{
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;
	
	@NotBlank(message = "El nombre es obligatorio")
	private String nombre;
	
	@NotBlank(message = "La dirección es obligatoria")
	private String direccion;
	
	@NotBlank(message = "El teléfono es obligatorio")
	private String telefono;
	
	@NotBlank(message = "El correo electrónico es obligatorio")
	@Email(message = "El formato del correo electrónico no es válido")
	private String correoElectronico;
}
