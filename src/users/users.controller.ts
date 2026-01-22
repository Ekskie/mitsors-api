import { Controller, Get, Patch, Body, Param, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/guards/auth.guards';

@Controller('users')
@UseGuards(AuthGuard) // This secures ALL routes in this controller
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getProfile(@Req() req: any) {
    const userId = req.user?.id; // Get the ID from the logged-in session
    if (!userId) throw new UnauthorizedException();
    return this.usersService.getProfile(userId);
  }

  @Patch('profile')
  async updateProfile(@Req() req: any, @Body() updateData: any) {
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedException();
    return this.usersService.updateProfile(userId, updateData);
  }

  @Get('submissions')
  async getSubmissions(@Req() req: any) {
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedException();
    return this.usersService.getSubmissions(userId);
  }

  @Get('submissions/:id')
  async getSubmissionById(@Req() req: any, @Param('id') submissionId: string) {
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedException();
    return this.usersService.getSubmissionById(userId, submissionId);
  }
}