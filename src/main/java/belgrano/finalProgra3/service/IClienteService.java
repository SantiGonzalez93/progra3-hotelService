package belgrano.finalProgra3.service;

import java.util.List;

import org.springframework.stereotype.Service;

import belgrano.finalProgra3.entity.Cliente;

@Service

public interface IClienteService {
	
	List <Cliente> getAll();
	Cliente getById(Long id);
	Cliente save(Cliente cliente);
	void delete(Long id);
	boolean exists (Long id);

}
