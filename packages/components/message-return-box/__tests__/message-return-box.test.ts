// @ts-nocheck
import { markRaw } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, test, vi } from 'vitest'
import { rAF } from '@element-plus/test-utils/tick'
import { triggerNativeCompositeClick } from '@element-plus/test-utils/composite-click'
import { QuestionFilled as QuestionFilledIcon } from '@element-plus/icons-vue'
import { MsgReturnBox } from '../src/messageBox'
import { ElMessageBox } from '..'

const selector = '.el-overlay'
const QuestionFilled = markRaw(QuestionFilledIcon)

vi.mock('@element-plus/utils/error', () => ({
  debugWarn: vi.fn(),
}))

describe('MessageReturnBox', () => {
  afterEach(async () => {
    MsgReturnBox.close()
    document.body.innerHTML = ''
    await rAF()
  })

  test('create and close', async () => {
    const msgReturnBox: HTMLElement = document.querySelector(selector)
    const result = await textMsgRBox()
    expect(msgReturnBox).toBeDefined()
  })
})

const textMsgRBox = () =>
  MsgReturnBox({
    type: 'success',
    title: 'hi',
    message: 'bye',
    customStyle: {
      width: '100px',
    },
  })

const _mount = (invoker: () => void) => {
  return mount(
    {
      template: '<div></div>',
      mounted() {
        invoker()
      },
    },
    {
      attachTo: 'body',
    }
  )
}
