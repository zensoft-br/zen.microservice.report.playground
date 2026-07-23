import * as utils from "./utils.jsx";
import { Badge, Table } from "./utils.jsx";

export default function ({ data = [], meta = {}, t }) {
  const { report = {} } = meta;

  const settings = utils.deepMerge(report?.properties?.["#settings"], report?.properties?.userSettings) ?? {};

  const columns = [
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
      id: "product_calc",
      width: "24ch",
      header: utils.cellHeader(t("/catalog/product/product")),
      cellValue: ({ row }) => row.product_code,
      cell: ({ row, value }) => <><Badge>{value}</Badge> {row.product_description}</>,
    },
    {
      id: "unit_id",
      width: "8ch",
      header: utils.cellHeader(t("/catalog/unit"), t("/@word/id")),
    },
    {
      id: "unit_code",
      width: "8ch",
      header: utils.cellHeader(t("/catalog/unit")),
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
      id: "productPacking_complement",
      width: "16ch",
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
      id: "productPacking_calc",
      width: "24ch",
      header: utils.cellHeader(t("/catalog/product/productPacking")),
      cellValue: ({ row }) => row.productPacking_code,
      cell: ({ row, value }) => <><Badge>{value}</Badge> {[row.productPacking_complement, row.productVariant_code, row.productVariant_description].filter(Boolean).join(", ")}</>,
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
    },
    {
      id: "productVariant_description",
      width: "16ch",
      header: utils.cellHeader(t("/catalog/product/productVariant"), t("/@word/description")),
    },
    {
      id: "stockCluster_id",
      width: "8ch",
      header: utils.cellHeader(t("/material/stockCluster"), t("/@word/id")),
    },
    {
      id: "stockCluster_code",
      width: "8ch",
      header: utils.cellHeader(t("/material/stockCluster"), t("/@word/code")),
      footerValue: ({ data }) => data.reduce((red, e) => red.add(e.stockCluster_id), new Set()).size,
      footer: ({ value }) => value,
    },
    {
      id: "address_id",
      width: "8ch",
      header: utils.cellHeader(t("/material/address"), t("/@word/id")),
    },
    {
      id: "address_code",
      width: "8ch",
      header: utils.cellHeader(t("/material/address"), t("/@word/code")),
      footerValue: ({ data }) => data.reduce((red, e) => red.add(e.address_id), new Set()).size,
      footer: ({ value }) => value,
    },
    {
      id: "quality_id",
      width: "8ch",
      header: utils.cellHeader(t("/material/quality"), t("/@word/id")),
    },
    {
      id: "quality_code",
      width: "8ch",
      header: utils.cellHeader(t("/material/quality"), t("/@word/code")),
      footerValue: ({ data }) => data.reduce((red, e) => red.add(e.quality_id), new Set()).size,
      footer: ({ value }) => value,
    },
    {
      id: "quality_description",
      width: "12ch",
      header: utils.cellHeader(t("/material/quality"), t("/@word/description")),
    },
    {
      id: "lot_id",
      width: "8ch",
      header: utils.cellHeader(t("/material/lot"), t("/@word/id")),
    },
    {
      id: "lot_code",
      width: "8ch",
      header: utils.cellHeader(t("/material/lot"), t("/@word/code")),
      footerValue: ({ data }) => data.reduce((red, e) => red.add(e.lot_id), new Set()).size,
      footer: ({ value }) => value,
    },
    {
      id: "lot_extra1",
      width: "12ch",
      header: utils.cellHeader(t("/material/lot"), t("/material/lot.properties.extra1")),
      cellValue: ({ row }) => row.lot_properties?.extra1,
      footerValue: ({ data }) => data.reduce((red, e) => red.add(e.lot_properties?.extra1), new Set()).size,
      footer: ({ value }) => value,
    },
    {
      id: "lot_extra2",
      width: "12ch",
      header: utils.cellHeader(t("/material/lot"), t("/material/lot.properties.extra2")),
      cellValue: ({ row }) => row.lot_properties?.extra2,
      footerValue: ({ data }) => data.reduce((red, e) => red.add(e.lot_properties?.extra2), new Set()).size,
      footer: ({ value }) => value,
    },
    {
      id: "lot_extra3",
      width: "12ch",
      header: utils.cellHeader(t("/material/lot"), t("/material/lot.properties.extra3")),
      cellValue: ({ row }) => row.lot_properties?.extra3,
      footerValue: ({ data }) => data.reduce((red, e) => red.add(e.lot_properties?.extra3), new Set()).size,
      footer: ({ value }) => value,
    },
    {
      id: "serial_id",
      width: "8ch",
      header: utils.cellHeader(t("/material/serial"), t("/@word/id")),
    },
    {
      id: "serial_code",
      width: "8ch",
      header: utils.cellHeader(t("/material/serial"), t("/@word/code")),
      footerValue: ({ data }) => data.reduce((red, e) => red.add(e.serial_id), new Set()).size,
      footer: ({ value }) => value,
    },
    {
      id: "serial_extra1",
      width: "12ch",
      header: utils.cellHeader(t("/material/serial"), t("/material/serial.properties.extra1")),
      cellValue: ({ row }) => row.serial_properties?.extra1,
      footerValue: ({ data }) => data.reduce((red, e) => red.add(e.serial_properties?.extra1), new Set()).size,
      footer: ({ value }) => value,
    },
    {
      id: "serial_extra2",
      width: "12ch",
      header: utils.cellHeader(t("/material/serial"), t("/material/serial.properties.extra2")),
      cellValue: ({ row }) => row.serial_properties?.extra2,
      footerValue: ({ data }) => data.reduce((red, e) => red.add(e.serial_properties?.extra2), new Set()).size,
      footer: ({ value }) => value,
    },
    {
      id: "serial_extra3",
      width: "12ch",
      header: utils.cellHeader(t("/material/serial"), t("/material/serial.properties.extra3")),
      cellValue: ({ row }) => row.serial_properties?.extra3,
      footerValue: ({ data }) => data.reduce((red, e) => red.add(e.serial_properties?.extra3), new Set()).size,
      footer: ({ value }) => value,
    },
    {
      id: "expirationDate",
      width: "10ch",
      header: utils.cellHeader(t("/@word/expirationDate")),
      cell: ({ value }) => utils.formatDate(value),
      footerValue: ({ data }) => data.reduce((red, e) => red.add(e.expirationDate), new Set()).size,
      footer: ({ value }) => value,
    },
    {
      id: "handlingUnit_id",
      width: "8ch",
      header: utils.cellHeader(t("/material/handlingUnit"), t("/@word/id")),
    },
    {
      id: "handlingUnit_code",
      width: "8ch",
      header: utils.cellHeader(t("/material/handlingUnit"), t("/@word/code")),
      footerValue: ({ data }) => data.reduce((red, e) => red.add(e.handlingUnit_id), new Set()).size,
      footer: ({ value }) => value,
    },
    {
      id: "sum_quantity",
      className: "number",
      width: "10ch",
      header: utils.cellHeader(t("/@word/quantity")),
      cell: ({ row, value }) => utils.formatQuantity(value, { unit_code: row.unit_code }),
      footerValue: ({ data }) => utils.sumBy(data, (item) => item.unit_code, (item) => item.sum_quantity),
      footer: ({ value }) => utils.renderAggr(value, (quantity, unit_code) => utils.formatQuantity(quantity, { unit_code })),
    },
    {
      id: "sum_quantity_units",
      className: "number",
      width: "10ch",
      header: utils.cellHeader(t("/@word/quantityUnits")),
      cell: ({ row, value }) => utils.formatQuantity(value, { unit_code: row.unit_code }),
      footerValue: ({ data }) => utils.sumBy(data, (item) => item.unit_code, (item) => item.sum_quantity_units),
      footer: ({ value }) => utils.renderAggr(value, (quantity, unit_code) => utils.formatQuantity(quantity, { unit_code })),
    },
    {
      id: "sum_netWeightKg",
      className: "number",
      width: "10ch",
      header: utils.cellHeader(t("/@word/netWeightKg")),
      cell: ({ value }) => utils.formatNumber(value, { digits: 2 }),
      footerValue: ({ data }) => utils.sum(data, (item) => item.sum_netWeightKg),
      footer: ({ value }) => utils.formatNumber(value, { digits: 2 }),
    },
    {
      id: "sum_grossWeightKg",
      className: "number",
      width: "10ch",
      header: utils.cellHeader(t("/@word/grossWeightKg")),
      cell: ({ value }) => utils.formatNumber(value, { digits: 2 }),
      footerValue: ({ data }) => utils.sum(data, (item) => item.sum_grossWeightKg),
      footer: ({ value }) => utils.formatNumber(value, { digits: 2 }),
    },
    {
      id: "sum_volumeM3",
      className: "number",
      width: "10ch",
      header: utils.cellHeader(t("/@word/volumeM3")),
      cell: ({ value }) => utils.formatNumber(value, { digits: 2 }),
      footerValue: ({ data }) => utils.sum(data, (item) => item.sum_volumeM3),
      footer: ({ value }) => utils.formatNumber(value, { digits: 2 }),
    },
    {
      id: "count",
      className: "number",
      width: "10ch",
      header: utils.cellHeader(t("/@word/count")),
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({ data }) => utils.sum(data, (item) => item.count),
      footer: ({ value }) => utils.formatNumber(value),
    },
  ];

  const visibleColumns = settings?.columns ?? [];

  const groups = settings?.groups || [];

  data = utils.sort(data, settings?.sort || []);

  const map = data.reduce((red, e) => {
    const key = e.id;
    red.set(key, red.get(key) ?? []);
    red.get(key).push(e);
    return red;
  }, new Map());

  return (
    <div className="report-wrapper" style={{ fontSize: report?.properties?.fontSize }}>
      {map.values().map((data) => {
        const first = data[0];
        return (
          <div className={`report-container ${report?.properties?.pageSize ?? "a4"} ${report?.properties?.orientation}`}>
            <header>
              <h1 className="grid" style={{ gridTemplateColumns: "1fr auto 1fr", alignItems: "center" }}>
                <img src={first.company_image_url} style={{ height: "1.5cm", width: "3cm", objectFit: "contain" }} />
                <span>{t("/material/incomingList")} {first.id}</span>
                <img src={`https://barcode.zensoft.com.br?bcid=qrcode&text=${first.id}`} style={{ height: "1.5cm", justifySelf: "end" }} />
              </h1>
              <section className="parameters">
                <dl>
                  <dt>{t("/catalog/company/company")}</dt>
                  <dd>{first.company_name}</dd>
                </dl>
                <dl>
                  <dt>{t("/catalog/person/person")}</dt>
                  <dd>{first.person_name}</dd>
                </dl>
                <dl>
                  <dt>{t("/@word/date")}</dt>
                  <dd>{utils.formatDate(first.date)}</dd>
                </dl>
                <dl>
                  <dt>{t("/@word/status")}</dt>
                  <dd>{t(`/material/incomingListStatus/enum/${first.status}`)}</dd>
                </dl>
                <dl>
                  <dt>{t("/@word/tags")}</dt>
                  <dd>{first.tags}</dd>
                </dl>
                <dl>
                  <dt>{t("/fiscal/incomingInvoice")}</dt>
                  <dd>{first.invoice_number}</dd>
                </dl>
              </section>
            </header>
            <main>
              <div className="content">
                <Table
                  columns={columns}
                  visibleColumns={visibleColumns}
                  data={data}
                  groups={groups}
                  footerTitle={t("/@word/summary")} />
              </div>
            </main>
          </div>
        );
      })}
    </div>
  );
}