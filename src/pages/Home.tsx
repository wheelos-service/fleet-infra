/**
 * @fileoverview Home page as the main management console shell.
 * It renders a left-side navigation and a right-side content area,
 * switching between feature domains (workbench, vehicles, software release,
 * map & resource release, health diagnostics, configuration center,
 * and permission & audit) using local state instead of routes.
 */

import type { FC, ReactNode } from 'react'
import { useState } from 'react'

import Workbench from './home/Workbench'
import VehiclesAndDevicesPage from './vehicles/VehiclesAndDevicesPage'
import VersionAndReleaseHub from './releases/VersionAndReleaseHub'
import MapAndResourceReleasePage from './maps/MapAndResourceReleasePage'
import HealthDiagnosticsPage from './health/HealthDiagnosticsPage'
import ConfigurationCenterPage from './config/ConfigurationCenterPage'
import SystemSettingsPage from './settings/SystemSettingsPage'

/**
 * Supported top-level navigation keys inside the home shell.
 */
type NavKey =
  | 'workbench'
  | 'vehicles'
  | 'softwareRelease'
  | 'mapRelease'
  | 'health'
  | 'config'
  | 'audit'

/**
 * Single side navigation item definition.
 */
interface NavItem {
  /** Unique navigation key used for switching content. */
  key: NavKey
  /** Display label in the side nav. */
  label: string
  /** Short description shown under the label. */
  description: string
}

/**
 * Home renders the main management console shell with a left-side navigation
 * and a right-side content area. It does not use routing to switch modules;
 * instead it relies on local state to pick which feature module component to
 * render in the main area.
 */
const Home: FC = () => {
  const [activeNav, setActiveNav] = useState<NavKey>('workbench')

  const navItems: NavItem[] = [
    {
      key: 'workbench',
      label: '工作台',
      description: '总览关键指标与常用入口，看到今天要处理的事项。',
    },
    {
      key: 'vehicles',
      label: '车辆与设备档案',
      description:
        '车辆注册、车型、计算平台、传感器清单、设备序列号和车辆生命周期。',
    },
    {
      key: 'softwareRelease',
      label: '软件与版本发布',
      description: '软件包仓库、版本依赖、车型兼容与 OTA 分批发布。',
    },
    {
      key: 'mapRelease',
      label: '地图与资源发布',
      description: '地图版本、作业区域、禁行区与车辆地图同步状态。',
    },
    {
      key: 'health',
      label: '健康诊断',
      description:
        '传感器、进程、CPU/GPU、网络与日志采集的一站式健康视图。',
    },
    {
      key: 'config',
      label: '配置中心',
      description:
        '参数模板、配置版本、差异比较、兼容性检查与灰度生效控制。',
    },
    {
      key: 'audit',
      label: '权限与操作审计',
      description: '用户角色、审批策略、高风险操作授权与审计日志。',
    },
  ]

  /**
   * Return the page title and subtitle for the current active module.
   */
  const getActiveMeta = (): { title: string; subtitle: string } => {
    switch (activeNav) {
      case 'workbench':
        return {
          title: '工作台',
          subtitle: '总览关键指标与常用入口，快速跳转到核心模块。',
        }
      case 'vehicles':
        return {
          title: '车辆与设备档案',
          subtitle:
            '统一管理车辆注册信息、车型、计算平台、传感器与硬件配置，为维护与标定提供稳定基线。',
        }
      case 'softwareRelease':
        return {
          title: '软件与版本发布',
          subtitle:
            '集中管理软件包仓库、版本依赖与车型兼容性，支持 OTA 升级、分批发布以及失败中止与恢复。',
        }
      case 'mapRelease':
        return {
          title: '地图与资源发布',
          subtitle:
            '管理地图版本、路线资源、作业区域和禁行区，并核对车辆侧地图同步与实际生效版本。',
        }
      case 'health':
        return {
          title: '健康诊断',
          subtitle:
            '从传感器、进程、资源利用率与日志采集多维度诊断车队健康情况。',
        }
      case 'config':
        return {
          title: '配置中心',
          subtitle:
            '集中管理参数模板与配置版本，支持差异比较、兼容性校验与灰度下发和回滚。',
        }
      case 'audit':
        return {
          title: '权限与操作审计',
          subtitle:
            '管理用户、角色与审批策略，记录高风险操作与发布记录，保障可追溯与合规。',
        }
      default:
        return {
          title: '工作台',
          subtitle: '总览关键指标与常用入口，快速跳转到核心模块。',
        }
    }
  }

  /**
   * Render the main content area based on the active navigation key.
   */
  const renderContent = (): ReactNode => {
    switch (activeNav) {
      case 'workbench':
        return <Workbench />
      case 'vehicles':
        return <VehiclesAndDevicesPage />
      case 'softwareRelease':
        return <VersionAndReleaseHub />
      case 'mapRelease':
        return <MapAndResourceReleasePage />
      case 'health':
        return <HealthDiagnosticsPage />
      case 'config':
        return <ConfigurationCenterPage />
      case 'audit':
        return <SystemSettingsPage />
      default:
        return <Workbench />
    }
  }

  const activeMeta = getActiveMeta()

  return (
    <div className="flex h-screen bg-slate-50 text-xs text-slate-900">
      {/* Side navigation */}
      <aside className="flex w-64 flex-col border-r border-slate-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="flex h-12 items-center border-b border-slate-100 px-3">
          <div className="flex items-baseline gap-1">
            <span className="text-[13px] font-semibold text-slate-900">
              自动驾驶运维控制台
            </span>
            <span className="text-[10px] text-slate-500">· Fleet Console</span>
          </div>
        </div>

        <nav className="flex-1 overflow-auto px-2 py-3">
          <p className="mb-2 px-2 text-[11px] font-semibold text-slate-500">
            功能模块
          </p>
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = item.key === activeNav
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActiveNav(item.key)}
                  className={`flex w-full flex-col items-start rounded-md px-2 py-1.5 text-left transition ${
                    isActive
                      ? 'bg-sky-50 text-slate-900 ring-1 ring-sky-100'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span className="text-[11px] font-medium">
                    {item.label}
                  </span>
                  <span className="mt-0.5 text-[10px] text-slate-500">
                    {item.description}
                  </span>
                </button>
              )
            })}
          </div>
        </nav>

        <footer className="border-t border-slate-100 px-3 py-2 text-[10px] text-slate-400">
          <p>自动驾驶运维控制台 · 信息架构原型</p>
          <p className="mt-0.5">仅用于产品与交互方案验证</p>
        </footer>
      </aside>

      {/* Main content area */}
      <main className="flex min-w-0 flex-1 flex-col">
        {/* Top header bar for active module */}
        <header className="flex h-12 items-center justify-between border-b border-slate-200 bg-white/80 px-4 shadow-sm backdrop-blur">
          <div>
            <h1 className="text-sm font-semibold text-slate-900">
              {activeMeta.title}
            </h1>
            <p className="text-[11px] text-slate-500">
              {activeMeta.subtitle}
            </p>
          </div>
        </header>

        {/* Scrollable content container */}
        <section className="flex-1 overflow-auto p-4">
          <div className="mx-auto flex h-full max-w-6xl flex-col">
            {renderContent()}
          </div>
        </section>
      </main>
    </div>
  )
}

export default Home
