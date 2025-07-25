"use client";

import Link from 'next/link';
import { ArrowLeft, User, Mail, LogOut } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export function ProfilePage() {
    const router = useRouter();

    const handleLogout = () => {
        // In a real app, you'd clear session/token here
        router.push('/');
    };

    return (
        <div className="w-full h-full bg-background rounded-4xl flex flex-col p-6 space-y-6 overflow-y-auto">
            <header className="flex items-center">
                <Link href="/home" passHref>
                    <ArrowLeft className="w-6 h-6 text-foreground cursor-pointer" />
                </Link>
                <h1 className="text-xl font-bold text-foreground mx-auto pr-6">
                    Profile
                </h1>
            </header>
            <main className="flex-grow flex flex-col items-center justify-start space-y-8">
                <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-card soft-shadow flex items-center justify-center overflow-hidden">
                        <Image
                            src="https://firebasestorage.googleapis.com/v0/b/ai-prototyper-2-prod.appspot.com/o/public%2Fimages%2Fprofile.jpg?alt=media&token=487d7bce-e71c-4384-9842-13b3b4a2e84d"
                            alt="Profile Picture"
                            width={128}
                            height={128}
                            className="object-cover w-full h-full"
                            data-ai-hint="profile picture"
                        />
                    </div>
                </div>

                <Card className="w-full shadow-none rounded-3xl border-none bg-transparent p-2">
                    <CardContent className="p-4 space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-card rounded-full soft-shadow-inset">
                                <User className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm text-muted-foreground">Full Name</span>
                                <span className="font-semibold text-foreground">Demo User</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-card rounded-full soft-shadow-inset">
                                <Mail className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm text-muted-foreground">Email</span>
                                <span className="font-semibold text-foreground">demo@progpt.ai</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Button 
                    onClick={handleLogout}
                    className="w-full !rounded-full !py-6 !text-lg font-bold soft-shadow soft-shadow-press bg-destructive text-destructive-foreground hover:bg-destructive/90" 
                    size="lg"
                >
                    <LogOut className="w-5 h-5 mr-2" />
                    Logout
                </Button>
                
                <div className="w-full mt-auto">
                 
                </div>
            </main>
        </div>
    );
}
