'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, Course, Enrollment } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Trophy, TrendingUp, ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getEnrollments().catch(() => []),
      api.getCourses({ page: 1 }).catch(() => ({ courses: [], total: 0 })),
    ]).then(([enrs, crs]) => {
      setEnrollments(enrs as Enrollment[]);
      setCourses((crs as { courses: Course[] }).courses);
    }).finally(() => setLoading(false));
  }, []);

  const stats = [
    {
      label: 'Active Courses',
      value: loading ? '...' : enrollments.filter(e => e.status === 'ACTIVE').length,
      icon: BookOpen,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: 'Available Courses',
      value: loading ? '...' : courses.length,
      icon: Trophy,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
    {
      label: 'Avg Progress',
      value: loading ? '...' : enrollments.length
        ? Math.round(enrollments.reduce((a, e) => a + e.progressPercent, 0) / enrollments.length) + '%'
        : '0%',
      icon: TrendingUp,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="animate-slide-up">
        <h1 className="text-2xl font-heading font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Welcome back! Continue your learning journey.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <Card key={stat.label} className={`glass glass-hover border-0 animate-slide-up stagger-${i + 1} transition-all duration-300`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <div className={`h-8 w-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-heading font-bold text-foreground">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* My Courses */}
      <div className="animate-slide-up stagger-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-heading font-semibold text-foreground">My Courses</h2>
          <Link href="/dashboard/courses">
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 text-xs">
              Browse All <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <Card key={i} className="glass border-0 animate-pulse">
                <CardContent className="p-5">
                  <div className="h-4 bg-muted rounded w-3/4 mb-3" />
                  <div className="h-3 bg-muted/60 rounded w-1/2 mb-4" />
                  <div className="h-2 bg-muted/40 rounded w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : enrollments.length === 0 ? (
          <Card className="glass border-0">
            <CardContent className="py-12 text-center">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-7 w-7 text-primary" />
              </div>
              <p className="text-foreground font-medium mb-1">No enrollments yet</p>
              <p className="text-muted-foreground text-sm mb-4">Browse our courses and start learning</p>
              <Link href="/dashboard/courses">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <BookOpen className="h-4 w-4 mr-2" /> Browse Courses
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {enrollments.map((enr, i) => (
              <Link key={enr.id} href={`/dashboard/courses/${enr.course.slug}`}>
                <Card className={`glass glass-hover border-0 transition-all duration-300 animate-slide-up stagger-${Math.min(i + 1, 5)} group cursor-pointer h-full`}>
                  <CardHeader>
                    <CardTitle className="text-base text-foreground group-hover:text-primary transition-colors">{enr.course.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between text-sm text-muted-foreground mb-2">
                      <span>Progress</span>
                      <span className="font-medium text-foreground">{enr.progressPercent}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-primary to-emerald-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${enr.progressPercent}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
