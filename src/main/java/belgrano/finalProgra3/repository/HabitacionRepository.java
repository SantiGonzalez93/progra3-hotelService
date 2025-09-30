package belgrano.finalProgra3.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import belgrano.finalProgra3.entity.Habitacion;
import org.springframework.stereotype.Repository;

@Repository
public interface HabitacionRepository extends JpaRepository <Habitacion, Long> {

	List<Habitacion> findByDisponible(boolean disponible);
}
