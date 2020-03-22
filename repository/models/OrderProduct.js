import * as SQLite from 'expo-sqlite';
import { types } from 'expo-sqlite-orm'
import BaseModel, {relationTypes} from './BaseModel';
import Product from './Product';
import Unit from './Unit';

export default class OrderProduct extends BaseModel {
  constructor(obj) {
    super(obj)
  }

  static get database() {
    return async () => SQLite.openDatabase('trade.db')
  }

  static get tableName() {
    return 'order_products'
  }

   static get relations() {
    return {
      product: [relationTypes.ONE, Product, 'product_id', 'id'],
      unit: [relationTypes.ONE, Unit, 'unit_id', 'id'],
    }
  }

  static get columnMapping() {
    return {
      id: { type: types.INTEGER, primary_key: true },
      ext_id: { type: types.INTEGER },
      order_id: { type: types.INTEGER, not_null: true },
      product_id: { type: types.INTEGER, not_null: true },
      unit_id: { type: types.INTEGER, not_null: true },
      price: { type: types.NUMERIC, not_null: true },
      qty: { type: types.NUMERIC, not_null: true },
      created_at: { type: types.INTEGER, default: () => Date.now() },
      updated_at: { type: types.INTEGER, default: () => Date.now() },
      synced_at: { type: types.INTEGER },
    }
  }
}
