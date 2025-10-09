package belgrano.finalProgra3.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import belgrano.finalProgra3.dto.ResponseDto;
import belgrano.finalProgra3.entity.Reserva;
import belgrano.finalProgra3.service.IReservaService;

@RestController
@RequestMapping("/reserva")
public class ReservaController {

    @Autowired
    private IReservaService service;

    @GetMapping
    public ResponseEntity<ResponseDto<List<Reserva>>> buscarTodasLasReservas() {

        return !service.getAll().isEmpty()
                ? new ResponseEntity<>(new ResponseDto<>(true, "Se encontraron las siguientes reservas", service.getAll()), HttpStatus.OK)
                : new ResponseEntity<>(new ResponseDto<>(false, "No se encontraron reservas", service.getAll()), HttpStatus.NOT_FOUND);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseDto<Reserva>> buscarPorId(@PathVariable("id") Long id) {

        return service.exists(id)
                ? new ResponseEntity<>(new ResponseDto<>(true, "Reserva con id: " + id.toString() + " encontrada", service.getById(id)), HttpStatus.OK)
                : new ResponseEntity<>(new ResponseDto<>(false, "No existe una reserva con id: " + id.toString()), HttpStatus.NOT_FOUND);
    }

    @PostMapping
    public ResponseEntity<ResponseDto<Reserva>> crearNuevaReserva(@RequestBody Reserva reserva) {

        if (reserva.getId() == null) {

            return new ResponseEntity<>(new ResponseDto<>(true, "Reserva creada con éxito", service.save(reserva)), HttpStatus.OK);

        } else {
            if (service.exists(reserva.getId())) {

                return new ResponseEntity<>(new ResponseDto<>(false, "La reserva con id: " + reserva.getId().toString() + " ya existe", service.getById(reserva.getId())), HttpStatus.BAD_REQUEST);

            } else {

                return new ResponseEntity<>(new ResponseDto<>(false, "Petición errónea, enviar nuevamente sin ID"), HttpStatus.BAD_REQUEST);
            }
        }
    }

    @PutMapping
    public ResponseEntity<ResponseDto<Reserva>> actualizarReserva(@RequestBody Reserva reserva) {

        if (reserva.getId() != null) {

            if (service.exists(reserva.getId())) {

                return new ResponseEntity<>(new ResponseDto<>(true, "Reserva con id: " + reserva.getId().toString() + " actualizada", service.save(reserva)), HttpStatus.OK);

            } else {

                return new ResponseEntity<>(new ResponseDto<>(false, "El id: " + reserva.getId().toString() + " para actualizar es inválido"), HttpStatus.BAD_REQUEST);
            }
        } else {

            return new ResponseEntity<>(new ResponseDto<>(false, "Para actualizar una Reserva ingrese un ID válido"), HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseDto<Reserva>> delete(@PathVariable("id") Long id) {

        if (service.exists(id)) {

            service.deleteById(id);
            return new ResponseEntity<>(new ResponseDto<>(true, "Reserva con id: " + id.toString() + " ha sido eliminada"), HttpStatus.OK);

        } else {

            return new ResponseEntity<>(new ResponseDto<>(false, "Reserva con id: " + id.toString() + " no existe"), HttpStatus.BAD_REQUEST);
        }
    }
}