import * as P from 'pixi.js'
import Scroller from './scroller'

interface GameOpts {
    RESOURCE_URL   : string
  , TEXTURE_WIDTH  : number
  , TEXTURE_HEIGHT : number
  , FAR_TEXTURE    : string
  , MID_TEXTURE    : string
}

export default class Game {
  _app         : P.Application
  _resourceUrl : string
  _scroller    : Scroller;

  constructor(app : P.Application, {
      RESOURCE_URL
    , TEXTURE_WIDTH
    , TEXTURE_HEIGHT
    , FAR_TEXTURE
    , MID_TEXTURE
  } : GameOpts) {
    this._bind()

    this._app = app
    this._resourceUrl = RESOURCE_URL
    this._scroller = new Scroller(this._app.stage, {
        TEXTURE_WIDTH
      , TEXTURE_HEIGHT
      , FAR_TEXTURE
      , MID_TEXTURE
      , fullUrl: this._fullUrl
    })
  }

  _bind() :void {
    this.update = this.update.bind(this)
    this._fullUrl = this._fullUrl.bind(this)
  }

  start() : void {
    this._app.ticker.add(this.update)
  }

  update() : void {
    this._scroller.update()
  }

  dispose() : void {
  }

  _fullUrl(url : string) : string {
    return `${this._resourceUrl}/${url}`
  }
}
