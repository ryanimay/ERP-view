<template>
    <el-main class="homeBodyContainer" v-loading.fullscreen.lock="fullLoading">
        <el-header id="searchHeader">
            <span>
                <span class="searchHeaderBlock">
                    <el-text size="large">{{ $t('performanceList.search') }}</el-text>
                </span>
                <span class="searchHeaderBlock">
                    <el-text size="large">{{ $t('performanceList.userId') }}: </el-text>
                    <el-input v-model="searchParams.userId" @input="handleUserIdInput" 
                    clearable style="width: 100px"
                    :placeholder="$t('performanceList.inputUserId')"/>
                </span>
                <span class="searchHeaderBlock">
                    <el-date-picker
                    v-model="searchTime"
                    type="daterange"
                    :range-separator="$t('performanceList.to')"
                    start-placeholder="Start date"
                    end-placeholder="End date"
                    @change="setTime"/>
                </span>
                <span class="searchHeaderBlock" v-if="currentIndex !== '0'">
                    <el-text size="large">{{ $t('performanceList.status') }}: </el-text>
                    <el-select v-model="searchParams.status" :placeholder="$t('performanceList.All')" style="width: 110px">
                        <el-option v-for="status in statusOptions"
                            :key="status.key"
                            :label="$t('performanceList.' + status.name)"
                            :value="status.key"
                        />
                    </el-select>
                </span>
                <span class="searchHeaderBlock">
                    <el-button type="primary" @click="requestPerformance()">
                        <el-icon>
                            <Search />
                        </el-icon>  
                        {{ $t('performanceList.search') }}
                    </el-button>
                </span>
            </span>
            <span>
                <el-button type="danger" @click="openApply">
                    {{ $t('performanceList.applyPerformance') }}
                </el-button>
            </span>
        </el-header>
        <el-main style="height: calc(100% - 60px);">
            <el-badge :value="pendingNum" :show-zero="false" style="position: absolute; z-index: 10; margin-left: 65px;"/>
            <el-tabs type="border-card" @tab-click="targetChange" style="height: calc(99% - 40px); min-height: 200px; margin-top: 10px;">
                <el-tab-pane :label="$t('performanceList.Pending')" class="pagingStyle" v-loading.lock="loading">
                    <el-table
                        :data="performanceList"
                        :default-sort="{ prop: 'createTime', order: 'descending' }"
                        style="width: 100%" :border="true"
                        @sort-change="handleSortChange"
                        :show-overflow-tooltip="true">
                        <el-table-column column-key="userId" prop="user.id" :label="$t('performanceList.col-userId')" min-width="50" />
                        <el-table-column column-key="userName" prop="user.username" :label="$t('performanceList.col-userName')" min-width="80" />
                        <el-table-column column-key="createTime" prop="createTime" :label="$t('performanceList.col-createTime')" sortable='custom' min-width="130" :formatter="formatTime"/>
                        <el-table-column column-key="eventTime" prop="eventTime" :label="$t('performanceList.col-eventTime')" sortable='custom' min-width="130" :formatter="formatTime"/>
                        <el-table-column column-key="event" prop="event" :label="$t('performanceList.col-event')" min-width="200"/>
                        <el-table-column column-key="fixedBonus" prop="fixedBonus" :label="$t('performanceList.col-fixedBonus')" min-width="150" />
                        <el-table-column column-key="performanceRatio" prop="performanceRatio" :label="$t('performanceList.col-performanceRatio')" min-width="150"/>
                        <el-table-column column-key="status" prop="status" :label="$t('performanceList.col-status')" min-width="160" :align="'center'" >
                            <template #default="scope">
                                <el-tag effect="plain" :type="statusType(scope.row.status)">{{ formatStatus(scope.row.status) }}</el-tag>    
                            </template>
                        </el-table-column>
                    </el-table>
                    <!-- :total有bug，不做轉型console會報錯，雖然運行沒影響但是很煩 -->
                    <el-pagination 
                    background 
                    layout="slot, prev, pager, next" 
                    :pager-count="11"
                    :current-page="searchParams.pageNum"
                    :total="parseInt(searchParams.totalElements)"
                    :page-count="searchParams.totalPage"
                    @current-change="handleCurrentChange"
                    style="display: flex; justify-content: flex-end; padding-top: 10px;">
                        <span class="fontBold">
                            <span>{{ $t('performanceList.total') + ' ' + searchParams.totalElements + $t('performanceList.totalQuantifier') }}</span>
                            <span id="marginLeft12">
                                <el-select v-model="searchParams.pageSize" style="width: 110px" @change="handleSizeChange">
                                    <el-option v-for="size in sizeOptions"
                                        :key="size"
                                        :label="size + $t('performanceList.pageQuantifier')"
                                        :value="size"
                                    />
                                </el-select>
                            </span>
                        </span>
                    </el-pagination>
                </el-tab-pane>
                <el-tab-pane  :label="$t('performanceList.All')" class="pagingStyle" v-loading.lock="loading">
                    all
                </el-tab-pane>
            </el-tabs>
        </el-main>
        <!--編輯績效彈窗-->
        <el-dialog v-model="applyDialog" :title="$t('performanceList.applyPerformance')" width="350" @close="handleClose">
            <el-form :model="applyParams" label-position="right" @submit.prevent>
                <el-form-item :label="$t('performanceList.col-event')+':'">
                    <el-input v-model="applyParams.event" ref="eventRef"/>
                </el-form-item>
                <el-form-item :label="$t('performanceList.col-eventTime')+':'">
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
                    <el-button type="primary" @click="applyPerformance">{{ $t('performanceList.submit') }}</el-button>
                </div>
            </template>
        </el-dialog>
    </el-main>
