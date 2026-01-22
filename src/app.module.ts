import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import path from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { PricesModule } from './prices/prices.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module'; // Combined from users-api-postgres

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.join(__dirname, '../.env'),
    }),
    DatabaseModule,
    PricesModule,
    AuthModule,
    UsersModule, // Combined from users-api-postgres
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}