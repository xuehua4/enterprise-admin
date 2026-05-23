import type { App, Directive, DirectiveBinding } from 'vue'
import { usePermissionStore } from '@/stores/permission'

/**
 * Permission directive - v-permission="'permission:code'"
 * If user doesn't have the permission, the element is removed from DOM
 */
const permissionDirective: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string | string[]>) {
    const permissionStore = usePermissionStore()
    const { value } = binding

    if (!value) return

    const permissions = Array.isArray(value) ? value : [value]
    
    // Check if user has any of the required permissions
    if (!permissionStore.hasAnyPermission(permissions)) {
      el.parentNode?.removeChild(el)
    }
  }
}

/**
 * Permission directive for buttons/elements - v-permission-btn="'permission:code'"
 * If user doesn't have the permission, the element is disabled and styled
 */
const permissionBtnDirective: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string | string[]>) {
    const permissionStore = usePermissionStore()
    const { value } = binding

    if (!value) return

    const permissions = Array.isArray(value) ? value : [value]
    
    if (!permissionStore.hasAnyPermission(permissions)) {
      el.setAttribute('disabled', 'true')
      el.classList.add('permission-disabled')
      el.setAttribute('title', 'No permission')
    }
  },
  updated(el: HTMLElement, binding: DirectiveBinding<string | string[]>) {
    const permissionStore = usePermissionStore()
    const { value } = binding

    if (!value) return

    const permissions = Array.isArray(value) ? value : [value]
    
    if (!permissionStore.hasAnyPermission(permissions)) {
      el.setAttribute('disabled', 'true')
      el.classList.add('permission-disabled')
    } else {
      el.removeAttribute('disabled')
      el.classList.remove('permission-disabled')
    }
  }
}

export function setupPermissionDirectives(app: App) {
  app.directive('permission', permissionDirective)
  app.directive('permission-btn', permissionBtnDirective)
}

export { permissionDirective, permissionBtnDirective }
