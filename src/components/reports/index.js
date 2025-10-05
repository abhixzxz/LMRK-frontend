// Report components export file
export { default as ReportAccChangSpeciSignature } from "./ReportAccChangSpeciSignature.jsx";
export { default as ReportReverseEntries } from "./ReportReverseEntries.jsx";
export { default as ReportManualInterestPostingDtls } from "./ReportManualInterestPostingDtls.jsx";
export { default as ReportSuspiciousCashTrans } from "./ReportSuspiciousCashTrans.jsx";
export { default as ReportCancelledScrolls } from "./ReportCancelledScrolls.jsx";
export { default as ReportFDDeletEntries } from "./ReportFDDeletEntries.jsx";
export { default as ReportMultipleDepLoanIssuesonSingleFDR } from "./ReportMultipleDepLoanIssuesonSingleFDR.jsx";
export { default as ReportDupFDRIssue } from "./ReportDupFDRIssue.jsx";
export { default as ReportReopenAccDtls } from "./ReportReopenAccDtls.jsx";
export { default as ReportChangingofNom } from "./ReportChangingofNom.jsx";
export { default as ReportSBStatusChang } from "./ReportSBStatusChang.jsx";
export { default as ReportHighValueTrans } from "./ReportHighValueTrans.jsx";
export { default as ReportUserOperatorChang } from "./ReportUserOperatorChang.jsx";
export { default as ReportUserRight } from "./ReportUserRight.jsx";
export { default as ReportChangePasswordLog } from "./ReportChangePasswordLog.jsx";
export { default as ReportUserRightTransfer } from "./ReportUserRightTransfer.jsx";
export { default as ReportDocument } from "./ReportDocument.jsx";

// API Configuration for ReportDocument
export const REPORTS_API_CONFIG = {
  BASE_URL: "http://localhost:4000/api",
  ENDPOINTS: {
    PROGRAMME_NAMES: "/ProgrammeName",
    TIME_SLOTS: "/TimeSlots",
    REPORT_DOCUMENT: "/reportdocument",
    UPDATE_ATTEND_MEMBER: "/updateAttendMember",
  },
};
