import * as utils from "./utils.jsx";
import { Badge, Column, GroupSections, Table } from "./utils.jsx";

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
  
  data = utils.group(data, report.properties?.settings?.groups || [], columns);
  
  const visibleColumns = report?.properties?.settings?.columns ?? report?.properties?.showColumns?.split(",");
  
  return (
    <div className="report-wrapper">
      <div className="report-container">
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
          <GroupSections 
            columns={columns}
            data={data} 
            groups={report.properties?.settings?.groups || []}>
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