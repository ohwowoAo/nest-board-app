'use client';

import { useBoards } from '@/lib/queries';
import Link from 'next/link';

export default function BoardsPage() {
  const { data, isLoading, error } = useBoards();

  if (isLoading) return <p>불러오는 중...</p>;
  if (error) return <p>에러 발생: {(error as Error).message}</p>;

  return (
    <div>
      <h1>게시글 목록</h1>
      <ul>
        {data?.map((board: any) => (
          <li key={board.id}>
            <Link href={`/boards/${board.id}`}>{board.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
