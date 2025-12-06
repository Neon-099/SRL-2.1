import type { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('Error:', err);

  // Handle specific error types
  if (err.message.includes('already exists')) {
    res.status(409).json({
      success: false,
      message: err.message,
    });
    return;
  }

  if (err.message.includes('Invalid email or password')) {
    res.status(401).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // Default error
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
}