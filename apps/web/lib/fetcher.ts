const fetcher = async <T = any>(url: string, options?: RequestInit): Promise<T> => {
  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error('데이터를 불러오는데 실패했습니다');
  }

  return res.json();
};

export default fetcher;
