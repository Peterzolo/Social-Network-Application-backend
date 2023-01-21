import { joiValidation } from '@global/typscript-decorator/joi-validation-decorator';
import { postSchema, postWithImageSchema, postWithVideoSchema } from '@post/schemes/post.validateSchema';
import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import HTTP_STATUS from 'http-status-codes';
import { IPostDocument } from '@post/interfaces/postInterface';
import { PostCache } from '@service/redis/postCache';
import { socketIOPostObject } from '@socket/postSocket';
import { postQueue } from '@service/queues/postQueue';
import { UploadApiResponse } from 'cloudinary';
import { BadRequestError } from '@global/helpers/customErrorHandler';
import { uploads, videoUpload } from '@global/helpers/cloudinary-upload';
import { imageQueue } from '@service/queues/imageQueue';

const postCache: PostCache = new PostCache();

export class CreatePost {
  @joiValidation(postSchema)
  public async create(req: Request, res: Response): Promise<void> {
    const { post, bgColor, privacy, gifUrl, profilePicture, feelings } = req.body;
    const postObjectId: ObjectId = new ObjectId();
    const createdPost: IPostDocument = {
      _id: postObjectId,
      userId: req.currentUser!.userId,
      username: req.currentUser!.username,
      email: req.currentUser!.email,
      avatarColor: req.currentUser!.avatarColor,
      profilePicture,
      post,
      bgColor,
      feelings,
      privacy,
      gifUrl,
      commentsCount: 0,
      imgVersion: '',
      imgId: '',
      videoId: '',
      videoVersion: '',
      createdAt: new Date(),
      reactions: { like: 0, love: 0, happy: 0, sad: 0, wow: 0, angry: 0 }
    } as unknown as IPostDocument;
    socketIOPostObject.emit('add post', createdPost);
    await postCache.savePostToCache({
      key: postObjectId,
      currentUserId: `${req.currentUser!.userId}`,
      uId: `${req.currentUser!.uId}`,
      createdPost
    });
    postQueue.addPostJob('addPostToDB', { key: req.currentUser!.userId, value: createdPost });
    res.status(HTTP_STATUS.CREATED).json({ message: 'Post created successfully' });
  }

  @joiValidation(postWithImageSchema)
  public async postWithImage(req: Request, res: Response): Promise<void> {
    const { post, bgColor, privacy, gifUrl, profilePicture, feelings, image } = req.body;

    const result: UploadApiResponse = (await uploads(image)) as UploadApiResponse;
    if (!result?.public_id) {
      throw new BadRequestError(result.message);
    }

    const postObjectId: ObjectId = new ObjectId();
    const createdPost: IPostDocument = {
      _id: postObjectId,
      userId: req.currentUser!.userId,
      username: req.currentUser!.username,
      email: req.currentUser!.email,
      avatarColor: req.currentUser!.avatarColor,
      profilePicture,
      post,
      bgColor,
      feelings,
      privacy,
      gifUrl,
      commentsCount: 0,
      imgVersion: result.version.toString(),
      imgId: result.public_id,
      videoId: '',
      videoVersion: '',
      createdAt: new Date(),
      reactions: { like: 0, love: 0, happy: 0, sad: 0, wow: 0, angry: 0 }
    } as unknown as IPostDocument;
    socketIOPostObject.emit('add post', createdPost);
    await postCache.savePostToCache({
      key: postObjectId,
      currentUserId: `${req.currentUser!.userId}`,
      uId: `${req.currentUser!.uId}`,
      createdPost
    });
    postQueue.addPostJob('addPostToDB', { key: req.currentUser!.userId, value: createdPost });
    imageQueue.addImageJob('addImageToDB', {
      key: `${req.currentUser!.userId}`,
      imgId: result.public_id,
      imgVersion: result.version.toString()
    });
    res.status(HTTP_STATUS.CREATED).json({ message: 'Post created with image successfully' });
  }

  @joiValidation(postWithVideoSchema)
  public async postWithVideo(req: Request, res: Response): Promise<void> {
    const { post, bgColor, privacy, gifUrl, profilePicture, feelings, video } = req.body;

    const result: UploadApiResponse = (await videoUpload(video)) as UploadApiResponse;
    if (!result?.public_id) {
      throw new BadRequestError(result.message);
    }

      const postObjectId: ObjectId = new ObjectId();
      const createdPost: IPostDocument = {
        _id: postObjectId,
        userId: req.currentUser!.userId,
        username: req.currentUser!.username,
        email: req.currentUser!.email,
        avatarColor: req.currentUser!.avatarColor,
        profilePicture,
        post,
        bgColor,
        feelings,
        privacy,
        gifUrl,
        commentsCount: 0,
        imgVersion: '',
        imgId: '',
    //     videoId: result.public_id,
    //     videoVersion: result.version.toString(),
    //     createdAt: new Date(),
    //     reactions: { like: 0, love: 0, happy: 0, sad: 0, wow: 0, angry: 0 }
    //   } as IPostDocument;
    //   socketIOPostObject.emit('add post', createdPost);
    //   await postCache.savePostToCache({
    //     key: postObjectId,
    //     currentUserId: `${req.currentUser!.userId}`,
    //     uId: `${req.currentUser!.uId}`,
    //     createdPost
    //   });
    //   postQueue.addPostJob('addPostToDB', { key: req.currentUser!.userId, value: createdPost });
    //   res.status(HTTP_STATUS.CREATED).json({ message: 'Post created with video successfully' });
  }
}
