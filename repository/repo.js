import Product from "./models/Product";
import Order from './models/Order';
import OrderProduct from './models/OrderProduct';
import Cost from './models/Cost';
import Unit from './models/Unit';

function prepareOrdersQuery({filters, sort, page = 1, limit = 20}) {
  const options = {
    columns: '*',
    where: {},
    page: page,
    limit: limit,
    order: 'created_at DESC',
  };
  if (filters.deleted_at) {
    options.where.deleted_at_notnull = null;
  } else {
    options.where.deleted_at_null = null;
  }
  if (filters.total) {
    if (filters.total[0]) {
      options.where.total_gteq = filters.total[0];
    }
    if (filters.total[1]) {
      options.where.total_lteq = filters.total[1];
    }
  }
  if (filters.created_at) {
    if (filters.created_at[0]) {
      options.where.created_at_gteq = filters.created_at[0];
    }
    if (filters.created_at[1]) {
      options.where.created_at_lteq = filters.created_at[1];
    }
  }
  if (filters.search) {
    options.where.id_eq = Number.parseInt(filters.search, 10);
  }
  return options;
}

const GetOrders = async (params) => {
  const orders = await Order.query(prepareOrdersQuery(params));
  await Order.loadRelations(orders, [
    'orderProducts.product',
    'orderProducts.unit',
  ]);

  return orders;
};

const GetOrdersTotal = async ({filters}) => {
  const {where} = prepareOrdersQuery({filters});
  const rows = await Order.query({where, columns: 'COUNT(*) as "total"'});
  return rows.shift()["total"];
};

const GetOrder = async (id) => {
  const order = await Order.find(id);
  if (order) {
    await Order.loadRelations([order], [
      'orderProducts.product',
      'orderProducts.unit',
    ]);
  }

  return order;
};

const CreateOrder = async (data) => {
  const order = new Order(data);
  await order.save();
  await Promise.all(data.orderProducts.map(orderProduct => (new OrderProduct({...orderProduct, order_id: order.id, qty: orderProduct.qty || 1})).save()
  ));
  return order;
};

const UpdateOrder = async (data) => {
  data.updated_at = Date.now();
  const order = await Order.update(data);
  order.orderProducts = await Promise.all(data.orderProducts.map(orderProduct => {
    return new Promise(async (resolve, _) => {
      let item;
      if (orderProduct.id) {
        item = {...orderProduct, qty: orderProduct.qty || 1, updated_at: Date.now()}
        await OrderProduct.update(item);
      } else {
        item = await (new OrderProduct({...orderProduct, order_id: data.id, qty: orderProduct.qty || 1})).save();
      }
      resolve(item);
    });
  }));
  if (!order.orderProducts.length) {
    const deleted = await OrderProduct.query({where: {order_id_eq: data.id}});
    await Promise.all(deleted.map(item => OrderProduct.destroy(item.id)));
  } else {
    const deleted = await OrderProduct.query({where: {order_id_eq: data.id, id_nin: order.orderProducts.map(orderProduct => orderProduct.id)}});
    await Promise.all(deleted.map(item => OrderProduct.destroy(item.id)));
  }

  return order;
};

const RemoveOrder = async (id) => {
  return await Order.update({id, deleted_at: Date.now(), updated_at: Date.now()});
};

const RepairOrder = async (id) => {
  return await Order.update({id, deleted_at: null, updated_at: Date.now()});
};

const GetOrdersTotalRange = async () => {
  return await Order.getTotalRange();
};

function prepareProductsQuery({filters = {}, sort, page = 1, limit = 20}) {
  const options = {
    columns: '*',
    where: {},
    page: page,
    limit: limit,
    order: 'name ASC'
  };
  if (filters.deleted_at) {
    options.where.deleted_at_notnull = null;
  } else {
    options.where.deleted_at_null = null;
  }
  if (filters.price) {
    if (filters.price[0]) {
      options.where.price_gteq = filters.price[0];
    }
    if (filters.price[1]) {
      options.where.price_lteq = filters.price[1];
    }
  }
  if (filters.name) {
    options.where.name_cont = `%${filters.name}%`;
  }

  return options
}

