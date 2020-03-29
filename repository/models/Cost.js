import * as SQLite from 'expo-sqlite';
import { types } from 'expo-sqlite-orm'
import { BaseModel } from './BaseModel';

export default class Cost extends BaseModel {
  constructor(obj) {
    super(obj)
  }

  static get database() {
    return async () => SQLite.openDatabase('trade.db')
  }

  static get tableName() {
    return 'costs'
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
    const sql = 'SELECT min(total) as "min", max(total) as "max" FROM costs;';
    const rows = await this.repository.databaseLayer.executeSql(sql, []).then(({ rows }) => rows);
    return rows.shift();
  }
}
