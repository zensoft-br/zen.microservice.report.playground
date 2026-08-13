import * as utils from "./utils.jsx";
import { Badge, Fields, Table } from "./utils.jsx";

export default function ({ data = [], meta = {}, t }) {
  const { report = {} } = meta;

  const settings =
    utils.deepMerge(report?.properties?.["#settings"], report?.properties?.userSettings) ?? {};

  const visibleFields = settings?.fields ?? [];

  const fields = [
    {
      id: "date",
      group: "pickingOrder",
      label: utils.cellHeader(t("/@word/date")),
      value: (row) => utils.formatDate(row.date),
    },
    {
      id: "status",
      group: "pickingOrder",
      label: utils.cellHeader(t("/@word/status")),
      value: (row) => <Badge>{t("/material/pickingOrderStatus/enum/" + row.status)}</Badge>,
    },
    {
      id: "tags",
      group: "pickingOrder",
      flex: 2,
      label: utils.cellHeader(t("/@word/tags")),
      value: (row) =>
        row.tags ? row.tags.split(",").map((tag) => <Badge key={tag}>{tag}</Badge>) : null,
    },
    {
      id: "reservation_id",
      group: "pickingOrder",
      label: utils.cellHeader(t("/material/reservation"), t("/@word/id")),
      value: (row) => row.reservation.id,
    },
    {
      id: "company_code",
      group: "company",
      label: utils.cellHeader(t("/catalog/company/company"), t("/@word/code")),
      value: (row) => row.company?.code,
    },
    {
      id: "company_name",
      group: "company",
      flex: 2,
      label: utils.cellHeader(t("/catalog/company/company"), t("/@word/name")),
      value: (row) => row.company?.person.name,
    },
    {
      id: "company_fantasyName",
      group: "company",
      flex: 2,
      label: utils.cellHeader(t("/catalog/company/company"), t("/@word/fantasyName")),
      value: (row) => row.company?.person.fantasyName,
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
      id: "sale_code",
      group: "sale",
      label: utils.cellHeader(t("/sale/sale"), t("/@word/code")),
      value: (row) => row.sale.code,
    },
    {
      id: "sale_code_calc",
      group: "sale",
      label: utils.cellHeader(t("/sale/sale"), t("/@word/code")),
      value: (row) => row?.sale?.code ?? row?.sale?.id,
    },
    {
      id: "sale_date",
      group: "sale",
      label: utils.cellHeader(t("/sale/sale"), t("/@word/date")),
      value: (row) => utils.formatDate(row.sale.date),
    },
    {
      id: "sale_dateTime",
      group: "sale",
      label: utils.cellHeader(t("/sale/sale"), t("/@word/dateTime")),
      value: (row) => utils.formatDateTime(row.sale.date),
    },
    {
      id: "sale_time",
      group: "sale",
      label: utils.cellHeader(t("/sale/sale"), t("/@word/time")),
      value: (row) => utils.formatTime(row.sale.date),
    },
    {
      id: "sale_availabilityDate",
      group: "sale",
      label: utils.cellHeader(t("/sale/sale"), t("/@word/availabilityDate")),
      value: (row) => utils.formatDate(row.sale.availabilityDate),
    },
    {
      id: "sale_status",
      group: "sale",
      label: utils.cellHeader(t("/sale/sale"), t("/@word/status")),
      value: (row) => <Badge>{t("/sale/saleStatus/enum/" + row.sale.status)}</Badge>,
    },
    {
      id: "sale_tags",
      group: "sale",
      flex: 2,
      label: utils.cellHeader(t("/sale/sale"), t("/@word/tags")),
      value: (row) =>
        row.sale.tags
          ? row.sale.tags.split(",").map((tag) => <Badge key={tag}>{tag}</Badge>)
          : null,
    },
    {
      id: "sale_saleProfile_code",
      group: "sale",
      label: utils.cellHeader(t("/sale/sale"), t("/sale/saleProfile"), t("/@word/code")),
      value: (row) => row.sale?.saleProfile.code,
    },
    {
      id: "sale_personSalesperson_name",
      group: "sale",
      flex: 2,
      label: utils.cellHeader(t("/sale/sale"), t("/@word/personSalesperson"), t("/@word/name")),
      value: (row) => row.sale?.personSalesperson?.name,
    },
    {
      id: "sale_personSalesperson_fantasyName",
      group: "sale",
      flex: 2,
      label: utils.cellHeader(
        t("/sale/sale"),
        t("/@word/personSalesperson"),
        t("/@word/fantasyName"),
      ),
      value: (row) => row.sale?.personSalesperson?.fantasyName,
    },
    {
      id: "sale_personSalesperson_nameCalc",
      group: "sale",
      flex: 2,
      label: utils.cellHeader(t("/sale/sale"), t("/@word/personSalesperson"), t("/@word/name")),
      value: (row) => row.sale?.personSalesperson?.fantasyName ?? row.sale?.personSalesperson?.name,
    },
    {
      id: "sale_paymentMethods",
      group: "sale",
      label: utils.cellHeader(t("/@word/paymentMethods")),
      value: (row) => row.sale?.properties?.paymentMethods,
    },
    {
      id: "person_name",
      group: "person",
      flex: 2,
      label: utils.cellHeader(t("/catalog/person/person"), t("/@word/name")),
      value: (row) => row.person.name,
    },
    {
      id: "person_nameCalc",
      group: "person",
      flex: 2,
      label: utils.cellHeader(t("/catalog/person/person"), t("/@word/name")),
      value: (row) => row.person?.fantasyName ?? row.person?.name,
    },
    {
      id: "person_fantasyName",
      group: "person",
      flex: 2,
      label: utils.cellHeader(t("/catalog/person/person"), t("/@word/fantasyName")),
      value: (row) => row.person.fantasyName,
    },
    {
      id: "person_documentNumber",
      group: "person",
      label: (row) =>
        utils.cellHeader(
          t("/catalog/person/person"),
          t("/catalog/person/personDocumentType/enum/" + row.person.documentType),
        ),
      value: (row) => row.person.documentNumber,
    },
    {
      id: "person_document2Number",
      group: "person",
      label: (row) =>
        utils.cellHeader(
          t("/catalog/person/person"),
          t("/catalog/person/personDocumentType/enum/" + row.person.document2Type),
        ),
      value: (row) => row.person.document2Number,
    },
    {
      id: "person_address_calc",
      group: "person",
      flex: 4,
      label: utils.cellHeader(t("/catalog/person/person"), t("/@word/address")),
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
      label: utils.cellHeader(t("/catalog/person/person"), t("/@word/email")),
      value: (row) => row.person.email,
    },
    {
      id: "person_phone",
      group: "person",
      label: utils.cellHeader(t("/catalog/person/person"), t("/@word/phone")),
      value: (row) => row.person.phone,
    },
    {
      id: "person_street",
      group: "person",
      label: utils.cellHeader(t("/catalog/person/person"), t("/@word/street")),
      value: (row) => row.person.street,
    },
    {
      id: "person_number",
      group: "person",
      label: utils.cellHeader(t("/catalog/person/person"), t("/@word/number")),
      value: (row) => row.person.number,
    },
    {
      id: "person_complement",
      group: "person",
      label: utils.cellHeader(t("/catalog/person/person"), t("/@word/complement")),
      value: (row) => row.person.complement,
    },
    {
      id: "person_district",
      group: "person",
      label: utils.cellHeader(t("/catalog/person/person"), t("/@word/district")),
      value: (row) => row.person.district,
    },
    {
      id: "person_city_name",
      group: "person",
      label: utils.cellHeader(t("/catalog/person/person"), t("/@word/name")),
      value: (row) => row.person.city?.name,
    },
    {
      id: "person_state_code",
      group: "person",
      label: utils.cellHeader(t("/catalog/person/person"), t("/@word/code")),
      value: (row) => row.person.city?.state?.code,
    },
    {
      id: "person_zipcode",
      group: "person",
      label: utils.cellHeader(t("/catalog/person/person"), t("/@word/zipcode")),
      value: (row) => row.person.zipcode,
    },
    {
      id: "sale_addressShippingCalc",
      group: "shipping",
      flex: 4,
      label: utils.cellHeader(t("/@word/addressShipping")),
      value: (row) =>
        [
          row.sale?.personAddressShipping?.street,
          row.sale?.personAddressShipping?.number,
          row.sale?.personAddressShipping?.complement,
          row.sale?.personAddressShipping?.city?.name,
          row.sale?.personAddressShipping?.city?.state?.code,
          row.sale?.personAddressShipping?.city?.state?.country?.codeA2,
          row.sale?.personAddressShipping?.zipcode,
        ]
          .filter(Boolean)
          .join(", "),
    },
    {
      id: "sale_personShipping_name",
      group: "shipping",
      flex: 2,
      label: utils.cellHeader(t("/@word/personShipping"), t("/@word/name")),
      value: (row) => row.sale?.personShipping?.name,
    },
    {
      id: "sale_personShipping_fantasyName",
      group: "shipping",
      flex: 2,
      label: utils.cellHeader(t("/@word/personShipping"), t("/@word/fantasyName")),
      value: (row) => row.sale?.personShipping?.fantasyName,
    },
    {
      id: "sale_personShipping_nameCalc",
      group: "shipping",
      flex: 3,
      label: utils.cellHeader(t("/@word/personShipping"), t("/@word/name")),
      value: (row) =>
        [row.sale?.personShipping?.fantasyName, row.sale?.personShipping?.documentNumber]
          .filter(Boolean)
          .join(", ") ??
        [row.sale?.personShipping?.name, row.sale?.personShipping?.documentNumber]
          .filter(Boolean)
          .join(", "),
    },
    {
      id: "sale_personShipping_documentNumber",
      group: "shipping",
      label: utils.cellHeader(t("/@word/personShipping"), t("/@word/documentNumber")),
      value: (row) => row.sale?.personShipping?.documentNumber,
    },
    {
      id: "sale_personShipping_phone",
      group: "shipping",
      label: utils.cellHeader(t("/@word/personShipping"), t("/@word/phone")),
      value: (row) => row.sale?.personShipping?.phone,
    },
    {
      id: "sale_freightType",
      group: "shipping",
      label: utils.cellHeader(t("/@word/freightType")),
      value: (row) =>
        row.sale.freightType
          ? t("/commercial/freightType/enum/" + row.sale.freightType)
          : undefined,
    },
    {
      id: "sale_personShippingTransshipment_name",
      group: "shipping",
      flex: 2,
      label: utils.cellHeader(t("/@word/personShippingTransshipment"), t("/@word/name")),
      value: (row) => row.sale.personShippingTransshipment?.name,
    },
    {
      id: "sale_personShippingTransshipment_fantasyName",
      group: "shipping",
      flex: 2,
      label: utils.cellHeader(t("/@word/personShippingTransshipment"), t("/@word/fantasyName")),
      value: (row) => row.sale.personShippingTransshipment?.fantasyName,
    },
    {
      id: "sale_personShippingTransshipment_nameCalc",
      group: "shipping",
      flex: 2,
      label: utils.cellHeader(t("/@word/personShippingTransshipment"), t("/@word/name")),
      value: (row) =>
        [
          row.sale?.personShippingTransshipment?.fantasyName,
          row.sale?.personShippingTransshipment?.documentNumber,
        ]
          .filter(Boolean)
          .join(", ") ??
        [
          row.sale?.personShippingTransshipment?.name,
          row.sale?.personShippingTransshipment?.documentNumber,
        ]
          .filter(Boolean)
          .join(", "),
    },
    {
      id: "sale_personShippingTransshipment_documentNumber",
      group: "shipping",
      label: utils.cellHeader(t("/@word/personShippingTransshipment"), t("/@word/documentNumber")),
      value: (row) => row.sale.personShippingTransshipment?.documentNumber,
    },
    {
      id: "sale_personShippingTransshipment_phone",
      group: "shipping",
      label: utils.cellHeader(t("/@word/personShippingTransshipment"), t("/@word/phone")),
      value: (row) => row.sale.personShippingTransshipment?.phone,
    },
    {
      id: "sale_freightTypeTransshipment",
      group: "shipping",
      label: utils.cellHeader(t("/@word/personShippingTransshipment"), t("/@word/freightType")),
      value: (row) =>
        row.sale.properties?.freightTypeTransshipment
          ? t("/commercial/freightType/enum/" + row.sale.properties?.freightTypeTransshipment)
          : undefined,
    },
    {
      id: "comments",
      group: "comments",
      label: utils.cellHeader(t("/@word/comments")),
      value: (row) => {
        [row.properties?.comments, row.sale?.person.properties?.outgoingInvoiceComments]
          .filter(Boolean)
          .join("\n");
      },
      as: "pre",
    },
    {
      id: "sale_comments",
      group: "comments",
      label: utils.cellHeader(t("/sale/sale"), t("/@word/comments")),
      value: (row) => row?.sale?.properties?.comments,
      as: "pre",
    },
  ];

  const fieldGroups = [
    {
      id: "company",
      label: t("/catalog/company/company"),
    },
    {
      id: "person",
      label: t("/catalog/person/person"),
    },
    {
      id: "pickingOrder",
      label: t("/material/pickingOrder"),
    },
    {
      id: "sale",
      label: t("/sale/sale"),
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

  const visibleColumns = (settings?.columns ?? []).filter(
    (item) => !(settings?.removeColumns ?? []).includes(item),
  );

  const groups = settings?.groups || [];

  const columns = [
    { id: "check", width: "3ch", cellValue: () => <span style={{ fontSize: "1.3em" }}>☐</span> },
    {
      id: "id",
      header: utils.cellHeader(t("/@word/id")),
      width: "7ch",
      className: "id",
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({ data }) => data.length,
      footer: ({ value }) => utils.formatNumber(value),
    },
    {
      id: "productPacking_image",
      header: utils.cellHeader(t("/catalog/product/productPacking"), t("/system/image")),
      width: "10ch",
      cellValue: ({ row }) => row.productPacking.image?.url,
      cell: ({ value }) => (
        <img src={value} style={{ width: "1.25cm", height: "1.25cm", objectFit: "contain" }}></img>
      ),
    },
    {
      id: "productPacking_code",
      header: utils.cellHeader(t("/catalog/product/productPacking"), t("/@word/code")),
      width: "15ch",
      cellValue: ({ row }) => row.productPacking.code,
    },
    {
      id: "product_description",
      header: utils.cellHeader(t("/catalog/product/product"), t("/@word/description")),
      width: "30ch",
      cellValue: ({ row }) => row.productPacking.product?.description,
    },
    {
      id: "productPacking_complement",
      header: utils.cellHeader(t("/catalog/product/productPacking"), t("/@word/complement")),
      width: "10ch",
      cellValue: ({ row }) => row.productPacking.complement,
    },
    {
      id: "productPacking_descriptionCalc",
      header: utils.cellHeader(t("/catalog/product/productPacking"), t("/@word/description")),
      width: "30ch",
      cellValue: ({ row }) =>
        [
          row.productPacking.product.description,
          row.productPacking.complement,
          row.productPacking.variant?.description,
        ]
          .filter(Boolean)
          .join(", "),
    },
    {
      id: "productVariant_description",
      header: utils.cellHeader(t("/catalog/product/productVariant"), t("/@word/description")),
      width: "15ch",
      cellValue: ({ row }) => row.productPacking.variant?.description,
    },
    {
      id: "address_code",
      header: utils.cellHeader(t("/material/address"), t("/@word/code")),
      width: "10ch",
      cellValue: ({ row }) => row.address?.code,
    },
    {
      id: "quantity",
      header: utils.cellHeader(t("/@word/quantity")),
      width: "7ch",
      className: "number",
      cell: ({ row, value }) => utils.formatQuantity(value),
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
      id: "quantity_unit",
      header: utils.cellHeader(t("/@word/quantity")),
      width: "10ch",
      className: "number",
      cellValue: ({ row }) => row.quantity,
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
      header: utils.cellHeader(t("/catalog/product/unit/abbr")),
      width: "6ch",
      cellValue: ({ row }) => row.productPacking.unit?.code ?? row.productPacking.product.unit.code,
      cell: ({ value }) => (
        <>
          <Badge>{value}</Badge>
        </>
      ),
    },
    {
      id: "productPacking_units",
      width: "6ch",
      cellValue: ({ row }) => row.productPacking.units,
      cell: ({ row, value }) => (
        <>
          <Badge>{value === 1 ? row.productPacking.product.unit.code : value}</Badge>
        </>
      ),
    },
    {
      id: "quantityUnits",
      header: utils.cellHeader(t("/@word/quantityUnits")),
      width: "7ch",
      className: "number",
      cell: ({ row }) => utils.formatNumber(row.quantity * row.productPacking.units),
      footerValue: ({ data }) =>
        data.reduce((sum, row) => sum + (row.quantity * row.productPacking.units || 0), 0),
      footer: ({ value }) => utils.formatNumber(value),
    },
    {
      id: "netWeightKg",
      header: utils.cellHeader(t("/@word/netWeightKg")),
      width: "7ch",
      className: "number",
      cellValue: ({ row }) => row.quantity * row.productPacking.product?.netWeightKg || 0,
      cell: ({ value }) => utils.formatNumber(value, { digits: 1 }),
      footerValue: ({ data }) =>
        data.reduce(
          (sum, row) => sum + (row.quantity * row.productPacking.product?.netWeightKg || 0),
          0,
        ),
      footer: ({ value }) => utils.formatNumber(value, { digits: 1 }),
    },
    {
      id: "grossWeightKg",
      header: utils.cellHeader(t("/@word/grossWeightKg")),
      width: "10ch",
      className: "number",
      cellValue: ({ row }) => row.quantity * row.productPacking.product?.grossWeightKg || 0,
      cell: ({ value }) => utils.formatNumber(value, { digits: 1 }),
      footerValue: ({ data }) =>
        data.reduce(
          (sum, row) => sum + (row.quantity * row.productPacking.product?.grossWeightKg || 0),
          0,
        ),
      footer: ({ value }) => utils.formatNumber(value, { digits: 1 }),
    },
    {
      id: "volumeM3",
      header: utils.cellHeader(t("/@word/volumeM3")),
      width: "7ch",
      className: "number",
      cellValue: ({ row }) => row.quantity * row.productPacking.product?.volumeM3 || 0,
      cell: ({ value }) => utils.formatNumber(value, { digits: 1 }),
      footerValue: ({ data }) =>
        data.reduce(
          (sum, row) => sum + (row.quantity * row.productPacking.product?.volumeM3 || 0),
          0,
        ),
      footer: ({ value }) => utils.formatNumber(value, { digits: 1 }),
    },
  ];

  const signatures = [
    {
      id: "signature_volume",
      group: "signature",
      label: utils.cellHeader(t("/material/volume/plural")),
      width: "30ch",
      value: "\u00A0",
    },
    {
      id: "signature_serial",
      group: "signature",
      label: utils.cellHeader(t("/material/serial/plural")),
      width: "30ch",
      value: "\u00A0",
    },
    {
      id: "signature_stockPicker",
      group: "signature",
      label: utils.cellHeader(t("/@word/stockPicker")),
      width: "30ch",
      value: "\u00A0",
    },
    {
      id: "signature_stockChecker",
      group: "signature",
      label: utils.cellHeader(t("/@word/stockChecker")),
      width: "30ch",
      value: "\u00A0",
    },
  ];

  data.forEach((row) => {
    utils.sort(row.items, settings?.sort || []);
  });
  data = utils.sort(data, settings?.sort || []);

  return (
    <div
      className={`report-wrapper ${settings?.className ?? ""}`}
      style={{ fontSize: settings?.fontSize }}
    >
      {data.map((data) => (
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
              <dl style={{ flex: 0 }}>
                <dd>
                  <img src={data.company?.image?.url} />
                </dd>
              </dl>
              <dl style={{ flex: 1 }}>
                <dd>
                  <h1>
                    {t("/material/pickingOrder")} {data.id}
                  </h1>
                </dd>
              </dl>
              <dl style={{ flex: 0 }}>
                <dd>
                  <img src={`https://barcode.zensoft.com.br?bcid=qrcode&text=${data.id}`} />
                </dd>
              </dl>
            </section>
            <div className="flex v gap">
              <Fields
                fields={fields}
                visibleFields={visibleFields}
                data={data}
                groups={fieldGroups}
              />
            </div>
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
          <footer>
            <Fields fields={signatures} visibleFields={visibleFields} />
          </footer>
        </div>
      ))}
    </div>
  );
}
