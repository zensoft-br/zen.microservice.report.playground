import * as utils from "./utils.jsx";
import { Badge, Fields, Table } from "./utils.jsx";

export default function ({ data = [], meta = {}, t }) {
  const { report = {} } = meta;

  const settings =
    utils.deepMerge(report?.properties?.["#settings"], report?.properties?.userSettings) ?? {};

  const visibleFields = settings?.fields ?? [];

  const fieldGroups = [];

  const fields = [
    {
      id: "id",
      group: "main",
      label: utils.cellHeader(t("/@word/id")),
      value: (row) => row.id,
    },
    {
      id: "status",
      group: "main",
      label: utils.cellHeader(t("/@word/status")),
      value: (row) => <Badge>{t("/sale/saleStatus/enum/" + row.status)}</Badge>,
    },
  ];

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
      id: "company_id",
      width: "8ch",
      header: utils.cellHeader(t("/catalog/company/company"), t("/@word/id")),
      cell: ({ value }) => utils.formatNumber(value),
    },
    {
      id: "company_code",
      width: "16ch",
      header: utils.cellHeader(t("/catalog/company/company"), t("/@word/code")),
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "company_name",
      width: "32ch",
      header: utils.cellHeader(t("/catalog/company/company"), t("/@word/name")),
    },
    {
      id: "company_fantasyName",
      width: "24ch",
      header: utils.cellHeader(t("/catalog/company/company"), t("/@word/fantasyName")),
    },
    {
      id: "company_nameCalc",
      width: "24ch",
      header: utils.cellHeader(t("/catalog/company/company"), t("/@word/nameCalc")),
    },
    {
      id: "status",
      width: "16ch",
      header: utils.cellHeader(t("/@word/status")),
      cell: ({ value }) =>
        value ? <Badge>{t(`/supply/purchase/purchaseStatus/enum/${value}`)}</Badge> : null,
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
      width: "24ch",
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
      width: "24ch",
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
      width: "24ch",
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
      width: "24ch",
      header: utils.cellHeader(t("/catalog/person/person"), t("/@word/fantasyName")),
    },
    {
      id: "person_nameCalc",
      width: "24ch",
      header: utils.cellHeader(t("/catalog/person/person"), t("/@word/nameCalc")),
    },
    {
      id: "personGroup_description",
      width: "24ch",
      header: utils.cellHeader(t("/catalog/personGroup/personGroup"), t("/@word/description")),
    },
    {
      id: "personCategory_description_1",
      width: "24ch",
      header: utils.cellHeader(
        t("/catalog/personCategory/personCategory"),
        t("/@word/description"),
        "1",
      ),
    },
    {
      id: "personCategory_description_2",
      width: "24ch",
      header: utils.cellHeader(
        t("/catalog/personCategory/personCategory"),
        t("/@word/description"),
        "2",
      ),
    },
    {
      id: "personCategory_description_3",
      width: "24ch",
      header: utils.cellHeader(
        t("/catalog/personCategory/personCategory"),
        t("/@word/description"),
        "3",
      ),
    },
    {
      id: "personCategory_description_4",
      width: "24ch",
      header: utils.cellHeader(
        t("/catalog/personCategory/personCategory"),
        t("/@word/description"),
        "4",
      ),
    },
    {
      id: "personCategory_description_5",
      width: "24ch",
      header: utils.cellHeader(
        t("/catalog/personCategory/personCategory"),
        t("/@word/description"),
        "5",
      ),
    },
    {
      id: "city_name",
      width: "24ch",
      header: utils.cellHeader(t("/address/city/city"), t("/@word/name")),
    },
    {
      id: "state_name",
      width: "24ch",
      header: utils.cellHeader(t("/address/state/state"), t("/@word/name")),
    },
    {
      id: "country_name",
      width: "24ch",
      header: utils.cellHeader(t("/address/country/country"), t("/@word/name")),
    },
    {
      id: "purchaseProfile_description",
      width: "24ch",
      header: utils.cellHeader(
        t("/supply/purchaseProfile/purchaseProfile"),
        t("/@word/description"),
      ),
    },
    {
      id: "taxationOperation_id",
      width: "8ch",
      header: utils.cellHeader(t("/fiscal/taxationOperation"), t("/@word/id")),
      cell: ({ value }) => utils.formatNumber(value),
    },
    {
      id: "taxationOperation_code",
      width: "16ch",
      header: utils.cellHeader(t("/fiscal/taxationOperation"), t("/@word/code")),
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "taxationOperation_description",
      width: "24ch",
      header: utils.cellHeader(t("/fiscal/taxationOperation"), t("/@word/description")),
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
      width: "24ch",
      header: utils.cellHeader(t("/fiscal/fiscalProfileProduct"), t("/@word/description")),
    },
    {
      id: "productCategory_description_1",
      width: "24ch",
      header: utils.cellHeader(
        t("/catalog/productCategory/productCategory"),
        t("/@word/description"),
        "1",
      ),
    },
    {
      id: "productCategory_description_2",
      width: "24ch",
      header: utils.cellHeader(
        t("/catalog/productCategory/productCategory"),
        t("/@word/description"),
        "2",
      ),
    },
    {
      id: "productCategory_description_3",
      width: "24ch",
      header: utils.cellHeader(
        t("/catalog/productCategory/productCategory"),
        t("/@word/description"),
        "3",
      ),
    },
    {
      id: "productCategory_description_4",
      width: "24ch",
      header: utils.cellHeader(
        t("/catalog/productCategory/productCategory"),
        t("/@word/description"),
        "4",
      ),
    },
    {
      id: "productCategory_description_5",
      width: "24ch",
      header: utils.cellHeader(
        t("/catalog/productCategory/productCategory"),
        t("/@word/description"),
        "5",
      ),
    },
    {
      id: "product_properties_br_NCM",
      width: "16ch",
      header: utils.cellHeader(t("/catalog/product/product.properties.br.NCM")),
    },
    {
      id: "product_properties_br_CEST",
      width: "16ch",
      header: utils.cellHeader(t("/catalog/product/product.properties.br.CEST")),
    },
    {
      id: "productPacking_id",
      width: "8ch",
      header: utils.cellHeader(t("/catalog/productPacking/productPacking"), t("/@word/id")),
      cell: ({ value }) => utils.formatNumber(value),
    },
    {
      id: "productPacking_code",
      width: "16ch",
      header: utils.cellHeader(t("/catalog/productPacking/productPacking"), t("/@word/code")),
    },
    {
      id: "productPacking_complement",
      width: "16ch",
      header: utils.cellHeader(t("/catalog/productPacking/productPacking"), t("/@word/complement")),
    },
    {
      id: "productVariant_id",
      width: "8ch",
      header: utils.cellHeader(t("/catalog/productVariant/productVariant"), t("/@word/id")),
      cell: ({ value }) => utils.formatNumber(value),
    },
    {
      id: "productVariant_code",
      width: "16ch",
      header: utils.cellHeader(t("/catalog/productVariant/productVariant"), t("/@word/code")),
    },
    {
      id: "productVariant_description",
      width: "24ch",
      header: utils.cellHeader(
        t("/catalog/productVariant/productVariant"),
        t("/@word/description"),
      ),
    },
    {
      id: "currency_id",
      width: "8ch",
      header: utils.cellHeader(t("/financial/currency/currency"), t("/@word/id")),
      cell: ({ value }) => utils.formatNumber(value),
    },
    {
      id: "currency_code",
      width: "6ch",
      header: utils.cellHeader(t("/financial/currency/currency"), t("/@word/code")),
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
      header: utils.cellHeader(t("/@word/quantityBalance")),
      cell: ({ value }) => utils.formatNumber(value),
    },
    {
      id: "unit_code",
      width: "4ch",
      header: utils.cellHeader(t("/catalog/unit/unit"), t("/@word/code")),
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
    //{
    //  id: "netWeightKg",
    //  className: "number",
    //  width: "16ch",
    //  header: utils.cellHeader(t("/@word/netWeightKg")),
    //  cell: ({ value }) => utils.formatNumber(value, { digits: 3 }),
    //},
    //{
    //  id: "grossWeightKg",
    //  className: "number",
    //  width: "16ch",
    //  header: utils.cellHeader(t("/@word/grossWeightKg")),
    //  cell: ({ value }) => utils.formatNumber(value, { digits: 3 }),
    //},
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
      cellValue: ({ row }) => row.productPacking?.product?.description,
      cell: ({ value }) => utils.formatNumber(value),
    },
    {
      id: "count_purchaseItem",
      className: "number",
      width: "8ch",
      header: utils.cellHeader(t("/@word/countItem")),
      cellValue: ({ row }) => row.productPacking?.product?.description,
      cell: ({ value }) => utils.formatNumber(value),
    },
    {
      id: "freightType",
      width: "24ch",
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

  // return utils.meta_info({ fields, columns });

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
            {report.parameters?.dateStart && (
              <dl>
                <dt>{t("/@word/dateStart")}</dt>
                <dd>{utils.formatDate(report.parameters?.dateStart)}</dd>
              </dl>
            )}
            {report.parameters?.dateEnd && (
              <dl>
                <dt>{t("/@word/dateEnd")}</dt>
                <dd>{utils.formatDate(report.parameters?.dateEnd)}</dd>
              </dl>
            )}
          </section>
          <Fields
            fields={fields}
            visibleFields={visibleFields}
            data={data[0]}
            groups={fieldGroups}
          />
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
