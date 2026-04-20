# Especificação de Relatório

> Preencha este template ao pedir um relatório novo. Quanto mais claro,
> menos idas e vindas. Se um campo não se aplica, escreva "N/A".

## Identificação

- **Nome:** 
- **Slug (kebab-case, vira nome da pasta):** 
- **Objetivo em uma frase:** 
- **Quem consome (área/cargo):** 

## Parâmetros de entrada

Filtros que o usuário escolhe ao gerar o relatório.

| Parâmetro      | Tipo              | Obrigatório? | Default              |
|----------------|-------------------|--------------|----------------------|
| data_inicio    | date              | sim          | primeiro dia do mês  |
| data_fim       | date              | sim          | hoje                 |
| filial_id      | int (ou null=todas)| não         | null                 |

## Fonte de dados

- **Tabelas/views envolvidas:** 
- **Regra de negócio importante:** (ex: "considerar apenas status = 'FATURADO'")
- **Joins esperados:** 

## Estrutura visual

- **Agrupamentos (ordem):** (ex: "Região → Vendedor")
- **Colunas da tabela principal:** 
  - nome da coluna — formato — alinhamento
  - ...
- **Totalizadores:** (ex: "subtotal por vendedor, total por região, total geral")
- **Gráficos:** (opcional — que tipo, o que plota)
- **Ordenação padrão:** 

## Exemplo do resultado esperado

Descreva em 2-3 linhas como seria uma página típica desse relatório. Se
tiver um print de um relatório parecido, anexe.

## Observações

Qualquer regra de negócio, caso de borda ou detalhe que não coube acima.
