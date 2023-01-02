import express, { Router } from 'express';
import { authMiddleware } from '@global/helpers/authMiddleware';
import { PostReaction } from '@reaction/controllers/addReaction';
import { Remove } from '@reaction/controllers/removeReaction';
import { GetReaction } from '@reaction/controllers/getReactions';

class ReactionRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.post('/post/reaction/add', authMiddleware.checkAuthentication, PostReaction.prototype.add);
    this.router.delete(
      '/post/reaction-remove/:postId/:previousReaction/:postReactions',
      authMiddleware.checkAuthentication,
      Remove.prototype.reaction
    );
    this.router.get('/post/reactions/:postId', authMiddleware.checkAuthentication, GetReaction.prototype.all);
    this.router.get(
      '/post/single/reaction/username/:username/:postId',
      authMiddleware.checkAuthentication,
      GetReaction.prototype.singleReactionByUsername
    );
    this.router.get('/post/reactions/username/:username', authMiddleware.checkAuthentication, GetReaction.prototype.reactionsByUsername);

    return this.router;
  }
}

export const reactionRoutes: ReactionRoutes = new ReactionRoutes();
