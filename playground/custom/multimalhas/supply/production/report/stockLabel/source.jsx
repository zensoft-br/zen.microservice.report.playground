export default function ({ data = [], t }) {
  const totalQuantity = data
    .flatMap((obj) => obj.steps)
    .flatMap((step) => step.consumptions.filter((consumption) => consumption.productPacking.product.productProfile?.code === "CAIXA"))
    .map((consumption) => consumption.quantity)
    .reduce((acc, quantity) => acc + quantity, 0);

  return (
    <div className="report-wrapper">
      {data.map((obj, index) => {
        return (
          obj.steps[0].consumptions
            .filter((consumption) => consumption.productPacking.product.productProfile?.code === "CAIXA")
            .map((consumption) => (
              new Array(consumption.quantity).fill(null).map((_, index) => (
                <div className="report-container">
                  <main className="flex v">
                    <div className="content flex-1">
                      <dl style={{ gridArea: "A" }}>
                        <dd><img src={obj.company.image.url} /></dd>
                      </dl>
                      <dl style={{ gridArea: "B" }}>
                        <dt>Pedido</dt>
                        <dd>{obj.code}</dd>
                      </dl>
                      <dl className="flex align-center" style={{ gridArea: "C", justifyContent: "center" }}>
                        <dt>{t("/@word/quantity")}</dt>
                        <dd style={{ fontSize: "1.8em", fontWeight: "bold" }}>
                          {number(obj.steps[0]?.productions[0]?.quantity / consumption.quantity, { maximumFractionDigits: 2 })}
                        </dd>
                        <dd>de</dd>
                        <dd style={{ fontSize: "1.8em", fontWeight: "bold" }}>{number(obj.steps[0]?.productions[0]?.quantity, { maximumFractionDigits: 2 })}</dd>
                      </dl>
                      <dl style={{ gridArea: "D" }}>
                        <dt>Cliente</dt>
                        <dd>{obj.person?.name}</dd>
                      </dl>
                      <dl  style={{ gridArea: "E" }}>
                        <dt>Produto</dt>
                        <dd><strong>{obj.steps[0]?.productions[0]?.productPacking?.code}</strong></dd>
                      </dl>
                      <dl style={{ gridArea: "F" }}>
                        <dt>Cor</dt>
                        <dd>{obj.steps[0]?.productions[0]?.productPacking?.variant?.description}</dd>
                      </dl>
                      <dl style={{ gridArea: "G" }}>
                        <dt>Tamanho</dt>
                        <dd>{obj.steps[0]?.productions[0]?.productPacking?.code.split(".")[2]}</dd>
                      </dl>
                    </div>
                    <div className="flex h" style={{ fontSize: "0.8em", justifyContent: "space-around" }}>
                      <div>{index + 1} de {consumption.quantity} de {totalQuantity}</div>
                      <div>zenerp.com.br</div>
                    </div>
                  </main>
                </div>
              ))
            ))
        );
      })}
    </div>
  );
};

function number(value, options = {}) {
  return new Intl.NumberFormat("pt-BR", options).format(value);
}
