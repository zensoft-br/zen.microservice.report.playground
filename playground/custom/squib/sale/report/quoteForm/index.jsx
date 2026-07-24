import * as utils from "./utils.jsx";
import { Badge, Table } from "./utils.jsx";

export default function ({ data = [], meta = {}, t }) {
  const { report = {} } = meta;

  data.forEach((quote) => {
    quote.items.sort((a, b) => {
      if (a.itemSequence !== b.itemSequence) return a.itemSequence - b.itemSequence;
      return a.proposalSequence - b.proposalSequence;
    });
  });

  const settings =
    utils.deepMerge(report?.properties?.["#settings"], report?.properties?.userSettings) ?? {};

  const columns = [
    {
      id: "itemSequence",
      header: t("/sale/quoteItem.itemSequence"),
    },
    {
      id: "proposalSequence",
      header: t("/sale/quoteItem.proposalSequence"),
      cell: ({ value }) => <Badge>{value}</Badge>,
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
      cellValue: ({ row }) =>
        row.properties?.description ?? row.productPacking?.product.description,
    },
    {
      id: "quantity",
      className: "number",
      header: utils.cellHeader(t("/@word/quantity")),
      cell: ({ row, value }) =>
        utils.formatQuantity(value, {
          unit_code: row.productPacking.unit?.code ?? row.productPacking.product.unit.code,
        }),
      footerValue: ({ data }) =>
        utils.sumBy(
          data.filter((row) => row.proposalSequence === 1),
          (row) => row.productPacking.unit?.code ?? row.productPacking.product.unit.code,
          (row) => row.quantity,
        ),
      footer: ({ value }) =>
        utils.renderAggr(value, (quantity, unit_code) =>
          utils.formatQuantity(quantity, { unit_code }),
        ),
    },
    {
      id: "unitValue",
      className: "number",
      header: utils.cellHeader(t("/@word/unitValue")),
      cell: ({ row, value }) => utils.formatCurrency(value, { currency: row.currency?.code }),
      footerValue: ({ data }) =>
        utils.sumBy(
          data,
          (item) => item.currency,
          (item) => item.unitValue,
        ),
      footer: ({ value }) =>
        utils.renderAggr(value, (value, key) => utils.formatCurrency(value, { currency: key })),
    },
    {
      id: "unitValueLocal",
      header: t("/@word/unitValue") + " BRL",
      className: "number",
      cell: ({ value }) => utils.formatCurrency(value, { currency: "BRL" }),
    },
    {
      id: "totalValue",
      className: "number",
      width: "10ch",
      header: utils.cellHeader(t("/@word/totalValue")),
      cell: ({ row, value }) => utils.formatCurrency(value, { currency: row.currency?.code }),
      footerValue: ({ data }) =>
        utils.sumBy(
          data.filter((row) => row.proposalSequence === 1),
          (row) => row.currency?.code,
          (row) => row.totalValue,
        ),
      footer: ({ value }) =>
        utils.renderAggr(value, (val, key) => utils.formatCurrency(val, { currency: key })),
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

  const visibleColumns = settings?.columns ?? [];

  const groups = settings?.groups || [];

  return (
    <div className="report-wrapper" style={{ fontSize: settings?.fontSize }}>
      {data.map((quote) => (
        <div className={`report-container ${settings?.pageSize ?? "a4"} ${settings?.orientation}`}>
          <header>
            <h1
              className="grid"
              style={{
                gridTemplateColumns: "1fr auto 1fr",
                alignItems: "center",
              }}
            >
              <img
                src={quote.company?.image?.url}
                style={{ height: "1.5cm", maxWidth: "4.5cm", objectFit: "contain" }}
              />
              <span>
                {t("/sale/quote")} {quote.id}
              </span>
              <img
                src={`https://barcode.zensoft.com.br?bcid=qrcode&text=${quote.id}`}
                style={{ height: "1.5cm", justifySelf: "end" }}
              />
            </h1>

            <section className="parameters">
              <dl>
                <dt>{t("/catalog/company/company")}</dt>
                <dd>{quote.company?.person.name}</dd>
              </dl>
              <dl>
                <dt>
                  {t(
                    `/catalog/person/personDocumentType/enum/${quote.company?.person.documentType}`,
                  )}
                </dt>
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
                <dt>
                  {t(`/catalog/person/personDocumentType/enum/${quote.person?.documentType}`)}
                </dt>
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
                <dd>
                  <pre>{quote.saleProfile?.properties?.quote_comments}</pre>
                </dd>
              </dl>
            </section>
          </header>
          <main>
            <section>
              <div className="content">
                <Table
                  columns={columns}
                  visibleColumns={visibleColumns}
                  data={quote.items}
                  groups={groups}
                  footerTitle={t("/@word/summary")}
                />
              </div>
            </section>
          </main>
        </div>
      ))}
    </div>
  );
}
