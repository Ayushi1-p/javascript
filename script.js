// --- TAB SWITCHING ---
function showTab(id, e) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById('tab-' + id).classList.add('active');
  e.target.classList.add('active');
}

// --- MEMORY VISUALIZER ---
let stackItems = [], heapItems = [];
function addMemory(label, type, value, loc, addr) {
  const isObj = ['object','array','function'].includes(type);
  const row = `<div class="memory-row">
    <span class="mem-var">${label.split('=')[0].replace('let ','').trim()}</span>
    <span class="mem-arrow">→</span>
    <span class="mem-val" style="color:${isObj ? 'var(--obj)' : 'var(--prim)'}">${value}</span>
    <span class="mem-type">${type}</span>
    <span class="mem-addr">${addr}</span>
  </div>`;
  document.getElementById('stack-rows').innerHTML += row;
  if (document.getElementById('stack-rows').querySelector('.muted-center')) {
    document.getElementById('stack-rows').querySelector('.muted-center').remove();
  }
  if (isObj) {
    const heapAddr = value.replace('→ Heap @','');
    const heapRow = `<div class="memory-row">
      <span class="mem-var" style="color:var(--obj)">${heapAddr}</span>
      <span class="mem-arrow">→</span>
      <span class="mem-val" style="color:var(--text)">${type === 'array' ? '[1, 2, 3]' : type === 'function' ? 'function() {...}' : '{ name: "Ayushi", age: 22 }'}</span>
      <span class="mem-type">${type}</span>
    </div>`;
    const heapEl = document.getElementById('heap-rows');
    if (heapEl.children[0] && heapEl.children[0].style.textAlign === 'center') heapEl.innerHTML = '';
    heapEl.innerHTML += heapRow;
  }
}
function clearMemory() {
  document.getElementById('stack-rows').innerHTML = '<div style="padding:16px;font-family:var(--mono);font-size:12px;color:var(--muted);text-align:center">click buttons above →</div>';
  document.getElementById('heap-rows').innerHTML = '<div style="padding:16px;font-family:var(--mono);font-size:12px;color:var(--muted);text-align:center">object data lives here</div>';
}

// --- COPY DEMOS ---
function runPrimCopy() {
  let a = 10, b = a;
  b = 99;
  document.getElementById('prim-copy-out').innerHTML =
    `<span class="info">let a = 10</span>\n<span class="info">let b = a  →  b is now 10</span>\n<span class="warn">b = 99  →  only b changes</span>\n\n<span class="ok">a = ${a}  ✅ (unchanged!)</span>\n<span class="ok">b = ${b}</span>`;
}
function runObjCopy() {
  let user1 = { name: "Ayushi" };
  let user2 = user1;
  user2.name = "Priya";
  document.getElementById('obj-copy-out').innerHTML =
    `<span class="info">let user1 = { name: "Ayushi" }</span>\n<span class="info">let user2 = user1  →  both point to SAME object</span>\n<span class="warn">user2.name = "Priya"  →  modifies shared object</span>\n\n<span class="err">user1.name = "${user1.name}"  😱 user1 changed too!</span>\n<span class="err">user2.name = "${user2.name}"</span>\n\n<span class="warn">This is the reference copy trap!</span>`;
}
function runTrueCopy() {
  let original = { name: "Ayushi", age: 22 };
  let copy = { ...original };
  copy.name = "Priya";
  document.getElementById('true-copy-out').innerHTML =
    `<span class="info">let original = { name: "Ayushi", age: 22 }</span>\n<span class="info">let copy = { ...original }  →  spread creates NEW object</span>\n<span class="warn">copy.name = "Priya"</span>\n\n<span class="ok">original.name = "${original.name}"  ✅ safe!</span>\n<span class="ok">copy.name = "${copy.name}"</span>`;
}

