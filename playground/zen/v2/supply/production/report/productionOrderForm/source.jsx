export default function ({ data = [], t }) {
  return (
    <div className="report-wrapper">
      {data.map((obj) => (
        <div className="report-container">
          <header>
            <h1 className="flex h gap align-center" style={{ justifyContent: "space-between" }}>
              <img src={obj.company?.image?.url} style={{ width: "3cm" }} />
              <span>{t("/supply/production/productionOrder")} {obj.id}</span>
              <img src={`https://barcode.zensoft.com.br?bcid=qrcode&text=${obj.id}`} style={{ width: "2cm" }} />
            </h1>
            {!obj.company?.image && (
              <dl>
                <div>
                  <dt>{t("/catalog/company/company")}</dt>
                  <dd>{obj.company.person.name}</dd>
                </div>
                <div>
                  <dt>{t("/catalog/person/personDocumentType/enum/BR_CNPJ")}</dt>
                  <dd>{obj.company.person.documentNumber}</dd>
                </div>
              </dl>
            )}
            {obj.person && (
              <dl>
                <div>
                  <dt>{t("/catalog/person/person")}</dt>
                  <dd>{obj.person?.name}</dd>
                </div>
                <div>
                  <dt>{t("/catalog/person/personDocumentType/enum/BR_CNPJ")}</dt>
                  <dd>{obj.person?.documentNumber}</dd>
                </div>
              </dl>
            )}
            <dl>
              <div>
                <dt>{t("/@word/date")}</dt>
                <dd>{obj.date}</dd>
              </div>
              <div>
                <dt>{t("/@word/status")}</dt>
                <dd>{t(`/supply/production/productionOrderStatus/enum/${obj.status}`)}</dd>
              </div>
              <div>
                <dt>{t("/@word/tags")}</dt>
                <dd>{obj.tags}</dd>
              </div>
            </dl>
            {obj.properties.comments && (
              <dl>
                <div>
                  <dt>{t("/@word/comments")}</dt>
                  <pre>{obj.properties.comments}</pre>
                </div>
              </dl>
            )}
          </header>
          <main>
            {obj.steps.map((step) => (
              <section>
                <header>{t("/supply/production/productionStep")} {step.id}</header>
                <div className="content">
                  <section>
                    <header>{t("/supply/production/productionStepProduction")}</header>
                    <table>
                      <thead>
                        <tr>
                          <th style={{ width: "10rem" }}>{t("/@word/code")}</th>
                          <th style={{ width: "30rem" }}>{t("/@word/description")}</th>
                          <th style={{ width: "15rem" }}>{t("/@word/complement")}</th>
                          <th style={{ width: "15rem" }}>{t("/catalog/product/productVariant")}</th>
                          <th className="number" style={{ width: "7rem" }}>{t("/@word/quantity")}</th>
                          <th className="number" style={{ width: "10rem" }}>{t("/@word/quantity/produced")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {step.productions.map((production) => (
                          <tr>
                            <td>{production.productPacking.code}</td>
                            <td>{production.productPacking.product.description}</td>
                            <td>{production.productPacking.complement}</td>
                            <td>{production.productPacking.variant && `${production.productPacking.variant?.code}, ${production.productPacking.variant?.description}`}</td>
                            <td className="number">{production.quantity}&nbsp;{production.productPacking.product.unit.code}</td>
                            <td className="number"><div className="write-spot">&nbsp;</div></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </section>
                  <section>
                    <header>{t("/supply/production/productionStepConsumption")}</header>
                    <table>
                      <thead>
                        <tr>
                          <th style={{ width: "10rem" }}>{t("/@word/code")}</th>
                          <th style={{ width: "30rem" }}>{t("/@word/description")}</th>
                          <th style={{ width: "15rem" }}>{t("/@word/complement")}</th>
                          <th style={{ width: "15rem" }}>{t("/catalog/product/productVariant")}</th>
                          <th className="number" style={{ width: "7rem" }}>{t("/@word/quantity")}</th>
                          <th className="number" style={{ width: "10rem" }}>{t("/@word/quantity/consumed")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {step.consumptions.map((consumption) => (
                          <tr>
                            <td>{consumption.productPacking.code}</td>
                            <td>{consumption.productPacking.product.description}</td>
                            <td>{consumption.productPacking.complement}</td>
                            <td>{consumption.productPacking.variant && `${consumption.productPacking.variant?.code}, ${consumption.productPacking.variant?.description}`}</td>
                            <td className="number">{consumption.quantity}&nbsp;{consumption.productPacking.product.unit.code}</td>
                            <td className="number"><div className="write-spot">&nbsp;</div></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </section>
                </div>
              </section>
            ))}
          </main>
          <footer>
            <h3>{t("/@word/signature/plural")}</h3>
            <dl>
              <div>
                <dt>{t("/@word/function/responsible")}</dt>
                <dd>&nbsp;</dd>
              </div>
              <div>
                <dt>{t("/@word/function/operator")}</dt>
                <dd>&nbsp;</dd>
              </div>
            </dl>
          </footer>
        </div>
      ))}
    </div>
  );
}