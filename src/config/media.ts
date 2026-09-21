/**
 * Material del cliente en Cloudinary. El public_id es determinista
 * (`construmia/<carpeta>/<archivo>`, lo sube `pnpm upload:media` del backapp),
 * así que acá solo se arma la URL con el ancho que pide cada componente.
 */
const CLOUD = 'ydmuata0'

export function cld(publicId: string, width = 1200, extra = ''): string {
  const transforms = ['f_auto', 'q_auto', `w_${width}`, 'c_limit', extra].filter(Boolean).join(',')
  return `https://res.cloudinary.com/${CLOUD}/image/upload/${transforms}/construmia/${publicId}`
}

/** srcset listo para <img>: el navegador elige el ancho. */
export function cldSet(publicId: string, widths = [480, 800, 1200, 1600]): string {
  return widths.map((w) => `${cld(publicId, w)} ${w}w`).join(', ')
}

function range(folder: string, prefix: string, count: number): string[] {
  return Array.from({ length: count }, (_, i) => `${folder}/${prefix}-${String(i + 1).padStart(2, '0')}`)
}

export const media = {
  renders: {
    exteriores: range('renders/fachadas-exteriores', 'render-exterior', 8),
    sociales: range('renders/areas-sociales', 'render-social', 18),
    cocinas: range('renders/cocinas', 'render-cocina', 6),
    dormitorios: range('renders/dormitorios', 'render-dormitorio', 16),
    banos: range('renders/banos', 'render-bano', 10),
    closets: range('renders/closets-vestidores', 'render-closet', 4),
  },
  reales: {
    entregas: range('fotos-reales/entregas-y-fachadas', 'real-entrega', 3),
    obra: range('fotos-reales/obra-en-proceso', 'real-obra', 10),
    piscinas: range('fotos-reales/piscinas-exteriores', 'real-piscina', 3),
    interiores: range('fotos-reales/interiores-terminados', 'real-interior', 10),
  },
  /**
   * "Del render a la realidad": el mismo proyecto de cocina en sus tres momentos.
   * render-cocina-01 (render) · real-obra-01 (obra) · real-interior-02 (terminada).
   */
  renderToReality: {
    render: 'renders/cocinas/render-cocina-01',
    obra: 'fotos-reales/obra-en-proceso/real-obra-01',
    real: 'fotos-reales/interiores-terminados/real-interior-02',
  },
} as const
