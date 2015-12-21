package {{ base_package }}.dao.base;

public class AppException extends RuntimeException{
	private static final long serialVersionUID = 1L;
	public AppException() {
		super();
	}
	
	public AppException(String message) {
		super(message);
	}
	
	public AppException(String message, Throwable cause) {
		super(message, cause);
	}
	
	public AppException(Throwable cause) {
		super(cause);
	}
}
