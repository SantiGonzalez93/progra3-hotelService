package belgrano.finalProgra3.service.jpa;

import belgrano.finalProgra3.dto.ReservaRequestDto;
import belgrano.finalProgra3.entity.Cliente;
import belgrano.finalProgra3.entity.Factura;
import belgrano.finalProgra3.entity.Habitacion;
import belgrano.finalProgra3.entity.Reserva;
import belgrano.finalProgra3.entity.Servicio;
import belgrano.finalProgra3.repository.ClienteRepository;
import belgrano.finalProgra3.repository.FacturaRepository;
import belgrano.finalProgra3.repository.HabitacionRepository;
import belgrano.finalProgra3.repository.ReservaRepository;
import belgrano.finalProgra3.repository.ServicioRepository;
import belgrano.finalProgra3.service.IReservaService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class ReservaServiceImpl implements IReservaService {

    @Autowired
    private ReservaRepository repository;
    @Autowired
    private HabitacionRepository habitacionRepository;
    @Autowired
    private ClienteRepository clienteRepository;
    @Autowired
    private ServicioRepository servicioRepository;
    @Autowired
    private FacturaRepository facturaRepository;


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
    @Transactional
    public void deleteById(Long id) {
        // Verificar si hay facturas asociadas
        Optional<Factura> factura = facturaRepository.findByReserva_Id(id);
        if (factura.isPresent()) {
            throw new RuntimeException("No se puede eliminar la reserva porque tiene una factura asociada");
        }
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

    @Override
    public Reserva createFromRequest(ReservaRequestDto reservaRequest) {
        // Validar que la habitación existe
        Habitacion habitacion = habitacionRepository.findById(reservaRequest.getHabitacionId())
                .orElseThrow(() -> new EntityNotFoundException("Habitación no encontrada"));

        // Validar que el cliente existe
        Cliente cliente = clienteRepository.findById(reservaRequest.getClienteId())
                .orElseThrow(() -> new EntityNotFoundException("Cliente no encontrado"));

        // Obtener servicios si se proporcionaron
        Set<Servicio> servicios = new HashSet<>();
        if (reservaRequest.getServiciosIds() != null && !reservaRequest.getServiciosIds().isEmpty()) {
            servicios = new HashSet<>(servicioRepository.findAllById(reservaRequest.getServiciosIds()));
        }

        // Calcular número de noches
        LocalDate fechaInicio = LocalDate.parse(reservaRequest.getFechaInicio());
        LocalDate fechaFin = LocalDate.parse(reservaRequest.getFechaFin());
        int numeroNoches = (int) ChronoUnit.DAYS.between(fechaInicio, fechaFin);

        // Calcular precio total
        double precioTotal = habitacion.getPrecioPorNoche() * numeroNoches;
        for (Servicio servicio : servicios) {
            precioTotal += servicio.getPrecio() * numeroNoches;
        }

        // Crear la reserva
        Reserva reserva = new Reserva();
        reserva.setFechaInicio(reservaRequest.getFechaInicio());
        reserva.setFechaFin(reservaRequest.getFechaFin());
        reserva.setNumeroNoches(numeroNoches);
        reserva.setPrecioTotal(precioTotal);
        reserva.setHabitacion(habitacion);
        reserva.setCliente(cliente);
        reserva.setServicios(servicios);
        reserva.setEstado(Reserva.EstadoReserva.PENDIENTE);

        return repository.save(reserva);
    }
}
