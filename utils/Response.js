class Response {
  constructor(message, data) {
    this.message = message;
    if (data !== undefined && data !== null) {
      this.data = data;
    }
  }
}

export default Response;
