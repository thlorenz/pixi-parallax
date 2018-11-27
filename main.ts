import Game from './lib/game'
import * as P from 'pixi.js'

// See npm run start:server inside package.json
const RESOURCE_URL = 'http://localhost:1235'
P.loader.baseUrl = RESOURCE_URL

const CANVAS_WIDTH   = 512
const CANVAS_HEIGHT  = 384
const TEXTURE_WIDTH  = 512
const TEXTURE_HEIGHT = 256
const FAR_TEXTURE    = 'bg-far.png'
const MID_TEXTURE    = 'bg-mid.png'
const MIN_SCROLL_SPEED = 5
const MAX_SCROLL_SPEED = 15
const SCROLL_ACCELERATION = 0.005

window.addEventListener('DOMContentLoaded', initGame)

let game : Game
function removeExistingGame() : void {
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
    , MIN_SCROLL_SPEED
    , MAX_SCROLL_SPEED    
    , SCROLL_ACCELERATION 
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
