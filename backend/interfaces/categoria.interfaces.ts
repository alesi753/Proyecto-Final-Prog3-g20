export interface InterfaceCategoria {
  id: number;
  nombre: string;
  padreId: number | null; // null significa que es una categoría principal
}
