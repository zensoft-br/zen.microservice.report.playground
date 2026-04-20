import * as utils from "./utils.jsx";
import { Column, Table } from "./utils.jsx";

export default function ({ data = [], meta = {}, t }) {
  const { report = {} } = meta;

  // map by department
  const groupedData = data.reduce((acc, item) => {
    const dept = item.department || "Unknown";
    if (!acc[dept]) {
      acc[dept] = [];
    }
    acc[dept].push(item);
    return acc;
  }, {});

  return (
    <div className="report-wrapper">
      <div className="report-container">
        <header>
          <h1>{report.title}</h1>
          <section className="parameters">
            <dl>
              <dt>{t("/@word/dateStart")}</dt>
              <dd>{utils.formatDate(report.parameters?.dateStart)}</dd>
            </dl>
            <dl>
              <dt>{t("/@word/dateEnd")}</dt>
              <dd>{utils.formatDate(report.parameters?.dateEnd)}</dd>
            </dl>
          </section>
        </header>
        <main>
          {Object.entries(groupedData).map(([dept, items]) => (
            <section key={dept}>
              <header>
                <h2>{t("/@word/department")}: {dept}</h2>
              </header>
              <div className="content">
                <Table
                  data={items}
                  visibleColumns={["id", "name", "age"]}>
                  <Column id="id" header={t("/@word/id")} className="number" cell={({ value }) => utils.formatNumber(value)} />
                  <Column id="name" header={t("/@word/name")} />
                  <Column id="age" header={t("/@word/age")} className="number" cell={({ value }) => utils.formatNumber(value)} />
                  <Column id="department" header={t("/@word/department")} />
                </Table>
              </div>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}