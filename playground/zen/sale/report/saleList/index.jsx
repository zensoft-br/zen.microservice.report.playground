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
      id: "personSalespersonDesc",
      group: "main",
      label: utils.cellHeader(t("/@word/personSalesperson")),
      value: (row) => row.personSalespersonDesc,
    },
    {
      id: "personSalesperson_personSalespersonDesc",
      group: "main",
      label: utils.cellHeader(t("/@word/personSalesperson_personSalesperson")),
      value: (row) => row.personSalesperson_personSalespersonDesc,
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
      className: "id",
      width: "8ch",
      header: utils.cellHeader(t("/@word/id")),
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({ data }) => data.length,
      footer: ({ value }) => utils.formatNumber(value),
    },
    {
      id: "sale_status",
      width: "15ch",
      header: utils.cellHeader(t("/@word/status")),
      cell: ({ value }) => (value ? <Badge>{t(`/sale/saleStatus/enum/${value}`)}</Badge> : null),
    },
    {
      id: "sale_code",
      className: "number",
      width: "12ch",
      header: utils.cellHeader(t("/@word/code")),
    },
    {
      id: "sale_date",
      width: "12ch",
      header: utils.cellHeader(t("/@word/date")),
      cell: ({ value }) => utils.formatDate(value),
    },
    {
      id: "sale_day",
      className: "number",
      width: "8ch",
      header: utils.cellHeader(t("/@word/day")),
    },
    {
      id: "sale_month",
      className: "number",
      width: "8ch",
      header: utils.cellHeader(t("/@word/month")),
    },
    {
      id: "sale_year",
      className: "number",
      width: "8ch",
      header: utils.cellHeader(t("/@word/year")),
    },
    {
      id: "sale_freightType",
      width: "15ch",
      header: utils.cellHeader(t("/@word/freightType")),
      cell: ({ value }) => (value ? t(`/commercial/freightType/enum/${value}`) : ""),
    },
    {
      id: "sale_availabilityDate",
      width: "12ch",
      header: utils.cellHeader(t("/@word/availabilityDate")),
      cell: ({ value }) => utils.formatDate(value),
    },
    {
      id: "sale_tags",
      width: "20ch",
      header: utils.cellHeader(t("/@word/tags")),
      cell: ({ value }) =>
        value
          ? value
              .split(",")
              .filter((tag) => tag && tag !== "null")
              .map((tag, idx) => <Badge key={idx}>{tag.trim()}</Badge>)
          : null,
    },

    {
      id: "outgoingInvoice_id",
      width: "8ch",
      header: utils.cellHeader(t("/fiscal/outgoingInvoice"), t("/@word/id")),
    },

    // SaleItem
    {
      id: "saleItem_unitValue",
      className: "number",
      width: "12ch",
      header: utils.cellHeader(t("/@word/unitValue")),
    },
    {
      id: "saleItem_costUnitValue",
      className: "number",
      width: "12ch",
      header: utils.cellHeader(t("/@word/costUnitValue")),
    },
    {
      id: "saleItem_retailUnitValue",
      className: "number",
      width: "12ch",
      header: utils.cellHeader(t("/@word/retailUnitValue")),
    },

    // Sale Properties
    {
      id: "sale_properties.comments",
      width: "25ch",
      header: utils.cellHeader(t("/@word/comments")),
      cellValue: ({ row }) => row.sale_properties?.comments,
    },
    {
      id: "sale_properties.paymentMethods",
      width: "20ch",
      header: utils.cellHeader(t("/@word/paymentMethods")),
      cellValue: ({ row }) => row.sale_properties?.paymentMethods,
    },

    // Workflow
    {
      id: "workflow_id",
      width: "8ch",
      header: utils.cellHeader(t("/system/workflow/workflow"), t("/@word/id")),
    },
    {
      id: "workflow_code",
      width: "12ch",
      header: utils.cellHeader(t("/system/workflow/workflow"), t("/@word/code")),
      cell: ({ value }) => <Badge>{value}</Badge>,
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
    },
    {
      id: "workflowNode_code",
      width: "12ch",
      header: utils.cellHeader(t("/system/workflow/workflowNode"), t("/@word/code")),
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "workflowNode_description",
      width: "20ch",
      header: utils.cellHeader(t("/system/workflow/workflowNode"), t("/@word/description")),
    },

    // Company
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
    },
    {
      id: "company_name",
      width: "25ch",
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

    // Profiles & Currency
    {
      id: "fiscalProfileOperation_id",
      width: "8ch",
      header: utils.cellHeader(t("/fiscal/fiscalProfileOperation"), t("/@word/id")),
    },
    {
      id: "fiscalProfileOperation_code",
      width: "12ch",
      header: utils.cellHeader(t("/fiscal/fiscalProfileOperation"), t("/@word/code")),
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "fiscalProfileOperation_description",
      width: "20ch",
      header: utils.cellHeader(t("/fiscal/fiscalProfileOperation"), t("/@word/description")),
    },
    {
      id: "saleProfile_id",
      width: "8ch",
      header: utils.cellHeader(t("/sale/saleProfile"), t("/@word/id")),
    },
    {
      id: "saleProfile_code",
      width: "12ch",
      header: utils.cellHeader(t("/sale/saleProfile"), t("/@word/code")),
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "saleProfile_description",
      width: "20ch",
      header: utils.cellHeader(t("/sale/saleProfile"), t("/@word/description")),
    },
    {
      id: "currency_id",
      width: "8ch",
      header: utils.cellHeader(t("/financial/currency"), t("/@word/id")),
    },
    {
      id: "currency_code",
      width: "8ch",
      header: utils.cellHeader(t("/financial/currency"), t("/@word/code")),
      cell: ({ value }) => <Badge>{value}</Badge>,
    },

    // Person
    {
      id: "person_id",
      width: "8ch",
      header: utils.cellHeader(t("/catalog/person/person"), t("/@word/id")),
    },
    {
      id: "person_name",
      width: "25ch",
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
      id: "personGroup_id",
      width: "8ch",
      header: utils.cellHeader(t("/catalog/person/personGroup"), t("/@word/id")),
    },
    {
      id: "personGroup_code",
      width: "12ch",
      header: utils.cellHeader(t("/catalog/person/personGroup"), t("/@word/code")),
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "personGroup_description",
      width: "20ch",
      header: utils.cellHeader(t("/catalog/person/personGroup"), t("/@word/description")),
    },
    {
      id: "personCategory_id_1",
      width: "10ch",
      header: utils.cellHeader(t("/catalog/person/person.category1"), t("/@word/id")),
    },
    {
      id: "personCategory_code_1",
      width: "12ch",
      header: utils.cellHeader(t("/catalog/person/person.category1"), t("/@word/code")),
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "personCategory_description_1",
      width: "20ch",
      header: utils.cellHeader(t("/catalog/person/person.category1"), t("/@word/description")),
    },
    {
      id: "personCategory_id_2",
      width: "10ch",
      header: utils.cellHeader(t("/catalog/person/person.category2"), t("/@word/id")),
    },
    {
      id: "personCategory_code_2",
      width: "12ch",
      header: utils.cellHeader(t("/catalog/person/person.category2"), t("/@word/code")),
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "personCategory_description_2",
      width: "20ch",
      header: utils.cellHeader(t("/catalog/person/person.category2"), t("/@word/description")),
    },
    {
      id: "personCategory_id_3",
      width: "10ch",
      header: utils.cellHeader(t("/catalog/person/person.category3"), t("/@word/id")),
    },
    {
      id: "personCategory_code_3",
      width: "12ch",
      header: utils.cellHeader(t("/catalog/person/person.category3"), t("/@word/code")),
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "personCategory_description_3",
      width: "20ch",
      header: utils.cellHeader(t("/catalog/person/person.category3"), t("/@word/description")),
    },
    {
      id: "personCategory_id_4",
      width: "10ch",
      header: utils.cellHeader(t("/catalog/person/person.category4"), t("/@word/id")),
    },
    {
      id: "personCategory_code_4",
      width: "12ch",
      header: utils.cellHeader(t("/catalog/person/person.category4"), t("/@word/code")),
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "personCategory_description_4",
      width: "20ch",
      header: utils.cellHeader(t("/catalog/person/person.category4"), t("/@word/description")),
    },
    {
      id: "personCategory_id_5",
      width: "10ch",
      header: utils.cellHeader(t("/catalog/person/person.category5"), t("/@word/id")),
    },
    {
      id: "personCategory_code_5",
      width: "12ch",
      header: utils.cellHeader(t("/catalog/person/person.category5"), t("/@word/code")),
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "personCategory_description_5",
      width: "20ch",
      header: utils.cellHeader(t("/catalog/person/person.category5"), t("/@word/description")),
    },

    // Location
    {
      id: "city_id",
      width: "8ch",
      header: utils.cellHeader(t("/catalog/location/city"), t("/@word/id")),
    },
    {
      id: "city_name",
      width: "15ch",
      header: utils.cellHeader(t("/catalog/location/city"), t("/@word/name")),
    },
    {
      id: "state_id",
      width: "8ch",
      header: utils.cellHeader(t("/catalog/location/state"), t("/@word/id")),
    },
    {
      id: "state_code",
      width: "8ch",
      header: utils.cellHeader(t("/catalog/location/state"), t("/@word/code")),
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "state_name",
      width: "15ch",
      header: utils.cellHeader(t("/catalog/location/state"), t("/@word/name")),
    },
    {
      id: "country_id",
      width: "8ch",
      header: utils.cellHeader(t("/catalog/location/country"), t("/@word/id")),
    },
    {
      id: "country_codeA2",
      width: "8ch",
      header: utils.cellHeader(t("/catalog/location/country"), t("/@word/codeA2")),
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "country_name",
      width: "15ch",
      header: utils.cellHeader(t("/catalog/location/country"), t("/@word/name")),
    },

    // Shipping & Salesperson
    {
      id: "shipping_id",
      width: "8ch",
      header: utils.cellHeader(t("/@word/personShipping"), t("/@word/id")),
    },
    {
      id: "shipping_name",
      width: "25ch",
      header: utils.cellHeader(t("/@word/personShipping"), t("/@word/name")),
    },
    {
      id: "shipping_fantasyName",
      width: "20ch",
      header: utils.cellHeader(t("/@word/personShipping"), t("/@word/fantasyName")),
    },
    {
      id: "shipping_nameCalc",
      width: "20ch",
      header: utils.cellHeader(t("/@word/personShipping"), t("/@word/nameCalc")),
    },
    {
      id: "salesperson_id",
      width: "8ch",
      header: utils.cellHeader(t("/@word/salesperson"), t("/@word/id")),
    },
    {
      id: "salesperson_name",
      width: "25ch",
      header: utils.cellHeader(t("/@word/salesperson"), t("/@word/name")),
    },
    {
      id: "salesperson_fantasyName",
      width: "20ch",
      header: utils.cellHeader(t("/@word/salesperson"), t("/@word/fantasyName")),
    },
    {
      id: "salesperson_nameCalc",
      width: "20ch",
      header: utils.cellHeader(t("/@word/salesperson"), t("/@word/nameCalc")),
    },
    {
      id: "salespersonCategory_id_1",
      width: "10ch",
      header: utils.cellHeader(t("/catalog/person/person.category1"), t("/@word/id")),
    },
    {
      id: "salespersonCategory_code_1",
      width: "12ch",
      header: utils.cellHeader(t("/catalog/person/person.category1"), t("/@word/code")),
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "salespersonCategory_description_1",
      width: "20ch",
      header: utils.cellHeader(t("/catalog/person/person.category1"), t("/@word/description")),
    },
    {
      id: "salespersonCategory_id_2",
      width: "10ch",
      header: utils.cellHeader(t("/catalog/person/person.category2"), t("/@word/id")),
    },
    {
      id: "salespersonCategory_code_2",
      width: "12ch",
      header: utils.cellHeader(t("/catalog/person/person.category2"), t("/@word/code")),
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "salespersonCategory_description_2",
      width: "20ch",
      header: utils.cellHeader(t("/catalog/person/person.category2"), t("/@word/description")),
    },
    {
      id: "salespersonCategory_id_3",
      width: "10ch",
      header: utils.cellHeader(t("/catalog/person/person.category3"), t("/@word/id")),
    },
    {
      id: "salespersonCategory_code_3",
      width: "12ch",
      header: utils.cellHeader(t("/catalog/person/person.category3"), t("/@word/code")),
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "salespersonCategory_description_3",
      width: "20ch",
      header: utils.cellHeader(t("/catalog/person/person.category3"), t("/@word/description")),
    },
    {
      id: "salespersonCategory_id_4",
      width: "10ch",
      header: utils.cellHeader(t("/catalog/person/person.category4"), t("/@word/id")),
    },
    {
      id: "salespersonCategory_code_4",
      width: "12ch",
      header: utils.cellHeader(t("/catalog/person/person.category4"), t("/@word/code")),
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "salespersonCategory_description_4",
      width: "20ch",
      header: utils.cellHeader(t("/catalog/person/person.category4"), t("/@word/description")),
    },
    {
      id: "salespersonCategory_id_5",
      width: "10ch",
      header: utils.cellHeader(t("/catalog/person/person.category5"), t("/@word/id")),
    },
    {
      id: "salespersonCategory_code_5",
      width: "12ch",
      header: utils.cellHeader(t("/catalog/person/person.category5"), t("/@word/code")),
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "salespersonCategory_description_5",
      width: "20ch",
      header: utils.cellHeader(t("/catalog/person/person.category5"), t("/@word/description")),
    },
    {
      id: "personSalesperson_personSalesperson.id",
      width: "8ch",
      header: utils.cellHeader(t("/@word/personSalesperson_personSalesperson"), t("/@word/id")),
    },
    {
      id: "personSalesperson_personSalesperson.name",
      width: "25ch",
      header: utils.cellHeader(t("/@word/personSalesperson_personSalesperson"), t("/@word/name")),
    },
    {
      id: "personSalesperson_personSalesperson.fantasyName",
      width: "20ch",
      header: utils.cellHeader(
        t("/@word/personSalesperson_personSalesperson"),
        t("/@word/fantasyName"),
      ),
    },
    {
      id: "personSalesperson_personSalesperson.nameCalc",
      width: "20ch",
      header: utils.cellHeader(
        t("/@word/personSalesperson_personSalesperson"),
        t("/@word/nameCalc"),
      ),
    },
    {
      id: "salesCommission",
      className: "number",
      width: "12ch",
      header: utils.cellHeader(t("/@word/salesCommission")),
      cell: ({ row, value }) => utils.formatCurrency(value, { currency: row.currency_code }),
    },
    {
      id: "sales_salesHub",
      width: "15ch",
      header: utils.cellHeader(t("/@word/salesHub")),
    },
    {
      id: "sales_salesChannel",
      width: "15ch",
      header: utils.cellHeader(t("/@word/salesChannel")),
    },

    // Shipment & Product Info
    {
      id: "shipment_id",
      width: "8ch",
      header: utils.cellHeader(t("/shipping/shipment"), t("/@word/id")),
    },
    {
      id: "shipment_status",
      width: "12ch",
      header: utils.cellHeader(t("/shipping/shipment"), t("/@word/status")),
    },
    {
      id: "shipment_date",
      width: "12ch",
      header: utils.cellHeader(t("/shipping/shipment"), t("/@word/date")),
      cell: ({ value }) => utils.formatDate(value),
    },
    {
      id: "product_id",
      width: "8ch",
      header: utils.cellHeader(t("/catalog/product/product"), t("/@word/id")),
    },
    {
      id: "product_code",
      width: "12ch",
      header: utils.cellHeader(t("/catalog/product/product"), t("/@word/code")),
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "product_description",
      width: "25ch",
      header: utils.cellHeader(t("/catalog/product/product"), t("/@word/description")),
    },
    {
      id: "product_complement",
      width: "15ch",
      header: utils.cellHeader(t("/catalog/product/product"), t("/@word/complement")),
    },
    {
      id: "fiscalProfileProduct_id",
      width: "8ch",
      header: utils.cellHeader(t("/fiscal/fiscalProfileProduct"), t("/@word/id")),
    },
    {
      id: "fiscalProfileProduct_description",
      width: "20ch",
      header: utils.cellHeader(t("/fiscal/fiscalProfileProduct"), t("/@word/description")),
    },
    {
      id: "productCategory_id_1",
      width: "10ch",
      header: utils.cellHeader(t("/catalog/product/product.category1"), t("/@word/id")),
    },
    {
      id: "productCategory_code_1",
      width: "12ch",
      header: utils.cellHeader(t("/catalog/product/product.category1"), t("/@word/code")),
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "productCategory_description_1",
      width: "20ch",
      header: utils.cellHeader(t("/catalog/product/product.category1"), t("/@word/description")),
    },
    {
      id: "productCategory_id_2",
      width: "10ch",
      header: utils.cellHeader(t("/catalog/product/product.category2"), t("/@word/id")),
    },
    {
      id: "productCategory_code_2",
      width: "12ch",
      header: utils.cellHeader(t("/catalog/product/product.category2"), t("/@word/code")),
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "productCategory_description_2",
      width: "20ch",
      header: utils.cellHeader(t("/catalog/product/product.category2"), t("/@word/description")),
    },
    {
      id: "productCategory_id_3",
      width: "10ch",
      header: utils.cellHeader(t("/catalog/product/product.category3"), t("/@word/id")),
    },
    {
      id: "productCategory_code_3",
      width: "12ch",
      header: utils.cellHeader(t("/catalog/product/product.category3"), t("/@word/code")),
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "productCategory_description_3",
      width: "20ch",
      header: utils.cellHeader(t("/catalog/product/product.category3"), t("/@word/description")),
    },
    {
      id: "productCategory_id_4",
      width: "10ch",
      header: utils.cellHeader(t("/catalog/product/product.category4"), t("/@word/id")),
    },
    {
      id: "productCategory_code_4",
      width: "12ch",
      header: utils.cellHeader(t("/catalog/product/product.category4"), t("/@word/code")),
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "productCategory_description_4",
      width: "20ch",
      header: utils.cellHeader(t("/catalog/product/product.category4"), t("/@word/description")),
    },
    {
      id: "productCategory_id_5",
      width: "10ch",
      header: utils.cellHeader(t("/catalog/product/product.category5"), t("/@word/id")),
    },
    {
      id: "productCategory_code_5",
      width: "12ch",
      header: utils.cellHeader(t("/catalog/product/product.category5"), t("/@word/code")),
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "productCategory_description_5",
      width: "20ch",
      header: utils.cellHeader(t("/catalog/product/product.category5"), t("/@word/description")),
    },
    {
      id: "product_properties_br_NCM",
      width: "12ch",
      header: utils.cellHeader(t("/catalog/product.properties.fiscal_br_NCM")),
    },
    {
      id: "product_properties_br_CEST",
      width: "12ch",
      header: utils.cellHeader(t("/catalog/product.properties.fiscal_br_CEST")),
    },

    // Packing & Variant
    {
      id: "productPacking_id",
      width: "8ch",
      header: utils.cellHeader(t("/catalog/product/productPacking"), t("/@word/id")),
    },
    {
      id: "productPacking_code",
      width: "15ch",
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
      width: "15ch",
      header: utils.cellHeader(t("/catalog/product/productPacking"), t("/@word/complement")),
    },
    {
      id: "productPacking_units",
      className: "number",
      width: "10ch",
      header: utils.cellHeader(t("/catalog/product/productPacking"), t("/@word/units")),
      cell: ({ value }) => utils.formatNumber(value),
    },
    {
      id: "productVariant_id",
      width: "8ch",
      header: utils.cellHeader(t("/catalog/product/productVariant"), t("/@word/id")),
    },
    {
      id: "productVariant_code",
      width: "12ch",
      header: utils.cellHeader(t("/catalog/product/productVariant"), t("/@word/code")),
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "productVariant_description",
      width: "20ch",
      header: utils.cellHeader(t("/catalog/product/productVariant"), t("/@word/description")),
    },

    // Taxation & Purchase
    {
      id: "taxationOperation_id",
      width: "8ch",
      header: utils.cellHeader(t("/fiscal/taxation/taxationOperation"), t("/@word/id")),
    },
    {
      id: "taxationOperation_code",
      width: "12ch",
      header: utils.cellHeader(t("/fiscal/taxation/taxationOperation"), t("/@word/code")),
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "taxationOperation_description",
      width: "20ch",
      header: utils.cellHeader(t("/fiscal/taxation/taxationOperation"), t("/@word/description")),
    },
    {
      id: "purchase_id",
      width: "8ch",
      header: utils.cellHeader(t("/supply/purchase/purchase"), t("/@word/id")),
    },
    {
      id: "purchase_code",
      width: "12ch",
      header: utils.cellHeader(t("/supply/purchase/purchase"), t("/@word/code")),
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "purchaseItem_id",
      width: "8ch",
      header: utils.cellHeader(t("/supply/purchase/purchaseItem"), t("/@word/id")),
    },

    // Unit Values & Quantities
    {
      id: "unit_id",
      width: "8ch",
      header: utils.cellHeader(t("/catalog/product/dimension.unit"), t("/@word/id")),
    },
    {
      id: "unit_code",
      width: "8ch",
      header: utils.cellHeader(t("/catalog/product/dimension.unit"), t("/@word/code")),
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
      id: "sum_rawQuantity",
      className: "number",
      width: "12ch",
      header: utils.cellHeader(t("/@word/rawQuantity")),
      cellValue: ({ row }) => row.sum_quantity,
      cell: ({ value }) => utils.formatQuantity(value),
      footerValue: ({ data }) => utils.sum(data, (item) => item.sum_quantity),
      footer: ({ value }) => utils.formatQuantity(value),
    },
    {
      id: "sum_quantityUnits",
      className: "number",
      width: "12ch",
      header: utils.cellHeader(t("/@word/quantityUnits")),
      cell: ({ row, value }) => utils.formatQuantity(value, { unit_code: row.product_unit_code }),
      footerValue: ({ data }) =>
        utils.sumBy(
          data,
          (item) => item.product_unit_code,
          (item) => item.sum_quantityUnits,
        ),
      footer: ({ value }) =>
        utils.renderAggr(value, (quantity, unit_code) =>
          utils.formatQuantity(quantity, { unit_code }),
        ),
    },
    {
      id: "sum_servedQuantity",
      className: "number",
      width: "12ch",
      header: utils.cellHeader(t("/@word/servedQuantity")),
      cell: ({ row, value }) => utils.formatQuantity(value, { unit_code: row.unit_code }),
    },

    // Monetary Totals & Calculations
    {
      id: "sum_grossProductValue",
      className: "number",
      width: "15ch",
      header: utils.cellHeader(t("/@word/grossProductValue")),
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
      className: "number",
      width: "12ch",
      header: utils.cellHeader(t("/@word/discountValue")),
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
      className: "number",
      width: "15ch",
      header: utils.cellHeader(t("/@word/productValue")),
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
      className: "number",
      width: "12ch",
      header: utils.cellHeader(t("/@word/freightValue")),
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
      className: "number",
      width: "12ch",
      header: utils.cellHeader(t("/@word/insuranceValue")),
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
      className: "number",
      width: "12ch",
      header: utils.cellHeader(t("/@word/otherValue")),
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
      className: "number",
      width: "15ch",
      header: utils.cellHeader(t("/@word/operationValue")),
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
      className: "number",
      width: "12ch",
      header: utils.cellHeader(t("/@word/insideTaxValue")),
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
      className: "number",
      width: "12ch",
      header: utils.cellHeader(t("/@word/outsideTaxValue")),
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
      className: "number",
      width: "15ch",
      header: utils.cellHeader(t("/@word/totalValue")),
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
      className: "number",
      width: "15ch",
      header: utils.cellHeader(t("/@word/effectiveValue")),
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
      className: "number",
      width: "12ch",
      header: utils.cellHeader(t("/@word/netWeightKg")),
      cell: ({ value }) => utils.formatNumber(value, { minimumFractionDigits: 3 }),
      footerValue: ({ data }) => utils.sum(data, (item) => item.sum_netWeightKg),
      footer: ({ value }) => utils.formatNumber(value, { minimumFractionDigits: 3 }),
    },
    {
      id: "sum_grossWeightKg",
      className: "number",
      width: "12ch",
      header: utils.cellHeader(t("/@word/grossWeightKg")),
      cell: ({ value }) => utils.formatNumber(value, { minimumFractionDigits: 3 }),
      footerValue: ({ data }) => utils.sum(data, (item) => item.sum_grossWeightKg),
      footer: ({ value }) => utils.formatNumber(value, { minimumFractionDigits: 3 }),
    },
    {
      id: "sum_volumeM3",
      className: "number",
      width: "12ch",
      header: utils.cellHeader(t("/@word/volumeM3")),
      cell: ({ value }) => utils.formatNumber(value, { minimumFractionDigits: 4 }),
      footerValue: ({ data }) => utils.sum(data, (item) => item.sum_volumeM3),
      footer: ({ value }) => utils.formatNumber(value, { minimumFractionDigits: 4 }),
    },
    {
      id: "sum_contributionMargin",
      className: "number",
      width: "15ch",
      header: utils.cellHeader(t("/@word/contributionMarginValue")),
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
      className: "number",
      width: "15ch",
      header: utils.cellHeader(t("/@word/contributionMargin")),
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
      className: "number",
      width: "15ch",
      header: utils.cellHeader(t("/@word/markup")),
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
      className: "number",
      width: "15ch",
      header: utils.cellHeader(t("/@word/salesCommissionValue")),
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
      className: "number",
      width: "10ch",
      header: utils.cellHeader(t("/sale/sale/plural"), t("/@word/count")),
      cell: ({ value }) => utils.formatNumber(value),
    },
    {
      id: "count_saleItem",
      className: "number",
      width: "10ch",
      header: utils.cellHeader(t("/sale/saleItem/plural"), t("/@word/count")),
      cell: ({ value }) => utils.formatNumber(value),
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
