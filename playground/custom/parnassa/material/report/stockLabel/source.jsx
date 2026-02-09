export default function ({ properties = {}, data = [], t }) {
  return (
    <div className="report-wrapper">
      {data.map((obj, index) => (
        <div className="report-container flex">
          <main className="flex flex-1">
            <div className="content flex-1">
              <div className="flex v" style={{ gridArea: "A" }}>
                <div className="cell">
                  <dt>Referência</dt>
                  <dd><strong>{obj.productPacking_code}</strong></dd>
                </div>
                <div className="cell">
                  <dt>{t("/@word/description")}</dt>
                  <dd>{`${obj.product_description}${obj.productVariant_id ? `, ${obj.productVariant_description}` : ''}${obj.productPacking_complement ? `, ${obj.productPacking_complement}` : ''}`}</dd>
                </div>
              </div>
              <div className="flex h" style={{ gridArea: "C" }}>
                <div className="cell" style={{ gridArea: "C" }}>
                  <dt>{t("/@word/quantity")}</dt>
                  <dd>{number(obj.quantity, { maximumFractionDigits: 2 })}{obj.unit_code}</dd>
                </div>
                <div className="cell">
                  <dt>Identificação</dt>
                  <dd>{obj.serial_code}</dd>
                </div>
                <div className="cell">
                  <dt>Sequencial</dt>
                  <dd>{index + 1}</dd>
                </div>
              </div>
              {/* Row 5 */}
              <div className="cell" style={{ gridArea: "D" }}>
                <img src={`https://barcode.zensoft.com.br?bcid=qrcode&text=${obj.code}`} alt="" style={{ maxWidth: "100%", maxHeight: "100%" }} />
              </div>
              <div className="cell" style={{ gridArea: "E" }}>
                <dt>Lote</dt>
                <dd>{obj.lot_code}</dd>
              </div>
              <div className="cell" style={{ gridArea: "F" }}>
                <dt></dt>
                <dd>{obj.serial_properties?.lote}</dd>
              </div>
              <div className="cell" style={{ gridArea: "H" }}>
                <dt>Data</dt>
                <dd>{new Date().toISOString().split('T')[0]}</dd>
              </div>
              <div className="cell" style={{ gridArea: "I" }}>
                <dt></dt>
                <dd>{obj.serial_properties?.observacao}</dd>
              </div>
              <div className="cell" style={{ gridArea: "G" }}>
                <img src={`https://barcode.zensoft.com.br?bcid=qrcode&text=${obj.code}`} alt="" style={{ maxWidth: "100%", maxHeight: "100%" }} />
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

function text(value) {
  return <strong>{value?.toUpperCase()}</strong>;
}