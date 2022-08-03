import { css } from '@emotion/react'

export const DeckListStyles = css`
  background-color: rgba(0,0,0,.5);
  width: 50vw;
  height: 98vh;
  overflow-y: auto;
  border-top: 1px solid #000;
  overflow: hidden;
  
  .card-holder-title {
    color: #fefefe;
    height: 5vh;
    border-bottom: 1px solid #000;
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: space-between;

    p {
      padding: 0 1vw;
      margin: 0;
      font-size: 1rem;
      @media (max-height: 700px) {
        font-size: 0.5rem;
      }
    }

    div {
      width: 5%;
      height: 60%;
      border: 1px solid #000;
      border-radius: 5px;
      background-color: rgb(254,219,65);
      font-size: 1rem;
      color: black;
      margin: 0 1vw;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      backdrop-filter: blur(4px);

      :hover {
        box-shadow: 0px 0px 19px rgb(0,172,234);
      }
    }
  }

  .card-holder-content {
    display: flex;
    justify-content: center;
    width: 95%;
    margin: 0 auto;
    height: calc(95% - 5vh);
    padding: .5vh 0;
    .card-holder-cards {
      width: 95%;
      display: grid;
      gap: .5vw;
      align-items: start;
      flex-wrap: wrap;
    }

    .deck {
      grid-template-columns: repeat(10, 1fr);
      grid-template-rows: repeat(4, 24%);
    }

    .miniDeck {
      grid-template-rows: repeat(6, 15%);
    }

    .extra {
      grid-template-columns: repeat(15, 1fr);
      grid-template-rows: 90%;
    }

    .miniExtra {
      grid-template-columns: repeat(10, 1fr);
      grid-template-rows: 90%;
    }
  }
`

export const DeckFormStyles = css`
  width: 100%;
  height: 10%;
  border: 1px solid #000;
  display: flex;
  justify-content: center;
  align-items: center;

  form {
    width: 90%;
    height: 90%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 45%);
    gap: .5vw;
    @media (max-height: 700px) {
      width: 100%;
      gap: 0;
    }
  }

  .actions-pdf-container {
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;

    img {
      height: 100%;
      cursor: pointer;
    }

    .image-upload {
      height: 100%;
      label {
        height: 100%;
      }
    }

    .image-upload > input {
      display: none;
    }

    .image-upload img {
        height: 100%;
        cursor: pointer;
    }
  }

  input {
    width: 90%;
    height: 80%;
    display:inline-block;
    padding: 0.2vh 0.5vw;
    line-height: 100%;
    outline: none;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 5px;

    @media (max-height: 700px) {
      height: 50%;
      font-size: 0.5rem;
    }
  }

  input[type="date"]:not(.has-value):before{
    content: attr(placeholder);
  }

`

export const MainDeckStyles = css`
  width: 100%;
  height: 59%;
  border: 1px solid #000;
`

export const ExtraDeckStyles = css`
  width: calc(100%-2px);
  height: 15%;
  border: 1px solid #000;
`

export const SideDeckStyles = css`
  width: calc(100%-2px);
  height: 15%;
  border: 1px solid #000;
`

export const CardStyles = css`
  width: 100%;
  height: 100%;
  img {
    width: 100%;
    height: 100%;
    object-fit: fill;
  }
`
