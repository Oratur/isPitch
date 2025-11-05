import { Grid, Card, CardContent, Skeleton, Box } from '@mui/material';

export function StatsCardsSkeleton() {
  return (
    <Grid container spacing={3}>
      {[1, 2, 3].map((index) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
          <Card 
            variant="card1" 
            sx={{ 
              height: '100%',
              animation: 'fadeIn 0.5s ease-in-out',
              animationDelay: `${index * 0.1}s`,
              animationFillMode: 'backwards',
              '@keyframes fadeIn': {
                '0%': {
                  opacity: 0,
                  transform: 'translateY(20px)'
                },
                '100%': {
                  opacity: 1,
                  transform: 'translateY(0)'
                }
              }
            }}
          >
            <CardContent>
              <Box sx={{ textAlign: 'center' }}>
                <Skeleton 
                  animation="wave"
                  variant="text" 
                  width="60%" 
                  height={56}
                  sx={{ 
                    mx: 'auto', 
                    mb: 1,
                    borderRadius: 1
                  }} 
                />
                <Skeleton 
                  animation="wave"
                  variant="text" 
                  width="80%" 
                  height={24}
                  sx={{ 
                    mx: 'auto',
                    borderRadius: 1
                  }} 
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}