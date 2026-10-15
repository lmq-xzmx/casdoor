/**
 * Admin API Service
 * 管理后台 API 服务
 */
import httpService from './http'

const BASE = '/api/v1/admin'

// Types
export interface Task {
  id: number
  task_id: string
  filename: string
  file_type?: string
  status: string
  result?: string
  created_at: string
  updated_at: string
}

export interface Export {
  id: number
  export_id: string
  title: string
  content?: string
  tags?: string
  kb_id?: string
  weknora_item_id?: string
  status: string
  created_at: string
  updated_at: string
}

export interface Config {
  id: number
  key: string
  value?: string
  description?: string
  created_at: string
  updated_at: string
}

export interface Stats {
  tasks: { total: number; completed: number }
  exports: { total: number; exported: number }
}

// Tasks API
export async function getTasks(params?: { limit?: number; offset?: number; status?: string }): Promise<{ tasks: Task[]; limit: number; offset: number }> {
  const searchParams = new URLSearchParams()
  if (params?.limit) searchParams.set('limit', String(params.limit))
  if (params?.offset) searchParams.set('offset', String(params.offset))
  if (params?.status) searchParams.set('status', params.status)
  const query = searchParams.toString() ? `?${searchParams.toString()}` : ''
  const res = await httpService.request<any>({ method: 'GET', url: `${BASE}/tasks${query}` })
  return res.data
}

export async function getTask(id: number): Promise<Task> {
  const res = await httpService.request<any>({ method: 'GET', url: `${BASE}/tasks/${id}` })
  return res.data
}

export async function createTask(data: { task_id: string; filename: string; file_type?: string; status?: string }): Promise<{ id: number }> {
  const res = await httpService.request<any>({ method: 'POST', url: `${BASE}/tasks`, data })
  return res.data
}

export async function updateTask(id: number, data: { status?: string; result?: string }): Promise<void> {
  await httpService.request({ method: 'PUT', url: `${BASE}/tasks/${id}`, data })
}

export async function deleteTask(id: number): Promise<void> {
  await httpService.request({ method: 'DELETE', url: `${BASE}/tasks/${id}` })
}

// Exports API
export async function getExports(params?: { limit?: number; offset?: number; status?: string }): Promise<{ exports: Export[]; limit: number; offset: number }> {
  const searchParams = new URLSearchParams()
  if (params?.limit) searchParams.set('limit', String(params.limit))
  if (params?.offset) searchParams.set('offset', String(params.offset))
  if (params?.status) searchParams.set('status', params.status)
  const query = searchParams.toString() ? `?${searchParams.toString()}` : ''
  const res = await httpService.request<any>({ method: 'GET', url: `${BASE}/exports${query}` })
  return res.data
}

export async function getExport(id: number): Promise<Export> {
  const res = await httpService.request<any>({ method: 'GET', url: `${BASE}/exports/${id}` })
  return res.data
}

export async function createExport(data: { title: string; content?: string; tags?: string[]; kb_id?: string }): Promise<{ id: number; export_id: string }> {
  const res = await httpService.request<any>({ method: 'POST', url: `${BASE}/exports`, data })
  return res.data
}

export async function updateExport(id: number, data: { title?: string; content?: string; tags?: string[]; status?: string }): Promise<void> {
  await httpService.request({ method: 'PUT', url: `${BASE}/exports/${id}`, data })
}

export async function deleteExport(id: number): Promise<void> {
  await httpService.request({ method: 'DELETE', url: `${BASE}/exports/${id}` })
}

// Configs API
export async function getConfigs(): Promise<{ configs: Config[] }> {
  const res = await httpService.request<any>({ method: 'GET', url: `${BASE}/configs` })
  return res.data
}

export async function getConfig(key: string): Promise<Config> {
  const res = await httpService.request<any>({ method: 'GET', url: `${BASE}/configs/${key}` })
  return res.data
}

export async function createConfig(data: { key: string; value?: string; description?: string }): Promise<void> {
  await httpService.request({ method: 'POST', url: `${BASE}/configs`, data })
}

export async function updateConfig(key: string, data: { value?: string; description?: string }): Promise<void> {
  await httpService.request({ method: 'PUT', url: `${BASE}/configs/${key}`, data })
}

export async function deleteConfig(key: string): Promise<void> {
  await httpService.request({ method: 'DELETE', url: `${BASE}/configs/${key}` })
}

// Stats API
export async function getStats(): Promise<Stats> {
  const res = await httpService.request<any>({ method: 'GET', url: `${BASE}/stats` })
  return res.data
}
