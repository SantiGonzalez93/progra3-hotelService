package belgrano.finalProgra3.repository;

import belgrano.finalProgra3.entity.Factura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FacturaRepository extends JpaRepository<Factura, Long> {
    Optional<Factura> findByReserva_Id(Long reservaId);
}

