import { Grid } from '@mui/material';
import { notFound } from 'next/navigation';
import { AnalyticsCard } from '@/components/features/AnalyticsCard';
import { TranscriptionCard } from '@/components/features/TranscriptionCard';
import { getAnalysisData } from './layout'; // ✅ Importa a função do novo layout

interface AnalysisPageProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function AnalysisPage({ params, searchParams }: AnalysisPageProps) {
  const currentView = searchParams.view || 'transcription';

  const data = await getAnalysisData(params.id);

  if (!data) {
    notFound();
  }

  if (currentView === 'analytics') {
    return (
      <Grid container spacing={4}>
        {data.analytics.map((metric) => (
          <Grid size={{xs: 12, lg: 6, xl: 4}} key={metric.id}>
            <AnalyticsCard title={metric.title}>
              <div className="bg-gray-200 h-64 flex items-center justify-center rounded-lg">
                Gráfico para {metric.title}
              </div>
            </AnalyticsCard>
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <TranscriptionCard transcriptionText={data.transcription} />
  );
}