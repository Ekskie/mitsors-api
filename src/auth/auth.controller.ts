import { Controller, All, Req, Res, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { toNodeHandler } from 'better-auth/node';
import type { Request, Response } from 'express';

@Controller('api/auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  // The wildcard '*' is deprecated in newer path-to-regexp versions.
  // We use '*splat' (or just '*path') to capture the rest of the URL dynamically.
  @All('*splat')
  async handleAuth(@Req() req: Request, @Res() res: Response) {
    this.logger.log(`Handling Auth Request: ${req.method} ${req.originalUrl}`);

    // Better Auth expects the request to be handled by its node handler.
    // We pass the native Node.js req/res objects (which Express req/res extend).
    const authNodeHandler = toNodeHandler(this.authService.auth);
    return authNodeHandler(req, res);
  }
}
