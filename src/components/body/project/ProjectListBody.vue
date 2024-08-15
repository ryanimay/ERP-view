<template>
    <el-main class="homeBodyContainer">
        <el-container class="height100">
            <el-header class="alignCenter">
                headeer
            </el-header>
            <el-main class="height100">
                <el-tabs v-model="tabType" type="border-card" @tab-click="handleClick" style="height: calc(100% - 30px); min-height: 200px;">
                    <el-tab-pane :label="$t('projectList.type1')" name="1" v-loading.lock="loading">
                        <el-table
                        :data="projectList"
                        style="width: 100%;" 
                        :show-overflow-tooltip="true"
                        :row-style="tableRowStyle"
                        :highlight-current-row="true"
                        row-class-name="noHoverClass">
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
                    <el-tab-pane :label="$t('projectList.type2')" name="2" v-loading.lock="loading">
                        
                    </el-tab-pane>
                    <el-tab-pane :label="$t('projectList.type3')" name="3" v-loading.lock="loading">

                    </el-tab-pane>
                </el-tabs>
            </el-main>
        </el-container>
    </el-main>
</template>

<script setup>
import request from '@/config/api/request.js';
import { ref, onMounted, reactive } from 'vue'

const tabType = ref('1');
const loading = ref(false);
const projectList = ref([]);
const searchParams = reactive({
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
function handleResponse(response) {
    if (response && response.data.code === 200) {
        return response.data.data;
    } else {
        return [];
    }
}
function handleClick(target){
    console.log(target.props.name);
}
function formatTime(row, column, cellValue){
    return cellValue ? cellValue.replace("T", " ") : cellValue;
}
function tableRowStyle(col) {
    return { 
        backgroundColor: col.row.markColor
    }; 
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
</style>