import { getAnalysis } from '@/domain/analysis/services/analysisService';
import { Analysis } from '@/domain/analysis/types/analysis';
import { useQuery } from '@tanstack/react-query';


export const useGetAnalysis = (id: string) => {
    return useQuery<Analysis, Error>({
        queryKey: ['analysis', id],
        queryFn: () => getAnalysis(id),
        enabled: !!id,
        retry: false,
    });
};