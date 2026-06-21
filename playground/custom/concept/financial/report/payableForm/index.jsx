import * as utils from "./utils.jsx";
import { Badge, getVisibleColumns } from "./utils.jsx";

export default function ({ data = [], meta = {}, t }) {
  const { report = {} } = meta;

  const columns = [
    { id: "id",
      header: utils.cellHeader(t("/@word/id")),
      width: "7ch",
      className: "id",
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({ data }) => data.length, 
      footer: ({ value }) => utils.formatNumber(value),
    },
    { id: "name",
      header: utils.cellHeader(t("/@word/name")),
      width: "30ch",
    },
    { id: "score",
      header: utils.cellHeader(t("/@word/score")),
      width: "7ch",
      className: "number",
      cell: ({ value }) => utils.formatNumber(value, { minimumFractionDigits: 2 }),
    },
    { id: "category1",
      header: utils.cellHeader(t("/@word/category1")),
      width: "15ch",
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    { id: "status",
      header: utils.cellHeader(t("/@word/status")),
      width: "15ch",
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
  ];

  // data = utils.sort(data, report.properties?.settings?.sort || []);
  
  const visibleColumns = getVisibleColumns({
    availableColumns: columns.map(column => column.id),
    overrideColumns: report.properties?.overrideColumns?.split(","),
    standardColumns:  [
      "id",
      "name",
      "score",
      "status",
    ],
    addColumns: report.properties?.showColumns?.split(","),
    removeColumns: report.properties?.hideColumns?.split(","),
  });

  return (
    <div className="report-wrapper">
      {data.map((data, index) => (
        <div className="report-container a4">
          <header>
            <h1>{`Recibo de pagamento: ${data.id}`}</h1>
            <br />
            <section className="parameters">
              <dl>
                <dt>Empresa pagadora</dt>
                <dd>{data.company.person.name}</dd>
              </dl>
            </section>
            <section className="parameters">
              <dl>
                <dt>Beneficiário</dt>
                <dd>{data.person.name}</dd>
              </dl>
            </section>
            {data.wallet && (
              <section className="parameters">
                <dl>
                  <dt>Carteira</dt>
                  <dd>{data.wallet.description ?? data.wallet.code}</dd>
                </dl>
              </section>
            )}
            <section className="parameters">
              <dl>
                <dt>Valor</dt>
                <dd style={{ fontFamily: "monospace", fontWeight: "bold", fontSize: "1.2em" }}>{utils.formatCurrency(data.value)}</dd>
              </dl>
            </section>
            <section className="parameters">
              <dl>
                <dt>Descrição</dt>
                <dd>{data.description}</dd>
              </dl>
            </section>
            {data.properties?.comments && (
              <section className="parameters">
                <dl>
                  <dt>Observações</dt>
                  <dd><pre>{data.properties?.comments}</pre></dd>
                </dl>
              </section>
            )}
          </header>
          <main>
            <div className="content">
              <table>
                <thead>
                  <tr>
                    <th>Documento</th>
                    <th>Emissão</th>
                    <th>Vencimento</th>
                    <th className="number">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{data.code ?? data.id}</td>
                    <td>{utils.formatDate(data.date)}</td>
                    <td>{utils.formatDate(data.dueDate)}</td>
                    <td className="number">{utils.formatCurrency(data.value)}</td>
                  </tr>
                </tbody>
              </table>
              <br />
              <br />
              <br />
              <br />
              <span style={{ display: "block", textAlign: "center" }}>_________________________________________________________________</span>
              <span style={{ display: "block", textAlign: "center" }}>{`${data.company.person.city?.name}, ${utils.formatDate(new Date().toISOString())}`}</span>
            </div>
          </main>
          <footer className="flex v gap">
            <br />
            <br />
            <section className="parameters">
              <dl>
                <dt>Tesoureiro</dt>
                <dd>&nbsp;<br/>&nbsp;</dd>
              </dl>
              <dl>
                <dt>Procurador</dt>
              </dl>
              <dl>
                <dt>Diretor</dt>
              </dl>
            </section>
            <br />
            <br />
            <section className="parameters">
              <dl>
                <dt>Assinatura</dt>
                <dd>&nbsp;<br/>&nbsp;</dd>
              </dl>
              <dl>
                <dt>Data</dt>
                <dd>&nbsp;<br/>&nbsp;</dd>
              </dl>
            </section>
          </footer>
        </div>
      ))}
    </div>
  );
}