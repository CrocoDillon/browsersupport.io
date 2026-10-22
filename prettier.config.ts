import type { Config } from 'prettier'
import type { PluginOptions } from 'prettier-plugin-tailwindcss'
const config: Config & PluginOptions = {
  arrowParens: 'avoid',
  semi: false,
  singleQuote: true,
  trailingComma: 'es5',
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindStylesheet: './apps/web/app/globals.css',
}
export default config
