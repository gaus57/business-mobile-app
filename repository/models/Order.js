import * as SQLite from 'expo-sqlite';
import { types } from 'expo-sqlite-orm'
import { BaseModel, relationTypes } from './BaseModel';
import OrderProduct from './OrderProduct';

export default class Order extends BaseModel {
  constructor(obj) {
    super(obj)
  }

  static get database() {
    return async () => SQLite.openDatabase('trade.db')
  }

  static get tableName() {
    return 'orders'
  }

  static get relations() {
    return {
      orderProducts: [relationTypes.MANY, OrderProduct, 'id', 'order_id'],
    }
  }

  static get columnMapping() {
    return {
      id: { type: types.INTEGER, primary_key: true },
      ext_id: { type: types.INTEGER },
      total: { type: types.NUMERIC, not_null: true },
      comment: { type: types.TEXT, not_null: true, default: '' },
      created_at: { type: types.INTEGER, default: () => Date.now() },
      updated_at: { type: types.INTEGER, default: () => Date.now() },
      deleted_at: { type: types.INTEGER },
      synced_at: { type: types.INTEGER },
    }
  }

  static async getTotalRange() {
    const sql = 'SELECT min(total) as "min", max(total) as "max" FROM orders WHERE deleted_at IS NULL;';
    const rows = await this.repository.databaseLayer.executeSql(sql, []).then(({ rows }) => rows);
    return rows.shift();
  }
}
