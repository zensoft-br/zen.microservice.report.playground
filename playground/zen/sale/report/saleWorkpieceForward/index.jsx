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

  const visibleColumns = (settings?.columns ?? []).filter(
    (item) => !(settings?.removeColumns ?? []).includes(item),
  );

  const groups = settings?.groups || [];

  const columns = [
    {
      id: "id",
      className: "id",
      width: "10ch",
      header: utils.cellHeader(t("/@word/id")),
      cell: ({ value }) => utils.formatNumber(value),
      footerValue: ({ data }) => data.length,
      footer: ({ value }) => utils.formatNumber(value),
    },
    {
      id: "code",
      header: utils.cellHeader(t("/@word/code")),
      width: "12ch",
    },
    {
      id: "dateTime",
      header: utils.cellHeader(t("/@word/dateTime")),
      width: "18ch",
      cell: ({ value }) => (value ? utils.formatDateTime(value) : null),
    },
    {
      id: "person.id",
      className: "id",
      width: "10ch",
      header: utils.cellHeader(t("/catalog/person/person"), t("/@word/id")),
      cell: ({ value }) => utils.formatNumber(value),
    },
    {
      id: "person.name",
      header: utils.cellHeader(t("/catalog/person/person"), t("/@word/name")),
      width: "30ch",
    },
    {
      id: "person.fantasyName",
      header: utils.cellHeader(t("/catalog/person/person"), t("/@word/fantasyName")),
      width: "30ch",
    },
    {
      id: "person.nameCalc",
      header: utils.cellHeader(t("/catalog/person/person"), t("/@word/nameCalc")),
      width: "30ch",
    },
    {
      id: "workpiece_id",
      header: utils.cellHeader(t("/@word/workpiece_id")),
      width: "10ch",
      className: "id",
      cell: ({ value }) => utils.formatNumber(value),
    },
    {
      id: "workflowNode_code",
      header: utils.cellHeader(t("/@word/name")),
      width: "25ch",
    },
    {
      id: "workflowNode_description",
      header: utils.cellHeader(t("/@word/name")),
      width: "25ch",
    },
    {
      id: "code",
      header: utils.cellHeader(t("/@word/code")),
      width: "15ch",
      cell: ({ row, value }) => <Badge title={row.description}>{value}</Badge>,
    },
    {
      id: "description",
      header: utils.cellHeader(t("/@word/description")),
      width: "20ch",
    },
    {
      id: "workpieceNode_dateTimeStart",
      header: utils.cellHeader(t("/@word/dateTimeStart")),
      width: "18ch",
      cell: ({ value }) => (value ? utils.formatDateTime(value) : null),
    },
    {
      id: "workpieceNode_previousDateTimeStart",
      header: utils.cellHeader(t("/@word/previous_start")),
      width: "18ch",
      cell: ({ value }) => (value ? utils.formatDateTime(value) : null),
    },
    {
      id: "workpieceNode_elapsedSeconds",
      header: utils.cellHeader(t("/@word/elapsed_time")),
      width: "12ch",
      className: "number",
      cell: ({ value }) => (value != null ? formatSecondsToDuration(value) : "-"),
      footerValue: ({ data }) => utils.sum(data, (row) => row.workpieceNode_elapsedSeconds || 0),
      footer: ({ value }) => formatSecondsToDuration(value),
    },
    {
      id: "workpieceNode_runningElapsedSeconds",
      header: utils.cellHeader(t("/@word/running_total")),
      width: "12ch",
      className: "number",
      cell: ({ value }) => (value != null ? formatSecondsToDuration(value) : "-"),
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
        className={`report-container flex v gap ${settings?.pageSize ?? "a4"} ${settings?.orientation}`}
        style={{
          "--width": settings?.width,
          "--height": settings?.height,
          "--margin": settings?.margin,
        }}
        key={data.id}
      >
        <header>
          {/* <section className="title">
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
          </section> */}
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

function formatSecondsToDuration(totalSeconds) {
  if (isNaN(totalSeconds) || totalSeconds < 0) return "0s";

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  const parts = [];

  if (days > 0) parts.push(`${days}d`);
  if (hours > 0 || days > 0) parts.push(`${hours}h`);
  if (minutes > 0 || hours > 0 || days > 0) parts.push(`${minutes}m`);

  if (seconds > 0 || parts.length === 0) {
    parts.push(`${seconds}s`);
  }

  return parts.slice(0, 2).join(" ");
}
