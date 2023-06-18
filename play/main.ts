import { createApp } from 'vue'

import '@element-plus/theme-chalk/src/dark/css-vars.scss'
;import { ElMsgReturnBox } from '@element-plus/components';
(async () => {
  const apps = import.meta.glob('./src/*.vue')
  const name = location.pathname.replace(/^\//, '') || 'App'
  const file = apps[`./src/${name}.vue`]
  if (!file) {
    location.pathname = 'App'
    return
  }
  const App = (await file()).default
  const app = createApp(App)
  app.use(ElMsgReturnBox)
  
  app.mount('#play')
})()
