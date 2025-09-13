package belgrano.finalProgra3.entity;

	import jakarta.persistence.Entity;
	import jakarta.persistence.GeneratedValue;
	import jakarta.persistence.GenerationType;
	import jakarta.persistence.Id;
	@Entity	
	
	public class Factura {

		@Id	
		@GeneratedValue(strategy=GenerationType.IDENTITY)
		
		private Long id;
		private Long reservaId;
		private Double total;
		private String detalles;
		
		public Long getId() {
			return id;
		}
		public void setId(Long id) {
			this.id = id;
		}
		public Long getReservaId() {
			return reservaId;
		}
		public void setReservaId(Long reservaId) {
			this.reservaId = reservaId;
		}
		public Double getTotal() {
			return total;
		}
		public void setTotal(Double total) {
			this.total = total;
		}
		public String getDetalles() {
			return detalles;
		}
		public void setDetalles(String detalles) {
			this.detalles = detalles;
		}

}


