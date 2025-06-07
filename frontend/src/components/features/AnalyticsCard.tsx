import { Card, CardContent, Typography, CardHeader } from '@mui/material';
import { BarChart3 } from 'lucide-react';

interface AnalyticsCardProps {
  title: string;
  children: React.ReactNode;
}

export function AnalyticsCard({ title, children }: AnalyticsCardProps) {
  return (
    <Card elevation={2} sx={{ borderRadius: 3, height: '100%' }}>
      <CardHeader
        title={<Typography variant="h6">{title}</Typography>}
        avatar={<BarChart3 size={24} className="text-gray-500" />}
        sx={{ bgcolor: 'grey.100' }}
      />
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}