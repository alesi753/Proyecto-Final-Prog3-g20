export interface InterfaceProducto {
  id: number;
  categoriaId: number;
  marcaId: number;
  modelo: string;
  precio: number;
  stock: number;
  especificaciones: Record<string, any>; // Representa un objeto JSON genérico
}
