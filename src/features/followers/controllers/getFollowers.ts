import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import HTTP_STATUS from 'http-status-codes';
import mongoose from 'mongoose';
import { FollowerCache } from '@service/redis/followerCache';
import { IFollowerData } from '@follower/interfaces/followersInterface.ts';
import { followerService } from '@service/db/followerService';

const followerCache: FollowerCache = new FollowerCache();

export class GetFollows {
  public async userFollowing(req: Request, res: Response): Promise<void> {
    const userObjectId: ObjectId = new mongoose.Types.ObjectId(req.currentUser!.userId);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const cachedFollowees: IFollowerData[] = await followerCache.getFollowersFromCache(`following:${req.currentUser!.userId}`);
    // const following: IFollowerData[] = cachedFollowees.length ? cachedFollowees : await followerService.getFolloweeData(userObjectId);
    const following: IFollowerData[] = await followerService.getFolloweeData(userObjectId);
    res.status(HTTP_STATUS.OK).json({ message: 'User following', following });
  }

  public async userFollowers(req: Request, res: Response): Promise<void> {
    const userObjectId: ObjectId = new mongoose.Types.ObjectId(req.params.userId);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const cachedFollowers: IFollowerData[] = await followerCache.getFollowersFromCache(`followers:${req.params.userId}`);
    // const followers: IFollowerData[] = cachedFollowers.length ? cachedFollowers : await followerService.getFollowerData(userObjectId);
    const followers: IFollowerData[] = await followerService.getFollowerData(userObjectId);
    res.status(HTTP_STATUS.OK).json({ message: 'User followers', followers });
  }
}