const GetProducts = async (params) => {
  const products = await Product.query(prepareProductsQuery(params));
  await Product.loadRelations(products, ['unit']);

  return products
};

const GetProductsTotal = async ({filters}) => {
  const {where} = prepareProductsQuery({filters});
  const rows = await Product.query({where, columns: 'COUNT(*) as "price"'});
  return rows.shift()["price"];
};

const GetProduct = async (id) => {
  const product = await Product.find(id);
  if (product && product.unit_id) {
    product.unit = await GetUnit(product.unit_id)
  }

  return product
};

const CreateProduct = async (data) => {
  const product = new Product(data);
  await product.save();

  return product;
};

const UpdateProduct = async (data) => {
  return await Product.update({...data, updated_at: Date.now()});
};

const RemoveProduct = async (id) => {
  return await Product.update({id, deleted_at: Date.now(), updated_at: Date.now()});
};

const RepairProduct = async (id) => {
  return await Product.update({id, deleted_at: null, updated_at: Date.now()});
};

const GetProductPriceRange = async () => {
  return await Product.getPriceRange();
};

function prepareCostsQuery({filters = {}, sort, page = 1, limit = 20}) {
  const options = {
    columns: '*',
    where: {deleted_at_null: null},
    page: page,
    limit: limit,
    order: 'created_at DESC'
  };
  if (filters.deleted_at) {
    options.where.deleted_at_notnull = null;
  } else {
    options.where.deleted_at_null = null;
  }
  if (filters.total) {
    if (filters.total[0]) {
      options.where.total_gteq = filters.total[0];
    }
    if (filters.total[1]) {
      options.where.total_lteq = filters.total[1];
    }
  }
  if (filters.created_at) {
    if (filters.created_at[0]) {
      options.where.created_at_gteq = filters.created_at[0];
    }
    if (filters.created_at[1]) {
      options.where.created_at_lteq = filters.created_at[1];
    }
  }
  if (filters.comment) {
    options.where.comment_cont = `%${filters.comment}%`;
  }

  return options
}

const GetCosts = async (params) => {
  return await Cost.query(prepareCostsQuery(params));
};

const GetCostsTotal = async ({filters}) => {
  const {where} = prepareCostsQuery({filters});
  const rows = await Cost.query({where, columns: 'COUNT(*) as "total"'});
  return rows.shift()["total"];
};

const GetCost = async (id) => {
  return await Cost.find(id);
};

const CreateCost = async (data) => {
  const cost = new Cost(data);
  await cost.save();

  return cost;
};

const UpdateCost = async (data) => {
  return await Cost.update({...data, updated_at: Date.now()});
};

const RemoveCost = async (id) => {
  return await Cost.update({id, deleted_at: Date.now(), updated_at: Date.now()});
};

const RepairCost = async (id) => {
  return await Cost.update({id, deleted_at: null, updated_at: Date.now()});
};

const GetCostTotalRange = async () => {
  return await Cost.getTotalRange();
};

const GetUnits = async () => {
  return await Unit.query();
};

const GetUnit = async (id) => {
  return await Unit.find(id);
};

const GetOrderCreatedAtRange = async () => {
  const sql = `SELECT MIN(created_at) as "min", MAX(created_at) as "max" FROM "orders" WHERE deleted_at IS NULL;`;
  const params = [];
  const rows = await Order.repository.databaseLayer.executeSql(sql, params).then(({rows}) => rows);
  return rows.shift();
};

const GetCostCreatedAtRange = async () => {
  const sql = `SELECT MIN(created_at) as "min", MAX(created_at) as "max" FROM "costs" WHERE deleted_at IS NULL;`;
  const params = [];
  const rows = await Order.repository.databaseLayer.executeSql(sql, params).then(({rows}) => rows);
  return rows.shift();
};

