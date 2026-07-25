import amd from '../assets/icons/brands/amd.svg';
import asus from '../assets/icons/brands/asus.svg';
import coolermaster from '../assets/icons/brands/coolermaster.svg';
import corsair from '../assets/icons/brands/corsair.svg';
import hyperx from '../assets/icons/brands/hyperx.svg';
import intel from '../assets/icons/brands/intel.svg';
import kingston from '../assets/icons/brands/kingstontechnology.svg';
import lg from '../assets/icons/brands/lg.svg';
import msi from '../assets/icons/brands/msi.svg';
import nzxt from '../assets/icons/brands/nzxt.svg';
import redragon from '../assets/icons/brands/redragon.svg';
import samsung from '../assets/icons/brands/samsung.svg';
import seagate from '../assets/icons/brands/seagate.svg';

// Logos de Simple Icons (CC0); las marcas no disponibles usan texto como fallback.
const BRAND_LOGOS = {
  AMD: amd,
  ASUS: asus,
  'Cooler Master': coolermaster,
  Corsair: corsair,
  HyperX: hyperx,
  Intel: intel,
  Kingston: kingston,
  LG: lg,
  MSI: msi,
  NZXT: nzxt,
  Redragon: redragon,
  Samsung: samsung,
  Seagate: seagate,
};

// Entrega un logo cuando existe; caso contrario conserva el nombre de marca.
export function getBrandBadge(brand) {
  const logo = BRAND_LOGOS[brand];
  return logo ? { type: 'logo', src: logo } : { type: 'text', label: brand };
}
