// Argentine peso formatter, e.g. 329999.99 → "$329.999"
export const ars = n => '$' + Number(n).toLocaleString('es-AR');
