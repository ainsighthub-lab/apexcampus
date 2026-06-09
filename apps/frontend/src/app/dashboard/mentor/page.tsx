'use client';

import { useEffect, useState, useRef } from 'react';
import { api, MentorConversation, MentorMessage } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

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

    // Optimistic update
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
    <div className="flex h-[calc(100vh-4rem)] -m-8">
      {/* Conversations sidebar */}
      <div className="w-64 border-r border-slate-800 p-4 flex flex-col">
        <Button
          onClick={newConversation}
          className="mb-4 bg-purple-600 hover:bg-purple-700 w-full"
        >
          + New Chat
        </Button>

        <div className="flex-1 overflow-y-auto space-y-2">
          {loading ? (
            <p className="text-slate-500 text-sm">Loading...</p>
          ) : conversations.length === 0 ? (
            <p className="text-slate-500 text-sm">No conversations yet</p>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setActiveConv(conv.id)}
                className={`w-full text-left p-2 rounded text-sm transition-colors ${
                  activeConv === conv.id
                    ? 'bg-purple-600/20 text-purple-300'
                    : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <div className="font-medium truncate">
                  {conv.lesson?.title || 'General Chat'}
                </div>
                {conv.messages?.[0] && (
                  <div className="text-xs text-slate-500 truncate mt-1">
                    {conv.messages[0].content}
                  </div>
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
                <div className="text-center text-slate-500 mt-20">
                  <p className="text-4xl mb-4">🤖</p>
                  <p>Start a conversation with your AI Mentor</p>
                  <p className="text-sm">Ask questions about your courses</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${
                        msg.role === 'user'
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-800 text-slate-200'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEnd} />
            </div>

            <div className="p-4 border-t border-slate-800">
              <form
                onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                className="flex gap-2"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask your AI mentor..."
                  className="bg-slate-800 border-slate-700 text-white"
                />
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700 shrink-0">
                  Send
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500">
            <div className="text-center">
              <p className="text-6xl mb-4">🤖</p>
              <p className="text-lg">Select a conversation or start a new one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
