export function matchesCondition(item, condition) {
  const rawValue = item[condition.field];
  const filterValue = condition.value;

  const value =
    rawValue === null || rawValue === undefined
      ? ""
      : rawValue;

  const normalizedValue = String(value).toLowerCase().trim();
  const normalizedFilter = String(filterValue ?? "")
    .toLowerCase()
    .trim();

  switch (condition.operator) {
    case "equals":
      return normalizedValue === normalizedFilter;

    case "not_equals":
      return normalizedValue !== normalizedFilter;

    case "contains":
      return normalizedValue.includes(normalizedFilter);

    case "not_contains":
      return !normalizedValue.includes(normalizedFilter);

    case "starts_with":
      return normalizedValue.startsWith(normalizedFilter);

    case "ends_with":
      return normalizedValue.endsWith(normalizedFilter);

    case "greater_than":
      return Number(value) > Number(filterValue);

    case "greater_than_or_equal":
      return Number(value) >= Number(filterValue);

    case "less_than":
      return Number(value) < Number(filterValue);

    case "less_than_or_equal":
      return Number(value) <= Number(filterValue);

    case "is_empty":
      return normalizedValue === "";

    case "is_not_empty":
      return normalizedValue !== "";

    default:
      return true;
  }
}