import { Component } from 'react'
import Router from 'next/router'

import SearchIcon from './SearchIcon'

import styles from './SearchForm.css'

class SearchForm extends Component {
  static displayName = 'SearchForm'

  state = {
    value: '',
  }

  onChange = e => {
    const { value } = e.currentTarget

    this.setState({ value })
  }

  onSubmit = e => {
    e.preventDefault()

    const { value } = this.state

    if (value) {
      Router.push(`/?q=${encodeURIComponent(value)}`)
    } else {
      this.input.focus()
    }
  }

  render() {
    const { value } = this.state

    return (
      <form
        className={styles.SearchForm}
        action="/"
        method="get"
        onSubmit={this.onSubmit}
      >
        <input
          ref={ref => (this.input = ref)}
          className={styles.input}
          name="q"
          value={value}
          onChange={this.onChange}
        />
        <button className={styles.button}>
          <SearchIcon />
        </button>
      </form>
    )
  }
}

export default SearchForm