</template>

<script setup>
import request from '@/config/api/request.js';
import { ref, reactive, onMounted, getCurrentInstance } from 'vue';
import { formatDateTimeStart, formatDateTimeEnd } from '@/config/tool/dateTool.js';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const { proxy } = getCurrentInstance();
const currentIndex = ref('0');
const searchTime = ref([]);
const loading = ref(false);
const fullLoading = ref(false);
const performanceList = ref([]);
const applyDialog = ref(false);
const eventRef = ref(false);
const eventTimeRef = ref(false);
const pendingNum = ref(0);
const searchParams = reactive({
    userId: null,
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
    userId: null,
    event: '',
    eventTime: null
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
    if(currentIndex.value === '0'){
        await requestPendingList();
    }else{
        await loadPerformance(searchParams);
    }
    
    loading.value = false;
}
async function requestPendingList() {
    const response = await request.performancePendingList(searchParams);
    const data = handleResponse(response);
    updatePage(data);
}
async function loadPerformance(searchParams){
    const response = await request.performanceList(searchParams);
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
        console.log(response.pageNum);
        performanceList.value = response.data;
        searchParams.pageNum = response.pageNum == 0 ? 1 : response.pageNum;
        searchParams.pageSize = response.pageSize;
        searchParams.totalElements = response.totalElements;
        searchParams.totalPage = response.totalPage;
        if(currentIndex.value === '0'){
            pendingNum.value = response.totalElements;
        }
    }
}
function setTime(times){
    if(times && times.length === 2){
        searchParams.startTime = formatDateTimeStart(times[0]);
        searchParams.endTime = formatDateTimeEnd(times[1]);
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
        proxy.$msg.error(t('performanceList.pleaseInputEvent'));
        eventRef.value.focus();
        return false;
    }else if(!applyParams.eventTime){
        proxy.$msg.error(t('performanceList.pleaseInputEventTime'));
        eventTimeRef.value.focus();
        return false;
    }
    return true;
}
function handleCurrentChange(page){
    if (searchParams.totalPage === 0) {
        return; // total為0避免重複觸發
    }
    searchParams.pageNum = page;
    requestPerformance();
}
const handleUserIdInput = (value) => {
    let formattedValue = value.replace(/[^\d]/g, ''); // 只保留数字
    if (formattedValue > 9999) formattedValue = 9999; // 限制最大值为9999
    searchParams.userId = formattedValue;
};
function handleSizeChange(size){
    searchParams.pageSize = size;
    requestPerformance();
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
function targetChange(target) {
    currentIndex.value = target.index;
    resetParams();
    requestPerformance();
}
function resetParams(){
    searchParams.userId = null;
    searchParams.startTime = null;
    searchParams.endTime = null;
    searchParams.status = null;
    searchParams.pageNum = null;
    searchParams.pageSize = null;
    searchParams.sort = null;
    searchParams.sortBy = null;
    searchParams.totalElements = null;
    searchParams.totalPage = null;
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
#marginLeft12{
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
.pagingStyle{
    height: calc(100% - 50px);
    overflow: auto;
}
</style>