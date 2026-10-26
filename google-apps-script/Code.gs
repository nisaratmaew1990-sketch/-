/**
 * =========================================================================
 * Google Apps Script Backend
 * ผจญภัยพิชิตดินแดนคำควบกล้ำ - สำหรับนักเรียนชั้น ป.2
 * เชื่อมต่อ Google Sheets ID: 1eSGq5AWr-OA38nGiGSvJ82IOKq87wq4kil7u7kcJogo
 * =========================================================================
 */

// รหัส Google Sheets ปลายทาง
const SPREADSHEET_ID = '1eSGq5AWr-OA38nGiGSvJ82IOKq87wq4kil7u7kcJogo';

// ชื่อของแต่ละชีต
const SHEET_STUDENTS = 'Students';
const SHEET_QUESTIONS = 'Questions';
const SHEET_SCORES = 'Scores';
const SHEET_ANSWERS = 'Answers';

// ข้อมูลคำถาม 10 ข้อตามที่กำหนด
const DEFAULT_QUESTIONS = [
  {
    no: 1,
    question: "คำใดเป็นคำควบกล้ำแท้?",
    choiceA: "ปลา",
    choiceB: "มา",
    choiceC: "นา",
    correct: "ก",
    explanation: "คำว่า \"ปลา\" มีพยัญชนะต้น ป และ ล ออกเสียงควบกล้ำพร้อมกัน (ปล)",
    stage: "ด่านที่ 1 : ป่าคำควบกล้ำ"
  },
  {
    no: 2,
    question: "คำใดมีพยัญชนะควบกล้ำ “กร”?",
    choiceA: "กา",
    choiceB: "กราบ",
    choiceC: "กิน",
    correct: "ข",
    explanation: "คำว่า \"กราบ\" ออกเสียง ก ควบกับ ร (กร) พร้อมกัน",
    stage: "ด่านที่ 1 : ป่าคำควบกล้ำ"
  },
  {
    no: 3,
    question: "คำว่า “กล้วย” มีพยัญชนะควบกล้ำใด?",
    choiceA: "กร",
    choiceB: "กล",
    choiceC: "กว",
    correct: "ข",
    explanation: "คำว่า \"กล้วย\" สะกดด้วย ก และ ล (กล) ออกเสียงควบกล้ำกัน",
    stage: "ด่านที่ 2 : ถ้ำปริศนา"
  },
  {
    no: 4,
    question: "คำใดมีพยัญชนะควบกล้ำ “คว”?",
    choiceA: "ควาย",
    choiceB: "คาง",
    choiceC: "คิด",
    correct: "ก",
    explanation: "คำว่า \"ควาย\" มี ค ควบกับ ว (คว) ออกเสียงพร้อมกัน",
    stage: "ด่านที่ 2 : ถ้ำปริศนา"
  },
  {
    no: 5,
    question: "คำใดเป็นคำควบกล้ำแท้?",
    choiceA: "บ้าน",
    choiceB: "โต๊ะ",
    choiceC: "ครู",
    correct: "ค",
    explanation: "คำว่า \"ครู\" มี ค ควบกับ ร (คร) ออกเสียงพร้อมกันเป็นคำควบกล้ำแท้",
    stage: "ด่านที่ 3 : แม่น้ำมหัศจรรย์"
  },
  {
    no: 6,
    question: "คำว่า “แปรง” มีพยัญชนะควบกล้ำใด?",
    choiceA: "ปร",
    choiceB: "ปล",
    choiceC: "พร",
    correct: "ก",
    explanation: "คำว่า \"แปรง\" (เช่น แปรงฟัน) มี ป ควบกับ ร (ปร) ออกเสียงควบกล้ำกัน",
    stage: "ด่านที่ 3 : แม่น้ำมหัศจรรย์"
  },
  {
    no: 7,
    question: "คำใดมีพยัญชนะควบกล้ำ “ตร”?",
    choiceA: "ตา",
    choiceB: "ตรวจ",
    choiceC: "ตี",
    correct: "ข",
    explanation: "คำว่า \"ตรวจ\" มี ต ควบกับ ร (ตร) ออกเสียงพร้อมกัน",
    stage: "ด่านที่ 4 : ปราสาทคำศัพท์"
  },
  {
    no: 8,
    question: "คำใดเป็นคำควบกล้ำแท้?",
    choiceA: "ดอก",
    choiceB: "ขวาน",
    choiceC: "ใบ",
    correct: "ข",
    explanation: "คำว่า \"ขวาน\" มี ข ควบกับ ว (ขว) ออกเสียงพร้อมกัน",
    stage: "ด่านที่ 4 : ปราสาทคำศัพท์"
  },
  {
    no: 9,
    question: "คำว่า “พริก” มีพยัญชนะควบกล้ำใด?",
    choiceA: "พล",
    choiceB: "ปร",
    choiceC: "พร",
    correct: "ค",
    explanation: "คำว่า \"พริก\" มี พ พาน ควบกับ ร เรือ (พร) สระอิ ก ไก่สะกด",
    stage: "ด่านที่ 5 : ด่านพิชิตมังกร"
  },
  {
    no: 10,
    question: "คำใดไม่มีพยัญชนะควบกล้ำ?",
    choiceA: "กวาง",
    choiceB: "เพลง",
    choiceC: "แมว",
    correct: "ค",
    explanation: "คำว่า \"แมว\" มีพยัญชนะต้นตัวเดียวคือ ม ม้า จึงไม่มีพยัญชนะควบกล้ำ",
    stage: "ด่านที่ 5 : ด่านพิชิตมังกร"
  }
];

