import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: { page: number; limit: number; category?: string; level?: string }) {
    const { page, limit, category, level } = params;
    const where: any = { isPublished: true };

    if (category) where.category = category;
    if (level) where.level = level;

    const [courses, total] = await Promise.all([
      this.prisma.course.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.course.count({ where }),
    ]);

    return { courses, total, page, limit };
  }

  async findBySlug(slug: string) {
    const course = await this.prisma.course.findUnique({
      where: { slug },
      include: {
        modules: {
          orderBy: { sortOrder: 'asc' },
          include: {
            lessons: { orderBy: { sortOrder: 'asc' } },
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }
    return course;
  }

  async enroll(userId: string, courseId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course || !course.isPublished) {
      throw new NotFoundException('Course not found');
    }

    const existing = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });

    if (existing) {
      return existing;
    }

    return this.prisma.enrollment.create({
      data: {
        userId,
        courseId,
        status: 'ACTIVE',
      },
    });
  }

  async getUserEnrollments(userId: string) {
    return this.prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: true,
      },
      orderBy: { startedAt: 'desc' },
    });
  }

  async create(
    dto: {
      title: string;
      slug: string;
      description: string;
      level: string;
      category: string;
      thumbnailUrl?: string;
    },
    role: string = 'ADMIN',
  ) {
    if (role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can create courses');
    }

    return this.prisma.course.create({
      data: {
        title: dto.title,
        slug: dto.slug,
        description: dto.description,
        level: dto.level,
        category: dto.category,
        thumbnailUrl: dto.thumbnailUrl || null,
      },
    });
  }
}
