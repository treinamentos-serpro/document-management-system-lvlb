# Especificação - Document Management System

## 1. Objetivo

Entregar um sistema web simples para que usuários enviem, consultem e baixem seus documentos armazenados exclusivamente no filesystem local da aplicação.

## 2. Escopo

### 2.1 Dentro do escopo

- Upload de documentos PDF, JPEG e PNG.
- Listagem dos documentos pertencentes ao usuário identificado na requisição.
- Download do conteúdo de um documento pelo seu identificador.
- Gestão simples por usuário, sem autenticação completa nesta fase.
- Verificação de saúde do backend.
- Interface React para envio, listagem e download, conforme o contrato do backend.

### 2.2 Fora do escopo

- Armazenamento externo, em nuvem ou em serviços de terceiros.
- Banco de dados ou persistência permanente dos metadados.
- Versionamento, edição, exclusão ou restauração de documentos.
- Busca avançada, categorização, compartilhamento ou colaboração.
- Autenticação, autorização baseada em papéis, cadastro e gerenciamento de usuários.
- Conversão, visualização ou processamento do conteúdo dos arquivos.
- Paginação e ordenação configuráveis nesta primeira versão.

## 3. Requisitos funcionais

| ID | Requisito | Critério de aceite |
| --- | --- | --- |
| RF-01 | O sistema deve aceitar o envio de um documento. | Uma requisição `multipart/form-data` com um arquivo válido e um `X-User-Id` válido cria um documento e retorna seus metadados. |
| RF-02 | O sistema deve exigir a identificação do usuário. | Requisições de negócio sem `X-User-Id` ou com valor vazio são rejeitadas; o valor recebido torna-se o `owner` do documento. |
| RF-03 | O sistema deve validar o arquivo enviado. | O sistema aceita somente o campo multipart `file`, com PDF, JPEG ou PNG e tamanho máximo de 10 MB. |
| RF-04 | O sistema deve gerar um identificador único para cada documento. | O identificador é opaco, não expõe o caminho físico e não depende do nome original do arquivo. |
| RF-05 | O sistema deve registrar os metadados do documento. | Após o upload, ficam disponíveis `id`, `originalName`, `size`, `uploadedAt` e `owner`. |
| RF-06 | O usuário deve poder listar seus documentos. | `GET /documents` retorna somente os documentos cujo `owner` corresponde ao `X-User-Id` informado. |
| RF-07 | O sistema deve retornar uma lista vazia quando o usuário não tiver documentos. | A consulta válida sem documentos retorna `200` e uma lista JSON vazia. |
| RF-08 | O usuário deve poder baixar um documento pelo identificador. | Uma consulta válida retorna o conteúdo binário do arquivo e usa o nome original no header de download. |
| RF-09 | O sistema deve impedir acesso entre usuários. | Um documento pertencente a outro usuário não pode ser baixado por meio do seu identificador. O recurso deve ser tratado como não encontrado. |
| RF-10 | O sistema deve tratar documentos inexistentes. | Um identificador desconhecido ou inválido retorna erro de recurso não encontrado, sem tentar acessar um caminho arbitrário. |
| RF-11 | O sistema deve informar falhas de entrada de forma consistente. | Erros de validação retornam JSON com código legível e mensagem em português. |
| RF-12 | O sistema deve verificar sua disponibilidade. | `GET /health` retorna o estado operacional do processo sem exigir identificação de usuário. |

## 4. Requisitos não funcionais

