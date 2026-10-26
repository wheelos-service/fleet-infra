/**
 * @fileoverview Workbench page component serving as the home dashboard
 * for the management console. It surfaces approvals, releases, vehicle issues,
 * and other key tasks so users know what to handle within 3 seconds.
 */

import type { FC } from 'react'

/**
 * Single approval task item shown in the "待我审批" section.
 */
interface ApprovalItem {
  /** Unique id of the item. */
  id: string
  /** Priority level label. */
  priority: '高' | '中' | '低'
  /** Priority color dot CSS class. */
  priorityColorClass: string
  /** Title summarizing the approval item. */
  title: string
  /** Extra context, such as baseline or group. */
  context: string
  /** Submitter name. */
  submitter: string
  /** Relative submitted time label. */
  submittedAgo: string
}

/**
 * Single ongoing release item.
 */
interface OngoingRelease {
  /** Unique id of the release. */
  id: string
  /** Baseline identifier for the release. */
  baseline: string
  /** Release scope, such as full fleet or specific group. */
  scope: string
  /** Percentage of completion for the release. */
  progressPercent: number
  /** Current batch status text. */
  batchStatus: string
  /** Count of successful targets. */
  successCount: number
  /** Count of failed targets. */
  failureCount: number
  /** Count of pending targets. */
  pendingCount: number
}

/**
 * Single vehicle attention item.
 */
interface VehicleAttentionItem {
  /** Unique id of the item. */
  id: string
  /** Vehicle identifier. */
  vehicleId: string
  /** Short summary of the issue or attention point. */
  summary: string
  /** Label for the primary action button. */
  actionLabelPrimary: string
  /** Optional label for the secondary action button. */
  actionLabelSecondary?: string
}

/**
 * Workbench renders the home dashboard with greeting, summary cards,
 * and role-based sections like approvals, ongoing releases, and vehicle issues.
 */
