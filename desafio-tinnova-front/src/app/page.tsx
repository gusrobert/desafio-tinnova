"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/exercicios');
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Redirecionando...</p>
    </div>
  );
}
