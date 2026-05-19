import * as utils from "./utils.jsx";
import { Badge, Column, GroupSections, Table } from "./utils.jsx";

export default function ({ data = [], meta = {}, t }) {

  const columns = [
    { id: "id",
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
      header: utils.cellHeader(t("/@word/description")),
      cellValue: ({ row }) => row.productPacking?.product?.description,
    },
  ];

  const visibleColumns = columns.map(column => column.id);
  
  return (
    <div className="report-wrapper">
      {data.map((quote) => (
        <div className="report-container">
          <header>
            <div className="brand">
              <img src={quote.company?.image.url} style={{ width: "3cm" }}></img>
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
                <dd><pre>{[
                  quote.saleProfile?.properties?.quote_comments,
                  quote.person.properties?.freightType ? (
                    quote.person.properties?.freightType === "ISSUER" ? "Contratação de frete por conta do remetente (CIF)" : "Contratação de frete por conta do destinatário (FOB)"
                  ) : null,
                  // quote.person.properties?.paymentMethods ? `Prazo de pagamento: ${quote.person.properties.paymentMethods}` : null,
                ].filter(Boolean).join("\n")}</pre></dd>
              </dl>
            </section>
          </header>
          <main>
            <section>
              <div className="content">
                <table>
                  <thead>
                    <tr>
                      <th>{t("/@word/item")}</th>
                      <th>{t("/@word/code")}</th>
                      <th>{t("/@word/description")}</th>
                      <th>{t("/catalog/product.properties.fiscal_br_NCM")}</th>
                      <th className="number">{t("/@word/quantity")}</th>
                      <th className="number">{t("/@word/unitValue")}</th>
                      <th className="number">{t("/@word/totalValue")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      quote.items?.map((item, index1) => (
                        (item.proposals.length ? item.proposals : [{}]).map((proposal, index2) => (
                          <tr key={item.id} style={{ fontStyle: index2 > 0 ? "italic" : undefined, opacity: index2 > 0 ? "0.5" : undefined }}>
                            <td>{index2 === 0 ? index1 + 1 : undefined}</td>
                            <td>{index2 === 0 ? item.productPacking?.code : undefined}</td>
                            <td>{index2 === 0 ? (item.referenceCode ?? item.productPacking?.product.description) : undefined}</td>
                            <td>{index2 === 0 ? item.productPacking?.product.properties?.fiscal_br_NCM : undefined}</td>
                            <td className="number">{utils.formatNumber(proposal.quantity)}</td>
                            <td className="number">{utils.formatCurrency(proposal.unitValue, { minimumFractionDigits: 2 })}</td>
                            <td className="number">{utils.formatCurrency(proposal.totalValue, { minimumFractionDigits: 2 })}</td>
                          </tr>
                        ))
                      ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <th colSpan={5} className="number">{utils.formatNumber(quote.items?.reduce((acc, item) => acc + (item.proposals[0]?.quantity ?? item.quantity), 0), { digits: 0 })}</th>
                      <th colSpan={2} className="number">{utils.formatCurrency(quote.items?.reduce((acc, item) => acc + (item.proposals[0]?.totalValue ?? 0), 0))}</th>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </section>
          </main>
        </div>
      ))}
    </div>
  );
};
