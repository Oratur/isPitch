import theme from '@/styles/theme';

export function getScoreColor(score: number): string {
    if (score >= 85) return theme.palette.success.main;
    if (score >= 70) return theme.palette.info.main;
    if (score >= 50) return theme.palette.warning.main;
    return theme.palette.error.main;
}

export function getScoreLabel(score: number): string {
    if (score >= 85) return 'Excelente';
    if (score >= 70) return 'Bom';
    if (score >= 50) return 'Satisfatório';
    return 'Precisa Melhorar';
}