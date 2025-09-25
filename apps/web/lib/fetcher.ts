export default async function fetcher(input: RequestInfo, init?: RequestInit) {
  const getToken = () =>
    document.cookie
      .split('; ')
      .find((row) => row.startsWith('access_token='))
      ?.split('=')[1];

  let token = getToken();

  let res = await fetch(input, {
    ...init,
    headers: {
      ...init?.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: 'include',
  });

  if (res.status === 401) {
    console.warn('Access token expired, trying refresh...');

    const refreshRes = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    });

    if (refreshRes.ok) {
      const { accessToken } = await refreshRes.json();
      document.cookie = `access_token=${accessToken}; path=/`;

      token = getToken();

      res = await fetch(input, {
        ...init,
        headers: {
          ...init?.headers,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
      });
    } else {
      window.location.href = '/login';
      throw new Error('세션이 만료되었습니다. 다시 로그인 해주세요.');
    }
  }

  if (res.ok) {
    const ct = res.headers.get('content-type') || '';
    return ct.includes('application/json') ? res.json() : res.text();
  }

  const errorMessage = await res.text().catch(() => res.statusText);
  console.error(`[fetcher error] ${res.status} ${res.statusText} → ${errorMessage}`);
  throw new Error(`[${res.status}] ${errorMessage}`);
}
