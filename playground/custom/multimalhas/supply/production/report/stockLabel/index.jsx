import * as utils from "./utils.jsx";

export default function ({data, t}) {
  return (
    <div className="report-wrapper" style={{ fontSize: settings?.fontSize }}>
      {data.map((obj) => {
        const tags = [
          ...(obj.priceListItem_tags ?? "").split(",").filter(tag => tag.startsWith("q:")),
          ...(obj.product_tags ?? "").split(",").filter(tag => tag.startsWith("q:")),
        ].map(tag => Number(tag.replace("q:", "")));

        const boxes = boxesCalc(obj.quantity, tags[0]);
        return (
          boxes.map((q, index) => (
            <div key={index} className="report-container">
              <main className="flex v">
                <div className="content flex-1">
                  <div className="flex h " style={{ gridArea: "B" }}>
                    <dl>
                      <dt>Pedido interno</dt>
                      <dd>{obj.sale_id}</dd>
                    </dl>
                    <dl>
                      <dt>Pedido do cliente</dt>
                      <dd>{obj.sale_code}</dd>
                    </dl>
                  </div>
                  <dl className="flex v align-center" style={{ gridArea: "C", justifyContent: "space-around" }}>
                    <div className="flex v align-center">
                      <dt>{t("/@word/quantity")}</dt>
                      <dd style={{ fontSize: "1.8em", fontWeight: "bold" }}>
                        {utils.formatNumber(q, { maximumFractionDigits: 2 })}&nbsp;{fn(obj.productPacking_code)}
                      </dd>
                    </div>
                    <div className="flex v align-center">
                      {boxes.length > 1 && (
                        <dd>{index + 1} de {boxes.length}</dd>
                      )}
                    </div>
                  </dl>
                  <dl style={{ gridArea: "D" }}>
                    <dt>{t("/@word/customer")}</dt>
                    <dd>{obj.person_name}</dd>
                  </dl>
                  <dl  style={{ gridArea: "E" }}>
                    <dt>{t("/catalog/product/productPacking")}</dt>
                    <dd><strong>{obj.productPacking_code}</strong></dd>
                  </dl>
                  <dl style={{ gridArea: "F" }}>
                    <dt>{t("/catalog/product/productVariant")}</dt>
                    <dd>{obj.productVariant_description}</dd>
                  </dl>
                  <dl style={{ gridArea: "G" }}>
                    <dt>Tamanho</dt>
                    <dd>{obj.productPacking_code.split(".")[2]}</dd>
                  </dl>
                  <dl style={{ gridArea: "H" }}>
                    <dd><img src={obj.company_logo} /></dd>
                  </dl>
                </div>
              </main>
            </div>
          ))
        );
      })}
    </div>
  );
};

function boxesCalc(q, boxSize) {
  boxSize = boxSize || q;
  let balance = q;
  const result = [];
  while (balance > 0) {
    const q = Math.min(balance, boxSize);
    result.push(q);
    balance -= q;
  }
  return result;
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