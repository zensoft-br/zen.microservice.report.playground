export default function ({ data = [] }) {
  return (
    <div className="report-wrapper">
      <div className="report-container">
        <main>
          <div className="content">
            <table>
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>{data[0]?.items[0]?.descricao}</th>
                  <th>{data[0]?.items[1]?.descricao}</th>
                  <th>{data[0]?.items[2]?.descricao}</th>
                  <th>{data[0]?.items[3]?.descricao}</th>
                  <th>{data[0]?.items[4]?.descricao}</th>
                  <th>{data[0]?.items[5]?.descricao}</th>
                  <th>{data[0]?.items[6]?.descricao}</th>
                  <th>{data[0]?.items[7]?.descricao}</th>
                  <th>{data[0]?.items[8]?.descricao}</th>
                  <th>{data[0]?.items[9]?.descricao}</th>
                </tr>
              </thead>
              <tbody>
                {data.map((obj) => (
                  <tr>
                    <td>{obj.product.description}</td>
                    {obj.items?.map((item, index) => (
                      <td key={index}>
                        {number(item.valor, { minimumFractionDigits: 2 })}
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
};

function number(value, args) {
  return new Intl.NumberFormat("pt-BR", args).format(value);
}
