import { Card, CardHeader, CardContent, Box, Typography, Divider, Chip, Stack, Tooltip } from '@mui/material';
import { HelpCircle, SpellCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';
import theme from '@/styles/theme';
import { GrammarAnalysis } from '@/domain/analysis/types/analysis'; // Certifique-se que este tipo existe/foi atualizado

interface GrammarDetailCardProps {
  grammarAnalysis?: GrammarAnalysis;
}

const DisclaimerText = () => (
  <Typography 
    variant="caption" 
    display="block" 
    sx={{ 
      mt: 1.5, 
      pt: 1, 
      borderTop: '1px solid rgba(255,255,255,0.1)', 
      color: 'rgba(255,255,255,0.5)', 
      fontSize: '0.65rem',
      fontStyle: 'italic',
      lineHeight: 1.3
    }}
  >
    * A ferramenta verifica regras de concordância nominal, verbal e outros padrões gramaticais comuns. Falsos positivos podem ocorrer em contextos informais.
  </Typography>
);

const GrammarTooltipContent = () => (
  <Box sx={{ p: 0.5, maxWidth: 240 }}>
    <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1, pb: 0.5, borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
      Qualidade Gramatical
    </Typography>
    <Stack spacing={0.5}>
      <Typography variant="caption" display="block" sx={{ color: theme.palette.success.main }}>
        • <strong>Excelente:</strong> 0 erros
      </Typography>
      <Typography variant="caption" display="block" sx={{ color: theme.palette.warning.main }}>
        • <strong>Atenção:</strong> 1 - 3 erros
      </Typography>
      <Typography variant="caption" display="block" sx={{ color: theme.palette.error.main }}>
        • <strong>Crítico:</strong> &gt; 3 erros
      </Typography>
    </Stack>
    <Typography variant="caption" paragraph sx={{ mt: 1, lineHeight: 1.3, opacity: 0.9 }}>
      Erros de concordância podem diminuir a percepção de autoridade e clareza do orador.
    </Typography>
    <DisclaimerText />
  </Box>
);

export function GrammarDetailCard({ grammarAnalysis }: GrammarDetailCardProps) {
  // Se não houver análise, não quebra a renderização
  const issues = grammarAnalysis?.issues || [];
  const totalIssues = issues.length;

  // Agrupa erros por tipo (shortMessage) para exibição sumarizada
  const groupedIssues = issues.reduce((acc, issue) => {
    const key = issue.short_message || 'Outros erros';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Ordena do mais frequente para o menos frequente
  const sortedIssues = Object.entries(groupedIssues).sort((a, b) => b[1] - a[1]);

  const getStatusColor = () => {
    if (totalIssues === 0) return theme.palette.success.main;
    if (totalIssues <= 3) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const statusColor = getStatusColor();

  return (
    <Card 
      sx={{ 
        bgcolor: theme.palette.purple.light2, 
        height: '100%',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: `0 12px 24px ${statusColor}40`,
          '& .icon-container': {
            transform: 'scale(1.1) rotate(5deg)',
          }
        }
      }}
    >
      <CardHeader
        avatar={
          <Box className="icon-container" sx={{ transition: 'transform 0.3s ease' }}>
            <SpellCheck size={24} color={theme.palette.purple.light1} />
          </Box>
        }
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" sx={{ color: theme.palette.purple.contrastText }}>
              Gramática e Concordância
            </Typography>
            <Tooltip 
              title={<GrammarTooltipContent />} 
              arrow 
              placement="top"
              componentsProps={{ 
                tooltip: { 
                  sx: { 
                    bgcolor: '#1e1e1e', 
                    border: '1px solid rgba(255,255,255,0.1)' 
                  } 
                } 
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'help' }}>
                <HelpCircle size={16} color={theme.palette.purple.light1} style={{ opacity: 0.7 }} />
              </Box>
            </Tooltip>
          </Box>
        }
      />
      <CardContent>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography 
            variant="h2" 
            sx={{ 
              color: statusColor,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1
            }}
          >
            {totalIssues}
            <Typography component="span" variant="h6" sx={{ ml: 1, color: theme.palette.purple.light1 }}>
              erros
            </Typography>
          </Typography>
        </Box>
        
        <Divider sx={{ my: 2, bgcolor: theme.palette.purple.light1 + '20' }} />
        
        <Box>
          {sortedIssues.length > 0 ? (
            sortedIssues.map(([type, count], idx) => (
              <Box 
                key={type} 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  mb: 1, 
                  alignItems: 'center',
                  animation: `slideIn 0.5s ease-out ${0.8 + idx * 0.1}s both`,
                  '@keyframes slideIn': {
                    '0%': { opacity: 0, transform: 'translateX(-20px)' },
                    '100%': { opacity: 1, transform: 'translateX(0)' }
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AlertTriangle size={14} color={theme.palette.warning.main} />
                  <Typography variant="body2" sx={{ color: theme.palette.purple.light1 }}>
                    {type}
                  </Typography>
                </Box>
                <Chip 
                  label={count} 
                  size="small"
                  sx={{ 
                    bgcolor: theme.palette.error.main + '20',
                    color: theme.palette.error.main,
                    fontWeight: 600,
                    height: 24
                  }}
                />
              </Box>
            ))
          ) : (
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: 1,
                py: 1,
                animation: 'fadeIn 0.5s ease-out'
              }}
            >
              <CheckCircle2 size={32} color={theme.palette.success.main} />
              <Typography variant="body2" sx={{ color: theme.palette.purple.light1, textAlign: 'center' }}>
                Nenhum erro detectado! <br/>Sua fala está gramaticalmente correta.
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}