import { ValidationError } from "class-validator";
import { HttpException } from "../exception/http.exception";

export class ValidateException extends HttpException {
  exceptionList: Object;

  constructor(status: number, message: string, errors: ValidationError[]) {
    super(status, message);
    this.exceptionList = this.extractExceptionList(errors);
  }

  extractExceptionList(errors: ValidationError[]) {
    const errorList = this.extractExceptions(errors);
    return Object.assign({}, ...errorList);
  }

  extractExceptions(errors: ValidationError[]) {
    return errors.map((error) => {
      const property = error.property;
      const constraints = error.constraints;
      if (error.children.length > 0) {
        return { [property]: this.extractExceptions(error.children) };
      } else {
        return { [property]: Object.values(constraints) };
      }
    });
  }
}
