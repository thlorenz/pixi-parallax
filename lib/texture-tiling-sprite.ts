import * as P from 'pixi.js'

interface TextureTilingSpriteOpts {
    url : string
  , x : number
  , y : number
  , textureWidth: number
  , textureHeight: number
  , deltaX : number
}

export default class TextureTilingSprite extends P.extras.TilingSprite {
  _deltaX: number
  _viewportX: number

  constructor ({
      url
    , x
    , y
    , textureWidth
    , textureHeight
    , deltaX
  } : TextureTilingSpriteOpts) {
    const texture = P.Texture.fromImage(url)

    // need predefined width/height here, as the texture.baseTexture.{width, height}
    // always return 100 until they are rendered
    super(texture, textureWidth, textureHeight)

    this.position.x = x
    this.position.y = y
    this.tilePosition.x = 0
    this.tilePosition.y = 0

    this._viewportX = 0
    this._deltaX = deltaX
  }

  set viewportX(val : number) {
    const distanceToTravel = val - this._viewportX
    this._viewportX = val
    this.tilePosition.x -= (distanceToTravel * this._deltaX)
  }
}
