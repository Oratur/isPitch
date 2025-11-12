import { Analysis } from '@/domain/analysis/types/analysis';
import theme from '@/styles/theme';

export function calculateOverallScore(analysis: Analysis): number {
    let score = 100;

    // Penaliza vícios de linguagem
    score -= analysis.speechAnalysis.fillerwordsAnalysis.total * 3;

    // Penaliza pausas longas
    score -= analysis.speechAnalysis.silenceAnalysis.pauses * 5;

    // Avalia ritmo de fala (ideal: 130-170 PPM)
    const speechRate = analysis.audioAnalysis.speechRate;
    if (speechRate < 130 || speechRate > 170) {
        score -= Math.abs(150 - speechRate) * 0.5;
    }

    // Bonifica riqueza lexical (ideal: >50%)
    const lexicalRatio = analysis.speechAnalysis.lexicalRichnessAnalysis.typeTokenRatio;
    if (lexicalRatio > 50) {
        score += 5;
    }

    return Math.max(0, Math.min(100, Math.round(score)));
}

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