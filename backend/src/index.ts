/**
 * Entry point — Express application bootstrap.
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import githubRoutes from './routes/github';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT ?? 3001;

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.FRONTEND_URL ?? '*' }));
app.use(express.json());

// ── Request logging (lightweight — no extra dependency) ──────────────────────
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/github', githubRoutes);

/** Health check for Render / uptime monitors */
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Global error handler (must be last) ─────────────────────────────────────
app.use(errorHandler);

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🦊 Git Fox backend running on http://localhost:${PORT}`);
    console.log(`   GitHub token: ${process.env.GITHUB_TOKEN ? '✅ set' : '⚠️  not set (60 req/hr limit)'}`);
  });
}

export default app;
