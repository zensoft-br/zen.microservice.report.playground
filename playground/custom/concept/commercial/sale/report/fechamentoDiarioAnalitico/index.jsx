import * as utils from "./utils.jsx";
import { Badge, getVisibleColumns, Table } from "./utils.jsx";

export default function ({ data = [], meta = {}, t }) {
  const { report = {} } = meta;

  const settings = utils.deepMerge(report?.properties?.["#settings"], report?.properties?.userSettings) ?? {};

  const columns = [
    { id: "group",
      header: null,
      width: "15ch",
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    { id: "topic",
      header: "Origem",
      width: "15ch",
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    { id: "quantity_today",
      header: "m",
      className: "number",
      width: "15ch",
      cell: ({ value }) => utils.formatNumber(value, { digits: 2 }),
      footerValue: ({ data }) => data.reduce((acc, row) => acc + row.quantity_today, 0),
      footer: ({ value }) => utils.formatNumber(value, { digits: 2 }),
    },
    {
      "id": "unitValue",
      "header": "R$/m",
      "className": "number",
      "width": "15ch",
      "cellValue": ({ row }) => row.totalValue_today / row.quantity_today,
      "cell": ({ value }) => utils.formatCurrency(value, { digits: 2 }),
    },
    { id: "totalValue_today",
      header: "R$",
      className: "number",
      width: "15ch",
      cell: ({ value }) => utils.formatCurrency(value, { digits: 2 }),
      footerValue: ({ data }) => data.reduce((acc, row) => acc + row.totalValue_today, 0),
      footer: ({ value }) => utils.formatCurrency(value, { digits: 2 }),
    },
    { id: "person_id",
      header: "Cliente, Id",
      width: "10ch",
    },
    { id: "person_name",
      header: "Cliente",
      width: "20ch",
    },
    { id: "manager_id",
      header: "Supervisor, Id",
      width: "10ch",
    },
    { id: "manager_code",
      header: "Supervisor",
      width: "20ch",
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    { id: "personSalesperson_id",
      header: "Vendedor, Id",
      width: "10ch",
    },
    { id: "personSalesperson_name",
      header: "Vendedor",
      width: "20ch",
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    { id: "product_id",
      header: "Produto, Id",
      width: "10ch",
    },
    { id: "product_code",
      header: "Produto, Código",
      width: "10ch",
    },
    { id: "product_description",
      header: "Produto, Nome",
      width: "25ch",
    },
  ];

  data = data.filter(row => row.quantity_today !== 0);

  data = utils.sort(data, [
    { "columnId": "index" }, 
    { "columnId": "index2" },
    { "columnId": "manager_code" },
    { "columnId": "personSalesperson_name" },
    { "columnId": "person_name" },
    { "columnId": "product_description" },
  ]);
  
  const groups = [
    { "columnId": "topic" },
    { "columnId": "manager_code" },
    { "columnId": "personSalesperson_name" },
    { "columnId": "person_name" },
  ];
  
  const visibleColumns = getVisibleColumns({
    availableColumns: columns.map(column => column.id),
    overrideColumns: [
      // "topic",
      // "manager_code",
      // "personSalesperson_name",
      // "person_name",
      "product_code",
      "product_description",
      "quantity_today",
      "unitValue",
      "totalValue_today",
    ],
    standardColumns:  [
      "person_id",
      "quantity_today",
      "totalValue_today",
    ],
    addColumns: report.properties?.showColumns?.split(","),
    removeColumns: report.properties?.hideColumns?.split(","),
  });

  return (
    <div className="report-wrapper" style={{ fontSize: settings?.fontSize }}>
      <div className="report-container a4 landscape">
        <header>
          <h1>Fechamento diário analítico</h1>
          <section className="parameters">
            <dl>
              <dt>Data</dt>
              <dd>{utils.formatDate(new Date())}</dd>
            </dl>
          </section>
        </header>
        <main>
          <div className="content">
            <Table
              columns={columns}
              visibleColumns={visibleColumns}
              data={data}
              groups={groups} />
          </div>
        </main>
      </div>
    </div>
  );
}