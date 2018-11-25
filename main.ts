import Game from './lib/game'
import * as P from 'pixi.js'

// See npm run start:server inside package.json
const RESOURCE_URL = 'http://localhost:1235/'
P.loader.baseUrl = RESOURCE_URL

const CANVAS_WIDTH   : number = 512
const CANVAS_HEIGHT  : number = 384
const TEXTURE_WIDTH  : number = 512
const TEXTURE_HEIGHT : number = 256
const FAR_TEXTURE    : string = 'bg-far.png'
const MID_TEXTURE    : string = 'bg-mid.png'

window.addEventListener('DOMContentLoaded', initGame)

let game : Game
function removeExistingGame() : void {
  if (game != null) game.dispose()
  const els = document.body.children
  if (els.length > 0) document.body.removeChild(els.item(0) as Node)
}

function init() : P.Application {
  removeExistingGame()
  const app = new P.Application(
      CANVAS_WIDTH
    , CANVAS_HEIGHT
    , { backgroundColor: 0x222222 }
  )
  document.body.appendChild(app.view)
  return app
}

function initGame() : void {
  const app = init()
  game = new Game(app, {
      RESOURCE_URL
    , TEXTURE_WIDTH
    , TEXTURE_HEIGHT
    , FAR_TEXTURE
    , MID_TEXTURE
  })
  game.start()
}

// @ts-ignore
if (module.hot) {
  // @ts-ignore
  module.hot.accept(function accept() {
    initGame()
  })
}
