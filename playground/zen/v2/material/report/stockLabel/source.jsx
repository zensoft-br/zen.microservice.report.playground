export default function ({ properties = {}, data = [], t }) {
  return (
    <div className="report-wrapper">
      {data.map((obj, index) => (
        <div className="report-container flex">
          <main className="flex flex-1">
            <div className="content flex-1">
              <dl style={{ gridArea: "A" }}>
                <dd><img src={obj.company_logo} /></dd>
              </dl>
              <dl style={{ gridArea: "B" }}>
                <dt>{obj.company_name}</dt>
                <dd>{obj.company_documentNumber}</dd>
              </dl>
              <dl style={{ gridArea: "D" }}>
                <dt>{t("/@word/code")}</dt>
                <dd><strong>{obj.productPacking_code}</strong></dd>
              </dl>
              <dl className="flex align-center" style={{ gridArea: "C" }}>
                <dt>{t("/@word/quantity")}</dt>
                <dd style={{ fontSize: "1.8em", fontWeight: "bold" }}>{number(obj.quantity, { maximumFractionDigits: 2 })}{obj.unit_code}</dd>
                <span style={{ fontSize: "0.7em" }} >zenerp.com.br</span>
              </dl>
              <div className="flex v" style={{ gridArea: "E" }}>
                <dl style={{ flex: "1 1 auto" }} >
                  <dt>{t("/@word/description")}</dt>
                  <dd>{`${obj.product_description}${obj.productVariant_id ? `, ${obj.productVariant_description}` : ''}${obj.productPacking_complement ? `, ${obj.productPacking_complement}` : ''}`}</dd>
                </dl>
                <dl style={{ flex: "1 1 auto" }} >
                  <dt>{t("/custom/zen/textile/catalog/product/fabricComposition")}</dt>
                  <dd>{obj.product_properties?.textileComposition}</dd>
                </dl>
              </div>
              {/* {!(properties.hideColumns ?? "").split(",").includes("quality") && (
                <dl>
                  <dt>{t("/material/quality")}</dt>
                  <dd>{obj.quality_code}</dd>
                </dl>
              )} */}
              <dl style={{ gridArea: "H" }}>
                <dd><img src={`https://barcode.zensoft.com.br?bcid=qrcode&text=${obj.code}`} /></dd>
              </dl>
              <dl style={{ gridArea: "I" }}>
                <dt>{t("/material/lot")}</dt>
                <dd>{obj.lot_code}</dd>
              </dl>
              <dl style={{ gridArea: "J" }}>
                <dt>{t("/material/serial")}</dt>
                <dd>{obj.serial_code}</dd>
              </dl>
              <dl className="number" style={{ gridArea: "L" }}>
                <dt>{t("/@word/netWeightKg")}</dt>
                <dd>{number(obj.netWeightKg, { maximumFractionDigits: 3 })}</dd>
              </dl>
              <dl className="number" style={{ gridArea: "M" }}>
                <dt>{t("/@word/grossWeightKg")}</dt>
                <dd>{number(obj.grossWeightKg, { maximumFractionDigits: 3 })}</dd>
              </dl>
              <dl style={{ gridArea: "K" }}>
                <dd><img src={`https://barcode.zensoft.com.br?bcid=qrcode&text=${obj.code}`} /></dd>
              </dl>
              <div className="flex h" style={{ gridArea: "N" }}>
                {Object
                  .entries(obj.product_properties)
                  .filter(entry => entry[0].startsWith("textileCare"))
                  .map((entry, index) => (
                    <dl key={index}>
                      <dd><img src={`https://zenerp.s3.amazonaws.com/public/material/images/${entry[1]}`} /></dd>
                    </dl>
                  ))}
                <dl style={{ padding: "var(--gap)" }}>
                  <dd style={{ transform: "rotate(-90deg)" }}>{index + 1}</dd>
                </dl>
              </div>
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
