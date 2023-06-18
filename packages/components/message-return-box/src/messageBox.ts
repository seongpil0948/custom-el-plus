import { createVNode, render } from 'vue'
import {
  debugWarn,
  hasOwn,
  isClient,
  isElement,
  isFunction,
  isString,
  isVNode,
} from '@element-plus/utils'
import MessageBoxConstructor from './index.vue'
import type {
  Action,
  Callback,
  MessageBoxState,
} from '@element-plus/components/message-box/src/message-box.type'

import type { AppContext, ComponentPublicInstance } from 'vue'
import type { ElMessageReturnOptions, MsgReturnType } from './message-box.type'

// component default merge props & data

const msgReturnInstance = new Map<
  ComponentPublicInstance<{ doClose: () => void }>, // marking doClose as function
  {
    options: any
    callback: Callback | undefined
    resolve: (res: any) => void
    reject: (reason?: any) => void
  }
>()

const getAppendToElement = (props: any): HTMLElement => {
  let appendTo: HTMLElement | null = document.body
  if (props.appendTo) {
    if (isString(props.appendTo)) {
      appendTo = document.querySelector<HTMLElement>(props.appendTo)
    }
    if (isElement(props.appendTo)) {
      appendTo = props.appendTo
    }

    // should fallback to default value with a warning
    if (!isElement(appendTo)) {
      debugWarn(
        'ElMessageBox',
        'the appendTo option is not an HTMLElement. Falling back to document.body.'
      )
      appendTo = document.body
    }
  }
  return appendTo
}

const initInstance = (
  props: any,
  container: HTMLElement,
  appContext: AppContext | null = null
) => {
  const vnode = createVNode(
    MessageBoxConstructor,
    props,
    isFunction(props.message) || isVNode(props.message)
      ? {
          default: isFunction(props.message)
            ? props.message
            : () => props.message,
        }
      : null
  )
  vnode.appContext = appContext
  render(vnode, container)
  getAppendToElement(props).appendChild(container.firstElementChild!)
  return vnode.component
}

const genContainer = () => {
  return document.createElement('div')
}

const showMessage = <VRT>(options: any, appContext?: AppContext | null) => {
  const container = genContainer()
  // Adding destruct method.
  // when transition leaves emitting `vanish` evt. so that we can do the clean job.
  options.onVanish = () => {
    // not sure if this causes mem leak, need proof to verify that.
    // maybe calling out like 1000 msg-box then close them all.
    console.info('vanished vm:', vm)
    render(null, container)
    msgReturnInstance.delete(vm) // Remove vm to avoid mem leak.
    // here we were suppose to call document.body.removeChild(container.firstElementChild)
    // but render(null, container) did that job for us. so that we do not call that directly
  }

  options.onAction = (action: Action) => {
    const currentMsg = msgReturnInstance.get(vm)!
    let resolve: MsgReturnType<VRT>
    console.info('options.vmReturnKey:', options.vmReturnKey)
    console.info('vm[options.vmReturnKey]:', vm[options.vmReturnKey])
    console.info('vm:', vm)
    if (options.showInput) {
      resolve = {
        value: vm.inputValue,
        action,
        vmReturnValue: vm[options.vmReturnKey],
      }
    } else {
      resolve = { action, vmReturnValue: vm[options.vmReturnKey] }
    }
    if (options.callback) {
      options.callback(resolve, instance.proxy)
    } else {
      if (action === 'cancel' || action === 'close') {
        if (options.distinguishCancelAndClose && action !== 'cancel') {
          currentMsg.reject('close')
        } else {
          currentMsg.reject('cancel')
        }
      } else {
        currentMsg.resolve(resolve)
      }
    }
  }

  const instance = initInstance(options, container, appContext)!

  // This is how we use message box programmably.
  // Maybe consider releasing a template version?
  // get component instance like v2.
  const vm = instance.proxy as ComponentPublicInstance<
    {
      visible: boolean
      doClose: () => void
    } & MessageBoxState & { [k: string]: any }
  >

  for (const prop in options) {
    if (hasOwn(options, prop) && !hasOwn(vm.$props, prop)) {
      vm[prop as keyof ComponentPublicInstance] = options[prop]
    }
  }

  // change visibility after everything is settled
  vm.visible = true
  return vm
}
export type TMsgReturnBox = {
  <VRT>(
    options: ElMessageReturnOptions,
    appContext?: AppContext | null
  ): Promise<MsgReturnType<VRT>>
  _context: AppContext | undefined
}
export const MsgReturnBox = <TMsgReturnBox>(<VRT>(
  options: ElMessageReturnOptions,
  appContext?: AppContext | null
): Promise<MsgReturnType<VRT>> => {
  if (!isClient) return Promise.reject()
  let callback: Callback | undefined
  if (isString(options) || isVNode(options)) {
    options = {
      message: options,
      vmReturnKey: options.vmReturnKey,
    }
  } else {
    callback = options.callback
  }

  return new Promise((resolve, reject) => {
    console.log('MsgReturnBox showMessage:', showMessage(options, appContext))
    const vm = showMessage(
      options,
      appContext ?? (MsgReturnBox as TMsgReturnBox)._context
    )
    // collect this vm in order to handle upcoming events.
    msgReturnInstance.set(vm, {
      options,
      callback,
      resolve,
      reject,
    })
  })
})
