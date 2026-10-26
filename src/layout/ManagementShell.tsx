/**
 * @fileoverview ManagementShell component defining the global layout
 * for the management console, including top bar, collapsible side nav,
 * and main content area. It exposes hooks for navigation state so that
 * pages can switch sub-pages without using the router.
 */

import type { FC, ReactNode } from 'react'
import { useState } from 'react'
import { TopBar } from './TopBar'
import { SideNav } from './SideNav'
import type { EnvironmentType } from './TopBar'
import type { SideNavKey } from './SideNav'

/**
 * Props for the ManagementShell component.
 */
export interface ManagementShellProps {
  /** React children rendered in the main content area. */
  children: ReactNode
  /** Active navigation key used to highlight side nav. */
  activeNavKey?: SideNavKey
  /** Current environment type controlling top-level environment styling. */
  environment?: EnvironmentType
  /**
   * Optional callback fired when the user selects a navigation item
   * in the left side nav. Typically used by the Home page to switch
   * between workbench, vehicles, releases, etc.
   */
  onNavChange?: (key: SideNavKey) => void
}

/**
 * ManagementShell renders the global frame for all management console pages.
 * It standardizes the top bar, side navigation, and content area while allowing
 * individual pages to define their own breadcrumbs, headers, and body content.
 */
export const ManagementShell: FC<ManagementShellProps> = ({
  children,
  activeNavKey = 'workbench',
  environment = 'production',
  onNavChange,
}) => {
  const [collapsed, setCollapsed] = useState(false)

  /**
   * Toggle the collapsed state of the left side navigation.
   */
  const handleToggleCollapsed = () => {
    setCollapsed((prev) => !prev)
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900">
      <SideNav
        collapsed={collapsed}
        activeKey={activeNavKey}
        onToggleCollapsed={handleToggleCollapsed}
        onSelectNavItem={onNavChange}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar environment={environment} />
        <main className="flex-1 overflow-auto bg-slate-50 px-6 py-4">
          {children}
        </main>
      </div>
    </div>
  )
}