const GetStatOrdersTotal = async (from, to) => {
  let sql = `SELECT strftime('%Y', created_at/1000, 'unixepoch') as "year",  strftime('%m', created_at/1000, 'unixepoch') as "month", SUM(total) as "value" FROM orders WHERE deleted_at IS NULL AND created_at >= ${from} AND created_at <= ${to} GROUP BY year, month ORDER BY year DESC, month DESC;`;
  const params = [];

  return await Order.repository.databaseLayer.executeSql(sql, params).then(({rows}) => rows);
};

const GetStatCostsTotal = async (from, to) => {
  let sql = `SELECT strftime('%Y', created_at/1000, 'unixepoch') as "year",  strftime('%m', created_at/1000, 'unixepoch') as "month", SUM(total) as "value" FROM costs WHERE deleted_at IS NULL AND created_at >= ${from} AND created_at <= ${to} GROUP BY year, month ORDER BY year DESC, month DESC;`;
  const params = [];

  return await Cost.repository.databaseLayer.executeSql(sql, params).then(({rows}) => rows);
};

const GetStatProductsTotals = async (from, to) => {
  const where = ['o.deleted_at IS NULL'];
  const params = [];
  if (from) {
    where.push(`o.created_at >= ?`);
    params.push(from);
  }
  if (to) {
    where.push(`o.created_at < ?`);
    params.push(to);
  }
  const sql = `SELECT p.id as id, p.name as label, p.unit_id as unit_id, SUM(op.qty) as qty, SUM(op.price * op.qty) as y FROM order_products op INNER JOIN products p ON op.product_id = p.id INNER JOIN orders o ON op.order_id = o.id ${where.length > 0 ? ' WHERE ' + where.join(' AND ') : '' } GROUP BY label ORDER BY y DESC;`;

  const items = await OrderProduct.repository.databaseLayer.executeSql(sql, params).then(({rows}) => rows);
  await Product.loadRelations(items, ['unit']);
  return items;
};

const GetStatProductTotals = async (ids, from, to) => {
  const where = [`op.product_id IN(${ids.map(i=>'?').join(', ')})`, 'deleted_at IS NULL'];
  const params = [...ids];
  if (from) {
    where.push(`o.created_at >= ?`);
    params.push(from);
  }
  if (to) {
    where.push(`o.created_at < ?`);
    params.push(to);
  }
  let sql = `SELECT op.product_id as product_id, strftime('%Y', o.created_at/1000, 'unixepoch') as "year",  strftime('%m', o.created_at/1000, 'unixepoch') as "month", SUM(op.qty) as qty, SUM(op.price * op.qty) as "total" FROM order_products op INNER JOIN orders o ON op.order_id = o.id ${where.length > 0 ? ' WHERE ' + where.join(' AND ') : '' } GROUP BY product_id, year, month ORDER BY year, month;`;

  const items = await OrderProduct.repository.databaseLayer.executeSql(sql, params).then(({rows}) => rows);
  await OrderProduct.loadRelations(items, ['product.unit']);
  return items;
};

const Migrate = async () => {
  await Product.createTable();
  await Order.createTable();
  await OrderProduct.createTable();
  await Cost.createTable();
  // await Unit.createTable();
};

export default {
  Migrate,
  GetOrders,
  GetOrder,
  CreateOrder,
  UpdateOrder,
  RemoveOrder,
  RepairOrder,
  GetOrdersTotal,
  GetOrdersTotalRange,
  GetProducts,
  GetProduct,
  CreateProduct,
  UpdateProduct,
  RemoveProduct,
  RepairProduct,
  GetProductPriceRange,
  GetProductsTotal,
  GetCosts,
  GetCost,
  CreateCost,
  UpdateCost,
  RemoveCost,
  RepairCost,
  GetCostsTotal,
  GetCostTotalRange,
  GetUnits,
  GetUnit,
  GetOrderCreatedAtRange,
  GetCostCreatedAtRange,
  GetStatOrdersTotal,
  GetStatCostsTotal,
  GetStatProductsTotals,
  GetStatProductTotals,
};
