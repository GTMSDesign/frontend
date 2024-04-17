<template>
  <el-button link type="primary" size="small" @click="fetchData"
    >评审意见</el-button
  >
  <el-dialog v-model="dialogFormVisible" title="评审意见" width="50%" center>
    <hr size="4" color="#faf8f8" />
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="内审老师的评价" name="first">User</el-tab-pane>
      <el-tab-pane label="内审老师的建议" name="second">Config</el-tab-pane>
      <el-tab-pane label="外审老师的评价" name="third">Role</el-tab-pane>
      <el-tab-pane label="外审老师的建议" name="fourth">Task</el-tab-pane>
    </el-tabs>
    <!-- <el-scrollbar height="400px">
      <el-form :model="form" :label-position="labelPosition">
        <el-form-item label="内审老师的评价" :label-width="formLabelWidth">
          <el-input
            v-model="form.internalComment"
            style="width: 90%"
            :rows="6"
            type="textarea"
            disabled
          />
        </el-form-item>
        <el-form-item label="内审老师的建议" :label-width="formLabelWidth">
          <el-input
            v-model="form.internalAdvice"
            style="width: 90%"
            :rows="6"
            type="textarea"
            disabled
          />
        </el-form-item>
        <el-form-item label="外审老师的评价" :label-width="formLabelWidth">
          <el-input
            v-model="form.externalComment"
            style="width: 90%"
            :rows="6"
            type="textarea"
            disabled
          />
        </el-form-item>
        <el-form-item label="外审老师的建议" :label-width="formLabelWidth">
          <el-input
            v-model="form.externalAdvice"
            style="width: 90%"
            :rows="6"
            type="textarea"
            disabled
          />
        </el-form-item>
      </el-form>
    </el-scrollbar> -->

    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible = false">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import type { FormProps, TabsPaneContext } from "element-plus";
import { getReviewByThesisId } from "@/services/teacher";
import { defineProps } from "vue";
const props = defineProps({ thesisId: String });
const dialogFormVisible = ref(false);
const formLabelWidth = "140px";
const activeName = ref("first");

const labelPosition = ref<FormProps["labelPosition"]>("top");
interface reviewMessage {
  externalComment: string;
  internalComment: string;
  externalAdvice: string;
  internalAdvice: string;
}
const form = ref<reviewMessage>({
  externalComment: "",
  internalComment: "",
  externalAdvice: "",
  internalAdvice: "",
});
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event);
};
const fetchData = async () => {
  console.log(props.thesisId);

  dialogFormVisible.value = true;
  try {
    const data = await getReviewByThesisId(props.thesisId!); // 调用获取教师相关论文的方法，并传入参数
    form.value = data;
  } catch (error) {
    console.error(error);
    // 处理错误
  }
};
</script>

<style></style>