export const Workbench: FC = () => {
  const approvalItems: ApprovalItem[] = [
    {
      id: 'R-042',
      priority: '高',
      priorityColorClass: 'bg-red-500',
      title: '发布 R-042  基线 B3 → 试运行组（8辆）',
      context: '李四提交',
      submitter: '李四',
      submittedAgo: '2 小时前',
    },
    {
      id: 'P-planning-p9',
      priority: '中',
      priorityColorClass: 'bg-amber-400',
      title: '参数 planning-p9 加入基线 B4',
      context: '王五提交',
      submitter: '王五',
      submittedAgo: '5 小时前',
    },
  ]

  const ongoingReleases: OngoingRelease[] = [
    {
      id: 'R-041',
      baseline: 'B3',
      scope: '全量',
      progressPercent: 65,
      batchStatus: '批次 2 / 3',
      successCount: 18,
      failureCount: 0,
      pendingCount: 6,
    },
  ]

  const vehicleAttention: VehicleAttentionItem[] = [
    {
      id: 'AV-007',
      vehicleId: 'AV-007',
      summary: '目标 B3 / 实际 B2，版本漂移 3 天',
      actionLabelPrimary: '查看',
      actionLabelSecondary: '重新下发',
    },
    {
      id: 'AV-012',
      vehicleId: 'AV-012',
      summary: '标定已失效（更换前向激光雷达）',
      actionLabelPrimary: '查看标定',
    },
  ]

  const hasApprovals = approvalItems.length > 0
  const hasOngoingReleases = ongoingReleases.length > 0
  const hasVehicleAttention = vehicleAttention.length > 0

  return (
    <div className="space-y-5">
      {/* Greeting + primary actions */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            早上好，张工
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            一览今天需要你处理的审批、发布和车辆状态。
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md bg-sky-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-sky-700"
          >
            + 新建发布
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            + 新建作业
          </button>
        </div>
      </div>

      {/* Summary cards row */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="待我审批"
          value={approvalItems.length}
          emphasis
        />
        <SummaryCard
          title="进行中发布"
          value={ongoingReleases.length}
        />
        <SummaryCard
          title="版本漂移车辆"
          value={4}
        />
        <SummaryCard
          title="失败作业（24h）"
          value={1}
        />
      </div>

      {/* Approvals section */}
      <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <header className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-semibold text-slate-900">
              待我审批
            </h2>
            {hasApprovals && (
              <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600">
                {approvalItems.length} 条
              </span>
            )}
          </div>
          <button
            type="button"
            className="text-[11px] text-sky-600 hover:text-sky-700"
          >
            查看全部 →
          </button>
        </header>
        <div className="divide-y divide-slate-100">
          {hasApprovals ? (
            approvalItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between px-4 py-2.5 text-xs"
              >
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <span
                    className={`inline-flex h-2 w-2 flex-shrink-0 rounded-full ${item.priorityColorClass}`}
                    aria-hidden="true"
                  />
                  <span className="flex-shrink-0 text-[11px] text-slate-600">
                    {item.priority}
                  </span>
                  <div className="min-w-0 space-y-0.5">
                    <p className="truncate text-xs text-slate-900">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {item.context} · {item.submittedAgo}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="ml-3 inline-flex items-center justify-center rounded-md bg-sky-50 px-2 py-1 text-[11px] font-medium text-sky-700 hover:bg-sky-100"
                >
                  审批
                </button>
              </div>
            ))
          ) : (
            <EmptyStateRow message="当前没有待你审批的内容，一切正常。" />
          )}
        </div>
      </section>

      {/* Ongoing releases section */}
      <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <header className="border-b border-slate-100 px-4 py-2.5">
          <h2 className="text-xs font-semibold text-slate-900">
            进行中发布
          </h2>
        </header>
        <div className="divide-y divide-slate-100">
          {hasOngoingReleases ? (
            ongoingReleases.map((rel) => (
              <div
                key={rel.id}
                className="px-4 py-2.5 text-xs text-slate-800"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-slate-900">
                    发布 {rel.id}
                  </span>
                  <span className="text-[11px] text-slate-600">
                    基线 {rel.baseline} → {rel.scope}
                  </span>
                  <span className="rounded-full bg-sky-50 px-1.5 py-0.5 text-[10px] text-sky-700">
                    {rel.batchStatus}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-sky-500"
                      style={{ width: `${rel.progressPercent}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-slate-500">
                    {rel.progressPercent}%
                  </span>
                </div>
                <div className="mt-1.5 flex flex-wrap gap-3 text-[11px] text-slate-600">
                  <span>成功 {rel.successCount}</span>
                  <span>失败 {rel.failureCount}</span>
                  <span>等待 {rel.pendingCount}</span>
                </div>
              </div>
            ))
          ) : (
            <EmptyStateRow message="当前没有进行中的发布，一切正常。" />
          )}
        </div>
      </section>

      {/* Vehicle attention section */}
      <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <header className="border-b border-slate-100 px-4 py-2.5">
          <h2 className="text-xs font-semibold text-slate-900">
            需要关注的车辆
          </h2>
        </header>
        <div className="divide-y divide-slate-100">
          {hasVehicleAttention ? (
            vehicleAttention.map((item) => (
              <div
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 text-xs"
              >
                <div className="flex min-w-0 flex-col">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-800">
                      {item.vehicleId}
                    </span>
                    <span className="text-xs text-slate-900">
                      {item.summary}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {item.actionLabelSecondary && (
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 hover:bg-slate-50"
                    >
                      {item.actionLabelSecondary}
                    </button>
                  )}
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-md bg-sky-50 px-2 py-1 text-[11px] font-medium text-sky-700 hover:bg-sky-100"
                  >
                    {item.actionLabelPrimary}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <EmptyStateRow message="当前没有需要特别关注的车辆，一切正常。" />
          )}
        </div>
      </section>
    </div>
  )
}

/**
 * Props for the SummaryCard component.
 */
interface SummaryCardProps {
  /** Title label of the summary card. */
  title: string
  /** Numeric value to display. */
  value: number
  /** Whether to visually emphasize the card as primary. */
  emphasis?: boolean
}

/**
 * SummaryCard renders a clickable statistic card in the workbench header row.
 */
const SummaryCard: FC<SummaryCardProps> = ({ title, value, emphasis }) => {
  return (
    <button
      type="button"
      className={`flex flex-col items-start rounded-lg border border-slate-200 bg-white px-3 py-2 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-md ${
        emphasis ? 'ring-1 ring-sky-100' : ''
      }`}
    >
      <span className="text-[11px] text-slate-500">{title}</span>
      <span className="mt-1 text-xl font-semibold leading-none text-slate-900">
        {value}
      </span>
      <span className="mt-1 text-[11px] text-sky-600">
        查看对应列表 →
      </span>
    </button>
  )
}

/**
 * Props for the EmptyStateRow component.
 */
interface EmptyStateRowProps {
  /** Message shown when there is no data. */
  message: string
}

/**
 * EmptyStateRow renders a gentle "all good" message when a section has no items.
 */
const EmptyStateRow: FC<EmptyStateRowProps> = ({ message }) => {
  return (
    <div className="px-4 py-6 text-center text-[11px] text-slate-500">
      {message}
    </div>
  )
}

/**
 * Default export for compatibility with default imports.
 */
export default Workbench
