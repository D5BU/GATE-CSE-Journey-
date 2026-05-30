// Register Service Worker for Offline-First Capability
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('Service Worker Registered Successfully', reg.scope))
      .catch(err => console.log('Service Worker Registration Failed', err));
  });
}

// Handle PWA Installation Prompt
let deferredPrompt;
const installBtn = document.getElementById('install-btn');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = 'flex';
});

installBtn.addEventListener('click', async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install prompt: ${outcome}`);
    deferredPrompt = null;
    installBtn.style.display = 'none';
  }
});

// DEFAULT SUBJECTS DATA (Fallback and Local Initial State)
const DEFAULT_SUBJECTS = [
  {
    "id": "Discrete_Mathematics",
    "name": "Discrete Mathematics",
    "weightage": 8,
    "color": "#ff2d55",
    "topics": [
      "Propositional & First-Order Logic",
      "Sets, Relations, Functions, Lattices",
      "Groups and Monoids",
      "Graph Theory (Connectivity, Matching, Coloring)",
      "Combinatorics (Counting, Recurrences, Generating Functions)"
    ]
  },
  {
    "id": "Engineering_Mathematics",
    "name": "Engineering Mathematics",
    "weightage": 5,
    "color": "#ff2d55",
    "topics": [
      "Linear Algebra (Matrices, Eigenvalues, LU)",
      "Calculus (Limits, Continuity, Max-Min, Integrals)",
      "Probability & Statistics (Bayes, Random Variables, Distributions)"
    ]
  },
  {
    "id": "Digital_Logic",
    "name": "Digital Logic",
    "weightage": 5,
    "color": "#00f2ff",
    "topics": [
      "Boolean Algebra & Minimization",
      "Combinational Circuits (Mux, Decoder, Adder)",
      "Sequential Circuits (Flip-flops, Counters, Registers)",
      "Number Representation & Arithmetic"
    ]
  },
  {
    "id": "Computer_Organization_Architecture",
    "name": "Computer Organization & Architecture",
    "weightage": 7,
    "color": "#00f2ff",
    "topics": [
      "Machine Instructions & Addressing Modes",
      "ALU, Data Path & Control Unit",
      "Instruction Pipelining & Hazards",
      "Memory Hierarchy (Cache Mapping, Replacement, VM)",
      "I/O Interfaces & DMA"
    ]
  },
  {
    "id": "Data_Structures",
    "name": "Data Structures",
    "weightage": 7,
    "color": "#c1ff72",
    "topics": [
      "Programming in C (Pointers, Recursion, Parameter Passing)",
      "Arrays, Stacks, Queues, Linked Lists",
      "Trees & Binary Search Trees",
      "Binary Heaps & Priority Queues",
      "Graph Representations"
    ]
  },
  {
    "id": "Algorithms",
    "name": "Algorithms",
    "weightage": 7,
    "color": "#c1ff72",
    "topics": [
      "Asymptotic Complexity & Analysis",
      "Divide & Conquer, Greedy Algorithms",
      "Dynamic Programming basics",
      "Graph Traversals (BFS, DFS, MST)",
      "Shortest Path Algorithms (Dijkstra, Bellman-Ford)"
    ]
  },
  {
    "id": "Theory_of_Computation",
    "name": "Theory of Computation",
    "weightage": 9,
    "color": "#ff2d55",
    "topics": [
      "Regular Languages, DFA, NFA, RegEx",
      "Context-Free Languages, CFGs, PDA",
      "Turing Machines & Chomsky Hierarchy",
      "Undecidability & Halting Problem"
    ]
  },
  {
    "id": "Compiler_Design",
    "name": "Compiler Design",
    "weightage": 4,
    "color": "#00f2ff",
    "topics": [
      "Lexical Analysis & DFA Construction",
      "Syntax Analysis (LL(1), LR(0), SLR, LALR, CLR Parsers)",
      "Syntax-Directed Translation & SDT schemas",
      "Intermediate Code Generation (DAG, 3AC, SSA)",
      "Code Optimization & Runtime Environments"
    ]
  },
  {
    "id": "Operating_Systems",
    "name": "Operating Systems",
    "weightage": 9,
    "color": "#00f2ff",
    "topics": [
      "Processes, Threads, System Calls & IPC",
      "CPU Scheduling Algorithms",
      "Process Synchronization, Semaphores & Mutexes",
      "Deadlock (Prevention, Avoidance - Banker's, Detection)",
      "Memory Management (Paging, Segmentation, Virtual Memory)",
      "File Systems & Disk Scheduling"
    ]
  },
  {
    "id": "Database_Management_Systems",
    "name": "Database Management Systems",
    "weightage": 7,
    "color": "#c1ff72",
    "topics": [
      "ER-to-Relational Mapping & Relational Algebra",
      "SQL Queries & Constraints",
      "Normalization (1NF, 2NF, 3NF, BCNF, Multivalued)",
      "Transactions & Concurrency Control (Serializability, 2PL, Locking)",
      "File Organization & B/B+ Trees Indexing"
    ]
  },
  {
    "id": "Computer_Networks",
    "name": "Computer Networks",
    "weightage": 9,
    "color": "#ff2d55",
    "topics": [
      "OSI & TCP/IP Reference Models",
      "Data Link Protocols (Framing, Flow & Error Control, Windowing)",
      "MAC protocols (CSMA/CD, Ethernet, Wi-Fi)",
      "Routing Protocols & IP Addressing (CIDR Subnetting, IPv4/IPv6)",
      "Transport Layer (TCP, UDP, Congestion Control)",
      "Application Protocols (DNS, SMTP, HTTP, DHCP)"
    ]
  },
  {
    "id": "General_Aptitude",
    "name": "General Aptitude",
    "weightage": 15,
    "color": "#c1ff72",
    "topics": [
      "Quantitative Aptitude (Percentages, Combinatorics, Ratios, Probability)",
      "Verbal Aptitude (Grammar, Reading Comprehension, Vocab)",
      "Analytical Aptitude (Logical reasoning, Relations)",
      "Spatial Aptitude (Pattern transformations, 2D/3D rotations)"
    ]
  }
];

// STATE INITIALIZATION
let subjectsData = [...DEFAULT_SUBJECTS];
let userProgress = {}; // Key: "subjectId:topicIndex" -> Boolean
let pyqScores = {};    // Key: "subjectId:topicIndex" -> Integer (0-100)
let studyLogs = [];    // Array of objects: { date: "YYYY-MM-DD", subjectId: "...", hours: 1.5 }
let studyStreak = { count: 0, lastStudyDate: null };

// LOAD FROM LOCAL STORAGE
function loadState() {
  const savedProgress = localStorage.getItem('gateQuest_userProgress');
  const savedScores = localStorage.getItem('gateQuest_pyqScores');
  const savedLogs = localStorage.getItem('gateQuest_studyLogs');
  const savedStreak = localStorage.getItem('gateQuest_streak');
  const savedTrends = localStorage.getItem('gateQuest_subjectsData');

  if (savedProgress) userProgress = JSON.parse(savedProgress);
  if (savedScores) pyqScores = JSON.parse(savedScores);
  if (savedLogs) studyLogs = JSON.parse(savedLogs);
  if (savedStreak) studyStreak = JSON.parse(savedStreak);
  if (savedTrends) subjectsData = JSON.parse(savedTrends);
}

// SAVE TO LOCAL STORAGE
function saveState() {
  localStorage.setItem('gateQuest_userProgress', JSON.stringify(userProgress));
  localStorage.setItem('gateQuest_pyqScores', JSON.stringify(pyqScores));
  localStorage.setItem('gateQuest_studyLogs', JSON.stringify(studyLogs));
  localStorage.setItem('gateQuest_streak', JSON.stringify(studyStreak));
}

// NAVIGATION TABS IMPLEMENTATION
const navButtons = document.querySelectorAll('.nav-btn');
const tabContents = document.querySelectorAll('.tab-content');

navButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const tabName = btn.getAttribute('data-tab');
    
    // Switch active state of nav button
    navButtons.forEach(nb => nb.classList.remove('active'));
    btn.classList.add('active');
    
    // Switch active state of tab page content
    tabContents.forEach(tc => tc.classList.remove('active'));
    document.getElementById(`tab-${tabName}`).classList.add('active');
    
    // Trigger chart redraw if switching to metrics tab
    if (tabName === 'metrics') {
      renderRadarChart();
      renderHeatmap();
    }
  });
});

// DYNAMIC ACCORDION GENERATION (Syllabus page)
const accordionContainer = document.getElementById('syllabus-accordion');

function generateSyllabusAccordion() {
  accordionContainer.innerHTML = '';
  
  subjectsData.forEach((subject) => {
    // Calculate subject metrics
    const totalTopics = subject.topics.length;
    let completedCount = 0;
    let totalAccuracySum = 0;
    let scoredTopicsCount = 0;
    
    subject.topics.forEach((topic, index) => {
      const key = `${subject.id}:${index}`;
      if (userProgress[key]) completedCount++;
      if (pyqScores[key] !== undefined) {
        totalAccuracySum += pyqScores[key];
        scoredTopicsCount++;
      }
    });
    
    const progressPercent = Math.round((completedCount / totalTopics) * 100);
    const avgAccuracy = scoredTopicsCount > 0 ? Math.round(totalAccuracySum / scoredTopicsCount) : 0;
    
    // Create DOM element
    const item = document.createElement('div');
    item.className = 'accordion-item';
    item.id = `sub-card-${subject.id}`;
    
    item.innerHTML = `
      <div class="accordion-header" style="color: ${subject.color}">
        <div class="accordion-info">
          <span class="accordion-bullet" style="color: ${subject.color}"></span>
          <span class="accordion-title">${subject.name}</span>
        </div>
        <div class="accordion-metrics">
          <div class="accordion-metric">
            <span class="metric-val" style="color: ${subject.color}">${progressPercent}%</span>
            <span class="metric-lbl">MASTERED</span>
          </div>
          <div class="accordion-metric">
            <span class="metric-val" style="color: #c1ff72">${avgAccuracy}%</span>
            <span class="metric-lbl">ACCURACY</span>
          </div>
          <svg class="accordion-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>
      <div class="accordion-content">
        <div class="accordion-inner">
          <div class="topics-list">
            ${subject.topics.map((topic, index) => {
              const key = `${subject.id}:${index}`;
              const checked = userProgress[key] ? 'checked' : '';
              const accuracyVal = pyqScores[key] !== undefined ? pyqScores[key] : 50;
              return `
                <div class="topic-row">
                  <div class="topic-left">
                    <label class="custom-checkbox-wrapper">
                      <input type="checkbox" data-sub="${subject.id}" data-idx="${index}" ${checked} class="topic-check">
                      <span class="checkbox-mark"></span>
                    </label>
                    <span class="topic-name">${topic}</span>
                  </div>
                  <div class="topic-right">
                    <span class="accuracy-label">PYQ ACCURACY</span>
                    <div class="accuracy-control">
                      <input type="range" class="accuracy-slider topic-slider" min="0" max="100" value="${accuracyVal}" data-sub="${subject.id}" data-idx="${index}">
                      <span class="accuracy-val-badge">${accuracyVal}%</span>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;
    
    // Add Click listener to Header to toggle Expand
    const header = item.querySelector('.accordion-header');
    header.addEventListener('click', (e) => {
      // Don't expand if user clicks inner elements directly, just standard toggling
      const isExpanded = item.classList.contains('expanded');
      
      // Close all others
      document.querySelectorAll('.accordion-item').forEach(ai => ai.classList.remove('expanded'));
      
      if (!isExpanded) {
        item.classList.add('expanded');
      }
    });
    
    accordionContainer.appendChild(item);
  });
  
  // Attach listeners to Checkboxes & Sliders
  attachInputsListeners();
}

function attachInputsListeners() {
  // Checkbox interactions
  document.querySelectorAll('.topic-check').forEach(chk => {
    chk.addEventListener('change', (e) => {
      const subId = chk.getAttribute('data-sub');
      const idx = chk.getAttribute('data-idx');
      const key = `${subId}:${idx}`;
      
      userProgress[key] = chk.checked;
      saveState();
      updateDashboardStats();
      
      // Trigger a toast notification
      const subject = subjectsData.find(s => s.id === subId);
      const topicName = subject.topics[idx];
      showToast(chk.checked ? 'TOPIC COMPLETED' : 'TOPIC UNCHECKED', `"${topicName}" inside ${subject.name}`, chk.checked ? 'cyan' : 'pink');
      
      // Update local accordion metrics header values dynamically
      updateAccordionHeader(subId);
    });
  });

  // Slider accuracy adjustments
  document.querySelectorAll('.topic-slider').forEach(sld => {
    const valBadge = sld.nextElementSibling;
    
    sld.addEventListener('input', (e) => {
      valBadge.textContent = `${sld.value}%`;
    });
    
    sld.addEventListener('change', (e) => {
      const subId = sld.getAttribute('data-sub');
      const idx = sld.getAttribute('data-idx');
      const key = `${subId}:${idx}`;
      
      pyqScores[key] = parseInt(sld.value);
      saveState();
      updateDashboardStats();
      updateAccordionHeader(subId);
    });
  });
}

function updateAccordionHeader(subId) {
  const subject = subjectsData.find(s => s.id === subId);
  const totalTopics = subject.topics.length;
  let completedCount = 0;
  let totalAccuracySum = 0;
  let scoredTopicsCount = 0;
  
  subject.topics.forEach((topic, index) => {
    const key = `${subId}:${index}`;
    if (userProgress[key]) completedCount++;
    if (pyqScores[key] !== undefined) {
      totalAccuracySum += pyqScores[key];
      scoredTopicsCount++;
    }
  });
  
  const progressPercent = Math.round((completedCount / totalTopics) * 100);
  const avgAccuracy = scoredTopicsCount > 0 ? Math.round(totalAccuracySum / scoredTopicsCount) : 0;
  
  const card = document.getElementById(`sub-card-${subId}`);
  if (card) {
    const metrics = card.querySelectorAll('.metric-val');
    if (metrics.length >= 2) {
      metrics[0].textContent = `${progressPercent}%`;
      metrics[1].textContent = `${avgAccuracy}%`;
    }
  }
}

// SYLLABUS LIST POPULATION IN QUICK LOG
const logSubjectSelect = document.getElementById('log-subject');

function populateQuickLogDropdown() {
  logSubjectSelect.innerHTML = '';
  subjectsData.forEach(sub => {
    const opt = document.createElement('option');
    opt.value = sub.id;
    opt.textContent = sub.name;
    logSubjectSelect.appendChild(opt);
  });
}

// LOG STUDY SESSION BUTTON
const saveLogBtn = document.getElementById('save-log-btn');
const logHoursInput = document.getElementById('log-hours');

saveLogBtn.addEventListener('click', () => {
  const subId = logSubjectSelect.value;
  const hours = parseFloat(logHoursInput.value);
  
  if (isNaN(hours) || hours <= 0) {
    showToast('INVALID LOG', 'Study hours must be greater than zero.', 'pink');
    return;
  }
  
  const today = new Date().toISOString().split('T')[0];
  
  // Save log
  studyLogs.push({
    date: today,
    subjectId: subId,
    hours: hours
  });
  
  // Calculate and update study streak
  updateStreak(today);
  
  saveState();
  updateDashboardStats();
  
  const subjectName = subjectsData.find(s => s.id === subId).name;
  showToast('SESSION LOGGED', `Logged ${hours} hrs of ${subjectName} for today!`, 'lime');
  
  // Reset input field
  logHoursInput.value = '1.0';
});

// STREAK MANAGEMENT
function updateStreak(todayDateStr) {
  if (!studyStreak.lastStudyDate) {
    studyStreak.count = 1;
  } else {
    const lastDate = new Date(studyStreak.lastStudyDate);
    const currentDate = new Date(todayDateStr);
    
    // Difference in days
    const diffTime = Math.abs(currentDate - lastDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      studyStreak.count += 1;
    } else if (diffDays > 1) {
      studyStreak.count = 1; // Streak broken, restart
    }
    // If diffDays is 0 (logged multiple times in one day), streak count stays same
  }
  
  studyStreak.lastStudyDate = todayDateStr;
}

// REFRESH STREAK STATS ON APP LOAD (e.g. check if streak is broken)
function verifyStreakIntegrity() {
  if (!studyStreak.lastStudyDate) return;
  
  const today = new Date().toISOString().split('T')[0];
  const lastDate = new Date(studyStreak.lastStudyDate);
  const currentDate = new Date(today);
  
  const diffTime = Math.abs(currentDate - lastDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays > 1) {
    // More than 1 day has passed without studying. Streak is broken.
    studyStreak.count = 0;
    saveState();
  }
}

// DASHBOARD NUMERICAL STATS SYNCING & VETERAN FOCUS CALCULATOR
function updateDashboardStats() {
  // 1. Calculate overall syllabus completion
  let totalTopicsCount = 0;
  let completedTopicsCount = 0;
  
  subjectsData.forEach(sub => {
    totalTopicsCount += sub.topics.length;
    sub.topics.forEach((topic, idx) => {
      if (userProgress[`${sub.id}:${idx}`]) completedTopicsCount++;
    });
  });
  
  const completionPercentage = totalTopicsCount > 0 ? ((completedTopicsCount / totalTopicsCount) * 100).toFixed(1) : '0.0';
  document.getElementById('progress-value').textContent = `${completionPercentage}%`;
  document.getElementById('progress-desc').textContent = `${completedTopicsCount} of ${totalTopicsCount} topics checked off.`;
  
  // 2. Study Streak value
  document.getElementById('streak-value').textContent = `${studyStreak.count} DAYS`;
  if (studyStreak.count > 0) {
    document.getElementById('streak-desc').textContent = `Keep going! Last session logged on ${studyStreak.lastStudyDate}.`;
  } else {
    document.getElementById('streak-desc').textContent = `Log your study session below to start a study streak.`;
  }
  
  // 3. Average PYQ Accuracy
  let totalScoreSum = 0;
  let scoresCount = 0;
  
  for (let key in pyqScores) {
    totalScoreSum += pyqScores[key];
    scoresCount++;
  }
  
  const avgAccuracy = scoresCount > 0 ? Math.round(totalScoreSum / scoresCount) : 0;
  document.getElementById('accuracy-value').textContent = `${avgAccuracy}%`;
  
  let accuracyDesc = '';
  if (scoresCount === 0) {
    accuracyDesc = 'No practice marks logged yet.';
  } else if (avgAccuracy < 50) {
    accuracyDesc = `Weak accuracy! Log more correct PYQs.`;
    document.getElementById('accuracy-value').className = 'card-value text-glow-pink';
  } else if (avgAccuracy < 75) {
    accuracyDesc = `Moderate accuracy. Target 75%+ score.`;
    document.getElementById('accuracy-value').className = 'card-value text-glow-cyan';
  } else {
    accuracyDesc = `Excellent accuracy! Maintain this rank pace.`;
    document.getElementById('accuracy-value').className = 'card-value text-glow-lime';
  }
  document.getElementById('accuracy-desc').textContent = accuracyDesc;

  // 4. Heuristic: AI Recommended Focus Subject & Topic
  calculateRecommendedFocus();
}

function calculateRecommendedFocus() {
  let highestPriorityIndex = -1;
  let recommendedTopicStr = 'NOT AVAILABLE';
  let recommendedSubjectName = '';
  let reasonStr = 'Start by logging your topics!';
  
  subjectsData.forEach(sub => {
    // Subject properties
    const weight = sub.weightage;
    
    // Subject completions & accuracy
    let subCompleted = 0;
    let subAccuracySum = 0;
    let scoredTopics = 0;
    
    sub.topics.forEach((topic, idx) => {
      const key = `${sub.id}:${idx}`;
      if (userProgress[key]) subCompleted++;
      if (pyqScores[key] !== undefined) {
        subAccuracySum += pyqScores[key];
        scoredTopics++;
      }
    });
    
    const subCompletionRatio = subCompleted / sub.topics.length;
    const subAvgAccuracy = scoredTopics > 0 ? (subAccuracySum / scoredTopics) : 60; // assume 60% default if unstudied
    
    // Calculate neglected days
    const lastSessionLog = studyLogs.slice().reverse().find(l => l.subjectId === sub.id);
    let daysNeglected = 15; // default high neglect
    if (lastSessionLog) {
      const lastDate = new Date(lastSessionLog.date);
      const today = new Date();
      const diff = Math.ceil(Math.abs(today - lastDate) / (1000 * 60 * 60 * 24));
      daysNeglected = Math.min(diff, 30);
    }
    
    // Focus Priority Index (FPI) Formula
    // Higher weight, lower completion, lower accuracy, and higher neglect raise FPI
    const fpi = weight * (1.5 - subCompletionRatio) * (1.1 - (subAvgAccuracy / 100)) * (1 + (daysNeglected / 15));
    
    if (fpi > highestPriorityIndex) {
      // Find first incomplete topic in this subject
      let targetTopicIdx = -1;
      for (let i = 0; i < sub.topics.length; i++) {
        if (!userProgress[`${sub.id}:${i}`]) {
          targetTopicIdx = i;
          break;
        }
      }
      
      // If all completed, find topic with lowest accuracy
      if (targetTopicIdx === -1) {
        let lowestAcc = 101;
        sub.topics.forEach((_, i) => {
          const acc = pyqScores[`${sub.id}:${i}`];
          if (acc !== undefined && acc < lowestAcc) {
            lowestAcc = acc;
            targetTopicIdx = i;
          }
        });
      }
      
      if (targetTopicIdx !== -1) {
        highestPriorityIndex = fpi;
        recommendedSubjectName = sub.name;
        recommendedTopicStr = sub.topics[targetTopicIdx];
        
        if (!userProgress[`${sub.id}:${targetTopicIdx}`]) {
          reasonStr = `High weight subject (${weight}M). Incomplete crucial syllabus.`;
        } else {
          reasonStr = `Accuracy on this topic is low (${pyqScores[`${sub.id}:${targetTopicIdx}`]}%). Needs practice.`;
        }
      }
    }
  });
  
  if (recommendedSubjectName) {
    document.getElementById('focus-value').innerHTML = `<span style="font-size: 0.75rem; letter-spacing: 0.1em; display:block; opacity:0.5;">${recommendedSubjectName.toUpperCase()}</span> ${recommendedTopicStr}`;
    document.getElementById('focus-desc').textContent = reasonStr;
  }
}

// CANVAS DRAWING: RADAR CHART (Weakness & Subjects Weight)
function renderRadarChart() {
  const canvas = document.getElementById('radarChart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  const center = { x: canvas.width / 2, y: canvas.height / 2 };
  const radius = 130;
  const numSubjects = subjectsData.length;
  const angleStep = (2 * Math.PI) / numSubjects;
  
  // 1. Draw Concentric Grid Rings
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.lineWidth = 1;
  for (let r = 1; r <= 5; r++) {
    const ringRadius = (radius / 5) * r;
    ctx.beginPath();
    ctx.arc(center.x, center.y, ringRadius, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Add grid scale label
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.font = '8px Satoshi';
    ctx.fillText(`${r * 20}%`, center.x + 3, center.y - ringRadius + 8);
  }
  
  // 2. Draw Spokes and Subject Labels
  subjectsData.forEach((sub, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const xEnd = center.x + radius * Math.cos(angle);
    const yEnd = center.y + radius * Math.sin(angle);
    
    // Spoke line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.beginPath();
    ctx.moveTo(center.x, center.y);
    ctx.lineTo(xEnd, yEnd);
    ctx.stroke();
    
    // Labels
    const labelDistance = radius + 22;
    const xLabel = center.x + labelDistance * Math.cos(angle);
    const yLabel = center.y + labelDistance * Math.sin(angle);
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = 'bold 7px Satoshi';
    
    // Format subject abbreviation
    let label = sub.name.split(' ').map(w => w[0]).join('');
    if (sub.name === 'Operating Systems') label = 'OS';
    if (sub.name === 'Computer Networks') label = 'CN';
    if (sub.name === 'Compiler Design') label = 'CD';
    if (sub.name === 'General Aptitude') label = 'APT';
    if (sub.name === 'Theory of Computation') label = 'TOC';
    if (sub.name === 'Discrete Mathematics') label = 'DISC';
    if (sub.name === 'Engineering Mathematics') label = 'MATH';
    if (sub.name === 'Digital Logic') label = 'DL';
    
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, xLabel, yLabel);
  });
  
  // 3. Draw Weight Polygon (Pink Area, normalized against 15 marks max)
  ctx.beginPath();
  subjectsData.forEach((sub, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const weightRatio = sub.weightage / 15; // 15 is max weight (General Aptitude)
    const currentRadius = weightRatio * radius;
    const x = center.x + currentRadius * Math.cos(angle);
    const y = center.y + currentRadius * Math.sin(angle);
    
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle = 'rgba(255, 45, 85, 0.1)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 45, 85, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  
  // 4. Draw Mastery Polygon (Cyan Area, completed topics percentage)
  ctx.beginPath();
  subjectsData.forEach((sub, i) => {
    const angle = i * angleStep - Math.PI / 2;
    
    // Calculate completion ratio
    let completed = 0;
    sub.topics.forEach((topic, idx) => {
      if (userProgress[`${sub.id}:${idx}`]) completed++;
    });
    const completionRatio = completed / sub.topics.length;
    const currentRadius = completionRatio * radius;
    const x = center.x + currentRadius * Math.cos(angle);
    const y = center.y + currentRadius * Math.sin(angle);
    
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle = 'rgba(0, 242, 255, 0.12)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(0, 242, 255, 0.6)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

// CANVAS DRAWING: STUDY CONSISTENCY HEATMAP
function renderHeatmap() {
  const canvas = document.getElementById('heatmap');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Configuration: 26 weeks, 7 days a week
  const cols = 26;
  const rows = 7;
  const boxSize = 13;
  const gap = 4;
  const paddingX = 35;
  const paddingY = 25;
  
  // Build a date grid of the last 26 weeks (182 days)
  const today = new Date();
  const dateMap = {};
  
  // Pre-fill date logs mapping from studyLogs state
  studyLogs.forEach(log => {
    dateMap[log.date] = (dateMap[log.date] || 0) + log.hours;
  });
  
  // Find start date: 26 weeks ago, aligned to the Sunday of that week
  const startDate = new Date();
  startDate.setDate(today.getDate() - (26 * 7));
  const startDayOffset = startDate.getDay(); // 0 is Sunday
  startDate.setDate(startDate.getDate() - startDayOffset);
  
  // Draw Day Labels (Mon, Wed, Fri)
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font = '8px Satoshi';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  
  const daysToShow = { 1: 'Mon', 3: 'Wed', 5: 'Fri' };
  for (let r = 0; r < rows; r++) {
    if (daysToShow[r]) {
      const y = paddingY + r * (boxSize + gap) + boxSize / 2;
      ctx.fillText(daysToShow[r], paddingX - 10, y);
    }
  }
  
  // Draw Month Labels at top
  ctx.textAlign = 'left';
  ctx.textBaseline = 'bottom';
  let lastMonthStr = '';
  
  // Loop to draw grid boxes
  const cursorDate = new Date(startDate);
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const dateStr = cursorDate.toISOString().split('T')[0];
      const hours = dateMap[dateStr] || 0;
      
      const x = paddingX + c * (boxSize + gap);
      const y = paddingY + r * (boxSize + gap);
      
      // Determine box color based on study hours
      let fillColor = 'rgba(255, 255, 255, 0.03)'; // 0 hours
      if (hours > 0 && hours <= 1.5) fillColor = 'rgba(255, 45, 85, 0.15)'; // Light Pink glow
      else if (hours > 1.5 && hours <= 3.5) fillColor = 'rgba(255, 45, 85, 0.4)'; // Mid Pink
      else if (hours > 3.5 && hours <= 6) fillColor = 'rgba(255, 45, 85, 0.7)'; // Deep Pink
      else if (hours > 6) fillColor = 'var(--neon-pink)'; // Ultra Pink
      
      ctx.fillStyle = fillColor;
      
      // Draw rounded rect (manually since older browsers might lack roundRect)
      drawRoundedRect(ctx, x, y, boxSize, boxSize, 2);
      
      // Draw Month label if month changes
      if (r === 0 && c % 4 === 0) {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const currentMonthStr = monthNames[cursorDate.getMonth()];
        if (currentMonthStr !== lastMonthStr) {
          ctx.fillStyle = 'rgba(255,255,255,0.3)';
          ctx.font = '8px Satoshi';
          ctx.fillText(currentMonthStr, x, paddingY - 8);
          lastMonthStr = currentMonthStr;
        }
      }
      
      // Increment cursor date by 1 day
      cursorDate.setDate(cursorDate.getDate() + 1);
    }
  }
}

function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
}

// TOAST NOTIFICATIONS HELPER
function showToast(title, message, color = 'pink') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-border-${color}`;
  
  toast.innerHTML = `
    <div class="toast-content">
      <div class="toast-title" style="color: var(--neon-${color})">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
  `;
  
  container.appendChild(toast);
  
  // Trigger entry animation
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  // Auto remove after 4 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 500);
  }, 4000);
}

// VETERAN AI HEURISTIC ADVICE ENGINE
const consoleLogs = document.getElementById('console-logs');

function addConsoleLine(sender, text, type = 'coach-line') {
  const line = document.createElement('div');
  line.className = `console-line ${type}`;
  
  let prefixText = `[${sender}]:`;
  let formattedText = text;
  
  // Format highlighters
  formattedText = formattedText.replace(/(\/[a-zA-Z_]+)/g, '<span class="highlight-pink">$1</span>');
  formattedText = formattedText.replace(/(\d+%\s*accuracy)/gi, '<span class="highlight-lime">$1</span>');
  formattedText = formattedText.replace(/(\d+%\s*completion)/gi, '<span class="highlight-cyan">$1</span>');
  formattedText = formattedText.replace(/(high priority|warning|attention|critical)/gi, '<span class="highlight-pink">$1</span>');
  
  line.innerHTML = `<span class="prefix">${prefixText}</span> ${formattedText}`;
  consoleLogs.appendChild(line);
  
  // Scroll console to bottom
  consoleLogs.scrollTop = consoleLogs.scrollHeight;
}

// CLEAR CONSOLE LOGS
const clearConsoleBtn = document.getElementById('clear-console-btn');
clearConsoleBtn.addEventListener('click', () => {
  consoleLogs.innerHTML = `
    <div class="console-line system-line">
      <span class="prefix">[SYSTEM]:</span> Log console cleared. Ready for command prompts.
    </div>
  `;
});

// ZAP / COMMAND PROCESSOR
const commandInput = document.getElementById('command-input');
const commandZapBtn = document.getElementById('command-zap-btn');

commandInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    processCommand(commandInput.value.trim());
    commandInput.value = '';
  }
});

