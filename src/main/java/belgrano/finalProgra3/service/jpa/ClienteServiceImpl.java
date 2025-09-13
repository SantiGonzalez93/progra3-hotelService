package belgrano.finalProgra3.service.jpa;


import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import belgrano.finalProgra3.service.IClienteService;
import belgrano.finalProgra3.entity.Cliente;
import belgrano.finalProgra3.repository.ClienteRepository;

@Service

public class ClienteServiceImpl implements IClienteService{

	@Autowired
	private ClienteRepository repositoryCliente;
	
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
	public void delete(Long id) {
		
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
		
	
