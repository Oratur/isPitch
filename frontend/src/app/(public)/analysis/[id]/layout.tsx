
import { AnalysisSidebar } from '@/components/layouts/AnalysisSideBar';
import { Box } from '@mui/material';
import { notFound } from 'next/navigation';
import { cache } from 'react';

// --- Mock de Dados ---
export const getAnalysisData = cache(async (id: string) => {
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

interface AnalysisLayoutProps {
  children: React.ReactNode;
  params: { id: string };
}

export default async function AnalysisLayout({ children, params }: AnalysisLayoutProps) {
  const data = await getAnalysisData(params.id);

  if (!data) {
    notFound();
  }

  return (
    <Box className="flex flex-1 h-full">
      <AnalysisSidebar 
        fileName={data.fileName} 
        basePath={`/analysis/${params.id}`} 
      />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50 overflow-y-auto">
        {children}
      </main>
    </Box>
  );
}