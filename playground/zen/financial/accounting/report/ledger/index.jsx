import { useMemo } from "react";
import * as utils from "./utils.jsx";
import { Column, GroupSections, Table } from "./utils.jsx";

export default function ({ data: rawData = [], meta = {}, t }) {
  const { report = {} } = meta;

  const nature = "DR";

  const visibleColumns = report?.properties?.settings?.columns ?? report?.properties?.showColumns?.split(",");
  const showColumn = (column) => {
    return visibleColumns?.includes(column);
  };

  const columns = [
    { id: "date",
      header: utils.cellHeader(t("/@word/date")),
      width: "10ch",
      cell: ({ value }) => utils.formatDate(value),
    },
    { id: "journalEntry_id",
      header: utils.cellHeader(t("/financial/accounting/journalEntry")),
      headerClassName: "number",
      width: "8ch",
      className: "number",
      cell: ({ row }) => utils.formatNumber(row.journalEntry_id),
    },
    { id: "account",
      ids: ["account_id", "account_code", "account_description", "account_fullDescription"],
      header: utils.cellHeader(t("/financial/accounting/account")),
      width: "24ch",
      cell: ({ row }) => [
        showColumn("account_id") ? row.account_id : null,
        showColumn("account_code") ? row.account_code : null,
        showColumn("account_description") ? row.account_description : null,
        showColumn("account_fullDescription") ? row.account_fullDescription : null,
      ].filter(Boolean).join(", "),
    },
    { id: "accountCounterpart",
      ids: ["accountCounterpart_id", "accountCounterpart_code", "accountCounterpart_description", "accountCounterpart_fullDescription"],
      header: utils.cellHeader(t("/financial/accounting/accountCounterpart")),
      width: "24ch",
      cell: ({ row }) => [
        showColumn("accountCounterpart_id") ? row.accountCounterpart_id : null,
        showColumn("accountCounterpart_code") ? row.accountCounterpart_code : null,
        showColumn("accountCounterpart_description") ? row.accountCounterpart_description : null,
        showColumn("accountCounterpart_fullDescription") ? row.accountCounterpart_fullDescription : null,
      ].filter(Boolean).join(", "),
    },
    { id: "description",
      header: utils.cellHeader(t("/@word/description")),
      width: "32ch",
    },
    { id: "debit",
      header: utils.cellHeader(t("/financial/accounting/sign/enum/DR")),
      headerClassName: "number",
      width: "16ch",
      className: () => `number ${getColor(nature, "DR")}`,
      cell: ({ row, value }) => row.sign === "DR" ? utils.formatCurrency(value) : undefined,
      footerValue: ({ data }) => data.reduce((red, row) => utils.round(red + (row.sign === "DR" ? row.debit : 0), 2), 0),
      footer: ({ value }) => utils.formatCurrency(value),
    },
    { id: "credit",
      header: utils.cellHeader(t("/financial/accounting/sign/enum/CR")),
      headerClassName: "number",
      width: "16ch",
      className: () => `number ${getColor(nature, "CR")}`,
      cell: ({ row, value }) => row.sign === "CR" ? utils.formatCurrency(value) : undefined,
      footerValue: ({ data }) => data.reduce((red, row) => utils.round(red + (row.sign === "CR" ? row.credit : 0), 2), 0),
      footer: ({ value }) => utils.formatCurrency(value),
    },
    { id: "balance",
      ids: ["balance", "balance_sign"],
      header: utils.cellHeader(t("/@word/balance")),
      headerClassName: "number",
      width: "16ch",
      className: ({ row, value }) => `number ${getColor(nature, row?.balance_sign, value)}`,
      cell: ({ row, value }) => utils.formatCurrency(value) + (row.balance === 0 ? "" : " " + t(`/financial/accounting/sign/enum/${row.balance_sign}/sign`)),
    },
    { id: "resultCenter",
      ids: ["resultCenter_id", "resultCenter_code", "resultCenter_description", "resultCenter_fullDescription"],
      header: utils.cellHeader(t("/financial/accounting/resultCenter")),
      width: "24ch",
      cell: ({ row }) => [
        showColumn("resultCenter_id") ? row.resultCenter_id : null,
        showColumn("resultCenter_code") ? row.resultCenter_code : null,
        showColumn("resultCenter_description") ? row.resultCenter_description : null,
        showColumn("resultCenter_fullDescription") ? row.resultCenter_fullDescription : null,
      ].filter(Boolean).join(", "),
    },
    { id: "person",
      ids: ["person_id", "person_name", "person_fantasyName", "person_nameCalc"],
      header: utils.cellHeader(t("/catalog/person/person")),
      width: "24ch",
      cell: ({ row }) => [
        showColumn("person_id") ? row.person_id : null,
        showColumn("person_name") ? row.person_name : null,
        showColumn("person_fantasyName") ? row.person_fantasyName : null,
        showColumn("person_nameCalc") ? row.person_nameCalc : null,
      ].filter(Boolean).join(", "),
    },
    { id: "tags",
      header: utils.cellHeader(t("/@word/tags")),
      width: "16ch",
      cell: ({ row }) => row.journalEntry_tags,
    },
  ];

  const data = useMemo(() => {
    const firstRow = rawData[0];
    const initialBalance = firstRow 
      ? (firstRow.balance_sign === "DR" ? firstRow.balance : -firstRow.balance) - (firstRow.sign === "DR" ? firstRow.debit : -firstRow.credit) 
      : 0;
    
    const balance_sign = initialBalance === 0 ? undefined : initialBalance > 0 ? "DR" : "CR";

    return [
      {
        id: 0,
        date: report?.parameters?.DATE_START,
        description: t("/@word/balanceStart"),
        balance: Math.abs(initialBalance),
        balance_sign,
      },
      ...rawData,
    ];
  }, [rawData, t]);

  return (
    <div className="report-wrapper">
      <div className="report-container" style={{ "width": report?.properties?.width }}>
        <header>
          <h1>{t("/financial/accounting/report/ledger")}</h1>
          <section className="parameters">
            {report?.parameters?.ACCOUNT_ID && 
              <dl>
                <dt>{t("/financial/accounting/account")}</dt>
                <dd>{report?.parameters?.ACCOUNT_ID_DESC ?? report?.parameters?.ACCOUNT_ID}</dd>
              </dl>}
            {report?.parameters?.ACCOUNT_CODE &&
              <dl>
                <dt>{t("/financial/accounting/account")}</dt>
                <dd>{report?.parameters?.ACCOUNT_CODE_DESC ?? report?.parameters?.ACCOUNT_CODE}</dd>
              </dl>
            }
            {report?.parameters?.DATE_START &&
              <dl>
                <dt>{t("/@word/dateStart")}</dt>
                <dd>{utils.formatDate(report?.parameters?.DATE_START)}</dd>
              </dl>
            }
            {report?.parameters?.DATE_END &&
              <dl>
                <dt>{t("/@word/dateEnd")}</dt>
                <dd>{utils.formatDate(report?.parameters?.DATE_END)}</dd>
              </dl>}
            {report?.parameters?.SOCIETY_IDS &&
              <dl>
                <dt>{t("/catalog/company/society")}</dt>
                <dd>{report?.parameters?.SOCIETY_IDS_DESC ?? report?.parameters?.SOCIETY_IDS.join(", ")}</dd>
              </dl>}
            {report?.parameters?.COMPANY_IDS &&
              <dl>
                <dt>{t("/catalog/company/company")}</dt>
                <dd>{report?.parameters?.COMPANY_IDS_DESC ?? report?.parameters?.COMPANY_IDS.join(", ")}</dd>
              </dl>}
            {report?.parameters?.RESULT_CENTER_IDS &&
              <dl>
                <dt>{t("/financial/accounting/resultCenter")}</dt>
                <dd>{report?.parameters?.RESULT_CENTER_IDS_DESC ?? report?.parameters?.RESULT_CENTER_IDS.join(", ")}</dd>
              </dl>}
            {report?.parameters?.PERSON_IDS &&
              <dl>
                <dt>{t("/catalog/person/person")}</dt>
                <dd>{report?.parameters?.PERSON_IDS_DESC ?? report?.parameters?.PERSON_IDS.join(", ")}</dd>
              </dl>}
            {report?.parameters?.PERSON_GROUP_IDS &&
              <dl>
                <dt>{t("/catalog/person/personGroup")}</dt>
                <dd>{report?.parameters?.PERSON_GROUP_IDS_DESC ?? report?.parameters?.PERSON_GROUP_IDS.join(", ")}</dd>
              </dl>}
            {report?.parameters?.TAGS &&
              <dl>
                <dt>{t("/@word/tags")}</dt>
                <dd>{report?.parameters?.TAGS.join(", ")}</dd>
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
};

function getColor(nature, sign, value) {
  if (value === 0) return undefined;

  if (nature === "DR") {
    return sign === "DR" ? "positive" : "negative";
  } else {
    return sign === "CR" ? "positive" : "negative";
  }
}
