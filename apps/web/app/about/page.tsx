import type { Metadata } from 'next'
import Link from 'next/link'
export const metadata: Metadata = {
  title: 'About',
  alternates: { canonical: '/about' },
}
export default function About() {
  return (
    <article className="prose-page">
      <span className="eyebrow">HELLO AGAIN, OLD FRIEND</span>
      <h1>
        A small corner
        <br />
        of JavaScript history.
      </h1>
      <p className="lede">
        An API explorer for the familiar, the obscure, and the things you didn’t
        know were properties.
      </p>
      <h2>The original idea</h2>
      <p>
        browsersupport.io started as a way to look up any JavaScript property.
        Not just new language features, but vendor prefixes, deprecated APIs,
        and the everyday properties that rarely get a compatibility table of
        their own.
      </p>
      <p>
        The lab collected property names from browsers, then checked for their
        existence across browser versions. That produced an archive of tens of
        thousands of properties, each with its own URL.
      </p>
      <h2>What the colors mean</h2>
      <p>
        <strong>Present</strong> means the detector found the property.{' '}
        <strong>Absent</strong> means the property, or something needed to reach
        it, was missing. <strong>Unknown</strong> means there’s no usable
        observation. A detection error is unknown, too.
      </p>
      <p>
        These are shallow checks. They don’t establish that an implementation
        works correctly, or that it’s available under every browser setting. A
        test may also find inherited properties.
      </p>
      <h2>And today?</h2>
      <p>
        The site keeps those historical results accessible. Browser versions
        shown are the ones tested, not necessarily current releases. Original
        test dates weren’t recorded; new observations carry a timestamp. A
        property’s creation date isn’t its test date.
      </p>
      <p>
        For current compatibility decisions,{' '}
        <a href="https://developer.mozilla.org/">MDN</a> and{' '}
        <a href="https://caniuse.com/">Can I use</a> are useful companions.
        Build tools can transform syntax and supply some polyfills, but the
        browser still determines which APIs it exposes.
      </p>
      <h2>Still a personal project</h2>
      <p>
        Made by <a href="https://crocodillon.com">Dillon de Voor</a>, kept
        around for curiosity and a little nostalgia. The{' '}
        <a href="https://github.com/CrocoDillon/browsersupport.io">
          source is on GitHub
        </a>
        . Found something odd? An issue there is welcome.
      </p>
      <Link className="back-link" href="/">
        ← Back to exploring
      </Link>
    </article>
  )
}
