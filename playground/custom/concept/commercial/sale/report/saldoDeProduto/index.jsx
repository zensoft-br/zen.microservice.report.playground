import * as utils from "./utils.jsx";
import { Badge, getVisibleColumns, GroupTable } from "./utils.jsx";

export default function ({ data = [], meta = {}, t }) {
  const { report = {} } = meta;

  const columns = [
    { id: "compra_codigo",
      header: "Origem",
      width: "15ch",
    },
    {
      id: "produto_codigo",
      header: "Produto",
      width: "15ch",
    },
    { id: "compra_disponibilidade",
      header: "Previsão",
      width: "10ch",
      cell: ({ value }) => utils.formatDate(value),
    },
    { id: "variante_descricao",
      header: "Grade",
      width: "15ch",
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    { id: "real_embarcado",
      header: "Real, embarcado",
      className: "number",
      width: "15ch",
      cell: ({ value }) => utils.formatNumber(value, { digits: 2 }),
      footerValue: ({ data }) => data.reduce((acc, row) => acc + row.real_embarcado, 0),
      footer: ({ value }) => utils.formatNumber(value, { digits: 2 }),
    },
    { id: "real_faturavel",
      header: "Real, faturável",
      className: "number",
      width: "15ch",
      cell: ({ value }) => utils.formatNumber(value, { digits: 2 }),
      footerValue: ({ data }) => data.reduce((acc, row) => acc + row.real_faturavel, 0),
      footer: ({ value }) => utils.formatNumber(value, { digits: 2 }),
    },
    {
      id: "real_faturavel_percent",
      header: "%",
      className: "number percent",
      width: "10ch",
      cell: ({ row }) => utils.formatNumber(row.real_faturavel_percent, { digits: 1 }),
      footerValue: ({ data }) => {
        const totalRealEmbarcado = data.reduce((acc, row) => acc + row.real_embarcado, 0);
        const totalRealFaturavel = data.reduce((acc, row) => acc + row.real_faturavel, 0);
        return totalRealEmbarcado ? (totalRealFaturavel / totalRealEmbarcado) * 100 : 0;
      },
      footer: ({ value }) => utils.formatNumber(value, { digits: 1 }),
    },
    { id: "real_vendido",
      header: "Real, vendido",
      className: "number",
      width: "15ch",
      cell: ({ value }) => utils.formatNumber(value, { digits: 2 }),
      footerValue: ({ data }) => data.reduce((acc, row) => acc + row.real_vendido, 0),
      footer: ({ value }) => utils.formatNumber(value, { digits: 2 }),
    },
    { id: "real_disponivel",
      header: "Real, disponível",
      className: "number",
      width: "15ch",
      cell: ({ value }) => utils.formatNumber(value, { digits: 2 }),
      footerValue: ({ data }) => data.reduce((acc, row) => acc + row.real_disponivel, 0),
      footer: ({ value }) => utils.formatNumber(value, { digits: 2 }),
    },
    {
      id: "real_disponivel_percent",
      header: "%",
      className: "number percent",
      width: "10ch",
      cell: ({ row }) => utils.formatNumber(row.real_disponivel_percent, { digits: 1 }),
      footerValue: ({ data }) => {
        const totalRealEmbarcado = data.reduce((acc, row) => acc + row.real_embarcado, 0);
        const totalRealDisponivel = data.reduce((acc, row) => acc + row.real_disponivel, 0);
        return totalRealEmbarcado ? (totalRealDisponivel / totalRealEmbarcado) * 100 : 0;
      },
      footer: ({ value }) => utils.formatNumber(value, { digits: 1 }),
    },
    { id: "sobrevenda_embarcado",
      header: "Sobrevenda, embarcado",
      className: "number",
      width: "15ch",
      cell: ({ value }) => utils.formatNumber(value, { digits: 2 }),
      footerValue: ({ data }) => data.reduce((acc, row) => acc + (row.real_embarcado * 1.2), 0),
      footer: ({ value }) => utils.formatNumber(value, { digits: 2 }),
    },
    { id: "sobrevenda_disponivel",
      header: "Sobrevenda, disponível",
      className: "number",
      width: "15ch",
      cell: ({ value }) => utils.formatNumber(value, { digits: 2 }),
      footerValue: ({ data }) => data.reduce((acc, row) => acc + row.sobrevenda_disponivel, 0),
      footer: ({ value }) => utils.formatNumber(value, { digits: 2 }),
    },
    {
      id: "sobrevenda_disponivel_percent",
      header: "%",
      className: "number percent",
      width: "10ch",
      cell: ({ row }) => utils.formatNumber(row.sobrevenda_disponivel_percent, { digits: 1 }),
      footerValue: ({ data }) => {
        const totalSobrevendaEmbarcado = data.reduce((acc, row) => acc + (row.real_embarcado * 1.2), 0);
        const totalSobrevendaDisponivel = data.reduce((acc, row) => acc + row.sobrevenda_disponivel, 0);
        return totalSobrevendaEmbarcado ? (totalSobrevendaDisponivel / totalSobrevendaEmbarcado) * 100 : 0;
      },
      footer: ({ value }) => utils.formatNumber(value, { digits: 1 }),
    },
    {
      id: "fila_vendido",
      header: "Fila, vendido",
      className: "number",
      width: "15ch",
      cellValue: ({ row }) => 0,
    },
    { id: "venda_total",
      header: "Venda total",
      className: "number",
      width: "15ch",
      cell: ({ value }) => utils.formatNumber(value, { digits: 2 }),
      footerValue: ({ data }) => data.reduce((acc, row) => acc + row.real_vendido, 0),
      footer: ({ value }) => utils.formatNumber(value, { digits: 2 }),
    },
    {
      id: "venda_total_percent",
      header: "%",
      className: "number percent",
      width: "10ch",
      cell: ({ row }) => utils.formatNumber(row.venda_total_percent, { digits: 1 }),
      footerValue: ({ data }) => {
        const totalRealEmbarcado = data.reduce((acc, row) => acc + row.real_embarcado, 0);
        const totalVendaTotal = data.reduce((acc, row) => acc + row.real_vendido, 0);
        return totalRealEmbarcado ? (totalVendaTotal / totalRealEmbarcado) * 100 : 0;
      },
      footer: ({ value }) => utils.formatNumber(value, { digits: 1 }),
    },
  ];

  data.forEach(row => {
    row.real_faturavel = Math.min(row.real_embarcado, row.real_vendido);
    row.real_disponivel = row.real_embarcado - row.real_vendido;
    row.sobrevenda_embarcado = row.real_embarcado * 1.2;
    row.sobrevenda_disponivel = row.real_embarcado * 1.2 - row.real_vendido;
    row.fila_vendido = 0;
    row.venda_total = row.real_vendido;

    row.real_faturavel_percent = round((row.real_faturavel / row.real_embarcado) * 100, 2);
    row.real_disponivel_percent = round((row.real_disponivel / row.real_embarcado) * 100, 2);
    row.sobrevenda_disponivel_percent = round((row.sobrevenda_disponivel / row.sobrevenda_embarcado) * 100, 2);
    row.venda_total_percent = round((row.venda_total / row.real_embarcado) * 100, 2);
  });

  data = utils.sort(data, [{ "columnId": "variante_descricao" }, { "columnId": "produto_codigo" }, { "columnId": "compra_disponibilidade" }]);
  
  const groups = [{ "columnId": "variante_descricao" }, { "columnId": "produto_codigo" }];
  
  const visibleColumns = getVisibleColumns({
    availableColumns: columns.map(column => column.id),
    overrideColumns: report.properties?.overrideColumns?.split(","),
    // overrideColumns: columns.map(column => column.id),
    standardColumns:  [
      "compra_codigo",
      "compra_disponibilidade",
      // "variante_descricao",
      "real_embarcado",
      "real_faturavel",
      "real_faturavel_percent",
      "real_vendido",
      "real_disponivel",
      "real_disponivel_percent",
      "sobrevenda_embarcado",
      "sobrevenda_disponivel",
      "sobrevenda_disponivel_percent",
      "fila_vendido",
      "venda_total",
      "venda_total_percent",
    ],
    addColumns: report.properties?.showColumns?.split(","),
    removeColumns: report.properties?.hideColumns?.split(","),
  });

  return (
    <div className="report-wrapper">
      <div className="report-container a4 landscape">
        <header>
          <h1>Saldo de Produto</h1>
          <section className="parameters">
            <dl>
              <dt>Data</dt>
              <dd>{utils.formatDate(new Date())}</dd>
            </dl>
          </section>
        </header>
        <main>
          <div className="content">
            <GroupTable
              columns={columns}
              visibleColumns={visibleColumns}
              data={data}
              groups={groups}
              t={t} />
          </div>
        </main>
      </div>
    </div>
  );
}

function round(value, decimals) {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}