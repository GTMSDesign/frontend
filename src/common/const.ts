export const ROLE = {
  ADMIN: "ROLE_ADMIN", //系统管理员
  REGISTRAR: "ROLE_REGISTRAR", //教务员
  TEACHER: "ROLE_TEACHER", //老师
  STUDENT: "ROLE_STUDENT", //学生
};

export const PATH = {
  //admin
  Account_Management: {
    path: "/accountManagement",
    requiresAuth: [ROLE.ADMIN],
  },
  Login_Logs: {
    path: "/loginLogs",
    requiresAuth: [ROLE.ADMIN],
  },
  admin_Dashboard: {
    path: "/adminDashboard",
    requiresAuth: [ROLE.ADMIN],
  },
  //registrar
  AllThesis_Registrar: {
    path: "/allThesisRegistrar",
    requiresAuth: [ROLE.REGISTRAR],
  },
  Arrange_Defense: {
    path: "/arrangeDefense",
    requiresAuth: [ROLE.REGISTRAR],
  },
  Arrange_Printing: {
    path: "/arrangePrinting",
    requiresAuth: [ROLE.REGISTRAR],
  },
  Arrange_Review: {
    path: "/arrangeReview",
    requiresAuth: [ROLE.REGISTRAR],
  },
  Generate_Evaluation: {
    path: "/generateEvaluation",
    requiresAuth: [ROLE.REGISTRAR],
  },
  Plagiarism_Check: {
    path: "/plagiarismCheck",
    requiresAuth: [ROLE.REGISTRAR],
  },
  Advisor_Assignment: {
    path: "/advisorAssignment",
    requiresAuth: [ROLE.REGISTRAR],
  },
  Enter_Student_Info: {
    path: "/enterStudentInfo",
    requiresAuth: [ROLE.REGISTRAR],
  },
  Review_Rule: {
    path: "/ReviewRule",
    requiresAuth: [ROLE.REGISTRAR],
  },
  Enter_Teacher_Info: {
    path: "/enterTeacherInfo",
    requiresAuth: [ROLE.REGISTRAR],
  },
  registrar_Dashboard: {
    path: "/registrarDashboard",
    requiresAuth: [ROLE.REGISTRAR],
  },
  //teacher
  Personal_Info: {
    path: "/personalInfo",
    requiresAuth: [ROLE.TEACHER],
  },
  Review_Management: {
    path: "/reviewManagement",
    requiresAuth: [ROLE.TEACHER],
  },
  AllThesis_Teacher: {
    path: "/allThesisTeacher",
    requiresAuth: [ROLE.TEACHER],
  },
  Approve_Defense: {
    path: "/approveDefense", //审批答辩
    requiresAuth: [ROLE.TEACHER],
  },
  Approve_Deferred: {
    path: "/approveDeferred", //审批暂缓
    requiresAuth: [ROLE.TEACHER],
  },
  Approve_Draft: {
    path: "/approveDraft", //审批定稿
    requiresAuth: [ROLE.TEACHER],
  },
  Approve_Proposal: {
    path: "/approveProposal", //审批开题
    requiresAuth: [ROLE.TEACHER],
  },
  Review_Result: {
    path: "/reviewResult", //评审结果
    requiresAuth: [ROLE.TEACHER],
  },
  Deferred_Approval: {
    path: "/deferredApproval", //暂缓审批
    requiresAuth: [ROLE.TEACHER],
  },
  Formal_Submission: {
    path: "/formalSubmission", //正式提交决议
    requiresAuth: [ROLE.TEACHER],
  },
  Modify_Resolution: {
    path: "/modifyResolution", //修改决议
    requiresAuth: [ROLE.TEACHER],
  },
  Preliminary_Resolution: {
    path: "/preliminaryResolution", //初拟决议
    requiresAuth: [ROLE.TEACHER],
  },
  teacher_Dashboard: {
    path: "/teacherDashboard",
    requiresAuth: [ROLE.TEACHER],
  },
  Defense_Resolution: {
    path: "/defenseResolution",
    requiresAuth: [ROLE.TEACHER],
  },
  Student_List: {
    path: "/studentList",
    requiresAuth: [ROLE.TEACHER],
  },
  //学生
  Student_Dashboard: {
    path: "/studentDashboard",
    requiresAuth: [ROLE.STUDENT],
  },
  AllThesis_Student: {
    path: "/allThesisStudent",
    requiresAuth: [ROLE.STUDENT],
  },
  //会话
  Launch_Session: {
    path: "/launchSession",
    requiresAuth: [ ROLE.TEACHER],
  },
  Response_Session: {
    path: "/responseSession",
    requiresAuth: [ ROLE.TEACHER],
  },
  Launch_Session_Student: {
    path: "/launchSessionStduent",
    requiresAuth: [ROLE.STUDENT],
  },
  Response_Session_Student: {
    path: "/responseSessionStduent",
    requiresAuth: [ROLE.STUDENT],
  },
};
