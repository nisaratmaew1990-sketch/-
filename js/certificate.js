/**
 * ระบบสร้างเกียรติบัตรดิจิทัลความละเอียดสูง (Digital Certificate Generator)
 * สร้างด้วย HTML5 Canvas คมชัดสำหรับดาวน์โหลดเป็นรูปภาพ PNG และพิมพ์ออกกระดาษ A4
 */

class CertificateGenerator {
  constructor() {
    this.canvasWidth = 1600;
    this.canvasHeight = 1130;
  }

  // แปลงวันที่เป็นรูปแบบภาษาไทย พ.ศ.
  getThaiDateString(date = new Date()) {
    const thaiMonths = [
      "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
      "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];
    const day = date.getDate();
    const month = thaiMonths[date.getMonth()];
    const year = date.getFullYear() + 543;
    return `ให้ไว้ ณ วันที่ ${day} เดือน ${month} พ.ศ. ${year}`;
  }

  // ดึงระดับความสำเร็จ
  getHonorLevel(score) {
    if (score >= 100) {
      return {
        title: "ระดับยอดเยี่ยม ดีเลิศ (เหรียญทองเกียรติยศ)",
        color: "#b45309",
        bg: "#fef3c7",
        badge: "มหาอัศวินเหรียญทอง 🏆"
      };
    } else if (score >= 80) {
      return {
        title: "ระดับดีเยี่ยม (เหรียญเงินเกียรติยศ)",
        color: "#475569",
        bg: "#f1f5f9",
        badge: "ยอดอัศวินเหรียญเงิน 🥈"
      };
    } else if (score >= 70) {
      return {
        title: "ระดับผ่านเกณฑ์มาตรฐาน (เหรียญทองแดง)",
        color: "#92400e",
        bg: "#ffedd5",
        badge: "อัศวินผ่านเกณฑ์ 🥉"
      };
    } else {
      return {
        title: "ระดับผู้เข้าร่วมกิจกรรมการเรียนรู้",
        color: "#4b5563",
        bg: "#f3f4f6",
        badge: "นักผจญภัยฝึกหัด 🌱"
      };
    }
  }

  // วาดเกียรติบัตรลงบน Canvas
  render(canvas, studentData, score) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = this.canvasWidth;
    canvas.height = this.canvasHeight;

    const w = this.canvasWidth;
    const h = this.canvasHeight;
    const honor = this.getHonorLevel(score);

    // 1. พื้นหลังกระดาษหรูหราไล่เฉดนวลตา
    const bgGrad = ctx.createLinearGradient(0, 0, w, h);
    bgGrad.addColorStop(0, '#ffffff');
    bgGrad.addColorStop(0.5, '#fffdfa');
    bgGrad.addColorStop(1, '#fefbf3');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // 2. ลายน้ำพื้นหลัง (Subtle Geometric / Thai ornament)
    ctx.save();
    ctx.strokeStyle = "rgba(217, 119, 6, 0.04)";
    ctx.lineWidth = 1;
    for (let r = 80; r < 700; r += 60) {
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();

    // 3. กรอบขอบนอกสีทองหรูหรา 2 ชั้น
    ctx.save();
    // กรอบนอกหนา
    ctx.strokeStyle = "#d97706";
    ctx.lineWidth = 14;
    ctx.strokeRect(36, 36, w - 72, h - 72);

    // กรอบในเส้นบาง
    ctx.strokeStyle = "#b45309";
    ctx.lineWidth = 3;
    ctx.strokeRect(54, 54, w - 108, h - 108);

    // กรอบลวดลายทองคลาสสิก
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 2;
    ctx.setLineDash([12, 6]);
    ctx.strokeRect(64, 64, w - 128, h - 128);
    ctx.setLineDash([]);
    ctx.restore();

    // 4. ลายมุมกรอบทั้ง 4 มุม (Corner Ornaments)
    this.drawCornerOrnament(ctx, 60, 60, 0);
    this.drawCornerOrnament(ctx, w - 60, 60, Math.PI / 2);
    this.drawCornerOrnament(ctx, w - 60, h - 60, Math.PI);
    this.drawCornerOrnament(ctx, 60, h - 60, -Math.PI / 2);

    // 5. สัญลักษณ์ตราเกียรติยศด้านบน (Royal Laurel Wreath & Crest)
    this.drawCrest(ctx, w / 2, 170);

    // 6. ข้อความส่วนหัว
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // หัวเรื่อง
    ctx.font = "bold 44px 'Prompt', 'Kanit', sans-serif";
    ctx.fillStyle = "#92400e";
    ctx.fillText("เกียรติบัตรฉบับนี้ให้ไว้เพื่อแสดงว่า", w / 2, 305);

    // ชื่อนักเรียน (เด่นชัด สวยงาม)
    ctx.font = "bold 64px 'Prompt', 'Kanit', sans-serif";
    ctx.fillStyle = "#1e3a8a";
    ctx.fillText(studentData.name || "นักเรียนคนเก่ง", w / 2, 400);

    // เส้นตกแต่งใต้ชื่อ
    const lineGrad = ctx.createLinearGradient(w / 2 - 320, 0, w / 2 + 320, 0);
    lineGrad.addColorStop(0, "transparent");
    lineGrad.addColorStop(0.5, "#d97706");
    lineGrad.addColorStop(1, "transparent");
    ctx.strokeStyle = lineGrad;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(w / 2 - 320, 445);
    ctx.lineTo(w / 2 + 320, 445);
    ctx.stroke();

    // ข้อมูล ชั้น / เลขที่
    ctx.font = "500 34px 'Prompt', 'Kanit', sans-serif";
    ctx.fillStyle = "#4b5563";
    const classInfo = `ชั้นประถมศึกษาปีที่ ${studentData.classroom || "2"}   เลขที่ ${studentData.no || "-"}`;
    ctx.fillText(classInfo, w / 2, 490);

    // ข้อความอธิบายความสำเร็จ
    ctx.font = "normal 34px 'Prompt', 'Kanit', sans-serif";
    ctx.fillStyle = "#374151";
    ctx.fillText("ได้ผ่านการทดสอบวัดความรู้และพิชิตดินแดนคำควบกล้ำ ในเกมการศึกษาออนไลน์", w / 2, 560);

    // ชื่อเกม
    ctx.font = "bold 46px 'Prompt', 'Kanit', sans-serif";
    ctx.fillStyle = "#b45309";
    ctx.fillText("“ผจญภัยพิชิตดินแดนคำควบกล้ำ”", w / 2, 630);

    // กล่องแสดงคะแนนและระดับเหรียญรางวัล
    const boxW = 860;
    const boxH = 100;
    const boxX = w / 2 - boxW / 2;
    const boxY = 690;

    ctx.save();
    ctx.fillStyle = honor.bg;
    ctx.strokeStyle = honor.color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    this.roundRect(ctx, boxX, boxY, boxW, boxH, 20);
    ctx.fill();
    ctx.stroke();

    ctx.font = "bold 38px 'Prompt', 'Kanit', sans-serif";
    ctx.fillStyle = honor.color;
    ctx.fillText(`ได้คะแนน ${score} / 100 คะแนน  •  ${honor.title}`, w / 2, boxY + boxH / 2);
    ctx.restore();

    // สโลแกนให้กำลังใจ
    ctx.font = "italic 28px 'Prompt', 'Kanit', sans-serif";
    ctx.fillStyle = "#6b7280";
    ctx.fillText("ขอให้มีความมุ่งมั่น ขยันหมั่นเพียร และประสบความสำเร็จในการเรียนรู้ภาษาไทยสืบไป", w / 2, 830);

    // วันที่ออกเกียรติบัตร
    ctx.font = "500 28px 'Prompt', 'Kanit', sans-serif";
    ctx.fillStyle = "#4b5563";
    ctx.fillText(this.getThaiDateString(), w / 2, 885);

    // 7. ตราประทับสีทองด้านซ้าย (Golden Seal)
    this.drawGoldenBadge(ctx, 260, 990, score);

    // 8. ส่วนลงนามคุณครูและประธานวิชาการ (Signatures)
    this.drawSignature(ctx, w - 380, 960, "กลุ่มสาระการเรียนรู้ภาษาไทย", "ประธานคณะกรรมการพัฒนาสื่อนวัตกรรม");

    // 9. รหัสอ้างอิงเกียรติบัตร (Certificate ID)
    ctx.textAlign = "right";
    ctx.font = "20px monospace";
    ctx.fillStyle = "#9ca3af";
    ctx.fillText(`Ref: ${studentData.studentId || "CERT-THAI-2026"}`, w - 80, h - 75);
  }

  // วาดลายมุมฉลุทอง
  drawCornerOrnament(ctx, x, y, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.strokeStyle = "#d97706";
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(60, 0);
    ctx.arc(60, 20, 20, -Math.PI / 2, 0, false);
    ctx.lineTo(20, 60);
    ctx.arc(0, 60, 20, 0, Math.PI / 2, true);
    ctx.closePath();
    ctx.stroke();

    ctx.fillStyle = "#fbbf24";
    ctx.beginPath();
    ctx.arc(20, 20, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // วาดตราสัญลักษณ์ด้านบน
  drawCrest(ctx, cx, cy) {
    ctx.save();

    // รัศมีทอง
    const sunGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 75);
    sunGrad.addColorStop(0, '#fef08a');
    sunGrad.addColorStop(0.7, '#f59e0b');
    sunGrad.addColorStop(1, '#b45309');

    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 60, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#78350f";
    ctx.lineWidth = 4;
    ctx.stroke();

    // ไอคอนหนังสือและปากกาขนนกตรงกลาง
    ctx.fillStyle = "#ffffff";
    ctx.font = "52px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("📖", cx, cy - 2);

    // ช่อชัยพฤกษ์ (Laurel Leaves) ด้านข้าง
    ctx.strokeStyle = "#d97706";
    ctx.lineWidth = 4;

    // ช่อซ้าย
    ctx.beginPath();
    ctx.arc(cx - 50, cy, 55, 0.4 * Math.PI, 1.4 * Math.PI, false);
    ctx.stroke();

    // ช่อขวา
    ctx.beginPath();
    ctx.arc(cx + 50, cy, 55, 1.6 * Math.PI, 0.6 * Math.PI, false);
    ctx.stroke();

    ctx.restore();
  }

  // วาดตราประทับทอง (Golden Stamp)
  drawGoldenBadge(ctx, cx, cy, score) {
    ctx.save();
    // ริบบิ้นห้อยด้านล่าง
    ctx.fillStyle = "#dc2626";
    ctx.beginPath();
    ctx.moveTo(cx - 30, cy + 20);
    ctx.lineTo(cx - 45, cy + 80);
    ctx.lineTo(cx - 25, cy + 65);
    ctx.lineTo(cx - 10, cy + 80);
    ctx.lineTo(cx, cy + 20);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(cx, cy + 20);
    ctx.lineTo(cx + 10, cy + 80);
    ctx.lineTo(cx + 25, cy + 65);
    ctx.lineTo(cx + 45, cy + 80);
    ctx.lineTo(cx + 30, cy + 20);
    ctx.fill();

    // ตราฟันปลาทองรอบวง
    ctx.fillStyle = "#d97706";
    const points = 24;
    const outerR = 58;
    const innerR = 50;
    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const angle = (i * Math.PI) / points;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();

    // วงกลมใน
    const innerGrad = ctx.createRadialGradient(cx, cy, 5, cx, cy, 45);
    innerGrad.addColorStop(0, '#fef3c7');
    innerGrad.addColorStop(1, '#f59e0b');
    ctx.fillStyle = innerGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 44, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#92400e";
    ctx.lineWidth = 2;
    ctx.stroke();

    // ข้อความในตรา
    ctx.fillStyle = "#78350f";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 18px 'Prompt', 'Kanit', sans-serif";
    ctx.fillText("ผ่านเกณฑ์", cx, cy - 12);
    ctx.font = "bold 24px 'Prompt', 'Kanit', sans-serif";
    ctx.fillText(`${score} คะแนน`, cx, cy + 12);

    ctx.restore();
  }

  // วาดจุดลงนาม
  drawSignature(ctx, cx, cy, line1, line2) {
    ctx.save();
    ctx.textAlign = "center";

    // เส้นประลงนาม
    ctx.strokeStyle = "#9ca3af";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx - 150, cy);
    ctx.lineTo(cx + 150, cy);
    ctx.stroke();

    // ลายเซ็นดิจิทัลประดับ
    ctx.strokeStyle = "#1e3a8a";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(cx - 80, cy - 25);
    ctx.bezierCurveTo(cx - 40, cy - 60, cx + 10, cy - 10, cx + 60, cy - 35);
    ctx.bezierCurveTo(cx + 20, cy - 15, cx - 10, cy - 40, cx + 80, cy - 20);
    ctx.stroke();

    // ข้อความตำแหน่ง
    ctx.font = "500 24px 'Prompt', 'Kanit', sans-serif";
    ctx.fillStyle = "#374151";
    ctx.fillText(`( ${line1} )`, cx, cy + 32);

    ctx.font = "20px 'Prompt', 'Kanit', sans-serif";
    ctx.fillStyle = "#6b7280";
    ctx.fillText(line2, cx, cy + 62);
    ctx.restore();
  }

  // วาดสี่เหลี่ยมโค้งมน
  roundRect(ctx, x, y, width, height, radius) {
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
  }

  // ฟังก์ชันดาวน์โหลดเกียรติบัตรเป็นภาพ PNG
  downloadAsPNG(canvas, studentName = "นักเรียน", score = 100) {
    if (!canvas) return;
    const link = document.createElement('a');
    const cleanName = studentName.trim().replace(/\s+/g, '_');
    link.download = `เกียรติบัตร_${cleanName}_${score}คะแนน.png`;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // ฟังก์ชันสั่งพิมพ์
  printCertificate(canvas) {
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("กรุณาอนุญาตป็อปอัปในเบราว์เซอร์เพื่อพิมพ์เกียรติบัตร");
      return;
    }
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>พิมพ์เกียรติบัตร</title>
          <style>
            @page {
              size: A4 landscape;
              margin: 0;
            }
            body {
              margin: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              background: #fff;
            }
            img {
              max-width: 98vw;
              max-height: 96vh;
              object-fit: contain;
            }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <img src="${dataUrl}" />
        </body>
      </html>
    `);
    printWindow.document.close();
  }
}

window.certGen = new CertificateGenerator();
