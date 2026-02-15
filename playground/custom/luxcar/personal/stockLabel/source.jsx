export default function ({ properties = {}, data = [], t }) {
  return (
    <div className="report-wrapper">
      {data.map((obj, index) => (
        <div className="report-container flex">
          <main className="flex flex-1">
            <div className="content flex-1">
              <dl style={{ gridArea: "A" }}>
                <dd className="flex align-center">
                  <img src={obj.company_logo} />
                </dd>
              </dl>
              <dl style={{ gridArea: "B" }}>
                <dd className="flex align-center justify-center">
                  <img src={`https://barcode.zensoft.com.br?bcid=qrcode&text=${obj.volume_code}`} />
                </dd>
              </dl>
              <dl style={{ gridArea: "C" }}>
                <dt>CEP</dt>
                <dd>{obj.person_zip}</dd>
              </dl>
              <dl style={{ gridArea: "D" }}>
                <dt>Nota fiscal de saída</dt>
                <dd>{obj.invoice_number}</dd>
              </dl>
              <dl style={{ gridArea: "E" }}>
                <dt>Destinatário</dt>
                <dd>{obj.person_name}<br />{obj.person_address}</dd>
              </dl>
              <dl style={{ gridArea: "F" }}>
                <dt>Itens</dt>
                <dd>1/1, {obj.product_code}, {obj.product_description}</dd>
              </dl>
              <dl style={{ gridArea: "G" }}>
                <dt>Volume</dt>
                <dd>{obj.volume_code}</dd>
              </dl>
              <dl style={{ gridArea: "H" }}>
                <dt>Volume</dt>
                <dd>{obj.item_num}/{obj.item_count}</dd>
              </dl>
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
