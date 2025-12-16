package belgrano.finalProgra3.service.jpa;


import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import belgrano.finalProgra3.service.IClienteService;
import belgrano.finalProgra3.entity.Cliente;
import belgrano.finalProgra3.repository.ClienteRepository;
import belgrano.finalProgra3.repository.ReservaRepository;

@Service

public class ClienteServiceImpl implements IClienteService{

	@Autowired
	private ClienteRepository repositoryCliente;
	
	@Autowired
	private ReservaRepository reservaRepository;
	
	@Override
	public List<Cliente> getAll()  {
		
		return repositoryCliente.findAll();
	}

	@Override
	
	public Cliente getById(Long id) {
		
		return repositoryCliente.findById(id).orElse(null);	
	}
	
	@Override
	public Cliente save(Cliente cliente) {
		
		return repositoryCliente.save(cliente);
	}

	@Override
	@Transactional
	public void delete(Long id) {
		// Verificar si hay reservas asociadas
		List<belgrano.finalProgra3.entity.Reserva> reservas = reservaRepository.findByClienteId(id);
		if (reservas != null && !reservas.isEmpty()) {
			throw new RuntimeException("No se puede eliminar el cliente porque tiene " + reservas.size() + " reserva(s) asociada(s)");
		}
		repositoryCliente.deleteById(id);
	}
	
	@Override
	@Transactional
	public void deleteById(Long id) {
		// Verificar si hay reservas asociadas
		List<belgrano.finalProgra3.entity.Reserva> reservas = reservaRepository.findByClienteId(id);
		if (reservas != null && !reservas.isEmpty()) {
			throw new RuntimeException("No se puede eliminar el cliente porque tiene " + reservas.size() + " reserva(s) asociada(s)");
		}
		repositoryCliente.deleteById(id);
	}
	@Override 
	public boolean exists(Long id) {
		if (id != null) {
			return repositoryCliente.existsById(id);
		}else{
			return false;
		}
	}
	
}
		
	
