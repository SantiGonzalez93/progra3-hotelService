package belgrano.finalProgra3.service;

import java.util.List;

import org.springframework.stereotype.Service;

import belgrano.finalProgra3.entity.Cliente;

@Service

public interface IClienteService {
	
	public abstract List <Cliente> getAll(); 
	public abstract Cliente getById(Long id);
	public abstract Cliente save(Cliente cliente);
	public abstract void delete(Long id);
	public abstract boolean exists (Long id);

}
