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

import belgrano.finalProgra3.service.IClienteService;
import belgrano.finalProgra3.dto.ResponseDto;
import belgrano.finalProgra3.entity.Cliente;

@RestController

public class ClienteController {

	@Autowired
	private IClienteService service;
	
	@GetMapping("/cliente")

	public ResponseDto<List<Cliente>> buscarTodosLosCliente() {
		List<Cliente> listaCliente;
		listaCliente = new ArrayList();
		listaCliente = service.getAll();

		ResponseDto<List<Cliente>> dto;
		dto = new ResponseDto<List<Cliente>>();		

		if(listaCliente.isEmpty()) {
			dto.setEstado(false);
			List<String> mensajes = new ArrayList();
			mensajes.add("No se encontraron clientes");
			dto.setMessage(mensajes);
			dto.setData(null);
		}else {
			List<String> mensajes = new ArrayList();
			mensajes.add("Se encontraron los siguientes clientes");
			dto.setEstado(true);
			dto.setMessage(mensajes);
			dto.setData(listaCliente);
		}		
		return dto;
	}


	@GetMapping("/cliente/{id}")

	public ResponseDto <Cliente> buscarPorId(@PathVariable("id") Long id) {
		if (service.exists(id)) {
			Cliente cliente = new Cliente ();
			cliente = service.getById(id);
			ResponseDto <Cliente> dto;
			dto = new ResponseDto <Cliente> (true, "OK",cliente);
			return dto;
		}else {
			return new ResponseDto <Cliente> (false, "No existe un cliente con esa ID",null);
		}
	}

	@PostMapping("/cliente")

	public ResponseDto <Cliente> crearNuevoEmpleado(@RequestBody Cliente clienteDesdeElServicio) {
		if (service.exists(clienteDesdeElServicio.getId())) {
			return new ResponseDto<Cliente>(false, "Este id ya le pertenece a otro cliente",null);

		}else {
			return new ResponseDto<Cliente>(true,"Cliente creado con exito",service.save(clienteDesdeElServicio));
		}

	}

	@DeleteMapping("/cliente/{id}")

	public ResponseDto <?> delete(@PathVariable("id") Long id) {
		if (service.exists(id)) {
			service.delete(id);
			return new ResponseDto<>(true,"Cliente eliminado con ID" + id.toString(), null);
		}else{
			return new ResponseDto<>(false,"No se encontro ID" + id.toString(),null);

		}
	}

	@PutMapping("/cliente")

	public ResponseDto <Cliente> actualizarNuevoCliente(@RequestBody Cliente clienteDesdeElServicio) {
		if (service.exists(clienteDesdeElServicio.getId())) {
			return new ResponseDto<Cliente>(true, "Empleado actualizado con exito",service.save(clienteDesdeElServicio));

		}else {
			return new ResponseDto<Cliente>(false,"ID no encontrado" + clienteDesdeElServicio.getId().toString(),null);
		}

	}

}
