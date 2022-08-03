import PropTypes from 'prop-types'
import { SidebarStyle } from './styles.css'
import backCard from '../../assets/back_card.jpg'
const defaultImgUrl = backCard

const Sidebar = ({ card }) => {
  const hasImage = () => {
    return card?.card_images?.length > 0
  }
  return (
    <div className="sidebar-card" css={SidebarStyle}>
      <div className="sidebar-card-image">
        <img
          className="card-image"
          src={hasImage() ? card.card_images[0].image_url : defaultImgUrl}
        />
      </div>
      <div className="sidebar-card-information">
        <h1 className="card-title">{card?.name}</h1>
        <div className="sidebar-card-information-container">
          <div className="card-type-race-attribute">
            <b className="card-type">{card?.type ? `[${card?.type}]` : ''}</b>
            <b className="card-race-attribute">
              {card?.race && card?.attribute
                ? `${card?.race}/${card?.attribute}`
                : ''}
            </b>
          </div>
          <div className="card-stars-atk-defense">
            {
              card?.level
                ? <>
                  <b className="card-stars">
                    ⭐{card?.level}
                  </b>
                  <b className="card-atk-defense">
                    {card?.atk && card?.def ? `${card?.atk}/${card?.def}` : ''}
                  </b>
                </>
                : null
            }
            <p className='card-stars'>{card?.linkval ? `${card.atk}/Link ${card?.linkval}` : ''}</p>
          </div>
          <p className="card-description">{card?.desc}</p>
        </div>
      </div>
    </div>
  )
}

Sidebar.propTypes = {
  card: PropTypes.object
}

export default Sidebar
