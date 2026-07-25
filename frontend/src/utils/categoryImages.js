import almacenamiento from '../assets/images/products/almacenamiento.svg';
import auriculares from '../assets/images/products/auriculares.svg';
import fuenteDePoder from '../assets/images/products/fuente-de-poder.svg';
import gabinete from '../assets/images/products/gabinete.svg';
import memoriaRam from '../assets/images/products/memoria-ram.svg';
import monitor from '../assets/images/products/monitor.svg';
import motherboard from '../assets/images/products/motherboard.svg';
import mouse from '../assets/images/products/mouse.svg';
import mousepad from '../assets/images/products/mousepad.svg';
import placaDeBluetooth from '../assets/images/products/placa-de-bluetooth.svg';
import placaDeRed from '../assets/images/products/placa-de-red.svg';
import placaDeVideo from '../assets/images/products/placa-de-video.svg';
import procesador from '../assets/images/products/procesador.svg';
import refrigeracion from '../assets/images/products/refrigeracion.svg';
import teclado from '../assets/images/products/teclado.svg';

// Ilustraciones originales y neutrales: la marca se indica en su badge propio.
const CATEGORY_IMAGES = {
  Almacenamiento: {
    src: almacenamiento,
  },
  Auriculares: {
    src: auriculares,
  },
  'Fuente de Poder': {
    src: fuenteDePoder,
  },
  Gabinete: {
    src: gabinete,
  },
  'Memoria RAM': {
    src: memoriaRam,
  },
  Monitor: {
    src: monitor,
  },
  Motherboard: {
    src: motherboard,
  },
  Mouse: {
    src: mouse,
  },
  Mousepad: {
    src: mousepad,
  },
  'Placa de Bluetooth': {
    src: placaDeBluetooth,
  },
  'Placa de Red': {
    src: placaDeRed,
  },
  'Placa de Video': {
    src: placaDeVideo,
  },
  Procesador: {
    src: procesador,
  },
  Refrigeración: {
    src: refrigeracion,
  },
  Teclado: {
    src: teclado,
    source: 'https://commons.wikimedia.org/wiki/File:Computer_keyboard.png',
  },
};

// Obtiene la imagen representativa de una familia o deja usar el fallback visual.
export function getCategoryImage(family) {
  return CATEGORY_IMAGES[family] ?? null;
}