| ID | Requisito |
| --- | --- |
| RNF-01 | O backend deve usar Node.js, Express e CommonJS. |
| RNF-02 | O frontend deve usar React, Vite, módulos ESM e componentes funcionais com React Hooks. |
| RNF-03 | As rotas devem delegar para controllers; o fluxo interno deve respeitar `routes -> controllers -> services -> repositories`. |
| RNF-04 | Os arquivos enviados devem ser gravados localmente em `backend/storage`, usando `multer` configurado com `diskStorage`. |
| RNF-05 | Os metadados devem permanecer em memória nesta fase. Eles serão perdidos quando o processo for reiniciado; os arquivos físicos existentes não devem ser considerados disponíveis sem metadados reconstruídos. |
| RNF-06 | Nenhum provedor externo de armazenamento, serviço de upload ou banco de dados deve ser utilizado. |
| RNF-07 | A porta, o diretório de armazenamento e limites operacionais devem ser configuráveis por variáveis de ambiente, com valores padrão documentados. A implementação deve manter `PORT=3000` como padrão. |
| RNF-08 | O nome original deve ser tratado como dado de apresentação e nunca usado diretamente como nome físico ou caminho. O nome físico deve ser gerado pelo sistema. |
| RNF-09 | O sistema deve evitar path traversal: caminhos devem ser derivados de identificadores ou nomes gerados pelo sistema, e nunca concatenados diretamente a partir de entrada do usuário. |
| RNF-10 | Após falha ao registrar os metadados, o arquivo físico recém-criado deve ser removido quando possível, evitando arquivos órfãos. Falhas de limpeza devem ser registradas sem expor caminhos ou detalhes internos ao cliente. |
| RNF-11 | O download deve enviar o arquivo como anexo, preservar o `originalName` no `Content-Disposition` de forma segura e não revelar o nome físico. |
| RNF-12 | O frontend deve acessar a API com `fetch` pelo prefixo `/api`. O Vite remove esse prefixo no proxy de desenvolvimento; ele não faz parte dos caminhos das rotas do backend. |
| RNF-13 | Mensagens de usuário e comentários previstos devem estar em português; nomes de arquivos, símbolos e APIs de código devem estar em inglês. |
| RNF-14 | Os testes do backend devem usar o runner nativo `node:test`, cobrindo sucessos, validações, isolamento por usuário, filesystem e falhas de persistência. |

## 5. Modelo de dados

### 5.1 Metadados do documento

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `id` | `string` | Sim | Identificador único e opaco, gerado pelo sistema. |
| `originalName` | `string` | Sim | Nome original enviado pelo cliente, normalizado apenas para apresentação. |
| `size` | `number` | Sim | Tamanho do arquivo em bytes, obtido do arquivo recebido. |
| `uploadedAt` | `string` | Sim | Data e hora do upload em formato ISO 8601 UTC. |
| `owner` | `string` | Sim | Identificador obtido do header `X-User-Id`. |

O repositório deve manter internamente a associação entre `id` e o nome físico gerado no diretório local. Essa referência não faz parte da resposta pública da API. O arquivo físico deve ter nome baseado no `id` ou em outro valor seguro gerado pelo sistema, sem reutilizar `originalName` como caminho.

### 5.2 Regras de dados

- `X-User-Id` deve ser uma string não vazia, limitada a um tamanho razoável pela implementação, e não deve conter quebra de linha.
- O `id` deve ser único durante a vida do processo e não pode aceitar caminhos, barras ou extensões fornecidos pelo cliente.
- `originalName` deve ser retornado como metadado, mas caracteres de controle devem ser removidos ou neutralizados.
- Os metadados são armazenados em memória e podem ser consultados apenas durante a vida do processo que os criou.
- O upload somente é considerado concluído depois que o arquivo foi gravado e o metadado foi registrado. Em caso de falha, a operação deve retornar erro e tentar remover o arquivo parcial.

## 6. Contratos de API

### 6.1 Convenções gerais

- Os caminhos abaixo são os caminhos reais do backend.
- No desenvolvimento, o frontend chama os mesmos caminhos através do proxy `/api`: por exemplo, `/api/documents` é encaminhado para `/documents`.
- Respostas JSON devem usar `Content-Type: application/json`.
- Erros devem seguir o formato:

```json
{
  "error": {
    "code": "DOCUMENT_NOT_FOUND",
    "message": "Documento não encontrado."
  }
}
```

- O campo `code` é estável para consumo do frontend; `message` é uma mensagem curta em português.
- O backend não deve retornar stack trace, caminho local, nome físico ou detalhes de infraestrutura ao cliente.

### 6.2 GET /health

