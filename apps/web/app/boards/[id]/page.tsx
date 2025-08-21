'use client';

import { useBoardById } from '@/lib/queries';
import { useParams } from 'next/navigation';

export default function BoardDetailPage() {
  const { id } = useParams();
  const { data, isLoading, error } = useBoardById(id as string);

  if (isLoading) return <p>로딩 중...</p>;
  if (error) return <p>에러 발생: {(error as Error).message}</p>;
  if (!data) return <p>게시글을 찾을 수 없습니다</p>;

  return (
    <div>
      <h1>{data.title}</h1>
      <p>{data.content}</p>
    </div>
  );
}
