/**
 * @fileoverview SystemSettingsPage 页面，作为「系统管理」模块入口。
 * 左侧提供设置分类导航，右侧展示用户、角色、审批策略等配置视图。
 */

import type { FC, ReactNode } from 'react'
import { useState } from 'react'

/**
 * 支持的系统设置子模块 key。
 */
type SettingsSectionKey =
  | 'users'
  | 'roles'
  | 'approvals'
  | 'audit'
  | 'integrations'
  | 'environments'

/**
 * 单个设置导航项的定义。
 */
interface SettingsNavItem {
  /** 唯一 key。 */
  key: SettingsSectionKey
  /** 展示名称。 */
  label: string
  /** 简短说明。 */
  description: string
}

/**
 * SystemSettingsPage 渲染系统管理模块的整体布局，
 * 使用左右结构呈现设置分类导航和具体配置内容。
 */
export const SystemSettingsPage: FC = () => {
  const [activeSection, setActiveSection] =
    useState<SettingsSectionKey>('users')

  const navItems: SettingsNavItem[] = [
    {
      key: 'users',
      label: '用户与账号',
      description: '管理登录账号、基本信息和启用状态。',
    },
    {
      key: 'roles',
      label: '角色与权限',
      description: '配置 RBAC 角色和模块级操作权限。',
    },
    {
      key: 'approvals',
      label: '审批策略',
      description: '为发布与高风险作业配置多级审批规则。',
    },
    {
      key: 'audit',
      label: '审计日志',
      description: '追踪敏感操作的历史记录，满足合规要求。',
    },
    {
      key: 'integrations',
      label: '系统集成',
      description: '对接 CI/CD、监控、通知、单点登录等外部系统。',
    },
    {
      key: 'environments',
      label: '环境与园区',
      description: '管理生产 / 测试环境及各园区的基础配置。',
    },
  ]

  /**
   * 根据当前选择的子模块渲染右侧内容区。
   */
  const renderSection = (): ReactNode => {
    switch (activeSection) {
      case 'users':
        return <UsersSection />
      case 'roles':
        return <RolesSection />
      case 'approvals':
        return <ApprovalsSection />
      case 'audit':
        return <AuditSection />
      case 'integrations':
        return <IntegrationsSection />
      case 'environments':
        return <EnvironmentsSection />
      default:
        return null
    }
  }

  return (
    <div className="flex h-full flex-col space-y-4">
      {/* 页面头部 */}
      <section>
        <p className="text-[11px] text-slate-500">系统管理</p>
        <h1 className="text-sm font-semibold text-slate-900">
          用户 · 权限 · 审批 · 审计
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          配置平台的访问控制、审批策略和环境信息，确保变更安全可追溯。
        </p>
      </section>

      {/* 主体：左导航 + 右内容 */}
      <section className="flex min-h-[360px] flex-1 gap-4">
        {/* 左侧导航 */}
        <aside className="w-60 flex-shrink-0 rounded-lg border border-slate-200 bg-white p-3 text-xs shadow-sm">
          <h2 className="mb-2 text-[11px] font-semibold text-slate-900">
            设置分类
          </h2>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = item.key === activeSection
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActiveSection(item.key)}
                  className={`flex w-full flex-col items-start rounded-md px-2 py-1.5 text-left transition ${
                    isActive
                      ? 'bg-slate-100 text-slate-900'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span className="text-[11px] font-medium">
                    {item.label}
                  </span>
                  <span className="mt-0.5 text-[10px] text-slate-500">
                    {item.description}
                  </span>
                </button>
              )
            })}
          </nav>
        </aside>

        {/* 右侧内容 */}
        <section className="flex min-w-0 flex-1 flex-col rounded-lg border border-slate-200 bg-white p-3 text-xs shadow-sm">
          {renderSection()}
        </section>
      </section>
    </div>
  )
}

/**
 * UsersSection 展示用户与账号管理视图。
 */
const UsersSection: FC = () => {
  const rows = [
    {
      name: '张三',
      account: 'zhangsan',
      role: '版本管理员',
      dept: '自动驾驶版本组',
      status: '启用',
      lastLogin: '2026-10-25 21:20',
    },
    {
      name: '李四',
      account: 'lisi',
      role: '运维工程师',
      dept: '车队运维组',
      status: '启用',
      lastLogin: '2026-10-25 20:05',
    },
    {
      name: '王五',
      account: 'wangwu',
      role: '系统管理员',
      dept: '平台基础组',
      status: '停用',
      lastLogin: '2026-10-10 09:12',
    },
  ] as const

  return (
    <div className="flex h-full flex-col">
      <header className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-[13px] font-semibold text-slate-900">
            用户与账号
          </h2>
          <p className="mt-0.5 text-[11px] text-slate-500">
            管理登录账号、所属角色和启用状态，建议与公司统一身份系统对接。
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 hover:bg-slate-50"
        >
          + 邀请用户
        </button>
      </header>

      <div className="flex-1 overflow-auto rounded-md border border-slate-100">
        <table className="min-w-full text-xs">
          <thead className="bg-slate-50 text-[11px] text-slate-500">
            <tr>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                姓名
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                账号
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                角色
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                部门
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                状态
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                最近登录
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr
                key={row.account}
                className="hover:bg-slate-50"
              >
                <td className="px-3 py-2 align-middle text-slate-900">
                  {row.name}
                </td>
                <td className="px-3 py-2 align-middle text-slate-700">
                  {row.account}
                </td>
                <td className="px-3 py-2 align-middle text-slate-700">
                  {row.role}
                </td>
                <td className="px-3 py-2 align-middle text-slate-700">
                  {row.dept}
                </td>
                <td className="px-3 py-2 align-middle">
                  <span
                    className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] ${
                      row.status === '启用'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-50 text-slate-500'
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="px-3 py-2 align-middle text-slate-700">
                  {row.lastLogin}
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
 * RolesSection 展示角色与权限设置视图。
 */
const RolesSection: FC = () => {
  const rows = [
    {
      name: '版本管理员',
      description: '管理制品、基线和发布，可发起生产环境发布。',
      modules: '版本与发布',
      members: 4,
    },
    {
      name: '运维工程师',
      description: '可对授权车队发起运维作业，查看作业结果。',
      modules: '运维作业 · 车辆与设备',
      members: 6,
    },
    {
      name: '系统管理员',
      description: '管理用户、角色、审批策略和系统集成。',
      modules: '系统管理',
      members: 2,
    },
  ] as const

  return (
    <div className="flex h-full flex-col">
      <header className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-[13px] font-semibold text-slate-900">
            角色与权限
          </h2>
          <p className="mt-0.5 text-[11px] text-slate-500">
            通过角色集中配置模块与操作级权限，后续在用户页面将账号绑定到角色。
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 hover:bg-slate-50"
        >
          + 新建角色
        </button>
      </header>

      <div className="flex-1 overflow-auto rounded-md border border-slate-100">
        <table className="min-w-full text-xs">
          <thead className="bg-slate-50 text-[11px] text-slate-500">
            <tr>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                角色
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                描述
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                涉及模块
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                成员数
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
                  {row.description}
                </td>
                <td className="px-3 py-2 align-middle text-slate-700">
                  {row.modules}
                </td>
                <td className="px-3 py-2 align-middle text-slate-700">
                  {row.members}
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
 * ApprovalsSection 展示审批策略配置视图。
 */
const ApprovalsSection: FC = () => {
  const rows = [
    {
      name: '生产环境高风险发布',
      scope: '环境=生产 · 风险等级=高 · 含安全参数',
      approvers: '≥2 个版本管理员 + 1 个系统管理员',
    },
    {
      name: '生产环境运维作业',
      scope: '环境=生产 · 作业风险=高',
      approvers: '≥1 个运维工程师 + 1 个系统管理员',
    },
    {
      name: '测试环境发布',
      scope: '环境=测试',
      approvers: '发起人所在小组任意 1 人确认',
    },
  ] as const

  return (
    <div className="flex h-full flex-col">
      <header className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-[13px] font-semibold text-slate-900">
            审批策略
          </h2>
          <p className="mt-0.5 text-[11px] text-slate-500">
            按条件为发布和运维作业配置审批规则，如「IF 风险高 AND 生产环境 THEN 需要 3 人审批」。
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 hover:bg-slate-50"
        >
          + 新建审批规则
        </button>
      </header>

      <div className="flex-1 overflow-auto rounded-md border border-slate-100">
        <table className="min-w-full text-xs">
          <thead className="bg-slate-50 text-[11px] text-slate-500">
            <tr>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                规则名称
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                条件（IF）
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                审批要求（THEN）
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
                  {row.scope}
                </td>
                <td className="px-3 py-2 align-middle text-slate-700">
                  {row.approvers}
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
 * AuditSection 展示审计日志视图。
 */
const AuditSection: FC = () => {
  const rows = [
    {
      time: '2026-10-25 21:30',
      user: '张三',
      action: '创建发布 R-041',
      detail: '基线 B3-2026.10 → 深圳园区 全量',
    },
    {
      time: '2026-10-25 20:05',
      user: '王五',
      action: '修改审批策略「生产环境高风险发布」',
      detail: '增加 1 名系统管理员审批人',
    },
    {
      time: '2026-10-24 18:40',
      user: '李四',
      action: '对 AV-007 发起「重启关键模块」运维作业',
      detail: '作业 ID JOB-202610-031',
    },
  ] as const

  return (
    <div className="flex h-full flex-col">
      <header className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-[13px] font-semibold text-slate-900">
            审计日志
          </h2>
          <p className="mt-0.5 text-[11px] text-slate-500">
            记录涉及权限、审批、版本与运维等敏感操作的历史，支持按用户与时间过滤。
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          <input
            type="text"
            placeholder="搜索用户 / 操作"
            className="h-7 w-40 rounded-md border border-slate-200 bg-slate-50 px-2 text-[11px] text-slate-900 placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-200"
          />
          <select className="h-7 rounded-md border border-slate-200 bg-white px-2 text-[11px] text-slate-700">
            <option>近 7 天</option>
            <option>近 30 天</option>
            <option>全部</option>
          </select>
        </div>
      </header>

      <div className="flex-1 overflow-auto rounded-md border border-slate-100">
        <table className="min-w-full text-xs">
          <thead className="bg-slate-50 text-[11px] text-slate-500">
            <tr>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                时间
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                用户
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                操作
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                详情
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row, index) => (
              <tr
                key={`${row.time}-${index.toString()}`}
                className="hover:bg-slate-50"
              >
                <td className="px-3 py-2 align-middle text-slate-700">
                  {row.time}
                </td>
                <td className="px-3 py-2 align-middle text-slate-900">
                  {row.user}
                </td>
                <td className="px-3 py-2 align-middle text-slate-700">
                  {row.action}
                </td>
                <td className="px-3 py-2 align-middle text-slate-700">
                  {row.detail}
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
 * IntegrationsSection 展示系统集成配置视图。
 */
const IntegrationsSection: FC = () => {
  const items = [
    {
      name: 'CI/CD 流水线',
      provider: 'GitHub Actions',
      status: '已连接',
      description: '接收构建产物与测试结果，自动生成制品与基线候选。',
    },
    {
      name: '监控与日志',
      provider: 'Datadog',
      status: '已连接',
      description: '跳转查看车辆运行指标和错误日志，辅助问题定位。',
    },
    {
      name: '消息与通知',
      provider: '企业微信',
      status: '已连接',
      description: '将发布与运维作业结果推送到相关群组。',
    },
    {
      name: '单点登录',
      provider: '企业 IdP',
      status: '未连接',
      description: '统一管理员工身份与登录权限，建议尽快接入。',
    },
  ] as const

  /**
   * 渲染集成状态徽标。
   */
  const renderStatusBadge = (status: string) => {
    const baseClass =
      'inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px]'
    if (status === '已连接') {
      return (
        <span className={`${baseClass} bg-emerald-50 text-emerald-700`}>
          已连接
        </span>
      )
    }
    return (
      <span className={`${baseClass} bg-slate-50 text-slate-500`}>
        未连接
      </span>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <header className="mb-2">
        <h2 className="text-[13px] font-semibold text-slate-900">
          系统集成
        </h2>
        <p className="mt-0.5 text-[11px] text-slate-500">
          统一配置与外部系统的集成，例如 CI/CD、监控、消息通知和身份认证。
        </p>
      </header>

      <div className="grid gap-3 md:grid-cols-2">
        {items.map((item) => (
          <article
            key={item.name}
            className="flex flex-col justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-sm"
          >
            <div className="mb-1 flex items-start justify-between gap-2">
              <div>
                <h3 className="text-[13px] font-semibold text-slate-900">
                  {item.name}
                </h3>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  提供方：{item.provider}
                </p>
              </div>
              {renderStatusBadge(item.status)}
            </div>
            <p className="flex-1 text-[11px] text-slate-600">
              {item.description}
            </p>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                className="inline-flex flex-1 items-center justify-center rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 hover:bg-slate-50"
              >
                {item.status === '已连接' ? '查看配置' : '去配置'}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

/**
 * EnvironmentsSection 展示环境与园区配置视图。
 */
const EnvironmentsSection: FC = () => {
  const rows = [
    {
      env: '生产',
      sites: '深圳园区',
      defaultBaseline: 'B3-2026.10',
      freezeWindow: '工作日 19:00-22:00',
    },
    {
      env: '测试',
      sites: '测试园区',
      defaultBaseline: 'B2-2026.08',
      freezeWindow: '无限制',
    },
  ] as const

  return (
    <div className="flex h-full flex-col">
      <header className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-[13px] font-semibold text-slate-900">
            环境与园区
          </h2>
          <p className="mt-0.5 text-[11px] text-slate-500">
            管理生产 / 测试环境及园区级别的默认基线、发布窗口等约束。
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 hover:bg-slate-50"
        >
          编辑发布窗口
        </button>
      </header>

      <div className="flex-1 overflow-auto rounded-md border border-slate-100">
        <table className="min-w-full text-xs">
          <thead className="bg-slate-50 text-[11px] text-slate-500">
            <tr>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                环境
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                园区 / 场地
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                默认基线
              </th>
              <th className="border-b border-slate-100 px-3 py-2 text-left">
                发布窗口
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr
                key={row.env}
                className="hover:bg-slate-50"
              >
                <td className="px-3 py-2 align-middle text-slate-900">
                  {row.env}
                </td>
                <td className="px-3 py-2 align-middle text-slate-700">
                  {row.sites}
                </td>
                <td className="px-3 py-2 align-middle text-slate-700">
                  {row.defaultBaseline}
                </td>
                <td className="px-3 py-2 align-middle text-slate-700">
                  {row.freezeWindow}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default SystemSettingsPage
