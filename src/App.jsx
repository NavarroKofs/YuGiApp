import { useState, useEffect } from 'react'
import { PDFDocument } from 'pdf-lib'
import download from 'downloadjs'
import getDecklistForm from './api/getDecklistForm'
import getCardsById from './api/getCardsById'
import Sidebar from './components/Sidebar/Sidebar'
import CardSearcher from './components/CardSearcher/CardSearcher'
import DeckList from './components/Decklist/DeckList'
import { AppStyles } from './styles.css'
import { BehaviorSubject, of } from 'rxjs'
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators'
import { useDrop } from 'react-dnd'
import { useFormik } from 'formik'
import { formSchema } from './components/Decklist/FormValidation'

const App = () => {
  const [sidebarCard, setSidebarCard] = useState({})
  const [sidebarCardSubject, setSidebarCardSubject] = useState(null)
  const [cards, setCards] = useState({
    main: [],
    extra: [],
    side: []
  })
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    playerId: '',
    date: '',
    event: ''
  })
  const [formPdfBytes, setFormPdfBytes] = useState(null)

  const formik = useFormik({
    initialValues: {
      name: '',
      lastname: '',
      playerId: '',
      date: '',
      event: ''
    },
    onSubmit: async () => {
      await formSchema
        .validate(formData)
        .then(() => {
          getDecklistSheet()
        })
        .catch((error) => {
          alert(JSON.parse(JSON.stringify(error)).message)
          return false
        })
    }
  })

  useEffect(() => {
    if (sidebarCardSubject === null) {
      const sub = new BehaviorSubject({})
      setSidebarCardSubject(sub)
    } else {
      const observable = sidebarCardSubject
        .pipe(
          distinctUntilChanged(),
          debounceTime(250),
          switchMap((card) => of(card))
        )
        .subscribe((newState) => {
          setSidebarCard(newState)
        })

      return () => {
        observable.unsubscribe()
        sidebarCardSubject.unsubscribe()
      }
    }
  }, [sidebarCardSubject])

  const getDecklistSheet = async () => {
    if (getQuantity(cards.main) < 40) {
      alert('Minimum main deck size is 40 cards')
      return
    }
    try {
      const mainMonsters = cards.main.filter((card) =>
        card.type.includes('Monster')
      )
      const mainSpells = cards.main.filter((card) =>
        card.type.includes('Spell')
      )
      const mainTraps = cards.main.filter((card) => card.type.includes('Trap'))

      if (
        mainMonsters.length > 18 ||
        mainSpells.length > 18 ||
        mainTraps.length > 18
      ) {
        alert(
          'The quantity of monsters, spells or traps is more than 18. Please, fill your decksheet manually.'
        )
        return
      }

      let pdfDecksheet
      if (!formPdfBytes) {
        pdfDecksheet = await (await getDecklistForm()).data
        setFormPdfBytes(pdfDecksheet)
      } else {
        pdfDecksheet = formPdfBytes
      }
      const pdfDoc = await PDFDocument.load(pdfDecksheet)
      const decklistForm = pdfDoc.getForm()
      decklistForm
        .getTextField('Full Name')
        .setText(`${formData.name} ${formData.lastname}`)
      decklistForm
        .getTextField('Last Initial')
        .setText(formData.lastname.charAt(0).toUpperCase())
      decklistForm.getTextField('Konami Player ID').setText(formData.playerId)
      const date = new Date(formData.date)
      decklistForm
        .getTextField('Day')
        .setText(date.getDate().toString().padStart(2, '0'))
      decklistForm
        .getTextField('Month')
        .setText((date.getMonth() + 1).toString().padStart(2, '0'))
      decklistForm.getTextField('Year').setText(date.getFullYear().toString())
      decklistForm.getTextField('Event Name').setText(formData.event)

      mainMonsters.map((card, index) => {
        decklistForm
          .getTextField(`Mon ${index + 1} ${index === 0 ? 'number' : 'Number'}`)
          .setText(card.quantity.toString())
        decklistForm.getTextField(`Mon ${index + 1} Name`).setText(card.name)
        index++
      })

      mainSpells.map((card, index) => {
        decklistForm
          .getTextField(`Spell ${index + 1} Number`)
          .setText(card.quantity.toString())
        decklistForm.getTextField(`Spell ${index + 1} Name`).setText(card.name)
        index++
      })

      mainTraps.map((card, index) => {
        decklistForm
          .getTextField(`Trap ${index + 1} Number`)
          .setText(card.quantity.toString())
        decklistForm.getTextField(`Trap ${index + 1} Name`).setText(card.name)
        index++
      })

      cards.extra.map((card, index) => {
        decklistForm
          .getTextField(`Extra ${index + 1} Number`)
          .setText(card.quantity.toString())
        decklistForm.getTextField(`Extra ${index + 1} Name`).setText(card.name)
        index++
      })

      cards.side.map((card, index) => {
        decklistForm
          .getTextField(`Side ${index + 1} Number`)
          .setText(card.quantity.toString())
        decklistForm.getTextField(`Side ${index + 1} Name`).setText(card.name)
        index++
      })

      decklistForm
        .getTextField('Main Deck Total')
        .setText(getQuantity(cards.main).toString())

      decklistForm
        .getTextField('Total Spell Cards')
        .setText(getQuantity(mainSpells).toString())
      decklistForm
        .getTextField('Total Trap Cards')
        .setText(getQuantity(mainTraps).toString())
      decklistForm
        .getTextField('Total Mon Cards')
        .setText(getQuantity(mainMonsters).toString())
      decklistForm
        .getTextField('Total Side Number')
        .setText(getQuantity(cards.side).toString())
      decklistForm
        .getTextField('Total Extra Deck')
        .setText(getQuantity(cards.extra).toString())
      const pdfBytes = await pdfDoc.save()
      download(
        pdfBytes,
        `${formData.name.replace(' ', '-')}-${formData.lastname.replace(
          ' ',
          '-'
        )}-Decksheet.pdf`,
        'application/pdf'
      )
    } catch (e) {
      onFileErrorHandler(e)
    }
  }

  const getCardsInformation = async (ids = []) => {
    const response = await getCardsById(ids)
    return response
  }

  const onMouseEnterHandler = (card) => {
    if (sidebarCardSubject) {
      return sidebarCardSubject.next(card)
    }
  }

  const getQuantity = (cards) => {
    let quantity = 0
    for (let index = 0; index < cards.length; index++) {
      cards[index].quantity = cards[index]?.quantity
        ? cards[index].quantity
        : 1
      quantity = quantity + cards[index].quantity
    }
    return quantity
  }

  const isExtraDeckCard = (card) => {
    if (
      card.type.includes('Synchro') ||
      card.type.includes('Fusion') ||
      card.type.includes('XYZ') ||
      card.type.includes('Link')
    ) {
      return true
    }
    return false
  }

  const [, mainDrop] = useDrop(() => ({
    accept: 'image',
    drop: (item) => addToMainDeck(item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }))

  const [, extraDrop] = useDrop(() => ({
    accept: 'image',
    drop: (item) => addToExtraDeck(item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }))

  const [, sideDrop] = useDrop(() => ({
    accept: 'image',
    drop: (item) => addToSideDeck(item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }))

  const getNumberOfCopies = (cards, draggedCard) => {
    const indexMain = cards.main.findIndex(
      (card) => card.id === draggedCard.id
    )
    const indexSide = cards.side.findIndex(
      (card) => card.id === draggedCard.id
    )
    const indexExtra = cards.extra.findIndex(
      (card) => card.id === draggedCard.id
    )
    let quantity = 0
    if (indexMain !== -1) {
      quantity =
        quantity +
        (cards.main[indexMain]?.quantity ? cards.main[indexMain].quantity : 0)
    }
    if (indexSide !== -1) {
      quantity = quantity + cards.side[indexSide].quantity
    }
    if (indexExtra !== -1) {
      quantity = quantity + cards.extra[indexExtra].quantity
    }
    return quantity
  }

  const addToMainDeck = (draggedCard) => {
    if (isExtraDeckCard(draggedCard)) {
      return
    }
    let maxQuantity = 3
    switch (draggedCard?.banlist_info?.ban_tcg) {
      case 'Banned':
        return
      case 'Limited':
        maxQuantity = 1
        break
      case 'Semi-Limited':
        maxQuantity = 2
        break
      default:
        maxQuantity = 3
        break
    }
    setCards((cards) => {
      const cardsAux = JSON.parse(JSON.stringify(cards))
      if (getQuantity(cardsAux.main) >= 60) {
        return cardsAux
      }
      if (maxQuantity <= getNumberOfCopies(cards, draggedCard)) {
        return cardsAux
      }
      const index = cardsAux.main.findIndex(
        (card) => card.id === draggedCard.id
      )
      if (index !== -1) {
        if (cardsAux.main[index]?.quantity === maxQuantity) {
          return cardsAux
        }
        cardsAux.main[index].quantity = cardsAux.main[index].quantity + 1
      } else {
        cardsAux.main.push({ ...draggedCard, quantity: 1 })
      }
      return cardsAux
    })
  }

  const addToExtraDeck = (draggedCard) => {
    if (!isExtraDeckCard(draggedCard)) {
      return
    }
    let maxQuantity = 3
    switch (draggedCard?.banlist_info?.ban_tcg) {
      case 'Banned':
        return
      case 'Limited':
        maxQuantity = 1
        break
      case 'Semi-Limited':
        maxQuantity = 2
        break
      default:
        maxQuantity = 3
        break
    }
    setCards((cards) => {
      const cardsAux = JSON.parse(JSON.stringify(cards))
      if (getQuantity(cardsAux.extra) >= 15) {
        return cardsAux
      }
      if (maxQuantity <= getNumberOfCopies(cards, draggedCard)) {
        return cardsAux
      }
      const index = cardsAux.extra.findIndex(
        (card) => card.id === draggedCard.id
      )
      if (index !== -1) {
        if (cardsAux.extra[index]?.quantity === maxQuantity) {
          return cardsAux
        }
        cardsAux.extra[index].quantity = cardsAux.extra[index].quantity + 1
      } else {
        cardsAux.extra.push({ ...draggedCard, quantity: 1 })
      }
      return cardsAux
    })
  }

  const addToSideDeck = (draggedCard) => {
    let maxQuantity = 3
    switch (draggedCard?.banlist_info?.ban_tcg) {
      case 'Banned':
        return
      case 'Limited':
        maxQuantity = 1
        break
      case 'Semi-Limited':
        maxQuantity = 2
        break
      default:
        maxQuantity = 3
        break
    }
    setCards((cards) => {
      const cardsAux = JSON.parse(JSON.stringify(cards))
      if (getQuantity(cardsAux.side) >= 15) {
        return cardsAux
      }
      if (maxQuantity <= getNumberOfCopies(cards, draggedCard)) {
        return cardsAux
      }
      const index = cardsAux.side.findIndex(
        (card) => card.id === draggedCard.id
      )
      if (index !== -1) {
        if (cardsAux.side[index]?.quantity === maxQuantity) {
          return cardsAux
        }
        cardsAux.side[index].quantity = cardsAux.side[index].quantity + 1
      } else {
        cardsAux.side.push({ ...draggedCard, quantity: 1 })
      }
      return cardsAux
    })
  }

  const onRightClickDeleteHandler = (event, card, type) => {
    if (event.preventDefault !== undefined) {
      event.preventDefault()
    }
    if (event.stopPropagation !== undefined) {
      event.stopPropagation()
    }
    removeFromDeck(card, type)
    return false
  }

  const removeFromDeck = (draggedCard, type) => {
    setCards((cards) => {
      const cardsAux = JSON.parse(JSON.stringify(cards))
      let index
      switch (type) {
        case 'Deck':
          index = cardsAux.main.findIndex((card) => card.id === draggedCard.id)
          if (index !== -1) {
            if (cardsAux.main[index].quantity === 1) {
              cardsAux.main = cardsAux.main.filter(
                (card) => card.id !== draggedCard.id
              )
            } else {
              cardsAux.main[index].quantity = cardsAux.main[index].quantity - 1
            }
          }
          break
        case 'Extra':
          index = cardsAux.extra.findIndex(
            (card) => card.id === draggedCard.id
          )
          if (index !== -1) {
            if (cardsAux.extra[index].quantity === 1) {
              cardsAux.extra = cardsAux.extra.filter(
                (card) => card.id !== draggedCard.id
              )
            } else {
              cardsAux.extra[index].quantity =
                cardsAux.extra[index].quantity - 1
            }
          }
          break
        case 'Side':
          index = cardsAux.side.findIndex((card) => card.id === draggedCard.id)
          if (index !== -1) {
            if (cardsAux.side[index].quantity === 1) {
              cardsAux.side = cardsAux.side.filter(
                (card) => card.id !== draggedCard.id
              )
            } else {
              cardsAux.side[index].quantity = cardsAux.side[index].quantity - 1
            }
          }
          break

        default:
          break
      }
      return cardsAux
    })
  }

  const onChangeFormHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const onUploadDecklistHandler = (e) => {
    const file = e.target.files[0]
    if (file.name.substring(file.name.length - 3, file.name.length) === 'ydk') {
      let reader
      try {
        reader = new FileReader()
      } catch (e) {
        return
      }
      reader.readAsText(file, 'UTF-8')
      reader.onload = onFileLoaded
      reader.onerror = onFileErrorHandler
    } else {
      alert('This functionality only works on YDK files')
    }
  }

  const startsWithNumber = (str) => {
    return /^\d/.test(str)
  }

  const onFileLoaded = async (e) => {
    try {
      let text = e.target.result.split('\n')
      for (let index = 0; index < text.length; index++) {
        text[index] = text[index].replace('\r', '')
      }
      text = text.filter((text) => text !== '')

      const indexMain = text.findIndex((t) => t === '#main')
      const indexExtra = text.findIndex((t) => t === '#extra')
      const indexSide = text.findIndex((t) => t === '!side')
      const mainCardsIds = []
      const sideCardsIds = []
      const extraCardsIds = []
      for (let index = 0; index < text.length; index++) {
        if (index > indexMain && index < indexExtra) {
          mainCardsIds.push(text[index])
        }
      }
      for (let index = 0; index < text.length; index++) {
        if (index > indexExtra && index < indexSide) {
          extraCardsIds.push(text[index])
        }
      }
      for (let index = 0; index < text.length; index++) {
        if (index > indexSide) {
          sideCardsIds.push(text[index])
        }
      }

      const info = text.filter((id) => startsWithNumber(id))
      const cardsInformation = (await getCardsInformation(info)).data.data
      const mainCards = []
      const sideCards = []
      const extraCards = []
      for (let index = 0; index < cardsInformation.length; index++) {
        let quantity = mainCardsIds.filter(
          (card) => card === cardsInformation[index].id.toString()
        ).length
        if (quantity > 0) {
          mainCards.push({ ...cardsInformation[index], quantity })
        }
        quantity = extraCardsIds.filter(
          (card) => card === cardsInformation[index].id.toString()
        ).length
        if (quantity > 0) {
          extraCards.push({ ...cardsInformation[index], quantity })
        }
        quantity = sideCardsIds.filter(
          (card) => card === cardsInformation[index].id.toString()
        ).length
        if (quantity > 0) {
          sideCards.push({ ...cardsInformation[index], quantity })
        }
      }
      setCards({
        main: mainCards,
        extra: extraCards,
        side: sideCards
      })
    } catch (error) {
      onFileErrorHandler(error)
    }
  }

  const onFileErrorHandler = (e) => {
    alert(`Something went wrong: ${e}`)
  }

  const resetDecklist = (type) => {
    const cardsAux = JSON.parse(JSON.stringify(cards))
    switch (type) {
      case 'deck':
        cardsAux.main = []
        setCards(cardsAux)
        break
      case 'side':
        cardsAux.side = []
        setCards(cardsAux)
        break
      case 'extra':
        cardsAux.extra = []
        setCards(cardsAux)
        break
      default:
        break
    }
  }

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
  )
}

export default App
