import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { ZodError } from "zod";

@Catch()
export class ErrorFilter implements ExceptionFilter {
  catch(error: any, host: ArgumentsHost) {

    const response = host.switchToHttp().getResponse();

    if (error instanceof HttpException) {
      return response.status(error.getStatus()).json({
        errors: error.getResponse()
      });
    }

    if (error instanceof ZodError) {
      return response.status(400).json({
        errors: error.errors.map((error) => {
          return {
            field: error.path.join("."),
            message: error.message
          }
        })
      });
    }

    return response.status(500).json({
      errors: "Internal Server Error"
    });
  }
}