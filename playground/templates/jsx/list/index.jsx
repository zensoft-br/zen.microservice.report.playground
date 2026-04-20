import React from "react";
import * as utils from "./utils.jsx";
import { Column, GroupSections, Table } from "./utils.jsx";

export default function ({ data = [], meta = {}, t }) {
  const { report = {} } = meta;

  const columns = [
    { id: "id",
      header: utils.cellHeader(t("/@word/id")),
      className: "number",
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({ data }) => data.length, 
      footer: ({ value }) => utils.formatNumber(value),
    },
    { id: "name",
      header: utils.cellHeader(t("/@word/name")),
    },
    { id: "age",
      header: utils.cellHeader(t("/@word/age")),
      className: "number",
      cell: ({ value }) => utils.formatNumber(value),
    },
    { id: "department",
      header: utils.cellHeader(t("/@word/department")), 
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
            {report.parameters?.dateStart && <dl>
              <dt>{t("/@word/dateStart")}</dt>
              <dd>{utils.formatDate(report.parameters?.dateStart)}</dd>
            </dl>}
            {report.parameters?.dateEnd && <dl>
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