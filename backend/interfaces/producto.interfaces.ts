export interface InterfaceProducto {
  id: number;
  categoriaId: number;
  nombre: string;
  descripcion: string;
  marca: string;
  precio: number;
  stock: number;
  especificaciones: Record<string, any>; // Representa un objeto JSON genérico
  activo: boolean; 
}

/*
NOTE:
Record es una utilidad o "tipo auxiliar" (Utility Type) que te permite definir la estructura de un objeto de forma rápida, especificando estrictamente qué tipo de claves (keys) y qué tipo de valores (values) va a tener.
Básicamente, sirve para crear diccionarios o mapas de datos. Su sintaxis siempre es:
    - Record<TipoDeLaClave, TipoDelValor>
*/