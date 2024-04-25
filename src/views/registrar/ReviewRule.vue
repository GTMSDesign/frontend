<template>
  <div>
    <div class="button-container">
      <div class="left-buttons">
        <button class="addButton" @click="addRow">
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
              <path fill="none" d="M0 0h24v24H0z"></path>
              <path fill="currentColor" d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"></path>
            </svg>
            添加
          </span>
        </button>
        <button class="refreshButton" type="button" @click="refresh">
          <span class="button__text">刷新</span>
          <span class="button__icon"><svg xmlns="http://www.w3.org/2000/svg" width="48" viewBox="0 0 48 48" height="48"
              class="svg">
              <path
                d="M35.3 12.7c-2.89-2.9-6.88-4.7-11.3-4.7-8.84 0-15.98 7.16-15.98 16s7.14 16 15.98 16c7.45 0 13.69-5.1 15.46-12h-4.16c-1.65 4.66-6.07 8-11.3 8-6.63 0-12-5.37-12-12s5.37-12 12-12c3.31 0 6.28 1.38 8.45 3.55l-6.45 6.45h14v-14l-4.7 4.7z">
              </path>
              <path fill="none" d="M0 0h48v48h-48z"></path>
            </svg></span>
        </button>
        <p>合计最大总分: {{ totalMaxScore }}</p>
      </div>
      <el-button type="success" class="submitButton" @click="preserve">保存</el-button>
    </div>
    <el-table v-loading="loading" v-if="!loading" :data="tableData" style="width: 100%" stripe border height="550"
      :header-cell-style="{ backgroundColor: '#E9D0F3' }" :default-sort="{ prop: 'student_id', order: 'increncing' }">
      <el-table-column label="序号" sortable align="center" type="index" width="100px"></el-table-column>
      <el-table-column label="评价项目" prop="reviewItem" align="center" width="300px"></el-table-column>
      <el-table-column label="评价要素" prop="reviewElement" align="center"></el-table-column>
      <el-table-column label="单项满分" prop="maxScore" align="center" width="100px">
      </el-table-column>

      <el-table-column label="操作" align="center" #default="scope" width="200px">
        <el-button type="primary" plain @click="openDialog(scope.row)">修改</el-button>
        <el-button type="warning" plain @click="deleteRow(scope.$index)">删除</el-button>
      </el-table-column>
    </el-table>
  </div>

  <el-dialog v-model="dialogVisible" :title="title" width="40%" :before-close="handleClose" center
    :append-to-body="true">
    <el-form :model="dialogTableData" label-width="auto">
      <el-form-item label="评价项目">
        <el-input v-model="dialogTableData.reviewItem" />
      </el-form-item>
      <el-form-item label="评价要素">
        <el-input v-model="dialogTableData.reviewElement" :rows="5" type="textarea" />
      </el-form-item>
      <el-form-item label="单项满分">
        <el-input-number v-model="dialogTableData.maxScore" :min="0" :max="100" size="small" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submit"> 提交 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { ElMessageBox } from "element-plus";
import { getReviewRules, updateReviewRule } from "@/services/registrar"; // 导入获取学生的方法
import { Search } from "@element-plus/icons-vue";
import StudentInfo from "@/views/public/studentInfo.vue";

interface rule {
  reviewItem: string;
  reviewElement: string;
  maxScore: number;
}
interface dialogDate {
  reviewItem: string;
  reviewElement: string;
  maxScore: number;
}
const dialogVisible = ref(false);
const dialogTableData = ref<dialogDate>({
  reviewItem: "",
  reviewElement: "",
  maxScore: 0,
});
const totalMaxScore = computed(() => {
  return tableData.value.reduce((sum, current) => sum + current.maxScore, 0);
});
const title = ref("");

const handleClose = (done: () => void) => {
  done();
};

// 使用ref创建响应式变量
const loading = ref(true);
const search = ref({
  account: "",
  name: "",
});

const fetchData = async () => {
  try {
    tableData.value = await getReviewRules(); // 更新 tableData
    loading.value = false; // 数据加载完成，loading 状态设为 false
  } catch (error) {
    console.error(error);
    // 处理错误
  }
};

// 在组件挂载后加载数据
onMounted(() => {
  fetchData();
});
const openDialog = (row: rule) => {
  title.value = "规则修改";
  dialogTableData.value.reviewItem = row.reviewItem;

  dialogTableData.value.reviewElement = row.reviewElement;
  dialogTableData.value.maxScore = row.maxScore;
  console.log(dialogTableData);
  dialogVisible.value = true;
};
const addRow = () => {
  title.value = "规则添加";
  dialogTableData.value = {
    reviewItem: "",
    reviewElement: "",
    maxScore: 0,
  };
  dialogVisible.value = true;
};
// 使用ref创建响应式变量
const tableData = ref<rule[]>([]);

