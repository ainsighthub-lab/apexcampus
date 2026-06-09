'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, Course } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const categories = ['All', 'AI', 'ML', 'Data Science', 'DevOps', 'Web Dev'];
const levels = ['All', 'beginner', 'intermediate', 'advanced'];

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [level, setLevel] = useState('All');
  const [page, setPage] = useState(1);
  const limit = 12;

  useEffect(() => {
    setLoading(true);
    api.getCourses({
      page,
      category: category === 'All' ? undefined : category,
      level: level === 'All' ? undefined : level,
    }).then((res) => {
      setCourses(res.courses);
      setTotal(res.total);
    }).finally(() => setLoading(false));
  }, [category, level, page]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Course Catalog</h1>
      <p className="text-slate-400 mb-6">{total} courses available</p>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <div className="flex flex-wrap gap-1">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={category === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => { setCategory(cat); setPage(1); }}
              className={category === cat ? 'bg-purple-600' : 'border-slate-700 text-slate-400'}
            >
              {cat}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1">
          {levels.map((lvl) => (
            <Button
              key={lvl}
              variant={level === lvl ? 'default' : 'outline'}
              size="sm"
              onClick={() => { setLevel(lvl); setPage(1); }}
              className={level === lvl ? 'bg-purple-600' : 'border-slate-700 text-slate-400'}
            >
              {lvl === 'All' ? 'All Levels' : lvl}
            </Button>
          ))}
        </div>
      </div>

      {/* Course Grid */}
      {loading ? (
        <p className="text-slate-500">Loading courses...</p>
      ) : courses.length === 0 ? (
        <Card className="bg-slate-900 border-slate-800 col-span-full">
          <CardContent className="py-12 text-center text-slate-500">
            No courses found matching your filters.
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {courses.map((course) => (
              <Link key={course.id} href={`/dashboard/courses/${course.slug}`}>
                <Card className="bg-slate-900 border-slate-800 hover:border-purple-600 transition-colors cursor-pointer h-full flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <Badge variant="outline" className="shrink-0 border-purple-600 text-purple-400">
                        {course.level}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-end">
                    <p className="text-sm text-slate-400 line-clamp-2 mb-2">
                      {course.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-slate-800 text-xs">
                        {course.category}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {total > limit && (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="border-slate-700"
              >
                ← Previous
              </Button>
              <span className="flex items-center text-slate-400 px-4">
                Page {page} of {Math.ceil(total / limit)}
              </span>
              <Button
                variant="outline"
                disabled={page >= Math.ceil(total / limit)}
                onClick={() => setPage(p => p + 1)}
                className="border-slate-700"
              >
                Next →
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
