import * as utils from "./utils.jsx";
import { Column, Table } from "./utils.jsx";

// Column.className não passou para o header
// Footer da coluna não está sendo exibido quando há um footerValue definido

export default function ({ data = [], meta = {}, t }) {
  const report = meta.report || {};

  const grouped = data.reduce((red, item) => {
    const key = "";
    if (!red[key]) red[key] = [];
    red[key].push(item);
    return red;
  }, {});

  const visibleColumns = report?.properties?.settings?.columns ?? report?.properties?.showColumns?.split(",");

  return (
    <div className="report-wrapper">
      <pre>{JSON.stringify(meta, null, 2)}</pre>
      <pre>{JSON.stringify(visibleColumns, null, 2)}</pre>
      <div className="report-container">
        <header>
          <h1>{t("/supply/production/report/productionOrderConsumptionList")}</h1>
          {/* <h1>{JSON.stringify(rest)}</h1> */}
          <section className="parameters">
            {report.parameters?.DATE_START && <dl>
              <dt>{t("/@word/dateStart")}</dt>
              <dd>{utils.formatDate(report.parameters.DATE_START)}</dd>
            </dl>}
            {report.parameters?.DATE_END && <dl>
              <dt>{t("/@word/dateEnd")}</dt>
              <dd>{utils.formatDate(report.parameters.DATE_END)}</dd>
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
          {Object.keys(grouped).map(key => (
            <section key={key}>
              <header>{key}</header>
              <div className="content">
                <Table data={grouped[key]}
                  visibleColumns={visibleColumns}>
                  <Column id="id" header={t("/@word/id")}
                    cell={({ value }) => utils.formatNumber(value)} className="number"
                    footerValue={({data}) => data.length}
                    footer={({value}) => utils.formatNumber(value)}></Column>
                  <Column id="status" header={t("/@word/status")}></Column>
                  <Column id="company_id" header={`${t("/catalog/company/company")} ${t("/@word/id")}`}
                    cell={({ value }) => utils.formatNumber(value)}></Column>
                  <Column id="company_code" header={`${t("/catalog/company/company")} ${t("/@word/code")}`}></Column>
                  <Column id="company_name" header={`${t("/catalog/company/company")} ${t("/@word/name")}`}></Column>
                  <Column id="company_fantasyName" header={`${t("/catalog/company/company")} ${t("/@word/fantasyName")}`}></Column>
                  <Column id="company_nameCalc" header={`${t("/catalog/company/company")} ${t("/@word/nameCalc")}`}></Column>
                  <Column id="person_id" header={`${t("/catalog/person/person")} ${t("/@word/id")}`}
                    cell={({ value }) => utils.formatNumber(value)} className="number"
                  ></Column>
                  <Column id="person_name" header={`${t("/catalog/person/person")} ${t("/@word/name")}`}></Column>
                  <Column id="person_fantasyName" header={`${t("/catalog/person/person")} ${t("/@word/fantasyName")}`}></Column>
                  <Column id="person_nameCalc" header={`${t("/catalog/person/person")} ${t("/@word/nameCalc")}`}></Column>
                  <Column id="product_id" header={`${t("/catalog/product/product")} ${t("/@word/id")}`}
                    cell={({ value }) => utils.formatNumber(value)} className="number"
                  ></Column>
                  <Column id="product_code" header={`${t("/catalog/product/product")} ${t("/@word/code")}`}></Column>
                  <Column id="product_description" header={`${t("/catalog/product/product")} ${t("/@word/description")}`}></Column>
                  <Column id="product_complement" header={`${t("/catalog/product/product")} ${t("/@word/complement")}`}></Column>
                  <Column id="productPacking_id" header={`${t("/catalog/product/productPacking")} ${t("/@word/id")}`}
                    cell={({ value }) => utils.formatNumber(value)} className="number"
                  ></Column>
                  <Column id="productPacking_code" header={`${t("/catalog/product/productPacking")} ${t("/@word/code")}`}></Column>
                  <Column id="productPacking_complement" header={`${t("/catalog/product/productPacking")} ${t("/@word/complement")}`}></Column>
                  <Column id="productPacking_units" header={`${t("/catalog/product/productPacking")} ${t("/@word/units")}`}></Column>
                  <Column id="productVariant_id" header={`${t("/catalog/product/productVariant")} ${t("/@word/id")}`}
                    cell={({ value }) => utils.formatNumber(value)} className="number"
                  ></Column>
                  <Column id="productVariant_code" header={`${t("/catalog/product/productVariant")} ${t("/@word/code")}`}></Column>
                  <Column id="productVariant_description" header={`${t("/catalog/product/productVariant")} ${t("/@word/description")}`}></Column>
                  <Column id="sum_quantity" header={t("/@word/quantity")} cell={({ value }) => utils.formatNumber(value)} className="number"
                    footerValue={({data}) => data.reduce((red, item) => red + item.sum_quantity, 0)}
                    footer={({value}) => utils.formatNumber(value)}></Column>
                  <Column id="sum_served" header={t("/@word/served")} cell={({ value }) => utils.formatNumber(value)} className="number"
                    footerValue={({data}) => data.reduce((red, item) => red + item.sum_served, 0)}
                    footer={({value}) => utils.formatNumber(value)}></Column>
                  <Column id="sum_balance" header={t("/@word/balance")} cell={({ value }) => utils.formatNumber(value)} className="number"
                    footerValue={({data}) => data.reduce((red, item) => red + item.sum_balance, 0)}
                    footer={({value}) => utils.formatNumber(value)}></Column>
                  <Column id="sum_excess" header={t("/@word/excess")} cell={({ value }) => utils.formatNumber(value)} className="number"
                    footerValue={({data}) => data.reduce((red, item) => red + item.sum_excess, 0)}
                    footer={({value}) => utils.formatNumber(value)}></Column>
                  <Column id="sum_servedAdjusted" header={t("/@word/servedAdjusted")} cell={({ value }) => utils.formatNumber(value)} className="number"
                    footerValue={({data}) => data.reduce((red, item) => red + item.sum_servedAdjusted, 0)}
                    footer={({value}) => utils.formatNumber(value)}></Column>
                  <Column id="sum_balanceAdjusted" header={t("/@word/balanceAdjusted")} cell={({ value }) => utils.formatNumber(value)} className="number"
                    footerValue={({data}) => data.reduce((red, item) => red + item.sum_balanceAdjusted, 0)}
                    footer={({value}) => utils.formatNumber(value)}></Column>
                </Table>
              </div>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
};