const cancel = () => {
  dialogTableData.value = {
    reviewItem: "",
    reviewElement: "",
    maxScore: 0,
  };

  dialogVisible.value = false;
};
const preserve = async () => {
  if (totalMaxScore.value !== 100) {
    ElMessageBox.alert(
      "总分必须等于 100 分，请检查并修改评审规则分数。",
      "保存错误", // 错误对话框的标题
      {
        confirmButtonText: "确定",
        type: "error", // 使用错误类型的图标
      }
    );
    return; // 提前退出函数，不执行保存操作
  }
  ElMessageBox.confirm(
    "确定要保存评审规则吗？", // 显示的消息内容
    "警告", // 对话框的标题
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning", // 使用警告类型的图标
    }
  )
    .then(() => {
      // 用户点击“确定”
      updateReviewRule(tableData.value);
    })
    .catch(() => {
      // 用户点击“取消”或关闭对话框
      console.log("保存操作已取消");
    });
};
const deleteRow = (index: number) => {
  ElMessageBox.confirm(
    "确定要删除这条规则吗？", // 显示的消息内容
    "警告", // 对话框的标题
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning", // 使用警告类型的图标
    }
  )
    .then(() => {
      // 用户点击“确定”
      tableData.value.splice(index, 1);
    })
    .catch(() => {
      // 用户点击“取消”或关闭对话框
      console.log("删除操作已取消");
    });
};
const submit = () => {
  const index = tableData.value.findIndex(
    (item) => item.reviewItem === dialogTableData.value.reviewItem
  );
  if (index !== -1) {
    // 更新该行的数据
    tableData.value[index] = { ...dialogTableData.value };
  } else {
    tableData.value.push({ ...dialogTableData.value });
  }
  cancel();
};

const refresh = async () => {
  ElMessageBox.confirm(
    "您确定要刷新数据吗？这将重新加载表格中的所有数据。",
    "刷新数据",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }
  )
    .then(() => {
      fetchData(); // 当用户确认时，调用 fetchData 函数加载数据
    })
    .catch(() => {
      console.log("刷新操作已取消");
      // 这里可以添加用户取消操作的后续处理逻辑
    });
};
</script>

<style scoped>
.addButton {
  height: 35px;
  width: 75px;
  border: 2px solid #24b4fb;
  background-color: #24b4fb;
  border-radius: 0.7em;
  padding: 0.3em 0.4em 0.5em 0.2em;
  transition: all ease-in-out 0.2s;
  font-size: 15px;
}

.addButton span {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-weight: 450;
}

.addButton:hover {
  background-color: #0071e2;
}

.refreshButton {
  position: relative;
  width: 75px;
  height: 35px;
  cursor: pointer;
  display: flex;
  align-items: center;
  border: 2px solid #24b4fb;
  border-radius: 0.7em;
  background-color: #24b4fb;
  overflow: hidden;
}

.refreshButton,
.button__icon,
.button__text {
  transition: all 0.3s;
}

.refreshButton .button__text {
  transform: translateX(16px);
  color: #fff;
  font-weight: 450;
  font-size: 15px;
}

.refreshButton .button__icon {
  position: absolute;
  transform: translateX(100px);
  height: 100%;
  width: 39px;
  background-color: #0078e8;
  display: flex;
  align-items: center;
  justify-content: center;
}

.refreshButton .svg {
  width: 20px;
  fill: #fff;
}

.refreshButton:hover {
  background: #0078e8;
}

.refreshButton:hover .button__text {
  color: transparent;
}

.refreshButton:hover .button__icon {
  width: 30px;
  transform: translateX(15px);
}

.refreshButton:active .button__icon {
  background-color: #006cd0;
}

.refreshButton:active {
  border: 1px solid #006cd0;
}

.button-container {
  display: flex;
  height: 50px;
  justify-content: space-between;
}

.button-container .addButton,
.button-container .refreshButton,
.submitButton {
  margin: 5px;
}

.submitButton {
  height: 35px;
  width: 75px;
  font-size: 15px;
  border-radius: 0.7em;
  padding: 0.8em 0.4em 0.5em 0.4em;
}

.left-buttons {
  display: flex;
  /* 确保左侧按钮紧挨在一起 */
}
</style>
