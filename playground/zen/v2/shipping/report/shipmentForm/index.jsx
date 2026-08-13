import React from "react";
import * as utils from "./utils.jsx";
import { Badge, Table } from "./utils.jsx";

export default function ({ data = [], meta = {}, t }) {
  const { report = {} } = meta;

  const settings =
    utils.deepMerge(report?.properties?.["#settings"], report?.properties?.userSettings) ?? {};

  const visibleColumns = (settings?.columns ?? []).filter(
    (item) => !(settings?.removeColumns ?? []).includes(item),
  );

  const groups = settings?.groups || [];

  // When currency_code is visible, currency columns will be formatted as numbers (no currency symbol)
  const formatCurrency = (value, options) => {
    return visibleColumns.includes("currency_code")
      ? utils.formatNumber(value, options)
      : utils.formatCurrency(value, options);
  };

  const visibleFields = settings?.fields ?? [];

  const signatures = [
    {
      id: "driver",
      group: "signature",
      label: utils.cellHeader(t("/@word/driver")),
      width: "30ch",
    },
    {
      id: "licensePlate",
      group: "signature",
      label: utils.cellHeader(t("/shipping/shipment.properties.licensePlate")),
      width: "30ch",
    },
    {
      id: "collect",
      group: "signature",
      label: utils.cellHeader(t("/@word/collect")),
      width: "30ch",
    },
    {
      id: "exitDate",
      group: "signature",
      label: utils.cellHeader(t("/@word/exitDate")),
      width: "30ch",
    },
  ];

  const fields = [
    {
      id: "date",
      group: "shipment",
      label: utils.cellHeader(t("/@word/date")),
      width: "10ch",
      value: (row) => utils.formatDate(row.date),
    },
    {
      id: "status",
      group: "shipment",
      label: utils.cellHeader(t("/@word/status")),
      width: "10ch",
      value: (row) => <Badge>{t("/shipping/shipmentStatus/enum/" + row.status)}</Badge>,
    },
    {
      id: "company_name",
      group: "company",
      flex: 3,
      label: utils.cellHeader(t("/catalog/company/company"), t("/@word/name")),
      width: "30ch",
      value: (row) => row.company_name,
    },
    {
      id: "company_fantasyName",
      group: "company",
      flex: 3,
      label: utils.cellHeader(t("/catalog/company/company"), t("/@word/fantasyName")),
      width: "20ch",
      value: (row) => row.company_fantasyName,
    },
    {
      id: "company_nameCalc",
      group: "company",
      flex: 4,
      label: utils.cellHeader(t("/catalog/company/company"), t("/@word/name")),
      width: "30ch",
      value: (row) => row.company_nameCalc,
    },
    {
      id: "company_documentNumber",
      group: "company",
      label: (row) =>
        utils.cellHeader(
          t("/catalog/company/company"),
          t("/catalog/person/personDocumentType/enum/" + row?.company_documentType),
        ),
      width: "20ch",
      value: (row) => row.company_documentNumber,
    },
    {
      id: "company_document2Number",
      group: "company",
      label: (row) =>
        utils.cellHeader(
          t("/catalog/company/company"),
          t("/catalog/person/personDocumentType/enum/" + row?.company_document2Type),
        ),
      width: "20ch",
      value: (row) => row.company_document2Number,
    },
    {
      id: "company_address_zipcode",
      group: "company",
      label: utils.cellHeader(
        t("/catalog/company/company"),
        t("/@word/address"),
        t("/@word/zipcode"),
      ),
      width: "15ch",
      value: (row) => row.company_address_zipcode,
    },
    {
      id: "company_address_street",
      group: "company",
      flex: 2,
      label: utils.cellHeader(
        t("/catalog/company/company"),
        t("/@word/address"),
        t("/@word/street"),
      ),
      width: "25ch",
      value: (row) => row.company_address_street,
    },
    {
      id: "company_address_number",
      group: "company",
      label: utils.cellHeader(
        t("/catalog/company/company"),
        t("/@word/address"),
        t("/@word/number"),
      ),
      width: "15ch",
      value: (row) => row.company_address_number,
    },
    {
      id: "company_address_district",
      group: "company",
      label: utils.cellHeader(
        t("/catalog/company/company"),
        t("/@word/address"),
        t("/@word/district"),
      ),
      width: "20ch",
      value: (row) => row.company_address_district,
    },
    {
      id: "company_address_calc",
      group: "company",
      flex: 4,
      label: utils.cellHeader(t("/catalog/company/company"), t("/@word/address")),
      width: "40ch",
      value: (row) => row.company_address_calc,
    },
    {
      id: "company_phone",
      group: "company",
      label: utils.cellHeader(t("/catalog/company/company"), t("/@word/phone")),
      width: "20ch",
      value: (row) => row.company_phone,
    },
    {
      id: "company_email",
      group: "company",
      flex: 2,
      label: utils.cellHeader(t("/catalog/company/company"), t("/@word/email")),
      width: "30ch",
      value: (row) => row.company_email,
    },
    {
      id: "person_phone",
      group: "person",
      label: utils.cellHeader(t("/catalog/person/person"), t("/@word/phone")),
      width: "20ch",
      value: (row) => row.person_phone,
    },
    {
      id: "person_name",
      group: "personShipping",
      flex: 3,
      label: utils.cellHeader(t("/@word/personShipping"), t("/catalog/person/person.name")),
      width: "30ch",
      value: (row) => row.person_name,
    },
    {
      id: "person_fantasyName",
      group: "personShipping",
      flex: 3,
      label: utils.cellHeader(t("/@word/personShipping"), t("/catalog/person/person.fantasyName")),
      width: "20ch",
      value: (row) => row.person_fantasyName,
    },
    {
      id: "person_nameCalc",
      group: "personShipping",
      flex: 4,
      label: utils.cellHeader(t("/@word/personShipping"), t("/catalog/person/person.name")),
      width: "30ch",
      value: (row) => row.person_nameCalc,
    },
    {
      id: "person_documentNumber",
      group: "personShipping",
      label: (row) =>
        utils.cellHeader(
          t("/@word/personShipping"),
          t("/catalog/person/personDocumentType/enum/" + row?.person_documentType),
        ),
      width: "20ch",
      value: (row) => row.person_documentNumber,
    },
    {
      id: "person_document2Number",
      group: "personShipping",
      label: (row) =>
        utils.cellHeader(
          t("/@word/personShipping"),
          t("/catalog/person/personDocumentType/enum/" + row?.person_document2Type),
        ),
      width: "20ch",
      value: (row) => row.person_document2Number,
    },
    {
      id: "person_address_zipcode",
      group: "personShipping",
      label: utils.cellHeader(
        t("/@word/personShipping"),
        t("/catalog/person/personAddress"),
        t("/catalog/person/personAddress.zipcode"),
      ),
      width: "15ch",
      value: (row) => row.person_address_zipcode,
    },
    {
      id: "person_address_street",
      group: "personShipping",
      flex: 2,
      label: utils.cellHeader(
        t("/@word/personShipping"),
        t("/catalog/person/personAddress"),
        t("/catalog/person/personAddress.street"),
      ),
      width: "25ch",
      value: (row) => row.person_address_street,
    },
    {
      id: "person_address_number",
      group: "personShipping",
      label: utils.cellHeader(
        t("/@word/personShipping"),
        t("/catalog/person/personAddress"),
        t("/catalog/person/personAddress.number"),
      ),
      width: "15ch",
      value: (row) => row.person_address_number,
    },
    {
      id: "person_address_complement",
      group: "personShipping",
      label: utils.cellHeader(
        t("/@word/personShipping"),
        t("/catalog/person/personAddress"),
        t("/catalog/person/personAddress.complement"),
      ),
      width: "20ch",
      value: (row) => row.person_address_complement,
    },
    {
      id: "person_address_district",
      group: "personShipping",
      flex: 2,
      label: utils.cellHeader(
        t("/@word/personShipping"),
        t("/catalog/person/personAddress"),
        t("/catalog/person/personAddress.district"),
      ),
      width: "20ch",
      value: (row) => row.person_address_district,
    },
    {
      id: "person_address_calc",
      group: "personShipping",
      flex: 2,
      label: utils.cellHeader(t("/@word/personShipping"), t("/catalog/person/personAddress")),
      width: "40ch",
      value: (row) => row.person_address_calc,
    },
    {
      id: "person_city_name",
      group: "personShipping",
      flex: 2,
      label: utils.cellHeader(
        t("/@word/personShipping"),
        t("/catalog/location/city"),
        t("/@word/name"),
      ),
      width: "20ch",
      value: (row) => row.person_city_name,
    },
    {
      id: "person_state_code",
      group: "personShipping",
      label: utils.cellHeader(
        t("/@word/personShipping"),
        t("/catalog/location/state"),
        t("/@word/code"),
      ),
      width: "10ch",
      value: (row) => row.person_state_code,
    },
    {
      id: "person_state_name",
      group: "personShipping",
      label: utils.cellHeader(
        t("/@word/personShipping"),
        t("/catalog/location/state"),
        t("/@word/name"),
      ),
      width: "20ch",
      value: (row) => row.person_state_name,
    },
    {
      id: "person_country_codeA2",
      group: "personShipping",
      label: utils.cellHeader(
        t("/@word/personShipping"),
        t("/catalog/location/country"),
        t("/@word/codeA2"),
      ),
      width: "10ch",
      value: (row) => row.person_country_codeA2,
    },
    {
      id: "person_country_name",
      group: "personShipping",
      label: utils.cellHeader(
        t("/@word/personShipping"),
        t("/catalog/location/country"),
        t("/@word/name"),
      ),
      width: "20ch",
      value: (row) => row.person_country_name,
    },
  ];

  const fieldGroups = [
    {
      id: "signatures",
      label: t("/@word/signature/plural"),
    },
    {
      id: "company",
      label: t("/catalog/company/company"),
    },
    {
      id: "personShipping",
      label: t("/@word/personShipping"),
    },
    {
      id: "shipping",
      label: t("/@word/personShipping"),
    },
  ];

  const columns = [
    {
      id: "id",
      header: utils.cellHeader(t("/@word/id")),
      width: "10ch",
      className: "number",
      cellValue: ({ row }) => row.id,
    },
    {
      id: "number",
      header: utils.cellHeader(t("/@word/number")),
      width: "10ch",
      className: "number",
      cellValue: ({ row }) => row.number,
      footerValue: ({ data }) => data.reduce((red, e) => red.add(e.number), new Set()).size,
      footer: ({ value }) => value,
    },
    {
      id: "volume",
      header: utils.cellHeader(t("/@word/volume/plural")),
      width: "10ch",
      className: "number",
      cellValue: ({ row }) => row.volume,
      footerValue: ({ data }) => utils.sum(data, (item) => item.volume),
      footer: ({ value }) => utils.formatNumber(value),
    },
    {
      id: "person_name",
      header: utils.cellHeader(t("/catalog/person/person"), t("/catalog/person/person.name")),
      width: "30ch",
      cellValue: ({ row }) => row.person_name,
    },
    {
      id: "person_fantasyName",
      header: utils.cellHeader(
        t("/catalog/person/person"),
        t("/catalog/person/person.fantasyName"),
      ),
      width: "20ch",
      cellValue: ({ row }) => row.person_fantasyName,
    },
    {
      id: "person_nameCalc",
      header: utils.cellHeader(t("/catalog/person/person"), t("/catalog/person/person.name")),
      width: "30ch",
      cellValue: ({ row }) => row.person_nameCalc,
    },
    {
      id: "person_documentNumber",
      header: utils.cellHeader(
        t("/catalog/person/person"),
        t("/catalog/person/person.documentNumber"),
      ),
      width: "20ch",
      cellValue: ({ row }) => row.person_documentNumber,
    },
    {
      id: "person_document2Number",
      header: utils.cellHeader(
        t("/catalog/person/person"),
        t("/catalog/person/person.document2Number"),
      ),
      width: "20ch",
      cellValue: ({ row }) => row.person_document2Number,
    },
    {
      id: "person_address_zipcode",
      header: utils.cellHeader(
        t("/catalog/person/personAddress"),
        t("/catalog/person/personAddress.zipcode"),
      ),
      width: "15ch",
      cellValue: ({ row }) => row.person_address_zipcode,
    },
    {
      id: "person_address_street",
      header: utils.cellHeader(
        t("/catalog/person/personAddress"),
        t("/catalog/person/personAddress.street"),
      ),
      width: "25ch",
      cellValue: ({ row }) => row.person_address_street,
    },
    {
      id: "person_address_number",
      header: utils.cellHeader(
        t("/catalog/person/personAddress"),
        t("/catalog/person/personAddress.number"),
      ),
      width: "15ch",
      cellValue: ({ row }) => row.person_address_number,
    },
    {
      id: "person_address_district",
      header: utils.cellHeader(
        t("/catalog/person/personAddress"),
        t("/catalog/person/personAddress.district"),
      ),
      width: "20ch",
      cellValue: ({ row }) => row.person_address_district,
    },
    {
      id: "person_address_calc",
      header: utils.cellHeader(t("/catalog/person/personAddress"), t("/@word/address")),
      width: "40ch",
      cellValue: ({ row }) => row.person_address_calc,
    },
    {
      id: "person_city_name",
      header: utils.cellHeader(t("/catalog/location/city"), t("/@word/name")),
      width: "20ch",
      cellValue: ({ row }) => row.person_city_name,
    },
    {
      id: "person_state_code",
      header: utils.cellHeader(t("/catalog/location/state"), t("/@word/code")),
      width: "7ch",
      cellValue: ({ row }) => row.person_state_code,
    },
    {
      id: "personTransshipment_name",
      header: utils.cellHeader(t("/@word/personShippingTransshipment")),
      width: "20ch",
      cellValue: ({ row }) => row.personTransshipment_name,
    },
    {
      id: "personTransshipment_fantasyName",
      header: utils.cellHeader(t("/@word/personShippingTransshipment"), t("/@word/fantasyName")),
      width: "15ch",
      cellValue: ({ row }) => row.personTransshipment_fantasyName,
    },
    {
      id: "personTransshipment_nameCalc",
      header: utils.cellHeader(t("/@word/personShippingTransshipment"), t("/@word/nameCalc")),
      width: "15ch",
      cellValue: ({ row }) => row.personTransshipment_nameCalc,
    },
    {
      id: "personTransshipment_phone",
      header: utils.cellHeader(t("/@word/personShippingTransshipment"), t("/@word/phone")),
      width: "10ch",
      cellValue: ({ row }) => row.personTransshipment_phone,
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
      id: "volumeM3",
      header: utils.cellHeader(t("/@word/volumeM3")),
      width: "15ch",
      className: "number",
      cellValue: ({ row }) => row.volumeM3,
    },
    {
      id: "totalValue",
      header: utils.cellHeader(t("/@word/totalValue")),
      width: "12ch",
      className: "number",
      cell: ({ row, value }) =>
        formatCurrency(value, {
          currency: row?.currency?.code ?? row?.sale?.currency.code,
          digits: 2,
        }),
      footerValue: ({ data }) => utils.sum(data, (item) => item.totalValue),
      footer: ({ value }) => formatCurrency(value, { digits: 2 }),
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
                  <img src={data?.company_logo} />
                </dd>
              </dl>
              <dl style={{ flex: 1 }}>
                <dd>
                  <h1>
                    {t("/shipping/shipment")} {data.id}
                  </h1>
                </dd>
              </dl>
              <dl style={{ flex: 0 }}>
                <dd>
                  <img src={`https://barcode.zensoft.com.br?bcid=qrcode&text=${data.id}`} />
                </dd>
              </dl>
            </section>
            {renderFields({
              fields: fields,
              visibleFields: visibleFields,
              data: data,
              groups: fieldGroups,
            })}
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
          {renderFields({
            fields: signatures,
            visibleFields: visibleFields,
            data: data,
            groups: fieldGroups,
            allowEmpty: true,
          })}
        </div>
      ))}
    </div>
  );
}

