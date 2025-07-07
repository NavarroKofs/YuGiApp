import { extraDeckCardType, banCardType, deckType } from "../constants/card";

const { MAIN, EXTRA, SIDE } = deckType;
const { SYNCHRO, FUSION, XYZ, LINK } = extraDeckCardType;
const { BANNED, LIMITED, SEMILIMITED } = banCardType;

export const isExtraDeckCard = (card) => {
  if (
    card.type.includes(SYNCHRO) ||
    card.type.includes(FUSION) ||
    card.type.includes(XYZ) ||
    card.type.includes(LINK)
  ) {
    return true;
  }
  return false;
};

export const isCardValidForDeck = (card, deckType) => {
  const isExtra = isExtraDeckCard(card);
  return (
    (deckType === MAIN && !isExtra) ||
    (deckType === EXTRA && isExtra) ||
    deckType === SIDE
  );
};

export const getCardMaxQuantity = (card) => {
  switch (card?.banlist_info?.ban_tcg) {
    case BANNED:
      return 0;
    case LIMITED:
      return 1;
    case SEMILIMITED:
      return 2;
    default:
      return 3;
  }
};

export const getDeckMaxSize = (deckType) => {
  return deckType === MAIN ? 60 : 15;
};

export const addOrUpdateCardInDeck = (cards, card, deckType, maxQuantity) => {
  const deck = cards[deckType];
  const index = deck.findIndex((c) => c.id === card.id);

  if (index !== -1) {
    if (deck[index].quantity < maxQuantity) {
      deck[index].quantity += 1;
    }
  } else {
    deck.push({ ...card, quantity: 1 });
  }

  return cards;
};

export const getNumberOfCopies = (cards, draggedCard) => {
  const indexMain = cards.main.findIndex((card) => card.id === draggedCard.id);
  const indexSide = cards.side.findIndex((card) => card.id === draggedCard.id);
  const indexExtra = cards.extra.findIndex(
    (card) => card.id === draggedCard.id
  );
  let quantity = 0;
  if (indexMain !== -1) {
    quantity =
      quantity +
      (cards.main[indexMain]?.quantity ? cards.main[indexMain].quantity : 0);
  }
  if (indexSide !== -1) {
    quantity = quantity + cards.side[indexSide].quantity;
  }
  if (indexExtra !== -1) {
    quantity = quantity + cards.extra[indexExtra].quantity;
  }
  return quantity;
};
