import { Grid } from '@mui/material';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { AnalyticsCard } from '@/components/features/AnalyticsCard';
import { TranscriptionCard } from '@/components/features/TranscriptionCard';
import { AnalysisLayout } from '@/components/layouts/AnalysisLayout'; // ✅ Importa o novo componente de layout

// --- Mock de Dados ---
const getAnalysisData = cache(async (id: string) => {
  console.log(`Buscando dados para o ID: ${id}`);
  if (id === 'not-found') return null;
  return {
    id,
    fileName: 'audio_file_name.mp3',
    transcription: 'Mussum Ipsum, cacilds vidis litro abertis...',
    analytics: [
      { id: 'metric1', title: 'Análise de Sentimento' },
      { id: 'metric2', title: 'Densidade de Palavras-chave' },
      { id: 'metric3', title: 'Tópicos Principais' },
    ],
  };
});

interface AnalysisPageProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function AnalysisPage({ params, searchParams }: AnalysisPageProps) {
  const data = await getAnalysisData(params.id);
  
  if (!data) {
    notFound();
  }

  const currentView = searchParams.view || 'transcription';

  return (
    // ✅ A página agora se envolve com o AnalysisLayout
    <AnalysisLayout data={data}>
      {/*
        O conteúdo abaixo será passado como `children` para o AnalysisLayout
        e renderizado dentro da tag <main> dele.
      */}
      {currentView === 'analytics' ? (
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
      ) : (
        <TranscriptionCard transcriptionText={data.transcription} />
      )}
    </AnalysisLayout>
  );
}