/**
 * @fileoverview Vehicles and devices module root page.
 * It provides tabbed navigation between the vehicle & device archive
 * and the maintenance & calibration workspace.
 */

import type { FC } from 'react'
import { useState } from 'react'

import VehicleLedger from './VehicleLedger'
import MaintenanceAndCalibration from '../maintenance/MaintenanceAndCalibration'

/**
 * Supported tab keys inside the vehicles and devices module.
 */
type VehiclesTabKey = 'archive' | 'maintenance'

/**
 * Single tab definition for the vehicles page.
 */
interface VehiclesTabItem {
  /** Unique tab key. */
  key: VehiclesTabKey
  /** Visible label on the tab. */
  label: string
  /** Short description shown under the header for context. */
  description: string
}

/**
 * VehiclesAndDevicesPage renders a small shell with secondary tabs
 * for "车辆与设备档案" and "维护与标定", reusing existing feature pages
 * while keeping a consistent layout and microcopy.
 */
const VehiclesAndDevicesPage: FC = () => {
  const [activeTab, setActiveTab] = useState<VehiclesTabKey>('archive')

  const tabs: VehiclesTabItem[] = [
    {
      key: 'archive',
      label: '车辆与设备档案',
      description:
        '车辆注册、车型、计算平台、传感器清单、设备序列号、硬件配置、车辆分组和生命周期统一管理。',
    },
    {
      key: 'maintenance',
      label: '维护与标定',
      description:
        '点检、维修工单、维护计划、传感器标定记录、硬件更换，以及维修后的验证与重新验收。',
    },
  ]

  /**
   * Render the content of the current active sub tab.
   */
  const renderActiveTabContent = (): JSX.Element => {
    switch (activeTab) {
      case 'archive':
        return <VehicleLedger />
      case 'maintenance':
        return <MaintenanceAndCalibration />
      default:
        return <VehicleLedger />
    }
  }

  const active = tabs.find((t) => t.key === activeTab) ?? tabs[0]

  return (
    <div className="flex h-full flex-col">
      {/* Local header for the vehicles module */}
      <header className="mb-3 flex flex-col gap-1 border-b border-slate-200 pb-2">
        <h2 className="text-sm font-semibold text-slate-900">
          车辆与设备
        </h2>
        <p className="text-[11px] text-slate-500">{active.description}</p>

        {/* Secondary tab strip */}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {tabs.map((tab) => {
            const isActive = tab.key === activeTab
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] transition ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </header>

      {/* Tab content area */}
      <section className="min-h-0 flex-1 overflow-auto rounded-md bg-slate-50/70 p-3">
        <div className="min-h-full rounded-md border border-slate-200 bg-white p-3 shadow-sm">
          {renderActiveTabContent()}
        </div>
      </section>
    </div>
  )
}

export default VehiclesAndDevicesPage
