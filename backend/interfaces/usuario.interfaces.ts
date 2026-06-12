
// Extraemos el ENUM a un tipo para poder reutilizarlo
export type RolUsuario = 'cliente' | 'admin';

export interface InterfaceUsuario {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  password: string;
  rol: RolUsuario;
}