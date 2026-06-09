import { Test, TestingModule } from '@nestjs/testing';
import { CoursesService } from './courses.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('CoursesService', () => {
  let service: CoursesService;
  let prisma: PrismaService;

  const mockPrisma = {
    course: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    enrollment: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    module: {
      findMany: jest.fn(),
    },
    lesson: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<CoursesService>(CoursesService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return published courses', async () => {
      const courses = [{ id: 'c1', title: 'Course 1', isPublished: true }];
      mockPrisma.course.findMany.mockResolvedValue(courses);
      mockPrisma.course.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 1, limit: 10 });
      expect(result.courses).toEqual(courses);
      expect(result.total).toBe(1);
      expect(mockPrisma.course.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { isPublished: true } }),
      );
    });
  });

  describe('findBySlug', () => {
    it('should return a course by slug with modules', async () => {
      const course = { id: 'c1', title: 'Course 1', slug: 'course-1', modules: [] };
      mockPrisma.course.findUnique.mockResolvedValue(course);

      const result = await service.findBySlug('course-1');
      expect(result).toEqual(course);
    });

    it('should throw NotFoundException if not found', async () => {
      mockPrisma.course.findUnique.mockResolvedValue(null);
      await expect(service.findBySlug('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('enroll', () => {
    it('should enroll a user in a course', async () => {
      mockPrisma.course.findUnique.mockResolvedValue({ id: 'c1', isPublished: true });
      mockPrisma.enrollment.findUnique.mockResolvedValue(null);
      mockPrisma.enrollment.create.mockResolvedValue({
        id: 'e1',
        userId: 'u1',
        courseId: 'c1',
        status: 'ACTIVE',
      });

      const result = await service.enroll('u1', 'c1');
      expect(result.status).toBe('ACTIVE');
    });

    it('should throw NotFoundException if course not found', async () => {
      mockPrisma.course.findUnique.mockResolvedValue(null);
      await expect(service.enroll('u1', 'c1')).rejects.toThrow(NotFoundException);
    });

    it('should not allow enrolling in unpublished course', async () => {
      mockPrisma.course.findUnique.mockResolvedValue({ id: 'c1', isPublished: false });
      await expect(service.enroll('u1', 'c1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getUserEnrollments', () => {
    it('should return user enrollments with course data', async () => {
      const enrollments = [
        {
          id: 'e1',
          course: { id: 'c1', title: 'Course 1' },
          progressPercent: 50,
        },
      ];
      mockPrisma.enrollment.findMany.mockResolvedValue(enrollments);

      const result = await service.getUserEnrollments('u1');
      expect(result).toEqual(enrollments);
    });
  });

  describe('create (admin)', () => {
    it('should create a new course', async () => {
      const dto = {
        title: 'New Course',
        slug: 'new-course',
        description: 'Description',
        level: 'beginner',
        category: 'AI',
      };
      mockPrisma.course.create.mockResolvedValue({ id: 'c1', ...dto });

      const result = await service.create(dto);
      expect(result.title).toBe('New Course');
      expect(mockPrisma.course.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ slug: 'new-course' }),
      });
    });

    it('should throw if not admin', async () => {
      await expect(service.create({ title: '', slug: '', description: '', level: '', category: '' }, 'STUDENT'))
        .rejects.toThrow(ForbiddenException);
    });
  });
});
