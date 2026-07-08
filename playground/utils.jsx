import React, { useMemo } from "react";

export const config = {
  currency: "BRL",
  locale: "pt-BR",
  timeZone: "America/Sao_Paulo",
};

export function cellHeader(...args) {
  return args.filter(arg => arg != null)
    .map((arg, index) => index === 0 ? arg : String(arg).toLowerCase())
    .join(", ");
}

export function formatCurrency(value, options = {}) {
  if (value == null) return null;
  const {
    locale = options.locale ?? config.locale,
    currency = options.currency ?? config.currency,
    ...rest } = options;
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      ...rest,
    }).format(value);
  } catch (_) {
    return null;
  }
}

export function formatDate(value, options = {}) {
  if (value == null) return null;
  const {
    locale = options.locale ?? config.locale,
    timeZone = options.timeZone ?? config.timeZone,
    ...rest } = options;
  const date = validateDate(value, timeZone);
  try {
    return Intl.DateTimeFormat(locale, {
      timeZone,
      ...rest,
    }).format(date);
  } catch (_) {
    return null;
  }
}

export function formatDateTime(value, options = {}) {
  if (value == null) return null;
  const {
    locale = options.locale ?? config.locale,
    timeZone = options.timeZone ?? config.timeZone,
    year = "numeric",
    month = "2-digit",
    day = "2-digit",
    hour = "2-digit",
    minute = "2-digit",
    second = "2-digit",
    hour12 = false,
    ...rest } = options;
  const date = validateDate(value, timeZone);
  try {
    return Intl.DateTimeFormat(locale, {  
      timeZone,
      year,
      month,
      day,
      hour,
      minute,
      second,
      hour12,
      ...rest,
    }).format(date);
  } catch (_) {
    return null;
  }
}

export function formatNumber(value, options = {}) {
  if (value == null) return null;
  if (options.digits != null) {
    options.minimumFractionDigits = options.digits;
    options.maximumFractionDigits = options.digits;
  }
  const {
    locale = options.locale ?? config.locale,
    ...rest } = options;
  try {
    return new Intl.NumberFormat(locale, {
      ...rest,
    }).format(value);
  } catch (_) {
    return null;
  }
}

export function formatQuantity(value, options = {}) {
  const result = formatNumber(value, options);
  
  return result + (options.unit_code ? ` ${options.unit_code}` : "");
}

export function formatTime(value, options = {}) {
  if (value == null) return null;
  const {
    locale = options.locale ?? config.locale,
    timeZone = options.timeZone ?? config.timeZone,
    hour = "2-digit",
    minute = "2-digit",
    second = "2-digit",
    hour12 = false,
    ...rest } = options;  
  const date = validateDate(value, timeZone);
  try {
    return Intl.DateTimeFormat(locale, {
      timeZone,
      hour,
      minute,
      second,
      hour12,
      ...rest,
    }).format(date);
  } catch (_) {
    return null;
  }
}

export function getVisibleColumns(settings) {
  // User explicitly defined the exact layout and order
  if (settings.overrideColumns?.length) {
    return settings.overrideColumns.filter(col => settings.availableColumns.includes(col));
  }

  const activeSet = new Set(settings.standardColumns?.length ? settings.standardColumns : settings.availableColumns);
  
  settings.addColumns?.forEach(col => activeSet.add(col));
  settings.removeColumns?.forEach(col => activeSet.delete(col));

  return settings.availableColumns.filter(col => activeSet.has(col));
}

export function group(data, groups = []) {
  const root = new Map();

  if (!groups || !groups.length) {
    root.set(null, data);
    return root;
  }

  return data.reduce((acc, item) => {
    let currentLevel = acc;

    groups.forEach(({ columnId }, index) => {
      const key = item[columnId] ?? "";
      const isLastGroup = index === groups.length - 1;

      if (isLastGroup) {
        if (!currentLevel.has(key)) currentLevel.set(key, []);
        currentLevel.get(key).push(item);
      } else {
        if (!currentLevel.has(key)) currentLevel.set(key, new Map());
        currentLevel = currentLevel.get(key);
      }
    });

    return acc;
  }, new Map());
};

