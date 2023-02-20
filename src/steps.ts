import { writable, get } from 'svelte/store'
import moment from 'moment'
import { stringify, parse } from 'yaml'
import _ from 'lodash/string'
import { nanoid } from 'nanoid'

import { upload, download } from './lib'
import { error } from './toast'

export interface Step {
  id: string
  pat: string
  out: string
  type: 'text' | 'func'
  isRegex: boolean
  enabled: boolean
}

export type NewStep = Omit<Step, 'order' | 'id'>

type ReplaceFunc = (substring: string, ...args: any[]) => string

export const getCachedSteps = () => {
  const steps = localStorage.getItem('steps') ?? '[]'
  return JSON.parse(steps) as Step[]
}

export const steps = writable<Step[]>([])

export const addStep = (st: NewStep) => {
  const id = nanoid()
  steps.update((s) => {
    s.push({ ...st, id: id })
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

export const saveSteps = () => {
  localStorage.setItem('steps', JSON.stringify(get(steps)))
}

steps.subscribe(() => {
  // saveSteps()
})

const getReplaceFunc = (code: string): ReplaceFunc => {
  return eval(code) as ReplaceFunc
}

export const doReplace = (input: string, ss: Step[]) => {
  let result = input
  ss.forEach((item, idx) => {
    if (!item.enabled) return
    let pat = item.isRegex ? new RegExp(item.pat, 'g') : item.pat
    switch (item.type) {
      case 'text':
        result = result.replaceAll(pat, item.out)
        break
      case 'func':
        try {
          const f: ReplaceFunc = getReplaceFunc(item.out)
          result = result.replaceAll(pat, f)
        } catch (e) {
          error(`${e.name}: ${e.message}`, `Step ${idx} error`)
        }
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
      steps.set(s.map(({ id, ...rest }) => ({ ...rest, id: id ?? nanoid() })))
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

export const clearSteps = () => {
  steps.set([])
}
