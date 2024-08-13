<template>
    <el-main class="homeBodyContainer" v-loading.lock="loading" v-loading.fullscreen.lock="fullLoading">
        <el-container>
            <el-header id="searchHeader">
                <span>
                    <span class="searchHeaderBlock">
                        <el-text size="large">{{ $t('personalPerformance.search') }}</el-text>
                    </span>
                    <span class="searchHeaderBlock">
                        <el-date-picker
                        v-model="searchTime"
                        type="daterange"
                        :range-separator="$t('personalPerformance.to')"
                        start-placeholder="Start date"
                        end-placeholder="End date"
                        @change="setTime"/>
                    </span>
                    <span class="searchHeaderBlock">
                        <el-text size="large">{{ $t('personalPerformance.status') }}: </el-text>
                        <el-select v-model="searchParams.status" :placeholder="$t('personalPerformance.All')" style="width: 110px">
                            <el-option v-for="status in statusOptions"
                                :key="status.key"
                                :label="$t('personalPerformance.' + status.name)"
                                :value="status.key"
                            />
                        </el-select>
                    </span>
                    <span class="searchHeaderBlock">
                        <el-button type="primary" @click="requestPerformance()">
                            <el-icon>
                                <Search />
                            </el-icon>  
                            {{ $t('personalPerformance.search') }}
                        </el-button>
                    </span>
                </span>
                <span>
                    <el-button color="#80C080" @click="calculate">
                        <el-icon><Flag /></el-icon>
                        {{ $t('personalPerformance.personalAnnualPerformance') }}
                    </el-button>
                    <el-button type="danger" @click="openApply">
                        {{ $t('personalPerformance.applyPerformance') }}
                    </el-button>
                </span>
            </el-header>
            <el-main>
                <el-table
                    :data="performanceList"
                    :default-sort="{ prop: 'createTime', order: 'descending' }"
                    style="width: 100%" :border="true"
                    @sort-change="handleSortChange"
                    :show-overflow-tooltip="true">
                    <el-table-column column-key="createTime" prop="createTime" :label="$t('personalPerformance.col-createTime')" sortable='custom' min-width="130" :formatter="formatTime"/>
                    <el-table-column column-key="eventTime" prop="eventTime" :label="$t('personalPerformance.col-eventTime')" sortable='custom' min-width="130" :formatter="formatTime"/>
                    <el-table-column column-key="event" prop="event" :label="$t('personalPerformance.col-event')" min-width="200"/>
                    <el-table-column column-key="fixedBonus" prop="fixedBonus" :label="$t('personalPerformance.col-fixedBonus')" min-width="150" />
                    <el-table-column column-key="performanceRatio" prop="performanceRatio" :label="$t('personalPerformance.col-performanceRatio')" min-width="150"/>
                    <el-table-column column-key="status" prop="status" :label="$t('personalPerformance.col-status')" min-width="160" :align="'center'" >
                        <template #default="scope">
                            <el-tag effect="dark" :type="statusType(scope.row.status)">{{ formatStatus(scope.row.status) }}</el-tag>    
                        </template>
                    </el-table-column>
                </el-table>
            </el-main>
            <!-- :total有bug，不做轉型console會報錯，雖然運行沒影響但是很煩 -->
            <el-footer id="footer">
                <el-pagination 
                background 
                layout="slot, prev, pager, next" 
                :pager-count="11"
                :current-page="searchParams.pageNum"
                :total="parseInt(searchParams.totalElements)"
                :page-count="searchParams.totalPage"
                @current-change="handleCurrentChange">
                <span class="fontBold">
                    <span>{{ $t('personalPerformance.total') + ' ' + searchParams.totalElements + $t('personalPerformance.totalQuantifier') }}</span>
                    <span class="marginLeft12">
                        <el-select v-model="searchParams.pageSize" style="width: 110px" @change="handleSizeChange">
                            <el-option v-for="size in sizeOptions"
                                :key="size"
                                :label="size + $t('personalPerformance.pageQuantifier')"
                                :value="size"
                            />
                        </el-select>
                    </span>
                </span>
                </el-pagination>
            </el-footer>

            <!--編輯績效彈窗-->
            <el-dialog v-model="applyDialog" :title="$t('personalPerformance.applyPerformance')" width="350" @close="handleClose">
                <el-form :model="applyParams" label-position="right" @submit.prevent>
                    <el-form-item :label="$t('personalPerformance.col-event')+':'">
                        <el-input v-model="applyParams.event" ref="eventRef"/>
                    </el-form-item>
                    <el-form-item :label="$t('personalPerformance.col-eventTime')+':'">
                        <el-date-picker
                            v-model="applyParams.eventTime"
                            type="date"
                            placeholder="Pick a day"
                            ref="eventTimeRef"
                        />
                    </el-form-item>
                </el-form>
                <template #footer>
                    <div class="dialog-footer">
                        <el-button type="primary" @click="applyPerformance">{{ $t('personalPerformance.submit') }}</el-button>
                    </div>
                </template>
            </el-dialog>
            <!--年度績效彈窗-->
            <el-dialog v-model="annualDialog" :title="$t('personalPerformance.annualPerformance')" width="350" @close="handleAnnualClose">
                <el-form :model="annualParams" label-position="right">
                    <el-form-item :label="$t('personalPerformance.col-userId')+':'">
                        <el-text size="large">{{ annualParams.userId }}</el-text>
                    </el-form-item>
                    <el-form-item :label="$t('personalPerformance.col-userName')+':'">
                        <el-text size="large">{{ annualParams.userName }}</el-text>
                    </el-form-item>
                    <el-form-item :label="$t('personalPerformance.col-settleYear')+':'">
                        <el-text size="large">{{ annualParams.settleYear }}</el-text>
                    </el-form-item>
                    <el-form-item :label="$t('personalPerformance.count')+':'">
                        <el-text size="large">{{ annualParams.count }}</el-text>
                    </el-form-item>
                    <el-form-item :label="$t('personalPerformance.col-fixedBonus')+':'">
                        <el-text size="large">{{ annualParams.fixedBonus }}</el-text>
                    </el-form-item>
                    <el-form-item :label="$t('personalPerformance.col-performanceRatio')+':'">
                        <el-text size="large">{{ annualParams.performanceRatio }}</el-text>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </el-container>
    </el-main>
