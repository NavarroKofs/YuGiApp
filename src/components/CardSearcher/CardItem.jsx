import PropTypes from 'prop-types'
import { CardItemStyles } from './styles.css'
import { useDrag } from 'react-dnd'
import backCard from '../../assets/back_card.jpg'
const defaultImgUrl = backCard

const CardItem = ({ card, onMouseEnterHandler = () => {} }) => {
  const hasImage = () => {
    return card?.card_images?.length > 0
  }
  const [, drag] = useDrag(() => ({
    type: 'image',
    item: card,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }))
  return (
    <div
      className="card-item-container"
      css={CardItemStyles}
      onMouseEnter={() => onMouseEnterHandler(card)}
    >
      <picture className="card-picture">
        <img ref={drag} src={hasImage() ? card.card_images[0].image_url_small : defaultImgUrl} />
      </picture>
      <div className="card-info">
        <p className="card-name">
          {card?.name?.length > 26
            ? `${card?.name.substring(0, 26)}...`
            : card?.name}
        </p>
        <p className="card-type-level">
          {card?.type.length > 26
            ? `${card?.type.substring(0, 26)}...`
            : card?.type}
        </p>
        <p className="card-atk-def">
          {card?.level ? `${card.atk}/${card.def} ⭐${card?.level}` : ''}
        </p>
        <p className="card-atk-def">
          {card?.linkval ? `ATK: ${card.atk} Link: ${card?.linkval}` : ''}
        </p>
      </div>
    </div>
  )
}

CardItem.propTypes = {
  card: PropTypes.object,
  onMouseEnterHandler: PropTypes.func
}

export default CardItem
