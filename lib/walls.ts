import * as P from 'pixi.js'
import WallSpritesPool from './wall-sprites-pool'
import { WallSprite as WS } from './enums'

class WallSlice {
  _type    : WS
  _y       : number
  _sprite! : P.Sprite | null

  static WIDTH: number = 64

  constructor(type: WS, y: number) {
    this._type = type
    this._y = y
  }

  get sprite(): P.Sprite | null { return this._sprite }
  set sprite(val: P.Sprite | null) {
    this._sprite = val
    if (this._sprite != null) this._sprite.y = this._y
  }

  get type(): WS { return this._type }
}

export default class Walls extends P.Container {
  _pool : WallSpritesPool
  _slices: Array<WallSlice> = []

  _viewportX = 0
  _viewportSliceX = 0

  static VIEWPORT_WIDTH = 512
  static VIEWPORT_NUM_SLICES = Math.ceil(Walls.VIEWPORT_WIDTH / WallSlice.WIDTH) + 1

  constructor(pool: WallSpritesPool) {
    super()
    this._pool = pool
  }

  set viewportX(val: number) {
    this._viewportX = this._ensureViewportXBounds(val)
    const prevViewportSliceX = this._viewportSliceX
    this._viewportSliceX = Math.floor(this._viewportX / WallSlice.WIDTH)
    this._addNewSlices()
    this._removeOldSlices(prevViewportSliceX)
  }

  addSlice(spriteType: WS, y: number = 192) : void {
    const slice = new WallSlice(spriteType, y)
    this._slices.push(slice)
  }

  _ensureViewportXBounds(val: number): number {
    if (val < 0) {
      return 0
    } else {
      const maxViewportX = (this._slices.length - Walls.VIEWPORT_NUM_SLICES) * WallSlice.WIDTH
      return Math.min(maxViewportX, val)
    }
  }

  _addNewSlices() {
    const firstX = -(this._viewportX % WallSlice.WIDTH)
    for (
      let i = this._viewportSliceX, sliceIndex = 0;
      i < this._viewportSliceX + Walls.VIEWPORT_NUM_SLICES;
      i++, sliceIndex++) {
      const slice = this._slices[i]
      if (slice.sprite == null && slice.type !== WS.Gap) {
        slice.sprite = this._pool.checkout(slice.type)
        slice.sprite.position.x = firstX + (sliceIndex * WallSlice.WIDTH)
        this.addChild(slice.sprite)
      } else if (slice.sprite != null) {
        slice.sprite.position.x = firstX + (sliceIndex * WallSlice.WIDTH)
      }
    }
  }

  _removeOldSlices(prevViewportSliceX : number) {
    const numOldSlices = Math.min(
        this._viewportSliceX - prevViewportSliceX
      , Walls.VIEWPORT_NUM_SLICES)

    for (let i = prevViewportSliceX; i < prevViewportSliceX + numOldSlices; i++) {
      const slice = this._slices[i]
      if (slice.sprite == null) continue
      this._pool.checkin(slice.type, slice.sprite)
      this.removeChild(slice.sprite)
      slice.sprite = null
    }
  }
}
