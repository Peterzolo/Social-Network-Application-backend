import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import { UserCache } from '@service/redis/userCache';
import { joiValidation } from '@global/typscript-decorator/joi-validation-decorator';
import { addImageSchema } from '@image/schemes/imageValidationScheme';
import { uploads } from '@global/helpers/cloudinary-upload';
import { UploadApiResponse } from 'cloudinary';
import { BadRequestError } from '@global/helpers/customErrorHandler';
import { IUserDocument } from '@user/interfaces/user.interface';
import { socketIOImageObject } from '@socket/imageSocket';
import { imageQueue } from '@service/queues/imageQueue';
import { IBgUploadResponse } from '@image/interfaces/imageInterface';
import { Helpers } from '@global/helpers';

const userCache: UserCache = new UserCache();

export class Add {}
