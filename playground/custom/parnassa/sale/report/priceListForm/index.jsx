import * as utils from "./utils.jsx";
import { Table } from "./utils.jsx";

export default function ({ data = [], meta = {}, t }) {
  const { report = {} } = meta;

  data.sort((a, b) => {
    return Number(a.product.code) - Number(b.product.code);
  });

  const settings = utils.deepMerge(report?.properties?.["#settings"], report?.properties?.userSettings) ?? {};

  const columns = [
    {
      id: "code",
      header: utils.cellHeader("Código"),
      width: "12ch",
      cellValue: ({ row }) => row.product?.code,
    },
    {
      id: "product",
      header: utils.cellHeader("Produto"),
      width: "40ch",
      cellValue: ({ row }) => row.product?.description,
    },
    {
      id: "valorFob",
      header: utils.cellHeader("Valor FOB"),
      width: "15ch",
      className: "number",
      cell: ({ value }) => utils.formatNumber(value, { minimumFractionDigits: 4, maximumFractionDigits: 4 }),
    },
    {
      id: "nacionalizacao",
      header: utils.cellHeader("% NAC"),
      width: "12ch",
      className: "number",
      cellValue: ({ row }) => (row.nacionalizacao - 1) * 100,
      cell: ({ value }) => utils.formatNumber(value, { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
    },
    // Automatically generate the 10 dynamic item columns
    ...Array.from({ length: 10 }).map((_, index) => ({
      id: `item_${index}`,
      header: utils.cellHeader(data[0]?.items?.[index]?.descricao || ""),
      width: "15ch",
      className: "number",
      cellValue: ({ row }) => row.items?.[index]?.valor,
      cell: ({ value }) => utils.formatNumber(value, {
        locale: report.locale,
        minimumFractionDigits: 4,
        maximumFractionDigits: 4,
      }),
    })),
  ];

  const visibleColumns = settings?.columns ?? [];

  return (
    <div className="report-wrapper" style={{ fontSize: settings?.fontSize }}>
      <div className="report-container">
        <header>
          <h1>Lista de Preços</h1>
          <section className="parameters">
            <dl>
              <dt>Categoria</dt>
              <dd>{report.parameters?.category_id}</dd>
            </dl>
          </section>
        </header>
        <main>
          <div className="content">
            <Table
              columns={columns}
              visibleColumns={visibleColumns}
              data={data}
              footerTitle={t("/@word/summary")} />
          </div>
        </main>
      </div>
    </div>
  );
}
