import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DrizzleService } from './drizzle.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    DrizzleService,
    {
      provide: 'DRIZZLE',
      useFactory: async (drizzleService: DrizzleService) => {
        if (!drizzleService.db) {
          await drizzleService.onModuleInit();
        }
        return drizzleService.db;
      },
      inject: [DrizzleService],
    },
  ],
  exports: [DrizzleService, 'DRIZZLE'],
})
export class DatabaseModule {}
