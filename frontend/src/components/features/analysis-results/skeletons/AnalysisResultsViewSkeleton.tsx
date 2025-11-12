import { Box, Grid, Skeleton, Card, CardHeader, CardContent } from '@mui/material';
import theme from '@/styles/theme';

export function AnalysisResultsViewSkeleton() {
  return (
    <Box sx={{ p: { xs: 2, sm: 3, lg: 4 }, minHeight: '100vh' }}>
      {/* Header Skeleton */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Skeleton variant="rectangular" width={56} height={56} sx={{ borderRadius: 2 }} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="40%" height={40} />
            <Skeleton variant="text" width="30%" height={24} />
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="circular" width={40} height={40} />
          </Box>
        </Box>
      </Box>

      {/* Overall Score Skeleton */}
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
        />
        <CardContent sx={{ pt: 5 }}>
          <Skeleton variant="text" width="50%" height={32} sx={{ mx: 'auto', mb: 1 }} />
          <Skeleton variant="rectangular" width="100%" height={12} sx={{ borderRadius: 6 }} />
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Métricas Principais - 3 cards */}
        {[1, 2, 3].map((i) => (
          <Grid size={{xs: 12, md: 4}} key={`metric-${i}`}>
            <Card sx={{ bgcolor: theme.palette.purple.light2, height: '100%' }}>
              <CardHeader
                avatar={<Skeleton variant="circular" width={24} height={24} />}
                title={<Skeleton variant="text" width="60%" height={28} />}
              />
              <CardContent>
                <Skeleton variant="text" width="50%" height={48} sx={{ mx: 'auto', mb: 1 }} />
                <Skeleton variant="rectangular" width="100%" height={1} sx={{ my: 2 }} />
                <Skeleton variant="text" width="80%" height={20} sx={{ mx: 'auto' }} />
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Transcrição Skeleton */}
        <Grid size={{xs: 12}}>
          <Card sx={{ bgcolor: theme.palette.purple.light2 }}>
            <CardHeader
              avatar={<Skeleton variant="circular" width={24} height={24} />}
              title={<Skeleton variant="text" width="30%" height={28} />}
              action={
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Skeleton variant="circular" width={32} height={32} />
                  <Skeleton variant="circular" width={32} height={32} />
                </Box>
              }
            />
            <CardContent>
              <Skeleton variant="rectangular" width="100%" height={300} sx={{ borderRadius: 2 }} />
            </CardContent>
          </Card>
        </Grid>

        {/* Riqueza Lexical e Vocabulário - 2 cards */}
        {[1, 2].map((i) => (
          <Grid size={{xs: 12, md: 4}} key={`vocab-${i}`}>
            <Card sx={{ bgcolor: theme.palette.purple.light2, height: '100%' }}>
              <CardHeader
                avatar={<Skeleton variant="circular" width={24} height={24} />}
                title={<Skeleton variant="text" width="50%" height={28} />}
              />
              <CardContent>
                <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
                <Skeleton variant="rectangular" width="100%" height={8} sx={{ borderRadius: 4, mb: 2 }} />
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Skeleton variant="rectangular" width="50%" height={80} sx={{ borderRadius: 2 }} />
                  <Skeleton variant="rectangular" width="50%" height={80} sx={{ borderRadius: 2 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Análise de Tópicos Skeleton */}
        <Grid size={{xs: 12}}>
          <Card sx={{ bgcolor: theme.palette.purple.light2 }}>
            <CardHeader
              avatar={<Skeleton variant="circular" width={24} height={24} />}
              title={<Skeleton variant="text" width="40%" height={28} />}
            />
            <CardContent>
              <Skeleton variant="text" width="60%" height={20} sx={{ mb: 3 }} />
              {[1, 2, 3].map((i) => (
                <Skeleton 
                  key={`topic-${i}`}
                  variant="rectangular" 
                  width="100%" 
                  height={60} 
                  sx={{ borderRadius: 1, mb: 1 }} 
                />
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Recomendações Skeleton */}
        <Grid size={{xs: 12}}>
          <Skeleton 
            variant="rectangular" 
            width="100%" 
            height={200} 
            sx={{ borderRadius: 2 }} 
          />
        </Grid>

        {/* Action Buttons Skeleton */}
        <Grid size={{xs: 12}}>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Skeleton variant="rectangular" width={180} height={48} sx={{ borderRadius: 1 }} />
            <Skeleton variant="rectangular" width={180} height={48} sx={{ borderRadius: 1 }} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}