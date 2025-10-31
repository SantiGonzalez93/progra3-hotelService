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
import belgrano.finalProgra3.entity.Servicio;
import belgrano.finalProgra3.service.IServicioService;

@RestController
@RequestMapping("/servicio")
public class ServicioController {

	@Autowired
	private IServicioService service;



	@GetMapping
	public ResponseEntity<ResponseDto<List<Servicio>>> obtenerServicios() {

		return  !service.getAll().isEmpty()
				? new ResponseEntity<>(new ResponseDto<>(true, "Listado completo de Servicios", service.getAll()),HttpStatus.OK)
				: new ResponseEntity<>(new ResponseDto<>(false, "No existe listado de Servicio", service.getAll()),HttpStatus.NOT_FOUND);

	}

	@GetMapping("/{id}")
	public ResponseEntity<ResponseDto<Servicio>> obtenerServiciosPorId(@PathVariable("id") Long id) {

		return  service.exists(id)
				? new ResponseEntity<>(new ResponseDto<>(true,"El servicio con id: " + id.toString() + " ha sido encontrado", service.getById(id)),HttpStatus.OK)
				: new ResponseEntity<>(new ResponseDto<>(false, "El servicio con id: " + id.toString() + " no existe"),HttpStatus.NOT_FOUND);
	}

	@PostMapping
	public ResponseEntity<ResponseDto<Servicio>> crearNuevoServicio(@Valid @RequestBody Servicio servicio) {

		if (servicio.getId() == null) {
			
			return new ResponseEntity<>(new ResponseDto<>(true, "Servicio nuevo creado", service.save(servicio)),HttpStatus.OK);
			
		} else {
			if (service.exists(servicio.getId())) {
				
				return new ResponseEntity<>(new ResponseDto<>(false, "El servicio con id: " + servicio.getId().toString() + " ya existe",service.getById(servicio.getId())),HttpStatus.BAD_REQUEST);
				
			} else {
				
				return new ResponseEntity<>(new ResponseDto<>(false, "Peticion erronea, enviar nuevamente sin ID"),HttpStatus.BAD_REQUEST);
			}
		}

	}

	@PutMapping
	public ResponseEntity<ResponseDto<Servicio>> modificaServicio(@Valid @RequestBody Servicio servicio) {

		if (servicio.getId() != null) {
			
			if (service.exists(servicio.getId())) {
				
				return new ResponseEntity<>(new ResponseDto<>(true,"Servicio con id: " + servicio.getId().toString() + " actualizado", service.save(servicio)),HttpStatus.OK);
				
			} else {
				
				return new ResponseEntity<>(new ResponseDto<>(false,"El id: " + servicio.getId().toString() + " para actualizar es invalido"),HttpStatus.BAD_REQUEST);
				
			}
		} else {
			
			return new ResponseEntity<>(new ResponseDto<>(false, "Para actualizar un Servicio ingrese un ID valido"),HttpStatus.BAD_REQUEST);
			
		}
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<ResponseDto<Servicio>> delete(@PathVariable("id") Long id) {

		if (service.exists(id)) {
			
			service.deleteById(id);
			return new ResponseEntity<>(new ResponseDto<>(true, "Servicio con id: " + id.toString() + " ha sido eliminado"),HttpStatus.OK);
			
		} else {
			
			return new ResponseEntity<>(new ResponseDto<>(false, "Servicio con id: " + id.toString() + " No existe"),HttpStatus.BAD_REQUEST);
			
		}
	}
}
