package belgrano.finalProgra3.service;

import java.util.List;

import belgrano.finalProgra3.entity.Empleado;

public interface IEmpleadoService {

	public abstract List <Empleado> getAll();
	public abstract Empleado getById (Long id);
	public abstract Empleado save (Empleado empleado);
	public abstract void delete (Long id);
	public abstract boolean exists(Long id);
}
