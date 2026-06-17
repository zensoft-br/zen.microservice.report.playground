import * as utils from "./utils.jsx";
import { Badge, Column, getVisibleColumns, GroupSections, Table } from "./utils.jsx";

export default function ({ data = [], meta = {}, t }) {
  const { report = {} } = meta;

  const columns = [
    { id: "group",
      header: null,
      width: "15ch",
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    { id: "topic",
      header: "Origem",
      width: "15ch",
      // cell: ({ value }) => <Badge>{value}</Badge>,
    },
    { id: "quantity_today",
      header: "m, hoje",
      className: "number",
      width: "15ch",
      cell: ({ value }) => utils.formatNumber(value, { digits: 2 }),
      footerValue: ({ data }) => data.reduce((acc, row) => acc + row.quantity_today, 0),
      footer: ({ value }) => utils.formatNumber(value, { digits: 2 }),
    },
    { id: "totalValue_today",
      header: "Valor, hoje",
      className: "number",
      width: "15ch",
      cell: ({ value }) => utils.formatCurrency(value, { digits: 2 }),
      footerValue: ({ data }) => data.reduce((acc, row) => acc + row.totalValue_today, 0),
      footer: ({ value }) => utils.formatCurrency(value, { digits: 2 }),
    },
    { id: "quantity_toDate",
      header: "m, mês",
      className: "number",
      width: "15ch",
      cell: ({ value }) => utils.formatNumber(value, { digits: 2 }),
      footerValue: ({ data }) => data.reduce((acc, row) => acc + row.quantity_toDate, 0),
      footer: ({ value }) => utils.formatNumber(value, { digits: 2 }),
    },
    { id: "totalValue_toDate",
      header: "Valor, mês",
      className: "number",
      width: "15ch",
      cell: ({ value }) => utils.formatCurrency(value, { digits: 2 }),
      footerValue: ({ data }) => data.reduce((acc, row) => acc + row.totalValue_toDate, 0),
      footer: ({ value }) => utils.formatCurrency(value, { digits: 2 }),
    },
  ];

  data = utils.sort(data, [{ "columnId": "index" }, { "columnId": "index2" }, { "columnId": "topic" }]);
  
  data = utils.group(data, [{ "columnId": "group" }]);
  
  const visibleColumns = getVisibleColumns({
    availableColumns: columns.map(column => column.id),
    overrideColumns: report.properties?.overrideColumns?.split(","),
    standardColumns:  [
      "topic",
      "quantity_today",
      "totalValue_today",
      "quantity_toDate",
      "totalValue_toDate",
    ],
    addColumns: report.properties?.showColumns?.split(","),
    removeColumns: report.properties?.hideColumns?.split(","),
  });

  return (
    <div className="report-wrapper">
      <div className="report-container a4">
        <header>
          <h1>Fechamento diário sintético</h1>
          <section className="parameters">
            <dl>
              <dt>Data</dt>
              <dd>{utils.formatDate(new Date())}</dd>
            </dl>
          </section>
        </header>
        <main>
          <GroupSections 
            columns={columns}
            data={data} 
            groups={[{ "columnId": "group" }]}>
            {(groupData) => (
              <div className="content">
                <Table data={groupData}
                  visibleColumns={visibleColumns}>
                  {columns.map((column, index) => (
                    <Column key={index} {...column} />
                  ))}
                </Table>
              </div>
            )}
          </GroupSections>
        </main>
      </div>
    </div>
  );
}