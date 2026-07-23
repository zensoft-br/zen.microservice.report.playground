import * as utils from "./utils.jsx";
import { Badge, Table } from "./utils.jsx";

export default function ({ data = [], meta = {}, t }) {
  const { report = {} } = meta;

  const settings = utils.deepMerge(report?.properties?.["#settings"], report?.properties?.userSettings) ?? {};

  const columns = [
    {
      id: "un",
      header: "Unidade",
      width: "8ch",
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "compra_codigo",
      header: "Origem",
      width: "20ch",
    },
    {
      id: "produtoMestre_codigo",
      header: "Produto mestre",
      width: "15ch",
      groupCell: ({ row }) => <>Produto mestre: <Badge>{row.produtoMestre_codigo}</Badge> {row?.produtoMestre_descricao ?? ""}&nbsp;&nbsp;&nbsp;unidade: <Badge>{row?.un ?? ""}</Badge>&nbsp;&nbsp;&nbsp;coleção: <Badge>{row?.produtoMestre_colecao ?? ""}</Badge>&nbsp;&nbsp;&nbsp;classe: <Badge>{row?.produtoMestre_classe ?? ""}</Badge></>,
      cell: ({ row, value }) => <><Badge>{value}</Badge> {row?.produtoMestre_descricao ?? ""}</>,
    },
    {
      id: "produtoMestre_classe",
      header: "Classe",
      width: "15ch",
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "produto_codigo",
      header: "Produto",
      width: "15ch",
      groupCell: ({ row }) => <>Produto: <Badge>{row.produto_codigo}</Badge> {row?.produtoMestre_descricao ?? ""} / {row?.variante_descricao ?? ""}&nbsp;&nbsp;&nbsp;unidade: <Badge>{row.un}</Badge></>,
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    { id: "compra_disponibilidade",
      header: "Previsão",
      width: "14ch",
      cell: ({ row, value }) => row.type === "PE" ? row.prontaEntrega_lote  : utils.formatDate(value, { year: "2-digit", month: "numeric", day: "numeric" }),
    },
    { id: "variante_descricao",
      header: "Grade",
      width: "15ch",
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    { id: "real_embarcado",
      header: "Real, embarcado",
      className: "number real",
      width: "15ch",
      cell: ({ value }) => utils.formatNumber(value, { digits: 2 }),
      footerValue: ({ data, level }) => data.reduce((acc, row) => acc + row.real_embarcado * (level == 0 ? row.rendimento : 1), 0),
      footer: ({ value }) => utils.formatNumber(value, { digits: 2 }),
    },
    { id: "real_faturavel",
      header: "Real, faturável",
      className: "number real",
      width: "15ch",
      cell: ({ value }) => utils.formatNumber(value, { digits: 2 }),
      footerValue: ({ data, level }) => data.reduce((acc, row) => acc + row.real_faturavel * (level == 0 ? row.rendimento : 1), 0),
      footer: ({ value }) => utils.formatNumber(value, { digits: 2 }),
    },
    {
      id: "real_faturavel_percent",
      header: "%",
      className: "number percent real",
      width: "10ch",
      cell: ({ row }) => utils.formatNumber(row.real_faturavel_percent, { digits: 2 }),
      footerValue: ({ data }) => {
        const totalRealEmbarcado = data.reduce((acc, row) => acc + row.real_embarcado, 0);
        const totalRealFaturavel = data.reduce((acc, row) => acc + row.real_faturavel, 0);
        return totalRealEmbarcado ? (totalRealFaturavel / totalRealEmbarcado) * 100 : 0;
      },
      footer: ({ value }) => utils.formatNumber(value, { digits: 2 }),
    },
    { id: "real_vendido",
      header: "Real, vendido",
      className: "number real",
      width: "15ch",
      cell: ({ value }) => utils.formatNumber(value, { digits: 2 }),
      footerValue: ({ data, level }) => data.reduce((acc, row) => acc + row.real_vendido * (level == 0 ? row.rendimento : 1), 0),
      footer: ({ value }) => utils.formatNumber(value, { digits: 2 }),
    },
    { id: "real_disponivel",
      header: "Real, disponível",
      className: "number real",
      width: "15ch",
      cell: ({ value }) => utils.formatNumber(value, { digits: 2 }),
      footerValue: ({ data, level }) => data.reduce((acc, row) => acc + row.real_disponivel * (level == 0 ? row.rendimento : 1), 0),
      footer: ({ value }) => utils.formatNumber(value, { digits: 2 }),
    },
    {
      id: "real_disponivel_percent",
      header: "%",
      className: "number percent real last",
      width: "10ch",
      cell: ({ row }) => utils.formatNumber(row.real_disponivel_percent, { digits: 2 }),
      footerValue: ({ data }) => {
        const totalRealEmbarcado = data.reduce((acc, row) => acc + row.real_embarcado, 0);
        const totalRealDisponivel = data.reduce((acc, row) => acc + row.real_disponivel, 0);
        return totalRealEmbarcado ? (totalRealDisponivel / totalRealEmbarcado) * 100 : 0;
      },
      footer: ({ value }) => utils.formatNumber(value, { digits: 2 }),
    },
    { id: "sobrevenda_embarcado",
      header: "Sobrevenda, embarcado",
      className: "number sobrevenda",
      width: "15ch",
      cell: ({ value }) => utils.formatNumber(value, { digits: 2 }),
      footerValue: ({ data, level }) => data.reduce((acc, row) => acc + (row.sobrevenda_embarcado) * (level == 0 ? row.rendimento : 1), 0),
      footer: ({ value }) => utils.formatNumber(value, { digits: 2 }),
    },
    { id: "sobrevenda_disponivel",
      header: "Sobrevenda, disponível",
      className: "number sobrevenda",
      width: "15ch",
      cell: ({ value }) => utils.formatNumber(value, { digits: 2 }),
      footerValue: ({ data, level }) => data.reduce((acc, row) => acc + row.sobrevenda_disponivel * (level == 0 ? row.rendimento : 1), 0),
      footer: ({ value }) => utils.formatNumber(value, { digits: 2 }),
    },
    {
      id: "sobrevenda_disponivel_percent",
      header: "%",
      className: "number percent sobrevenda last",
      width: "10ch",
      cell: ({ row }) => utils.formatNumber(row.sobrevenda_disponivel_percent, { digits: 2 }),
      footerValue: ({ data }) => {
        const totalSobrevendaEmbarcado = data.reduce((acc, row) => acc + (row.real_embarcado * 1.2), 0);
        const totalSobrevendaDisponivel = data.reduce((acc, row) => acc + row.sobrevenda_disponivel, 0);
        return totalSobrevendaEmbarcado ? (totalSobrevendaDisponivel / totalSobrevendaEmbarcado) * 100 : 0;
      },
      footer: ({ value, level }) => utils.formatNumber(value, { digits: 2 }),
    },
    {
      id: "filaEspera_vendido",
      header: "Fila, vendido",
      className: "number fila",
      width: "15ch",
      footerValue: ({ data, level }) => data.reduce((acc, row) => acc + row.filaEspera_vendido * (level == 0 ? row.rendimento : 1), 0),
      footer: ({ value }) => utils.formatNumber(value, { digits: 2 }),
    },
    {
      id: "filaEspera_vendido_percent",
      header: "%",
      className: "number percent fila last",
      width: "10ch",
      cell: ({ row }) => utils.formatNumber(row.filaEspera_vendido_percent, { digits: 2 }),
      footerValue: ({ data }) => {
        const totalFilaVendido = data.reduce((acc, row) => acc + row.filaEspera_vendido, 0);
        const totalRealEmbarcado = data.reduce((acc, row) => acc + row.real_embarcado, 0);
        return totalRealEmbarcado ? (totalFilaVendido / totalRealEmbarcado) * 100 : 0;
      },
      footer: ({ value }) => utils.formatNumber(value, { digits: 2 }),
    },
    { id: "venda_total",
      header: "Venda total",
      className: "number total",
      width: "15ch",
      cell: ({ value }) => utils.formatNumber(value, { digits: 2 }),
      footerValue: ({ data, level }) => data.reduce((acc, row) => acc + row.real_vendido * (level == 0 ? row.rendimento : 1), 0),
      footer: ({ value }) => utils.formatNumber(value, { digits: 2 }),
    },
    {
      id: "venda_total_percent",
      header: "%",
      className: "number percent total",
      width: "10ch",
      cell: ({ row }) => utils.formatNumber(row.venda_total_percent, { digits: 2 }),
      footerValue: ({ data }) => {
        const totalRealEmbarcado = data.reduce((acc, row) => acc + row.real_embarcado, 0);
        const totalVendaTotal = data.reduce((acc, row) => acc + row.real_vendido, 0);
        return totalRealEmbarcado ? (totalVendaTotal / totalRealEmbarcado) * 100 : 0;
      },
      footer: ({ value }) => utils.formatNumber(value, { digits: 2 }),
    },
    {
      id: "product_image",
      header: ({ row }) => row.product_image ? <img src={row.product_image} alt="Product" /> : null,
      width: "10ch",
      cell: () => null,
    },
  ];

  data.forEach(row => {
    row.real_faturavel = Math.min(row.real_embarcado, row.real_vendido);
    row.real_disponivel = row.real_embarcado - row.real_vendido;
    // row.sobrevenda_embarcado = row.real_embarcado * 1.2;
    // row.sobrevenda_disponivel = row.sobrevenda_embarcado - row.real_vendido;
    row.venda_total = row.real_vendido + row.filaEspera_vendido;

    row.real_faturavel_percent = round((row.real_faturavel / row.real_embarcado) * 100, 2);
    row.real_disponivel_percent = round((row.real_disponivel / row.real_embarcado) * 100, 2);
    row.sobrevenda_disponivel_percent = round((row.sobrevenda_disponivel / row.sobrevenda_embarcado) * 100, 2);
    row.venda_total_percent = round((row.venda_total / row.real_embarcado) * 100, 2);
  });

  const visibleColumns = settings?.columns ?? [];

  const groups = settings?.groups || [];

  data = utils.sort(data, settings?.sort || []);

  return (
    <div className="report-wrapper" style={{ fontSize: settings?.fontSize }}>
      <div className="report-container a4 landscape">
        <header>
          <h1>{settings.title}</h1>
          <section className="parameters">
            <dl>
              <dt>Data</dt>
              <dd>{utils.formatDate(new Date(), { year: "2-digit", month: "numeric", day: "numeric" })}</dd>
            </dl>
          </section>
        </header>
        <main>
          <div className="content">
            <Table
              columns={columns}
              visibleColumns={visibleColumns}
              data={data}
              groups={groups}
              footerTitle="Total m (convertido)" />
          </div>
        </main>
      </div>
    </div>
  );
}

function round(value, decimals) {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}