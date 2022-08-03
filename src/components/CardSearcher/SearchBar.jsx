import { SearchBarStyle } from './styles.css'
import PropTypes from 'prop-types'
const SearchBar = ({ onChange }) => {
  return (
    <div className="search-container" css={SearchBarStyle}>
      <input
        type="text"
        autoComplete="off"
        placeholder="search by name"
        name="monster-name"
        onChange={onChange}
      />
    </div>
  )
}

SearchBar.propTypes = {
  onChange: PropTypes.func
}

export default SearchBar
