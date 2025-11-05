import { DashboardStats, RecentAnalysis } from '../types/dashboard';

/**
 * Mock data para análises recentes
 * Use isso durante desenvolvimento antes do backend estar pronto
 */
export const mockRecentAnalyses: RecentAnalysis[] = [
    {
        id: '550e8400-e29b-41d4-a716-446655440001',
        filename: 'apresentacao_final.mp3',
        createdAt: '2025-11-03T14:30:00Z',
        fillerWordsCount: 12,
        speechRate: 140,
        pausesCount: 5,
        status: 'completed'
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440002',
        filename: 'pitch_investidores.wav',
        createdAt: '2025-11-02T10:15:00Z',
        fillerWordsCount: 8,
        speechRate: 135,
        pausesCount: 3,
        status: 'completed'
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440003',
        filename: 'reuniao_cliente.mp3',
        createdAt: '2025-11-01T16:45:00Z',
        fillerWordsCount: 15,
        speechRate: 150,
        pausesCount: 7,
        status: 'completed'
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440004',
        filename: 'palestra_universidade.wav',
        createdAt: '2025-10-30T09:00:00Z',
        fillerWordsCount: 20,
        speechRate: 125,
        pausesCount: 10,
        status: 'completed'
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440005',
        filename: 'entrevista_podcast.mp3',
        createdAt: '2025-10-28T18:20:00Z',
        fillerWordsCount: 6,
        speechRate: 145,
        pausesCount: 4,
        status: 'completed'
    }
];

/**
 * Mock data para estatísticas do dashboard
 */
export const mockDashboardStats: DashboardStats = {
    totalAnalyses: 24,
    totalFillerWords: 187,
    totalDuration: 92,
    chartData: [
        { name: 'Jan', analyses: 2 },
        { name: 'Fev', analyses: 5 },
        { name: 'Mar', analyses: 3 },
        { name: 'Abr', analyses: 8 },
        { name: 'Mai', analyses: 4 },
        { name: 'Jun', analyses: 7 },
        { name: 'Jul', analyses: 6 },
        { name: 'Ago', analyses: 9 },
        { name: 'Set', analyses: 5 },
        { name: 'Out', analyses: 10 },
        { name: 'Nov', analyses: 12 },
        { name: 'Dez', analyses: 8 }
    ]
};

/**
 * Mock data para casos específicos de teste
 */
export const mockAnalysisVariations = {
    // Análise com muitos vícios
    highFillerWords: {
        id: '550e8400-e29b-41d4-a716-446655440010',
        filename: 'teste_muitos_vicios.mp3',
        createdAt: '2025-11-03T12:00:00Z',
        fillerWordsCount: 45,
        speechRate: 120,
        pausesCount: 15,
        status: 'completed' as const
    },

    // Análise perfeita (poucos vícios)
    lowFillerWords: {
        id: '550e8400-e29b-41d4-a716-446655440011',
        filename: 'apresentacao_perfeita.mp3',
        createdAt: '2025-11-03T11:00:00Z',
        fillerWordsCount: 2,
        speechRate: 140,
        pausesCount: 1,
        status: 'completed' as const
    },

    // Fala muito rápida
    fastSpeech: {
        id: '550e8400-e29b-41d4-a716-446655440012',
        filename: 'fala_rapida.mp3',
        createdAt: '2025-11-03T10:00:00Z',
        fillerWordsCount: 10,
        speechRate: 180,
        pausesCount: 2,
        status: 'completed' as const
    },

    // Fala muito lenta
    slowSpeech: {
        id: '550e8400-e29b-41d4-a716-446655440013',
        filename: 'fala_lenta.mp3',
        createdAt: '2025-11-03T09:00:00Z',
        fillerWordsCount: 8,
        speechRate: 90,
        pausesCount: 12,
        status: 'completed' as const
    },

    // Análise pendente
    pending: {
        id: '550e8400-e29b-41d4-a716-446655440014',
        filename: 'processando.mp3',
        createdAt: '2025-11-03T15:00:00Z',
        fillerWordsCount: 0,
        speechRate: 0,
        pausesCount: 0,
        status: 'pending' as const
    },

    // Análise falhada
    failed: {
        id: '550e8400-e29b-41d4-a716-446655440015',
        filename: 'erro_processamento.mp3',
        createdAt: '2025-11-03T15:30:00Z',
        fillerWordsCount: 0,
        speechRate: 0,
        pausesCount: 0,
        status: 'failed' as const
    }
};

/**
 * Mock data vazio (para testar estado inicial)
 */
export const mockEmptyDashboard: DashboardStats = {
    totalAnalyses: 0,
    totalFillerWords: 0,
    totalDuration: 0,
    chartData: [
        { name: 'Jan', analyses: 0 },
        { name: 'Fev', analyses: 0 },
        { name: 'Mar', analyses: 0 },
        { name: 'Abr', analyses: 0 },
        { name: 'Mai', analyses: 0 },
        { name: 'Jun', analyses: 0 }
    ]
};

export const mockEmptyRecentAnalyses: RecentAnalysis[] = [];

/**
 * Helper function para gerar análises aleatórias
 */
export function generateRandomAnalysis(): RecentAnalysis {
    const filenames = [
        'apresentacao_vendas.mp3',
        'reuniao_equipe.wav',
        'pitch_startup.mp3',
        'treinamento_onboarding.wav',
        'palestra_evento.mp3',
        'entrevista_emprego.wav',
        'aula_online.mp3',
        'workshop_comunicacao.wav'
    ];

    const randomFilename = filenames[Math.floor(Math.random() * filenames.length)];
    const randomDate = new Date();
    randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 30));

    return {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        filename: randomFilename,
        createdAt: randomDate.toISOString(),
        fillerWordsCount: Math.floor(Math.random() * 30) + 1,
        speechRate: Math.floor(Math.random() * 80) + 100, // 100-180 PPM
        pausesCount: Math.floor(Math.random() * 15) + 1,
        status: 'completed'
    };
}

/**
 * Helper function para gerar múltiplas análises
 */
export function generateMultipleAnalyses(count: number = 5): RecentAnalysis[] {
    return Array.from({ length: count }, () => generateRandomAnalysis())
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}