/**
 * @fileoverview VehicleLedger page component showing the vehicle inventory
 * with grouping tree, filters, and a compact table optimized for high
 * information density. It is designed as the entry for "车辆台账".
 */

import type { FC } from 'react'
import { useMemo, useState } from 'react'

/**
 * Single vehicle group definition in the left grouping tree.
 */
interface VehicleGroup {
  /** Unique identifier of the group. */
  id: string
  /** Display name of the group. */
  name: string
  /** Number of vehicles contained in this group. */
  count: number
}

/**
 * Single vehicle record in the ledger table.
 */
interface VehicleRow {
  id: string
  model: string
  site: string
  /** Human readable availability label. */
  availabilityLabel: string
  /** Color token for availability status dot. */
  availabilityColorClass: string
  targetBaseline: string
  actualBaseline: string
  /** Whether calibration is still valid. */
  calibrationValid: boolean
}

/**
 * VehicleLedger renders the vehicle inventory with grouping on the left,
 * search and filters on the top-right, and a compact table with batch
 * operations triggered when multiple rows are selected.
 */
export const VehicleLedger: FC = () => {
  const [selectedGroupId, setSelectedGroupId] = useState<string>('all')
  const [searchText, setSearchText] = useState<string>('')
  const [selectedVehicleIds, setSelectedVehicleIds] = useState<Set<string>>(
    () => new Set(),
  )

  const groups: VehicleGroup[] = [
    { id: 'all', name: '全部', count: 24 },
    { id: 'test', name: '测试组', count: 3 },
    { id: 'trial', name: '试运行', count: 8 },
    { id: 'full', name: '全量', count: 13 },
  ]

  const vehicles: VehicleRow[] = [
    {
      id: 'AV-001',
      model: 'L4-A',
      site: '深圳园区',
      availabilityLabel: '可运营',
      availabilityColorClass: 'bg-emerald-500',
      targetBaseline: 'B3',
      actualBaseline: 'B3',
      calibrationValid: true,
    },
    {
      id: 'AV-007',
      model: 'L4-A',
      site: '深圳园区',
      availabilityLabel: '可运营',
      availabilityColorClass: 'bg-emerald-500',
      targetBaseline: 'B3',
      actualBaseline: 'B2',
      calibrationValid: true,
    },
    {
      id: 'AV-012',
      model: 'L4-B',
      site: '深圳园区',
      availabilityLabel: '不可运营',
      availabilityColorClass: 'bg-slate-400',
      targetBaseline: 'B3',
      actualBaseline: 'B3',
      calibrationValid: false,
    },
  ]

  /**
   * Compute filtered vehicles based on search text and selected group.
   * Group-based filtering is mocked here; real implementation can
   * apply group conditions from the backend.
   */
  const filteredVehicles = useMemo(() => {
    const text = searchText.trim().toLowerCase()
    return vehicles.filter((v) => {
      const matchSearch =
        !text ||
        v.id.toLowerCase().includes(text) ||
        v.model.toLowerCase().includes(text)
      // For now, group filtering is only simulated for "测试组" etc.
      // In a real app, each vehicle would carry its group ids.
      const matchGroup =
        selectedGroupId === 'all'
          ? true
          : selectedGroupId === 'test'
            ? v.id === 'AV-001'
            : selectedGroupId === 'trial'
              ? v.id === 'AV-007'
              : selectedGroupId === 'full'
                ? v.id === 'AV-012'
                : true
      return matchSearch && matchGroup
    })
  }, [searchText, selectedGroupId, vehicles])

  const hasSelection = selectedVehicleIds.size > 0

  /**
   * Toggle a single vehicle row selection.
   */
  const toggleRowSelection = (id: string) => {
    setSelectedVehicleIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  /**
   * Toggle selection of all currently visible rows.
   */
  const toggleSelectAllVisible = () => {
    setSelectedVehicleIds((prev) => {
      if (prev.size === filteredVehicles.length) {
        return new Set()
      }
      return new Set(filteredVehicles.map((v) => v.id))
    })
  }

  return (
    <div className="flex h-full min-h-[480px] gap-4">
      {/* Left: grouping tree */}
      <aside className="w-52 flex-shrink-0 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
        <header className="mb-2 flex items-center justify-between">
          <h2 className="text-xs font-semibold text-slate-900">分组</h2>
        </header>
        <div className="space-y-1 text-xs">
          {groups.map((group) => {
            const isActive = group.id === selectedGroupId
            return (
              <button
                key={group.id}
                type="button"
                onClick={() => setSelectedGroupId(group.id)}
                className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left transition ${
                  isActive
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className="truncate">
                  {group.id === 'all' ? '▾ 全部' : group.name}
                </span>
                <span className="ml-2 text-[11px] text-slate-500">
                  {group.count}
                </span>
              </button>
            )
          })}
          <button
            type="button"
            className="mt-2 inline-flex w-full items-center justify-center rounded-md border border-dashed border-slate-300 px-2 py-1.5 text-[11px] text-slate-500 hover:border-slate-400 hover:text-slate-700"
          >
            + 新建分组
          </button>
        </div>
      </aside>

      {/* Right: filters + table */}
      <section className="flex min-w-0 flex-1 flex-col rounded-lg border border-slate-200 bg-white shadow-sm">
        {/* Header with search and filters */}
        <header className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-3 py-2.5">
          <div className="flex items-center gap-2">
            <h1 className="text-xs font-semibold text-slate-900">车辆台账</h1>
            <span className="text-[11px] text-slate-500">
              {filteredVehicles.length} 辆
            </span>
          </div>
          <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
            <div className="relative w-full max-w-xs">
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="搜索车辆号 / 序列号"
                className="h-7 w-full rounded-md border border-slate-200 bg-slate-50 px-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-200"
              />
            </div>
            <select className="h-7 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-700">
              <option>车型</option>
              <option>L4-A</option>
              <option>L4-B</option>
            </select>
            <select className="h-7 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-700">
              <option>场地</option>
              <option>深圳园区</option>
            </select>
            <select className="h-7 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-700">
              <option>可用状态</option>
              <option>可运营</option>
              <option>不可运营</option>
            </select>
            <select className="h-7 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-700">
              <option>版本一致性</option>
              <option>一致</option>
              <option>漂移</option>
            </select>
            <button
              type="button"
              className="inline-flex h-7 items-center rounded-md border border-slate-200 bg-white px-2 text-[11px] text-slate-700 hover:bg-slate-50"
            >
              导出
            </button>
          </div>
        </header>

        {/* Batch action bar */}
        {hasSelection && (
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-3 py-2 text-[11px] text-slate-700">
            <span>
              已选中 {selectedVehicleIds.size} 辆车辆，可进行批量操作
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] hover:bg-slate-100"
              >
                加入分组
              </button>
              <button
                type="button"
                className="inline-flex items-center rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] hover:bg-slate-100"
              >
                创建发布
              </button>
              <button
                type="button"
                className="inline-flex items-center rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] hover:bg-slate-100"
              >
                采集日志
              </button>
              <button
                type="button"
                className="inline-flex items-center rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] hover:bg-slate-100"
              >
                安排维护
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="min-w-full border-t border-slate-100 text-xs">
            <thead className="bg-slate-50 text-[11px] text-slate-500">
              <tr>
                <th className="w-8 border-b border-slate-100 px-2 py-2 text-left">
                  <input
                    type="checkbox"
                    aria-label="选择全部车辆"
                    checked={
                      filteredVehicles.length > 0 &&
                      selectedVehicleIds.size === filteredVehicles.length
                    }
                    onChange={toggleSelectAllVisible}
                    className="h-3 w-3 rounded border-slate-300 text-sky-600 focus:ring-sky-400"
                  />
                </th>
                <th className="border-b border-slate-100 px-2 py-2 text-left">
                  车辆
                </th>
                <th className="border-b border-slate-100 px-2 py-2 text-left">
                  车型
                </th>
                <th className="border-b border-slate-100 px-2 py-2 text-left">
                  场地
                </th>
                <th className="border-b border-slate-100 px-2 py-2 text-left">
                  可用状态
                </th>
                <th className="border-b border-slate-100 px-2 py-2 text-left">
                  目标基线
                </th>
                <th className="border-b border-slate-100 px-2 py-2 text-left">
                  实际基线
                </th>
                <th className="border-b border-slate-100 px-2 py-2 text-left">
                  标定
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVehicles.map((v) => {
                const isSelected = selectedVehicleIds.has(v.id)
                const isDrift = v.targetBaseline !== v.actualBaseline
                return (
                  <tr
                    key={v.id}
                    className={`hover:bg-slate-50 ${
                      isSelected ? 'bg-sky-50/60' : ''
                    }`}
                  >
                    {/* Drift indicator as a vertical bar on the left */}
                    <td className="relative border-b border-slate-100 px-2 py-2 align-middle">
                      {isDrift && (
                        <span className="absolute inset-y-1 left-0 w-0.5 rounded-full bg-amber-400" />
                      )}
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleRowSelection(v.id)}
                        className="h-3 w-3 rounded border-slate-300 text-sky-600 focus:ring-sky-400"
                        aria-label={`选择车辆 ${v.id}`}
                      />
                    </td>
                    <td className="border-b border-slate-100 px-2 py-2 align-middle text-slate-900">
                      {v.id}
                    </td>
                    <td className="border-b border-slate-100 px-2 py-2 align-middle text-slate-700">
                      {v.model}
                    </td>
                    <td className="border-b border-slate-100 px-2 py-2 align-middle text-slate-700">
                      {v.site}
                    </td>
                    <td className="border-b border-slate-100 px-2 py-2 align-middle">
                      <span className="inline-flex items-center gap-1 text-slate-800">
                        <span
                          className={`h-2 w-2 rounded-full ${v.availabilityColorClass}`}
                          aria-hidden="true"
                        />
                        <span className="text-[11px]">
                          {v.availabilityLabel}
                        </span>
                      </span>
                    </td>
                    <td className="border-b border-slate-100 px-2 py-2 align-middle text-slate-800">
                      {v.targetBaseline}
                    </td>
                    <td className="border-b border-slate-100 px-2 py-2 align-middle text-slate-800">
                      {v.actualBaseline}{' '}
                      {isDrift && (
                        <span className="ml-1 rounded-full bg-amber-50 px-1.5 py-0.5 text-[10px] text-amber-700">
                          漂移
                        </span>
                      )}
                    </td>
                    <td className="border-b border-slate-100 px-2 py-2 align-middle">
                      {v.calibrationValid ? (
                        <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] text-emerald-700">
                          有效
                        </span>
                      ) : (
                        <span className="rounded-full bg-rose-50 px-1.5 py-0.5 text-[10px] text-rose-700">
                          失效
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
              {filteredVehicles.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-[11px] text-slate-500"
                  >
                    当前筛选条件下没有车辆，一切正常。
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default VehicleLedger
