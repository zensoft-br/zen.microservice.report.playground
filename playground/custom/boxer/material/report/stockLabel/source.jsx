export default function ({ properties = {}, data = [], t }) {
  return (
    <div className="report-wrapper">
      {data.map((obj) => (
        <div className="report-container flex">
          <main className="flex flex-1">
            <div className="content flex-1">
              <div className="cell" style={{ gridArea: "A" }}>
                <img src={`https://barcode.zensoft.com.br?bcid=qrcode&text=${obj.code}`} />
                <div>{obj.serial_code}</div>
              </div>
              <div className="cell" style={{ gridArea: "B" }}>
                <img src={`https://barcode.zensoft.com.br?bcid=code128&text=${obj.productPacking_barcode}`} alt="" style={{ maxWidth: "100%", maxHeight: "100%" }} />
                <div>{obj.productPacking_barcode}</div>
              </div>
              <div className="cell" style={{ gridArea: "C" }}>
                <dd><strong>{obj.productPacking_code}</strong></dd>
                <dd>{obj.product_description}</dd>
              </div>
              <div className="cell" style={{ gridArea: "D" }}>
                <img src={obj.company_logo} />
              </div>
            </div>
          </main>
        </div>
      ))}
    </div>
  );
};
