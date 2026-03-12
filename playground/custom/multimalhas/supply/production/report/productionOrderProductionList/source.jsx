import * as utils from "./utils.js";

export default function ({ data = [], t }) {
  // Group data by person_id
  data = data.reduce((red, obj) => {
    const key = `${obj.properties?.sale_id || "unknown"}:${obj.person_id}`; 
    if (!red[key]) {
      red[key] = { 
        data: obj,
        items: [],  
      };
    }
    red[key].items.push(obj);
    return red;
  }, {});

  // Group items by productVariant_id within each person_id group
  Object.values(data).forEach(obj => {
    obj.items = obj.items.reduce((red, item) => {
      let key_part1 = (item.product_code ?? "").split(".").slice(0, 2).join(".");
      const key = `${key_part1}:${item.productVariant_id || "unknown"}`;
      if (!red[key]) {
        red[key] = {
          key_part1,
          data: item,
          items: [],  
        };
      }
      red[key].items.push(item);
      return red;
    }, {});

    Object.values(obj.items).forEach(obj => {
      obj.items = obj.items.reduce((red, item) => {
        let key = (item.product_code ?? "").split(/[\./]/)[2] || "unknown";
        if (!["38", "40", "42", "44", "46", "48", "50", "52", "54", "56"].includes(key))
          key = "unknown";
        if (!red[key]) {
          red[key] = { 
            data: item,
            items: [],  
          };
        }
        red[key].items.push(item);
        return red;
      }, {});
    });
  });

  return (
    <div className="report-wrapper">
      <div className="report-container">
        <header>
          <h1>Ordens de produção pendentes</h1>
        </header>
        <main>
          {Object.entries(data).map(([key, value]) => (
            <section key={key}>
              <header className="flex h gap" style={{ justifyContent: "space-between" }}>
                <dl style={{ flex: "2" }}>
                  <dt>Cliente</dt>
                  <dd>{value.data.person_name}</dd>
                </dl>
                <dl className="flex-1">
                  <dt>Data</dt>
                  <dd>{utils.formatDate(value.data.date)}</dd>
                </dl>
                <dl className="flex-1">
                  <dt>Disponibilidade</dt>
                  <dd>{utils.formatDate(value.data.availabilityDate)}</dd>
                </dl>
                <dl className="flex-1">
                  <dt>Pedido</dt>
                  <dd>{value.data.properties?.sale_id}</dd>
                </dl>
              </header>
              <div className="content">
                <table>
                  <thead>
                    <tr>
                      <th style={{ width: "5cm" }}>Produto</th>
                      <th style={{ width: "5cm" }}>Variante</th>
                      <th className="number">38</th>
                      <th className="number">40</th>
                      <th className="number">42</th>
                      <th className="number">44</th>
                      <th className="number">46</th>
                      <th className="number">48</th>
                      <th className="number">50</th>
                      <th className="number">52</th>
                      <th className="number">54</th>
                      <th className="number">56</th>
                      <th className="number">-</th>
                      <th className="number">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(value.items).map(([_, item], index) => (
                      <tr key={index}>
                        <td style={{ width: "5cm" }}>{item.key_part1}</td>
                        <td style={{ width: "5cm" }}>{item.data.productVariant_description}</td>
                        <td className="number">{utils.formatNumber(item.items["38"]?.items.reduce((sum, i) => sum + i.sum_quantity, 0) || 0)}</td>
                        <td className="number">{utils.formatNumber(item.items["40"]?.items.reduce((sum, i) => sum + i.sum_quantity, 0) || 0)}</td>
                        <td className="number">{utils.formatNumber(item.items["42"]?.items.reduce((sum, i) => sum + i.sum_quantity, 0) || 0)}</td>
                        <td className="number">{utils.formatNumber(item.items["44"]?.items.reduce((sum, i) => sum + i.sum_quantity, 0) || 0)}</td>
                        <td className="number">{utils.formatNumber(item.items["46"]?.items.reduce((sum, i) => sum + i.sum_quantity, 0) || 0)}</td>
                        <td className="number">{utils.formatNumber(item.items["48"]?.items.reduce((sum, i) => sum + i.sum_quantity, 0) || 0)}</td>
                        <td className="number">{utils.formatNumber(item.items["50"]?.items.reduce((sum, i) => sum + i.sum_quantity, 0) || 0)}</td>
                        <td className="number">{utils.formatNumber(item.items["52"]?.items.reduce((sum, i) => sum + i.sum_quantity, 0) || 0)}</td>
                        <td className="number">{utils.formatNumber(item.items["54"]?.items.reduce((sum, i) => sum + i.sum_quantity, 0) || 0)}</td>
                        <td className="number">{utils.formatNumber(item.items["56"]?.items.reduce((sum, i) => sum + i.sum_quantity, 0) || 0)}</td>
                        <td className="number">{utils.formatNumber(item.items["unknown"]?.items.reduce((sum, i) => sum + i.sum_quantity, 0) || 0)}</td>
                        <td className="number">{utils.formatNumber(Object.values(item.items).reduce((sum, i) => sum + i.items.reduce((s, j) => s + j.sum_quantity, 0), 0))}</td>
                      </tr>
                    ))
                    }
                  </tbody>
                  <tfoot>
                    <tr>
                      <td>{t("/@word/total")}</td>
                      <td></td>
                      <td className="number">{utils.formatNumber(Object.values(value.items).reduce((sum, i) => sum + (i.items["38"]?.items.reduce((s, j) => s + j.sum_quantity, 0) || 0), 0))}</td>
                      <td className="number">{utils.formatNumber(Object.values(value.items).reduce((sum, i) => sum + (i.items["40"]?.items.reduce((s, j) => s + j.sum_quantity, 0) || 0), 0))}</td>
                      <td className="number">{utils.formatNumber(Object.values(value.items).reduce((sum, i) => sum + (i.items["42"]?.items.reduce((s, j) => s + j.sum_quantity, 0) || 0), 0))}</td>
                      <td className="number">{utils.formatNumber(Object.values(value.items).reduce((sum, i) => sum + (i.items["44"]?.items.reduce((s, j) => s + j.sum_quantity, 0) || 0), 0))}</td>
                      <td className="number">{utils.formatNumber(Object.values(value.items).reduce((sum, i) => sum + (i.items["46"]?.items.reduce((s, j) => s + j.sum_quantity, 0) || 0), 0))}</td>
                      <td className="number">{utils.formatNumber(Object.values(value.items).reduce((sum, i) => sum + (i.items["48"]?.items.reduce((s, j) => s + j.sum_quantity, 0) || 0), 0))}</td>
                      <td className="number">{utils.formatNumber(Object.values(value.items).reduce((sum, i) => sum + (i.items["50"]?.items.reduce((s, j) => s + j.sum_quantity, 0) || 0), 0))}</td>
                      <td className="number">{utils.formatNumber(Object.values(value.items).reduce((sum, i) => sum + (i.items["52"]?.items.reduce((s, j) => s + j.sum_quantity, 0) || 0), 0))}</td>
                      <td className="number">{utils.formatNumber(Object.values(value.items).reduce((sum, i) => sum + (i.items["54"]?.items.reduce((s, j) => s + j.sum_quantity, 0) || 0), 0))}</td>
                      <td className="number">{utils.formatNumber(Object.values(value.items).reduce((sum, i) => sum + (i.items["56"]?.items.reduce((s, j) => s + j.sum_quantity, 0) || 0), 0))}</td>
                      <td className="number">{utils.formatNumber(Object.values(value.items).reduce((sum, i) => sum + (i.items["unknown"]?.items.reduce((s, j) => s + j.sum_quantity, 0) || 0), 0))}</td>
                      <td className="number">{utils.formatNumber(Object.values(value.items).reduce((sum, i) => sum + Object.values(i.items).reduce((s, j) => s + j.items.reduce((a, b) => a + b.sum_quantity, 0), 0), 0))}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
};