package belgrano.finalProgra3.service.jpa;


import belgrano.finalProgra3.entity.Reserva;
import belgrano.finalProgra3.repository.HabitacionRepository;
import belgrano.finalProgra3.repository.ReservaRepository;
import belgrano.finalProgra3.service.IReservaService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReservaServiceImpl implements IReservaService {

    @Autowired
    private ReservaRepository repository;
    @Autowired
    private HabitacionRepository habitacionRepository;


    @Override
    public List<Reserva> getAll() {
        return repository.findAll();
    }

    @Override
    public Reserva getById(Long id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public Reserva save(Reserva reserva) {
        if (reserva.getHabitacion() != null && reserva.getHabitacion().getId() != null) {
            if (!habitacionRepository.existsById(reserva.getHabitacion().getId())) {
                throw new EntityNotFoundException("La habitación con id: " +
                        reserva.getHabitacion().getId() + " no existe");
            }
        }
        return repository.save(reserva);
    }

    @Override
    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    @Override
    public boolean exists(Long id) {
        if (id != null) {
            return repository.existsById(id);
        } else {
            return false;
        }
    }
}
