import * as utils from "./utils.jsx";
import { Badge, Fields, Table } from "./utils.jsx";

export default function ({ data = [], meta = {}, t }) {
  const { report = {} } = meta;

  const settings =
    utils.deepMerge(report?.properties?.["#settings"], report?.properties?.userSettings) ?? {};

  const visibleFields = settings?.fields ?? [];

  const fieldGroups = [];

  const fields = [];

  const visibleColumns = (settings?.columns ?? []).filter(
    (item) => !(settings?.removeColumns ?? []).includes(item),
  );

  const groups = settings?.groups || [];

  const columns = [
    {
      id: "id",
      header: utils.cellHeader(t("/@word/id")),
      width: "10ch",
      className: "id",
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({ data }) => data.length,
      footer: ({ value }) => utils.formatNumber(value),
    },
    {
      id: "properties_paymentMethods",
      width: "16ch",
      header: utils.cellHeader(t("/@word/paymentMethods")),
      cellValue: ({ row }) => row.properties?.paymentMethods,
    },
    {
      id: "status",
      width: "15ch",
      header: utils.cellHeader(t("/@word/status")),
      cell: ({ value }) =>
        value ? <Badge>{t(`/supply/purchase/purchaseStatus/enum/${value}`)}</Badge> : null,
    },

    {
      id: "code",
      className: "number",
      width: "16ch",
      header: utils.cellHeader(t("/@word/code")),
    },
    {
      id: "date",
      width: "8ch",
      header: utils.cellHeader(t("/@word/date")),
      cell: ({ value }) => utils.formatDate(value),
    },
    {
      id: "day",
      width: "8ch",
      header: utils.cellHeader(t("/@word/day")),
    },
    {
      id: "month",
      width: "8ch",
      header: utils.cellHeader(t("/@word/month")),
    },
    {
      id: "year",
      width: "8ch",
      header: utils.cellHeader(t("/@word/year")),
    },
    {
      id: "availabilityDate",
      width: "8ch",
      header: utils.cellHeader(t("/@word/availabilityDate")),
      cell: ({ value }) => utils.formatDate(value),
    },
    {
      id: "company_id",
      width: "8ch",
      header: utils.cellHeader(t("/catalog/company/company"), t("/@word/id")),
      cell: ({ value }) => utils.formatNumber(value),
    },
    {
      id: "company_code",
      width: "10ch",
      header: utils.cellHeader(t("/catalog/company/company"), t("/@word/code")),
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "company_name",
      width: "20ch",
      header: utils.cellHeader(t("/catalog/company/company"), t("/@word/name")),
    },
    {
      id: "company_fantasyName",
      width: "20ch",
      header: utils.cellHeader(t("/catalog/company/company"), t("/@word/fantasyName")),
    },
    {
      id: "company_nameCalc",
      width: "20ch",
      header: utils.cellHeader(t("/catalog/company/company"), t("/@word/nameCalc")),
    },
    {
      id: "workflow_id",
      width: "8ch",
      header: utils.cellHeader(t("/system/workflow/workflow"), t("/@word/id")),
      cell: ({ value }) => utils.formatNumber(value),
    },
    {
      id: "workflow_code",
      width: "16ch",
      header: utils.cellHeader(t("/system/workflow/workflow"), t("/@word/code")),
    },
    {
      id: "workflow_description",
      width: "20ch",
      header: utils.cellHeader(t("/system/workflow/workflow"), t("/@word/description")),
    },
    {
      id: "workflowNode_id",
      width: "8ch",
      header: utils.cellHeader(t("/system/workflow/workflowNode"), t("/@word/id")),
      cell: ({ value }) => utils.formatNumber(value),
    },
    {
      id: "workflowNode_code",
      width: "16ch",
      header: utils.cellHeader(t("/system/workflow/workflowNode"), t("/@word/code")),
    },
    {
      id: "workflowNode_description",
      width: "20ch",
      header: utils.cellHeader(t("/system/workflow/workflowNode"), t("/@word/description")),
    },
    {
      id: "fiscalProfileOperation_id",
      width: "8ch",
      header: utils.cellHeader(t("/fiscal/fiscalProfileOperation"), t("/@word/id")),
      cell: ({ value }) => utils.formatNumber(value),
    },
    {
      id: "fiscalProfileOperation_code",
      width: "16ch",
      header: utils.cellHeader(t("/fiscal/fiscalProfileOperation"), t("/@word/code")),
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "fiscalProfileOperation_description",
      width: "20ch",
      header: utils.cellHeader(t("/fiscal/fiscalProfileOperation"), t("/@word/description")),
    },
    {
      id: "person_id",
      width: "8ch",
      header: utils.cellHeader(t("/catalog/person/person"), t("/@word/id")),
      cell: ({ value }) => utils.formatNumber(value),
    },
    {
      id: "person_name",
      width: "32ch",
      header: utils.cellHeader(t("/catalog/person/person"), t("/@word/name")),
    },
    {
      id: "person_fantasyName",
      width: "20ch",
      header: utils.cellHeader(t("/catalog/person/person"), t("/@word/fantasyName")),
    },
    {
      id: "person_nameCalc",
      width: "20ch",
      header: utils.cellHeader(t("/catalog/person/person"), t("/@word/nameCalc")),
    },
    {
      id: "personGroup_description",
      width: "20ch",
      header: utils.cellHeader(t("/catalog/person/personGroup"), t("/@word/description")),
    },
    {
      id: "personCategory_description_1",
      width: "20ch",
      header: utils.cellHeader(t("/catalog/person/person"), t("/@word/category1")),
    },
    {
      id: "personCategory_description_2",
      width: "20ch",
      header: utils.cellHeader(t("/catalog/person/person"), t("/@word/category2")),
    },
    {
      id: "personCategory_description_3",
      width: "20ch",
      header: utils.cellHeader(t("/catalog/person/person"), t("/@word/category3")),
    },
    {
      id: "personCategory_description_4",
      width: "20ch",
      header: utils.cellHeader(t("/catalog/person/person"), t("/@word/category4")),
    },
    {
      id: "personCategory_description_5",
      width: "20ch",
      header: utils.cellHeader(t("/catalog/person/person"), t("/@word/category5")),
    },
    {
      id: "city_name",
      width: "20ch",
      header: utils.cellHeader(t("/catalog/location/city"), t("/@word/name")),
    },
    {
      id: "state_name",
      width: "20ch",
      header: utils.cellHeader(t("/catalog/location/state"), t("/@word/name")),
    },
    {
      id: "country_name",
      width: "20ch",
      header: utils.cellHeader(t("/catalog/location/country"), t("/@word/name")),
    },
    {
      id: "purchaseProfile_description",
      width: "20ch",
      header: utils.cellHeader(t("/supply/purchase/purchaseProfile"), t("/@word/description")),
    },
    {
      id: "taxationOperation_id",
      width: "8ch",
      header: utils.cellHeader(t("/fiscal/taxation/taxationOperation"), t("/@word/id")),
      cell: ({ value }) => utils.formatNumber(value),
    },
    {
      id: "taxationOperation_code",
      width: "16ch",
      header: utils.cellHeader(t("/fiscal/taxation/taxationOperation"), t("/@word/code")),
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "taxationOperation_description",
      width: "20ch",
      header: utils.cellHeader(t("/fiscal/taxation/taxationOperation"), t("/@word/description")),
    },
    {
      id: "product_id",
      width: "8ch",
      header: utils.cellHeader(t("/catalog/product/product"), t("/@word/id")),
      cell: ({ value }) => utils.formatNumber(value),
    },
    {
      id: "product_code",
      width: "16ch",
      header: utils.cellHeader(t("/catalog/product/product"), t("/@word/code")),
    },
    {
      id: "product_description",
      width: "32ch",
      header: utils.cellHeader(t("/catalog/product/product"), t("/@word/description")),
    },
    {
      id: "fiscalProfileProduct_description",
      width: "20ch",
      header: utils.cellHeader(t("/fiscal/fiscalProfileProduct"), t("/@word/description")),
    },
    {
      id: "productCategory_description_1",
      width: "20ch",
      header: utils.cellHeader(t("/catalog/product/product"), t("/@word/category1")),
    },
    {
      id: "productCategory_description_2",
      width: "20ch",
      header: utils.cellHeader(t("/catalog/product/product"), t("/@word/category2")),
    },
    {
      id: "productCategory_description_3",
      width: "20ch",
      header: utils.cellHeader(t("/catalog/product/product"), t("/@word/category3")),
    },
    {
      id: "productCategory_description_4",
      width: "20ch",
      header: utils.cellHeader(t("/catalog/product/product"), t("/@word/category4")),
    },
    {
      id: "productCategory_description_5",
      width: "20ch",
      header: utils.cellHeader(t("/catalog/product/product"), t("/@word/category5")),
    },
    {
      id: "product_properties_br_NCM",
      width: "16ch",
      header: utils.cellHeader(t("/catalog/product.properties.fiscal_br_NCM")),
    },
    {
      id: "product_properties_br_CEST",
      width: "16ch",
      header: utils.cellHeader(t("/catalog/product.properties.fiscal_br_CEST")),
    },
    {
      id: "productPacking_id",
      width: "8ch",
      header: utils.cellHeader(t("/catalog/product/productPacking"), t("/@word/id")),
      cell: ({ value }) => utils.formatNumber(value),
    },
    {
      id: "productPacking_code",
      width: "16ch",
      header: utils.cellHeader(t("/catalog/product/productPacking"), t("/@word/code")),
    },
    {
      id: "productPacking_complement",
      width: "16ch",
      header: utils.cellHeader(t("/catalog/product/productPacking"), t("/@word/complement")),
    },
    {
      id: "productVariant_id",
      width: "8ch",
      header: utils.cellHeader(t("/catalog/product/productVariant"), t("/@word/id")),
      cell: ({ value }) => utils.formatNumber(value),
    },
    {
      id: "productVariant_code",
      width: "16ch",
      header: utils.cellHeader(t("/catalog/product/productVariant"), t("/@word/code")),
    },
    {
      id: "productVariant_description",
      width: "20ch",
      header: utils.cellHeader(t("/catalog/product/productVariant"), t("/@word/description")),
    },
    {
      id: "currency_id",
      width: "8ch",
      header: utils.cellHeader(t("/financial/currency"), t("/@word/id")),
      cell: ({ value }) => utils.formatNumber(value),
    },
    {
      id: "currency_code",
      width: "6ch",
      header: utils.cellHeader(t("/financial/currency"), t("/@word/code")),
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "quantity",
      className: "number",
      width: "16ch",
      header: utils.cellHeader(t("/@word/quantity")),
      cell: ({ value }) => utils.formatNumber(value),
    },
    {
      id: "servedQuantity",
      className: "number",
      width: "16ch",
      header: utils.cellHeader(t("/@word/servedQuantity")),
      cell: ({ value }) => utils.formatNumber(value),
    },
    {
      id: "quantityBalance",
      className: "number",
      width: "16ch",
      header: utils.cellHeader(t("/@word/balance")),
      cell: ({ value }) => utils.formatNumber(value),
    },
    {
      id: "unit_code",
      width: "4ch",
      header: utils.cellHeader(t("/catalog/product/unit"), t("/@word/code")),
    },
    {
      id: "item_unitValue",
      className: "number",
      width: "16ch",
      header: utils.cellHeader(t("/@word/unitValue")),
      cell: ({ row, value }) => utils.formatCurrency(value, { currency: row.currency_code }),
      footerValue: ({ data }) =>
        utils.sumBy(
          data,
          (item) => item.currency_code,
          (item) => item.item_unitValue,
        ),
      footer: ({ value }) =>
        utils.renderAggr(value, (val, key) => utils.formatCurrency(val, { currency: key })),
    },
    {
      id: "grossProductValue",
      className: "number",
      width: "16ch",
      header: utils.cellHeader(t("/@word/grossProductValue")),
      cell: ({ row, value }) => utils.formatCurrency(value, { currency: row.currency_code }),
      footerValue: ({ data }) =>
        utils.sumBy(
          data,
          (item) => item.currency_code,
          (item) => item.grossProductValue,
        ),
      footer: ({ value }) =>
        utils.renderAggr(value, (val, key) => utils.formatCurrency(val, { currency: key })),
    },
    {
      id: "discountValue",
      className: "number",
      width: "16ch",
      header: utils.cellHeader(t("/@word/discountValue")),
      cell: ({ row, value }) => utils.formatCurrency(value, { currency: row.currency_code }),
      footerValue: ({ data }) =>
        utils.sumBy(
          data,
          (item) => item.currency_code,
          (item) => item.discountValue,
        ),
      footer: ({ value }) =>
        utils.renderAggr(value, (val, key) => utils.formatCurrency(val, { currency: key })),
    },
    {
      id: "freightValue",
      className: "number",
      width: "16ch",
      header: utils.cellHeader(t("/@word/freightValue")),
      cell: ({ row, value }) => utils.formatCurrency(value, { currency: row.currency_code }),
      footerValue: ({ data }) =>
        utils.sumBy(
          data,
          (item) => item.currency_code,
          (item) => item.freightValue,
        ),
      footer: ({ value }) =>
        utils.renderAggr(value, (val, key) => utils.formatCurrency(val, { currency: key })),
    },
    {
      id: "insuranceValue",
      className: "number",
      width: "16ch",
      header: utils.cellHeader(t("/@word/insuranceValue")),
      cell: ({ row, value }) => utils.formatCurrency(value, { currency: row.currency_code }),
      footerValue: ({ data }) =>
        utils.sumBy(
          data,
          (item) => item.currency_code,
          (item) => item.insuranceValue,
        ),
      footer: ({ value }) =>
        utils.renderAggr(value, (val, key) => utils.formatCurrency(val, { currency: key })),
    },
    {
      id: "otherValue",
      className: "number",
      width: "16ch",
      header: utils.cellHeader(t("/@word/otherValue")),
      cell: ({ row, value }) => utils.formatCurrency(value, { currency: row.currency_code }),
      footerValue: ({ data }) =>
        utils.sumBy(
          data,
          (item) => item.currency_code,
          (item) => item.otherValue,
        ),
      footer: ({ value }) =>
        utils.renderAggr(value, (val, key) => utils.formatCurrency(val, { currency: key })),
    },
    {
      id: "operationValue",
      className: "number",
      width: "16ch",
      header: utils.cellHeader(t("/@word/operationValue")),
      cell: ({ row, value }) => utils.formatCurrency(value, { currency: row.currency_code }),
      footerValue: ({ data }) =>
        utils.sumBy(
          data,
          (item) => item.currency_code,
          (item) => item.operationValue,
        ),
      footer: ({ value }) =>
        utils.renderAggr(value, (val, key) => utils.formatCurrency(val, { currency: key })),
    },
    {
      id: "insideTaxValue",
      className: "number",
      width: "16ch",
      header: utils.cellHeader(t("/@word/insideTaxValue")),
      cell: ({ row, value }) => utils.formatCurrency(value, { currency: row.currency_code }),
      footerValue: ({ data }) =>
        utils.sumBy(
          data,
          (item) => item.currency_code,
          (item) => item.insideTaxValue,
        ),
      footer: ({ value }) =>
        utils.renderAggr(value, (val, key) => utils.formatCurrency(val, { currency: key })),
    },
    {
      id: "outsideTaxValue",
      className: "number",
      width: "16ch",
      header: utils.cellHeader(t("/@word/outsideTaxValue")),
      cell: ({ row, value }) => utils.formatCurrency(value, { currency: row.currency_code }),
      footerValue: ({ data }) =>
        utils.sumBy(
          data,
          (item) => item.currency_code,
          (item) => item.outsideTaxValue,
        ),
      footer: ({ value }) =>
        utils.renderAggr(value, (val, key) => utils.formatCurrency(val, { currency: key })),
    },
    {
      id: "totalValue",
      className: "number",
      width: "16ch",
      header: utils.cellHeader(t("/@word/totalValue")),
      cell: ({ row, value }) => utils.formatCurrency(value, { currency: row.currency_code }),
      footerValue: ({ data }) =>
        utils.sumBy(
          data,
          (item) => item.currency_code,
          (item) => item.totalValue,
        ),
      footer: ({ value }) =>
        utils.renderAggr(value, (val, key) => utils.formatCurrency(val, { currency: key })),
    },
    {
      id: "effectiveValue",
      className: "number",
      width: "16ch",
      header: utils.cellHeader(t("/@word/effectiveValue")),
      cell: ({ row, value }) => utils.formatCurrency(value, { currency: row.currency_code }),
      footerValue: ({ data }) =>
        utils.sumBy(
          data,
          (item) => item.currency_code,
          (item) => item.effectiveValue,
        ),
      footer: ({ value }) =>
        utils.renderAggr(value, (val, key) => utils.formatCurrency(val, { currency: key })),
    },
    {
      id: "netWeightKg",
      className: "number",
      width: "16ch",
      header: utils.cellHeader(t("/@word/netWeightKg")),
      cell: ({ value }) => utils.formatNumber(value, { digits: 3 }),
      footer: ({ value }) => utils.formatNumber(value, { digits: 3 }),
    },
    {
      id: "grossWeightKg",
      className: "number",
      width: "16ch",
      header: utils.cellHeader(t("/@word/grossWeightKg")),
      cell: ({ value }) => utils.formatNumber(value, { digits: 3 }),
      footer: ({ value }) => utils.formatNumber(value, { digits: 3 }),
    },
    {
      id: "contributionMargin",
      className: "number",
      width: "16ch",
      header: utils.cellHeader(t("/@word/contributionMargin")),
      cell: ({ row, value }) => utils.formatCurrency(value, { currency: row.currency_code }),
      footerValue: ({ data }) =>
        utils.sumBy(
          data,
          (item) => item.currency_code,
          (item) => item.contributionMargin,
        ),
      footer: ({ value }) =>
        utils.renderAggr(value, (val, key) => utils.formatCurrency(val, { currency: key })),
    },
    {
      id: "markup",
      className: "number",
      width: "16ch",
      header: utils.cellHeader(t("/@word/markup")),
      cell: ({ row, value }) => utils.formatCurrency(value, { currency: row.currency_code }),
      footerValue: ({ data }) =>
        utils.sumBy(
          data,
          (item) => item.currency_code,
          (item) => item.markup,
        ),
      footer: ({ value }) =>
        utils.renderAggr(value, (val, key) => utils.formatCurrency(val, { currency: key })),
    },
    {
      id: "count_purchase",
      className: "number",
      width: "8ch",
      header: utils.cellHeader(t("/@word/count")),
      cellValue: ({ row }) => row.count,
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({ data }) => data.length,
      footer: ({ value }) => utils.formatNumber(value),
    },
    {
      id: "count_purchaseItem",
      className: "number",
      width: "8ch",
      header: utils.cellHeader(`${t("/@word/count")}, ${t("/@word/item")}`),
      cellValue: ({ row }) => row.count_item,
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({ data }) => data.length,
      footer: ({ value }) => utils.formatNumber(value),
    },
    {
      id: "freightType",
      width: "20ch",
      header: utils.cellHeader(t("/@word/freightType")),
      cell: ({ value }) => (value ? t(`/commercial/freightType/enum/${value}`) : ""),
    },
    {
      id: "tags",
      width: "32ch",
      header: utils.cellHeader(t("/@word/tags")),
      cell: ({ value }) =>
        value ? value.split(",").map((tag) => <Badge key={tag}>{tag.trim()}</Badge>) : null,
    },
  ];

  return utils.meta_info({ fields, columns });

  data = utils.sort(data, settings?.sort || []);

  return (
    <div
      className={`report-wrapper ${settings?.className ?? ""}`}
      style={{ fontSize: settings?.fontSize }}
    >
      <div
        className={`report-container flex v gap ${settings?.pageSize ?? "a4"} ${settings?.orientation}`}
        style={{
          "--width": settings?.width,
          "--height": settings?.height,
          "--margin": settings?.margin,
        }}
      >
        <header>
          <section className="title">
            <dl style={{ flex: 0 }}>
              <dd>
                <img src={data.company?.image?.url} />
              </dd>
            </dl>
            <dl style={{ flex: 1 }}>
              <dd>
                <h1>
                  {t("/sale/sale")} {data.id}
                </h1>
              </dd>
            </dl>
            <dl style={{ flex: 0 }}>
              <dd>
                <img src={`https://barcode.zensoft.com.br?bcid=qrcode&text=${data.id}`} />
              </dd>
            </dl>
          </section>
          <section className="parameters">
            {report.parameters?.DATE_START && (
              <dl>
                <dt>{t("/@word/dateStart")}</dt>
                <dd>{utils.formatDate(report.parameters?.DATE_START)}</dd>
              </dl>
            )}
            {report.parameters?.DATE_END && (
              <dl>
                <dt>{t("/@word/dateEnd")}</dt>
                <dd>{utils.formatDate(report.parameters?.DATE_END)}</dd>
              </dl>
            )}
            {report?.parameters?.COMPANY_IDS && (
              <dl>
                <dt>{t("/catalog/company/company")}</dt>
                <dd>
                  {report?.parameters?.COMPANY_IDS_DESC ??
                    report?.parameters?.COMPANY_IDS.join(", ")}
                </dd>
              </dl>
            )}

            {report?.parameters?.PERSON_IDS && (
              <dl>
                <dt>{t("/catalog/person/person")}</dt>
                <dd>
                  {report?.parameters?.PERSON_IDS_DESC ?? report?.parameters?.PERSON_IDS.join(", ")}
                </dd>
              </dl>
            )}

            {report?.parameters?.PERSON_GROUP_IDS && (
              <dl>
                <dt>{t("/catalog/person/personGroup")}</dt>
                <dd>
                  {report?.parameters?.PERSON_GROUP_IDS_DESC ??
                    report?.parameters?.PERSON_GROUP_IDS.join(", ")}
                </dd>
              </dl>
            )}

            {report?.parameters?.PRODUCT_IDS && (
              <dl>
                <dt>{t("/catalog/product/product")}</dt>
                <dd>
                  {report?.parameters?.PRODUCT_IDS_DESC ??
                    report?.parameters?.PRODUCT_IDS.join(", ")}
                </dd>
              </dl>
            )}

            {report?.parameters?.PRODUCT_PACKING_IDS && (
              <dl>
                <dt>{t("/catalog/product/productPacking")}</dt>
                <dd>
                  {report?.parameters?.PRODUCT_PACKING_IDS_DESC ??
                    report?.parameters?.PRODUCT_PACKING_IDS.join(", ")}
                </dd>
              </dl>
            )}

            {report?.parameters?.PRODUCT_VARIANT_IDS && (
              <dl>
                <dt>{t("/catalog/product/productVariant")}</dt>
                <dd>
                  {report?.parameters?.PRODUCT_VARIANT_IDS_DESC ??
                    report?.parameters?.PRODUCT_VARIANT_IDS.join(", ")}
                </dd>
              </dl>
            )}

            {report?.parameters?.PRODUCT_CATEGORY_IDS_1 && (
              <dl>
                <dt>{`${t("/catalog/product/product")}, ${t("/@word/category1")}`}</dt>
                <dd>
                  {report?.parameters?.PRODUCT_CATEGORY_IDS_1_DESC ??
                    report?.parameters?.PRODUCT_CATEGORY_IDS_1.join(", ")}
                </dd>
              </dl>
            )}

            {report?.parameters?.PRODUCT_CATEGORY_IDS_2 && (
              <dl>
                <dt>{`${t("/catalog/product/product")}, ${t("/@word/category2")}`}</dt>
                <dd>
                  {report?.parameters?.PRODUCT_CATEGORY_IDS_2_DESC ??
                    report?.parameters?.PRODUCT_CATEGORY_IDS_2.join(", ")}
                </dd>
              </dl>
            )}

            {report?.parameters?.PRODUCT_CATEGORY_IDS_3 && (
              <dl>
                <dt>{`${t("/catalog/product/product")}, ${t("/@word/category3")}`}</dt>
                <dd>
                  {report?.parameters?.PRODUCT_CATEGORY_IDS_3_DESC ??
                    report?.parameters?.PRODUCT_CATEGORY_IDS_3.join(", ")}
                </dd>
              </dl>
            )}

            {report?.parameters?.PRODUCT_CATEGORY_IDS_4 && (
              <dl>
                <dt>{`${t("/catalog/product/product")}, ${t("/@word/category4")}`}</dt>
                <dd>
                  {report?.parameters?.PRODUCT_CATEGORY_IDS_4_DESC ??
                    report?.parameters?.PRODUCT_CATEGORY_IDS_4.join(", ")}
                </dd>
              </dl>
            )}

            {report?.parameters?.PRODUCT_CATEGORY_IDS_5 && (
              <dl>
                <dt>{`${t("/catalog/product/product")}, ${t("/@word/category5")}`}</dt>
                <dd>
                  {report?.parameters?.PRODUCT_CATEGORY_IDS_5_DESC ??
                    report?.parameters?.PRODUCT_CATEGORY_IDS_5.join(", ")}
                </dd>
              </dl>
            )}

            {report?.parameters?.WORKFLOW_IDS && (
              <dl>
                <dt>{t("/system/workflow/workflow")}</dt>
                <dd>
                  {report?.parameters?.WORKFLOW_IDS_DESC ??
                    report?.parameters?.WORKFLOW_IDS.join(", ")}
                </dd>
              </dl>
            )}

            {report?.parameters?.WORKFLOW_NODE_IDS && (
              <dl>
                <dt>{t("/system/workflow/workflowNode")}</dt>
                <dd>
                  {report?.parameters?.WORKFLOW_NODE_IDS_DESC ??
                    report?.parameters?.WORKFLOW_NODE_IDS.join(", ")}
                </dd>
              </dl>
            )}

            {report?.parameters?.FISCAL_PROFILE_OPERATION_IDS && (
              <dl>
                <dt>{t("/fiscal/fiscalProfileOperation")}</dt>
                <dd>
                  {report?.parameters?.FISCAL_PROFILE_OPERATION_IDS_DESC ??
                    report?.parameters?.FISCAL_PROFILE_OPERATION_IDS.join(", ")}
                </dd>
              </dl>
            )}

            {report?.parameters?.FISCAL_PROFILE_PRODUCT_IDS && (
              <dl>
                <dt>{t("/fiscal/fiscalProfileProduct")}</dt>
                <dd>
                  {report?.parameters?.FISCAL_PROFILE_PRODUCT_IDS_DESC ??
                    report?.parameters?.FISCAL_PROFILE_PRODUCT_IDS.join(", ")}
                </dd>
              </dl>
            )}

            {report?.parameters?.TAXATION_OPERATION_IDS && (
              <dl>
                <dt>{t("/fiscal/taxation/taxationOperation")}</dt>
                <dd>
                  {report?.parameters?.TAXATION_OPERATION_IDS_DESC ??
                    report?.parameters?.TAXATION_OPERATION_IDS.join(", ")}
                </dd>
              </dl>
            )}

            {report?.parameters?.CITY_IDS && (
              <dl>
                <dt>{t("/catalog/location/city")}</dt>
                <dd>
                  {report?.parameters?.CITY_IDS_DESC ?? report?.parameters?.CITY_IDS.join(", ")}
                </dd>
              </dl>
            )}

            {report?.parameters?.STATE_IDS && (
              <dl>
                <dt>{t("/catalog/location/state")}</dt>
                <dd>
                  {report?.parameters?.STATE_IDS_DESC ?? report?.parameters?.STATE_IDS.join(", ")}
                </dd>
              </dl>
            )}

            {report?.parameters?.COUNTRY_IDS && (
              <dl>
                <dt>{t("/catalog/location/country")}</dt>
                <dd>
                  {report?.parameters?.COUNTRY_IDS_DESC ??
                    report?.parameters?.COUNTRY_IDS.join(", ")}
                </dd>
              </dl>
            )}
          </section>
        </header>
        <main>
          <div className="content">
            <Table
              columns={columns}
              visibleColumns={visibleColumns}
              data={data}
              groups={groups}
              footerTitle={t("/@word/summary")}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
