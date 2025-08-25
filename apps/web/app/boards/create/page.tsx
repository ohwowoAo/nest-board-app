import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import CreateBoardForm from '@/components/CreateBoardForm';

export default async function NewBoardPage() {
  const cookieStore = await cookies();
  if (!cookieStore.get('access_token')) redirect('/login');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 px-4 py-10">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">새 글 작성</h1>
          <Link
            href="/boards"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-gray-700 hover:bg-slate-50"
          >
            목록으로
          </Link>
        </div>

        <CreateBoardForm />
      </div>
    </div>
  );
}
