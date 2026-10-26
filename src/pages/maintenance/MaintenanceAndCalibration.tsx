/**
 * @fileoverview MaintenanceAndCalibration page component, serving as the
 * entry for fleet maintenance and calibration management. It surfaces
 * work orders, maintenance plans and calibration history in one place.
 */

import type { FC } from 'react'
import { useState } from 'react'

/**
 * Supported local tab keys within the maintenance page.
 */
type MaintenanceTabKey = 'workorders' | 'plans' | 'calibration'

/**
 * Single maintenance work order definition.
 */
interface MaintenanceWorkOrder {
  /** Unique work order id. */
  id: string
  /** Target vehicle id or group. */
  target: string
  /** Work type label. */
  type: '点检' | '维修' | '标定'
  /** Severity level label. */
  severity: '低' | '中' | '高'
  /** Current status label. */
  status: '待执行' | '进行中' | '待验收' | '已完成'
  /** Short description of the issue or task. */
  summary: string
  /** Responsible owner name. */
  owner: string
  /** Scheduled time label. */
  scheduledAt: string
}

/**
 * Single maintenance plan definition.
 */
interface MaintenancePlan {
  /** Unique plan id. */
  id: string
  /** Human readable plan name. */
  name: string
  /** Applied scope, such as vehicle group or model. */
  scope: string
  /** Maintenance type label. */
  type: string
  /** Planned frequency label. */
  frequency: string
  /** Next execution time label. */
  nextExecution: string
  /** Whether the plan is currently enabled. */
  enabled: boolean
}

/**
 * Single calibration record definition.
 */
interface CalibrationRecord {
  /** Unique calibration record id. */
  id: string
  /** Vehicle id. */
  vehicleId: string
  /** Sensor or module name. */
  sensor: string
  /** Calibration type label. */
  calibrationType: string
  /** Result label. */
  result: '通过' | '警告' | '失败'
  /** Operator / engineer name. */
  operator: string
  /** Performed at time label. */
  performedAt: string
}

/**
 * MaintenanceAndCalibration renders the main page for fleet maintenance
 * and calibration management, including work orders, periodic plans
 * and calibration history with a local tab switch.
 */
