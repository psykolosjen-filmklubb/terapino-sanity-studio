export const currentYearFormatter = new Intl.DateTimeFormat("nb-NO", {
  day: "numeric",
  month: "long",
});

export const pastYearsFormatter = new Intl.DateTimeFormat("nb-NO", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export const monthYearFormatter = new Intl.DateTimeFormat("nb-NO", {
  year: "numeric",
  month: "long",
});
