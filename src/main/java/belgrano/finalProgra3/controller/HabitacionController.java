package belgrano.finalProgra3.controller;

import java.util.ArrayList;
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
import org.springframework.web.bind.annotation.RestController;

import belgrano.finalProgra3.dto.ResponseDto;
import belgrano.finalProgra3.entity.Habitacion;
import belgrano.finalProgra3.service.IHabitacionService;


@RestController
public class HabitacionController {

	@Autowired
	private IHabitacionService service;
	
	


	
	
	@GetMapping("/habitaciones/disponibles")
	
	public ResponseEntity<ResponseDto<List<Habitacion>>> findByDisponibilidad(){	
				
	
	return !service.findByDisponible(true).isEmpty()
						? new ResponseEntity<>(new ResponseDto<List<Habitacion>>(true, "Listado completo de Habitaciones disponibles", service.findByDisponible(true)),HttpStatus.OK)
						: new ResponseEntity<>(new ResponseDto<>(false, "No existe listado de Servicio", service.getAll()),HttpStatus.NOT_FOUND);
		
	}
	
	
	
	
	
	
	@GetMapping("/habitaciones")
	
	public  ResponseEntity<ResponseDto> obtenerHabitaciones(){
		//Instanciamos un objeto del tipo ResponseDto
		ResponseDto<List<Habitacion>> response= new ResponseDto<>();
		
		//Instanciamos una Lista del tipo Habitacion
		List<Habitacion> list= new ArrayList<>();
		
		//Vamos a obtener todo lo que este persistido
		list = service.getAll();
		List<String> mensaje= new ArrayList<>();
			if(!list.isEmpty()) {
		
			//Como la lista contiene datos entonces los retornamos con mensaje exitoso
			//Primero preparamos DTO 
			response.setEstado(true);
			mensaje.add("Lista completa de habitaciones");
			response.setMessage(mensaje);
			response.setData(list);
			
			//Instanciamos el ResponseEntity que vamos a retornar, con los parametros ResponseDto y el codigo correspondiente
			ResponseEntity<ResponseDto> finalResponse = new ResponseEntity<>(response,HttpStatus.OK);
			//Finalmente retornamos
			
			return finalResponse;
			
		}else {
			//Como la lista esta vacia, retornamos con mensaje de error
			//Primero preparamos DTO
			response.setEstado(false);
			mensaje.add("No existe listado de Habitaciones");
			response.setMessage(mensaje);
			response.setData(null); //esta linea es innecesaria ya que al instanciarlo ya esta en null
			
			//Instanciamos el ResponseEntity que vamos a retornar, con los parametros ResponseDto y el codigo correspondiente
			//Utilizamos estado OK, ya que NO_CONTENT no permite un body en la respuesta
			ResponseEntity<ResponseDto> finalResponse = new ResponseEntity<>(response,HttpStatus.OK);
			
			//Finalmente retornamos
			return finalResponse;
		}

	}
	
	
	@GetMapping("/habitaciones/{id}")
		public ResponseEntity<ResponseDto> obtenerHabitacionPorId(@PathVariable ("id") Long id) {
		
		//Primero Instanciamos nuesto ResponseDto
		ResponseDto<Habitacion> response = new ResponseDto<>();
		List<String> mensaje= new ArrayList<>();
		
		if(service.exists(id)) {
			
			//si la habitacion existe recibimos un objeto servicio
			Habitacion habitacion = service.getById(id);
			
			//Preparamos nuestro DTO
			response.setEstado(true);
			mensaje.add("La habitacion con id: " + id.toString() + " ha sido encontrada");
			response.setMessage(mensaje);
			response.setData(habitacion);
			
			//Instanciamos Nuestro ResponseEntity
			ResponseEntity<ResponseDto> finalResponse = new ResponseEntity<>(response,HttpStatus.OK);
			
			//Finalmente retornamos
			return finalResponse;
			
		}else {
			//Preparamos nuestro DTO
			response.setEstado(false);
			mensaje.add("La habitacion con id: " + id.toString() + " no existe");
			response.setMessage(mensaje);
			response.setData(null);//linea innecesaria, el object ya esta en null
			
			//Instanciamos Nuestro ResponseEntity
			ResponseEntity<ResponseDto> finalResponse = new ResponseEntity<>(response,HttpStatus.NOT_FOUND);
			
			//Finalmente retornamos
			return finalResponse;
		  }
		}
	
	
	@PostMapping("/habitaciones")
		public ResponseEntity<ResponseDto> crearHabitacion(@RequestBody Habitacion habitacion) {
		
		//Primero Instanciamos nuesto ResponseDto
		ResponseDto<Habitacion> response = new ResponseDto<>();
		List<String> mensaje= new ArrayList<>();
		
		if(habitacion.getId()==null ) {
			
			Habitacion habitacionPersistida = service.save(habitacion);
			
			//Preparamos nuestro DTO
			response.setEstado(true);
			mensaje.add("Nueva habitacion creada");
			response.setMessage(mensaje);
			response.setData(habitacionPersistida);
			
			//Instanciamos Nuestro ResponseEntity
			ResponseEntity<ResponseDto> finalResponse = new ResponseEntity<>(response,HttpStatus.OK);
			
			//Finalmente retornamos
			return finalResponse;
			
		}else {
			
			//  En caso de que envien con ID, analizamos si existe o no existe
			
			if (service.exists(habitacion.getId())) {
			
			// Preparamos nuestro DTO
			response.setEstado(false);
			mensaje.add("La habitacion con id: " + habitacion.getId()  + " ya existe");
			response.setMessage(mensaje);
			response.setData(service.getById(habitacion.getId()));
			
			
			
			// Instanciamos Nuestro ResponseEntity
			ResponseEntity<ResponseDto> finalResponse = new ResponseEntity<>(response,HttpStatus.BAD_REQUEST);
			
			// Finalmente retornamos
			return finalResponse;
			
			} else {
				
				// Preparamos nuestro DTO
				response.setEstado(false);
				mensaje.add("Peticion erronea, enviar nuevamente sin ID");
				response.setMessage(mensaje);
				response.setData(null);
				
				// Instanciamos Nuestro ResponseEntity
				ResponseEntity<ResponseDto> finalResponse = new ResponseEntity<>(response,HttpStatus.BAD_REQUEST);
				
				// Finalmente retornamos
				return finalResponse;
			}			
		}

	}
	
	
	@PutMapping("/habitaciones")
	public ResponseEntity<ResponseDto> modificaHabitacion(@RequestBody Habitacion habitacion) {
		
		//Primero Instanciamos nuesto ResponseDto
		ResponseDto<Habitacion> response = new ResponseDto<>();
		List<String> mensaje= new ArrayList<>();
		
		if(service.exists(habitacion.getId())) {
			
			// El objeto viene con ID, pero vamos a corroborar que dicho id exista
			
				Habitacion habitacionPersistida = service.save(habitacion);
					
				// Preparamos nuestro DTO
				response.setEstado(true);
				mensaje.add("Servicio con id: " + habitacion.getId() + " actualizado");
				response.setMessage(mensaje);
				response.setData(habitacionPersistida);
				
				//Instanciamos Nuestro ResponseEntity
				ResponseEntity<ResponseDto> finalResponse = new ResponseEntity<>(response,HttpStatus.OK);
				
				//Finalmente retornamos
				return finalResponse;
						
		}else {
			
			// Preparamos nuestro DTO
			response.setEstado(false);
			mensaje.add("Para actualizar un Servicio ingrese un ID valido");
			response.setMessage(mensaje);
			response.setData(null);
			
			//Instanciamos Nuestro ResponseEntity
			ResponseEntity<ResponseDto> finalResponse = new ResponseEntity<>(response,HttpStatus.BAD_REQUEST);
			
			//Finalmente retornamos
			return finalResponse;
		}
		
	}
	

