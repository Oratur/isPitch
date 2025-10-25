import re
from enum import Enum


class PromptStyle(Enum):
    CONCISE = 'concise'
    DETAILED = 'detailed'
    ACADEMIC = 'academic'
    CASUAL = 'casual'


class PromptTemplates:
    T5_TEMPLATES = {
        PromptStyle.CONCISE: (
            'summarize: Faça um resumo conciso do seguinte texto: {text}'
        ),
        PromptStyle.DETAILED: (
            'summarize: Resuma o seguinte trecho de apresentação oral, '
            'destacando os pontos principais e mantendo as ideias centrais. '
            'Texto: {text}'
        ),
        PromptStyle.ACADEMIC: (
            'summarize: Produza uma síntese acadêmica do seguinte conteúdo, '
            'identificando a tese principal, argumentos de suporte e '
            'implicações. '
            'Texto: {text}'
        ),
        PromptStyle.CASUAL: (
            'summarize: Explique de forma simples e direta do que '
            'fala este texto: {text}'
        ),
    }

    MBART_TEMPLATES = {
        PromptStyle.CONCISE: ('Resuma brevemente: {text}'),
        PromptStyle.DETAILED: (
            'Você é um especialista em análise de discursos. '
            'Resuma este trecho de apresentação de forma objetiva '
            'e informativa, preservando os conceitos principais e a '
            'estrutura argumentativa: {text}'
        ),
        PromptStyle.ACADEMIC: (
            'Produza uma síntese analítica do seguinte conteúdo, '
            'identificando premissas, desenvolvimento e conclusões: {text}'
        ),
        PromptStyle.CASUAL: (
            'Explique de forma clara e acessível sobre o que fala '
            'este texto: {text}'
        ),
    }

    GENERIC_TEMPLATES = {
        PromptStyle.CONCISE: 'Resuma: {text}',
        PromptStyle.DETAILED: (
            'Resuma objetivamente mantendo as ideias principais: {text}'
        ),
        PromptStyle.ACADEMIC: 'Sintetize o conteúdo principal: {text}',
        PromptStyle.CASUAL: 'Do que fala este texto: {text}',
    }

    @classmethod
    def get_summarization_prompt(
        cls,
        model_name: str,
        text: str,
        style: PromptStyle = PromptStyle.DETAILED,
    ) -> str:
        model_lower = model_name.lower()

        if 'ptt5' in model_lower or 't5' in model_lower:
            templates = cls.T5_TEMPLATES
        elif 'mbart' in model_lower:
            templates = cls.MBART_TEMPLATES
        else:
            templates = cls.GENERIC_TEMPLATES

        template = templates.get(style, templates[PromptStyle.DETAILED])
        return template.format(text=text)

    @classmethod
    def get_title_generation_prompt(cls, model_name: str, summary: str) -> str:
        model_lower = model_name.lower()

        if 'ptt5' in model_lower or 't5' in model_lower:
            return (
                'summarize: Crie um título curto e informativo '
                '(máximo 10 palavras) para o seguinte resumo: '
                f'{summary}'
            )
        elif 'mbart' in model_lower:
            return (
                f'Crie um título conciso e descritivo (máximo 10 palavras) '
                f'que capture a ideia central deste resumo: {summary}'
            )
        else:
            return f'Título para: {summary}'


class FewShotPrompts:
    T5_FEW_SHOT_TEMPLATE = (
        'summarize: Resuma o seguinte texto mantendo as ideias principais.\n\n'
        'Exemplo 1:\n'
        'Texto: A inteligência artificial está transformando diversos setores\n'
        'da economia. Empresas estão adotando IA para automatizar processos,\n'
        'melhorar a tomada de decisões e criar novos produtos. Porém, há\n'
        'desafios éticos e sociais que precisam ser endereçados, como vieses\n'
        'algorítmicos e impacto no emprego.\n'
        'Resumo: IA transforma economia através de automação e inovação, mas\n'
        'apresenta desafios éticos como vieses e impacto no emprego.\n\n'
        'Exemplo 2:\n'
        'Texto: O trabalho remoto se tornou uma realidade para milhões de\n'
        'profissionais durante a pandemia. Muitas empresas perceberam\n'
        'benefícios como redução de custos e maior produtividade. No\n'
        'entanto, desafios relacionados à comunicação, colaboração e\n'
        'bem-estar dos funcionários surgiram.\n'
        'Resumo: Trabalho remoto trouxe benefícios de custos e produtividade,\n'
        'mas enfrenta desafios de comunicação e bem-estar.\n\n'
        'Agora resuma este texto:\n'
        'Texto: {text}\n'
        'Resumo:'
    )

    MBART_FEW_SHOT_TEMPLATE = (
        'Você é um especialista em resumir apresentações. Veja exemplos:\n\n'
        'Exemplo 1:\n'
        'Texto: A inteligência artificial está transformando diversos setores '
        'da economia.'
        'Empresas estão adotando IA para automatizar processos, melhorar'
        'a tomada de decisões'
        'e criar novos produtos. Porém, há desafios éticos e sociais que'
        'precisam ser endereçados.\n'
        'Resumo: IA transforma economia com automação e inovação, mas enfrenta'
        'desafios éticos.\n\n'
        'Exemplo 2:\n'
        'Texto: O trabalho remoto trouxe benefícios como redução de custos, '
        'mas apresenta desafios de comunicação e bem-estar dos funcionários.\n'
        'Resumo: Trabalho remoto reduz custos'
        'mas cria desafios de comunicação e bem-estar.\n\n'
        'Agora resuma:\n'
        'Texto: {text}\n'
        'Resumo:'
    )

    @classmethod
    def get_few_shot_prompt(cls, model_name: str, text: str) -> str:
        model_lower = model_name.lower()

        if 'ptt5' in model_lower or 't5' in model_lower:
            return cls.T5_FEW_SHOT_TEMPLATE.format(text=text)
        elif 'mbart' in model_lower:
            return cls.MBART_FEW_SHOT_TEMPLATE.format(text=text)
        else:
            return PromptTemplates.get_summarization_prompt(
                model_name, text, PromptStyle.DETAILED
            )


class PromptCleaner:
    PREFIXES_TO_REMOVE = [
        'summarize:',
        'Resumir:',
        'Resuma',
        'Você é um especialista',
        'destacando os pontos principais',
        'Texto:',
        'Faça um resumo',
        'Produza uma síntese',
        'Explique de forma',
        'Resumo:',
    ]

    @classmethod
    def clean_summary(cls, summary: str) -> str:
        cleaned = summary.strip()

        for prefix in cls.PREFIXES_TO_REMOVE:
            if cleaned.lower().startswith(prefix.lower()):
                cleaned = cleaned[len(prefix) :].strip()
                cleaned = cleaned.lstrip(':').strip()

        return cleaned

    @classmethod
    def clean_title(cls, title: str) -> str:
        cleaned = cls.clean_summary(title)

        cleaned = cleaned.rstrip('.:!?')

        cleaned = re.sub(r'\s+', ' ', cleaned).strip()

        max_length = 80
        if len(cleaned) > max_length:
            last_space = cleaned.rfind(' ', 0, max_length)
            cleaned = (
                cleaned[:last_space] + '...'
                if last_space > 0
                else cleaned[:max_length] + '...'
            )

        if cleaned and cleaned[0].islower():
            cleaned = cleaned.capitalize()

        return cleaned if cleaned else 'Tópico Indefinido'
