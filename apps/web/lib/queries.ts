import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import fetcher from './fetcher';
import type { BoardStatus } from '@/types/board';
import type { Board } from '@/types/board';

// ✅ 게시판 목록 가져오기 예시
export const useBoards = () => {
  return useQuery<Board[]>({
    queryKey: ['boards'],
    queryFn: () => fetcher('/api/boards'),
  });
};

// ✅ 게시글 상세 조회
export const useBoardById = (id: string) => {
  return useQuery<Board>({
    queryKey: ['board', id],
    queryFn: () => fetcher(`/api/boards/${id}`),
    enabled: !!id, // id가 존재할 때만 fetch
  });
};

//수정
export const useUpdateBoard = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: number; title: string; description?: string; status: BoardStatus }) =>
      fetcher(`/api/boards/${vars.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: vars.title,
          description: vars.description,
          status: vars.status,
        }),
      }),
    onSuccess: (_data, vars) => {
      // 상세/목록 캐시 갱신
      qc.invalidateQueries({ queryKey: ['board', String(vars.id)] });
      qc.invalidateQueries({ queryKey: ['boards'] });
      qc.invalidateQueries({ queryKey: ['myBoards'] }); // 쓰고 있다면
    },
  });
};
