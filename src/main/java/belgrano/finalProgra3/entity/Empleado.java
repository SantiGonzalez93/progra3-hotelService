package belgrano.finalProgra3.entity;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
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
	private String nombre;
	private String cargo;
	private Long numeroIdentificacion;
	private Long salario;
	private LocalDateTime fechaContratacion;

    @ManyToMany(mappedBy = "empleados")
    private Set<Servicio> servicios = new HashSet<>();

}
