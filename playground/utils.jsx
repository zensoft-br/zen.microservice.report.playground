import React from "react";

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

  return data.sort((a, b) => {
    for (const { columnId, direction = "asc", nulls = "last" } of criteria) {
      const valA = a[columnId];
      const valB = b[columnId];

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

export const Column = () => null;

export const Table = ({ data, visibleColumns, children }) => {
  const columns = React.Children.toArray(children)
    .filter((child) => {
      if (!child) return false;
      if (child.props.visible != null) return child.props.visible;
      if (visibleColumns == null) return true;
      if (child.props.ids && visibleColumns) {
        return child.props.ids.some(id => visibleColumns.includes(id));
      }
      if (child.props.id && visibleColumns) {
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

  return (
    <table>
      <thead>
        <tr>
          {columns.map((col, i) => {
            const context = { row: null, data };

            let className = col.props.headerClassName || col.props.className;
            className = typeof className === "function"
              ? className(context)
              : className;

            return (
              <th key={i} className={className} width={col.props.width || "10ch"}>
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
                <td key={colIndex} className={className} style={col.props.style}>
                  {col.props.cell 
                    ? col.props.cell(context) 
                    : (value ?? null)} 
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
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
              <td key={i} className={className}>
                {col.props.footer ? col.props.footer(context) : null}
              </td>
            );
          })}
        </tr>
      </tfoot>
    </table>
  );
};

export const GroupSections = ({ data, children, groups = [], columns = [], level = 0 }) => {
  if (Array.isArray(data)) {
    return <>{children(data)}</>;
  }

  const entries = Array.from(data.entries());
  
  const currentGroup = groups[level];
  const column = columns.find(c => c.id === currentGroup?.columnId);

  return (
    <>
      {entries.map(([key, value], index) => {
        let displayValue = key;
        if (key !== null) {
          let value = key;
          if (column?.cellValue) {
            value = column.cellValue({ row: { key }, rowIndex: 0, data: [] });
          }
          if (column?.cell) {
            value = column.cell({ value: value, data: [] });
          }

          if (column.header) {
            displayValue = <>{column.header}: {value}</>;
          } else {
            displayValue = value;
          }
        }

        return (
          <section key={key ?? index} className={`group-level-${level + 1}`}>
            {key !== null && (
              <header className="group-header">
                {React.createElement(`h${Math.min(level + 2, 6)}`, {}, displayValue)}
              </header>
            )}
            
            {/* Pass level + 1 to move to the next grouping column */}
            <GroupSections
              data={value} 
              level={level + 1} 
              groups={groups} 
              columns={columns}
            >
              {children}
            </GroupSections>
          </section>
        );
      })}
    </>
  );
};
