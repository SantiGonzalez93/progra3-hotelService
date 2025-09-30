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
import belgrano.finalProgra3.entity.Cliente;
import belgrano.finalProgra3.service.IClienteService;

@RestController
@RequestMapping("/cliente")
public class ClienteController {

    @Autowired
    private IClienteService service;

    @GetMapping
    public ResponseEntity<ResponseDto<List<Cliente>>> buscarTodosLosCliente() {

        return !service.getAll().isEmpty()
                ? new ResponseEntity<>(new ResponseDto<>(true, "Se encontraron los siguientes clientes", service.getAll()), HttpStatus.OK)
                : new ResponseEntity<>(new ResponseDto<>(false, "No se encontraron clientes", service.getAll()), HttpStatus.NOT_FOUND);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseDto<Cliente>> buscarPorId(@PathVariable("id") Long id) {

        return service.exists(id)
                ? new ResponseEntity<>(new ResponseDto<>(true, "Cliente con id: " + id.toString() + " encontrado", service.getById(id)), HttpStatus.OK)
                : new ResponseEntity<>(new ResponseDto<>(false, "No existe un cliente con id: " + id.toString()), HttpStatus.NOT_FOUND);
    }

    @PostMapping
    public ResponseEntity<ResponseDto<Cliente>> crearNuevoCliente(@RequestBody Cliente cliente) {

        if (cliente.getId() == null) {

            return new ResponseEntity<>(new ResponseDto<>(true, "Cliente creado con exito", service.save(cliente)), HttpStatus.OK);

        } else {
            if (service.exists(cliente.getId())) {

                return new ResponseEntity<>(new ResponseDto<>(false, "El cliente con id: " + cliente.getId().toString() + " ya existe", service.getById(cliente.getId())), HttpStatus.BAD_REQUEST);

            } else {

                return new ResponseEntity<>(new ResponseDto<>(false, "Peticion erronea, enviar nuevamente sin ID"), HttpStatus.BAD_REQUEST);
            }
        }
    }

    @PutMapping
    public ResponseEntity<ResponseDto<Cliente>> actualizarCliente(@RequestBody Cliente cliente) {

        if (cliente.getId() != null) {

            if (service.exists(cliente.getId())) {

                return new ResponseEntity<>(new ResponseDto<>(true, "Cliente con id: " + cliente.getId().toString() + " actualizado", service.save(cliente)), HttpStatus.OK);

            } else {

                return new ResponseEntity<>(new ResponseDto<>(false, "El id: " + cliente.getId().toString() + " para actualizar es invalido"), HttpStatus.BAD_REQUEST);
            }
        } else {

            return new ResponseEntity<>(new ResponseDto<>(false, "Para actualizar un Cliente ingrese un ID valido"), HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseDto<Cliente>> delete(@PathVariable("id") Long id) {

        if (service.exists(id)) {

            service.delete(id);
            return new ResponseEntity<>(new ResponseDto<>(true, "Cliente con id: " + id.toString() + " ha sido eliminado"), HttpStatus.OK);

        } else {

            return new ResponseEntity<>(new ResponseDto<>(false, "Cliente con id: " + id.toString() + " No existe"), HttpStatus.BAD_REQUEST);
        }
    }
}