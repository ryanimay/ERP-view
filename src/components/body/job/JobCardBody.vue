<template>
    <el-main class="homeBodyContainer" v-loading.lock="loading" v-loading.fullscreen.lock="fullLoading">
        <el-row :gutter="20" class="height100 row-nowrap paddingAlign10">
            <!-- tracking追蹤清單 -->
            <el-col :span="6" class="jobCard minWidth360">
                <el-card class="shadow height100" :body-style="{ padding: '0' }">
                    <template #header>
                        <div>
                            <el-text tag="b">{{ $t('jobCard.tracking') + '(' + (jobModel['tracking'] ? jobModel['tracking'].length : 0) + ')' }}</el-text>
                        </div>
                    </template>
                    <el-scrollbar>
                        <el-card 
                        v-for="job in jobModel['tracking']"
                        :key="job.id"
                        :body-style="{ 
                            height: '130px',
                            padding: '10px'
                        }"
                        class="innerCard"
                        body-class="cardHoverShadow"
                        shadow="hover">
                            <el-row style="height: 20px">
                                <el-col :span="24">
                                    <el-text tag="b" size="small">{{ $t('jobCard.info')+':' }}</el-text>
                                </el-col>
                            </el-row>
                            <el-row style="height: 60px" class="infoBlock">
                                <el-scrollbar>
                                    <el-col :span="24" class="text-overflow text-normal">
                                        <el-text>{{ job.info }}</el-text>
                                    </el-col>
                                </el-scrollbar>
                            </el-row>
                            <el-row style="height: 30px">
                                <el-col :span="12" class="text-overflow text-nowrap card__text--alignCenter">
                                    <el-text tag="b" size="small">{{ $t('jobCard.startTime')+':' }}</el-text>
                                    <el-text tag="b" size="small">{{ formatTime(job.startTime) }}</el-text>
                                </el-col>
                                <el-col :span="12" class="text-overflow text-nowrap card__text--alignCenter">
                                    <el-text tag="b" size="small">{{ $t('jobCard.endTime')+':' }}</el-text>
                                    <el-text tag="b" size="small">{{ formatTime(job.endTime) }}</el-text>
                                </el-col>
                            </el-row>
                            <el-row style="height: 30px">
                                <el-col :span="18">
                                    <el-tooltip v-if="job.trackingSet.length !== 0" placement="top-start">
                                        <template #content>
                                            <el-scrollbar max-height="70px" style="max-width:200px;">
                                                    <el-tag v-for="tracker in job.trackingSet" :key="tracker.id" type="info" size="small" style="margin-right: 5px;">
                                                        {{ tracker.username }}
                                                    </el-tag>
                                            </el-scrollbar>
                                        </template>
                                        <el-button icon="Fold" size="small" type="info">{{ $t('jobCard.tracker') }}</el-button>
                                    </el-tooltip>
                                    <el-text style="margin-left: 5px;" tag="b" size="small">{{ $t('jobCard.username')+':' }}</el-text>
                                    <el-text tag="b" size="small">{{ job.user.username }}</el-text>
                                </el-col>
                                <el-col :span="6" class="card__tag--rignt">
                                    <el-tag effect="dark" :type="handleStatusType(job.status)">
                                        {{ $t('jobCard.' + job.status) }}
                                    </el-tag>
                                </el-col>
                            </el-row>
                        </el-card>
                    </el-scrollbar>
                </el-card>
            </el-col>
            <!-- Pending、Approved、Closed三種清單 -->
            <el-col v-for="(statusName) in statusCode"
            :key="statusName"
            :id="statusName"
            :span="6" 
            class="jobCard minWidth360">
                <!-- sortablejs拖曳會和element-plus預設css衝突，要拖曳的範圍內設--el-transition-duration': '0s' -->
                <el-card class="shadow height100" :body-style="{ padding: '0' }" :style="{ '--el-transition-duration': '0s' }">
                    <template #header>
                        <div v-if="statusName === 'Pending'" class="card__header--spaceBetween">
                            <el-text tag="b">{{ $t('jobCard.Pending') + '(' + (jobModel['Pending'] ? jobModel['Pending'].length : 0) + ')' }}</el-text>
                            <el-button style="height: 16px; width: 16px;" icon="Plus" @click="addNewJob()" plain circle type="primary"/>
                        </div>
                        <div v-else>
                            <el-text tag="b">{{ $t('jobCard.'+statusName) + '(' + (jobModel[statusName] ? jobModel[statusName].length : 0) + ')' }}</el-text>
                        </div>
                    </template>
                    <el-scrollbar 
                    :view-class="'draggable' + statusName"
                    :id="'id'+statusName"
                    :view-style="{ 
                        height: '99%', 
                        width: '100%', 
                        }">
                        <el-card 
                        v-for="(job, index) in jobModel[statusName]"
                        :key="job.id + ':' + index"
                        :body-style="{ 
                            height: '130px',
                            padding: '10px'
                        }"
                        :id="job.id"
                        :class="job.newAdd ? 'newInnerCard' : 'innerCard'"
                        body-class="cardHoverShadow"
                        shadow="hover">
                            <el-row style="height: 20px">
                                <el-col :span="24" class="card__header--spaceBetween">
                                    <el-text tag="b" size="small">{{ $t('jobCard.info')+':' }}</el-text>
                                    <el-icon v-if="!job.newAdd" size="14" class="handle"><Rank /></el-icon>
                                </el-col>
                            </el-row>
                            <el-row v-if="job.isEdit" style="height: 60px">
                                <el-col :span="24">
                                    <el-input
                                        v-model="job.info" 
                                        resize="none"
                                        style="width: 100%;"
                                        :input-style="{
                                            height: '60px',
                                            padding: '5px'
                                        }"
                                        :rows="3"
                                        type="textarea"
                                    />
                                </el-col>
                            </el-row>
                            <el-row v-else style="height: 60px" class="infoBlock">
                                <el-scrollbar>
                                    <el-col :span="24" class="text-overflow text-normal">
                                        <el-text>{{ job.info }}</el-text>
                                    </el-col>
                                </el-scrollbar>
                            </el-row>
                            <el-row style="height: 30px">
                                <el-col :span="12" class="text-overflow text-nowrap card__text--alignCenter">
                                    <el-text tag="b" size="small">{{ $t('jobCard.startTime')+':' }}</el-text>
                                    <el-date-picker
                                        v-if="job.isEdit"
                                        v-model="job.startTime"
                                        size="small"
                                        type="date"
                                        format="YYYY-MM-DD"
                                        value-format="YYYY-MM-DD"
                                        style="width:100%"/>
                                    <el-text v-else tag="b" size="small">{{ formatTime(job.startTime) }}</el-text>
                                </el-col>
                                <el-col :span="12" class="text-overflow text-nowrap card__text--alignCenter">
                                    <el-text tag="b" size="small">{{ $t('jobCard.endTime')+':' }}</el-text>
                                    <el-date-picker
                                        v-if="job.isEdit"
                                        v-model="job.endTime"
                                        size="small"
                                        type="date"
                                        format="YYYY-MM-DD"
                                        value-format="YYYY-MM-DD"
                                        style="width:100%"/>
                                    <el-text v-else tag="b" size="small">{{ formatTime(job.endTime) }}</el-text>
                                </el-col>
                            </el-row>
                            <el-row style="height: 30px">
                                <el-col :span="18" class="text-overflow text-nowrap">
                                    <span v-if="!job.newAdd">
                                        <el-tooltip v-if="job.trackingSet && job.trackingSet.length !== 0" placement="top-start">
                                            <template #content>
                                                <el-scrollbar max-height="70px" style="max-width:200px;">
                                                    <el-tag v-for="tracker in job.trackingSet" :key="tracker.id" type="info" size="small" style="margin-right: 5px;">
                                                        {{ tracker.username }}
                                                    </el-tag>
                                                </el-scrollbar>
                                            </template>
                                            <el-button 
                                            :icon="job.trackHover ? 'Plus' : 'Fold'"
                                            size="small" 
                                            :type="job.trackHover ? 'primary' : 'info'"
                                            @mouseenter="job.trackHover = true"
                                            @mouseleave="job.trackHover = false"
                                            @click="openTrackingDialog(job)">
                                                {{ $t('jobCard.tracker') }}
                                            </el-button>
                                        </el-tooltip>
                                        <el-button 
                                        v-else
                                        :icon="job.trackHover ? 'Plus' : 'Fold'"
                                        size="small" 
                                        :type="job.trackHover ? 'primary' : 'info'"
                                        @mouseenter="job.trackHover = true"
                                        @mouseleave="job.trackHover = false"
                                        @click="openTrackingDialog(job)">
                                            {{ $t('jobCard.tracker') }}
                                        </el-button>
                                    </span>
                                    <span v-else style="width: 79.23px; height: 1px; display: inline-block;"></span>
                                    <el-text style="margin-left: 5px;" tag="b" size="small">{{ $t('jobCard.username')+':' }}</el-text>
                                    <el-select
                                    v-if="job.isEdit" 
                                    v-model="job.user.id" 
                                    :placeholder="$t('jobCard.selectUser')" 
                                    size="small"
                                    :ref="'select' + job.id"
                                    style="width: calc(100% - 140px);"
                                    @change="(val) => updateJobUser(job.user, val)">
                                        <el-option v-for="client in clientNameList"
                                            :key="client.id"
                                            :label="client.username"
                                            :value="client.id"
                                        />
                                    </el-select>
                                    <el-text v-else tag="b" size="small">{{ job.user.username }}</el-text>
                                </el-col>
                                <el-col v-if="job.newAdd" :span="6">
                                    <el-button @click="addJobModel(job, index)" icon="Download" type="info" circle size="small"/>
                                </el-col>
                                <el-col v-else-if="statusName === 'Closed'" :span="6" class="card__tag--rignt">
                                    <el-tag effect="dark" type="primary">
                                        {{ $t('jobCard.Closed') }}
                                    </el-tag>
                                </el-col>
                                <el-col v-else :span="6" class="card__tag--rignt">
                                    <el-button v-if="!job.isEdit" @click="job.isEdit=true" icon="Edit" type="info" plain circle size="small"/>
                                    <el-button v-else @click="updateJobModel(job, index)" icon="Download" type="info" circle size="small"/>
                                    <el-button @click="confirmDelete(job.id)" icon="Delete" type="danger" circle size="small" style="margin-left: 5px;"/>
                                    <el-button @click="jobStatusClick(job.id, index, statusName, getNextStatus(statusName))" :icon="getStatusIcon(statusName)" :type="handleStatusType(statusName)" circle size="small" style="margin-left: 5px;"/>
                                </el-col>
                            </el-row>
                        </el-card>
                    </el-scrollbar>
                </el-card>
            </el-col>
        </el-row>
        <!--編輯追蹤名單-->
        <el-dialog v-model="trackingDialog" :title="$t('jobCard.editTracking')" width="600" @close="closeTrackingDialog">
            <el-transfer 
            style="border: 1px solid #bbbbbb;"
            filterable 
            v-model="jobRequest.idSet" 
            :props="{
                key: 'id',
                label: 'username',
                }" 
            :data="clientNameList"
            :titles="[$t('jobCard.untracked'), $t('jobCard.tracking')]"
            />
            <div class="card__trackingDialog--textRignt">
                <el-button type="primary" @click="updateJobTracking">{{ $t('jobCard.save') }}</el-button>
            </div>
        </el-dialog>
    </el-main>
