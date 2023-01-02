import { ICommentJob } from '@comment/interfaces/commentInterface';
import { BaseQueue } from '@service/queues/BaseQueue';
import { commentWorker } from '@worker/commentWorker';

class CommentQueue extends BaseQueue {
  constructor() {
    super('comments');
    this.processJob('addCommentToDB', 5, commentWorker.addCommentToDB);
  }

  public addCommentJob(name: string, data: ICommentJob): void {
    this.addJob(name, data);
  }
}

export const commentQueue: CommentQueue = new CommentQueue();
