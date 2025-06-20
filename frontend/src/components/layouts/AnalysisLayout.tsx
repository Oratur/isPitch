import { Box } from '@mui/material';
import { AnalysisSidebar } from './AnalysisSideBar';


interface AnalysisLayoutProps {
  analysisId: string;
  fileName: string;
  children: React.ReactNode;
}

export function AnalysisLayout({ children, analysisId, fileName }: AnalysisLayoutProps) {
  return (
    <Box className="flex flex-1 h-full">
      <AnalysisSidebar
        fileName={fileName}
        basePath={`/analysis/${analysisId}`}
      />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50 overflow-y-auto">
        {children}
      </main>
    </Box>
  );
}