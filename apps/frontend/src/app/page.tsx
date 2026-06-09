'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles, BookOpen, Bot, Award, GraduationCap, Play } from 'lucide-react';

const features = [
  {
    icon: BookOpen,
    title: 'AI-Powered Courses',
    description: 'Learn AI engineering, MLOps, and GenAI with hands-on projects and real-world challenges.',
    gradient: 'from-blue-500 to-blue-600',
  },
  {
    icon: Bot,
    title: 'AI Mentor Chat',
    description: 'Get context-aware help from your AI mentor while going through each lesson.',
    gradient: 'from-emerald-500 to-emerald-600',
  },
  {
    icon: Award,
    title: 'Verified Certificates',
    description: 'Earn blockchain-verified certificates upon course completion. Share on LinkedIn.',
    gradient: 'from-amber-500 to-amber-600',
  },
];

const courses = [
  { title: 'AI Engineering Fundamentals', level: 'Beginner', category: 'AI Engineering', color: 'bg-blue-500/10 text-blue-600' },
  { title: 'MLOps Engineering', level: 'Intermediate', category: 'MLOps', color: 'bg-emerald-500/10 text-emerald-600' },
  { title: 'Generative AI & Prompt Engineering', level: 'Beginner', category: 'GenAI', color: 'bg-purple-500/10 text-purple-600' },
  { title: 'AI Agents with Claude Code', level: 'Intermediate', category: 'AI Agents', color: 'bg-amber-500/10 text-amber-600' },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-emerald-500/[0.03]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/[0.02] rounded-full blur-[120px]" />
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/60 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
              <GraduationCap className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="text-xl font-heading font-bold tracking-tight text-foreground">ApexCampus</span>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            <a href="#courses" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Courses</a>
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
          </nav>
          <div className="flex items-center gap-3">
            <a href="/auth" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">Sign In</a>
            <a href="/auth">
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">Get Started</Button>
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="container mx-auto relative px-4 text-center">
          <div className="animate-slide-up">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 hover:bg-primary/15" variant="secondary">
              <Sparkles className="h-3 w-3 mr-1.5" /> AI-Powered Learning Platform
            </Badge>
          </div>
          <h1 className="mb-6 text-4xl font-heading font-bold tracking-tight md:text-6xl lg:text-7xl text-foreground animate-slide-up stagger-1">
            Master AI Skills with<br />
            <span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">
              AI-Powered Mentorship
            </span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground animate-slide-up stagger-2">
            Learn AI engineering, MLOps, and generative AI through hands-on projects
            with real-time AI mentor guidance. Get certified and level up your career.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 animate-slide-up stagger-3">
            <a href="/auth">
              <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 text-base px-8">
                Start Learning <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
            <Button size="lg" variant="outline" className="border-border hover:bg-muted text-foreground transition-all duration-200 text-base px-8">
              <Play className="h-4 w-4 mr-2" /> Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-4 max-w-lg mx-auto animate-fade-in stagger-4">
            {[
              { value: '50+', label: 'Courses' },
              { value: '10K+', label: 'Students' },
              { value: '4.9', label: 'Rating' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-heading font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-border py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-heading font-bold text-foreground mb-3">Why ApexCampus?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">The most effective way to learn AI engineering — with personalized AI mentorship.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((f, i) => (
              <Card key={f.title} className={`glass glass-hover border-0 transition-all duration-300 animate-slide-up stagger-${i + 1}`}>
                <CardHeader>
                  <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-4`}>
                    <f.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="font-heading text-foreground">{f.title}</CardTitle>
                  <CardDescription className="text-muted-foreground/80">{f.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Courses */}
      <section id="courses" className="border-t border-border py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-heading font-bold text-foreground mb-3">Available Courses</h2>
            <p className="text-muted-foreground">Start with beginner-friendly content or dive into advanced topics.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
            {courses.map((c, i) => (
              <Card key={c.title} className={`glass glass-hover border-0 transition-all duration-300 animate-slide-up stagger-${i + 1} group`}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className={`text-[10px] ${c.color}`}>{c.level}</Badge>
                  </div>
                  <CardTitle className="text-base text-foreground group-hover:text-primary transition-colors">{c.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground mb-3">{c.category}</p>
                  <a href="/auth">
                    <Button variant="outline" size="sm" className="w-full gap-2 border-border text-muted-foreground hover:text-foreground">
                      Enroll <ArrowRight className="h-3 w-3" />
                    </Button>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border py-20 relative">
        <div className="container mx-auto px-4 text-center">
          <Card className="glass border-0 max-w-2xl mx-auto">
            <CardContent className="p-10">
              <GraduationCap className="h-10 w-10 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-heading font-bold text-foreground mb-3">Ready to Start Learning?</h2>
              <p className="text-muted-foreground mb-6">Join thousands of students mastering AI with ApexCampus.</p>
              <a href="/auth">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300">
                  Start Free <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-2">
            <GraduationCap className="h-4 w-4 text-primary" />
            <span className="font-heading font-medium text-foreground">ApexCampus</span>
          </div>
          <p>&copy; 2026 ApexCampus. Master AI Engineering.</p>
        </div>
      </footer>
    </div>
  );
}
