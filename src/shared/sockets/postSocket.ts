// import { ICommentDocument } from '@comment/interfaces/comment.interface';
// import { IReactionDocument } from '@reaction/interfaces/reaction.interface';
import { Server, Socket } from 'socket.io';

export let socketIOPostObject: Server;

export class SocketIOPostHandler {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
    socketIOPostObject = io;
  }

  public listen(): void {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.io.on('connection', (_socket: Socket) => {
      // socket.on('reaction', (reaction: IReactionDocument) => {
      // this.io.emit('update like', reaction);

      console.log('Socket OI connection');
    });

    // socket.on('comment', (data: ICommentDocument) => {
    //   this.io.emit('update comment', data);
    // });
    // });
  }
}