	@DeleteMapping("/habitaciones/{id}")
		public ResponseEntity<ResponseDto>  borrarHabitacion (@PathVariable("id")  Long id) {
		
		//Primero Instanciamos nuesto ResponseDto
		ResponseDto<Habitacion> response = new ResponseDto<>();
		List<String> mensaje= new ArrayList<>();
		
		//comprobamos que dicho id exista
		
		if(service.exists(id)) {
			
			//Eliminamos
			service.delete(id);
			
			//Preparamos el DTO
			response.setEstado(true);
			mensaje.add("Servicio con id: " + id.toString() + " Eliminado");
			response.setMessage(mensaje);
			response.setData(null);
			
			//Instanciamos Nuestro ResponseEntity
			ResponseEntity<ResponseDto> finalResponse = new ResponseEntity<>(response,HttpStatus.OK);
			
			//Finalmente retornamos
			return finalResponse;
			
		}else {
			
			//Preparamos el DTO
			response.setEstado(false);
			mensaje.add("Servicio con id: " + id.toString() + " No existe");
			response.setMessage(mensaje);
			response.setData(null);
			
			//Instanciamos Nuestro ResponseEntity
			ResponseEntity<ResponseDto> finalResponse = new ResponseEntity<>(response,HttpStatus.BAD_REQUEST);
			
			//Finalmente retornamos
			return finalResponse;
		}
	}
	
	
	
	
	
	
	
	
	}