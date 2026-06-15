import { UsuarioModel } from './usuario.model';
import { CarritoModel } from './carrito.model';
import { OrdenModel } from './orden.model';
import { CategoriaModel } from './categoria.model';
import { ProductoModel } from './producto.model';
import { OrderItemModel } from './orden-item.model';
import { CarritoItemModel } from './carrito-item.model';

export const configurarCardinalidades = () => {
    
    // USUARIO Y CARRITO (1 a 1)
    // Un usuario tiene un solo carrito. Un carrito pertenece a un solo usuario.
    UsuarioModel.hasOne(CarritoModel, { foreignKey: 'usuarioId' });
    CarritoModel.belongsTo(UsuarioModel, { foreignKey: 'usuarioId' });

    // USUARIO Y ÓRDENES (1 a N)
    // Un usuario puede tener muchas órdenes. Una orden es de un solo usuario.
    UsuarioModel.hasMany(OrdenModel, { foreignKey: 'usuarioId' });
    OrdenModel.belongsTo(UsuarioModel, { foreignKey: 'usuarioId' });

    // CATEGORÍA Y PRODUCTOS (1 a N)
    // Una categoría tiene muchos productos. Un producto pertenece a una sola categoría.
    CategoriaModel.hasMany(ProductoModel, { foreignKey: 'categoriaId' });
    ProductoModel.belongsTo(CategoriaModel, { foreignKey: 'categoriaId' });

    // RELACION N:M (MUCHOS A MUCHOS) CON SUS TABLAS INTERMEDIA

    // ÓRDENES ↔ PRODUCTOS (N : M)
    // Relación principal Muchos a Muchos
    OrdenModel.belongsToMany(ProductoModel, { through: OrderItemModel, foreignKey: 'ordenId' });
    ProductoModel.belongsToMany(OrdenModel, { through: OrderItemModel, foreignKey: 'productoId' });


    // Las relaciones 1 a N subyacentes con la tabla intermedia
    OrdenModel.hasMany(OrderItemModel, { foreignKey: 'ordenId' });
    OrderItemModel.belongsTo(OrdenModel, { foreignKey: 'ordenId' });
    ProductoModel.hasMany(OrderItemModel, { foreignKey: 'productoId' });
    OrderItemModel.belongsTo(ProductoModel, { foreignKey: 'productoId' });

    // CARRITOS ↔ PRODUCTOS (N : M)
    // Relación principal Muchos a Muchos
    CarritoModel.belongsToMany(ProductoModel, { through: CarritoItemModel, foreignKey: 'carritoId' });
    ProductoModel.belongsToMany(CarritoModel, { through: CarritoItemModel, foreignKey: 'productoId' });

    // Las relaciones 1 a N subyacentes con la tabla intermedia
    CarritoModel.hasMany(CarritoItemModel, { foreignKey: 'carritoId' });
    CarritoItemModel.belongsTo(CarritoModel, { foreignKey: 'carritoId' });
    ProductoModel.hasMany(CarritoItemModel, { foreignKey: 'productoId' });
    CarritoItemModel.belongsTo(ProductoModel, { foreignKey: 'productoId' });

    console.log('Cardinalidades (Relaciones) configuradas correctamente.');
};