export function round(value, decimals = 2) {
  if (value == null) return null;
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

export function sort(data, criteria) {
  const collator = new Intl.Collator(undefined, {
    numeric: true,
    sensitivity: "base",
  });

  const getNestedValue = (obj, path) => {
    return path.split(".").reduce((acc, part) => acc?.[part], obj);
  };

  return data.sort((a, b) => {
    for (const { columnId, direction = "asc", nulls = "last" } of criteria) {
      const valA = getNestedValue(a, columnId);
      const valB = getNestedValue(b, columnId);
      
      const isANull = valA == null || valA === "";
      const isBNull = valB == null || valB === "";

      if (isANull || isBNull) {
        if (isANull && isBNull) continue;
        const result = isANull ? -1 : 1;
        return (nulls === "first" ? result : -result);
      }

      let comparison = 0;
      
      if (valA === valB) continue;

      const numA = Number(valA);
      const numB = Number(valB);

      if (!isNaN(numA) && !isNaN(numB)) {
        comparison = numA - numB;
      } else {
        comparison = collator.compare(String(valA), String(valB));
      }

      if (comparison !== 0) {
        return direction === "desc" ? -comparison : comparison;
      }
    }
    return 0;
  });
};

function validateDate(value, timeZone = config.timeZone) {
  if (value instanceof Date) return value;

  const isDateOnly = typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);

  if (isDateOnly) {
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));

    const utcDate = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
    const tzDate = new Date(date.toLocaleString("en-US", { timeZone }));
    const offset = utcDate.getTime() - tzDate.getTime();

    date.setTime(date.getTime() + offset);
    return date;
  }

  return new Date(value);
}

function hash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

export const Badge = ({ className, children }) => {
  const s = String(children || "").toLowerCase();
  const hashValue = hash(s) % 16 + 1;

  return (
    <div className={`badge c-${hashValue} ${className || ""}`}>
      {children}
    </div>
  );
};

export const Column = () => null;

function getActiveColumns(columns, visibleColumns, children) {
  if (columns) {
    const activeColumns = (visibleColumns && visibleColumns.length > 0)
      ? visibleColumns
        .map(id => columns.find(col => col.id === id))
        .filter(col => col !== undefined)
      : columns;
    return activeColumns.map((column, index) => (
      <Column key={index} {...column} />
    ));
  } else {
    // Legacy support for children as Column elements
    return React.Children.toArray(children)
      .filter((child) => {
        if (!child) return false;
        if (child.props.visible != null) return child.props.visible;
        if (visibleColumns == null) return true;
        if (child.props.ids) {
          return child.props.ids.some(id => visibleColumns.includes(id));
        }
        if (child.props.id) {
          return visibleColumns.includes(child.props.id);
        }
        return false;
      })
      .sort((a, b) => {
        if (visibleColumns) {
          const getMinIndex = (props) => {
            const ids = props.ids || [props.id];
            const indices = ids.map(id => visibleColumns.indexOf(id)).filter(idx => idx !== -1);
            return indices.length > 0 ? Math.min(...indices) : Number.MAX_SAFE_INTEGER;
          };
          return getMinIndex(a.props) - getMinIndex(b.props);
        }
        return (a.props.order ?? 0) - (b.props.order ?? 0);
      });
  }
}

function getColumnsStyles(activeColumns) {
  const columnBases = activeColumns.map(col => {
    if (typeof col.props.width === "string" && col.props.width.endsWith("ch")) {
      return parseInt(col.props.width, 10);
    }
    return 9;
  });

  const screenColumns = activeColumns.map((col, index) => {
    const base = columnBases[index];
    const max = base * 2;

    if (base >= 20) {
      return `minmax(${base}ch, 1fr)`;
    }

    return `fit-content(${max}ch)`;
  }).join(" ");

  const printColumns = columnBases.map(base => `minmax(0, ${base}fr)`).join(" ");

  // return { screenColumns: printColumns, printColumns };

  return {
    "--screen-cols": printColumns,
    "--print-cols": printColumns,
  };
}

export const TableContainer = ({ className, columns, visibleColumns, children }) => {
  const activeColumns = useMemo(() =>
    getActiveColumns(columns, visibleColumns),
  [columns, visibleColumns, children]);

  const columnStyles = useMemo(() => {
    return getColumnsStyles(activeColumns);
  }, [activeColumns]);

  return (
    <div className={`table-container ${className || ""}`.trim()}
      style={columnStyles}>
      {children}
    </div>
  );
};

