<template>
    <div class="admin-settings">
        <h3 class="admin-title">管理后台</h3>
        <div class="admin-tip">
            <el-icon style="margin-right:6px;color:#67c23a;">
                <Monitor /></el-icon>
            数据管理、增删改查
        </div>

        <!-- 统计卡片 -->
        <div class="stats-cards">
            <div class="stat-card">
                <div class="stat-icon tasks"><el-icon><Document /></el-icon></div>
                <div class="stat-info">
                    <div class="stat-value">{{ stats.tasks?.total || 0 }}</div>
                    <div class="stat-label">总任务数</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon completed"><el-icon><CircleCheck /></el-icon></div>
                <div class="stat-info">
                    <div class="stat-value">{{ stats.tasks?.completed || 0 }}</div>
                    <div class="stat-label">已完成</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon exports"><el-icon><Upload /></el-icon></div>
                <div class="stat-info">
                    <div class="stat-value">{{ stats.exports?.total || 0 }}</div>
                    <div class="stat-label">导出记录</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon exported"><el-icon><SuccessFilled /></el-icon></div>
                <div class="stat-info">
                    <div class="stat-value">{{ stats.exports?.exported || 0 }}</div>
                    <div class="stat-label">已导出</div>
                </div>
            </div>
        </div>

        <!-- Tabs -->
        <el-tabs v-model="activeTab" class="admin-tabs">
            <!-- 任务管理 -->
            <el-tab-pane label="任务管理" name="tasks">
                <div class="tab-header">
                    <el-button type="primary" size="small" @click="showTaskDialog = true">
                        <el-icon><Plus /></el-icon> 添加任务
                    </el-button>
                    <el-button size="small" @click="loadTasks">
                        <el-icon><Refresh /></el-icon> 刷新
                    </el-button>
                </div>
                <el-table :data="tasks" stripe style="width: 100%" v-loading="tasksLoading">
                    <el-table-column prop="id" label="ID" width="60" />
                    <el-table-column prop="task_id" label="任务ID" width="120" show-overflow-tooltip />
                    <el-table-column prop="filename" label="文件名" show-overflow-tooltip />
                    <el-table-column prop="status" label="状态" width="100">
                        <template #default="{ row }">
                            <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="created_at" label="创建时间" width="160" />
                    <el-table-column label="操作" width="120" fixed="right">
                        <template #default="{ row }">
                            <el-button type="primary" link size="small" @click="editTask(row)">编辑</el-button>
                            <el-button type="danger" link size="small" @click="deleteTask(row.id)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>

            <!-- 导出历史 -->
            <el-tab-pane label="导出历史" name="exports">
                <div class="tab-header">
                    <el-button type="primary" size="small" @click="showExportDialog = true">
                        <el-icon><Plus /></el-icon> 添加导出
                    </el-button>
                    <el-button size="small" @click="loadExports">
                        <el-icon><Refresh /></el-icon> 刷新
                    </el-button>
                </div>
                <el-table :data="exports" stripe style="width: 100%" v-loading="exportsLoading">
                    <el-table-column prop="id" label="ID" width="60" />
                    <el-table-column prop="export_id" label="导出ID" width="100" show-overflow-tooltip />
                    <el-table-column prop="title" label="标题" show-overflow-tooltip />
                    <el-table-column prop="status" label="状态" width="100">
                        <template #default="{ row }">
                            <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="created_at" label="创建时间" width="160" />
                    <el-table-column label="操作" width="160" fixed="right">
                        <template #default="{ row }">
                            <el-button type="primary" link size="small" @click="viewExport(row)">查看</el-button>
                            <el-button type="danger" link size="small" @click="deleteExport(row.id)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>

            <!-- 配置管理 -->
            <el-tab-pane label="配置管理" name="configs">
                <div class="tab-header">
                    <el-button type="primary" size="small" @click="showConfigDialog = true">
                        <el-icon><Plus /></el-icon> 添加配置
                    </el-button>
                    <el-button size="small" @click="loadConfigs">
                        <el-icon><Refresh /></el-icon> 刷新
                    </el-button>
                </div>
                <el-table :data="configs" stripe style="width: 100%" v-loading="configsLoading">
                    <el-table-column prop="id" label="ID" width="60" />
                    <el-table-column prop="key" label="配置项" width="200" show-overflow-tooltip />
                    <el-table-column prop="value" label="值" show-overflow-tooltip />
                    <el-table-column prop="description" label="描述" show-overflow-tooltip />
                    <el-table-column label="操作" width="160" fixed="right">
                        <template #default="{ row }">
                            <el-button type="primary" link size="small" @click="editConfig(row)">编辑</el-button>
                            <el-button type="danger" link size="small" @click="deleteConfig(row.key)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>

        <!-- 任务对话框 -->
        <el-dialog v-model="showTaskDialog" :title="editingTask ? '编辑任务' : '添加任务'" width="500px">
            <el-form :model="taskForm" label-width="100px">
                <el-form-item label="任务ID">
                    <el-input v-model="taskForm.task_id" :disabled="!!editingTask" />
                </el-form-item>
                <el-form-item label="文件名">
                    <el-input v-model="taskForm.filename" />
                </el-form-item>
                <el-form-item label="文件类型">
                    <el-select v-model="taskForm.file_type" placeholder="请选择" style="width: 100%">
                        <el-option label="视频" value="video" />
                        <el-option label="音频" value="audio" />
                        <el-option label="文档" value="document" />
                    </el-select>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="taskForm.status" style="width: 100%">
                        <el-option label="待处理" value="pending" />
                        <el-option label="处理中" value="processing" />
                        <el-option label="已完成" value="completed" />
                        <el-option label="失败" value="failed" />
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="showTaskDialog = false">取消</el-button>
                <el-button type="primary" @click="saveTask">保存</el-button>
            </template>
        </el-dialog>

        <!-- 导出对话框 -->
        <el-dialog v-model="showExportDialog" :title="editingExport ? '编辑导出' : '添加导出'" width="500px">
            <el-form :model="exportForm" label-width="100px">
                <el-form-item label="标题">
                    <el-input v-model="exportForm.title" />
                </el-form-item>
                <el-form-item label="内容">
                    <el-input v-model="exportForm.content" type="textarea" :rows="4" />
                </el-form-item>
                <el-form-item label="标签">
                    <el-select v-model="exportForm.tags" multiple placeholder="请选择" style="width: 100%">
                        <el-option label="AI" value="ai" />
                        <el-option label="视频" value="video" />
                        <el-option label="音频" value="audio" />
                        <el-option label="文档" value="document" />
                    </el-select>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="exportForm.status" style="width: 100%">
                        <el-option label="待导出" value="pending" />
                        <el-option label="已导出" value="exported" />
                        <el-option label="失败" value="failed" />
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="showExportDialog = false">取消</el-button>
                <el-button type="primary" @click="saveExport">保存</el-button>
            </template>
        </el-dialog>

        <!-- 配置对话框 -->
        <el-dialog v-model="showConfigDialog" :title="editingConfig ? '编辑配置' : '添加配置'" width="500px">
            <el-form :model="configForm" label-width="100px">
                <el-form-item label="配置项">
                    <el-input v-model="configForm.key" :disabled="!!editingConfig" />
                </el-form-item>
                <el-form-item label="值">
                    <el-input v-model="configForm.value" type="textarea" :rows="3" />
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="configForm.description" type="textarea" :rows="2" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="showConfigDialog = false">取消</el-button>
                <el-button type="primary" @click="saveConfig">保存</el-button>
            </template>
        </el-dialog>

        <!-- 导出详情对话框 -->
        <el-dialog v-model="showExportDetail" title="导出详情" width="600px">
            <div v-if="exportDetail" class="export-detail">
                <el-descriptions :column="2" border>
                    <el-descriptions-item label="ID">{{ exportDetail.id }}</el-descriptions-item>
                    <el-descriptions-item label="导出ID">{{ exportDetail.export_id }}</el-descriptions-item>
                    <el-descriptions-item label="标题">{{ exportDetail.title }}</el-descriptions-item>
                    <el-descriptions-item label="状态">
                        <el-tag :type="getStatusType(exportDetail.status)">{{ exportDetail.status }}</el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="WeKnora ID">{{ exportDetail.weknora_item_id || '-' }}</el-descriptions-item>
                    <el-descriptions-item label="知识库ID">{{ exportDetail.kb_id || '-' }}</el-descriptions-item>
                    <el-descriptions-item label="创建时间">{{ exportDetail.created_at }}</el-descriptions-item>
                    <el-descriptions-item label="更新时间">{{ exportDetail.updated_at }}</el-descriptions-item>
                </el-descriptions>
                <div v-if="exportDetail.content" class="content-preview">
                    <div class="content-label">内容预览：</div>
                    <el-input v-model="exportDetail.content" type="textarea" :rows="8" readonly />
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Monitor, Document, CircleCheck, Upload, SuccessFilled, Plus, Refresh } from '@element-plus/icons-vue'
import * as adminApi from '../../apis/adminService'

