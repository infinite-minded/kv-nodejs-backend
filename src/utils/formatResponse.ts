import { ApiResponse } from "./response";

export class FormatResponse {
  public static format = (
    result: any,
    took: number,
    message?: string,
    total?: number
  ): ApiResponse => {
    let data: any = null;
    let errors: Error = null;
    let length: number = 0;

    if (result && result instanceof Array) {
      data = result;
      length = result.length;
    } else if (result && result instanceof Error) {
      errors = result;
    } else if (result || result === 0) {
      data = result;
      length = 1;
    }

    const response: ApiResponse = {
      data,
      errors,
      message: message ? message : null,
      meta: {
        length: length,
        took: took,
        total: total ? total : length,
      },
    };
    return response;
  };
}
