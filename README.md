# Veletric

Painel web desenvolvido com Next.js para gerenciamento de usuários e consulta de produtos.

## Requisitos

- Node.js 20.9 ou superior
- npm

## Instalação

Na pasta do projeto, instale as dependências:

```bash
npm ci
```

## Executar em desenvolvimento

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). Se essa porta estiver ocupada, o Next.js usará outra porta e mostrará o endereço no terminal.

## Funcionalidades

- Listagem, busca, cadastro, edição e exclusão de usuários.
- Validação e máscaras para CPF, telefone, CEP e data de nascimento.
- Rotas de API para consultar e alterar os usuários.
- Senhas protegidas com hash antes de serem armazenadas.

O CRUD utiliza as rotas `GET` e `POST` em `/api/usuarios`, e `PUT` e `DELETE` em `/api/usuarios/[id]`.


## Persistência dos dados

Os usuários são salvos localmente em `data/usuarios.json`. O diretório e o arquivo são criados automaticamente no primeiro cadastro. Essa persistência em arquivo serve para execução local e fins didáticos; para publicar o sistema ou atender vários servidores, use um banco de dados apropriado.

## Verificações e produção

Para executar o lint e gerar uma versão otimizada:

```bash
npm run lint
npm run build
```

Depois do build, inicie o servidor de produção com:

```bash
npm run start
```
