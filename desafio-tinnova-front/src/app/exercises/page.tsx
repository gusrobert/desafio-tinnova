import ClassHistoryCard from "@/components/dashboard/ClassHistoryCard";
import ExercicesCard from "@/components/dashboard/DashboardCard";
import TodaysClassesCard from "@/components/dashboard/TodaysClassesCard";
import AppLayout from "@/components/layout/AppLayout";
import { CalendarDays, GraduationCap, Users } from "lucide-react";

export default function ExercisesPage() {
  const stats = {
    activeStudents: 58,
    activeTeachers: 12,
    scheduledClassesToday: 5,
  };

  return (
    <AppLayout pageTitle="Exercícios">
      <div className="space-y-8">
        <section>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <ExercicesCard
              title="Gestão de Estudantes"
              description={`Total: ${stats.activeStudents} ativos`}
              icon={<Users className="h-8 w-8 text-primary" />}
              linkHref="/students"
              linkText="Ver Estudantes"
            />
            <ExercicesCard
              title="Gestão de Professores"
              description={`Total: ${stats.activeTeachers} ativos`}
              icon={<GraduationCap className="h-8 w-8 text-primary" />}
              linkHref="/teachers"
              linkText="Ver Professores"
            />
            <ExercicesCard
              title="Gestão de Horários"
              description={`${stats.scheduledClassesToday} aulas hoje`}
              icon={<CalendarDays className="h-8 w-8 text-primary" />}
              linkHref="/schedules"
              linkText="Ver Horários"
            />
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <TodaysClassesCard />
          <ClassHistoryCard />
        </div>
      </div>
    </AppLayout>
  );
}
