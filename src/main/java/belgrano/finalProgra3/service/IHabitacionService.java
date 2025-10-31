package belgrano.finalProgra3.service;

import java.util.List;

import org.springframework.stereotype.Service;

import belgrano.finalProgra3.entity.Habitacion;

@Service
public interface IHabitacionService {
	
  List <Habitacion> getAll();
  Habitacion getById(Long id);
  Habitacion save(Habitacion habitacion);
  void delete(Long id);
  void deleteById(Long id);
  boolean exists(Long id);
  List<Habitacion> findByDisponible(boolean disponible);
	
}
