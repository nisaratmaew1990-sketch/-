/**
 * การตั้งค่าระบบเกม ผจญภัยพิชิตดินแดนคำควบกล้ำ
 * System Configuration
 */
const CONFIG = {
  // Google Sheets ID ที่ผู้ใช้กำหนด
  SPREADSHEET_ID: '1eSGq5AWr-OA38nGiGSvJ82IOKq87wq4kil7u7kcJogo',

  // Google Apps Script Web App URL (เมื่อ Deploy แล้วนำ URL มาวางที่นี่ หรือใส่ในหน้าคุณครู)
  // สามารถเปลี่ยนผ่านหน้า "ระบบคุณครู" (Teacher Dashboard) ได้โดยตรง ไม่ต้องแก้โค้ด
  DEFAULT_API_URL: '',

  // ชื่อเกม
  GAME_TITLE: 'ผจญภัยพิชิตดินแดนคำควบกล้ำ',
  SUBTITLE: 'เกมการศึกษาภาษาไทย สำหรับนักเรียนชั้นประถมศึกษาปีที่ 2',

  // เกณฑ์คะแนน
  MAX_SCORE: 100,
  PASS_SCORE: 70,
  SCORE_PER_QUESTION: 10,
  TOTAL_QUESTIONS: 10,

  // รหัสผ่านเข้าหน้าระบบคุณครู (สามารถเปลี่ยนได้)
  TEACHER_PASSCODE: '1234',

  // โหมด Offline/Demo (ถ้ายังไม่ได้เชื่อมต่อ Google Apps Script จะบันทึกลง LocalStorage ให้ก่อน)
  LOCAL_STORAGE_SCORES_KEY: 'thai_game_scores_v1',
  LOCAL_STORAGE_STUDENT_KEY: 'thai_game_current_student',
  LOCAL_STORAGE_API_URL_KEY: 'thai_game_gas_api_url'
};

// อ่าน API URL จาก LocalStorage หากครูมีการตั้งค่าผ่านหน้าเว็บ
if (typeof localStorage !== 'undefined') {
  const savedUrl = localStorage.getItem(CONFIG.LOCAL_STORAGE_API_URL_KEY);
  if (savedUrl && savedUrl.trim()) {
    CONFIG.API_URL = savedUrl.trim();
  } else {
    CONFIG.API_URL = CONFIG.DEFAULT_API_URL;
  }
} else {
  CONFIG.API_URL = CONFIG.DEFAULT_API_URL;
}
