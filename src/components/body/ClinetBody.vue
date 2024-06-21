<template>
    <el-main class="homeBodyContainer" v-loading.fullscreen.lock="loading">
        <el-container>
            <el-header>
                <div>header</div>
            </el-header>
            <el-main>
                <el-table
                    :data="clientList"
                    :default-sort="{ prop: 'id', order: 'ascending' }"
                    style="width: 100%" :border="true"
                    @sort-change="handleSortChange">
                    <el-table-column prop="id" label="ID" sortable='custom' width="65"/>
                    <el-table-column prop="username" :label="$t('clientBody.col-username')" width="200"/>
                    <el-table-column prop="email" :label="$t('clientBody.col-email')" min-width="220"/>
                    <el-table-column prop="department.name" :label="$t('clientBody.col-departmentName')" sortable='custom' width="170" />
                    <el-table-column prop="lastLoginTime" :label="$t('clientBody.col-lastLoginTime')" sortable='custom' width="170" :formatter="formatTime2"/>
                    <el-table-column prop="createTime" :label="$t('clientBody.col-createTime')" sortable='custom' width="170" :formatter="formatTime1"/>
                    <el-table-column prop="attendStatus" :label="$t('clientBody.col-attendStatus')" width="120" sortable='custom' :align="'center'" sort-by="attendStatus">
                        <template #default="scope">
                            <el-tag :type="signType(scope.row.attendStatus)">{{ $t(signText(scope.row.attendStatus)) }}</el-tag>    
                        </template>
                    </el-table-column>
                    <el-table-column prop="active" :label="$t('clientBody.col-active')" sortable='custom' width="120" :align="'center'" sort-by="active" >
                        <template #default="scope">
                            <el-tag :type="statusType(scope.row.active)">{{ $t(statusText1(scope.row.active)) }}</el-tag>    
                        </template>
                    </el-table-column>
                    <el-table-column prop="lock" :label="$t('clientBody.col-lock')" sortable='custom' width="120" :align="'center'" sort-by="lock" >
                        <template #default="scope">
                            <el-tag :type="statusType(!scope.row.lock)">{{ $t(statusText2(scope.row.lock)) }}</el-tag>    
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('clientBody.col-edit')" width="90" :align="'center'">
                        <template #default="scope">
                            <el-button type="primary" @click="openEdit(scope.row)">
                                Eidt
                            </el-button>
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
                <span class="fontBold">
                    <span>{{ $t('clientBody.total') + ' ' + requestParam.totalElements + $t('clientBody.totalQuantifier')}}</span>
                    <span id="marginLeft12">
                        <el-select v-model="requestParam.pageSize" style="width: 110px" @change="handleSizeChange">
                            <el-option v-for="size in sizeOptions"
                                :key="size"
                                :label="size + $t('clientBody.pageQuantifier')"
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
import { ref, onMounted, reactive } from 'vue';
const loading = ref(false);
const clientList = ref([]);
const requestParam = reactive({
    type: null,
    id: null,
    name: null,
    pageNum:null,
    pageSize:null,
    sort: null,
    sortBy: null,
    totalElements:null,
    totalPage:null
})
const sizeOptions = [15, 30, 50, 100]
onMounted(async () => {
    loading.value = true;
    var response = await requestClientList();
    clientList.value = response.data;
    updatePage(response);
    loading.value = false;
});
async function requestClientList() {
    const response = await request.clientList(requestParam);
    return handleResponse(response);
}
function handleResponse(response) {
    if (response && response.data.code === 200) {
        return response.data.data;
    } else {
        return [];
    }
}
function updatePage(response){
    requestParam.pageNum = response.pageNum;
    requestParam.pageSize = response.pageSize;
    requestParam.totalElements = response.totalElements;
    requestParam.totalPage = response.totalPage;
}
function formatTime(time){
    return time.replace("T", " ")
}
function formatTime1(cellValue){
    return formatTime(cellValue.createTime);
}
function formatTime2(cellValue){
    return formatTime(cellValue.lastLoginTime);
}
function signType(type){
    switch (type) {
        case 1:
            return 'danger';
        case 2:
            return 'success';
        case 3:
            return 'warning';
        default:
            return '';
    }
}
function signText(type){
    switch (type) {
        case 1:
            return 'homeHeader.signText.noPunch';
        case 2:
            return 'homeHeader.signText.punch';
        case 3:
            return 'homeHeader.signText.clockOut';
        default:
            return '';
    }
}
function statusType(status){
    if(status === true){
        return 'primary';
    }else{
        return 'info';
    }
}
function statusText1(status){
    if(status === true){
        return 'clientBody.active.true';
    }else{
        return 'clientBody.active.false';
    }
}
function statusText2(status){
    if(status === true){
        return 'clientBody.lock.true';
    }else{
        return 'clientBody.lock.false';
    }
}
async function handleCurrentChange(page){
    loading.value = true;
    requestParam.pageNum = page;
    var response = await requestClientList();
    clientList.value = response.data;
    updatePage(response);
    loading.value = false;
}
async function handleSizeChange(size){
    loading.value = true;
    requestParam.pageSize = size;
    var response = await requestClientList();
    clientList.value = response.data;
    updatePage(response);
    loading.value = false;
}
async function handleSortChange(data){
    loading.value = true;
    requestParam.sort = getOrder(data.order);
    requestParam.sortBy = data.prop.split('.')[0];
    var response = await requestClientList();
    clientList.value = response.data;
    updatePage(response);
    loading.value = false;
}
function getOrder(order){
    if(order === 'descending'){
        return 2;
    }else{
        return 1;
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
#marginLeft12{
    margin-left: 12px;
}
</style>