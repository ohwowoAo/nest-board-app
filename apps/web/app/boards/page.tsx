// apps/web/app/boards/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import BoardsList from '@/components/BoardsList';

export default async function BoardsPage() {
  const cookieStore = await cookies();
  if (!cookieStore.get('access_token')) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 px-4 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <BoardsList />
      </div>
    </div>
  );
}
