<template>
    <el-main class="homeBodyContainer" v-loading.lock="loading" v-loading.fullscreen.lock="fullLoading">
        <el-container class="schedule__container">
            <el-header class="schedule__header">
                <span class="schedule__headerButton">
                    <el-tooltip
                        effect="dark"
                        :content="$t('scheduleList.addSchedule')"
                        placement="top-start"
                    >
                        <el-button type="primary" icon="Plus" size="large" circle @click="clickAdd"/>
                    </el-tooltip>
                </span>
                <span class="schedule__headerButton">
                    <el-tooltip
                        :disabled="!currentModel.id"
                        effect="dark"
                        :content="$t('scheduleList.toggleSchedule')"
                        placement="top-start"
                    >
                        <el-switch :disabled="!currentModel.id" v-model="currentModel.status" size="large" @change="toggleStatus"/>
                    </el-tooltip>
                </span>
                <span class="schedule__headerButton">
                    <el-tooltip
                        :disabled="!currentModel.id"
                        effect="dark"
                        :content="$t('scheduleList.editSchedule')"
                        placement="top-start"
                    >
                        <el-button :disabled="!currentModel.id" type="warning" icon="Edit" size="large" circle @click="clickEdit"/>
                    </el-tooltip>
                </span>
                <span class="schedule__headerButton">
                    <el-tooltip
                        :disabled="!currentModel.id"
                        effect="dark"
                        :content="$t('scheduleList.triggerSchedule')"
                        placement="top-start"
                    >
                        <el-button :disabled="!currentModel.id" type="success" icon="CaretRight" size="large" circle @click="warningTrigger"/>
                    </el-tooltip>
                </span>
                <span class="schedule__headerButton">
                    <el-tooltip
                        :disabled="!currentModel.id"
                        effect="dark"
                        :content="$t('scheduleList.deleteSchedule')"
                        placement="top-start"
                    >
                        <el-button :disabled="!currentModel.id" type="danger" icon="Delete" size="large" circle @click="warningDelete"/>
                    </el-tooltip>
                </span>
            </el-header>
            <el-main style="height: calc(100% - 60px);">
                <el-table
                :border="true"
                row-key="id"
                :data="jobModel"
                style="width: 100%;" 
                :show-overflow-tooltip="true"
                :highlight-current-row="true"
                @current-change="rowClick"
                height="100%">
                    <el-table-column column-key="id" prop="id" :label="$t('scheduleList.id')" width="50" :align="'center'" />
                    <el-table-column column-key="name" prop="name" :label="$t('scheduleList.name')" min-width="150"/>
                    <el-table-column :label="$t('scheduleList.cron')" min-width="120" >
                        <template #default="scope">
                            <el-text>{{scope.row.cron}}</el-text>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('scheduleList.classPath')" min-width="300" >
                        <template #default="scope">
                            <el-text>{{scope.row.classPath}}</el-text>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('scheduleList.info')" min-width="200" >
                        <template #default="scope">
                            <el-text>{{scope.row.info}}</el-text>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('scheduleList.param')" min-width="100" >
                        <template #default="scope">
                            <el-text>{{scope.row.param}}</el-text>
                        </template>
                    </el-table-column>
                </el-table>
            </el-main>
        </el-container>
        <!--編輯彈窗-->
        <el-dialog v-model="editDialog" :title="$t(isAdd ? 'scheduleList.addSchedule' : 'scheduleList.editSchedule')" width="1000">
            <el-table :border="true" :data="[editModel]" style="width: 100%">
                <el-table-column v-if="!isAdd" column-key="id" prop="id" :label="$t('scheduleList.id')" width="50" :align="'center'" />
                <el-table-column v-if="!isAdd" column-key="name" prop="name" :label="$t('scheduleList.name')" min-width="150" ref="inputNameRef"/>
                <el-table-column v-else :label="$t('scheduleList.name')" min-width="150" >
                    <template #default="scope">
                        <el-input v-model="scope.row.name" ref="inputNameRef"/>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('scheduleList.cron')" min-width="120">
                    <template #default="scope">
                        <el-input v-model="scope.row.cron" ref="inputCronRef"/>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('scheduleList.classPath')" min-width="300" >
                    <template #default="scope">
                        <el-input v-model="scope.row.classPath" ref="inputClassPathRef"/>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('scheduleList.info')" min-width="200" >
                    <template #default="scope">
                        <el-input v-model="scope.row.info"/>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('scheduleList.param')" min-width="100" >
                    <template #default="scope">
                        <el-input v-model="scope.row.param"/>
                    </template>
                </el-table-column>
                <el-table-column v-if="isAdd" :label="$t('scheduleList.status')" width="80" >
                    <template #default="scope">
                        <el-switch v-model="scope.row.status"/>
                    </template>
                </el-table-column>
            </el-table>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="editDialog = false">{{ $t('scheduleList.cancel') }}</el-button>
                    <el-button type="primary" @click="isAdd ? saveSchedule() : editSchedule()">{{ $t('scheduleList.save') }}</el-button>
                </div>
            </template>
        </el-dialog>
    </el-main>
</template>