function renderFields({ fields, visibleFields, data, groups, allowEmpty = false }) {
  if (visibleFields.length > 0) {
    fields = fields
      .filter((field) => visibleFields.includes(field.id))
      .sort((a, b) => visibleFields.indexOf(a.id) - visibleFields.indexOf(b.id));
  }

  fields = fields.reduce((red, field) => {
    const value = field.value instanceof Function ? field.value(data) : field.value;

    if ((!allowEmpty && value === undefined) || value === null || value === "") {
      return red;
    }
    red.push({
      ...field,
      value,
    });
    return red;
  }, []);

  const fieldsByGroup = fields.reduce((red, field) => {
    const key = field.group ?? "ungrouped";
    if (!red.has(key)) {
      red.set(key, []);
    }
    red.get(key).push(field);
    return red;
  }, new Map());

  return Array.from(fieldsByGroup.entries()).map(([group, fields]) => {
    return (
      <React.Fragment key={group}>
        {/* <legend>{groups.find((g) => g.id === group)?.label ?? group}</legend> */}
        <section className="parameters">
          {fields.map((field) => {
            const Tag = field.as ?? "dd";
            return (
              <dl key={field.id} style={{ flex: field.flex ?? 1 }}>
                <dt>{field.label instanceof Function ? field.label(data) : field.label}</dt>
                <Tag>{field.value ?? (allowEmpty ? "\u00A0" : "")}</Tag>
              </dl>
            );
          })}
        </section>
      </React.Fragment>
    );
  });
}
