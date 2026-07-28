import * as utils from "./utils.jsx";
import { Badge, Fields, Table } from "./utils.jsx";

export default function ({ data = [], meta = {}, t }) {
  const { report = {} } = meta;

  const settings =
    utils.deepMerge(report?.properties?.["#settings"], report?.properties?.userSettings) ?? {};

  const visibleFields = settings?.fields ?? [];

  const fields = [
    {
      id: "company_code",
      group: "company",
      label: utils.cellHeader(t("/catalog/company/company"), t("/@word/code")),
      value: (row) => row.company.code,
    },
    {
      id: "company_name",
      group: "company",
      flex: 2,
      label: utils.cellHeader(t("/catalog/company/company"), t("/@word/name")),
      value: (row) => row.company.person.name,
    },
    {
      id: "company_nameCalc",
      group: "company",
      flex: 2,
      label: utils.cellHeader(t("/catalog/company/company"), t("/@word/name")),
      value: (row) => row.company.person.fantasyName ?? row.company.person.name,
    },
    {
      id: "company_documentNumber",
      group: "company",
      label: (row) =>
        utils.cellHeader(
          t("/catalog/company/company"),
          t("/catalog/person/personDocumentType/enum/" + row.company.person.documentType),
        ),
      value: (row) => row.company.person.documentNumber,
    },
    {
      id: "company_document2Number",
      group: "company",
      label: (row) =>
        utils.cellHeader(
          t("/catalog/company/company"),
          t("/catalog/person/personDocumentType/enum/" + row.company.person.document2Type),
        ),
      value: (row) => row.company.person.document2Number,
    },
    {
      id: "company_address",
      group: "company",
      flex: 4,
      label: utils.cellHeader(t("/catalog/company/company"), t("/@word/address")),
      value: (row) =>
        [
          row.company.person.street,
          row.company.person.number,
          row.company.person.complement,
          row.company.person.district,
          row.company.person.city?.name,
          row.company.person.city?.state?.code,
          row.company.person.zipcode,
        ]
          .filter(Boolean)
          .join(", "),
    },
    {
      id: "company_email",
      group: "company",
      flex: 2,
      label: utils.cellHeader(t("/catalog/company/company"), t("/@word/email")),
      value: (row) => row.company.person.email,
    },
    {
      id: "company_phone",
      group: "company",
      label: utils.cellHeader(t("/catalog/company/company"), t("/@word/phone")),
      value: (row) => row.company.person.phone,
    },
    {
      id: "person_name",
      group: "person",
      flex: 2,
      label: utils.cellHeader(t("/@word/customer"), t("/@word/name")),
      value: (row) => row.person.name,
    },
    {
      id: "person_documentNumber",
      group: "person",
      label: (row) =>
        utils.cellHeader(
          t("/@word/customer"),
          t("/catalog/person/personDocumentType/enum/" + row.person.documentType),
        ),
      value: (row) => row.person.documentNumber,
    },
    {
      id: "person_document2Number",
      group: "person",
      label: (row) =>
        utils.cellHeader(
          t("/@word/customer"),
          t("/catalog/person/personDocumentType/enum/" + row.person.document2Type),
        ),
      value: (row) => row.person.document2Number,
    },
    {
      id: "person_address",
      group: "person_address",
      flex: 4,
      label: utils.cellHeader(t("/@word/customer"), t("/@word/address")),
      value: (row) =>
        [
          row.person.street,
          row.person.number,
          row.person.complement,
          row.person.district,
          row.person.city?.name,
          row.person.city?.state?.code,
          row.person.zipcode,
        ]
          .filter(Boolean)
          .join(", "),
    },
    {
      id: "person_email",
      group: "person",
      flex: 2,
      label: utils.cellHeader(t("/@word/customer"), t("/@word/email")),
      value: (row) => row.person.email,
    },
    {
      id: "person_phone",
      group: "person",
      label: utils.cellHeader(t("/@word/customer"), t("/@word/phone")),
      value: (row) => row.person.phone,
    },
    {
      id: "saleProfile_code",
      group: "sale",
      label: t("/sale/saleProfile"),
      value: (row) => row.saleProfile.code,
    },
    {
      id: "code",
      group: "sale",
      label: t("/@word/code"),
      value: (row) => row.code,
    },
    {
      id: "date",
      group: "sale",
      label: t("/@word/date"),
      value: (row) => utils.formatDate(row.date),
    },
    {
      id: "dateTime",
      group: "sale",
      label: t("/@word/dateTime"),
      value: (row) => utils.formatDateTime(row.date),
    },
    {
      id: "time",
      group: "sale",
      label: t("/@word/time"),
      value: (row) => utils.formatTime(row.date),
    },
    {
      id: "availabilityDate",
      group: "sale",
      label: t("/@word/availabilityDate"),
      value: (row) => utils.formatDate(row.availabilityDate),
    },
    {
      id: "status",
      group: "sale",
      label: t("/@word/status"),
      value: (row) => row.status,
    },
    {
      id: "tags",
      group: "sale",
      label: t("/@word/tags"),
      value: (row) => row.tags,
    },
    {
      id: "personShipping_name",
      group: "shipping",
      flex: 2,
      label: utils.cellHeader(t("/@word/personShipping"), t("/@word/name")),
      value: (row) => row.personShipping?.name,
    },
    {
      id: "personShipping_documentNumber",
      group: "shipping",
      label: utils.cellHeader(t("/@word/personShipping"), t("/@word/documentNumber")),
      value: (row) => row.personShipping?.documentNumber,
    },
    {
      id: "freightType",
      group: "shipping",
      label: t("/@word/freightType"),
      value: (row) => t("/commercial/freightType/enum/" + row.freightType),
    },
    {
      id: "personShippingTransshipment_name",
      group: "shipping",
      flex: 2,
      label: utils.cellHeader(t("/@word/personShippingTransshipment"), t("/@word/name")),
      value: (row) => row.personShippingTransshipment?.name,
    },
    {
      id: "personShippingTransshipment_documentNumber",
      group: "shipping",
      label: utils.cellHeader(t("/@word/personShippingTransshipment"), t("/@word/documentNumber")),
      value: (row) => row.personShippingTransshipment?.documentNumber,
    },
    {
      id: "freightTypeTransshipment",
      group: "shipping",
      label: utils.cellHeader(t("/@word/personShippingTransshipment"), t("/@word/freightType")),
      value: (row) =>
        row.properties?.freightTypeTransshipment
          ? t("/commercial/freightType/enum/" + row.properties?.freightTypeTransshipment)
          : undefined,
    },
    {
      id: "personSalesperson_name",
      group: "sale",
      flex: 2,
      label: utils.cellHeader(t("/@word/personSalesperson"), t("/@word/name")),
      value: (row) => row.personSalesperson?.name,
    },
    {
      id: "salesChannel",
      group: "sale",
      label: t("/@word/salesChannel"),
      value: (row) => row.properties?.salesChannel,
    },
    {
      id: "salesCommission",
      group: "sale",
      label: t("/@word/salesCommission"),
      value: (row) => row.properties?.salesCommission,
    },
    {
      id: "salesHub",
      group: "sale",
      label: t("/@word/salesHub"),
      value: (row) => row.properties?.salesHub,
    },
    {
      id: "paymentMethods",
      group: "sale",
      label: t("/@word/paymentMethods"),
      value: (row) => row.properties?.paymentMethods,
    },
    {
      id: "comments",
      group: "comments",
      label: t("/@word/comments"),
      value: (row) => row.properties?.comments,
      as: "pre",
    },
    {
      id: "report_printedAt",
      group: "sale",
      label: t("/@word/report/printedAt"),
      value: () => utils.formatDateTime(new Date()),
    },
  ];

  // return JSON.stringify(
  //   fields.map((field) => field.id),
  //   null,
  //   2,
  // );

  const fieldGroups = [
    {
      id: "sale",
      label: t("/sale/sale"),
    },
    {
      id: "company",
      label: t("/catalog/company/company"),
    },
    {
      id: "person",
      label: t("/@word/customer"),
    },
    {
      id: "shipping",
      label: t("/@word/personShipping"),
    },
    {
      id: "comments",
      label: t("/@word/comments"),
    },
  ];

  const visibleColumns = settings?.columns ?? [];

  const groups = settings?.groups || [];

  // When currency_code is visible, currency columns will be formatted as numbers (no currency symbol)
  const formatCurrency = (value, options) => {
    return visibleColumns.includes("currency_code")
      ? utils.formatNumber(value, options)
      : utils.formatCurrency(value, options);
  };

  const columns = [
    {
      id: "product_image",
      header: utils.cellHeader(t("/catalog/product/product"), t("/system/image")),
      width: "7ch",
      cellValue: ({ row }) => row.productPacking.product.image?.url,
      cell: ({ value }) => (value ? <img src={value}></img> : null),
    },
    {
      id: "productPacking_image",
      header: utils.cellHeader(t("/catalog/product/productPacking"), t("/system/image")),
      width: "7ch",
      cellValue: ({ row }) => row.productPacking.image?.url,
      cell: ({ value }) => (value ? <img src={value}></img> : null),
    },
    {
      id: "productPacking_image_calc",
      header: utils.cellHeader(t("/catalog/product/productPacking"), t("/system/image")),
      width: "7ch",
      cellValue: ({ row }) =>
        row.productPacking.image?.url ?? row.productPacking.product.image?.url,
      cell: ({ value }) => (value ? <img src={value}></img> : null),
    },
    {
      id: "productPacking_code",
      header: utils.cellHeader(t("/catalog/product/productPacking"), t("/@word/code")),
      width: "12ch",
      cellValue: ({ row }) => row.productPacking.code,
    },
    {
      id: "product_description",
      header: utils.cellHeader(t("/catalog/product/product"), t("/@word/description")),
      width: "30ch",
      cellValue: ({ row }) => row.productPacking.product.description,
    },
    {
      id: "productPacking_complement",
      header: utils.cellHeader(t("/catalog/product/productPacking"), t("/@word/complement")),
      width: "15ch",
      cellValue: ({ row }) => row.productPacking.complement,
    },
    {
      id: "productVariant_code",
      header: utils.cellHeader(t("/catalog/product/productVariant"), t("/@word/code")),
      width: "10ch",
      cellValue: ({ row }) => row.productPacking.variant?.code,
    },
    {
      id: "productVariant_description",
      header: utils.cellHeader(t("/catalog/product/productVariant"), t("/@word/description")),
      width: "15ch",
      cellValue: ({ row }) => row.productPacking.variant?.description,
    },
    {
      id: "taxationOperation_code",
      header: utils.cellHeader(t("/fiscal/taxation/taxationOperation"), t("/@word/code")),
      width: "7ch",
      cellValue: ({ row }) => row.taxationOperation?.code,
    },
    {
      id: "quantity",
      header: utils.cellHeader(t("/@word/quantity")),
      width: "10ch",
      className: "number",
      cell: ({ row, value }) =>
        utils.formatQuantity(value, {
          unit_code: row.productPacking.unit?.code ?? row.productPacking.product.unit.code,
        }),
      footerValue: ({ data }) =>
        utils.sumBy(
          data,
          (row) => row.productPacking.unit?.code ?? row.productPacking.product.unit.code,
          (row) => row.quantity,
        ),
      footer: ({ value }) =>
        utils.renderAggr(value, (val, key) => utils.formatQuantity(val, { unit_code: key })),
    },
    {
      id: "unit_code",
      width: "5ch",
      cellValue: ({ row }) => (
        <Badge>{row.productPacking.unit?.code ?? row.productPacking.product.unit.code}</Badge>
      ),
    },
    {
      id: "unitValue",
      header: utils.cellHeader(t("/@word/unitValue")),
      width: "10ch",
      className: "number",
      cell: ({ row, value }) =>
        formatCurrency(value, {
          currency: row.currency?.code ?? row.sale.currency.code,
          maximumFractionDigits: 8,
        }),
    },
    {
      id: "grossProductValue",
      header: utils.cellHeader(t("/@word/grossProductValue")),
      width: "10ch",
      className: "number",
      cell: ({ row, value }) =>
        formatCurrency(value, {
          currency: row.currency?.code ?? row.sale.currency.code,
          digits: 2,
        }),
      footerValue: ({ data }) =>
        utils.sumBy(
          data,
          (row) => row.currency?.code ?? row.sale.currency.code,
          (row) => row.grossProductValue,
        ),
      footer: ({ value }) =>
        utils.renderAggr(value, (val, key) => utils.formatCurrency(val, { currency: key })),
    },
    {
      id: "totalValue",
      header: utils.cellHeader(t("/@word/totalValue")),
      width: "12ch",
      className: "number",
      cell: ({ row, value }) =>
        formatCurrency(value, {
          currency: row.currency?.code ?? row.sale.currency.code,
          digits: 2,
        }),
      footerValue: ({ data }) =>
        utils.sumBy(
          data,
          (row) => row.currency?.code ?? row.sale.currency.code,
          (row) => row.totalValue,
        ),
      footer: ({ value }) =>
        utils.renderAggr(value, (val, key) => utils.formatCurrency(val, { currency: key })),
    },
    {
      id: "netWeightKg",
      header: utils.cellHeader(t("/@word/netWeightKg")),
      width: "10ch",
      className: "number",
      cell: ({ value }) => utils.formatNumber(value, { digits: 1 }),
      footerValue: ({ data }) => data.reduce((sum, row) => sum + (row.netWeightKg || 0), 0),
      footer: ({ value }) => utils.formatNumber(value, { digits: 1 }),
    },
    {
      id: "grossWeightKg",
      header: utils.cellHeader(t("/@word/grossWeightKg")),
      width: "10ch",
      className: "number",
      cell: ({ value }) => utils.formatNumber(value, { digits: 1 }),
      footerValue: ({ data }) => data.reduce((sum, row) => sum + (row.grossWeightKg || 0), 0),
      footer: ({ value }) => utils.formatNumber(value, { digits: 1 }),
    },
    {
      id: "address_code",
      header: utils.cellHeader(t("/material/address"), t("/@word/code")),
      width: "10ch",
      cellValue: ({ row }) => row?.address?.code,
    },
    {
      id: "salesCommission",
      className: "number",
      header: utils.cellHeader(t("/@word/salesCommission")),
      cellValue: ({ row }) => row.properties?.salesCommission,
      cell: ({ value }) => utils.formatNumber(value),
    },
    ...[
      "CBS",
      "COFINS",
      "IBS_MUN",
      "IBS_UF",
      "ICMS",
      "ICMS_SN",
      "ICMS_ST",
      "IPI",
      "IPI",
      "IS",
      "ISS",
      "PIS",
    ].flatMap((tax) => [
      {
        id: `tax_${tax}_baseValue`,
        header: utils.cellHeader(tax, t("/@word/baseValue")),
        width: "10ch",
        className: "number",
        cellValue: ({ row }) =>
          row.taxations?.find((taxation) => taxation.tax.code === tax)?.baseValue || 0,
        cell: ({ row, value }) =>
          formatCurrency(value, {
            currency: row.currency?.code ?? row.sale.currency.code,
            digits: 2,
          }),
        footerValue: ({ data }) =>
          utils.sumBy(
            data,
            (row) => row.currency?.code ?? row.sale.currency.code,
            (row) => row.taxations?.find((taxation) => taxation.tax.code === tax)?.baseValue,
          ),
        footer: ({ value }) =>
          utils.renderAggr(value, (val, key) => utils.formatCurrency(val, { currency: key })),
      },
      {
        id: `tax_${tax}_taxRate`,
        header: utils.cellHeader(tax, t("/fiscal/taxation/taxation.taxRate/abbr")),
        width: "7ch",
        className: "number",
        cellValue: ({ row }) =>
          row.taxations?.find((taxation) => taxation.tax.code === tax)?.taxRate || 0,
        cell: ({ value }) => utils.formatNumber(value),
      },
      {
        id: `tax_${tax}_taxValue`,
        header: utils.cellHeader(tax, t("/fiscal/taxation/taxation.taxValue")),
        width: "10ch",
        className: "number",
        cellValue: ({ row }) =>
          row.taxations?.find((taxation) => taxation.tax.code === tax)?.taxValue || 0,
        cell: ({ row, value }) =>
          formatCurrency(value, {
            currency: row.currency?.code ?? row.sale.currency.code,
            digits: 2,
          }),
        footerValue: ({ data }) =>
          utils.sumBy(
            data,
            (row) => row.currency?.code ?? row.sale.currency.code,
            (row) => row.taxations?.find((taxation) => taxation.tax.code === tax)?.taxValue,
          ),
        footer: ({ value }) =>
          utils.renderAggr(value, (val, key) => utils.formatCurrency(val, { currency: key })),
      },
      {
        id: "currency_code",
        header: utils.cellHeader(t("/financial/currency")),
        width: "7ch",
        cellValue: ({ row }) => <Badge>{row.currency?.code ?? row.sale.currency.code}</Badge>,
      },
    ]),
  ];

  // return JSON.stringify(
  //   columns.map((field) => field.id),
  //   null,
  //   2,
  // );

  data.forEach((row) => {
    row.items.forEach((item) => {
      item.netWeightKg = utils.round(
        item.quantity *
          (item.productPacking.netWeightKg || item.productPacking.product.netWeightKg || 0),
        3,
      );
      item.grossWeightKg = utils.round(
        item.quantity *
          (item.productPacking.grossWeightKg || item.productPacking.product.grossWeightKg || 0),
        3,
      );
      item.properties.salesCommission =
        item.properties?.salesCommission ?? row.properties?.salesCommission;
    });

    utils.sort(row.items, settings?.sort || []);
  });

  data = utils.sort(data, settings?.sort || []);

  return (
    <div className="report-wrapper" style={{ fontSize: settings?.fontSize }}>
      {data.map((data) => (
        <div
          className={`report-container ${settings?.pageSize ?? "a4"} ${settings?.orientation}`}
          style={{
            "--width": settings?.width,
            "--height": settings?.height,
            "--margin": settings?.margin,
          }}
          key={data.id}
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
            <Fields
              fields={fields}
              visibleFields={visibleFields}
              data={data}
              groups={fieldGroups}
            />
          </header>
          <main>
            <div className="content">
              <Table
                columns={columns}
                visibleColumns={visibleColumns}
                data={data.items}
                groups={groups}
                footerTitle={t("/@word/summary")}
              />
            </div>
          </main>
        </div>
      ))}
    </div>
  );
}