commandZapBtn.addEventListener('click', () => {
  processCommand(commandInput.value.trim());
  commandInput.value = '';
});

// COMMANDS PROCESSOR
function processCommand(rawQuery) {
  if (!rawQuery) {
    // Generate default advice if query is empty
    triggerDefaultCoachAdvice();
    return;
  }
  
  // Render user input in console
  addConsoleLine('USER', rawQuery, 'user-line');
  
  const query = rawQuery.toLowerCase();
  
  // Latency micro-animation
  const latencyBadge = document.getElementById('status-latency');
  const simLatency = (Math.random() * 2 + 0.5).toFixed(1);
  latencyBadge.textContent = `${simLatency}ms`;
  
  // Check special commands
  if (query === '/help') {
    addConsoleLine('VETERAN_COACH', `Available Commands:\n - <span class="highlight-pink">/focus</span> : List topics requiring immediate study.\n - <span class="highlight-pink">/streak</span> : View streak status and motivational check.\n - <span class="highlight-pink">/weakness</span> : View topics with accuracy less than 65%.\n - <span class="highlight-pink">/subjects</span> : Brief summary of subjects weightage.\n - <span class="highlight-pink">/advice</span> : General veteran GATE exam preparation guidelines.\n - Or simply ask questions about specific subjects (e.g. "TOC", "COA", "Operating Systems").`);
    return;
  }
  
  if (query === '/focus') {
    triggerFocusAnalysis();
    return;
  }
  
  if (query === '/streak') {
    const days = studyStreak.count;
    if (days === 0) {
      addConsoleLine('VETERAN_COACH', `Your study streak is currently 0 days. The secret to GATE is consistency. Spend even 1 hour today logging a topic, and light up that streak indicator!`);
    } else {
      addConsoleLine('VETERAN_COACH', `Outstanding! You are on a ${days}-day study streak. Veteran advice: Don't miss a single day. A 15-minute revision log is better than a blank day to keep the memory pathways active.`);
    }
    return;
  }
  
  if (query === '/weakness') {
    triggerWeaknessAnalysis();
    return;
  }
  
  if (query === '/subjects') {
    let output = "GATE CSE Subject Weightage Overview:\n";
    subjectsData.forEach(s => {
      output += ` - ${s.name}: ${s.weightage} marks average.\n`;
    });
    addConsoleLine('VETERAN_COACH', output);
    return;
  }
  
  if (query === '/advice') {
    const adviceTexts = [
      "In GATE, accuracy beats quantity. Attempting 55 questions with 90% accuracy yields an excellent rank. Stop guessing.",
      "Discrete Mathematics, Algorithms, and TOC are the backbones. Master them first. They yield ~25 marks combined and are highly logic-driven.",
      "Always solve PYQs twice. First when finishing the chapter; second during December revision. Mark the ones you got wrong.",
      "Mock tests are not to check your marks; they are to analyze your time traps. Did you spend 5 minutes on an MSQ only to get it wrong? That's a target failure."
    ];
    const randAdvice = adviceTexts[Math.floor(Math.random() * adviceTexts.length)];
    addConsoleLine('VETERAN_COACH', `[VETERAN TIP] ${randAdvice}`);
    return;
  }
  
  // Subject Search fallback
  let foundSubject = null;
  subjectsData.forEach(sub => {
    if (query.includes(sub.id.toLowerCase()) || query.includes(sub.name.toLowerCase()) || (sub.id === 'Database_Management_Systems' && query.includes('dbms')) || (sub.id === 'Computer_Organization_Architecture' && query.includes('coa')) || (sub.id === 'Theory_of_Computation' && query.includes('toc')) || (sub.id === 'Computer_Networks' && query.includes('cn')) || (sub.id === 'Digital_Logic' && query.includes('dl')) || (sub.id === 'Compiler_Design' && query.includes('cd')) || (sub.id === 'Operating_Systems' && query.includes('os'))) {
      foundSubject = sub;
    }
  });
  
  if (foundSubject) {
    provideSubjectAdvice(foundSubject);
    return;
  }
  
  // General text query response
  generateGeneralAdvice(rawQuery);
}

