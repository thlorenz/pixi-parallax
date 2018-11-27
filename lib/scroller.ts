import * as P from 'pixi.js'
import TextureTilingSprite from './texture-tiling-sprite'
import Walls from './walls'
import MapBuilder from './map-builder';

interface ScrollerOpts {
    TEXTURE_WIDTH  : number
  , TEXTURE_HEIGHT : number
  , FAR_TEXTURE    : string
  , MID_TEXTURE    : string
  , fullUrl        : Function
}

export default class Scroller {
  _far        : TextureTilingSprite
  _mid        : TextureTilingSprite
  _front      : Walls
  _mapBuilder : MapBuilder
  _viewportX  : number

  constructor(stage : P.Container, walls: Walls, {
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
      , deltaX: 0.064
    })

    this._mid = new TextureTilingSprite({
        url: fullUrl(MID_TEXTURE)
      , x: 0
      , y: TEXTURE_HEIGHT / 2
      , textureWidth: TEXTURE_WIDTH
      , textureHeight: TEXTURE_HEIGHT
      , deltaX: 0.32
    })
    this._front = walls

    this._mapBuilder = new MapBuilder(this._front)

    stage.addChild(this._far)
    stage.addChild(this._mid)
    stage.addChild(this._front)

    this._viewportX = 0
  }

  init() {
    this._mapBuilder.init()
  }

  get viewportX() {
    return this._viewportX
  }

  set viewportX(val : number) {
    this._viewportX = val
    this._far.viewportX = val
    this._mid.viewportX = val
    this._front.viewportX = val
  }
}