/**
 * เมนูใน Google Sheets อำนวยความสะดวกให้คุณครูคลิกตั้งค่าได้ทันที
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🎮 เกมคำควบกล้ำ ป.2')
    .addItem('⚡ ติดตั้งชีตอัตโนมัติ (Initialize Sheets)', 'setupSheets')
    .addItem('📝 นำเข้า/รีเซ็ตคำถาม 10 ข้อ (Seed Questions)', 'seedQuestions')
    .addToUi();
}

/**
 * ดึง Spreadsheet Object
 */
function getSpreadsheet() {
  try {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  } catch (e) {
    // หากรันในตัวชีตโดยตรง
    return SpreadsheetApp.getActiveSpreadsheet();
  }
}

/**
 * สร้างชีตทั้ง 4 อัตโนมัติหากยังไม่มี พร้อมกำหนดหัวตารางและสีสันสวยงาม
 */
function setupSheets() {
  const ss = getSpreadsheet();
  
  // 1. ชีต Students
  let sheetStudents = ss.getSheetByName(SHEET_STUDENTS);
  if (!sheetStudents) {
    sheetStudents = ss.insertSheet(SHEET_STUDENTS);
    sheetStudents.appendRow(['รหัสผู้เล่น (Student ID)', 'ชื่อ-นามสกุล', 'ชั้น', 'เลขที่', 'ตัวละคร', 'วันที่ลงทะเบียน']);
    formatHeaderRow(sheetStudents, '#1e3a8a');
  }

  // 2. ชีต Questions
  let sheetQuestions = ss.getSheetByName(SHEET_QUESTIONS);
  if (!sheetQuestions) {
    sheetQuestions = ss.insertSheet(SHEET_QUESTIONS);
    sheetQuestions.appendRow(['ข้อที่', 'คำถาม', 'ตัวเลือก ก', 'ตัวเลือก ข', 'ตัวเลือก ค', 'เฉลย', 'คำอธิบาย', 'ด่าน']);
    formatHeaderRow(sheetQuestions, '#047857');
    seedQuestions();
  } else if (sheetQuestions.getLastRow() <= 1) {
    seedQuestions();
  }

  // 3. ชีต Scores
  let sheetScores = ss.getSheetByName(SHEET_SCORES);
  if (!sheetScores) {
    sheetScores = ss.insertSheet(SHEET_SCORES);
    sheetScores.appendRow(['วันที่-เวลา', 'รหัสผู้เล่น', 'ชื่อ-นามสกุล', 'ชั้น', 'เลขที่', 'คะแนน', 'คะแนนเต็ม', 'ผลผ่าน/ไม่ผ่าน', 'ข้อที่ถูก', 'เวลาที่ใช้ (วินาที)']);
    formatHeaderRow(sheetScores, '#b45309');
  }

  // 4. ชีต Answers
  let sheetAnswers = ss.getSheetByName(SHEET_ANSWERS);
  if (!sheetAnswers) {
    sheetAnswers = ss.insertSheet(SHEET_ANSWERS);
    sheetAnswers.appendRow(['วันที่-เวลา', 'รหัสผู้เล่น', 'ข้อที่', 'คำตอบที่เลือก', 'เฉลย', 'ผลถูก/ผิด']);
    formatHeaderRow(sheetAnswers, '#6b21a8');
  }

  return { success: true, message: "สร้างชีตอัตโนมัติเรียบร้อยแล้ว!" };
}

