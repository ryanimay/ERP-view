<template>
  <BasicBody>
    <div id="bodyframe">
      <div style="display: flex; margin: 1%; flex-direction: column; height: 97%;">
        <div style="flex: 1; margin-right: auto; margin-left: 2%; align-items: center; display: flex;">
          <h1 style="font-size: 300%;"><b>SystemInfo</b></h1>
        </div>
        <div style="flex: 1; display: flex; align-items: stretch;">
          <div class="shadowBlock">
            <div class="quickblock" data-bs-toggle='tooltip' :title='totalUsers' data-bs-placement="bottom">
              <font-awesome-icon icon="people-group" class="icongroup" />
            </div>
            <p>Total Users: {{ totalUsers }}</p>
          </div>
          <div class="shadowBlock">
            <div class="quickblock" data-bs-toggle='tooltip' :title='totalAssets' data-bs-placement="bottom">
              <font-awesome-icon icon="sack-dollar" class="icongroup" />
            </div>
            <p>Total Assets: {{ totalAssets }}</p>
          </div>
          <div class="shadowBlock">
            <div class="quickblock" data-bs-toggle='tooltip' :title='totalOrders' data-bs-placement="bottom">
              <font-awesome-icon icon="lightbulb" class="icongroup" />
            </div>
            <p>Total Orders: {{ totalOrders }}</p>
          </div>
          <div class="shadowBlock"></div>
        </div>
        <div style="flex: 1; display: flex; align-items: stretch;">
          <div class="shadowBlock">
            <div class="quickblock" data-bs-toggle='tooltip' :title='pendingTasks' data-bs-placement="bottom">
              <font-awesome-icon icon="car" class="icongroup" />
            </div>
            <p>Pending Tasks: {{ pendingTasks }}</p>
          </div>
          <div class="shadowBlock">
            <div class="quickblock" data-bs-toggle='tooltip' title='Security' data-bs-placement="bottom">
              <font-awesome-icon icon="shield-halved" class="icongroup" />
            </div>
            <p>Security</p>
          </div>
          <div class="shadowBlock">
            <div class="quickblock" data-bs-toggle='tooltip' title='Setting' data-bs-placement="bottom">
              <font-awesome-icon icon="wrench" class="icongroup" />
            </div>
            <p>Setting</p>
          </div>
          <div class="shadowBlock"></div>
        </div>
        <div style="flex: 3; display: flex;">
          <div class="shadowBlock lineChart">
            <LineChart :data="data1" :options="chartOptions" />
          </div>
          <div class="shadowBlock lineChart">
            <LineChart :data="data2" :options="chartOptions" />
          </div>
        </div>
        <div style="flex: 3; display: flex;">
          <div class="shadowBlock lineChart">
            <LineChart :data="data3" :options="chartOptions" />
          </div>
          <div class="shadowBlock lineChart">
            <LineChart :data="data4" :options="chartOptions" />
          </div>
        </div>
      </div>
    </div>
  </BasicBody>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Tooltip } from 'bootstrap';
import LineChart from "@/components/body/LineChart.vue";
const user = ref(null);
const totalUsers = '12,332';
const totalAssets = '520,145,031';
const totalOrders = '23,431';
const pendingTasks = '31';

onMounted(() => {
  user.value = JSON.parse(localStorage.getItem('user'));

  new Tooltip(document.body, {
    selector: "[data-bs-toggle='tooltip']",
  })
});

const getLabels = () => {
  const labels = [];
  const currentDate = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(currentDate.getDate() - i);
    labels.push(date.toLocaleDateString('en-CA', { month: 'numeric', day: 'numeric' }).replace(/\//g, '-'));
  }
  return labels;
};

const generateRandomData = (count) => {
  return Array.from({ length: count }, () => Math.floor(Math.random() * 101));
};

const data1 = {
  labels: getLabels(),
  datasets: [
    {
      label: "Assets growing",
      backgroundColor: "#f87979",
      data: generateRandomData(30),
    },
  ],
};

const data2 = {
  labels: getLabels(),
  datasets: [
    {
      label: "Orders growing",
      backgroundColor: "#f87979",
      data: generateRandomData(30),
    },
  ],
};

const data3 = {
  labels: getLabels(),
  datasets: [
    {
      label: "Data One",
      backgroundColor: "#0b4363",
      data: generateRandomData(30),
    },
  ],
};

const data4 = {
  labels: getLabels(),
  datasets: [
    {
      label: "Data two",
      backgroundColor: "#0b4363",
      data: generateRandomData(30),
    },
  ],
};
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
};

</script>

<style scoped>
.lineChart {
  height: 88%;
}

.shadowBlock {
  margin: 1% 2%;
  flex: 1;
  border: 1px solid rgb(211, 211, 211);
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 5px 5px 5px rgba(73, 73, 73, 0.5);
  transition: box-shadow 0.3s ease;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1%;
}

.shadowBlock:hover {
  box-shadow: 5.5px 5.5px 5.5px rgba(0, 0, 0, 0.5);
  border: 1px solid rgb(202, 202, 202);
}

.icongroup {
  margin-top: 5%;
  color: #ffffff;
  font-size: 50px;
}

.quickblock {
  width: 80px;
  height: 80px;
  background-color: rgb(32, 34, 43);
  border-radius: 50%;
  margin: 1%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  cursor: pointer;
  flex-direction: column;
}

.shadowBlock p {
  margin: 0;
  font-weight: bold;
}

.quickblock:hover {
  background-color: rgb(51, 52, 58);
}

#bodyframe {
  width: 100%;
  height: 92%;
  margin: 3% 3%;
  border: 1px solid rgb(211, 211, 211);
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 10px 10px 10px rgba(73, 73, 73, 0.5);
  transition: box-shadow 0.5s ease;
  box-sizing: border-box;
}

#bodyframe:hover {
  box-shadow: 10px 10px 10px rgba(19, 19, 19, 0.5);
  border: 1px solid rgb(202, 202, 202);
}
</style>