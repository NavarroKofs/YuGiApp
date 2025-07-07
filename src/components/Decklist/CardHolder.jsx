import PropTypes from "prop-types";
import Card from "./Card";
import { deckType } from "../../constants/card";

const CardHolder = ({
  styleCss,
  title = "",
  cards = [],
  drop = () => {},
  length = 0,
  onMouseEnterHandler = () => {},
  onRightClick = () => {},
  onTitleButtonClick = () => {},
}) => {
  const multiplyCardsByQuantity = () => {
    const cardsAux = [];

    for (let i = 0; i < cards.length; i++) {
      cards[i].quantity = cards[i]?.quantity ? cards[i].quantity : 1;
      for (let j = 0; j < cards[i].quantity; j++) {
        cardsAux.push(
          <Card
            key={`${cards[i].id}-${j}`}
            card={cards[i]}
            onMouseEnterHandler={onMouseEnterHandler}
            onRightClick={onRightClick}
            type={title}
          />
        );
      }
    }
    return cardsAux;
  };

  const isSideOrExtraDeck = () => {
    return (
      title.toLocaleLowerCase() === deckType.SIDE ||
      title.toLocaleLowerCase() === deckType.EXTRA
    );
  };

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
            isSideOrExtraDeck() && length <= 10
              ? "miniExtra"
              : isSideOrExtraDeck()
              ? "extra"
              : title.toLocaleLowerCase()
          } ${
            length > 40 && title.toLocaleLowerCase() === deckType.MAIN
              ? "miniDeck"
              : ""
          }`}
        >
          {multiplyCardsByQuantity()}
        </div>
      </div>
    </div>
  );
};

CardHolder.propTypes = {
  styleCss: PropTypes.object,
  title: PropTypes.string,
  cards: PropTypes.arrayOf(Object),
  drop: PropTypes.func,
  length: PropTypes.number,
  onMouseEnterHandler: PropTypes.func,
  onRightClick: PropTypes.func,
  onTitleButtonClick: PropTypes.func,
};

export default CardHolder;
