import * as P from 'pixi.js'
import { WallSprite as WS } from './enums'

function noop() {}

function flip(sprite : P.Sprite) : void {
  sprite.anchor.x = 1
  sprite.scale.x = -1
}

function shiftStep(sprite : P.Sprite) : void {
  sprite.anchor.y = 0.25
}

export default class WallSpritesPool {
  _windows     : Array<P.Sprite> = []
  _decorations : Array<P.Sprite> = []
  _frontEdges  : Array<P.Sprite> = []
  _backEdges   : Array<P.Sprite> = []
  _steps       : Array<P.Sprite> = []

  load() : void {
    this
      ._createWindows()
      ._createDecorations()
      ._createFrontEdges()
      ._createBackEdges()
      ._createSteps()
  }

  checkout(spriteType : WS) : P.Sprite {
    switch (spriteType) {
      case WS.Window     : return this._borrowFrom(this._windows)
      case WS.Decoration : return this._borrowFrom(this._decorations)
      case WS.Front  : return this._borrowFrom(this._frontEdges)
      case WS.Back   : return this._borrowFrom(this._backEdges)
      case WS.Step       : return this._borrowFrom(this._steps)
      default:
        throw new Error(`Unknown sprite type ${spriteType}.`)
    }
  }

  checkin(spriteType: WS, sprite: P.Sprite): void {
    switch (spriteType) {
      case WS.Window     : this._windows.push(sprite); break
      case WS.Decoration : this._decorations.push(sprite); break
      case WS.Front  : this._frontEdges.push(sprite); break
      case WS.Back   : this._backEdges.push(sprite); break
      case WS.Step       : this._steps.push(sprite); break
      default:
        throw new Error(`Unknown sprite type ${spriteType}.`)
    }
  }

  _borrowFrom<T>(pool : Array<T>) : T {
    if (pool.length === 0) {
      throw new Error('Ran out of elements in the pool, increase pool size')
    }
    return pool.shift()!
  }

  _createWindows() : WallSpritesPool {
    this
      ._seed(this._windows, 'window_01', 6)
      ._seed(this._windows, 'window_02', 6)
      ._shuffle(this._windows)
    return this
  }

  _createDecorations() : WallSpritesPool {
    this
      ._seed(this._decorations, 'decoration_01', 6)
      ._seed(this._decorations, 'decoration_02', 6)
      ._seed(this._decorations, 'decoration_03', 6)
      ._shuffle(this._decorations)
    return this
  }

  _createFrontEdges() : WallSpritesPool {
    this
      ._seed(this._frontEdges, 'edge_01', 2)
      ._seed(this._frontEdges, 'edge_02', 2)
      ._shuffle(this._frontEdges)
    return this
  }

  _createBackEdges() : WallSpritesPool {
    this
      ._seed(this._backEdges, 'edge_01', 2, flip)
      ._seed(this._backEdges, 'edge_02', 2, flip)
      ._shuffle(this._backEdges)
    return this
  }

  _createSteps() : WallSpritesPool {
    this._seed(this._steps, 'step_01', 2, shiftStep)
    return this
  }

  _seed(
      pool : Array<P.Sprite>
    , frameId : string
    , size : number
    , customize : Function = noop
  ) : WallSpritesPool {
    for (let i = 0; i < size; i++) {
      const sprite = P.Sprite.fromFrame(frameId)
      customize(sprite)
      pool.push(sprite)
    }
    return this
  }

  _shuffle(pool : Array<P.Sprite>) : WallSpritesPool {
    const len = this._windows.length
    const shuffles = len * 3
    for (let i = 0; i < shuffles; i++) {
      const el = pool.pop() as P.Sprite
      const pos = Math.floor(Math.random() * (len - 1))
      pool.splice(pos, 0, el)
    }
    return this
  }
}
