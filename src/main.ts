import _ from 'lodash/string'

import './app.css'
import App from './App.svelte'

const app = new App({
  target: document.getElementById('app'),
})

;(window as any)._ = _

export default app
