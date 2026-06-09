'use client';

import { useEffect, useState, useRef } from 'react';
import { api, MentorConversation, MentorMessage } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bot, Send, MessageSquare } from 'lucide-react';

export default function MentorPage() {
  const [conversations, setConversations] = useState<MentorConversation[]>([]);
  const [activeConv, setActiveConv] = useState<string | null>(null);
  const [messages, setMessages] = useState<MentorMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.getConversations()
      .then(setConversations)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!activeConv) return;
    api.getConversationMessages(activeConv).then(setMessages);
  }, [activeConv]);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !activeConv) return;
    const content = input;
    setInput('');
    const tempMsg: MentorMessage = {
      id: 'temp-' + Date.now(),
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMsg]);
    try {
      const msg = await api.sendMessage(activeConv, content);
      setMessages((prev) => prev.map((m) => (m.id === tempMsg.id ? msg : m)));
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  const newConversation = async () => {
    try {
      const conv = await api.createConversation('', { topic: 'General' });
      setConversations((prev) => [conv, ...prev]);
      setActiveConv(conv.id);
      setMessages([]);
    } catch (err) {
      console.error('Failed to create conversation', err);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] -m-4 lg:-m-6 animate-fade-in">
      {/* Sidebar */}
      <div className="w-64 border-r border-border bg-sidebar/50 backdrop-blur-xl p-4 flex flex-col hidden md:flex">
        <Button onClick={newConversation} className="mb-4 bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
          <MessageSquare className="h-4 w-4" /> New Chat
        </Button>

        <div className="flex-1 overflow-y-auto space-y-1">
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-12 rounded-lg bg-muted/50 animate-pulse" />
              ))}
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-8">
              <Bot className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">No conversations yet</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setActiveConv(conv.id)}
                className={`w-full text-left p-3 rounded-xl text-sm transition-all duration-200 ${
                  activeConv === conv.id
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-muted-foreground hover:bg-muted border border-transparent'
                }`}
              >
                <div className="font-medium truncate">{conv.lesson?.title || 'General Chat'}</div>
                {conv.messages?.[0] && (
                  <div className="text-xs text-muted-foreground/60 truncate mt-1">{conv.messages[0].content}</div>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {activeConv ? (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground mt-20 animate-fade-in">
                  <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Bot className="h-8 w-8 text-primary" />
                  </div>
                  <p className="font-medium text-foreground mb-1">Start a conversation</p>
                  <p className="text-sm">Ask your AI mentor anything about your courses</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-scale-in`}
                  >
                    <div className={`max-w-[75%] p-3.5 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'glass border text-foreground'
                    }`}>
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                      <p className={`text-[10px] mt-1.5 ${msg.role === 'user' ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEnd} />
            </div>

            <div className="p-4 border-t border-border bg-background/60 backdrop-blur-xl">
              <form
                onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                className="flex gap-2"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask your AI mentor..."
                  className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground/50"
                />
                <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground shrink-0 gap-2">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center animate-fade-in">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <p className="font-medium text-foreground mb-1">Select a conversation</p>
              <p className="text-sm">Or start a new chat with your AI mentor</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
