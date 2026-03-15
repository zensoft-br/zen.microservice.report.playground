export default function ({data}) {
  return (
    <div className="report-wrapper">
      {data.map((obj) => (
        <div className="report-container flex v">
          <main className="flex flex-1">
            <div className="content flex v flex-1">
              <div className="grid" style={{ flex: "2 0 0", gridTemplateColumns: "1fr 2fr 2fr" }}>
                <dl className="flex v align-center letra">
                  <dt>{fn(obj.person_id)}</dt>
                </dl>
                <dl className="flex v align-center">
                  <img style={{ objectFit: "contain", flex: "2 0 0" }} src="https://s3.sa-east-1.amazonaws.com/zenerp.com.br/assets/tenants/luxcar/logo.png" />
                  <strong style={{ flex: "1 0 0" }}>{obj.volume_code}</strong>
                </dl>
                {/* <dl>
                  <img src={`https://barcode.zensoft.com.br?bcid=qrcode&text=${obj.volume_code}`}></img>
                </dl> */}
                <dl className="flex v align-center flex-space-around">
                  <dt>Nota fiscal</dt>
                  <dd><strong style={{ fontSize: "1.5rem" }}>{number(obj.invoice_number)}</strong></dd>
                  <dd style={{ fontSize: "0.7em" }}>OS {number(obj.ordemSeparacao_codigo)}, Carga {number(obj.carga_codigo)}</dd>
                </dl>
              </div>
              <dl style={{ flex: "1 0 0" }}>
                <dt>Destinatário</dt>
                <dd><strong>{obj.person_fantasyName ?? obj.person_name}</strong></dd>
              </dl>
              <dl style={{ flex: "1 0 0" }}>
                <dt>Cidade</dt>
                <dd><strong>{`${obj.person_city}, ${obj.person_state}`}</strong></dd>
              </dl>
              <dl style={{ flex: "1 0 0" }}>
                <dt>Transportadora</dt>
                <dd>{obj.carga_transportadora}</dd>
              </dl>
              <dl style={{ flex: "1 0 0" }}>
                <dt>Itens</dt>
                <dd>{number(obj.product_num)}/{number(obj.product_count)}, {obj.product_code}, {obj.product_description}, x{obj.productPacking_units}</dd>
              </dl>
              <div className="grid" style={{ flex: "1 0 0", gridTemplateColumns: "1fr 3fr" }}>
                <dl>
                  <dt>Volume</dt>
                  <dd>{obj.item_num}/{obj.item_count}</dd>
                </dl>
                <dl>
                  <img style={{ objectFit: "contain" }} src={`https://barcode.zensoft.com.br?bcid=code128&scaleX=5&scaleY=1&text=${obj.volume_code}`}></img>
                </dl>
              </div>
            </div>
          </main>
          <div style={{ fontSize: "0.8em", textAlign: "right" }}>zenerp.com.br</div>
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