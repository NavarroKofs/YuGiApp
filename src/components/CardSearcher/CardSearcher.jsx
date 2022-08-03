import { useState, useEffect } from 'react'
import SearchBar from './SearchBar'
import SearchResults from './SearchResults'
import { BehaviorSubject, of, merge } from 'rxjs'
import {
  debounceTime,
  map,
  distinctUntilChanged,
  filter,
  switchMap
} from 'rxjs/operators'
import { CardSearcherStyle } from './styles.css'
import getCardsByName from '../../api/getCardByName'
import PropTypes from 'prop-types'
import { useDrop } from 'react-dnd'

const CardSearcher = ({ onMouseEnterHandler = () => {}, removeFromDeck = () => {} }) => {
  const [search, setSearch] = useState({
    data: [],
    loading: false,
    errorMessage: '',
    noResults: false
  })
  const [subject, setSubject] = useState(null)

  useEffect(() => {
    if (subject === null) {
      const sub = new BehaviorSubject('')
      setSubject(sub)
    } else {
      const observable = subject
        .pipe(
          map((s) => s.trim()),
          distinctUntilChanged(),
          filter((s) => s.length >= 2),
          debounceTime(500),
          switchMap((name) =>
            merge(
              of({ loading: true, errorMessage: '', noResults: false }),
              getCardsByName(name)
                .then((cards) => {
                  if (cards.status === 200) {
                    return {
                      data: cards.data.data.filter(
                        (cards) =>
                          cards.type !== 'Token' && cards.type !== 'Skill Card'
                      ),
                      loading: false,
                      noResults: cards.data.length === 0
                    }
                  }
                  return {
                    data: [],
                    loading: false,
                    errorMessage:
                      'No card matching your query was found in the database.',
                    noResults: true
                  }
                })
                .catch((e) => ({
                  data: [],
                  loading: false,
                  errorMessage:
                    'No card matching your query was found in the database.',
                  noResults: true
                }))
            )
          )
        )
        .subscribe((newState) => {
          setSearch((s) => Object.assign({}, s, newState))
        })

      return () => {
        observable.unsubscribe()
        subject.unsubscribe()
      }
    }
  }, [subject])

  const onChange = (e) => {
    if (subject) {
      return subject.next(e.target.value)
    }
  }

  const [, drop] = useDrop(() => ({
    accept: 'removeCard',
    drop: ({ card, type }) => removeFromDeck(card, type),
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }))

  return (
    <div className="searcher-container" css={CardSearcherStyle} ref={drop}>
      <SearchBar onChange={onChange} />
      <SearchResults
        results={search.data}
        onMouseEnterHandler={onMouseEnterHandler}
      />
    </div>
  )
}

CardSearcher.propTypes = {
  onMouseEnterHandler: PropTypes.func,
  removeFromDeck: PropTypes.func
}

export default CardSearcher
