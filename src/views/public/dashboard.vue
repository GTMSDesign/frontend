<template>

</template>

<script>
import {ROLE,PATH} from "../../common/const";
export default {
    beforeMount() {
        //不同角色访问不同首页
        //let role = sessionStorage.getItem("role");
        let role = "REGISTRAR"
        if(role === ROLE.ADMIN){
            this.$router.replace(PATH.admin_Dashboard.path);
        }else if(role === ROLE.REGISTRAR){
            this.$router.replace(PATH.registrar_Dashboard.path);
        }else if(role === ROLE.TEACHER){
            this.$router.replace(PATH.teacher_Dashboard.path);
        }else if(role === ROLE.STUDENT){
            this.$router.replace(PATH.Student_Dashboard.path);
        }else{
            this.$router.replace("/login");
        }
    }
}
</script>