/**
 * ใส่สีและจัดรูปแบบหัวตาราง
 */
function formatHeaderRow(sheet, bgColor) {
  const headerRange = sheet.getRange(1, 1, 1, sheet.getLastColumn());
  headerRange.setBackground(bgColor);
  headerRange.setFontColor('#ffffff');
  headerRange.setFontWeight('bold');
  headerRange.setHorizontalAlignment('center');
  sheet.setFrozenRows(1);
}

/**
 * เติมคำถามทั้ง 10 ข้ออัตโนมัติ ป้องกันข้อมูลซ้ำ
 */
function seedQuestions() {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_QUESTIONS);
  if (!sheet) {
    setupSheets();
    sheet = ss.getSheetByName(SHEET_QUESTIONS);
  }

  // ล้างแถวข้อมูลเดิม (คงหัวตารางไว้)
  if (sheet.getLastRow() > 1) {
    sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).clearContent();
  }

  const rows = DEFAULT_QUESTIONS.map(q => [
    q.no,
    q.question,
    q.choiceA,
    q.choiceB,
    q.choiceC,
    q.correct,
    q.explanation,
    q.stage
  ]);

  sheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
  return { success: true, count: rows.length };
}

/**
 * จัดการ HTTP GET Requests (ดึงข้อมูล Leaderboard & สถิติ)
 */
function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) ? e.parameter.action : 'getLeaderboard';
  
  if (action === 'getLeaderboard') {
    return handleGetLeaderboard();
  } else if (action === 'getQuestions') {
    return handleGetQuestions();
  } else if (action === 'setup') {
    setupSheets();
    return jsonResponse({ success: true, message: "Setup completed successfully" });
  }

  return jsonResponse({ success: true, message: "Thai Adventure Game API is online." });
}

/**
 * จัดการ HTTP POST Requests (บันทึกคะแนน, บันทึกคำตอบ, ลงทะเบียนนักเรียน)
 */
function doPost(e) {
  try {
    let data;
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else {
      data = e.parameter;
    }

    const action = data.action;

    if (action === 'saveScore') {
      return handleSaveScore(data);
    } else if (action === 'recordAnswer') {
      return handleRecordAnswer(data);
    } else if (action === 'registerStudent') {
      return handleRegisterStudent(data);
    }

    return jsonResponse({ success: false, error: "Unknown action" });
  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  }
}

/**
 * บันทึกคะแนนจบเกมลงในชีต Scores
 */
