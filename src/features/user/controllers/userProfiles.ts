import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import { FollowerCache } from '@service/redis/followerCache';
import { PostCache } from '@service/redis/postCache';
import { UserCache } from '@service/redis/userCache';
import { IAllUsers, IUserDocument } from '@user/interfaces/user.interface';
import { userService } from '@service/db/userService';
import { IFollowerData } from '@follower/interfaces/followersInterface.ts';
import { followerService } from '@service/db/followerService';
import mongoose from 'mongoose';
import { Helpers } from '@global/helpers';
import { IPostDocument } from '@post/interfaces/postInterface';
import { postService } from '@service/db/postService';

const PAGE_SIZE = 10;

interface IUserAll {
  newSkip: number;
  limit: number;
  skip: number;
  userId: string;
}

const postCache: PostCache = new PostCache();
const userCache: UserCache = new UserCache();
const followerCache: FollowerCache = new FollowerCache();

export class Get {
  public async all(req: Request, res: Response): Promise<void> {
    const { page } = req.params;
    const skip: number = (parseInt(page) - 1) * PAGE_SIZE;
    const limit: number = PAGE_SIZE * parseInt(page);
    const newSkip: number = skip === 0 ? skip : skip + 1;
    const allUsers = await Get.prototype.allUsers({
      newSkip,
      limit,
      skip,
      userId: `${req.currentUser!.userId}`
    });
    const followers: IFollowerData[] = await Get.prototype.followers(`${req.currentUser!.userId}`);
    res.status(HTTP_STATUS.OK).json({ message: 'Get users', users: allUsers.users, totalUsers: allUsers.totalUsers, followers });
  }

  //   Private method to fetch either from user cache or database
  private async allUsers({ newSkip, limit, skip, userId }: IUserAll): Promise<IAllUsers> {
    let users;
    let type = '';
    const cachedUsers: IUserDocument[] = (await userCache.getUsersFromCache(newSkip, limit, userId)) as IUserDocument[];
    if (cachedUsers.length) {
      type = 'redis';
      users = cachedUsers;
    } else {
      type = 'mongodb';
      users = await userService.getAllUsers(userId, skip, limit);
    }
    const totalUsers: number = await Get.prototype.usersCount(type);
    return { users, totalUsers };
  }

  // Get loggedin  user profile
  public async currentUserProfile(req: Request, res: Response): Promise<void> {
    // const cachedUser: IUserDocument = (await userCache.getUserFromCache(`${req.currentUser!.userId}`)) as IUserDocument;
    // const existingUser: IUserDocument = cachedUser ? cachedUser : await userService.getUserById(`${req.currentUser!.userId}`);
    const existingUser: IUserDocument = await userService.getUserById(`${req.currentUser!.userId}`);
    res.status(HTTP_STATUS.OK).json({ message: 'Logged in user profile fetched', user: existingUser });
  }

  // Get a single user profile by ID
  public async singleUserProfile(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;
    // const cachedUser: IUserDocument = (await userCache.getUserFromCache(userId)) as IUserDocument;
    // const existingUser: IUserDocument = cachedUser ? cachedUser : await userService.getUserById(userId);
    const existingUser: IUserDocument = await userService.getUserById(userId);
    res.status(HTTP_STATUS.OK).json({ message: 'User profile fetched', user: existingUser });
  }

  public async profileAndPosts(req: Request, res: Response): Promise<void> {
    const { userId, username, uId } = req.params;
    const userName: string = Helpers.firstLetterUppercase(username);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const cachedUser: IUserDocument = (await userCache.getUserFromCache(userId)) as IUserDocument;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const cachedUserPosts: IPostDocument[] = await postCache.getUserPostsFromCache('post', parseInt(uId, 10));

    // const existingUser: IUserDocument = cachedUser ? cachedUser : await userService.getUserById(userId);
    const existingUser: IUserDocument = await userService.getUserById(userId);
    // const userPosts: IPostDocument[] = cachedUserPosts.length
    //   ? cachedUserPosts
    //   : await postService.getPosts({ username: userName }, 0, 100, { createdAt: -1 });
    const userPosts: IPostDocument[] = await postService.getPosts({ username: userName }, 0, 100, { createdAt: -1 });

    res.status(HTTP_STATUS.OK).json({ message: 'Get user profile and posts', user: existingUser, posts: userPosts });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async usersCount(type: string): Promise<number> {
    // const totalUsers: number = type === 'redis' ? await userCache.getTotalUsersInCache() : await userService.getTotalUsersInDB();
    const totalUsers: number = await userService.getTotalUsersInDB();
    return totalUsers;
  }

  private async followers(userId: string): Promise<IFollowerData[]> {
    // const cachedFollowers: IFollowerData[] = await followerCache.getFollowersFromCache(`followers:${userId}`);
    // const result = cachedFollowers.length ? cachedFollowers : await followerService.getFollowerData(new mongoose.Types.ObjectId(userId));
    const result = await followerService.getFollowerData(new mongoose.Types.ObjectId(userId));
    return result;
  }

  //   End of the line
}
