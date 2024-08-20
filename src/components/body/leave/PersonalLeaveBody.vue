<template>
    <el-main class="homeBodyContainer" v-loading.lock="loading" v-loading.fullscreen.lock="fullLoading">
        <el-container>
            <el-header id="searchHeader">
                <div>
                    <span>{{ $t('personalLeave.search') }}:</span>
                    <el-date-picker
                    v-model="searchParams.searchTime"
                    type="month"
                    :placeholder="$t('personalLeave.pickMonth')"
                    class="marginLeft12"
                    value-format="YYYY-MM"
                    />
                    <el-button class="marginLeft12" type="primary" @click="loadLeaveList">
                        {{ $t('personalLeave.search') }}
                    </el-button>
                </div>
                <div>
                    <el-button type="danger" @click="openAdd">
                        {{ $t('personalLeave.addLeave') }}
                    </el-button>
                </div>
            </el-header>
            <el-main>
                <el-table
                    :data="leaveList"
                    :default-sort="{ prop: 'id', order: 'ascending' }"
                    style="width: 100%" :border="true"
                    @sort-change="handleSortChange"
                    :show-overflow-tooltip="true">
                    <el-table-column column-key="id" prop="id" :label="$t('personalLeave.col-id')" sortable='custom' min-width="110"/>
                    <el-table-column column-key="userName" prop="user.username" :label="$t('personalLeave.col-username')" min-width="130" />
                    <el-table-column column-key="type" prop="type.name" :label="$t('personalLeave.col-type')" sortable='custom' min-width="130" :formatter="formatType"/>
                    <el-table-column column-key="startTime" prop="startTime" :label="$t('personalLeave.col-startTime')" sortable='custom' min-width="150" :formatter="formatTime"/>
                    <el-table-column column-key="endTime" prop="endTime" :label="$t('personalLeave.col-endTime')" sortable='custom' min-width="150" :formatter="formatTime"/>
                    <el-table-column column-key="createdTime" prop="createdTime" :label="$t('personalLeave.col-createdTime')" sortable='custom' min-width="150" :formatter="formatTime"/>
                    <el-table-column column-key="info" prop="info" :label="$t('personalLeave.col-info')" min-width="160" :align="'center'" />
                    <el-table-column column-key="status" prop="status" :label="$t('personalLeave.col-status')" sortable='custom' min-width="100" :align="'center'" >
                        <template #default="scope">
                            <el-tag effect="dark" :type="statusType(scope.row.status)">{{ formatStatus(scope.row.status) }}</el-tag>    
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('personalLeave.col-edit')" min-width="80" :align="'center'">
                        <template #default="scope">
                            <el-button v-if="scope.row.status === 'Pending'" type="primary" @click="openEdit(scope.row)" >
                                <el-icon>
                                    <EditPen />
                                </el-icon>
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
                :current-page="searchParams.pageNum"
                :total="parseInt(searchParams.totalElements)"
                :page-count="searchParams.totalPage"
                @current-change="handleCurrentChange">
                    <span class="fontBold">
                        <span>{{ $t('personalLeave.total') + ' ' + searchParams.totalElements + $t('personalLeave.totalQuantifier') }}</span>
                        <span class="marginLeft12">
                            <el-select v-model="searchParams.pageSize" style="width: 110px" @change="handleSizeChange">
                                <el-option v-for="size in sizeOptions"
                                    :key="size"
                                    :label="size + $t('personalLeave.pageQuantifier')"
                                    :value="size"
                                />
                            </el-select>
                        </span>
                    </span>
                </el-pagination>
            </el-footer>
        </el-container>
        <!--編輯假單彈窗-->
        <el-dialog v-model="editDialog" :title="isAdd ? $t('personalLeave.addLeave') : $t('personalLeave.editLeave')" width="350" :before-close="handleClose">
            <el-form :model="editParams" label-position="right">
                <el-form-item v-if="!isAdd" :label="$t('personalLeave.col-id')+':'">
                    <el-text size="large">{{ editParams.id }}</el-text>
                </el-form-item>
                <el-form-item :label="$t('personalLeave.col-type')+':'">
                    <el-select v-model="editParams.type" style="width: 180px" ref="editSelectRef">
                        <el-option v-for="leaveType in leaveTypeList"
                            :key="leaveType.id"
                            :label="$t(leaveType.name)"
                            :value="leaveType.id"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('personalLeave.col-time')+':'">
                    <el-date-picker
                    v-model="leaveTime"
                    type="daterange"
                    :range-separator="$t('personalLeave.to')"
                    start-placeholder="Start date"
                    end-placeholder="End date"
                    @change="setLeaveTime"
                    ref="datePickerRef"/>
                </el-form-item>
                <el-form-item :label="$t('personalLeave.col-info')+':'">
                    <el-input v-model="editParams.info" />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button v-if="!isAdd" type="danger" @click="deleteLeave">{{ $t('personalLeave.delete') }}</el-button>
                    <el-button type="primary" @click="saveLeave">{{ $t('personalLeave.submit') }}</el-button>
                </div>
            </template>
        </el-dialog>
    </el-main>
</template>

