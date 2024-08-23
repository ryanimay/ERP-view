<template>
    <el-main class="homeBodyContainer" v-loading.fullscreen.lock="fullLoading">
        <el-header>
            <div class="paddingBottom10">
                <span class="searchHeaderBlock">
                    <el-text size="large">{{ $t('performanceList.userId') }}: </el-text>
                    <el-input v-model="searchParams.userId" @input="handleUserIdInput" 
                    :disabled="currentIndex === '0'"
                    clearable style="width: 100px"
                    :placeholder="$t('performanceList.inputUserId')"/>
                </span>
                <span class="searchHeaderBlock">
                    <el-date-picker
                    :disabled="currentIndex === '0'"
                    v-model="searchTime"
                    type="daterange"
                    :range-separator="$t('performanceList.to')"
                    :start-placeholder="$t('performanceList.startDate')"
                    :end-placeholder="$t('performanceList.endDate')"
                    @change="setTime"/>
                </span>
            </div>
            <div id="searchHeader">
                <span>
                    <span class="searchHeaderBlock">
                        <el-text size="large">{{ $t('performanceList.status') }}: </el-text>
                        <el-select 
                        :disabled="currentIndex === '0'"
                        v-model="searchParams.status" 
                        :placeholder="$t('performanceList.All')" 
                        style="width: 110px">
                            <el-option v-for="status in statusOptions"
                                :key="status.key"
                                :label="$t('performanceList.' + status.name)"
                                :value="status.key"
                            />
                        </el-select>
                    </span>
                    <span class="searchHeaderBlock">
                        <el-button :disabled="currentIndex === '0'" type="primary" @click="requestPerformance()">
                            <el-icon>
                                <Search />
                            </el-icon>  
                            {{ $t('performanceList.search') }}
                        </el-button>
                    </span>
                </span>
                <span>
                    <el-button color="#80C080" @click="calculate">
                        <el-icon><Flag /></el-icon>
                        {{ $t('performanceList.annualPerformance') }}
                    </el-button>
                    <el-button type="danger" @click="openApply">
                        {{ $t('performanceList.applyPerformance') }}
                    </el-button>
                </span>
            </div>
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
                        <el-table-column column-key="userId" prop="user.id" :label="$t('performanceList.col-userId')" min-width="60" />
                        <el-table-column column-key="userName" prop="user.username" :label="$t('performanceList.col-userName')" min-width="90" />
                        <el-table-column column-key="createTime" prop="createTime" :label="$t('performanceList.col-createTime')" sortable='custom' min-width="130" :formatter="formatTime"/>
                        <el-table-column column-key="eventTime" prop="eventTime" :label="$t('performanceList.col-eventTime')" sortable='custom' min-width="130" :formatter="formatTime"/>
                        <el-table-column column-key="event" prop="event" :label="$t('performanceList.col-event')" min-width="200"/>
                        <el-table-column column-key="fixedBonus" prop="fixedBonus" :label="$t('performanceList.col-fixedBonus')" min-width="150" />
                        <el-table-column column-key="performanceRatio" prop="performanceRatio" :label="$t('performanceList.col-performanceRatio')" min-width="150"/>
                        <el-table-column :label="$t('performanceList.col-review')" min-width="80" :align="'center'">
                            <template #default="scope">
                                <el-button type="primary" @click="openEdit(scope.row)" >
                                    <el-icon>
                                        <EditPen />
                                    </el-icon>
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!-- :total有bug，不做轉型console會報錯，雖然運行沒影響但是很煩 -->
                    <el-pagination 
                    background 
                    layout="slot, prev, pager, next" 
                    :pager-count="11"
                    :current-page="pendingParams.pageNum"
                    :total="parseInt(pendingParams.totalElements)"
                    :page-count="pendingParams.totalPage"
                    @current-change="handleCurrentChange"
                    style="display: flex; justify-content: flex-end; padding-top: 10px;">
                        <span class="fontBold">
                            <span>{{ $t('paging.total') + ' ' + pendingParams.totalElements + $t('paging.totalQuantifier') }}</span>
                            <span class="marginLeft12">
                                <el-select v-model="pendingParams.pageSize" style="width: 110px" @change="handleSizeChange">
                                    <el-option v-for="size in sizeOptions"
                                        :key="size"
                                        :label="size + $t('paging.pageQuantifier')"
                                        :value="size"
                                    />
                                </el-select>
                            </span>
                        </span>
                    </el-pagination>
                </el-tab-pane>
                <el-tab-pane  :label="$t('performanceList.All')" class="pagingStyle" v-loading.lock="loading">
                    <el-table
                        :data="performanceList"
                        :default-sort="{ prop: 'createTime', order: 'descending' }"
                        style="width: 100%" :border="true"
                        @sort-change="handleSortChange"
                        :show-overflow-tooltip="true">
                        <el-table-column column-key="userId" prop="user.id" :label="$t('performanceList.col-userId')" min-width="65" />
                        <el-table-column column-key="userName" prop="user.username" :label="$t('performanceList.col-userName')" min-width="100" />
                        <el-table-column column-key="createTime" prop="createTime" :label="$t('performanceList.col-createTime')" sortable='custom' min-width="130" :formatter="formatTime"/>
                        <el-table-column column-key="eventTime" prop="eventTime" :label="$t('performanceList.col-eventTime')" sortable='custom' min-width="130" :formatter="formatTime"/>
                        <el-table-column column-key="event" prop="event" :label="$t('performanceList.col-event')" min-width="200"/>
                        <el-table-column column-key="fixedBonus" prop="fixedBonus" :label="$t('performanceList.col-fixedBonus')" min-width="150" />
                        <el-table-column column-key="performanceRatio" prop="performanceRatio" :label="$t('performanceList.col-performanceRatio')" min-width="150"/>
                        <el-table-column column-key="status" prop="status" :label="$t('performanceList.col-status')" min-width="160" :align="'center'" >
                            <template #default="scope">
                                <el-tag effect="dark" :type="statusType(scope.row.status)">{{ formatStatus(scope.row.status) }}</el-tag>    
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
                            <span>{{ $t('paging.total') + ' ' + searchParams.totalElements + $t('paging.totalQuantifier') }}</span>
                            <span class="marginLeft12">
                                <el-select v-model="searchParams.pageSize" style="width: 110px" @change="handleSizeChange">
                                    <el-option v-for="size in sizeOptions"
                                        :key="size"
                                        :label="size + $t('paging.pageQuantifier')"
                                        :value="size"
                                    />
                                </el-select>
                            </span>
                        </span>
                    </el-pagination>
                </el-tab-pane>
            </el-tabs>
        </el-main>
        <!--編輯績效彈窗-->
        <el-dialog v-model="applyDialog" :title="$t('performanceList.applyPerformance')" width="350" @close="handleClose">
            <el-form :model="applyParams" label-position="right" @submit.prevent>
                <el-form-item :label="$t('performanceList.col-applyUser')+':'">
                    <el-select 
                    v-model="applyParams.userId" 
                    :placeholder="$t('performanceList.selectUser')" 
                    style="width: 180px"
                    ref="userIdRef">
                        <el-option v-for="client in clientNameList"
                            :key="client.id"
                            :label="client.username"
                            :value="client.id"
                        />
                    </el-select>
                </el-form-item>
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
                    <el-button type="primary" @click="applyPerformance">{{ $t('performanceList.save') }}</el-button>
                </div>
            </template>
        </el-dialog>
        <!--審核績效彈窗-->
        <el-dialog v-model="reviewDialog" :title="$t('performanceList.reviewPerformance')" width="400" @close="handleReviewClose">
            <el-form :model="reviewParams" label-position="right" @submit.prevent>
                <el-form-item :label="$t('performanceList.performanceId')+':'">
                    <el-text size="large">{{ reviewParams.id }}</el-text>
                </el-form-item>
                <el-form-item :label="$t('performanceList.col-applyUser')+':'">
                    <el-text size="large">{{ reviewParams.userName }}</el-text>
                </el-form-item>
                <el-form-item :label="$t('performanceList.col-event')+':'">
                    <el-text size="large">{{ reviewParams.event }}</el-text>
                </el-form-item>
                <el-form-item :label="$t('performanceList.col-eventTime')+':'">
                    <el-text size="large">{{ `${reviewParams.eventTime}`.replace('T', ' ') }}</el-text>
                </el-form-item>
                <el-form-item :label="$t('performanceList.col-fixedBonus')+':'">
                    <el-input 
                    v-model="reviewParams.fixedBonus" 
                    :formatter="(value) => '$ '+ `${value}`.replace(/[^\d]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                    :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
                    @input="lockApporved"
                    ref="fixedBonusRef"/>
                </el-form-item>
                <el-form-item :label="$t('performanceList.col-performanceRatio')+':'">
                    <el-input 
                    v-model="reviewParams.performanceRatio" 
                    :formatter="(value) => '% '+ `${value}`.replace(/[^\d.]/g, '')"
                    :parser="(value) => value.replace(/[%\s,]/g, '')"
                    @input="lockApporved"/>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="marginLeft12">
                    <el-button type="danger" plain @click="rejectApply">{{ $t('performanceList.btn-rejected') }}</el-button>
                </span>
                <span class="marginLeft12">
                    <el-button type="info" plain @click="saveApply">{{ $t('performanceList.btn-save') }}</el-button>
                </span>
                <span class="marginLeft12">
                    <el-tooltip
                    placement="top"
                    trigger="hover"
                    :content="$t('performanceList.pleaseSaveFirst')"
                    :disabled="!approvedLock">
                        <el-button :disabled="approvedLock" type="success" plain @click="approveApply">{{ $t('performanceList.btn-approved') }}</el-button>
                    </el-tooltip>
                </span>
            </template>
        </el-dialog>
        <!--年度績效彈窗-->
        <el-dialog v-model="annualDialog" :title="$t('personalPerformance.annualPerformance')" width="1000" @close="handleAnnualClose">
            <div class="paddingBottom10">
                <span class="searchHeaderBlock">
                    <el-text size="large">{{ $t('performanceList.userId') }}: </el-text>
                    <el-input v-model="searchAnnualUserId" @input="handleAnnualUserIdInput"
                    clearable style="width: 100px"
                    :placeholder="$t('performanceList.inputUserId')"/>
                </span>
                <span class="searchHeaderBlock">
                    <el-button type="primary" @click="calculate">
                        <el-icon>
                            <Search />
                        </el-icon>  
                        {{ $t('performanceList.search') }}
                    </el-button>
                </span>
            </div>
            <el-table
                :data="annualList"
                :default-sort="{ prop: 'userId', order: 'ascending' }"
                style="width: 100%" :border="true"
                :show-overflow-tooltip="true">
                <el-table-column column-key="userId" prop="user.id" :label="$t('personalPerformance.col-userId')" min-width="50" />
                <el-table-column column-key="userName" prop="user.username" :label="$t('personalPerformance.col-userName')" min-width="80" />
                <el-table-column column-key="settleYear" prop="settleYear" :label="$t('personalPerformance.col-settleYear')" min-width="50"/>
                <el-table-column column-key="count" prop="count" :label="$t('personalPerformance.count')" min-width="50"/>
                <el-table-column column-key="fixedBonus" prop="fixedBonus" :label="$t('personalPerformance.col-fixedBonus')" min-width="50" :formatter="formatAmount"/>
                <el-table-column column-key="performanceRatio" prop="performanceRatio" :label="$t('personalPerformance.col-performanceRatio')" min-width="50"/>
            </el-table>
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
const clientNameList = ref([]);
const annualList = ref([]);
const applyDialog = ref(false);
const reviewDialog = ref(false);
const userIdRef = ref(false);
const eventRef = ref(false);
const eventTimeRef = ref(false);
const fixedBonusRef = ref(false);
const approvedLock = ref(true);
const annualDialog = ref(false);
const searchAnnualUserId = ref(null);
const pendingNum = ref(0);
const pendingParams = reactive({
    pageNum:null,
    pageSize:null,
    sort: null,
    sortBy: null,
    totalElements:null,
    totalPage:null
})
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
const reviewParams = reactive({
    id: null,
    event: null,
    userId: null,
    userName: null,
    fixedBonus: null,
    performanceRatio: null,
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
    await loadClientNameList();
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
async function loadClientNameList() {
    const response = await request.clientNameList();
    const data = handleResponse(response);
    clientNameList.value = data;
}
async function requestPendingList() {
    const response = await request.performancePendingList(pendingParams);
    const data = handleResponse(response);
    updatePage(data);
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
        if(currentIndex.value === '0'){
            pendingParams.pageNum = response.pageNum;
            pendingParams.pageSize = response.pageSize;
            pendingParams.totalElements = response.totalElements;
            pendingParams.totalPage = response.totalPage;
            pendingNum.value = response.totalElements;
        }else{
            searchParams.pageNum = response.pageNum;
            searchParams.pageSize = response.pageSize;
            searchParams.totalElements = response.totalElements;
            searchParams.totalPage = response.totalPage;
        }
        performanceList.value = response.data;
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
function handleReviewClose(){
    reviewParams.id = null;
    reviewParams.event = null;
    reviewParams.userId = null;
    reviewParams.userName = null;
    reviewParams.fixedBonus = null;
    reviewParams.performanceRatio = null;
    reviewParams.eventTime = null;
    approvedLock.value = true;
}
async function applyPerformance(){
    if(await checkApply()){
        fullLoading.value = true;
        applyParams.eventTime = formatDateTimeStart(applyParams.eventTime);
        const response = await request.addPerformance(applyParams);
        if (response && response.data.code === 200) {
            proxy.$msg.success(response.data.data);
            await requestPerformance();
            applyDialog.value = false;
        }
        fullLoading.value = false;
    }
}
async function checkApply(){
    if(!applyParams.userId){
        proxy.$msg.error(t('performanceList.pleaseInputUserId'));
        userIdRef.value.focus();
        return false;
    }else if(!applyParams.event){
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
    if(currentIndex.value === '0'){
        if (pendingParams.totalPage === 0) {
            return; // total為0避免重複觸發
        }
        pendingParams.pageNum = page;
    }else{
        if (searchParams.totalPage === 0) {
            return; // total為0避免重複觸發
        }
        searchParams.pageNum = page;
    }
    requestPerformance();
}
const handleUserIdInput = (value) => {
    searchParams.userId = formatIdValue(value);
};
const handleAnnualUserIdInput = (value) => {
    searchAnnualUserId.value = formatIdValue(value);
};
function formatIdValue(value){
    let formattedValue = value.replace(/[^\d]/g, ''); // 只保留数字
    if (formattedValue > 9999) formattedValue = 9999; // 限制最大值为9999
    return formattedValue;
}
function handleSizeChange(size){
    if(currentIndex.value === '0'){
        pendingParams.pageSize = size;
    }else{
        searchParams.pageSize = size;
    }
    requestPerformance();
}
function handleSortChange(data){
    if(currentIndex.value === '0'){
        pendingParams.sort = getOrder(data.order);
        pendingParams.sortBy = data.column.columnKey;
    }else{
        searchParams.sort = getOrder(data.order);
        searchParams.sortBy = data.column.columnKey;
    }
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
    if(currentIndex.value === '0'){
        pendingParams.pageNum = null;
        pendingParams.pageSize = null;
        pendingParams.sort = null;
        pendingParams.sortBy = null;
        pendingParams.totalElements = null;
        pendingParams.totalPage = null;
    }else{
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
}
function openEdit(row){
    reviewParams.id = row.id;
    reviewParams.event = row.event;
    reviewParams.userId = row.user.id;
    reviewParams.userName = row.user.username;
    reviewParams.fixedBonus = row.fixedBonus;
    reviewParams.performanceRatio = row.performanceRatio;
    reviewParams.eventTime = row.eventTime;
    
    reviewDialog.value = true;
}
async function rejectApply(){
    fullLoading.value = true;
    const response = await request.rejectPerformance({
        eventId: reviewParams.id
    });
    if (response && response.data.code === 200) {
        proxy.$msg.success(response.data.data);
        await requestPerformance();
        reviewDialog.value = false;
    }
    fullLoading.value = false;
}
async function saveApply(){
    if(await checkApproveData()){
        fullLoading.value = true;
        const response = await request.updatePerformance(reviewParams);
        if (response && response.data.code === 200) {
            proxy.$msg.success(response.data.data);
            await requestPerformance();
            approvedLock.value = false;
        }
        fullLoading.value = false;
    }
}
async function checkApproveData(){
    if(!reviewParams.fixedBonus && !reviewParams.performanceRatio){
        proxy.$msg.error(t('performanceList.pleaseInputAmount'));
        fixedBonusRef.value.focus();
        return false;
    }
    return true;
}
async function approveApply(){
    if(await checkApproveData()){
        fullLoading.value = true;
        const response = await request.acceptPerformance({
            eventId: reviewParams.id,
            eventUserId: reviewParams.userId
        });
        if (response && response.data.code === 200) {
            proxy.$msg.success(response.data.data);
            await requestPerformance();
            reviewDialog.value = false;
        }
        fullLoading.value = false;
    }
}
function lockApporved(){
    approvedLock.value = true;
}
async function calculate(){
    fullLoading.value = true;
    const response = await request.calculatePerformance({
        id: searchAnnualUserId.value
    });
    if (response && response.data.code === 200) {
        annualList.value =  response.data.data;
        annualDialog.value = true;
    }
    fullLoading.value = false;
}
function handleAnnualClose(){
    annualList.value = [];
}
function formatAmount(row, column, cellValue){
    return cellValue ? '$ '+ `${cellValue}`.replace(/[^\d]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',') : cellValue;
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
.pagingStyle{
    height: calc(100% - 50px);
    overflow: auto;
}
.paddingBottom10 {
    padding-bottom: 10px;
}
</style>