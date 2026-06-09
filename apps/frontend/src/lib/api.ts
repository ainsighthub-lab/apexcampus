const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  level: string;
  thumbnailUrl: string | null;
  isPublished: boolean;
  modules?: Module[];
}

export interface Module {
  id: string;
  title: string;
  sortOrder: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  sortOrder: number;
  youtubeUrl: string | null;
}

export interface Enrollment {
  id: string;
  status: string;
  progressPercent: number;
  course: Course;
}

export interface MentorConversation {
  id: string;
  lesson: { id: string; title: string };
  messages: { content: string; createdAt: string }[];
}

export interface MentorMessage {
  id: string;
  role: string;
  content: string;
  createdAt: string;
}

class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  private async fetch<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const res = await fetch(`${API_BASE}/api/v1${path}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(error || `HTTP ${res.status}`);
    }

    return res.json();
  }

  // Auth
  async register(email: string, password: string, name?: string) {
    return this.fetch<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  async login(email: string, password: string) {
    return this.fetch<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // Courses
  async getCourses(params?: { page?: number; category?: string; level?: string }) {
    const search = new URLSearchParams();
    if (params?.page) search.set('page', String(params.page));
    if (params?.category) search.set('category', params.category);
    if (params?.level) search.set('level', params.level);
    const qs = search.toString();
    return this.fetch<{ courses: Course[]; total: number }>(`/courses${qs ? `?${qs}` : ''}`);
  }

  async getCourseBySlug(slug: string) {
    return this.fetch<Course>(`/courses/${slug}`);
  }

  async enroll(courseId: string) {
    return this.fetch<Enrollment>(`/courses/${courseId}/enroll`, { method: 'POST' });
  }

  async getEnrollments() {
    return this.fetch<Enrollment[]>('/courses/user/enrollments');
  }

  // Mentor
  async createConversation(lessonId: string, context?: any) {
    return this.fetch<MentorConversation>('/mentor/conversations', {
      method: 'POST',
      body: JSON.stringify({ lessonId, context }),
    });
  }

  async sendMessage(conversationId: string, content: string) {
    return this.fetch<MentorMessage>(`/mentor/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  async getConversationMessages(conversationId: string) {
    return this.fetch<MentorMessage[]>(`/mentor/conversations/${conversationId}/messages`);
  }

  async getConversations() {
    return this.fetch<MentorConversation[]>('/mentor/conversations');
  }
}

export const api = new ApiClient();
