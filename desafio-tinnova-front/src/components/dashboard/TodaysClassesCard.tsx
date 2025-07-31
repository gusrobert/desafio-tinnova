'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mockClassSessions, mockStudents } from "@/lib/mock-data";
import type { ClassSession } from "@/lib/types";
import { CalendarClock, User, Link as LinkIcon } from "lucide-react";
import { format, isToday } from "date-fns";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

// Helper to get WhatsApp link for a student
const getStudentWhatsAppLink = (studentId: string) => {
  const student = mockStudents.find(s => s.id === studentId);
  if (student && student.contacts.whatsapp) {
    return `https://api.whatsapp.com/send/?phone=${student.contacts.whatsapp.replace(/\D/g, '')}`;
  }
  return '#';
};


export default function TodaysClassesCard() {
  const todaysClasses: ClassSession[] = mockClassSessions.filter(session => 
    isToday(new Date(session.dateTime)) && session.status === 'scheduled'
  );

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarClock className="h-6 w-6 text-primary" />
          Aulas de Hoje
        </CardTitle>
        <CardDescription>Resumo das aulas agendadas para hoje.</CardDescription>
      </CardHeader>
      <CardContent>
        {todaysClasses.length > 0 ? (
          <ScrollArea className="h-[300px]">
            <ul className="space-y-4">
              {todaysClasses.map((session) => {
                const [formattedTime, setFormattedTime] = useState<string>('');

                useEffect(() => {
                  setFormattedTime(format(new Date(session.dateTime), "HH:mm"));
                }, [session.dateTime]);

                return (
                  <li key={session.id} className="p-4 border rounded-lg bg-secondary/30 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-md">{session.content}</h4>
                        <p className="text-sm text-muted-foreground">
                          <User className="inline h-4 w-4 mr-1" />
                          {session.studentName} (Prof: {session.teacherName})
                        </p>
                      </div>
                      <Badge variant="default" className="bg-accent text-accent-foreground">
                        {formattedTime}
                      </Badge>
                    </div>
                    <div className="mt-2 flex items-center">
                      <Link 
                        href={getStudentWhatsAppLink(session.studentId)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline flex items-center"
                      >
                        <LinkIcon className="h-3 w-3 mr-1"/> WhatsApp do Estudante
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          </ScrollArea>
        ) : (
          <p className="text-muted-foreground text-center py-8">Nenhuma aula agendada para hoje.</p>
        )}
      </CardContent>
    </Card>
  );
}
