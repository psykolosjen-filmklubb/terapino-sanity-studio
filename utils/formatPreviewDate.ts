import { currentYearFormatter, pastYearsFormatter } from "./dateFormatters";

export function formatPreviewDate(inputDate?: string) {
  if (!inputDate) return "Ikke satt dato";

  const date = new Date(inputDate);
  const isCurrentYear = date.getFullYear() === new Date().getFullYear();

  return isCurrentYear
    ? currentYearFormatter.format(date)
    : pastYearsFormatter.format(date);
}
