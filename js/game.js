/**
 * ตัวควบคุมหลักของเกม ผจญภัยพิชิตดินแดนคำควบกล้ำ
 * Game Engine & State Management
 */

class AdventureGame {
  constructor() {
    this.currentScreen = 'start';
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.correctCount = 0;
    this.startTime = null;
    this.selectedAnswer = null;
    this.hasAnswered = false;

    // ข้อมูลผู้เล่นปัจจุบัน
    this.player = {
      studentId: '',
      name: '',
      classroom: '2/1',
      no: '',
      avatarId: 'knight'
    };

    this.selectedAvatar = CHARACTERS[0];
  }

  init() {
    this.renderAvatarSelection();
    this.bindEvents();
    this.updateSoundButtonUI();
    this.loadSavedPlayer();
  }

  // โหลดข้อมูลผู้เล่นเดิมหากเคยเล่นไว้
  loadSavedPlayer() {
    try {
      const saved = localStorage.getItem(CONFIG.LOCAL_STORAGE_STUDENT_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.name) document.getElementById('inputStudentName').value = data.name;
        if (data.classroom) document.getElementById('inputStudentClass').value = data.classroom;
        if (data.no) document.getElementById('inputStudentNo').value = data.no;
        if (data.avatarId) this.selectAvatar(data.avatarId);
      }
    } catch (e) {}
  }

  // สร้างตัวเลือกตัวละครน่ารัก
  renderAvatarSelection() {
    const container = document.getElementById('avatarSelector');
    if (!container) return;

    container.innerHTML = CHARACTERS.map(c => `
      <div class="avatar-card ${c.id === this.selectedAvatar.id ? 'active' : ''}" 
           data-avatar-id="${c.id}"
           onclick="game.selectAvatar('${c.id}')"
           style="--theme-color: ${c.themeColor}">
        <div class="avatar-icon-wrapper" style="background: ${c.avatarBg}">
          <span class="avatar-emoji">${c.icon}</span>
        </div>
        <div class="avatar-info">
          <div class="avatar-name">${c.name}</div>
          <div class="avatar-tag">${c.badge}</div>
        </div>
      </div>
    `).join('');
  }

  // เลือกตัวละคร
  selectAvatar(avatarId) {
    const char = CHARACTERS.find(c => c.id === avatarId) || CHARACTERS[0];
    this.selectedAvatar = char;
    this.player.avatarId = char.id;

    document.querySelectorAll('.avatar-card').forEach(el => {
      el.classList.toggle('active', el.dataset.avatarId === avatarId);
    });

    const previewEl = document.getElementById('selectedAvatarQuote');
    if (previewEl) {
      previewEl.textContent = `"${char.quote}"`;
    }

    if (window.audioMgr) window.audioMgr.playClick();
  }

  // ผูกการทำงานปุ่มต่างๆ
  bindEvents() {
    // ปุ่มเริ่มผจญภัย
    const btnStart = document.getElementById('btnStartAdventure');
    if (btnStart) {
      btnStart.addEventListener('click', () => this.handleStartAdventure());
    }

    // ปุ่มเปิด-ปิดเสียง
    const btnSound = document.getElementById('btnToggleSound');
    if (btnSound) {
      btnSound.addEventListener('click', () => {
        const isMuted = window.audioMgr.toggleMute();
        this.updateSoundButtonUI();
      });
    }

    // ปุ่มเปิดหน้าระบบครู
    const btnTeacher = document.getElementById('btnOpenTeacherModal');
    if (btnTeacher) {
      btnTeacher.addEventListener('click', () => this.openTeacherModal());
    }

    // ปุ่มปิดหน้าระบบครู
    const btnCloseTeacher = document.getElementById('btnCloseTeacherModal');
    if (btnCloseTeacher) {
      btnCloseTeacher.addEventListener('click', () => this.closeTeacherModal());
    }

    // ปุ่มส่งออก CSV
    const btnExportCSV = document.getElementById('btnExportCSV');
    if (btnExportCSV) {
      btnExportCSV.addEventListener('click', () => window.teacherDashboard.exportToCSV());
    }

    // ปุ่มรีเฟรชตารางครู
    const btnRefreshTeacher = document.getElementById('btnRefreshTeacher');
    if (btnRefreshTeacher) {
      btnRefreshTeacher.addEventListener('click', () => window.teacherDashboard.loadDashboard());
    }

    // ปุ่มบันทึกการตั้งค่า Web App API URL
    const btnSaveApiUrl = document.getElementById('btnSaveApiUrl');
    if (btnSaveApiUrl) {
      btnSaveApiUrl.addEventListener('click', () => {
        const urlInput = document.getElementById('inputApiUrl');
        if (urlInput) {
          window.apiService.setApiUrl(urlInput.value);
          alert("บันทึกการตั้งค่า Web App URL เรียบร้อย!");
          window.teacherDashboard.loadDashboard();
        }
      });
    }

    // กรองตารางครู
    const filterClass = document.getElementById('teacherFilterClass');
    if (filterClass) {
      filterClass.addEventListener('change', (e) => {
        window.teacherDashboard.selectedClassFilter = e.target.value;
        window.teacherDashboard.renderTable();
      });
    }

    const searchInput = document.getElementById('teacherSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        window.teacherDashboard.searchQuery = e.target.value;
        window.teacherDashboard.renderTable();
      });
    }

    // ปุ่มเล่นอีกครั้ง
    const btnReplay = document.getElementById('btnReplayGame');
    if (btnReplay) {
      btnReplay.addEventListener('click', () => this.restartGame());
    }

    // ปุ่มดาวน์โหลดเกียรติบัตร
    const btnDownloadCert = document.getElementById('btnDownloadCert');
    if (btnDownloadCert) {
      btnDownloadCert.addEventListener('click', () => {
        const canvas = document.getElementById('certificateCanvas');
        window.certGen.downloadAsPNG(canvas, this.player.name, this.score);
      });
    }

    // ปุ่มพิมพ์เกียรติบัตร
    const btnPrintCert = document.getElementById('btnPrintCert');
    if (btnPrintCert) {
      btnPrintCert.addEventListener('click', () => {
        const canvas = document.getElementById('certificateCanvas');
        window.certGen.printCertificate(canvas);
      });
    }
  }

  updateSoundButtonUI() {
    const btnSound = document.getElementById('btnToggleSound');
    if (!btnSound) return;
    const isMuted = window.audioMgr.isMuted;
    btnSound.innerHTML = isMuted ? '🔇 <span class="sound-text">เสียง: ปิด</span>' : '🔊 <span class="sound-text">เสียง: เปิด</span>';
    btnSound.classList.toggle('is-muted', isMuted);
  }

  // เริ่มต้นเกมเมื่อกรอกชื่อและเลือกตัวละคร
  async handleStartAdventure() {
    const nameInput = document.getElementById('inputStudentName');
    const classInput = document.getElementById('inputStudentClass');
    const noInput = document.getElementById('inputStudentNo');

    const name = nameInput ? nameInput.value.trim() : '';
    const classroom = classInput ? classInput.value.trim() : '2/1';
    const no = noInput ? noInput.value.trim() : '';

    if (!name) {
      alert("กรุณากรอกชื่อ-นามสกุล ของนักเรียนก่อนเริ่มผจญภัยนะจ๊ะ!");
      nameInput.focus();
      return;
    }

    if (!classroom) {
      alert("กรุณากรอกชั้นเรียน เช่น ป.2/1 นะจ๊ะ!");
      classInput.focus();
      return;
    }

    if (!no) {
      alert("กรุณากรอกเลขที่ของนักเรียนด้วยนะจ๊ะ!");
      noInput.focus();
      return;
    }

    // ตั้งค่าข้อมูลผู้เล่น
    this.player.name = name;
    this.player.classroom = classroom;
    this.player.no = no;
    this.player.studentId = window.apiService.generateStudentId(name, classroom, no);

    // บันทึกข้อมูลนักเรียน
    window.apiService.registerStudent(this.player);

    // เปิดเสียง BGM และเริ่มเกม
    window.audioMgr.init();
    window.audioMgr.playClick();
    window.audioMgr.startBGM();

    this.score = 0;
    this.correctCount = 0;
    this.currentQuestionIndex = 0;
    this.startTime = new Date();

    // แสดงหน้าเกริ่นนำด่านแรก
    this.showStageIntro(1);
  }

  // แสดงหน้าแนะนำด่าน (Stage Intro Screen)
  showStageIntro(stageId) {
    const stage = STAGES_DATA.find(s => s.id === stageId) || STAGES_DATA[0];
    this.switchScreen('stage-intro');

    document.getElementById('stageIntroBadge').textContent = stage.badge;
    document.getElementById('stageIntroTitle').textContent = stage.name;
    document.getElementById('stageIntroIcon').textContent = stage.icon;
    document.getElementById('stageIntroDesc').textContent = stage.description;
    document.getElementById('stageIntroCard').style.background = stage.bgGradient;

    // ตัวละครพูดทักทาย
    document.getElementById('stageIntroCharIcon').textContent = this.selectedAvatar.icon;
    document.getElementById('stageIntroCharName').textContent = this.selectedAvatar.name;
    document.getElementById('stageIntroCharQuote').textContent = `"${this.selectedAvatar.quote} พร้อมลุย${stage.shortName}แล้ว!"`;

    const btnGo = document.getElementById('btnStartStage');
    btnGo.onclick = () => {
      window.audioMgr.playClick();
      this.loadQuestion(this.currentQuestionIndex);
    };
  }

  // โหลดข้อคำถาม
  loadQuestion(index) {
    if (index >= QUESTIONS_DATA.length) {
      this.handleGameOver();
      return;
    }

    this.currentQuestionIndex = index;
    this.hasAnswered = false;
    this.selectedAnswer = null;

    const q = QUESTIONS_DATA[index];
    const stage = STAGES_DATA.find(s => s.id === q.stageId) || STAGES_DATA[0];

    this.switchScreen('quiz');

    // ซ่อน Modal ผลลัพธ์
    document.getElementById('feedbackModal').classList.add('hidden');

    // อัปเดตส่วนหัวของด่าน
    document.getElementById('quizStageIcon').textContent = stage.icon;
    document.getElementById('quizStageName').textContent = stage.name;
    document.getElementById('quizQuestionProgressText').textContent = `ข้อที่ ${index + 1} / ${QUESTIONS_DATA.length}`;
    document.getElementById('quizScoreText').textContent = `${this.score} คะแนน`;

    // อัปเดตแถบความคืบหน้า (Progress Bar)
    const progressPercent = Math.round(((index + 1) / QUESTIONS_DATA.length) * 100);
    document.getElementById('quizProgressBar').style.width = `${progressPercent}%`;

    // อัปเดตฉากหลัง 2D ประจำด่าน
    const sceneEl = document.getElementById('quizAdventureScene');
    sceneEl.className = `adventure-scene stage-scene-${q.stageId}`;

    // ตัวละครประจำตัว
    document.getElementById('sceneAvatarEmoji').textContent = this.selectedAvatar.icon;
    document.getElementById('sceneAvatarName').textContent = this.player.name || this.selectedAvatar.name;

    // อนิเมชันตัวละครเดินเข้าฉาก
    const avatarEl = document.getElementById('sceneAvatar');
    avatarEl.classList.remove('avatar-cheer', 'avatar-sad');
    avatarEl.classList.add('avatar-walking');

    // กล่องคำถาม
    document.getElementById('questionBadgeNumber').textContent = `คำถามข้อที่ ${index + 1}`;
    document.getElementById('questionText').textContent = q.question;

    // รายการตัวเลือก 3 ตัวเลือก
    const optionsContainer = document.getElementById('quizOptionsContainer');
    optionsContainer.innerHTML = q.options.map(opt => `
      <button class="quiz-option-btn" 
              data-key="${opt.key}"
              onclick="game.handleSelectOption('${opt.key}')">
        <span class="option-key-badge">${opt.key}.</span>
        <span class="option-text">${opt.text}</span>
      </button>
    `).join('');
  }

  // จัดการเมื่อเด็กนักเรียนกดเลือกคำตอบ
  handleSelectOption(choiceKey) {
    if (this.hasAnswered) return;
    this.hasAnswered = true;
    this.selectedAnswer = choiceKey;

    const q = QUESTIONS_DATA[this.currentQuestionIndex];
    const isCorrect = choiceKey === q.correctAnswer;

    // ไฮไลต์ปุ่มตัวเลือก
    document.querySelectorAll('.quiz-option-btn').forEach(btn => {
      const key = btn.dataset.key;
      btn.disabled = true;
      if (key === q.correctAnswer) {
        btn.classList.add('btn-correct');
      } else if (key === choiceKey && !isCorrect) {
        btn.classList.add('btn-incorrect');
      }
    });

    const avatarEl = document.getElementById('sceneAvatar');

    if (isCorrect) {
      // ตอบถูก: +10 คะแนน, ปรบมือ, ดาวรางวัล, ตัวละครกระโดดดีใจ
      this.score += CONFIG.SCORE_PER_QUESTION;
      this.correctCount++;
      document.getElementById('quizScoreText').textContent = `${this.score} คะแนน`;

      window.audioMgr.playCorrect();
      this.triggerConfetti();

      avatarEl.classList.remove('avatar-walking');
      avatarEl.classList.add('avatar-cheer');

      this.showFeedbackModal(true, q);
    } else {
      // ตอบผิด: เสียงให้กำลังใจ, แสดงคำอธิบายและเฉลย, ตัวละครให้กำลังใจ
      window.audioMgr.playIncorrect();

      avatarEl.classList.remove('avatar-walking');
      avatarEl.classList.add('avatar-sad');

      this.showFeedbackModal(false, q);
    }

    // บันทึกคำตอบแบบเรียลไทม์
    window.apiService.recordAnswer({
      studentId: this.player.studentId,
      questionId: q.id,
      selectedChoice: choiceKey,
      correctAnswer: q.correctAnswer,
      isCorrect: isCorrect
    });
  }

  // แสดง Modal ผลลัพธ์พร้อมคำอธิบาย
  showFeedbackModal(isCorrect, question) {
    const modal = document.getElementById('feedbackModal');
    const iconEl = document.getElementById('feedbackIcon');
    const titleEl = document.getElementById('feedbackTitle');
    const scoreBadgeEl = document.getElementById('feedbackScoreBadge');
    const explanationEl = document.getElementById('feedbackExplanation');
    const encourageEl = document.getElementById('feedbackEncouragement');
    const correctBoxEl = document.getElementById('feedbackCorrectBox');

    modal.classList.remove('hidden');

    if (isCorrect) {
      iconEl.textContent = '🌟';
      titleEl.textContent = 'ยอดเยี่ยมมาก! ตอบถูกต้อง!';
      titleEl.className = 'feedback-title text-emerald-600';
      scoreBadgeEl.textContent = '+10 คะแนน ⭐️';
      scoreBadgeEl.className = 'feedback-score-badge badge-green';
      correctBoxEl.innerHTML = `
        <div class="feedback-answer-tag">คำตอบที่ถูกต้อง:</div>
        <div class="font-bold text-lg text-emerald-700">${question.correctAnswer}. ${question.correctText}</div>
      `;
      explanationEl.textContent = question.explanation;
      encourageEl.textContent = '🎉 เก่งมากๆ เลยคนเก่ง ไปผจญภัยข้อต่อไปกันเลย!';
    } else {
      iconEl.textContent = '💪';
      titleEl.textContent = 'สู้ๆ นะจ๊ะ! ไม่เป็นไรเลย';
      titleEl.className = 'feedback-title text-amber-600';
      scoreBadgeEl.textContent = '+0 คะแนน (พยายามใหม่นะ)';
      scoreBadgeEl.className = 'feedback-score-badge badge-amber';
      correctBoxEl.innerHTML = `
        <div class="feedback-answer-tag">คำตอบที่ถูกต้องคือ:</div>
        <div class="font-bold text-lg text-emerald-700">${question.correctAnswer}. ${question.correctText}</div>
      `;
      explanationEl.textContent = question.explanation;
      encourageEl.textContent = question.encouragement;
    }

    const nextBtn = document.getElementById('btnNextQuestion');
    const isLastQuestion = this.currentQuestionIndex === QUESTIONS_DATA.length - 1;
    nextBtn.textContent = isLastQuestion ? '🏆 สรุปผลและรับเกียรติบัตร' : 'ลุยข้อต่อไป ➡️';

    nextBtn.onclick = () => {
      window.audioMgr.playClick();
      modal.classList.add('hidden');
      
      const nextIndex = this.currentQuestionIndex + 1;
      // ตรวจสอบว่าขึ้นด่านใหม่หรือไม่ (ด่านละ 2 ข้อ)
      if (!isLastQuestion && nextIndex % 2 === 0) {
        const nextStageId = Math.floor(nextIndex / 2) + 1;
        this.showStageIntro(nextStageId);
      } else {
        this.loadQuestion(nextIndex);
      }
    };
  }

  // จบเกม: บันทึกคะแนน และแสดงหน้าผลสรุป + เกียรติบัตร
  async handleGameOver() {
    this.switchScreen('game-over');
    window.audioMgr.playVictory();
    this.triggerConfetti();

    const durationSeconds = this.startTime ? Math.round((new Date() - this.startTime) / 1000) : 0;
    const isPassed = this.score >= CONFIG.PASS_SCORE;
    const honor = window.certGen.getHonorLevel(this.score);

    // อัปเดตข้อมูลหน้าสรุปผล
    document.getElementById('resultPlayerName').textContent = this.player.name;
    document.getElementById('resultClassNo').textContent = `ชั้น ป.${this.player.classroom} เลขที่ ${this.player.no}`;
    document.getElementById('resultScoreDisplay').textContent = `${this.score} / 100`;
    document.getElementById('resultHonorBadge').textContent = honor.badge;
    document.getElementById('resultCorrectCount').textContent = `ตอบถูก ${this.correctCount} จาก 10 ข้อ`;

    const passBanner = document.getElementById('resultPassBanner');
    if (isPassed) {
      passBanner.className = 'pass-banner banner-passed';
      passBanner.innerHTML = `
        <div class="banner-title">🎉 ยินดีด้วย! คุณผ่านเกณฑ์การประเมิน</div>
        <div class="banner-subtitle">เกณฑ์ผ่าน 70 คะแนนขึ้นไป ยอดเยี่ยมมากๆ เลย!</div>
      `;
    } else {
      passBanner.className = 'pass-banner banner-failed';
      passBanner.innerHTML = `
        <div class="banner-title">🌱 อีกนิดเดียวเท่านั้นนะคนเก่ง!</div>
        <div class="banner-subtitle">เกณฑ์ผ่านคือ 70 คะแนน ลองเล่นใหม่อีกครั้งเพื่อรับเหรียญทองนะจ๊ะ</div>
      `;
    }

    // วาดเกียรติบัตรลงบน Canvas
    const canvas = document.getElementById('certificateCanvas');
    window.certGen.render(canvas, this.player, this.score);

    // บันทึกคะแนนลง Google Sheets และ LocalStorage
    const scoreRecord = {
      timestamp: new Date().toLocaleString('th-TH'),
      studentId: this.player.studentId,
      name: this.player.name,
      classroom: this.player.classroom,
      no: this.player.no,
      avatar: this.player.avatarId,
      score: this.score,
      correctCount: this.correctCount,
      durationSeconds: durationSeconds,
      passed: isPassed ? 'ผ่าน' : 'ไม่ผ่าน'
    };

    const saveResult = await window.apiService.saveFinalScore(scoreRecord);
    const syncStatusEl = document.getElementById('resultSyncStatus');
    if (syncStatusEl) {
      if (saveResult.localOnly) {
        syncStatusEl.innerHTML = '💾 บันทึกผลคะแนนในเครื่องเรียบร้อยแล้ว (สามารถเล่นซ้ำได้)';
      } else {
        syncStatusEl.innerHTML = '☁️ บันทึกผลคะแนนขึ้น Google Sheets เรียบร้อยแล้ว!';
      }
    }
  }

  // เล่นใหม่อีกครั้ง
  restartGame() {
    window.audioMgr.playClick();
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.correctCount = 0;
    this.startTime = new Date();
    this.showStageIntro(1);
  }

  // สลับหน้าจอเกม
  switchScreen(screenName) {
    this.currentScreen = screenName;
    document.querySelectorAll('.game-screen').forEach(el => el.classList.remove('active'));
    const target = document.getElementById(`screen-${screenName}`);
    if (target) {
      target.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // เปิดหน้าต่างระบบคุณครู
  openTeacherModal() {
    window.audioMgr.playClick();
    const modal = document.getElementById('teacherModal');
    modal.classList.remove('hidden');

    const passcode = prompt("กรุณากรอกรหัสผ่านคุณครู (ค่าเริ่มต้น: 1234):", "");
    if (passcode === null) {
      modal.classList.add('hidden');
      return;
    }

    if (window.teacherDashboard.login(passcode)) {
      // ตั้งค่า URL ปัจจุบันในช่อง Input
      const inputUrl = document.getElementById('inputApiUrl');
      if (inputUrl) {
        inputUrl.value = window.apiService.getApiUrl();
      }
      window.teacherDashboard.loadDashboard();
    } else {
      alert("รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง");
      modal.classList.add('hidden');
    }
  }

  closeTeacherModal() {
    window.audioMgr.playClick();
    document.getElementById('teacherModal').classList.add('hidden');
  }

  // เอฟเฟกต์ Confetti ฉลองความสำเร็จ
  triggerConfetti() {
    const container = document.getElementById('confettiContainer');
    if (!container) return;
    container.innerHTML = '';

    const colors = ['#f59e0b', '#ec4899', '#3b82f6', '#10b981', '#8b5cf6', '#fbbf24'];
    const count = 35;

    for (let i = 0; i < count; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDelay = `${Math.random() * 0.6}s`;
      piece.style.animationDuration = `${1.2 + Math.random() * 1.5}s`;
      piece.style.transform = `rotate(${Math.random() * 360}deg)`;
      container.appendChild(piece);
    }

    setTimeout(() => {
      container.innerHTML = '';
    }, 3000);
  }
}

// เริ่มต้นเกมเมื่อหน้าเว็บพร้อม
window.addEventListener('DOMContentLoaded', () => {
  window.game = new AdventureGame();
  window.game.init();
});
