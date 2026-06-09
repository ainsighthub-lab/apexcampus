import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/v1/courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '12',
    @Query('category') category?: string,
    @Query('level') level?: string,
  ) {
    return this.coursesService.findAll({
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      category,
      level,
    });
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.coursesService.findBySlug(slug);
  }

  @Post(':id/enroll')
  @UseGuards(JwtAuthGuard)
  enroll(@Param('id') id: string, @Req() req: any) {
    return this.coursesService.enroll(req.user.id, id);
  }

  @Get('user/enrollments')
  @UseGuards(JwtAuthGuard)
  getUserEnrollments(@Req() req: any) {
    return this.coursesService.getUserEnrollments(req.user.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: any, @Req() req: any) {
    return this.coursesService.create(dto, req.user.role);
  }
}
