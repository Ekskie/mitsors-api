import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module'; // This is already here...

@Module({
  imports: [
    DatabaseModule, 
    AuthModule // ...but you need to add it to this list!
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}