</template>

<script setup>
import request from '@/config/api/request.js';
import { ref, onMounted, reactive, getCurrentInstance } from 'vue';
import userStore from '@/config/store/user';
import { useI18n } from 'vue-i18n';
import { formatDateTimeStart, formatDateTimeEnd } from '@/config/tool/dateTool.js';

const { t } = useI18n();
const { proxy } = getCurrentInstance();
const user = userStore();
const searchTime = ref([]);
const loading = ref(false);
const fullLoading = ref(false);
const applyDialog = ref(false);
const annualDialog = ref(false);
const eventRef = ref(false);
const eventTimeRef = ref(false);
const performanceList = ref([]);
const searchParams = reactive({
    userId: user.id,//固定找本人績效
    startTime:null,
    endTime:null,
    status:null,
    pageNum:null,
    pageSize:null,
    sort: null,
    sortBy: null,
    totalElements:null,
    totalPage:null
})
const applyParams = reactive({
    userId: user.id,
    event: '',
    eventTime: null
})
const annualParams = reactive({
    userId: null,
    userName: null,
    settleYear: null,
    count: null,
    fixedBonus: null,
    performanceRatio: null
})
//1.待審 2.已審 3.已結 4.移除
const statusOptions = [
{name: "All", key: 0},
{name: "Pending", key: 1},
{name: "Approved", key: 2},
{name: "Closed", key: 3},
{name: "Removed", key: 4}
]
const sizeOptions = [10, 30, 50, 100]
onMounted(async () => {
    await requestPerformance();
});
async function requestPerformance() {
    loading.value = true;
    await loadPerformance(searchParams);
    loading.value = false;
}
async function loadPerformance(searchParams){
    const response = await request.performanceList({
        userId: searchParams.userId,
        startTime: searchParams.startTime,
        endTime: searchParams.endTime,
        status: searchParams.status === 0 ? null : searchParams.status,
        pageNum: searchParams.pageNum,
        pageSize: searchParams.pageSize,
        sort: searchParams.sort,
        sortBy: searchParams.sortBy,
        totalElements: searchParams.totalElements,
        totalPage: searchParams.totalPage
    });
    const data = handleResponse(response);
    updatePage(data);
}
function handleResponse(response) {
    if (response && response.data.code === 200) {
        return response.data.data;
    } else {
        return [];
    }
}
function updatePage(response){
    if(response){
        performanceList.value = response.data;
        searchParams.pageNum = response.pageNum;
        searchParams.pageSize = response.pageSize;
        searchParams.totalElements = response.totalElements;
        searchParams.totalPage = response.totalPage;
    }
}
function handleSortChange(data){
    searchParams.sort = getOrder(data.order);
    searchParams.sortBy = data.column.columnKey;
    requestPerformance();
}
function getOrder(order){
    if(order === 'descending'){
        return 2;
    }else{
        return 1;
    }
}
function setTime(times){
    if(times && times.length === 2){
        searchParams.startTime = formatDateTimeStart(times[0]);
        searchParams.endTime = formatDateTimeEnd(times[1]);
    }
}
function handleCurrentChange(page){
    if (searchParams.totalPage === 0) {
        return; // total為0避免重複觸發
    }
    searchParams.pageNum = page;
    requestPerformance();
}
function handleSizeChange(size){
    searchParams.pageSize = size;
    requestPerformance();
}
function formatTime(row, column, cellValue){
    return cellValue ? cellValue.replace("T", " ") : cellValue;
}
function formatStatus(status){
    return status ? t('personalPerformance.' + status) : status;
}
function statusType(status){
    switch (status) {
    case "Pending":
      return "warning";
    case "Approved":
      return "success";
    case "Closed":
      return "primary";
    case "Removed":
      return "info";
    default:
      return "danger";
  }
}
function openApply(){
    applyDialog.value = true;
}
function handleClose(){
    applyParams.event = '';
    applyParams.eventTime = null;
}
async function applyPerformance(){
    if(await checkApply()){
        fullLoading.value = true;
        applyParams.eventTime = formatDateTimeStart(applyParams.eventTime);
        const response = await request.addPerformance(applyParams);
        if (response && response.data.code === 200) {
            proxy.$msg.success(response.data.data);
            await loadPerformance(searchParams);
            applyDialog.value = false;
        }
        fullLoading.value = false;
    }
}
async function checkApply(){
    if(!applyParams.event){
        proxy.$msg.error(t('personalPerformance.pleaseInputEvent'));
        eventRef.value.focus();
        return false;
    }else if(!applyParams.eventTime){
        proxy.$msg.error(t('personalPerformance.pleaseInputEventTime'));
        eventTimeRef.value.focus();
        return false;
    }
    return true;
}
async function calculate(){
    loading.value = true;
    const response = await request.calculatePerformance({
        id: user.id
    });
    if (response && response.data.code === 200) {
        const totalPerformance =  response.data.data[0];
        if(totalPerformance){
            annualParams.userId = totalPerformance.user.id;
            annualParams.userName = totalPerformance.user.username;
            annualParams.settleYear = totalPerformance.settleYear;
            annualParams.count = totalPerformance.count;
            annualParams.fixedBonus = totalPerformance.fixedBonus;
            annualParams.performanceRatio = totalPerformance.performanceRatio;
        }
        annualDialog.value = true;
    }
    loading.value = false;
}
function handleAnnualClose(){
    annualParams.userId = null;
    annualParams.userName = null;
    annualParams.settleYear = null;
    annualParams.count = null;
    annualParams.fixedBonus = null;
    annualParams.performanceRatio = null;
}
</script>

<style scope>
#footer{
    display: flex;
    justify-content: flex-end;
}
.fontBold{
    font-weight: bold;
}
.marginLeft12{
    margin-left: 12px;
}
#searchHeader{
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.searchHeaderBlock{
    padding-right: 10px;
}
</style>