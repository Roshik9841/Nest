import { Module } from '@nestjs/common';
import { CourseController } from './courses.controller';
import { CourseService } from './courses.service';

@Module({
  controllers: [CourseController],
  providers: [CourseService]
})
export class CourseModule {}
