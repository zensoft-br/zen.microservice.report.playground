import * as utils from "./utils.jsx";
import { Badge, Column, Table, getVisibleColumns } from "./utils.jsx";

export default function ({ data = [], meta = {}, t }) {
  const { report = {} } = meta;

  const columns = [
    { id: "check",
      width: "3ch",
      cellValue: () => <span style={{ fontSize: "1.3em" }}>☐</span>,
    },
    { id: "id",
      header: utils.cellHeader(t("/@word/id")),
      width: "7ch",
      className: "id",
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({ data }) => data.length, 
      footer: ({ value }) => utils.formatNumber(value),
    },
    { id: "productPacking_image",
      header: utils.cellHeader(t("/catalog/product/productPacking"), t("/system/image")),
      width: "10ch",
      cellValue: ({ row }) => row.productPacking.image?.url,
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
      cellValue: ({ row }) => row.productPacking.product?.description,
    },
    { id: "productPacking_complement",
      header: utils.cellHeader(t("/catalog/product/productPacking"), t("/@word/complement")),
      width: "10ch",
      cellValue: ({ row }) => row.productPacking.complement,
    },
    { id: "productVariant_description",
      header: utils.cellHeader(t("/catalog/product/productVariant"), t("/@word/description")),
      width: "15ch",
      cellValue: ({ row }) => row.productPacking.variant?.description,
    },
    { id: "address_code",
      header: utils.cellHeader(t("/material/address"), t("/@word/code")),
      width: "10ch",
      cellValue: ({ row }) => row.address?.code,
    },
    { id: "quantity",
      header: utils.cellHeader(t("/@word/quantity")),
      width: "7ch",
      className: "number",
      cell: ({ row, value }) => utils.formatQuantity(value),
      footerValue: ({ data }) => utils.sumBy(data, (row) => row.productPacking.unit?.code ?? row.productPacking.product.unit.code, (row) => row.quantity),
      footer: ({ value }) => utils.renderAggr(value, (val, key) => utils.formatQuantity(val, { unit_code: key })),

    },
    { id: "unit_code",
      header: utils.cellHeader(t("/catalog/product/unit/abbr")),
      width: "6ch",  
      cellValue: ({ row }) => row.productPacking.unit?.code ?? row.productPacking.product.unit.code,
      cell: ({ value }) => <><Badge>{value}</Badge></>,
    },
    { id: "productPacking_units",
      width: "6ch",  
      cellValue: ({ row }) => row.productPacking.units,
      cell: ({ row, value }) => <><Badge>{value === 1 ? row.productPacking.product.unit.code : value}</Badge></>,
    },
    { id: "quantityUnits",
      header: utils.cellHeader(t("/@word/quantityUnits")),
      width: "7ch",
      className: "number",
      cell: ({ row }) => utils.formatNumber(row.quantity * row.productPacking.units),
      footerValue: ({ data }) => data.reduce((sum, row) => sum + (row.quantity * row.productPacking.units || 0), 0),
      footer: ({ value }) => utils.formatNumber(value),
    },
    { id: "netWeightKg",
      header: utils.cellHeader(t("/@word/netWeightKg")),
      width: "7ch",
      className: "number",
      cellValue: ({ row }) => row.quantity * row.productPacking.product?.netWeightKg || 0,
      cell: ({ value }) => utils.formatNumber(value, { digits: 1 }),
      footerValue: ({ data }) => data.reduce((sum, row) => sum + (row.quantity * row.productPacking.product?.netWeightKg || 0), 0),
      footer: ({ value }) => utils.formatNumber(value, { digits: 1 }),
    },
    { id: "grossWeightKg",
      header: utils.cellHeader(t("/@word/grossWeightKg")),
      width: "10ch",
      className: "number",
      cellValue: ({ row }) => row.quantity * row.productPacking.product?.grossWeightKg || 0,
      cell: ({ value }) => utils.formatNumber(value, { digits: 1 }),
      footerValue: ({ data }) => data.reduce((sum, row) => sum + (row.quantity * row.productPacking.product?.grossWeightKg || 0), 0),
      footer: ({ value }) => utils.formatNumber(value, { digits: 1 }),
    },
    { id: "volumeM3",
      header: utils.cellHeader(t("/@word/volumeM3")),
      width: "7ch",
      className: "number",
      cellValue: ({ row }) => row.quantity * row.productPacking.product?.volumeM3 || 0,
      cell: ({ value }) => utils.formatNumber(value, { digits: 1 }),
      footerValue: ({ data }) => data.reduce((sum, row) => sum + (row.quantity * row.productPacking.product?.volumeM3 || 0), 0),
      footer: ({ value }) => utils.formatNumber(value, { digits: 1 }),
    },
  ];

  data.forEach(pickingOrder => {
    pickingOrder.items = utils.sort(pickingOrder.items, 
      // report.properties?.settings?.sort || 
      [
        {
          "columnId": "productPacking.code",
        },
      ]);
  });

  const visibleColumns = getVisibleColumns({
    availableColumns: columns.map(column => column.id),
    overrideColumns: report.properties?.overrideColumns?.split(","),
    standardColumns: [
      "productPacking_code",
      "product_description",
      "productPacking_complement",
      "productVariant_description",
      "address_code",
      "quantity",
      "unit_code",
      "grossWeightKg",
    ],
    addColumns: report.properties?.showColumns?.split(","),
    removeColumns: report.properties?.hideColumns?.split(","),
  });

  return (
    <div className="report-wrapper" style={{ fontSize: report.properties?.fontSize }}>
      {data.map(pickingOrder => (
        <div className="report-container a4 landscape">
          <header>
            <h1 className="flex h gap align-center" style={{ justifyContent: "space-between" }}>
              <img src={pickingOrder.company?.image?.url} style={{ height: "1.5cm" }}></img>
              <span>{t("/material/pickingOrder")} {pickingOrder.id}</span>
              <img src={`https://barcode.zensoft.com.br?bcid=qrcode&text=${pickingOrder.id}`} style={{ height: "1.5cm" }}></img>
            </h1>
            <section className="parameters">
              <dl>
                <dt>{t("/catalog/company/company")}</dt>
                <dd>{pickingOrder.company.person.name}</dd>
              </dl>
              <dl>
                <dt>{t("/@word/date")}</dt>
                <dd>{utils.formatDate(pickingOrder.date)}</dd>
              </dl>
              <dl>
                <dt>{t("/@word/availabilityDate")}</dt>
                <dd>{utils.formatDate(pickingOrder.sale?.availabilityDate)}</dd>
              </dl>
              <dl>
                <dt>{t("/material/reservation")}</dt>
                <dd>{pickingOrder.reservation?.id}</dd>
              </dl>
            </section>
            <section className="parameters">
              <dl>
                <dt>{t("/sale/sale")}</dt>
                <dd>{pickingOrder.sale?.code ?? pickingOrder.sale?.id}</dd>
              </dl>
              <dl>
                <dt>{t("/sale/saleProfile")}</dt>
                <dd>{pickingOrder.sale?.saleProfile?.code}</dd>
              </dl>
              <dl>
                <dt>{t("/@word/tags")}</dt>
                <dd>{pickingOrder.sale?.tags}</dd>
              </dl>
              <dl>
                <dt>{t("/@word/personSalesperson")}</dt>
                <dd>{pickingOrder.sale?.personSalesperson?.fantasyName ?? pickingOrder.sale?.personSalesperson?.name}</dd>
              </dl>
            </section>
            <section className="parameters">
              <dl>
                <dt>{t("/catalog/person/person")}</dt>
                <dd>{pickingOrder.person.name}</dd>
              </dl>
              <dl>
                <dt>{t("/@word/fantasyName")}</dt>
                <dd>{pickingOrder.person.fantasyName}</dd>
              </dl>
              <dl>
                <dt>{t("/catalog/location/city")}</dt>
                <dd>{pickingOrder.sale?.personAddressShipping ? 
                  [pickingOrder.sale?.personAddressShipping.city?.name, pickingOrder.sale?.personAddressShipping.city?.state?.code].filter(Boolean).join(", ") : 
                  [pickingOrder.person.city?.name, pickingOrder.person.city?.state?.code].filter(Boolean).join(", ")}</dd>
              </dl>
            </section>
            <section className="parameters">
              <dl>
                <dt>{t("/@word/address")}</dt>
                <dd>{[
                  pickingOrder.person.street,
                  pickingOrder.person.number,
                  pickingOrder.person.complement,
                  pickingOrder.person.city.name,
                  pickingOrder.person.city.state.code,
                  pickingOrder.person.city.state.country.codeA2,
                  pickingOrder.person.zipcode,
                ].filter(Boolean).join(", ")}</dd>
              </dl>
              <dl>
                <dt>{t("/@word/addressShipping")}</dt>
                <dd>{[
                  pickingOrder.sale?.personAddressShipping?.street,
                  pickingOrder.sale?.personAddressShipping?.number,
                  pickingOrder.sale?.personAddressShipping?.complement,
                  pickingOrder.sale?.personAddressShipping?.city?.name,
                  pickingOrder.sale?.personAddressShipping?.city?.state?.code,
                  pickingOrder.sale?.personAddressShipping?.city?.state?.country?.codeA2,
                  pickingOrder.sale?.personAddressShipping?.zipcode,
                ].filter(Boolean).join(", ")}</dd>
              </dl>
              <dl>
                <dt>{t("/@word/personShipping")}</dt>
                <dd>{[
                  pickingOrder.sale?.personShipping?.name,
                  pickingOrder.sale?.personShipping?.documentNumber,
                ].filter(Boolean).join(", ")}</dd>
              </dl>
            </section>
            {pickingOrder.properties?.comments ? <section className="parameters">
              <dl>
                <dt>{t("/@word/comments")}</dt>
                <dd>
                  <pre>{[
                    pickingOrder.properties?.comments,
                    pickingOrder.sale?.person.properties?.outgoingInvoiceComments,
                  ].filter(Boolean).join("\n")}</pre>
                </dd>
              </dl>
            </section> : undefined}
          </header>
          <main>
            <div className="content">
              <Table columns={columns}
                visibleColumns={visibleColumns}
                data={pickingOrder.items} />
            </div>
          </main>
          <footer>
            <section className="parameters">
              <dl>
                <dt>{t("/material/volume/plural")}</dt>
                <dd>&nbsp;</dd>
              </dl>
              <dl>
                <dt>{t("/material/serial/plural")}</dt>
                <dd>&nbsp;</dd>
              </dl>
              <dl>
                <dt>{t("/@word/stockPicker")}</dt>
                <dd>&nbsp;</dd>
              </dl>
              <dl>
                <dt>{t("/@word/stockChecker")}</dt>
                <dd>&nbsp;</dd>
              </dl>
            </section>
          </footer>
        </div>
      ))}
    </div>
  );
}