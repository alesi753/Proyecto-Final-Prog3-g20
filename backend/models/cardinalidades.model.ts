import { UsuarioModel }    from './usuario.model';
import { CarritoModel }    from './carrito.model';
import { OrdenModel }      from './orden.model';
import { CategoriaModel }  from './categoria.model';
import { ProductoModel }   from './producto.model';
import { OrderItemModel }  from './orden-item.model';
import { CarritoItemModel } from './carrito-item.model';

export const configurarCardinalidades = () => {

  // USUARIO — CARRITO (1:1)
  UsuarioModel.hasOne(CarritoModel, { foreignKey: 'usuarioId' });
  CarritoModel.belongsTo(UsuarioModel, { foreignKey: 'usuarioId' });

  // USUARIO — ÓRDENES (1:N)
  UsuarioModel.hasMany(OrdenModel, { foreignKey: 'usuarioId' });
  OrdenModel.belongsTo(UsuarioModel, { foreignKey: 'usuarioId' });

  // CATEGORÍA — PRODUCTOS (1:N)
  CategoriaModel.hasMany(ProductoModel, { foreignKey: 'categoriaId' });
  ProductoModel.belongsTo(CategoriaModel, { foreignKey: 'categoriaId' });

  // ÓRDENES ↔ PRODUCTOS (N:M via OrdenItem)
  OrdenModel.belongsToMany(ProductoModel, { through: OrderItemModel, foreignKey: 'ordenId' });
  ProductoModel.belongsToMany(OrdenModel, { through: OrderItemModel, foreignKey: 'productoId' });

  // 1:N subyacentes de OrdenItem
  // as: 'items' required by orden.controller.js include
  OrdenModel.hasMany(OrderItemModel, { foreignKey: 'ordenId', as: 'items' });
  OrderItemModel.belongsTo(OrdenModel, { foreignKey: 'ordenId', as: 'orden' });
  ProductoModel.hasMany(OrderItemModel, { foreignKey: 'productoId' });
  OrderItemModel.belongsTo(ProductoModel, { foreignKey: 'productoId' });

  // CARRITOS ↔ PRODUCTOS (N:M via CarritoItem)
  // as: 'productos' required by carrito.controller.js and orden.controller.js include
  CarritoModel.belongsToMany(ProductoModel, { through: CarritoItemModel, foreignKey: 'carritoId', as: 'productos' });
  ProductoModel.belongsToMany(CarritoModel, { through: CarritoItemModel, foreignKey: 'productoId', as: 'carritos' });

  // 1:N subyacentes de CarritoItem
  CarritoModel.hasMany(CarritoItemModel, { foreignKey: 'carritoId' });
  CarritoItemModel.belongsTo(CarritoModel, { foreignKey: 'carritoId' });
  ProductoModel.hasMany(CarritoItemModel, { foreignKey: 'productoId' });
  CarritoItemModel.belongsTo(ProductoModel, { foreignKey: 'productoId' });

  console.log('Cardinalidades configuradas correctamente.');
};
