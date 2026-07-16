import * as utils from "./utils.jsx";
import { Table } from "./utils.jsx";

export default function ({ data = [], t }) {
  data.forEach(quote => {
    quote.items.sort((a, b) => {
      if (a.itemSequence !== b.itemSequence) return a.itemSequence - b.itemSequence;
      return a.proposalSequence - b.proposalSequence;
    });
  });

  const settings = utils.deepMerge(report?.properties?.["#settings"], report?.properties?.userSettings) ?? {};

  const columns = [
    {
      id: "itemSequence",
      header: t("/sale/quoteItem.itemSequence"),
    },
    {
      id: "proposalSequence",
      header: t("/sale/quoteItem.proposalSequence"),
    },
    {
      id: "item_code",
      header: t("/@word/code"),
      width: "16ch",
      cellValue: ({ row }) => row.code ?? row.productPacking?.code,
    },
    {
      id: "product_description",
      header: t("/@word/description"),
      width: "16ch",
      cellValue: ({ row }) => row.properties?.description ?? row.productPacking?.product.description,
    },
    {
      id: "quantity",
      header: t("/@word/quantity"),
      className: "number",
      cell: ({ row, value }) => utils.formatQuantity(value, { unit_code: row.productPacking?.product?.unit?.code }),
      footerValue: (quote) => utils.formatNumber(quote.items?.filter(item => item.proposalSequence === 1).reduce((acc, item) => acc + item.quantity, 0)),
    },
    {
      id: "unitValue",
      header: t("/@word/unitValue"),
      className: "number",
      cell: ({ row, value }) => utils.formatCurrency(value, { currency: row.currency?.code }),
    },
    {
      id: "unitValueLocal",
      header: t("/@word/unitValue") + " BRL",
      className: "number",
      cell: ({ value }) => utils.formatCurrency(value, { currency: "BRL" }),
    },
    {
      id: "totalValue",
      header: t("/@word/totalValue"),
      className: "number",
      width: "10ch",
      cell: ({ row, value }) => utils.formatCurrency(value, { currency: row.currency?.code }),
      footerValue: ({ data }) => utils.sumBy(data, (row) => row.currency?.code, (row) => row.totalValue),
      footer: ({ value }) => utils.renderAggr(value, (val, key) => utils.formatCurrency(val, { currency: key })),
    },
    {
      id: "origin",
      header: "Proc.",
      cellValue: ({ row }) => row.properties?.origin,
    },
    {
      id: "brand",
      header: "Marca",
      cellValue: ({ row }) => row.properties?.brand,
    },
    {
      id: "availabilityDate",
      header: t("/@word/availabilityDate"),
      cellValue: ({ row }) => utils.formatDate(row.quote.availabilityDate),
    },
  ];

  // const visibleColumns = columns.map((column) => column.id);

  return (
    <div className="report-wrapper" style={{ fontSize: settings?.fontSize }}>
      {data.map((quote) => (
        <div className="report-container">
          <header>
            <div className="brand">
              <img src={quote.company?.image?.url} style={{ width: "3cm" }}></img>
            </div>
            <h1 className="flex h gap align-center" style={{ justifyContent: "space-between" }}>{t("/sale/quote")} {quote.id}
              <img src={`https://barcode.zensoft.com.br?bcid=qrcode&text=${quote.id}`} style={{ width: "1.5cm" }}></img>
            </h1>
            <section className="parameters">
              <dl>
                <dt>{t("/catalog/company/company")}</dt>
                <dd>{quote.company?.person.name}</dd>
              </dl>
              <dl>
                <dt>{t(`/catalog/person/personDocumentType/enum/${quote.company?.person.documentType}`)}</dt>
                <dd>{quote.company?.person.documentNumber}</dd>
              </dl>
              <dl>
                <dt>{t("/@word/phone")}</dt>
                <dd>{quote.company?.person.phone}</dd>
              </dl>
            </section>
            <section className="parameters">
              <dl>
                <dt>{t("/catalog/person/person")}</dt>
                <dd>{quote.person?.name}</dd>
              </dl>
              <dl>
                <dt>{t(`/catalog/person/personDocumentType/enum/${quote.person?.documentType}`)}</dt>
                <dd>{quote.person?.documentNumber}</dd>
              </dl>
              <dl>
                <dt>{t("/@word/phone")}</dt>
                <dd>{quote.person?.phone}</dd>
              </dl>
            </section>
            <section className="parameters">
              <dl>
                <dt>{t("/@word/date")}</dt>
                <dd>{utils.formatDate(quote.date)}</dd>
              </dl>
              <dl>
                <dt>{t("/@word/personSalesperson")}</dt>
                <dd>{quote.personSalesperson?.name}</dd>
              </dl>
              <dl>
                <dt>{t("/@word/phone")}</dt>
                <dd>{quote.personSalesperson?.phone}</dd>
              </dl>
            </section>
            <section className="parameters">
              <dl>
                <dt>{t("/@word/comments")}</dt>
                <dd><pre>{quote.saleProfile?.properties?.quote_comments}</pre></dd>
              </dl>
            </section>
          </header>
          <main>
            <section>
              <div className="content">
                <Table columns={columns} 
                  visibleColumns={[]} 
                  data={quote.items} />
              </div>
            </section>
          </main>
        </div>
      ))}
    </div>
  );
};
