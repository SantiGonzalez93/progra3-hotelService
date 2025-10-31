package belgrano.finalProgra3.service;

import java.util.List;

import org.springframework.stereotype.Service;

import belgrano.finalProgra3.entity.Servicio;

@Service
public interface IServicioService {

	List<Servicio> getAll();
	Servicio getById(Long id);
	Servicio save(Servicio servicio);
	void deleteById(Long id);
	boolean exists(Long id);

}
