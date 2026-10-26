/**
 * @fileoverview SideNav component for the management console shell,
 * providing a collapsible left navigation menu with primary sections
 * and an optional selection callback for parent containers.
 */

import type { FC } from 'react'
import {
  BarChart3,
  Car,
  Disc3,
  LayoutDashboard,
  Settings,
  Wrench,
  ChevronLeft,
} from 'lucide-react'

/**
 * Supported navigation keys for the side navigation.
 */
export type SideNavKey =
  | 'workbench'
  | 'vehicles'
  | 'releases'
  | 'operations'
  | 'analytics'
  | 'settings'

/**
 * Single navigation item definition for the side nav.
 */
interface NavItem {
  /** Unique key for the item, used for active state tracking. */
  key: SideNavKey
  /** Display label. */
  label: string
  /** React icon component from lucide-react. */
  icon: FC<{ className?: string }>
}

/**
 * Props for the SideNav component.
 */
export interface SideNavProps {
  /** Whether the nav is collapsed to icon-only mode. */
  collapsed: boolean
  /** Currently active item key. */
  activeKey?: SideNavKey
  /** Callback fired when the collapse toggle is clicked. */
  onToggleCollapsed: () => void
  /**
   * Optional callback fired when a navigation item is selected.
   * The parent (e.g. Home page) can use this to switch sub-pages
   * without involving the router.
   */
  onSelectNavItem?: (key: SideNavKey) => void
}

/**
 * SideNav renders the left navigation rail with primary sections
 * such as workbench, vehicles, releases, operations, analytics, and system settings.
 * It supports a collapsed (icon-only) mode to save horizontal space and
 * exposes an item selection callback for higher-level containers.
 */
export const SideNav: FC<SideNavProps> = ({
  collapsed,
  activeKey = 'workbench',
  onToggleCollapsed,
  onSelectNavItem,
}) => {
  const items: NavItem[] = [
    { key: 'workbench', label: '工作台', icon: LayoutDashboard },
    { key: 'vehicles', label: '车辆与设备', icon: Car },
    { key: 'releases', label: '版本与发布', icon: Disc3 },
    { key: 'operations', label: '运维作业', icon: Wrench },
    { key: 'analytics', label: '运营分析', icon: BarChart3 },
    { key: 'settings', label: '系统管理', icon: Settings },
  ]

  /**
   * Handle click on a single navigation item and propagate
   * the selected key to the parent if a callback is provided.
   */
  const handleItemClick = (key: SideNavKey) => {
    if (onSelectNavItem) {
      onSelectNavItem(key)
    }
  }

  return (
    <aside
      className={`flex h-full flex-col border-r border-slate-200 bg-white transition-[width] duration-200 ease-in-out ${
        collapsed ? 'w-16' : 'w-[220px]'
      }`}
    >
      <nav className="flex-1 space-y-1 px-1 py-3">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = item.key === activeKey
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => handleItemClick(item.key)}
              className={`group relative flex w-full items-center rounded-md px-2 py-2 text-xs font-medium transition ${
                isActive
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {/* Active indicator bar on the left */}
              {isActive && (
                <span className="absolute inset-y-1 left-0 w-0.5 rounded-full bg-sky-500" />
              )}
              <Icon
                className={`h-4 w-4 flex-shrink-0 ${
                  collapsed ? 'mx-auto' : 'mr-2'
                }`}
              />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          )
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-slate-200 p-2">
        <button
          type="button"
          onClick={onToggleCollapsed}
          className="flex h-8 w-full items-center justify-center gap-1 rounded-md text-[11px] text-slate-500 hover:bg-slate-50 hover:text-slate-800"
        >
          <ChevronLeft
            className={`h-3 w-3 transition-transform ${
              collapsed ? 'rotate-180' : ''
            }`}
          />
          {!collapsed && <span>收起侧栏</span>}
        </button>
      </div>
    </aside>
  )
}
