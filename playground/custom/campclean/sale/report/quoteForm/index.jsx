import * as utils from "./utils.jsx";
import { Table } from "./utils.jsx";

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
      id: "id",
      header: utils.cellHeader(t("/@word/id")),
      width: "7ch",
      className: "id",
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({ data }) => data.length,
      footer: ({ value }) => utils.formatNumber(value),
    },
    {
      id: "productPacking_code",
      header: utils.cellHeader(t("/@word/code")),
      cellValue: ({ row }) => row.productPacking?.code,
    },
    {
      id: "product_description",
      width: "30ch",
      header: utils.cellHeader(t("/@word/description")),
      cellValue: ({ row }) => row.productPacking?.product?.description,
    },
    {
      id: "fiscal_br_NCM",
      header: utils.cellHeader(t("/catalog/product.properties.fiscal_br_NCM")),
      cellValue: ({ row }) => row.productPacking?.product?.properties?.fiscal_br_NCM,
    },
    {
      id: "tax_ICMS_taxRate",
      header: utils.cellHeader("ICMS %"),
      className: "number",
      cellValue: ({ row }) => row.taxationRule?.properties?.["tax.ICMS.taxRate"],
      footerValue: ({ data }) =>
        utils.sum(data, (row) => row.taxationRule?.properties?.tax?.ICMS?.taxRate),
      footer: ({ value }) => utils.formatNumber(value, { minimumFractionDigits: 2 }),
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
          data,
          (item) => item.productPacking.unit?.code ?? item.productPacking.product.unit.code,
          (item) => item.quantity,
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
      id: "totalValue",
      className: "number",
      header: utils.cellHeader(t("/@word/totalValue")),
      cell: ({ row, value }) => utils.formatCurrency(value, { currency: row.currency?.code }),
      footerValue: ({ data }) =>
        utils.sumBy(
          data,
          (item) => item.currency?.code,
          (item) => item.totalValue,
        ),
      footer: ({ value }) =>
        utils.renderAggr(value, (value, key) => utils.formatCurrency(value, { currency: key })),
    },
  ];

  const visibleColumns = settings?.columns ?? [];

  const groups = settings?.groups || [];

  return (
    <div className="report-wrapper" style={{ fontSize: settings?.fontSize }}>
      {data.map((quote) => (
        <div className={`report-container ${settings?.pageSize ?? "a4"} ${settings?.orientation}`}>
          <header>
            <div className="brand">
              <img src={quote.company?.image?.url} style={{ width: "3cm" }}></img>
            </div>
            <h1 className="flex h gap align-center" style={{ justifyContent: "space-between" }}>
              {t("/sale/quote")} {quote.id}
              <img
                src={`https://barcode.zensoft.com.br?bcid=qrcode&text=${quote.id}`}
                style={{ width: "1.5cm" }}
              ></img>
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
              <dl>
                <dt>{t("/@word/paymentMethods")}</dt>
                <dd>{quote.person?.properties.paymentMethods}</dd>
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
                <dt>{t("/@word/email")}</dt>
                <dd>{quote.personSalesperson?.email}</dd>
              </dl>
            </section>
            <section className="parameters">
              <dl>
                <dt>{t("/@word/comments")}</dt>
                <dd>
                  <pre>
                    {[
                      quote.properties?.comments ? `${quote.properties?.comments}\n` : undefined,
                      quote.saleProfile?.properties?.quote_comments,
                      quote.person.properties?.freightType
                        ? quote.person.properties?.freightType === "ISSUER"
                          ? "Contratação de frete por conta do remetente (CIF)"
                          : "Contratação de frete por conta do destinatário (FOB)"
                        : null,
                      // quote.person.properties?.paymentMethods ? `Prazo de pagamento: ${quote.person.properties.paymentMethods}` : null,
                    ]
                      .filter(Boolean)
                      .join("\n")}
                  </pre>
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
