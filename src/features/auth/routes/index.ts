// import { Password } from '@auth/controllers/password';
import { Password } from '@auth/controllers/password';
import { LogIn } from '@auth/controllers/signIn';
import { SignOut } from '@auth/controllers/signOut';
import { SignUp } from '@auth/controllers/signup';
import express, { Router } from 'express';

class AuthRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.post('/register', SignUp.prototype.create);
    this.router.post('/login', LogIn.prototype.read);
    this.router.post('/forgot-password', Password.prototype.create);
    // this.router.post('/reset-password/:token', Password.prototype.update);

    return this.router;
  }

  public signoutRoute(): Router {
    this.router.get('/logout', SignOut.prototype.update);

    return this.router;
  }
}

export const authRoutes: AuthRoutes = new AuthRoutes();
