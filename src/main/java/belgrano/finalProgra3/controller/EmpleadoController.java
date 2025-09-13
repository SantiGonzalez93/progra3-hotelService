package belgrano.finalProgra3.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.web.bind.annotation.RestController;

import belgrano.finalProgra3.dto.ResponseDto;
import belgrano.finalProgra3.entity.Empleado;
import belgrano.finalProgra3.service.IEmpleadoService;


@RestController

public class EmpleadoController {
	@Autowired
	private IEmpleadoService service;
	
	//busco todos los empleados
	@GetMapping("/empleados")
	public ResponseDto<List<Empleado>> buscarTodosLosEmpleados() {
		List<Empleado> listaEmpleado;
		listaEmpleado = new ArrayList();
		listaEmpleado = service.getAll();
		
		ResponseDto<List<Empleado>> dto;
		dto = new ResponseDto<List<Empleado>>();		
		
		if(listaEmpleado.isEmpty()) {
			dto.setEstado(false);
			List<String> mensajes = new ArrayList();
			mensajes.add("No se encontraron empleados");
			dto.setMessage(mensajes);
			dto.setData(null);
		}else {
			List<String> mensajes = new ArrayList();
			mensajes.add("Se encontraron los siguientes empleados");
			dto.setEstado(true);
			dto.setMessage(mensajes);
			dto.setData(listaEmpleado);
		}		
		return dto;
	}
	
	//end que busca por id
	@GetMapping("/empleado/{id}")
	public ResponseDto <Empleado> buscarPorId(@PathVariable("id") Long id) {
		if (service.exists(id)) {
			Empleado empleado = new Empleado ();
			empleado = service.getById(id);
			ResponseDto <Empleado> dto;
			dto = new ResponseDto <Empleado> (true, "OK",empleado);
			return dto;
		}else {
			return new ResponseDto <Empleado> (false, "No existe un empleado con esa ID",null);
		}

	}
	
	// end que crea un nuevo empleado
	@PostMapping("/empleado")
	public ResponseDto <Empleado> crearNuevoEmpleado(@RequestBody Empleado empleadoDesdeElServicio) {
		if (service.exists(empleadoDesdeElServicio.getId())) {
			return new ResponseDto<Empleado>(false, "Este id ya le pertenece a otro empleado",null);
			
		}else {
			return new ResponseDto<Empleado>(true,"Empleado creado con exito",service.save(empleadoDesdeElServicio));
		}
		
	}
	//actualizar un elemento	
	@PutMapping("/empleado")
	public ResponseDto <Empleado> actualizarNuevoEmpleado(@RequestBody Empleado empleadoDesdeElServicio) {
		if (service.exists(empleadoDesdeElServicio.getId())) {
			return new ResponseDto<Empleado>(true, "Empleado actualizado con exito",service.save(empleadoDesdeElServicio));
			
		}else {
			return new ResponseDto<Empleado>(false,"ID no encontrado" + empleadoDesdeElServicio.getId().toString(),null);
		}
		
		
	}
	//elimina un elemneto
	@DeleteMapping("/empleado/{id}")
	//ahora necesito almacenar un generico 
	public ResponseDto <?> eliminar(@PathVariable("id") Long id) {
		if (service.exists(id)) {
			service.delete(id);
			return new ResponseDto<>(true,"Empleado eliminado con ID" + id.toString(), null);
		}else{
			return new ResponseDto<>(false,"No se encontro ID" + id.toString(),null);
			
		}

		
	}
	
}
