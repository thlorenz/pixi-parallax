import * as P from 'pixi.js'
import TextureTilingSprite from './texture-tiling-sprite'

interface ScrollerOpts {
    TEXTURE_WIDTH  : number
  , TEXTURE_HEIGHT : number
  , FAR_TEXTURE    : string
  , MID_TEXTURE    : string
  , fullUrl        : Function
}

export default class Scroller {
  _far : TextureTilingSprite
  _mid : TextureTilingSprite

  constructor(stage : P.Container, {
      TEXTURE_WIDTH
    , TEXTURE_HEIGHT
    , FAR_TEXTURE
    , MID_TEXTURE
    , fullUrl
  } : ScrollerOpts) {
    this._far = new TextureTilingSprite({
        url: fullUrl(FAR_TEXTURE)
      , x: 0
      , y: 0
      , textureWidth: TEXTURE_WIDTH
      , textureHeight: TEXTURE_HEIGHT
      , deltaX: 0.128
    })
    this._mid = new TextureTilingSprite({
        url: fullUrl(MID_TEXTURE)
      , x: 0
      , y: TEXTURE_HEIGHT / 2
      , textureWidth: TEXTURE_WIDTH
      , textureHeight: TEXTURE_HEIGHT
      , deltaX: 0.64
    })
    stage.addChild(this._far)
    stage.addChild(this._mid)
  }

  update() {
    this._far.update()
    this._mid.update()
  }
}
