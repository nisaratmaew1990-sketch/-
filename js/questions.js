/**
 * ข้อมูลด่านและคำถามทั้ง 10 ข้อ
 * ผจญภัยพิชิตดินแดนคำควบกล้ำ
 */

const STAGES_DATA = [
  {
    id: 1,
    name: "ด่านที่ 1 : ป่าคำควบกล้ำ",
    shortName: "ป่าคำควบกล้ำ",
    icon: "🌲",
    badge: "นักสำรวจไพร",
    color: "#4ade80",
    bgGradient: "linear-gradient(135deg, #134e4a, #166534, #15803d)",
    description: "เริ่มต้นการผจญภัยในป่าเวทมนตร์ ค้นหาพยัญชนะควบกล้ำแท้ท่ามกลางต้นไม้ศักดิ์สิทธิ์",
    questionIds: [1, 2]
  },
  {
    id: 2,
    name: "ด่านที่ 2 : ถ้ำปริศนา",
    shortName: "ถ้ำปริศนา",
    icon: "💎",
    badge: "ผู้ไขปริศนาถ้ำ",
    color: "#60a5fa",
    bgGradient: "linear-gradient(135deg, #1e1b4b, #312e81, #1e3a8a)",
    description: "ไขรหัสลับในถ้ำผลึกคริสตัลเรืองแสง เพื่อปลดล็อกทางผ่านไปต่อ",
    questionIds: [3, 4]
  },
  {
    id: 3,
    name: "ด่านที่ 3 : แม่น้ำมหัศจรรย์",
    shortName: "แม่น้ำมหัศจรรย์",
    icon: "🌊",
    badge: "ผู้พิทักษ์สายน้ำ",
    color: "#38bdf8",
    bgGradient: "linear-gradient(135deg, #0c4a6e, #0369a1, #0284c7)",
    description: "กระโดดข้ามใบบัวเวทมนตร์และสายน้ำเชี่ยวกรากด้วยคำตอบที่ถูกต้อง",
    questionIds: [5, 6]
  },
  {
    id: 4,
    name: "ด่านที่ 4 : ปราสาทคำศัพท์",
    shortName: "ปราสาทคำศัพท์",
    icon: "🏰",
    badge: "อัศวินปราสาทแก้ว",
    color: "#f59e0b",
    bgGradient: "linear-gradient(135deg, #78350f, #9a3412, #b45309)",
    description: "เปิดประตูปราสาทโบราณ เพื่อชิงกุญแจทองคำสู่ดินแดนมังกร",
    questionIds: [7, 8]
  },
  {
    id: 5,
    name: "ด่านที่ 5 : ด่านพิชิตมังกร",
    shortName: "ด่านพิชิตมังกร",
    icon: "🐉",
    badge: "ผู้พิชิตมังกรผู้ยิ่งใหญ่",
    color: "#ec4899",
    bgGradient: "linear-gradient(135deg, #831843, #9d174d, #be185d)",
    description: "ใช้พลังคำควบกล้ำเพื่อผูกมิตรกับมังกรพิทักษ์ และรับเกียรติบัตรเกียรติยศ!",
    questionIds: [9, 10]
  }
];

