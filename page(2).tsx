
"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Send, Paperclip, Image as ImageIcon, X, Loader2, Bot, Copy } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { AppLayout } from '@/components/app-layout';
import { generateCode, GenerateCodeInput } from '@/ai/flows/coding-flow';
import { cn } from '@/lib/utils';

interface Message {
  text: string;
  isUser: boolean;
}

interface Attachment {
  file: File;
  preview: string;
}

const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

export default function CodingPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);
  
  const handleAttachmentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAttachment({
        file,
        preview: URL.createObjectURL(file),
      });
    }
  };

  const removeAttachment = () => {
    setAttachment(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSend = async () => {
    if ((input.trim() === '' && !attachment) || isLoading) return;

    const userMessageText = input;
    const userMessage: Message = { text: userMessageText, isUser: true };
    if (attachment) {
      userMessage.text += `\n\n[Attachment: ${attachment.file.name}]`;
    }
    setMessages((prev) => [...prev, userMessage]);
    
    setInput('');
    setIsLoading(true);

    try {
      let photoDataUri: string | undefined;
      if (attachment && attachment.file.type.startsWith('image/')) {
        photoDataUri = await fileToDataUri(attachment.file);
      }

      const codeInput: GenerateCodeInput = { 
        prompt: userMessageText,
        photoDataUri
      };
      
      const result = await generateCode(codeInput);
      const aiMessage: Message = { text: result.code, isUser: false };
      setMessages((prev) => [...prev, aiMessage]);

    } catch (error) {
      console.error("Error calling coding flow:", error);
      const errorMessage: Message = { text: "Sorry, I encountered an error while generating the code.", isUser: false };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      removeAttachment();
    }
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
  };
  
  const CodeBlock = ({ code }: { code: string }) => {
    const match = /```(\w+)?\n([\s\S]+)```/.exec(code);
    if (match) {
        const language = match[1] || 'javascript';
        const rawCode = match[2];
        return (
            <div className="relative bg-[#1e1e1e] rounded-lg my-2">
                <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => handleCopy(rawCode)}>
                    <Copy className="h-4 w-4 text-gray-400"/>
                </Button>
                <SyntaxHighlighter language={language} style={vscDarkPlus} customStyle={{ margin: 0, borderRadius: '0.5rem', background: 'transparent' }}>
                    {rawCode}
                </SyntaxHighlighter>
            </div>
        );
    }
    return <p className="text-sm whitespace-pre-wrap">{code}</p>;
  };

  return (
    <AppLayout>
      <div className="w-full h-full bg-background rounded-4xl flex flex-col p-2 space-y-2">
        <header className="flex items-center p-4 border-b">
          <Link href="/home" passHref>
            <ArrowLeft className="w-6 h-6 text-foreground cursor-pointer" />
          </Link>
          <div className="flex items-center gap-3 mx-auto">
            <Bot className="w-8 h-8 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Coding Assistant</h1>
          </div>
          <div className="w-6"/>
        </header>
        
        <CardContent className="p-4 flex-grow overflow-y-auto space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={cn("flex items-start gap-3", msg.isUser ? "justify-end" : "justify-start")}>
                {!msg.isUser && <Bot className="w-8 h-8 text-primary flex-shrink-0 mt-1"/>}
                <div
                  className={cn(
                    "rounded-2xl px-4 py-2 max-w-[90%]",
                    msg.isUser ? "bg-primary text-primary-foreground rounded-br-none" : "bg-card text-card-foreground rounded-bl-none border"
                  )}
                >
                  {msg.isUser ? <p className="text-sm whitespace-pre-wrap">{msg.text}</p> : <CodeBlock code={msg.text} />}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3 justify-start">
                  <Bot className="w-8 h-8 text-primary flex-shrink-0 mt-1"/>
                  <div className="rounded-2xl px-4 py-3 max-w-[90%] bg-card text-card-foreground rounded-bl-none border">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
              </div>
            )}
          <div ref={messagesEndRef} />
        </CardContent>

        <footer className="p-4 border-t">
          {attachment && (
            <div className="relative w-24 h-24 mb-2 p-1 border rounded-lg">
                <Image src={attachment.preview} alt="Attachment" layout="fill" objectFit="cover" className="rounded"/>
                <Button size="icon" variant="destructive" className="absolute -top-2 -right-2 h-6 w-6 rounded-full" onClick={removeAttachment}>
                    <X className="h-4 w-4"/>
                </Button>
            </div>
          )}
          <div className="relative">
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Describe what you want to code..."
              className="pr-24 rounded-full py-6 soft-shadow-inset focus:ring-0 focus:ring-offset-0 bg-transparent border-none"
              disabled={isLoading}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <Button size="icon" variant="ghost" className="rounded-full" onClick={() => fileInputRef.current?.click()}>
                  <Paperclip className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                onClick={handleSend}
                disabled={isLoading || (input.trim() === '' && !attachment)}
                className="rounded-full w-10 h-10 soft-shadow soft-shadow-press"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleAttachmentChange} className="hidden" accept="image/*" />
          </div>
        </footer>
      </div>
    </AppLayout>
  );
}
