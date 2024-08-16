<template>
    <el-main class="homeBodyContainer">
        <el-container class="height100">
            <el-header class="alignCenter">
                <el-text size="large" tag="b" class="marginRight6">{{$t('projectList.markColor')}}:</el-text>
                <el-color-picker :disabled="!markColor" 
                v-model="markColor" 
                size="large"
                @change="changeMarkColor"
                @active-change="showPickColor" 
                @focus="openColorPicker = true"
                @blur="resetColor"/>
            </el-header>
            <el-main class="height100">
                <el-tabs v-model="searchParams.type" type="border-card" @tab-change="handleClick" style="height: calc(100% - 30px); min-height: 200px;">
                    <el-tab-pane v-for="item in typeList" :key="item.name" :label="$t(item.label)" :name="item.name" v-loading.lock="loading"  style="height: calc(100% - 39px);">
                        <el-table
                        :data="projectList"
                        style="width: 100%;" 
                        :show-overflow-tooltip="true"
                        :row-style="tableRowStyle"
                        :highlight-current-row="true"
                        row-class-name="noHoverClass"
                        @current-change="rowClick"
                        height="100%">
                            <el-table-column column-key="id" prop="id" :label="$t('projectList.id')" min-width="50" />
                            <el-table-column column-key="name" prop="name" :label="$t('projectList.name')" min-width="90" />
                            <el-table-column column-key="type" prop="type" :label="$t('projectList.type')" min-width="60" />
                            <el-table-column column-key="scheduledStartTime" prop="scheduledStartTime" :label="$t('projectList.scheduledStartTime')" min-width="130" :formatter="formatTime"/>
                            <el-table-column column-key="scheduledEndTime" prop="scheduledEndTime" :label="$t('projectList.scheduledEndTime')" min-width="130" :formatter="formatTime"/>
                            <el-table-column column-key="info" prop="info" :label="$t('projectList.info')" min-width="150" />
                            <el-table-column column-key="manager" prop="manager.username" :label="$t('projectList.manager')" min-width="90"/>
                            <el-table-column column-key="status" prop="status" :label="$t('projectList.status')" min-width="65"/>
                        </el-table>
                    </el-tab-pane>
                </el-tabs>
            </el-main>
        </el-container>
    </el-main>
</template>

<script setup>
import request from '@/config/api/request.js';
import { ref, onMounted, reactive, getCurrentInstance } from 'vue'

const { proxy } = getCurrentInstance();
const openColorPicker = ref(false);
const loading = ref(false);
const projectList = ref([]);
const searchParams = reactive({
    id: null,
    name: null,
    type: '1',//預設搜尋
    scheduledStartTime: null,
    scheduledEndTime: null,
    info: null,
    managerId: null,
    status: null,
    markColor: null
})
const markColor = ref(null);
const currentRow = ref(null);
const currentProject = reactive({
    id: null,
    name: null,
    type: null,
    scheduledStartTime: null,
    scheduledEndTime: null,
    info: null,
    managerId: null,
    status: null,
    markColor: null
})
const typeList = [
    {
        "label":"projectList.type1",
        "name":"1"
    },
    {
        "label":"projectList.type2",
        "name":"2"
    },
    {
        "label":"projectList.type3",
        "name":"3"
    }
]
onMounted(() => {
    loadProject();
});
async function loadProject() {
    loading.value = true;
    const response = await request.projectList(searchParams);
    const data = handleResponse(response);
    projectList.value = data;
    loading.value = false;
}
async function updateProject() {
    loading.value = true;
    const response = await request.updateProject(currentProject);
    if (response && response.data.code === 200) {
        proxy.$msg.success(response.data.data);
    }
    loading.value = false;
}
function handleResponse(response) {
    if (response && response.data.code === 200) {
        return response.data.data;
    } else {
        return [];
    }
}
function handleClick(){
    markColor.value = null;
    loadProject();
}
function formatTime(row, column, cellValue){
    return cellValue ? cellValue.replace("T", " ") : cellValue;
}
function tableRowStyle(col) {
    return { 
        backgroundColor: col.row.markColor
    }; 
}
function rowClick(row){
    currentRow.value = row;
    if(row){
        markColor.value = row.markColor ? row.markColor : '#FFFFFF';
        currentProject.id = row.id;
        currentProject.markColor = row.markColor;//記錄舊顏色
    }
}
function changeMarkColor(color){
    if (color !== currentProject.markColor) {
        clearCurrentProject();
        currentProject.markColor = color ? color : '#FFFFFF';
        updateProject();
    }
}
function showPickColor(color){
    if(openColorPicker.value){
        currentRow.value.markColor = color;
    }
}
function resetColor(){
    if(openColorPicker.value){
        openColorPicker.value = false;
        if(currentRow.value.markColor !== currentProject.markColor){
            currentRow.value.markColor = currentProject.markColor;
        }
    }
}
function clearCurrentProject(){
    currentProject.name = null;
    currentProject.type = null;
    currentProject.scheduledStartTime = null;
    currentProject.scheduledEndTime = null;
    currentProject.info = null;
    currentProject.managerId = null;
    currentProject.status = null;
    currentProject.markColor =  null;
}
</script>

<style scoped>
.height100{
    height: 100%;
}
.alignCenter{
    display: flex;
    align-items: center;
}
.marginRight6{
    margin-right: 6px;
}
</style>