import express, { Router } from 'express';
import { authMiddleware } from '@global/helpers/authMiddleware';
import { Add } from '@chat/controllers/addChatMessage';
import { Get } from '@chat/controllers/fetchChatList';
import { Delete } from '@chat/controllers/deleteChatMessage';
// import { Update } from '@chat/controllers/update-chat-message';
// import { Message } from '@chat/controllers/add-message-reaction';

class ChatRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.post('/chat/message/add', authMiddleware.checkAuthentication, Add.prototype.message);
    this.router.post('/chat/message/add-chat-users', authMiddleware.checkAuthentication, Add.prototype.addChatUsers);
    this.router.post('/chat/message/remove-chat-users', authMiddleware.checkAuthentication, Add.prototype.removeChatUsers);
    this.router.get('/chat/message/conversation-list', authMiddleware.checkAuthentication, Get.prototype.conversationList);
    this.router.get('/chat/message/user/:receiverId', authMiddleware.checkAuthentication, Get.prototype.messages);
    // this.router.put('/chat/message/mark-as-read', authMiddleware.checkAuthentication, Update.prototype.message);
    // this.router.put('/chat/message/reaction', authMiddleware.checkAuthentication, Message.prototype.reaction);
    this.router.delete(
      '/chat/message/mark-as-deleted/:messageId/:senderId/:receiverId/:type',
      authMiddleware.checkAuthentication,
      Delete.prototype.markMessageAsDeleted
    );

    return this.router;
  }
}

export const chatRoutes: ChatRoutes = new ChatRoutes();
