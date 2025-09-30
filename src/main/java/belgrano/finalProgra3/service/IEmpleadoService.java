package belgrano.finalProgra3.service;

import java.util.List;

import belgrano.finalProgra3.entity.Empleado;

public interface IEmpleadoService {

	List <Empleado> getAll();
    Empleado getById (Long id);
	Empleado save (Empleado empleado);
	void delete (Long id);
	boolean exists(Long id);
}
