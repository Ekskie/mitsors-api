import { Controller, All, Req, Res, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { toNodeHandler } from 'better-auth/node';
import type { Request, Response } from 'express';

// 2. Remove 'api/' because 'api/v1' is now handled globally in main.ts
// This results in: /api/v1/auth
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @All('*splat')
  async handleAuth(@Req() req: Request, @Res() res: Response) {
    this.logger.log(`Handling Auth Request: ${req.method} ${req.originalUrl}`);

    const authNodeHandler = toNodeHandler(this.authService.auth);
    return authNodeHandler(req, res);
  }
}
