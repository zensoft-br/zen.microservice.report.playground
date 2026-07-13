import * as utils from "./utils.jsx";
import { Badge, getVisibleColumns, Table } from "./utils.jsx";

export default function ({ data = [], meta = {}, t }) {
  const { report = {} } = meta;

  const map = data.reduce((red, e) => {
    const key = e.id;
    let value = red.get(key);
    if (!value) {
      value = [];
      red.set(key, value);
    }
    value.push(e);
    return red;
  }, new Map());

  const columns = [
    // { 
    //   id: "id",
    //   header: utils.cellHeader(t("/@word/id")),
    //   width: "7ch",
    //   className: "id",
    //   cell: ({ value }) => utils.formatNumber(value),
    //   footerValue: ({ data }) => data.length, 
    //   footer: ({ value }) => utils.formatNumber(value),
    // },
    // { 
    //   id: "name",
    //   header: utils.cellHeader(t("/@word/name")),
    //   width: "30ch",
    // },
    // { 
    //   id: "score",
    //   header: utils.cellHeader(t("/@word/score")),
    //   width: "10ch",
    //   className: "number",
    //   cell: ({ value }) => utils.formatNumber(value, { minimumFractionDigits: 2 }),
    //   footerValue: ({ data }) => utils.sum(data, (row) => row.score),
    //   footer: ({ value }) => utils.formatNumber(value, { minimumFractionDigits: 2 }),
    // },
    // { 
    //   id: "category1",
    //   header: utils.cellHeader(t("/catalog/category")),
    //   width: "15ch",
    //   cell: ({ value }) => <Badge>{value}</Badge>,
    // },
    // { 
    //   id: "status",
    //   header: <i>{utils.cellHeader(t("/@word/status"))}</i>,
    //   width: "15ch",
    //   cell: ({ value }) => <Badge>{value}</Badge>,
    // },
    // { 
    //   id: "quantity",
    //   className: "number",
    //   header: utils.cellHeader(t("/@word/quantity")),
    //   width: "10ch",
    //   cell: ({ row, value }) => utils.formatQuantity(value, { unit_code: row.unit }),
    //   footerValue: ({ data }) => utils.sumBy(data, (item) => item.unit, (item) => item.quantity),
    //   footer: ({ value }) => utils.renderAggr(value, (quantity, unit_code) => utils.formatQuantity(quantity, { unit_code })),
    // },
    // { 
    //   id: "value",
    //   className: "number",
    //   header: <i>{utils.cellHeader(t("/@word/value"))}</i>,
    //   width: "15ch",
    //   cell: ({ row, value }) => utils.formatCurrency(value, { currency: row.currency }),
    //   footerValue: ({ data }) => utils.sumBy(data, (item) => item.currency, (item) => item.value),
    //   footer: ({ value }) => utils.renderAggr(value, (value, key) => utils.formatCurrency(value, { currency: key })),
    // },
    // {
    //   id: "picture",
    //   header: utils.cellHeader(t("/system/image")),
    //   width: "10ch",
    //   cell: ({ value }) => value ? <img src={value} alt="picture" style={{ width: "1.5cm" }} /> : null,
    // },
    // {
    //   id: "virtual_column_1",
    //   header: utils.cellHeader(t("/@word/group1")),
    //   width: "15ch",
    //   cellValue: ({ row }) => `${row.category1} - ${row.status}`,
    //   cell: ({ row }) => <><Badge>{row.category1}</Badge> <Badge>{row.status}</Badge></>,
    // },
    {
      id: "product_code",
      header: utils.cellHeader(t("/catalog/product/product")),
    },
    {
      id: "product_calc",
      header: utils.cellHeader(t("/catalog/product/product")),
      cellValue: ({ row }) => `${row.product_code} - ${row.product_description} - ${row.product_complement}`,
    },
    {
      id: "productPacking_code",
      header: utils.cellHeader(t("/catalog/product/productPacking")),
    },
    {
      id: "productPacking_calc",
      header: utils.cellHeader(t("/catalog/product/productPacking")),
      cellValue: ({ row }) => `${row.productPacking_code} - ${row.productVariant_description}`,
    },
    {
      id: "person_nameCalc",
      header: utils.cellHeader(t("@@:/catalog/person/person")),
    },
    {
      id: "lot_code",
      header: utils.cellHeader(t("/material/lot")),
      footerValue: ({ data }) => new Set(data.map(item => item.lot_code).filter(Boolean)).size,
      footer: ({ value }) => utils.formatNumber(value),
    },
    {
      id: "serial_code",
      header: utils.cellHeader(t("/material/serial")), 
      footerValue: ({ data }) => new Set(data.map(item => item.serial_code).filter(Boolean)).size,
      footer: ({ value }) => utils.formatNumber(value),
    },
    {
      id: "quantity",
      className: "number",
      header: utils.cellHeader(t("/@word/quantity")),
      cell: ({ row, value }) => utils.formatQuantity(value, { unit_code: row.unit_code }),
      footerValue: ({ data }) => utils.sumBy(data, (item) => item.unit_code, (item) => item.quantity),
      footer: ({ value }) => utils.renderAggr(value, (quantity, key) => utils.formatQuantity(quantity, { unit_code: key })),
    },
    {
      id: "netWeightKg",
      className: "number",
      header: utils.cellHeader(t("/@word/netWeightKg")),
      footerValue: ({ data }) => utils.sum(data, (row) => row.netWeightKg),
      footer: ({ value }) => utils.formatNumber(value),
    },
    {
      id: "grossWeightKg",
      className: "number",
      header: utils.cellHeader(t("/@word/grossWeightKg")),
      footerValue: ({ data }) => utils.sum(data, (row) => row.grossWeightKg),
      footer: ({ value }) => utils.formatNumber(value),
    },
  ];

  data = utils.sort(data, report.properties?.settings?.sort || []);
  
  const visibleColumns = getVisibleColumns({
    availableColumns: columns.map(column => column.id),
    overrideColumns: report.properties?.overrideColumns?.split(","),
    standardColumns: report.properties?.settings?.columns ?? [
      "lot_code",
      "serial_code",
      "quantity",
      "grossWeightKg",
    ],
    addColumns: report.properties?.showColumns?.split(","),
    removeColumns: report.properties?.hideColumns?.split(","),
  });

  const groups = report.properties?.settings?.groups || [
    {
      columnId: "product_calc",
    },
    {
      columnId: "productPacking_calc",
    },
  ];


  return (
    <div className="report-wrapper" style={{ fontSize: report.properties?.fontSize }}>
      {map.values().map((data) => (
        <div className="report-container a4">
          <header>
            <h1 className="grid" style={{ gridTemplateColumns: "1fr auto 1fr", alignItems: "center" }}>
              <img src={data[0]?.company_image_url} style={{ height: "2cm", width: "4cm", objectFit: "contain" }} />
              <span>{t("/material/outgoingList")} {data[0].id}</span>
              <img src={`https://barcode.zensoft.com.br?bcid=qrcode&text=${data[0].id}`} style={{ width: "2cm", justifySelf: "end" }} />
            </h1>
            <h1>{report.title}</h1>
            <section className="parameters">
              <dl>
                <dt>{t("/catalog/company/company")}</dt>
                <dd>{data[0].company_code}</dd>
              </dl>
              <dl>
                <dt>{t("/material/outgoingList")}</dt>
                <dd>{utils.formatNumber(data[0].id)}</dd>
              </dl>
              <dl>
                <dt>{t("/@word/date")}</dt>
                <dd>{utils.formatDate(data[0].date)}</dd>
              </dl>
            </section>
            <section className="parameters">
              <dl>
                <dt>{t("/catalog/person/person")}</dt>
                <dd>{data[0].person_nameCalc}</dd>
              </dl>
              <dl>
                <dt>{t("/sale/sale")}</dt>
                <dd>{0}</dd>
              </dl>
              <dl>
                <dt>{t("/fiscal/outgoingInvoice")}</dt>
                <dd>{0}</dd>
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
                footerTitle={t("/@word/summary")} />
            </div>
          </main>
        </div>
      ))}
    </div>
  );
}