Verifica a saúde do backend e não exige `X-User-Id`.

**Resposta de sucesso: `200 OK`**

```json
{
  "status": "ok"
}
```

### 6.3 POST /upload

Cria um documento para o usuário identificado.

**Headers obrigatórios**

- `X-User-Id: <identificador-do-usuario>`
- `Content-Type: multipart/form-data; boundary=...`

**Entrada**

- Campo multipart obrigatório: `file`.
- Tipos permitidos: `application/pdf`, `image/jpeg` e `image/png`.
- Tamanho máximo: 10 MB, isto é, `10 * 1024 * 1024` bytes.
- Campos multipart adicionais devem ser rejeitados ou ignorados de forma consistente; não podem alterar o `owner`.

**Resposta de sucesso: `201 Created`**

```json
{
  "id": "doc_01J...",
  "originalName": "relatorio.pdf",
  "size": 24576,
  "uploadedAt": "2026-09-01T12:00:00.000Z",
  "owner": "usuario-123"
}
```

**Erros**

| Status | Código | Situação |
| --- | --- | --- |
| `400` | `USER_ID_REQUIRED` | Header ausente, vazio ou inválido. |
| `400` | `FILE_REQUIRED` | O campo `file` não foi enviado. |
| `400` | `INVALID_FILE_TYPE` | Tipo de arquivo não permitido. |
| `413` | `FILE_TOO_LARGE` | Arquivo maior que 10 MB. |
| `400` | `INVALID_MULTIPART_REQUEST` | Requisição multipart inválida ou campo inesperado incompatível. |
| `500` | `UPLOAD_FAILED` | Falha ao gravar o arquivo ou registrar os metadados. |

### 6.4 GET /documents

Lista os documentos do usuário identificado. A ordenação padrão deve ser pela data de upload mais recente primeiro, mantendo comportamento determinístico em caso de empate.

**Headers obrigatórios**

- `X-User-Id: <identificador-do-usuario>`

**Resposta de sucesso: `200 OK`**

```json
[
  {
    "id": "doc_01J...",
    "originalName": "relatorio.pdf",
    "size": 24576,
    "uploadedAt": "2026-09-01T12:00:00.000Z",
    "owner": "usuario-123"
  }
]
```

Quando não houver documentos, a resposta será `[]`.

**Erros**

| Status | Código | Situação |
| --- | --- | --- |
| `400` | `USER_ID_REQUIRED` | Header ausente, vazio ou inválido. |
| `500` | `DOCUMENT_LIST_FAILED` | Falha inesperada na leitura do repositório em memória. |

### 6.5 GET /documents/:id/download

Retorna o conteúdo binário do documento do usuário identificado.

**Headers obrigatórios**

- `X-User-Id: <identificador-do-usuario>`

**Parâmetro de rota**

- `id`: identificador opaco retornado pelo upload ou pela listagem. Não é um caminho de arquivo.

**Resposta de sucesso: `200 OK`**

- Corpo: conteúdo binário original.
- `Content-Type`: tipo MIME registrado para o arquivo.
- `Content-Disposition`: `attachment`, com `originalName` sanitizado para uso como nome de download.
- `Content-Length`: tamanho do arquivo quando disponível.

**Erros**

| Status | Código | Situação |
| --- | --- | --- |
| `400` | `USER_ID_REQUIRED` | Header ausente, vazio ou inválido. |
| `404` | `DOCUMENT_NOT_FOUND` | ID inexistente, inválido, sem arquivo correspondente ou pertencente a outro usuário. |
| `500` | `DOCUMENT_DOWNLOAD_FAILED` | Falha inesperada ao ler o arquivo local. |

## 7. Decisões arquiteturais

### 7.1 Backend

A implementação deve usar uma Clean Architecture simples, com dependências apontando para dentro:

```text
routes -> controllers -> services -> repositories
```

