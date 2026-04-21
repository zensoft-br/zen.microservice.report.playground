import * as utils from "./utils.jsx";
import { Badge, Column, GroupSections, Table } from "./utils.jsx";

export default function ({ data = [], meta = {}, t }) {
  const { report = {} } = meta;

  const columns = [
    { id: "id",
      header: utils.cellHeader(t("/@word/id")),
      width: "8ch",
      className: "number", 
      cell: ({ value }) => utils.formatNumber(value), 
      footerValue: ({ data }) => data.length, 
      footer: ({ value }) => utils.formatNumber(value),
    },
    { id: "status", 
      header: utils.cellHeader(t("/@word/status")),
      width: "16ch",
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    { id: "code", 
      header: utils.cellHeader(t("/@word/code")),
      width: "16ch",
    },
    { id: "date", 
      header: utils.cellHeader(t("/@word/date")), 
      width: "10ch",
      cell: ({ value }) => utils.formatDate(value),
    },
    { id: "availabilityDate", 
      header: utils.cellHeader(t("/@word/availabilityDate")), 
      width: "10ch",
      cell: ({ value }) => utils.formatDate(value),
    },
    { id: "company_id", 
      header: utils.cellHeader(t("/catalog/company/company"), t("/@word/id")), 
      width: "8ch",
      className: "number", 
      cell: ({ value }) => utils.formatNumber(value),
    },
    { id: "company_code", 
      header: utils.cellHeader(t("/catalog/company/company"), t("/@word/code")),
      width: "16ch",
    },
    { id: "company_name", 
      header: utils.cellHeader(t("/catalog/company/company"), t("/@word/name")),
      width: "24ch",
    },
    { id: "company_fantasyName", 
      header: utils.cellHeader(t("/catalog/company/company"), t("/@word/fantasyName")),
      width: "24ch",
    },
    { id: "company_nameCalc", 
      header: utils.cellHeader(t("/catalog/company/company"), t("/@word/nameCalc")),
      width: "24ch",
    },
    { id: "person_id", 
      header: utils.cellHeader(t("/catalog/person/person"), t("/@word/id")), 
      width: "8ch",
      className: "number",
      cell: ({ value }) => utils.formatNumber(value),
    },
    { id: "person_name", 
      header: utils.cellHeader(t("/catalog/person/person"), t("/@word/name")),
      width: "24ch",
    },
    { id: "person_fantasyName", 
      header: utils.cellHeader(t("/catalog/person/person"), t("/@word/fantasyName")),
      width: "24ch",
    },
    { id: "person_nameCalc", 
      header: utils.cellHeader(t("/catalog/person/person"), t("/@word/nameCalc")),
      width: "24ch",
    },
    { id: "product_id", 
      header: utils.cellHeader(t("/catalog/product/product"), t("/@word/id")), 
      width: "8ch",
      className: "number",
      cell: ({ value }) => utils.formatNumber(value),
    },
    { id: "product_code", 
      header: utils.cellHeader(t("/catalog/product/product"), t("/@word/code")),
      width: "16ch",
    },
    { id: "product_description", 
      header: utils.cellHeader(t("/catalog/product/product"), t("/@word/description")),
      width: "24ch",
    },
    { id: "product_complement", 
      header: utils.cellHeader(t("/catalog/product/product"), t("/@word/complement")),
      width: "16ch",
    },
    { id: "productProfile_id", 
      header: utils.cellHeader(t("/catalog/product/productProfile"), t("/@word/id")), 
      width: "8ch",
      className: "number",
      cell: ({ value }) => utils.formatNumber(value),
    },
    { id: "productProfile_code", 
      header: utils.cellHeader(t("/catalog/product/productProfile"), t("/@word/code")),
      width: "16ch",
    },
    { id: "productProfile_description", 
      header: utils.cellHeader(t("/catalog/product/productProfile"), t("/@word/description")),
      width: "24ch",
    },
    { id: "unit_id", 
      header: utils.cellHeader(t("/catalog/product/unit"), t("/@word/id")), 
      width: "8ch",
      className: "number",
      cell: ({ value }) => utils.formatNumber(value),
    },
    { id: "unit_code", 
      header: utils.cellHeader(t("/catalog/product/unit"), t("/@word/code")),
      width: "8ch",
    },
    { id: "productPacking_id", 
      header: utils.cellHeader(t("/catalog/product/productPacking"), t("/@word/id")), 
      width: "8ch",
      className: "number",
      cell: ({ value }) => utils.formatNumber(value),
    },
    { id: "productPacking_code", 
      header: utils.cellHeader(t("/catalog/product/productPacking"), t("/@word/code")),
      width: "16ch",
    },
    { id: "productPacking_complement", 
      header: utils.cellHeader(t("/catalog/product/productPacking"), t("/@word/complement")),
      width: "16ch",
    },
    { id: "productPacking_units", 
      header: utils.cellHeader(t("/catalog/product/productPacking"), t("/@word/units")), 
      width: "8ch",
      className: "number",
      cell: ({ value }) => utils.formatNumber(value),
    },
    { id: "productVariant_id", 
      header: utils.cellHeader(t("/catalog/product/productVariant"), t("/@word/id")), 
      width: "8ch",
      className: "number",
      cell: ({ value }) => utils.formatNumber(value),
    },
    { id: "productVariant_code", 
      header: utils.cellHeader(t("/catalog/product/productVariant"), t("/@word/code")),
      width: "16ch",
    },
    { id: "productVariant_description", 
      header: utils.cellHeader(t("/catalog/product/productVariant"), t("/@word/description")),
      width: "24ch",
    },
    { id: "sum_quantity", 
      header: utils.cellHeader(t("/@word/quantity")), 
      width: "16ch",
      className: "number",
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({data}) => data.reduce((red, item) => red + item.sum_quantity, 0),
      footer: ({value}) => utils.formatNumber(value),
    },
    { id: "sum_served", 
      header: utils.cellHeader(t("/@word/served")), 
      width: "16ch",
      className: "number",
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({data}) => data.reduce((red, item) => red + item.sum_served, 0),
      footer: ({value}) => utils.formatNumber(value),
    },
    { id: "sum_balance", 
      header: utils.cellHeader(t("/@word/balance")), 
      width: "16ch",
      className: "number",
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({data}) => data.reduce((red, item) => red + item.sum_balance, 0),
      footer: ({value}) => utils.formatNumber(value),
    },
    { id: "sum_excess", 
      header: utils.cellHeader(t("/@word/excess")), 
      width: "16ch",
      className: "number",
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({data}) => data.reduce((red, item) => red + item.sum_excess, 0),
      footer: ({value}) => utils.formatNumber(value),
    },
    { id: "sum_servedAdjusted", 
      header: utils.cellHeader(t("/@word/servedAdjusted")), 
      width: "16ch",
      className: "number",
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({data}) => data.reduce((red, item) => red + item.sum_servedAdjusted, 0),
      footer: ({value}) => utils.formatNumber(value),
    },
    { id: "sum_balanceAdjusted", 
      header: utils.cellHeader(t("/@word/balanceAdjusted")), 
      width: "16ch",
      className: "number",
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({data}) => data.reduce((red, item) => red + item.sum_balanceAdjusted, 0),
      footer: ({value}) => utils.formatNumber(value),
    },
  ];

  data = utils.sort(data, report.properties?.settings?.sort || []);

  data = utils.group(data, report.properties?.settings?.groups || [], columns);

  const visibleColumns = report?.properties?.settings?.columns ?? report?.properties?.showColumns?.split(",");

  return (
    <div className="report-wrapper">
      <div className="report-container">
        <header>
          <h1>{t("/supply/production/report/productionOrderConsumptionList")}</h1>
          <section className="parameters">
            {report.parameters?.DATE_START && <dl>
              <dt>{t("/@word/dateStart")}</dt>
              <dd>{utils.formatDate(report.parameters.DATE_START)}</dd>
            </dl>}
            {report.parameters?.DATE_END && <dl>
              <dt>{t("/@word/dateEnd")}</dt>
              <dd>{utils.formatDate(report.parameters.DATE_END)}</dd>
            </dl>}
            {report.parameters?.AVAILABILITY_DATE_START && <dl>
              <dt>{t("/@word/availabilityDateStart")}</dt>
              <dd>{utils.formatDate(report.parameters.AVAILABILITY_DATE_START)}</dd>
            </dl>}
            {report.parameters?.AVAILABILITY_DATE_END && <dl>
              <dt>{t("/@word/availabilityDateEnd")}</dt>
              <dd>{utils.formatDate(report.parameters.AVAILABILITY_DATE_END)}</dd>
            </dl>}
            {report.parameters?.COMPANY_IDS_DESC && <dl>
              <dt>{t("/catalog/company/company/plural")}</dt>
              <dd>{report.parameters.COMPANY_IDS_DESC}</dd>
            </dl>}
            {report.parameters?.PERSON_IDS_DESC && <dl>
              <dt>{t("/catalog/person/person/plural")}</dt>
              <dd>{report.parameters.PERSON_IDS_DESC}</dd>
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