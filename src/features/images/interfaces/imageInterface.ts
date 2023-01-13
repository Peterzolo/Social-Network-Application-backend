import mongoose from 'mongoose';

export interface IFileImageDocument extends mongoose.Document {
  userId: mongoose.Types.ObjectId | string;
  bgImageVersion: string;
  bgImageId: string;
  imgId: string;
  imgVersion: string;
  createdAt: Date;
}
