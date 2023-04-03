import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {doc} from "prettier";
import { join } from 'path';
import {NestExpressApplication} from "@nestjs/platform-express";
import {createClient} from "redis";
import {RedisIoAdapter} from "./redisioadapter";

async function bootstrap() {
  //const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);


  app.useStaticAssets(join(__dirname, '..', 'static'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');



  await app.listen(3000);


}
bootstrap();
