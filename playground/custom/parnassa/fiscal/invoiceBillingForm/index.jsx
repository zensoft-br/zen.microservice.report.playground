// TODO: Unfinished

import * as utils from "./utils.jsx";
import { Badge, Fields, Table } from "./utils.jsx";

export default function ({ data = [], meta = {}, t }) {
  const { report = {} } = meta;

  const settings =
    utils.deepMerge(report?.properties?.["#settings"], report?.properties?.userSettings) ?? {};

  const visibleFields = settings?.fields ?? [];

  const fields = [
    {
      id: "person_name",
      group: "person",
      flex: 3,
      label: utils.cellHeader(t("/catalog/person/person"), t("/@word/name")),
      value: (row) => row.person.name,
    },
    {
      id: "person_fantasyName",
      group: "person",
      flex: 3,
      label: utils.cellHeader(t("/catalog/person/person"), t("/@word/fantasyName")),
      value: (row) => row.person.fantasyName,
    },
    {
      id: "person_nameCalc",
      group: "person",
      flex: 3,
      label: utils.cellHeader(t("/catalog/person/person"), t("/@word/name")),
      value: (row) => row.person?.fantasyName ?? row.person?.name,
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
      flex: 3,
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
      id: "personSalesperson_name",
      group: "salesPerson",
      flex: 3,
      label: utils.cellHeader(t("/@word/personSalesperson"), t("/@word/name")),
      value: (row) => row.personSalesperson?.name,
    },
    {
      id: "personSalesperson_fantasyName",
      group: "salesPerson",
      flex: 3,
      label: utils.cellHeader(t("/@word/personSalesperson"), t("/@word/fantasyName")),
      value: (row) => row.personSalesperson?.fantasyName,
    },
    {
      id: "personSalesperson_nameCalc",
      group: "salesPerson",
      flex: 3,
      label: utils.cellHeader(t("/@word/personSalesperson"), t("/@word/name")),
      value: (row) => row.personSalesperson?.fantasyName ?? row.personSalesperson?.name,
    },
    {
      id: "billingTitle_date_mediaCalc",
      group: "billingTitle",
      flex: 3,
      label: utils.cellHeader(t("/@word/averageDate")),
      value: (row) => {
        const dates = data.flatMap((item) =>
          (item.billingTitleList || []).map((title) =>
            new Date(`${title.due_date}T00:00:00`).getTime(),
          ),
        );

        const dateMedia = dates.length
          ? new Date(dates.reduce((sum, date) => sum + date, 0) / dates.length)
          : null;

        return utils.formatDate(dateMedia);
      },
    },
    {
      id: "invoiceBilling_date",
      group: "salesPerson",
      flex: 3,
      label: utils.cellHeader(t("/@word/personSalesperson"), t("/@word/fantasyName")),
      value: (row) => row.personSalesperson?.fantasyName,
    },
  ];

  const fieldGroups = [];

  const visibleColumns = settings?.columns ?? [];

  const groups = settings?.groups || [];

  const columns = [
    {
      id: "invoiceItemList_productPacking_code",
      header: utils.cellHeader(t("/catalog/product/productPacking"), t("/@word/code")),
      width: "15ch",
      cellValue: ({ row }) => row.productPacking.code,
    },
    {
      id: "invoiceItemList_productPacking_description",
      header: utils.cellHeader(t("/catalog/product/product"), t("/@word/description")),
      width: "30ch",
      cellValue: ({ row }) => row.productPacking.product?.description,
    },
    {
      id: "invoiceItemList_productPacking_complement",
      header: utils.cellHeader(t("/catalog/product/productPacking"), t("/@word/complement")),
      width: "10ch",
      cellValue: ({ row }) => row.productPacking.complement,
    },
    {
      id: "invoiceItemList_productPacking_descriptionCalc",
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
      id: "invoiceItemList_productPacking_productVariant_description",
      header: utils.cellHeader(t("/catalog/product/productVariant"), t("/@word/description")),
      width: "15ch",
      cellValue: ({ row }) => row.productPacking.variant?.description,
    },
    {
      id: "invoiceItemList_productPacking_totalValue",
      header: utils.cellHeader(t("/@word/totalValue")),
      width: "16ch",
      className: "number",
      headerClassName: "number",
      cellValue: ({ row }) => row.totalValue,
      cell: ({ value }) => utils.formatCurrency(value),
      footerValue: ({ data }) =>
        data.reduce((red, item) => red + (Number(item.totalValue) || 0), 0),
      footer: ({ value }) => utils.formatCurrency(value),
    },
  ];

  data = utils.sort(data, settings?.sort || []);

  data = data.map((row) => {
    const dates = (row.billingTitleList || []).map((title) =>
      new Date(`${title.due_date}T00:00:00`).getTime(),
    );

    const dateMedia = dates.length
      ? new Date(dates.reduce((sum, date) => sum + date, 0) / dates.length)
      : null;

    return {
      ...row,
      dateMedia: utils.formatDate(dateMedia),
    };
  });

  return (
    <div className="report-wrapper" style={{ fontSize: settings?.fontSize }}>
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
              <dl>
                <dd>
                  <h1>
                    {t("/@word/billingReport")} {data.id}
                  </h1>
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
            <section>
              <h3 className="date-media">
                Faturas
                {data.dateMedia ? (
                  <span>
                    {t("/@word/averageDate")}: ({data.dateMedia})
                  </span>
                ) : (
                  ""
                )}
              </h3>
              <div className="flex h gap" style={{ flexWrap: "wrap" }}>
                {data.billingTitleList.map((billing) => (
                  <dl key={billing.id} style={{ flex: "0 1 17%" }}>
                    <dt>{billing.code}</dt>
                    <dt>{utils.formatDate(billing.date)}</dt>
                    <dt>
                      <strong>{utils.formatCurrency(billing.value)}</strong>
                    </dt>
                  </dl>
                ))}
              </div>
            </section>
            <div className="content">
              <Table
                columns={columns}
                visibleColumns={visibleColumns}
                data={data?.invoiceItemList}
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