<script setup>
import request from '@/config/api/request.js';
import { ref, onMounted, reactive, getCurrentInstance } from 'vue'
import { useI18n } from 'vue-i18n';
import { ElMessageBox } from 'element-plus'

const { t } = useI18n();
const { proxy } = getCurrentInstance();
const loading = ref(false);
const fullLoading = ref(false);
const isAdd = ref(true);
const editDialog = ref(false);
const jobModel = ref([]);
const inputNameRef = ref(null);
const inputCronRef = ref(null);
const inputClassPathRef = ref(null);
const editModel = reactive({
    id: null,
    name: null,
    cron: null,
    classPath: null,
    info: null,
    param: null,
    status: null
});
const currentModel = reactive({
    id: null,
    name: null,
    cron: null,
    classPath: null,
    info: null,
    param: null,
    status: null
});
onMounted(async () => {
    loading.value = true;
    await requestJob();
    loading.value = false;
});
async function requestJob(){
    const response = await request.scheduleList();
    if (response && response.data.code === 200) {
        const responseData = response.data.data;
        jobModel.value = responseData;
    }
}
function rowClick(row){
    if(row){
        currentModel.id = row.id;
        currentModel.name = row.name;
        currentModel.cron = row.cron;
        currentModel.classPath = row.classPath;
        currentModel.info = row.info;
        currentModel.param = row.param;
        currentModel.status = row.status;
    }
}
async function saveSchedule(){
    if(checkAdd()){
        fullLoading.value = true;
        const response = await request.addSchedule(editModel);
        if (response && response.data.code === 200) {
            proxy.$msg.success(response.data.data);
            requestJob();
            editDialog.value = false;
        }
        fullLoading.value = false;
    }
}
async function editSchedule(){
    if(checkAdd()){
        fullLoading.value = true;
        const response = await request.updateSchedule(editModel);
        if (response && response.data.code === 200) {
            proxy.$msg.success(response.data.data);
            requestJob();
            editDialog.value = false;
        }
        fullLoading.value = false;
    }
}
function checkAdd(){
    //只有新增要檢查名稱
    if(isAdd.value && !editModel.name){
        proxy.$msg.error(t('scheduleList.pleaseInputName'));
        inputNameRef.value.focus();
        return false;
    }else if(!editModel.cron){
        proxy.$msg.error(t('scheduleList.pleaseInputCron'));
        inputCronRef.value.focus();
        return false;
    }else if(!editModel.classPath){
        proxy.$msg.error(t('scheduleList.pleaseInputClassPath'));
        inputClassPathRef.value.focus();
        return false;
    }
    return true;
}
function clickAdd(){
    editModel.id = null;
    editModel.name = null;
    editModel.cron = null;
    editModel.classPath = null;
    editModel.info = null;
    editModel.param = null;
    editModel.status = null;
    isAdd.value = true;
    editDialog.value = true;
}
function clickEdit(){
    editModel.id = currentModel.id;
    editModel.name = currentModel.name;
    editModel.cron = currentModel.cron;
    editModel.classPath = currentModel.classPath;
    editModel.info = currentModel.info;
    editModel.param = currentModel.param;
    editModel.status = currentModel.status;
    isAdd.value = false;
    editDialog.value = true;
}
async function toggleStatus(){
    if(currentModel.id){
        loading.value = true;
        const response = await request.toggleSchedule({"id": currentModel.id});
        if (response && response.data.code === 200) {
            proxy.$msg.success(response.data.data);
        }
        loading.value = false;
    }
}
const warningTrigger = () => {
  ElMessageBox.confirm(
    t('scheduleList.warningTrigger'),
    t('scheduleList.warning'),
    {
      confirmButtonText: t('scheduleList.ok'),
      cancelButtonText: t('scheduleList.cancel'),
      type: t('scheduleList.warning'),
    }
  )
    .then(() => {
        triggerOnce()
    })
    .catch(() => {
    })
}
async function triggerOnce(){
    if(currentModel.id){
        loading.value = true;
        const response = await request.execSchedule({"id": currentModel.id});
        if (response && response.data.code === 200) {
            proxy.$msg.success(response.data.data);
        }
        loading.value = false;
    }
}
const warningDelete = () => {
  ElMessageBox.confirm(
    t('scheduleList.warningDelete'),
    t('scheduleList.warning'),
    {
      confirmButtonText: t('scheduleList.ok'),
      cancelButtonText: t('scheduleList.cancel'),
      type: t('scheduleList.warning'),
    }
  )
    .then(() => {
        deleteSc()
    })
    .catch(() => {
    })
}
async function deleteSc(){
    if(currentModel.id){
        loading.value = true;
        const response = await request.deleteSchedule({"id": currentModel.id});
        if (response && response.data.code === 200) {
            proxy.$msg.success(response.data.data);
            removeModel(currentModel.id);
        }
        loading.value = false;
    }
}
function removeModel(id){
    jobModel.value = jobModel.value.filter(job => job.id !== id);
}
</script>

<style scoped>
.schedule__container{
    height: 100%;
    border: 1px solid #dcdfe6;
}
.schedule__header{
    display: flex;
    align-items: flex-end;
}
.schedule__headerButton{
    margin: 0px 8px;
}
</style>