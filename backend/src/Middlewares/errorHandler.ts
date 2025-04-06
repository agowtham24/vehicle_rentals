import { Request, Response, NextFunction } from "express";

// Extend the default Error object
interface CustomError extends Error {
  statusCode?: number;
  path?: string;
  value?: string;
  errors?: any;
  name: string;
}

const ErrorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Middleware Error Handling");

  // Mongoose validation error
  if (err.name === "ValidationError") {
    err.statusCode = 400;
    err.message = Object.values(err.errors || {})
      .map((val: any) => val.message)
      .join(", ");
  }

  // Mongoose cast error (e.g., invalid ObjectId)
  if (err.name === "CastError") {
    err.statusCode = 400;
    err.message = `Invalid ${err.path}: ${err.value}`;
  }

  const errStatus = err.statusCode || 500;
  const errMsg = err.message || "Something went wrong";

  res.status(errStatus).json({
    success: false,
    status: errStatus,
    message: errMsg,
    stack: process.env.NODE_ENV === "dev" ? err.stack : undefined,
  });
};

export default ErrorHandler;
