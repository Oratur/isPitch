import { Card, CardHeader, CardContent, Box, Skeleton } from '@mui/material';
import theme from '@/styles/theme';

export function MetricCardSkeleton() {
  return (
    <Card sx={{ bgcolor: theme.palette.purple.light2, height: '100%' }}>
      <CardHeader
        avatar={<Skeleton variant="circular" width={24} height={24} animation="wave" />}
        title={<Skeleton variant="text" width="60%" height={28} animation="wave" />}
      />
      <CardContent>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Skeleton 
            variant="text" 
            width="50%" 
            height={48} 
            sx={{ mx: 'auto', mb: 1 }}
            animation="wave"
          />
        </Box>
        <Skeleton 
          variant="rectangular" 
          width="100%" 
          height={1} 
          sx={{ my: 2 }}
          animation="wave"
        />
        <Skeleton 
          variant="text" 
          width="80%" 
          height={20} 
          sx={{ mx: 'auto' }}
          animation="wave"
        />
      </CardContent>
    </Card>
  );
}