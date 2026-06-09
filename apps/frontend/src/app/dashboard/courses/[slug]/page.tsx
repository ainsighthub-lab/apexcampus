'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api, Course } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function CourseDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!slug) return;
    api.getCourseBySlug(slug)
      .then(setCourse)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleEnroll = async () => {
    if (!course) return;
    setEnrolling(true);
    try {
      await api.enroll(course.id);
      setEnrolled(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <p className="text-slate-500">Loading course...</p>;
  if (error) return <div className="text-red-400 bg-red-950/50 p-4 rounded">{error}</div>;
  if (!course) return <p className="text-slate-500">Course not found</p>;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="border-purple-600 text-purple-400">
                {course.level}
              </Badge>
              <Badge variant="secondary" className="bg-slate-800">
                {course.category}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
            <p className="text-slate-400">{course.description}</p>
          </div>
          <Button
            onClick={handleEnroll}
            disabled={enrolling || enrolled}
            className="bg-purple-600 hover:bg-purple-700 shrink-0"
          >
            {enrolled ? '✅ Enrolled' : enrolling ? 'Enrolling...' : 'Enroll Now'}
          </Button>
        </div>
      </div>

      <Separator className="mb-8 bg-slate-800" />

      {/* Modules */}
      <h2 className="text-xl font-semibold mb-4">Course Content</h2>
      {course.modules && course.modules.length > 0 ? (
        <div className="space-y-4">
          {course.modules.map((mod, idx) => (
            <Card key={mod.id} className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-purple-600/20 text-purple-400 flex items-center justify-center text-sm">
                    {idx + 1}
                  </span>
                  {mod.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mod.lessons.map((lesson, lidx) => (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between p-2 rounded hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 text-sm">M{idx + 1}.L{lidx + 1}</span>
                        <span className="text-sm">{lesson.title}</span>
                      </div>
                      {lesson.youtubeUrl && (
                        <a
                          href={lesson.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-purple-400 hover:text-purple-300"
                        >
                          ▶ Watch
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="py-8 text-center text-slate-500">
            Course content is being prepared. Check back soon!
          </CardContent>
        </Card>
      )}
    </div>
  );
}
