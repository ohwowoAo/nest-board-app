'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { BoardStatus } from '@/types/board';

export default function CreateBoardForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [status, setStatus] = useState<BoardStatus>('PUBLIC');
  const OPTIONS: readonly BoardStatus[] = ['PUBLIC', 'PRIVATE'];

  const isBoardStatus = (v: string): v is BoardStatus => v === 'PUBLIC' || v === 'PRIVATE';
  const onChangeStatus = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (isBoardStatus(v)) setStatus(v);
  };
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setErr(null);
    try {
      const res = await fetch('/api/boards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, status }),
      });

      const text = await res.text();
      if (!res.ok) {
        let msg = '생성 실패';
        try {
          const data = JSON.parse(text) as { message?: string };
          if (data?.message) msg = data.message;
        } catch {
          // Ignore JSON parse errors
        }
        throw new Error(msg);
      }

      const created = text ? (JSON.parse(text) as { id?: number }) : {};
      if (created?.id) {
        router.replace(`/boards/${created.id}`);
      } else {
        router.replace('/boards');
      }
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200"
    >
      {err && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
          {err}
        </p>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">제목</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={100}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
          placeholder="제목을 입력하세요"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">내용</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
          className="w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
          placeholder="내용을 입력하세요"
        />
      </div>

      <fieldset className="flex items-center gap-4">
        <span className="text-sm text-gray-700">공개여부</span>
        {OPTIONS.map((s) => (
          <label key={s} className="inline-flex items-center gap-2 text-gray-600">
            <input
              type="radio"
              name="status"
              value={s}
              checked={status === s}
              onChange={onChangeStatus}
              className="h-4 w-4"
            />
            <span className="text-sm">{s}</span>
          </label>
        ))}
      </fieldset>

      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => history.back()}
          className="rounded-lg cursor-pointer border border-slate-300 px-4 py-2 text-sm text-gray-700 hover:bg-slate-50"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg cursor-pointer border border-gray-900 bg-gray-900 px-4 py-2 text-sm text-white hover:bg-black disabled:opacity-60"
        >
          {submitting ? '저장 중…' : '저장'}
        </button>
      </div>
    </form>
  );
}
