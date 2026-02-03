export default function (root) {
  return (
    <div className="report-container">
      <header>
        <h1 className="flex h center">
          <div className="brand"><img src={root.data?.[0]?.company_logo} style={{ height: "2cm" }} /></div>
          <span>{root.report?.description}</span>
          <img src={`https://barcode.zensoft.com.br/?bcid=qrcode&text=${root.data?.[0]?.id}`} />
        </h1>
        <dl>
          <div>
            <dt>Empresa</dt>
            <dd>{root.data?.[0]?.company_name}</dd>
          </div>
          <div>
            <dt>CNPJ</dt>
            <dd>{root.data?.[0]?.company_documentNumber}</dd>
          </div>
          <div>
            <dt>Telefone</dt>
            <dd>{root.data?.[0]?.company_phone}</dd>
          </div>
        </dl>
        <dl>
          <div>
            <dt>Pessoa</dt>
            <dd>{root.data?.[0]?.person_name}</dd>
          </div>
          <div>
            <dt>CNPJ</dt>
            <dd>{root.data?.[0]?.person_documentNumber}</dd>
          </div>
          <div>
            <dt>Inscrição estadual</dt>
            <dd>{root.data?.[0]?.person_document2Number}</dd>
          </div>
          <div>
            <dt>Telefone</dt>
            <dd>{root.data?.[0]?.person_phone}</dd>
          </div>
        </dl>
        <dl>
          <div>
            <dt>Data</dt>
            <dd>{root.data?.[0]?.date}</dd>
          </div>
          <div>
            <dt>CNPJ</dt>
            <dd>{root.data?.[0]?.salesperson_name}</dd>
          </div>
          <div>
            <dt>Telefone</dt>
            <dd>{root.data?.[0]?.salesperson_phone}</dd>
          </div>
        </dl>
        <dl>
          <div>
            <dt>Observações</dt>
            <dd>
              <pre>{root.data?.[0]?.comments}</pre>
            </dd>
          </div>
        </dl>
      </header>
      <main>
        <table>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Quantidade</th>
              <th>Quantidade proposta</th>
              <th>Valor unitário proposto</th>
            </tr>
          </thead>
          <tbody>
            {root.data?.map((item) => (
              <tr key={item.id}>
                <td>{item.productPacking_code}</td>
                <td>{item.product_description}</td>
                <td>{item.quoteItem_quantity}</td>
                <td>{item.quoteItem_currency_code}</td>
                <td>{item.quoteItemProposal_quantity}</td>
                <td>{item.quoteItemProposal_unitValue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
      {root.data?.[0]?.product_id}
    </div>
  );
}