// TOPICS PRIORITY CALCULATOR
function triggerFocusAnalysis() {
  const fpiList = [];
  
  subjectsData.forEach(sub => {
    const weight = sub.weightage;
    
    // Subject completions & accuracy
    let completed = 0;
    let accuracySum = 0;
    let scoredTopics = 0;
    
    sub.topics.forEach((topic, idx) => {
      const key = `${sub.id}:${idx}`;
      if (userProgress[key]) completed++;
      if (pyqScores[key] !== undefined) {
        accuracySum += pyqScores[key];
        scoredTopics++;
      }
    });
    
    const compRatio = completed / sub.topics.length;
    const avgAcc = scoredTopics > 0 ? (accuracySum / scoredTopics) : 60;
    
    // Calculate neglected days
    const lastSessionLog = studyLogs.slice().reverse().find(l => l.subjectId === sub.id);
    let daysNeglected = 15; 
    if (lastSessionLog) {
      const lastDate = new Date(lastSessionLog.date);
      const today = new Date();
      const diff = Math.ceil(Math.abs(today - lastDate) / (1000 * 60 * 60 * 24));
      daysNeglected = Math.min(diff, 30);
    }
    
    const fpi = weight * (1.5 - compRatio) * (1.1 - (avgAcc / 100)) * (1 + (daysNeglected / 15));
    
    // Get first incomplete topic
    let nextTopic = 'All completed';
    for (let i = 0; i < sub.topics.length; i++) {
      if (!userProgress[`${sub.id}:${i}`]) {
        nextTopic = sub.topics[i];
        break;
      }
    }
    
    fpiList.push({
      subjectName: sub.name,
      subjectId: sub.id,
      fpi: fpi,
      nextTopic: nextTopic,
      weight: weight
    });
  });
  
  // Sort by priority index descending
  fpiList.sort((a, b) => b.fpi - a.fpi);
  
  let output = "VETERAN PRIORITY MATRIX (Focus on these first):\n\n";
  fpiList.slice(0, 3).forEach((item, index) => {
    output += `${index + 1}. <span class="highlight-pink">${item.subjectName}</span> (Weight: ${item.weight} Marks)\n`;
    output += `   ➜ Recommended Topic: "${item.nextTopic}"\n`;
    output += `   ➜ Focus reason: Subject weightage is high relative to your logged completion level.\n\n`;
  });
  
  addConsoleLine('VETERAN_COACH', output);
}

