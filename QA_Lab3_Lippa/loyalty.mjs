/**
 * Базовая политика программы лояльности.
 * @abstract
 */
export class LoyaltyPolicy {
  /**
   * @param {number} pointsPerHundred Целое число баллов за каждые 100 рублей.
   */
  constructor(pointsPerHundred) {
    if (!Number.isInteger(pointsPerHundred) || pointsPerHundred < 0) {
      throw new RangeError('Ставка должна быть целым неотрицательным числом');
    }
    this.pointsPerHundred = pointsPerHundred;
  }

  /**
   * Вычисляет начисление по фактически оплаченной сумме.
   * @param {number} paidKopecks Сумма в копейках, целое неотрицательное число.
   * @returns {number} Начисленные баллы.
   * @throws {RangeError} Если сумма отрицательная или не является целой.
   */
  earn(paidKopecks) {
    if (!Number.isSafeInteger(paidKopecks) || paidKopecks < 0) {
      throw new RangeError('Некорректная сумма оплаты');
    }
    // 100 рублей = 10 000 копеек. Неполная сотня не даёт баллов.
    return Math.floor(paidKopecks / 10000) * this.pointsPerHundred;
  }
}

/**
 * Стандартная политика с начислением пяти баллов за 100 рублей.
 * @extends LoyaltyPolicy
 */
export class StandardPolicy extends LoyaltyPolicy {
  /** Создаёт стандартную политику начисления. */
  constructor() {
    super(5);
  }
}

/**
 * Политика, которая дополнительно начисляет фиксированное число баллов.
 * Доплата применяется только при положительной оплате.
 * @extends StandardPolicy
 */
export class CampaignPolicy extends StandardPolicy {
  /**
   * @param {number} extraPoints Целое неотрицательное число дополнительных баллов.
   * @throws {RangeError} Если количество дополнительных баллов некорректно.
   */
  constructor(extraPoints) {
    super();
    if (!Number.isSafeInteger(extraPoints) || extraPoints < 0) {
      throw new RangeError('Некорректное число дополнительных баллов');
    }
    this.extraPoints = extraPoints;
  }

  /**
   * Добавляет баллы акции к стандартному начислению.
   * @param {number} paidKopecks Сумма в копейках, целое неотрицательное число.
   * @returns {number} Сумма стандартных и дополнительных баллов.
   * @throws {RangeError} Если сумма отрицательная или не является целой.
   */
  earn(paidKopecks) {
    const standard = super.earn(paidKopecks);
    return paidKopecks > 0 ? standard + this.extraPoints : standard;
  }
}

/**
 * Праздничная акция с начислением 15 дополнительных баллов.
 * @extends CampaignPolicy
 */
export class HolidayPolicy extends CampaignPolicy {
  /** Создаёт праздничную политику с фиксированной надбавкой. */
  constructor() {
    super(15);
  }
}
