// frontend/src/app/(private)/analyses/page.tsx

'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  TablePagination,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
} from '@mui/material';
import { Search, Eye, Trash2, Download } from 'lucide-react';
import Link from 'next/link';
import { useAnalysisHistory, useDeleteAnalysis } from '@/domain/analysis/hooks/useAnalysisHistory';
import { AnalysisHistoryFilters, AnalysisStatus } from '@/domain/analysis/types/analysisHistory';
import theme from '@/styles/theme';
import { NewAnalysisButton } from '@/components/ui/NewAnalysisButton';

const statusLabels: Record<AnalysisStatus | 'all', string> = {
  all: 'Todos',
  pending: 'Pendente',
  transcribing: 'Transcrevendo',
  analyzing_speech: 'Analisando Fala',
  analyzing_audio: 'Analisando Áudio',
  completed: 'Concluída',
  failed: 'Erro',
};

const statusColors: Record<AnalysisStatus, 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'> = {
  pending: 'default',
  transcribing: 'info',
  analyzing_speech: 'info',
  analyzing_audio: 'info',
  completed: 'success',
  failed: 'error',
};

export default function AnalysesPage() {
  const [filters, setFilters] = useState<AnalysisHistoryFilters>({
    page: 1,
    limit: 10,
    status: 'all',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const { data, isLoading, error } = useAnalysisHistory(filters);
  const { mutate: deleteAnalysis } = useDeleteAnalysis();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: event.target.value, page: 1 }));
  };

  const handleStatusChange = (event: any) => {
    setFilters(prev => ({ ...prev, status: event.target.value, page: 1 }));
  };

  const handlePageChange = (_: unknown, newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage + 1 }));
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, limit: parseInt(event.target.value, 10), page: 1 }));
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta análise?')) {
      deleteAnalysis(id);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3, lg: 4 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ color: 'var(--color-text)', mb: 1 }}>
            Histórico de Submissões
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Histórico das análises das suas últimas submissões
          </Typography>
        </Box>
      </Box>

      {/* Filtros */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <TextField
          placeholder="Buscar por nome do arquivo..."
          value={filters.search}
          onChange={handleSearchChange}
          size="small"
          sx={{ flex: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} color={theme.palette.purple.light1} />
              </InputAdornment>
            ),
            sx: {
              bgcolor: theme.palette.purple.light2,
              color: theme.palette.purple.contrastText,
            },
          }}
        />

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel sx={{ color: theme.palette.purple.light1 }}>Status da Análise</InputLabel>
          <Select
            value={filters.status}
            onChange={handleStatusChange}
            label="Status da Análise"
            sx={{
              bgcolor: theme.palette.purple.light2,
              color: theme.palette.purple.contrastText,
            }}
          >
            {Object.entries(statusLabels).map(([value, label]) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {/* Tabela */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error.message}
        </Alert>
      )}

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : !data?.analyses.length ? (
        <Alert severity="info">Nenhuma análise encontrada.</Alert>
      ) : (
        <Paper variant="card1" sx={{ overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: theme.palette.purple.light2 }}>
                <TableRow>
                  <TableCell sx={{ color: theme.palette.purple.light1, fontWeight: 600 }}>
                    DATA DA SUBMISSÃO
                  </TableCell>
                  <TableCell sx={{ color: theme.palette.purple.light1, fontWeight: 600 }}>
                    NOME DO ARQUIVO
                  </TableCell>
                  <TableCell sx={{ color: theme.palette.purple.light1, fontWeight: 600 }}>
                    DURAÇÃO
                  </TableCell>
                  <TableCell sx={{ color: theme.palette.purple.light1, fontWeight: 600 }}>
                    STATUS DA ANÁLISE
                  </TableCell>
                  <TableCell sx={{ color: theme.palette.purple.light1, fontWeight: 600 }}>
                    PONTUAÇÃO GERAL
                  </TableCell>
                  <TableCell sx={{ color: theme.palette.purple.light1, fontWeight: 600 }} align="right">
                    AÇÕES
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.analyses.map((analysis) => (
                  <TableRow
                    key={analysis.id}
                    sx={{
                      '&:hover': {
                        bgcolor: theme.palette.purple.hover1,
                      },
                    }}
                  >
                    <TableCell sx={{ color: theme.palette.purple.contrastText }}>
                      {formatDate(analysis.createdAt)}
                    </TableCell>
                    <TableCell sx={{ color: theme.palette.purple.contrastText }}>
                      {analysis.filename}
                    </TableCell>
                    <TableCell sx={{ color: theme.palette.purple.contrastText }}>
                      {analysis.duration}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={statusLabels[analysis.status]}
                        color={statusColors[analysis.status]}
                        size="small"
                        sx={{ fontWeight: 500 }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: theme.palette.purple.contrastText }}>
                      {analysis.status === 'completed' ? `${analysis.score}%` : 'XXX'}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Ver Detalhes">
                        <IconButton
                          component={Link}
                          href={`/analysis/${analysis.id}`}
                          size="small"
                          sx={{ color: theme.palette.info.main }}
                        >
                          <Eye size={18} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download">
                        <IconButton size="small" sx={{ color: theme.palette.success.main }}>
                          <Download size={18} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir">
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(analysis.id)}
                          sx={{ color: theme.palette.error.main }}
                        >
                          <Trash2 size={18} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={data.total}
            page={data.page - 1}
            onPageChange={handlePageChange}
            rowsPerPage={data.limit}
            onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage="Linhas por página:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
            sx={{
              color: theme.palette.purple.contrastText,
              borderTop: `1px solid ${theme.palette.divider}`,
              '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                color: theme.palette.purple.light1,
              },
            }}
          />
        </Paper>
      )}

      <NewAnalysisButton anchored />
    </Box>
  );
}