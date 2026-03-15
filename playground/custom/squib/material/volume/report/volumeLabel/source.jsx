import * as utils from "./utils.js";

export default function ({data = [], t}) {
  data = calculateVolumeMetrics(data);

  return (
    <div className="report-wrapper">
      {data.map((obj) => (
        <div className="report-container flex v">
          <main className="flex flex-1">
            <div className="content flex v flex-1">
              <div style={{ position: "absolute", top: "4.83cm", left: "2.82cm" }}>{obj.code}, {obj.vol_x} de {obj.vol_y}</div>
              <img style={{ position: "absolute", top: "4cm", left: "14cm", width: "1.5cm" }} src={`https://barcode.zensoft.com.br?bcid=qrcode&text=${obj.code}`}></img>
              <div style={{ position: "absolute", top: "5.54cm", left: "3.95cm" }}>{obj.person_name}</div>
              <div style={{ position: "absolute", top: "6.24cm", left: "4.44cm" }}>{[
                obj.person_address_street,
                obj.person_address_number,
                obj.person_address_complement,
                obj.person_address_district,
              ].filter(Boolean).join(", ")}</div>
              <div style={{ position: "absolute", top: "7.66cm", left: "3.46cm" }}>{obj.person_address_zipcode}</div>
              <div style={{ position: "absolute", top: "7.66cm", left: "9.45cm" }}>{`${obj.person_address_city}, ${obj.person_address_state_code}`}</div>
              <div style={{ position: "absolute", top: "8.36cm", left: "4.94cm", maxWidth: "8cm" }}>{obj.personShipping_name}</div>
              <div style={{ position: "absolute", top: "8.36cm", left: "12.95cm" }}>{utils.formatNumber(obj.invoice_number)}</div>
            </div>
          </main>
          {/* <div className="zen-ad" style={{ fontSize: "0.5em", textAlign: "right" }}>zenerp.com.br</div> */}
        </div>
      ))}
    </div>
  );
};

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
      vol_x: runningCounter[invId],
      vol_y: volumesPerInvoice[invId],
      vol_z: z,
    };
  });
}