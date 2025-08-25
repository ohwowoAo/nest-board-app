'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (loading) return;
    setLoading(true);
    setMessage('');
    setIsError(false);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || '회원가입 실패');
      }

      await res.json();
      setMessage('회원가입 성공! 이제 로그인해주세요.');
      setIsError(false);
      setTimeout(() => router.push('/login'), 1500);
    } catch (err: any) {
      setMessage(err.message || '문제가 발생했습니다.');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = username.trim().length > 3 && password.trim().length >= 4 && !loading;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white/90 p-8 shadow-lg backdrop-blur-sm ring-1 ring-slate-200">
        {/* 로고 + 타이틀 */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-r from-sky-400 to-indigo-400 text-white font-bold shadow-sm">
            W
          </div>
          {/* <h1 className="text-xl font-semibold text-gray-800">LumiBoard</h1> */}
        </div>

        <h2 className="text-center text-2xl font-bold text-gray-900">회원가입</h2>
        <p className="mt-2 text-center text-sm text-gray-500">간단한 정보로 시작해 보세요</p>

        {/* 폼 */}
        <form onSubmit={handleSignup} className="mt-8 space-y-4">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="아이디 (이메일)"
            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호 (6자 이상)"
            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
          />

          <button
            type="submit"
            disabled={!canSubmit}
            aria-busy={loading}
            className="w-full rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 py-3 text-white font-medium shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? '가입 중…' : '회원가입'}
          </button>
        </form>

        {/* 메시지 */}
        {message && (
          <p className={`mt-4 text-center text-sm ${isError ? 'text-red-600' : 'text-green-600'}`}>
            {message}
          </p>
        )}

        {/* 이미 계정? */}
        <p className="mt-6 text-center text-sm text-gray-600">
          이미 계정이 있으신가요?{' '}
          <Link href="/login" className="font-medium text-gray-900 hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
