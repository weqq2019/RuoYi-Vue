<template>
  <div v-if="!item.hidden"> <!-- 如果当前项未隐藏 -->
    <template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children || onlyOneChild.noShowingChildren) && !item.alwaysShow">
      <!-- 如果只有一个可见的子项且不总是显示 -->
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path, onlyOneChild.query)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown': !isNest}">
          <item :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)" :title="onlyOneChild.meta.title" />
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
      <template slot="title">
        <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
      </template>
      <!-- 遍历子项并渲染 -->
      <sidebar-item
        v-for="(child, index) in item.children"
        :key="child.path + index"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script>
import path from 'path' // 导入路径处理模块
import { isExternal } from '@/utils/validate' // 导入外部链接验证工具
import Item from './Item' // 导入 Item 组件
import AppLink from './Link' // 导入 AppLink 组件
import FixiOSBug from './FixiOSBug' // 导入 iOS Bug 修复混入

export default {
  name: 'SidebarItem', // 组件名称
  components: { Item, AppLink }, // 注册子组件
  mixins: [FixiOSBug], // 使用混入
  props: {
    // 路由对象
    item: {
      type: Object,
      required: true // 必须提供
    },
    isNest: {
      type: Boolean,
      default: false // 默认值为 false
    },
    basePath: {
      type: String,
      default: '' // 默认值为空字符串
    }
  },
  data() {
    this.onlyOneChild = null // 存储唯一子项
    return {}
  },
  methods: {
    // 检查是否只有一个可见的子项
    hasOneShowingChild(children = [], parent) {
      if (!children) {
        children = []; // 如果没有子项，初始化为空数组
      }
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false // 如果子项隐藏，返回 false
        } else {
          // 临时设置（如果只有一个可见子项时使用）
          this.onlyOneChild = item
          return true // 返回可见子项
        }
      })

      // 如果只有一个可见子项，默认显示该子项
      if (showingChildren.length === 1) {
        return true
      }

      // 如果没有可见子项，显示父项
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return true
      }

      return false // 否则返回 false
    },
    // 解析路径
    resolvePath(routePath, routeQuery) {
      if (isExternal(routePath)) {
        return routePath // 如果是外部链接，直接返回
      }
      if (isExternal(this.basePath)) {
        return this.basePath // 如果基础路径是外部链接，直接返回
      }
      if (routeQuery) {
        let query = JSON.parse(routeQuery); // 解析查询参数
        return { path: path.resolve(this.basePath, routePath), query: query } // 返回解析后的路径和查询参数
      }
      return path.resolve(this.basePath, routePath) // 返回解析后的路径
    }
  }
}
</script>