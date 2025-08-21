import { useQuery } from '@tanstack/react-query';
import fetcher from './fetcher';

// ✅ 게시판 목록 가져오기 예시
export const useBoards = () => {
  return useQuery({
    queryKey: ['boards'],
    queryFn: () => fetcher('/api/boards'),
  });
};

// ✅ 게시글 상세 조회
export const useBoardById = (id: string) => {
  return useQuery({
    queryKey: ['board', id],
    queryFn: () => fetcher(`/api/boards/${id}`),
    enabled: !!id, // id가 존재할 때만 fetch
  });
};
