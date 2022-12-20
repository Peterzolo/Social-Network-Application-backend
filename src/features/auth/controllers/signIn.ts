import { Request, Response } from 'express';
import { config } from '@root/configuration';
import JWT from 'jsonwebtoken';
import { joiValidation } from '@global/typscript-decorator/joi-validation-decorator';
import HTTP_STATUS from 'http-status-codes';
import { authService } from '@service/db/authService';
import { IAuthDocument } from '@auth/interfaces/auth-interface';
import { BadRequestError } from '@global/helpers/customErrorHandler';
import { userService } from '@service/db/userService';
import { IUserDocument } from '@user/interfaces/user.interface';
import { loginSchema } from '@auth/schemes/login';

export class LogIn {
  @joiValidation(loginSchema)
  public async read(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body;
    const existingUser: IAuthDocument = await authService.getAuthUserByUsername(username);
    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }

    const passwordsMatch: boolean = await existingUser.comparePassword(password);
    if (!passwordsMatch) {
      throw new BadRequestError('Invalid credentials');
    }
    const user: IUserDocument = await userService.getUserByAuthId(`${existingUser._id}`);
    console.log('USER', user);
    const userJwt: string = JWT.sign(
      {
        userId: user._id,
        uId: existingUser.uId,
        email: existingUser.email,
        username: existingUser.username,
        avatarColor: existingUser.avatarColor
      },
      config.JWT_TOKEN_SECRET!
    );
    req.session = { jwt: userJwt };
    const userDocument: IUserDocument = {
      ...user,
      authId: existingUser!._id,
      username: existingUser!.username,
      email: existingUser!.email,
      avatarColor: existingUser!.avatarColor,
      uId: existingUser!.uId,
      createdAt: existingUser!.createdAt
    } as IUserDocument;
    res.status(HTTP_STATUS.OK).json({ message: 'User logged in successfully', user: userDocument, token: userJwt });
  }
}