const QUESTIONS_DATA = [
  {
    id: 1,
    stageId: 1,
    questionNumber: 1,
    question: "คำใดเป็นคำควบกล้ำแท้?",
    options: [
      { key: "ก", text: "ปลา" },
      { key: "ข", text: "มา" },
      { key: "ค", text: "นา" }
    ],
    correctAnswer: "ก",
    correctText: "ปลา",
    cluster: "ปล",
    explanation: "คำว่า \"ปลา\" มีพยัญชนะต้น 2 ตัว คือ ป และ ล ออกเสียงควบกล้ำพร้อมกัน (ปล) จัดเป็นคำควบกล้ำแท้",
    encouragement: "สู้ๆ นะคนเก่ง! สังเกตพยัญชนะต้น 2 ตัวที่ออกเสียงพร้อมกัน เช่น ปล ในคำว่า ปลา จ้า"
  },
  {
    id: 2,
    stageId: 1,
    questionNumber: 2,
    question: "คำใดมีพยัญชนะควบกล้ำ “กร”?",
    options: [
      { key: "ก", text: "กา" },
      { key: "ข", text: "กราบ" },
      { key: "ค", text: "กิน" }
    ],
    correctAnswer: "ข",
    correctText: "กราบ",
    cluster: "กร",
    explanation: "คำว่า \"กราบ\" ออกเสียง ก ควบกับ ร (กร) พร้อมกัน จึงมีพยัญชนะควบกล้ำ \"กร\"",
    encouragement: "ลองฝึกออกเสียงดูนะจ๊ะ! คำว่า \"กราบ\" มีทั้ง ก และ ร ออกเสียงควบกันจ้า"
  },
  {
    id: 3,
    stageId: 2,
    questionNumber: 3,
    question: "คำว่า “กล้วย” มีพยัญชนะควบกล้ำใด?",
    options: [
      { key: "ก", text: "กร" },
      { key: "ข", text: "กล" },
      { key: "ค", text: "กว" }
    ],
    correctAnswer: "ข",
    correctText: "กล",
    cluster: "กล",
    explanation: "คำว่า \"กล้วย\" สะกดด้วย ก และ ล (กล) ออกเสียงควบกล้ำกัน ผสมสระอัว และไม้โท",
    encouragement: "ไม่เป็นไรจ้า! กล้วย มี ก ไก่ และ ล ลิง ออกเสียง กล-อัว-ย-กลวย-ไม้โท-กล้วย นะลูก"
  },
  {
    id: 4,
    stageId: 2,
    questionNumber: 4,
    question: "คำใดมีพยัญชนะควบกล้ำ “คว”?",
    options: [
      { key: "ก", text: "ควาย" },
      { key: "ข", text: "คาง" },
      { key: "ค", text: "คิด" }
    ],
    correctAnswer: "ก",
    correctText: "ควาย",
    cluster: "คว",
    explanation: "คำว่า \"ควาย\" มี ค ควบกับ ว (คว) ออกเสียงพร้อมกันเป็นพยัญชนะควบกล้ำ \"คว\"",
    encouragement: "ลองดูคำว่า \"ควาย\" นะลูก ค ควาย กับ ว แหวน ออกเสียงคู่กัน คว-าย=ควาย จ้า"
  },
  {
    id: 5,
    stageId: 3,
    questionNumber: 5,
    question: "คำใดเป็นคำควบกล้ำแท้?",
    options: [
      { key: "ก", text: "บ้าน" },
      { key: "ข", text: "โต๊ะ" },
      { key: "ค", text: "ครู" }
    ],
    correctAnswer: "ค",
    correctText: "ครู",
    cluster: "คร",
    explanation: "คำว่า \"ครู\" มี ค ควบกับ ร (คร) ออกเสียงพร้อมกันเป็นคำควบกล้ำแท้ ส่วน บ้าน และ โต๊ะ มีพยัญชนะต้นตัวเดียว",
    encouragement: "คำว่า \"ครู\" มี ค และ ร ออกเสียงคู่กันเสมอ เป็นคำควบกล้ำแท้ที่พวกเราพบทุกวันเลยนะ"
  },
  {
    id: 6,
    stageId: 3,
    questionNumber: 6,
    question: "คำว่า “แปรง” มีพยัญชนะควบกล้ำใด?",
    options: [
      { key: "ก", text: "ปร" },
      { key: "ข", text: "ปล" },
      { key: "ค", text: "พร" }
    ],
    correctAnswer: "ก",
    correctText: "ปร",
    cluster: "ปร",
    explanation: "คำว่า \"แปรง\" (เช่น แปรงฟัน) มี ป ควบกับ ร (ปร) ออกเสียงควบกล้ำกัน",
    encouragement: "สังเกตดีๆ นะจ๊ะ \"แปรง\" ขึ้นต้นด้วย ป ปลา และ ร เรือ ควบกันเป็น \"ปร\" จ้า"
  },
  {
    id: 7,
    stageId: 4,
    questionNumber: 7,
    question: "คำใดมีพยัญชนะควบกล้ำ “ตร”?",
    options: [
      { key: "ก", text: "ตา" },
      { key: "ข", text: "ตรวจ" },
      { key: "ค", text: "ตี" }
    ],
    correctAnswer: "ข",
    correctText: "ตรวจ",
    cluster: "ตร",
    explanation: "คำว่า \"ตรวจ\" มี ต ควบกับ ร (ตร) ออกเสียงพร้อมกัน เป็นพยัญชนะควบกล้ำ \"ตร\"",
    encouragement: "คำว่า \"ตรวจ\" ต เต่า กับ ร เรือ ออกเสียงควบกัน ตร-วด=ตรวจ จ้า เก่งมากที่ลองทำนะ!"
  },
  {
    id: 8,
    stageId: 4,
    questionNumber: 8,
    question: "คำใดเป็นคำควบกล้ำแท้?",
    options: [
      { key: "ก", text: "ดอก" },
      { key: "ข", text: "ขวาน" },
      { key: "ค", text: "ใบ" }
    ],
    correctAnswer: "ข",
    correctText: "ขวาน",
    cluster: "ขว",
    explanation: "คำว่า \"ขวาน\" มี ข ควบกับ ว (ขว) ออกเสียงพร้อมกัน เป็นคำควบกล้ำแท้",
    encouragement: "สู้ๆ นะคนเก่ง! \"ขวาน\" มี ข ไข่ ควบกับ ว แหวน เป็นคำควบกล้ำแท้จ้า"
  },
  {
    id: 9,
    stageId: 5,
    questionNumber: 9,
    question: "คำว่า “พริก” มีพยัญชนะควบกล้ำใด?",
    options: [
      { key: "ก", text: "พล" },
      { key: "ข", text: "ปร" },
      { key: "ค", text: "พร" }
    ],
    correctAnswer: "ค",
    correctText: "พร",
    cluster: "พร",
    explanation: "คำว่า \"พริก\" มี พ พาน ควบกับ ร เรือ (พร) สระอิ ก ไก่สะกด เป็นพยัญชนะควบกล้ำ \"พร\"",
    encouragement: "พริก มี พ พาน และ ร เรือ ควบกล้ำกันเป็น \"พร\" ออกเสียง พร-อิ-ก=พริก รสเผ็ดจี๊ดเลย!"
  },
  {
    id: 10,
    stageId: 5,
    questionNumber: 10,
    question: "คำใดไม่มีพยัญชนะควบกล้ำ?",
    options: [
      { key: "ก", text: "กวาง" },
      { key: "ข", text: "เพลง" },
      { key: "ค", text: "แมว" }
    ],
    correctAnswer: "ค",
    correctText: "แมว",
    cluster: "ไม่มี",
    explanation: "คำว่า \"แมว\" มีพยัญชนะต้นตัวเดียวคือ ม ม้า จึงไม่มีพยัญชนะควบกล้ำ (กวาง=กว, เพลง=พล)",
    encouragement: "ดูดีๆ นะลูก! กวางมี กว, เพลงมี พล แต่ แมว มีแค่ ม ม้า ตัวเดียวจ้า!"
  }
];

