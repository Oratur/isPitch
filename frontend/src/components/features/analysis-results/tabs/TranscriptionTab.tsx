import { Box } from '@mui/material';
import { Analysis } from '@/domain/analysis/types/analysis';
import { TranscriptionSection } from '../speech';


interface TranscriptionTabProps {
  analysis: Analysis;
}

export function TranscriptionTab({ analysis }: TranscriptionTabProps) {
  return (
    <Box>
      <TranscriptionSection 
        transcription={analysis.transcription}
        fillerWords={analysis.speechAnalysis.fillerwordsAnalysis}
      />
    </Box>
  );
}