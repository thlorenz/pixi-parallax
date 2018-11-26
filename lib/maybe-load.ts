import * as P from 'pixi.js'

export default function maybeLoad(url : string, onloaded : Function) : void {
  // There seems to be no way to cleanly dispose all loaded resources
  // even via dispose calls.
  // Thus during hot reloading we may try to reload an already loaded resource.
  // If that was the case we can safely continue.
  try {
    P.loader
      .add(url)
      .load(onloaded)
  } catch (err) {
    if (/^Resource named .+ already exists/.test(err.message)) {
      onloaded()
    } else {
      console.error(err.toString())
    }
  }
}
