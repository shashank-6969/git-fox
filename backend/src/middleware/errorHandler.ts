import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

/**
 * Global Express error handler.
 * Translates Axios / GitHub API errors into clean JSON responses.
 */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status ?? 502;
    const ghMessage = (err.response?.data as { message?: string })?.message;

    if (status === 404) {
      res.status(404).json({ error: 'GitHub user or resource not found.', status: 404 });
      return;
    }

    if (status === 403) {
      // Likely rate-limit exceeded
      const rateLimitReset = err.response?.headers?.['x-ratelimit-reset'];
      const resetTime = rateLimitReset
        ? new Date(Number(rateLimitReset) * 1000).toLocaleTimeString()
        : 'soon';
      res.status(429).json({
        error: `GitHub API rate limit exceeded. Resets at ${resetTime}.`,
        status: 429,
      });
      return;
    }

    res.status(status).json({
      error: ghMessage ?? 'GitHub API error. Please try again.',
      status,
    });
    return;
  }

  console.error('[ErrorHandler] Unexpected error:', err);
  res.status(500).json({ error: 'Internal server error.', status: 500 });
}
