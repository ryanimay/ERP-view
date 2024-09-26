<template>
    <el-main class="homeBodyContainer" v-loading.lock="loading">
        <el-container>
            <el-header height="80px" id="header">
                <span class="header__outter">
                    <span class="header__Block"><el-text size="large" tag="b">{{ $t('logList.search') }}</el-text></span>
                    <span class="header__Block">
                        <el-text size="large" tag="b">{{ $t('logList.username') }}: </el-text>
                        <el-input v-model="requestParam.user" style="width: 200px" clearable/>
                    </span>
                    <span class="header__Block">
                        <el-text size="large" tag="b">{{ $t('logList.status') }}: </el-text>
                        <el-select
                        v-model="requestParam.status"
                        style="width: 100px"
                        :placeholder="$t('logList.all')"
                        :class="'selectedColor__' + selectedColor" 
                        @change="handleChangeColor"
                        >
                        <el-option
                        v-for="item in searchCondition"
                            :key="item.value"
                            :label="$t(item.name)"
                            :value="item.value"
                            :style="{ color: item.color }"
                            />
                        </el-select>
                    </span>
                    <span class="header__Block">
                        <el-text size="large" tag="b">{{ $t('logList.url') }}: </el-text>
                        <el-input v-model="requestParam.url" style="width: 200px" clearable/>
                    </span>
                    <br>
                    <span class="header__inner">
                        <span class="header__Block header__Block--line2">
                            <el-text size="large" tag="b">{{ $t('logList.ip') }}: </el-text>
                            <el-input v-model="requestParam.ip" style="width: 200px" clearable/>
                        </span>
                        <span class="header__Block">
                            <el-text size="large" tag="b">{{ $t('logList.time') }}: </el-text>
                            <el-date-picker
                            v-model="searchTime"
                            type="daterange"
                            :range-separator="$t('logList.to')"
                            :start-placeholder="$t('logList.startDate')"
                            :end-placeholder="$t('logList.endDate')"
                            @change="setTime"/>
                        </span>
                        <span class="header__Block">
                            <el-button type="primary" @click="{
                                requestParam.pageNum = 1;   
                                requestLog()}">
                                <el-icon>
                                    <Search/>
                                </el-icon>
                                {{ $t('logList.search') }}
                            </el-button>
                        </span>
                        <span class="header__Block header__Block--last">
                            <el-text tag="b" class="header__BlockHint">
                                {{ $t('logList.clickToCopy') }}
                            </el-text>
                        </span>
                    </span>
                </span>
            </el-header>
            <el-main class="main__frame">
                <el-table
                    :data="logList"
                    :default-sort="{ prop: 'time', order: 'descending' }"
                    style="width: 100%" :border="true"
                    @sort-change="handleSortChange"
                    :show-overflow-tooltip="true">
                    <el-table-column column-key="status" prop="status" :align="'center'" :label="$t('logList.status')" width="90">
                        <template #default="scope">
                            <el-tag :type="signType(scope.row.status)">{{ $t(signText(scope.row.status)) }}</el-tag>    
                        </template>
                    </el-table-column>
                    <el-table-column prop="user" :label="$t('logList.username')" min-width="130"/>
                    <el-table-column prop="url" :label="$t('logList.url')" min-width="150"/>
                    <el-table-column prop="ip" :label="$t('logList.ip')" min-width="100"/>
                    <el-table-column prop="time" :label="$t('logList.time')" min-width="170" :formatter="formatTime" sortable='custom' sort-by="time"/>
                    <el-table-column prop="params" :label="$t('logList.params')" min-width="150" label-class-name="column__copyTitle" class-name="column__copyColumn">
                        <template #default="scope">
                            <span class="column--copyArea" @click="copyToClipboard(scope.row.params)">
                                <el-text>{{ scope.row.params }}</el-text>    
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="result" :label="$t('logList.result')" min-width="150" label-class-name="column__copyTitle" class-name="column__copyColumn">
                        <template #default="scope">
                            <span class="column--copyArea" @click="copyToClipboard(scope.row.result)">
                                <el-text>{{ scope.row.result }}</el-text>    
                            </span>
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
                :current-page="requestParam.pageNum"
                :total="parseInt(requestParam.totalElements)"
                :page-count="requestParam.totalPage"
                @current-change="handleCurrentChange">
                <span class="footer__font--Bold">
                    <span>{{ $t('paging.total') + ' ' + requestParam.totalElements + $t('paging.totalQuantifier') }}</span>
                    <span id="footer__pageSize">
                        <el-select v-model="requestParam.pageSize" style="width: 110px" @change="handleSizeChange">
                            <el-option v-for="size in sizeOptions"
                                :key="size"
                                :label="size + $t('paging.pageQuantifier')"
                                :value="size"
                            />
                        </el-select>
                    </span>
                </span>
                </el-pagination>
            </el-footer>
        </el-container>
    </el-main>
