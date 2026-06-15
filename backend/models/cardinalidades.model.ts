import { UsuarioModel } from './usuario.model';
import { CarritoModel } from './carrito.model';
import { OrdenModel } from './orden.model';
import { CategoriaModel } from './categoria.model';
import { ProductoModel } from './producto.model';
import { OrderItemModel } from './orden-item.model';
import { CarritoItemModel } from './carrito-item.model';

export const configurarCardinalidades = () => {
    
    // USUARIO Y CARRITO (1 a 1)
    
    // Un usuario 'tiene un' solo carrito.
    UsuarioModel.hasOne(CarritoModel, { foreignKey: 'usuarioId', as: 'carrito' });

    // Un carrito 'pertenece a' un solo usuario.
    CarritoModel.belongsTo(UsuarioModel, { foreignKey: 'usuarioId', as: 'usuario' });

    
    // USUARIO Y ÓRDENES (1 a N)
    
    // Un usuario 'tiene muchas' órdenes.
    UsuarioModel.hasMany(OrdenModel, { foreignKey: 'usuarioId', as: 'ordenes' });
    
    // Cada orden 'pertenece a' un solo usuario.
    OrdenModel.belongsTo(UsuarioModel, { foreignKey: 'usuarioId', as: 'usuario' });

    
    // CATEGORÍA Y PRODUCTOS (1 a N)
    
    // Una categoría 'tiene muchos' productos.
    CategoriaModel.hasMany(ProductoModel, { foreignKey: 'categoriaId', as: 'productos' });

    // Cada producto 'pertenece a' una sola categoría.
    ProductoModel.belongsTo(CategoriaModel, { foreignKey: 'categoriaId', as: 'categoria' });


    // CATEGORÍA Y SUBCATEGORÍA (1 a N)
    
    // Una categoría padre "tiene muchas" subcategorías (hijos)
    CategoriaModel.hasMany(CategoriaModel, { 
        foreignKey: 'padreId', 
        as: 'subcategorias' 
    });

    // Una subcategoría "pertenece a" una sola categoría padre
    CategoriaModel.belongsTo(CategoriaModel, { 
        foreignKey: 'padreId', 
        as: 'categoriaPadre' 
    });

    
    // RELACION N:M (MUCHOS A MUCHOS) CON SUS TABLAS INTERMEDIA

    // ÓRDENES ↔ PRODUCTOS (N : M)

    // Ordenes 'tienen muchos' productos a través de la tabla intermedia OrderItemModel.
    OrdenModel.belongsToMany(ProductoModel, { 
        through: OrderItemModel, 
        foreignKey: 'ordenId', 
        otherKey: 'productoId', 
        as: 'productos' 
    });

    // Cada producto 'pertenece a' muchas órdenes a través de la tabla intermedia OrderItemModel.
    ProductoModel.belongsToMany(OrdenModel, { 
        through: OrderItemModel, 
        foreignKey: 'productoId', 
        otherKey: 'ordenId', 
        as: 'ordenes' 
    });

    // Las relaciones 1 a N subyacentes con la tabla intermedia OrderItemModel

    OrdenModel.hasMany(OrderItemModel, { foreignKey: 'ordenId', as: 'items' }); // Una orden 'tiene muchos' items
    OrderItemModel.belongsTo(OrdenModel, { foreignKey: 'ordenId', as: 'orden' }); // Cada item 'pertenece a' una orden

    ProductoModel.hasMany(OrderItemModel, { foreignKey: 'productoId', as: 'ordenItems' }); // Un producto 'puede estar en muchos' items de orden
    OrderItemModel.belongsTo(ProductoModel, { foreignKey: 'productoId', as: 'producto' }); // Cada item 'pertenece a' un producto

    
    // CARRITOS ↔ PRODUCTOS (N : M)

    // Un carrito 'tiene muchos' productos a través de la tabla intermedia CarritoItemModel.
    CarritoModel.belongsToMany(ProductoModel, { 
        through: CarritoItemModel, 
        foreignKey: 'carritoId', 
        otherKey: 'productoId', 
        as: 'productos' 
    });

    // Cada producto 'pertenece a' muchos carritos a través de la tabla intermedia CarritoItemModel.
    ProductoModel.belongsToMany(CarritoModel, { 
        through: CarritoItemModel, 
        foreignKey: 'productoId', 
        otherKey: 'carritoId', 
        as: 'carritos' 
    });

    // Las relaciones 1 a N subyacentes con la tabla intermedia CarritoItemModel

    CarritoModel.hasMany(CarritoItemModel, { foreignKey: 'carritoId', as: 'items' }); // Un carrito 'tiene muchos' items
    CarritoItemModel.belongsTo(CarritoModel, { foreignKey: 'carritoId', as: 'carrito' }); // Cada item 'pertenece a' un carrito
    
    ProductoModel.hasMany(CarritoItemModel, { foreignKey: 'productoId', as: 'carritoItems' }); // Un producto 'puede estar en muchos' items de carrito
    CarritoItemModel.belongsTo(ProductoModel, { foreignKey: 'productoId', as: 'producto' }); // Cada item 'pertenece a' un producto

    console.log('Cardinalidades (Relaciones) configuradas correctamente.');
};