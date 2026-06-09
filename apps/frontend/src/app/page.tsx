'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles, BookOpen, Bot, Award, GitFork } from 'lucide-react';

const features = [
  {
    icon: BookOpen,
    title: 'AI-Powered Courses',
    description: 'Learn AI engineering, MLOps, and GenAI with hands-on projects and real-world challenges.',
  },
  {
    icon: Bot,
    title: 'AI Mentor Chat',
    description: 'Get context-aware help from your AI mentor while going through each lesson.',
  },
  {
    icon: Award,
    title: 'Verified Certificates',
    description: 'Earn blockchain-verified certificates upon course completion. Share on LinkedIn.',
  },
];

const courses = [
  { title: 'AI Engineering Fundamentals', level: 'Beginner', category: 'AI Engineering' },
  { title: 'MLOps Engineering', level: 'Intermediate', category: 'MLOps' },
  { title: 'Generative AI & Prompt Engineering', level: 'Beginner', category: 'GenAI' },
  { title: 'AI Agents with Claude Code', level: 'Intermediate', category: 'AI Agents' },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold tracking-tight">ApexCampus</span>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            <a href="#courses" className="text-sm font-medium text-muted-foreground hover:text-foreground">Courses</a>
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground">Features</a>
            <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground">Pricing</a>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm">Sign In</Button>
            <Button size="sm">Get Started</Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
        <div className="container mx-auto relative px-4 text-center">
          <Badge className="mb-4" variant="secondary">AI Education Platform</Badge>
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
            Master AI Skills with<br />
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">AI-Powered Mentorship</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            Learn AI engineering, MLOps, and generative AI through hands-on projects 
            with real-time AI mentor guidance. Get certified and level up your career.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="gap-2">
              Start Learning <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              <GitFork className="h-4 w-4 mr-2" /> View Courses
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">Why ApexCampus?</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((f) => (
              <Card key={f.title} className="border-0 bg-muted/50">
                <CardHeader>
                  <f.icon className="mb-2 h-8 w-8 text-primary" />
                  <CardTitle>{f.title}</CardTitle>
                  <CardDescription>{f.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Courses */}
      <section id="courses" className="border-t py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">Available Courses</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {courses.map((c) => (
              <Card key={c.title} className="transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="mb-2 flex items-center justify-between">
                    <Badge variant="outline">{c.level}</Badge>
                    <Badge>{c.category}</Badge>
                  </div>
                  <CardTitle className="text-lg">{c.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm" className="w-full gap-2">
                    View Course <ArrowRight className="h-3 w-3" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2026 ApexCampus. Master AI Engineering.</p>
        </div>
      </footer>
    </div>
  );
}