const HeaderRow = ({ activeColumns, data }) => (
  <tr className="column-headers">
    {activeColumns.map((col, i) => {
      const context = { row: data[0], data };

      let headerClass = col.props.headerClassName || col.props.className;
      headerClass = typeof headerClass === "function" ? headerClass(context) : headerClass;

      let header = typeof col.props.header === "function" ? col.props.header(context) : col.props.header;

      return (
        <th key={i} className={headerClass} scope="col">
          {header}
        </th>
      );
    })}
  </tr>
);

const FooterRow = ({ data, activeColumns, className: customClassName, level }) => {
  return (
    <>
      {activeColumns.map((col, i) => {
        let value = undefined;
        if (typeof col.props.footerValue === "function") {
          value = col.props.footerValue({ data, level });
        }
        const context = { row: null, data, value, level };

        let className = col.props.footerClassName || col.props.className;
        className = typeof className === "function" ? className(context) : className;
        
        const combinedClass = [className, customClassName].filter(Boolean).join(" ");

        return (
          <td key={i} className={combinedClass}>
            {col.props.footer ? col.props.footer(context) : null}
          </td>
        );
      })}
    </>
  );
};

const Groups = ({ columns = [], visibleColumns, groups = [], data, level = 0, activeColumns }) => {
  if (level >= groups.length || !data || data.length === 0) {
    return (
      <>
        {data.map((row, rowIndex) => { 
          const stripeClass = rowIndex % 2 === 0 ? "data-row-even" : "data-row-odd";

          return (
            <tr key={rowIndex} className={stripeClass} style={{ "--level": level }}>
              {activeColumns.map((col, colIndex) => {
                let value = undefined;
                if (typeof col.props.cellValue === "function") {
                  value = col.props.cellValue({ row, rowIndex, data });
                } else if (col.props.id) {
                  value = row[col.props.id];
                }

                const context = { row, rowIndex, data, value };
                let className = col.props.className;
                className = typeof className === "function" ? className(context) : className;

                return (
                  <td key={colIndex} className={className}>
                    {col.props.cell ? col.props.cell(context) : (value ?? null)}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </>
    );
  }

  const currentGroupConfig = groups[level];
  const groupColumn = columns.find(c => c.id === currentGroupConfig?.columnId);

  const shouldRenderHeader = currentGroupConfig?.showHeader !== undefined
    ? currentGroupConfig.showHeader
    : level === groups.length - 1;

  const fn = (row) => {
    if (groupColumn?.cellValue) {
      return groupColumn.cellValue({ row, rowIndex: 0, data });
    }
    return row[groupColumn?.id];
  };

  const uniqueKeys = useMemo(() => {
    const keys = data.map((row, index) => {
      return fn(row);
    });
    return Array.from(new Set(keys));
  }, [data, groupColumn]);

  const totalCols = activeColumns.length;

  return (
    <>
      {uniqueKeys.map((key, index) => {
        const filteredGroupData = data.filter(row => fn(row) === key);

        let displayValue = key;
        if (key !== null && key !== undefined) {
          let val = key;
          if (groupColumn?.cellValue) {
            val = groupColumn.cellValue({ row: filteredGroupData[0], rowIndex: 0, data: filteredGroupData });
          }
          if (groupColumn?.cell) {
            val = groupColumn.cell({ row: filteredGroupData[0], rowIndex: 0, value: val, data: filteredGroupData });
          }
          displayValue = val;
        }

        const RowContent = (
          <>
            {key !== null && key !== undefined && (
              <tr className={`group-header level-${level + 1}`} style={{ "--level": level }}>
                <th colSpan={totalCols} scope="rowgroup" style={{ textAlign: "left" }}>
                  {groupColumn?.header ? <>{groupColumn.header}:&nbsp;{displayValue}</> : displayValue}
                </th>
              </tr>
            )}

            {shouldRenderHeader && (
              <HeaderRow activeColumns={activeColumns} data={filteredGroupData} />
            )}

            <Groups
              data={filteredGroupData}
              level={level + 1}
              groups={groups}
              columns={columns}
              visibleColumns={visibleColumns}
              activeColumns={activeColumns}
            />

            {/* Clean Group Footer Stack */}
            {key !== null && key !== undefined && (
              <>
                {level < groups.length - 1 && (
                  <tr className={`group-footer level-${level + 1}`} style={{ "--level": level }}>
                    <th colSpan={totalCols} scope="rowgroup">
                      <div className={`level-${level + 1}`}>{"≡".repeat(level + 1)} {groupColumn?.header}</div>
                    </th>
                  </tr>
                )}

                <tr className={`group-footer-values level-${level + 1}`} style={{ "--level": level }}>
                  <FooterRow 
                    data={filteredGroupData} 
                    activeColumns={activeColumns}
                    level={level + 1}
                  />
                </tr>
              </>
            )}
          </>
        );

        return level === 0 ? (
          <tbody key={index} className={`group level-${level + 1}`}>
            {RowContent}
          </tbody>
        ) : (
          <React.Fragment key={index}>
            {RowContent}
          </React.Fragment>
        );
      })}
    </>
  );
};

export const Table = ({ className, columns, visibleColumns, groups, data, footerTitle, children }) => {
  const activeColumns = useMemo(() =>
    getActiveColumns(columns, visibleColumns, children),
  [columns, visibleColumns, children]);

  const columnStyles = useMemo(() => {
    return getColumnsStyles(activeColumns);
  }, [activeColumns]);

  const hasGroups = groups && groups.length > 0;

  return (
    <table className={className} style={columnStyles}>
      {!hasGroups && (
        <thead>
          <HeaderRow activeColumns={activeColumns} data={data} />
        </thead>
      )}

      {hasGroups ? (
        <Groups
          data={data}
          groups={groups}
          columns={columns}
          visibleColumns={visibleColumns}
          activeColumns={activeColumns}
        />
      ) : (
        <tbody>
          {data.map((row, rowIndex) => {
            const stripeClass = rowIndex % 2 === 0 ? "data-row-even" : "data-row-odd";
            return (
              <tr key={rowIndex} className={stripeClass} style={{ "--level": 0 }}>
                {activeColumns.map((col, colIndex) => {
                  let value = undefined;
                  if (typeof col.props.cellValue === "function") {
                    value = col.props.cellValue({ row, rowIndex, data });
                  } else if (col.props.id) {
                    value = row[col.props.id];
                  }
                  const context = { row, rowIndex, data, value };
                  return (
                    <td key={colIndex} className={col.props.className}>
                      {col.props.cell ? col.props.cell(context) : (value ?? null)}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      )}

      <tfoot>
        {footerTitle && (
          <tr className={"group-footer level-0"} style={{ "--level": 0 }}>
            <th colSpan={activeColumns.length} scope="rowgroup">
              <div className={"level-0"}>{footerTitle}</div>
            </th>
          </tr>
        )}
        <tr className={"group-footer-values level-0"} style={{ "--level": 0 }}>
          <FooterRow 
            data={data} 
            activeColumns={activeColumns} 
            prefix={hasGroups ? "≡ " : ""} 
            level={0}
          />
        </tr>
      </tfoot>
    </table>
  );
};

const aggregateBy = (data, groupFn, valueFn, operation) => {
  if (!Array.isArray(data)) return {};

  // Step 1: Group into arrays of numbers
  const grouped = data.reduce((acc, item) => {
    const groupKey = groupFn(item);
    const val = Number(valueFn(item));
    if (groupKey && !isNaN(val)) {
      (acc[groupKey] ??= []).push(val);
    }
    return acc;
  }, {});

  // Step 2: Run the specific math operation
  return Object.fromEntries(
    Object.entries(grouped).map(([key, values]) => {
      if (values.length === 0) return [key, 0];
      return [key, operation(values)];
    }),
  );
};

export const sum = (data, valueFn) => {
  if (!Array.isArray(data)) return 0;
  return data.reduce((acc, item) => acc + (Number(valueFn(item)) || 0), 0);
};

export const sumBy = (data, groupFn, valueFn) =>
  aggregateBy(data, groupFn, valueFn, (vals) => vals.reduce((a, b) => a + b, 0));

export const avgBy = (data, groupFn, valueFn) =>
  aggregateBy(data, groupFn, valueFn, (vals) => vals.reduce((a, b) => a + b, 0) / vals.length);

export const minBy = (data, groupFn, valueFn) =>
  aggregateBy(data, groupFn, valueFn, (vals) => Math.min(...vals));

export const maxBy = (data, groupFn, valueFn) =>
  aggregateBy(data, groupFn, valueFn, (vals) => Math.max(...vals));

export const renderAggr = (value, formatFn) => {
  if (!value || typeof value !== "object") return null;

  return Object.entries(value).map(([key, value]) => (
    <div key={key} className="footer-grouped-row">
      {formatFn ? formatFn(value, key) : `${value} ${key}`}
    </div>
  ));
};