// State
const activeTab = ref('tasks')
const stats = ref<any>({})
const tasks = ref<any[]>([])
const exports = ref<any[]>([])
const configs = ref<any[]>([])
const tasksLoading = ref(false)
const exportsLoading = ref(false)
const configsLoading = ref(false)

// Dialogs
const showTaskDialog = ref(false)
const showExportDialog = ref(false)
const showConfigDialog = ref(false)
const showExportDetail = ref(false)
const editingTask = ref<any>(null)
const editingExport = ref<any>(null)
const editingConfig = ref<any>(null)
const exportDetail = ref<any>(null)

// Forms
const taskForm = ref({ task_id: '', filename: '', file_type: '', status: 'pending' })
const exportForm = ref({ title: '', content: '', tags: [] as string[], status: 'pending' })
const configForm = ref({ key: '', value: '', description: '' })

// Methods
async function loadStats() {
    try {
        stats.value = await adminApi.getStats()
    } catch (e) {
        console.error('Failed to load stats:', e)
    }
}

async function loadTasks() {
    tasksLoading.value = true
    try {
        const res = await adminApi.getTasks({ limit: 100 })
        tasks.value = res.tasks || []
    } catch (e) {
        console.error('Failed to load tasks:', e)
    } finally {
        tasksLoading.value = false
    }
}

