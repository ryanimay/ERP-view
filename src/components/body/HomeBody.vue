<template>
    <el-main class="homeBodyContainer" v-loading.lock="loading">
        <div class="block">
            <div class="innerBlock">
                <el-row class="block--row" :gutter="20">
                    <el-col :span="6">
                        <el-button plain class="block--frame" :type="signType" icon="Checked" @click="sign">{{ signText }}</el-button>
                    </el-col>
                    <el-col :span="18">
                        <router-link :to="{ name: 'jobCard' }" class="router-link--override">
                            <el-button type="info" class="block--frame" icon="Ticket">
                                {{ $t('homeBody.jobCard') }}
                            </el-button>
                        </router-link>
                    </el-col>
                </el-row>
                <el-row style="height: 20px;"></el-row>
                <el-row class="block--row" :gutter="20">
                    <el-col :span="14">
                        <router-link :to="{ name: 'personalLeave' }" class="router-link--override">
                            <el-card shadow="hover" body-style="height: calc(100% - 42px);" class="block--frame block__card--frame">
                                <el-row class="block--infoFrame--top">
                                    <el-col :span="8" class="block--info">
                                        <el-text tag="b" size="large">{{ info.totalLeave }}</el-text>
                                    </el-col>
                                    <el-col :span="8" class="block--info">
                                        <el-text tag="b" size="large">{{ info.currentLeave }}</el-text>
                                    </el-col>
                                    <el-col :span="8" class="block--info">
                                        <el-text tag="b" size="large">{{ info.pendingLeave }}</el-text>
                                    </el-col>
                                </el-row>
                                <el-row class="block--infoFrame">
                                    <el-col :span="8" class="block--info">
                                        <el-text tag="b" size="large">{{ $t('homeBody.totalLeave') }}</el-text>
                                    </el-col>
                                    <el-col :span="8" class="block--info">
                                        <el-text tag="b" size="large">{{ $t('homeBody.currentLeave') }}</el-text>
                                    </el-col>
                                    <el-col :span="8" class="block--info">
                                        <el-text tag="b" size="large">{{ $t('homeBody.pendingLeave') }}</el-text>
                                    </el-col>
                                </el-row>
                            </el-card>
                        </router-link>
                    </el-col>
                    <el-col :span="10">
                        <router-link :to="{ name: 'personalLeave' }" class="router-link--override">
                            <el-card shadow="hover" body-style="height: calc(100% - 42px);" class="block--frame block__card--frame">
                                <el-row class="block--infoFrame--top">
                                    <el-col :span="12" class="block--info">
                                        <el-text tag="b" size="large">{{ info.pendingPerformance }}</el-text>
                                    </el-col>
                                    <el-col :span="12" class="block--info">
                                        <el-text tag="b" size="large">{{ info.approvedPerformance }}</el-text>
                                    </el-col>
                                </el-row>
                                <el-row class="block--infoFrame">
                                    <el-col :span="12" class="block--info">
                                        <el-text tag="b" size="large">{{ $t('homeBody.pendingPerformance') }}</el-text>
                                    </el-col>
                                    <el-col :span="12" class="block--info">
                                        <el-text tag="b" size="large">{{ $t('homeBody.unsettledPerformance') }}</el-text>
                                    </el-col>
                                </el-row>
                            </el-card>
                        </router-link>
                    </el-col>
                </el-row>
                <el-row style="height: 20px;"></el-row>
                <el-row class="block--row" :gutter="20">
                    <el-col :span="8">
                        <router-link :to="{ name: 'salaryList' }" class="router-link--override">
                            <el-button plain type="primary" class="block--frame" icon="WalletFilled">{{ $t('homeBody.newSalary') }}</el-button>
                        </router-link>
                    </el-col>
                    <el-col :span="8">
                        <router-link :to="{ name: 'logList' }" class="router-link--override">
                            <el-button plain type="primary" class="block--frame" icon="WarnTriangleFilled">{{ $t('homeBody.systemLog') }}</el-button>
                        </router-link>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" body-style="padding-top: 10px; padding-bottom: 10px;" class="block__cardHeader--frame block__card--frame">
                            <template #header>
                                <el-text tag="b">
                                    {{ $t('homeBody.refreshKeyInfo1') }}
                                    <span style='color: red;'>:</span>
                                    {{ $t('homeBody.refreshKeyInfo2') }}
                                    <br/>
                                    {{ $t('homeBody.refreshKeyInfo3') }}
                                </el-text>
                            </template>
                            <el-row>
                                <el-col :span="24" class="block--info">
                                    <el-input :placeholder="$t('homeBody.refreshCachePlaceholder')" v-model="cacheKey"/>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="24" class="block--info">
                                    <el-button type="primary" icon="Refresh" style="width: 100%; margin-top: 10px" @click="refreshCache"></el-button>
                                </el-col>
                            </el-row>
                        </el-card>
                    </el-col>
                </el-row>
                <el-row style="height: 20px;"></el-row>
                <el-row class="block--row" :gutter="20">
                    <el-col :span="24">
                        <el-card shadow="hover" body-style="height: calc(100% - 42px);" class="block--frame block__card--frame">
                            <el-row>
                                <el-col :span="4">
                                    <el-text tag="b" size="large">{{ $t('homeBody.systemInfo') }}:</el-text>
                                </el-col>
                            </el-row>
                            <el-row class="block--infoFrame">
                                <el-col :span="4" class="block--info">
                                    <el-text tag="b" size="large">{{ info.user }}</el-text>
                                </el-col>
                                <el-col :span="4" class="block--info">
                                    <el-text tag="b" size="large">{{ info.department }}</el-text>
                                </el-col>
                                <el-col :span="4" class="block--info">
                                    <el-text tag="b" size="large">{{ info.project }}</el-text>
                                </el-col>
                                <el-col :span="6" class="block--info">
                                    <el-text tag="b" size="large">{{ info.procureIn }}</el-text>
                                </el-col>
                                <el-col :span="6" class="block--info">
                                    <el-text tag="b" size="large">{{ info.procureOut }}</el-text>
                                </el-col>
                            </el-row>
                            <el-row class="block--infoFrame--bottom">
                                <el-col :span="4" class="block--info">
                                    <el-text tag="b" size="large">{{ $t('homeBody.loggedUser') }}</el-text>
                                </el-col>
                                <el-col :span="4" class="block--info">
                                    <el-text tag="b" size="large">{{ $t('homeBody.totalDepartments') }}</el-text>
                                </el-col>
                                <el-col :span="4" class="block--info">
                                    <el-text tag="b" size="large">{{ $t('homeBody.totalProjects') }}</el-text>
                                </el-col>
                                <el-col :span="6" class="block--info">
                                    <el-text tag="b" size="large">{{ $t('homeBody.procureIn') }}</el-text>
                                </el-col>
                                <el-col :span="6" class="block--info">
                                    <el-text tag="b" size="large">{{ $t('homeBody.procureOut') }}</el-text>
                                </el-col>
                            </el-row>
                        </el-card>
                    </el-col>
                </el-row>
            </div>
        </div>
    </el-main>
