/**
 * @fileoverview OperationsAnalytics 页面，作为「运营分析」模块入口。
 * 显示车队健康、版本收敛和运维效率等关键指标的可视化概览。
 */

import type { FC } from 'react'

/**
 * OperationsAnalytics 渲染运营分析总览仪表盘，
 * 使用 KPI 卡片和占位图表区域，后续可接入实际图表库。
 */
export const OperationsAnalytics: FC = () => {
  return (
    <div className="flex h-full flex-col space-y-4">
      {/* 页面头部 */}
      <section className="space-y-1">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] text-slate-500">运营分析</p>
            <h1 className="text-sm font-semibold text-slate-900">
              车队健康 · 版本质量 · 运维效率
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              从车辆可运营率、版本收敛度和运维作业结果等多个维度评估整体运营质量。
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select className="h-7 rounded-md border border-slate-200 bg-white px-2 text-[11px] text-slate-700">
              <option>时间范围：近 24 小时</option>
              <option>近 7 天</option>
              <option>近 30 天</option>
            </select>
            <select className="h-7 rounded-md border border-slate-200 bg-white px-2 text-[11px] text-slate-700">
              <option>场地：全部</option>
              <option>深圳园区</option>
            </select>
          </div>
        </div>

        {/* 顶部 KPI 卡片 */}
        <div className="mt-2 grid gap-2 md:grid-cols-4">
          <KpiCard
            title="可运营车辆"
            value="21 / 24"
            helper="可运营率 87.5%"
          />
          <KpiCard
            title="版本收敛度"
            value="82%"
            helper="使用最新基线 B3 的车辆"
          />
          <KpiCard
            title="发布失败率"
            value="5.6%"
            helper="近 30 天 · 18 次发布"
          />
          <KpiCard
            title="运维作业成功率"
            value="96%"
            helper="近 7 天作业统计"
          />
        </div>
      </section>

      {/* 图表区域 */}
      <section className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2">
        {/* 可运营率时间序列 */}
        <ChartPlaceholder
          title="可运营率随时间变化"
          description="展示近一段时间内可运营车辆占比的变化趋势，用于识别波动与长期风险。"
        />
        {/* 场地维度对比 */}
        <ChartPlaceholder
          title="按场地划分的可运营率"
          description="对比不同园区的可运营率，识别薄弱区域。"
        />
        {/* 版本分布 */}
        <ChartPlaceholder
          title="基线版本分布"
          description="统计各基线覆盖的车辆数量，评估版本收敛程度。"
        />
        {/* 运维作业与告警关系 */}
        <ChartPlaceholder
          title="运维作业与告警数量"
          description="对比告警数量和对应的运维作业数量，衡量响应充分性。"
        />
      </section>
    </div>
  )
}

/**
 * Props for KPI card in analytics page.
 */
interface KpiCardProps {
  /** 指标标题。 */
  title: string
  /** 主要数值。 */
  value: string
  /** 辅助说明文本。 */
  helper?: string
}

/**
 * KpiCard 渲染运营分析页面顶部的关键指标。
 */
const KpiCard: FC<KpiCardProps> = ({ title, value, helper }) => {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-sm">
      <p className="text-[11px] text-slate-500">{title}</p>
      <p className="mt-1 text-lg font-semibold text-slate-900">{value}</p>
      {helper && (
        <p className="mt-0.5 text-[11px] text-slate-500">{helper}</p>
      )}
    </div>
  )
}

/**
 * Props for ChartPlaceholder component.
 */
interface ChartPlaceholderProps {
  /** 图表标题。 */
  title: string
  /** 简要说明文字。 */
  description?: string
}

/**
 * ChartPlaceholder 渲染图表占位卡片，在未接入真实图表前提供结构和说明。
 */
const ChartPlaceholder: FC<ChartPlaceholderProps> = ({
  title,
  description,
}) => {
  return (
    <article className="flex flex-col rounded-lg border border-slate-200 bg-white p-3 text-xs shadow-sm">
      <header className="mb-2 flex items-center justify-between">
        <div>
          <h2 className="text-[13px] font-semibold text-slate-900">
            {title}
          </h2>
          {description && (
            <p className="mt-0.5 text-[11px] text-slate-500">
              {description}
            </p>
          )}
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-600 hover:bg-slate-50 hover:text-slate-800"
        >
          导出
        </button>
      </header>
      <div className="relative mt-1 flex flex-1 items-center justify-center rounded-md border border-dashed border-slate-200 bg-slate-50">
        <span className="text-[11px] text-slate-400">
          这里将展示折线 / 柱状 / 饼图，可接入 Recharts 或 Grafana 面板。
        </span>
      </div>
    </article>
  )
}

export default OperationsAnalytics
