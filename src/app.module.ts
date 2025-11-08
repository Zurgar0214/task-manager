import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TaskController } from './ui/task.controller';
import { UiController } from './ui/ui.controller';
import { TaskService } from './app/task.service';
import { TaskSchema } from './schemas/task.schema';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
    }),
    MongooseModule.forFeature([{ name: 'Task', schema: TaskSchema }]),
  ],
  controllers: [TaskController, UiController],
  providers: [TaskService],
})
export class AppModule {}
