import * as SQLite from 'expo-sqlite';
import { types } from 'expo-sqlite-orm'
import { BaseModel, relationTypes } from './BaseModel';
import Unit from './Unit';

export default class Product extends BaseModel {
  constructor(obj) {
    super(obj)
  }

  static get database() {
    return async () => SQLite.openDatabase('trade.db')
  }

  static get tableName() {
    return 'products'
  }

  static get relations() {
    return {
      unit: [relationTypes.ONE, Unit, 'unit_id', 'id'],
    }
  }

  static get columnMapping() {
    return {
      id: { type: types.INTEGER, primary_key: true },
      ext_id: { type: types.INTEGER },
      name: { type: types.TEXT, not_null: true },
      price: { type: types.NUMERIC },
      unit_id: { type: types.INTEGER, not_null: true },
      created_at: { type: types.INTEGER, default: () => Date.now() },
      updated_at: { type: types.INTEGER, default: () => Date.now() },
      synced_at: { type: types.INTEGER },
    }
  }

  static async getPriceRange() {
    const sql = 'SELECT min(price) as "min", max(price) as "max" FROM products;';
    const rows = await this.repository.databaseLayer.executeSql(sql, []).then(({ rows }) => rows);
    return rows.shift();
  }

  static async getTotal({price, name}) {
    const where = [];
    const params = [];
    if (price) {
      where.push('"price" >= ?', '"price" <= ?');
      params.push(price[0], price[1]);
    }
    if (name) {
      where.push('"name" LIKE ?');
      params.push(`%${name}%`);
    }
    let sql = 'SELECT count(*) as "count" FROM products';
    if (where) {
      sql = sql + ` WHERE ${where.join(' AND ')}`
    }
    const rows = await this.repository.databaseLayer.executeSql(sql, params).then(({ rows }) => rows);
    return rows.shift()['count'];
  }
}
