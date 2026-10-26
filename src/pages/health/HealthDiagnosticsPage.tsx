/**
 * @fileoverview Health diagnostics page.
 * It focuses on sensor state, localization and perception diagnostics,
 * process health, system resources and logging coverage.
 */

import type { FC } from 'react'
import OperationsAnalytics from '../analytics/OperationsAnalytics'

/**
 * HealthDiagnosticsPage wraps the existing operations analytics views
 * and positions them as a dedicated "健康诊断" module for the fleet.
 */
const HealthDiagnosticsPage: FC = () => {
  return (
    <div className="space-y-3">
      <section>
        <h2 className="text-sm font-semibold text-slate-900">
          健康诊断
        </h2>
        <p className="mt-1 text-[11px] text-slate-500">
          传感器状态、定位与感知诊断、进程状态、CPU/GPU、存储、网络、时钟和日志采集一站式总览。
        </p>
      </section>

      {/* Reuse the existing analytics component for concrete charts and details */}
      <section className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
        <OperationsAnalytics />
      </section>
    </div>
  )
}

export default HealthDiagnosticsPage
