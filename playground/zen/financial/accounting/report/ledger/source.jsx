import React from "react";
import * as utils from "./utils.js";

let showColumns = undefined;

export default function ({ report = {}, data = [], t }) {
  const nature = "DR";
  const balance = data[0] ? data[0].balance + (data[0].sign === "DR" ? -data[0].debit : data[0].credit) : 0;
  const balance_sign = balance === 0 ? undefined : balance > 0 ? "DR" : "CR";

  if (report?.parameters?.showColumns) {
    showColumns = report.parameters.showColumns.split(",");
  }

  data = [
    {
      date: report?.parameters?.DATE_START,
      description: t("/@word/balanceStart"),
      balance,
      balance_sign,
    }, 
    ...data,
  ];

  return (
    <div className="report-wrapper">
      <div className="report-container" style={{ "width": report?.properties?.width }}>
        <header>
          <h1>{t("/financial/accounting/report/ledger")}</h1>
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
            <table>
              <thead>
                <tr>
                  {showColumn("date") && <th>{t("/@word/date")}</th>}
                  {showColumn("journalEntry_id") && <th className="number">{t("/financial/accounting/journalEntry")}</th>}
                  {(showColumn("account_id") || showColumn("account_code") || showColumn("account_description") || showColumn("account_full_description")) && <th>{t("/financial/accounting/account")}</th>}
                  {(showColumn("accountCounterpart_id") || showColumn("accountCounterpart_code") || showColumn("accountCounterpart_description") || showColumn("accountCounterpart_full_description")) && <th>{t("/financial/accounting/ledgerItem.accountCounterpart")}</th>}
                  {showColumn("description") && <th>{t("/@word/description")}</th>}
                  {showColumn("debit") && <th className="number">{t("/financial/accounting/sign/enum/DR")}</th>}
                  {showColumn("credit") && <th className="number">{t("/financial/accounting/sign/enum/CR")}</th>}
                  {showColumn("balance") && <th className="number">{t("/@word/balance")}</th>}
                  {showColumn("balance") && <th></th>}
                  {(showColumn("resultCenter_id") || showColumn("resultCenter_code") || showColumn("resultCenter_description") || showColumn("resultCenter_full_description")) && <th>{t("/financial/accounting/resultCenter")}</th>}
                  {(showColumn("person_id") || showColumn("person_name") || showColumn("person_fantasy_name") || showColumn("person_name_calc")) && <th>{t("/catalog/person/person")}</th>}
                  {showColumn("tags") && <th>{t("/@word/tags")}</th>}
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => {
                  // const spacer = index > 0 && row.date !== data[index - 1].date;

                  return (
                    <React.Fragment key={index}>
                      {/* {spacer && (
                        <tr className="spacer-row" style={{ height: "0.5em" }}>
                        </tr>
                      )} */}
        
                      <tr>
                        {showColumn("date") && <td>{utils.formatDate(row.date)}</td>}
                        {showColumn("journalEntry_id") && <td className="number">{utils.formatNumber(row.journal_entry_id)}</td>}
                        {(showColumn("account_id") || showColumn("account_code") || showColumn("account_description") || showColumn("account_full_description")) && 
                          <td>{[
                            showColumn("account_id") ? row.account_id : null, 
                            showColumn("account_code") ? row.account_code : null, 
                            showColumn("account_description") ? row.account_description : null,
                            showColumn("account_full_description") ? row.account_full_description : null,
                          ].filter(Boolean).join(", ")}</td>}
                        {(showColumn("accountCounterpart_id") || showColumn("accountCounterpart_code") || showColumn("accountCounterpart_description") || showColumn("accountCounterpart_full_description")) && 
                          <td>{[
                            showColumn("accountCounterpart_id") ? row.account_counterpart_id : null, 
                            showColumn("accountCounterpart_code") ? row.account_counterpart_code : null, 
                            showColumn("accountCounterpart_description") ? row.account_counterpart_description : null,
                            showColumn("accountCounterpart_full_description") ? row.account_counterpart_full_description : null,
                          ].filter(Boolean).join(", ")}</td>}
                        {showColumn("accountCounterpart") && <td className="digits">{row.account_counterpart_code ? `${row.account_counterpart_code}, ${row.account_counterpart_description}` : undefined}</td>}
                        {showColumn("description") && <td style={{ maxWidth: "20em" }}>{row.description}</td>}
                        {showColumn("debit") && <td className={`number ${getColor(nature, row.sign, row.debit)}`}>{row.sign === "DR" ? utils.formatCurrency(row.debit) : undefined}</td>}
                        {showColumn("credit") && <td className={`number ${getColor(nature, row.sign, row.credit)}`}>{row.sign === "CR" ? utils.formatCurrency(row.credit) : undefined}</td>}
                        {showColumn("balance") && <td className={`number ${getColor(nature, row.balance_sign, row.balance)}`}>{utils.formatCurrency(row.balance)}</td>}
                        {showColumn("balance") && <td className={`number ${getColor(nature, row.balance_sign, row.balance)}`}>{row.balance === 0  ? " " : t(`/financial/accounting/sign/enum/${row.balance_sign}/sign`)}</td>}
                        {(showColumn("resultCenter_id") || showColumn("resultCenter_code") || showColumn("resultCenter_description") || showColumn("resultCenter_full_description")) && 
                          <td>{[
                            showColumn("resultCenter_id") ? row.result_center_id : null, 
                            showColumn("resultCenter_code") ? row.result_center_code : null, 
                            showColumn("resultCenter_description") ? row.result_center_description : null,
                            showColumn("resultCenter_full_description") ? row.result_center_full_description : null,
                          ].filter(Boolean).join(", ")}</td>}
                        {(showColumn("person_id") || showColumn("person_name") || showColumn("person_fantasy_name") || showColumn("person_name_calc")) &&
                          <td>{[
                            showColumn("person_id") ? row.person_id : null,
                            showColumn("person_name") ? row.person_name : null,
                            showColumn("person_fantasy_name") ? row.person_fantasy_name : null,
                            showColumn("person_name_calc") ? row.person_name_calc : null,
                          ].filter(Boolean).join(", ")}</td>}
                        {showColumn("tags") && <td>{row.journal_entry_tags}</td>}
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  {showColumn("date") && <td ></td>}
                  {showColumn("journalEntry_id") && <td className="number"></td>}
                  {(showColumn("account_id") || showColumn("account_code") || showColumn("account_description") || showColumn("account_full_description")) && <td></td>}
                  {(showColumn("accountCounterpart_id") || showColumn("accountCounterpart_code") || showColumn("accountCounterpart_description") || showColumn("accountCounterpart_full_description")) && <td></td>}
                  {showColumn("description") && <td></td>}
                  {showColumn("debit") && <td className={`number ${nature === "DR" ? "positive" : "negative"}`}>{utils.formatCurrency(data.reduce((red, row) => utils.round(red + (row.sign === "DR" ? row.debit : 0), 2), 0))}</td>}  
                  {showColumn("credit") && <td className={`number ${nature === "CR" ? "positive" : "negative"}`}>{utils.formatCurrency(data.reduce((red, row) => utils.round(red + (row.sign === "CR" ? row.credit : 0), 2), 0))}</td>}
                  {showColumn("balance") && <td className="number"></td>}
                  {showColumn("balance") && <td></td>}
                  {(showColumn("resultCenter_id") || showColumn("resultCenter_code") || showColumn("resultCenter_description") || showColumn("resultCenter_full_description")) && <td></td>}
                  {(showColumn("person_id") || showColumn("person_name") || showColumn("person_fantasy_name") || showColumn("person_name_calc")) && <td></td>}
                  {showColumn("tags") && <td></td>}
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
  return showColumns?.includes(column);
}

function getColor(nature, sign, value) {
  if (value === 0) return undefined;

  if (nature === "DR") {
    return sign === "DR" ? "positive" : "negative";
  } else {
    return sign === "CR" ? "positive" : "negative";
  }
}

const Column = () => null;

const DataTable = ({ data, children }) => {
  const columns = React.Children.toArray(children)
    .filter((child) => child.props.visible !== false)
    .sort((a, b) => (a.props.order ?? Number.MAX_SAFE_INTEGER) - (b.props.order ?? Number.MAX_SAFE_INTEGER));

  return (
    <table>
      <thead>
        <tr>
          {columns.map((col, i) => (
            <th key={i} className={col.props.headerClassName}>
              {col.props.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map((col, colIndex) => (
              <td key={colIndex} className={col.props.className}>
                {col.props.cell ? col.props.cell(row) : null}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          {columns.map((col, i) => (
            <td key={i} className={col.props.className}>
              {col.props.footer ? col.props.footer(data) : null}
            </td>
          ))}
        </tr>
      </tfoot>
    </table>
  );
};