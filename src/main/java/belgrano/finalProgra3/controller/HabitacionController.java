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
import jakarta.validation.Valid;
import belgrano.finalProgra3.dto.ResponseDto;
import belgrano.finalProgra3.entity.Habitacion;
import belgrano.finalProgra3.service.IHabitacionService;

@RestController
@RequestMapping("/habitacion")
public class HabitacionController {

    @Autowired
    private IHabitacionService service;


    @GetMapping("/disponibles")
    public ResponseEntity<ResponseDto<List<Habitacion>>> findByDisponibilidad() {

        return !service.findByDisponible(true).isEmpty()
                ? new ResponseEntity<>(new ResponseDto<>(true, "Listado completo de Habitaciones disponibles", service.findByDisponible(true)), HttpStatus.OK)
                : new ResponseEntity<>(new ResponseDto<>(false, "No existe listado de Habitaciones disponibles", service.findByDisponible(true)), HttpStatus.NOT_FOUND);
    }

    @GetMapping
    public ResponseEntity<ResponseDto<List<Habitacion>>> obtenerHabitaciones() {

        return !service.getAll().isEmpty()
                ? new ResponseEntity<>(new ResponseDto<>(true, "Lista completa de habitaciones", service.getAll()), HttpStatus.OK)
                : new ResponseEntity<>(new ResponseDto<>(false, "No existe listado de Habitaciones", service.getAll()), HttpStatus.NOT_FOUND);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseDto<Habitacion>> obtenerHabitacionPorId(@PathVariable("id") Long id) {

        return service.exists(id)
                ? new ResponseEntity<>(new ResponseDto<>(true, "La habitacion con id: " + id.toString() + " ha sido encontrada", service.getById(id)), HttpStatus.OK)
                : new ResponseEntity<>(new ResponseDto<>(false, "La habitacion con id: " + id.toString() + " no existe"), HttpStatus.NOT_FOUND);
    }

    @PostMapping
    public ResponseEntity<ResponseDto<Habitacion>> crearHabitacion(@Valid @RequestBody Habitacion habitacion) {

        if (habitacion.getId() == null) {

            return new ResponseEntity<>(new ResponseDto<>(true, "Nueva habitacion creada", service.save(habitacion)), HttpStatus.OK);

        } else {
            if (service.exists(habitacion.getId())) {

                return new ResponseEntity<>(new ResponseDto<>(false, "La habitacion con id: " + habitacion.getId().toString() + " ya existe", service.getById(habitacion.getId())), HttpStatus.BAD_REQUEST);

            } else {

                return new ResponseEntity<>(new ResponseDto<>(false, "Peticion erronea, enviar nuevamente sin ID"), HttpStatus.BAD_REQUEST);
            }
        }
    }

    @PutMapping
    public ResponseEntity<ResponseDto<Habitacion>> modificaHabitacion(@Valid @RequestBody Habitacion habitacion) {

        if (habitacion.getId() != null) {

            if (service.exists(habitacion.getId())) {

                return new ResponseEntity<>(new ResponseDto<>(true, "Habitacion con id: " + habitacion.getId().toString() + " actualizada", service.save(habitacion)), HttpStatus.OK);

            } else {

                return new ResponseEntity<>(new ResponseDto<>(false, "El id: " + habitacion.getId().toString() + " para actualizar es invalido"), HttpStatus.BAD_REQUEST);
            }
        } else {

            return new ResponseEntity<>(new ResponseDto<>(false, "Para actualizar una Habitacion ingrese un ID valido"), HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseDto<Habitacion>> delete(@PathVariable("id") Long id) {

        if (service.exists(id)) {

            service.deleteById(id);
            return new ResponseEntity<>(new ResponseDto<>(true, "Habitacion con id: " + id.toString() + " ha sido eliminada"), HttpStatus.OK);

        } else {

            return new ResponseEntity<>(new ResponseDto<>(false, "Habitacion con id: " + id.toString() + " No existe"), HttpStatus.BAD_REQUEST);
        }
    }
}