import { getAnalysis } from '@/services/analysisService'
import { Analysis } from '@/types/analysis'
import { useQuery } from '@tanstack/react-query'


export const useGetAnalysis = (id: string) => {
    return useQuery<Analysis, Error>({
        queryKey: ['analysis', id],
        queryFn: () => getAnalysis(id),
        enabled: !!id,
        refetchInterval: (query) => {
            const data = query.state.data;
            return data?.status === 'PENDING' ? 3000 : false;
        },
        retry: false,
    });
}