package belgrano.finalProgra3.service.jpa;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import belgrano.finalProgra3.entity.Habitacion;
import belgrano.finalProgra3.repository.HabitacionRepository;
import belgrano.finalProgra3.service.IHabitacionService;

@Service
public class HabitacionServiceImpl implements IHabitacionService {

	@Autowired
	private HabitacionRepository repositoryHabitacion;
	
	@Override
	public List<Habitacion> getAll() {
		return repositoryHabitacion.findAll();
	}

	@Override
	public Habitacion getById(Long id) {
	return repositoryHabitacion.findById(id).orElse(null);
	}

	@Override
	public Habitacion save(Habitacion habitacion) {
		return repositoryHabitacion.save(habitacion);
	}

	@Override
	public void delete(Long id) {
		repositoryHabitacion.deleteById(id);
		
	}

	@Override
	public boolean exists(Long id) {
		if (id != null) {
			return repositoryHabitacion.existsById(id);
		} else {
			return false;
		}
	}

	// implementacion del nuevo metodo
	@Override
	public List<Habitacion> findByDisponible(boolean disponible) {
		
	return repositoryHabitacion.findByDisponible(disponible);
		
	}
}
