<template>
    <div :class="{'has-logo':showLogo}" 
         :style="{ backgroundColor: settings.sideTheme === 'theme-dark' ? variables.menuBackground : variables.menuLightBackground }">
        <!-- 如果需要显示 logo，则渲染 Logo 组件 -->
        <logo v-if="showLogo" :collapse="isCollapse" />
        <el-scrollbar :class="settings.sideTheme" wrap-class="scrollbar-wrapper">
            <el-menu
                :default-active="activeMenu"  <!-- 默认高亮的菜单项 -->
                :collapse="isCollapse"         <!-- 是否收起侧边栏 -->
                :background-color="settings.sideTheme === 'theme-dark' ? variables.menuBackground : variables.menuLightBackground" <!-- 背景颜色 -->
                :text-color="settings.sideTheme === 'theme-dark' ? variables.menuColor : variables.menuLightColor" <!-- 文本颜色 -->
                :unique-opened="true"          <!-- 是否只保持一个菜单项打开 -->
                :active-text-color="settings.theme" <!-- 高亮文本颜色 -->
                :collapse-transition="false"   <!-- 是否启用收起动画 -->
                mode="vertical"                <!-- 菜单模式 -->
            >
                <!-- 动态生成侧边栏菜单项 -->
                <sidebar-item
                    v-for="(route, index) in sidebarRouters"  <!-- 遍历 sidebarRouters -->
                    :key="route.path  + index"                  <!-- 唯一键 -->
                    :item="route"                                <!-- 传递路由项 -->
                    :base-path="route.path"                     <!-- 基础路径 -->
                />
            </el-menu>
        </el-scrollbar>
    </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";  // 导入 Vuex 的 mapGetters 和 mapState
import Logo from "./Logo";                      // 导入 Logo 组件
import SidebarItem from "./SidebarItem";        // 导入 SidebarItem 组件
import variables from "@/assets/styles/variables.scss"; // 导入样式变量

export default {
    components: { SidebarItem, Logo },  // 注册组件
    computed: {
        ...mapState(["settings"]),        // 映射 Vuex 状态中的 settings
        ...mapGetters(["sidebarRouters", "sidebar"]), // 映射 Vuex 中的 getters
        activeMenu() {
            const route = this.$route;     // 获取当前路由
            const { meta, path } = route;  // 解构 meta 和 path
            // 如果设置了 activeMenu，则高亮该路径
            if (meta.activeMenu) {
                return meta.activeMenu;
            }
            return path;                   // 否则返回当前路径
        },
        showLogo() {
            return this.$store.state.settings.sidebarLogo; // 判断是否显示 logo
        },
        variables() {
            return variables;              // 返回样式变量
        },
        isCollapse() {
            return !this.sidebar.opened;   // 判断侧边栏是否收起
        }
    }
};
</script>
