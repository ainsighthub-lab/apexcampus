import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CoursesModule } from './courses/courses.module';
import { MentorModule } from './mentor/mentor.module';

@Module({
  imports: [PrismaModule, AuthModule, CoursesModule, MentorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
