/**
 * GitHub API routes.
 * All route handlers are thin — actual logic lives in githubService.
 */

import { Router, Request, Response, NextFunction } from 'express';
import * as githubService from '../services/githubService';

const router = Router();

/**
 * GET /api/github/user/:username
 * Returns the public profile for a GitHub user.
 */
router.get('/user/:username', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username } = req.params;
    if (!username || username.length > 39) {
      res.status(400).json({ error: 'Invalid username.', status: 400 });
      return;
    }

    const user = await githubService.getUser(username);
    res.json(user);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/github/repos/:username?page=1
 * Returns a page of public repositories for a GitHub user.
 */
router.get('/repos/:username', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username } = req.params;
    const page = Math.max(1, Number(req.query.page) || 1);

    if (!username || username.length > 39) {
      res.status(400).json({ error: 'Invalid username.', status: 400 });
      return;
    }

    const repos = await githubService.getRepos(username, page);
    res.json(repos);
  } catch (err) {
    next(err);
  }
});

export default router;
