import { IBlockedUserJobData } from '@follower/interfaces/followersInterface.ts';
import { BaseQueue } from '@service/queues/BaseQueue';
import { blockedUserWorker } from '@worker/blockWorker';

class BlockUserQueue extends BaseQueue {
  constructor() {
    super('followers');
    this.processJob('addBlockUserToDB', 5, blockedUserWorker.addBlockedUserToDB);
  }

  public addBlockUserJob(name: string, data: IBlockedUserJobData): void {
    this.addJob(name, data);
  }
}

export const BlockedUserQueue: BlockUserQueue = new BlockUserQueue();
