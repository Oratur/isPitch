# isPitch - Plataforma de Análise de Oratória

O **isPitch** é uma plataforma web inteligente desenvolvida para auxiliar usuários a aprimorarem suas habilidades de oratória e comunicação verbal. O sistema foi projetado para estudantes, professores, palestrantes e qualquer pessoa que deseje melhorar sua fala em público.

O objetivo principal da aplicação é fornecer feedbacks técnicos e práticos sobre a comunicação. Para isso, o usuário pode submeter um arquivo de áudio para uma análise automática e detalhada. A plataforma realiza as seguintes funções:

* **Transcrição Automática**: Converte o áudio enviado em um texto completo.
* **Análise de Vícios de Linguagem**: Identifica e quantifica o uso de palavras de preenchimento (como "é", "tipo", "ahn") que podem prejudicar a clareza da mensagem.
* **Apresentação de Resultados**: Exibe o feedback da análise de forma visual e textual, utilizando gráficos e a própria transcrição para destacar os pontos de melhoria.

A plataforma visa promover a melhoria da oratória por meio de feedbacks baseados em evidências técnicas, ajudando o usuário a desenvolver uma comunicação mais clara, objetiva e confiante.

## Visão Geral da Arquitetura

O projeto é estruturado como um **monolito modular**, com uma separação clara de responsabilidades entre o frontend e o backend, visando facilitar a manutenção e a evolução futura para uma arquitetura orientada a eventos (EDA).

* **Frontend**: Uma aplicação web interativa construída com Next.js e React, responsável pela interface do usuário.
* **Backend**: Uma API RESTful desenvolvida com Python e FastAPI, que orquestra todo o processo de análise do áudio.

## Tecnologias Utilizadas

A plataforma utiliza um conjunto de tecnologias modernas para garantir desempenho, escalabilidade e uma ótima experiência de usuário.

### **Frontend**
* **Next.js/React**
* **TypeScript**
* **Material-UI (MUI)** para componentes de UI
* **Tailwind CSS** para estilização
* **React Dropzone** para upload de arquivos

### **Backend**
* **Python 3.10+**
* **FastAPI** para a construção da API
* **Pydantic** para validação de dados
* **Poetry** para gerenciamento de dependências

### **Processamento de Áudio e PLN**
* **OpenAI Whisper** para transcrição de áudio
* **spaCy** para análise textual e detecção de vícios de linguagem

## Como Executar o Projeto

Para executar o projeto, você precisará configurar e iniciar o `frontend` e a `ispitch-api` separadamente.

### **Executando o Frontend**

1.  **Navegue até a pasta do frontend:**
    ```bash
    cd frontend
    ```
2.  **Instale as dependências:**
    ```bash
    npm install
    ```
3.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```
4.  Abra [http://localhost:3000](http://localhost:3000) em seu navegador para ver a aplicação.

### **Executando o Backend (ispitch-api)**

**Pré-requisitos:**
* Certifique-se de que você tem o **[FFmpeg](https://ffmpeg.org/download.html)** instalado em seu sistema. Ele é necessário para o processamento de áudio.
* Para aceleração via GPU (NVIDIA), existem requisitos de instalação específicos do PyTorch. Consulte o `README.md` da API para mais detalhes.

1.  **Navegue até a pasta da API:**
    ```bash
    cd ispitch-api
    ```
2.  **Siga as instruções de instalação** detalhadas no arquivo `ispitch-api/README.md`.
3.  **Inicie a API com o Uvicorn:**
    ```bash
    poetry run task run
    ```
4.  A API estará disponível em [http://127.0.0.1:8000](http://127.0.0.1:8000).

Com ambos os serviços em execução, a plataforma estará totalmente funcional.