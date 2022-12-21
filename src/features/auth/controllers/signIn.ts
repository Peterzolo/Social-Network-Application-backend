import { Request, Response } from 'express';
import { config } from '@root/configuration';
import JWT from 'jsonwebtoken';
import { joiValidation } from '@global/typscript-decorator/joi-validation-decorator';
import HTTP_STATUS from 'http-status-codes';
import { authService } from '@service/db/authService';
import { IAuthDocument } from '@auth/interfaces/auth-interface';
import { BadRequestError } from '@global/helpers/customErrorHandler';
import { userService } from '@service/db/userService';
import { IResetPasswordParams, IUserDocument } from '@user/interfaces/user.interface';
import { loginSchema } from '@auth/schemes/login';
import { forgotPasswordTemplate } from '@service/email/email-template/forgot-password/forgotPasswordTemplate';
import { emailQueue } from '@service/queues/emailQueues';
import moment from 'moment';
import publicIp from 'ip';
import { resetPasswordTemplate } from '@service/email/email-template/password-reset/resetPassword';

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

    const templateParams: IResetPasswordParams = {
      username: existingUser.username,
      email: existingUser.email,
      ipaddress: publicIp.address(),
      date: moment().format('DD/MM/YYY')
    };
    const template: string = resetPasswordTemplate.passwordResetConfirmationTemplate(templateParams);
    emailQueue.addEmailJob('forgotPasswordEmail', {
      template,
      receiverEmail: 'petersolo2@gmail.com',
      subject: 'Testing Password Reset Confirmation'
    });

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
