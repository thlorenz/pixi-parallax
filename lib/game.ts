import * as P from 'pixi.js'
import Scroller from './scroller'
import maybeLoad from './maybe-load'
import WallSpritesPool from './wall-sprites-pool';
import Walls from './walls'

interface GameOpts {
    RESOURCE_URL        : string
  , TEXTURE_WIDTH       : number
  , TEXTURE_HEIGHT      : number
  , FAR_TEXTURE         : string
  , MID_TEXTURE         : string
  , MIN_SCROLL_SPEED    : number
  , MAX_SCROLL_SPEED    : number
  , SCROLL_ACCELERATION : number
}

export default class Game {
  _app                : P.Application
  _resourceUrl        : string
  _scroller           : Scroller;
  _scrollSpeed        : number
  _maxScrollSpeed     : number
  _scrollAcceleration : number

  _wallSlices : Array<P.Sprite> = []
  _wallPool   : WallSpritesPool
  _walls      : Walls

  constructor(app : P.Application, {
      RESOURCE_URL
    , TEXTURE_WIDTH
    , TEXTURE_HEIGHT
    , FAR_TEXTURE
    , MID_TEXTURE
    , MIN_SCROLL_SPEED
    , MAX_SCROLL_SPEED
    , SCROLL_ACCELERATION
  } : GameOpts) {
    this._bind()

    this._app = app
    this._resourceUrl = RESOURCE_URL
    this._wallPool = new WallSpritesPool()
    this._walls = new Walls(this._wallPool)
    this._scroller = new Scroller(this._app.stage, this._walls, {
        TEXTURE_WIDTH
      , TEXTURE_HEIGHT
      , FAR_TEXTURE
      , MID_TEXTURE
      , fullUrl: this._fullUrl
    })
    this._scrollSpeed = MIN_SCROLL_SPEED
    this._maxScrollSpeed = MAX_SCROLL_SPEED
    this._scrollAcceleration = SCROLL_ACCELERATION
  }

  _bind(): void {
    this._update = this._update.bind(this)
    this._fullUrl = this._fullUrl.bind(this)
    this._onspriteSheetLoaded = this._onspriteSheetLoaded.bind(this)
  }

  start(): void {
    this._loadSpriteSheet()
  }

  _update(): void {
    this._scroller.viewportX += this._scrollSpeed
    this._scrollSpeed += this._scrollAcceleration
    if (this._scrollSpeed > this._maxScrollSpeed) {
      this._scrollSpeed = this._maxScrollSpeed
    }
  }

  _loadSpriteSheet(): void {
    maybeLoad(this._fullUrl('wall.json'), this._onspriteSheetLoaded)
  }

  _onspriteSheetLoaded(): void {
    this._app.ticker.add(this._update)
    this._wallPool.load()
    this._scroller.init()
  }

  _fullUrl(url: string): string {
    return `${this._resourceUrl}/resources/${url}`
  }
}
