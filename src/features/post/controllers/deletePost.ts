import { Request, Response } from 'express';
import { PostCache } from '@service/redis/postCache';
import HTTP_STATUS from 'http-status-codes';
import { postQueue } from '@service/queues/postQueue';
import { socketIOPostObject } from '@socket/postSocket';

const postCache: PostCache = new PostCache();

export class DeletePost {
  public async delete(req: Request, res: Response): Promise<void> {
    socketIOPostObject.emit('delete post', req.params.postId);
    await postCache.deletePostFromCache(req.params.postId, `${req.currentUser!.userId}`);
    postQueue.addPostJob('deletePostFromDB', { keyOne: req.params.postId, keyTwo: req.currentUser!.userId });
    res.status(HTTP_STATUS.OK).json({ message: 'Post deleted successfully' });
  }
}