</template>

<script setup>
import request from '@/config/api/request.js';
import { ref, onMounted, reactive, getCurrentInstance } from 'vue'
import userStore from '@/config/store/user';
import { useI18n } from 'vue-i18n';
import { ElMessageBox } from 'element-plus'
import {Sortable} from 'sortablejs';

const { t } = useI18n();
const user = userStore();
const { proxy } = getCurrentInstance();
const jobModel = ref([]);
const clientNameList = ref([]);
const currentTrackingSet = ref([]);
const orderRequest = ref([]);
const loading = ref(false);
const fullLoading = ref(false);
const trackingDialog = ref(false);
const inNewAdd = ref(false);
const statusCode = [
    "Pending",
    "Approved",
    "Closed"
]
const jobRequest = reactive({
    id:null,
    info:null,
    userId:null,
    startTime:null,
    endTime:null,
    status:null,
    order:null,
    idSet:null
});
onMounted(async () => {
    loading.value = true;
    await requestJob();
    await loadClientNameList();
    await setSort();
    loading.value = false;
});
async function loadClientNameList() {
    const response = await request.clientNameList();
    const data = handleResponse(response);
    clientNameList.value = data;
}
async function requestJob(){
    const response = await request.jobList();
    if (response && response.data.code === 200) {
        const responseData = response.data.data;
        jobModel.value = responseData;
    }
}
function handleResponse(response) {
    if (response && response.data.code === 200) {
        return response.data.data;
    } else {
        return [];
    }
}
function handleStatusType(status){
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
function formatTime(time){
    return time ? String(time).replace('T', '') : '';
}
function updateJobUser(user, val){
    const selectedUser = this.clientNameList.find(client => client.id === val);
    if (selectedUser && user) {
        user.username = selectedUser.username;
    }
}
function openTrackingDialog(job){
    currentTrackingSet.value = job.trackingSet;
    jobRequest.id = job.id;
    jobRequest.idSet = job.trackingSet.map(item => item.id);
    trackingDialog.value = true;
}
function closeTrackingDialog(){
    currentTrackingSet.value = [];
    jobRequest.id = null;
    jobRequest.idSet = [];
}
async function updateJobTracking(){
    fullLoading.value = true;
    const response = await updateJobRequest();
    if (response && response.data.code === 200) {
        proxy.$msg.success(t('jobCard.success'));
        await requestJob();
        trackingDialog.value = false;
    }
    fullLoading.value = false;
}
async function updateJobRequest(){
    return await request.updateJob(jobRequest);
}
async function updateJobModel(job, index){
    if(checkSave(job)){
        loading.value = true;
        jobRequest.id = job.id;
        jobRequest.info = job.info;
        jobRequest.userId = job.user.id;
        jobRequest.startTime = job.startTime ? job.startTime : null;
        jobRequest.endTime = job.endTime ? job.endTime : null;
        jobRequest.status = getStatusCode(job.status);
        jobRequest.order = index;
        jobRequest.idSet = null;//這邊不更新
        const response = await updateJobRequest();
        if (response && response.data.code === 200) {
            proxy.$msg.success(t('jobCard.success'));
            job.isEdit = false;
            inNewAdd.value = false;
            await requestJob();
        }
        loading.value = false;
    }
}
async function addJobModel(job, index){
    if(checkSave(job)){
        loading.value = true;
        jobRequest.id = null;
        jobRequest.info = job.info;
        jobRequest.userId = job.user.id;
        jobRequest.startTime = job.startTime ? job.startTime : null;
        jobRequest.endTime = job.endTime ? job.endTime : null;
        jobRequest.status = job.status;
        jobRequest.order = index;
        jobRequest.idSet = [user.id];//默認新增人追蹤
        const response = await request.addJob(jobRequest);
        if (response && response.data.code === 200) {
            proxy.$msg.success(response.data.data);
            job.isEdit = false;
            inNewAdd.value = false;
            await requestJob();
        }
        loading.value = false;
    }
}
function checkSave(job){
    if(!job.user || !job.user.id){
        const firstSelect = proxy.$refs['select' + job.id][0];
            if (firstSelect) {
                firstSelect.focus();
            }
            proxy.$msg.error(t('jobCard.pleaseSelectUser'));
        return false;
    }
    return true;
}
function getStatusCode(status){
    switch (status) {
        case "Pending":
            return 1;
        case "Approved":
            return 2;
        case "Closed":
            return 3;
        case "Removed":
            return 4;
    }
}
function addNewJob(){
    if(!inNewAdd.value){
        inNewAdd.value = true;
        jobModel.value['Pending'].unshift({
            newAdd:true,
            isEdit:true,
            status:1,
            user:{
                id: null,
                username: null,
            }
        });
    }
}
const confirmDelete = (id) => {
    ElMessageBox.confirm(
        t('jobCard.confirmDelete'),
        t('jobCard.warning'),
        {
            confirmButtonText: t('jobCard.delete'),
            cancelButtonText: t('jobCard.cancel'),
            type: 'warning',
            draggable: true,
        }
        )
        .then(() => {
            deleteJob(id)
        })
        .catch(() => {}
    )
}
async function deleteJob(id){
    fullLoading.value = true;
    const response = await request.deleteJob({"id": id});
    if (response && response.data.code === 200) {
        proxy.$msg.success(response.data.data);
        await requestJob();
    }
    fullLoading.value = false;
}
function setSort() {
    statusCode.forEach(key => {
        const el = document.querySelector('.draggable' + key);
        if(el){
            new Sortable(el, {
                animation: 150,//過渡動畫
                group: 'sortGroup',
                handle: ".handle",
                sort: true,
                ghostClass: 'sortable-ghost',//被選取樣式
                dragClass: "ghost",
                scrollSensitivity: 100,//觸發滾動距離
                scrollSpeed: 15,//滾動速度
                draggable: ".innerCard",
                onStart: () => {
                    document.body.style.userSelect = 'none'; // 禁用文本選擇，避免拖曳反白
                },
                onEnd: (e) => {
                    //移除sortablejs默認的DOM操作，全部的渲染都由下面手動操作，不然sortablejs默認操作會和v-model衝突導致畫面多出一個DOM
                    e.to.removeChild(e.item);

                    const toStatus = e.to.id.replace('id', '');
                    document.body.style.userSelect = ''; // 恢復文本選擇
                    //拿出被移動元素
                    const targetRow = jobModel.value[key].splice(e.oldIndex, 1)[0];
                    //放入對應位置
                    jobModel.value[toStatus].splice(e.newIndex, 0, targetRow);
                    // 如果新排序位置狀態不同就單獨更新任務狀態
                    if(toStatus !== key){
                        const jobId = e.item.id;
                        const statusCode = getStatusCode(toStatus);
                        updateJobStatus(jobId, statusCode, e.newIndex);
                        updateTrackingJobStatus(jobId, toStatus);//改變追蹤清單狀態
                    }
                    //一次整理、更新所有類別的排序
                    orderRequest.value = statusCode.flatMap(key => 
                        jobModel.value[key].map((item, index) => ({
                            id: item.id,
                            order: index
                        }))
                    );
                    saveOrder();//保存全部改變排序
                },
            })
        }
    })
}
async function saveOrder(){
    const response = await request.jobOrder(orderRequest.value);
    if (response && response.data.code === 200) {
        proxy.$msg.success(response.data.data);
    }
}
async function updateJobStatus(id, status, order){
    jobRequest.id = id;
    jobRequest.info = null;
    jobRequest.userId = null;
    jobRequest.startTime = null;
    jobRequest.endTime = null;
    jobRequest.status = status;
    jobRequest.order = order;
    jobRequest.idSet = null;
    await updateJobRequest();
}
function jobStatusClick(id, index, nowStatus, toStatus){
    //整理被移動元素的排序位置
    const targetRow = jobModel.value[nowStatus].splice(index, 1)[0];
    
    jobModel.value[toStatus].splice(0, 0, targetRow);//放最前面
    
    const currentStatusCode = getStatusCode(toStatus);
    updateJobStatus(id, currentStatusCode, 0);
    //一次整理、更新所有類別的排序
    orderRequest.value = statusCode.flatMap(key => 
        jobModel.value[key].map((item, index) => ({
            id: item.id,
            order: index
        }))
    );
    saveOrder();//改變排序
    updateTrackingJobStatus(id, toStatus);//改變追蹤清單狀態
}
function getNextStatus(status){
    switch (status) {
        case "Pending":
            return "Approved";
        case "Approved":
            return "Closed";
    }
}
function getStatusIcon(status){
    switch (status) {
        case "Pending":
            return "CaretRight";
        case "Approved":
            return "Select";
    }
}
function updateTrackingJobStatus(id, toStatus){
    const model = jobModel.value['tracking'].find(job => job.id == id);
    if(model) model.status = toStatus;
}
</script>

<style scoped>
.paddingAlign10{
    padding: 10px 0px;
}
.height100{
    height: 100%;
}
.minWidth360{
    min-width: 360px;
}
.row-nowrap {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
}
.shadow{
    box-shadow: 2px 2px 15px rgba(0, 0, 0, 0.3);
}
.text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
}
.text-normal{
    white-space: normal;
}
.text-nowrap{
    white-space: nowrap;
}
.infoBlock{
    border:1px solid #dddddd;
    padding:5px;
}
.card__text--alignCenter{
    display: flex;
    align-items: center;
}
.card__tag--rignt{
    display: flex;
    justify-content: flex-end;
}
.card__trackingDialog--textRignt{
    margin-top:10px;
    display: flex;
    justify-content: flex-end;
}
.card__header--spaceBetween{
    display: flex;
    justify-content: space-between;
}
.sortable-ghost {
    opacity: 0.5;
    background-color: #f0f0f0;
    transition: transform 150ms ease;
}

.ghost {
    opacity: 0.8;
    transform: scale(1.05);
    transition: transform 150ms ease;
}
.handle{
    cursor: grab ;
}
</style>