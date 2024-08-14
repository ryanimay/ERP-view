<template>
    <el-main class="homeBodyContainer" v-loading.fullscreen.lock="fullLoading">
        <el-header id="searchHeader">
            <span>
                <span class="searchHeaderBlock">
                    <el-text size="large">{{ $t('leaveList.userId') }}: </el-text>
                    <el-input v-model="searchParams.userId" @input="handleUserIdInput" 
                    :disabled="currentIndex === '0'"
                    clearable style="width: 100px"
                    :placeholder="$t('leaveList.inputUserId')"/>
                </span>
                <span class="searchHeaderBlock">
                    <el-date-picker
                    :disabled="currentIndex === '0'"
                    v-model="searchTime"
                    type="daterange"
                    :range-separator="$t('leaveList.to')"
                    start-placeholder="Start date"
                    end-placeholder="End date"
                    @change="setTime"/>
                </span>
                <span class="searchHeaderBlock">
                    <el-button :disabled="currentIndex === '0'" type="primary" @click="requestLeave()">
                        <el-icon>
                            <Search />
                        </el-icon>  
                        {{ $t('leaveList.search') }}
                    </el-button>
                </span>
            </span>
            <span>
                <span>
                    <el-button type="danger" @click="openApply">
                        {{ $t('leaveList.applyLeave') }}
                    </el-button>
                </span>
            </span>
        </el-header>
        <el-main style="height: calc(100% - 60px);">
            <el-badge :value="pendingNum" :show-zero="false" style="position: absolute; z-index: 10; margin-left: 65px;"/>
            <el-tabs type="border-card" @tab-click="targetChange" style="height: calc(99% - 40px); min-height: 200px; margin-top: 10px;">
                <el-tab-pane :label="$t('leaveList.Pending')" class="pagingStyle" v-loading.lock="loading">
                    <el-table
                        :data="leaveList"
                        :default-sort="{ prop: 'createdTime' }"
                        style="width: 100%" :border="true"
                        @sort-change="handleSortChange"
                        :show-overflow-tooltip="true">
                        <el-table-column column-key="userId" prop="user.id" :label="$t('leaveList.col-userId')" min-width="60" />
                        <el-table-column column-key="userName" prop="user.username" :label="$t('leaveList.col-userName')" min-width="90" />
                        <el-table-column column-key="createdTime" prop="createdTime" :label="$t('leaveList.col-createdTime')" sortable='custom' min-width="130" :formatter="formatTime"/>
                        <el-table-column column-key="startTime" prop="startTime" :label="$t('leaveList.col-startTime')" sortable='custom' min-width="130" :formatter="formatTime"/>
                        <el-table-column column-key="endTime" prop="endTime" :label="$t('leaveList.col-endTime')" sortable='custom' min-width="130" :formatter="formatTime"/>
                        <el-table-column column-key="type" prop="type.name" :label="$t('leaveList.col-type')" min-width="150" :formatter="formatType"/>
                        <el-table-column column-key="info" prop="info" :label="$t('leaveList.col-info')" min-width="200"/>
                        <el-table-column :label="$t('leaveList.col-review')" min-width="80" :align="'center'">
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
                            <span>{{ $t('leaveList.total') + ' ' + pendingParams.totalElements + $t('leaveList.totalQuantifier') }}</span>
                            <span class="marginLeft12">
                                <el-select v-model="pendingParams.pageSize" style="width: 110px" @change="handleSizeChange">
                                    <el-option v-for="size in sizeOptions"
                                        :key="size"
                                        :label="size + $t('leaveList.pageQuantifier')"
                                        :value="size"
                                    />
                                </el-select>
                            </span>
                        </span>
                    </el-pagination>
                </el-tab-pane>
                <el-tab-pane  :label="$t('leaveList.All')" class="pagingStyle" v-loading.lock="loading">
                    <el-table
                        :data="leaveList"
                        :default-sort="{ prop: 'createdTime' }"
                        style="width: 100%" :border="true"
                        @sort-change="handleSortChange"
                        :show-overflow-tooltip="true">
                        <el-table-column column-key="userId" prop="user.id" :label="$t('leaveList.col-userId')" min-width="65" />
                        <el-table-column column-key="userName" prop="user.username" :label="$t('leaveList.col-userName')" min-width="100" />
                        <el-table-column column-key="createdTime" prop="createdTime" :label="$t('leaveList.col-createdTime')" sortable='custom' min-width="130" :formatter="formatTime"/>
                        <el-table-column column-key="startTime" prop="startTime" :label="$t('leaveList.col-startTime')" sortable='custom' min-width="130" :formatter="formatTime"/>
                        <el-table-column column-key="endTime" prop="endTime" :label="$t('leaveList.col-endTime')" sortable='custom' min-width="130" :formatter="formatTime"/>
                        <el-table-column column-key="info" prop="info" :label="$t('leaveList.col-info')" min-width="200"/>
                        <el-table-column column-key="type" prop="type.name" :label="$t('leaveList.col-type')" min-width="150" />
                        <el-table-column column-key="performanceRatio" prop="performanceRatio" :label="$t('leaveList.col-performanceRatio')" min-width="150"/>
                        <el-table-column column-key="status" prop="status" :label="$t('leaveList.col-status')" min-width="160" :align="'center'" >
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
                            <span>{{ $t('leaveList.total') + ' ' + searchParams.totalElements + $t('leaveList.totalQuantifier') }}</span>
                            <span class="marginLeft12">
                                <el-select v-model="searchParams.pageSize" style="width: 110px" @change="handleSizeChange">
                                    <el-option v-for="size in sizeOptions"
                                        :key="size"
                                        :label="size + $t('leaveList.pageQuantifier')"
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
        <el-dialog v-model="applyDialog" :title="$t('leaveList.applyLeave')" width="350" @close="handleClose">
            <el-form :model="applyParams" label-position="right" @submit.prevent>
                <el-form-item :label="$t('leaveList.col-applyUser')+':'">
                    <el-select 
                    v-model="applyParams.userId" 
                    :placeholder="$t('leaveList.selectUser')" 
                    style="width: 180px"
                    ref="userIdRef">
                        <el-option v-for="client in clientNameList"
                            :key="client.id"
                            :label="client.username"
                            :value="client.id"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('leaveList.col-type')+':'">
                    <el-select v-model="applyParams.type" style="width: 180px" ref="editSelectRef">
                        <el-option v-for="leaveType in leaveTypeList"
                            :key="leaveType.id"
                            :label="$t(leaveType.name)"
                            :value="leaveType.id"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('leaveList.col-time')+':'">
                    <el-date-picker
                    v-model="leaveTime"
                    type="daterange"
                    :range-separator="$t('leaveList.to')"
                    start-placeholder="Start date"
                    end-placeholder="End date"
                    @change="setLeaveTime"
                    ref="datePickerRef"/>
                </el-form-item>
                <el-form-item :label="$t('leaveList.col-info')+':'">
                    <el-input v-model="applyParams.info" />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="applyLeave">{{ $t('leaveList.save') }}</el-button>
                </div>
            </template>
        </el-dialog>
        <!--審核績效彈窗-->
        <el-dialog v-model="reviewDialog" :title="$t('leaveList.reviewLeave')" width="400" @close="handleReviewClose">
            <el-form :model="reviewParams" label-position="right" @submit.prevent>
                <el-form-item :label="$t('leaveList.leaveId')+':'">
                    <el-text size="large">{{ reviewParams.id }}</el-text> 
                </el-form-item>
                <el-form-item :label="$t('leaveList.col-applyUser')+':'">
                    <el-text size="large">{{ reviewParams.username }}</el-text>
                </el-form-item>
                <el-form-item :label="$t('leaveList.col-type')+':'">
                    <el-text size="large">{{ $t(reviewParams.type) }}</el-text>
                </el-form-item>
                <el-form-item :label="$t('leaveList.col-info')+':'">
                    <el-text size="large">{{ reviewParams.info }}</el-text>
                </el-form-item>
                <el-form-item :label="$t('leaveList.col-startTime')+':'">
                    <el-text size="large">{{ `${reviewParams.startTime}`.replace('T', ' ') }}</el-text>
                </el-form-item>
                <el-form-item :label="$t('leaveList.col-endTime')+':'">
                    <el-text size="large">{{ `${reviewParams.endTime}`.replace('T', ' ') }}</el-text>
                </el-form-item>
                <el-form-item :label="$t('leaveList.col-createdTime')+':'">
                    <el-text size="large">{{ `${reviewParams.createdTime}`.replace('T', ' ') }}</el-text>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="marginLeft12">
                    <el-button type="danger" plain @click="rejectApply">{{ $t('leaveList.btn-rejected') }}</el-button>
                </span>
                <span class="marginLeft12">
                    <el-button type="success" plain @click="approveApply">{{ $t('leaveList.btn-approved') }}</el-button>
                </span>
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
const leaveList = ref([]);
const leaveTime = ref([]);
const clientNameList = ref([]);
const leaveTypeList = ref([]);
const applyDialog = ref(false);
const reviewDialog = ref(false);
const userIdRef = ref(false);
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
    type: null,
    startTime: null,
    endTime: null,
    info: null
})
const reviewParams = reactive({
    id: null,
    eventUserId: null,
    username: null,
    type: null,
    startTime: null,
    endTime: null,
    createdTime: null,
    info: null,
})
const sizeOptions = [10, 30, 50, 100]
onMounted(async () => {
    await requestLeave();
    await loadClientNameList();
    await loadLeaveTypeList();
});
async function requestLeave() {
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
async function loadLeaveTypeList(){
    const response = await request.leaveTypeList();
    const data = handleResponse(response);
    leaveTypeList.value = data;
}
async function requestPendingList() {
    const response = await request.leavePendingList(pendingParams);
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
        leaveList.value = response.data;
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
    applyParams.userId = null;
    applyParams.type = null;
    applyParams.startTime = null;
    applyParams.endTime = null;
    applyParams.info = null;
    leaveTime.value = [];
}
function handleReviewClose(){
    reviewParams.id = null;
    reviewParams.eventUserId = null;
}
async function applyLeave(){
    fullLoading.value = true;
    const response = await request.addLeave(applyParams);
    if (response && response.data.code === 200) {
        proxy.$msg.success(t('leaveList.success'));
        await requestLeave();
        applyDialog.value = false;
    }
    fullLoading.value = false;
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
    requestLeave();
}
const handleUserIdInput = (value) => {
    searchParams.userId = formatIdValue(value);
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
    requestLeave();
}
function handleSortChange(data){
    if(currentIndex.value === '0'){
        pendingParams.sort = getOrder(data.order);
        pendingParams.sortBy = data.column.columnKey;
    }else{
        searchParams.sort = getOrder(data.order);
        searchParams.sortBy = data.column.columnKey;
    }
    requestLeave();
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
    requestLeave();
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
    reviewParams.eventUserId = row.user.id;
    reviewParams.username = row.user.username,
    reviewParams.type = row.type.name,
    reviewParams.startTime = row.startTime,
    reviewParams.endTime = row.endTime,
    reviewParams.createdTime = row.createdTime,
    reviewParams.info = row.info,
    
    reviewDialog.value = true;
}
async function rejectApply(){
    fullLoading.value = true;
    const response = await request.rejectLeave({
        id: reviewParams.id,
        eventUserId: reviewParams.eventUserId
    });
    if (response && response.data.code === 200) {
        proxy.$msg.success(response.data.data);
        await requestLeave();
        reviewDialog.value = false;
    }
    fullLoading.value = false;
}
async function approveApply(){
    fullLoading.value = true;
    const response = await request.acceptLeave({
        id: reviewParams.id,
        eventUserId: reviewParams.eventUserId
    });
    if (response && response.data.code === 200) {
        proxy.$msg.success(response.data.data);
        await requestLeave();
        reviewDialog.value = false;
    }
    fullLoading.value = false;
}
function formatType(row, column, cellValue){
    return t(cellValue);
}
function setLeaveTime(times){
    if(times && times.length === 2){
        applyParams.startTime = formatDateTimeStart(times[0]);
        applyParams.endTime = formatDateTimeEnd(times[1]);
    }
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
</style>