// ข้อมูลตัวละครน่ารักสำหรับให้เด็กๆ เลือก
const CHARACTERS = [
  {
    id: "knight",
    name: "น้องกล้าหาญ",
    title: "อัศวินน้อยพิทักษ์คำไทย",
    icon: "🛡️",
    badge: "สายลุยผู้กล้า",
    avatarBg: "#dbeafe",
    themeColor: "#2563eb",
    quote: "ดาบแห่งปัญญาจะฟันฝ่าทุกอุปสรรค!"
  },
  {
    id: "mage",
    name: "น้องแก้วใส",
    title: "จอมเวทน้อยแห่งป่ามนตรา",
    icon: "🧙‍♀️",
    badge: "สายเวทมนตร์",
    avatarBg: "#fce7f3",
    themeColor: "#db2777",
    quote: "เวทมนตร์คำควบกล้ำ เสกคะแนนเต็มร้อย!"
  },
  {
    id: "explorer",
    name: "น้องต้นน้ำ",
    title: "นักสำรวจดินแดนมหัศจรรย์",
    icon: "🧭",
    badge: "สายนักสำรวจ",
    avatarBg: "#dcfce7",
    themeColor: "#16a34a",
    quote: "ไปสำรวจเกาะคำศัพท์กันเลยพวกเรา!"
  },
  {
    id: "elf",
    name: "น้องฟ้าใส",
    title: "เอลฟ์ผู้พิทักษ์ธรรมชาติ",
    icon: "🧝‍♀️",
    badge: "สายผู้พิทักษ์",
    avatarBg: "#fef3c7",
    themeColor: "#d97706",
    quote: "พลังแห่งความรู้ จะคุ้มครองทุกคน!"
  }
];
