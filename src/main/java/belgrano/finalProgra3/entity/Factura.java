package belgrano.finalProgra3.entity;

	import jakarta.persistence.Entity;
	import jakarta.persistence.GeneratedValue;
	import jakarta.persistence.GenerationType;
	import jakarta.persistence.Id;
    import lombok.AllArgsConstructor;
    import lombok.Data;
    import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
	public class Factura {

		@Id	
		@GeneratedValue(strategy=GenerationType.IDENTITY)
		
		private Long id;
		private Long reservaId;
		private Double total;
		private String detalles;

}


