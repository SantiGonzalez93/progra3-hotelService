package belgrano.finalProgra3.service;


import belgrano.finalProgra3.entity.Reserva;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface IReservaService {


    List<Reserva> getAll();
    Reserva getById(Long id);
    Reserva save(Reserva reserva);
    void deleteById(Long id);
    boolean exists(Long id);
}
