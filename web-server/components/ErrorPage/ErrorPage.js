import { number } from 'prop-types'

import Heading from '../Heading'
import Page from '../Page'

import styles from './ErrorPage.css'

const lameText = {
  404: '(yeah... we couldn’t find this one)',
  500: '(without jumping to conslusions... it’s probably our fault)',
}

const ErrorPage = props => {
  const { status } = props
  const description = lameText[status]

  return (
    <Page>
      <Heading>Oops, sorry!</Heading>
      <div className={styles.ErrorPage}>
        <div className={styles.status}>{status}</div>
        <div className={styles.description}>{description}</div>
      </div>
    </Page>
  )
}

ErrorPage.displayName = 'ErrorPage'

ErrorPage.propTypes = {
  status: number.isRequired,
}

export default ErrorPage
