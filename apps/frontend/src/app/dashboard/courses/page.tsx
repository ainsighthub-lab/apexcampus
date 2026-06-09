'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, Course } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, ArrowRight } from 'lucide-react';

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
    <div className="space-y-6 animate-fade-in">
      <div className="animate-slide-up">
        <h1 className="text-2xl font-heading font-bold text-foreground">Course Catalog</h1>
        <p className="text-sm text-muted-foreground mt-1">{total} courses available</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 animate-slide-up stagger-2">
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={category === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => { setCategory(cat); setPage(1); }}
              className={category === cat ? 'bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:text-foreground'}
            >
              {cat}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {levels.map((lvl) => (
            <Button
              key={lvl}
              variant={level === lvl ? 'default' : 'outline'}
              size="sm"
              onClick={() => { setLevel(lvl); setPage(1); }}
              className={level === lvl ? 'bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:text-foreground'}
            >
              {lvl === 'All' ? 'All Levels' : lvl}
            </Button>
          ))}
        </div>
      </div>

      {/* Course Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="glass border-0 animate-pulse">
              <CardContent className="p-5">
                <div className="h-4 bg-muted rounded w-3/4 mb-3" />
                <div className="h-3 bg-muted/60 rounded w-1/2 mb-4" />
                <div className="h-3 bg-muted/40 rounded w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <Card className="glass border-0">
          <CardContent className="py-12 text-center">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-7 w-7 text-primary" />
            </div>
            <p className="text-foreground font-medium mb-1">No courses found</p>
            <p className="text-muted-foreground text-sm">Try adjusting your filters</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course, i) => (
              <Link key={course.id} href={`/dashboard/courses/${course.slug}`}>
                <Card className={`glass glass-hover border-0 transition-all duration-300 animate-slide-up stagger-${Math.min(i + 1, 5)} group cursor-pointer h-full flex flex-col`}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base text-foreground group-hover:text-primary transition-colors">{course.title}</CardTitle>
                      <Badge variant="secondary" className="shrink-0 text-xs bg-primary/10 text-primary border-primary/20">
                        {course.level}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-end">
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{course.description}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs border-border text-muted-foreground">{course.category}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {total > limit && (
            <div className="flex justify-center gap-2 pt-4">
              <Button variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)} className="border-border">
                ← Previous
              </Button>
              <span className="flex items-center text-muted-foreground px-4 text-sm">
                Page {page} of {Math.ceil(total / limit)}
              </span>
              <Button variant="outline" disabled={page >= Math.ceil(total / limit)} onClick={() => setPage(p => p + 1)} className="border-border">
                Next →
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
