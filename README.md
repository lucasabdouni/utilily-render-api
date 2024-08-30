# <p align="center">Utility Render API</p>

## :clipboard: Descrição
A Utility Render API é projetada para gerenciar medições de água e gás através de imagens enviadas em Base64. A API processa essas imagens para extrair as medições numéricas utilizando uma Inteligência Artificial e armazena os resultados associados a códigos de cliente. A API oferece funcionalidades para criar, listar e confirmar medições.
.

***
:hammer: Principais Funcionalidades

- Criar Medição: Recebe uma imagem em Base64 e o código do cliente, processa a imagem com IA para extrair a medição e a salva no banco de dados.
- Confirmar Medição: Confirma uma medição específica, indicando que ela foi revisada e aprovada.
- Listar Medições: Permite visualizar todas as medições realizadas por um cliente, com a opção de filtrar por tipo de medição (água ou gás).

## Rotas:

POST /create: Cria uma nova medição.
- Parâmetros de Entrada:
- image (string, obrigatório): Imagem em Base64 contendo a medição.
- customer_code: (string, obrigatório): Código único do cliente.
- measure_datetime: (Date, obrigatório): Data da medição.
- measure_type: (String [WATER | GAS], obrigatório): Tipo de medição.

PATCH /confirm: Confirma uma medição.
- Parâmetros de Entrada:
- measure_uuid: (String, obrigatório): Código da medição realizada.
- confirmed_value: (Number, obrigatório): Confirmação ou correção do valor de leitura.

GET /list: Lista medições realizadas por um cliente.

## :computer: Tecnologias e Ferramentas usadas no backend
TypeScript
Node.js
Fastify
Prisma
PostgreSQL
Docker
Vitest
Google Gemini (para processamento de imagens)

## Instalação Básica:

- Para iniciar o projeto, voce voce precisara ter instalado em sua maquina:
[Node](https://nodejs.org/en)
[Docker](https://docs.nestjs.com/](https://www.docker.com/)

- Crie um arquivo .env baseado no env.example para configurar variáveis de ambiente, incluindo a chave pessoal do Google Gemini.
[Google Gemini - Gerar chave](https://ai.google.dev/gemini-api/docs/api-key?hl=pt-br)

- Dentro da pasta execute os seguintes comandos no terminal:

| Command                                                                                           |
| :------------------------------------------------------------------------------------------------ |
| `npm i` |
| `docker-componse up -d` |
| `npm run dev:dev`   |

## Auto:

<p align="center"> Desenvolvido por Lucas<br> Email: lucasabdouni@hotmail.com </p>
