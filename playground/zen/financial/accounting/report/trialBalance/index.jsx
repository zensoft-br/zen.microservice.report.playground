import * as utils from "./utils.jsx";
import { Badge, Table } from "./utils.jsx";

export default function ({ data = [], meta = {}, t }) {
  const { report = {} } = meta;

  const settings =
    utils.deepMerge(report?.properties?.["#settings"], report?.properties?.userSettings) ?? {};

  const fn = (value) => {
    if (value == 0) {
      return "";
    } else if (value > 0) {
      return "D";
    } else {
      return "C";
    }
  };

  const columns = [
    {
      id: "fin_acc_account_chart_code",
      width: "10ch",
      header: utils.cellHeader(t("/financial/accounting/accountChart")),
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "fin_acc_account_code",
      width: "10h",
      header: utils.cellHeader(t("/financial/accounting/account"), t("/@word/code")),
    },
    {
      id: "account_code_level_1",
      header: utils.cellHeader(t("/@word/group")),
      cellValue: ({ row }) => row.fin_acc_account_code?.split(".")[0],
      cell: ({ row }) => `${row.fin_acc_account_description}`,
    },
    {
      id: "fin_acc_account_description",
      width: "20ch",
      header: utils.cellHeader(t("/financial/accounting/account"), t("/@word/description")),
    },
    {
      id: "account_calc",
      width: "25ch",
      header: utils.cellHeader(t("/financial/accounting/account")),
      cell: ({ row }) => `${row.fin_acc_account_code}, ${row.fin_acc_account_description}`,
    },
    {
      id: "opening_balance",
      className: ({ value }) => `number CD ${fn(value)}`,
      width: "10ch",
      header: utils.cellHeader(t("/@word/balance/previous")),
      cell: ({ value }) => utils.formatNumber(Math.abs(value), { digits: 2 }),
    },
    {
      id: "debits",
      className: "number D",
      header: utils.cellHeader(t("/financial/accounting/sign/enum/DR/plural")),
      cell: ({ value }) => utils.formatNumber(value, { digits: 2 }),
    },
    {
      id: "credits",
      className: "number C",
      header: utils.cellHeader(t("/financial/accounting/sign/enum/CR/plural")),
      cell: ({ value }) => utils.formatNumber(value, { digits: 2 }),
    },
    {
      id: "delta",
      className: ({ value }) => `number CD ${fn(value)}`,
      header: utils.cellHeader(t("/financial/accounting/report/trialBalanceItem.delta")),
      cell: ({ value }) => utils.formatNumber(Math.abs(value), { digits: 2 }),
    },
    {
      id: "balance",
      className: ({ value }) => `number CD ${fn(value)}`,
      width: "10ch",
      header: utils.cellHeader(t("/@word/balance")),
      cell: ({ value }) => utils.formatNumber(Math.abs(value), { digits: 2 }),
    },
    {
      id: "result_center_calc",
      width: "15ch",
      header: utils.cellHeader(t("/financial/accounting/resultCenter")),
      cell: ({ row }) =>
        row.fin_acc_result_center_code
          ? `${row.fin_acc_result_center_code}, ${row.fin_acc_result_center_description}`
          : null,
    },
    {
      id: "cat_person_name",
      width: "15ch",
      header: utils.cellHeader(t("/catalog/person/person")),
    },
  ];

  const visibleColumns = settings?.columns ?? [];

  const groups = settings?.groups || [];

  data = utils.sort(data, settings?.sort || []);

  return (
    <div className="report-wrapper" style={{ fontSize: settings?.fontSize }}>
      <div className={`report-container ${settings?.pageSize ?? "a4"} ${settings?.orientation}`}>
        <header>
          <h1>{t("/financial/accounting/report/trialBalance")}</h1>
          <section className="parameters">
            {report.parameters?.society_desc && (
              <dl>
                <dt>{t("/catalog/company/society")}</dt>
                <dd>{report.parameters?.society_desc}</dd>
              </dl>
            )}
            {report.parameters?.company_desc && (
              <dl>
                <dt>{t("/catalog/company/company")}</dt>
                <dd>{report.parameters?.company_desc}</dd>
              </dl>
            )}
            {report.parameters?.person_desc && (
              <dl>
                <dt>{t("/catalog/person/person")}</dt>
                <dd>{report.parameters?.person_desc}</dd>
              </dl>
            )}
            {report.parameters?.resultCenter_desc && (
              <dl>
                <dt>{t("/financial/accounting/resultCenter")}</dt>
                <dd>{report.parameters?.resultCenter_desc}</dd>
              </dl>
            )}
            {report.parameters?.dateStart && (
              <dl>
                <dt>{t("/@word/dateStart")}</dt>
                <dd>{utils.formatDate(report.parameters?.dateStart)}</dd>
              </dl>
            )}
            {report.parameters?.dateEnd && (
              <dl>
                <dt>{t("/@word/dateEnd")}</dt>
                <dd>{utils.formatDate(report.parameters?.dateEnd)}</dd>
              </dl>
            )}
          </section>
        </header>
        <main>
          <div
            className="content"
            style={{
              "--credit": `'${t("/financial/accounting/sign/enum/CR/sign")}'`,
              "--debit": `'${t("/financial/accounting/sign/enum/DR/sign")}'`,
            }}
          >
            <Table columns={columns} visibleColumns={visibleColumns} data={data} groups={groups} />
          </div>
        </main>
      </div>
    </div>
  );
}
