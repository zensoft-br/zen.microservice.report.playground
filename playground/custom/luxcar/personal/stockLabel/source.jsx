export default function (x) {
  const data = Object.values(x);

  return (
    <div className="report-wrapper">
      {data.map((obj) => (
        <div className="report-container flex">
          <main className="flex flex-1">
            <div className="content flex-1">
              <dl style={{ gridArea: "A" }}>
                <dd className="flex v align-center">
                  <img src="https://s3.sa-east-1.amazonaws.com/zenerp.com.br/assets/tenants/luxcar/logo.png" />
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
                <dd><strong>{obj.person_name}</strong></dd>
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
                <dd>{number(obj.item_num)}/{number(obj.item_count)}, {obj.product_code}, {obj.product_description}</dd>
              </dl>
              <div className="grid" style={{ gridArea: "G", gridTemplateColumns: "repeat(4, 1fr)", gridTemplateRows: "1fr", gridTemplateAreas: "\"A B B B\"" }}>
                <dl style={{ gridArea: "A" }}>
                  <dt>Volume</dt>
                  <dd><strong>{obj.item_num}/{obj.item_count}</strong></dd>
                </dl>
                <dl style={{ gridArea: "B" }}>
                  <dd>
                    <img style={{ objectFit: "contain" }} src={`https://barcode.zensoft.com.br?bcid=code128&scaleX=5&scaleY=1&text=${obj.volume_code}`}></img>
                  </dd>
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
