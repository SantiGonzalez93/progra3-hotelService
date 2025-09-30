package belgrano.finalProgra3.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import belgrano.finalProgra3.entity.Cliente;
import org.springframework.stereotype.Repository;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente,Long> {

	

}
