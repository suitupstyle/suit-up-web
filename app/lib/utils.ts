export const formatCurrency = (amount: number) => {
  return (amount / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
};

export const formatDateToLocal = (
  dateStr: string,
  locale: string = 'en-US',
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

export const isBase64Image = (str: string): boolean => {
  return /^data:image\/(png|jpeg|jpg|gif|webp);base64,/.test(str);
}

export function promisifyWithDelay<T>(
  value: T | (() => T),
  delayMs: number = 0
): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const result = typeof value === "function" ? (value as () => T)() : value;
      resolve(result);
    }, delayMs);
  });
}