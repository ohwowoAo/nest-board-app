'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useBoardById, useUpdateBoard } from '@/lib/queries';
import type { Board } from '@/types/board';
import { BoardStatus } from '@/types/board'; // enum 가져오기

export default function EditBoardPage() {
  const params = useParams<{ id: string }>();
  const id: string = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();

  const { data, isLoading, error } = useBoardById(id);
  const { mutateAsync, isPending: isSaving } = useUpdateBoard();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState<string>('');
  const [status, setStatus] = useState<BoardStatus>('PUBLIC');

  useEffect(() => {
    if (!data) return;
    const b = data as Board;
    setTitle(b.title ?? '');
    setDescription(b.description ?? '');
    setStatus((b.status as BoardStatus) ?? 'PUBLIC');
  }, [data]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await mutateAsync({
      id: Number(id),
      title: title.trim(),
      description: description.trim(),
      status,
    });
    router.push(`/boards/${id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 px-4 py-10">
        <div className="mx-auto w-full max-w-2xl animate-pulse">
          <div className="mb-3 h-5 w-32 rounded bg-slate-300" />
          <div className="rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200">
            <div className="mb-3 h-8 w-1/2 rounded bg-slate-200" />
            <div className="mb-2 h-24 w-full rounded bg-slate-100" />
            <div className="h-6 w-40 rounded bg-slate-100" />
          </div>
        </div>
      </div>
    );
  }

  if (error)
    return <p className="px-4 py-10 text-gray-600">에러: {String((error as Error).message)}</p>;
  if (!data) return <p className="px-4 py-10 text-gray-600">게시글을 찾을 수 없습니다.</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 px-4 py-10">
      <div className="mx-auto w-full max-w-2xl">
        {/* 상단 바: 뒤로 / 저장 */}
        <div className="mb-3 flex items-center justify-between">
          <Link href={`/boards/${id}`} className="text-sm text-sky-700 hover:underline">
            ← 상세로
          </Link>
          <div className="flex items-center gap-2">
            {status && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-gray-600 ring-1 ring-slate-200">
                {status}
              </span>
            )}
          </div>
        </div>

        {/* 카드 본문 */}
        <form
          id="edit-form" // ✅ 상단 버튼과 연결
          onSubmit={onSubmit}
          className="rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200"
        >
          <h1 className="mb-4 text-2xl font-bold text-gray-900">게시글 수정</h1>

          {/* 제목 */}
          <label className="mb-2 block text-sm font-medium text-gray-700">제목</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mb-4 w-full rounded-xl border border-slate-200 px-3 py-2 text-gray-900 outline-none ring-0 placeholder:text-slate-400 focus:border-slate-300"
            placeholder="제목을 입력하세요"
          />

          {/* 내용 */}
          <label className="mb-2 block text-sm font-medium text-gray-700">내용</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={8}
            className="mb-4 w-full rounded-xl border border-slate-200 px-3 py-2 text-gray-900 outline-none ring-0 placeholder:text-slate-400 focus:border-slate-300"
            placeholder="내용을 입력하세요"
          />

          {/* 공개여부 */}
          <div className="mb-6 flex items-center gap-4 text-gray-700">
            <span className="text-sm ">공개여부</span>
            <label className="inline-flex items-center gap-2 ">
              <input
                type="radio"
                name="status"
                value="PUBLIC"
                checked={status === 'PUBLIC'}
                onChange={() => setStatus('PUBLIC')}
                className="h-4 w-4"
              />
              <span className="text-sm">PUBLIC</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="status"
                value="PRIVATE"
                checked={status === 'PRIVATE'}
                onChange={() => setStatus('PRIVATE')}
                className="h-4 w-4"
              />
              <span className="text-sm">PRIVATE</span>
            </label>
          </div>

          {/* 하단 버튼 */}
          <div className="flex items-center justify-end gap-2">
            <Link
              href={`/boards/${id}`}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
            >
              취소
            </Link>
            <button
              type="submit"
              form="edit-form"
              disabled={isSaving}
              className="rounded-lg cursor-pointer border border-sky-600 bg-sky-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? '저장 중…' : '저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
