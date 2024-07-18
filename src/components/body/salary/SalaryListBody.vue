<template>
    <el-main class="homeBodyContainer" style="display:flex; " v-loading.lock="loading">
        <span style="flex: 1;" class="border mergin5">
            <el-table
                height="100%"
                :data="salaryList"
                :default-sort="{ prop: 'time', order: 'descending' }"
                :show-overflow-tooltip="true"
                :scrollbar-always-on="true"
                @row-click="rowClick"
                :highlight-current-row="true">
                <template #empty>
                    <el-empty :description="$t('salaryBody.dataEmpty')" />
                </template>
                <el-table-column prop="time" :label="$t('salaryBody.col-time')" sortable min-width="150" :formatter="timeFormatter"/>
                <el-table-column prop="bonus" :label="$t('salaryBody.col-bonus')" sortable min-width="150"/>
                <el-table-column prop="grandTotal" :label="$t('salaryBody.col-total')" sortable min-width="150"/>
            </el-table>
        </span>
        <span style="flex: 1;" class="border mergin5 padding20">
            <h1>{{ $t('salaryBody.salaryDetail') }}</h1>
            <el-row class="marginBottom10">
                <el-col>
                    <el-text size="large" tag="b" class="marginRight5">{{ $t('salaryBody.username') }}:</el-text>
                    <el-text size="large">{{ salaryDetail.username }}</el-text>
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <el-text size="large" tag="b" class="marginRight5">{{ $t('salaryBody.createTime') }}:</el-text>
                    <el-text size="large">{{ salaryDetail.time }}</el-text>
                </el-col>
            </el-row>
            <el-divider />
            <h2>Pay</h2>
            <el-row :gutter="20" class="marginBottom10">
                <el-col :span="7" :offset="6">
                    <el-text size="large" tag="b" class="marginRight5">Base Salary</el-text>
                </el-col>
                <el-col :span="5">
                    <el-text size="large" tag="b" class="marginRight5">基本薪資</el-text>
                </el-col>
                <el-col :span="6">
                    <el-text size="large" tag="b" class="marginRight5">${{ salaryDetail.baseSalary }}</el-text>
                </el-col>
            </el-row>
            <el-row :gutter="20" class="marginBottom10">
                <el-col :span="7" :offset="6">
                    <el-text size="large" tag="b" class="marginRight5">Meal Allowance</el-text>
                </el-col>
                <el-col :span="5">
                    <el-text size="large" tag="b" class="marginRight5">餐費</el-text>
                </el-col>
                <el-col :span="6">
                    <el-text size="large" tag="b" class="marginRight5">${{ salaryDetail.mealAllowance }}</el-text>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="7" :offset="6">
                    <el-text size="large" tag="b" class="marginRight5">Bonus</el-text>
                </el-col>
                <el-col :span="5">
                    <el-text size="large" tag="b" class="marginRight5">績效加給</el-text>
                </el-col>
                <el-col :span="6">
                    <el-text size="large" tag="b" class="marginRight5">${{ salaryDetail.bonus }}</el-text>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="11" :offset="13">
                    <el-divider />
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="5" :offset="13">
                    <el-text size="large" tag="b" class="marginRight5">Pay Total</el-text>
                </el-col>
                <el-col :span="6">
                    <el-text size="large" tag="b" class="marginRight5">${{ salaryDetail.payTotal }}</el-text>
                </el-col>
            </el-row>
            <el-divider />
            <h2>Deduction</h2>
            <el-row :gutter="20" class="marginBottom10">
                <el-col :span="7" :offset="6">
                    <el-text size="large" tag="b" class="marginRight5">Labor Insurance</el-text>
                </el-col>
                <el-col :span="5">
                    <el-text size="large" tag="b" class="marginRight5">勞保</el-text>
                </el-col>
                <el-col :span="6">
                    <el-text size="large" tag="b" class="marginRight5">${{ salaryDetail.laborInsurance }}</el-text>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="7" :offset="6">
                    <el-text size="large" tag="b" class="marginRight5">National Health Insurance</el-text>
                </el-col>
                <el-col :span="5">
                    <el-text size="large" tag="b" class="marginRight5">健保</el-text>
                </el-col>
                <el-col :span="6">
                    <el-text size="large" tag="b" class="marginRight5">${{ salaryDetail.nationalHealthInsurance }}</el-text>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="11" :offset="13">
                    <el-divider />
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="5" :offset="13">
                    <el-text size="large" tag="b" class="marginRight5">Deduction Total</el-text>
                </el-col>
                <el-col :span="6">
                    <el-text size="large" tag="b" class="marginRight5">${{ salaryDetail.reduceTotal }}</el-text>
                </el-col>
            </el-row>
            <el-divider />
            <el-row :gutter="20">
                <el-col :span="5" :offset="13">
                    <el-text size="large" tag="b" class="marginRight5">Grand Total</el-text>
                </el-col>
                <el-col :span="6">
                    <el-text size="large" tag="b" class="marginRight5">${{ salaryDetail.grandTotal }}</el-text>
                </el-col>
            </el-row>
        </span>
    </el-main>
</template>

<script setup>
import request from '@/config/api/request.js';
import { ref, onMounted, reactive } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const loading = ref(false);
const salaryList = ref([]);
const salaryDetail = reactive({
    username: '',
    time: '',
    baseSalary: '',
    mealAllowance: '',
    bonus: '',
    payTotal: '',
    laborInsurance: '',
    nationalHealthInsurance: '',
    reduceTotal: '',
    grandTotal: ''
})

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
    loading.value = true;
    salaryDetail.username = row.user.username;
    salaryDetail.time = row.time;
    salaryDetail.baseSalary = row.baseSalary;
    salaryDetail.mealAllowance = row.mealAllowance;
    salaryDetail.bonus = row.bonus;
    const bonus = parseFloat(row.bonus) || 0;
    const mealAllowance = parseFloat(row.mealAllowance) || 0;
    const baseSalary = parseFloat(row.baseSalary) || 0;
    salaryDetail.payTotal = bonus + mealAllowance + baseSalary;
    salaryDetail.laborInsurance = row.laborInsurance;
    salaryDetail.nationalHealthInsurance = row.nationalHealthInsurance;
    salaryDetail.reduceTotal = row.reduceTotal;
    salaryDetail.grandTotal = row.grandTotal;
    setTimeout(() => {
        loading.value = false;
    }, 500);
}
</script>

<style scope>
.border{
    border: 2px solid #dcdfe6;
}
.mergin5{
    margin: 10px;
}
.padding20{
    padding: 20px;
}
.marginBottom10{
    margin-bottom: 10px;
}
.marginRight5{
    margin-right: 5px;
}
</style>