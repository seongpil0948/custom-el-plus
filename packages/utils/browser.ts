import { isClient, isIOS } from '@vueuse/core'

export const isFirefox = (): boolean => {
  if (window && window.navigator && isClient) {
    return /firefox/i.test(window.navigator.userAgent)
  }
  return false
}

export { isClient, isIOS }
