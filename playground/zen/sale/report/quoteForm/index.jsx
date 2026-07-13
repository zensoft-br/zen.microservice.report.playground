import * as utils from "./utils.jsx";

export default function ({ data = [], meta = {}, t }) {
  data.forEach(quote => {
    quote.items.sort((a, b) => {
      if (a.itemSequence !== b.itemSequence) return a.itemSequence - b.itemSequence;
      return a.proposalSequence - b.proposalSequence;
    });
  });

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
    <div className="report-wrapper" style={{ fontSize: report.properties?.fontSize }}>
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
                <table>
                  <thead>
                    <tr>
                      <th className="number">{t("/sale/quoteItem.itemSequence")}</th>
                      <th className="number">{t("/sale/quoteItem.proposalSequence")}</th>
                      <th>{t("/@word/code")}</th>
                      <th>{t("/@word/description")}</th>
                      <th className="number">{t("/@word/quantity")}</th>
                      <th>{t("/financial/currency")}</th>
                      <th className="number">{t("/@word/unitValue")}</th>
                      <th className="number">{t("/@word/totalValue")}</th>
                      <th>{t("/@word/availabilityDate")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      quote.items?.map((item) => (
                        <tr key={item.id} style={{ fontStyle: item.proposalSequence > 1 ? "italic" : undefined, opacity: item.proposalSequence > 1 ? "0.5" : undefined }}>
                          <td>{item.itemSequence}</td>
                          <td className="number">{item.proposalSequence}</td>
                          <td>{item.code ?? item.productPacking?.code}</td>
                          <td>{item.properties?.description ?? item.productPacking?.product.description}</td>
                          <td className="number">{utils.formatNumber(item.quantity)}</td>
                          <td>{item.currency?.code}</td>
                          <td className="number">{utils.formatNumber(item.unitValue, { minimumFractionDigits: 2 })}</td>
                          <td className="number">{utils.formatNumber(item.totalValue, { minimumFractionDigits: 2 })}</td>
                          <td>{utils.formatDate(quote.availabilityDate)}</td>
                        </tr>
                      ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <th colSpan={5} className="number">{utils.formatNumber(quote.items?.filter(item => item.proposalSequence === 1).reduce((acc, item) => acc + item.quantity, 0))}</th>
                      <th colSpan={3} className="number">{utils.formatNumber(quote.items?.filter(item => item.proposalSequence === 1).reduce((acc, item) => acc + item.totalValue, 0), { minimumFractionDigits: 2 })}</th>
                      <th></th>
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
