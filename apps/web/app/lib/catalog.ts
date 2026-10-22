import 'server-only'
import { unstable_cache } from 'next/cache'
import { catalogStats } from '@browsersupport/data/database'
export {
  findProperty,
  relatedProperties,
  searchProperties,
  suggestions,
} from '@browsersupport/data/database'
export const getStats = unstable_cache(catalogStats, ['catalog-stats'], {
  revalidate: 300,
})
