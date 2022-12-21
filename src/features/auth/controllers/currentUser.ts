import { Request, Response } from 'express';
import { UserCache } from '@service/redis/userCache';
import { IUserDocument } from '@user/interfaces/user.interface';
import { userService } from '@service/db/userService';
import HTTP_STATUS from 'http-status-codes';

// const userCache: UserCache = new UserCache();

export class CurrentUser {
  public async read(req: Request, res: Response): Promise<void> {
    let isUser = false;
    let token = null;
    let user = null;
    // const cachedUser: IUserDocument = (await userCache.getUserFromCache(`${req.currentUser!.userId}`)) as IUserDocument;

    // const existingUser: IUserDocument = cachedUser ? cachedUser : await userService.getUserById(`${req.currentUser!.userId}`);
    const existingUser: IUserDocument = await userService.getUserById(`${req.currentUser!.userId}`);
    console.log('DATA BASE USER', existingUser);
    if (Object.keys(existingUser).length) {
      isUser = true;
      token = req.session?.jwt;
      user = existingUser;
    }
    res.status(HTTP_STATUS.OK).json({ token, isUser, user });
  }
}