/**
 * @fileoverview TopBar component for the management console shell, including branding,
 * app switcher, site switcher, global search, environment indicator, notifications, and user info.
 */

import type { FC } from 'react'
import { Bell, ChevronDown, Search, User } from 'lucide-react'

/**
 * Supported environment types for the management console.
 */
export type EnvironmentType = 'production' | 'staging' | 'demo'

/**
 * Props for the TopBar component.
 */
export interface TopBarProps {
  /** Current environment, affects label and color scheme. */
  environment: EnvironmentType
}

/**
 * TopBar renders the fixed top navigation bar for the management console.
 * It differentiates production / non-production environments and surfaces
 * global entry points such as app switching, park switching, search, and notifications.
 */
export const TopBar: FC<TopBarProps> = ({ environment }) => {
  const envConfig: Record<
    EnvironmentType,
    { label: string; badgeClass: string; topBorderClass: string }
  > = {
    production: {
      label: '生产环境',
      badgeClass:
        'bg-red-50 text-red-700 border-red-200',
      topBorderClass: 'border-t-2 border-red-500',
    },
    staging: {
      label: '测试环境',
      badgeClass:
        'bg-amber-50 text-amber-700 border-amber-200',
      topBorderClass: 'border-t-2 border-amber-400',
    },
    demo: {
      label: '演示环境',
      badgeClass:
        'bg-slate-100 text-slate-700 border-slate-300',
      topBorderClass: 'border-t-2 border-slate-300',
    },
  }

  const currentEnv = envConfig[environment]

  return (
    <header
      className={`flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 ${currentEnv.topBorderClass}`}
    >
      {/* Left: brand + app / park switcher */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold tracking-tight text-slate-900">
            WHEELOS 管理
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            <span>应用切换</span>
            <ChevronDown className="h-3 w-3" />
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700 hover:bg-slate-50"
          >
            <span>深圳园区</span>
            <ChevronDown className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Center: command palette search */}
      <div className="hidden flex-1 items-center justify-center px-4 md:flex">
        <button
          type="button"
          className="flex w-full max-w-md items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-500 shadow-sm transition hover:bg-white hover:text-slate-700"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="flex-1 text-left text-xs text-slate-500">
            ⌘K 搜索车辆号、基线号、发布号、作业号、设备序列号…
          </span>
          <span className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] text-slate-500">
            ⌘K
          </span>
        </button>
      </div>

      {/* Right: environment, notifications, user */}
      <div className="flex items-center gap-3">
        <span
          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${currentEnv.badgeClass}`}
        >
          {currentEnv.label}
        </span>

        <button
          type="button"
          className="relative inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800"
          aria-label="打开通知中心"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 inline-flex min-h-[16px] min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
            3
          </span>
        </button>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-2.5 py-1 text-xs text-slate-700 hover:bg-slate-100"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-[11px] font-semibold text-slate-700">
            张
          </span>
          <span className="hidden md:inline-block">张工</span>
          <ChevronDown className="hidden h-3 w-3 md:inline-block" />
        </button>

        {/* Mobile: simple user icon fallback */}
        <button
          type="button"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 md:hidden"
          aria-label="用户菜单"
        >
          <User className="h-4 w-4" />
        </button>
      </div>
    </header>
  )
}