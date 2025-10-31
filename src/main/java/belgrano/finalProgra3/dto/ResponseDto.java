package belgrano.finalProgra3.dto;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class ResponseDto<T> {

	private boolean estado;
	private List<String> message;
	private T data;

	public ResponseDto() {
	}
	public ResponseDto(boolean estado, List<String> message, T data) {
		super();
		this.estado = estado;
		this.message = message;
		this.data = data;
	}

	public ResponseDto(boolean estado, String message, T data) {
		super();
		this.estado = estado;
		this.message = new ArrayList<>();
		this.message.add(message);
		this.data = data;
	}

	public ResponseDto(boolean estado, String message) {
		super();
		this.estado = estado;
		this.message = new ArrayList<>();
		this.message.add(message);
	}

}
