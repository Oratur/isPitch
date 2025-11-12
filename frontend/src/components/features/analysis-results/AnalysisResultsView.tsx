'use client';

import { useState } from 'react';
import { Box, Tabs, Tab, Paper } from '@mui/material';
import { Analysis } from '@/domain/analysis/types/analysis';
import { OverallScoreCard } from './OverallScoreCard';
import { ResultsHeader } from './ResultsHeader';

import { 
  LayoutDashboard, 
  FileText, 
  Lightbulb, 
  Target 
} from 'lucide-react';
import theme from '@/styles/theme';
import { OverviewTab, TranscriptionTab, InsightsTab, RecommendationsTab } from './tabs';

interface AnalysisResultsViewProps {
  analysis: Analysis;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`analysis-tabpanel-${index}`}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export function AnalysisResultsView({ analysis }: AnalysisResultsViewProps) {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const tabs = [
    { label: 'Visão Geral', icon: <LayoutDashboard size={20} /> },
    { label: 'Transcrição', icon: <FileText size={20} /> },
    { label: 'Insights Detalhados', icon: <Lightbulb size={20} /> },
    { label: 'Recomendações', icon: <Target size={20} /> },
  ];

  return (
    <Box sx={{ p: { xs: 2, sm: 3, lg: 4 }, minHeight: '100vh' }}>
      <ResultsHeader analysis={analysis} />
      <OverallScoreCard analysis={analysis} />

      {/* Tabs Navigation */}
      <Paper 
        sx={{ 
          bgcolor: theme.palette.purple.light2,
          borderRadius: 2,
          mb: 3,
          animation: 'fadeIn 0.6s ease-out 0.8s both',
          '@keyframes fadeIn': {
            '0%': { opacity: 0 },
            '100%': { opacity: 1 }
          }
        }}
      >
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              color: theme.palette.purple.light1,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500,
              minHeight: 64,
              px: 3,
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: theme.palette.purple.main + '15',
                color: theme.palette.purple.contrastText,
              },
              '&.Mui-selected': {
                color: theme.palette.purple.main,
                fontWeight: 600,
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: theme.palette.purple.main,
              height: 3,
              borderRadius: '3px 3px 0 0',
            }
          }}
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              label={tab.label}
              icon={tab.icon}
              iconPosition="start"
            />
          ))}
        </Tabs>
      </Paper>

      {/* Tab Panels */}
      <TabPanel value={currentTab} index={0}>
        <OverviewTab analysis={analysis} />
      </TabPanel>

      <TabPanel value={currentTab} index={1}>
        <TranscriptionTab analysis={analysis} />
      </TabPanel>

      <TabPanel value={currentTab} index={2}>
        <InsightsTab analysis={analysis} />
      </TabPanel>

      <TabPanel value={currentTab} index={3}>
        <RecommendationsTab analysis={analysis} />
      </TabPanel>
    </Box>
  );
}