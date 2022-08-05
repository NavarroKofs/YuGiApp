import { css } from '@emotion/react'
import magnifierIcon from '../../assets/magnifier-icon.svg'

export const CardSearcherStyle = css`
  width: 20vw;
  height: 5%;
  height: 98vh;
  border: 1px solid #000;
  background-color: rgba(0,0,0,.5);
  box-shadow: 0px 0px 19px #009fda;
  backdrop-filter: blur(4px);
  @media (orientation: portrait) {
    width: 30vw;
  }
`

export const SearchBarStyle = css`
  width: 100%;
  height: 5%;
  display: flex;
  justify-content: center;
  border-bottom: 1px solid #000;

  input {
    margin: 3%;
    width: 90%;
    outline: none;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-image: url(${magnifierIcon});
    background-position: 0px;
    background-repeat: no-repeat;
    padding-left: 1.6vw;

    @media (max-height: 700px) {
      font-size: 0.5rem;
      width: 100%;
      margin: 0;
      background-image: none;
      padding-left: .2vw;
      padding-right: .2vw;
      border: none;
      border-radius: 0px;
    }

    @media (max-width: 912px) {
      width: 100%;
      margin: 0;
      background-image: none;
      padding-left: .2vw;
      padding-right: .2vw;
      border: none;
      border-radius: 0px;
    }
  }
`

export const CardItemStyles = css`
  display: grid;
  grid-template-columns: 2fr 6fr;
  width: 98%;
  height: 10vh;
  grid-gap: .2vw;
  border: 1px solid #000;
  color: #fefefe;

  @media (orientation: portrait) {
    height: 5vh;
    grid-template-columns: 3fr 5fr;
  }

  .card-picture {
    margin-right: .2vw;
    height: 10vh;
    @media (orientation: portrait) {
      height: 5vh;
    }
    img {
      height: 100%;
      width: 100%;
    }
  }

  .card-info {
    font-size: 1vw;
    line-height: .5vh;
    display: grid;
    grid-auto-rows: 1fr;
    grid-gap: 1px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding: 1vh 0;

    @media (orientation: portrait) {
      font-size: 1.5vw;
    }

    p {
      margin: 2px 0;
      text-overflow: ellipsis;
    }
  }
`
export const SearchResultsStyles = css`
  height: 95%;
  overflow-y: auto;
  h5 {
    margin: 1vh;
    font-size: 1vw;
    color: #fefefe
  }
  ::-webkit-scrollbar {
    width: 12px;
    height: 12px;
  }
  ::-webkit-scrollbar:window-inactive {
    display: none;
  }
  ::-webkit-scrollbar:corner-present  {
  }
  ::-webkit-scrollbar-track-piece {
    border-radius: 2px;
    background-color: #369;
    background-clip: content-box;
    border-radius: 6px;
    border: solid 4px transparent;
  }
  ::-webkit-scrollbar-track-piece:decrement {
    background: orange;
    background-clip: content-box;
    border: solid 4px transparent;
  }
  section::-webkit-scrollbar-button:vertical:start:decrement {
    background: transparent url(https://elcssar.com/ejemplos/arrow_up.png) no-repeat center center;
  }
  section::-webkit-scrollbar-button:vertical:end:decrement {
    background: transparent url(https://elcssar.com/ejemplos/arrow_up.png) no-repeat center center;
  }
  section::-webkit-scrollbar-button:vertical:end:increment {
    background: transparent url(https://elcssar.com/ejemplos/arrow_down.png) no-repeat center center;
  }
  section::-webkit-scrollbar-button:horizontal:decrement {
    background: transparent url(https://elcssar.com/ejemplos/arrow_left.png) no-repeat center center;
  }
  ::-webkit-scrollbar-button:horizontal:increment {
    background: transparent url(https://elcssar.com/ejemplos/arrow_right.png) no-repeat center center;
  }

  ::-webkit-scrollbar-thumb  {
    height: 10px;
    width: 4px;
    background-color: #09C;
    border-radius: 6px;
    box-shadow: 0 3px 6px -2px rgba(51,0,51,0.5);
  }
  ::-webkit-scrollbar-corner {
    background: transparent ;
  }
  ::-webkit-resizer {
    background: transparent url(https://elcssar.com/ejemplos/expandIcon.png) no-repeat -1px -1px;
  }
  ::-webkit-scrollbar-track-piece:no-button {
    background-color: red;
  }
`
