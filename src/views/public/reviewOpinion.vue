<template>
  <el-button link type="primary" size="small" @click="fetchData"
    >评审意见</el-button
  >
  <el-dialog v-model="dialogFormVisible" title="评审意见" width="50%" center>
    <hr size="4" color="#faf8f8" />
    <el-scrollbar height="400px">
      <el-form :model="form" :label-position="labelPosition">
        <el-form-item
          label="内审老师给学生的意见"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="form.internalToStudent"
            style="width: 90%"
            :rows="6"
            type="textarea"
            placeholder="Please input"
          />
        </el-form-item>
        <el-form-item
          label="外审老师给学生的意见"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="form.externalToStudent"
            style="width: 90%"
            :rows="6"
            type="textarea"
            placeholder="Please input"
          />
        </el-form-item>
        <el-form-item
          label="内审老师给老师的意见"
          v-if="teacher"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="form.internalToTeacher"
            style="width: 90%"
            :rows="6"
            type="textarea"
            placeholder="Please input"
          />
        </el-form-item>
        <el-form-item
          label="外审老师给老师的意见"
          v-if="teacher"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="form.externalToTeacher"
            style="width: 90%"
            :rows="6"
            type="textarea"
            placeholder="Please input"
          />
        </el-form-item>
      </el-form>
    </el-scrollbar>

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
import { reactive, ref, onMounted } from "vue";
import type { FormProps } from "element-plus";
import { getReviewByThesisId } from "@/services/teacher";
import { defineProps } from "vue";
const props = defineProps({ thesisId: String });
const dialogFormVisible = ref(false);
const teacher = ref(false);
const formLabelWidth = "140px";
const labelPosition = ref<FormProps["labelPosition"]>("top");
interface reviewMessage {
  externalToStudent: string;
  internalToStudent: string;
  externalToTeacher: string;
  internalToTeacher: string;
}
const form = ref<reviewMessage>({
  externalToStudent: "",
  internalToStudent: "",
  externalToTeacher: "",
  internalToTeacher: "",
});

const fetchData = async () => {
  console.log(props.thesisId);

  dialogFormVisible.value = true;
  try {
    const role = sessionStorage.getItem("role") || ""; // 获取 sessionStorage 中的 account
    const data = await getReviewByThesisId(props.thesisId!, role); // 调用获取教师相关论文的方法，并传入参数
    form.value = data;
    if (role === "ROLE_TEACHER") {
      teacher.value = true;
    }
  } catch (error) {
    console.error(error);
    // 处理错误
  }
};
</script>

<style></style>
