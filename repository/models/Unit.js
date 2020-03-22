import BaseModel from './BaseModel';

const units = [
  {
    id: 1,
    name: 'шт.',
  },
  {
    id: 2,
    name: 'м.',
  },
  {
    id: 3,
    name: 'кв.м.',
  },
  {
    id: 4,
    name: 'куб.м.',
  },
  {
    id: 5,
    name: 'кг.',
  },
  {
    id: 6,
    name: 'л.',
  },
];

export default class Unit extends BaseModel {
  constructor(obj) {
    super(obj)
  }

  static async query(options) {
    return units;
  }

  static async find(id) {
    for (let unit of units) {
      if (unit.id === id) {
        return {...unit};
      }
    }
    return null;
  }
}
