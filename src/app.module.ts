import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthenticationMiddleware } from './users/middlware/authentication.guard';
import { RedisService } from './redis.service';

@Module({
  imports: [UsersModule],
  controllers: [AppController],
  providers: [AppService,RedisService],
})
export class AppModule {
 
}
