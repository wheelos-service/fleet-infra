/**
 * @fileoverview VersionAndReleaseHub 页面，作为「版本与发布」模块的入口。
 * 提供三个子页签：基线列表、发布列表、制品列表，统一浏览版本相关实体。
 */

import type { FC } from 'react'
import { useState } from 'react'

/**
 * 支持的子页签类型。
 */
type VersionTabKey = 'baselines' | 'releases' | 'artifacts'

/**
 * VersionAndReleaseHub 渲染「版本与发布」模块主界面，
 * 通过本地页签切换在同一布局中展示基线、发布和制品的列表视图。
 */
export const VersionAndReleaseHub: FC = () => {
  const [activeTab, setActiveTab] = useState<VersionTabKey>('baselines')

  /**
   * 渲染顶部的本地页签按钮行。
   */
  const renderTabs = () => {
    const tabs: { key: VersionTabKey; label: string }[] = [
      { key: 'baselines', label: '基线' },
      { key: 'releases', label: '发布' },
      { key: 'artifacts', label: '制品' },
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
   * 根据当前页签渲染对应的主内容区域。
   */
  const renderContent = () => {
    switch (activeTab) {
      case 'baselines':
        return <BaselineListSection />
      case 'releases':
        return <ReleaseListSection />
      case 'artifacts':
        return <ArtifactListSection />
      default:
        return null
    }
  }

  return (
    <div className="flex h-full flex-col space-y-4">
      {/* 页面头部 */}
      <section className="space-y-1">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] text-slate-500">版本与发布</p>
            <h1 className="text-sm font-semibold text-slate-900">
              基线 · 发布 · 制品
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              管理可追溯的基线，规划分批发布策略，并维护软件、模型、参数等制品版本。
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md bg-sky-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-sky-700"
            >
              + 创建发布
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
            >
              + 新建基线
            </button>
          </div>
        </div>

        {/* 顶部 KPI 摘要 */}
        <div className="mt-2 grid gap-2 md:grid-cols-3">
          <KpiCard label="已验证基线" value="6 条" helper="适配 3 种车型 / 4 个园区" />
          <KpiCard label="最近 30 天发布" value="18 次" helper="失败 1 次 · 熔断 0 次" />
          <KpiCard label="最新基线收敛度" value="82%" helper="使用 B3 的车辆占比" />
        </div>
      </section>

      {/* 页签 + 主内容 */}
      <section className="flex min-h-[320px] flex-1 flex-col rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
        {renderTabs()}
        <div className="mt-1 flex-1 overflow-auto">{renderContent()}</div>
      </section>
    </div>
  )
}

/**
 * Props for KpiCard component.
 */
interface KpiCardProps {
  /** 主标题文字。 */
  label: string
  /** 主要数值展示。 */
  value: string
  /** 辅助说明文本。 */
  helper?: string
}

/**
 * KpiCard 渲染顶部区域的小型统计卡片。
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
 * BaselineListSection 用于展示基线列表视图。
 */
const BaselineListSection: FC = () => {
  const rows = [
    {
      id: 'B3-2026.10',
      scope: 'L4-A · 深圳园区',
      status: '已验证',
      artifactsCount: 18,
      lastPublishedAt: '2026-10-20 22:30',
      riskLevel: '中',
    },
    {
      id: 'B2-2026.08',
      scope: 'L4-A · 深圳园区',
      status: '已下线',
      artifactsCount: 16,
      lastPublishedAt: '2026-08-03 21:10',
      riskLevel: '中',
    },
    {
      id: 'B1-2026.05',
      scope: 'L4-B · 测试园区',
      status: '草稿',
      artifactsCount: 10,
      lastPublishedAt: '-',
      riskLevel: '高',
    },
  ] as const

  /**
   * 渲染状态徽标。
   */
  const renderStatusBadge = (status: string) => {
    const baseClass =
      'inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] border'
    if (status === '已验证') {
      return (
        <span
          className={`${baseClass} border-emerald-100 bg-emerald-50 text-emerald-700`}
        >
          已验证
        </span>
      )
    }
    if (status === '草稿') {
      return (
        <span
          className={`${baseClass} border-slate-200 bg-slate-50 text-slate-700`}
        >
          草稿
        </span>
      )
    }
    return (
      <span
        className={`${baseClass} border-slate-100 bg-slate-50 text-slate-500`}
      >
        已下线
      </span>
    )
  }

  /**
   * 渲染风险等级徽标。
   */
  const renderRiskBadge = (risk: string) => {
    const baseClass =
      'inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px]'
    if (risk === '高') {
      return (
        <span className={`${baseClass} bg-rose-50 text-rose-700`}>
          高风险
        </span>
      )
    }
    if (risk === '中') {
      return (
        <span className={`${baseClass} bg-amber-50 text-amber-700`}>
          中风险
        </span>
      )
    }
    return (
      <span className={`${baseClass} bg-emerald-50 text-emerald-700`}>
        低风险
      </span>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <header className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-slate-900">基线列表</h2>
          <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600">
            {rows.length} 条
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            placeholder="搜索基线名称 / 适用范围"
            className="h-7 w-48 rounded-md border border-slate-200 bg-slate-50 px-2 text-[11px] text-slate-900 placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-200"
          />
          <select className="h-7 rounded-md border border-slate-200 bg-white px-2 text-[11px] text-slate-700">
            <option>状态</option>
            <option>草稿</option>
            <option>已验证</option>
            <option>已下线</option>
          </select>
        </div>
      </header>

      <div className="flex-1 overflow-auto rounded-md border border-slate-100">
        <table className="min-w-full text-xs">
          <thead className="bg-slate-50 text-[11px] text-slate-500">
            <tr>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                基线
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                适用范围
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                状态
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                制品数
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                最近发布
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                风险
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
                  {row.scope}
                </td>
                <td className="px-3 py-2 align-middle">
                  {renderStatusBadge(row.status)}
                </td>
                <td className="px-3 py-2 align-middle text-slate-800">
                  {row.artifactsCount}
                </td>
                <td className="px-3 py-2 align-middle text-slate-700">
                  {row.lastPublishedAt}
                </td>
                <td className="px-3 py-2 align-middle">
                  {renderRiskBadge(row.riskLevel)}
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
 * ReleaseListSection 用于展示发布列表视图。
 */
const ReleaseListSection: FC = () => {
  const rows = [
    {
      id: 'R-041',
      baseline: 'B3-2026.10',
      scope: '深圳园区 · 全量',
      status: '进行中',
      progress: 65,
      createdBy: '李四',
      createdAt: '2026-10-20 22:00',
    },
    {
      id: 'R-040',
      baseline: 'B3-2026.10',
      scope: '深圳园区 · 试运行组',
      status: '已完成',
      progress: 100,
      createdBy: '王五',
      createdAt: '2026-10-18 21:10',
    },
    {
      id: 'R-039',
      baseline: 'B2-2026.08',
      scope: '测试园区 · 测试组',
      status: '失败',
      progress: 42,
      createdBy: '张三',
      createdAt: '2026-10-10 19:30',
    },
  ] as const

  /**
   * 渲染发布状态徽标。
   */
  const renderStatusBadge = (status: string) => {
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
    return (
      <span className={`${baseClass} bg-rose-50 text-rose-700`}>
        失败
      </span>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <header className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-slate-900">发布列表</h2>
          <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600">
            {rows.length} 条
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select className="h-7 rounded-md border border-slate-200 bg-white px-2 text-[11px] text-slate-700">
            <option>状态</option>
            <option>进行中</option>
            <option>已完成</option>
            <option>失败</option>
          </select>
          <select className="h-7 rounded-md border border-slate-200 bg-white px-2 text-[11px] text-slate-700">
            <option>环境</option>
            <option>生产</option>
            <option>测试</option>
          </select>
        </div>
      </header>

      <div className="flex-1 overflow-auto rounded-md border border-slate-100">
        <table className="min-w-full text-xs">
          <thead className="bg-slate-50 text-[11px] text-slate-500">
            <tr>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                发布
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                基线
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
                发起人
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
                  {row.baseline}
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
                          row.status === '失败'
                            ? 'bg-rose-500'
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
                  {row.createdBy}
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

/**
 * ArtifactListSection 用于展示制品列表视图。
 */
const ArtifactListSection: FC = () => {
  const rows = [
    {
      name: 'perception-main',
      type: '软件',
      latestVersion: 'v3.4.2',
      usedBy: 3,
      lastUpdated: '2026-10-15',
    },
    {
      name: 'planning-params-l4a',
      type: '参数',
      latestVersion: 'v1.12.0',
      usedBy: 2,
      lastUpdated: '2026-10-12',
    },
    {
      name: 'shenzhen-campus-map',
      type: '地图',
      latestVersion: '2026-09',
      usedBy: 2,
      lastUpdated: '2026-09-30',
    },
  ] as const

  return (
    <div className="flex h-full flex-col">
      <header className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-slate-900">制品列表</h2>
          <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600">
            {rows.length} 个
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            placeholder="搜索制品名称"
            className="h-7 w-48 rounded-md border border-slate-200 bg-slate-50 px-2 text-[11px] text-slate-900 placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-200"
          />
          <select className="h-7 rounded-md border border-slate-200 bg-white px-2 text-[11px] text-slate-700">
            <option>类型</option>
            <option>软件</option>
            <option>模型</option>
            <option>参数</option>
            <option>地图</option>
            <option>固件</option>
          </select>
        </div>
      </header>

      <div className="flex-1 overflow-auto rounded-md border border-slate-100">
        <table className="min-w-full text-xs">
          <thead className="bg-slate-50 text-[11px] text-slate-500">
            <tr>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                制品
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                类型
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                最新版本
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                被基线引用
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                最近更新时间
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr
                key={row.name}
                className="cursor-pointer hover:bg-slate-50"
              >
                <td className="px-3 py-2 align-middle text-slate-900">
                  {row.name}
                </td>
                <td className="px-3 py-2 align-middle text-slate-700">
                  {row.type}
                </td>
                <td className="px-3 py-2 align-middle text-slate-800">
                  {row.latestVersion}
                </td>
                <td className="px-3 py-2 align-middle text-slate-700">
                  {row.usedBy} 条基线
                </td>
                <td className="px-3 py-2 align-middle text-slate-700">
                  {row.lastUpdated}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default VersionAndReleaseHub
