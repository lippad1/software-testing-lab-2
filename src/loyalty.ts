export function purchase(total: number, requested: number, balance: number) {
  if (![total, requested, balance].every(Number.isSafeInteger) || total <= 0 || total > 100000000 || requested < 0 || balance < 0) throw new Error('Проверьте сумму покупки и количество бонусов.');
  // Money is in kopecks. One point is one ruble; only whole points are spent.
  const spent = Math.min(requested, balance, Math.floor(total * 30 / 10000));
  const paid = total - spent * 100;
  const earned = Math.floor(paid / 10000) * 5;
  return { spent, paid, earned, balance: balance - spent + earned };
}
