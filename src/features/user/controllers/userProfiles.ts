import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import { FollowerCache } from '@service/redis/followerCache';
import { PostCache } from '@service/redis/postCache';
import { UserCache } from '@service/redis/userCache';
import { IAllUsers, IUserDocument } from '@user/interfaces/user.interface';
import { userService } from '@service/db/userService';
import { IFollowerData } from '@follower/interfaces/followersInterface.ts';
import { followerService } from '@service/db/followerService';
import mongoose from 'mongoose';
import { Helpers } from '@global/helpers';
import { IPostDocument } from '@post/interfaces/postInterface';
import { postService } from '@service/db/postService';

const PAGE_SIZE = 10;
