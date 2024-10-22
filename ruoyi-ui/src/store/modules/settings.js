import defaultSettings from '@/settings' // 导入默认设置

// 从默认设置中解构出各个配置项
const { sideTheme, showSettings, topNav, tagsView, fixedHeader, sidebarLogo, dynamicTitle } = defaultSettings

// 从本地存储中获取布局设置，如果没有则为 ''
const storageSetting = JSON.parse(localStorage.getItem('layout-setting')) || ''
const state = {
  title: '', // 页面标题
  theme: storageSetting.theme || '#409EFF', // 主题颜色，优先使用本地存储中的设置
  sideTheme: storageSetting.sideTheme || sideTheme, // 侧边栏主题，优先使用本地存储中的设置
  showSettings: showSettings, // 是否显示设置面板
  topNav: storageSetting.topNav === undefined ? topNav : storageSetting.topNav, // 顶部导航设置
  tagsView: storageSetting.tagsView === undefined ? tagsView : storageSetting.tagsView, // 标签视图设置
  fixedHeader: storageSetting.fixedHeader === undefined ? fixedHeader : storageSetting.fixedHeader, // 固定头部设置
  sidebarLogo: storageSetting.sidebarLogo === undefined ? sidebarLogo : storageSetting.sidebarLogo, // 侧边栏 Logo 设置
  dynamicTitle: storageSetting.dynamicTitle === undefined ? dynamicTitle : storageSetting.dynamicTitle // 动态标题设置
}

const mutations = {
  // 修改设置
  CHANGE_SETTING: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) { // 检查状态中是否存在该键
      state[key] = value // 更新状态
    }
  }
}

const actions = {
  // 修改布局设置
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data) // 提交修改设置的 mutation
  },
  // 设置网页标题
  setTitle({ commit }, title) {
    state.title = title // 更新页面标题
  }
}

export default {
  namespaced: true, // 启用命名空间
  state, // 状态
  mutations, // 变更
  actions // 动作
}