</template>

<script setup>
import request from '@/config/api/request.js';
import { ref, onMounted, reactive, computed, getCurrentInstance } from 'vue';
import userStore from '@/config/store/user';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const loading = ref(false);
const cacheKey = ref(null);
const user = userStore();
const { proxy } = getCurrentInstance();
const info = reactive({
    department: null,
    project: null,
    user: null,
    procureIn: null,
    procureOut: null,
    currentLeave: null,
    totalLeave: null,
    pendingLeave: null,
    pendingPerformance: null,
    approvedPerformance: null,
})
onMounted(() => {
    systemInfo();
});
async function systemInfo(){
    loading.value = true;
    const response = await request.systemInfo();
    if (response && response.data.code === 200) {
        const data = response.data.data;
        updateUserAnnualLeave(data);
        info.department = data.systemInfo.systemDepartment;
        info.project = data.systemInfo.systemProject;
        info.user = data.systemInfo.systemUser;
        info.procureIn = data.systemInfo.systemProcure[0];
        info.procureOut = data.systemInfo.systemProcure[1];
        info.currentLeave = data.annualLeave.currentLeave;
        info.totalLeave = data.annualLeave.totalLeave;
        info.pendingLeave = data.annualLeave.pendingLeave;
        info.pendingPerformance = data.clientPerformance.pendingCount;
        info.approvedPerformance = data.clientPerformance.approvedCount;
    }
    loading.value = false;
}
function updateUserAnnualLeave(data){
    const leave = data.annualLeave;
    user.currentLeave = leave.currentLeave;
    user.totalLeave = leave.totalLeave;
}
const signType = computed(() => {
    switch (user.attendStatus) {
        case 1:
            return 'danger';
        case 2:
            return 'success';
        case 3:
            return 'warning';
        default:
            return '';
    }
});
const signText = computed(() => {
    switch (user.attendStatus) {
        case 1:
            return t('homeBody.signIn');
        case 2:
            return t('homeBody.signOut');
        case 3:
            return t('homeBody.offWork');
        default:
            return t('homeBody.error');
    }
});
async function sign() {
    loading.value = true;
    if (user.attendStatus == '1') {
        const response = await request.signIn();
        handleSignResponse(response, 2);
    } else if ((user.attendStatus == '2')) {
        const response = await request.signOut();
        handleSignResponse(response, 3);
    } else if ((user.attendStatus == '3')) {
        proxy.$msg.warn(t('homeHeader.clockOutMessage'));
    } else {
        proxy.$msg.error(t('homeHeader.unknowError'));
    }
    loading.value = false;
}
function handleSignResponse(response, status) {
    if (response.data.code === 200) {
        proxy.$msg.success(t('homeHeader.success'));
        user.updateAttendStatus(status);
    }
}
async function refreshCache(){loading.value = true;
    const response = await request.refreshCache({
        "cacheKey" : cacheKey.value
    });
    if (response && response.data.code === 200) {
        proxy.$msg.success(response.data.data);
    }
    loading.value = false;
}
</script>

<style scoped>
.block{
    display: grid;
    place-items: center;
    height: 100%;
    width: 100%;
}
.innerBlock{
    padding: 20px;
    border: 1px solid #90939996;
}
.block--frame{
    height:100%;
    min-height: 100px;
    width: 100%;
    font-size: 20px;
}
.block__cardHeader--frame{
    height:calc(100% - 2px);
    min-height: 150px;
    width: 100%;
    font-size: 20px;
}
.block--row{
    height: 100%;
    min-height: 100px;
    width: 90%;
    min-width: 1000px;
}
.block__card--frame{
    transition: box-shadow 0.3s; 
    border: 1px solid #90939996;
}
.block__card--frame:hover{
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.4); 
}
.router-link--override {
  text-decoration: none;
  color: inherit;
}
.block--info{
    display: flex;
    align-items: center;
    justify-content: center;
}
.block--infoFrame{
    height: 50%;
}
.block--infoFrame--top{
    height: 50%;
    align-items: flex-end;
}
.block--infoFrame--bottom{
    height: 50%;
    align-items: flex-start;
}
</style>