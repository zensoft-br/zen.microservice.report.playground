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
  const date = validateDate(value);
  const { 
    locale = options.locale ?? config.locale, 
    timeZone = options.timeZone ?? config.timeZone, 
    ...rest } = options;
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
  const date = validateDate(value);
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
  const date = validateDate(value);
  const { 
    locale = options.locale ?? config.locale, 
    timeZone = options.timeZone ?? config.timeZone, 
    hour = "2-digit", 
    minute = "2-digit", 
    second = "2-digit", 
    hour12 = false,
    ...rest 
  } = options;  try {
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

function validateDate(value) {
  const result = new Date(value);
  return isNaN(result.getTime()) ? null : result;
}