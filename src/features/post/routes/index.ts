import express, { Router } from 'express';
import { authMiddleware } from '@global/helpers/authMiddleware';
import { CreatePost } from '@post/controllers/createPost';
import { Fetch } from '@post/controllers/getPosts';
import { DeletePost } from '@post/controllers/deletePost';
import { UpdatePost } from '@post/controllers/updatePost';
// import { Get } from '@post/controllers/get-posts';
// import { Delete } from '@post/controllers/delete-post';
// import { Update } from '@post/controllers/update-post';

class PostRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.post('/create-post', authMiddleware.checkAuthentication, CreatePost.prototype.create);
    this.router.post('/create-post-image', authMiddleware.checkAuthentication, CreatePost.prototype.postWithImage);
    this.router.get('/post/all/:page', authMiddleware.checkAuthentication, Fetch.prototype.posts);
    this.router.get('/post/images/:page', authMiddleware.checkAuthentication, Fetch.prototype.postsWithImages);
    this.router.delete('/delete-post/:postId', authMiddleware.checkAuthentication, DeletePost.prototype.delete);
    this.router.put('/update-post/:postId', authMiddleware.checkAuthentication, UpdatePost.prototype.post);
    this.router.put('/update-post/image/:postId', authMiddleware.checkAuthentication, UpdatePost.prototype.postWithImage);
    this.router.post('/post/video/create', authMiddleware.checkAuthentication, CreatePost.prototype.postWithVideo);
    this.router.put('/post/video/:postId', authMiddleware.checkAuthentication, UpdatePost.prototype.postWithVideo);
    this.router.get('/post/videos/:page', authMiddleware.checkAuthentication, Fetch.prototype.postsWithVideos);

    return this.router;
  }
}

export const postRoutes: PostRoutes = new PostRoutes();
