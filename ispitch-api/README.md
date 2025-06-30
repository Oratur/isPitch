# isPitch API

Esta é a API backend do projeto **isPitch**, responsável por toda a lógica de negócio, incluindo o processamento e a análise dos arquivos de áudio.

## Visão Geral

A API foi construída utilizando **FastAPI**, um moderno framework web em Python que garante alto desempenho e desenvolvimento rápido. Ela é responsável por:

* Receber os arquivos de áudio enviados pelo frontend.
* Validar os arquivos (formato e tamanho).
* Orquestrar o processo de análise, que inclui:
    1.  **Transcrição do áudio** com OpenAI Whisper.
    2.  **Análise de vícios de linguage**m e pausas com spaCy.
* Salvar e fornecer os resultados da análise de forma estruturada.

## Tecnologias Principais

* **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
* **Linguagem**: Python 3.10+
* **Gerenciador de Dependências**: [Poetry](https://python-poetry.org/)
* **Validação de Dados**: [Pydantic](https://pydantic.dev/)
* **Transcrição de Áudio**: [OpenAI Whisper](https://github.com/openai/whisper)
* **Processamento de Linguagem Natural (PLN)**: [spaCy](https://spacy.io/)

## Requisitos

Antes de iniciar, garanta que os seguintes softwares estejam instalados em seu ambiente:

* **Python 3.10 ou superior**.
* **[Poetry](https://python-poetry.org/docs/#installation)** para gerenciamento de pacotes Python.
* **[FFmpeg](https://ffmpeg.org/download.html)**: Uma ferramenta de linha de comando essencial para o processamento de áudio.
    * Em sistemas Debian/Ubuntu, você pode instalar com o comando:
        ```bash
        sudo apt install ffmpeg
        ```
    * Em outros sistemas, utilize o gerenciador de pacotes correspondente (ex: `brew` no macOS, `choco` no Windows).

## Primeiros Passos

Para configurar e executar a API localmente:

1.  **Ative o ambiente virtual do Poetry:**
    Crie e ative o ambiente virtual para o projeto:
    ```bash
    poetry shell
    ```
    Nota: Se for a primeira vez que você usa o comando shell em uma nova instalação do Poetry, pode ser necessário instalar o plugin correspondente com: 
    ```bash
    poetry self add poetry-plugin-shell.
    ```

2.  **(Opcional, para GPU) Instale os drivers e o PyTorch com suporte a CUDA:**
    Para acelerar o processamento do Whisper utilizando uma GPU NVIDIA, siga estes passos **antes** de instalar as dependências do projeto.

    * **a. Instale os Drivers da NVIDIA e o CUDA Toolkit:**
        Certifique-se de que os drivers da sua GPU estão atualizados e instale o CUDA Toolkit. O comando de instalação do PyTorch abaixo requer a versão 11.8 do toolkit. Você pode encontrar os instaladores no site oficial da NVIDIA:
        * **[NVIDIA CUDA Toolkit](https://developer.nvidia.com/cuda-downloads)**

    * **b. Instale o PyTorch:**
        Com o ambiente do Poetry ativado (`poetry shell`), execute o comando abaixo para instalar o PyTorch, TorchVision e TorchAudio compatíveis com CUDA 11.8.
        ```bash
        pip install torch==2.7.1+cu118 torchvision==0.22.1+cu118 torchaudio==2.7.1+cu118 --index-url [https://download.pytorch.org/whl/cu118](https://download.pytorch.org/whl/cu118)
        ```
    Se você não possui uma GPU NVIDIA, pode pular este passo. A instalação padrão usará a CPU.

3.  **Instale as dependências do projeto:**
    Na raiz da pasta `ispitch-api`, execute:
    ```bash
    poetry install
    ```
    Isso instalará todos os pacotes definidos no `pyproject.toml`, incluindo o modelo `pt_core_news_sm` do spaCy.

4.  **Execute a API:**
    Utilize o comando `task` definido no `pyproject.toml`:
    ```bash
    poetry run task run
    ```
    A API será iniciada e estará disponível em [http://127.0.0.1:8000](http://127.0.0.1:8000).

## Endpoints da API

* `GET /`: Endpoint raiz para verificar se a API está online.
* `POST /analysis/`: Endpoint para upload de um arquivo de áudio (`.mp3` ou `.wav`). Inicia o processo de análise em background e retorna um ID de análise.
* `GET /analysis/{analysis_id}`: Endpoint para consultar o status e o resultado de uma análise usando o ID retornado pelo endpoint de criação.

Para ver a documentação interativa da API (gerada automaticamente pelo FastAPI), acesse [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) com a API em execução.