// import * as utils from "./utils.jsx";

export default function ({ data = [], t }) {
  return (
    <div className="report-wrapper">
      {data.map((obj, index) => (
        <div className="report-container">
          <main className="flex v">
            <div className="content flex h flex-1">
              <div className="flex v" style={{ flex: "3" }}>
                <dl className="flex-1">
                  <dt>{t("/@word/code")}</dt>
                  <dd>{obj.code}</dd>
                </dl>
                <dl className="flex-1">
                  <dt>{t("/@word/description")}</dt>
                  <dd>{obj.product.description}</dd>
                </dl>
                <div className="flex h flex-1">
                  <dl style={{ flex: "1 0 0" }}>
                    <dt>{t("/catalog/product/productVariant")}</dt>
                    <dd>{obj.variant?.description ?? obj.variant?.code ?? "\u00A0"}</dd>
                  </dl>
                  <dl style={{ flex: "1 0 0" }}>
                    <dt>{t("/@word/complement")}</dt>
                    <dd>{obj.complement ?? "\u00A0"}</dd>
                  </dl>
                </div>
                <div className="flex h flex-1">
                  <dl style={{ flex: "1 0 0" }}>
                    <dt>{t("/catalog/product/unit")}</dt>
                    <dd>{obj.product.unit.code}</dd>
                  </dl>
                  <dl style={{ flex: "1 0 0" }}>
                    <dt>{t("/catalog/product/productPacking.units")}</dt>
                    <dd>{obj.units}</dd>
                  </dl>
                </div>
              </div>
              <div className="flex v" style={{ flex: "1" }}>
                <dl style={{ gridArea: "H" }}>
                  <dd><img src={`https://barcode.zensoft.com.br?bcid=qrcode&text=${obj.barcode ?? obj.code}`} /></dd>
                </dl>
              </div>
            </div>
            <div className="flex h" style={{ fontSize: "0.8em", justifyContent: "space-around" }}>
              <div>zenerp.com.br</div>
            </div>
          </main>
        </div>
      ))}
    </div>
  );
};

function number(value, options = {}) {
  return new Intl.NumberFormat("pt-BR", options).format(value);
}
