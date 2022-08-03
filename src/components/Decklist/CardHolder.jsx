import PropTypes from 'prop-types'
import Card from './Card'
const CardHolder = ({
  styleCss,
  title = '',
  cards = [],
  drop = () => {},
  length = 0,
  onMouseEnterHandler = () => {},
  onRightClick = () => {},
  onTitleButtonClick = () => {}
}) => {
  const multiplyCardsByQuantity = () => {
    const cardsAux = []

    for (let i = 0; i < cards.length; i++) {
      cards[i].quantity = cards[i]?.quantity ? cards[i].quantity : 1
      for (let j = 0; j < cards[i].quantity; j++) {
        cardsAux.push(
          <Card
            key={`${cards[i].id}-${j}`}
            card={cards[i]}
            onMouseEnterHandler={onMouseEnterHandler}
            onRightClick={onRightClick}
            type={title}
          />
        )
      }
    }
    return cardsAux
  }

  return (
    <div css={styleCss} ref={drop}>
      <div className="card-holder-title">
        <p>
          {title}: {length}
        </p>
        <div onClick={() => onTitleButtonClick(title.toLocaleLowerCase())}>
          <p>Reset</p>
        </div>
      </div>
      <div className="card-holder-content">
        <div
          className={`card-holder-cards ${
            (title.toLocaleLowerCase() === 'side' || title.toLocaleLowerCase() === 'extra') && length <= 10
              ? 'miniExtra'
              : title.toLocaleLowerCase() === 'side' || title.toLocaleLowerCase() === 'extra' ? 'extra' : title.toLocaleLowerCase()
          } ${length > 40 && title.toLocaleLowerCase() === 'deck' ? 'miniDeck' : ''}`}
        >
          {multiplyCardsByQuantity()}
        </div>
      </div>
    </div>
  )
}

CardHolder.propTypes = {
  styleCss: PropTypes.object,
  title: PropTypes.string,
  cards: PropTypes.arrayOf(Object),
  drop: PropTypes.func,
  length: PropTypes.number,
  onMouseEnterHandler: PropTypes.func,
  onRightClick: PropTypes.func,
  onTitleButtonClick: PropTypes.func
}

export default CardHolder
