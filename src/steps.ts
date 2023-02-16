import { writable, get } from 'svelte/store'
import moment from 'moment'
import { stringify, parse } from 'yaml'
import lodash from 'lodash'

import { upload, download } from './lib'
import { error } from './toast'

const _ = lodash

export interface Step {
  order: number
  pat: string
  out: string
  type: 'text' | 'func'
  isRegex: boolean
  enabled: boolean
}

export type NewStep = Omit<Step, 'order'>

type ReplaceFunc = (substring: string, ...args: any[]) => string

export const getCachedSteps = () => {
  const steps = localStorage.getItem('steps') ?? '[]'
  return JSON.parse(steps) as Step[]
}

export const steps = writable<Step[]>([])

export const addStep = (st: NewStep) => {
  steps.update((s) => {
    s.push({ ...st, order: s.length + 1 })
    return s
  })
}

export const removeStep = (idx: number) => {
  steps.update((s) => {
    s.splice(idx, 1)
    return s
  })
}

export const updateStep = (idx: number, st: Step) => {
  steps.update((s) => {
    s[idx] = st
    return s
  })
}

export const changeOrder = (idx: number, newOrder: number) => {
  steps.update((s) => {
    s[idx].order = newOrder
    return s
  })
}

export const resort = () => {
  steps.update((s) => s.sort((a, b) => a.order - b.order))
}

export const saveSteps = () => {
  localStorage.setItem('steps', JSON.stringify(get(steps)))
}

steps.subscribe(() => {
  // resort()
  // saveSteps()
})

export const doReplace = (input: string, ss: Step[]) => {
  let result = input
  ss.forEach((item) => {
    if (!item.enabled) return
    let pat = item.isRegex ? new RegExp(item.pat, 'g') : item.pat
    switch (item.type) {
      case 'text':
        result = result.replaceAll(pat, item.out)
        break
      case 'func':
        const f: ReplaceFunc = eval(`${item.out}`)
        result = result.replaceAll(pat, f)
        break
    }
  })
  return result
}

export const importSteps = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.hidden = true
  input.onchange = (e) => {
    const target = e.currentTarget as EventTarget & HTMLInputElement
    const file = target.files[0]
    if (!file) {
      error('Please select a valid yaml file')
    }
    upload(file, (content) => {
      const s = parse(content) as Step[]
      steps.set(s)
    })
  }
  document.body.appendChild(input)
  input.click()

  document.body.removeChild(input)
}

export const exportSteps = () => {
  if (get(steps).length < 1) {
    error('Please add at least one step.')
  }
  const name = `steps_${moment().format('YYYYMMDD_HH:mm:ss')}.txt`
  download(stringify(get(steps)), name)
}
