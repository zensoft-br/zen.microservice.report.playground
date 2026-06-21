import * as utils from "./utils.jsx";
import { Badge, Column, getVisibleColumns, GroupSections, Table } from "./utils.jsx";

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

  data = utils.sort(data, report.properties?.settings?.sort || []);
  
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

  const groups = report.properties?.settings?.groups || [];

  return (
    <div className="report-wrapper">
      <div className="report-container a4">
        <header>
          <h1>{report.title}</h1>
          <section className="parameters">
            {report.parameters?.dateStart &&
              <dl>
                <dt>{t("/@word/dateStart")}</dt>
                <dd>{utils.formatDate(report.parameters?.dateStart)}</dd>
              </dl>}
            {report.parameters?.dateEnd &&
            <dl>
              <dt>{t("/@word/dateEnd")}</dt>
              <dd>{utils.formatDate(report.parameters?.dateEnd)}</dd>
            </dl>}
          </section>
        </header>
        <main>
          <div className="content">
            <GroupTable
              columns={columns}
              visibleColumns={visibleColumns}
              data={data}
              groups={groups}
              t={t} />
          </div>
        </main>
      </div>
    </div>
  );
}