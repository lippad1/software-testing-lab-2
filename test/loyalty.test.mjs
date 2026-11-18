import test from 'node:test';
import assert from 'node:assert/strict';
import { purchase } from '../src/loyalty.ts';

test('Без списания начисляет баллы за полные сотни рублей', () => {
  assert.deepEqual(purchase(24999, 0, 20), {
    spent: 0, paid: 24999, earned: 10, balance: 30,
  });
});

test('Списывает запрошенные баллы в пределах ограничений', () => {
  assert.deepEqual(purchase(20000, 25, 80), {
    spent: 25, paid: 17500, earned: 5, balance: 60,
  });
});

test('Ограничивает списание остатком бонусов', () => {
  assert.deepEqual(purchase(50000, 100, 40), {
    spent: 40, paid: 46000, earned: 20, balance: 20,
  });
});

test('Ограничивает списание тридцатью процентами', () => {
  assert.deepEqual(purchase(50000, 200, 300), {
    spent: 150, paid: 35000, earned: 15, balance: 165,
  });
});

test('Округляет максимальное списание вниз до целого балла', () => {
  assert.equal(purchase(10199, 100, 100).spent, 30);
});

test('Не начисляет баллы, если после списания оплачено меньше 100 рублей', () => {
  assert.deepEqual(purchase(12000, 30, 30), {
    spent: 30, paid: 9000, earned: 0, balance: 0,
  });
});

test('На границе 100 рублей начисляет ровно пять баллов', () => {
  assert.equal(purchase(10000, 0, 0).earned, 5);
});

test('Отклоняет нулевую сумму покупки', () => {
  assert.throws(() => purchase(0, 0, 0), /Проверьте сумму/);
});

test('Отклоняет дробное количество запрошенных баллов', () => {
  assert.throws(() => purchase(20000, 1.5, 10), /Проверьте сумму/);
});

test('Отклоняет отрицательный остаток баллов', () => {
  assert.throws(() => purchase(20000, 0, -1), /Проверьте сумму/);
});
