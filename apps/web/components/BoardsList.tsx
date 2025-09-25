'use client';

import { useEffect, useMemo, useState } from 'react';
import ToggleSwitch from '@/components/ToggleSwitch';
import Link from 'next/link';
import { Lock, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Board = {
  id: number;
  title: string;
  description: string | null;
  status: string;
  userId: number;
};

export default function BoardsList() {
  const router = useRouter();
  const [mine, setMine] = useState(false); // false=전체, true=내 글
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const endpoint = useMemo(() => (mine ? '/api/boards/me' : '/api/boards'), [mine]);

  useEffect(() => {
    const ac = new AbortController();
    setLoading(true);
    setErr(null);

    void (async () => {
      try {
        const res = await fetch(endpoint, { signal: ac.signal, cache: 'no-store' });
        if (res.status === 401) {
          window.location.href = '/login';
          return;
        }
        const data = (await res.json()) as Board[];
        setBoards(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!(e instanceof DOMException && e.name === 'AbortError')) {
          setErr(e instanceof Error ? e.message : String(e));
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => ac.abort();
  }, [endpoint]);

  /* 로그아웃 */
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch {
      // 서버 응답 없어도 그냥 쿠키 삭제
    }
    document.cookie = 'access_token=; Max-Age=0; path=/';
    document.cookie = 'refresh_token=; Max-Age=0; path=/';
    router.replace('/login');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        {/* 헤더 왼쪽*/}
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-900">보드</h1>
          <Link
            href="/boards/create"
            aria-label="새 글 작성"
            className="ml-1 inline-flex h-6 w-6 items-center justify-center mt-[-2px] rounded-full
                       bg-gray-900 text-white transition hover:bg-gray-600
                       focus-visible:outline-none "
          >
            <span className="text-2xl leading-none">+</span>
          </Link>
        </div>

        {/* 헤더 오른쪽: 토글 + 프로필 메뉴 */}
        <div className="flex items-center gap-3 relative">
          <ToggleSwitch checked={mine} onChange={setMine} />

          {/* 프로필 아이콘 */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 cursor-pointer"
          >
            <User size={16} className="text-gray-700" />
          </button>

          {/* 드롭다운 */}
          {menuOpen && (
            <div className="absolute right-0 top-10 w-32 rounded-lg bg-white shadow ring-1 ring-slate-200 overflow-hidden">
              <button
                onClick={handleLogout}
                className="w-full text-gray-500 px-3 py-2 text-left text-sm hover:bg-slate-100  cursor-pointer"
              >
                로그아웃
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 목록 */}
      {err && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
          {err}
        </p>
      )}

      {!loading && !err && (
        <>
          {boards.length === 0 ? (
            <p className="text-gray-600">
              {mine ? '내가 작성한 글이 없어요.' : '아직 보드가 없어요.'}
            </p>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2">
              {boards
                .filter((b) => mine || b.status !== 'PRIVATE')
                .map((b) => (
                  <li key={b.id} className="rounded-xl bg-white shadow ring-1 ring-slate-200">
                    <Link href={`/boards/${b.id}`} className="p-5 block">
                      <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-1">
                        <span className="truncate">{b.title}</span>
                        {b.status === 'PRIVATE' && <Lock size={14} className="text-gray-500" />}
                      </h2>
                      {b.description && (
                        <p className="mt-1 line-clamp-2 text-sm text-gray-600">{b.description}</p>
                      )}
                      <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                        <span className="rounded-full bg-slate-100 px-2 py-1">{b.status}</span>
                        <span>#{b.id}</span>
                      </div>
                    </Link>
                  </li>
                ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
