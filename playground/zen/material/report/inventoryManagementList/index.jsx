import * as utils from "./utils.jsx";
import { Badge, Column, GroupSections, Table } from "./utils.jsx";

export default function ({ data = [], meta = {}, t }) {
  const { report = {} } = meta;

  const columns = [
    { id: "product_id",
      header: utils.cellHeader(t("/catalog/product/product"), t("/@word/id")),
      width: "8ch",
      className: "number",
      headerClassName: "number",
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({ data }) => data.length,
      footer: ({ value }) => utils.formatNumber(value),
    },
    { id: "product_code",
      header: utils.cellHeader(t("/catalog/product/product"), t("/@word/code")),
      width: "16ch",
    },
    { id: "product_description",
      header: utils.cellHeader(t("/catalog/product/product"), t("/@word/description")),
      width: "24ch",
    },
    { id: "unit_id",
      header: utils.cellHeader(t("/catalog/product/unit"), t("/@word/id")),
      width: "8ch",
      className: "number",
      headerClassName: "number",
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({ data }) => data.length,
      footer: ({ value }) => utils.formatNumber(value),
    },
    { id: "unit_code",
      header: utils.cellHeader(t("/catalog/product/unit"), t("/@word/code")),
      width: "8ch",
    },
    { id: "productPacking_id",
      header: utils.cellHeader(t("/catalog/product/productPacking"), t("/@word/id")),
      width: "8ch",
      className: "number",
      headerClassName: "number",
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({ data }) => data.length,
      footer: ({ value }) => utils.formatNumber(value),
    },
    { id: "productPacking_code",
      header: utils.cellHeader(t("/catalog/product/productPacking"), t("/@word/code")),
      width: "16ch",
    },
    { id: "productPacking_complement",
      header: utils.cellHeader(t("/catalog/product/productPacking"), t("/@word/complement")),
      width: "16ch",
    },
    { id: "productVariant_id",
      header: utils.cellHeader(t("/catalog/product/productVariant"), t("/@word/id")),
      width: "8ch",
      className: "number",
      headerClassName: "number",
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({ data }) => data.length,
      footer: ({ value }) => utils.formatNumber(value),
    },
    { id: "productVariant_code",
      header: utils.cellHeader(t("/catalog/product/productVariant"), t("/@word/code")),
      width: "16ch",
    },
    { id: "productVariant_description",
      header: utils.cellHeader(t("/catalog/product/productVariant"), t("/@word/description")),
      width: "24ch",
    },
    { id: "averageDailyConsumption",
      header: utils.cellHeader(t("/@unknown/averageDailyConsumption")),
      width: "16ch",
    },
    { id: "replenishmentTimeDays",
      header: utils.cellHeader(t("/@unknown/replenishmentTimeDays")),
      width: "16ch",
    },
    { id: "safetyStockPercentage",
      header: utils.cellHeader(t("/@unknown/safetyStockPercentage")),
      width: "16ch",
    },
    { id: "minimumStock",
      header: utils.cellHeader(t("/@unknown/minimumStock")),
      width: "16ch",
    },
    { id: "replenishmentMinimum",
      header: utils.cellHeader(t("/@unknown/replenishmentMinimum")),
      width: "16ch",
    },
    { id: "replenishmentBatch",
      header: utils.cellHeader(t("/@unknown/replenishmentBatch")),
      width: "16ch",
    },
    { id: "acquisitionType",
      header: utils.cellHeader(t("/@unknown/acquisitionType")),
      width: "16ch",
    },
    { id: "stock_quantity_excess",
      header: utils.cellHeader(t("/material/stock"), t("/@word/excess")),
      width: "16ch",
      className: "number",
      headerClassName: "number",
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({ data }) => data.reduce((red, item) => red + (Number(item.stock_quantity_excess) || 0), 0),
      footer: ({ value }) => utils.formatNumber(value),
    },
    { id: "stock_quantity_external",
      header: utils.cellHeader(t("/material/stock"), t("/@unknown/quantity_external")),
      width: "16ch",
      className: "number",
      headerClassName: "number",
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({ data }) => data.reduce((red, item) => red + (Number(item.stock_quantity_external) || 0), 0),
      footer: ({ value }) => utils.formatNumber(value),
    },
    { id: "stock_quantity_lack",
      header: utils.cellHeader(t("/material/stock"), t("/@unknown/quantity_lack")),
      width: "16ch",
      className: "number",
      headerClassName: "number",
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({ data }) => data.reduce((red, item) => red + (Number(item.stock_quantity_lack) || 0), 0),
      footer: ({ value }) => utils.formatNumber(value),
    },
    { id: "stock_quantity_regular",
      header: utils.cellHeader(t("/material/stock"), t("/@unknown/quantity_regular")),
      width: "16ch",
      className: "number",
      headerClassName: "number",
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({ data }) => data.reduce((red, item) => red + (Number(item.stock_quantity_regular) || 0), 0),
      footer: ({ value }) => utils.formatNumber(value),
    },
    { id: "stock_quantity_regular_free",
      header: utils.cellHeader(t("/material/stock"), t("/@unknown/quantity_regular_free")),
      width: "16ch",
      className: "number",
      headerClassName: "number",
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({ data }) => data.reduce((red, item) => red + (Number(item.stock_quantity_regular_free) || 0), 0),
      footer: ({ value }) => utils.formatNumber(value),
    },
    { id: "stock_quantity_regular_reserved",
      header: utils.cellHeader(t("/material/stock"), t("/@unknown/quantity_regular_reserved")),
      width: "16ch",
      className: "number",
      headerClassName: "number",
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({ data }) => data.reduce((red, item) => red + (Number(item.stock_quantity_regular_reserved) || 0), 0),
      footer: ({ value }) => utils.formatNumber(value),
    },
    { id: "stock_quantity",
      header: utils.cellHeader(t("/material/stock"), t("/@word/quantity")),
      width: "16ch",
      className: "number",
      headerClassName: "number",
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({ data }) => data.reduce((red, item) => red + (Number(item.stock_quantity) || 0), 0),
      footer: ({ value }) => utils.formatNumber(value),
    },
    { id: "purchase_quantity",
      header: utils.cellHeader(t("/supply/purchase/purchase"), t("/@word/quantity")),
      width: "16ch",
      className: "number",
      headerClassName: "number",
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({ data }) => data.reduce((red, item) => red + (Number(item.purchase_quantity) || 0), 0),
      footer: ({ value }) => utils.formatNumber(value),
    },
    { id: "sale_quantity",
      header: utils.cellHeader(t("/sale/sale"), t("/@word/quantity")),
      width: "16ch",
      className: "number",
      headerClassName: "number",
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({ data }) => data.reduce((red, item) => red + (Number(item.sale_quantity) || 0), 0),
      footer: ({ value }) => utils.formatNumber(value),
    },
    { id: "balance",
      header: utils.cellHeader(t("/@word/balance")),
      width: "16ch",
      className: "number",
      headerClassName: "number",
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({ data }) => data.reduce((red, item) => red + (Number(item.balance) || 0), 0),
      footer: ({ value }) => utils.formatNumber(value),
    },
  ];

  data = utils.sort(data, report.properties?.settings?.sort || []);
  data = utils.group(data, report.properties?.settings?.groups || [], columns);
  const visibleColumns = report?.properties?.settings?.columns ?? report?.properties?.showColumns?.split(",");

  return (
    <div className="report-wrapper">
      <div className="report-container">
        <header>
          <h1>{t("/@unknown/report/inventoryManagementItem")}</h1>
          <section className="parameters">
            {report.parameters?.INVENTORY_MANAGEMENT && (
              <dl>
                <dt>{t("/@unknown/inventoryManagement")}</dt>
                <dd>{report.parameters.INVENTORY_MANAGEMENT}</dd>
              </dl>
            )}
            {report.parameters?.PRODUCT_IDS_DESC && (
              <dl>
                <dt>{t("/catalog/product/product/plural")}</dt>
                <dd>{report.parameters.PRODUCT_IDS_DESC}</dd>
              </dl>
            )}
            {report.parameters?.PRODUCT_CATEGORY_IDS_1_DESC && (
              <dl>
                <dt>{t("/@unknown/productCategory")}</dt>
                <dd>{report.parameters.PRODUCT_CATEGORY_IDS_1_DESC}</dd>
              </dl>
            )}
            {report.parameters?.PRODUCT_CATEGORY_IDS_2_DESC && (
              <dl>
                <dt>{t("/@unknown/productCategory")}</dt>
                <dd>{report.parameters.PRODUCT_CATEGORY_IDS_2_DESC}</dd>
              </dl>
            )}
            {report.parameters?.PRODUCT_CATEGORY_IDS_3_DESC && (
              <dl>
                <dt>{t("/@unknown/productCategory")}</dt>
                <dd>{report.parameters.PRODUCT_CATEGORY_IDS_3_DESC}</dd>
              </dl>
            )}
            {report.parameters?.PRODUCT_CATEGORY_IDS_4_DESC && (
              <dl>
                <dt>{t("/@unknown/productCategory")}</dt>
                <dd>{report.parameters.PRODUCT_CATEGORY_IDS_4_DESC}</dd>
              </dl>
            )}
            {report.parameters?.PRODUCT_CATEGORY_IDS_5_DESC && (
              <dl>
                <dt>{t("/@unknown/productCategory")}</dt>
                <dd>{report.parameters.PRODUCT_CATEGORY_IDS_5_DESC}</dd>
              </dl>
            )}
            {report.parameters?.PRODUCT_PACKING_IDS_DESC && (
              <dl>
                <dt>{t("/catalog/product/productPacking/plural")}</dt>
                <dd>{report.parameters.PRODUCT_PACKING_IDS_DESC}</dd>
              </dl>
            )}
            {report.parameters?.UNIT_IDS_DESC && (
              <dl>
                <dt>{t("/catalog/product/unit/plural")}</dt>
                <dd>{report.parameters.UNIT_IDS_DESC}</dd>
              </dl>
            )}
            {report.parameters?.PRODUCT_VARIANT_IDS_DESC && (
              <dl>
                <dt>{t("/catalog/product/productVariant/plural")}</dt>
                <dd>{report.parameters.PRODUCT_VARIANT_IDS_DESC}</dd>
              </dl>
            )}
            {report.parameters?.STOCK_CLUSTER_IDS_DESC && (
              <dl>
                <dt>{t("/material/stockCluster/plural")}</dt>
                <dd>{report.parameters.STOCK_CLUSTER_IDS_DESC}</dd>
              </dl>
            )}
            {report.parameters?.STOCK_TYPE && (
              <dl>
                <dt>{t("/@unknown/stockType")}</dt>
                <dd>{report.parameters.STOCK_TYPE}</dd>
              </dl>
            )}
          </section>
        </header>
        <main>
          <GroupSections
            columns={columns}
            data={data}
            groups={report.properties?.settings?.groups || []}>
            {(groupData) => (
              <div className="content">
                <Table data={groupData} visibleColumns={visibleColumns}>
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
