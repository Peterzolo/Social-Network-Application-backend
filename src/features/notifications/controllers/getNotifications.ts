import { INotificationDocument } from '@notification/interfaces/notificationInterface';
import { notificationService } from '@service/db/notificationService';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

export class Get {
  public async notifications(req: Request, res: Response): Promise<void> {
    const notifications: INotificationDocument[] = await notificationService.getNotifications(req.currentUser!.userId);

    if (!notifications.length) {
      res.status(401).send({ message: 'No Notification found' });
    } else {
      res.status(HTTP_STATUS.OK).json({ message: 'User notifications', notifications });
    }
  }
}
