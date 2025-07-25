"use client";

import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { chat, ChatInput } from '@/ai/flows/chat-flow';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface Message {
  text: string;
  isUser: boolean;
}

const Logo = ({ className }: { className?: string }) => (
    <svg
      width="40"
      height="40"
      viewBox="0 0 41 41"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
    >
      <path
        d="M35.208 17.062C35.208 16.125 35.083 15.25 34.791 14.5C34.5 13.687 34.083 12.937 33.5 12.25C32.916 11.562 32.208 11 31.375 10.562C30.541 10.125 29.583 9.875 28.5 9.875C27.083 9.875 25.875 10.312 24.875 11.187C23.875 12.062 23.375 13.25 23.375 14.75V15.5H17.875C16.812 15.5 15.875 15.25 15.062 14.75C14.25 14.25 13.562 13.562 13 12.75C12.437 11.937 12.125 10.937 12.125 9.75C12.125 8.437 12.562 7.25 13.437 6.187C14.312 5.125 15.5 4.5 16.875 4.5C18.125 4.5 19.25 4.812 20.25 5.437C21.25 6.062 22 6.875 22.5 7.875H27.5C26.937 5.875 25.75 4.25 23.937 3C22.125 1.75 20.062 1.125 17.75 1.125C15.812 1.125 14.062 1.562 12.5 2.437C10.937 3.312 9.625 4.562 8.562 6.187C7.5 7.812 7 9.625 7 11.625C7 13.312 7.375 14.812 8.125 16.125C8.875 17.437 9.875 18.5 11.125 19.312V19.5C10.125 20.125 9.312 20.937 8.687 21.937C8.062 22.937 7.75 24.062 7.75 25.312C7.75 27.062 8.25 28.625 9.25 30C10.25 31.375 11.562 32.375 13.187 33L13.5 33.125H13.625C14.125 33.625 14.75 34.062 15.5 34.437C16.25 34.812 17.062 35 18 35H18.125C19.687 35 21.062 29.875 21.25 29.625V29.5C21.812 28.562 22.125 27.5 22.125 26.312C22.125 24.812 21.687 23.5 20.812 22.375C20 21.25 18.75 20.5 17.125 20.5H16V18H23.375V25.25C23.375 26.812 23.812 28.125 24.687 29.187C25.562 30.25 26.75 30.75 28.25 30.75C29.437 30.75 30.5 30.437 31.437 29.812C32.375 29.187 33.062 28.312 33.5 27.187C33.937 26.062 34.125 24.75 34.125 23.25C34.125 21.625 33.687 20.25 32.812 19.125C31.937 18 30.75 17.312 29.25 17.187V17.062H35.208Z"
        fill="url(#paint0_linear_chat_logo)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_chat_logo"
          x1="21.5"
          y1="0"
          x2="21.5"
          y2="40"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F89B29" />
          <stop offset="1" stopColor="#8A2BE2" />
        </linearGradient>
      </defs>
    </svg>
);


export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: Message = { text: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const chatInput: ChatInput = { message: input };
      const result = await chat(chatInput);
      const aiMessage: Message = { text: result.response, isUser: false };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error calling chat flow:", error);
      const errorMessage: Message = { text: "Sorry, something went wrong.", isUser: false };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <Card className="w-full h-full shadow-none rounded-3xl border-none bg-card p-2 flex flex-col">
      <header className="flex items-center p-4 border-b">
        <Link href="/home">
            <ArrowLeft className="w-6 h-6 text-foreground cursor-pointer" />
        </Link>
        <div className="flex items-center gap-3 mx-auto">
            <Logo />
            <h2 className="text-xl font-bold text-foreground">ChatGPT 4.5</h2>
        </div>
        <div className="w-6"/>
      </header>
      <CardContent className="p-4 flex-grow overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={cn("flex items-end gap-2", msg.isUser ? "justify-end" : "justify-start")}>
            {!msg.isUser && <Logo className="w-8 h-8"/>}
            <div
              className={cn(
                "rounded-2xl px-4 py-2 max-w-[80%]",
                msg.isUser
                  ? "bg-primary text-primary-foreground rounded-br-none"
                  : "bg-muted text-muted-foreground rounded-bl-none"
              )}
            >
              <p className="text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
         {isLoading && (
            <div className="flex items-end gap-2 justify-start">
              <Logo className="w-8 h-8"/>
              <div className="rounded-2xl px-4 py-2 max-w-[80%] bg-muted text-muted-foreground rounded-bl-none">
                <div className="flex items-center space-x-1">
                    <span className="h-2 w-2 bg-foreground/50 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="h-2 w-2 bg-foreground/50 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="h-2 w-2 bg-foreground/50 rounded-full animate-bounce"></span>
                </div>
              </div>
            </div>
          )}
        <div ref={messagesEndRef} />
      </CardContent>
      <footer className="p-4 border-t">
        <div className="relative">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="pr-12 rounded-full py-6 soft-shadow-inset focus:ring-0 focus:ring-offset-0 bg-transparent border-none"
            disabled={isLoading}
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={isLoading || input.trim() === ''}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full w-10 h-10 soft-shadow soft-shadow-press"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </footer>
    </Card>
  );
}
