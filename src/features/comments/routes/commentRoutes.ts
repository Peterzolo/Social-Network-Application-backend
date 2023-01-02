import express, { Router } from 'express';
import { authMiddleware } from '@global/helpers/authMiddleware';
import { GetComment } from '@comment/controllers/getComments';
import { AddComment } from '@comment/controllers/addComment';

class CommentRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.post('/post/comment/create', authMiddleware.checkAuthentication, AddComment.prototype.comment);
    this.router.get('/post/fetch/comments-all/:postId', authMiddleware.checkAuthentication, GetComment.prototype.comments);
    this.router.get('/post/fetch/commentsnames/:postId', authMiddleware.checkAuthentication, GetComment.prototype.commentsNamesFromCache);
    this.router.get(
      '/post/fetch/single/comment/:postId/:commentId',
      authMiddleware.checkAuthentication,
      GetComment.prototype.singleComment
    );

    return this.router;
  }
}

export const commentRoutes: CommentRoutes = new CommentRoutes();
