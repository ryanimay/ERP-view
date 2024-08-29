<template>
    <el-main class="homeBodyContainer" v-loading.fullscreen.lock="fullLoading">
        <el-container class="height100">
            <el-header height="70">
                <div class="width100 alignCenter paddingBottom10">
                    <span class="marginRight10">
                        <el-text size="large">{{ $t('procureList.procureId') }}: </el-text>
                        <el-input v-model="searchParams.id" @input="handleUserIdInput" 
                        clearable
                        style="width: 105px"
                        :placeholder="$t('procureList.inputProcureId')"/>
                    </span>
                    <span class="marginRight10">
                        <el-text size="large">{{ $t('procureList.name') }}: </el-text>
                        <el-input v-model="searchParams.name"
                        clearable
                        style="width: 150px"
                        :placeholder="$t('procureList.inputName')"/>
                    </span>
                    <span>
                        <el-text size="large">{{ $t('procureList.status') }}: </el-text>
                        <el-select v-model="searchParams.status" :placeholder="$t('procureList.All')" style="width: 120px">
                            <el-option v-for="status in allStatusOptions"
                                :key="status.key"
                                :label="$t('procureList.' + status.name)"
                                :value="status.key"
                            />
                        </el-select>
                    </span>
                </div>
                <div class="width100 alignCenter flexBetween">
                    <span>
                        <span class="marginRight10">
                            <el-text size="large">{{ $t('procureList.createTime') }}: </el-text>
                            <el-date-picker
                            v-model="searchTime"
                            type="daterange"
                            :range-separator="$t('procureList.to')"
                            :start-placeholder="$t('procureList.startTime')"
                            :end-placeholder="$t('procureList.endTime')"
                            @change="setTime"/>
                        </span>
                        <span>
                            <el-button type="primary" @click="searchProcure()">
                                <el-icon>
                                    <Search />
                                </el-icon>  
                                {{ $t('procureList.search') }}
                            </el-button>
                        </span>
                    </span>
                    <span>
                        <el-button @click="addDialog = true" type="primary">
                            {{$t('procureList.addNewProcure')}}
                        </el-button>
                    </span>
                </div>
            </el-header>
            <el-main class="height100" id="tabTable">
                <el-tabs v-model="searchParams.type" type="border-card" @tab-change="handleClick" style="height: calc(100% - 2px); min-height: 200px;">
                    <el-tab-pane v-for="item in typeList" :key="item.name" :label="$t(item.label)" :name="item.name" v-loading.lock="loading"  style="height: 100%;">
                        <el-table
                        row-key="id"
                        :data="procureList"
                        style="width: 100%;" 
                        :show-overflow-tooltip="true"
                        :highlight-current-row="true"
                        @sort-change="handleSortChange"
                        height="100%">
                            <el-table-column column-key="id" prop="id" :label="$t('procureList.id')" width="60" :align="'center'" sortable='custom'/>
                            <el-table-column prop="name" :label="$t('procureList.name')" min-width="110">
                                <template #default="scope">
                                    <div class="el-input" v-if="scope.row.isEdit" >
                                        <div class="el-input__wrapper">
                                            <input class="el-input__inner" v-model.lazy="scope.row.name" :ref="el => inputNameRef[scope.$index] = el"/>
                                        </div>
                                    </div>
                                    <el-text v-else>{{scope.row.name}}</el-text>
                                </template>
                            </el-table-column>
                            <el-table-column column-key="count" prop="count" :label="$t('procureList.count')" min-width="100" :align="'center'" sortable='custom'>
                                <template #default="scope">
                                    <el-input-number v-if="scope.row.isEdit" v-model.lazy="scope.row.count" :precision="0" :step="1" :min="0" size="small" style="width: 70px"/>
                                    <el-text v-else>{{ scope.row.count }}</el-text>
                                </template>
                            </el-table-column>
                            <el-table-column column-key="price" prop="price" :label="$t('procureList.price')" min-width="130" sortable='custom'>
                                <template #default="scope">
                                    <div class="el-input" v-if="scope.row.isEdit" >
                                        <div class="el-input__wrapper">
                                            <input class="el-input__inner" v-model.lazy="scope.row.price" @input="handlePriceInput"/>
                                        </div>
                                    </div>
                                    <el-text v-else>{{ '$' + scope.row.price }}</el-text>
                                </template>
                            </el-table-column>
                            <el-table-column :label="$t('procureList.total')" min-width="130">
                                <template #default="scope">
                                    <el-text>{{ '$' + (scope.row.count * scope.row.price).toFixed(2) }}</el-text>
                                </template>
                            </el-table-column>
                            <el-table-column prop="info" :label="$t('procureList.info')" min-width="110" >
                                <template #default="scope">
                                    <div class="el-input" v-if="scope.row.isEdit" >
                                        <div class="el-input__wrapper">
                                            <input class="el-input__inner" v-model.lazy="scope.row.info" />
                                        </div>
                                    </div>
                                    <el-text v-else>{{scope.row.info}}</el-text>
                                </template>
                            </el-table-column>
                            <el-table-column column-key="createTime" prop="createTime" :label="$t('procureList.createTime')" sortable='custom' min-width="180" width="180" :formatter="formatTime"/>
                            <el-table-column column-key="createBy" prop="createBy.username" :label="$t('procureList.createBy')" min-width="110" />
                            <el-table-column :label="$t('procureList.status')" min-width="130" :align="'center'" >
                                <template #default="scope">
                                    <el-select v-if="scope.row.isEdit" v-model="scope.row.status" style="width: 100px" size="small">
                                        <el-option v-for="status in statusOptions"
                                            :key="status.key"
                                            :label="$t('procureList.' + status.name)"
                                            :value="status.key"
                                        />
                                    </el-select>
                                    <el-tag 
                                    v-else
                                    plain
                                    size="small" 
                                    :type="statusType(scope.row.status)">{{ formatStatus(scope.row.status) }}
                                    </el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column :label="$t('procureList.edit')" width="60" :align="'center'">
                                <template #default="scope">
                                    <el-button 
                                    v-if="scope.row.isEdit" 
                                    type="primary"
                                    circle 
                                    @click="saveRow(scope)" >
                                        <el-icon>
                                            <Upload />
                                        </el-icon>
                                    </el-button>
                                    <el-button 
                                    v-if="!scope.row.isEdit && scope.row.status !== 3" 
                                    circle 
                                    :disabled="scope.row.status === 3"
                                    @click="scope.row.isEdit = true" >
                                        <el-icon>
                                            <Edit />
                                        </el-icon>
                                    </el-button>
                                </template>
                            </el-table-column>
                            <el-table-column :label="$t('procureList.delete')" width="70" :align="'center'">
                                <template #default="scope">
                                    <el-popconfirm 
                                    :title="$t('procureList.deleteWarning')" 
                                    :confirm-button-text="$t('procureList.deleteSubmit')"
                                    :cancel-button-text="$t('procureList.deleteCancel')"
                                    @confirm="deleteRow(scope)"
                                    width="220">
                                        <template #reference>
                                            <el-button type="danger" circle plain>
                                                <el-icon>
                                                    <Close />
                                                </el-icon>
                                            </el-button>
                                        </template>
                                    </el-popconfirm>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                </el-tabs>
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
            </el-footer>
        </el-container>
        <!--新增專案-->
        <el-dialog v-model="addDialog" :title="$t('procureList.addNewProcure')" width="300" @close="closeAdd">
            <el-form :model="addProcureModel" label-position="right">
                <el-form-item :label="$t('procureList.type')+' ('+$t('procureList.type1')+'/'+$t('procureList.type2')+'):'">
                    <el-select v-model="addProcureModel.type" style="width: 100px" >
                        <el-option v-for="t in typeList"
                            :key="t.name"
                            :label="$t(t.label)"
                            :value="t.name"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('procureList.name')+':'">
                    <el-input v-model="addProcureModel.name" style="width: 200px"/>
                </el-form-item>
                <el-form-item :label="$t('procureList.price')+':'">
                    <div class="el-input" style="width: 100px">
                        <div class="el-input__wrapper">
                            <input class="el-input__inner" v-model="addProcureModel.price" @input="handlePriceInput"/>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item :label="$t('procureList.count')+':'">
                    <el-input-number v-model="addProcureModel.count" :precision="0" :step="1" :min="0" style="width: 100px"/>
                </el-form-item>
                <el-form-item :label="$t('procureList.info')+':'">
                    <el-input type="textarea" v-model="addProcureModel.info" />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="addNewProcure">{{ $t('procureList.submit') }}</el-button>
                </div>
            </template>
        </el-dialog>
    </el-main>
