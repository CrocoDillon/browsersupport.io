import { Component } from 'react'
import { func, string } from 'prop-types'

class SearchForm extends Component {
  static displayName = 'SearchForm'

  static propTypes = {
    defaultValue: string,
    onSubmit: func.isRequired,
  }

  static defaultProps = {
    defaultValue: '',
  }

  state = {
    value: this.props.defaultValue,
  }

  onChange = e => {
    const { value } = e.currentTarget

    this.setState({ value })
  }

  onSubmit = e => {
    e.preventDefault()

    const { onSubmit } = this.props
    const { value } = this.state

    if (value) {
      onSubmit(value)
    }
  }

  render() {
    const { value } = this.state

    return (
      <form action="/" method="get" onSubmit={this.onSubmit}>
        <label>
          Query:
          <input name="q" value={value} onChange={this.onChange} />
        </label>
        <button>Search</button>
      </form>
    )
  }
}

export default SearchForm
