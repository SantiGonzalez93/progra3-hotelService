package belgrano.finalProgra3.service.jpa;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import belgrano.finalProgra3.entity.Habitacion;
import belgrano.finalProgra3.repository.HabitacionRepository;
import belgrano.finalProgra3.repository.ReservaRepository;
import belgrano.finalProgra3.service.IHabitacionService;

@Service
public class HabitacionServiceImpl implements IHabitacionService {

	@Autowired
	private HabitacionRepository repositoryHabitacion;
	
	@Autowired
	private ReservaRepository reservaRepository;
	
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
	@Transactional
	public void delete(Long id) {
		// Verificar si hay reservas asociadas
		List<belgrano.finalProgra3.entity.Reserva> reservas = reservaRepository.findByHabitacionId(id);
		if (reservas != null && !reservas.isEmpty()) {
			throw new RuntimeException("No se puede eliminar la habitación porque tiene " + reservas.size() + " reserva(s) asociada(s)");
		}
		repositoryHabitacion.deleteById(id);
	}

	@Override
	@Transactional
	public void deleteById(Long id) {
		// Verificar si hay reservas asociadas
		List<belgrano.finalProgra3.entity.Reserva> reservas = reservaRepository.findByHabitacionId(id);
		if (reservas != null && !reservas.isEmpty()) {
			throw new RuntimeException("No se puede eliminar la habitación porque tiene " + reservas.size() + " reserva(s) asociada(s)");
		}
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
