# Regras do Projeto (Workspace Rules)

## Implantação Automática na Vercel
- Sempre que qualquer alteração de código ou funcionalidade for finalizada a pedido do usuário via chat:
  1. Executar a verificação/build se necessário.
  2. Executar `git add .`, fazer o `git commit -m "..."` com uma mensagem descritiva em português.
  3. Fazer `git push origin main` para acionar automaticamente o deploy na Vercel.
