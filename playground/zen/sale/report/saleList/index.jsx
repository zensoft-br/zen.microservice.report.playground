import * as utils from "./utils.jsx";
import { Badge, Fields, Table } from "./utils.jsx";

export default function SaleListReport({ data = [], meta = {}, t }) {
  const { report = {} } = meta;

  const settings =
    utils.deepMerge(report?.properties?.["#settings"], report?.properties?.userSettings) ?? {};

  const visibleFields = settings?.fields ?? [];

  const fieldGroups = [];

  const fields = [
    {
      id: "statusDesc",
      group: "main",
      label: utils.cellHeader(t("/@word/status")),
      value: (row) => row.statusDesc,
    },
    {
      id: "code",
      group: "main",
      label: utils.cellHeader(t("/@word/code")),
      value: (row) => row.code,
    },
    {
      id: "workflowDesc",
      group: "main",
      label: utils.cellHeader(t("/system/workflow/workflow")),
      value: (row) => row.workflowDesc,
    },
    {
      id: "workflowNodeDesc",
      group: "main",
      label: utils.cellHeader(t("/system/workflow/workflowNode")),
      value: (row) => row.workflowNodeDesc,
    },
    {
      id: "companyDesc",
      group: "main",
      label: utils.cellHeader(t("/catalog/company/company")),
      value: (row) => row.companyDesc,
    },
    {
      id: "personDesc",
      group: "main",
      label: utils.cellHeader(t("/catalog/person/person")),
      value: (row) => row.personDesc,
    },
    {
      id: "salespersonDesc",
      group: "main",
      label: utils.cellHeader(t("/@word/salesperson")),
      value: (row) => row.salespersonDesc,
    },
    {
      id: "saleProfileDesc",
      group: "main",
      label: utils.cellHeader(t("/sale/saleProfile")),
      value: (row) => row.saleProfileDesc,
    },
    {
      id: "taxationOperationDesc",
      group: "main",
      label: utils.cellHeader(t("/fiscal/taxation/taxationOperation")),
      value: (row) => row.taxationOperationDesc,
    },
    {
      id: "personGroupDesc",
      group: "main",
      label: utils.cellHeader(t("/catalog/person/personGroup")),
      value: (row) => row.personGroupDesc,
    },
    {
      id: "fiscalProfileOperationDesc",
      group: "main",
      label: utils.cellHeader(t("/fiscal/fiscalProfileOperation")),
      value: (row) => row.fiscalProfileOperationDesc,
    },
    {
      id: "fiscalProfileProductDesc",
      group: "main",
      label: utils.cellHeader(t("/fiscal/fiscalProfileProduct")),
      value: (row) => row.fiscalProfileProductDesc,
    },
    {
      id: "cityDesc",
      group: "main",
      label: utils.cellHeader(t("/catalog/location/city")),
      value: (row) => row.cityDesc,
    },
    {
      id: "stateDesc",
      group: "main",
      label: utils.cellHeader(t("/catalog/location/state")),
      value: (row) => row.stateDesc,
    },
    {
      id: "countryDesc",
      group: "main",
      label: utils.cellHeader(t("/catalog/location/country")),
      value: (row) => row.countryDesc,
    },
    {
      id: "productDesc",
      group: "main",
      label: utils.cellHeader(t("/catalog/product/product")),
      value: (row) => row.productDesc,
    },
    {
      id: "productPackingDesc",
      group: "main",
      label: utils.cellHeader(t("/catalog/product/productPacking")),
      value: (row) => row.productPackingDesc,
    },
    {
      id: "productCategory1Desc",
      group: "main",
      label: utils.cellHeader(t("/catalog/product/product.category1")),
      value: (row) => row.productCategory1Desc,
    },
    {
      id: "productCategory2Desc",
      group: "main",
      label: utils.cellHeader(t("/catalog/product/product.category2")),
      value: (row) => row.productCategory2Desc,
    },
    {
      id: "productCategory3Desc",
      group: "main",
      label: utils.cellHeader(t("/catalog/product/product.category3")),
      value: (row) => row.productCategory3Desc,
    },
    {
      id: "productCategory4Desc",
      group: "main",
      label: utils.cellHeader(t("/catalog/product/product.category4")),
      value: (row) => row.productCategory4Desc,
    },
    {
      id: "productCategory5Desc",
      group: "main",
      label: utils.cellHeader(t("/catalog/product/product.category5")),
      value: (row) => row.productCategory5Desc,
    },
    {
      id: "dateStart",
      group: "main",
      label: utils.cellHeader(t("/@word/dateStart")),
      value: (row) => utils.formatDate(row.dateStart),
    },
    {
      id: "dateEnd",
      group: "main",
      label: utils.cellHeader(t("/@word/dateEnd")),
      value: (row) => utils.formatDate(row.dateEnd),
    },
    {
      id: "availabilityDateStart",
      group: "main",
      label: utils.cellHeader(t("/@word/availabilityDateStart")),
      value: (row) => utils.formatDate(row.availabilityDateStart),
    },
    {
      id: "availabilityDateEnd",
      group: "main",
      label: utils.cellHeader(t("/@word/availabilityDateEnd")),
      value: (row) => utils.formatDate(row.availabilityDateEnd),
    },
    {
      id: "tagsDesc",
      group: "main",
      label: utils.cellHeader(t("/@word/tags")),
      value: (row) => row.tagsDesc,
    },
    {
      id: "maxRecords",
      group: "main",
      label: utils.cellHeader(t("/@word/maxRecords")),
      value: (row) => utils.formatNumber(row.maxRecords),
    },
  ];

  const visibleColumns = (settings?.columns ?? []).filter(
    (item) => !(settings?.removeColumns ?? []).includes(item),
  );

  const groups = settings?.groups || [];

  const columns = [
    // Sale Identification & Dates
    {
      id: "sale_id",
      header: utils.cellHeader(t("/@word/id")),
      width: "10ch",
      className: "id",
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({ data }) => data.length,
      footer: ({ value }) => utils.formatNumber(value),
    },
    {
      id: "sale_status",
      header: utils.cellHeader(t("/@word/status")),
      width: "15ch",
      cell: ({ value }) => (value ? <Badge>{t(`/sale/saleStatus/enum/${value}`)}</Badge> : null),
    },
    {
      id: "sale_code",
      header: utils.cellHeader(t("/@word/code")),
      width: "12ch",
      className: "number",
    },
    {
      id: "sale_date",
      header: utils.cellHeader(t("/@word/date")),
      width: "12ch",
      cell: ({ value }) => utils.formatDate(value),
    },
    {
      id: "sale_day",
      header: utils.cellHeader(t("/@word/day")),
      width: "8ch",
      className: "number",
    },
    {
      id: "sale_month",
      header: utils.cellHeader(t("/@word/month")),
      width: "8ch",
      className: "number",
    },
    {
      id: "sale_year",
      header: utils.cellHeader(t("/@word/year")),
      width: "8ch",
      className: "number",
    },
    {
      id: "sale_freightType",
      header: utils.cellHeader(t("/@word/freightType")),
      width: "15ch",
      cell: ({ value }) => (value ? t(`/commercial/freightType/enum/${value}`) : ""),
    },
    {
      id: "sale_availabilityDate",
      header: utils.cellHeader(t("/@word/availabilityDate")),
      width: "12ch",
      cell: ({ value }) => utils.formatDate(value),
    },
    {
      id: "outgoingInvoice_id",
      header: utils.cellHeader(t("/fiscal/outgoingInvoice"), t("/@word/id")),
      width: "10ch",
    },
    {
      id: "sale_tags",
      header: utils.cellHeader(t("/@word/tags")),
      width: "20ch",
      cell: ({ value }) =>
        value
          ? value
              .split(",")
              .filter((tag) => tag && tag !== "null")
              .map((tag, idx) => <Badge key={idx}>{tag.trim()}</Badge>)
          : null,
    },

    // Sale Properties
    {
      id: "sale_properties.comments",
      header: utils.cellHeader(t("/@word/comments")),
      width: "25ch",
      cellValue: ({ row }) => row.sale_properties?.comments,
    },
    {
      id: "sale_properties.paymentMethods",
      header: utils.cellHeader(t("/@word/paymentMethods")),
      width: "20ch",
      cellValue: ({ row }) => row.sale_properties?.paymentMethods,
    },

    // Workflow
    {
      id: "workflow_id",
      header: utils.cellHeader(t("/system/workflow/workflow"), t("/@word/id")),
      width: "10ch",
    },
    {
      id: "workflow_code",
      header: utils.cellHeader(t("/system/workflow/workflow"), t("/@word/code")),
      width: "12ch",
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "workflow_description",
      header: utils.cellHeader(t("/system/workflow/workflow"), t("/@word/description")),
      width: "20ch",
    },
    {
      id: "workflowNode_id",
      header: utils.cellHeader(t("/system/workflow/workflowNode"), t("/@word/id")),
      width: "10ch",
    },
    {
      id: "workflowNode_code",
      header: utils.cellHeader(t("/system/workflow/workflowNode"), t("/@word/code")),
      width: "12ch",
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "workflowNode_description",
      header: utils.cellHeader(t("/system/workflow/workflowNode"), t("/@word/description")),
      width: "20ch",
    },

    // Company
    {
      id: "company_id",
      header: utils.cellHeader(t("/catalog/company/company"), t("/@word/id")),
      width: "10ch",
    },
    {
      id: "company_code",
      header: utils.cellHeader(t("/catalog/company/company"), t("/@word/code")),
      width: "12ch",
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "company_name",
      header: utils.cellHeader(t("/catalog/company/company"), t("/@word/name")),
      width: "25ch",
    },
    {
      id: "company_fantasyName",
      header: utils.cellHeader(t("/catalog/company/company"), t("/@word/fantasyName")),
      width: "20ch",
    },
    {
      id: "company_nameCalc",
      header: utils.cellHeader(t("/catalog/company/company"), t("/@word/nameCalc")),
      width: "20ch",
    },

    // Profiles & Currency
    {
      id: "fiscalProfileOperation_id",
      header: utils.cellHeader(t("/fiscal/fiscalProfileOperation"), t("/@word/id")),
      width: "10ch",
    },
    {
      id: "fiscalProfileOperation_code",
      header: utils.cellHeader(t("/fiscal/fiscalProfileOperation"), t("/@word/code")),
      width: "12ch",
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "fiscalProfileOperation_description",
      header: utils.cellHeader(t("/fiscal/fiscalProfileOperation"), t("/@word/description")),
      width: "20ch",
    },
    {
      id: "saleProfile_id",
      header: utils.cellHeader(t("/sale/saleProfile"), t("/@word/id")),
      width: "10ch",
    },
    {
      id: "saleProfile_code",
      header: utils.cellHeader(t("/sale/saleProfile"), t("/@word/code")),
      width: "12ch",
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "saleProfile_description",
      header: utils.cellHeader(t("/sale/saleProfile"), t("/@word/description")),
      width: "20ch",
    },
    {
      id: "currency_id",
      header: utils.cellHeader(t("/financial/currency"), t("/@word/id")),
      width: "10ch",
    },
    {
      id: "currency_code",
      header: utils.cellHeader(t("/financial/currency"), t("/@word/code")),
      width: "8ch",
      cell: ({ value }) => <Badge>{value}</Badge>,
    },

    // Person
    {
      id: "person_id",
      header: utils.cellHeader(t("/catalog/person/person"), t("/@word/id")),
      width: "10ch",
    },
    {
      id: "person_name",
      header: utils.cellHeader(t("/catalog/person/person"), t("/@word/name")),
      width: "25ch",
    },
    {
      id: "person_fantasyName",
      header: utils.cellHeader(t("/catalog/person/person"), t("/@word/fantasyName")),
      width: "20ch",
    },
    {
      id: "person_nameCalc",
      header: utils.cellHeader(t("/catalog/person/person"), t("/@word/nameCalc")),
      width: "20ch",
    },
    {
      id: "personGroup_id",
      header: utils.cellHeader(t("/catalog/person/personGroup"), t("/@word/id")),
      width: "10ch",
    },
    {
      id: "personGroup_code",
      header: utils.cellHeader(t("/catalog/person/personGroup"), t("/@word/code")),
      width: "12ch",
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "personGroup_description",
      header: utils.cellHeader(t("/catalog/person/personGroup"), t("/@word/description")),
      width: "20ch",
    },
    {
      id: "personCategory_id_1",
      header: utils.cellHeader(t("/catalog/person/person.category1"), t("/@word/id")),
      width: "10ch",
    },
    {
      id: "personCategory_code_1",
      header: utils.cellHeader(t("/catalog/person/person.category1"), t("/@word/code")),
      width: "12ch",
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "personCategory_description_1",
      header: utils.cellHeader(t("/catalog/person/person.category1"), t("/@word/description")),
      width: "20ch",
    },
    {
      id: "personCategory_id_2",
      header: utils.cellHeader(t("/catalog/person/person.category2"), t("/@word/id")),
      width: "10ch",
    },
    {
      id: "personCategory_code_2",
      header: utils.cellHeader(t("/catalog/person/person.category2"), t("/@word/code")),
      width: "12ch",
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "personCategory_description_2",
      header: utils.cellHeader(t("/catalog/person/person.category2"), t("/@word/description")),
      width: "20ch",
    },
    {
      id: "personCategory_id_3",
      header: utils.cellHeader(t("/catalog/person/person.category3"), t("/@word/id")),
      width: "10ch",
    },
    {
      id: "personCategory_code_3",
      header: utils.cellHeader(t("/catalog/person/person.category3"), t("/@word/code")),
      width: "12ch",
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "personCategory_description_3",
      header: utils.cellHeader(t("/catalog/person/person.category3"), t("/@word/description")),
      width: "20ch",
    },
    {
      id: "personCategory_id_4",
      header: utils.cellHeader(t("/catalog/person/person.category4"), t("/@word/id")),
      width: "10ch",
    },
    {
      id: "personCategory_code_4",
      header: utils.cellHeader(t("/catalog/person/person.category4"), t("/@word/code")),
      width: "12ch",
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "personCategory_description_4",
      header: utils.cellHeader(t("/catalog/person/person.category4"), t("/@word/description")),
      width: "20ch",
    },
    {
      id: "personCategory_id_5",
      header: utils.cellHeader(t("/catalog/person/person.category5"), t("/@word/id")),
      width: "10ch",
    },
    {
      id: "personCategory_code_5",
      header: utils.cellHeader(t("/catalog/person/person.category5"), t("/@word/code")),
      width: "12ch",
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "personCategory_description_5",
      header: utils.cellHeader(t("/catalog/person/person.category5"), t("/@word/description")),
      width: "20ch",
    },

    // Location
    {
      id: "city_id",
      header: utils.cellHeader(t("/catalog/location/city"), t("/@word/id")),
      width: "10ch",
    },
    {
      id: "city_name",
      header: utils.cellHeader(t("/catalog/location/city"), t("/@word/name")),
      width: "15ch",
    },
    {
      id: "state_id",
      header: utils.cellHeader(t("/catalog/location/state"), t("/@word/id")),
      width: "10ch",
    },
    {
      id: "state_code",
      header: utils.cellHeader(t("/catalog/location/state"), t("/@word/code")),
      width: "8ch",
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "state_name",
      header: utils.cellHeader(t("/catalog/location/state"), t("/@word/name")),
      width: "15ch",
    },
    {
      id: "country_id",
      header: utils.cellHeader(t("/catalog/location/country"), t("/@word/id")),
      width: "10ch",
    },
    {
      id: "country_codeA2",
      header: utils.cellHeader(t("/catalog/location/country"), t("/@word/codeA2")),
      width: "8ch",
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "country_name",
      header: utils.cellHeader(t("/catalog/location/country"), t("/@word/name")),
      width: "15ch",
    },

    // Shipping & Salesperson
    {
      id: "shipping_id",
      header: utils.cellHeader(t("/@word/personShipping"), t("/@word/id")),
      width: "10ch",
    },
    {
      id: "shipping_name",
      header: utils.cellHeader(t("/@word/personShipping"), t("/@word/name")),
      width: "25ch",
    },
    {
      id: "shipping_fantasyName",
      header: utils.cellHeader(t("/@word/personShipping"), t("/@word/fantasyName")),
      width: "20ch",
    },
    {
      id: "shipping_nameCalc",
      header: utils.cellHeader(t("/@word/personShipping"), t("/@word/nameCalc")),
      width: "20ch",
    },
    {
      id: "salesperson_id",
      header: utils.cellHeader(t("/@word/salesperson"), t("/@word/id")),
      width: "10ch",
    },
    {
      id: "salesperson_name",
      header: utils.cellHeader(t("/@word/salesperson"), t("/@word/name")),
      width: "25ch",
    },
    {
      id: "salesperson_fantasyName",
      header: utils.cellHeader(t("/@word/salesperson"), t("/@word/fantasyName")),
      width: "20ch",
    },
    {
      id: "salesperson_nameCalc",
      header: utils.cellHeader(t("/@word/salesperson"), t("/@word/nameCalc")),
      width: "20ch",
    },
    {
      id: "salespersonCategory_id_1",
      header: utils.cellHeader(t("/catalog/person/person.category1"), t("/@word/id")),
      width: "10ch",
    },
    {
      id: "salespersonCategory_code_1",
      header: utils.cellHeader(t("/catalog/person/person.category1"), t("/@word/code")),
      width: "12ch",
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "salespersonCategory_description_1",
      header: utils.cellHeader(t("/catalog/person/person.category1"), t("/@word/description")),
      width: "20ch",
    },
    {
      id: "salespersonCategory_id_2",
      header: utils.cellHeader(t("/catalog/person/person.category2"), t("/@word/id")),
      width: "10ch",
    },
    {
      id: "salespersonCategory_code_2",
      header: utils.cellHeader(t("/catalog/person/person.category2"), t("/@word/code")),
      width: "12ch",
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "salespersonCategory_description_2",
      header: utils.cellHeader(t("/catalog/person/person.category2"), t("/@word/description")),
      width: "20ch",
    },
    {
      id: "salespersonCategory_id_3",
      header: utils.cellHeader(t("/catalog/person/person.category3"), t("/@word/id")),
      width: "10ch",
    },
    {
      id: "salespersonCategory_code_3",
      header: utils.cellHeader(t("/catalog/person/person.category3"), t("/@word/code")),
      width: "12ch",
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "salespersonCategory_description_3",
      header: utils.cellHeader(t("/catalog/person/person.category3"), t("/@word/description")),
      width: "20ch",
    },
    {
      id: "salespersonCategory_id_4",
      header: utils.cellHeader(t("/catalog/person/person.category4"), t("/@word/id")),
      width: "10ch",
    },
    {
      id: "salespersonCategory_code_4",
      header: utils.cellHeader(t("/catalog/person/person.category4"), t("/@word/code")),
      width: "12ch",
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "salespersonCategory_description_4",
      header: utils.cellHeader(t("/catalog/person/person.category4"), t("/@word/description")),
      width: "20ch",
    },
    {
      id: "salespersonCategory_id_5",
      header: utils.cellHeader(t("/catalog/person/person.category5"), t("/@word/id")),
      width: "10ch",
    },
    {
      id: "salespersonCategory_code_5",
      header: utils.cellHeader(t("/catalog/person/person.category5"), t("/@word/code")),
      width: "12ch",
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "salespersonCategory_description_5",
      header: utils.cellHeader(t("/catalog/person/person.category5"), t("/@word/description")),
      width: "20ch",
    },
    {
      id: "personSalesperson_personSalesperson.id",
      header: utils.cellHeader(t("/@word/personSalesperson_personSalesperson"), t("/@word/id")),
      width: "10ch",
    },
    {
      id: "personSalesperson_personSalesperson.name",
      header: utils.cellHeader(t("/@word/personSalesperson_personSalesperson"), t("/@word/name")),
      width: "25ch",
    },
    {
      id: "personSalesperson_personSalesperson.fantasyName",
      header: utils.cellHeader(
        t("/@word/personSalesperson_personSalesperson"),
        t("/@word/fantasyName"),
      ),
      width: "20ch",
    },
    {
      id: "personSalesperson_personSalesperson.nameCalc",
      header: utils.cellHeader(
        t("/@word/personSalesperson_personSalesperson"),
        t("/@word/nameCalc"),
      ),
      width: "20ch",
    },
    {
      id: "salesCommission",
      header: utils.cellHeader(t("/@word/salesCommission")),
      width: "12ch",
      className: "number",
      cell: ({ row, value }) => utils.formatCurrency(value, { currency: row.currency_code }),
    },
    {
      id: "sales_salesHub",
      header: utils.cellHeader(t("/@word/salesHub")),
      width: "15ch",
    },
    {
      id: "sales_salesChannel",
      header: utils.cellHeader(t("/@word/salesChannel")),
      width: "15ch",
    },

    // Shipment & Product Info
    {
      id: "shipment_id",
      header: utils.cellHeader(t("/shipping/shipment"), t("/@word/id")),
      width: "10ch",
    },
    {
      id: "shipment_status",
      header: utils.cellHeader(t("/shipping/shipment"), t("/@word/status")),
      width: "12ch",
    },
    {
      id: "shipment_date",
      header: utils.cellHeader(t("/shipping/shipment"), t("/@word/date")),
      width: "12ch",
      cell: ({ value }) => utils.formatDate(value),
    },
    {
      id: "product_id",
      header: utils.cellHeader(t("/catalog/product/product"), t("/@word/id")),
      width: "10ch",
    },
    {
      id: "product_code",
      header: utils.cellHeader(t("/catalog/product/product"), t("/@word/code")),
      width: "12ch",
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "product_description",
      header: utils.cellHeader(t("/catalog/product/product"), t("/@word/description")),
      width: "25ch",
    },
    {
      id: "product_complement",
      header: utils.cellHeader(t("/catalog/product/product"), t("/@word/complement")),
      width: "15ch",
    },
    {
      id: "fiscalProfileProduct_id",
      header: utils.cellHeader(t("/fiscal/fiscalProfileProduct"), t("/@word/id")),
      width: "10ch",
    },
    {
      id: "fiscalProfileProduct_description",
      header: utils.cellHeader(t("/fiscal/fiscalProfileProduct"), t("/@word/description")),
      width: "20ch",
    },
    {
      id: "productCategory_id_1",
      header: utils.cellHeader(t("/catalog/product/product.category1"), t("/@word/id")),
      width: "10ch",
    },
    {
      id: "productCategory_code_1",
      header: utils.cellHeader(t("/catalog/product/product.category1"), t("/@word/code")),
      width: "12ch",
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "productCategory_description_1",
      header: utils.cellHeader(t("/catalog/product/product.category1"), t("/@word/description")),
      width: "20ch",
    },
    {
      id: "productCategory_id_2",
      header: utils.cellHeader(t("/catalog/product/product.category2"), t("/@word/id")),
      width: "10ch",
    },
    {
      id: "productCategory_code_2",
      header: utils.cellHeader(t("/catalog/product/product.category2"), t("/@word/code")),
      width: "12ch",
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "productCategory_description_2",
      header: utils.cellHeader(t("/catalog/product/product.category2"), t("/@word/description")),
      width: "20ch",
    },
    {
      id: "productCategory_id_3",
      header: utils.cellHeader(t("/catalog/product/product.category3"), t("/@word/id")),
      width: "10ch",
    },
    {
      id: "productCategory_code_3",
      header: utils.cellHeader(t("/catalog/product/product.category3"), t("/@word/code")),
      width: "12ch",
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "productCategory_description_3",
      header: utils.cellHeader(t("/catalog/product/product.category3"), t("/@word/description")),
      width: "20ch",
    },
    {
      id: "productCategory_id_4",
      header: utils.cellHeader(t("/catalog/product/product.category4"), t("/@word/id")),
      width: "10ch",
    },
    {
      id: "productCategory_code_4",
      header: utils.cellHeader(t("/catalog/product/product.category4"), t("/@word/code")),
      width: "12ch",
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "productCategory_description_4",
      header: utils.cellHeader(t("/catalog/product/product.category4"), t("/@word/description")),
      width: "20ch",
    },
    {
      id: "productCategory_id_5",
      header: utils.cellHeader(t("/catalog/product/product.category5"), t("/@word/id")),
      width: "10ch",
    },
    {
      id: "productCategory_code_5",
      header: utils.cellHeader(t("/catalog/product/product.category5"), t("/@word/code")),
      width: "12ch",
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "productCategory_description_5",
      header: utils.cellHeader(t("/catalog/product/product.category5"), t("/@word/description")),
      width: "20ch",
    },
    {
      id: "product_properties_br_NCM",
      header: utils.cellHeader(t("/catalog/product.properties.fiscal_br_NCM")),
      width: "12ch",
    },
    {
      id: "product_properties_br_CEST",
      header: utils.cellHeader(t("/catalog/product.properties.fiscal_br_CEST")),
      width: "12ch",
    },

    // Packing & Variant
    {
      id: "productPacking_id",
      header: utils.cellHeader(t("/catalog/product/productPacking"), t("/@word/id")),
      width: "10ch",
    },
    {
      id: "productPacking_code",
      header: utils.cellHeader(t("/catalog/product/productPacking"), t("/@word/code")),
      width: "12ch",
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "productPacking_complement",
      header: utils.cellHeader(t("/catalog/product/productPacking"), t("/@word/complement")),
      width: "15ch",
    },
    {
      id: "productPacking_descriptionCalc",
      header: utils.cellHeader(t("/catalog/product/productPacking"), t("/@word/description")),
      width: "30ch",
      cellValue: ({ row }) =>
        [row.product_description, row.productPacking_complement, row.productVariant_description]
          .filter(Boolean)
          .join(", "),
    },
    {
      id: "productPacking_units",
      header: utils.cellHeader(t("/catalog/product/productPacking"), t("/@word/units")),
      width: "10ch",
      className: "number",
      cell: ({ value }) => utils.formatNumber(value),
    },
    {
      id: "productVariant_id",
      header: utils.cellHeader(t("/catalog/product/productVariant"), t("/@word/id")),
      width: "10ch",
    },
    {
      id: "productVariant_code",
      header: utils.cellHeader(t("/catalog/product/productVariant"), t("/@word/code")),
      width: "12ch",
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "productVariant_description",
      header: utils.cellHeader(t("/catalog/product/productVariant"), t("/@word/description")),
      width: "20ch",
    },

    // Taxation & Purchase
    {
      id: "taxationOperation_id",
      header: utils.cellHeader(t("/fiscal/taxation/taxationOperation"), t("/@word/id")),
      width: "10ch",
    },
    {
      id: "taxationOperation_code",
      header: utils.cellHeader(t("/fiscal/taxation/taxationOperation"), t("/@word/code")),
      width: "12ch",
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "taxationOperation_description",
      header: utils.cellHeader(t("/fiscal/taxation/taxationOperation"), t("/@word/description")),
      width: "20ch",
    },
    {
      id: "purchase_id",
      header: utils.cellHeader(t("/supply/purchase/purchase"), t("/@word/id")),
      width: "10ch",
    },
    {
      id: "purchase_code",
      header: utils.cellHeader(t("/supply/purchase/purchase"), t("/@word/code")),
      width: "12ch",
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "purchaseItem_id",
      header: utils.cellHeader(t("/supply/purchase/purchaseItem"), t("/@word/id")),
      width: "10ch",
    },

    // Unit Values & Quantities
    {
      id: "unit_id",
      header: utils.cellHeader(t("/catalog/product/dimension.unit"), t("/@word/id")),
      width: "10ch",
    },
    {
      id: "unit_code",
      header: utils.cellHeader(t("/catalog/product/dimension.unit"), t("/@word/code")),
      width: "8ch",
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "sum_quantity",
      header: utils.cellHeader(t("/@word/quantity")),
      width: "12ch",
      className: "number",
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
      id: "sum_quantityUnits",
      header: utils.cellHeader(t("/@word/quantityUnits")),
      width: "12ch",
      className: "number",
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({ data }) => utils.sum(data, (item) => item.sum_quantityUnits),
      footer: ({ value }) => utils.formatNumber(value),
    },
    {
      id: "sum_servedQuantity",
      header: utils.cellHeader(t("/@word/servedQuantity")),
      width: "12ch",
      className: "number",
      cell: ({ row, value }) => utils.formatQuantity(value, { unit_code: row.unit_code }),
    },

    // Monetary Totals & Calculations
    {
      id: "sum_grossProductValue",
      header: utils.cellHeader(t("/@word/grossProductValue")),
      width: "15ch",
      className: "number",
      cell: ({ row, value }) => utils.formatCurrency(value, { currency: row.currency_code }),
      footerValue: ({ data }) =>
        utils.sumBy(
          data,
          (item) => item.currency_code,
          (item) => item.sum_grossProductValue,
        ),
      footer: ({ value }) =>
        utils.renderAggr(value, (val, key) => utils.formatCurrency(val, { currency: key })),
    },
    {
      id: "sum_discountValue",
      header: utils.cellHeader(t("/@word/discountValue")),
      width: "12ch",
      className: "number",
      cell: ({ row, value }) => utils.formatCurrency(value, { currency: row.currency_code }),
      footerValue: ({ data }) =>
        utils.sumBy(
          data,
          (item) => item.currency_code,
          (item) => item.sum_discountValue,
        ),
      footer: ({ value }) =>
        utils.renderAggr(value, (val, key) => utils.formatCurrency(val, { currency: key })),
    },
    {
      id: "sum_productValue",
      header: utils.cellHeader(t("/@word/productValue")),
      width: "15ch",
      className: "number",
      cell: ({ row, value }) => utils.formatCurrency(value, { currency: row.currency_code }),
      footerValue: ({ data }) =>
        utils.sumBy(
          data,
          (item) => item.currency_code,
          (item) => item.sum_productValue,
        ),
      footer: ({ value }) =>
        utils.renderAggr(value, (val, key) => utils.formatCurrency(val, { currency: key })),
    },
    {
      id: "sum_freightValue",
      header: utils.cellHeader(t("/@word/freightValue")),
      width: "12ch",
      className: "number",
      cell: ({ row, value }) => utils.formatCurrency(value, { currency: row.currency_code }),
      footerValue: ({ data }) =>
        utils.sumBy(
          data,
          (item) => item.currency_code,
          (item) => item.sum_freightValue,
        ),
      footer: ({ value }) =>
        utils.renderAggr(value, (val, key) => utils.formatCurrency(val, { currency: key })),
    },
    {
      id: "sum_insuranceValue",
      header: utils.cellHeader(t("/@word/insuranceValue")),
      width: "12ch",
      className: "number",
      cell: ({ row, value }) => utils.formatCurrency(value, { currency: row.currency_code }),
      footerValue: ({ data }) =>
        utils.sumBy(
          data,
          (item) => item.currency_code,
          (item) => item.sum_insuranceValue,
        ),
      footer: ({ value }) =>
        utils.renderAggr(value, (val, key) => utils.formatCurrency(val, { currency: key })),
    },
    {
      id: "sum_otherValue",
      header: utils.cellHeader(t("/@word/otherValue")),
      width: "12ch",
      className: "number",
      cell: ({ row, value }) => utils.formatCurrency(value, { currency: row.currency_code }),
      footerValue: ({ data }) =>
        utils.sumBy(
          data,
          (item) => item.currency_code,
          (item) => item.sum_otherValue,
        ),
      footer: ({ value }) =>
        utils.renderAggr(value, (val, key) => utils.formatCurrency(val, { currency: key })),
    },
    {
      id: "sum_operationValue",
      header: utils.cellHeader(t("/@word/operationValue")),
      width: "15ch",
      className: "number",
      cell: ({ row, value }) => utils.formatCurrency(value, { currency: row.currency_code }),
      footerValue: ({ data }) =>
        utils.sumBy(
          data,
          (item) => item.currency_code,
          (item) => item.sum_operationValue,
        ),
      footer: ({ value }) =>
        utils.renderAggr(value, (val, key) => utils.formatCurrency(val, { currency: key })),
    },
    {
      id: "sum_insideTaxValue",
      header: utils.cellHeader(t("/@word/insideTaxValue")),
      width: "12ch",
      className: "number",
      cell: ({ row, value }) => utils.formatCurrency(value, { currency: row.currency_code }),
      footerValue: ({ data }) =>
        utils.sumBy(
          data,
          (item) => item.currency_code,
          (item) => item.sum_insideTaxValue,
        ),
      footer: ({ value }) =>
        utils.renderAggr(value, (val, key) => utils.formatCurrency(val, { currency: key })),
    },
    {
      id: "sum_outsideTaxValue",
      header: utils.cellHeader(t("/@word/outsideTaxValue")),
      width: "12ch",
      className: "number",
      cell: ({ row, value }) => utils.formatCurrency(value, { currency: row.currency_code }),
      footerValue: ({ data }) =>
        utils.sumBy(
          data,
          (item) => item.currency_code,
          (item) => item.sum_outsideTaxValue,
        ),
      footer: ({ value }) =>
        utils.renderAggr(value, (val, key) => utils.formatCurrency(val, { currency: key })),
    },
    {
      id: "sum_totalValue",
      header: utils.cellHeader(t("/@word/totalValue")),
      width: "15ch",
      className: "number",
      cell: ({ row, value }) => utils.formatCurrency(value, { currency: row.currency_code }),
      footerValue: ({ data }) =>
        utils.sumBy(
          data,
          (item) => item.currency_code,
          (item) => item.sum_totalValue,
        ),
      footer: ({ value }) =>
        utils.renderAggr(value, (val, key) => utils.formatCurrency(val, { currency: key })),
    },
    {
      id: "sum_effectiveValue",
      header: utils.cellHeader(t("/@word/effectiveValue")),
      width: "15ch",
      className: "number",
      cell: ({ row, value }) => utils.formatCurrency(value, { currency: row.currency_code }),
      footerValue: ({ data }) =>
        utils.sumBy(
          data,
          (item) => item.currency_code,
          (item) => item.sum_effectiveValue,
        ),
      footer: ({ value }) =>
        utils.renderAggr(value, (val, key) => utils.formatCurrency(val, { currency: key })),
    },
    {
      id: "sum_netWeightKg",
      header: utils.cellHeader(t("/@word/netWeightKg")),
      width: "12ch",
      className: "number",
      cell: ({ value }) => utils.formatNumber(value, { minimumFractionDigits: 3 }),
      footerValue: ({ data }) => utils.sum(data, (item) => item.sum_netWeightKg),
      footer: ({ value }) => utils.formatNumber(value, { minimumFractionDigits: 3 }),
    },
    {
      id: "sum_grossWeightKg",
      header: utils.cellHeader(t("/@word/grossWeightKg")),
      width: "12ch",
      className: "number",
      cell: ({ value }) => utils.formatNumber(value, { minimumFractionDigits: 3 }),
      footerValue: ({ data }) => utils.sum(data, (item) => item.sum_grossWeightKg),
      footer: ({ value }) => utils.formatNumber(value, { minimumFractionDigits: 3 }),
    },
    {
      id: "sum_volumeM3",
      header: utils.cellHeader(t("/@word/volumeM3")),
      width: "12ch",
      className: "number",
      cell: ({ value }) => utils.formatNumber(value, { minimumFractionDigits: 4 }),
      footerValue: ({ data }) => utils.sum(data, (item) => item.sum_volumeM3),
      footer: ({ value }) => utils.formatNumber(value, { minimumFractionDigits: 4 }),
    },
    {
      id: "sum_contributionMargin",
      header: utils.cellHeader(t("/@word/contributionMarginValue")),
      width: "15ch",
      className: "number",
      cell: ({ row, value }) => utils.formatCurrency(value, { currency: row.currency_code }),
      footerValue: ({ data }) =>
        utils.sumBy(
          data,
          (item) => item.currency_code,
          (item) => item.sum_contributionMargin,
        ),
      footer: ({ value }) =>
        utils.renderAggr(value, (val, key) => utils.formatCurrency(val, { currency: key })),
    },
    {
      id: "contributionMargin",
      header: utils.cellHeader(t("/@word/contributionMargin")),
      width: "15ch",
      className: "number",
      cellValue: ({ row }) => row.sum_contributionMargin / row.sum_totalValue,
      cell: ({ value }) => utils.formatPercentage(value, { minimumFractionDigits: 1 }),
      footerValue: ({ data }) => {
        const map = data.reduce((acc, row) => {
          const currency_code = row.currency_code ?? "";

          if (!acc[currency_code]) {
            acc[currency_code] = { sum_contributionMargin: 0, sum_totalValue: 0 };
          }

          acc[currency_code].sum_contributionMargin += row.sum_contributionMargin || 0;
          acc[currency_code].sum_totalValue += row.sum_totalValue || 0;

          return acc;
        }, {});

        return Object.fromEntries(
          Object.entries(map).map(([currency_code, { sum_contributionMargin, sum_totalValue }]) => [
            currency_code,
            sum_totalValue !== 0 ? sum_contributionMargin / sum_totalValue : 0,
          ]),
        );
      },
      footer: ({ value }) =>
        utils.renderAggr(
          value,
          (val, key) => `${utils.formatPercentage(val, { minimumFractionDigits: 1 })} ${key}`,
        ),
    },
    {
      id: "markup",
      header: utils.cellHeader(t("/@word/markup")),
      width: "15ch",
      className: "number",
      cellValue: ({ row }) => row.sum_totalValue / row.sum_effectiveValue - 1,
      cell: ({ value }) => utils.formatPercentage(value, { minimumFractionDigits: 1 }),
      footerValue: ({ data }) => {
        const map = data.reduce((acc, row) => {
          const currency_code = row.currency_code ?? "";

          if (!acc[currency_code]) {
            acc[currency_code] = { sum_totalValue: 0, sum_effectiveValue: 0 };
          }

          acc[currency_code].sum_totalValue += row.sum_totalValue || 0;
          acc[currency_code].sum_effectiveValue += row.sum_effectiveValue || 0;

          return acc;
        }, {});

        return Object.fromEntries(
          Object.entries(map).map(([currency_code, { sum_totalValue, sum_effectiveValue }]) => [
            currency_code,
            sum_effectiveValue !== 0 ? sum_totalValue / sum_effectiveValue - 1 : 0,
          ]),
        );
      },
      footer: ({ value }) =>
        utils.renderAggr(
          value,
          (val, key) => `${utils.formatPercentage(val, { minimumFractionDigits: 1 })} ${key}`,
        ),
    },
    {
      id: "sum_salesCommissionValue",
      header: utils.cellHeader(t("/@word/salesCommissionValue")),
      width: "15ch",
      className: "number",
      cell: ({ row, value }) => utils.formatCurrency(value, { currency: row.currency_code }),
      footerValue: ({ data }) =>
        utils.sumBy(
          data,
          (item) => item.currency_code,
          (item) => item.sum_salesCommissionValue,
        ),
      footer: ({ value }) =>
        utils.renderAggr(value, (val, key) => utils.formatCurrency(val, { currency: key })),
    },

    // Record Counts
    {
      id: "count_sale",
      header: utils.cellHeader(t("/sale/sale/plural"), t("/@word/count")),
      width: "10ch",
      className: "number",
      cell: ({ value }) => utils.formatNumber(value),
    },
    {
      id: "count_saleItem",
      header: utils.cellHeader(t("/sale/saleItem/plural"), t("/@word/count")),
      width: "10ch",
      className: "number",
      cell: ({ value }) => utils.formatNumber(value),
    },
  ];

  // return utils.meta_info({ fields, columns });

  data = utils.sort(data, settings?.sort || []);

  return (
    <div className="report-wrapper" style={{ fontSize: settings?.fontSize }}>
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
            <dl style={{ flex: 1 }}>
              <dd>
                <h1>{t("/sale/report/saleList")}</h1>
              </dd>
            </dl>
          </section>

          <Fields
            fields={fields}
            visibleFields={visibleFields}
            data={settings?.parametersDesc ?? {}}
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
