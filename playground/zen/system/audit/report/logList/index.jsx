import * as utils from "./utils.jsx";
import { Table } from "./utils.jsx";

export default function ({ data = [], meta = {}, t }) {
  const { report = {} } = meta;

  data.forEach(log => {
    log.day = Number(log.dateTime?.substring(8, 10));
    log.month = Number(log.dateTime?.substring(5, 7));
    log.year = Number(log.dateTime?.substring(0, 4));
  });

  const settings = utils.deepMerge(report?.properties?.["#settings"], report?.properties?.userSettings) ?? {};

  const columns = [
    { id: "id",
      header: utils.cellHeader(t("/@word/id")),
      width: "8ch",
      className: "id",
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({ data }) => data.length,
      footer: ({ value }) => utils.formatNumber(value),
    },
    { id: "level",
      header: utils.cellHeader(t("/@word/level")),
      width: "16ch",
    },
    { id: "dateTime",
      header: utils.cellHeader(t("/@word/dateTime")),
      width: "16ch",
      cell: ({ value }) => utils.formatDateTime(value),
    },
    { id: "day",
      header: utils.cellHeader(t("/@word/day")),
      width: "8ch",
    },
    { id: "month",
      header: utils.cellHeader(t("/@word/month")),
      width: "8ch",
    },
    { id: "year",
      header: utils.cellHeader(t("/@word/year")),
      width: "8ch",
    },
    { id: "operation",
      header: utils.cellHeader(t("/system/audit/log.operation")),
      width: "20ch",
    },
    { id: "source",
      header: utils.cellHeader(t("/@word/source")),
      width: "20ch",
    },
    { id: "contentType",
      header: utils.cellHeader(t("/system/audit/log.contentType")),
      width: "16ch",
    },
    { id: "content",
      header: utils.cellHeader(t("/system/audit/log.content")),
      width: "32ch",
    },
    { id: "expiration",
      header: utils.cellHeader(t("/system/audit/log.expiration")),
      width: "16ch",
      cell: ({ value }) => utils.formatDateTime(value),
    },
    { id: "tags",
      header: utils.cellHeader(t("/@word/tags")),
      width: "16ch",
    },
    { id: "properties",
      header: utils.cellHeader(t("/@word/properties")),
      width: "24ch",
      cell: ({ value }) => value != null ? JSON.stringify(value) : null,
    },
    { id: "properties_ms",
      header: utils.cellHeader(t("/@word/time/ms")),
      width: "16ch",
    },
    { id: "session_id",
      header: utils.cellHeader(t("/system/security/session"), t("/@word/id")),
      width: "16ch",
      className: "id",
    },
    { id: "role_id",
      header: utils.cellHeader(t("/system/security/role"), t("/@word/id")),
      width: "8ch",
      className: "id",
      cell: ({ value }) => utils.formatNumber(value),
    },
    { id: "role_code",
      header: utils.cellHeader(t("/system/security/role"), t("/@word/code")),
      width: "16ch",
    },
    { id: "role_description",
      header: utils.cellHeader(t("/system/security/role"), t("/@word/description")),
      width: "24ch",
    },
    { id: "person_id",
      header: utils.cellHeader(t("/catalog/person/person"), t("/@word/id")),
      width: "8ch",
      className: "id",
      cell: ({ value }) => utils.formatNumber(value),
    },
    { id: "person_name",
      header: utils.cellHeader(t("/catalog/person/person"), t("/@word/name")),
      width: "24ch",
    },
    { id: "person_fantasyName",
      header: utils.cellHeader(t("/catalog/person/person"), t("/@word/fantasyName")),
      width: "16ch",
    },
    { id: "person_nameCalc",
      header: utils.cellHeader(t("/catalog/person/person"), t("/@word/nameCalc")),
      width: "16ch",
    },
  ];

  data = utils.sort(data, report.properties?.settings?.sort || []);

  const visibleColumns = report?.properties?.settings?.columns ?? report?.properties?.showColumns?.split(",");

  const groups = report.properties?.settings?.groups || [];

  return (
    <div className="report-wrapper" style={{ fontSize: report.properties?.fontSize }}>
      <div className="report-container">
        <header>
          <h1>{t("/system/audit/report/logList")}</h1>
          <section className="parameters">
            {report.parameters?.DATETIME_START && <dl>
              <dt>{t("/@word/dateTimeStart")}</dt>
              <dd>{utils.formatDate(report.parameters.DATETIME_START)}</dd>
            </dl>}
            {report.parameters?.DATETIME_END && <dl>
              <dt>{t("/@word/dateTimeEnd")}</dt>
              <dd>{utils.formatDate(report.parameters.DATETIME_END)}</dd>
            </dl>}
            {report.parameters?.EXPIRATION_START && <dl>
              <dt>{t("/@word/expirationDateStart")}</dt>
              <dd>{utils.formatDate(report.parameters.EXPIRATION_START)}</dd>
            </dl>}
            {report.parameters?.EXPIRATION_END && <dl>
              <dt>{t("/@word/expirationDateEnd")}</dt>
              <dd>{utils.formatDate(report.parameters.EXPIRATION_END)}</dd>
            </dl>}
            {report.parameters?.SESSION_IDS_DESC && <dl>
              <dt>{t("/system/security/session/plural")}</dt>
              <dd>{report.parameters.SESSION_IDS_DESC}</dd>
            </dl>}
            {report.parameters?.ROLE_IDS_DESC && <dl>
              <dt>{t("/system/security/role/plural")}</dt>
              <dd>{report.parameters.ROLE_IDS_DESC}</dd>
            </dl>}
            {report.parameters?.LEVEL_LIST && <dl>
              <dt>{t("/@word/level")}</dt>
              <dd>{report.parameters.LEVEL_LIST}</dd>
            </dl>}
            {report.parameters?.TAGS_LIST && <dl>
              <dt>{t("/@word/tags")}</dt>
              <dd>{report.parameters.TAGS_LIST}</dd>
            </dl>}
            {report.parameters?.OPERATION && <dl>
              <dt>{t("/system/audit/log.operation")}</dt>
              <dd>{report.parameters.OPERATION}</dd>
            </dl>}
            {report.parameters?.SOURCE && <dl>
              <dt>{t("/@word/source")}</dt>
              <dd>{report.parameters.SOURCE}</dd>
            </dl>}
            {report.parameters?.LIMIT && <dl>
              <dt>{t("/@word/limit")}</dt>
              <dd>{report.parameters.LIMIT}</dd>
            </dl>}
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
