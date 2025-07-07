import DeckForm from "./DeckForm";
import CardHolder from "./CardHolder";
import {
  DeckListStyles,
  MainDeckStyles,
  ExtraDeckStyles,
  SideDeckStyles,
} from "./styles.css";
import PropTypes from "prop-types";
import { deckType } from "../../constants/card";

const DeckList = ({
  mainCards = [],
  extraCards = [],
  sideCards = [],
  mainDrop = () => {},
  mainLength = 0,
  extraDrop = () => {},
  extraLength = 0,
  sideDrop = () => {},
  sideLength = 0,
  onMouseEnterHandler = () => {},
  onRightClick = () => {},
  onFormChange = () => {},
  onDownload = () => {},
  onUpload = () => {},
  onTitleButtonClick = () => {},
}) => {
  return (
    <div css={DeckListStyles}>
      <DeckForm
        onFormChange={onFormChange}
        onDownload={onDownload}
        onUpload={onUpload}
      />
      <CardHolder
        styleCss={MainDeckStyles}
        title={deckType.MAIN}
        cards={mainCards}
        length={mainLength}
        drop={mainDrop}
        onMouseEnterHandler={onMouseEnterHandler}
        onRightClick={onRightClick}
        onTitleButtonClick={onTitleButtonClick}
      />
      <CardHolder
        styleCss={ExtraDeckStyles}
        title={deckType.EXTRA}
        cards={extraCards}
        length={extraLength}
        drop={extraDrop}
        onMouseEnterHandler={onMouseEnterHandler}
        onRightClick={onRightClick}
        onTitleButtonClick={onTitleButtonClick}
      />
      <CardHolder
        styleCss={SideDeckStyles}
        title={deckType.SIDE}
        cards={sideCards}
        length={sideLength}
        drop={sideDrop}
        onMouseEnterHandler={onMouseEnterHandler}
        onRightClick={onRightClick}
        onTitleButtonClick={onTitleButtonClick}
      />
    </div>
  );
};

DeckList.propTypes = {
  mainCards: PropTypes.arrayOf(Object),
  extraCards: PropTypes.arrayOf(Object),
  sideCards: PropTypes.arrayOf(Object),
  mainDrop: PropTypes.func,
  mainLength: PropTypes.number,
  extraDrop: PropTypes.func,
  extraLength: PropTypes.number,
  sideDrop: PropTypes.func,
  sideLength: PropTypes.number,
  onMouseEnterHandler: PropTypes.func,
  onRightClick: PropTypes.func,
  onFormChange: PropTypes.func,
  onDownload: PropTypes.func,
  onUpload: PropTypes.func,
  onTitleButtonClick: PropTypes.func,
};

export default DeckList;
