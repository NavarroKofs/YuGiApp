import PropTypes from 'prop-types'
import CardItem from './CardItem'
import { SearchResultsStyles } from './styles.css'
const SearchResults = ({ results = [], onMouseEnterHandler = () => {} }) => {
  return (
    <div className="card-results" css={SearchResultsStyles}>
      <h5>Results: {results?.length ? results.length : 0}</h5>
      <div>
        {results.map((card) => {
          return (
            <CardItem key={card.id} card={card} onMouseEnterHandler={onMouseEnterHandler} />
          )
        })}
      </div>
    </div>
  )
}

SearchResults.propTypes = {
  results: PropTypes.array,
  onMouseEnterHandler: PropTypes.func
}

export default SearchResults
