# Configuração das Variáveis de Ambiente

Para que o projeto funcione corretamente, você precisa criar um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/metrio?schema=public"
NEXTAUTH_SECRET="sua-chave-secreta-para-autenticacao"
NEXTAUTH_URL="http://localhost:3000"
```

## Detalhes das Variáveis

- **DATABASE_URL**: URL de conexão com o banco de dados PostgreSQL. Ajuste os valores de usuário, senha e nome do banco conforme sua configuração local.
- **NEXTAUTH_SECRET**: Chave secreta usada para criptografar tokens e sessões do NextAuth.
- **NEXTAUTH_URL**: URL base da sua aplicação. Use "http://localhost:3000" para desenvolvimento.

## Iniciar o Projeto

Após configurar as variáveis de ambiente, você pode iniciar o servidor de desenvolvimento:

```
npm run dev
```
