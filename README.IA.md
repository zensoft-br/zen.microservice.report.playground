# Kit de Automação de Relatórios com IA

Esqueleto de documentação para automatizar geração de relatórios usando
Claude (ou outra LLM) como assistente de desenvolvimento.

## O que tem aqui

```
.
├── CLAUDE.md                      ← lido automaticamente pelo Claude Code
├── docs/
│   ├── engine.md           ← API do seu motor de relatórios (EDITAR!)
│   ├── style-guide.md             ← paleta, tipografia, padrões visuais
│   └── report-spec-template.md    ← template para pedir relatórios novos
└── examples/
    └── vendas-por-vendedor/       ← golden example completo
        ├── query.sql
        ├── meta.json
        ├── mock.json
        └── template.jsx
```

## Como adaptar ao seu ambiente

1. **Copie a pasta para a raiz do seu repositório de templates.**
2. **Edite `docs/engine.md`** — este é o arquivo mais importante.
   Substitua a API de exemplo pela API REAL do seu serviço: nomes de
   componentes, props, helpers, limitações.
3. **Edite `docs/style-guide.md`** com a paleta e tipografia da sua empresa.
4. **Substitua o exemplo `vendas-por-vendedor/`** por 2 ou 3 relatórios
   reais seus que você considere "modelo". Quanto melhores os exemplos,
   melhores as saídas.
5. **Ajuste `CLAUDE.md`** removendo o que não se aplica e incluindo
   particularidades do seu repositório (comandos de build, lint, preview).
6. **Adicione `docs/db-schema.md`** com as tabelas/views usadas em relatórios.
   Um dump de `\d+ tabela` do psql já ajuda muito.

## Como usar no dia a dia

### Opção A — Claude Code (recomendado)
No terminal, dentro do repositório:
```bash
claude
```
E peça:
```
Crie o relatório descrito em @docs/spec-rel-inadimplencia.md
```
O Claude lê `CLAUDE.md` automaticamente e segue o fluxo definido lá.

### Opção B — Claude.ai (Projects)
Crie um Project, faça upload dos arquivos de `docs/` e `examples/`,
e peça relatórios por chat. Copie o código gerado para o VSCode.

### Opção C — API no seu ERP
Use os arquivos de `docs/` e `examples/` como system prompt para
expor geração de relatórios em linguagem natural aos usuários finais.

## Dica de ouro

Na primeira semana, gere 5 a 10 relatórios e **anote cada correção** que
você precisou fazer manualmente. Atualize os `docs/` com essas correções.
Em pouco tempo a qualidade das saídas melhora dramaticamente — é o mesmo
princípio de onboarding de um desenvolvedor júnior.
