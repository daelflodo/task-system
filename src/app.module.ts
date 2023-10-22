import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import * as joi from 'joi';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal:true,
    validationSchema: joi.object({
      PORT: joi.number().required(),
      DATABASE_URL: joi.string().required(),
    }),
  }), TasksModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