// WEAKNESS PERFORMANCE DETECTOR
function triggerWeaknessAnalysis() {
  const weaknesses = [];
  
  subjectsData.forEach(sub => {
    sub.topics.forEach((topic, idx) => {
      const key = `${sub.id}:${idx}`;
      const acc = pyqScores[key];
      if (acc !== undefined && acc < 70) {
        weaknesses.push({
          subjectName: sub.name,
          topicName: topic,
          accuracy: acc,
          weight: sub.weightage
        });
      }
    });
  });
  
  if (weaknesses.length === 0) {
    addConsoleLine('VETERAN_COACH', `No major weaknesses detected! All your logged topics have PYQ accuracies above 70%. Superb progress. Continue practicing newer subjects.`);
    return;
  }
  
  // Sort by lowest accuracy and highest subject weightage
  weaknesses.sort((a, b) => {
    if (a.accuracy !== b.accuracy) return a.accuracy - b.accuracy;
    return b.weight - a.weight;
  });
  
  let output = "WEAKNESS RADAR REPORT:\nThe following topics represent potential marks loss in GATE. Practice PYQs again:\n\n";
  weaknesses.slice(0, 4).forEach(w => {
    output += ` ➜ [${w.subjectName}] "${w.topicName}"\n`;
    output += `    Score: <span class="highlight-pink">${w.accuracy}% accuracy</span>. Target: 75%+. (Subject weight: ${w.weight} Marks)\n`;
  });
  
  addConsoleLine('VETERAN_COACH', output);
}

