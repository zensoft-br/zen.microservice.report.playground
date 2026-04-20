import React, { useMemo } from "react";
import * as utils from "./utils.jsx";

export default function ({ data: rawData = [], meta = {}, t }) {
  const { report = {} } = meta;
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

    return [
      {
        id: 0,
        date: report?.parameters?.DATE_START,
        description: t("/@word/balanceStart"),
        balance: initialBalance,
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
            {report?.parameters?.PERSON_GROUP_IDS && (
              <dl>
                <dt>{t("/catalog/person/personGroup")}</dt>
                <dd>{report?.parameters?.PERSON_GROUP_IDS_DESC ?? report?.parameters?.PERSON_GROUP_IDS.join(", ")}</dd>
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
                id="date"
                header={t("/@word/date")}
                cell={({ value }) => utils.formatDate(value)}
              />

              <Column
                id="journalEntry_id"
                header={t("/financial/accounting/journalEntry")}
                headerClassName="number"
                className="number"
                cell={({ row }) => utils.formatNumber(row.journal_entry_id)}
              />

              <Column
                id="account"
                ids={["account_id", "account_code", "account_description", "account_full_description"]}
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
                header={t("/financial/accounting/ledgerItem.accountCounterpart")}
                cell={({ row }) => [
                  showColumn("accountCounterpart_id") ? row.account_counterpart_id : null,
                  showColumn("accountCounterpart_code") ? row.account_counterpart_code : null,
                  showColumn("accountCounterpart_description") ? row.account_counterpart_description : null,
                  showColumn("accountCounterpart_full_description") ? row.account_counterpart_full_description : null,
                ].filter(Boolean).join(", ")}
              />

              <Column
                id="description"
                header={t("/@word/description")}
                style={{ maxWidth: "20em" }}
              />

              <Column
                id="debit"
                header={t("/financial/accounting/sign/enum/DR")}
                headerClassName="number"
                className={({ row, value }) => `number ${row ? getColor(nature, row?.sign, value) : (nature === "DR" ? "positive" : "negative")}`}
                cell={({ row, value }) => row.sign === "DR" ? utils.formatCurrency(value) : undefined}
                footerValue={({ data }) => data.reduce((red, row) => utils.round(red + (row.sign === "DR" ? row.debit : 0), 2), 0)}
                footer={({ value }) => utils.formatCurrency(value)}
              />

              <Column
                id="credit"
                header={t("/financial/accounting/sign/enum/CR")}
                headerClassName="number"
                className={({ row, value }) => `number ${row ? getColor(nature, row?.sign, value) : (nature === "CR" ? "positive" : "negative")}`}
                cell={({ row, value }) => row.sign === "CR" ? utils.formatCurrency(value) : undefined}
                footerValue={({ data }) => data.reduce((red, row) => utils.round(red + (row.sign === "CR" ? row.credit : 0), 2), 0)}
                footer={({ value }) => utils.formatCurrency(value)}
              />

              <Column
                id="balance"
                header={t("/@word/balance")}
                headerClassName="number"
                className={({ row, value }) => `number ${getColor(nature, row?.balance_sign, value)}`}
                cell={({ value }) => utils.formatCurrency(value)}
              />

              <Column
                id="balance_sign"
                ids={["balance"]}
                header=""
                visible={showColumn("balance")}
                className={({ row, value }) => `number ${getColor(nature, value, row?.balance)}`}
                cell={({ row, value }) => row.balance === 0 ? " " : t(`/financial/accounting/sign/enum/${value}/sign`)}
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
                ids={["person_id", "person_name", "person_fantasy_name", "person_name_calc"]}
                header={t("/catalog/person/person")}
                cell={({ row }) => [
                  showColumn("person_id") ? row.person_id : null,
                  showColumn("person_name") ? row.person_name : null,
                  showColumn("person_fantasy_name") ? row.person_fantasy_name : null,
                  showColumn("person_name_calc") ? row.person_name_calc : null,
                ].filter(Boolean).join(", ")}
              />

              <Column
                id="tags"
                header={t("/@word/tags")}
                cell={({ row }) => row.journal_entry_tags}
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

const Column = () => null;

const Table = ({ data, visibleColumns, children }) => {
  const columns = React.Children.toArray(children)
    .filter((child) => {
      if (!child) return false;
      if (child.props.visible != null) return child.props.visible;
      if (visibleColumns == null) return true;
      if (child.props.ids && visibleColumns) {
        return child.props.ids.some(id => visibleColumns.includes(id));
      }
      if (child.props.id && visibleColumns) {
        return visibleColumns.includes(child.props.id);
      }
      return false;
    })
    .sort((a, b) => {
      if (visibleColumns) {
        const getMinIndex = (props) => {
          const ids = props.ids || [props.id];
          const indices = ids.map(id => visibleColumns.indexOf(id)).filter(idx => idx !== -1);
          return indices.length > 0 ? Math.min(...indices) : Number.MAX_SAFE_INTEGER;
        };
        return getMinIndex(a.props) - getMinIndex(b.props);
      }
      return (a.props.order ?? 0) - (b.props.order ?? 0);
    });

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
            {columns.map((col, colIndex) => { 
              let value = undefined;
              if (typeof col.props.cellValue === "function") {
                value = col.props.cellValue(row);
              } else if (col.props.id) {
                value = row[col.props.id];
              }

              const context = { row, value };

              const className = typeof col.props.className === "function" 
                ? col.props.className(context)
                : col.props.className;
    
              return (
                <td key={colIndex} className={className} style={col.props.style}>
                  {col.props.cell 
                    ? col.props.cell(context) 
                    : (value ?? null)} 
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          {columns.map((col, i) => {
            let value = undefined;
            if (typeof col.props.footerValue === "function") {
              value = col.props.footerValue({ data });
            }

            const className = typeof col.props.className === "function" 
              ? col.props.className({ row: null, value })
              : col.props.className;

            return (
              <td key={i} className={className}>
                {col.props.footer ? col.props.footer({ data, value }) : null}
              </td>
            );
          })}
        </tr>
      </tfoot>
    </table>
  );
};