import { MsgReturnBox, type TMsgReturnBox } from './src/messageBox'

import type { App } from 'vue'
import type { SFCWithInstall } from '@element-plus/utils'

const _MessageReturnBox = MsgReturnBox as SFCWithInstall<TMsgReturnBox>

_MessageReturnBox.install = (app: App) => {
  app.config.globalProperties.$msgReturn = _MessageReturnBox
  _MessageReturnBox._context = app._context
  console.log('ElMsgReturnBox installed:', ElMsgReturnBox._context)
}

export default _MessageReturnBox
export const ElMsgReturnBox = _MessageReturnBox
console.log('ElMsgReturnBox:', ElMsgReturnBox.install)

export * from './src/message-box.type'