// SUBJECT-SPECIFIC ADVICE
function provideSubjectAdvice(subject) {
  const adviceMap = {
    "Discrete_Mathematics": "Discrete Math has high scoring weight (~8 Marks). Questions on Graph Theory (chromatic numbers, planarity) and Recurrence Relations are asked almost every year. Ensure your propositional logic proofs are rock solid.",
    "Engineering_Mathematics": "Engineering Math (~5 Marks): Focus heavily on Linear Algebra (finding eigenvalues, rank of matrices, systems of equations) and Bayes Theorem in probability. These are guaranteed easy marks if practiced properly.",
    "Digital_Logic": "Digital Logic (~5 Marks): Combinational circuit questions (especially implementing functions using Muxes) and Sequential counters (state equations, finding mod of counter) are guaranteed templates. Solve 10-15 standard Counter design problems.",
    "Computer_Organization_Architecture": "COA (~7 Marks): Pipelining hazards (data dependencies, stalls) and Cache mapping (calculating tag bits, hit latency) dominate COA. Draw cache blocks on paper; visual representation prevents calculation errors.",
    "Data_Structures": "Data Structures (~7 Marks): C pointers, recursion tracking, and binary tree traversals (inorder/preorder reconstruction) are highly frequent. Practice dry-running recursive functions with recursion trees.",
    "Algorithms": "Algorithms (~7 Marks): Master asymptotic notations first. Graph algorithms (Dijkstra, Kruskal, Prim) are highly repetitive. Dynamic programming is rarely asked in complex forms; standard templates are enough.",
    "Theory_of_Computation": "TOC (~9 Marks): Highly logical, full marks possible. Master finding the closure properties of language families. Decidability vs Undecidability is a common trap topic. Memorize the standard Turing decidable table.",
    "Compiler_Design": "Compiler Design (~4 Marks): Parser construction (LL(1) parse tables, LR item states) are standard 2-mark questions. Practice computing First and Follow sets correctly; a simple error here ruins the parsing tree.",
    "Operating_Systems": "Operating Systems (~9 Marks): Concurrency (classical semaphore synchronization - producer/consumer, reader/writer) and Virtual Memory (paging calculations, TLB hit rates) are critical. Be thorough with page table size arithmetic.",
    "Database_Management_Systems": "DBMS (~7 Marks): B/B+ tree calculations (finding max keys/order) and Transaction Serializability (testing conflict/view serializability, 2-phase locking protocols) are highly high-yield. SQL queries are scoring if edge-cases (NULL values) are handled.",
    "Computer_Networks": "Computer Networks (~9 Marks): CIDR subnetting (calculating range/subnets) and TCP Congestion Control window modifications are tested every single year. These are purely mathematical; solve 20+ numericals.",
    "General_Aptitude": "General Aptitude (15 Marks!): The single highest weight section. Do not ignore it. Devote 30 minutes daily to analytical and quantitative questions. A score of 12+/15 is essential for a top-500 rank."
  };
  
  const advice = adviceMap[subject.id] || "Practice daily PYQs, verify calculations, and analyze step errors.";
  addConsoleLine('VETERAN_COACH', `Subject focus: <span class="highlight-cyan">${subject.name}</span> (~${subject.weightage} Marks)\n\n[VETERAN TIPS]:\n${advice}`);
}

