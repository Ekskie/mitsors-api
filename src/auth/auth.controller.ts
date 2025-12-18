import { Controller, All, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { toNodeHandler } from 'better-auth/node';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @All('*')
  async handleAuth(@Req() req, @Res() res) {
    const handler = toNodeHandler(this.authService.auth);
    return handler(req, res);
  }
}
