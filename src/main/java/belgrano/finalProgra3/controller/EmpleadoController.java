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
import belgrano.finalProgra3.entity.Empleado;
import belgrano.finalProgra3.service.IEmpleadoService;

@RestController
@RequestMapping("/empleado")
public class EmpleadoController {

    @Autowired
    private IEmpleadoService service;

    @GetMapping("s")
    public ResponseEntity<ResponseDto<List<Empleado>>> buscarTodosLosEmpleados() {

        return !service.getAll().isEmpty()
                ? new ResponseEntity<>(new ResponseDto<>(true, "Se encontraron los siguientes empleados", service.getAll()), HttpStatus.OK)
                : new ResponseEntity<>(new ResponseDto<>(false, "No se encontraron empleados", service.getAll()), HttpStatus.NOT_FOUND);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseDto<Empleado>> buscarPorId(@PathVariable("id") Long id) {

        return service.exists(id)
                ? new ResponseEntity<>(new ResponseDto<>(true, "Empleado con id: " + id.toString() + " encontrado", service.getById(id)), HttpStatus.OK)
                : new ResponseEntity<>(new ResponseDto<>(false, "No existe un empleado con id: " + id.toString()), HttpStatus.NOT_FOUND);
    }

    @PostMapping
    public ResponseEntity<ResponseDto<Empleado>> crearNuevoEmpleado(@RequestBody Empleado empleado) {

        if (empleado.getId() == null) {

            return new ResponseEntity<>(new ResponseDto<>(true, "Empleado creado con exito", service.save(empleado)), HttpStatus.OK);

        } else {
            if (service.exists(empleado.getId())) {

                return new ResponseEntity<>(new ResponseDto<>(false, "El empleado con id: " + empleado.getId().toString() + " ya existe", service.getById(empleado.getId())), HttpStatus.BAD_REQUEST);

            } else {

                return new ResponseEntity<>(new ResponseDto<>(false, "Peticion erronea, enviar nuevamente sin ID"), HttpStatus.BAD_REQUEST);
            }
        }
    }

    @PutMapping
    public ResponseEntity<ResponseDto<Empleado>> actualizarEmpleado(@RequestBody Empleado empleado) {

        if (empleado.getId() != null) {

            if (service.exists(empleado.getId())) {

                return new ResponseEntity<>(new ResponseDto<>(true, "Empleado con id: " + empleado.getId().toString() + " actualizado", service.save(empleado)), HttpStatus.OK);

            } else {

                return new ResponseEntity<>(new ResponseDto<>(false, "El id: " + empleado.getId().toString() + " para actualizar es invalido"), HttpStatus.BAD_REQUEST);
            }
        } else {

            return new ResponseEntity<>(new ResponseDto<>(false, "Para actualizar un Empleado ingrese un ID valido"), HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseDto<Empleado>> eliminar(@PathVariable("id") Long id) {

        if (service.exists(id)) {

            service.delete(id);
            return new ResponseEntity<>(new ResponseDto<>(true, "Empleado con id: " + id.toString() + " ha sido eliminado"), HttpStatus.OK);

        } else {

            return new ResponseEntity<>(new ResponseDto<>(false, "Empleado con id: " + id.toString() + " No existe"), HttpStatus.BAD_REQUEST);
        }
    }
}