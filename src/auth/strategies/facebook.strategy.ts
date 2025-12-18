import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-facebook';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.FACEBOOK_APP_ID || 'YOUR_APP_ID',
      clientSecret: process.env.FACEBOOK_APP_SECRET || 'YOUR_APP_SECRET',
      callbackURL: 'http://localhost:3000/api/auth/signin/facebook/redirect',
      scope: ['email'],
      profileFields: ['emails', 'name', 'photos'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const { name, emails, photos, id } = profile;
    const user = await this.authService.validateUser({
      email: emails?.[0]?.value || '',
      displayName: name ? `${name.givenName} ${name.familyName}` : 'User',
      provider: 'facebook',
      providerId: id,
      picture: photos?.[0]?.value,
    });
    return user || null;
  }
}
