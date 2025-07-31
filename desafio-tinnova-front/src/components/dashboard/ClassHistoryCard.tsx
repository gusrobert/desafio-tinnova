'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mockClassSessions } from "@/lib/mock-data";
import type { ClassSession } from "@/lib/types";
import { History, CheckCircle, XCircle } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

export default function ClassHistoryCard() {
  const recentClasses: ClassSession[] = mockClassSessions
    .filter(session => session.status === 'completed' || session.status === 'canceled')
    .sort((a, b) => parseISO(b.dateTime).getTime() - parseISO(a.dateTime).getTime())
    .slice(0, 5); // Show last 5 completed/canceled classes

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-6 w-6 text-primary" />
          Histórico de Aulas Recentes
        </CardTitle>
        <CardDescription>Últimas aulas concluídas ou canceladas.</CardDescription>
      </CardHeader>
      <CardContent>
        {recentClasses.length > 0 ? (
          <ScrollArea className="h-[300px]">
            <ul className="space-y-4">
              {recentClasses.map((session) => (
                <li key={session.id} className="p-4 border rounded-lg bg-secondary/30 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-md">{session.content}</h4>
                      <p className="text-sm text-muted-foreground">
                        {session.studentName} com {session.teacherName}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(parseISO(session.dateTime), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                    <Badge variant={session.status === 'completed' ? 'default' : 'destructive'} className={session.status === 'completed' ? 'bg-green-500 hover:bg-green-600' : ''}>
                      {session.status === 'completed' ? <CheckCircle className="h-4 w-4 mr-1 inline-block" /> : <XCircle className="h-4 w-4 mr-1 inline-block" />}
                      {session.status === 'completed' ? 'Concluída' : 'Cancelada'}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
          </ScrollArea>
        ) : (
          <p className="text-muted-foreground text-center py-8">Nenhum histórico de aulas disponível.</p>
        )}
      </CardContent>
    </Card>
  );
}
