export default function ({ report, data = [] }) {
  data.sort((a, b) => {
    return Number(a.product.code) - Number(b.product.code);
  });

  return (
    <div className="report-wrapper">
      <div className="report-container">
        <header>
          <h1>Lista de Preços</h1>
          <section className="parameters">
            <dl>
              <dt>Categoria</dt>
              <dd>{report.parameters?.category_id}</dd>
            </dl>
          </section>
        </header>
        <main>
          <div className="content">
            <table>
              <thead>
                <tr>
                  <th>Código</th>
                  <th style={{ width: "40%" }}>Produto</th>
                  <th className="number">{data[0]?.items[0]?.descricao}</th>
                  <th className="number">{data[0]?.items[1]?.descricao}</th>
                  <th className="number">{data[0]?.items[2]?.descricao}</th>
                  <th className="number">{data[0]?.items[3]?.descricao}</th>
                  <th className="number">{data[0]?.items[4]?.descricao}</th>
                  <th className="number">{data[0]?.items[5]?.descricao}</th>
                  <th className="number">{data[0]?.items[6]?.descricao}</th>
                  <th className="number">{data[0]?.items[7]?.descricao}</th>
                  <th className="number">{data[0]?.items[8]?.descricao}</th>
                  <th className="number">{data[0]?.items[9]?.descricao}</th>
                </tr>
              </thead>
              <tbody>
                {data.map((obj) => (
                  <tr>
                    <td>{obj.product.code}</td>
                    <td>{obj.product.description}</td>
                    {obj.items?.map((item, index) => (
                      <td key={index} className="number">
                        {number(item.valor, {
                          locale: report.locale,
                          minimumFractionDigits: 2,
                        })}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}

function number(value, args) {
  return new Intl.NumberFormat(args.locale ?? "pt-BR", args).format(value);
}
