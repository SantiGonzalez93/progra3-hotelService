package belgrano.finalProgra3.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import belgrano.finalProgra3.entity.Empleado;
import org.springframework.stereotype.Repository;

@Repository
public interface EmpleadoRepository extends JpaRepository <Empleado,Long>{

}