async function loadExports() {
    exportsLoading.value = true
    try {
        const res = await adminApi.getExports({ limit: 100 })
        exports.value = res.exports || []
    } catch (e) {
        console.error('Failed to load exports:', e)
    } finally {
        exportsLoading.value = false
    }
}

async function loadConfigs() {
    configsLoading.value = true
    try {
        const res = await adminApi.getConfigs()
        configs.value = res.configs || []
    } catch (e) {
        console.error('Failed to load configs:', e)
    } finally {
        configsLoading.value = false
    }
}

function editTask(row: any) {
    editingTask.value = row
    taskForm.value = { ...row }
    showTaskDialog.value = true
}

async function saveTask() {
    try {
        if (editingTask.value) {
            await adminApi.updateTask(editingTask.value.id, taskForm.value)
            ElMessage.success('更新成功')
        } else {
            await adminApi.createTask(taskForm.value)
            ElMessage.success('创建成功')
        }
        showTaskDialog.value = false
        editingTask.value = null
        taskForm.value = { task_id: '', filename: '', file_type: '', status: 'pending' }
        loadTasks()
        loadStats()
    } catch (e) {
        console.error('Failed to save task:', e)
    }
}

async function deleteTask(id: number) {
    try {
        await ElMessageBox.confirm('确定要删除这个任务吗？', '提示', { type: 'warning' })
        await adminApi.deleteTask(id)
        ElMessage.success('删除成功')
        loadTasks()
        loadStats()
    } catch (e: any) {
        if (e !== 'cancel') console.error('Failed to delete task:', e)
    }
}

