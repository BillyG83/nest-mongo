import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const serverUrl = 'http://localhost:8000';
  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('Nest JS rox')
    .setDescription(`base API URL is ${serverUrl}`)
    .setLicense('MIT Open Source', 'https://opensource.org/license/mit')
    .setTermsOfService('https://developers.google.com/terms')
    .addServer(serverUrl)
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // 'api' is url param for swagger docs
  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