export const MaintenanceAndCalibration: FC = () => {
  const [activeTab, setActiveTab] = useState<MaintenanceTabKey>('workorders')

  /**
   * Render the tab header row.
   */
  const renderTabs = () => {
    const tabs: { key: MaintenanceTabKey; label: string }[] = [
      { key: 'workorders', label: '工单列表' },
      { key: 'plans', label: '维护计划' },
      { key: 'calibration', label: '标定记录' },
    ]

    return (
      <div className="mb-3 flex border-b border-slate-200 text-xs">
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`relative -mb-px mr-4 px-1 pb-2 transition-colors ${
                isActive
                  ? 'text-slate-900'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
              {isActive && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-sky-500" />
              )}
            </button>
          )
        })}
      </div>
    )
  }

  /**
   * Render main content based on the current active tab.
   */
  const renderContent = () => {
    switch (activeTab) {
      case 'workorders':
        return <WorkOrderListSection />
      case 'plans':
        return <MaintenancePlanSection />
      case 'calibration':
        return <CalibrationRecordSection />
      default:
        return null
    }
  }

  return (
    <div className="flex h-full flex-col space-y-4">
      {/* Page header */}
      <section className="space-y-1">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] text-slate-500">维护与标定</p>
            <h1 className="text-sm font-semibold text-slate-900">
              车辆维保 · 标定记录 · 验收追踪
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              统一管理点检、维修工单和传感器标定，确保硬件与软件在受控范围内安全运行。
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md bg-sky-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-sky-700"
          >
            + 新建工单
          </button>
        </div>

        {/* KPI summary cards */}
        <div className="mt-2 grid gap-2 md:grid-cols-3">
          <KpiCard label="未完成工单" value="5 单" helper="含 2 单高优先级维修" />
          <KpiCard
            label="即将到期维护计划"
            value="3 个"
            helper="未来 7 天内到期"
          />
          <KpiCard
            label="最近 30 天标定"
            value="14 次"
            helper="失败 1 次 · 警告 2 次"
          />
        </div>
      </section>

      {/* Tabs + body */}
      <section className="flex min-height-[320px] flex-1 flex-col rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
        {renderTabs()}
        <div className="mt-1 flex-1 overflow-auto">{renderContent()}</div>
      </section>
    </div>
  )
}

/**
 * Props for KPI card used on maintenance page.
 */
interface KpiCardProps {
  /** Headline label text. */
  label: string
  /** Main value text. */
  value: string
  /** Optional helper description. */
  helper?: string
}

/**
 * KpiCard renders a small statistic card at the top of the maintenance page.
 */
const KpiCard: FC<KpiCardProps> = ({ label, value, helper }) => {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-sm">
      <p className="text-[11px] text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-slate-900">{value}</p>
      {helper && (
        <p className="mt-0.5 text-[11px] text-slate-500">{helper}</p>
      )}
    </div>
  )
}

/**
 * WorkOrderListSection renders the maintenance work order list view.
 */
const WorkOrderListSection: FC = () => {
  const rows: MaintenanceWorkOrder[] = [
    {
      id: 'WO-202610-021',
      target: 'AV-007',
      type: '维修',
      severity: '高',
      status: '进行中',
      summary: '前向激光雷达点云异常，需检查线束与供电。',
      owner: '李四',
      scheduledAt: '2026-10-26 10:00',
    },
    {
      id: 'WO-202610-020',
      target: 'AV-012',
      type: '标定',
      severity: '中',
      status: '待执行',
      summary: '更换雷达后进行联合标定与回归验证。',
      owner: '王五',
      scheduledAt: '2026-10-27 14:00',
    },
    {
      id: 'WO-202610-019',
      target: '试运行组 · 8 辆',
      type: '点检',
      severity: '中',
      status: '待验收',
      summary: '例行点检：制动系统、自检告警与日志采集。',
      owner: '张三',
      scheduledAt: '2026-10-25 09:30',
    },
  ]

  /**
   * Render severity badge.
   */
  const renderSeverityBadge = (severity: MaintenanceWorkOrder['severity']) => {
    const baseClass =
      'inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px]'
    if (severity === '高') {
      return (
        <span className={`${baseClass} bg-rose-50 text-rose-700`}>高</span>
      )
    }
    if (severity === '中') {
      return (
        <span className={`${baseClass} bg-amber-50 text-amber-700`}>中</span>
      )
    }
    return (
      <span className={`${baseClass} bg-emerald-50 text-emerald-700`}>低</span>
    )
  }

  /**
   * Render status badge.
   */
  const renderStatusBadge = (status: MaintenanceWorkOrder['status']) => {
    const baseClass =
      'inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px]'
    if (status === '待执行') {
      return (
        <span className={`${baseClass} bg-slate-50 text-slate-700`}>
          待执行
        </span>
      )
    }
    if (status === '进行中') {
      return (
        <span className={`${baseClass} bg-sky-50 text-sky-700`}>进行中</span>
      )
    }
    if (status === '待验收') {
      return (
        <span className={`${baseClass} bg-amber-50 text-amber-700`}>
          待验收
        </span>
      )
    }
    return (
      <span className={`${baseClass} bg-emerald-50 text-emerald-700`}>
        已完成
      </span>
    )
  }

  return (
    <div className="flex h-full flex-col text-xs">
      <header className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="text-[13px] font-semibold text-slate-900">
            维护工单列表
          </h2>
          <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600">
            近 7 天
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select className="h-7 rounded-md border border-slate-200 bg-white px-2 text-[11px] text-slate-700">
            <option>状态</option>
            <option>待执行</option>
            <option>进行中</option>
            <option>待验收</option>
            <option>已完成</option>
          </select>
          <select className="h-7 rounded-md border border-slate-200 bg-white px-2 text-[11px] text-slate-700">
            <option>类型</option>
            <option>点检</option>
            <option>维修</option>
            <option>标定</option>
          </select>
        </div>
      </header>

      <div className="flex-1 overflow-auto rounded-md border border-slate-100">
        <table className="min-w-full text-xs">
          <thead className="bg-slate-50 text-[11px] text-slate-500">
            <tr>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                工单 ID
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                目标
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                类型
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                优先级
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                状态
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                概要
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                负责人
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                计划时间
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50">
                <td className="px-3 py-2 align-middle text-slate-900">
                  {row.id}
                </td>
                <td className="px-3 py-2 align-middle text-slate-700">
                  {row.target}
                </td>
                <td className="px-3 py-2 align-middle text-slate-700">
                  {row.type}
                </td>
                <td className="px-3 py-2 align-middle">
                  {renderSeverityBadge(row.severity)}
                </td>
                <td className="px-3 py-2 align-middle">
                  {renderStatusBadge(row.status)}
                </td>
                <td className="px-3 py-2 align-middle text-slate-700">
                  {row.summary}
                </td>
                <td className="px-3 py-2 align-middle text-slate-700">
                  {row.owner}
                </td>
                <td className="px-3 py-2 align-middle text-slate-700">
                  {row.scheduledAt}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/**
 * MaintenancePlanSection renders the periodic maintenance plan list view.
 */
const MaintenancePlanSection: FC = () => {
  const plans: MaintenancePlan[] = [
    {
      id: 'PLAN-VEH-QUARTER',
      name: '季度整车点检',
      scope: '生产 · 全量车队',
      type: '点检',
      frequency: '每 3 个月',
      nextExecution: '2026-11-15',
      enabled: true,
    },
    {
      id: 'PLAN-LIDAR-CAL',
      name: '激光雷达联合标定',
      scope: 'L4-A · 深圳园区',
      type: '标定',
      frequency: '里程 ≥ 5,000km 或 硬件更换后',
      nextExecution: '按触发条件',
      enabled: true,
    },
    {
      id: 'PLAN-STORAGE-HEALTH',
      name: '存储介质健康检查',
      scope: '全部车辆',
      type: '诊断',
      frequency: '每 1 个月',
      nextExecution: '2026-11-05',
      enabled: false,
    },
  ]

  return (
    <div className="flex h-full flex-col text-xs">
      <header className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="text-[13px] font-semibold text-slate-900">
            维护计划
          </h2>
          <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600">
            {plans.length} 个计划
          </span>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md border border-dashed border-slate-300 bg-white px-2 py-1 text-[11px] text-slate-600 hover:border-slate-400 hover:text-slate-800"
        >
          + 新建维护计划
        </button>
      </header>

      <div className="flex-1 overflow-auto rounded-md border border-slate-100">
        <table className="min-w-full text-xs">
          <thead className="bg-slate-50 text-[11px] text-slate-500">
            <tr>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                计划名称
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                适用范围
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                类型
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                频率
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                下次执行
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                启用状态
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {plans.map((plan) => (
              <tr key={plan.id} className="hover:bg-slate-50">
                <td className="px-3 py-2 align-middle text-slate-900">
                  {plan.name}
                </td>
                <td className="px-3 py-2 align-middle text-slate-700">
                  {plan.scope}
                </td>
                <td className="px-3 py-2 align-middle text-slate-700">
                  {plan.type}
                </td>
                <td className="px-3 py-2 align-middle text-slate-700">
                  {plan.frequency}
                </td>
                <td className="px-3 py-2 align-middle text-slate-700">
                  {plan.nextExecution}
                </td>
                <td className="px-3 py-2 align-middle">
                  <span
                    className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] ${
                      plan.enabled
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-50 text-slate-500'
                    }`}
                  >
                    {plan.enabled ? '已启用' : '未启用'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/**
 * CalibrationRecordSection renders the calibration history list view.
 */
const CalibrationRecordSection: FC = () => {
  const records: CalibrationRecord[] = [
    {
      id: 'CAL-202610-011',
      vehicleId: 'AV-012',
      sensor: '前向激光雷达 + 相机',
      calibrationType: '联合标定',
      result: '通过',
      operator: '王五',
      performedAt: '2026-10-24 16:20',
    },
    {
      id: 'CAL-202610-010',
      vehicleId: 'AV-007',
      sensor: 'IMU + 轮速',
      calibrationType: '自标定',
      result: '警告',
      operator: '张三',
      performedAt: '2026-10-20 10:05',
    },
    {
      id: 'CAL-202610-009',
      vehicleId: 'AV-001',
      sensor: '四向相机阵列',
      calibrationType: '离线标定',
      result: '通过',
      operator: '李四',
      performedAt: '2026-10-18 09:40',
    },
  ]

  /**
   * Render result badge.
   */
  const renderResultBadge = (result: CalibrationRecord['result']) => {
    const baseClass =
      'inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px]'
    if (result === '通过') {
      return (
        <span className={`${baseClass} bg-emerald-50 text-emerald-700`}>
          通过
        </span>
      )
    }
    if (result === '警告') {
      return (
        <span className={`${baseClass} bg-amber-50 text-amber-700`}>
          警告
        </span>
      )
    }
    return (
      <span className={`${baseClass} bg-rose-50 text-rose-700`}>失败</span>
    )
  }

  return (
    <div className="flex h-full flex-col text-xs">
      <header className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-[13px] font-semibold text-slate-900">
            标定记录
          </h2>
          <p className="mt-0.5 text-[11px] text-slate-500">
            按车辆和传感器维度追踪历史标定记录，用于排查感知/定位异常和验收合规。
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          <input
            type="text"
            placeholder="搜索车辆号 / 传感器"
            className="h-7 w-40 rounded-md border border-slate-200 bg-slate-50 px-2 text-[11px] text-slate-900 placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-200"
          />
          <select className="h-7 rounded-md border border-slate-200 bg-white px-2 text-[11px] text-slate-700">
            <option>结果</option>
            <option>通过</option>
            <option>警告</option>
            <option>失败</option>
          </select>
        </div>
      </header>

      <div className="flex-1 overflow-auto rounded-md border border-slate-100">
        <table className="min-w-full text-xs">
          <thead className="bg-slate-50 text-[11px] text-slate-500">
            <tr>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                记录 ID
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                车辆
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                传感器 / 模块
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                标定类型
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                结果
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                操作人
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                时间
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {records.map((record) => (
              <tr key={record.id} className="hover:bg-slate-50">
                <td className="px-3 py-2 align-middle text-slate-900">
                  {record.id}
                </td>
                <td className="px-3 py-2 align-middle text-slate-700">
                  {record.vehicleId}
                </td>
                <td className="px-3 py-2 align-middle text-slate-700">
                  {record.sensor}
                </td>
                <td className="px-3 py-2 align-middle text-slate-700">
                  {record.calibrationType}
                </td>
                <td className="px-3 py-2 align-middle">
                  {renderResultBadge(record.result)}
                </td>
                <td className="px-3 py-2 align-middle text-slate-700">
                  {record.operator}
                </td>
                <td className="px-3 py-2 align-middle text-slate-700">
                  {record.performedAt}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MaintenanceAndCalibration
