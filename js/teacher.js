/**
 * ระบบหน้าสรุปผลสำหรับคุณครู (Teacher Dashboard)
 * จัดการตารางอันดับคะแนน สถิติการเรียนรู้ และการตั้งค่าเชื่อมต่อ Google Sheets
 */

class TeacherDashboard {
  constructor() {
    this.isAuthenticated = false;
    this.scoresData = [];
    this.selectedClassFilter = 'ALL';
    this.searchQuery = '';
  }

  // ตรวจสอบรหัสผ่านคุณครู
  login(passcode) {
    if (passcode === CONFIG.TEACHER_PASSCODE || passcode === 'admin') {
      this.isAuthenticated = true;
      return true;
    }
    return false;
  }

  // โหลดข้อมูลคะแนนและสถิติ
  async loadDashboard() {
    const result = await window.apiService.fetchLeaderboard();
    this.scoresData = result.data || [];
    this.renderStats();
    this.renderTable();
    this.updateConnectionStatus(result.source);
  }

  // อัปเดตสถานะการเชื่อมต่อ
  updateConnectionStatus(source) {
    const statusEl = document.getElementById('teacherConnectionBadge');
    if (!statusEl) return;

    const currentUrl = window.apiService.getApiUrl();
    if (source === 'cloud') {
      statusEl.className = 'status-badge status-online';
      statusEl.innerHTML = '🟢 เชื่อมต่อ Google Sheets เรียบร้อย (Cloud Online)';
    } else if (currentUrl) {
      statusEl.className = 'status-badge status-syncing';
      statusEl.innerHTML = '🟡 บันทึกในเครื่อง & รอซิงก์ Cloud';
    } else {
      statusEl.className = 'status-badge status-local';
      statusEl.innerHTML = '⚪ โหมดบันทึกในเครื่อง (ยังไม่ได้เชื่อม Web App)';
    }
  }

  // คำนวณและแสดงสถิติภาพรวม
  renderStats() {
    const total = this.scoresData.length;
    let passedCount = 0;
    let perfectCount = 0;
    let sumScore = 0;

    this.scoresData.forEach(item => {
      const score = Number(item.score) || 0;
      sumScore += score;
      if (score >= CONFIG.PASS_SCORE) passedCount++;
      if (score >= CONFIG.MAX_SCORE) perfectCount++;
    });

    const avgScore = total > 0 ? (sumScore / total).toFixed(1) : 0;
    const passPercent = total > 0 ? Math.round((passedCount / total) * 100) : 0;

    document.getElementById('statTotalPlayers').textContent = total;
    document.getElementById('statAvgScore').textContent = `${avgScore} / 100`;
    document.getElementById('statPassRate').textContent = `${passPercent}% (${passedCount} คน)`;
    document.getElementById('statPerfectCount').textContent = perfectCount;
  }

  // กรองข้อมูลคะแนนตามห้องเรียนและการค้นหา
  getFilteredScores() {
    return this.scoresData.filter(item => {
      // กรองห้องเรียน
      if (this.selectedClassFilter !== 'ALL') {
        const itemClass = (item.classroom || '').toString().toLowerCase();
        const filterVal = this.selectedClassFilter.toLowerCase();
        if (!itemClass.includes(filterVal)) return false;
      }

      // ค้นหาตามชื่อหรือเลขที่
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        const nameMatch = (item.name || '').toLowerCase().includes(query);
        const noMatch = (item.no || '').toString().includes(query);
        if (!nameMatch && !noMatch) return false;
      }

      return true;
    });
  }

  // แสดงผลตารางอันดับคะแนน
  renderTable() {
    const tbody = document.getElementById('teacherScoreTableBody');
    if (!tbody) return;

    const filtered = this.getFilteredScores();

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="text-center py-6 text-gray-500">
            ยังไม่มีข้อมูลคะแนน หรือไม่พบข้อมูลตามเงื่อนไขที่ค้นหา
          </td>
        </tr>
      `;
      return;
    }

    // จัดเรียงคะแนนจากมากไปน้อย (ถ้าคะแนนเท่ากัน ดูเวลา)
    const sorted = [...filtered].sort((a, b) => (Number(b.score) || 0) - (Number(a.score) || 0));

    let html = '';
    sorted.forEach((item, index) => {
      const rank = index + 1;
      const score = Number(item.score) || 0;
      const isPassed = score >= CONFIG.PASS_SCORE;
      
      let rankBadge = rank;
      if (rank === 1) rankBadge = '🥇 1';
      else if (rank === 2) rankBadge = '🥈 2';
      else if (rank === 3) rankBadge = '🥉 3';

      html += `
        <tr class="${rank <= 3 ? 'top-rank-row' : ''}">
          <td class="font-bold text-center">${rankBadge}</td>
          <td class="font-semibold">${this.escapeHtml(item.name || 'ไม่ระบุชื่อ')}</td>
          <td class="text-center">ป.${this.escapeHtml(item.classroom || '2')}</td>
          <td class="text-center">${this.escapeHtml(item.no || '-')}</td>
          <td class="text-center font-bold ${score >= 70 ? 'text-green-600' : 'text-amber-600'}">
            ${score} / 100
          </td>
          <td class="text-center">
            <span class="badge ${isPassed ? 'badge-pass' : 'badge-fail'}">
              ${isPassed ? '✓ ผ่านเกณฑ์' : '✗ ไม่ผ่าน'}
            </span>
          </td>
          <td class="text-xs text-gray-400 text-center">${this.escapeHtml(item.timestamp || '-')}</td>
        </tr>
      `;
    });

    tbody.innerHTML = html;
  }

  // ส่งออกตารางคะแนนเป็นไฟล์ CSV รองรับภาษาไทย (UTF-8 with BOM)
  exportToCSV() {
    const filtered = this.getFilteredScores();
    if (filtered.length === 0) {
      alert("ไม่มีข้อมูลคะแนนสำหรับส่งออก");
      return;
    }

    const headers = ["อันดับ", "ชื่อ-นามสกุล", "ชั้น", "เลขที่", "คะแนน", "ผลการประเมิน", "วันที่เวลา"];
    const rows = filtered.map((item, idx) => [
      idx + 1,
      `"${(item.name || '').replace(/"/g, '""')}"`,
      `"${item.classroom || '2'}"`,
      `"${item.no || '-'}"`,
      item.score || 0,
      (Number(item.score) >= CONFIG.PASS_SCORE) ? "ผ่าน" : "ไม่ผ่าน",
      `"${item.timestamp || ''}"`
    ]);

    let csvContent = "\uFEFF"; // UTF-8 BOM สำหรับ Excel ภาษาไทย
    csvContent += headers.join(",") + "\r\n";
    rows.forEach(r => {
      csvContent += r.join(",") + "\r\n";
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `สรุปคะแนน_คำควบกล้ำ_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}

window.teacherDashboard = new TeacherDashboard();