- `routes/`: registra os caminhos HTTP, o middleware do Multer quando necessário e delega para os controllers. Não contém regra de negócio.
- `controllers/`: lê headers, parâmetros e arquivo, faz validação básica de entrada, chama o service e traduz resultados para status e respostas HTTP.
- `services/`: concentra as regras de negócio, incluindo ownership, validações de uso, criação de metadados, ordenação e coordenação do upload/download.
- `repositories/`: abstrai o armazenamento local do arquivo e dos metadados em memória. Deve esconder nomes físicos e detalhes do filesystem das camadas superiores.
- `app.js`: compõe o Express, registra middleware, rotas, tratamento de erros e o endpoint `/health`. Deve continuar exportando `app` para os testes e iniciar o servidor somente quando executado diretamente.

O Multer deve usar `diskStorage` para gravar em `backend/storage`. A configuração de destino e limites deve ser centralizada e derivada de variáveis de ambiente com padrão seguro. O middleware de erro deve traduzir erros do Multer e do filesystem para os códigos definidos neste documento.

### 7.2 Frontend

O frontend deve ser organizado em componentes funcionais, páginas e serviços:

- `services/`: funções de comunicação com a API usando `fetch`, incluindo envio multipart, listagem e download.
- `components/`: controles reutilizáveis para seleção de arquivo, listagem, estados de carregamento e mensagens de erro.
- `pages/`: composição da tela principal do DMS.
- `App.jsx`: composição da aplicação sem duplicar regras de comunicação.

O identificador de usuário da primeira fase pode ser obtido por uma configuração simples da aplicação ou controle explícito da interface, mas deve sempre ser enviado como `X-User-Id`. A interface deve apresentar estados de carregamento, lista vazia, sucesso e falha sem expor detalhes internos.

### 7.3 Configuração e operação

Variáveis mínimas previstas:

| Variável | Padrão | Uso |
| --- | --- | --- |
| `PORT` | `3000` | Porta HTTP do backend. |
| `STORAGE_DIR` | `backend/storage` | Diretório local dos arquivos enviados. |
| `MAX_FILE_SIZE` | `10485760` | Limite de upload em bytes. |

O diretório deve existir ou ser criado na inicialização de forma segura. A configuração não pode apontar implicitamente para um provedor externo.

## 8. Plano de execução

A implementação deve ocorrer em etapas independentes e verificáveis. Este plano descreve trabalho futuro; não faz parte desta entrega a execução dos arquivos de backend ou frontend.

1. **Preparar a configuração e o diretório local**: definir `PORT`, `STORAGE_DIR` e limite de upload; garantir que `backend/storage` seja criado e permaneça fora do controle de versão.
2. **Criar o repositório de arquivos e metadados**: implementar armazenamento em `diskStorage`, mapa em memória, geração de nomes físicos, busca por ID e limpeza de arquivos órfãos.
3. **Implementar o service de documentos**: validar usuário, tipos e tamanho; coordenar criação de metadados, filtragem por proprietário, ordenação e download.
4. **Implementar controllers e tratamento de erros**: traduzir entradas HTTP, erros do Multer, falhas do filesystem e resultados do service para os contratos definidos.
5. **Registrar routes e compor o app**: adicionar `/upload`, `/documents`, `/documents/:id/download`, preservar `/health`, registrar middlewares e manter a exportação do `app`.
6. **Criar testes de backend**: cobrir saúde, upload válido, ausência de usuário/arquivo, tipo e tamanho inválidos, listagem isolada, lista vazia, download válido, ID inexistente, ownership e limpeza após falha.
7. **Implementar a camada de serviços do frontend**: consumir os endpoints pelo prefixo `/api`, enviar `FormData` sem sobrescrever seu boundary e tratar respostas de erro.
8. **Construir a interface React**: criar seleção e envio de arquivo, identificação do usuário, listagem, download, estados de carregamento, lista vazia e mensagens de falha.
9. **Validar a integração**: executar testes do backend, `npm run build` do frontend e testes manuais com o backend e o proxy Vite; verificar headers de download, isolamento por usuário e comportamento após reinício.
10. **Revisar segurança e operação**: confirmar limite de tamanho, nomes físicos não previsíveis, ausência de path traversal, ausência de exposição de stack trace e limpeza de arquivos órfãos.
