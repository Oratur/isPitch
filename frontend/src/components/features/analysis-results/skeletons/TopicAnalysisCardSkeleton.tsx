import { Card, CardHeader, CardContent, Skeleton } from '@mui/material';
import theme from '@/styles/theme';

export function TopicAnalysisCardSkeleton() {
  return (
    <Card sx={{ bgcolor: theme.palette.purple.light2 }}>
      <CardHeader
        avatar={<Skeleton variant="circular" width={24} height={24} animation="wave" />}
        title={<Skeleton variant="text" width="40%" height={28} animation="wave" />}
      />
      <CardContent>
        <Skeleton variant="text" width="60%" height={20} sx={{ mb: 3 }} animation="wave" />
        {[1, 2, 3, 4].map((i) => (
          <Skeleton 
            key={`topic-${i}`}
            variant="rectangular" 
            width="100%" 
            height={60} 
            sx={{ borderRadius: 1, mb: 1 }} 
            animation="wave"
          />
        ))}
      </CardContent>
    </Card>
  );
}