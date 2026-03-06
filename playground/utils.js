/* eslint-disable no-unused-vars */

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