import * as P from 'pixi.js'

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

  borrowWindow() : P.Sprite  {
    return this._borrowFrom(this._windows)
  }

  returnWindow(window : P.Sprite) : void {
    this._windows.push(window)
  }

  borrowDecoration() : P.Sprite  {
    return this._borrowFrom(this._decorations)
  }

  returnDecoration(decoration : P.Sprite) : void {
    this._decorations.push(decoration)
  }

  borrowFrontEdge() : P.Sprite {
    return this._borrowFrom(this._frontEdges)
  }

  returnFrontEdge(frontEdge : P.Sprite) : void {
    this._frontEdges.push(frontEdge)
  }

  borrowBackEdge() : P.Sprite {
    return this._borrowFrom(this._backEdges)
  }

  returnBackEdge(backEdge : P.Sprite) : void {
    this._backEdges.push(backEdge)
  }

  borrowStep() : P.Sprite  {
    return this._borrowFrom(this._steps)
  }

  returnStep(step : P.Sprite) : void {
    this._steps.push(step)
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
