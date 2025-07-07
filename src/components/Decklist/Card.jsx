import PropTypes from "prop-types";
import { CardStyles } from "./styles.css";
import { useDrag } from "react-dnd";
import backCard from "../../assets/back_card.jpg";
const defaultImgUrl = backCard;

const Card = ({
  card,
  onMouseEnterHandler = () => {},
  type = "",
  onRightClick = () => {},
}) => {
  const [, drag] = useDrag(() => ({
    type: "removeCard",
    item: { card, type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  const hasImage = () => {
    return card?.card_images?.length > 0;
  };
  return (
    <picture css={CardStyles}>
      <img
        src={hasImage() ? card.card_images[0].image_url_small : defaultImgUrl}
        onMouseEnter={() => onMouseEnterHandler(card)}
        ref={drag}
        onContextMenu={(e) => {
          onRightClick(e, card, type);
        }}
      />
    </picture>
  );
};

Card.propTypes = {
  width: PropTypes.string,
  card: PropTypes.object,
  onMouseEnterHandler: PropTypes.func,
  type: PropTypes.string,
  onRightClick: PropTypes.func,
};

export default Card;
