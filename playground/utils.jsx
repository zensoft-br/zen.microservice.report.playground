/* eslint-disable no-unused-vars */

import React from "react";

export const config = {
  currency: "BRL",
  locale: "pt-BR",
  timeZone: "America/Sao_Paulo",
};

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

export function round(value, decimals = 2) {
  if (value == null) return null;
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

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

            const baseClassName = col.props.headerClassName || col.props.className;
      
            const className = typeof baseClassName === "function"
              ? baseClassName(context)
              : baseClassName;

            return (
              <th key={i} className={className}>
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

              const className = typeof col.props.className === "function" 
                ? col.props.className(context)
                : col.props.className;
    
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

            const className = typeof col.props.className === "function" 
              ? col.props.className(context)
              : col.props.className;

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