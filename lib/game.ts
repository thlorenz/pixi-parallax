import * as P from 'pixi.js'

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

  _far! : P.extras.TilingSprite
  _mid! : P.extras.TilingSprite

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
      ._renderTilingSprite(this._farTexture, 0, 0)
    this._mid = this
      ._renderTilingSprite(this._midTexture, 0, this._textureHeight / 2)
    this._app.ticker.add(this.update)
  }

  update() : void {
    this._far.tilePosition.x -= 0.128
    this._mid.tilePosition.x -= 0.64
  }

  dispose() : void {
  }

  _renderTilingSprite(url : string, x : number, y : number) : P.extras.TilingSprite {
    const texture = P.Texture.fromImage(this._fullUrl(url))
    // need predefined width/height here, as the texture.baseTexture.{width, height}
    // always return 100 until they are rendered
    const sprite = new P.extras.TilingSprite(
        texture
      , this._textureWidth
      , this._textureHeight)

    sprite.position.x = x
    sprite.position.y = y
    sprite.tilePosition.x = 0
    sprite.tilePosition.y = 0
    this._app.stage.addChild(sprite)
    return sprite
  }

  _fullUrl(url : string) : string {
    return `${this._resourceUrl}/${url}`
  }
}
