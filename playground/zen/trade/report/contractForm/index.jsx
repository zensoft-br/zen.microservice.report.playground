import * as utils from "./utils.jsx";
import { Badge, getVisibleColumns, Table } from "./utils.jsx";

export default function ({ data = [], meta = {}, t }) {
  const { report = {} } = meta;

  const settings = utils.deepMerge(report?.properties?.["#settings"], report?.properties?.userSettings) ?? {};

  const columns = [
    { id: "id",
      header: utils.cellHeader(t("/@word/id")),
      width: "7ch",
      className: "id",
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({ data }) => data.length, 
      footer: ({ value }) => utils.formatNumber(value),
    },
    { id: "productPacking_code",
      header: utils.cellHeader(t("/@word/code")),
      width: "10ch",
      cellValue: ({ row }) => row.productPacking?.code,
      cell: ({ value }) => value,
    },
    { id: "product_description",
      header: utils.cellHeader(t("/@word/description")),
      width: "25ch",
      cellValue: ({ row }) => row.productPacking?.product.description,
      cell: ({ value }) => value,
    },
    { id: "productPacking_complement",
      header: utils.cellHeader(t("/@word/complement")),
      width: "10ch",
      cellValue: ({ row }) => row.productPacking?.complement,
      cell: ({ value }) => value,
    },
    { id: "productVariant_description",
      header: utils.cellHeader(t("/catalog/product/productVariant")),
      width: "10ch",
      cellValue: ({ row }) => row.productPacking?.variant?.description,
      cell: ({ value }) => value,
    },
    { id: "quantity",
      header: utils.cellHeader(t("/@word/quantity")),
      width: "10ch",
      className: "number",
      cell: ({ row, value }) => utils.formatNumber(value) + " " + row.productPacking?.product?.unit?.code,
      footerValue: ({ data }) => utils.sumBy(data, (e) => e.productPacking.product.unit.code, (e) => e.quantity),
      footer: ({ value }) => utils.renderAggr(value, (e, k) => `${utils.formatNumber(e)} ${k}`),
    },
    { id: "unitValue",
      header: utils.cellHeader(t("/@word/unitValue")),
      width: "10ch",
      className: "number",
      cell: ({ row, value }) => utils.formatCurrency(value, { currency: row.contract.currency?.code }),
    },
    { id: "totalValue",
      header: utils.cellHeader(t("/@word/totalValue")),
      width: "15ch",
      className: "number",
      cell: ({ row, value }) => utils.formatCurrency(value, { currency: row.contract.currency?.code }),
      footerValue: ({ data }) => utils.sumBy(data, (e) => e.contract.currency.code, (e) => e.totalValue),
      footer: ({ value }) => utils.renderAggr(value, (e, k) => `${utils.formatCurrency(e, { currency: k })}`),
    },
    { id: "category1",
      header: utils.cellHeader(t("/@word/category1")),
      width: "15ch",
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
  ];

  data = utils.sort(data, report.properties?.settings?.sort || []);
  
  const visibleColumns = getVisibleColumns({
    availableColumns: columns.map(column => column.id),
    overrideColumns: report.properties?.overrideColumns?.split(","),
    standardColumns:  [
      "productPacking_code",
      "product_description",
      "productPacking_complement",
      "productVariant_description",
      "quantity",
      "unitValue",
      "totalValue",
    ],
    addColumns: report.properties?.showColumns?.split(","),
    removeColumns: report.properties?.hideColumns?.split(","),
  });

  const groups = report.properties?.settings?.groups || [];

  return (
    <div className="report-wrapper" style={{ fontSize: settings?.fontSize }}>
      {data.map((item, index) => (
        <div className="report-container a4">
          <header>
            <h1 className="grid" style={{ gridTemplateColumns: "1fr auto 1fr", alignItems: "center" }}>
              <img src={item.company.image?.url} style={{ height: "2cm", width: "4cm", objectFit: "contain" }} />
              <span>{t("/trade/contract")} {item.id}</span>
              <img src={`https://barcode.zensoft.com.br?bcid=qrcode&text=${item.id}`} style={{ width: "2cm", justifySelf: "end" }} />
            </h1>
            <section className="parameters">
              <dl>
                <dt>{t("/@word/status")}</dt>
                <dd>{t(`/trade/contractStatus/enum/${item.status}`)}</dd>
              </dl>
              <dl>
                <dt>{t("/catalog/company/company")}</dt>
                <dd>{item.company.code}</dd>
              </dl>
              <dl>
                <dt>{t("/@word/supplier")}</dt>
                <dd>{item.person.name}</dd>
              </dl>
            </section>
            <section className="parameters">
              <dl>
                <dt>{t("/@word/code")}</dt>
                <dd>{item.code}</dd>
              </dl>
              <dl>
                <dt>{t("/@word/date")}</dt>
                <dd>{utils.formatDate(item.date)}</dd>
              </dl>
              <dl>
                <dt>{t("/catalog/location/country")}</dt>
                <dd>{item.country.codeA2}</dd>
              </dl>
              <dl>
                <dt>{t("/financial/currency")}</dt>
                <dd>{item.currency.code}</dd>
              </dl>
            </section>
          </header>
          <main>
            <div className="content">
              <Table
                columns={columns}
                visibleColumns={visibleColumns}
                data={item.items}
                groups={groups} />
            </div>
          </main>
        </div>
      ))}
    </div>
  );
}