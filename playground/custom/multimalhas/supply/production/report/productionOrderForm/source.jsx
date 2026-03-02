import React from "react";

export default function ({ data = [] }) {
  data.sort((a, b) => {
    const p1 = a.steps[0]?.productions[0]?.productPacking;
    const p2 = b.steps[0]?.productions[0]?.productPacking;

    const k1 = p1?.product.code + ":" + (p1?.variant?.code ?? "") + ":" + p1?.code + ":" + a.id;
    const k2 = p2?.product.code + ":" + (p2?.variant?.code ?? "") + ":" + p2?.code + ":" + b.id;

    return k1.localeCompare(k2);
  });

  const totalsByProduct = data.reduce((acc, obj) => {
    obj.steps?.forEach((step) => {
      step.consumptions?.forEach((consumption) => {
        let variant;
        if (consumption.productPacking.product.productProfile.code === "ESPUMA") {
          variant = step.productions[0]?.productPacking.variant;
        }

        const key = consumption.productPacking.code + (variant ? `-${variant.id}` : "");
        const qty = consumption.quantity || 0;

        // 3. Accumulate sum grouped by code
        if (!acc[key]) {
          acc[key] = {
            code: consumption.productPacking.code,
            variant,
            description: [
              consumption.productPacking.product.description,
              consumption.productPacking.complement,
              consumption.productPacking.variant?.description,
            ].filter(Boolean).join(", "),
            unit: consumption.productPacking.product.unit,
            quantity: 0,
          };
        }
        acc[key].quantity += qty;
      });
    });
    return acc;
  }, {});

  return (
    <div className="report-wrapper">
      {/* Impresso 1, Ordens de produção */}
      <div className="report-container">
        <header>
          <h1>Ordens de Produção</h1>
        </header>
        <main>
          <div className="content">
            {data.map((obj) => (
              <div className="no-break">
                <div class="flex h full gap padding panel">
                  <div>
                    <strong>Ordem de produção</strong><br />
                    {obj.id}
                  </div>
                  <div>
                    <strong>Cliente</strong><br />
                    {obj.person.name}
                  </div>
                  <div>
                    <strong>Data pedido</strong><br />
                    {obj.date ? date(obj.date) : "-"}
                  </div>
                  <div>
                    <strong>Data entrega</strong><br />
                    {obj.availabilityDate ? date(obj.availabilityDate) : "-"}
                  </div>
                  <div>
                    <strong>Data cliente</strong><br />
                    {obj.availabilityDate ? date(obj.availabilityDate) : "-"}
                  </div>
                  <div>
                    <strong>Pedidos</strong><br />
                    {obj.code}
                  </div>
                </div>
                {obj.steps?.map((step, index) => (
                  <React.Fragment key={index}>
                    <div class="flex h">
                      <div class="flex v gap padding center" style={{ flex: "2" }}>
                        <div class="xxl">{obj.properties?.sale_id ?? obj.code}</div>
                        <div class="xxl">{step.productPacking.code}</div>
                        <div><span className="xxl">{step.quantity}</span>&nbsp;{step.productPacking.product.unit.code}</div>
                      </div>

                      <div class="flex v gap padding flex-1" style={{ flex: "3" }}>
                        <table>
                          <thead>
                            <tr>
                              {/* <th>Código do Produto</th> */}
                              <th>Previsão de consumo</th>
                              <th class="number">Quantidade</th>
                            </tr>
                          </thead>
                          <tbody>
                            {step.consumptions?.map((consumption, index) => (
                              <tr key={index}>
                                {/* <td>{consumption.productPacking.code}</td> */}
                                <td>{[
                                  consumption.productPacking.product.description,
                                  consumption.productPacking.complement,
                                  consumption.productPacking.variant?.description,
                                ].filter(Boolean).join(", ")}</td>
                                <td className="number">
                                  {number(consumption.quantity)}&nbsp;{consumption.productPacking.product.unit.code}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Impresso 2,  */}
      <div className="report-container">
        <header>
          <h1>Consumo de materiais por lote de produção</h1>
          <section className="parameters">
            <dl>
              <dt>Cliente</dt>
              <dd>{data[0].person?.name}</dd>
            </dl>
            <dl>
              <dt>Previsão de entrega</dt>
              <dd>{date(data[0].availabilityDate)}</dd>
            </dl>
            <dl>
              <dt>Pedido</dt>
              <dd>{data[0].properties?.sale_id}</dd>
            </dl>
          </section>
        </header>
        <main>
          <div className="content">
            <table style={{ width: "100%" }}>
              <thead>
                <th>Código</th>
                <th>Descrição</th>
                <th>Variante</th>
                <th className="number">Quantidade</th>
              </thead>
              <tbody>
                {Object
                  .entries(totalsByProduct)
                  .sort(([codeA], [codeB]) => codeA.localeCompare(codeB))
                  .map(([code, total]) => (
                    <tr key={code}>
                      <td>{total.code}</td>
                      <td>{total.description}</td>
                      <td>{total.variant?.description}</td>
                      <td className="number">{`${number(total.quantity)} ${total.unit.code}`}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Impresso 3, Itens a produzir */}
      <div className="report-container">
        <header>
          <h1>Itens a produzir</h1>
        </header>
        <div className="grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--gap)" }}>
          {data.map((obj) => (
            <div key={obj.id} className="card flex v align-center justify-center">
              {obj.steps?.map((step, index) => (
                <React.Fragment key={index}>
                  {step.productions?.map((production, index) => (
                    <React.Fragment key={index}>
                      <p>{obj.properties.sale_id}</p>
                      <p key={index}>{production.productPacking.code}</p>
                      <p key={index}>{production.productPacking.variant?.description}</p>
                    </React.Fragment>
                  ))}
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

function date(value) {
  return new Intl.DateTimeFormat("pt-BR").format(new Date(value));
}

function number(value) {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
