import * as utils from "./utils.jsx";
import { Badge, getVisibleColumns, Table } from "./utils.jsx";

export default function ({ data = [], meta = {}, t }) {
  const { report = {} } = meta;

  const settings = utils.deepMerge(report?.properties?.["#settings"], report?.properties?.userSettings) ?? {};

  const columns = [
    {
      id: "id",
      className: "id",
      width: "8ch",
      header: utils.cellHeader(t("/@word/id")),
      cell: ({ value }) => utils.formatNumber(value),
    },
    {
      id: "flow",
      width: "8ch",
      header: utils.cellHeader(t("/@word/flow")),
    },
    {
      id: "type",
      width: "14ch",
      header: utils.cellHeader(t("/@word/type")),
      cell: ({ value }) => <Badge>{t(`/financial/billingTitleType/enum/${value}`)}</Badge>,
    },
    {
      id: "status",
      width: "12ch",
      header: utils.cellHeader(t("/@word/status")),
      cell: ({ value }) => <Badge>{t(`/financial/billingTitleStatus/enum/${value}`)}</Badge>,
    },
    {
      id: "code",
      width: "16ch",
      header: utils.cellHeader(t("/@word/code")),
      cell: ({ row, value }) => <Badge className="inverted" expression={row.invoice_id ?? row.id}>{value}</Badge>,
    },
    {
      id: "description",
      width: "24ch",
      header: utils.cellHeader(t("/@word/description")),
    },
    {
      id: "installment",
      width: "8ch",
      header: utils.cellHeader(t("/@word/installment")),
    },
    {
      id: "date",
      width: "10ch",
      header: utils.cellHeader(t("/@word/date")),
      cell: ({ value }) => utils.formatDate(value),
      footerValue: ({ data }) => getAverageDate(data.map((item) => ({ date: item.date, value: item.sum_value })))?.toISOString().substring(0, 10),
      footer: ({ value }) => utils.formatDate(value),
    },
    {
      id: "issueDate",
      width: "10ch",
      header: utils.cellHeader(t("/@word/issueDate")),
      cell: ({ value }) => utils.formatDate(value),
      footerValue: ({ data }) => getAverageDate(data.map((item) => ({ date: item.issueDate, value: item.sum_value })))?.toISOString().substring(0, 10),
      footer: ({ value }) => utils.formatDate(value),
    },
    {
      id: "dueDate",
      width: "10ch",
      header: utils.cellHeader(t("/@word/dueDate")),
      cell: ({ value }) => utils.formatDate(value),
      footerValue: ({ data }) => getAverageDate(data.map((item) => ({ date: item.dueDate, value: item.sum_value })))?.toISOString().substring(0, 10),
      footer: ({ value }) => utils.formatDate(value),
    },
    {
      id: "settlementDate",
      width: "10ch",
      header: utils.cellHeader(t("/@word/settlementDate")),
      cell: ({ value }) => utils.formatDate(value),
      footerValue: ({ data }) => getAverageDate(data.map((item) => ({ date: item.settlementDate, value: item.sum_value })))?.toISOString().substring(0, 10),
      footer: ({ value }) => utils.formatDate(value),
    },
    {
      id: "tags",
      width: "20ch",
      header: utils.cellHeader(t("/@word/tags")),
    },
    {
      id: "company_id",
      width: "8ch",
      header: utils.cellHeader(t("/catalog/company/company"), t("/@word/id")),
    },
    {
      id: "company_code",
      width: "12ch",
      header: utils.cellHeader(t("/catalog/company/company"), t("/@word/code")),
      cell: ({ value }) => <Badge>{value}</Badge>,
      footerValue: ({ data }) => data.reduce((red, e) => red.add(e.company_id), new Set()).size,
      footer: ({ value }) => value,
    },
    {
      id: "company_documentNumber",
      width: "18ch",
      header: utils.cellHeader(t("/catalog/company/company"), t("/@word/document")),
    },
    {
      id: "person_id",
      width: "8ch",
      header: utils.cellHeader(t("/catalog/person/person"), t("/@word/id")),
    },
    {
      id: "person_type",
      width: "12ch",
      header: utils.cellHeader(t("/catalog/person/person"), t("/@word/type")),
    },
    {
      id: "person_name",
      width: "24ch",
      header: utils.cellHeader(t("/catalog/person/person"), t("/@word/name")),
    },
    {
      id: "person_fantasyName",
      width: "24ch",
      header: utils.cellHeader(t("/catalog/person/person"), t("/@word/fantasyName")),
    },
    {
      id: "person_nameCalc",
      width: "24ch",
      header: utils.cellHeader(t("/catalog/person/person")),
      cellValue: ({ row }) => row.person_nameCalc,
      cell: ({ row, value }) => <><Badge>{row.person_documentNumber}</Badge> {value}</>,
    },
    {
      id: "person_documentType",
      width: "10ch",
      header: utils.cellHeader(t("/catalog/person/person"), t("/@word/documentType")),
    },
    {
      id: "person_documentNumber",
      width: "18ch",
      header: utils.cellHeader(t("/catalog/person/person"), t("/@word/documentNumber")),
    },
    {
      id: "person_email",
      width: "20ch",
      header: utils.cellHeader(t("/catalog/person/person"), t("/@word/email")),
    },
    {
      id: "person_phone",
      width: "16ch",
      header: utils.cellHeader(t("/catalog/person/person"), t("/@word/phone")),
    },
    {
      id: "person_city_name",
      width: "16ch",
      header: utils.cellHeader(t("/catalog/person/person"), t("/@word/city")),
    },
    {
      id: "person_state_code",
      width: "8ch",
      header: utils.cellHeader(t("/catalog/person/person"), t("/@word/state")),
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "personGroup_id",
      width: "8ch",
      header: utils.cellHeader(t("/catalog/person/personGroup"), t("/@word/id")),
    },
    {
      id: "personGroup_code",
      width: "12ch",
      header: utils.cellHeader(t("/catalog/person/personGroup"), t("/@word/code")),
      cell: ({ value }) => value && <Badge>{value}</Badge>,
    },
    {
      id: "payer_id",
      width: "8ch",
      header: utils.cellHeader(t("/financial/payer"), t("/@word/id")),
    },
    {
      id: "payer_name",
      width: "24ch",
      header: utils.cellHeader(t("/financial/payer"), t("/@word/name")),
    },
    {
      id: "invoice_id",
      width: "8ch",
      header: utils.cellHeader(t("/financial/invoice"), t("/@word/id")),
    },
    {
      id: "invoice_number",
      width: "12ch",
      header: utils.cellHeader(t("/financial/invoice"), t("/@word/number")),
    },

    // --- Fiscal Profile Operation ---
    {
      id: "fiscalProfileOperation_id",
      width: "8ch",
      header: utils.cellHeader(t("/fiscal/fiscalProfileOperation"), t("/@word/id")),
    },
    {
      id: "fiscalProfileOperation_code",
      width: "12ch",
      header: utils.cellHeader(t("/fiscal/fiscalProfileOperation"), t("/@word/code")),
    },

    // --- Account ---
    {
      id: "account_id",
      width: "8ch",
      header: utils.cellHeader(t("/financial/account"), t("/@word/id")),
    },
    {
      id: "account_code",
      width: "12ch",
      header: utils.cellHeader(t("/financial/account"), t("/@word/code")),
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "account_description",
      width: "20ch",
      header: utils.cellHeader(t("/financial/account"), t("/@word/description")),
    },

    // --- Account Counterpart ---
    {
      id: "accountCounterpart_id",
      width: "8ch",
      header: utils.cellHeader(t("/financial/accountCounterpart"), t("/@word/id")),
    },
    {
      id: "accountCounterpart_code",
      width: "12ch",
      header: utils.cellHeader(t("/financial/accountCounterpart"), t("/@word/code")),
      cell: ({ value }) => <Badge>{value}</Badge>,
    },

    // --- Financial Values & Totals ---
    {
      id: "sum_value",
      className: "number",
      width: "12ch",
      header: utils.cellHeader(t("/financial/billingTitle"), t("/@word/value")),
      cell: ({ value }) => utils.formatCurrency(value, { digits: 2 }),
      footerValue: ({ data }) => utils.sum(data, (item) => item.sum_value),
      footer: ({ value }) => utils.formatCurrency(value, { digits: 2 }),
    },
    {
      id: "sum_value_discount",
      className: "number",
      width: "12ch",
      header: utils.cellHeader(t("/financial/billingTitle"), t("/@word/discount")),
      cell: ({ value }) => utils.formatCurrency(value, { digits: 2 }),
      footerValue: ({ data }) => utils.sum(data, (item) => item.sum_value_discount),
      footer: ({ value }) => utils.formatCurrency(value, { digits: 2 }),
    },
    {
      id: "sum_value_addition",
      className: "number",
      width: "12ch",
      header: utils.cellHeader(t("/financial/billingTitle"), t("/@word/addition")),
      cell: ({ value }) => utils.formatCurrency(value, { digits: 2 }),
      footerValue: ({ data }) => utils.sum(data, (item) => item.sum_value_addition),
      footer: ({ value }) => utils.formatCurrency(value, { digits: 2 }),
    },
    {
      id: "sum_value_settlement",
      className: "number",
      width: "12ch",
      header: utils.cellHeader(t("/financial/billingTitle"), t("/@word/settlement")),
      cell: ({ value }) => utils.formatCurrency(value, { digits: 2 }),
      footerValue: ({ data }) => utils.sum(data, (item) => item.sum_value_settlement),
      footer: ({ value }) => utils.formatCurrency(value, { digits: 2 }),
    },
    {
      id: "sum_balance",
      className: "number",
      width: "12ch",
      header: utils.cellHeader(t("/financial/billingTitle"), t("/@word/balance")),
      cell: ({ value }) => utils.formatCurrency(value, { digits: 2 }),
      footerValue: ({ data }) => utils.sum(data, (item) => item.sum_balance),
      footer: ({ value }) => utils.formatCurrency(value, { digits: 2 }),
    },
    {
      id: "count",
      className: "number",
      width: "10ch",
      header: utils.cellHeader(t("/@word/count")),
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({ data }) => utils.sum(data, (item) => item.count),
      footer: ({ value }) => utils.formatNumber(value),
    },
  ];

  const visibleColumns = getVisibleColumns({
    availableColumns: columns.map(column => column.id),
    overrideColumns: report?.properties?.overrideColumns?.split(","),
    standardColumns: settings?.columns,
    addColumns: report?.properties?.showColumns?.split(","),
    removeColumns: report?.properties?.hideColumns?.split(","),
  });

  const groups = settings?.groups || [];

  data = utils.sort(data, settings?.sort || []);

  return (
    <div className="report-wrapper" style={{ fontSize: settings?.fontSize }}>
      <div className={`report-container ${report.properties?.pageSize ?? "a4"} ${report.properties?.orientation ?? "landscape"}`}>
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
          <div className="content">
            <Table
              columns={columns}
              visibleColumns={visibleColumns}
              data={data}
              groups={groups}
              footerTitle={t("/@word/summary")} />
          </div>
        </main>
      </div>
    </div>
  );
}

function getAverageDate(data) {
  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }

  let valueSum = 0;
  let timestampSum = 0;

  for (const { date, value } of data) {
    if (date == null || value == null) {
      continue;
    }

    const tempValue = parseFloat(value);
    const tempTimestamp = new Date(date).getTime();

    if (isNaN(tempTimestamp) || isNaN(tempValue) || tempValue <= 0) {
      continue;
    }

    timestampSum += tempTimestamp * tempValue;
    valueSum += tempValue;
  }

  if (valueSum === 0) {
    return null;
  }

  return new Date(timestampSum / valueSum);
}