import express, { Router } from 'express';
import { authMiddleware } from '@global/helpers/authMiddleware';
import { PostReaction } from '@reaction/controllers/addReaction';

class ReactionRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.post('/post/reaction/add', authMiddleware.checkAuthentication, PostReaction.prototype.add);
    // this.router.get('/post/reactions/:postId', authMiddleware.checkAuthentication, Get.prototype.reactions);
    // this.router.get(
    //   '/post/single/reaction/username/:username/:postId',
    //   authMiddleware.checkAuthentication,
    //   Get.prototype.singleReactionByUsername
    // );
    // this.router.get('/post/reactions/username/:username', authMiddleware.checkAuthentication, Get.prototype.reactionsByUsername);

    // this.router.delete(
    //   '/post/reaction/:postId/:previousReaction/:postReactions',
    //   authMiddleware.checkAuthentication,
    //   Remove.prototype.reaction
    // );

    return this.router;
  }
}

export const reactionRoutes: ReactionRoutes = new ReactionRoutes();