// --- MUTATION DEMOS ---
function runConstDemo() {
  const user = { name: "Ayushi" };
  user.name = "Priya";
  user.age = 22;
  document.getElementById('const-out').innerHTML =
    `<span class="info">const user = { name: "Ayushi" }</span>\n<span class="ok">user.name = "Priya"  ✅ works! (mutation, not reassignment)</span>\n<span class="ok">user.age = 22  ✅ works!</span>\n<span class="ok">user = { name: "Priya" } → ❌ would throw TypeError</span>\n\n<span class="warn">const user → { name: "${user.name}", age: ${user.age} }</span>`;
}
function runCompare() {
  // FIX: extracted to variables first to avoid template literal parse error with {} === {}
  const obj1 = ({}) === ({});
  const arr1 = ([] === []);
  document.getElementById('compare-out').innerHTML =
    `<span class="info">Primitives compared by VALUE:</span>\n<span class="ok">5 === 5  →  ${5===5}</span>\n<span class="ok">"hi" === "hi"  →  ${"hi"==="hi"}</span>\n\n<span class="info">Objects compared by REFERENCE:</span>\n<span class="err">{} === {}  →  ${obj1} (different objects in memory!)</span>\n<span class="err">[] === []  →  ${arr1}</span>\n\n<span class="info">Same reference:</span>\n<span class="ok">const a = [1,2,3]; const b = a; a === b  →  true ✅</span>`;
}
function runImmutable() {
  let str = "hello";
  str[0] = "H";
  document.getElementById('immutable-out').innerHTML =
    `<span class="info">let str = "hello"</span>\n<span class="warn">str[0] = "H"  →  silently fails on primitives</span>\n<span class="err">str is still: "${str}" ← unchanged!</span>\n\n<span class="ok">To change: str = "Hello"  →  creates new string value</span>`;
}

// --- TYPEOF DEMOS ---
function runTypeof() {
  const input = document.getElementById('typeof-input').value;
  let result, typeResult;
  try {
    result = eval(input);
    typeResult = typeof result;
  } catch(e) {
    document.getElementById('typeof-out').innerHTML = `<span class="err">Error: ${e.message}</span>`;
    return;
  }
  const color = ['string','number','boolean','undefined','symbol','bigint'].includes(typeResult) ? 'var(--prim)' : 'var(--obj)';
  document.getElementById('typeof-out').innerHTML =
    `<span class="info">typeof ${input}</span>\n\n<span style="color:${color};font-size:18px;font-weight:bold">"${typeResult}"</span>\n\n${typeResult === 'object' && result === null ? '<span class="warn">⚠️ This is the famous null bug in JS — null is NOT actually an object!</span>' : ''}${Array.isArray(result) ? '<span class="warn">⚠️ Arrays return "object" — use Array.isArray() to check</span>' : ''}`;
}

// FIX: wrapped in DOMContentLoaded so the input element exists before attaching the listener
document.addEventListener('DOMContentLoaded', function() {
  const typeofInput = document.getElementById('typeof-input');
  if (typeofInput) {
    typeofInput.addEventListener('keypress', e => { if(e.key==='Enter') runTypeof(); });
  }
});

function runArrayCheck() {
  const nums = [1,2,3];
  document.getElementById('array-check-out').innerHTML =
    `<span class="info">const nums = [1, 2, 3]</span>\n\n<span class="ok">Array.isArray(nums)  →  ${Array.isArray(nums)}  ✅ best way</span>\n<span class="ok">nums instanceof Array  →  ${nums instanceof Array}  ✅</span>\n<span class="err">typeof nums  →  "${typeof nums}"  ❌ can't distinguish array from object</span>\n\n<span class="info">const val = null</span>\n<span class="ok">val === null  →  true  ✅ only correct way to check null</span>\n<span class="err">typeof null  →  "object"  ❌ (this is a JS bug!)</span>`;
}

