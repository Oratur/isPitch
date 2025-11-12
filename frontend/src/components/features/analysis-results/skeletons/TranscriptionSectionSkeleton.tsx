import { Card, CardHeader, CardContent, Box, Skeleton } from '@mui/material';
import theme from '@/styles/theme';

export function TranscriptionSectionSkeleton() {
  return (
    <Card sx={{ bgcolor: theme.palette.purple.light2 }}>
      <CardHeader
        avatar={<Skeleton variant="circular" width={24} height={24} animation="wave" />}
        title={<Skeleton variant="text" width="30%" height={28} animation="wave" />}
        action={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Skeleton variant="circular" width={32} height={32} animation="wave" />
            <Skeleton variant="circular" width={32} height={32} animation="wave" />
          </Box>
        }
      />
      <CardContent>
        <Box
          sx={{
            bgcolor: theme.palette.purple.dark,
            borderRadius: 2,
            p: 3,
            height: 300,
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
          }}
        >
          {[100, 95, 85, 100, 90, 95, 100, 85].map((width, idx) => (
            <Skeleton 
              key={idx}
              variant="text" 
              width={`${width}%`} 
              height={20}
              animation="wave"
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}