export default function (x) {
  const data = Object.entries(x).filter(([key]) => !isNaN(Number(key))).map(([_, value]) => value);

  return (
    <div className="report-wrapper">
      {data.map((obj) => (
        <div className="report-container flex">
          <main className="flex flex-1">
            <div className="content flex-1">
              <dl className="flex h align-center" style={{ gridArea: "A" }}>
                <div>
                  <span className="letra">{fn(obj.person_id)}</span>
                </div>
                <dd className="flex v align-center">
                  <img style={{ objectFit: "contain", width: "3cm" }} src="https://s3.sa-east-1.amazonaws.com/zenerp.com.br/assets/tenants/luxcar/logo.png" />
                  <strong>{obj.volume_code}</strong>
                </dd>
              </dl>
              <dl className="flex v align-center flex-space-around" style={{ gridArea: "B" }}>
                <dt>Nota fiscal</dt>
                <dd><strong style={{ fontSize: "1.5rem" }}>{number(obj.invoice_number)}</strong></dd>
                <dd>OS {number(obj.ordemSeparacao_codigo)}, Carga {number(obj.carga_codigo)}</dd>
              </dl>
              <dl style={{ gridArea: "C" }}>
                <dt>Destinatário</dt>
                <dd><strong>{obj.person_fantasyName ?? obj.person_name}</strong></dd>
              </dl>
              <dl style={{ gridArea: "D" }}>
                <dt>Cidade</dt>
                <dd><strong>{`${obj.person_city}, ${obj.person_state}`}</strong></dd>
              </dl>
              <dl style={{ gridArea: "E" }}>
                <dt>Transportadora</dt>
                <dd>{obj.carga_transportadora}</dd>
              </dl>
              <dl style={{ gridArea: "F" }}>
                <dt>Itens</dt>
                <dd>{number(obj.product_num)}/{number(obj.product_count)}, {obj.product_code}, {obj.product_description}, x{obj.productPacking_units}</dd>
              </dl>
              <div className="grid" style={{ gridArea: "G" }}>
                <div className="flex h" style={{ width: "100%" }}>
                  <dl style={{ flex: "1" }}>
                    <dt>Volume</dt>
                    <dd><strong>{obj.item_num}/{obj.item_count}</strong></dd>
                  </dl>
                  <dl style={{ flex: "3" }}>
                    <dd>
                      <img style={{ objectFit: "contain" }} src={`https://barcode.zensoft.com.br?bcid=code128&scaleX=5&scaleY=1&text=${obj.volume_code}`}></img>
                    </dd>
                  </dl>
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