</template>

<script setup>
import request from '@/config/api/request.js';
import { ref, onMounted, reactive, getCurrentInstance } from 'vue'
import { useI18n } from 'vue-i18n';
import { formatDateTimeStart, formatDateTimeEnd } from '@/config/tool/dateTool.js';

const { t } = useI18n();
const { proxy } = getCurrentInstance();
const loading = ref(false);
const fullLoading = ref(false);
const addDialog = ref(false);
const searchTime = ref([]);
const procureList = ref([]);
const inputNameRef = ref([]);
const sizeOptions = [10, 30, 50, 100]
//1.待執行 2.已執行 3.已結算
const statusOptions = [
{name: "pending", key: 1},
{name: "approved", key: 2},
{name: "done", key: 3}
]
const allStatusOptions = [{ name: "All", key: 0 }, ...statusOptions]
const searchParams = reactive({
    id: null,
    type: 1,//默認搜IN
    name:null,
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
const currentProcure = reactive({
    id: null,
    name: null,
    price: null,
    count: null,
    info: null,
    status: null,
})
const addProcureModel = reactive({
    type: 1,
    name: null,
    price: null,
    count: 0,
    info: null
})
const typeList = [
    {
        "label":"procureList.type1",
        "name": 1
    },
    {
        "label":"procureList.type2",
        "name": 2
    }
];
onMounted(async () => {
    loading.value = true;
    await requestProcurement();
    loading.value = false;
});
function searchProcure(){
    if(searchTime.value && searchTime.value.length === 2){
        searchParams.startTime = formatDateTimeStart(searchTime.value[0]);
        searchParams.endTime = formatDateTimeEnd(searchTime.value[1]);
    }else{
        searchParams.startTime = null;
        searchParams.endTime = null;
    }
    requestProcurement();
}
async function requestProcurement() {
    loading.value = true;
    const response = await request.procureList(searchParams);
    if (response && response.data.code === 200) {
        const responseData = response.data.data;
        procureList.value = responseData.data;
        searchParams.pageNum = responseData.pageNum;
        searchParams.pageSize = responseData.pageSize;
        searchParams.totalElements = responseData.totalElements;
        searchParams.totalPage = responseData.totalPage;
    }
    loading.value = false;
}
async function updateProcure() {
    loading.value = true;
    const response = await request.updateProcure(currentProcure);
    if (response && response.data.code === 200) {
        proxy.$msg.success(response.data.data);
        loading.value = false;
        return true;
    }
    loading.value = false;
}
async function handleClick(){
    inputNameRef.value = [];//陣列歸零
    await requestProcurement();
}
function saveRow(scope){
    if(checkEditName(scope)){
        currentProcure.id = scope.row.id;
        currentProcure.name = scope.row.name;
        currentProcure.price = scope.row.price;
        currentProcure.count = scope.row.count;
        currentProcure.info = scope.row.info;
        currentProcure.status = scope.row.status;
        const rs = updateProcure();
        if(rs){
            //更新成功關閉編輯
            scope.row.isEdit = false;
        }
    }
}
async function deleteRow(scope){
    loading.value = true;
    const response = await request.deleteProcure({id: scope.row.id});
    if (response && response.data.code === 200) {
        proxy.$msg.success(response.data.data);
        procureList.value = procureList.value.filter(item => item.id !== scope.row.id);
        searchParams.totalElements--;
        searchParams.totalPage = Math.ceil(searchParams.totalElements / searchParams.pageSize);
    }
    loading.value = false;
}
function checkEditName(scope){
    if(scope.row.name && scope.row.name.trim()){
        return true;
    }
    proxy.$msg.error(t('procureList.pleaseInputName'));
    inputNameRef.value[scope.$index].focus();
    return false;
}
function formatStatus(status){
    const s = statusOptions.find(option => option.key === status);
    return s ? t('procureList.' + s.name) : status;
}
function statusType(status){
    switch (status) {
    case 1:
      return "warning";
    case 2:
      return "success";
    case 3:
      return "info";
    default:
      return "danger";
  }
}
function closeAdd(){
    addProcureModel.type = 1;
    addProcureModel.name = null;
    addProcureModel.price = null;
    addProcureModel.count = 0;
    addProcureModel.info = null;
}
const handlePriceInput = (event) => {
    let value = event.target.value;
    value = value.replace(/[^\d.]/g, '');
    if (value.indexOf('.') !== -1) {
        value = value.split('.').slice(0, 2).join('.');
    }
    if (value.startsWith('.')) {
        value = '0' + value;
    }else if(value.startsWith('0')){
        value = value.replace(/^0+/, '');
    }
    
    event.target.value = value ? value : 0;
};
const handleUserIdInput = (value) => {
    searchParams.id = formatIdValue(value);
};
function formatIdValue(value){
    let formattedValue = value.replace(/[^\d]/g, ''); // 只保留数字
    if (formattedValue > 9999) formattedValue = 9999; // 限制最大值为9999
    return formattedValue;
}
function setTime(times){
    if(times && times.length === 2){
        searchParams.startTime = formatDateTimeStart(times[0]);
        searchParams.endTime = formatDateTimeEnd(times[1]);
    }
}
function formatTime(row, column, cellValue){
    return cellValue ? cellValue.replace("T", " ") : cellValue;
}
function handleCurrentChange(page){
    if (searchParams.totalPage === 0) {
        return; // total為0避免重複觸發
    }
    searchParams.pageNum = page;
    requestProcurement();
}
function handleSizeChange(size){
    searchParams.pageSize = size;
    requestProcurement();
}
function handleSortChange(data){
    searchParams.sort = getOrder(data.order);
    searchParams.sortBy = data.column.columnKey;
    requestProcurement();
}
function getOrder(order){
    if(order === 'descending'){
        return 2;
    }else{
        return 1;
    }
}
async function addNewProcure(){
    fullLoading.value = true;
    const response = await request.addProcure(addProcureModel);
    if (response && response.data.code === 200) {
        proxy.$msg.success(response.data.data);
        addDialog.value = false;
        await requestProcurement();
    }
    fullLoading.value = false;
}
</script>

<style scoped>
.height100{
    height: 100%;
}
.width100{
    width: 100%;
}
.alignCenter{
    display: flex;
    align-items: center;
}
.marginRight10{
    margin-right: 10px;
}
.marginLeft12{
    margin-left: 12px;
}
.paddingBottom10{
    padding-bottom: 10px;
}
.flexBetween{
    display: flex;
    justify-content: space-between;
}
#tabTable{
    overflow: auto;
}
#footer{
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
}
</style>