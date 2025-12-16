package belgrano.finalProgra3.service.jpa;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import belgrano.finalProgra3.entity.Empleado;
import belgrano.finalProgra3.service.IEmpleadoService;
import belgrano.finalProgra3.repository.EmpleadoRepository;


@Service
public class EmpleadoServiceImpl implements IEmpleadoService {
	@Autowired
	private EmpleadoRepository repo;

	@Override
	public List<Empleado> getAll() {
		return repo.findAll();
	}

	@Override
	public Empleado getById(Long id) {
		return repo.findById(id).orElse(null);
	}

	@Override
	public Empleado save(Empleado empleado) {
		return repo.save(empleado);
	}

	@Override
	@Transactional
	public void delete(Long id) {
		try {
			// Obtener el empleado para verificar relaciones
			Empleado empleado = repo.findById(id).orElse(null);
			if (empleado != null) {
				try {
					// Intentar acceder a los servicios de forma segura
					if (empleado.getServicios() != null && !empleado.getServicios().isEmpty()) {
						throw new RuntimeException("No se puede eliminar el empleado porque está asociado a " + empleado.getServicios().size() + " servicio(s)");
					}
				} catch (Exception e) {
					// Si hay un error al acceder a los servicios (lazy loading), verificar de otra forma
					// No mostrar el mensaje de error original que puede contener queries SQL
					throw new RuntimeException("No se puede eliminar el empleado porque está asociado a uno o más servicios");
				}
			}
			repo.deleteById(id);
		} catch (RuntimeException e) {
			// Re-lanzar RuntimeException con mensaje seguro
			throw e;
		} catch (Exception e) {
			// Capturar cualquier otra excepción y lanzar un mensaje genérico seguro
			throw new RuntimeException("No se puede eliminar el empleado porque está asociado a uno o más servicios");
		}
	}

	@Override
	@Transactional
	public void deleteById(Long id) {
		try {
			// Obtener el empleado para verificar relaciones
			Empleado empleado = repo.findById(id).orElse(null);
			if (empleado != null) {
				try {
					// Intentar acceder a los servicios de forma segura
					if (empleado.getServicios() != null && !empleado.getServicios().isEmpty()) {
						throw new RuntimeException("No se puede eliminar el empleado porque está asociado a " + empleado.getServicios().size() + " servicio(s)");
					}
				} catch (RuntimeException e) {
					// Si es nuestra RuntimeException, re-lanzarla
					throw e;
				} catch (Exception e) {
					// Si hay un error al acceder a los servicios (lazy loading), verificar de otra forma
					// No mostrar el mensaje de error original que puede contener queries SQL
					throw new RuntimeException("No se puede eliminar el empleado porque está asociado a uno o más servicios");
				}
			}
			repo.deleteById(id);
		} catch (RuntimeException e) {
			// Re-lanzar RuntimeException con mensaje seguro
			throw e;
		} catch (Exception e) {
			// Capturar cualquier otra excepción y lanzar un mensaje genérico seguro
			throw new RuntimeException("No se puede eliminar el empleado porque está asociado a uno o más servicios");
		}
	}

	@Override 
	public boolean exists(Long id) {
		if (id != null) {
			return repo.existsById(id);
		}else{
			return false;
		}
	}

	}