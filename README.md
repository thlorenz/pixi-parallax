# pixi-parallax

Following pixijs examples at https://pixijs.io/examples.

## Installation

Clone this repo + run `npm install`.

## Usage

Run `npm start` to start watching and serving your game page.

For examples that need to load resources run the server that serves the required assets via
`npm run start:server`.

Run `npm run build` to create a distributable version of your game inside `./dist`.

## Setup

[parceljs](https://parceljs.org/) is used to bundle and serve JavaScript.

Settings inside `tsconfig.json` and the below inside `package.json` keeps
transpilation/compilation to a mimimum during development.

```js
"browserslist": {
  "development": [
    "last 1 chrome version"
  ]
}
```

[hot module replacement](https://parceljs.org/hmr.html) is also enabled (see `./main.js`).

Basically the game is recreated with a new Canvas after the old Canvas was removed from the
page. This means that when serving your game via `npm start` you can simply make edits and save
and see the browser page update itself.

## License

MIT
