export default ({ data }) => {
  return (
    <div className="report-container">
      <header>
        <div className="brand">
          <img src={data.company?.image.url} style={{ width: "3cm" }}></img>
        </div>
        <h1 className="flex h gap align-center" style={{ justifyContent: "space-between" }}>Orçamento {data.id}
          <img src={`https://barcode.zensoft.com.br?bcid=qrcode&text=${data.id}`} style={{ width: "1.5cm" }}></img>
        </h1>
        <dl>
          <div>
            <dt>Empresa</dt>
            <dd>{data.company?.person.name}</dd>
          </div>
          <div>
            <dt>CNPJ</dt>
            <dd>{data.company?.person.documentNumber}</dd>
          </div>
          <div>
            <dt>Telefone</dt>
            <dd>{data.company?.person.phone}</dd>
          </div>
        </dl>
        <dl>
          <div>
            <dt>Cliente</dt>
            <dd>{data.person?.name}</dd>
          </div>
          <div>
            <dt>CNPJ</dt>
            <dd>{data.person?.documentNumber}</dd>
          </div>
          <div>
            <dt>Telefone</dt>
            <dd>{data.person?.phone}</dd>
          </div>
        </dl>
        <dl>
          <div>
            <dt>Data</dt>
            <dd>{data.date}</dd>
          </div>
          <div>
            <dt>Vendedor</dt>
            <dd>{data.personSalesperson?.name}</dd>
          </div>
          <div>
            <dt>Telefone</dt>
            <dd>{data.personSalesperson?.phone}</dd>
          </div>
        </dl>
        <dl>
          <div>
            <dt>Observações</dt>
            <pre>{data.saleProfile?.properties?.quote_comments}</pre>
          </div>
        </dl>
      </header>
      <main>
        <section>
          <div className="group-content">
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Código</th>
                  <th>Descrição</th>
                  <th>Proposta</th>
                  <th className="number">Quantidade</th>
                  <th>Moeda</th>
                  <th className="number">Valor unitário</th>
                  <th className="number">Valor unitário BRL</th>
                  <th className="number">Valor total</th>
                  <th>Disponibilidade</th>
                </tr>
              </thead>
              <tbody>
                {
                  data.items?.map((item, index1) => (
                    item.proposals.map((proposal, index2) => (
                      <tr key={item.id} style={{ fontStyle: index2 > 0 ? "italic" : undefined, opacity: index2 > 0 ? "0.5" : undefined }}>
                        <td>{index2 === 0 ? index1 + 1 : undefined}</td>
                        <td>{index2 === 0 ? item.productPacking?.code : undefined}</td>
                        <td>{index2 === 0 ? item.productPacking?.product.description : undefined}</td>
                        <td>{index2 + 1}</td>
                        <td className="number">{formatNumber(item.quantity, { digits: 0 })}</td>
                        <td>{proposal.currency.code}</td>
                        <td className="number">{formatNumber(proposal.unitValue, { digits: 8 })}</td>
                        <td className="number">{formatNumber(proposal.unitValueLocal, { digits: 8 })}</td>
                        <td className="number">{formatNumber(proposal.totalValue)}</td>
                        <td>{formatDate(data.availabilityDate)}</td>
                      </tr>
                    ))
                  ))}
              </tbody>
              <tfoot>
                <tr>
                  <th colSpan={5} className="number">{formatNumber(data.items.reduce((acc, item) => acc + item.proposals[0].quantity, 0))}</th>
                  <th colSpan={4} className="number">{formatNumber(data.items.reduce((acc, item) => acc + item.proposals[0].totalValue, 0))}</th>
                  <th></th>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>
      </main>
      {/* <footer>
        <dl className="flex v gap">
          <div style={{ flex: 1 }}>
            <dt>Observações</dt>
            <dd>aaa</dd>
          </div>
          <div style={{ flex: 1 }}>
            <dt>Observações</dt>
            <dd>aaa</dd>
          </div>
        </dl>
      </footer> */}
    </div>
  );
};

function formatDate(dateString) {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Date(dateString).toLocaleDateString("pt-BR", options);
}

function formatNumber(number, options = { digits: 2 }) {
  return new Intl.NumberFormat("pt-BR", { minimumFractionDigits: options.digits, maximumFractionDigits: options.digits }).format(number);
}