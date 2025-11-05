import { Card, CardHeader, CardContent, Box, Skeleton, Stack } from '@mui/material';
import { BarChart2 } from 'lucide-react';
import theme from '@/styles/theme';

export function AnalysisChartSkeleton() {
  return (
    <Card variant="card1" sx={{ height: '100%' }}>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${theme.palette.purple.main} 0%, #9333EA 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <BarChart2 size={20} color="white" />
            </Box>
            <Skeleton 
              animation="wave"
              variant="text" 
              width="50%" 
              height={32}
              sx={{ borderRadius: 1 }}
            />
          </Box>
        }
        sx={{ bgcolor: theme.palette.purple.light2 }}
      />
      
      <CardContent>
        <Stack 
          direction="row" 
          spacing={2} 
          sx={{ 
            mb: 3,
            p: 2,
            bgcolor: theme.palette.purple.dark + '60',
            borderRadius: 2,
            border: `1px solid ${theme.palette.purple.light1}20`,
          }}
        >
          {[1, 2, 3, 4].map((index) => (
            <Box key={index} sx={{ flex: 1, textAlign: 'center' }}>
              <Skeleton 
                animation="wave"
                variant="text" 
                width="80%" 
                height={16}
                sx={{ mx: 'auto', mb: 0.5, borderRadius: 1 }}
              />
              <Skeleton 
                animation="wave"
                variant="text" 
                width="60%" 
                height={32}
                sx={{ mx: 'auto', borderRadius: 1 }}
              />
            </Box>
          ))}
        </Stack>

        <Box sx={{ width: '100%', height: 280, position: 'relative' }}>
          <Box sx={{ 
            position: 'absolute', 
            bottom: 60, 
            left: 40, 
            right: 20,
            top: 20,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Box 
                key={i}
                sx={{ 
                  height: 1,
                  bgcolor: theme.palette.purple.light1 + '10'
                }} 
              />
            ))}
          </Box>

          <Box sx={{ 
            position: 'absolute', 
            bottom: 60, 
            left: 0, 
            top: 20,
            width: 30,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            pr: 1
          }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton 
                key={i}
                animation="wave"
                variant="text" 
                width={20} 
                height={12}
              />
            ))}
          </Box>

          <Box sx={{ 
            position: 'absolute',
            bottom: 60,
            left: 40,
            right: 20,
            height: 200,
            display: 'flex', 
            alignItems: 'flex-end', 
            justifyContent: 'space-around',
          }}>
            {[50, 70, 40, 85, 60, 75, 55, 90, 65, 80, 70, 60].map((height, index) => (
              <Skeleton
                key={index}
                animation="wave"
                variant="circular"
                sx={{
                  width: 12,
                  height: 12,
                  mb: `${height}%`,
                  animationDelay: `${index * 0.1}s`
                }}
              />
            ))}
          </Box>

          <Box sx={{ 
            position: 'absolute',
            bottom: 20,
            left: 40,
            right: 20,
            display: 'flex',
            justifyContent: 'space-around'
          }}>
            {Array.from({ length: 12 }).map((_, index) => (
              <Skeleton 
                key={index}
                animation="wave"
                variant="text" 
                width={24} 
                height={12}
              />
            ))}
          </Box>

          <Box sx={{
            position: 'absolute',
            bottom: 60,
            left: 40,
            right: 20,
            height: 200,
            overflow: 'hidden'
          }}>
            <svg width="100%" height="100%" style={{ position: 'absolute' }}>
              <defs>
                <linearGradient id="skeletonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={theme.palette.purple.light1} stopOpacity="0.05" />
                  <stop offset="50%" stopColor={theme.palette.purple.main} stopOpacity="0.15" />
                  <stop offset="100%" stopColor={theme.palette.purple.light1} stopOpacity="0.05" />
                </linearGradient>
              </defs>
              <path
                d="M 0 120 Q 100 80, 200 100 T 400 90 T 600 95 T 800 85"
                stroke="url(#skeletonGradient)"
                strokeWidth="3"
                fill="none"
                opacity="0.3"
              />
            </svg>
          </Box>
        </Box>

        <Box 
          sx={{ 
            mt: 2,
            pt: 2,
            borderTop: `1px solid ${theme.palette.purple.light1}20`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Skeleton 
            animation="wave"
            variant="text" 
            width={120} 
            height={20}
            sx={{ borderRadius: 1 }}
          />
          
          <Skeleton 
            animation="wave"
            variant="rounded" 
            width={80} 
            height={24}
            sx={{ borderRadius: 2 }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}