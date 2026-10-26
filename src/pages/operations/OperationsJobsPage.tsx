/**
 * @fileoverview OperationsJobsPage 页面，作为「运维作业」模块入口。
 * 以本地页签形式展示作业列表、模板库和任务队列三个视图。
 */

import type { FC } from 'react'
import { useState } from 'react'

/**
 * 可选的运维作业页签 key。
 */
type JobTabKey = 'jobs' | 'templates' | 'queue'

/**
 * OperationsJobsPage 渲染运维作业模块的主界面，
 * 帮助用户查看历史作业、管理模板以及关注执行队列中的任务。
 */
export const OperationsJobsPage: FC = () => {
  const [activeTab, setActiveTab] = useState<JobTabKey>('jobs')

  /**
   * 渲染本地页签按钮行。
   */
  const renderTabs = () => {
    const tabs: { key: JobTabKey; label: string }[] = [
      { key: 'jobs', label: '作业' },
      { key: 'templates', label: '模板' },
      { key: 'queue', label: '任务队列' },
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
   * 渲染当前页签对应的主内容。
   */
  const renderContent = () => {
    switch (activeTab) {
      case 'jobs':
        return <JobListSection />
      case 'templates':
        return <JobTemplateSection />
      case 'queue':
        return <JobQueueSection />
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
            <p className="text-[11px] text-slate-500">运维作业</p>
            <h1 className="text-sm font-semibold text-slate-900">
              远程运维 · 诊断 · 标定
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              通过标准化模板批量执行诊断、配置、维护等操作，并追踪每辆车的执行结果。
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md bg-sky-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-sky-700"
          >
            + 新建作业
          </button>
        </div>

        {/* 顶部 KPI 摘要 */}
        <div className="mt-2 grid gap-2 md:grid-cols-3">
          <KpiCard label="今日作业" value="12 次" helper="成功 11 · 失败 1" />
          <KpiCard label="平均完成时间" value="6 分钟" helper="近 7 天统计" />
          <KpiCard label="高风险作业占比" value="8%" helper="需双人审批的作业" />
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
 * Props for KpiCard component used in operations page.
 */
interface KpiCardProps {
  /** 主标题文本。 */
  label: string
  /** 核心数值。 */
  value: string
  /** 辅助信息说明。 */
  helper?: string
}

/**
 * KpiCard 渲染运维模块顶部的统计卡片。
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
 * JobListSection 展示历史运维作业列表。
 */
const JobListSection: FC = () => {
  const rows = [
    {
      id: 'JOB-202610-032',
      type: '采集日志',
      target: '试运行组 · 8 辆',
      risk: '低',
      status: '成功',
      createdBy: '李四',
      createdAt: '2026-10-25 21:30',
      duration: '3 分钟',
    },
    {
      id: 'JOB-202610-031',
      type: '重启关键模块',
      target: 'AV-007',
      risk: '高',
      status: '成功',
      createdBy: '张三',
      createdAt: '2026-10-25 20:05',
      duration: '1 分钟',
    },
    {
      id: 'JOB-202610-030',
      type: '触发标定任务',
      target: '深圳园区 · 全量',
      risk: '中',
      status: '失败',
      createdBy: '王五',
      createdAt: '2026-10-24 18:40',
      duration: '5 分钟',
    },
  ] as const

  /**
   * 渲染状态徽标。
   */
  const renderStatusBadge = (status: string) => {
    const baseClass =
      'inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px]'
    if (status === '成功') {
      return (
        <span className={`${baseClass} bg-emerald-50 text-emerald-700`}>
          成功
        </span>
      )
    }
    if (status === '执行中') {
      return (
        <span className={`${baseClass} bg-sky-50 text-sky-700`}>
          执行中
        </span>
      )
    }
    return (
      <span className={`${baseClass} bg-rose-50 text-rose-700`}>
        失败
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
          <h2 className="font-semibold text-slate-900">作业列表</h2>
          <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600">
            近 3 天
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select className="h-7 rounded-md border border-slate-200 bg-white px-2 text-[11px] text-slate-700">
            <option>状态</option>
            <option>执行中</option>
            <option>成功</option>
            <option>失败</option>
          </select>
          <select className="h-7 rounded-md border border-slate-200 bg-white px-2 text-[11px] text-slate-700">
            <option>风险等级</option>
            <option>低</option>
            <option>中</option>
            <option>高</option>
          </select>
        </div>
      </header>

      <div className="flex-1 overflow-auto rounded-md border border-slate-100">
        <table className="min-w-full text-xs">
          <thead className="bg-slate-50 text-[11px] text-slate-500">
            <tr>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                作业 ID
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                类型
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                目标
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                风险
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                状态
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                发起人
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                创建时间
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                用时
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
                  {row.type}
                </td>
                <td className="px-3 py-2 align-middle text-slate-700">
                  {row.target}
                </td>
                <td className="px-3 py-2 align-middle">
                  {renderRiskBadge(row.risk)}
                </td>
                <td className="px-3 py-2 align-middle">
                  {renderStatusBadge(row.status)}
                </td>
                <td className="px-3 py-2 align-middle text-slate-700">
                  {row.createdBy}
                </td>
                <td className="px-3 py-2 align-middle text-slate-700">
                  {row.createdAt}
                </td>
                <td className="px-3 py-2 align-middle text-slate-700">
                  {row.duration}
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
 * JobTemplateSection 展示运维作业模板库。
 */
const JobTemplateSection: FC = () => {
  const rows = [
    {
      name: '采集诊断日志（标准）',
      category: '诊断',
      risk: '低',
      description: '采集最近 30 分钟的系统日志和模块日志打包上传。',
      updatedAt: '2026-10-20',
      usedCount: 124,
    },
    {
      name: '重启关键模块（生产）',
      category: '配置',
      risk: '高',
      description: '重启感知、规划、控制等关键模块，需双人审批。',
      updatedAt: '2026-10-18',
      usedCount: 32,
    },
    {
      name: '触发标定任务',
      category: '维护',
      risk: '中',
      description: '对指定车辆触发传感器标定任务并跟踪结果。',
      updatedAt: '2026-10-16',
      usedCount: 45,
    },
  ] as const

  /**
   * 渲染风险徽标。
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
          <h2 className="font-semibold text-slate-900">作业模板库</h2>
          <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600">
            {rows.length} 个模板
          </span>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md border border-dashed border-slate-300 bg-white px-2 py-1 text-[11px] text-slate-600 hover:border-slate-400 hover:text-slate-800"
        >
          + 新建模板
        </button>
      </header>

      <div className="grid gap-3 md:grid-cols-3">
        {rows.map((row) => (
          <article
            key={row.name}
            className="flex flex-col rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs shadow-sm"
          >
            <div className="mb-1 flex items-start justify-between gap-2">
              <div>
                <h3 className="text-[13px] font-semibold text-slate-900">
                  {row.name}
                </h3>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  {row.category}
                </p>
              </div>
              {renderRiskBadge(row.risk)}
            </div>
            <p className="flex-1 text-[11px] text-slate-600">
              {row.description}
            </p>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
              <span>最近更新 {row.updatedAt}</span>
              <span>累积执行 {row.usedCount} 次</span>
            </div>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                className="inline-flex flex-1 items-center justify-center rounded-md bg-sky-600 px-2 py-1 text-[11px] font-medium text-white hover:bg-sky-700"
              >
                以此新建作业
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 hover:bg-slate-50"
              >
                编辑
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

/**
 * JobQueueSection 展示当前执行队列中的任务视图。
 */
const JobQueueSection: FC = () => {
  const rows = [
    {
      id: 'QUEUE-021',
      jobId: 'JOB-202610-032',
      type: '采集日志',
      target: 'AV-012',
      state: '执行中',
      queuedAt: '21:29:10',
      startedAt: '21:29:40',
    },
    {
      id: 'QUEUE-020',
      jobId: 'JOB-202610-031',
      type: '重启关键模块',
      target: 'AV-007',
      state: '已完成',
      queuedAt: '20:04:10',
      startedAt: '20:04:30',
    },
  ] as const

  /**
   * 渲染队列状态徽标。
   */
  const renderStateBadge = (state: string) => {
    const baseClass =
      'inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px]'
    if (state === '执行中') {
      return (
        <span className={`${baseClass} bg-sky-50 text-sky-700`}>
          执行中
        </span>
      )
    }
    if (state === '等待中') {
      return (
        <span className={`${baseClass} bg-amber-50 text-amber-700`}>
          等待中
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
    <div className="flex h-full flex-col">
      <header className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div>
          <h2 className="font-semibold text-slate-900">任务队列</h2>
          <p className="mt-0.5 text-[11px] text-slate-500">
            实时查看正在执行或排队中的任务，排查卡顿和长尾。
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 hover:bg-slate-50"
        >
          刷新
        </button>
      </header>

      <div className="flex-1 overflow-auto rounded-md border border-slate-100">
        <table className="min-w-full text-xs">
          <thead className="bg-slate-50 text-[11px] text-slate-500">
            <tr>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                队列项
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                作业 ID
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                类型
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                目标
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                状态
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                入队时间
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                开始执行
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-slate-50"
              >
                <td className="px-3 py-2 align-middle text-slate-900">
                  {row.id}
                </td>
                <td className="px-3 py-2 align-middle text-slate-700">
                  {row.jobId}
                </td>
                <td className="px-3 py-2 align-middle text-slate-700">
                  {row.type}
                </td>
                <td className="px-3 py-2 align-middle text-slate-700">
                  {row.target}
                </td>
                <td className="px-3 py-2 align-middle">
                  {renderStateBadge(row.state)}
                </td>
                <td className="px-3 py-2 align-middle text-slate-700">
                  {row.queuedAt}
                </td>
                <td className="px-3 py-2 align-middle text-slate-700">
                  {row.startedAt}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-[11px] text-slate-500"
                >
                  当前没有排队的任务。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default OperationsJobsPage
