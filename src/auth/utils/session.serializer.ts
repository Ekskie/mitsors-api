import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { AuthService } from '../auth.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly authService: AuthService) {
    super();
  }

  serializeUser(user: any, done: Function) {
    done(null, user); // Saving user object to session
  }

  async deserializeUser(payload: any, done: Function) {
    try {
      // In a production app, you might query the DB here by ID
      // const user = await this.authService.findUserById(payload.id);
      return payload ? done(null, payload) : done(null, null);
    } catch (err) {
      done(err, null);
    }
  }
}
