import type {
  Action,
  ElMessageBoxOptions,
} from '@element-plus/components/message-box/src/message-box.type'
// import type { AppContext } from 'vue'

export type MessageReturnData<VRT> = MessageReturnBoxInputData<VRT> &
  ActWithReturnKey<VRT>

export interface ActWithReturnKey<VRT> {
  vmReturnValue: VRT
  action: Action
}

export interface MessageReturnBoxInputData<VRT> extends ActWithReturnKey<VRT> {
  value: string
}
export type MsgReturnType<VRT> =
  | MessageReturnBoxInputData<VRT>
  | ActWithReturnKey<VRT>

/** Options used in MessageBox */

export type ElMessageReturnOptions = {
  vmReturnKey: string
} & ElMessageBoxOptions

// export type ElMsgReturnBoxShortcutMethod<VRT> = ((
//   message: ElMessageBoxOptions['message'],
//   title: ElMessageBoxOptions['title'],
//   options?: ElMessageReturnOptions,
//   appContext?: AppContext | null
// ) => Promise<MessageReturnData<VRT>>) &
//   ((
//     message: ElMessageBoxOptions['message'],
//     options?: ElMessageReturnOptions,
//     appContext?: AppContext | null
//   ) => Promise<MessageReturnData<VRT>>)
