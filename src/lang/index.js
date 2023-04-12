// 多语言实例化文件
import Vue from 'vue'
import VueI18n from 'vue-i18n/dist/vue-i18n.esm'
import Cookie from 'js-cookie' // 引入cookie工具
import elementZH from 'element-ui/lib/locale/lang/zh-CN' // 中文包
import elementEN from 'element-ui/lib/locale/lang/en' // 英文包
import customZH from './zh' // 引入自定义语言包
import customEN from './en' // 引入自定义语言包

Vue.use(VueI18n) // 全局注册VueI18n
export default new VueI18n({
  // i18n的选项
  locale: Cookie.get('language') || 'zh', // 当前的多语言类型  随意定义的字符串 中文 zh / 英文 en
  messages: {
    zh: {
      // 语言包  elementUI语言包 + 自定义语言包
      ...elementZH,
      ...customZH
    },
    en: {
      ...elementEN,
      ...customEN
    }
  } // 当前的语言包
})
