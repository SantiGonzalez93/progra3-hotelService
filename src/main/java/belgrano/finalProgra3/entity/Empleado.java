package belgrano.finalProgra3.entity;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;

@Entity

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


	public Set<Servicio> getServicio() {
		return this.servicios;
	}

	public void setServicio(Set<Servicio> servicio) {
		this.servicios = servicio;
	}

	public Long getId() {
		return this.id;
	}

	public String getNombre() {
		return this.nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public String getCargo() {
		return this.cargo;
	}

	public void setCargo(String cargo) {
		this.cargo = cargo;
	}

	public Long getNumeroIdentificacion() {
		return this.numeroIdentificacion;
	}

	public void setNumeroIdentificacion(Long numeroIdentificacion) {
		this.numeroIdentificacion = numeroIdentificacion;
	}

	public Long getSalario() {
		return this.salario;
	}

	public void setSalario(Long salario) {
		this.salario = salario;
	}

	public LocalDateTime getFechaContratacion() {
		return this.fechaContratacion;
	}

	public void setFechaContratacion(LocalDateTime fechaContratacion) {
		this.fechaContratacion = fechaContratacion;
	}

}
