import { Card, CardContent, Box, Skeleton } from '@mui/material';
import theme from '@/styles/theme';

export function OverallScoreCardSkeleton() {
  return (
    <Card 
      sx={{ 
        mb: 4,
        bgcolor: theme.palette.purple.light2,
        position: 'relative',
        overflow: 'visible'
      }}
    >
      <Skeleton 
        variant="rectangular" 
        width={200} 
        height={40}
        sx={{
          position: 'absolute',
          top: -20,
          left: '50%',
          transform: 'translateX(-50%)',
          borderRadius: 3,
        }}
        animation="wave"
      />
      
      <CardContent sx={{ pt: 5 }}>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Skeleton 
            variant="text" 
            width="50%" 
            height={32} 
            sx={{ mx: 'auto', mb: 1, borderRadius: 1 }}
            animation="wave"
          />
          <Skeleton 
            variant="rectangular" 
            width="100%" 
            height={12}
            sx={{ borderRadius: 6 }}
            animation="wave"
          />
        </Box>
      </CardContent>
    </Card>
  );
}