'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
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
} from '@mui/material';
import { Eye, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useAnalysisHistory, useDeleteAnalysis } from '@/domain/analysis/hooks';
import { AnalysisStatus } from '@/domain/analysis/types/analysisHistory';
import theme from '@/styles/theme';
import { NewAnalysisButton } from '@/components/ui/NewAnalysisButton';

const statusLabels: Record<AnalysisStatus, string> = {
  pending: 'Pendente',
  completed: 'Concluída',
  failed: 'Erro',
};

const statusColors: Record<AnalysisStatus, 'default' | 'error' | 'success'> = {
  pending: 'default',
  completed: 'success',
  failed: 'error',
};

export default function AnalysesPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading, error } = useAnalysisHistory(page, pageSize);
  const { mutate: deleteAnalysis } = useDeleteAnalysis();

  const handlePageChange = (_: unknown, newPage: number) => {
    setPage(newPage + 1);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(1);
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

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3, lg: 4 } }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ color: 'var(--color-text)', mb: 1 }}>
          Histórico de Submissões
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Histórico das análises das suas últimas submissões
        </Typography>
      </Box>

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
              <TableHead sx={{ bgcolor: '#2A1A3D' }}>
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
                    AÇÕES
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.analyses.map((analysis) => (
                  <TableRow
                    key={analysis.id}
                    sx={{
                      bgcolor: theme.palette.purple.light2,
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
                      {formatDuration(analysis.duration)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={statusLabels[analysis.status]}
                        color={statusColors[analysis.status]}
                        size="small"
                        sx={{ fontWeight: 500 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Ver Detalhes">
                        <IconButton
                          component={Link}
                          href={`/analysis/${analysis.id}`}
                          size="small"
                          sx={{ color: theme.palette.purple.main }}
                        >
                          <Eye size={18} />
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
            count={data.metadata.total}
            page={page - 1}
            onPageChange={handlePageChange}
            rowsPerPage={pageSize}
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