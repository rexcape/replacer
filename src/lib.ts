import { saveAs } from 'file-saver'

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
