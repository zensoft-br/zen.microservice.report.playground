# Contexto do projeto — Geração de relatórios

> Este arquivo é lido automaticamente pelo Claude Code em cada sessão.
> Mantenha-o sucinto, atualizado e com links para documentos mais detalhados.

## Fluxo esperado ao criar um novo relatório

Quando eu pedir "crie um relatório de X", você deve:

1. Ler `docs/engine.md` se ainda não leu nesta sessão.
2. Ler pelo menos **um exemplo completo** em `/playground/` antes de escrever código novo.
3. Pedir esclarecimentos APENAS se faltar informação essencial (agrupamento,
   filtros obrigatórios, período). Caso contrário, assuma padrões e siga.
4. Gerar os dois arquivos (`index.jsx`, `template.json`).
5. Ao final, listar os arquivos criados e sugerir o comando de preview local.

## Regras duras (não negocie)

- **NUNCA** invente componentes que não estão documentados em `engine.md`.
- **NUNCA** use bibliotecas externas no template sem me perguntar.

## Schema do banco

Ver `docs/db-schema.md` para as tabelas e views mais usadas. Se precisar de
uma tabela que não está documentada lá, me pergunte antes de assumir colunas.

## Exemplos de referência (golden examples)

Quando em dúvida sobre estilo/estrutura, siga estes exemplos nesta ordem:

1. `/relatorios/vendas-por-vendedor/` — agrupamento simples + totalizador.
2. `/relatorios/inadimplencia-por-filial/` — múltiplos agrupamentos + faixas etárias.
3. `/relatorios/fluxo-de-caixa-mensal/` — tabela com pivot de meses.
