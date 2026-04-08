import { useMemo } from "react";
import * as utils from "./utils.jsx";
import { Column, Table } from "./utils.jsx";

export default function ({ report = {}, data: rawData = [], t }) {
  const nature = "DR";

  let showColumns = undefined;
  if (report?.parameters?.showColumns) {
    showColumns = report.parameters.showColumns.split(",");
  }
  const showColumn = (column) => {
    return showColumns?.includes(column);
  };

  const data = useMemo(() => {
    const firstRow = rawData[0];
    const initialBalance = firstRow 
      ? firstRow.balance + (firstRow.sign === "DR" ? -firstRow.debit : firstRow.credit) 
      : 0;
    
    const balance_sign = initialBalance === 0 ? undefined : initialBalance > 0 ? "DR" : "CR";

    const result = [
      {
        id: 0,
        date: report?.parameters?.DATE_START,
        description: t("/@word/balanceStart"),
        runningBalance: 0,
        balance_sign,
      },
      ...rawData,
    ];

    let currentRunningBalance = 0;

    result.sort((a, b) => {
      var i = new Date(a.date) - new Date(b.date);
      if (i === 0) {
        i = a.id - b.id;
      }
    });

    result.forEach((row) => {
      const amount = row.sign === "DR" ? (row.sum_value_dr || 0) : -(row.sum_value_cr || 0);
      currentRunningBalance = utils.round(currentRunningBalance + amount, 2);

      row.runningBalance = currentRunningBalance;
      row.balance_sign = currentRunningBalance === 0 ? undefined : currentRunningBalance > 0 ? "DR" : "CR";
    });

    return result;
  }, [rawData, t]);

  return (
    <div className="report-wrapper">
      <div className="report-container" style={{ "width": report?.properties?.width }}>
        <header>
          <h1>{t("/financial/accounting/report/journalEntryList")}</h1>
          <section className="parameters">
            {report?.parameters?.ACCOUNT_ID && (
              <dl>
                <dt>{t("/financial/accounting/account")}</dt>
                <dd>{report?.parameters?.ACCOUNT_ID_DESC ?? report?.parameters?.ACCOUNT_ID}</dd>
              </dl>
            )}
            {report?.parameters?.ACCOUNT_CODE && (
              <dl>
                <dt>{t("/financial/accounting/account")}</dt>
                <dd>{report?.parameters?.ACCOUNT_CODE_DESC ?? report?.parameters?.ACCOUNT_CODE}</dd>
              </dl>
            )}
            {report?.parameters?.DATE_START && (
              <dl>
                <dt>{t("/@word/dateStart")}</dt>
                <dd>{utils.formatDate(report?.parameters?.DATE_START)}</dd>
              </dl>
            )}
            {report?.parameters?.DATE_END && (
              <dl>
                <dt>{t("/@word/dateEnd")}</dt>
                <dd>{utils.formatDate(report?.parameters?.DATE_END)}</dd>
              </dl>
            )}
            {report?.parameters?.SOCIETY_IDS && (
              <dl>
                <dt>{t("/catalog/company/society")}</dt>
                <dd>{report?.parameters?.SOCIETY_IDS_DESC ?? report?.parameters?.SOCIETY_IDS.join(", ")}</dd>
              </dl>
            )}
            {report?.parameters?.COMPANY_IDS && (
              <dl>
                <dt>{t("/catalog/company/company")}</dt>
                <dd>{report?.parameters?.COMPANY_IDS_DESC ?? report?.parameters?.COMPANY_IDS.join(", ")}</dd>
              </dl>
            )}
            {report?.parameters?.RESULT_CENTER_IDS && (
              <dl>
                <dt>{t("/financial/accounting/resultCenter")}</dt>
                <dd>{report?.parameters?.RESULT_CENTER_IDS_DESC ?? report?.parameters?.RESULT_CENTER_IDS.join(", ")}</dd>
              </dl>
            )}
            {report?.parameters?.PERSON_IDS && (
              <dl>
                <dt>{t("/catalog/person/person")}</dt>
                <dd>{report?.parameters?.PERSON_IDS_DESC ?? report?.parameters?.PERSON_IDS.join(", ")}</dd>
              </dl>
            )}
            {report?.parameters?.TAGS && (
              <dl>
                <dt>{t("/@word/tags")}</dt>
                <dd>{report?.parameters?.TAGS.join(", ")}</dd>
              </dl>
            )}
          </section>
        </header>
        <main>
          <div className="content">
            <Table data={data}
              visibleColumns={showColumns}>
              <Column
                id="id"
                header={t("/@word/id")}
                headerClassName="number"
                className="number"
                cell={({ value }) => utils.formatNumber(value)}
              />

              <Column
                id="date"
                header={t("/@word/date")}
                cell={({ value }) => utils.formatDate(value)}
              />

              <Column
                id="description"
                style={{ maxWidth: "20em" }}
                header={t("/@word/description")}
              />

              <Column
                id="item_id"
                header={t("/@word/id")}
                headerClassName="number"
                className="number"
                cell={({ value }) => utils.formatNumber(value)}
              />

              <Column
                id="sign"
                header={t("/@word/sign")}
                cell={({ value }) => value ? t(`/financial/accounting/sign/enum/${value}/sign`) : null}
              />

              <Column
                id="society"
                ids={["society_id", "society_code", "society_description"]}
                header={t("/catalog/company/society")}
                cell={({ row }) => [
                  showColumn("society_id") ? row.society_id : null,
                  showColumn("society_code") ? row.society_code : null,
                  showColumn("society_description") ? row.society_description : null,
                ].filter(Boolean).join(", ")}
              />

              <Column
                id="company"
                ids={["company_id", "company_code", "company_name", "company_fantasyName", "company_nameCalc"]}
                header={t("/catalog/company/company")}
                cell={({ row }) => [
                  showColumn("company_id") ? row.company_id : null,
                  showColumn("company_code") ? row.company_code : null,
                  showColumn("company_name") ? row.company_name : null,
                  showColumn("company_fantasyName") ? row.company_fantasyName : null,
                  showColumn("company_nameCalc") ? row.company_nameCalc : null,
                ].filter(Boolean).join(", ")}
              />

              <Column
                id="account"
                ids={["account_id", "account_code", "account_description", "account_full_description"]}
                style={{ maxWidth: "15em" }}
                header={t("/financial/accounting/account")}
                cell={({ row }) => [
                  showColumn("account_id") ? row.account_id : null,
                  showColumn("account_code") ? row.account_code : null,
                  showColumn("account_description") ? row.account_description : null,
                  showColumn("account_full_description") ? row.account_full_description : null,
                ].filter(Boolean).join(", ")}
              />

              <Column
                id="accountCounterpart"
                ids={["accountCounterpart_id", "accountCounterpart_code", "accountCounterpart_description", "accountCounterpart_full_description"]}
                style={{ maxWidth: "15em" }}
                header={t("/financial/accounting/accountCounterpart")}
                cell={({ row }) => [
                  showColumn("accountCounterpart_id") ? row.accountCounterpart_id : null,
                  showColumn("accountCounterpart_code") ? row.accountCounterpart_code : null,
                  showColumn("accountCounterpart_description") ? row.accountCounterpart_description : null,
                  showColumn("accountCounterpart_full_description") ? row.accountCounterpart_fullDescription : null,
                ].filter(Boolean).join(", ")}
              />

              <Column
                id="resultCenter"
                ids={["resultCenter_id", "resultCenter_code", "resultCenter_description", "resultCenter_full_description"]}
                header={t("/financial/accounting/resultCenter")}
                cell={({ row }) => [
                  showColumn("resultCenter_id") ? row.result_center_id : null,
                  showColumn("resultCenter_code") ? row.result_center_code : null,
                  showColumn("resultCenter_description") ? row.result_center_description : null,
                  showColumn("resultCenter_full_description") ? row.result_center_full_description : null,
                ].filter(Boolean).join(", ")}
              />

              <Column
                id="person"
                ids={["person_id", "person_name", "person_fantasyName", "person_nameCalc"]}
                header={t("/catalog/person/person")}
                cell={({ row }) => [
                  showColumn("person_id") ? row.person_id : null,
                  showColumn("person_name") ? row.person_name : null,
                  showColumn("person_fantasyName") ? row.person_fantasyName : null,
                  showColumn("person_nameCalc") ? row.person_nameCalc : null,
                ].filter(Boolean).join(", ")}
              />

              <Column
                id="count_dr"
                header={`${t("/@word/count")}, ${t("/financial/accounting/sign/enum/DR")}`}
                headerClassName="number"
                className="number"
                cell={({ value }) => utils.formatNumber(value)}
                footerValue={({ data }) => data.reduce((red, row) => utils.round(red + (row.sign === "DR" ? row.count_dr : 0), 2), 0)}
                footer={({ value }) => utils.formatNumber(value)}
              />

              <Column
                id="count_cr"
                header={`${t("/@word/count")}, ${t("/financial/accounting/sign/enum/CR")}`}
                headerClassName="number"
                className="number"
                cell={({ value }) => utils.formatNumber(value)}
                footerValue={({ data }) => data.reduce((red, row) => utils.round(red + (row.sign === "CR" ? row.count_cr : 0), 2), 0)}
                footer={({ value }) => utils.formatNumber(value)}
              />

              <Column
                id="sum_value_dr"
                header={t("/financial/accounting/sign/enum/DR")}
                headerClassName="number"
                className={({ row, value }) => `number ${row ? getColor(nature, row?.sign, value) : (nature === "DR" ? "positive" : "negative")}`}
                cell={({ row, value }) => row.sign === "DR" ? utils.formatCurrency(value) : undefined}
                footerValue={({ data }) => data.reduce((red, row) => utils.round(red + (row.sign === "DR" ? row.sum_value_dr : 0), 2), 0)}
                footer={({ value }) => utils.formatCurrency(value)}
              />

              <Column
                id="sum_value_cr"
                header={t("/financial/accounting/sign/enum/CR")}
                headerClassName="number"
                className={({ row, value }) => `number ${row ? getColor(nature, row?.sign, value) : (nature === "CR" ? "positive" : "negative")}`}
                cell={({ row, value }) => row.sign === "CR" ? utils.formatCurrency(value) : undefined}
                footerValue={({ data }) => data.reduce((red, row) => utils.round(red + (row.sign === "CR" ? row.sum_value_cr : 0), 2), 0)}
                footer={({ value }) => utils.formatCurrency(value)}
              />

              <Column
                id="runningBalance"
                header={t("/@word/runningBalance")}
                headerClassName="number"
                className={({ row, value }) => `number ${getColor(nature, row?.balance_sign, value)}`}
                cell={({ row, value }) => `${utils.formatCurrency(Math.abs(value))}${row.balance_sign ? "\u00A0" + t(`/financial/accounting/sign/enum/${row.balance_sign}/sign`) : ""}`}
              />

              <Column
                id="tags"
                header={t("/@word/tags")}
              />
            </Table>
          </div>
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
