'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // 로그인 로직 구현

    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const text = await res.text();
      const data = text ? (JSON.parse(text) as { ok?: boolean; message?: string }) : {};

      if (!res.ok || data.ok === false) {
        throw new Error(data.message ?? `로그인 실패 (${res.status})`);
      }
      // 로그인 성공 후 처리
      router.push('/boards');
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      setMessage(msg || '로그인 중 문제가 발생했습니다.');
      setIsError(true);
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white/90 p-8 shadow-lg backdrop-blur-sm ring-1 ring-slate-200">
        {/* 로고 */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-r from-sky-400 to-indigo-400 text-white font-bold shadow-sm">
            W
          </div>
          <h1 className="text-xl font-semibold text-gray-800">WaveBoard</h1>
        </div>

        {/* 입력 */}
        <form className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="아이디 (이메일)"
            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
          />

          <button
            type="submit"
            className="w-full rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 py-3 text-white font-medium shadow-sm transition hover:opacity-90"
            onClick={handleLogin}
          >
            로그인
          </button>
        </form>
        {/* 메시지 */}
        {message && (
          <p className={`mt-4 text-center text-sm ${isError ? 'text-red-600' : 'text-green-600'}`}>
            {message}
          </p>
        )}
        {/* 링크 */}
        <div className="mt-6 text-right text-sm text-gray-600">
          {/* <Link href="/forgot" className="hover:underline">
            비밀번호 찾기
          </Link> */}
          <Link href="/signup" className="hover:underline">
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
}