// GENERAL QUOTE GENERATION
function generateGeneralAdvice(query) {
  const genericAdvices = [
    "GATE is a test of elimination as much as selection. Focus on reducing negative marks. Don't mark options unless 95% confident.",
    "If you are stuck on a difficult topic, move to another subject. Coming back with a fresh perspective is a proven cognitive recovery strategy.",
    "Are you logging test series questions? A mistakes notebook containing all mock errors is the single most valuable asset in the final 3 months.",
    "Study networks or COA when your cognitive levels are high (morning). Keep Aptitude or C coding practice for lower energy hours (afternoon)."
  ];
  
  const rand = genericAdvices[Math.floor(Math.random() * genericAdvices.length)];
  addConsoleLine('VETERAN_COACH', `I processed your inquiry. Here is some general veteran advice:\n\n"${rand}"\n\nType <span class="highlight-pink">/help</span> for specific database analytics commands.`);
}

function triggerDefaultCoachAdvice() {
  addConsoleLine('VETERAN_COACH', "Keep consistency up. Enter <span class='highlight-pink'>/focus</span> to see where you should dedicate study hours today.");
}

// ONLINE AUTO-UPDATE HANDLER
function syncTrendsOnline() {
  fetch('gate_trends.json')
    .then(response => {
      if (!response.ok) throw new Error('Failed to load online trends file');
      return response.json();
    })
    .then(data => {
      if (data && data.version) {
        console.log('Online Weightage Trends fetched successfully. Version:', data.version);
        // Save to state
        subjectsData = data.subjects;
        localStorage.setItem('gateQuest_subjectsData', JSON.stringify(subjectsData));
        
        // Re-draw elements
        generateSyllabusAccordion();
        populateQuickLogDropdown();
        updateDashboardStats();
        
        // Show silent toast
        showToast('TRENDS CONVERGED', `Synchronized GATE CSE trends version ${data.version} successfully.`, 'cyan');
      }
    })
    .catch(err => {
      console.log('Running offline. Using cached subject parameters.', err);
    });
}

// APP ENTRY POINT
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  verifyStreakIntegrity();
  
  generateSyllabusAccordion();
  populateQuickLogDropdown();
  updateDashboardStats();
  
  // Try online updates
  if (navigator.onLine) {
    syncTrendsOnline();
  }
});
