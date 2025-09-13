package belgrano.finalProgra3.service.jpa;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import belgrano.finalProgra3.entity.Empleado;
import belgrano.finalProgra3.service.IEmpleadoService;
import belgrano.finalProgra3.repository.EmpleadoRepository;


@Service
public class EmpleadoServiceImpl implements IEmpleadoService {
	@Autowired
	private EmpleadoRepository repo;

	@Override
	public List<Empleado> getAll() {
		return repo.findAll();
	}

	@Override
	public Empleado getById(Long id) {
		return repo.findById(id).orElse(null);
	}

	@Override
	public Empleado save(Empleado empleado) {
		return repo.save(empleado);
	}

	@Override
	public void delete(Long id) {
		repo.deleteById(id);
	}

	@Override 
	public boolean exists(Long id) {
		if (id != null) {
			return repo.existsById(id);
		}else{
			return false;
		}
	}

	}