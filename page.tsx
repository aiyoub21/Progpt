
"use client";

import Link from 'next/link';
import { ArrowLeft, Code2, Search, MessageSquare, Palette } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { AppLayout } from '@/components/app-layout';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const getProjectLink = (type: string) => {
    switch (type.toLowerCase()) {
        case 'coding':
            return '/coding';
        case 'design':
            return '/design';
        case 'chat':
            return '/chat';
        default:
            return '#';
    }
};

const mockProjects = [
  {
    id: 1,
    title: 'React Login Component',
    type: 'Coding',
    icon: Code2,
    date: '2024-07-28',
    description: "User asked for a responsive login form using React and Tailwind CSS. Provided code includes state management with useState and form handling.",
  },
  {
    id: 2,
    title: 'Business Logo Ideas',
    type: 'Design',
    icon: Palette,
    date: '2024-07-27',
    description: "Brainstorming session for a new tech startup's logo. Discussed color palettes, typography, and modern design trends.",
  },
  {
    id: 3,
    title: 'Python Data Scraping Script',
    type: 'Coding',
    icon: Code2,
    date: '2024-07-26',
    description: 'Developed a Python script using BeautifulSoup and Requests to scrape data from a public website. Handled pagination and data cleaning.',
  },
    {
    id: 4,
    title: 'Travel Plan to Japan',
    type: 'Chat',
    icon: MessageSquare,
    date: '2024-07-25',
    description: "Created a 10-day itinerary for a trip to Japan, covering Tokyo, Kyoto, and Osaka. Included suggestions for transport, accommodation, and food.",
  },
];

export default function ProjectPage() {
  return (
    <AppLayout>
      <div className="w-full h-full bg-background rounded-4xl flex flex-col p-6 space-y-6">
        <header className="flex items-center">
          <Link href="/home" passHref>
            <ArrowLeft className="w-6 h-6 text-foreground cursor-pointer" />
          </Link>
          <h1 className="text-xl font-bold text-foreground mx-auto pr-6">
            My Projects
          </h1>
        </header>

        <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
                placeholder="Search projects..."
                className="pl-12 py-6 text-md bg-transparent border-none rounded-full soft-shadow-inset focus:ring-0 focus:ring-offset-0"
            />
        </div>
        
        <main className="flex-grow space-y-4 overflow-y-auto">
            {mockProjects.map(project => (
                <Link key={project.id} href={getProjectLink(project.type)} passHref>
                  <Card className="w-full shadow-none rounded-3xl border-none bg-card p-2 soft-shadow cursor-pointer transition-transform duration-200 ease-in-out hover:scale-105">
                      <CardContent className="p-4 flex gap-4">
                          <div className="p-3 bg-card rounded-2xl soft-shadow-inset h-fit">
                             <project.icon className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-grow">
                              <div className="flex justify-between items-start">
                                  <h3 className="font-bold text-foreground">{project.title}</h3>
                                  <Badge 
                                    variant={project.type === 'Coding' ? 'secondary' : (project.type === 'Design' ? 'default' : 'outline')} 
                                    className={cn(project.type === 'Design' && 'bg-accent text-accent-foreground')}
                                  >
                                    {project.type}
                                  </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1 mb-2">{project.date}</p>
                              <p className="text-sm text-foreground/80 line-clamp-2">{project.description}</p>
                          </div>
                      </CardContent>
                  </Card>
                </Link>
            ))}
        </main>
      </div>
    </AppLayout>
  );
}
