/**
 * จัดการการเชื่อมต่อ Google Sheets ผ่าน Google Apps Script Web App
 * พร้อมระบบ LocalStorage สำรองเมื่อออฟไลน์ เพื่อให้เกมเล่นได้อย่างราบรื่น 100%
 */

class ApiService {
  constructor() {
    this.apiUrl = CONFIG.API_URL || '';
    this.spreadsheetId = CONFIG.SPREADSHEET_ID;
  }

  // อัปเดต URL ของ Web App
  setApiUrl(url) {
    this.apiUrl = (url || '').trim();
    CONFIG.API_URL = this.apiUrl;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(CONFIG.LOCAL_STORAGE_API_URL_KEY, this.apiUrl);
    }
  }

  getApiUrl() {
    return this.apiUrl;
  }

  // สร้างรหัสประจำตัวผู้เล่นอัตโนมัติ เช่น STU-2026-XXXX
  generateStudentId(name, classroom, no) {
    const cleanName = (name || '').trim().replace(/\s+/g, '_');
    const randomHex = Math.random().toString(16).substring(2, 6).toUpperCase();
    return `P2-${classroom.replace(/[^0-9]/g, '') || '0'}-${no || '0'}-${randomHex}`;
  }

  // บันทึกข้อมูลนักเรียน
  async registerStudent(studentData) {
    // บันทึกลง LocalStorage ก่อนเสมอ
    localStorage.setItem(CONFIG.LOCAL_STORAGE_STUDENT_KEY, JSON.stringify(studentData));

    if (!this.apiUrl) {
      console.log("[API] ยังไม่ได้เชื่อมต่อ Web App - บันทึกในเบราว์เซอร์เรียบร้อย");
      return { success: true, localOnly: true };
    }

    try {
      const payload = {
        action: 'registerStudent',
        studentId: studentData.studentId,
        name: studentData.name,
        classroom: studentData.classroom,
        no: studentData.no,
        avatar: studentData.avatarId || 'knight',
        timestamp: new Date().toISOString()
      };

      await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
        mode: 'no-cors'
      });

      return { success: true };
    } catch (err) {
      console.warn("[API] บันทึกข้อมูลนักเรียนทางออนไลน์ไม่สำเร็จ บันทึกในเครื่องแทน:", err);
      return { success: true, localOnly: true };
    }
  }

  // บันทึกคำตอบแต่ละข้อแบบเรียลไทม์ (Answers Sheet)
  async recordAnswer(answerData) {
    const answersKey = 'thai_game_answers_v1';
    const localAnswers = JSON.parse(localStorage.getItem(answersKey) || '[]');
    localAnswers.push({
      ...answerData,
      recordedAt: new Date().toLocaleString('th-TH')
    });
    localStorage.setItem(answersKey, JSON.stringify(localAnswers));

    if (!this.apiUrl) return;

    try {
      const payload = {
        action: 'recordAnswer',
        studentId: answerData.studentId,
        questionId: answerData.questionId,
        selectedChoice: answerData.selectedChoice,
        correctAnswer: answerData.correctAnswer,
        isCorrect: answerData.isCorrect ? "ถูก" : "ผิด",
        scoreDelta: answerData.isCorrect ? CONFIG.SCORE_PER_QUESTION : 0,
        timestamp: new Date().toISOString()
      };

      fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
        mode: 'no-cors'
      }).catch(e => console.warn("[API] Answer push failed:", e));
    } catch (err) {
      console.warn("[API] recordAnswer error:", err);
    }
  }

  // บันทึกคะแนนจบเกม (Scores Sheet)
  async saveFinalScore(scoreRecord) {
    // 1. บันทึกลง LocalStorage เสมอ เพื่อการันตีว่าข้อมูลไม่หาย
    const localScores = this.getLocalScores();
    localScores.unshift(scoreRecord);
    localStorage.setItem(CONFIG.LOCAL_STORAGE_SCORES_KEY, JSON.stringify(localScores));

    // 2. ถ้ามี API URL ให้ส่งไปยัง Google Apps Script
    if (!this.apiUrl) {
      console.log("[API] บันทึกผลคะแนนในเครื่องสำเร็จ (ยังไม่ได้ตั้งค่า Web App)");
      return { success: true, localOnly: true, scoreRecord };
    }

    try {
      const payload = {
        action: 'saveScore',
        timestamp: scoreRecord.timestamp || new Date().toLocaleString('th-TH'),
        studentId: scoreRecord.studentId,
        name: scoreRecord.name,
        classroom: scoreRecord.classroom,
        no: scoreRecord.no,
        avatar: scoreRecord.avatar || 'knight',
        score: scoreRecord.score,
        total: CONFIG.MAX_SCORE,
        passed: scoreRecord.score >= CONFIG.PASS_SCORE ? 'ผ่าน' : 'ไม่ผ่าน',
        correctCount: scoreRecord.correctCount,
        durationSeconds: scoreRecord.durationSeconds || 0
      };

      // ใช้ no-cors หรือ cors รองรับ Google Apps Script redirection
      await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
        mode: 'no-cors'
      });

      console.log("[API] ส่งคะแนนไปยัง Google Sheets เรียบร้อย!");
      return { success: true, scoreRecord };
    } catch (err) {
      console.error("[API] ส่งคะแนนไป Google Sheets ไม่สำเร็จ:", err);
      return { success: true, localOnly: true, error: err.message, scoreRecord };
    }
  }

  // ดึงคะแนนจาก LocalStorage
  getLocalScores() {
    try {
      const data = localStorage.getItem(CONFIG.LOCAL_STORAGE_SCORES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  // ดึงข้อมูล Leaderboard สำหรับหน้าระบบคุณครู
  async fetchLeaderboard() {
    // ถ้าไม่มี API URL หรือออฟไลน์ ให้ใช้ข้อมูลใน LocalStorage
    if (!this.apiUrl) {
      return {
        success: true,
        source: 'local',
        data: this.getLocalScores()
      };
    }

    try {
      const res = await fetch(`${this.apiUrl}?action=getLeaderboard`, {
        method: 'GET',
        cache: 'no-cache'
      });

      if (!res.ok) throw new Error("Network response was not ok");
      const json = await res.json();
      return {
        success: true,
        source: 'cloud',
        data: json.data || []
      };
    } catch (err) {
      console.warn("[API] ดึงข้อมูลจาก Cloud ล้มเหลว สลับใช้ข้อมูลในเครื่อง:", err);
      return {
        success: true,
        source: 'local_fallback',
        data: this.getLocalScores()
      };
    }
  }

  // ล้างข้อมูลคะแนนในเครื่อง (สำหรับคุณครูรีเซ็ต)
  clearLocalScores() {
    localStorage.removeItem(CONFIG.LOCAL_STORAGE_SCORES_KEY);
    localStorage.removeItem('thai_game_answers_v1');
  }
}

window.apiService = new ApiService();
