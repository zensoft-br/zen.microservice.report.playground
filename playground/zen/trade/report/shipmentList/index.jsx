import * as utils from "./utils.jsx";
import { Badge, Table } from "./utils.jsx";

export default function ({ data = [], meta = {}, t }) {
  const { report = {} } = meta;

  const settings = utils.deepMerge(report?.properties?.["#settings"], report?.properties?.userSettings) ?? {};

  const columns = [
    { id: "shipment_id",
      header: utils.cellHeader(t("/trade/shipment"), t("/@word/id")),
      width: "8ch",
      className: "number",
      headerClassName: "number",
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({ data }) => data.length,
      footer: ({ value }) => utils.formatNumber(value),
    },
    { id: "shipment_status",
      header: utils.cellHeader(t("/trade/shipment"), t("/@word/status")),
      width: "16ch",
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    { id: "shipment_code",
      header: utils.cellHeader(t("/trade/shipment"), t("/@word/code")),
      width: "16ch",
    },
    { id: "workflow_id",
      header: utils.cellHeader(t("/system/workflow/workflow"), t("/@word/id")),
      width: "8ch",
      className: "number",
      headerClassName: "number",
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({ data }) => data.length,
      footer: ({ value }) => utils.formatNumber(value),
    },
    { id: "workflow_code",
      header: utils.cellHeader(t("/system/workflow/workflow"), t("/@word/code")),
      width: "16ch",
    },
    { id: "workflow_description",
      header: utils.cellHeader(t("/system/workflow/workflow"), t("/@word/description")),
      width: "24ch",
    },
    { id: "workflowNode_id",
      header: utils.cellHeader(t("/system/workflow/workflowNode"), t("/@word/id")),
      width: "8ch",
      className: "number",
      cell: ({ value }) => utils.formatNumber(value),
    },
    { id: "workflowNode_code",
      header: utils.cellHeader(t("/system/workflow/workflowNode"), t("/@word/code")),
      width: "16ch",
    },
    { id: "workflowNode_description",
      header: utils.cellHeader(t("/system/workflow/workflowNode"), t("/@word/description")),
      width: "24ch",
    },
    { id: "currency_id",
      header: utils.cellHeader(t("/financial/currency"), t("/@word/id")),
      width: "8ch",
      className: "number",
      cell: ({ value }) => utils.formatNumber(value),
    },
    { id: "currency_code",
      header: utils.cellHeader(t("/financial/currency"), t("/@word/code")),
      width: "16ch",
    },
    { id: "shipment_date",
      header: utils.cellHeader(t("/trade/shipment"), t("/@word/date")),
      width: "10ch",
      cell: ({ value }) => utils.formatDate(value),
    },
    { id: "shipment_day",
      header: utils.cellHeader(t("/trade/shipment"), t("/@word/day")),
      width: "16ch",
    },
    { id: "shipment_month",
      header: utils.cellHeader(t("/trade/shipment"), t("/@word/month")),
      width: "16ch",
    },
    { id: "shipment_year",
      header: utils.cellHeader(t("/trade/shipment"), t("/@word/year")),
      width: "16ch",
    },
    { id: "shipment_tags",
      header: utils.cellHeader(t("/trade/shipment"), t("/@word/tags")),
      width: "16ch",
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
    //
    { id: "person_id",
      header: utils.cellHeader(t("/catalog/person/person"), t("/@word/id")),
      width: "8ch",
      className: "number",
      headerClassName: "number",
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({ data }) => data.length,
      footer: ({ value }) => utils.formatNumber(value),
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
    //
    { id: "personGroup_id",
      header: utils.cellHeader(t("/catalog/person/personGroup"), t("/@word/id")),
      width: "8ch",
      className: "number",
      headerClassName: "number",
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({ data }) => data.length,
      footer: ({ value }) => utils.formatNumber(value),
    },
    { id: "personGroup_code",
      header: utils.cellHeader(t("/catalog/person/personGroup"), t("/@word/code")),
      width: "16ch",
    },
    { id: "personGroup_description",
      header: utils.cellHeader(t("/catalog/person/personGroup"), t("/@word/description")),
      width: "24ch",
    },
    //
    { id: "personCategory_id_1",
      header: utils.cellHeader(t("/catalog/person/person"), t("/catalog/person/person.category1"), t("/@word/id")),
      width: "8ch",
      className: "number",
    },
    { id: "personCategory_code_1",
      header: utils.cellHeader(t("/catalog/person/person"), t("/catalog/person/person.category1"), t("/@word/code")),
      width: "16ch",
    },
    { id: "personCategory_description_1",
      header: utils.cellHeader(t("/catalog/person/person"), t("/catalog/person/person.category1"), t("/@word/description")),
      width: "24ch",
    },
    { id: "personCategory_id_2",
      header: utils.cellHeader(t("/catalog/person/person"), t("/catalog/person/person.category2"), t("/@word/id")),
      width: "8ch",
      className: "number",
    },
    { id: "personCategory_code_2",
      header: utils.cellHeader(t("/catalog/person/person"), t("/catalog/person/person.category2"), t("/@word/code")),
      width: "16ch",
    },
    { id: "personCategory_description_2",
      header: utils.cellHeader(t("/catalog/person/person"), t("/catalog/person/person.category2"), t("/@word/description")),
      width: "24ch",
    },
    { id: "personCategory_id_3",
      header: utils.cellHeader(t("/catalog/person/person"), t("/catalog/person/person.category3"), t("/@word/id")),
      width: "8ch",
      className: "number",
    },
    { id: "personCategory_code_3",
      header: utils.cellHeader(t("/catalog/person/person"), t("/catalog/person/person.category3"), t("/@word/code")),
      width: "16ch",
    },
    { id: "personCategory_description_3",
      header: utils.cellHeader(t("/catalog/person/person"), t("/catalog/person/person.category3"), t("/@word/description")),
      width: "24ch",
    },
    { id: "personCategory_id_4",
      header: utils.cellHeader(t("/catalog/person/person"), t("/catalog/person/person.category4"), t("/@word/id")),
      width: "8ch",
      className: "number",
    },
    { id: "personCategory_code_4",
      header: utils.cellHeader(t("/catalog/person/person"), t("/catalog/person/person.category4"), t("/@word/code")),
      width: "16ch",
    },
    { id: "personCategory_description_4",
      header: utils.cellHeader(t("/catalog/person/person"), t("/catalog/person/person.category4"), t("/@word/description")),
      width: "24ch",
    },
    { id: "personCategory_id_5",
      header: utils.cellHeader(t("/catalog/person/person"), t("/catalog/person/person.category5"), t("/@word/id")),
      width: "8ch",
      className: "number",
    },
    { id: "personCategory_code_5",
      header: utils.cellHeader(t("/catalog/person/person"), t("/catalog/person/person.category5"), t("/@word/code")),
      width: "16ch",
    },
    { id: "personCategory_description_5",
      header: utils.cellHeader(t("/catalog/person/person"), t("/catalog/person/person.category5"), t("/@word/description")),
      width: "24ch",
    },
    //
    { id: "city_id",
      header: utils.cellHeader(t("/catalog/location/city"), t("/@word/id")),
      width: "8ch",
      className: "number",
    },
    { id: "city_name",
      header: utils.cellHeader(t("/catalog/location/city"), t("/@word/name")),
      width: "24ch",
    },
    { id: "state_id",
      header: utils.cellHeader(t("/catalog/location/state"), t("/@word/id")),
      width: "8ch",
      className: "number",
    },
    { id: "state_code",
      header: utils.cellHeader(t("/catalog/location/state"), t("/@word/code")),
      width: "16ch",
    },
    { id: "state_name",
      header: utils.cellHeader(t("/catalog/location/state"), t("/@word/name")),
      width: "24ch",
    },
    { id: "country_id",
      header: utils.cellHeader(t("/catalog/location/country"), t("/@word/id")),
      width: "8ch",
      className: "number",
    },
    { id: "country_codeA2",
      header: utils.cellHeader(t("/catalog/location/country"), t("/@word/codeA2")),
      width: "16ch",
    },
    { id: "country_name",
      header: utils.cellHeader(t("/catalog/location/country"), t("/@word/name")),
      width: "24ch",
    },
    //
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
    { id: "fiscalProfileProduct_id",
      header: utils.cellHeader(t("/fiscal/fiscalProfileProduct"), t("/@word/id")),
      width: "8ch",
      className: "number",
    },
    { id: "fiscalProfileProduct_description",
      header: utils.cellHeader(t("/fiscal/fiscalProfileProduct"), t("/@word/description")),
      width: "24ch",
    },
    { id: "productCategory_id_1",
      header: utils.cellHeader(t("/catalog/product/product"), t("/catalog/product/product.category1"), t("/@word/id")),
      width: "8ch",
      className: "number",
    },
    { id: "productCategory_code_1",
      header: utils.cellHeader(t("/catalog/product/product"), t("/catalog/product/product.category1"), t("/@word/code")),
      width: "16ch",
    },
    { id: "productCategory_description_1",
      header: utils.cellHeader(t("/catalog/product/product"), t("/catalog/product/product.category1"), t("/@word/description")),
      width: "24ch",
    },
    { id: "productCategory_id_2",
      header: utils.cellHeader(t("/catalog/product/product"), t("/catalog/product/product.category2"), t("/@word/id")),
      width: "8ch",
      className: "number",
    },
    { id: "productCategory_code_2",
      header: utils.cellHeader(t("/catalog/product/product"), t("/catalog/product/product.category2"), t("/@word/code")),
      width: "16ch",
    },
    { id: "productCategory_description_2",
      header: utils.cellHeader(t("/catalog/product/product"), t("/catalog/product/product.category2"), t("/@word/description")),
      width: "24ch",
    },
    { id: "productCategory_id_3",
      header: utils.cellHeader(t("/catalog/product/product"), t("/catalog/product/product.category3"), t("/@word/id")),
      width: "8ch",
      className: "number",
    },
    { id: "productCategory_code_3",
      header: utils.cellHeader(t("/catalog/product/product"), t("/catalog/product/product.category3"), t("/@word/code")),
      width: "16ch",
    },
    { id: "productCategory_description_3",
      header: utils.cellHeader(t("/catalog/product/product"), t("/catalog/product/product.category3"), t("/@word/description")),
      width: "24ch",
    },
    { id: "productCategory_id_4",
      header: utils.cellHeader(t("/catalog/product/product"), t("/catalog/product/product.category4"), t("/@word/id")),
      width: "8ch",
      className: "number",
    },
    { id: "productCategory_code_4",
      header: utils.cellHeader(t("/catalog/product/product"), t("/catalog/product/product.category4"), t("/@word/code")),
      width: "16ch",
    },
    { id: "productCategory_description_4",
      header: utils.cellHeader(t("/catalog/product/product"), t("/catalog/product/product.category4"), t("/@word/description")),
      width: "24ch",
    },
    { id: "productCategory_id_5",
      header: utils.cellHeader(t("/catalog/product/product"), t("/catalog/product/product.category5"), t("/@word/id")),
      width: "8ch",
      className: "number",
    },
    { id: "productCategory_code_5",
      header: utils.cellHeader(t("/catalog/product/product"), t("/catalog/product/product.category5"), t("/@word/code")),
      width: "16ch",
    },
    { id: "productCategory_description_5",
      header: utils.cellHeader(t("/catalog/product/product"), t("/catalog/product/product.category5"), t("/@word/description")),
      width: "24ch",
    },
    { id: "product_properties_br_NCM",
      header: utils.cellHeader(t("/catalog/product.properties.fiscal_br_NCM")),
      width: "16ch",
    },
    { id: "product_properties_br_CEST",
      header: utils.cellHeader(t("/catalog/product.properties.fiscal_br_CEST")),
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
    //
    { id: "shipmentItem_unitValue",
      header: utils.cellHeader(t("/trade/shipmentItem"), t("/@word/unitValue")),
      width: "16ch",
      className: "number",
      cell: ({ value }) => utils.formatCurrency(value),
    },
    { id: "shipmentItem_unitValueUnits",
      header: utils.cellHeader(t("/trade/shipmentItem"), t("/@word/unitValueUnits")),
      width: "16ch",
      className: "number",
      cell: ({ value }) => utils.formatCurrency(value),
    },
    //
    { id: "unit_id",
      header: utils.cellHeader(t("/catalog/product/unit"), t("/@word/id")),
      width: "8ch",
      className: "number",
    },
    { id: "unit_code",
      header: utils.cellHeader(t("/catalog/product/unit"), t("/@word/code")),
      width: "8ch",
    },
    //
    { id: "sum_quantity",
      header: utils.cellHeader(t("/@word/quantity")),
      width: "16ch",
      className: "number",
      headerClassName: "number",
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({ data }) => data.reduce((red, item) => red + (Number(item.sum_quantity) || 0), 0),
      footer: ({ value }) => utils.formatNumber(value),
    },
    { id: "sum_quantity_units",
      header: utils.cellHeader(t("/@word/quantityUnits")),
      width: "16ch",
      className: "number",
      headerClassName: "number",
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({ data }) => data.reduce((red, item) => red + (Number(item.sum_quantity_units) || 0), 0),
      footer: ({ value }) => utils.formatNumber(value),
    },
    { id: "sum_totalValue",
      header: utils.cellHeader(t("/@word/totalValue")),
      width: "16ch",
      className: "number",
      headerClassName: "number",
      cell: ({ value }) => utils.formatCurrency(value),
      footerValue: ({ data }) => data.reduce((red, item) => red + (Number(item.sum_totalValue) || 0), 0),
      footer: ({ value }) => utils.formatCurrency(value),
    },
    { id: "sum_netWeightKg",
      header: utils.cellHeader(t("/@word/netWeightKg")),
      width: "16ch",
      className: "number",
      headerClassName: "number",
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({ data }) => data.reduce((red, item) => red + (Number(item.sum_netWeightKg) || 0), 0),
      footer: ({ value }) => utils.formatNumber(value),
    },
    { id: "sum_grossWeightKg",
      header: utils.cellHeader(t("/@word/grossWeightKg")),
      width: "16ch",
      className: "number",
      headerClassName: "number",
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({ data }) => data.reduce((red, item) => red + (Number(item.sum_grossWeightKg) || 0), 0),
      footer: ({ value }) => utils.formatNumber(value),
    },
    { id: "count_shipment",
      header: utils.cellHeader(t("/trade/shipment"), t("/@word/count")),
      width: "16ch",
      className: "number",
      headerClassName: "number",
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({ data }) => data.reduce((red, item) => red + (Number(item.count_shipment) || 0), 0),
      footer: ({ value }) => utils.formatNumber(value),
    },
    { id: "count_shipmentItem",
      header: utils.cellHeader(t("/trade/shipmentItem"), t("/@word/count")),
      width: "16ch",
      className: "number",
      headerClassName: "number",
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({ data }) => data.reduce((red, item) => red + (Number(item.count_shipmentItem) || 0), 0),
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
          <h1>{t("/trade/report/shipmentList")}</h1>
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
