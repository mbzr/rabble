import slugify from 'slugify'

export const slugger = (
  str: string,
  customOptions?: {
    replacement?: string
    remove?: RegExp
    lower?: boolean
    strict?: boolean
    locale?: string
    trim?: boolean
  }
) =>
  slugify(str, {
    replacement: '-',
    lower: true,
    trim: false,
    ...customOptions,
  })

  export const classNames = (...classes: string[]) => classes.filter(Boolean).join(' ' )