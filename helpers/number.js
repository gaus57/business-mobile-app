
export function moneyFormat(n) {
  return (n)
    .toFixed(2)
    .replace(/\d(?=(\d{3})+\.)/g, '$&\u00A0');
}
