# Frontend - isPitch

Este é o frontend da plataforma **isPitch**, construído com [Next.js](https://nextjs.org), [React](https://react.dev/) e [Material-UI (MUI)](https://mui.com/).

## Visão Geral

A interface do usuário (UI) é responsável por permitir que o usuário faça o upload de arquivos de áudio, acompanhe o processo de análise e visualize os resultados de forma clara e interativa.

## Tecnologias Principais

* **Framework**: [Next.js](https://nextjs.org) 
* **Biblioteca UI**: [React](https://react.dev/) 
* **Componentes**: [Material-UI (MUI)](https://mui.com/) 
* **Estilização**: [Tailwind CSS](https://tailwindcss.com/) 
* **Linguagem**: TypeScript
* **Comunicação com API**: Fetch API nativa 

## Primeiros Passos

Para executar o servidor de desenvolvimento localmente:

1.  **Instale as dependências:**
    ```bash
    npm install
    ```

2.  **Crie um arquivo de ambiente:**
    Renomeie o arquivo `.env.example` (se existir) para `.env.local` e configure a variável de ambiente necessária para apontar para o backend:
    ```
    NEXT_PUBLIC_API_BASE_URL=[http://127.0.0.1:8000](http://127.0.0.1:8000)
    ```

3.  **Execute o servidor:**
    ```bash
    npm run dev
    ```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver a aplicação em funcionamento.

## Scripts Disponíveis

* `npm run dev`: Inicia o servidor em modo de desenvolvimento.
* `npm run build`: Compila a aplicação para produção.
* `npm run start`: Inicia um servidor de produção.
* `npm run lint`: Executa o linter (ESLint) para verificar a qualidade do código.