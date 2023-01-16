import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import mongoose from 'mongoose';
import { MessageCache } from '@service/redis/messageCache';
import { IMessageData } from '@chat/interfaces/chatInterface';
import { socketIOChatObject } from '@socket/chatSocket';
import { chatQueue } from '@service/queues/chatQueue'
import { joiValidation } from '@global/typscript-decorator/joi-validation-decorator';
import { markChatSchema } from '@chat/schemes/chatValidateSchema';

const messageCache: MessageCache = new MessageCache();

// export class Update {
//   @joiValidation(markChatSchema)
//   public async message(req: Request, res: Response): Promise<void> {
//     const { senderId, receiverId } = req.body;
//     const updatedMessage: IMessageData = await messageCache.updateChatMessages(`${senderId}`, `${receiverId}`);
//     socketIOChatObject.emit('message read', updatedMessage);
//     socketIOChatObject.emit('chat list', updatedMessage);
//     chatQueue.addChatJob('markMessagesAsReadInDB', {
//       senderId: new mongoose.Types.ObjectId(senderId),
//       receiverId: new mongoose.Types.ObjectId(receiverId)
//     });
//     res.status(HTTP_STATUS.OK).json({ message: 'Message marked as read' });
//   }
}
