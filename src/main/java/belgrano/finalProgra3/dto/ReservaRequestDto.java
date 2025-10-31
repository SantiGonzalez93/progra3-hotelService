package belgrano.finalProgra3.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;

@Data
public class ReservaRequestDto {
    
    @NotBlank(message = "La fecha de inicio es obligatoria")
    private String fechaInicio;
    
    @NotBlank(message = "La fecha de fin es obligatoria")
    private String fechaFin;
    
    @NotNull(message = "El ID de la habitación es obligatorio")
    private Long habitacionId;
    
    @NotNull(message = "El ID del cliente es obligatorio")
    private Long clienteId;
    
    private List<Long> serviciosIds;
}