// --- QUIZ ---
const questions = [
  {
    q: "What will be logged?",
    code: `let a = 5;\nlet b = a;\nb = 20;\nconsole.log(a);`,
    options: ["20", "5", "undefined", "Error"],
    answer: 1,
    explain: "Primitives are copied by VALUE. b gets a new copy of 5. Changing b does NOT affect a."
  },
  {
    q: "What will user1.name be after this code?",
    code: `let user1 = { name: "Ayushi" };\nlet user2 = user1;\nuser2.name = "Priya";`,
    options: ['"Ayushi"', '"Priya"', 'undefined', 'Error'],
    answer: 1,
    explain: "Objects are copied by REFERENCE. user2 and user1 point to the SAME object. Changing user2.name changes user1.name too."
  },
  {
    q: "What does typeof null return?",
    code: `console.log(typeof null);`,
    options: ['"null"', '"undefined"', '"object"', '"primitive"'],
    answer: 2,
    explain: 'typeof null returns "object" — this is a famous historical bug in JavaScript. null is NOT actually an object!'
  },
  {
    q: "Will this code throw an error?",
    code: `const user = { name: "Ayushi" };\nuser.age = 22;\nconsole.log(user.age);`,
    options: ["Yes, TypeError", "No, logs 22", "No, logs undefined", "Yes, SyntaxError"],
    answer: 1,
    explain: "const prevents reassignment of the variable, NOT mutation of the object. Adding properties works fine."
  },
  {
    q: "What will this log?",
    code: `console.log([] === []);`,
    options: ["true", "false", "undefined", "Error"],
    answer: 1,
    explain: "Objects (including arrays) are compared by REFERENCE. These are two separate arrays in memory, so they are NOT equal."
  },
  {
    q: "What is the best way to check if a value is an array?",
    code: `const nums = [1, 2, 3];\n// Which check is correct?`,
    options: ['typeof nums === "array"', 'typeof nums === "object"', 'Array.isArray(nums)', 'nums.type === "array"'],
    answer: 2,
    explain: "Array.isArray() is the correct and only reliable way. typeof returns 'object' for arrays, which is misleading."
  },
  {
    q: "What will str be after this code?",
    code: `let str = "hello";\nstr[0] = "H";\nconsole.log(str);`,
    options: ['"Hello"', '"hello"', '"H"', 'undefined'],
    answer: 1,
    explain: "Strings (primitives) are immutable. You cannot change individual characters. The assignment silently fails."
  },
  {
    q: "What will this spread copy do?",
    code: `let a = { name: "Ayushi" };\nlet b = { ...a };\nb.name = "Priya";\nconsole.log(a.name);`,
    options: ['"Priya"', '"Ayushi"', 'undefined', 'Error'],
    answer: 1,
    explain: "Spread creates a NEW object — a shallow copy. b is independent from a, so changing b.name does NOT affect a.name."
  }
];

let current = 0, score = 0, answered = false;

function renderQuiz() {
  const q = questions[current];
  const pct = (current / questions.length) * 100;
  document.getElementById('quiz-progress').style.width = pct + '%';
  document.getElementById('quiz-score-top').textContent = `Question ${current + 1} of ${questions.length}  |  Score: ${score}`;

  document.getElementById('quiz-container').innerHTML = `
    <div class="quiz-q">${q.q}</div>
    <div class="quiz-code">${q.code.replace(/</g,'&lt;').replace(/\n/g,'<br>')}</div>
    <div class="quiz-options">
      ${q.options.map((opt, i) => `<button class="quiz-opt" onclick="checkAnswer(${i})" id="opt-${i}">${opt}</button>`).join('')}
    </div>
    <div class="quiz-result" id="quiz-result"></div>
    <div class="quiz-nav">
      <span></span>
      <button class="btn btn-prim" id="next-btn" style="display:none" onclick="nextQ()">Next →</button>
    </div>
  `;
  answered = false;
}

function checkAnswer(idx) {
  if (answered) return;
  answered = true;
  const q = questions[current];
  const resultEl = document.getElementById('quiz-result');
  document.querySelectorAll('.quiz-opt').forEach(o => o.style.pointerEvents = 'none');
  if (idx === q.answer) {
    score++;
    document.getElementById(`opt-${idx}`).classList.add('correct');
    resultEl.innerHTML = `<span style="color:var(--green)">✅ Correct! ${q.explain}</span>`;
  } else {
    document.getElementById(`opt-${idx}`).classList.add('wrong');
    document.getElementById(`opt-${q.answer}`).classList.add('correct');
    resultEl.innerHTML = `<span style="color:var(--obj)">❌ Not quite. ${q.explain}</span>`;
  }
  document.getElementById('next-btn').style.display = 'inline-block';
  document.getElementById('quiz-score-top').textContent = `Question ${current + 1} of ${questions.length}  |  Score: ${score}`;
}

function nextQ() {
  current++;
  if (current >= questions.length) {
    document.getElementById('quiz-progress').style.width = '100%';
    const grade = score >= 7 ? '🏆 Excellent!' : score >= 5 ? '👍 Good job!' : '📚 Keep practising!';
    document.getElementById('quiz-container').innerHTML = `
      <div style="text-align:center;padding:32px 0;">
        <div style="font-size:48px;margin-bottom:16px">${grade.split(' ')[0]}</div>
        <div style="font-size:24px;font-weight:800;margin-bottom:8px">You scored ${score} / ${questions.length}</div>
        <div style="color:var(--muted);font-family:var(--mono);font-size:13px;margin-bottom:24px">${grade.split(' ').slice(1).join(' ')}</div>
        <button class="btn btn-prim" onclick="restartQuiz()">↺ Try Again</button>
      </div>
    `;
  } else {
    renderQuiz();
  }
}

function restartQuiz() { current = 0; score = 0; renderQuiz(); }

renderQuiz();