export default function ({ properties = {}, data = [], t }) {
  return (
    <div className="report-wrapper">
      {data.map((obj, index) => (
        <div className="report-container flex">
          <main className="flex flex-1">
            <div className="content flex-1">
              {/* Row 1 */}
              <div className="cell" style={{ gridArea: "A" }}>
                <img src={obj.company_logo} />
              </div>
              <div className="cell" style={{ gridArea: "B" }}>
                <dt>{obj.company_name}</dt>
                <dd>{obj.company_documentNumber}</dd>
              </div>
              <div className="cell" style={{ gridArea: "D" }}>
                <dt>{t("/@word/code")}</dt>
                <dd><strong>{obj.productPacking_code}</strong></dd>
              </div>
              <div className="cell flex align-center" style={{ gridArea: "C" }}>
                <dt>{t("/@word/quantity")}</dt>
                <dd style={{ fontSize: "1.8em", fontWeight: "bold" }}>{number(obj.quantity, { maximumFractionDigits: 2 })}{obj.unit_code}</dd>
                <span style={{ fontSize: "0.7em" }} >zenerp.com.br</span>
              </div>
              {/* Row 2 */}
              <div className="flex v" style={{ gridArea: "E" }}>
                <div className="cell" style={{ flex: "1 1 auto" }} >
                  <dt>{t("/@word/description")}</dt>
                  <dd>{`${obj.product_description}${obj.productVariant_id ? `, ${obj.productVariant_description}` : ''}${obj.productPacking_complement ? `, ${obj.productPacking_complement}` : ''}`}</dd>
                </div>
                <div className="cell" style={{ flex: "1 1 auto" }} >
                  <dt>{t("/custom/zen/textile/catalog/product/fabricComposition")}</dt>
                  <dd>{obj.product_properties?.textileComposition}</dd>
                </div>
              </div>
              {/* Row 5 */}
              {/* {!(properties.hideColumns ?? "").split(",").includes("quality") && (
                <div className="cell">
                  <dt>{t("/material/quality")}</dt>
                  <dd>{obj.quality_code}</dd>
                </div>
              )} */}
              <div className="cell" style={{ gridArea: "H" }}>
                <img src={`https://barcode.zensoft.com.br?bcid=qrcode&text=${obj.code}`} />
              </div>
              <div className="cell" style={{ gridArea: "I" }}>
                <dt>{t("/material/lot")}</dt>
                <dd>{obj.lot_code}</dd>
              </div>
              <div className="cell" style={{ gridArea: "J" }}>
                <dt>{t("/material/serial")}</dt>
                <dd>{obj.serial_code}</dd>
              </div>
              <div className="cell number" style={{ gridArea: "L" }}>
                <dt>{t("/@word/netWeightKg")}</dt>
                <dd>{number(obj.netWeightKg, { maximumFractionDigits: 3 })}</dd>
              </div>
              <div className="cell number" style={{ gridArea: "M" }}>
                <dt>{t("/@word/grossWeightKg")}</dt>
                <dd>{number(obj.grossWeightKg, { maximumFractionDigits: 3 })}</dd>
              </div>
              <div className="cell" style={{ gridArea: "K" }}>
                <img src={`https://barcode.zensoft.com.br?bcid=qrcode&text=${obj.code}`} />
              </div>
              {/* Row 6 */}
              <div className="flex h" style={{ gridArea: "N" }}>
                {Object
                  .entries(obj.product_properties)
                  .filter(entry => entry[0].startsWith("textileCare"))
                  .map((entry, index) => (
                    <div key={index} className="cell">
                      <img src={`https://zenerp.s3.amazonaws.com/public/material/images/${entry[1]}`} />
                    </div>
                  ))}
                <div className="cell align-center number" style={{ paddingRight: "0.5rem" }}>
                  <div>{index + 1}</div>
                </div>
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
