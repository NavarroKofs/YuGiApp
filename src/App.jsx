import { useState, useEffect } from "react";
import { PDFDocument } from "pdf-lib";
import download from "downloadjs";
import getDecklistForm from "./api/getDecklistForm";
import getCardsById from "./api/getCardsById";
import Sidebar from "./components/Sidebar/Sidebar";
import CardSearcher from "./components/CardSearcher/CardSearcher";
import DeckList from "./components/Decklist/DeckList";
import { AppStyles } from "./styles.css";
import { BehaviorSubject, of } from "rxjs";
import { debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";
import { useDrop } from "react-dnd";
import { useFormik } from "formik";
import { formSchema } from "./components/Decklist/FormValidation";
import { decklistFormFields, COUNT, FILE_SUFFIX } from "./constants/decklist";
import { cardType, deckType } from "./constants/card";
import { FILE_TYPE } from "./constants/file";
import {
  isCardValidForDeck,
  getCardMaxQuantity,
  getDeckMaxSize,
  getNumberOfCopies,
  addOrUpdateCardInDeck,
} from "./utils/validation";

const {
  FIRST_NAME: FIRST_NAME_KEY,
  LASTNAME: LASTNAME_KEY,
  LASTNAME_INITIAL: LASTNAME_INITIAL_KEY,
  KONAMI_ID: KONAMI_ID_KEY,
  DATE_DAY: DATE_DAY_KEY,
  DATE_MONTH: DATE_MONTH_KEY,
  DATE_YEAR: DATE_YEAR_KEY,
  EVENT_NAME: EVENT_NAME_KEY,
  MAIN_DECK_TOTAL: MAIN_DECK_TOTAL_KEY,
  SPELL_CARDS_TOTAL: SPELL_CARDS_TOTAL_KEY,
  TRAP_CARDS_TOTAL: TRAP_CARDS_TOTAL_KEY,
  MONSTER_CARDS_TOTAL: MONSTER_CARDS_TOTAL_KEY,
  MONSTER_CARD,
  SPELL_CARD,
  TRAP_CARD,
  EXTRA_DECK,
  SIDE_DECK,
  EXTRA_DECK_TOTAL: EXTRA_DECK_TOTAL_KEY,
  SIDE_DECK_TOTAL: SIDE_DECK_TOTAL_KEY,
} = decklistFormFields;

const App = () => {
  const [sidebarCard, setSidebarCard] = useState({});
  const [sidebarCardSubject, setSidebarCardSubject] = useState(null);
  const [cards, setCards] = useState({
    main: [],
    extra: [],
    side: [],
  });
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    playerId: "",
    date: "",
    event: "",
  });
  const [formPdfBytes, setFormPdfBytes] = useState(null);

  const formik = useFormik({
    initialValues: {
      name: "",
      lastname: "",
      playerId: "",
      date: "",
      event: "",
    },
    onSubmit: async () => {
      await formSchema
        .validate(formData)
        .then(() => {
          getDecklistSheet();
        })
        .catch((error) => {
          alert(JSON.parse(JSON.stringify(error)).message);
          return false;
        });
    },
  });

  useEffect(() => {
    if (sidebarCardSubject === null) {
      const sub = new BehaviorSubject({});
      setSidebarCardSubject(sub);
    } else {
      const observable = sidebarCardSubject
        .pipe(
          distinctUntilChanged(),
          debounceTime(250),
          switchMap((card) => of(card))
        )
        .subscribe((newState) => {
          setSidebarCard(newState);
        });

      return () => {
        observable.unsubscribe();
        sidebarCardSubject.unsubscribe();
      };
    }
  }, [sidebarCardSubject]);

  const getDecklistSheet = async () => {
    if (getQuantity(cards.main) < 40) {
      alert("Minimum main deck size is 40 cards");
      return;
    }

    try {
      const filterByType = (type) =>
        cards.main.filter((card) => card.type.includes(type));
      const mainMonsters = filterByType(cardType.MONSTER);
      const mainSpells = filterByType(cardType.SPELL);
      const mainTraps = filterByType(cardType.TRAP);

      const exceedsLimit = [mainMonsters, mainSpells, mainTraps].some(
        (group) => group.length > 18
      );
      if (exceedsLimit) {
        alert(
          "The quantity of monsters, spells or traps is more than 18. Please, fill your decksheet manually."
        );
        return;
      }

      let pdfDecksheet = formPdfBytes;
      if (!formPdfBytes) {
        const { data } = await getDecklistForm();
        pdfDecksheet = data;
        setFormPdfBytes(data);
      }

      const pdfDoc = await PDFDocument.load(pdfDecksheet);
      const decklistForm = pdfDoc.getForm();
      const setText = (field, value) =>
        decklistForm.getTextField(field).setText(value);

      setText(FIRST_NAME_KEY, formData.name);
      setText(LASTNAME_KEY, formData.lastname);
      setText(LASTNAME_INITIAL_KEY, formData.lastname.charAt(0).toUpperCase());
      setText(KONAMI_ID_KEY, formData.playerId);

      const date = new Date(formData.date);
      setText(DATE_DAY_KEY, date.getDate().toString().padStart(2, "0"));
      setText(
        DATE_MONTH_KEY,
        (date.getMonth() + 1).toString().padStart(2, "0")
      );
      setText(DATE_YEAR_KEY, date.getFullYear().toString());
      setText(EVENT_NAME_KEY, formData.event);

      const fillCardFields = (cards, countPrefix, namePrefix = null) => {
        cards.forEach((card, index) => {
          const i = index + 1;
          setText(`${countPrefix} ${i} ${COUNT}`, card.quantity.toString());
          setText(`${namePrefix || countPrefix} ${i}`, card.name);
        });
      };

      fillCardFields(mainMonsters, MONSTER_CARD, cardType.MONSTER);
      fillCardFields(mainSpells, SPELL_CARD, cardType.SPELL);
      fillCardFields(mainTraps, TRAP_CARD, cardType.TRAP);
      fillCardFields(cards.extra, EXTRA_DECK);
      fillCardFields(cards.side, SIDE_DECK);

      setText(MAIN_DECK_TOTAL_KEY, getQuantity(cards.main).toString());
      setText(SPELL_CARDS_TOTAL_KEY, getQuantity(mainSpells).toString());
      setText(TRAP_CARDS_TOTAL_KEY, getQuantity(mainTraps).toString());
      setText(MONSTER_CARDS_TOTAL_KEY, getQuantity(mainMonsters).toString());
      setText(SIDE_DECK_TOTAL_KEY, getQuantity(cards.side).toString());
      setText(EXTRA_DECK_TOTAL_KEY, getQuantity(cards.extra).toString());

      const pdfBytes = await pdfDoc.save();
      const fileName = `${formData.name.replace(
        / /g,
        "-"
      )}-${formData.lastname.replace(/ /g, "-")}-${FILE_SUFFIX}`;

      download(pdfBytes, fileName, "application/pdf");
    } catch (e) {
      onFileErrorHandler(e);
    }
  };

  const getCardsInformation = async (ids = []) => {
    const response = await getCardsById(ids);
    return response;
  };

  const onMouseEnterHandler = (card) => {
    if (sidebarCardSubject) {
      return sidebarCardSubject.next(card);
    }
  };

  const getQuantity = (cards) => {
    let quantity = 0;
    for (let index = 0; index < cards.length; index++) {
      cards[index].quantity = cards[index]?.quantity
        ? cards[index].quantity
        : 1;
      quantity = quantity + cards[index].quantity;
    }
    return quantity;
  };

  const [, mainDrop] = useDrop(() => ({
    accept: FILE_TYPE.IMAGE,
    drop: (item) => addToDeck(item, deckType.MAIN),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const [, extraDrop] = useDrop(() => ({
    accept: FILE_TYPE.IMAGE,
    drop: (item) => addToDeck(item, deckType.EXTRA),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const [, sideDrop] = useDrop(() => ({
    accept: FILE_TYPE.IMAGE,
    drop: (item) => addToDeck(item, deckType.SIDE),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const addToDeck = (draggedCard, deckType) => {
    if (!isCardValidForDeck(draggedCard, deckType)) return;

    const maxQuantity = getCardMaxQuantity(draggedCard);
    if (maxQuantity === 0) return;

    const maxDeckSize = getDeckMaxSize(deckType);

    setCards((cards) => {
      const updatedCards = JSON.parse(JSON.stringify(cards));

      if (getQuantity(updatedCards[deckType]) >= maxDeckSize)
        return updatedCards;
      if (getNumberOfCopies(cards, draggedCard) >= maxQuantity)
        return updatedCards;

      return addOrUpdateCardInDeck(
        updatedCards,
        draggedCard,
        deckType,
        maxQuantity
      );
    });
  };

  const onRightClickDeleteHandler = (event, card, type) => {
    if (event.preventDefault !== undefined) {
      event.preventDefault();
    }
    if (event.stopPropagation !== undefined) {
      event.stopPropagation();
    }
    removeFromDeck(card, type);
    return false;
  };

  const removeFromDeck = (draggedCard, type) => {
    setCards((cards) => {
      const cardsAux = JSON.parse(JSON.stringify(cards));
      let index;
      switch (type) {
        case deckType.MAIN:
          index = cardsAux.main.findIndex((card) => card.id === draggedCard.id);
          if (index !== -1) {
            if (cardsAux.main[index].quantity === 1) {
              cardsAux.main = cardsAux.main.filter(
                (card) => card.id !== draggedCard.id
              );
            } else {
              cardsAux.main[index].quantity = cardsAux.main[index].quantity - 1;
            }
          }
          break;
        case deckType.EXTRA:
          index = cardsAux.extra.findIndex(
            (card) => card.id === draggedCard.id
          );
          if (index !== -1) {
            if (cardsAux.extra[index].quantity === 1) {
              cardsAux.extra = cardsAux.extra.filter(
                (card) => card.id !== draggedCard.id
              );
            } else {
              cardsAux.extra[index].quantity =
                cardsAux.extra[index].quantity - 1;
            }
          }
          break;
        case deckType.SIDE:
          index = cardsAux.side.findIndex((card) => card.id === draggedCard.id);
          if (index !== -1) {
            if (cardsAux.side[index].quantity === 1) {
              cardsAux.side = cardsAux.side.filter(
                (card) => card.id !== draggedCard.id
              );
            } else {
              cardsAux.side[index].quantity = cardsAux.side[index].quantity - 1;
            }
          }
          break;

        default:
          break;
      }
      return cardsAux;
    });
  };

  const onChangeFormHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onUploadDecklistHandler = (e) => {
    const file = e.target.files[0];
    if (file.name.substring(file.name.length - 3, file.name.length) === "ydk") {
      let reader;
      try {
        reader = new FileReader();
      } catch (e) {
        return;
      }
      reader.readAsText(file, "UTF-8");
      reader.onload = onFileLoaded;
      reader.onerror = onFileErrorHandler;

      e.target.value = null;
    } else {
      alert("This functionality only works with YDK files");
    }
  };

  const startsWithNumber = (str) => {
    return /^\d/.test(str);
  };

  const onFileLoaded = async (e) => {
    try {
      let text = e.target.result.split("\n");
      for (let index = 0; index < text.length; index++) {
        text[index] = text[index].replace("\r", "");
      }
      text = text.filter((text) => text !== "");

      const indexMain = text.findIndex((t) => t.includes("#main"));
      const indexExtra = text.findIndex((t) => t.includes("#extra"));
      const indexSide = text.findIndex((t) => t.includes("!side"));
      const mainCardsIds = [];
      const sideCardsIds = [];
      const extraCardsIds = [];
      for (let index = 0; index < text.length; index++) {
        if (index > indexMain && index < indexExtra) {
          mainCardsIds.push(text[index]);
        }
      }
      for (let index = 0; index < text.length; index++) {
        if (index > indexExtra && index < indexSide) {
          extraCardsIds.push(text[index]);
        }
      }
      for (let index = 0; index < text.length; index++) {
        if (index > indexSide) {
          sideCardsIds.push(text[index]);
        }
      }

      const info = text.filter((id) => startsWithNumber(id));
      const cardsInformation = (await getCardsInformation(info)).data.data;
      const mainCards = [];
      const sideCards = [];
      const extraCards = [];
      for (let index = 0; index < cardsInformation.length; index++) {
        let quantity = mainCardsIds.filter(
          (card) => card === cardsInformation[index].id.toString()
        ).length;
        if (quantity > 0) {
          mainCards.push({ ...cardsInformation[index], quantity });
        }
        quantity = extraCardsIds.filter(
          (card) => card === cardsInformation[index].id.toString()
        ).length;
        if (quantity > 0) {
          extraCards.push({ ...cardsInformation[index], quantity });
        }
        quantity = sideCardsIds.filter(
          (card) => card === cardsInformation[index].id.toString()
        ).length;
        if (quantity > 0) {
          sideCards.push({ ...cardsInformation[index], quantity });
        }
      }
      setCards({
        main: mainCards,
        extra: extraCards,
        side: sideCards,
      });
    } catch (error) {
      onFileErrorHandler(error);
    }
  };

  const onFileErrorHandler = (e) => {
    alert(`Something went wrong: ${e}`);
  };

  const resetDecklist = (type) => {
    const cardsAux = JSON.parse(JSON.stringify(cards));
    switch (type) {
      case deckType.MAIN:
        cardsAux.main = [];
        setCards(cardsAux);
        break;
      case deckType.SIDE:
        cardsAux.side = [];
        setCards(cardsAux);
        break;
      case deckType.EXTRA:
        cardsAux.extra = [];
        setCards(cardsAux);
        break;
      default:
        break;
    }
  };

  return (
    <div css={AppStyles}>
      <Sidebar card={sidebarCard} />
      <DeckList
        mainCards={cards.main}
        sideCards={cards.side}
        extraCards={cards.extra}
        mainDrop={mainDrop}
        mainLength={getQuantity(cards.main)}
        extraDrop={extraDrop}
        extraLength={getQuantity(cards.extra)}
        sideDrop={sideDrop}
        sideLength={getQuantity(cards.side)}
        onRightClick={onRightClickDeleteHandler}
        onMouseEnterHandler={onMouseEnterHandler}
        onFormChange={onChangeFormHandler}
        onDownload={formik.handleSubmit}
        onUpload={onUploadDecklistHandler}
        onTitleButtonClick={resetDecklist}
      />
      <CardSearcher
        onMouseEnterHandler={onMouseEnterHandler}
        removeFromDeck={removeFromDeck}
      />
    </div>
  );
};

export default App;
