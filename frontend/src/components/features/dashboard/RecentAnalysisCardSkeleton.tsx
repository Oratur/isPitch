import { Card, CardHeader, CardContent, Box, Skeleton, Stack } from '@mui/material';
import { TrendingUp } from 'lucide-react';
import theme from '@/styles/theme';

export function RecentAnalysisCardSkeleton() {
  return (
    <Card variant="card1" sx={{ height: '100%' }}>
      <CardHeader
        title={
          <Skeleton 
            animation="wave"
            variant="text" 
            width="60%" 
            height={32}
            sx={{ borderRadius: 1 }}
          />
        }
        avatar={<TrendingUp size={24} color={theme.palette.purple.light1} />}
        sx={{ bgcolor: theme.palette.purple.light2 }}
      />
      
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Skeleton animation="wave" variant="circular" width={20} height={20} />
          <Skeleton 
            animation="wave"
            variant="text" 
            width="70%" 
            height={24}
            sx={{ borderRadius: 1 }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <Skeleton animation="wave" variant="circular" width={18} height={18} />
          <Skeleton 
            animation="wave"
            variant="text" 
            width="50%" 
            height={20}
            sx={{ borderRadius: 1 }}
          />
        </Box>

        <Stack direction="row" spacing={2} mb={3}>
          <Skeleton 
            animation="wave"
            variant="rounded" 
            width={80} 
            height={24}
            sx={{ borderRadius: 2 }}
          />
          <Skeleton 
            animation="wave"
            variant="rounded" 
            width={70} 
            height={24}
            sx={{ borderRadius: 2 }}
          />
          <Skeleton 
            animation="wave"
            variant="rounded" 
            width={75} 
            height={24}
            sx={{ borderRadius: 2 }}
          />
        </Stack>

        <Skeleton 
          animation="wave"
          variant="rounded" 
          width="100%" 
          height={42}
          sx={{ borderRadius: 1 }}
        />
      </CardContent>
    </Card>
  );
}