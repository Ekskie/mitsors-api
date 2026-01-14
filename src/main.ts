import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.setGlobalPrefix('api'); // Better Auth mounts at /api/auth, so global prefix might conflict if not careful.
  // app.setGlobalPrefix('api/v1');
  // Enable CORS to allow requests from your frontend (or localhost during dev)
  app.enableCors({
    origin: ['http://localhost:3000'], // Add your frontend URL here if different
    credentials: true, // Required for cookies (session & state) to work
  });

  // Enable cookie parsing middleware
  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((err) => {
  console.error('Error during bootstrap:', err);
  process.exit(1);
});
