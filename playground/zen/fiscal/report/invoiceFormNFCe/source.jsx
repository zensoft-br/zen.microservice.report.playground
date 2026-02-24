export default async function ({ data = [] }) {
  // const response = await fetch(invoice.dfeNfeProcOut.file.url);
  // if (!response.ok) {
  //   throw new Error("Failed to fetch NFC-e XML");
  // }
  // const xml = await response.text();

  // const parser = new DOMParser();
  // const xmlDoc = parser.parseFromString(xml, "text/xml");

  // const ns = "http://www.portalfiscal.inf.br/nfe";
  // const qrCode = xmlDoc.getElementsByTagNameNS(ns, "qrCode")[0]?.textContent;
  // const urlChave = xmlDoc.getElementsByTagNameNS(ns, "urlChave")[0]?.textContent;
  // const dhRecbto = xmlDoc.getElementsByTagNameNS(ns, "dhRecbto")[0]?.textContent;
  // const nProt = xmlDoc.getElementsByTagNameNS(ns, "nProt")[0]?.textContent;

  return (
    <div className="report-wrapper">
      {data.map((item) => (
        <div key={item.id} className="report-container">
          <div className="container">
            <div>
              <h3 className="text-center">DANFE NFC-e</h3>
            </div>
            <hr />

            <div>
              {item.company.image && (
                <img className="logo"
                  src={item.company.image?.url}
                  alt="" />
              )}
              <h3 className="text-center">{item.company.person.name}</h3>
              <p className="text-center">CNPJ: {item.company.person.documentNumber}</p>
              <p className="text-center">Inscrição estadual: {item.company.person.document2Number}</p>
              <p className="text-center">
                {[item.company.person?.street,
                  item.company.person?.number,
                  item.company.person?.district,
                  item.company.person?.city?.name,
                  item.company.person?.city?.state?.code,
                  item.company.person?.zipcode]
                  .filter(Boolean).join(", ")}
              </p>
              <p className="text-center">
                <span>{`Número: ${item.number}`}</span>
                &nbsp;
                <span>{`Modelo/Série: ${item.invoiceSeries.properties.fiscal_br_mod}/${item.invoiceSeries.properties.fiscal_br_serie}`}</span>
              </p>
              <p className="text-center">{`Data/Hora: ${datetime(item.date)}`}</p>
              <hr />
            </div>

            {item.person.documentNumber && (
              <div>
                <h3 className="text-center">Consumidor</h3>
                <p className="text-center">{item.person?.name} </p>
                <p className="text-center">CPF/CNPJ: {item.person?.documentNumber}</p>
                <hr />
              </div>
            )}

            <table className="itens">
              <thead>
                <tr>
                  <th>Cód</th>
                  {/* <th>Descrição</th> */}
                  <th className="number">Qtd</th>
                  <th className="number">Vlr Unit.</th>
                  <th className="number">Vlr Total</th>
                </tr>
              </thead>
              <tbody>
                {item.items.map((item) => (
                  <React.Fragment key={item.id}>
                    <tr>
                      <td>{item.productPacking?.code}</td>
                      {/* <td>{item.productPacking?.name}</td> */}
                      <td className="number">{item.quantity}</td>
                      <td className="number">
                        {item.unitValue?.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </td>
                      <td className="number">
                        {(item.quantity * item.unitValue).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="999">
                        {[
                          item.productPacking?.product?.description,
                          item.productPacking?.complement,
                          item.productPacking?.variant?.description ?? item.productPacking?.variant?.code]
                          .filter(Boolean).join(", ")}
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>

            {/* Totais */}
            <div className="totais">
              <strong>
                Total:{" "}
                {item.items
                  .reduce((acc, i) => acc + i.quantity * i.unitValue, 0)
                  .toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </strong>
              <hr />
            </div>

            {/* Observações */}
            {item.comments && (
              <>
                <pre>{item.comments}</pre>
                <hr />
              </>
            )}

            {/* Chave de acesso + QR Code */}
            <div>
              <p className="text-center">{`Protocolo autorização: ${item.nfeOut?.nProt}`}</p>
              <p className="text-center">{item.nfeOut?.dhRecbto ? `Data/hora autorização: ${datetime(new Date(item.nfeOut.dhRecbto))}` : ""}</p>
              <p className="text-center">{item.nfeOut?.urlChave}</p>
              <p className="text-center">{item.nfeOut?.chNFe?.replace(/(\d{4})(?=\d)/g, "$1 ").trim()}</p>
              {item.nfeOut?.qrCode && (
                <img className="text-center"
                  src={`https://barcode.zensoft.com.br/?bcid=qrcode&text=${encodeURIComponent(item.nfeOut.qrCode)}&scale=4`}
                  alt="QR Code NFC-e"
                  width="100"
                  height="100" />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// function date(s) {
//   if (s == null) return null;
//   const date = new Date(s);
//   return date.toLocaleDateString("pt-BR");
// }

function datetime(s) {
  if (s == null) return null;
  const date = new Date(s);
  return date.toLocaleDateString("pt-BR");
}

// function number(v, args) {
//   if (v == null) return null;
//   return v.toLocaleString("pt-BR", args);
// }

// function currency(v, { currency = "BRL", digits = 2 } = {}) {
//   if (v == null) return null;
//   return v.toLocaleString("pt-BR", { style: "currency", currency, minimumFractionDigits: digits, maximumFractionDigits: digits });
// }

// function address({ street, number, complement }) {
//   return [street, number, complement].filter(Boolean).join(", ");
// }

// const splitInBlocks = (str, size = 4) => {
//   if (str == null) return null;
//   const regex = new RegExp(`.{1,${size}}`, "g");
//   return str.match(regex).join(" ");
// };