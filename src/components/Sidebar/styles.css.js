import { css } from '@emotion/react'

export const SidebarStyle = css`
  width: 25vw;
  height: 98vh;
  overflow-y: auto;
  overflow-z: hidden;
  border: 1px solid #000;
  background-color: rgba(0,0,0,.5);
  backdrop-filter: blur(4px);
  color: #fefefe;
  @media (orientation: portrait) {
    display: none;
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

  @media (max-width: 1320px) {
    font-size: 1rem;
  }

  @media (max-width: 500px) {
    font-size: 0.5rem;
  }
  
  .sidebar-card-image {
    display: flex;
    justify-content: center;
  }

  .card-image {
    margin: 1vw;
    width: 60%;
  }

  .card-title {
    font-size: 1.2rem;
    margin: 0 auto;
    text-align: center;
    border: 1px solid #000;
    width: calc(100% - 2vw);
    @media (max-width: 1320px) {
      font-size: 1rem;
    }

    @media (max-width: 500px) {
      font-size: 0.5rem;
    }
  }

  .sidebar-card-information-container {
    margin: 1vw;
    width: calc(100% - 2vw);
  }

  .card-type {
    margin-right: 1vw;
    display: inline-block;
  }

  .card-stars {
    margin-right: 1vw;
    display: inline-block;
  }

  @media (max-width: 1320px) {
    width: 20vw;
  }
`
