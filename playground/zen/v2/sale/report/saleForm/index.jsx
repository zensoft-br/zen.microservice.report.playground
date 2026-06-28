import React from "react";
import * as utils from "./utils.jsx";
import { Column, getVisibleColumns, Table } from "./utils.jsx";

export default function ({ data = [], meta = {}, t }) {
  const { report = {} } = meta;

  const columns = [
    { id: "product_image",
      header: utils.cellHeader(t("/catalog/product/productPacking"), t("/system/image")),
      width: "7ch",
      cellValue: ({ row }) => row.productPacking.image?.url ?? row.productPacking.product.image?.url,
      cell: ({ value }) => <img src={value} style={{ width: "1.25cm", height: "1.25cm", objectFit: "contain" }}></img>,
    },
    { id: "productPacking_code",
      header: utils.cellHeader(t("/catalog/product/productPacking"), t("/@word/code")),
      width: "15ch",
      cellValue: ({ row }) => row.productPacking.code,
    },
    { id: "product_description",
      header: utils.cellHeader(t("/catalog/product/product"), t("/@word/description")),
      width: "30ch",
      cellValue: ({ row }) => row.productPacking.product.description,
    },
    { id: "productPacking_complement",
      header: utils.cellHeader(t("/catalog/product/productPacking"), t("/@word/complement")),
      width: "15ch",
      cellValue: ({ row }) => row.productPacking.complement,
    },
    { id: "productVariant_code",
      header: utils.cellHeader(t("/catalog/product/productVariant"), t("/@word/code")),
      width: "10ch",
      cellValue: ({ row }) => row.productPacking.productVariant?.code,
    },
    { id: "productVariant_description",
      header: utils.cellHeader(t("/catalog/product/productVariant"), t("/@word/description")),
      width: "15ch",
      cellValue: ({ row }) => row.productPacking.productVariant?.description,
    },
    { id: "taxationOperation_code",
      header: utils.cellHeader(t("/fiscal/taxation/taxationOperation"), t("/@word/code")),
      width: "7ch",
      cellValue: ({ row }) => row.taxationOperation.code,
    },
    { id: "quantity",
      header: utils.cellHeader(t("/@word/quantity")),
      width: "10ch",
      className: "number",
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({ data }) => data.reduce((sum, row) => sum + (row.quantity || 0), 0),
      footer: ({ value }) => utils.formatNumber(value),
    },
    { id: "unit_code",
      // header: utils.cellHeader(t("/@word/unitValue")),
      width: "5ch",
      cellValue: ({ row }) => row.productPacking.product.unit.code,
    },
    { id: "unitValue",
      header: utils.cellHeader(t("/@word/unitValue")),
      width: "10ch",
      className: "number",
      cell: ({ value }) => utils.formatCurrency(value, { maximumFractionDigits: 8 }),
    },
    { id: "grossProductValue",
      header: utils.cellHeader(t("/@word/grossProductValue")),
      width: "10ch",
      className: "number",
      cell: ({ value }) => utils.formatCurrency(value),
      footerValue: ({ data }) => data.reduce((sum, row) => sum + (row.grossProductValue || 0), 0),
      footer: ({ value }) => utils.formatCurrency(value),
    },
    { id: "totalValue",
      header: utils.cellHeader(t("/@word/totalValue")),
      width: "10ch",
      className: "number",
      cell: ({ value }) => utils.formatCurrency(value),
      footerValue: ({ data }) => data.reduce((sum, row) => sum + (row.totalValue || 0), 0),
      footer: ({ value }) => utils.formatCurrency(value),
    },
    { id: "netWeightKg",
      header: utils.cellHeader(t("/@word/netWeightKg")),
      width: "10ch",
      className: "number",
      cell: ({ value }) => utils.formatNumber(value, { digits: 1 }),
      footerValue: ({ data }) => data.reduce((sum, row) => sum + (row.netWeightKg || 0), 0),
      footer: ({ value }) => utils.formatNumber(value, { digits: 1 }),
    },
    { id: "grossWeightKg",
      header: utils.cellHeader(t("/@word/grossWeightKg")),
      width: "10ch",
      className: "number",
      cell: ({ value }) => utils.formatNumber(value, { digits: 1 }),
      footerValue: ({ data }) => data.reduce((sum, row) => sum + (row.grossWeightKg || 0), 0),
      footer: ({ value }) => utils.formatNumber(value, { digits: 1 }),
    },
    ...["ICMS", "ICMS_SN", "ICMS_ST", "IPI", "PIS", "COFINS"].flatMap((tax) => ([
      { id: `tax_${tax}_baseValue`,
        header: utils.cellHeader(tax, t("/@word/baseValue")),
        width: "10ch",
        className: "number",
        cellValue: ({ row }) => row.taxations?.find(taxation => taxation.tax.code === tax)?.baseValue,
        cell: ({ value }) => utils.formatCurrency(value),
        footerValue: ({ data }) => data.reduce((sum, row) => sum + (row.taxations?.find(taxation => taxation.tax.code === tax)?.baseValue || 0), 0),
        footer: ({ value }) => utils.formatCurrency(value),
      },
      { id: `tax_${tax}_taxRate`,
        header: utils.cellHeader(tax, t("/fiscal/taxation/taxation.taxRate")),
        width: "7ch",
        className: "number",
        cellValue: ({ row }) => row.taxations?.find(taxation => taxation.tax.code === tax)?.taxRate,
        cell: ({ value }) => utils.formatNumber(value),
      },
      { id: `tax_${tax}_taxValue`,
        header: utils.cellHeader(tax, t("/fiscal/taxation/taxation.taxValue")),
        width: "10ch",
        className: "number",
        cellValue: ({ row }) => row.taxations?.find(taxation => taxation.tax.code === tax)?.taxValue,
        cell: ({ value }) => utils.formatCurrency(value),
        footerValue: ({ data }) => data.reduce((sum, row) => sum + (row.taxations?.find(taxation => taxation.tax.code === tax)?.taxValue || 0), 0),
        footer: ({ value }) => utils.formatCurrency(value),
      },
    ])),
  ];

  if (meta.explain) {
    // return (
    //   <table>
    //     <thead>
    //       <tr>
    //         <th>id</th>
    //         <th>header</th>
    //       </tr>
    //     </thead>
    //     <tbody>
    //       {columns.map((column, index) => (
    //         <tr key={index}>
    //           <td>{column.id}</td>
    //           <td>{column.header}</td>
    //         </tr>
    //       ))}
    //     </tbody>
    //   </table>
    // );
    return <pre>{JSON.stringify(columns.map(column => ({ id: column.id, header: column.header })), null, 2)}</pre>;
  }


  const visibleColumns = getVisibleColumns({
    availableColumns: columns.map(column => column.id),
    overrideColumns: report.properties?.overrideColumns?.split(","),
    standardColumns:  [
      "productPacking_code",
      "product_description",
      "taxationOperation_code",
      "quantity",
      "unit_code",
      "unitValue",
      "totalValue",
      "tax_ICMS_taxRate",
      "tax_ICMS_ST_taxRate",
      "tax_IPI_taxRate",
    ],
    addColumns: report.properties?.showColumns?.split(","),
    removeColumns: report.properties?.hideColumns?.split(","),
  });

  data.forEach(row => {
    row.items.forEach(item => {
      item.netWeightKg = utils.round(item.quantity * (item.productPacking.netWeightKg || item.productPacking.product.netWeightKg || 0), 3);
      item.grossWeightKg = utils.round(item.quantity * (item.productPacking.grossWeightKg || item.productPacking.product.grossWeightKg || 0), 3);
    });
  });

  return (
    <div className="report-wrapper">
      {data.map((data) => (
        <div className="report-container a4 landscape">
          <header>
            <h1 className="grid" style={{ gridTemplateColumns: "1fr auto 1fr", alignItems: "center" }}>
              <img src={data.company.image?.url} style={{ height: "2cm", width: "4cm", objectFit: "contain" }} />
              <span>{t("/sale/sale")} {data.id}</span>
              <img src={`https://barcode.zensoft.com.br?bcid=qrcode&text=${data.id}`} style={{ width: "2cm", justifySelf: "end" }} />
            </h1>
            <div className="flex v gap" style={{ fontSize: "0.8rem" }}>
              <section className="parameters">
                <dl>
                  <dt>{t("/catalog/company/company")}</dt>
                  <dd>{data.company.person.name}</dd>
                </dl>
                <dl>
                  <dt>CNPJ</dt>
                  <dd>{data.company.person.documentNumber}</dd>
                </dl>
                <dl>
                  <dt>Inscrição estadual</dt>
                  <dd>{data.company.person.document2Number}</dd>
                </dl>
              </section>
              <section className="parameters">
                <dl style={{ flex: "3" }}>
                  <dt>{t("/@word/address")}</dt>
                  <dd>{[
                    data.company.person.street,
                    data.company.person.number,
                    data.company.person.complement,
                    data.company.person.district,
                    data.company.person.city?.name,
                    data.company.person.city?.state?.code,
                    data.company.person.zipCode,
                  ].filter(Boolean).join(", ")}</dd>
                </dl>
                <dl style={{ flex: "2" }}>
                  <dt>{t("/@word/email")}</dt>
                  <dd>{data.company.person.email}</dd>
                </dl>
                <dl style={{ flex: "1" }}>
                  <dt>{t("/@word/phone")}</dt>
                  <dd>{data.company.person.phone}</dd>
                </dl>
              </section>
              <section className="parameters">
                <dl>
                  <dt>{t("/@word/customer")}</dt>
                  <dd>{data.person.name}</dd>
                </dl>
                <dl>
                  <dt>CNPJ</dt>
                  <dd>{data.person.documentNumber}</dd>
                </dl>
                <dl>
                  <dt>Inscrição estadual</dt>
                  <dd>{data.person.document2Number}</dd>
                </dl>
              </section>
              <section className="parameters">
                <dl style={{ flex: "3" }}>
                  <dt>{t("/@word/address")}</dt>
                  <dd>{[
                    data.person.street,
                    data.person.number,
                    data.person.complement,
                    data.person.district,
                    data.person.city?.name,
                    data.person.city?.state?.code,
                    data.person.zipCode,
                  ].filter(Boolean).join(", ")}</dd>
                </dl>
                <dl style={{ flex: "2" }}>
                  <dt>{t("/@word/email")}</dt>
                  <dd>{data.person.email}</dd>
                </dl>
                <dl style={{ flex: "1" }}>
                  <dt>{t("/@word/phone")}</dt>
                  <dd>{data.person.phone}</dd>
                </dl>
              </section>
              <section className="parameters">
                <dl>
                  <dt>{t("/sale/saleProfile")}</dt>
                  <dd>{data.saleProfile.code}</dd>
                </dl>
                <dl>
                  <dt>{t("/@word/code")}</dt>
                  <dd>{data.code}</dd>
                </dl>
                <dl>
                  <dt>{t("/@word/date")}</dt>
                  <dd>{utils.formatDate(data.date)}</dd>
                </dl>
                <dl>
                  <dt>{t("/@word/availabilityDate")}</dt>
                  <dd>{utils.formatDate(data.availabilityDate)}</dd>
                </dl>
                <dl>
                  <dt>{t("/@word/status")}</dt>
                  <dd>{data.status}</dd>
                </dl>
                <dl>
                  <dt>{t("/@word/tags")}</dt>
                  <dd>{data.tags}</dd>
                </dl>
              </section>
              <section className="parameters">
                <dl>
                  <dt>{t("/@word/freightType")}</dt>
                  <dd>{data.freightType}</dd>
                </dl>
                <dl>
                  <dt>{t("/@word/personShipping")}</dt>
                  <dd>{data.personShipping?.name}</dd>
                </dl>
                <dl>
                  <dt>{t("/@word/personShippingTransshipment")}</dt>
                  <dd>{data.personShippingTransshipment?.name}</dd>
                </dl>
              </section>
              <section className="parameters">
                <dl>
                  <dt>{t("/@word/personSalesperson")}</dt>
                  <dd>{data.personSalesperson?.name}</dd>
                </dl>
                <dl>
                  <dt>{t("/@word/paymentMethods")}</dt>
                  <dd>{data.properties?.paymentMethods}</dd>
                </dl>
              </section>
              {data.properties?.comments &&
                <section className="parameters">
                  <dl>
                    <dt>{t("/@word/comments")}</dt>
                    <dd>{data.properties?.comments}</dd>
                  </dl>
                </section>
              }
            </div>
          </header>
          <main>
            <div className="content">
              <Table columns={columns}
                visibleColumns={visibleColumns}
                data={data.items} />
            </div>
          </main>
        </div>
      ))}
    </div>
  );
};