</template>

<script setup>
import request from '@/config/api/request.js';
import { ref, reactive, onMounted, getCurrentInstance } from 'vue'
import { formatDateTimeStart, formatDateTimeEnd } from '@/config/tool/dateTool.js';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const { proxy } = getCurrentInstance();
const loading = ref(false);
const selectedColor = ref(null);
const logList = ref([]);
const requestParam = reactive({
    user:null,
    status:2,
    url:null,
    ip:null,
    time:null,
    pageNum:null,
    pageSize:null,
    sort: 2,
    sortBy: 'time',
    totalElements:null,
    totalPage:null
})
const searchCondition = [
    {
        "name": "logList.all",
        "value": 2,
        "color": ""
    },{
        "name": "logList.success",
        "value": 1,
        "color": "#67c23a"
    },{
        "name": "logList.failed",
        "value": 0,
        "color": "#f56c6c"
    }
]
const sizeOptions = [10, 30, 50, 100]
const searchTime = ref([]);
onMounted(() => {
    requestLog();
});
async function requestLog(){
    loading.value = true;
    await handleRequestParams();
    const response = await request.logList(requestParam);
    const data = handleResponse(response);
    updatePage(data);
    loading.value = false;
}
function handleRequestParams(){
    requestParam.status = requestParam.status == 2 ? null : requestParam.status;
    requestParam.user = !requestParam.user ? null : requestParam.user.trim();
    requestParam.url = !requestParam.url ? null : requestParam.url.trim();
    requestParam.ip = !requestParam.ip ? null : requestParam.ip.trim();
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
        logList.value = response.data;
        requestParam.pageNum = response.pageNum;
        requestParam.pageSize = response.pageSize;
        requestParam.totalElements = response.totalElements;
        requestParam.totalPage = response.totalPage;
    }
}
function setTime(times){
    if(times && times.length === 2){
        requestParam.startTime = formatDateTimeStart(times[0]);
        requestParam.endTime = formatDateTimeEnd(times[1]);
    }else{
        requestParam.startTime = null;
        requestParam.endTime = null;
    }
}
async function handleSortChange(data){
    loading.value = true;
    requestParam.sort = getOrder(data.order);
    requestParam.sortBy = data.column.columnKey;
    await requestLog();
    loading.value = false;
}
function getOrder(order){
    if(order === 'descending'){
        return 2;
    }else{
        return 1;
    }
}
function signType(type){
    switch (type) {
        case true:
            return 'success';
        case false:
            return 'danger';
        default:
            return 'info';
    }
}
function signText(type){
    switch (type) {
        case true:
            return 'logList.success';
        case false:
            return 'logList.failed';
        default:
            return 'logList.unknown';
    }
}function formatTime(row, column, cellValue){
    return cellValue ? cellValue.replace("T", " ") : cellValue;
}
function handleCurrentChange(page){
    if (requestParam.totalPage === 0) {
        return; // total為0避免重複觸發
    }
    requestParam.pageNum = page;
    requestLog();
}
function handleSizeChange(size){
    requestParam.pageNum = 1;
    requestParam.pageSize = size;
    requestLog();
}
function handleChangeColor(val){
    selectedColor.value = val;
}
function copyToClipboard(params){
    navigator.clipboard.writeText(params)
    .then(() => {
        proxy.$msg.success(t('logList.copyDone'));
    })
    .catch(err => {
        console.log(err);
        proxy.$msg.error(t('logList.copyError'));
    });
}
</script>

<style scoped>
#header{
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.header__Block{
    display: inline-block;
    padding-top: 5px;
    padding-right: 10px;
    height:32px;
}
.header__Block--line2{
    padding-left: 60px;
}
#footer{
    display: flex;
    justify-content: flex-end;
}
.footer__font--Bold{
    font-weight: bold;
}
#footer__pageSize{
    margin-left: 12px;
}
.main__frame{
    max-height: 600px;
}
.header__BlockHint{
    color: #e65c5c !important;
}
.column--copyArea{
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
    height: 100%;
    cursor: crosshair;
    padding: 10.5px 0px;
}
.header__Block--last {
    flex-grow: 1;
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
}
.header__outter{
    width: 100%;
}
.header__inner{
    display: flex;
    align-items: center;
    flex-wrap: nowrap; 
    width: 100%;
}
</style>