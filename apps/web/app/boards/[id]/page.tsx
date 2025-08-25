import Link from 'next/link';
import { cookies, headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';

type Board = {
  id: number;
  title: string;
  description?: string | null;
  content?: string | null;
  status?: string;
  userId?: number;
};

function cookieHeaderString(all: { name: string; value: string }[]) {
  return all.map((c) => `${c.name}=${encodeURIComponent(c.value)}`).join('; ');
}

export default async function BoardDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const cookieStore = await cookies();
  if (!cookieStore.get('access_token')) redirect('/login');

  const h = await headers();
  const proto = h.get('x-forwarded-proto') ?? 'http';
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000';
  const base = `${proto}://${host}`;

  const res = await fetch(`${base}/api/boards/${id}`, {
    headers: { cookie: cookieHeaderString(cookieStore.getAll()) },
    cache: 'no-store',
  });

  if (res.status === 404) notFound();
  if (!res.ok) redirect('/login');

  const board = (await res.json()) as Board;
  const body = board.description ?? board.content ?? '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 px-4 py-10">
      <div className="mx-auto w-full max-w-2xl">
        {/* 카드 밖 상단 바 */}
        <div className="mb-3 flex items-center justify-between">
          <Link href="/boards" className="text-sm text-sky-700 hover:underline">
            ← 목록으로
          </Link>
          {board.status && (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-gray-600 ring-1 ring-slate-200">
              {board.status}
            </span>
          )}
        </div>

        {/* 카드 본문 */}
        <div className="rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200">
          <h1 className="mb-3 text-2xl font-bold text-gray-900">{board.title}</h1>
          {body ? (
            <p className="whitespace-pre-wrap leading-7 text-gray-800">{body}</p>
          ) : (
            <p className="text-gray-500">내용이 없습니다.</p>
          )}
          <div className="mt-8 text-sm text-gray-500">
            #{board.id}
            {board.userId ? ` · 작성자: #${board.userId}` : ''}
          </div>
        </div>
      </div>
    </div>
  );
}
