package belgrano.finalProgra3.service.jpa;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import belgrano.finalProgra3.entity.Servicio;
import belgrano.finalProgra3.repository.ServicioRepository;
import belgrano.finalProgra3.service.IServicioService;

@Service

public class ServicioServiceImpl implements IServicioService {

	@Autowired
	private ServicioRepository repositoryServicio;

	@Override
	public List<Servicio> getAll() {
		return repositoryServicio.findAll();
	}

	@Override
	public Servicio getById(Long id) {
		return repositoryServicio.findById(id).orElse(null);
	}

	@Override
	public Servicio save(Servicio servicio) {
		return repositoryServicio.save(servicio);
	}

	@Override
	public void deleteById(Long id) {
		repositoryServicio.deleteById(id);
	}

	@Override
	public boolean exists(Long id) {
		return id != null && repositoryServicio.existsById(id);
	}

}
