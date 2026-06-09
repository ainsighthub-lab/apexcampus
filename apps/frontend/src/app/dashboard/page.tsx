'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, Course, Enrollment } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getEnrollments().catch(() => []),
      api.getCourses({ page: 1 }).catch(() => ({ courses: [], total: 0 })),
    ]).then(([enrs, crs]) => {
      setEnrollments(enrs);
      setCourses(crs.courses);
    }).finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: 'Active Courses', value: enrollments.filter(e => e.status === 'ACTIVE').length, icon: '📚' },
    { label: 'Courses Available', value: courses.length, icon: '🎯' },
    { label: 'Avg Progress', value: enrollments.length ? Math.round(enrollments.reduce((a, e) => a + e.progressPercent, 0) / enrollments.length) + '%' : '0%', icon: '📈' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-slate-400 mb-8">Welcome back to ApexCampus</p>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <span>{stat.icon}</span>
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-purple-400">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* My Courses */}
      <h2 className="text-xl font-semibold mb-4">My Courses</h2>
      {loading ? (
        <p className="text-slate-500">Loading...</p>
      ) : enrollments.length === 0 ? (
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="py-8 text-center">
            <p className="text-slate-400 mb-4">You haven't enrolled in any courses yet.</p>
            <Link href="/dashboard/courses">
              <Button className="bg-purple-600 hover:bg-purple-700">Browse Courses</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {enrollments.map((enr) => (
            <Link key={enr.id} href={`/dashboard/courses/${enr.course.slug}`}>
              <Card className="bg-slate-900 border-slate-800 hover:border-purple-600 transition-colors cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="text-lg">{enr.course.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm text-slate-400 mb-2">
                    <span>Progress</span>
                    <span>{enr.progressPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all"
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
  );
}
