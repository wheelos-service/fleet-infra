/**
 * @fileoverview Map and resource release page.
 * It provides an overview of map versions, operation areas,
 * forbidden zones and synchronization status between vehicles and maps.
 */

import type { FC } from 'react'

/**
 * Single map release item shown in the list.
 */
interface MapReleaseItem {
  /** Unique id of the map release. */
  id: string
  /** Human readable map version. */
  mapVersion: string
  /** Primary operation area name. */
  area: string
  /** Short description for the work zone or resource. */
  description: string
  /** Current publish status label. */
  status: '进行中' | '已完成' | '待发布'
  /** Count of target vehicles. */
  vehicleCount: number
}

/**
 * MapAndResourceReleasePage renders a high-level overview of
 * map versions, work areas and vehicle synchronization status.
 */
const MapAndResourceReleasePage: FC = () => {
  const activeReleases: MapReleaseItem[] = [
    {
      id: 'M-023',
      mapVersion: 'map-shanghai-2025.04',
      area: '上海 · 测试区域 A',
      description: '含新建禁行区与施工绕行路径',
      status: '进行中',
      vehicleCount: 12,
    },
    {
      id: 'M-019',
      mapVersion: 'map-suzhou-2025.03',
      area: '苏州 · 工业园区',
      description: '优化定位图层与车道级约束',
      status: '已完成',
      vehicleCount: 20,
    },
  ]

  return (
    <div className="space-y-4">
      {/* Intro section */}
      <section>
        <h2 className="text-sm font-semibold text-slate-900">
          地图与资源发布
        </h2>
        <p className="mt-1 text-[11px] text-slate-500">
          管理地图版本、路线资源、作业区域和禁行区，并核对车辆地图同步与实际生效版本。
        </p>
      </section>

      {/* Summary cards */}
      <section className="grid gap-3 md:grid-cols-3">
        <SummaryCard label="活跃地图版本" value="3" />
        <SummaryCard label="进行中地图发布" value="1" />
        <SummaryCard label="地图版本不一致车辆" value="5" emphasize />
      </section>

      {/* Active releases list */}
      <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <header className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
          <h3 className="text-xs font-semibold text-slate-900">
            地图发布批次
          </h3>
          <button
            type="button"
            className="text-[11px] text-sky-600 hover:text-sky-700"
          >
            新建地图发布
          </button>
        </header>
        <div className="divide-y divide-slate-100 text-xs">
          {activeReleases.map((item) => (
            <div
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5"
            >
              <div className="min-w-0 space-y-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-800">
                    {item.id}
                  </span>
                  <span className="text-xs font-medium text-slate-900">
                    {item.mapVersion}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {item.area}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  {item.description}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1 text-[11px]">
                <span className="text-slate-500">
                  目标车辆 {item.vehicleCount} 辆
                </span>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 ${
                    item.status === '进行中'
                      ? 'bg-sky-50 text-sky-700'
                      : item.status === '已完成'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-50 text-slate-700'
                  }`}
                >
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

/**
 * Props for the map summary card component.
 */
interface SummaryCardProps {
  /** Main label shown on the card. */
  label: string
  /** Value shown as the primary number or text. */
  value: string
  /** Whether the card should be visually emphasized. */
  emphasize?: boolean
}

/**
 * SummaryCard renders a small statistic card for map overview metrics.
 */
const SummaryCard: FC<SummaryCardProps> = ({ label, value, emphasize }) => {
  return (
    <div
      className={`flex flex-col rounded-lg border border-slate-200 bg-white px-3 py-2 text-left shadow-sm ${
        emphasize ? 'ring-1 ring-amber-100' : ''
      }`}
    >
      <span className="text-[11px] text-slate-500">{label}</span>
      <span className="mt-1 text-base font-semibold text-slate-900">
        {value}
      </span>
    </div>
  )
}

export default MapAndResourceReleasePage
