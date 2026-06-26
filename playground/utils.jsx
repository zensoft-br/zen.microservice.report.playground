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

export const Badge = ({ children }) => {
  const s = String(children || "").toLowerCase();
  const hashValue = hash(s) % 16 + 1;

  return (
    <div className={`badge c-${hashValue}`}>
      {children}
    </div>
  );
};

const getSortedActiveColumns = (children, visibleColumns) => {
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
};

export const Column = () => null;

export const GroupSections = ({
  data,
  children, 
  groups = [], 
  columns = [], 
  visibleColumns,
  level = 0, 
  tableClassName,
  t,
}) => {
  if (level >= groups.length || !data || data.length === 0) {
    return <>{children(data)}</>;
  }

  const currentGroupConfig = groups[level];
  const groupColumn = columns.find(c => c.id === currentGroupConfig?.columnId);

  const uniqueKeys = useMemo(() => {
    const keys = data.map(row => row[groupColumn?.id]);
    return Array.from(new Set(keys));
  }, [data, groupColumn]);

  // Helper template to instantiate Column elements consistently
  const renderColumns = () => 
    columns.map((column, index) => <Column key={index} {...column} />);

  return (
    <>
      {uniqueKeys.map((key, index) => {
        const filteredGroupData = data.filter(row => row[groupColumn?.id] === key);

        let displayValue = key;
        if (key !== null && key !== undefined) {
          let val = key;
          if (groupColumn?.cellValue) {
            val = groupColumn.cellValue({ row: filteredGroupData[0], rowIndex: 0, data: filteredGroupData });
          }
          if (groupColumn?.cell) {
            val = groupColumn.cell({ value: val, data: filteredGroupData });
          }
          displayValue = groupColumn?.header ? <>{groupColumn.header}: {val}</> : val;
        }

        return (
          <section key={index} className={`group level-${level + 1}`}>
            {key !== null && key !== undefined && (
              <header className={`group-header level-${level + 1}`}>
                {displayValue}
              </header>
            )}
            
            <GroupSections
              data={filteredGroupData} 
              level={level + 1} 
              groups={groups} 
              columns={columns}
              visibleColumns={visibleColumns}
              tableClassName={tableClassName}
              t={t}
            >
              {children}
            </GroupSections>

            {/* OPTIMIZED: Reusing the standard Footer component for group sub-footers */}
            {key !== null && key !== undefined && (
              <footer className="group-footer">
                {level < groups.length - 1 ? <div className={`level-${level + 1}`}>{t("/@word/summary")}: {displayValue}</div> : null}
                <Footer 
                  className={tableClassName} 
                  data={filteredGroupData} 
                  visibleColumns={visibleColumns}
                >
                  {renderColumns()}
                </Footer>
              </footer>
            )}
          </section>
        );
      })}
    </>
  );
};

export const GroupTable = ({ className, columns, visibleColumns, data, groups, t }) => {
  const renderColumns = () => 
    columns.map((column, index) => <Column key={index} {...column} />);

  return (
    <>
      <GroupSections
        columns={columns}
        visibleColumns={visibleColumns}
        data={data}
        groups={groups}
        tableClassName={className}
        t={t}
      >
        {(groupData) => (
          <Table className={className} data={groupData} visibleColumns={visibleColumns}>
            {renderColumns()}
          </Table>
        )}
      </GroupSections>

      <h2>{t("/@word/summary")}</h2>
      
      <Footer className={className} data={data} visibleColumns={visibleColumns}>
        {renderColumns()}
      </Footer>
    </>
  );
};

export const Table = ({ className, data, visibleColumns, children }) => {
  const columns = useMemo(() => 
    getSortedActiveColumns(children, visibleColumns), 
  [children, visibleColumns],
  );

  return (
    <table className={className}>
      <thead>
        <tr>
          {columns.map((col, i) => {
            const context = { row: null, data };

            let className = col.props.headerClassName || col.props.className;
            className = typeof className === "function"
              ? className(context)
              : className;

            return (
              <th key={i} className={className} style={{ width: col.props.width || "10ch", minWidth: col.props.width || "10ch", maxWidth: col.props.width || "10ch" }}>
                {col.props.header}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map((col, colIndex) => { 
              let value = undefined;

              if (typeof col.props.cellValue === "function") {
                value = col.props.cellValue({ row, rowIndex, data });
              } else if (col.props.id) {
                value = row[col.props.id];
              }

              const context = { row, rowIndex, data, value };

              let className = col.props.className;
              className = typeof className === "function"
                ? className(context)
                : className;
    
              return (
                <td key={colIndex} className={className} style={{ width: col.props.width || "10ch", minWidth: col.props.width || "10ch", maxWidth: col.props.width || "10ch" }}>
                  {col.props.cell 
                    ? col.props.cell(context) 
                    : (value ?? null)} 
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export const Footer = ({ className, data, visibleColumns, children }) => {
  const columns = useMemo(() => 
    getSortedActiveColumns(children, visibleColumns), 
  [children, visibleColumns],
  );

  return (
    <table className={className}>
      <tfoot>
        <tr>
          {columns.map((col, i) => {
            let value = undefined;

            if (typeof col.props.footerValue === "function") {
              value = col.props.footerValue({ data });
            }

            const context = { row: null, data, value };

            let className = col.props.footerClassName || col.props.className;
            className = typeof className === "function"
              ? className(context)
              : className;

            return (
              <td key={i} className={className} style={{ width: col.props.width || "10ch", minWidth: col.props.width || "10ch", maxWidth: col.props.width || "10ch" }}>
                {col.props.footer ? col.props.footer(context) : null}
              </td>
            );
          })}
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