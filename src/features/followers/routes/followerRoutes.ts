import express, { Router } from 'express';
import { authMiddleware } from '@global/helpers/authMiddleware';
import { AddFollower } from '@follower/controllers/addFollowerController';
import { unfollow } from '@follower/controllers/unfollowUser';

// import { AddUser } from '@follower/controllers/block-user';

class FollowerRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.put('/user/follow/:followerId', authMiddleware.checkAuthentication, AddFollower.prototype.add);
    this.router.put('/user/unfollow/:followeeId/:followerId', authMiddleware.checkAuthentication, unfollow.prototype.follower);
    // this.router.get('/user/following', authMiddleware.checkAuthentication, Get.prototype.userFollowing);
    // this.router.get('/user/followers/:userId', authMiddleware.checkAuthentication, Get.prototype.userFollowers);

    // this.router.put('/user/block/:followerId', authMiddleware.checkAuthentication, AddUser.prototype.block);
    // this.router.put('/user/unblock/:followerId', authMiddleware.checkAuthentication, AddUser.prototype.unblock);

    return this.router;
  }
}

export const followerRoutes: FollowerRoutes = new FollowerRoutes();
