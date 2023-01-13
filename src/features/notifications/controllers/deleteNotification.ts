import { notificationQueue } from '@service/queues/notificationQueue';
import { socketIONotificationObject } from '@socket/notificationSocket';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

export class Delete {
  public async notification(req: Request, res: Response): Promise<void> {
    const { notificationId } = req.params;
    socketIONotificationObject.emit('delete notification', notificationId);
    notificationQueue.addNotificationJob('deleteNotification', { key: notificationId });
    res.status(HTTP_STATUS.OK).json({ message: 'Notification deleted successfully' });
  }
}