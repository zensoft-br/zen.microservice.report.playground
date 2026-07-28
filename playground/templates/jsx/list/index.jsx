import * as utils from "./utils.jsx";
import { Badge, Fields, Table } from "./utils.jsx";

export default function ({ data = [], meta = {}, t }) {
  const { report = {} } = meta;

  const settings =
    utils.deepMerge(report?.properties?.["#settings"], report?.properties?.userSettings) ?? {};

  const visibleFields = settings?.fields ?? [];

  const fields = [
    {
      id: "id",
      group: "main",
      label: utils.cellHeader(t("/@word/id")),
      value: (row) => row.id,
    },
    {
      id: "status",
      group: "main",
      label: utils.cellHeader(t("/@word/status")),
      value: (row) => <Badge>{t("/sale/saleStatus/enum/" + row.status)}</Badge>,
    },
  ];

  const fieldGroups = [];

  const visibleColumns = settings?.columns ?? [];

  const groups = settings?.groups || [];

  const columns = [
    {
      id: "id",
      header: utils.cellHeader(t("/@word/id")),
      width: "10ch",
      className: "id",
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({ data }) => data.length,
      footer: ({ value }) => utils.formatNumber(value),
    },
    {
      id: "name",
      header: utils.cellHeader(t("/@word/name")),
      width: "30ch",
    },
    {
      id: "score",
      header: utils.cellHeader(t("/@word/score")),
      width: "10ch",
      className: "number",
      cell: ({ value }) => utils.formatNumber(value, { minimumFractionDigits: 2 }),
      footerValue: ({ data }) => utils.sum(data, (row) => row.score),
      footer: ({ value }) => utils.formatNumber(value, { minimumFractionDigits: 2 }),
    },
    {
      id: "category1",
      header: utils.cellHeader(t("/catalog/category")),
      width: "15ch",
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "status",
      header: <i>{utils.cellHeader(t("/@word/status"))}</i>,
      width: "15ch",
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
    {
      id: "quantity",
      className: "number",
      header: utils.cellHeader(t("/@word/quantity")),
      width: "10ch",
      cell: ({ row, value }) => utils.formatQuantity(value, { unit_code: row.unit }),
      footerValue: ({ data }) =>
        utils.sumBy(
          data,
          (item) => item.unit,
          (item) => item.quantity,
        ),
      footer: ({ value }) =>
        utils.renderAggr(value, (quantity, unit_code) =>
          utils.formatQuantity(quantity, { unit_code }),
        ),
    },
    {
      id: "value",
      className: "number",
      header: <i>{utils.cellHeader(t("/@word/value"))}</i>,
      width: "15ch",
      cell: ({ row, value }) => utils.formatCurrency(value, { currency: row.currency }),
      footerValue: ({ data }) =>
        utils.sumBy(
          data,
          (item) => item.currency,
          (item) => item.value,
        ),
      footer: ({ value }) =>
        utils.renderAggr(value, (value, key) => utils.formatCurrency(value, { currency: key })),
    },
    {
      id: "picture",
      header: utils.cellHeader(t("/system/image")),
      width: "10ch",
      cell: ({ value }) =>
        value ? <img src={value} alt="picture" style={{ width: "1.5cm" }} /> : null,
    },
    {
      id: "virtual_column",
      header: "Virtual column",
      width: "15ch",
      cellValue: ({ row }) => `${row.category1}`,
      cell: ({ value }) => <Badge>{value}</Badge>,
    },
  ];

  data = utils.sort(data, settings?.sort || []);

  // return JSON.stringify(
  //   {
  //     availableFields: fields.map((field) => field.id).sort(),
  //     availableColumns: columns.map((field) => field.id).sort(),
  //   },
  //   null,
  //   2,
  // );

  return (
    <div className="report-wrapper" style={{ fontSize: settings?.fontSize }}>
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
          <section className="parameters">
            {report.parameters?.dateStart && (
              <dl>
                <dt>{t("/@word/dateStart")}</dt>
                <dd>{utils.formatDate(report.parameters?.dateStart)}</dd>
              </dl>
            )}
            {report.parameters?.dateEnd && (
              <dl>
                <dt>{t("/@word/dateEnd")}</dt>
                <dd>{utils.formatDate(report.parameters?.dateEnd)}</dd>
              </dl>
            )}
          </section>
          <Fields
            fields={fields}
            visibleFields={visibleFields}
            data={data[0]}
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
