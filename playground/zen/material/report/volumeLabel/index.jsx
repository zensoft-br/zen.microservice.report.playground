import * as utils from "./utils.jsx";

export default function ({data = [], meta = {}, t}) {
  const { report } = meta;
  
  data = calculateVolumeMetrics(data);

  return (
    <div className="report-wrapper" style={{ fontSize: report?.properties?.["fontSize"] }}>
      {data.map((obj) => (
        <div className="report-container flex v">
          <main className="flex v flex-1">
            <div className="content flex v flex-1">
              <div className="flex h" style={{ flex: "2 0 0", display: "grid", gridTemplateColumns: "2fr 1fr 2fr 2fr" }}>
                <dl>
                  <img style={{ objectFit: "contain" }} src={obj.company_logo_url} />
                </dl>
                <dl>
                  <img style={{ objectFit: "contain" }} src={`https://barcode.zensoft.com.br?bcid=qrcode&text=${obj.code}`}></img>
                </dl>
                <dl className="flex v" style={{ alignItems: "center", justifyContent: "center" }}>
                  <dt>{t("/sale/sale")}</dt>
                  <dd style={{ fontSize: "1.8em"}}><strong >{obj.sale_id ? obj.sale_id : "\u00A0"}</strong></dd>
                </dl>
                <dl className="flex v" style={{ alignItems: "center", justifyContent: "center" }}>
                  <dt>{t("/fiscal/invoice")}</dt>
                  <dd style={{ fontSize: "1.8em"}}><strong>{obj.invoice_number ? utils.formatNumber(obj.invoice_number) : "\u00A0"}</strong></dd>
                </dl>
                {/* <dl className="flex h align-center justify-center letter" style={{ flex: "1 0 0" }}>
                  {getSequence(obj.person_id)}
                </dl> */}
              </div>
              <dl style={{ flex: "1.5 0 0" }}>
                <dt>{t("/@word/recipient")}</dt>
                <dd>{obj.person_fantasyName ?? obj.person_name}</dd>
                <dd>{`${obj.person_address_city}, ${obj.person_address_state_code}`}</dd>
              </dl>
              <div style={{ flex: "1 0 0", display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
                <dl style={{ flex: "1 0 0" }}>
                  <dt>{t("/shipping/shipment")}</dt>
                  <dd>{obj.shipment_id ?? "\u00A0"}</dd>
                </dl>
                <dl style={{ flex: "1 0 0" }}>
                  <dt>{t("/material/volume")}</dt>
                  <dd>{obj.code}</dd>
                </dl>
                <dl style={{ flex: "1 0 0" }}>
                  <dt>{t("/material/volume.sequence")}</dt>
                  <dd>{obj.vol_x} de {obj.vol_y}</dd>
                </dl>
              </div>
              <div style={{ flex: "1 0 0", display: "grid", gridTemplateColumns: "3fr 1fr" }}>
                <dl style={{ flex: "3 0 0" }}>
                  <dt>{t("/@word/personShipping")}</dt>
                  <dd>{obj.personShipping_name}</dd>
                </dl>
                <dl style={{ flex: "1 0 0" }}>
                  <dt className="number">{t("/@word/grossWeightKg")}</dt>
                  <dd className="number">{obj.grossWeightKg ? utils.formatNumber(obj.grossWeightKg) : "\u00A0"}</dd>
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

const sequenceMap = new Map();
let sequence = 1;

function getSequence(key) {
  if (!sequenceMap.has(key)) {
    sequenceMap.set(key, sequence++);
  }
  return numberToLetters(sequenceMap.get(key));
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