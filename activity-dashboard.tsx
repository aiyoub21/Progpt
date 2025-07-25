
"use client";

import Link from "next/link";
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Settings,
  Palette,
  ImageIcon,
  Video,
  Code2,
} from "lucide-react";

import { cn } from "@/lib/utils";

const ProjectIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M9.5 2.5a3.5 3.5 0 0 0-3.5 3.5v1.44a4.5 4.5 0 0 0-2.06 3.56c0 2.48 2.02 4.5 4.5 4.5h2.12" /><path d="M15.5 2.5a3.5 3.5 0 0 1 3.5 3.5v1.44a4.5 4.5 0 0 1 2.06 3.56c0 2.48-2.02 4.5-4.5 4.5H17" /><path d="M11.5 16.5a2.5 2.5 0 0 1-2.5-2.5V7" /><path d="M14.5 16.5a2.5 2.5 0 0 0 2.5-2.5V7" /><path d="M7 21.5v-3a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v3" />
    </svg>
);

interface ActivityCardProps {
  icon: React.ElementType;
  label: string;
  href: string;
}

const ActivityCard = ({ icon: Icon, label, href }: ActivityCardProps) => (
  <Link href={href} passHref>
    <button
      className={cn(
        "bg-card rounded-3xl p-4 flex flex-col items-center justify-center gap-2 aspect-square soft-shadow soft-shadow-press text-left w-full"
      )}
    >
      <Icon className="w-10 h-10 text-primary" />
      <span className="text-sm font-medium text-foreground">{label}</span>
    </button>
  </Link>
);


export function ActivityDashboard() {
  const router = useRouter();

  const todayActivities = [
    { icon: ProjectIcon, label: "Project", href: "/project" },
    { icon: Palette, label: "Design", href: "/design" },
    { icon: ImageIcon, label: "Image AI", href: "/image-ai" },
    { icon: Video, label: "Video AI", href: "/video-ai" },
  ];

  const favoriteActivities = [
    { icon: Code2, label: "Coding", href: "/coding" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];
  
  return (
    <div className="w-full h-full bg-background rounded-4xl flex flex-col p-6 space-y-6 overflow-y-auto">
      <header className="flex items-center">
        <ArrowLeft className="w-6 h-6 text-foreground" onClick={() => router.back()} />
        <h1 className="text-xl font-bold text-foreground mx-auto pr-6">
          Today's activity
        </h1>
      </header>

      <main className="flex-grow space-y-6">
        <section>
          <div className="grid grid-cols-2 gap-6">
            {todayActivities.map((activity) => (
              <ActivityCard
                key={activity.label}
                icon={activity.icon}
                label={activity.label}
                href={activity.href}
              />
            ))}
          </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-foreground">
              My favorite activity
            </h2>
            <a href="#" className="text-sm font-semibold text-primary/80">
              More
            </a>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {favoriteActivities.map((activity) => (
              <ActivityCard
                key={activity.label}
                icon={activity.icon}
                label={activity.label}
                href={activity.href}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
