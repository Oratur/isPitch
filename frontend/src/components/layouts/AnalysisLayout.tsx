import { Box } from '@mui/material';
import { AnalysisSidebar } from './AnalysisSideBar';

interface AnalysisData {
  id: string;
  fileName: string;
}

interface AnalysisLayoutProps {
  children: React.ReactNode;
  data: AnalysisData;
}

export function AnalysisLayout({ children, data }: AnalysisLayoutProps) {
  return (
    <Box className="flex flex-1 h-full">
      <AnalysisSidebar
        fileName={data.fileName}
        basePath={`/analysis/${data.id}`}
      />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50 overflow-y-auto">
        {children}
      </main>
    </Box>
  );
}