<script setup>
import request from '@/config/api/request.js';
import { ElMessageBox } from 'element-plus'
import { ref, onMounted, reactive, getCurrentInstance } from 'vue';
import { formatDateTimeStart, formatDateTimeEnd } from '@/config/tool/dateTool.js';
import { useI18n } from 'vue-i18n';
import userStore from '@/config/store/user';

const user = userStore();
const { t } = useI18n();
const { proxy } = getCurrentInstance();
const editSelectRef = ref(null);
const datePickerRef = ref(null);
const isAdd = ref(true);
const loading = ref(false);
const fullLoading = ref(false);
const editDialog = ref(false);
const leaveList = ref([]);
const leaveTime = ref([]);
const leaveTypeList = ref([]);
const searchParams = reactive({
    userId: user.id,
    searchTime: null,
    pageNum:null,
    pageSize:null,
    sort: null,
    sortBy: null,
    totalElements:null,
    totalPage:null
})
const editParams = reactive({
    id: null,
    type: null,
    startTime: null,
    endTime: null,
    info: null
})
const sizeOptions = [10, 30, 50, 100]
onMounted(async () => {
    loading.value = true;
    await loadLeaveList();
    await loadLeaveTypeList();
    loading.value = false;
});
async function loadLeaveList(){
    const response = await request.leaveList(searchParams);
    const data = handleResponse(response);
    leaveList.value = data.data;
    searchParams.pageNum = data.pageNum;
    searchParams.pageSize = data.pageSize;
    searchParams.totalElements = data.totalElements;
    searchParams.totalPage = data.totalPage;
}
async function loadLeaveTypeList(){
    const response = await request.leaveTypeList();
    const data = handleResponse(response);
    leaveTypeList.value = data;
}
function handleResponse(response) {
    if (response && response.data.code === 200) {
        return response.data.data;
    } else {
        return [];
    }
}
function setLeaveTime(times){
    if(times && times.length === 2){
        editParams.startTime = formatDateTimeStart(times[0]);
        editParams.endTime = formatDateTimeEnd(times[1]);
    }
}
function handleSortChange(data){
    loading.value = true;
    searchParams.sort = getOrder(data.order);
    searchParams.sortBy = data.column.columnKey;
    loadLeaveList();
    loading.value = false;
}
function getOrder(order){
    if(order === 'descending'){
        return 2;
    }else{
        return 1;
    }
}
function openAdd(){
    isAdd.value=  true;
    editDialog.value = true;
}
function openEdit(row){
    isAdd.value=  false;
    editParams.id = row.id;
    editParams.type = row.type.id;
    editParams.startTime = row.startTime;
    editParams.endTime = row.endTime;
    leaveTime.value[0] = row.startTime;
    leaveTime.value[1] = row.endTime;
    editParams.info = row.info;
    editDialog.value = true;
}
function handleCurrentChange(page){
    if (searchParams.totalPage === 0) {
        return; // total為0避免重複觸發
    }
    searchParams.pageNum = page;
    loadLeaveList();
}
function handleSizeChange(size){
    searchParams.pageSize = size;
    loadLeaveList();
}
function handleClose(done) {
    ElMessageBox.confirm(t('homeHeader.confirmClose'))
    .then(() => {
        clearDialog();
        done();
    })
    .catch(() => {

    });
}
function clearDialog(){
    leaveTime.value = [];
    editParams.id = null;
    editParams.type = null;
    editParams.startTime = null;
    editParams.endTime = null;
    editParams.info = null;
}
async function saveLeave(){
    if(await checkSave()){
        fullLoading.value = true;
        let response;
        if(isAdd.value){
            response = await request.addLeave(editParams);
        }else{
            response = await request.updateLeave(editParams);
        }

        if (response && response.data.code === 200) {
            proxy.$msg.success(t('personalLeave.success'));
            await loadLeaveList();
            clearDialog();
            editDialog.value = false;
        }
        fullLoading.value = false;
    }
}
async function deleteLeave(){
    fullLoading.value = true;
    let response = await request.deleteLeave({
        id: editParams.id
    });

    if (response && response.data.code === 200) {
        proxy.$msg.success(t('personalLeave.success'));
        await loadLeaveList();
        clearDialog();
        editDialog.value = false;
    }
    fullLoading.value = false;
}
async function checkSave(){
    if(!editParams.type){
        proxy.$msg.error(t('personalLeave.pleaseSelectType'));
        editSelectRef.value.focus();
        return false;
    }else if(leaveTime.value.length !== 2){
        proxy.$msg.error(t('personalLeave.pleaseSelectTime'));
        datePickerRef.value.focus();
        return false;
    }
    return true;
}
function formatTime(row, column, cellValue){
    return cellValue ? cellValue.replace("T", " ") : cellValue;
}
function formatType(row, column, cellValue){
    return t(cellValue);
}
function formatStatus(status){
    return status ? t('personalLeave.' + status) : status;
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
</script>

<style scope>
#footer{
    display: flex;
    justify-content: flex-end;
}
#searchHeader{
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.fontBold{
    font-weight: bold;
}
.marginLeft12{
    margin-left: 12px;
}
</style>