import React from "react";
import * as utils from "./utils.js";

let showColumns = ["journalEntry", "balance"];

export default function ({ report = {}, data = [], t }) {
  const balance = data[0] ? data[0].balance + (data[0].sign === "DR" ? -data[0].debit : data[0].credit) : 0;
  const balance_sign = balance === 0 ? undefined : balance > 0 ? "DR" : "CR";

  if (report?.parameters?.showColumns) {
    showColumns = report.parameters.showColumns.split(",");
  }

  data = [
    {
      date: report?.parameters?.dateStart,
      description: t("/@word/balanceStart"),
      balance,
      balance_sign,
    }, 
    ...data,
  ];

  return (
    <div className="report-wrapper">
      <div className="report-container">
        <header>
          <h1>{t("/financial/accounting/report/ledger")}</h1>
          <section className="parameters">
            {report?.parameters?.dateStart && (
              <dl>
                <dt>{t("/@word/dateStart")}</dt>
                <dd>{utils.formatDate(report?.parameters?.dateStart)}</dd>
              </dl>
            )}
            {report?.parameters?.dateEnd && (
              <dl>
                <dt>{t("/@word/dateEnd")}</dt>
                <dd>{utils.formatDate(report?.parameters?.dateEnd)}</dd>
              </dl>
            )}
          </section>
        </header>
        <main>
          <div className="content">
            <span>{JSON.stringify(report)}</span>
            <table>
              <thead>
                <tr>
                  <th>{t("/@word/date")}</th>
                  {showColumn("journalEntry") && <th className="number">{t("/financial/accounting/journalEntry")}</th>}
                  {showColumn("account") && <th>{t("/financial/accounting/account")}</th>}
                  {showColumn("accountCounterpart") && <th>{t("/financial/accounting/ledgerItem.accountCounterpart")}</th>}
                  <th>{t("/@word/description")}</th>
                  <th className="number">{t("/financial/accounting/sign/enum/DR")}</th>
                  <th className="number">{t("/financial/accounting/sign/enum/CR")}</th>
                  {showColumn("balance") && <th className="number">{t("/@word/balance")}</th>}
                  {showColumn("balance") && <th></th>}
                  {showColumn("resultCenter") && <th>{t("/financial/accounting/resultCenter")}</th>}
                  {showColumn("person") && <th>{t("/catalog/person/person")}</th>}
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => {
                  const spacer = index > 0 && row.date !== data[index - 1].date;

                  return (
                    <React.Fragment key={index}>
                      {spacer && (
                        <tr className="spacer-row" style={{ height: "0.5em" }}>
                        </tr>
                      )}
        
                      <tr>
                        <td>{utils.formatDate(row.date)}</td>
                        {showColumn("journalEntry") && <td className="number">{utils.formatNumber(row.journal_entry_id)}</td>}
                        {showColumn("account") && <td className="digits">{row.account_code ? `${row.account_code}, ${row.account_description}` : undefined}</td>}
                        {showColumn("accountCounterpart") && <td className="digits">{row.account_counterpart_code ? `${row.account_counterpart_code}, ${row.account_counterpart_description}` : undefined}</td>}
                        <td>{row.description}</td>
                        <td className="number">{row.sign === "DR" ? utils.formatCurrency(row.debit) : undefined}</td>
                        <td className="number">{row.sign === "CR" ? utils.formatCurrency(row.credit) : undefined}</td>
                        {showColumn("balance") && <td className="number">{utils.formatCurrency(row.balance)}</td>}
                        {showColumn("balance") && <td>{row.balance === 0  ? " " : t(`/financial/accounting/sign/enum/${row.balance_sign}/sign`)}</td>}
                        {showColumn("resultCenter") && <td>{row.result_center_code ? `${row.result_center_code}, ${row.result_center_description}` : undefined}</td>}
                        {showColumn("person") && <td>{row.person_id ? `${row.person_id}, ${row.person_name}` : undefined}</td>}  
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td></td>
                  {showColumn("journalEntry") && <td className="number"></td>}
                  {showColumn("account") && <td className="digits"></td>}
                  {showColumn("accountCounterpart") && <td className="digits"></td>}
                  <td></td>
                  <td className="number">{utils.formatCurrency(data.reduce((red, row) => utils.round(red + (row.sign === "DR" ? row.debit : 0), 2), 0))}</td>  
                  <td className="number">{utils.formatCurrency(data.reduce((red, row) => utils.round(red + (row.sign === "CR" ? row.credit : 0), 2), 0))}</td>
                  {showColumn("balance") && <td className="number"></td>}
                  {showColumn("balance") && <td></td>}
                  {showColumn("resultCenter") && <td></td>}
                  {showColumn("person") && <td></td>}  
                </tr>
              </tfoot>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

function showColumn(column) {
  return showColumns.includes(column);
}