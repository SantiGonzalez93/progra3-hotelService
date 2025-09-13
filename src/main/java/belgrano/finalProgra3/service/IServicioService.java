package belgrano.finalProgra3.service;

import java.util.List;

import org.springframework.stereotype.Service;

import belgrano.finalProgra3.entity.Servicio;

@Service
public interface IServicioService {

	public abstract List<Servicio> getAll();

	public abstract Servicio getById(Long id);

	public abstract Servicio save(Servicio servicio);

	public abstract void deleteById(Long id);

	public abstract boolean exists(Long id);

}
