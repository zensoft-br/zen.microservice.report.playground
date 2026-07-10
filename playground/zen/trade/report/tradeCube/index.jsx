import * as utils from "./utils.jsx";
import { Badge, Table } from "./utils.jsx";

export default function ({ data = [], meta = {}, t }) {
  const { report = {} } = meta;

  const columns = [
    // CONTRACT
    { id: "contract_id",
      header: utils.cellHeader(t("/trade/contract"), t("/@word/id")),
      width: "8ch",
      className: "number",
      headerClassName: "number",
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({ data }) => data.length,
      footer: ({ value }) => utils.formatNumber(value),
    },
    { id: "contract_status",
      header: utils.cellHeader(t("/trade/contract"), t("/@word/status")),
      width: "16ch",
      cell: ({ value }) => value ? <Badge>{t(`/trade/contractStatus/enum/${value}`)}</Badge> : null,
    },
    {
      id: "contract_workflowNode_code",
      header: utils.cellHeader(t("/trade/contract"), t("/system/workflow/workflowNode")),
      width: "16ch",
      cell: ({ value }) => value ? <Badge>{value}</Badge> : null,
    },
    {
      id: "contract_workflowNode_description",
      header: utils.cellHeader(t("/trade/contract"), t("/system/workflow/workflowNode")),
      width: "16ch",
      cell: ({ value }) => value ? <Badge>{value}</Badge> : null,
    },
    { id: "contract_code",
      header: utils.cellHeader(t("/trade/contract"), t("/@word/code")),
      width: "16ch",
    },
    { id: "contract_description",
      header: utils.cellHeader(t("/trade/contract"), t("/@word/description")), // Fixed header key here
      width: "24ch",
    },
    { id: "contract_date",
      header: utils.cellHeader(t("/trade/contract"), t("/@word/date")),
      width: "10ch",
      cell: ({ value }) => utils.formatDate(value),
    },
    { id: "contract_date_day",
      header: utils.cellHeader(t("/trade/contract"), t("/@word/day")),
      width: "16ch",
    },
    { id: "contract_date_month",
      header: utils.cellHeader(t("/trade/contract"), t("/@word/month")),
      width: "16ch",
    },
    { id: "contract_date_year",
      header: utils.cellHeader(t("/trade/contract"), t("/@word/year")),
      width: "16ch",
    },
    { id: "contract_availabilityDate",
      header: utils.cellHeader(t("/trade/contract"), t("/@word/date")),
      width: "10ch",
      cell: ({ value }) => utils.formatDate(value),
    },
    { id: "contract_availabilityDate_day",
      header: utils.cellHeader(t("/trade/contract"), t("/@word/day")),
      width: "16ch",
    },
    { id: "contract_availabilityDate_month",
      header: utils.cellHeader(t("/trade/contract"), t("/@word/month")),
      width: "16ch",
    },
    { id: "contract_availabilityDate_year",
      header: utils.cellHeader(t("/trade/contract"), t("/@word/year")),
      width: "16ch",
    },
    { id: "contract_company_id",
      header: utils.cellHeader(t("/catalog/company/company"), t("/@word/id")),
      width: "8ch",
      className: "number",
      cell: ({ value }) => utils.formatNumber(value),
    },
    { id: "contract_company_code",
      header: utils.cellHeader(t("/catalog/company/company"), t("/@word/code")),
      width: "16ch",
    },
    { id: "contract_person_id",
      header: utils.cellHeader(t("/catalog/person/person"), t("/@word/id")),
      width: "8ch",
      className: "number",
      headerClassName: "number",
      cell: ({ value }) => utils.formatNumber(value),
    },
    { id: "contract_person_name",
      header: utils.cellHeader(t("/catalog/person/person"), t("/@word/name")),
      width: "24ch",
    },
    { id: "contract_person_fantasyName",
      header: utils.cellHeader(t("/catalog/person/person"), t("/@word/fantasyName")),
      width: "24ch",
    },
    { id: "contract_person_nameCalc",
      header: utils.cellHeader(t("/catalog/person/person"), t("/@word/nameCalc")),
      width: "24ch",
    },     
    { id: "contract_currency_id",
      header: utils.cellHeader(t("/financial/currency"), t("/@word/id")),
      width: "8ch",
      className: "number",
      cell: ({ value }) => utils.formatNumber(value),
    },
    { id: "contract_currency_code",
      header: utils.cellHeader(t("/financial/currency"), t("/@word/code")),
      width: "16ch",
      cell: ({ value }) => <Badge>{value}</Badge>,
    },

    // PRODUCT
    { id: "product_id",
      header: utils.cellHeader(t("/catalog/product/product"), t("/@word/id")),
      width: "8ch",
      className: "number",
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
    { id: "productPacking_id",
      header: utils.cellHeader(t("/catalog/product/productPacking"), t("/@word/id")),
      width: "8ch",
      className: "number",
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
    },
    { id: "productVariant_id",
      header: utils.cellHeader(t("/catalog/product/productVariant"), t("/@word/id")),
      width: "8ch",
      className: "number",
    },
    { id: "productVariant_code",
      header: utils.cellHeader(t("/catalog/product/productVariant"), t("/@word/code")),
      width: "16ch",
    },
    { id: "productVariant_description",
      header: utils.cellHeader(t("/catalog/product/productVariant"), t("/@word/description")),
      width: "24ch",
    },
    { id: "unit_id",
      header: utils.cellHeader(t("/catalog/product/unit"), t("/@word/id")),
      width: "8ch",
      className: "number",
    },
    { id: "unit_code",
      header: utils.cellHeader(t("/catalog/product/unit"), t("/@word/code")),
      width: "8ch",
      cell: ({ value }) => <Badge>{value}</Badge>,
    },

    // CONTRACT_ITEM
    { id: "contractItem_unitValue",
      header: utils.cellHeader(t("/trade/contractItem"), t("/@word/unitValue")),
      width: "16ch",
      className: "number",
      cell: ({ row, value }) => utils.formatCurrency(value, { currency: row.contract_currency_code }),
    },
    { id: "sum_contractItem_quantity",
      header: utils.cellHeader(t("/trade/contract"), t("/@word/quantity")),
      width: "16ch",
      className: "number",
      headerClassName: "number",
      cell: ({ row, value }) => utils.formatQuantity(value, { unit_code: row.unit_code }),
      footerValue: ({ data }) => utils.sumBy(data, (item) => item.unit_code, (item) => item.sum_contractItem_quantity),
      footer: ({ value }) => utils.renderAggr(value, (val, unit_code) => utils.formatQuantity(val, { unit_code })),
    },
    { id: "sum_contractItem_quantity_units",
      header: utils.cellHeader(t("/trade/contract"), t("/@word/quantityUnits")),
      width: "16ch",
      className: "number",
      headerClassName: "number",
      cell: ({ row, value }) => utils.formatQuantity(value, { unit_code: row.unit_code }),
      footerValue: ({ data }) => utils.sum(data, (item) => item.sum_contractItem_quantity_units),
      footer: ({ value }) => utils.formatNumber(value),
    },
    { id: "sum_contractItem_shippedQuantity",
      header: utils.cellHeader(t("/trade/contract"), t("/@word/shippedQuantity")),
      width: "16ch",
      className: "number",
      headerClassName: "number",
      cell: ({ row, value }) => utils.formatQuantity(value, { unit_code: row.unit_code }),
      footerValue: ({ data }) => utils.sumBy(data, (item) => item.unit_code, (item) => item.sum_contractItem_shippedQuantity),
      footer: ({ value }) => utils.renderAggr(value, (val, unit_code) => utils.formatQuantity(val, { unit_code })),
    },
    { id: "sum_contractItem_clearedQuantity",
      header: utils.cellHeader(t("/trade/contract"), t("/@word/clearedQuantity")),
      width: "16ch",
      className: "number",
      headerClassName: "number",
      cell: ({ row, value }) => utils.formatQuantity(value, { unit_code: row.unit_code }),
      footerValue: ({ data }) => utils.sumBy(data, (item) => item.unit_code, (item) => item.sum_contractItem_clearedQuantity),
      footer: ({ value }) => utils.renderAggr(value, (val, unit_code) => utils.formatQuantity(val, { unit_code })),
    },
    { id: "sum_contractItem_totalValue",
      header: utils.cellHeader(t("/trade/contract"), t("/@word/totalValue")),
      width: "16ch",
      className: "number",
      headerClassName: "number",
      cell: ({ row, value }) => utils.formatCurrency(value, { currency: row.contract_currency_code }),
      footerValue: ({ data }) => utils.sumBy(data, item => item.contract_currency_code, item => item.sum_contractItem_totalValue),
      footer: ({ value }) => utils.renderAggr(value, (val, currency) => utils.formatCurrency(val, { currency })),
    },
    { id: "sum_contractItem_netWeightKg",
      header: utils.cellHeader(t("/trade/contract"), t("/@word/netWeightKg")),
      width: "16ch",
      className: "number",
      headerClassName: "number",
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({ data }) => utils.sum(data, (item) => item.sum_contractItem_netWeightKg),
      footer: ({ value }) => utils.formatNumber(value),
    },
    { id: "sum_contractItem_grossWeightKg",
      header: utils.cellHeader(t("/trade/contract"), t("/@word/grossWeightKg")),
      width: "16ch",
      className: "number",
      headerClassName: "number",
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({ data }) => utils.sum(data, (item) => item.sum_contractItem_grossWeightKg),
      footer: ({ value }) => utils.formatNumber(value),
    },

    // SHIPMENT
    { id: "shipment_id",
      header: utils.cellHeader(t("/trade/shipment"), t("/@word/id")),
      width: "8ch",
      className: "number",
      cell: ({ value }) => utils.formatNumber(value),
    },
    { id: "shipment_status",
      header: utils.cellHeader(t("/trade/shipment"), t("/@word/status")),
      width: "16ch",
      cell: ({ value }) => value ? <Badge>{t(`/trade/shipmentStatus/enum/${value}`)}</Badge> : null,
    },
    {
      id: "shipment_workflowNode_code",
      header: utils.cellHeader(t("/trade/shipment"), t("/system/workflow/workflowNode")),
      width: "16ch",
      cell: ({ value }) => value ? <Badge>{value}</Badge> : null,
    },
    {
      id: "shipment_workflowNode_description",
      header: utils.cellHeader(t("/trade/shipment"), t("/system/workflow/workflowNode")),
      width: "16ch",
      cell: ({ value }) => value ? <Badge>{value}</Badge> : null,
    },
    { id: "shipment_code",
      header: utils.cellHeader(t("/trade/shipment"), t("/@word/code")),
      width: "16ch",
    },
    { id: "shipment_description",
      header: utils.cellHeader(t("/trade/shipment"), t("/@word/description")),
      width: "24ch",
    },
    { id: "shipment_date",
      header: utils.cellHeader(t("/trade/shipment"), t("/@word/date")),
      width: "10ch",
      cell: ({ value }) => utils.formatDate(value),
    },
    { id: "shipment_date_day",
      header: utils.cellHeader(t("/trade/shipment"), t("/@word/day")),
      width: "16ch",
    },
    { id: "shipment_date_month",
      header: utils.cellHeader(t("/trade/shipment"), t("/@word/month")),
      width: "16ch",
    },
    { id: "shipment_date_year",
      header: utils.cellHeader(t("/trade/shipment"), t("/@word/year")),
      width: "16ch",
    },
    { id: "shipment_person_id",
      header: utils.cellHeader(t("/catalog/person/person"), t("/@word/id")),
      width: "8ch",
      className: "number",
      cell: ({ value }) => utils.formatNumber(value),
    },
    { id: "shipment_person_name",
      header: utils.cellHeader(t("/catalog/person/person"), t("/@word/name")),
      width: "24ch",
    },
    { id: "shipment_person_fantasyName",
      header: utils.cellHeader(t("/catalog/person/person"), t("/@word/fantasyName")),
      width: "24ch",
    },
    { id: "shipment_person_nameCalc",
      header: utils.cellHeader(t("/catalog/person/person"), t("/@word/nameCalc")),
      width: "24ch",
    },

    // SHIPMENT_ITEM
    { id: "shipmentItem_unitValue",
      header: utils.cellHeader(t("/trade/shipmentItem"), t("/@word/unitValue")),
      width: "16ch",
      className: "number",
      cell: ({ row, value }) => utils.formatCurrency(value, { currency: row.contract_currency_code }),
    },
    { id: "sum_shipmentItem_quantity",
      header: utils.cellHeader(t("/trade/shipment"), t("/@word/quantity")),
      width: "16ch",
      className: "number",
      headerClassName: "number",
      cell: ({ row, value }) => utils.formatQuantity(value, { unit_code: row.unit_code }),
      footerValue: ({ data }) => utils.sumBy(data, (item) => item.unit_code, (item) => item.sum_shipmentItem_quantity),
      footer: ({ value }) => utils.renderAggr(value, (val, unit_code) => utils.formatQuantity(val, { unit_code })),
    },
    { id: "sum_shipmentItem_quantity_units",
      header: utils.cellHeader(t("/trade/shipment"), t("/@word/quantityUnits")),
      width: "16ch",
      className: "number",
      headerClassName: "number",
      cell: ({ row, value }) => utils.formatQuantity(value, { unit_code: row.unit_code }),
      footerValue: ({ data }) => utils.sum(data, (item) => item.sum_shipmentItem_quantity_units),
      footer: ({ value }) => utils.formatNumber(value),
    },
    { id: "sum_shipmentItem_clearedQuantity",
      header: utils.cellHeader(t("/trade/shipment"), t("/@word/quantity")),
      width: "16ch",
      className: "number",
      headerClassName: "number",
      cell: ({ row, value }) => utils.formatQuantity(value, { unit_code: row.unit_code }),
      footerValue: ({ data }) => utils.sum(data, (item) => item.sum_shipmentItem_clearedQuantity),
      footer: ({ value }) => utils.formatNumber(value),
    },
    { id: "sum_shipmentItem_totalValue",
      header: utils.cellHeader(t("/trade/shipment"), t("/@word/totalValue")),
      width: "16ch",
      className: "number",
      headerClassName: "number",
      cell: ({ row, value }) => utils.formatCurrency(value, { currency: row.contract_currency_code }),
      footerValue: ({ data }) => utils.sumBy(data, (item) => item.contract_currency_code, (item) => Number(item.sum_shipmentItem_totalValue) || 0),
      footer: ({ value }) => utils.renderAggr(value, (val, currency) => utils.formatCurrency(val, { currency })),
    },
    { id: "sum_shipmentItem_netWeightKg",
      header: utils.cellHeader(t("/trade/shipment"), t("/@word/netWeightKg")),
      width: "16ch",
      className: "number",
      headerClassName: "number",
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({ data }) => utils.sum(data, (item) => item.sum_shipmentItem_netWeightKg),
      footer: ({ value }) => utils.formatNumber(value),
    },
    { id: "sum_shipmentItem_grossWeightKg",
      header: utils.cellHeader(t("/trade/shipment"), t("/@word/grossWeightKg")),
      width: "16ch",
      className: "number",
      headerClassName: "number",
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({ data }) => utils.sum(data, (item) => item.sum_shipmentItem_grossWeightKg),
      footer: ({ value }) => utils.formatNumber(value),
    },
    {
      id: "shipmentContainer_id",
      header: utils.cellHeader(t("/trade/shipmentContainer"), t("/@word/id")),
      width: "8ch",
      className: "number",
      cell: ({ value }) => utils.formatNumber(value),
    },
    {
      id: "shipmentContainer_number",
      header: utils.cellHeader(t("/trade/shipmentContainer"), t("/@word/number")),
      width: "16ch",
    },
    // CLEARANCE
    { id: "clearance_id",
      header: utils.cellHeader(t("/trade/clearance"), t("/@word/id")),
      width: "8ch",
      className: "number",
      cell: ({ value }) => utils.formatNumber(value),
    },
    { id: "clearance_status",
      header: utils.cellHeader(t("/trade/clearance"), t("/@word/status")),
      width: "16ch",
      cell: ({ value }) => value ? <Badge>{t(`/trade/clearanceStatus/enum/${value}`)}</Badge> : null,
    },
    {
      id: "clearance_workflowNode_code",
      header: utils.cellHeader(t("/trade/clearance"), t("/system/workflow/workflowNode")),
      width: "16ch",
      cell: ({ value }) => value ? <Badge>{value}</Badge> : null,
    },
    {
      id: "clearance_workflowNode_description",
      header: utils.cellHeader(t("/trade/clearance"), t("/system/workflow/workflowNode")),
      width: "16ch",
      cell: ({ value }) => value ? <Badge>{value}</Badge> : null,
    },
    { id: "clearance_type",
      header: utils.cellHeader(t("/trade/clearance"), t("/@word/type")),
      width: "16ch",
    },
    { id: "clearance_code",
      header: utils.cellHeader(t("/trade/clearance"), t("/@word/code")),
      width: "16ch",
    },
    { id: "clearance_date",
      header: utils.cellHeader(t("/trade/clearance"), t("/@word/date")),
      width: "10ch",
      cell: ({ value }) => utils.formatDate(value),
    },
    { id: "clearance_date_day",
      header: utils.cellHeader(t("/trade/clearance"), t("/@word/day")),
      width: "16ch",
    },
    { id: "clearance_date_month",
      header: utils.cellHeader(t("/trade/clearance"), t("/@word/month")),
      width: "16ch",
    },
    { id: "clearance_date_year",
      header: utils.cellHeader(t("/trade/clearance"), t("/@word/year")),
      width: "16ch",
    },

    // CLEARANCE_ITEM
    { id: "sum_clearanceItem_quantity",
      header: utils.cellHeader(t("/trade/clearance"), t("/@word/quantity")),
      width: "16ch",
      className: "number",
      headerClassName: "number",
      cell: ({ row, value }) => utils.formatQuantity(value, { unit_code: row.unit_code }),
      footerValue: ({ data }) => utils.sumBy(data, (item) => item.unit_code, (item) => item.sum_clearanceItem_quantity),
      footer: ({ value }) => utils.renderAggr(value, (val, unit_code) => utils.formatQuantity(val, { unit_code })),
    },
    { id: "sum_clearanceItem_quantity_units",
      header: utils.cellHeader(t("/trade/clearance"), t("/@word/quantityUnits")),
      width: "16ch",
      className: "number",
      headerClassName: "number",
      cell: ({ row, value }) => utils.formatQuantity(value, { unit_code: row.unit_code }),
      footerValue: ({ data }) => utils.sum(data, (item) => item.sum_clearanceItem_quantity_units),
      footer: ({ value }) => utils.formatNumber(value),
    },
    { id: "sum_clearanceItem_totalValue",
      header: utils.cellHeader(t("/trade/clearance"), t("/@word/totalValue")),
      width: "16ch",
      className: "number",
      headerClassName: "number",
      cell: ({ row, value }) => utils.formatCurrency(value, { currency: row.contract_currency_code }),
      footerValue: ({ data }) => utils.sumBy(data, (item) => item.contract_currency_code, (item) => Number(item.sum_clearanceItem_totalValue) || 0),
      footer: ({ value }) => utils.renderAggr(value, (val, currency) => utils.formatCurrency(val, { currency })),
    },
    { id: "sum_clearanceItem_netWeightKg",
      header: utils.cellHeader(t("/trade/clearance"), t("/@word/netWeightKg")),
      width: "16ch",
      className: "number",
      headerClassName: "number",
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({ data }) => utils.sum(data, (item) => item.sum_clearanceItem_netWeightKg),
      footer: ({ value }) => utils.formatNumber(value),
    },
    { id: "sum_clearanceItem_grossWeightKg",
      header: utils.cellHeader(t("/trade/clearance"), t("/@word/grossWeightKg")),
      width: "16ch",
      className: "number",
      headerClassName: "number",
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({ data }) => utils.sum(data, (item) => item.sum_clearanceItem_grossWeightKg),
      footer: ({ value }) => utils.formatNumber(value),
    },
  ];

  data = utils.sort(data, report.properties?.settings?.sort || []);

  const visibleColumns = report?.properties?.settings?.columns ?? report?.properties?.showColumns?.split(",");

  const groups = report.properties?.settings?.groups || [];

  return (
    <div className="report-wrapper" style={{ fontSize: report.properties?.fontSize }}>
      <div className="report-container">
        <header>
          <h1>{t("/trade/report/contractList")}</h1>
          <section className="parameters">
            {report.parameters?.DATE_START && <dl>
              <dt>{t("/@word/dateStart")}</dt>
              <dd>{utils.formatDate(report.parameters.DATE_START)}</dd>
            </dl>}
            {report.parameters?.DATE_END && <dl>
              <dt>{t("/@word/dateEnd")}</dt>
              <dd>{utils.formatDate(report.parameters.DATE_END)}</dd>
            </dl>}
            {report.parameters?.ISSUE_DATE_START && <dl>
              <dt>{t("/@word/issueDateStart")}</dt>
              <dd>{utils.formatDate(report.parameters.ISSUE_DATE_START)}</dd>
            </dl>}
            {report.parameters?.ISSUE_DATE_END && <dl>
              <dt>{t("/@word/issueDateEnd")}</dt>
              <dd>{utils.formatDate(report.parameters.ISSUE_DATE_END)}</dd>
            </dl>}
            {report.parameters?.SOCIETY_IDS_DESC && <dl>
              <dt>{t("/catalog/company/society/plural")}</dt>
              <dd>{report.parameters.SOCIETY_IDS_DESC}</dd>
            </dl>}
            {report.parameters?.COMPANY_IDS_DESC && <dl>
              <dt>{t("/catalog/company/company/plural")}</dt>
              <dd>{report.parameters.COMPANY_IDS_DESC}</dd>
            </dl>}
            {report.parameters?.PERSON_GROUP_IDS_DESC && <dl>
              <dt>{t("/catalog/person/personGroup/plural")}</dt>
              <dd>{report.parameters.PERSON_GROUP_IDS_DESC}</dd>
            </dl>}
            {report.parameters?.PERSON_IDS_DESC && <dl>
              <dt>{t("/catalog/person/person/plural")}</dt>
              <dd>{report.parameters.PERSON_IDS_DESC}</dd>
            </dl>}
            {report.parameters?.PERSON_CATEGORY_IDS_1_DESC && <dl>
              <dt>{`${t("/catalog/person/person")}, ${t("/catalog/person/person.category1")}`}</dt>
              <dd>{report.parameters.PERSON_CATEGORY_IDS_1_DESC}</dd>
            </dl>}
            {report.parameters?.PERSON_CATEGORY_IDS_2_DESC && <dl>
              <dt>{`${t("/catalog/person/person")}, ${t("/catalog/person/person.category2")}`}</dt>
              <dd>{report.parameters.PERSON_CATEGORY_IDS_2_DESC}</dd>
            </dl>}
            {report.parameters?.PERSON_CATEGORY_IDS_3_DESC && <dl>
              <dt>{`${t("/catalog/person/person")}, ${t("/catalog/person/person.category3")}`}</dt>
              <dd>{report.parameters.PERSON_CATEGORY_IDS_3_DESC}</dd>
            </dl>}
            {report.parameters?.PERSON_CATEGORY_IDS_4_DESC && <dl>
              <dt>{`${t("/catalog/person/person")}, ${t("/catalog/person/person.category4")}`}</dt>
              <dd>{report.parameters.PERSON_CATEGORY_IDS_4_DESC}</dd>
            </dl>}
            {report.parameters?.PERSON_CATEGORY_IDS_5_DESC && <dl>
              <dt>{`${t("/catalog/person/person")}, ${t("/catalog/person/person.category5")}`}</dt>
              <dd>{report.parameters.PERSON_CATEGORY_IDS_5_DESC}</dd>
            </dl>}
            {report.parameters?.FISCAL_PROFILE_OPERATION_IDS_DESC && <dl>
              <dt>{t("/fiscal/fiscalProfileOperation/plural")}</dt>
              <dd>{report.parameters.FISCAL_PROFILE_OPERATION_IDS_DESC}</dd>
            </dl>}
            {report.parameters?.PRODUCT_IDS_DESC && <dl>
              <dt>{t("/catalog/product/product/plural")}</dt>
              <dd>{report.parameters.PRODUCT_IDS_DESC}</dd>
            </dl>}
            {report.parameters?.FISCAL_PROFILE_PRODUCT_IDS_DESC && <dl>
              <dt>{t("/fiscal/fiscalProfileProduct/plural")}</dt>
              <dd>{report.parameters.FISCAL_PROFILE_PRODUCT_IDS_DESC}</dd>
            </dl>}
            {report.parameters?.PRODUCT_CATEGORY_IDS_1_DESC && <dl>
              <dt>{`${t("/catalog/product/product")}, ${t("/catalog/product/product.category1")}`}</dt>
              <dd>{report.parameters.PRODUCT_CATEGORY_IDS_1_DESC}</dd>
            </dl>}
            {report.parameters?.PRODUCT_CATEGORY_IDS_2_DESC && <dl>
              <dt>{`${t("/catalog/product/product")}, ${t("/catalog/product/product.category2")}`}</dt>
              <dd>{report.parameters.PRODUCT_CATEGORY_IDS_2_DESC}</dd>
            </dl>}
            {report.parameters?.PRODUCT_CATEGORY_IDS_3_DESC && <dl>
              <dt>{`${t("/catalog/product/product")}, ${t("/catalog/product/product.category3")}`}</dt>
              <dd>{report.parameters.PRODUCT_CATEGORY_IDS_3_DESC}</dd>
            </dl>}
            {report.parameters?.PRODUCT_CATEGORY_IDS_4_DESC && <dl>
              <dt>{`${t("/catalog/product/product")}, ${t("/catalog/product/product.category4")}`}</dt>
              <dd>{report.parameters.PRODUCT_CATEGORY_IDS_4_DESC}</dd>
            </dl>}
            {report.parameters?.PRODUCT_CATEGORY_IDS_5_DESC && <dl>
              <dt>{`${t("/catalog/product/product")}, ${t("/catalog/product/product.category5")}`}</dt>
              <dd>{report.parameters.PRODUCT_CATEGORY_IDS_5_DESC}</dd>
            </dl>}
            {report.parameters?.PRODUCT_PACKING_IDS_DESC && <dl>
              <dt>{t("/catalog/product/productPacking/plural")}</dt>
              <dd>{report.parameters.PRODUCT_PACKING_IDS_DESC}</dd>
            </dl>}
            {report.parameters?.PRODUCT_VARIANT_IDS_DESC && <dl>
              <dt>{t("/catalog/product/productVariant/plural")}</dt>
              <dd>{report.parameters.PRODUCT_VARIANT_IDS_DESC}</dd>
            </dl>}
            {report.parameters?.CITY_IDS_DESC && <dl>
              <dt>{t("/catalog/location/city/plural")}</dt>
              <dd>{report.parameters.CITY_IDS_DESC}</dd>
            </dl>}
            {report.parameters?.STATE_IDS_DESC && <dl>
              <dt>{t("/catalog/location/state/plural")}</dt>
              <dd>{report.parameters.STATE_IDS_DESC}</dd>
            </dl>}
            {report.parameters?.COUNTRY_IDS_DESC && <dl>
              <dt>{t("/catalog/location/country/plural")}</dt>
              <dd>{report.parameters.COUNTRY_IDS_DESC}</dd>
            </dl>}
            {report.parameters?.STATUS_LIST && <dl>
              <dt>{t("/@word/status")}</dt>
              <dd>{report.parameters.STATUS_LIST}</dd>
            </dl>}
            {report.parameters?.NCM_LIST && <dl>
              <dt>{t("/@unknown/ncmList")}</dt>
              <dd>{report.parameters.NCM_LIST}</dd>
            </dl>}
            {report.parameters?.CEST_LIST && <dl>
              <dt>{t("/@unknown/cestList")}</dt>
              <dd>{report.parameters.CEST_LIST}</dd>
            </dl>}
            {report.parameters?.SALES_HUB_LIST && <dl>
              <dt>{t("/@word/salesHub")}</dt>
              <dd>{report.parameters.SALES_HUB_LIST}</dd>
            </dl>}
            {report.parameters?.SALES_CHANNEL_LIST && <dl>
              <dt>{t("/@word/salesChannel")}</dt>
              <dd>{report.parameters.SALES_CHANNEL_LIST}</dd>
            </dl>}
            {report.parameters?.FLOW && <dl>
              <dt>{t("/@word/flow")}</dt>
              <dd>{report.parameters.FLOW}</dd>
            </dl>}
            {report.parameters?.RETURNED && <dl>
              <dt>{t("/@word/returned")}</dt>
              <dd>{report.parameters.RETURNED}</dd>
            </dl>}
            {report.parameters?.SIGN && <dl>
              <dt>{t("/@word/sign")}</dt>
              <dd>{report.parameters.SIGN}</dd>
            </dl>}
            {report.parameters?.FISCAL_PROFILE_OPERATION_TAGS && <dl>
              <dt>{t("/@unknown/fiscalProfileOperationTags")}</dt>
              <dd>{report.parameters.FISCAL_PROFILE_OPERATION_TAGS}</dd>
            </dl>}
            {report.parameters?.TAGS && <dl>
              <dt>{t("/@word/tags")}</dt>
              <dd>{report.parameters.TAGS}</dd>
            </dl>}
          </section>
        </header>
        <main>
          <div className="content">
            <Table
              columns={columns}
              visibleColumns={visibleColumns}
              data={data}
              groups={groups} />
          </div>
        </main>
      </div>
    </div>
  );
}
