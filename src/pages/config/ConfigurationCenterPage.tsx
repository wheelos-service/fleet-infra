/**
 * @fileoverview ConfigurationCenterPage page component, serving as the entry
 * for parameter and configuration management. It focuses on templates,
 * versioned configurations, validation results, and rollout / rollback
 * history to ensure safe, traceable configuration changes.
 */

import type { FC, ReactNode } from 'react'
import { useState } from 'react'

/**
 * Supported tab keys within the configuration center.
 */
type ConfigCenterTabKey = 'templates' | 'versions' | 'rollouts'

/**
 * ConfigurationCenterPage renders the main layout for parameter and
 * configuration management, including templates, versions and rollout
 * overviews under a unified page with local tabs.
 */
export const ConfigurationCenterPage: FC = () => {
  const [activeTab, setActiveTab] = useState<ConfigCenterTabKey>('templates')

  /**
   * Render the top-level local tab buttons.
   */
  const renderTabs = (): ReactNode => {
    const tabs: { key: ConfigCenterTabKey; label: string }[] = [
      { key: 'templates', label: '参数模板' },
      { key: 'versions', label: '配置版本' },
      { key: 'rollouts', label: '灰度与生效' },
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
   * Render tab-specific main content.
   */
  const renderContent = (): ReactNode => {
    switch (activeTab) {
      case 'templates':
        return <ParameterTemplateSection />
      case 'versions':
        return <ParameterVersionSection />
      case 'rollouts':
        return <ParameterRolloutSection />
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
            <p className="text-[11px] text-slate-500">配置中心</p>
            <h1 className="text-sm font-semibold text-slate-900">
              参数模板 · 配置版本 · 灰度生效
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              统一管理自动驾驶软件与车辆运行参数的模板与版本，支持兼容性校验、
              灰度发布与快速回滚，确保线上配置可追溯、可验证。
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md bg-sky-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-sky-700"
          >
            + 新建参数模板
          </button>
        </div>

        {/* KPI summary cards */}
        <div className="mt-2 grid gap-2 md:grid-cols-3">
          <ConfigKpiCard
            label="参数模板"
            value="8 个"
            helper="覆盖 3 种车型 / 4 个园区"
          />
          <ConfigKpiCard
            label="线上配置版本"
            value="21 个"
            helper="生产环境 9 个 · 测试环境 12 个"
          />
          <ConfigKpiCard
            label="进行中的灰度发布"
            value="2 个"
            helper="无高风险校验失败"
          />
        </div>
      </section>

      {/* Tabs + body */}
      <section className="flex min-h-[320px] flex-1 flex-col rounded-lg border border-slate-200 bg-white p-3 text-xs shadow-sm">
        {renderTabs()}
        <div className="mt-1 flex-1 overflow-auto">{renderContent()}</div>
      </section>
    </div>
  )
}

/**
 * Props for configuration KPI cards.
 */
interface ConfigKpiCardProps {
  /** Card headline label. */
  label: string
  /** Main numeric or text value. */
  value: string
  /** Optional helper description text. */
  helper?: string
}

/**
 * ConfigKpiCard renders a small statistic card used at the top of the
 * configuration center page.
 */
const ConfigKpiCard: FC<ConfigKpiCardProps> = ({ label, value, helper }) => {
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
 * Single parameter template definition for the list section.
 */
interface ParameterTemplateRow {
  /** Unique template id. */
  id: string
  /** Human readable template name. */
  name: string
  /** Applicable scope description (model / site / environment). */
  scope: string
  /** Configuration domain, such as planning or perception. */
  domain: string
  /** Count of versions under this template. */
  versions: number
  /** Count of online configurations using this template. */
  inUseBy: number
  /** Last updated time label. */
  updatedAt: string
}

/**
 * ParameterTemplateSection renders the parameter template list view, used
 * to manage reusable configuration blueprints across models and sites.
 */
const ParameterTemplateSection: FC = () => {
  const rows: ParameterTemplateRow[] = [
    {
      id: 'TPL-PLAN-L4A',
      name: 'L4-A 规划参数 · 生产',
      scope: '车型=L4-A · 环境=生产',
      domain: '规划',
      versions: 6,
      inUseBy: 3,
      updatedAt: '2026-10-20 21:30',
    },
    {
      id: 'TPL-PERC-SHZ',
      name: '深圳园区感知阈值',
      scope: '场地=深圳园区',
      domain: '感知',
      versions: 4,
      inUseBy: 2,
      updatedAt: '2026-10-18 19:05',
    },
    {
      id: 'TPL-CTRL-GENERIC',
      name: '通用控制参数 · 回转与加减速',
      scope: '全部车型 · 全部环境',
      domain: '控制',
      versions: 5,
      inUseBy: 5,
      updatedAt: '2026-10-10 10:12',
    },
  ]

  return (
    <div className="flex h-full flex-col text-xs">
      <header className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="text-[13px] font-semibold text-slate-900">
            参数模板列表
          </h2>
          <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600">
            {rows.length} 个模板
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            placeholder="搜索模板名称 / 适用范围"
            className="h-7 w-52 rounded-md border border-slate-200 bg-slate-50 px-2 text-[11px] text-slate-900 placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-200"
          />
          <select className="h-7 rounded-md border border-slate-200 bg-white px-2 text-[11px] text-slate-700">
            <option>领域</option>
            <option>规划</option>
            <option>感知</option>
            <option>控制</option>
          </select>
        </div>
      </header>

      <div className="flex-1 overflow-auto rounded-md border border-slate-100">
        <table className="min-w-full text-xs">
          <thead className="bg-slate-50 text-[11px] text-slate-500">
            <tr>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                模板名称
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                适用范围
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                领域
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                版本数
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                正在使用
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                最近更新
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr
                key={row.id}
                className="cursor-pointer hover:bg-slate-50"
              >
                <td className="px-3 py-2 align-middle text-slate-900">
                  {row.name}
                </td>
                <td className="px-3 py-2 align-middle text-slate-700">
                  {row.scope}
                </td>
                <td className="px-3 py-2 align-middle text-slate-700">
                  {row.domain}
                </td>
                <td className="px-3 py-2 align-middle text-slate-800">
                  {row.versions}
                </td>
                <td className="px-3 py-2 align-middle text-slate-700">
                  {row.inUseBy} 个线上配置
                </td>
                <td className="px-3 py-2 align-middle text-slate-700">
                  {row.updatedAt}
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
 * Single parameter version definition with basic validation metadata.
 */
interface ParameterVersionRow {
  /** Version identifier within a template. */
  version: string
  /** Related template name. */
  templateName: string
  /** Target environment label. */
  environment: string
  /** Validation status label. */
  validationStatus: '通过' | '警告' | '失败'
  /** Compatibility summary description. */
  compatibility: string
  /** Short diff summary versus previous version. */
  diffSummary: string
  /** Last updated time label. */
  updatedAt: string
}

/**
 * ParameterVersionSection renders configuration versions overview,
 * including validation and compatibility status with a short diff summary.
 */
const ParameterVersionSection: FC = () => {
  const rows: ParameterVersionRow[] = [
    {
      version: 'v1.12.0',
      templateName: 'L4-A 规划参数 · 生产',
      environment: '生产',
      validationStatus: '通过',
      compatibility: 'L4-A · 深圳园区 · B3 基线',
      diffSummary: '调整减速阈值，收紧急刹触发条件',
      updatedAt: '2026-10-20 21:30',
    },
    {
      version: 'v1.11.0',
      templateName: 'L4-A 规划参数 · 生产',
      environment: '测试',
      validationStatus: '警告',
      compatibility: 'L4-A · 测试园区 · B2/B3 基线',
      diffSummary: '放宽低速跟车距离，上线前需回归',
      updatedAt: '2026-10-15 18:10',
    },
    {
      version: 'v3.2.1',
      templateName: '深圳园区感知阈值',
      environment: '生产',
      validationStatus: '失败',
      compatibility: '与 B1 基线不兼容 · 存在参数缺失',
      diffSummary: '新增夜间场景补偿参数，校验未通过',
      updatedAt: '2026-10-10 11:05',
    },
  ]

  /**
   * Render validation status badge for a version row.
   */
  const renderValidationBadge = (
    status: ParameterVersionRow['validationStatus'],
  ): ReactNode => {
    const baseClass =
      'inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px]'
    if (status === '通过') {
      return (
        <span className={`${baseClass} bg-emerald-50 text-emerald-700`}>
          校验通过
        </span>
      )
    }
    if (status === '警告') {
      return (
        <span className={`${baseClass} bg-amber-50 text-amber-700`}>
          存在警告
        </span>
      )
    }
    return (
      <span className={`${baseClass} bg-rose-50 text-rose-700`}>
        校验失败
      </span>
    )
  }

  return (
    <div className="flex h-full flex-col text-xs">
      <header className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="text-[13px] font-semibold text-slate-900">
            配置版本概览
          </h2>
          <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600">
            {rows.length} 个版本样例
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select className="h-7 rounded-md border border-slate-200 bg-white px-2 text-[11px] text-slate-700">
            <option>环境</option>
            <option>生产</option>
            <option>测试</option>
          </select>
          <select className="h-7 rounded-md border border-slate-200 bg-white px-2 text-[11px] text-slate-700">
            <option>校验结果</option>
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
                版本
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                模板
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                环境
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                校验状态
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                兼容性摘要
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                变更摘要 (Diff)
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                最近更新
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr
                key={`${row.templateName}-${row.version}`}
                className="cursor-pointer hover:bg-slate-50"
              >
                <td className="px-3 py-2 align-middle text-slate-900">
                  {row.version}
                </td>
                <td className="px-3 py-2 align-middle text-slate-700">
                  {row.templateName}
                </td>
                <td className="px-3 py-2 align-middle text-slate-700">
                  {row.environment}
                </td>
                <td className="px-3 py-2 align-middle">
                  {renderValidationBadge(row.validationStatus)}
                </td>
                <td className="px-3 py-2 align-middle text-slate-700">
                  {row.compatibility}
                </td>
                <td className="px-3 py-2 align-middle text-slate-700">
                  {row.diffSummary}
                </td>
                <td className="px-3 py-2 align-middle text-slate-700">
                  {row.updatedAt}
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
 * Single parameter rollout definition with progress and result metadata.
 */
interface ParameterRolloutRow {
  /** Unique rollout id. */
  id: string
  /** Related configuration version. */
  version: string
  /** Target scope description. */
  scope: string
  /** Current rollout status label. */
  status: '进行中' | '已完成' | '已回滚' | '已中止'
  /** Progress percentage number. */
  progress: number
  /** Failure rate summary text. */
  failureSummary: string
  /** Created at time label. */
  createdAt: string
}

/**
 * ParameterRolloutSection renders the rollout and effective configuration
 * list, used to understand ongoing canary / phased rollouts and rollback
 * results at a glance.
 */
const ParameterRolloutSection: FC = () => {
  const rows: ParameterRolloutRow[] = [
    {
      id: 'CFG-ROLL-202610-002',
      version: 'v1.12.0',
      scope: 'L4-A · 深圳园区 · 试运行组',
      status: '进行中',
      progress: 60,
      failureSummary: '失败率 0 / 12 辆 · 无回滚',
      createdAt: '2026-10-25 20:10',
    },
    {
      id: 'CFG-ROLL-202610-001',
      version: 'v3.2.1',
      scope: '深圳园区 · 全量感知节点',
      status: '已回滚',
      progress: 100,
      failureSummary: '失败率 3 / 20 辆 · 已触发自动回滚',
      createdAt: '2026-10-20 19:40',
    },
    {
      id: 'CFG-ROLL-202609-008',
      version: 'v1.11.0',
      scope: 'L4-A · 测试园区 · 8 辆',
      status: '已完成',
      progress: 100,
      failureSummary: '失败率 0 / 8 辆',
      createdAt: '2026-09-30 18:05',
    },
  ]

  /**
   * Render rollout status badge.
   */
  const renderStatusBadge = (status: ParameterRolloutRow['status']): ReactNode => {
    const baseClass =
      'inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px]'
    if (status === '进行中') {
      return (
        <span className={`${baseClass} bg-sky-50 text-sky-700`}>
          进行中
        </span>
      )
    }
    if (status === '已完成') {
      return (
        <span className={`${baseClass} bg-emerald-50 text-emerald-700`}>
          已完成
        </span>
      )
    }
    if (status === '已回滚') {
      return (
        <span className={`${baseClass} bg-amber-50 text-amber-700`}>
          已回滚
        </span>
      )
    }
    return (
      <span className={`${baseClass} bg-slate-50 text-slate-600`}>
        已中止
      </span>
    )
  }

  return (
    <div className="flex h-full flex-col text-xs">
      <header className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-[13px] font-semibold text-slate-900">
            灰度与生效记录
          </h2>
          <p className="mt-0.5 text-[11px] text-slate-500">
            按批次查看配置灰度发布的进度、失败阈值触发情况，以及自动或人工回滚的结果。
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 hover:bg-slate-50"
        >
          配置新灰度发布
        </button>
      </header>

      <div className="flex-1 overflow-auto rounded-md border border-slate-100">
        <table className="min-w-full text-xs">
          <thead className="bg-slate-50 text-[11px] text-slate-500">
            <tr>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                灰度批次
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                配置版本
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                范围
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                状态
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                进度
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                失败与回滚
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                创建时间
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr
                key={row.id}
                className="cursor-pointer hover:bg-slate-50"
              >
                <td className="px-3 py-2 align-middle text-slate-900">
                  {row.id}
                </td>
                <td className="px-3 py-2 align-middle text-slate-700">
                  {row.version}
                </td>
                <td className="px-3 py-2 align-middle text-slate-700">
                  {row.scope}
                </td>
                <td className="px-3 py-2 align-middle">
                  {renderStatusBadge(row.status)}
                </td>
                <td className="px-3 py-2 align-middle">
                  <div className="flex items-center gap-2">
                    <div className="relative h-1.5 w-24 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${
                          row.status === '已回滚'
                            ? 'bg-amber-500'
                            : row.status === '已中止'
                              ? 'bg-slate-400'
                              : 'bg-sky-500'
                        }`}
                        style={{ width: `${row.progress}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-slate-600">
                      {row.progress}%
                    </span>
                  </div>
                </td>
                <td className="px-3 py-2 align-middle text-slate-700">
                  {row.failureSummary}
                </td>
                <td className="px-3 py-2 align-middle text-slate-700">
                  {row.createdAt}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ConfigurationCenterPage
