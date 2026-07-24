/**
 * Resolves the picture to show for a service.
 *
 * An admin-set photo (Admin → Services → Photo) always wins. When none is set
 * yet we fall back to a curated studio shot matched on the service's wording,
 * so cards never render an empty frame. Keywords cover both English and
 * Lithuanian service names.
 */
type ServiceLike = {
  name?: string | null
  category?: string | null
  description?: string | null
  imageUrl?: string | null
}

const VISUALS: { keys: string[]; src: string }[] = [
  { keys: ['beard', 'shave', 'trim', 'razor', 'barzd'],                        src: '/images/haircuts/beard-fade.jpg' },
  { keys: ['braid', 'cornrow', 'knotless', 'twist', 'waves', 'swirl', 'pyn'],  src: '/images/haircuts/high-top-fade-chair.avif' },
  { keys: ['loc', 'dread', 'retwist', 'dreadlok'],                             src: '/images/haircuts/design-beard.jpg' },
  { keys: ['color', 'colour', 'highlight', 'balayage', 'palette', 'dažy'],     src: '/images/haircuts/design-beard.jpg' },
  { keys: ['fade', 'taper', 'line', 'design'],                                 src: '/images/haircuts/design-beard.jpg' },
  { keys: ['treatment', 'condition', 'scalp', 'spa', 'nail', 'manicure',
           'pedicure', 'priežiūr'],                                            src: '/images/studio/interior.jpg' },
  { keys: ['wig', 'styling', 'women', 'perukas', 'stiliz'],                    src: '/images/studio/hero.jpg' },
  { keys: ['kid', 'child', 'baby', 'vaik'],                                    src: '/images/haircuts/crisp-lineup.jpeg' },
  { keys: ['haircut', 'cut', 'scissors', 'kirp'],                              src: '/images/haircuts/crisp-lineup.jpeg' },
]

const DEFAULT_SRC = '/images/haircuts/black-hair-barber-1.jpg'

export function serviceImage(service: ServiceLike, hint = ''): string {
  const set = service.imageUrl?.trim()
  if (set) return set

  const hay = `${service.name ?? ''} ${service.category ?? ''} ${service.description ?? ''} ${hint}`.toLowerCase()
  return VISUALS.find(v => v.keys.some(k => hay.includes(k)))?.src ?? DEFAULT_SRC
}
