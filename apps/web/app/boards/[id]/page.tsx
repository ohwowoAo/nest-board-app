'use client';

import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useBoardById, useMe } from '@/lib/queries';
import { BoardStatus } from '@/types/board';
import { useState } from 'react';
import { Lock, MoreVertical } from 'lucide-react';

type Board = {
  id: number;
  title: string;
  description?: string | null;
  status?: BoardStatus;
  userId?: number;
  username?: string | null;
};

export default function BoardDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id: string = Array.isArray(params.id) ? params.id[0] : params.id;

  const { data, isLoading, error } = useBoardById(id);
  const { data: me } = useMe();
  const [isDeleting, setIsDeleting] = useState(false);
  const [open, setOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 px-4 py-10">
        <div className="mx-auto w-full max-w-2xl animate-pulse">
          <div className="mb-3 h-5 w-28 rounded bg-slate-300" />
          <div className="rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200">
            <div className="mb-3 h-8 w-2/3 rounded bg-slate-200" />
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-slate-100" />
              <div className="h-4 w-5/6 rounded bg-slate-100" />
              <div className="h-4 w-3/4 rounded bg-slate-100" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (error) return <p>에러: {String((error as Error).message)}</p>;
  if (!data) return <p>게시글을 찾을 수 없습니다.</p>;

  const board = data as Board;
  const body = board.description ?? '';
  const authorLabel = board.username ?? '알 수 없음';

  /* 삭제 */
  const handleDelete = async () => {
    if (!confirm('정말 이 게시글을 삭제하시겠습니까?')) return;

    try {
      setIsDeleting(true);
      const res = await fetch(`/api/boards/${board.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(await res.text());
      alert('게시글이 삭제되었습니다.');
      router.replace('/boards');
    } catch (err) {
      alert('삭제 중 오류: ' + (err as Error).message);
    } finally {
      setIsDeleting(false);
      setOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 px-4 py-10">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-3 flex items-center justify-between">
          <Link href="/boards" className="text-sm text-sky-700 hover:underline">
            ← 목록으로
          </Link>

          <div className="flex items-center gap-2">
            {board.status && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-gray-600 ring-1 ring-slate-200">
                {board.status}
              </span>
            )}
          </div>
        </div>

        {/* 카드 본문 */}
        <div className="rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200">
          <div className="flex justify-between items-start relative">
            <h1 className="mb-1 flex items-center gap-2 text-2xl font-bold text-gray-900">
              {board.title}
              {board.status === 'PRIVATE' && <Lock className="h-5 w-5 text-gray-500" />}
            </h1>

            {me?.id === board.userId && (
              <div className="relative">
                <button
                  onClick={() => setOpen((prev) => !prev)}
                  className="rounded p-2 hover:bg-slate-100 cursor-pointer"
                >
                  <MoreVertical className="h-5 w-5 text-gray-600" />
                </button>

                {open && (
                  <div className="absolute right-0 mt-2 w-24 overflow-hidden rounded-lg border bg-white shadow">
                    <Link
                      href={`/boards/${board.id}/edit`}
                      className="block px-4 py-2 text-sm hover:bg-slate-50 text-gray-500"
                      onClick={() => setOpen(false)}
                    >
                      수정
                    </Link>
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="block cursor-pointer w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-50 disabled:opacity-50"
                    >
                      {isDeleting ? '삭제 중...' : '삭제'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 작성자 영역 */}
          <div className="mb-10 text-sm text-gray-600">
            작성자: <span className="font-medium text-gray-800">{authorLabel}</span>
          </div>

          {body ? (
            <p className="whitespace-pre-wrap leading-7 text-gray-800">{body}</p>
          ) : (
            <p className="text-gray-500">내용이 없습니다.</p>
          )}

          <div className="mt-10 text-sm text-gray-500">보드 ID #{board.id}</div>
        </div>
      </div>
    </div>
  );
}