function handleSaveScore(data) {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_SCORES);
  if (!sheet) {
    setupSheets();
    sheet = ss.getSheetByName(SHEET_SCORES);
  }

  const timestamp = data.timestamp || new Date().toLocaleString('th-TH');
  const studentId = data.studentId || '-';
  const name = data.name || 'ไม่ระบุชื่อ';
  const classroom = data.classroom || '2/1';
  const no = data.no || '-';
  const score = Number(data.score) || 0;
  const total = Number(data.total) || 100;
  const passed = score >= 70 ? 'ผ่าน' : 'ไม่ผ่าน';
  const correctCount = Number(data.correctCount) || 0;
  const duration = Number(data.durationSeconds) || 0;

  sheet.appendRow([
    timestamp,
    studentId,
    name,
    classroom,
    no,
    score,
    total,
    passed,
    correctCount,
    duration
  ]);

  return jsonResponse({ success: true, message: "บันทึกคะแนนเรียบร้อย" });
}

/**
 * บันทึกคำตอบแต่ละข้อลงชีต Answers
 */
function handleRecordAnswer(data) {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_ANSWERS);
  if (!sheet) {
    setupSheets();
    sheet = ss.getSheetByName(SHEET_ANSWERS);
  }

  const timestamp = new Date().toLocaleString('th-TH');
  const studentId = data.studentId || '-';
  const questionId = data.questionId || '-';
  const selectedChoice = data.selectedChoice || '-';
  const correctAnswer = data.correctAnswer || '-';
  const isCorrect = data.isCorrect || '-';

  sheet.appendRow([
    timestamp,
    studentId,
    questionId,
    selectedChoice,
    correctAnswer,
    isCorrect
  ]);

  return jsonResponse({ success: true });
}

/**
 * บันทึกหรืออัปเดตข้อมูลนักเรียนในชีต Students
 */
function handleRegisterStudent(data) {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_STUDENTS);
  if (!sheet) {
    setupSheets();
    sheet = ss.getSheetByName(SHEET_STUDENTS);
  }

  const studentId = data.studentId;
  const name = data.name;
  const classroom = data.classroom;
  const no = data.no;
  const avatar = data.avatar || 'knight';
  const timestamp = new Date().toLocaleString('th-TH');

  // ตรวจสอบข้อมูลซ้ำ
  const values = sheet.getDataRange().getValues();
  let foundRow = -1;
  for (let i = 1; i < values.length; i++) {
    if (values[i][0] === studentId) {
      foundRow = i + 1;
      break;
    }
  }

  if (foundRow > -1) {
    // อัปเดต
    sheet.getRange(foundRow, 2, 1, 4).setValues([[name, classroom, no, avatar]]);
  } else {
    // เพิ่มใหม่
    sheet.appendRow([studentId, name, classroom, no, avatar, timestamp]);
  }

  return jsonResponse({ success: true });
}

/**
 * ดึงตารางคะแนน Leaderboard สำหรับหน้าครู
 */
function handleGetLeaderboard() {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_SCORES);
  if (!sheet || sheet.getLastRow() <= 1) {
    return jsonResponse({ success: true, data: [] });
  }

  const rows = sheet.getDataRange().getValues();
  const list = [];

  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    list.push({
      timestamp: r[0],
      studentId: r[1],
      name: r[2],
      classroom: r[3],
      no: r[4],
      score: r[5],
      total: r[6],
      passed: r[7],
      correctCount: r[8],
      durationSeconds: r[9]
    });
  }

  // เรียงลำดับคะแนนจากมากไปน้อย
  list.sort((a, b) => Number(b.score) - Number(a.score));

  return jsonResponse({ success: true, data: list });
}

/**
 * ดึงรายการคำถาม
 */
function handleGetQuestions() {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_QUESTIONS);
  if (!sheet || sheet.getLastRow() <= 1) {
    return jsonResponse({ success: true, data: DEFAULT_QUESTIONS });
  }

  const rows = sheet.getDataRange().getValues();
  const list = [];

  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    list.push({
      no: r[0],
      question: r[1],
      choiceA: r[2],
      choiceB: r[3],
      choiceC: r[4],
      correct: r[5],
      explanation: r[6],
      stage: r[7]
    });
  }

  return jsonResponse({ success: true, data: list });
}

/**
 * สร้าง Response รูปแบบ JSON พร้อมเปิด CORS Headers
 */
function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
