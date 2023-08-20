export class InternalServerError extends Error {
  constructor(message?: string) {
    super(message ?? "Erro interno, contate o administrador.");
    this.name = "InternalServerError";
  }
}
