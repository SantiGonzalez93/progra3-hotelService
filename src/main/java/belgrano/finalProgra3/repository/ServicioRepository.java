package belgrano.finalProgra3.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import belgrano.finalProgra3.entity.Servicio;
import org.springframework.stereotype.Repository;

@Repository
public interface ServicioRepository extends JpaRepository <Servicio, Long> {

}
