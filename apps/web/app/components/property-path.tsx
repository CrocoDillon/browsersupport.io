import Link from 'next/link'
import { propertyHref, segments } from '@browsersupport/data'
export function PropertyPath({ name }: { name: string }) {
  return (
    <span className="property-path">
      {segments(name).map((part, i, parts) => (
        <span key={part.name}>
          <Link
            prefetch={false}
            href={propertyHref(part.name)}
            className={i === parts.length - 1 ? 'path-final' : ''}
          >
            {part.label}
          </Link>
          <wbr />
        </span>
      ))}
    </span>
  )
}
