import Walls from './walls'
import { WallSprite as WS } from './enums';

export default class MapBuilder {
  _walls: Walls

  static WALL_HEIGHTS = [ 256, 224, 192, 160, 128 ]

  constructor(walls : Walls) {
    this._walls = walls
  }

  init() {
    this._createMap()
  }

  _createMap() {
    this._createWallSpan(3, 9, false)
    this._createGap(1)
    this._createWallSpan(1, 30)
    this._createGap(1)
    this._createWallSpan(2, 18)
    this._createGap(1)
    this._createSteppedWallSpan(2, 5, 28)
    this._createGap(1)
    this._createWallSpan(1, 10)
    this._createGap(1)
    this._createWallSpan(2, 6)
    this._createGap(1)
    this._createWallSpan(1, 8)
    this._createGap(1)
    this._createWallSpan(2, 6)
    this._createGap(1)
    this._createWallSpan(1, 8)
    this._createGap(1)
    this._createWallSpan(2, 7)
    this._createGap(1)
    this._createWallSpan(1, 16)
    this._createGap(1)
    this._createWallSpan(2, 6)
    this._createGap(1)
    this._createWallSpan(1, 22)
    this._createGap(2)
    this._createWallSpan(2, 14)
    this._createGap(2)
    this._createWallSpan(3, 8)
    this._createGap(2)
    this._createSteppedWallSpan(3, 5, 12)
    this._createGap(3)
    this._createWallSpan(0, 8)
    this._createGap(3)
    this._createWallSpan(1, 50)
    this._createGap(20)
  }

  _createGap(spanLen: number) {
    for (let i = 0; i < spanLen; i++) {
      this._walls.addSlice(WS.Gap)
    }
  }

  _createSteppedWallSpan(
      heightIndex: number
    , spanALen: number = 0
    , spanBLen: number = 0) {
    heightIndex = Math.max(heightIndex, 2)
    this._createWallSpan(heightIndex, spanALen, true, false)
    this._addWallStep(heightIndex - 2)
    this._createWallSpan(heightIndex - 2, spanBLen, false, true)
  }

  _createWallSpan(
      heightIndex: number
    , spanLen: number = 0
    , front: boolean = true
    , back: boolean = true) {
    if (front && spanLen > 0) {
      this._addWallFront(heightIndex)
      spanLen--
    }

    const midSpanLen = back ? spanLen - 1 : spanLen
    if (midSpanLen > 0) {
      this._addWallMid(heightIndex, midSpanLen)
      spanLen -= midSpanLen
    }

    if (back && spanLen > 0) {
      this._addWallBack(heightIndex)
    }
  }

  _addWallFront(heightIndex: number) {
    const y = MapBuilder.WALL_HEIGHTS[heightIndex]
    this._walls.addSlice(WS.Front, y)
  }

  _addWallBack(heightIndex: number) {
    const y = MapBuilder.WALL_HEIGHTS[heightIndex]
    this._walls.addSlice(WS.Back, y)
  }

  _addWallMid(heightIndex: number, spanLen: number) {
    const y = MapBuilder.WALL_HEIGHTS[heightIndex]
    for (let i = 0; i < spanLen; i++) {
      if (i % 2 === 0) {
        this._walls.addSlice(WS.Window, y)
      } else {
        this._walls.addSlice(WS.Decoration, y)
      }
    }
  }

  _addWallStep(heightIndex: number) {
    const y = MapBuilder.WALL_HEIGHTS[heightIndex]
    this._walls.addSlice(WS.Step, y)
  }
}
