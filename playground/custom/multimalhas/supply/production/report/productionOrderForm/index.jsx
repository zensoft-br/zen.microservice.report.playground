import React from "react";
import * as utils from "./utils.jsx";
import { Badge, Fields, Table } from "./utils.jsx";

export default function ({ data = [], meta = {}, t }) {
  const { report = {} } = meta;

  const settings =
    utils.deepMerge(report?.properties?.["#settings"], report?.properties?.userSettings) ?? {};

  const visibleFields = settings?.fields ?? [];

  const productionOrderFields = [
    {
      id: "productionOrder_code",
      label: utils.cellHeader(t("/@word/order")),
      value: (row) => row.code,
    },
    {
      id: "productionOrder_date",
      label: utils.cellHeader(t("/@word/date")),
      value: (row) => utils.formatDate(row.date),
    },
    {
      id: "productionOrder_availabilityDate",
      label: utils.cellHeader(t("/@word/availabilityDate")),
      value: (row) => utils.formatDate(row.availabilityDate),
    },
    {
      id: "productionOrder_person_name",
      flex: 4,
      label: utils.cellHeader(t("/@word/customer")),
      value: (row) => row.person.name,
    },
    {
      id: "productionOrder_person_fantasyName",
      flex: 4,
      label: utils.cellHeader(t("/@word/customer")),
      value: (row) => row.person.fantasyName,
    },
    {
      id: "productionOrder_person_nameCalc",
      flex: 4,
      label: utils.cellHeader(t("/@word/customer")),
      value: (row) => row.person.fantasyName ?? row.person.name,
    },
  ];

  const materialFields = [
    {
      id: "material_code",
      label: utils.cellHeader(t("/@word/order")),
      value: (row) => row.code,
    },
    {
      id: "material_date",
      label: utils.cellHeader(t("/@word/date")),
      value: (row) => utils.formatDate(row.date),
    },
    {
      id: "material_availabilityDate",
      label: utils.cellHeader(t("/@word/deliveryForecast")),
      value: (row) => utils.formatDate(row.availabilityDate),
    },
    {
      id: "material_person_name",
      flex: 4,
      label: utils.cellHeader(t("/@word/customer")),
      value: (row) => row.person.name,
    },
    {
      id: "material_person_fantasyName",
      flex: 4,
      label: utils.cellHeader(t("/@word/customer")),
      value: (row) => row.person.fantasyName,
    },
    {
      id: "material_person_nameCalc",
      flex: 4,
      label: utils.cellHeader(t("/@word/customer")),
      value: (row) => row.person.fantasyName ?? row.person.name,
    },
  ];

  const productionFields = [
    {
      id: "production_code",
      label: utils.cellHeader(t("/@word/order")),
      value: (row) => row.code,
    },
    {
      id: "production_date",
      label: utils.cellHeader(t("/@word/date")),
      value: (row) => utils.formatDate(row.date),
    },
    {
      id: "production_availabilityDate",
      label: utils.cellHeader(t("/@word/deliveryForecast")),
      value: (row) => utils.formatDate(row.availabilityDate),
    },
    {
      id: "production_person_name",
      flex: 4,
      label: utils.cellHeader(t("/@word/customer")),
      value: (row) => row.person.name,
    },
    {
      id: "production_person_fantasyName",
      flex: 4,
      label: utils.cellHeader(t("/@word/customer")),
      value: (row) => row.person.fantasyName,
    },
    {
      id: "production_person_nameCalc",
      flex: 4,
      label: utils.cellHeader(t("/@word/customer")),
      value: (row) => row.person.fantasyName ?? row.person.name,
    },
  ];

  const fieldGroups = [];

  const visibleColumns = settings?.columns ?? [];

  const groups = settings?.groups || [];

  const columns = [];

  data.sort((a, b) => {
    const p1 = a.steps[0]?.productions[0]?.productPacking;
    const p2 = b.steps[0]?.productions[0]?.productPacking;

    const cor1 = p1?.variant?.code ?? "";
    const cor2 = p2?.variant?.code ?? "";

    const tamanho1 = Number(p1.code.split(".")[2] ?? "0");
    const tamanho2 = Number(p2.code.split(".")[2] ?? "0");

    const k1 = cor1 + ":" + tamanho1 + ":" + p1?.product.code + ":" + a.id;
    const k2 = cor2 + ":" + tamanho2 + ":" + p2?.product.code + ":" + b.id;

    return k1.localeCompare(k2);
  });

  const totalsByProduct = data.reduce((acc, obj) => {
    obj.steps?.forEach((step) => {
      (step.consumptions ?? [])
        // Filtro solicitado pelo Leonardo, para não considerar CAIXA e FITA no consumo total
        .filter((e) => !["CAIXA", "FITA"].includes(e.productPacking.product.productProfile.code))
        .forEach((consumption) => {
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
              ]
                .filter(Boolean)
                .join(", "),
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
    <div
      className={`report-wrapper ${settings?.className ?? ""}`}
      style={{ fontSize: settings?.fontSize }}
    >
      {/* Impresso 1, Ordens de produção */}
      <div
        className={`report-productionOrder report-container flex v gap ${settings?.pageSize ?? "a4"} ${settings?.orientation}`}
        style={{
          "--width": settings?.width,
          "--height": settings?.height,
          "--margin": settings?.margin,
        }}
        key={data.id}
      >
        <header>
          <section className="title">
            <h1>{t("/supply/production/productionOrder")}</h1>
          </section>
        </header>
        <main>
          <div className="content">
            {data.map((obj) => (
              <div className="no-break">
                {obj.steps?.map((step, index) => (
                  <>
                    <section className="parameters">
                      <div className="custom-fields">
                        <Fields
                          fields={productionOrderFields}
                          visibleFields={visibleFields}
                          data={obj}
                          groups={fieldGroups}
                        />
                      </div>
                    </section>
                    <React.Fragment key={index}>
                      <div class="flex h">
                        <div class="flex v gap padding center" style={{ flex: "2" }}>
                          <div class="xxl">{obj.properties?.sale_id ?? obj.code}</div>
                          <div class="xxl">{step.productPacking.code}</div>
                          <div>
                            <span className="xxl">{step.quantity}</span>&nbsp;
                            {step.productPacking.product.unit.code}
                          </div>
                          {step.productions?.[0]?.productPacking.product.category5 && (
                            <div>
                              Medida:{" "}
                              {step.productions?.[0]?.productPacking.product.category5?.code}
                            </div>
                          )}
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
                                  <td>
                                    {[
                                      consumption.productPacking.product.description,
                                      consumption.productPacking.complement,
                                      consumption.productPacking.variant?.description,
                                    ]
                                      .filter(Boolean)
                                      .join(", ")}
                                  </td>
                                  <td className="number">
                                    <strong>{number(consumption.quantity)}</strong>&nbsp;
                                    {consumption.productPacking.product.unit.code}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </React.Fragment>
                  </>
                ))}
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Impresso 2,  */}
      <div
        className={`report-container flex v gap ${settings?.pageSize ?? "a4"} ${settings?.orientation}`}
        style={{
          "--width": settings?.width,
          "--height": settings?.height,
          "--margin": settings?.margin,
        }}
        key={data.id}
      >
        <header>
          <section className="title">
            <h1>{t("/@word/materialConsumptionPerProductionBatch")}</h1>
          </section>
          <section className={`parameters flex v gap`}>
            <Fields
              fields={materialFields}
              visibleFields={visibleFields}
              data={data[0]}
              groups={fieldGroups}
            />
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
                {Object.entries(totalsByProduct)
                  .sort(([codeA], [codeB]) => codeA.localeCompare(codeB))
                  .map(([code, total]) => (
                    <tr key={code}>
                      <td>
                        <strong>{total.code}</strong>
                      </td>
                      <td>{total.description}</td>
                      <td>{total.variant?.description}</td>
                      <td className="number">
                        <strong>{`${number(total.quantity)}`}</strong>&nbsp;{total.unit.code}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Impresso 3, Itens a produzir */}
      <div
        className={`report-container flex v gap ${settings?.pageSize ?? "a4"} ${settings?.orientation}`}
        style={{
          "--width": settings?.width,
          "--height": settings?.height,
          "--margin": settings?.margin,
        }}
        key={data.id}
      >
        <header>
          <section className="title">
            <h1>{t("/@word/materialConsumptionPerProductionBatch")}</h1>
          </section>
          <section className={`parameters flex v gap`}>
            <Fields
              fields={productionFields}
              visibleFields={visibleFields}
              data={data[0]}
              groups={fieldGroups}
            />
          </section>
        </header>
        <div
          className="grid"
          style={{
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "var(--gap)",
            fontSize: "1.25rem",
            fontWeight: "bold",
          }}
        >
          {data.map((obj) => (
            <div
              key={obj.id}
              className="card flex v align-center justify-center"
              style={{ gap: "2rem" }}
            >
              {obj.steps?.map((step, index) => (
                <React.Fragment key={index}>
                  {step.productions?.map((production, index) => (
                    <React.Fragment key={index}>
                      <div>{obj.properties.sale_id}</div>
                      <div>{production.productPacking.code}</div>
                      <div>{production.productPacking.variant?.description}</div>
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
}

function date(value) {
  return new Intl.DateTimeFormat("pt-BR").format(new Date(value));
}

function number(value) {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
