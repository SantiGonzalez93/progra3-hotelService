package belgrano.finalProgra3.entity;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinTable;
import jakarta.persistence.JoinColumn;
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
public class Servicio {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@NotBlank(message = "El nombre es obligatorio")
	private String nombre;
	
	private String descripcion;
	
	@NotNull(message = "El precio es obligatorio")
	@Min(value = 0, message = "El precio debe ser mayor o igual a 0")
	private double precio;
	
	@NotNull(message = "La disponibilidad es obligatoria")
	private boolean disponibilidad;

	@ManyToMany
	@JoinTable(name = "servicio_empleado", joinColumns = @JoinColumn(name = "servicio_id"), inverseJoinColumns = @JoinColumn(name = "empleado_id"))
	private Set<Empleado> empleados = new HashSet<>();

}
