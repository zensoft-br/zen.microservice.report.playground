import * as utils from "./utils.js";

export default function ({data = [], t}) {
  data = calculateVolumeMetrics(data);

  return (
    <div className="report-wrapper">
      {data.map((obj) => (
        <div className="report-container flex v">
          <main className="flex flex-1">
            <div className="content flex v flex-1">
              <div className="flex h" style={{ flex: "2 0 0", display: "grid", gridTemplateColumns: "2fr 1fr 2fr 1fr" }}>
                <dl style={{ flex: "2 0 0" }}>
                  <img style={{ objectFit: "contain" }} src={obj.company_logo_url} />
                </dl>
                <dl style={{ flex: "1 0 0" }}>
                  <img style={{ objectFit: "contain" }} src={`https://barcode.zensoft.com.br?bcid=qrcode&text=${obj.code}`}></img>
                </dl>
                <dl className="flex v" style={{ flex: "2 0 0", alignItems: "center", justifyContent: "center" }}>
                  <dt>{t("/fiscal/invoice")}</dt>
                  <dd><strong style={{ fontSize: "1.3rem" }}>{number(obj.invoice_number)}</strong></dd>
                </dl>
                <dl className="flex h align-center justify-center letter" style={{ flex: "1 0 0" }}>
                  {fn(obj.person_id)}
                </dl>
              </div>
              <dl style={{ flex: "1.5 0 0" }}>
                <dt>{t("/@word/recipient")}</dt>
                <dd><strong>{obj.person_fantasyName ?? obj.person_name}</strong></dd>
                <dd><strong>{`${obj.person_address_city}, ${obj.person_address_state_code}`}</strong></dd>
              </dl>
              <div style={{ flex: "1 0 0", display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
                <dl style={{ flex: "1 0 0" }}>
                  <dt>{t("/sale/sale")}</dt>
                  <dd>{obj.sale_code ?? obj.sale_id}</dd>
                </dl>
                <dl style={{ flex: "1 0 0" }}>
                  <dt>{t("/shipping/shipment")}</dt>
                  <dd>{obj.shipment_id})</dd>
                </dl>
                <dl style={{ flex: "1 0 0" }}>
                  <dt>{t("/material/volume")}</dt>
                  <dd>{obj.code}</dd>
                </dl>
                <dl style={{ flex: "1 0 0" }}>
                  <dt>{t("/@word/number")}</dt>
                  <dd>{obj.vol_x} de {obj.vol_y}</dd>
                </dl>
              </div>
              <div className="flex h" style={{ flex: "1 0 0", display: "grid", gridTemplateColumns: "3fr 1fr" }}>
                <dl style={{ flex: "3 0 0" }}>
                  <dt>{t("/@word/personShipping")}</dt>
                  <dd>&nbsp;</dd>
                </dl>
                <dl style={{ flex: "1 0 0" }}>
                  <dt className="number">{t("/@word/grossWeightKg")}</dt>
                  <dd className="number">{utils.formatNumber(obj.grossWeightKg)}</dd>
                </dl>
              </div>
            </div>
          </main>
          <div className="zen-ad" style={{ fontSize: "0.5em", textAlign: "right" }}>zenerp.com.br</div>
        </div>
      ))}
    </div>
  );
};

function number(value, options = {}) {
  return new Intl.NumberFormat("pt-BR", options).format(value);
}

function numberToLetters(num) {
  let letters = "";
  while (num > 0) {
    let remainder = (num - 1) % 26;
    letters = String.fromCharCode(65 + remainder) + letters;
    num = Math.floor((num - remainder - 1) / 26);
  }
  return letters;
}

const keyMap = new Map();
let counter = 1;

function fn(key) {
  if (!keyMap.has(key)) {
    keyMap.set(key, counter++);
  }
  return numberToLetters(keyMap.get(key));
}

/**
 * Processes label data to inject volume sequence information.
 * @param {Array} data - The array of volume objects from your sample.
 * @returns {Array} - Data with 'x', 'y', and 'z' values added.
 */
function calculateVolumeMetrics(data) {
  const z = data.length;
  
  const volumesPerInvoice = data.reduce((acc, item) => {
    acc[item.invoice_id] = (acc[item.invoice_id] || 0) + 1;
    return acc;
  }, {});

  const runningCounter = {};

  return data.map((item) => {
    const invId = item.invoice_id;
    
    runningCounter[invId] = (runningCounter[invId] || 0) + 1;

    return {
      ...item,
      vol_x: runningCounter[invId],        // x: sequence in invoice
      vol_y: volumesPerInvoice[invId],    // y: total in invoice
      vol_z: z,                           // z: total in print job
    };
  });
}