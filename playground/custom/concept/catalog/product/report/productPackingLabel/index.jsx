import * as utils from "./utils.jsx";

export default function ({ data = [], t }) {

  // Agrupa os itens por produto
  data = data.reduce((red, e) => {
    if (!red[e.product.id]) {
      red[e.product.id] = [];
    }
    red[e.product.id].push(e);
    return red;
  }, {});

  return (
    <div className="report-wrapper" style={{ fontSize: settings?.fontSize }}>
      {Object.values(data).map((arr, index) => {
        const product = arr[0].product;
        return (
          <div className="report-container">
            <main className="flex v gap">
              <div className="flex v">
                <div className="content flex v flex-1">
                  <dl style={{ gridArea: "A" }}>
                    <dd>
                      <img src="https://zenerp.s3.amazonaws.com/tenants/concept/images/86402fcd-2050-4815-8998-682f118f8bbf.png"
                        style={{ height: "0.8cm" }} />
                    </dd>
                  </dl>
                  <div className="flex h">
                    <div className="flex v" style={{ flex: "3" }}>
                      <dl className="flex-1">
                        <dt>Artigo</dt>
                        <dd>{`${product.code} - ${product.description}`}</dd>
                      </dl>
                      <dl className="flex-1">
                        <dt>Composição</dt>
                        <dd>{product.properties.textileComposition}</dd>
                      </dl>
                      <div className="flex h flex-1">
                        <dl style={{ flex: "1 0 0" }}>
                          <dt>Largura</dt>
                          <dd>{product.properties?.textileWidth ? `${utils.formatNumber(product.properties?.textileWidth)} m` : "\u00A0"}</dd>
                        </dl>
                        <dl style={{ flex: "1 0 0" }}>
                          <dt>Gramatura</dt>
                          <dd>{product.properties?.textileGramWeight ? `${utils.formatNumber(product.properties?.textileGramWeight)} g/m²` : "\u00A0"}</dd>
                        </dl>
                        <dl style={{ flex: "1 0 0" }}>
                          <dt>Rendimento</dt>
                          <dd>{product.properties?.textileYield ? `${utils.formatNumber(product.properties?.textileYield)} m/kg` : "\u00A0"}</dd>
                        </dl>
                      </div>
                    </div>
                    <div className="flex v" style={{ flex: "1" }}>
                      <dl style={{ gridArea: "H" }}>
                        <dd><img src={`https://barcode.zensoft.com.br?bcid=qrcode&text=${product.barcode ?? product.code}`} /></dd>
                      </dl>
                    </div>
                  </div>
                  <div className="flex h" style={{ gridArea: "N" }}>
                    {Object
                      .entries(product.properties)
                      .filter(entry => entry[0].startsWith("textileCare"))
                      .map((entry, index) => (
                        <dl key={index}>
                          <dd><img src={`https://zenerp.s3.amazonaws.com/public/material/images/${entry[1]}`} /></dd>
                        </dl>
                      ))}
                  </div>
                </div>

              </div>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "var(--gap)",
              }}>
                {arr.map((item) => (
                  <dl key={item.id} className="flex v align-center justify-center padding no-break">
                    <div>{item.code}</div>
                    <div style={{ textAlign: "center" }}>{item.variant?.description}</div>
                  </dl>
                ))}
              </div>
            </main>
          </div>
        );
      })}
    </div>
  );
};
