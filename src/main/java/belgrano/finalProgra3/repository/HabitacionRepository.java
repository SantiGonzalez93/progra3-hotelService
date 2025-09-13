package belgrano.finalProgra3.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import belgrano.finalProgra3.entity.Habitacion;

public interface HabitacionRepository extends JpaRepository <Habitacion, Long> {

	List<Habitacion> findByDisponible(boolean disponible);
}
