import { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  Typography, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  Chip,
  Box 
} from '@mui/material';
import { Target, ChevronDown } from 'lucide-react';
import theme from '@/styles/theme';
import { Topic } from '@/domain/analysis/types/analysis';

interface TopicAnalysisCardProps {
  topics: Topic[];
}

export function TopicAnalysisCard({ topics }: TopicAnalysisCardProps) {
  const [expandedTopic, setExpandedTopic] = useState<string | false>(false);

  const handleTopicChange = (topic: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedTopic(isExpanded ? topic : false);
  };

  return (
    <Card 
      sx={{ 
        bgcolor: theme.palette.purple.light2,
        animation: 'fadeInUp 0.6s ease-out 0.9s both',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: `0 12px 24px ${theme.palette.purple.main}40`,
          '& .icon-container': {
            transform: 'scale(1.1) rotate(5deg)',
          },
          '& .trend-chip': {
            transform: 'translateX(0)',
            opacity: 1,
          }
        }
      }}
    >
      <CardHeader
        avatar={
          <Box>
            <Target size={24} color={theme.palette.purple.light1} />
          </Box>
        }
        title={
          <Typography variant="h6" sx={{ color: theme.palette.purple.contrastText }}>
            Análise de Tópicos Abordados
          </Typography>
        }
      />
      <CardContent>
        <Typography 
          variant="body2" 
          sx={{ 
            color: theme.palette.purple.light1, 
            mb: 3,
            animation: 'fadeIn 0.8s ease-out 1.1s both',
            '@keyframes fadeIn': {
              '0%': { opacity: 0 },
              '100%': { opacity: 1 }
            }
          }}
        >
          Principais temas identificados na sua apresentação:
        </Typography>
        
        {topics.length > 0 ? (
          topics.map((topic, idx) => (
            <Accordion
              key={idx}
              expanded={expandedTopic === topic.topic}
              onChange={handleTopicChange(topic.topic)}
              sx={{
                bgcolor: theme.palette.purple.dark,
                mb: 1,
                '&:before': { display: 'none' },
                borderRadius: '8px !important',
                overflow: 'hidden',
                animation: `slideInLeft 0.5s ease-out ${1.3 + idx * 0.1}s both`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateX(8px)',
                  boxShadow: `0 4px 12px ${theme.palette.purple.main}30`
                },
                '@keyframes slideInLeft': {
                  '0%': {
                    opacity: 0,
                    transform: 'translateX(-30px)'
                  },
                  '100%': {
                    opacity: 1,
                    transform: 'translateX(0)'
                  }
                }
              }}
            >
              <AccordionSummary
                expandIcon={
                  <ChevronDown 
                    color={theme.palette.purple.light1}
                    style={{
                      transition: 'transform 0.3s ease',
                      transform: expandedTopic === topic.topic ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}
                  />
                }
                sx={{ 
                  '& .MuiAccordionSummary-content': { 
                    alignItems: 'center',
                    gap: 2
                  }
                }}
              >
                <Chip 
                  label={`Tópico ${idx + 1}`}
                  size="small"
                  sx={{ 
                    bgcolor: theme.palette.purple.main + '30',
                    color: theme.palette.purple.main,
                    fontWeight: 600,
                    animation: 'pulse 2s ease-in-out infinite',
                    '@keyframes pulse': {
                      '0%, 100%': { transform: 'scale(1)' },
                      '50%': { transform: 'scale(1.05)' }
                    }
                  }}
                />
                <Typography sx={{ color: theme.palette.purple.contrastText, fontWeight: 600 }}>
                  {topic.topic}
                </Typography>
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  animation: expandedTopic === topic.topic ? 'fadeIn 0.5s ease-out' : 'none',
                  '@keyframes fadeIn': {
                    '0%': { opacity: 0 },
                    '100%': { opacity: 1 }
                  }
                }}
              >
                <Typography variant="body2" sx={{ color: theme.palette.purple.light1 }}>
                  {topic.summary}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))
        ) : (
          <Box 
            sx={{ 
              textAlign: 'center', 
              py: 4,
              bgcolor: theme.palette.purple.dark,
              borderRadius: 2,
              animation: 'fadeIn 0.8s ease-out 1.3s both'
            }}
          >
            <Typography variant="body2" sx={{ color: theme.palette.purple.light1 }}>
              Nenhum tópico específico foi identificado nesta análise.
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}