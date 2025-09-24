'use client';

import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useBoardById } from '@/lib/queries';
import { BoardStatus } from '@/types/board';
import { useState } from 'react';

type Board = {
  id: number;
  title: string;
  description?: string | null;
  content?: string | null;
  status?: BoardStatus;
  userId?: number;
  username?: string | null;
};

export default function BoardDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const { data, isLoading, error } = useBoardById(id);
  const [isDeleting, setIsDeleting] = useState(false);

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

  if (error)
    return <p className="px-4 py-10 text-gray-600">에러: {String((error as Error).message)}</p>;
  if (!data) return <p className="px-4 py-10 text-gray-600">게시글을 찾을 수 없습니다.</p>;

  const board = data as Board;
  const body = board.description ?? board.content ?? '';
  const authorLabel = board.username ?? '알 수 없음';

  /* 삭제 */
  const handleDelete = async () => {
    if (!confirm('정말 이 게시글을 삭제하시겠습니까?')) return;

    try {
      setIsDeleting(true);
      const res = await fetch(`/api/boards/${board.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error(await res.text());

      alert('게시글이 삭제되었습니다.');
      router.replace('/boards');
    } catch (err) {
      alert('삭제 중 오류가 발생했습니다: ' + (err as Error).message);
    } finally {
      setIsDeleting(false);
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
          <div className="flex justify-between items-start">
            <h1 className="mb-1 text-2xl font-bold text-gray-900">{board.title}</h1>
            <div className="flex gap-2">
              <Link
                href={`/boards/${board.id}/edit`}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
              >
                수정
              </Link>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="rounded-lg border cursor-pointer border-red-500 bg-red-500 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-red-600 disabled:opacity-50"
              >
                {isDeleting ? '삭제 중...' : '삭제'}
              </button>
            </div>
          </div>

          {/* 작성자 영역 */}
          <div className="mb-4 text-sm text-gray-600">
            작성자: <span className="font-medium text-gray-800">{authorLabel}</span>
          </div>

          {body ? (
            <p className="whitespace-pre-wrap leading-7 text-gray-800">{body}</p>
          ) : (
            <p className="text-gray-500">내용이 없습니다.</p>
          )}

          <div className="mt-8 text-sm text-gray-500">
            보드 ID #{board.id && board.id}
            {board.userId ? ` · 작성자 ID #${board.userId}` : ''}
          </div>
        </div>
      </div>
    </div>
  );
}
