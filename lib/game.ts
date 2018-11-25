import * as P from 'pixi.js'
import TextureTilingSprite from './texture-tiling-sprite'

interface GameOpts {
    RESOURCE_URL   : string
  , TEXTURE_WIDTH  : number
  , TEXTURE_HEIGHT : number
  , FAR_TEXTURE    : string
  , MID_TEXTURE    : string
}

export default class Game {
  _app           : P.Application
  _resourceUrl   : string
  _textureWidth  : number
  _textureHeight : number
  _farTexture    : string
  _midTexture    : string

  _far! : TextureTilingSprite
  _mid! : TextureTilingSprite

  constructor(app : P.Application, {
      RESOURCE_URL
    , TEXTURE_WIDTH
    , TEXTURE_HEIGHT
    , FAR_TEXTURE
    , MID_TEXTURE
  } : GameOpts) {
    this._app = app
    this._resourceUrl = RESOURCE_URL
    this._textureWidth = TEXTURE_WIDTH
    this._textureHeight = TEXTURE_HEIGHT
    this._farTexture = FAR_TEXTURE
    this._midTexture = MID_TEXTURE
    this._bind()
  }

  _bind() :void {
    this.update = this.update.bind(this)
  }

  start() : void {
    this._far = this
      ._renderTilingSprite(this._farTexture, 0, 0, 0.128)
    this._mid = this
      ._renderTilingSprite(this._midTexture, 0, this._textureHeight / 2, 0.64)
    this._app.ticker.add(this.update)
  }

  update() : void {
    this._far.update()
    this._mid.update()
  }

  dispose() : void {
  }

  _renderTilingSprite(url : string, x : number, y : number, deltaX : number) : TextureTilingSprite {
    const sprite = new TextureTilingSprite({
        url: this._fullUrl(url)
      , x
      , y
      , textureWidth: this._textureWidth
      , textureHeight: this._textureHeight
      , deltaX
    })
    this._app.stage.addChild(sprite)
    return sprite
  }

  _fullUrl(url : string) : string {
    return `${this._resourceUrl}/${url}`
  }
}
