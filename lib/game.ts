import * as P from 'pixi.js'
import Scroller from './scroller'
import maybeLoad from './maybe-load'
import WallSpritesPool from './wall-sprites-pool';

interface GameOpts {
    RESOURCE_URL   : string
  , TEXTURE_WIDTH  : number
  , TEXTURE_HEIGHT : number
  , FAR_TEXTURE    : string
  , MID_TEXTURE    : string
  , SCROLL_SPEED   : number
}

export default class Game {
  _app         : P.Application
  _resourceUrl : string
  _scroller    : Scroller;
  _scrollSpeed : number

  _wallSlices : Array<P.Sprite> = []
  _wallPool   : WallSpritesPool

  constructor(app : P.Application, {
      RESOURCE_URL
    , TEXTURE_WIDTH
    , TEXTURE_HEIGHT
    , FAR_TEXTURE
    , MID_TEXTURE
    , SCROLL_SPEED
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
    this._wallPool = new WallSpritesPool()
    this._scrollSpeed = SCROLL_SPEED
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
  }

  dispose(): void {
  }

  _loadSpriteSheet(): void {
    maybeLoad(this._fullUrl('wall.json'), this._onspriteSheetLoaded)
  }

  _onspriteSheetLoaded(): void {
    this._app.ticker.add(this._update)
    this._wallPool.load()
    this._generateTestWallSpan()
    this._clearTestWallSpan()
    this._generateTestWallSpan()
  }

  _renderWallSprites(n: number): void {
    for (let i = 0; i < n; i++) {
      const sprite = (i % 2 === 0)
        ? this._wallPool.borrowWindow()
        : this._wallPool.borrowDecoration()

      sprite.position.x = -32 + (i * 64)
      sprite.position.y = 128
      this._wallSlices.push(sprite)
      this._app.stage.addChild(sprite)
    }
  }

  _removeWallSprites(): void {
    for (let i = 0; i < this._wallSlices.length; i++) {
      const sprite = this._wallSlices[i]
      this._app.stage.removeChild(sprite)
      if (i % 2 === 0) {
        this._wallPool.returnWindow(sprite)
      } else {
        this._wallPool.returnDecoration(sprite)
      }
    }
    this._wallSlices = []
  }

  _fullUrl(url: string): string {
    return `${this._resourceUrl}/${url}`
  }

  _generateTestWallSpan(): void {
    const lookupTable : Array<Function> = [
        this._wallPool.borrowFrontEdge  // 1st slice
      , this._wallPool.borrowWindow     // 2nd slice
      , this._wallPool.borrowDecoration // 3rd slice
      , this._wallPool.borrowStep       // 4th slice
      , this._wallPool.borrowWindow     // 5th slice
      , this._wallPool.borrowBackEdge   // 6th slice
    ]

    const posY = [
        128 // 1st slice
      , 128 // 2nd slice
      , 128 // 3rd slice
      , 192 // 4th slice
      , 192 // 5th slice
      , 192 // 6th slice
    ]

    for (let i = 0; i < lookupTable.length; i++) {
      const fn = lookupTable[i]
      const sprite = fn.call(this._wallPool)
      sprite.position.x = 64 + (i * 64)
      sprite.position.y = posY[i]
      this._wallSlices.push(sprite)
      this._app.stage.addChild(sprite)
    }
  }

  _clearTestWallSpan(): void {
    const lookupTable : Array<Function> = [
        this._wallPool.returnFrontEdge  // 1st slice
      , this._wallPool.returnWindow     // 2nd slice
      , this._wallPool.returnDecoration // 3rd slice
      , this._wallPool.returnStep       // 4th slice
      , this._wallPool.returnWindow     // 5th slice
      , this._wallPool.returnBackEdge   // 6th slice
    ]

    for (let i = 0; i < lookupTable.length; i++) {
      const fn = lookupTable[i]
      const sprite = this._wallSlices[i]
      this._app.stage.addChild(sprite)
      fn.call(this._wallPool, sprite)
    }
    this._wallSlices = []
  }
}
