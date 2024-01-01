class AppError extends Error {
    constructor(message, status) {
      super(message);
  
      this.status = status;
      this.statusMessage = `${status}`.startsWith('4') ? 'fail' : 'success';
      this.isOperational = true;
  
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
export default AppError;
  