function editExport(row: any) {
    editingExport.value = row
    let tags = []
    try { tags = row.tags ? JSON.parse(row.tags) : [] } catch {}
    exportForm.value = { title: row.title, content: row.content || '', tags, status: row.status }
    showExportDialog.value = true
}

async function saveExport() {
    try {
        if (editingExport.value) {
            await adminApi.updateExport(editingExport.value.id, exportForm.value)
            ElMessage.success('更新成功')
        } else {
            await adminApi.createExport(exportForm.value)
            ElMessage.success('创建成功')
        }
        showExportDialog.value = false
        editingExport.value = null
        exportForm.value = { title: '', content: '', tags: [], status: 'pending' }
        loadExports()
        loadStats()
    } catch (e) {
        console.error('Failed to save export:', e)
    }
}

async function deleteExport(id: number) {
    try {
        await ElMessageBox.confirm('确定要删除这个导出记录吗？', '提示', { type: 'warning' })
        await adminApi.deleteExport(id)
        ElMessage.success('删除成功')
        loadExports()
        loadStats()
    } catch (e: any) {
        if (e !== 'cancel') console.error('Failed to delete export:', e)
    }
}

async function viewExport(row: any) {
    try {
        exportDetail.value = await adminApi.getExport(row.id)
        showExportDetail.value = true
    } catch (e) {
        console.error('Failed to load export detail:', e)
    }
}

function editConfig(row: any) {
    editingConfig.value = row
    configForm.value = { key: row.key, value: row.value || '', description: row.description || '' }
    showConfigDialog.value = true
}

async function saveConfig() {
    try {
        if (editingConfig.value) {
            await adminApi.updateConfig(editingConfig.value.key, configForm.value)
            ElMessage.success('更新成功')
        } else {
            await adminApi.createConfig(configForm.value)
            ElMessage.success('创建成功')
        }
        showConfigDialog.value = false
        editingConfig.value = null
        configForm.value = { key: '', value: '', description: '' }
        loadConfigs()
    } catch (e) {
        console.error('Failed to save config:', e)
    }
}

async function deleteConfig(key: string) {
    try {
        await ElMessageBox.confirm('确定要删除这个配置项吗？', '提示', { type: 'warning' })
        await adminApi.deleteConfig(key)
        ElMessage.success('删除成功')
        loadConfigs()
    } catch (e: any) {
        if (e !== 'cancel') console.error('Failed to delete config:', e)
    }
}

function getStatusType(status: string) {
    const map: Record<string, string> = {
        pending: 'info',
        processing: 'warning',
        completed: 'success',
        exported: 'success',
        failed: 'danger'
    }
    return map[status] || 'info'
}

// Lifecycle
onMounted(() => {
    loadStats()
    loadTasks()
})
</script>

<style scoped>
.admin-settings {
    padding: 0;
}

.admin-title {
    margin: 0 0 8px 0;
    font-size: 18px;
    font-weight: 600;
}

.admin-tip {
    color: #909399;
    font-size: 13px;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
}

.stats-cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin-bottom: 20px;
}

.stat-card {
    background: #f5f7fa;
    border-radius: 8px;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
}

.stat-icon {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: #fff;
}

.stat-icon.tasks { background: #409eff; }
.stat-icon.completed { background: #67c23a; }
.stat-icon.exports { background: #e6a23c; }
.stat-icon.exported { background: #909399; }

.stat-value {
    font-size: 24px;
    font-weight: 600;
    color: #303133;
}

.stat-label {
    font-size: 12px;
    color: #909399;
}

.admin-tabs {
    margin-top: 16px;
}

.tab-header {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
}

.export-detail {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.content-preview {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.content-label {
    font-size: 13px;
    color: #606266;
}
</style>
