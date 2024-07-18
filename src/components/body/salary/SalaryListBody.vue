<template>
    <el-main class="homeBodyContainer" style="display:flex; " v-loading.lock="loading">
        <span style="flex: 1;" class="border mergin5">
            <el-table
                height="100%"
                :data="salaryList"
                :default-sort="{ prop: 'time', order: 'descending' }"
                :show-overflow-tooltip="true"
                :scrollbar-always-on="true"
                @row-click="rowClick">
                <template #empty>
                    <el-empty :description="$t('salaryBody.dataEmpty')" />
                </template>
                <el-table-column prop="time" :label="$t('salaryBody.col-time')" sortable min-width="150" :formatter="timeFormatter"/>
                <el-table-column prop="bonus" :label="$t('salaryBody.col-bonus')" sortable min-width="150"/>
                <el-table-column prop="grandTotal" :label="$t('salaryBody.col-total')" sortable min-width="150"/>
            </el-table>
        </span>
        <span style="flex: 1;" class="border mergin5">
            test
        </span>
    </el-main>
</template>

<script setup>
import request from '@/config/api/request.js';
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const loading = ref(false);
const salaryList = ref([]);

onMounted(async () => {
    loading.value = true;
    await loadSalaryList();
    loading.value = false;
});
async function loadSalaryList(){
    const response = await request.getSalaryList();
    const data = handleResponse(response);
    if(data){
        salaryList.value = data;
    }
}
function handleResponse(response) {
    if (response && response.data.code === 200) {
        return response.data.data;
    } else {
        return [];
    }
}
function timeFormatter(row){
    const date = new Date(row.time);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString();
    return t('salaryBody.year', [year]) + ' - ' + t('salaryBody.month', [month]);
}
function rowClick(row){
    console.log(row);
}
</script>

<style scope>
.border{
    border: 2px solid #dcdfe6;
}
.mergin5{
    margin: 10px;
}
</style>