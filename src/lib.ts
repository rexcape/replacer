import { saveAs } from 'file-saver'
import { error, success } from './toast'

export const upload = (f: File, cb: (content: string) => any) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    let res = e.target?.result
    if (!res) return
    cb(res as string)
  }
  reader.readAsText(f)
}

export const download = (content: string, name: string) => {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  saveAs(blob, name)
}

export const copy = (content: string) => {
  navigator.clipboard
    .writeText(content)
    .then(() => {
      success('Copied to clipboard')
    })
    .catch(() => {
      error('Copy failed, check browser config')
    })
}

export const paste = () =>
  navigator.clipboard
    .readText()
    .then((val) => {
      success('Paste success')
      return val
    })
    .catch(() => {
      error('Paste failed, check browser config')
    })

export const format = async (code: string) => {
  const prettier = (await import('prettier')).format
  const parserBabel = (await import('prettier/parser-babel')).default
  return prettier(code, {
    parser: 'babel',
    semi: false,
    singleQuote: true,
    plugins: [parserBabel],
  })
}
