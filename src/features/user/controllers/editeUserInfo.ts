import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import { UserCache } from '@service/redis/userCache';
import { userQueue } from '@service/queues/userQueue';
import { joiValidation } from '@global/typscript-decorator/joi-validation-decorator';
import { basicInfoSchema, socialLinksSchema } from '@user/schemes/userValidateSchema';

const userCache: UserCache = new UserCache();

export class EditUser {
  @joiValidation(basicInfoSchema)
  public async basicInfo(req: Request, res: Response): Promise<void> {
    for (const [key, value] of Object.entries(req.body)) {
      await userCache.updateSingleUserItemInCache(`${req.currentUser!.userId}`, key, `${value}`);
    }
    userQueue.addUserJob('updateBasicInfoInDB', {
      key: `${req.currentUser!.userId}`,
      value: req.body
    });
    res.status(HTTP_STATUS.OK).json({ message: 'Updated successfully' });
  }
  @joiValidation(socialLinksSchema)
  public async socialLinks(req: Request, res: Response): Promise<void> {
    await userCache.updateSingleUserItemInCache(`${req.currentUser!.userId}`, 'social', req.body);
    userQueue.addUserJob('updateSocialLinksInDB', {
      key: `${req.currentUser!.userId}`,
      value: req.body
    });
    res.status(HTTP_STATUS.OK).json({ message: 'Updated successfully' });
  }
}
