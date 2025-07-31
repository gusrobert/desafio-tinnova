import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';

interface ExercicesCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  linkHref: string;
  linkText: string;
}

export default function ExercicesCard({ title, description, icon, linkHref, linkText }: ExercicesCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
          <Link href={linkHref}>
            {linkText}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
