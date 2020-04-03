
export function moneyFormat(n) {
  return (n || 0)
    .toFixed(2)
    .replace(/\d(?=(\d{3})+\.)/g, '$&\u00A0');
}
