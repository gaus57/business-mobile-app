import Product from "./models/Product";
import Order from './models/Order';
import OrderProduct from './models/OrderProduct';
import Cost from './models/Cost';
import Unit from './models/Unit';

const GetOrders = async ({filters, sort, page = 1, limit = 20}) => {
  const options = {
    columns: '*',
    where: {},
    page: page,
    limit: limit,
    order: 'id DESC',
  };
  if (filters.total) {
    options.where.total_gteq = filters.total[0];
    options.where.total_lteq = filters.total[1];
  }
  if (filters.search) {
    options.where.id_eq = Number.parseInt(filters.search, 10);
  }
  // console.log('GetOrders', options);

  const orders = await Order.query(options);
  await Order.loadRelations(orders, [
    'orderProducts.product',
    'orderProducts.unit',
  ]);

  // console.log('GetOrders Order.query with relations', orders);

  return orders;
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
  // console.log('CreateOrder', data);
  const order = new Order(data);
  await order.save();
  await Promise.all(data.orderProducts.map(orderProduct => (new OrderProduct({...orderProduct, order_id: order.id})).save()));
  return order;
};

const UpdateOrder = async (data) => {
  data.updated_at = Date.now();
  const order = await Order.update({...data, updated_at: Date.now()});
  order.orderProducts = await Promise.all(data.orderProducts.map(orderProduct => OrderProduct.update({...orderProduct, updated_at: Date.now()})));
  const deleted = await OrderProduct.query({where: {order_id_eq: data.id, id_nin: data.orderProducts.map(orderProduct => orderProduct.id)}});
  await Promise.all(deleted.map(item => OrderProduct.destroy(item.id)));

  return order;
};

const GetOrdersTotalRange = async () => {
  return await Order.getTotalRange();
};

const GetProducts = async ({filters = {}, sort, page = 1, limit = 20}) => {
  const options = {
    columns: '*',
    where: {},
    page: page,
    limit: limit,
    order: 'name ASC'
  };
  if (filters.price) {
    options.where.price_gteq = filters.price[0];
    options.where.price_lteq = filters.price[1];
  }
  if (filters.name) {
    options.where.name_cont = `%${filters.name}%`;
  }
  // console.log('getProducts', options);
  const products = await Product.query(options);
  await Product.loadRelations(products, ['unit']);

  return products
};

const GetProduct = async (id) => {
  // console.log('getProduct', id);
  const product = await Product.find(id);
  if (product && product.unit_id) {
    product.unit = await GetUnit(product.unit_id)
  }

  return product
};

const CreateProduct = async (data) => {
  // console.log('CreateProduct', data);
  const product = new Product(data);
  await product.save();

  return product;
};

const UpdateProduct = async (data) => {
  // console.log('UpdateProduct', data);
  return await Product.update({...data, updated_at: Date.now()});
};

const GetProductPriceRange = async () => {
  return await Product.getPriceRange();
};

const GetProductsTotal = async (params = {}) => {
  return await Product.getTotal(params);
};

const GetCosts = async ({filters = {}, sort, page = 1, limit = 20}) => {
  const options = {
    columns: '*',
    where: {},
    page: page,
    limit: limit,
    order: 'created_at DESC'
  };
  if (filters.total) {
    options.where.total_gteq = filters.total[0];
    options.where.total_lteq = filters.total[1];
  }
  if (filters.comment) {
    options.where.comment_cont = `%${filters.comment}%`;
  }
  console.log('GetCosts', options);
  return await Cost.query(options);
};

const GetCost = async (id) => {
  // console.log('GetCost', id);
  return await Cost.find(id);
};

const CreateCost = async (data) => {
  // console.log('CreateCost', data);
  const cost = new Cost(data);
  await cost.save();

  return cost;
};

const UpdateCost = async (data) => {
  // console.log('UpdateCost', data);
  return await Cost.update({...data, updated_at: Date.now()});
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
  GetOrdersTotalRange,
  GetProducts,
  GetProduct,
  CreateProduct,
  UpdateProduct,
  GetProductPriceRange,
  GetProductsTotal,
  GetCosts,
  GetCost,
  CreateCost,
  UpdateCost,
  GetCostTotalRange,
  GetUnits,
  GetUnit,
};
