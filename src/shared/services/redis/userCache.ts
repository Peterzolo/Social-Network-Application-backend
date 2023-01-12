import { BaseCache } from '@service/redis/Base-cache';
// import { INotificationSettings, ISocialLinks, IUserDocument } from '@user/interfaces/user.interface';
import Logger from 'bunyan';
import { indexOf, findIndex, values } from 'lodash';
import { config } from '@root/configuration';
import { ServerError } from '@global/helpers/customErrorHandler';
import { Helpers } from '@global/helpers';
import { RedisCommandRawReply } from '@redis/client/dist/lib/commands';
import { IUserDocument } from '@user/interfaces/user.interface';

const log: Logger = config.createLogger('userCache');
// type UserItem = string | ISocialLinks | INotificationSettings;
// type UserCacheMultiType = string | number | Buffer | RedisCommandRawReply[] | IUserDocument | IUserDocument[];

export class UserCache extends BaseCache {
  constructor() {
    super('userCache');
  }

  public async saveUserToCache(key: string, userUId: string, createdUser: IUserDocument): Promise<void> {
    const createdAt = new Date();
    const {
      _id,
      uId,
      username,
      email,
      avatarColor,
      blocked,
      blockedBy,
      postsCount,
      profilePicture,
      followersCount,
      followingCount,
      notifications,
      work,
      location,
      school,
      quote,
      bgImageId,
      bgImageVersion,
      social
    } = createdUser;

    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      await this.client.ZADD('user', { score: parseInt(userUId, 10), value: `${key}` });
      await this.client.HSET(`users: ${key}`, '_id', `${_id}`);
      await this.client.HSET(`users: ${key}`, 'uId', `${uId}`);
      await this.client.HSET(`users: ${key}`, 'username', `${username}`);
      await this.client.HSET(`users: ${key}`, 'email', `${email}`);
      await this.client.HSET(`users: ${key}`, 'blocked', JSON.stringify(blocked));
      await this.client.HSET(`users: ${key}`, 'blockedBy', JSON.stringify(blockedBy));
      await this.client.HSET(`users: ${key}`, 'profilePicture', `${profilePicture}`);
      await this.client.HSET(`users: ${key}`, 'followersCount', `${followersCount}`);
      await this.client.HSET(`users: ${key}`, 'followingCount', `${followingCount}`);
      await this.client.HSET(`users: ${key}`, 'postsCount', `${postsCount}`);
      await this.client.HSET(`users: ${key}`, 'createdAt', `${createdAt}`);
      await this.client.HSET(`users: ${key}`, 'avatarColor', `${avatarColor}`);
      await this.client.HSET(`users: ${key}`, 'notifications', JSON.stringify(notifications));
      await this.client.HSET(`users: ${key}`, 'social', JSON.stringify(social));
      await this.client.HSET(`users: ${key}`, 'work', `${work}`);
      await this.client.HSET(`users: ${key}`, 'location', `${location}`);
      await this.client.HSET(`users: ${key}`, 'school', `${school}`);
      await this.client.HSET(`users: ${key}`, 'bgImageId', `${bgImageId}`);
      await this.client.HSET(`users: ${key}`, 'bgImageVersion', `${bgImageVersion}`);
      await this.client.HSET(`users: ${key}`, 'quote', `${quote}`);
    } catch (error) {
      log.error(error);
      console.log(error);
      throw new ServerError('Server error. Try again.');
    }
  }

  public async getUserFromCache(userId: string): Promise<IUserDocument | null> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }

      const response: IUserDocument = (await this.client.HGETALL(`users:${userId}`)) as unknown as IUserDocument;
      response.createdAt = new Date(Helpers.parseJson(`${response.createdAt}`));
      response.postsCount = Helpers.parseJson(`${response.postsCount}`);
      response.blocked = Helpers.parseJson(`${response.blocked}`);
      response.blockedBy = Helpers.parseJson(`${response.blockedBy}`);
      response.notifications = Helpers.parseJson(`${response.notifications}`);
      response.social = Helpers.parseJson(`${response.social}`);
      response.followersCount = Helpers.parseJson(`${response.followersCount}`);
      response.followingCount = Helpers.parseJson(`${response.followingCount}`);
      response.bgImageId = Helpers.parseJson(`${response.bgImageId}`);
      response.bgImageVersion = Helpers.parseJson(`${response.bgImageVersion}`);
      response.profilePicture = Helpers.parseJson(`${response.profilePicture}`);
      response.work = Helpers.parseJson(`${response.work}`);
      response.school = Helpers.parseJson(`${response.school}`);
      response.location = Helpers.parseJson(`${response.location}`);
      response.quote = Helpers.parseJson(`${response.quote}`);

      return response;
    } catch (error) {
      log.error(error);
      throw new ServerError('Server error. Try again.');
    }
  }

  public async getUsersFromCache(start: number, end: number, excludedUserKey: string): Promise<IUserDocument[]> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      const response: string[] = await this.client.ZRANGE('user', start, end, { REV: true });
      const multi: ReturnType<typeof this.client.multi> = this.client.multi();
      for (const key of response) {
        if (key !== excludedUserKey) {
          multi.HGETALL(`users:${key}`);
        }
      }
      const replies: UserCacheMultiType = (await multi.exec()) as UserCacheMultiType;
      const userReplies: IUserDocument[] = [];
      for (const reply of replies as IUserDocument[]) {
        reply.createdAt = new Date(Helpers.parseJson(`${reply.createdAt}`));
        reply.postsCount = Helpers.parseJson(`${reply.postsCount}`);
        reply.blocked = Helpers.parseJson(`${reply.blocked}`);
        reply.blockedBy = Helpers.parseJson(`${reply.blockedBy}`);
        reply.notifications = Helpers.parseJson(`${reply.notifications}`);
        reply.social = Helpers.parseJson(`${reply.social}`);
        reply.followersCount = Helpers.parseJson(`${reply.followersCount}`);
        reply.followingCount = Helpers.parseJson(`${reply.followingCount}`);
        reply.bgImageId = Helpers.parseJson(`${reply.bgImageId}`);
        reply.bgImageVersion = Helpers.parseJson(`${reply.bgImageVersion}`);
        reply.profilePicture = Helpers.parseJson(`${reply.profilePicture}`);
        reply.work = Helpers.parseJson(`${reply.work}`);
        reply.school = Helpers.parseJson(`${reply.school}`);
        reply.location = Helpers.parseJson(`${reply.location}`);
        reply.quote = Helpers.parseJson(`${reply.quote}`);

        userReplies.push(reply);
      }
      return userReplies;
    } catch (error) {
      log.error(error);
      throw new ServerError('Server error. Try again.');
    }
  }

  // public async getRandomUsersFromCache(userId: string, excludedUsername: string): Promise<IUserDocument[]> {
  //   try {
  //     if (!this.client.isOpen) {
  //       await this.client.connect();
  //     }
  //     const replies: IUserDocument[] = [];
  //     const followers: string[] = await this.client.LRANGE(`followers:${userId}`, 0, -1);
  //     const users: string[] = await this.client.ZRANGE('user', 0, -1);
  //     const randomUsers: string[] = Helpers.shuffle(users).slice(0, 10);
  //     for (const key of randomUsers) {
  //       const followerIndex = indexOf(followers, key);
  //       if (followerIndex < 0) {
  //         const userHash: IUserDocument = (await this.client.HGETALL(`users:${key}`)) as unknown as IUserDocument;
  //         replies.push(userHash);
  //       }
  //     }
  //     const excludedUsernameIndex: number = findIndex(replies, ['username', excludedUsername]);
  //     replies.splice(excludedUsernameIndex, 1);
  //     for (const reply of replies) {
  //       reply.createdAt = new Date(Helpers.parseJson(`${reply.createdAt}`));
  //       reply.postsCount = Helpers.parseJson(`${reply.postsCount}`);
  //       reply.blocked = Helpers.parseJson(`${reply.blocked}`);
  //       reply.blockedBy = Helpers.parseJson(`${reply.blockedBy}`);
  //       reply.notifications = Helpers.parseJson(`${reply.notifications}`);
  //       reply.social = Helpers.parseJson(`${reply.social}`);
  //       reply.followersCount = Helpers.parseJson(`${reply.followersCount}`);
  //       reply.followingCount = Helpers.parseJson(`${reply.followingCount}`);
  //       reply.bgImageId = Helpers.parseJson(`${reply.bgImageId}`);
  //       reply.bgImageVersion = Helpers.parseJson(`${reply.bgImageVersion}`);
  //       reply.profilePicture = Helpers.parseJson(`${reply.profilePicture}`);
  //       reply.work = Helpers.parseJson(`${reply.work}`);
  //       reply.school = Helpers.parseJson(`${reply.school}`);
  //       reply.location = Helpers.parseJson(`${reply.location}`);
  //       reply.quote = Helpers.parseJson(`${reply.quote}`);
  //     }
  //     return replies;
  //   } catch (error) {
  //     log.error(error);
  //     throw new ServerError('Server error. Try again.');
  //   }
  // }

  // public async updateSingleUserItemInCache(userId: string, prop: string, value: UserItem): Promise<IUserDocument | null> {
  //   try {
  //     if (!this.client.isOpen) {
  //       await this.client.connect();
  //     }
  //     const dataToSave: string[] = [`${prop}`, JSON.stringify(value)];
  //     await this.client.HSET(`users:${userId}`, dataToSave);
  //     const response: IUserDocument = (await this.getUserFromCache(userId)) as IUserDocument;
  //     return response;
  //   } catch (error) {
  //     log.error(error);
  //     throw new ServerError('Server error. Try again.');
  //   }
  // }

  // public async getTotalUsersInCache(): Promise<number> {
  //   try {
  //     if (!this.client.isOpen) {
  //       await this.client.connect();
  //     }
  //     const count: number = await this.client.ZCARD('user');
  //     return count;
  //   } catch (error) {
  //     log.error(error);
  //     throw new ServerError('Server error. Try again.');
  //   }
  // }
}
