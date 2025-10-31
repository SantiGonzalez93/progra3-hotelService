package belgrano.finalProgra3.entity;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
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
public class Empleado {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@NotBlank(message = "El nombre es obligatorio")
	private String nombre;
	
	@NotBlank(message = "El cargo es obligatorio")
	private String cargo;
	
	@NotNull(message = "El número de identificación es obligatorio")
	private Long numeroIdentificacion;
	
	@NotNull(message = "El salario es obligatorio")
	@Min(value = 0, message = "El salario debe ser mayor o igual a 0")
	private Long salario;
	
	@NotNull(message = "La fecha de contratación es obligatoria")
	private LocalDateTime fechaContratacion;

    @ManyToMany(mappedBy = "empleados")
    private Set<Servicio> servicios = new HashSet<>();

}
