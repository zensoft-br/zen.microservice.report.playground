import * as utils from "./utils.jsx";
import { Badge, Table } from "./utils.jsx";

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
    { id: "flow", header: utils.cellHeader(t("/@word/flow")), width: "16ch" },
    { id: "returned", header: utils.cellHeader(t("/@word/returned")), width: "16ch" },
    { id: "sign", header: utils.cellHeader(t("/@word/sign")), width: "16ch" },
    {
      id: "invoice_id",
      className: "id",
      width: "8ch",
      header: utils.cellHeader(t("/@word/id")),
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({ data }) => data.length,
      footer: ({ value }) => utils.formatNumber(value),
    },
    {
      id: "invoice_status",
      width: "16ch",
      header: utils.cellHeader(t("/@word/status")),
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "workflow_id",
      width: "8ch",
      header: utils.cellHeader(t("/system/workflow/workflow"), t("/@word/id")),
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({ data }) => data.length,
      footer: ({ value }) => utils.formatNumber(value),
    },
    {
      id: "workflow_code",
      width: "16ch",
      header: utils.cellHeader(t("/system/workflow/workflow"), t("/@word/code")),
      cell: ({ value }) => <Badge>{value}</Badge>,
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
      footerValue: ({ data }) => data.length,
      footer: ({ value }) => utils.formatNumber(value),
    },
    {
      id: "workflowNode_code",
      width: "16ch",
      header: utils.cellHeader(t("/system/workflow/workflowNode"), t("/@word/code")),
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "workflowNode_description",
      width: "24ch",
      header: utils.cellHeader(t("/system/workflow/workflowNode"), t("/@word/description")),
    },
    {
      id: "invoice_number",
      className: "number",
      width: "10ch",
      header: utils.cellHeader(t("/@word/number")),
      cell: ({ value }) => utils.formatNumber(value),
    },
    {
      id: "invoice_date",
      width: "12ch",
      header: utils.cellHeader(t("/@word/date")),
      cell: ({ value }) => utils.formatDate(value),
    },
    {
      id: "invoice_day",
      width: "16ch",
      header: utils.cellHeader(t("/@word/day")),
    },
    {
      id: "invoice_month",
      width: "16ch",
      header: utils.cellHeader(t("/@word/month")),
    },
    {
      id: "invoice_year",
      width: "16ch",
      header: utils.cellHeader(t("/@word/year")),
    },
    {
      id: "invoice_issueDate",
      width: "12ch",
      header: utils.cellHeader(t("/@word/issueDate")),
      cell: ({ value }) => utils.formatDate(value),
    },
    {
      id: "invoice_freightType",
      width: "16ch",
      header: utils.cellHeader(t("/@word/freightType")),
    },
    {
      id: "invoice_tags",
      width: "16ch",
      header: utils.cellHeader(t("/@word/tags")),
    },
    {
      id: "invoice_properties_volumes",
      width: "16ch",
      header: utils.cellHeader(t("/fiscal/invoice.properties.volumes")),
    },
    {
      id: "company_id",
      width: "8ch",
      header: utils.cellHeader(t("/catalog/company/company"), t("/@word/id")),
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({ data }) => data.length,
      footer: ({ value }) => utils.formatNumber(value),
    },
    {
      id: "company_code",
      width: "10ch",
      header: utils.cellHeader(t("/catalog/company/company"), t("/@word/code")),
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "company_name",
      width: "24ch",
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
      id: "fiscalProfileOperation_id",
      width: "8ch",
      header: utils.cellHeader(t("/fiscal/fiscalProfileOperation"), t("/@word/id")),
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({ data }) => data.length,
      footer: ({ value }) => utils.formatNumber(value),
    },
    {
      id: "fiscalProfileOperation_code",
      width: "20ch",
      header: utils.cellHeader(t("/fiscal/fiscalProfileOperation"), t("/@word/code")),
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "fiscalProfileOperation_description",
      width: "24ch",
      header: utils.cellHeader(t("/fiscal/fiscalProfileOperation"), t("/@word/description")),
    },
    {
      id: "invoiceSeries_id",
      width: "8ch",
      header: utils.cellHeader(t("/fiscal/invoiceSeries"), t("/@word/id")),
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({ data }) => data.length,
      footer: ({ value }) => utils.formatNumber(value),
    },
    {
      id: "invoiceSeries_code",
      width: "16ch",
      header: utils.cellHeader(t("/fiscal/invoiceSeries"), t("/@word/code")),
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "invoiceSeries_description",
      width: "24ch",
      header: utils.cellHeader(t("/fiscal/invoiceSeries"), t("/@word/description")),
    },
    {
      id: "person_id",
      width: "8ch",
      header: utils.cellHeader(t("/catalog/person/person"), t("/@word/id")),
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({ data }) => data.length,
      footer: ({ value }) => utils.formatNumber(value),
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
      header: utils.cellHeader(t("/catalog/person/person"), t("/@word/nameCalc")),
    },
    {
      id: "personGroup_id",
      width: "8ch",
      header: utils.cellHeader(t("/catalog/person/personGroup"), t("/@word/id")),
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({ data }) => data.length,
      footer: ({ value }) => utils.formatNumber(value),
    },
    {
      id: "personGroup_code",
      width: "16ch",
      header: utils.cellHeader(t("/catalog/person/personGroup"), t("/@word/code")),
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "personGroup_description",
      width: "24ch",
      header: utils.cellHeader(t("/catalog/person/personGroup"), t("/@word/description")),
    },
    {
      id: "personCategory_id_1",
      className: "number",
      width: "8ch",
      header: utils.cellHeader(
        t("/catalog/person/person"),
        t("/catalog/person/person.category1"),
        t("/@word/id"),
      ),
    },
    {
      id: "personCategory_code_1",
      width: "16ch",
      header: utils.cellHeader(
        t("/catalog/person/person"),
        t("/catalog/person/person.category1"),
        t("/@word/code"),
      ),
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "personCategory_description_1",
      width: "24ch",
      header: utils.cellHeader(
        t("/catalog/person/person"),
        t("/catalog/person/person.category1"),
        t("/@word/description"),
      ),
    },
    {
      id: "personCategory_id_2",
      className: "number",
      width: "8ch",
      header: utils.cellHeader(
        t("/catalog/person/person"),
        t("/catalog/person/person.category2"),
        t("/@word/id"),
      ),
    },
    {
      id: "personCategory_code_2",
      width: "16ch",
      header: utils.cellHeader(
        t("/catalog/person/person"),
        t("/catalog/person/person.category2"),
        t("/@word/code"),
      ),
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "personCategory_description_2",
      width: "24ch",
      header: utils.cellHeader(
        t("/catalog/person/person"),
        t("/catalog/person/person.category2"),
        t("/@word/description"),
      ),
    },
    {
      id: "personCategory_id_3",
      className: "number",
      width: "8ch",
      header: utils.cellHeader(
        t("/catalog/person/person"),
        t("/catalog/person/person.category3"),
        t("/@word/id"),
      ),
    },
    {
      id: "personCategory_code_3",
      width: "16ch",
      header: utils.cellHeader(
        t("/catalog/person/person"),
        t("/catalog/person/person.category3"),
        t("/@word/code"),
      ),
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "personCategory_description_3",
      width: "24ch",
      header: utils.cellHeader(
        t("/catalog/person/person"),
        t("/catalog/person/person.category3"),
        t("/@word/description"),
      ),
    },
    {
      id: "personCategory_id_4",
      className: "number",
      width: "8ch",
      header: utils.cellHeader(
        t("/catalog/person/person"),
        t("/catalog/person/person.category4"),
        t("/@word/id"),
      ),
    },
    {
      id: "personCategory_code_4",
      width: "16ch",
      header: utils.cellHeader(
        t("/catalog/person/person"),
        t("/catalog/person/person.category4"),
        t("/@word/code"),
      ),
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "personCategory_description_4",
      width: "24ch",
      header: utils.cellHeader(
        t("/catalog/person/person"),
        t("/catalog/person/person.category4"),
        t("/@word/description"),
      ),
    },
    {
      id: "personCategory_id_5",
      className: "number",
      width: "8ch",
      header: utils.cellHeader(
        t("/catalog/person/person"),
        t("/catalog/person/person.category5"),
        t("/@word/id"),
      ),
    },
    {
      id: "personCategory_code_5",
      width: "16ch",
      header: utils.cellHeader(
        t("/catalog/person/person"),
        t("/catalog/person/person.category5"),
        t("/@word/code"),
      ),
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "personCategory_description_5",
      width: "24ch",
      header: utils.cellHeader(
        t("/catalog/person/person"),
        t("/catalog/person/person.category5"),
        t("/@word/description"),
      ),
    },
    {
      id: "city_id",
      width: "8ch",
      header: utils.cellHeader(t("/catalog/location/city"), t("/@word/id")),
    },
    {
      id: "city_name",
      width: "24ch",
      header: utils.cellHeader(t("/catalog/location/city"), t("/@word/name")),
    },
    {
      id: "state_id",
      width: "8ch",
      header: utils.cellHeader(t("/catalog/location/state"), t("/@word/id")),
    },
    {
      id: "state_code",
      width: "16ch",
      header: utils.cellHeader(t("/catalog/location/state"), t("/@word/code")),
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "state_name",
      width: "24ch",
      header: utils.cellHeader(t("/catalog/location/state"), t("/@word/name")),
    },
    {
      id: "country_id",
      width: "8ch",
      header: utils.cellHeader(t("/catalog/location/country"), t("/@word/id")),
    },
    {
      id: "country_codeA2",
      width: "16ch",
      header: utils.cellHeader(t("/catalog/location/country"), t("/@word/codeA2")),
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "country_name",
      width: "24ch",
      header: utils.cellHeader(t("/catalog/location/country"), t("/@word/name")),
    },
    {
      id: "shipping_id",
      width: "8ch",
      header: utils.cellHeader(t("/shipping"), t("/@word/id")),
    },
    {
      id: "shipping_name",
      width: "24ch",
      header: utils.cellHeader(t("/shipping"), t("/@word/name")),
    },
    {
      id: "shipping_fantasyName",
      width: "24ch",
      header: utils.cellHeader(t("/shipping"), t("/@word/fantasyName")),
    },
    {
      id: "shipping_nameCalc",
      width: "24ch",
      header: utils.cellHeader(t("/shipping"), t("/@word/nameCalc")),
    },
    {
      id: "salesperson_id",
      width: "8ch",
      header: utils.cellHeader(t("/@word/id")),
    },
    { id: "salesperson_name", width: "24ch", header: utils.cellHeader(t("/@word/name")) },
    {
      id: "salesperson_fantasyName",
      width: "24ch",
      header: utils.cellHeader(t("/@word/fantasyName")),
    },
    { id: "salesperson_nameCalc", width: "24ch", header: utils.cellHeader(t("/@word/nameCalc")) },
    {
      id: "salesperson_properties",
      width: "24ch",
      header: utils.cellHeader(t("/@word/properties")),
      cell: ({ value }) => (value != null ? JSON.stringify(value) : null),
    },
    {
      id: "salespersonCategory_id_1",
      width: "8ch",
      header: utils.cellHeader(
        t("/@word/personSalesperson"),
        t("/catalog/person/person.category1"),
        t("/@word/id"),
      ),
    },
    {
      id: "salespersonCategory_code_1",
      width: "16ch",
      header: utils.cellHeader(
        t("/@word/personSalesperson"),
        t("/catalog/person/person.category1"),
        t("/@word/code"),
      ),
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "salespersonCategory_description_1",
      width: "24ch",
      header: utils.cellHeader(
        t("/@word/personSalesperson"),
        t("/catalog/person/person.category1"),
        t("/@word/description"),
      ),
    },
    {
      id: "salespersonCategory_id_2",
      width: "8ch",
      header: utils.cellHeader(
        t("/@word/personSalesperson"),
        t("/catalog/person/person.category2"),
        t("/@word/id"),
      ),
    },
    {
      id: "salespersonCategory_code_2",
      width: "16ch",
      header: utils.cellHeader(
        t("/@word/personSalesperson"),
        t("/catalog/person/person.category2"),
        t("/@word/code"),
      ),
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "salespersonCategory_description_2",
      width: "24ch",
      header: utils.cellHeader(
        t("/@word/personSalesperson"),
        t("/catalog/person/person.category2"),
        t("/@word/description"),
      ),
    },
    {
      id: "salespersonCategory_id_3",
      width: "8ch",
      header: utils.cellHeader(
        t("/@word/personSalesperson"),
        t("/catalog/person/person.category3"),
        t("/@word/id"),
      ),
    },
    {
      id: "salespersonCategory_code_3",
      width: "16ch",
      header: utils.cellHeader(
        t("/@word/personSalesperson"),
        t("/catalog/person/person.category3"),
        t("/@word/code"),
      ),
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "salespersonCategory_description_3",
      width: "24ch",
      header: utils.cellHeader(
        t("/@word/personSalesperson"),
        t("/catalog/person/person.category3"),
        t("/@word/description"),
      ),
    },
    {
      id: "salespersonCategory_id_4",
      width: "8ch",
      header: utils.cellHeader(
        t("/@word/personSalesperson"),
        t("/catalog/person/person.category4"),
        t("/@word/id"),
      ),
    },
    {
      id: "salespersonCategory_code_4",
      width: "16ch",
      header: utils.cellHeader(
        t("/@word/personSalesperson"),
        t("/catalog/person/person.category4"),
        t("/@word/code"),
      ),
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "salespersonCategory_description_4",
      width: "24ch",
      header: utils.cellHeader(
        t("/@word/personSalesperson"),
        t("/catalog/person/person.category4"),
        t("/@word/description"),
      ),
    },
    {
      id: "salespersonCategory_id_5",
      width: "8ch",
      header: utils.cellHeader(
        t("/@word/personSalesperson"),
        t("/catalog/person/person.category5"),
        t("/@word/id"),
      ),
    },
    {
      id: "salespersonCategory_code_5",
      width: "16ch",
      header: utils.cellHeader(
        t("/@word/personSalesperson"),
        t("/catalog/person/person.category5"),
        t("/@word/code"),
      ),
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "salespersonCategory_description_5",
      width: "24ch",
      header: utils.cellHeader(
        t("/@word/personSalesperson"),
        t("/catalog/person/person.category5"),
        t("/@word/description"),
      ),
    },
    { id: "salesCommission", width: "16ch", header: utils.cellHeader(t("/@word/salesCommission")) },
    {
      id: "incomingList_id",
      width: "8ch",
      header: utils.cellHeader(t("/material/incomingList"), t("/@word/id")),
    },
    {
      id: "sale_id",
      width: "8ch",
      header: utils.cellHeader(t("/sale/sale"), t("/@word/id")),
    },
    {
      id: "sale_code",
      width: "16ch",
      header: utils.cellHeader(t("/sale/sale"), t("/@word/code")),
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "sale_date",
      width: "10ch",
      header: utils.cellHeader(t("/sale/sale"), t("/@word/date")),
      cell: ({ value }) => utils.formatDate(value),
    },
    { id: "salesHub", width: "16ch", header: utils.cellHeader(t("/@word/salesHub")) },
    { id: "salesChannel", width: "16ch", header: utils.cellHeader(t("/@word/salesChannel")) },
    {
      id: "outgoingList_id",
      width: "8ch",
      header: utils.cellHeader(t("/material/outgoingList"), t("/@word/id")),
    },
    {
      id: "product_id",
      width: "8ch",
      header: utils.cellHeader(t("/catalog/product/product"), t("/@word/id")),
    },
    {
      id: "product_code",
      width: "16ch",
      header: utils.cellHeader(t("/catalog/product/product"), t("/@word/code")),
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "product_description",
      width: "24ch",
      header: utils.cellHeader(t("/catalog/product/product"), t("/@word/description")),
    },
    {
      id: "product_complement",
      width: "16ch",
      header: utils.cellHeader(t("/catalog/product/product"), t("/@word/complement")),
    },
    {
      id: "fiscalProfileProduct_id",
      width: "8ch",
      header: utils.cellHeader(t("/fiscal/fiscalProfileProduct"), t("/@word/id")),
    },
    {
      id: "fiscalProfileProduct_description",
      width: "24ch",
      header: utils.cellHeader(t("/fiscal/fiscalProfileProduct"), t("/@word/description")),
    },
    {
      id: "productCategory_id_1",
      width: "8ch",
      header: utils.cellHeader(
        t("/catalog/product/product"),
        t("/catalog/product/product.category1"),
        t("/@word/id"),
      ),
    },
    {
      id: "productCategory_code_1",
      width: "16ch",
      header: utils.cellHeader(
        t("/catalog/product/product"),
        t("/catalog/product/product.category1"),
        t("/@word/code"),
      ),
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "productCategory_description_1",
      width: "24ch",
      header: utils.cellHeader(
        t("/catalog/product/product"),
        t("/catalog/product/product.category1"),
        t("/@word/description"),
      ),
    },
    {
      id: "productCategory_id_2",
      width: "8ch",
      header: utils.cellHeader(
        t("/catalog/product/product"),
        t("/catalog/product/product.category2"),
        t("/@word/id"),
      ),
    },
    {
      id: "productCategory_code_2",
      width: "16ch",
      header: utils.cellHeader(
        t("/catalog/product/product"),
        t("/catalog/product/product.category2"),
        t("/@word/code"),
      ),
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "productCategory_description_2",
      width: "24ch",
      header: utils.cellHeader(
        t("/catalog/product/product"),
        t("/catalog/product/product.category2"),
        t("/@word/description"),
      ),
    },
    {
      id: "productCategory_id_3",
      width: "8ch",
      header: utils.cellHeader(
        t("/catalog/product/product"),
        t("/catalog/product/product.category3"),
        t("/@word/id"),
      ),
    },
    {
      id: "productCategory_code_3",
      width: "16ch",
      header: utils.cellHeader(
        t("/catalog/product/product"),
        t("/catalog/product/product.category3"),
        t("/@word/code"),
      ),
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "productCategory_description_3",
      width: "24ch",
      header: utils.cellHeader(
        t("/catalog/product/product"),
        t("/catalog/product/product.category3"),
        t("/@word/description"),
      ),
    },
    {
      id: "productCategory_id_4",
      width: "8ch",
      header: utils.cellHeader(
        t("/catalog/product/product"),
        t("/catalog/product/product.category4"),
        t("/@word/id"),
      ),
    },
    {
      id: "productCategory_code_4",
      width: "16ch",
      header: utils.cellHeader(
        t("/catalog/product/product"),
        t("/catalog/product/product.category4"),
        t("/@word/code"),
      ),
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "productCategory_description_4",
      width: "24ch",
      header: utils.cellHeader(
        t("/catalog/product/product"),
        t("/catalog/product/product.category4"),
        t("/@word/description"),
      ),
    },
    {
      id: "productCategory_id_5",
      width: "8ch",
      header: utils.cellHeader(
        t("/catalog/product/product"),
        t("/catalog/product/product.category5"),
        t("/@word/id"),
      ),
    },
    {
      id: "productCategory_code_5",
      width: "16ch",
      header: utils.cellHeader(
        t("/catalog/product/product"),
        t("/catalog/product/product.category5"),
        t("/@word/code"),
      ),
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "productCategory_description_5",
      width: "24ch",
      header: utils.cellHeader(
        t("/catalog/product/product"),
        t("/catalog/product/product.category5"),
        t("/@word/description"),
      ),
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
    },
    {
      id: "productPacking_code",
      width: "16ch",
      header: utils.cellHeader(t("/catalog/product/productPacking"), t("/@word/code")),
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "productPacking_descriptionCalc",
      width: "30ch",
      header: utils.cellHeader(t("/catalog/product/productPacking"), t("/@word/description")),
      cellValue: ({ row }) =>
        [row.product_description, row.productPacking_complement, row.productVariant_description]
          .filter(Boolean)
          .join(", "),
    },
    {
      id: "productPacking_complement",
      width: "16ch",
      header: utils.cellHeader(t("/catalog/product/productPacking"), t("/@word/complement")),
    },
    {
      id: "productPacking_units",
      className: "number",
      width: "8ch",
      header: utils.cellHeader(t("/catalog/product/productPacking"), t("/@word/units")),
    },
    {
      id: "productVariant_id",
      width: "8ch",
      header: utils.cellHeader(t("/catalog/product/productVariant"), t("/@word/id")),
    },
    {
      id: "productVariant_code",
      width: "16ch",
      header: utils.cellHeader(t("/catalog/product/productVariant"), t("/@word/code")),
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "productVariant_description",
      width: "24ch",
      header: utils.cellHeader(t("/catalog/product/productVariant"), t("/@word/description")),
    },
    {
      id: "taxationOperation_id",
      width: "8ch",
      header: utils.cellHeader(t("/fiscal/taxation/taxationOperation"), t("/@word/id")),
    },
    {
      id: "taxationOperation_code",
      width: "16ch",
      header: utils.cellHeader(t("/fiscal/taxation/taxationOperation"), t("/@word/code")),
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "taxationOperation_description",
      width: "24ch",
      header: utils.cellHeader(t("/fiscal/taxation/taxationOperation"), t("/@word/description")),
    },
    {
      id: "invoiceItem_unitValue",
      className: "number",
      width: "16ch",
      header: utils.cellHeader(t("/@word/unitValue")),
      cell: ({ value }) => utils.formatCurrency(value),
    },
    {
      id: "invoiceItem_unitValueUnits",
      className: "number",
      width: "16ch",
      header: utils.cellHeader(t("/@word/unitValueUnits")),
      cell: ({ value }) => utils.formatCurrency(value),
    },
    {
      id: "unit_id",
      width: "8ch",
      header: utils.cellHeader(t("/catalog/product/unit"), t("/@word/id")),
    },
    {
      id: "unit_code",
      width: "8ch",
      header: utils.cellHeader(t("/catalog/product/unit"), t("/@word/code")),
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "sum_quantity",
      className: "number",
      width: "12ch",
      header: utils.cellHeader(t("/@word/quantity")),
      cell: ({ row, value }) => utils.formatQuantity(value, { unit_code: row.unit_code }),
      footerValue: ({ data }) =>
        utils.sumBy(
          data,
          (item) => item.unit_code,
          (item) => item.sum_quantity,
        ),
      footer: ({ value }) =>
        utils.renderAggr(value, (quantity, unit_code) =>
          utils.formatQuantity(quantity, { unit_code }),
        ),
    },
    {
      id: "sum_referencedQuantity",
      className: "number",
      width: "16ch",
      header: utils.cellHeader(t("/@word/referencedQuantity")),
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({ data }) =>
        data.reduce((red, item) => red + (Number(item.sum_referencedQuantity) || 0), 0),
      footer: ({ value }) => utils.formatNumber(value),
    },
    {
      id: "sum_referencedBalance",
      className: "number",
      width: "16ch",
      header: utils.cellHeader(t("/@word/referencedBalance")),
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({ data }) =>
        data.reduce((red, item) => red + (Number(item.sum_referencedBalance) || 0), 0),
      footer: ({ value }) => utils.formatNumber(value),
    },
    {
      id: "sum_quantity_units",
      className: "number",
      width: "16ch",
      header: utils.cellHeader(t("/@word/quantityUnits")),
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({ data }) =>
        data.reduce((red, item) => red + (Number(item.sum_quantity_units) || 0), 0),
      footer: ({ value }) => utils.formatNumber(value),
    },
    {
      id: "sum_grossProductValue",
      className: "number",
      width: "16ch",
      header: utils.cellHeader(t("/@word/grossProductValue")),
      cell: ({ value }) => utils.formatCurrency(value),
      footerValue: ({ data }) =>
        data.reduce((red, item) => red + (Number(item.sum_grossProductValue) || 0), 0),
      footer: ({ value }) => utils.formatCurrency(value),
    },
    {
      id: "sum_discountValue",
      className: "number",
      width: "16ch",
      header: utils.cellHeader(t("/@word/discountValue")),
      cell: ({ value }) => utils.formatCurrency(value),
      footerValue: ({ data }) =>
        data.reduce((red, item) => red + (Number(item.sum_discountValue) || 0), 0),
      footer: ({ value }) => utils.formatCurrency(value),
    },
    {
      id: "sum_productValue",
      className: "number",
      width: "16ch",
      header: utils.cellHeader(t("/@word/productValue")),
      cell: ({ value }) => utils.formatCurrency(value),
      footerValue: ({ data }) =>
        data.reduce((red, item) => red + (Number(item.sum_productValue) || 0), 0),
      footer: ({ value }) => utils.formatCurrency(value),
    },
    {
      id: "sum_freightValue",
      className: "number",
      width: "16ch",
      header: utils.cellHeader(t("/@word/freightValue")),
      cell: ({ value }) => utils.formatCurrency(value),
      footerValue: ({ data }) =>
        data.reduce((red, item) => red + (Number(item.sum_freightValue) || 0), 0),
      footer: ({ value }) => utils.formatCurrency(value),
    },
    {
      id: "sum_insuranceValue",
      className: "number",
      width: "16ch",
      header: utils.cellHeader(t("/@word/insuranceValue")),
      cell: ({ value }) => utils.formatCurrency(value),
      footerValue: ({ data }) =>
        data.reduce((red, item) => red + (Number(item.sum_insuranceValue) || 0), 0),
      footer: ({ value }) => utils.formatCurrency(value),
    },
    {
      id: "sum_otherValue",
      className: "number",
      width: "16ch",
      header: utils.cellHeader(t("/@word/otherValue")),
      cell: ({ value }) => utils.formatCurrency(value),
      footerValue: ({ data }) =>
        data.reduce((red, item) => red + (Number(item.sum_otherValue) || 0), 0),
      footer: ({ value }) => utils.formatCurrency(value),
    },
    {
      id: "sum_operationValue",
      className: "number",
      width: "16ch",
      header: utils.cellHeader(t("/@word/operationValue")),
      cell: ({ value }) => utils.formatCurrency(value),
      footerValue: ({ data }) =>
        data.reduce((red, item) => red + (Number(item.sum_operationValue) || 0), 0),
      footer: ({ value }) => utils.formatCurrency(value),
    },
    {
      id: "sum_insideTaxValue",
      className: "number",
      width: "16ch",
      header: utils.cellHeader(t("/@word/insideTaxValue")),
      cell: ({ value }) => utils.formatCurrency(value),
      footerValue: ({ data }) =>
        data.reduce((red, item) => red + (Number(item.sum_insideTaxValue) || 0), 0),
      footer: ({ value }) => utils.formatCurrency(value),
    },
    {
      id: "sum_outsideTaxValue",
      className: "number",
      width: "16ch",
      header: utils.cellHeader(t("/@word/outsideTaxValue")),
      cell: ({ value }) => utils.formatCurrency(value),
      footerValue: ({ data }) =>
        data.reduce((red, item) => red + (Number(item.sum_outsideTaxValue) || 0), 0),
      footer: ({ value }) => utils.formatCurrency(value),
    },
    {
      id: "sum_totalValue",
      className: "number",
      width: "16ch",
      header: utils.cellHeader(t("/@word/totalValue")),
      cell: ({ value }) => utils.formatCurrency(value),
      footerValue: ({ data }) =>
        data.reduce((red, item) => red + (Number(item.sum_totalValue) || 0), 0),
      footer: ({ value }) => utils.formatCurrency(value),
    },
    {
      id: "sum_effectiveValue",
      className: "number",
      width: "16ch",
      header: utils.cellHeader(t("/@word/effectiveValue")),
      cell: ({ value }) => utils.formatCurrency(value),
      footerValue: ({ data }) =>
        data.reduce((red, item) => red + (Number(item.sum_effectiveValue) || 0), 0),
      footer: ({ value }) => utils.formatCurrency(value),
    },
    {
      id: "sum_netWeightKg",
      className: "number",
      width: "16ch",
      header: utils.cellHeader(t("/@word/netWeightKg")),
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({ data }) =>
        data.reduce((red, item) => red + (Number(item.sum_netWeightKg) || 0), 0),
      footer: ({ value }) => utils.formatNumber(value),
    },
    {
      id: "sum_grossWeightKg",
      className: "number",
      width: "16ch",
      header: utils.cellHeader(t("/@word/grossWeightKg")),
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({ data }) =>
        data.reduce((red, item) => red + (Number(item.sum_grossWeightKg) || 0), 0),
      footer: ({ value }) => utils.formatNumber(value),
    },
    {
      id: "sum_contributionMargin",
      className: "number",
      width: "16ch",
      header: utils.cellHeader(t("/@word/contributionMargin")),
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({ data }) =>
        data.reduce((red, item) => red + (Number(item.sum_contributionMargin) || 0), 0),
      footer: ({ value }) => utils.formatNumber(value),
    },
    {
      id: "count_invoice",
      className: "number",
      width: "16ch",
      header: utils.cellHeader(t("/fiscal/invoice"), t("/@word/count")),
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({ data }) =>
        data.reduce((red, item) => red + (Number(item.count_invoice) || 0), 0),
      footer: ({ value }) => utils.formatNumber(value),
    },
    {
      id: "count_invoiceItem",
      className: "number",
      width: "16ch",
      header: utils.cellHeader(t("/fiscal/invoiceItem"), t("/@word/count")),
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({ data }) =>
        data.reduce((red, item) => red + (Number(item.count_invoiceItem) || 0), 0),
      footer: ({ value }) => utils.formatNumber(value),
    },
    {
      id: "salesCommissionBaseValue",
      className: "number",
      width: "16ch",
      header: utils.cellHeader(t("/@word/salesCommission"), t("/@word/baseValue")),
      cell: ({ value }) => utils.formatCurrency(value),
      footerValue: ({ data }) =>
        data.reduce((red, item) => red + (Number(item.salesCommissionBaseValue) || 0), 0),
      footer: ({ value }) => utils.formatCurrency(value),
    },
    {
      id: "salesCommissionValue",
      className: "number",
      width: "16ch",
      header: utils.cellHeader(t("/@word/salesCommission"), t("/@word/value")),
      cell: ({ value }) => utils.formatCurrency(value),
      footerValue: ({ data }) =>
        data.reduce((red, item) => red + (Number(item.salesCommissionValue) || 0), 0),
      footer: ({ value }) => utils.formatCurrency(value),
    },
    {
      id: "invoiceItem_totalValue",
      className: "number",
      width: "16ch",
      header: utils.cellHeader(t("/fiscal/invoiceItem"), t("/@word/totalValue")),
      cell: ({ value }) => utils.formatCurrency(value),
      footerValue: ({ data }) =>
        data.reduce((red, item) => red + (Number(item.invoiceItem_totalValue) || 0), 0),
      footer: ({ value }) => utils.formatCurrency(value),
    },
    {
      id: "invoiceItem_quantity",
      className: "number",
      width: "16ch",
      header: utils.cellHeader(t("/fiscal/invoiceItem"), t("/@word/quantity")),
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({ data }) =>
        data.reduce((red, item) => red + (Number(item.invoiceItem_quantity) || 0), 0),
      footer: ({ value }) => utils.formatNumber(value),
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
        key={data.id}
      >
        <header>
          <section className="title">
            <dl style={{ flex: 1 }}>
              <dd>
                <h1>{t("/fiscal/report/invoiceList")}</h1>
              </dd>
            </dl>
          </section>
          <section className="parameters">
            {report.parameters?.DATE_START && (
              <dl>
                <dt>{t("/@word/dateStart")}</dt>
                <dd>{utils.formatDate(report.parameters.DATE_START)}</dd>
              </dl>
            )}
            {report.parameters?.DATE_END && (
              <dl>
                <dt>{t("/@word/dateEnd")}</dt>
                <dd>{utils.formatDate(report.parameters.DATE_END)}</dd>
              </dl>
            )}
            {report.parameters?.ISSUE_DATE_START && (
              <dl>
                <dt>{t("/@word/issueDateStart")}</dt>
                <dd>{utils.formatDate(report.parameters.ISSUE_DATE_START)}</dd>
              </dl>
            )}
            {report.parameters?.ISSUE_DATE_END && (
              <dl>
                <dt>{t("/@word/issueDateEnd")}</dt>
                <dd>{utils.formatDate(report.parameters.ISSUE_DATE_END)}</dd>
              </dl>
            )}
            {report.parameters?.SOCIETY_IDS_DESC && (
              <dl>
                <dt>{t("/catalog/company/society/plural")}</dt>
                <dd>{report.parameters.SOCIETY_IDS_DESC}</dd>
              </dl>
            )}
            {report.parameters?.COMPANY_IDS_DESC && (
              <dl>
                <dt>{t("/catalog/company/company/plural")}</dt>
                <dd>{report.parameters.COMPANY_IDS_DESC}</dd>
              </dl>
            )}
            {report.parameters?.PERSON_GROUP_IDS_DESC && (
              <dl>
                <dt>{t("/catalog/person/personGroup/plural")}</dt>
                <dd>{report.parameters.PERSON_GROUP_IDS_DESC}</dd>
              </dl>
            )}
            {report.parameters?.PERSON_IDS_DESC && (
              <dl>
                <dt>{t("/catalog/person/person/plural")}</dt>
                <dd>{report.parameters.PERSON_IDS_DESC}</dd>
              </dl>
            )}
            {report.parameters?.PERSON_CATEGORY_IDS_1_DESC && (
              <dl>
                <dt>{`${t("/catalog/person/person")}, ${t("/catalog/person/person.category1")}`}</dt>
                <dd>{report.parameters.PERSON_CATEGORY_IDS_1_DESC}</dd>
              </dl>
            )}
            {report.parameters?.PERSON_CATEGORY_IDS_2_DESC && (
              <dl>
                <dt>{`${t("/catalog/person/person")}, ${t("/catalog/person/person.category2")}`}</dt>
                <dd>{report.parameters.PERSON_CATEGORY_IDS_2_DESC}</dd>
              </dl>
            )}
            {report.parameters?.PERSON_CATEGORY_IDS_3_DESC && (
              <dl>
                <dt>{`${t("/catalog/person/person")}, ${t("/catalog/person/person.category3")}`}</dt>
                <dd>{report.parameters.PERSON_CATEGORY_IDS_3_DESC}</dd>
              </dl>
            )}
            {report.parameters?.PERSON_CATEGORY_IDS_4_DESC && (
              <dl>
                <dt>{`${t("/catalog/person/person")}, ${t("/catalog/person/person.category4")}`}</dt>
                <dd>{report.parameters.PERSON_CATEGORY_IDS_4_DESC}</dd>
              </dl>
            )}
            {report.parameters?.PERSON_CATEGORY_IDS_5_DESC && (
              <dl>
                <dt>{`${t("/catalog/person/person")}, ${t("/catalog/person/person.category5")}`}</dt>
                <dd>{report.parameters.PERSON_CATEGORY_IDS_5_DESC}</dd>
              </dl>
            )}
            {report.parameters?.FISCAL_PROFILE_OPERATION_IDS_DESC && (
              <dl>
                <dt>{t("/fiscal/fiscalProfileOperation/plural")}</dt>
                <dd>{report.parameters.FISCAL_PROFILE_OPERATION_IDS_DESC}</dd>
              </dl>
            )}
            {report.parameters?.INVOICE_SERIES_IDS_DESC && (
              <dl>
                <dt>{t("/fiscal/invoiceSeries/plural")}</dt>
                <dd>{report.parameters.INVOICE_SERIES_IDS_DESC}</dd>
              </dl>
            )}
            {report.parameters?.SALESPERSON_IDS_DESC && (
              <dl>
                <dt>{t("/@unknowasn/salesperson")}</dt>
                <dd>{report.parameters.SALESPERSON_IDS_DESC}</dd>
              </dl>
            )}
            {report.parameters?.PERSON_SHIPPING_IDS_DESC && (
              <dl>
                <dt>{t("/catalog/person/personShipping")}</dt>
                <dd>{report.parameters.PERSON_SHIPPING_IDS_DESC}</dd>
              </dl>
            )}
            {report.parameters?.TAXATION_OPERATION_IDS_DESC && (
              <dl>
                <dt>{t("/fiscal/taxation/taxationOperation/plural")}</dt>
                <dd>{report.parameters.TAXATION_OPERATION_IDS_DESC}</dd>
              </dl>
            )}
            {report.parameters?.PRODUCT_IDS_DESC && (
              <dl>
                <dt>{t("/catalog/product/product/plural")}</dt>
                <dd>{report.parameters.PRODUCT_IDS_DESC}</dd>
              </dl>
            )}
            {report.parameters?.FISCAL_PROFILE_PRODUCT_IDS_DESC && (
              <dl>
                <dt>{t("/fiscal/fiscalProfileProduct/plural")}</dt>
                <dd>{report.parameters.FISCAL_PROFILE_PRODUCT_IDS_DESC}</dd>
              </dl>
            )}
            {report.parameters?.PRODUCT_CATEGORY_IDS_1_DESC && (
              <dl>
                <dt>{`${t("/catalog/product/product")}, ${t("/catalog/product/product.category1")}`}</dt>
                <dd>{report.parameters.PRODUCT_CATEGORY_IDS_1_DESC}</dd>
              </dl>
            )}
            {report.parameters?.PRODUCT_CATEGORY_IDS_2_DESC && (
              <dl>
                <dt>{`${t("/catalog/product/product")}, ${t("/catalog/product/product.category2")}`}</dt>
                <dd>{report.parameters.PRODUCT_CATEGORY_IDS_2_DESC}</dd>
              </dl>
            )}
            {report.parameters?.PRODUCT_CATEGORY_IDS_3_DESC && (
              <dl>
                <dt>{`${t("/catalog/product/product")}, ${t("/catalog/product/product.category3")}`}</dt>
                <dd>{report.parameters.PRODUCT_CATEGORY_IDS_3_DESC}</dd>
              </dl>
            )}
            {report.parameters?.PRODUCT_CATEGORY_IDS_4_DESC && (
              <dl>
                <dt>{`${t("/catalog/product/product")}, ${t("/catalog/product/product.category4")}`}</dt>
                <dd>{report.parameters.PRODUCT_CATEGORY_IDS_4_DESC}</dd>
              </dl>
            )}
            {report.parameters?.PRODUCT_CATEGORY_IDS_5_DESC && (
              <dl>
                <dt>{`${t("/catalog/product/product")}, ${t("/catalog/product/product.category5")}`}</dt>
                <dd>{report.parameters.PRODUCT_CATEGORY_IDS_5_DESC}</dd>
              </dl>
            )}
            {report.parameters?.PRODUCT_PACKING_IDS_DESC && (
              <dl>
                <dt>{t("/catalog/product/productPacking/plural")}</dt>
                <dd>{report.parameters.PRODUCT_PACKING_IDS_DESC}</dd>
              </dl>
            )}
            {report.parameters?.PRODUCT_VARIANT_IDS_DESC && (
              <dl>
                <dt>{t("/catalog/product/productVariant/plural")}</dt>
                <dd>{report.parameters.PRODUCT_VARIANT_IDS_DESC}</dd>
              </dl>
            )}
            {report.parameters?.CITY_IDS_DESC && (
              <dl>
                <dt>{t("/catalog/location/city/plural")}</dt>
                <dd>{report.parameters.CITY_IDS_DESC}</dd>
              </dl>
            )}
            {report.parameters?.STATE_IDS_DESC && (
              <dl>
                <dt>{t("/catalog/location/state/plural")}</dt>
                <dd>{report.parameters.STATE_IDS_DESC}</dd>
              </dl>
            )}
            {report.parameters?.COUNTRY_IDS_DESC && (
              <dl>
                <dt>{t("/catalog/location/country/plural")}</dt>
                <dd>{report.parameters.COUNTRY_IDS_DESC}</dd>
              </dl>
            )}
            {report.parameters?.STATUS_LIST && (
              <dl>
                <dt>{t("/@word/status")}</dt>
                <dd>{report.parameters.STATUS_LIST}</dd>
              </dl>
            )}
            {report.parameters?.NCM_LIST && (
              <dl>
                <dt>{t("/@unknown/ncmList")}</dt>
                <dd>{report.parameters.NCM_LIST}</dd>
              </dl>
            )}
            {report.parameters?.CEST_LIST && (
              <dl>
                <dt>{t("/@unknown/cestList")}</dt>
                <dd>{report.parameters.CEST_LIST}</dd>
              </dl>
            )}
            {report.parameters?.SALES_HUB_LIST && (
              <dl>
                <dt>{t("/@word/salesHub")}</dt>
                <dd>{report.parameters.SALES_HUB_LIST}</dd>
              </dl>
            )}
            {report.parameters?.SALES_CHANNEL_LIST && (
              <dl>
                <dt>{t("/@word/salesChannel")}</dt>
                <dd>{report.parameters.SALES_CHANNEL_LIST}</dd>
              </dl>
            )}
            {report.parameters?.FLOW && (
              <dl>
                <dt>{t("/@word/flow")}</dt>
                <dd>{report.parameters.FLOW}</dd>
              </dl>
            )}
            {report.parameters?.RETURNED && (
              <dl>
                <dt>{t("/@word/returned")}</dt>
                <dd>{report.parameters.RETURNED}</dd>
              </dl>
            )}
            {report.parameters?.SIGN && (
              <dl>
                <dt>{t("/@word/sign")}</dt>
                <dd>{report.parameters.SIGN}</dd>
              </dl>
            )}
            {report.parameters?.FISCAL_PROFILE_OPERATION_TAGS && (
              <dl>
                <dt>{t("/@unknown/fiscalProfileOperationTags")}</dt>
                <dd>{report.parameters.FISCAL_PROFILE_OPERATION_TAGS}</dd>
              </dl>
            )}
            {report.parameters?.TAGS && (
              <dl>
                <dt>{t("/@word/tags")}</dt>
                <dd>{report.parameters.TAGS}</dd>
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
