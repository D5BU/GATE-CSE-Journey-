// Register Service Worker for Offline-First Capability
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('Service Worker Registered', reg.scope))
      .catch(err => console.log('Service Worker Failed', err));
  });
}

// Handle PWA Installation
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
    console.log(`User installation choice: ${outcome}`);
    deferredPrompt = null;
    installBtn.style.display = 'none';
  }
});

// SUBJECTS METADATA Fallback
const SUBJECTS = [
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
      "Programming in C (Pointers, Scope, Array allocation)",
      "Recursion & Complexity analysis",
      "Arrays, Stacks, Queues, Linked Lists",
      "Trees & Binary Search Trees",
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
      "Dynamic Programming fundamentals",
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
      "Syntax Analysis (LL(1), LR, LALR Parsers)",
      "Syntax-Directed Translation & SDT schemas",
      "Intermediate Code Generation (3AC, SSA)",
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
      "Deadlock (Prevention, Avoidance, Detection)",
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

// STATE STATE STORAGE OBJECTS
let userProgress = {}; // Key: "subId:idx" -> Boolean
let pyqScores = {};    // Key: "subId:idx" -> Array of { score, timestamp }
let studyLogs = [];    // Array of: { date, time, subjectId, hours, accuracy }
let studyStreak = { count: 0, lastStudyDate: null };

// LOAD & SAVE STATE
function loadState() {
  const progress = localStorage.getItem('gateQuest_userProgress');
  const scores = localStorage.getItem('gateQuest_pyqScores_v2');
  const logs = localStorage.getItem('gateQuest_studyLogs_v2');
  const streak = localStorage.getItem('gateQuest_streak');

  if (progress) userProgress = JSON.parse(progress);
  if (scores) pyqScores = JSON.parse(scores);
  if (logs) studyLogs = JSON.parse(logs);
  if (streak) studyStreak = JSON.parse(streak);
}

function saveState() {
  localStorage.setItem('gateQuest_userProgress', JSON.stringify(userProgress));
  localStorage.setItem('gateQuest_pyqScores_v2', JSON.stringify(pyqScores));
  localStorage.setItem('gateQuest_studyLogs_v2', JSON.stringify(studyLogs));
  localStorage.setItem('gateQuest_streak', JSON.stringify(studyStreak));
}

// TABS CONFIGURATION
const navButtons = document.querySelectorAll('.nav-btn');
const tabContents = document.querySelectorAll('.tab-content');

navButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    switchTab(btn.getAttribute('data-tab'));
  });
});

function switchTab(tabName) {
  navButtons.forEach(nb => {
    if (nb.getAttribute('data-tab') === tabName) nb.classList.add('active');
    else nb.classList.remove('active');
  });
  
  tabContents.forEach(tc => {
    if (tc.id === `tab-${tabName}`) tc.classList.add('active');
    else tc.classList.remove('active');
  });
  
  if (tabName === 'metrics') {
    renderRadarChart();
    renderHeatmap();
    runAdaptiveAdvisor();
  }
}

// DYNAMIC ACCORDION GENERATOR (Syllabus page)
const accordionContainer = document.getElementById('syllabus-accordion');

function generateSyllabusAccordion() {
  accordionContainer.innerHTML = '';
  
  SUBJECTS.forEach((subject) => {
    const totalTopics = subject.topics.length;
    let completedCount = 0;
    let totalAccuracySum = 0;
    let scoredTopicsCount = 0;
    
    subject.topics.forEach((topic, index) => {
      const key = `${subject.id}:${index}`;
      if (userProgress[key]) completedCount++;
      
      const history = pyqScores[key];
      if (history && history.length > 0) {
        // Use the latest score for current accuracy index
        totalAccuracySum += history[history.length - 1].score;
        scoredTopicsCount++;
      }
    });
    
    const progressPercent = Math.round((completedCount / totalTopics) * 100);
    const avgAccuracy = scoredTopicsCount > 0 ? Math.round(totalAccuracySum / scoredTopicsCount) : 0;
    
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
              
              const history = pyqScores[key];
              const accuracyVal = (history && history.length > 0) ? history[history.length - 1].score : 50;
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
    
    const header = item.querySelector('.accordion-header');
    header.addEventListener('click', () => {
      const isExpanded = item.classList.contains('expanded');
      document.querySelectorAll('.accordion-item').forEach(ai => ai.classList.remove('expanded'));
      if (!isExpanded) {
        item.classList.add('expanded');
      }
    });
    
    accordionContainer.appendChild(item);
  });
  
  attachInputsListeners();
}

function attachInputsListeners() {
  document.querySelectorAll('.topic-check').forEach(chk => {
    chk.addEventListener('change', () => {
      const subId = chk.getAttribute('data-sub');
      const idx = chk.getAttribute('data-idx');
      const key = `${subId}:${idx}`;
      
      userProgress[key] = chk.checked;
      saveState();
      updateDashboardStats();
      
      const subject = SUBJECTS.find(s => s.id === subId);
      showToast(chk.checked ? 'TOPIC COMPLETED' : 'TOPIC UNCHECKED', `"${subject.topics[idx]}" in ${subject.name}`, chk.checked ? 'cyan' : 'pink');
      updateAccordionHeader(subId);
    });
  });

  document.querySelectorAll('.topic-slider').forEach(sld => {
    const valBadge = sld.nextElementSibling;
    
    sld.addEventListener('input', () => {
      valBadge.textContent = `${sld.value}%`;
    });
    
    sld.addEventListener('change', () => {
      const subId = sld.getAttribute('data-sub');
      const idx = sld.getAttribute('data-idx');
      const key = `${subId}:${idx}`;
      const score = parseInt(sld.value);
      
      // Initialize score history array if not present
      if (!pyqScores[key]) pyqScores[key] = [];
      pyqScores[key].push({
        score: score,
        timestamp: new Date().toISOString()
      });
      
      saveState();
      updateDashboardStats();
      updateAccordionHeader(subId);
      
      const subject = SUBJECTS.find(s => s.id === subId);
      showToast('ACCURACY LOGGED', `"${subject.topics[idx]}" accuracy set to ${score}%`, 'lime');
    });
  });
}

function updateAccordionHeader(subId) {
  const subject = SUBJECTS.find(s => s.id === subId);
  const totalTopics = subject.topics.length;
  let completedCount = 0;
  let totalAccuracySum = 0;
  let scoredTopicsCount = 0;
  
  subject.topics.forEach((topic, index) => {
    const key = `${subId}:${index}`;
    if (userProgress[key]) completedCount++;
    
    const history = pyqScores[key];
    if (history && history.length > 0) {
      totalAccuracySum += history[history.length - 1].score;
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

// QUICK LOG FIELD dropdown
const logSubjectSelect = document.getElementById('log-subject');

function populateQuickLogDropdown() {
  logSubjectSelect.innerHTML = '';
  SUBJECTS.forEach(sub => {
    const opt = document.createElement('option');
    opt.value = sub.id;
    opt.textContent = sub.name;
    logSubjectSelect.appendChild(opt);
  });
}

// QUICK WORK LOG BUTTON SUBMIT
const saveLogBtn = document.getElementById('save-log-btn');
const logHoursInput = document.getElementById('log-hours');
const logAccuracyInput = document.getElementById('log-accuracy');

saveLogBtn.addEventListener('click', () => {
  const subId = logSubjectSelect.value;
  const hours = parseFloat(logHoursInput.value);
  const accuracy = parseInt(logAccuracyInput.value);
  
  if (isNaN(hours) || hours <= 0) {
    showToast('INVALID LOG', 'Study hours must be greater than zero.', 'pink');
    return;
  }
  if (isNaN(accuracy) || accuracy < 0 || accuracy > 100) {
    showToast('INVALID LOG', 'Accuracy score must be between 0 and 100.', 'pink');
    return;
  }
  
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  
  // Save log
  studyLogs.push({
    date: dateStr,
    time: timeStr,
    subjectId: subId,
    hours: hours,
    accuracy: accuracy
  });
  
  // Calculate study streak
  updateStreak(dateStr);
  
  saveState();
  updateDashboardStats();
  
  const subjectName = SUBJECTS.find(s => s.id === subId).name;
  showToast('SESSION LOGGED', `Logged ${hours} hrs of ${subjectName} with ${accuracy}% accuracy.`, 'lime');
  
  // Reset logs
  logHoursInput.value = '1.0';
  logAccuracyInput.value = '70';
});

// STREAK MANAGEMENT
function updateStreak(todayDateStr) {
  if (!studyStreak.lastStudyDate) {
    studyStreak.count = 1;
  } else {
    const lastDate = new Date(studyStreak.lastStudyDate);
    const currentDate = new Date(todayDateStr);
    const diffTime = Math.abs(currentDate - lastDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      studyStreak.count += 1;
    } else if (diffDays > 1) {
      studyStreak.count = 1;
    }
  }
  studyStreak.lastStudyDate = todayDateStr;
}

function verifyStreakIntegrity() {
  if (!studyStreak.lastStudyDate) return;
  const today = new Date().toISOString().split('T')[0];
  const lastDate = new Date(studyStreak.lastStudyDate);
  const currentDate = new Date(today);
  const diffTime = Math.abs(currentDate - lastDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays > 1) {
    studyStreak.count = 0;
    saveState();
  }
}

// UPDATE NUMERICAL STATS
function updateDashboardStats() {
  let totalTopicsCount = 0;
  let completedTopicsCount = 0;
  
  SUBJECTS.forEach(sub => {
    totalTopicsCount += sub.topics.length;
    sub.topics.forEach((topic, idx) => {
      if (userProgress[`${sub.id}:${idx}`]) completedTopicsCount++;
    });
  });
  
  const completionPercentage = totalTopicsCount > 0 ? ((completedTopicsCount / totalTopicsCount) * 100).toFixed(1) : '0.0';
  document.getElementById('progress-value').textContent = `${completionPercentage}%`;
  document.getElementById('progress-desc').textContent = `${completedTopicsCount} of ${totalTopicsCount} topics checked off.`;
  
  document.getElementById('streak-value').textContent = `${studyStreak.count} DAYS`;
  if (studyStreak.count > 0) {
    document.getElementById('streak-desc').textContent = `Consistent studying! Last session: ${studyStreak.lastStudyDate}.`;
  } else {
    document.getElementById('streak-desc').textContent = `Log your study session below to start a streak.`;
  }
  
  // Calculate average accuracy
  let totalAccuracySum = 0;
  let accuracyLogsCount = 0;
  
  // Check from studyLogs first (since they are quick logs)
  studyLogs.forEach(log => {
    if (log.accuracy !== undefined) {
      totalAccuracySum += log.accuracy;
      accuracyLogsCount++;
    }
  });
  
  const avgAccuracy = accuracyLogsCount > 0 ? Math.round(totalAccuracySum / accuracyLogsCount) : 0;
  document.getElementById('accuracy-value').textContent = `${avgAccuracy}%`;
  
  let accuracyDesc = '';
  if (accuracyLogsCount === 0) {
    accuracyDesc = 'No study session marks logged yet.';
  } else if (avgAccuracy < 60) {
    accuracyDesc = 'Accuracy below 60%. Core reviews recommended.';
    document.getElementById('accuracy-value').className = 'card-value text-glow-pink';
  } else if (avgAccuracy < 80) {
    accuracyDesc = 'Decent accuracy. Focus on eliminating simple arithmetic errors.';
    document.getElementById('accuracy-value').className = 'card-value text-glow-cyan';
  } else {
    accuracyDesc = 'Top-tier accuracy! Maintain this pace to secure high ranks.';
    document.getElementById('accuracy-value').className = 'card-value text-glow-lime';
  }
  document.getElementById('accuracy-desc').textContent = accuracyDesc;
}

// AEGIS-ADAPTIVE ADVISOR ENGINE (One-wayVisual Guidance)
const prioritiesContainer = document.getElementById('advisor-priorities');
const diagnosticsContainer = document.getElementById('advisor-diagnostics');
const warningsContainer = document.getElementById('advisor-warnings');

function runAdaptiveAdvisor() {
  if (!prioritiesContainer) return;
  
  // 1. Calculate Priority Focus Targets based on FPI
  const fpiList = [];
  
  SUBJECTS.forEach(sub => {
    const weight = sub.weightage;
    let completed = 0;
    let accuracySum = 0;
    let scoredTopics = 0;
    
    sub.topics.forEach((topic, idx) => {
      const key = `${sub.id}:${idx}`;
      if (userProgress[key]) completed++;
      
      const history = pyqScores[key];
      if (history && history.length > 0) {
        accuracySum += history[history.length - 1].score;
        scoredTopics++;
      }
    });
    
    const compRatio = completed / sub.topics.length;
    const avgAcc = scoredTopics > 0 ? (accuracySum / scoredTopics) : 60; // 60% fallback
    
    // Neglect duration
    const lastLog = studyLogs.slice().reverse().find(l => l.subjectId === sub.id);
    let daysNeglected = 15;
    if (lastLog) {
      const diff = Math.ceil(Math.abs(new Date() - new Date(lastLog.date)) / (1000 * 60 * 60 * 24));
      daysNeglected = Math.min(diff, 30);
    }
    
    const fpi = weight * (1.5 - compRatio) * (1.1 - (avgAcc / 100)) * (1 + (daysNeglected / 15));
    
    // Find next target topic (first incomplete)
    let targetTopic = '';
    let targetIdx = -1;
    for (let i = 0; i < sub.topics.length; i++) {
      if (!userProgress[`${sub.id}:${i}`]) {
        targetTopic = sub.topics[i];
        targetIdx = i;
        break;
      }
    }
    
    if (targetIdx === -1) { // all complete, find lowest accuracy
      let minAcc = 101;
      sub.topics.forEach((_, i) => {
        const history = pyqScores[`${sub.id}:${i}`];
        if (history && history.length > 0 && history[history.length - 1].score < minAcc) {
          minAcc = history[history.length - 1].score;
          targetTopic = sub.topics[i];
          targetIdx = i;
        }
      });
    }
    
    fpiList.push({
      subjectId: sub.id,
      subjectName: sub.name,
      fpi: fpi,
      topicName: targetTopic || 'All Finished',
      topicIdx: targetIdx,
      weight: weight,
      color: sub.color
    });
  });
  
  // Sort descending by FPI score
  fpiList.sort((a, b) => b.fpi - a.fpi);
  
  // Render priorities list
  prioritiesContainer.innerHTML = '';
  fpiList.slice(0, 3).forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'priority-item';
    card.innerHTML = `
      <div class="priority-num" style="color: ${item.color}">${index + 1}</div>
      <div class="priority-content">
        <span class="priority-subject" style="color: ${item.color}">${item.subjectName}</span>
        <div class="priority-topic">${item.topicName}</div>
        <div class="priority-reason">Weight: ${item.weight} Marks. Suggested due to high syllabus importance and neglect factor.</div>
      </div>
    `;
    prioritiesContainer.appendChild(card);
  });
  
  // 2. Compute Cognitive Behavior Profile
  // A. Peak Study Hour block
  let peakTimeStr = 'NO LOGS';
  const blockAccuracies = { 'Morning': { sum: 0, count: 0 }, 'Afternoon': { sum: 0, count: 0 }, 'Evening': { sum: 0, count: 0 }, 'Late Night': { sum: 0, count: 0 } };
  
  studyLogs.forEach(log => {
    if (log.time && log.accuracy !== undefined) {
      const hour = parseInt(log.time.split(':')[0]);
      let block = 'Morning';
      if (hour >= 12 && hour < 17) block = 'Afternoon';
      else if (hour >= 17 && hour < 22) block = 'Evening';
      else if (hour >= 22 || hour < 5) block = 'Late Night';
      
      blockAccuracies[block].sum += log.accuracy;
      blockAccuracies[block].count++;
    }
  });
  
  let maxAvg = 0;
  let bestBlock = '';
  for (let key in blockAccuracies) {
    if (blockAccuracies[key].count > 0) {
      const avg = blockAccuracies[key].sum / blockAccuracies[key].count;
      if (avg > maxAvg) {
        maxAvg = avg;
        bestBlock = key;
      }
    }
  }
  
  if (bestBlock) {
    peakTimeStr = `${bestBlock} (${Math.round(maxAvg)}% Acc)`;
  }
  
  // B. Comfort Zone Tracker
  let comfortStatus = 'Balanced Focus';
  let comfortDesc = 'Even focus across syllabus.';
  let biasDetected = false;
  
  // Check if user is studying mastered subjects and neglecting unstudied ones
  let masteredStudiedRecently = false;
  let neglectedIgnored = false;
  let avoidedSubjectName = '';
  
  SUBJECTS.forEach(sub => {
    let completed = 0;
    sub.topics.forEach((_, i) => {
      if (userProgress[`${sub.id}:${i}`]) completed++;
    });
    const completion = completed / sub.topics.length;
    
    // Check logs in past 7 days
    const hasBeenStudiedRecently = studyLogs.some(log => {
      if (log.subjectId !== sub.id) return false;
      const logDate = new Date(log.date);
      const diffDays = (new Date() - logDate) / (1000 * 60 * 60 * 24);
      return diffDays <= 7;
    });
    
    if (completion > 0.8 && hasBeenStudiedRecently) {
      masteredStudiedRecently = true;
    }
    
    if (completion < 0.3 && !hasBeenStudiedRecently) {
      neglectedIgnored = true;
      avoidedSubjectName = sub.name;
    }
  });
  
  if (masteredStudiedRecently && neglectedIgnored) {
    biasDetected = true;
    comfortStatus = 'Comfort Bias';
    comfortDesc = `Focusing on mastered zones, avoiding ${avoidedSubjectName}.`;
  }
  
  diagnosticsContainer.innerHTML = `
    <div class="diagnostic-card">
      <span class="diagnostic-lbl">Peak Performance Hour</span>
      <div class="diagnostic-val" style="color: var(--neon-lime)">${peakTimeStr}</div>
      <p class="card-desc">Time block yielding your highest practice accuracy scores.</p>
    </div>
    <div class="diagnostic-card">
      <span class="diagnostic-lbl">Comfort Zone Status</span>
      <div class="diagnostic-val" style="color: ${biasDetected ? 'var(--neon-pink)' : 'var(--neon-cyan)'}">${comfortStatus}</div>
      <p class="card-desc">${comfortDesc}</p>
    </div>
  `;
  
  // 3. Compute Critical Warnings (Neglect & Accuracy drops)
  const warningsList = [];
  
  // A. Check for Subject Neglect (Memory Decay)
  SUBJECTS.forEach(sub => {
    let completed = 0;
    sub.topics.forEach((_, i) => {
      if (userProgress[`${sub.id}:${i}`]) completed++;
    });
    
    if (completed > 0) {
      const logs = studyLogs.filter(l => l.subjectId === sub.id);
      if (logs.length > 0) {
        const lastDate = new Date(logs[logs.length - 1].date);
        const diffDays = Math.ceil(Math.abs(new Date() - lastDate) / (1000 * 60 * 60 * 24));
        if (diffDays > 10) {
          warningsList.push(`Potential memory decay in <span class="highlight-pink">${sub.name}</span>. Unstudied for ${diffDays} days.`);
        }
      }
    }
  });
  
  // B. Check for topic score regression (Last test score lower than previous by 15%)
  for (let key in pyqScores) {
    const history = pyqScores[key];
    if (history && history.length >= 2) {
      const prev = history[history.length - 2].score;
      const curr = history[history.length - 1].score;
      if (prev - curr > 15) {
        const subId = key.split(':')[0];
        const idx = parseInt(key.split(':')[1]);
        const subject = SUBJECTS.find(s => s.id === subId);
        warningsList.push(`Score regression in <span class="highlight-pink">${subject.name} - ${subject.topics[idx]}</span> (dropped from ${prev}% to ${curr}%).`);
      }
    }
  }
  
  warningsContainer.innerHTML = '';
  if (warningsList.length === 0) {
    warningsContainer.innerHTML = `
      <div class="warning-item" style="background: rgba(193, 255, 114, 0.03); border-color: rgba(193, 255, 114, 0.1);">
        <span class="warning-indicator" style="background-color: var(--neon-lime); box-shadow: 0 0 8px var(--neon-lime);"></span>
        <div class="warning-text" style="color: rgba(255,255,255,0.8)">All systems stable. Revision schedules are balanced, no score regressions found.</div>
      </div>
    `;
  } else {
    warningsList.forEach(warn => {
      const row = document.createElement('div');
      row.className = 'warning-item';
      row.innerHTML = `
        <span class="warning-indicator"></span>
        <div class="warning-text">${warn}</div>
      `;
      warningsContainer.appendChild(row);
    });
  }
}

// CANVAS DRAWINGS: RADAR CHART
function renderRadarChart() {
  const canvas = document.getElementById('radarChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  const center = { x: canvas.width / 2, y: canvas.height / 2 };
  const radius = 120;
  const numSubjects = SUBJECTS.length;
  const angleStep = (2 * Math.PI) / numSubjects;
  
  // Concentric Rings
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
  for (let r = 1; r <= 5; r++) {
    const ringRadius = (radius / 5) * r;
    ctx.beginPath();
    ctx.arc(center.x, center.y, ringRadius, 0, 2 * Math.PI);
    ctx.stroke();
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.font = '8px Satoshi';
    ctx.fillText(`${r * 20}%`, center.x + 3, center.y - ringRadius + 7);
  }
  
  // Spokes & Labels
  SUBJECTS.forEach((sub, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const xEnd = center.x + radius * Math.cos(angle);
    const yEnd = center.y + radius * Math.sin(angle);
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.beginPath();
    ctx.moveTo(center.x, center.y);
    ctx.lineTo(xEnd, yEnd);
    ctx.stroke();
    
    // Labels positioning
    const labelDistance = radius + 22;
    const xLabel = center.x + labelDistance * Math.cos(angle);
    const yLabel = center.y + labelDistance * Math.sin(angle);
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.font = 'bold 8px Satoshi';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    let label = sub.name.split(' ').map(w => w[0]).join('');
    if (sub.name === 'Operating Systems') label = 'OS';
    if (sub.name === 'Computer Networks') label = 'CN';
    if (sub.name === 'Compiler Design') label = 'CD';
    if (sub.name === 'General Aptitude') label = 'APT';
    if (sub.name === 'Theory of Computation') label = 'TOC';
    if (sub.name === 'Discrete Mathematics') label = 'DISC';
    if (sub.name === 'Engineering Mathematics') label = 'MATH';
    if (sub.name === 'Digital Logic') label = 'DL';
    
    ctx.fillText(label, xLabel, yLabel);
  });
  
  // Draw Weight Polygon (Pink)
  ctx.beginPath();
  SUBJECTS.forEach((sub, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const weightRatio = sub.weightage / 15; // 15 is GA max
    const currentRadius = weightRatio * radius;
    const x = center.x + currentRadius * Math.cos(angle);
    const y = center.y + currentRadius * Math.sin(angle);
    
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle = 'rgba(255, 45, 85, 0.08)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 45, 85, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  
  // Draw Mastery Polygon (Cyan)
  ctx.beginPath();
  SUBJECTS.forEach((sub, i) => {
    const angle = i * angleStep - Math.PI / 2;
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
  ctx.fillStyle = 'rgba(0, 242, 255, 0.1)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(0, 242, 255, 0.55)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

// CANVAS DRAWINGS: STUDY CONSISTENCY HEATMAP
function renderHeatmap() {
  const canvas = document.getElementById('heatmap');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  const cols = 26;
  const rows = 7;
  const boxSize = 13;
  const gap = 4;
  const paddingX = 35;
  const paddingY = 25;
  
  const dateMap = {};
  studyLogs.forEach(log => {
    dateMap[log.date] = (dateMap[log.date] || 0) + log.hours;
  });
  
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - (26 * 7));
  const offset = startDate.getDay();
  startDate.setDate(startDate.getDate() - offset);
  
  // Mon, Wed, Fri Labels
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font = '8px Satoshi';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  
  const days = { 1: 'Mon', 3: 'Wed', 5: 'Fri' };
  for (let r = 0; r < rows; r++) {
    if (days[r]) {
      ctx.fillText(days[r], paddingX - 10, paddingY + r * (boxSize + gap) + boxSize / 2);
    }
  }
  
  // Grid box renders
  let lastMonthStr = '';
  const cursorDate = new Date(startDate);
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const dateStr = cursorDate.toISOString().split('T')[0];
      const hours = dateMap[dateStr] || 0;
      
      const x = paddingX + c * (boxSize + gap);
      const y = paddingY + r * (boxSize + gap);
      
      let fillVal = 'rgba(255,255,255,0.03)';
      if (hours > 0 && hours <= 1.5) fillVal = 'rgba(255, 45, 85, 0.15)';
      else if (hours > 1.5 && hours <= 3.5) fillVal = 'rgba(255, 45, 85, 0.35)';
      else if (hours > 3.5 && hours <= 6) fillVal = 'rgba(255, 45, 85, 0.65)';
      else if (hours > 6) fillVal = 'var(--neon-pink)';
      
      ctx.fillStyle = fillVal;
      drawRoundedRect(ctx, x, y, boxSize, boxSize, 2);
      
      if (r === 0 && c % 4 === 0) {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const currentMonthStr = months[cursorDate.getMonth()];
        if (currentMonthStr !== lastMonthStr) {
          ctx.fillStyle = 'rgba(255,255,255,0.3)';
          ctx.fillText(currentMonthStr, x, paddingY - 8);
          lastMonthStr = currentMonthStr;
        }
      }
      
      cursorDate.setDate(cursorDate.getDate() + 1);
    }
  }
}

function drawRoundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();
}

// TOAST MESSAGER
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
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 500);
  }, 4000);
}

// COUNTDOWN TIMER ENGINE
let countdownInterval;
function startCountdownClock(examDateStr) {
  if (countdownInterval) clearInterval(countdownInterval);
  
  const examTime = new Date(examDateStr).getTime();
  
  const dSpan = document.getElementById('cd-days');
  const hSpan = document.getElementById('cd-hours');
  const mSpan = document.getElementById('cd-mins');
  const sSpan = document.getElementById('cd-secs');
  
  function updateClock() {
    const diff = examTime - new Date().getTime();
    if (diff <= 0) {
      clearInterval(countdownInterval);
      dSpan.textContent = '00';
      hSpan.textContent = '00';
      mSpan.textContent = '00';
      sSpan.textContent = '00';
      return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);
    
    dSpan.textContent = String(days).padStart(2, '0');
    hSpan.textContent = String(hours).padStart(2, '0');
    mSpan.textContent = String(mins).padStart(2, '0');
    sSpan.textContent = String(secs).padStart(2, '0');
  }
  
  updateClock();
  countdownInterval = setInterval(updateClock, 1000);
}

// ONLINE BULLETIN SYNC CMS
const bulletinFeedContainer = document.getElementById('bulletin-feed-container');

function syncBulletinOnline() {
  fetch('gate_news.json')
    .then(res => {
      if (!res.ok) throw new Error('Bulletin Offline');
      return res.json();
    })
    .then(data => {
      if (data && data.announcements) {
        localStorage.setItem('gateQuest_v2_bulletin', JSON.stringify(data));
        renderBulletinFeed(data);
      }
    })
    .catch(() => {
      // Offline fallback
      const cached = localStorage.getItem('gateQuest_v2_bulletin');
      if (cached) {
        renderBulletinFeed(JSON.parse(cached));
      } else {
        bulletinFeedContainer.innerHTML = '<div class="bulletin-desc" style="text-align:center;">Bulletin feed empty. Connect online to load.</div>';
      }
    });
}

function renderBulletinFeed(data) {
  bulletinFeedContainer.innerHTML = '';
  
  // Set Exam countdown target
  if (data.examDate) {
    startCountdownClock(data.examDate);
  }
  
  data.announcements.forEach(ann => {
    const item = document.createElement('div');
    item.className = 'bulletin-item';
    
    const linkTag = ann.link ? `<a href="${ann.link}" target="_blank" class="bulletin-title" style="text-decoration:none; color:#ffffff; hover:text-decoration:underline;">${ann.title} ➜</a>` : `<span class="bulletin-title">${ann.title}</span>`;
    
    item.innerHTML = `
      <div class="bulletin-meta">
        <span class="bulletin-date">${ann.date}</span>
        <span class="bulletin-severity sev-${ann.severity}">${ann.severity}</span>
      </div>
      ${linkTag}
      <p class="bulletin-desc">${ann.description}</p>
    `;
    bulletinFeedContainer.appendChild(item);
  });
}

// ONBOARDING TOUR SETUP
let currentTourStep = 0;
const onboardingOverlay = document.getElementById('onboarding-overlay');
const onboardingBackdrop = document.getElementById('onboarding-backdrop');
const nextBtn = document.getElementById('tour-next-btn');
const skipBtn = document.getElementById('tour-skip-btn');
const stepCounter = document.getElementById('tour-step-counter');
const stepHeading = document.getElementById('tour-step-heading');
const stepDesc = document.getElementById('tour-step-desc');

const tourSteps = [
  {
    heading: "Welcome to GATE Quest",
    desc: "Let's take a quick 1-minute visual tour of your rank companion. No complex text prompts required—the advisor operates automatically based on your behaviors.",
    target: null,
    tab: "overview"
  },
  {
    heading: "Visual Stats Summary",
    desc: "These glow meters track your daily study streaks, average accuracy, and syllabus coverage percentages in real-time.",
    target: "#tour-overview-stats",
    tab: "overview"
  },
  {
    heading: "The Study Log Console",
    desc: "After every study session, quickly log the subject, hours, and test accuracy here. The AI advisor uses this data to map your strengths and weaknesses.",
    target: "#tour-work-log",
    tab: "overview"
  },
  {
    heading: "Deadlines & Official Feed",
    desc: "This dashboard displays a live countdown timer to the exam and streams official syllabus adjustments and news announcements dynamically.",
    target: "#tour-countdown",
    tab: "overview"
  },
  {
    heading: "Syllabus Checklist & Accuracy",
    desc: "In the Syllabus page, check off topics as you finish them and move sliders to log test accuracies (0-100%). Click a subject to expand it.",
    target: "#syllabus-accordion",
    tab: "syllabus"
  },
  {
    heading: "AI Veteran Advisor Card",
    desc: "In the final page, review the Radar Chart and Heatmap. The AI Veteran Advisor lists your next 3 focus targets, detects comfort-zone study biases, and flags subjects undergoing memory decay.",
    target: "#tour-advisor",
    tab: "metrics"
  }
];

function initOnboardingTour() {
  const isTourCompleted = localStorage.getItem('gateQuest_tourCompleted');
  if (isTourCompleted !== 'true') {
    startTour();
  }
}

function startTour() {
  currentTourStep = 0;
  onboardingOverlay.classList.add('active');
  if (onboardingBackdrop) onboardingBackdrop.classList.add('active');
  showTourStep(0);
}

function showTourStep(index) {
  const step = tourSteps[index];
  
  // Clear any existing highlights
  document.querySelectorAll('.tour-highlight').forEach(el => el.classList.remove('tour-highlight'));
  
  // Switch to target tab
  if (step.tab) {
    switchTab(step.tab);
  }
  
  // Setup text content
  stepCounter.textContent = `STEP ${index + 1} OF ${tourSteps.length}`;
  stepHeading.textContent = step.heading;
  stepDesc.textContent = step.desc;
  
  // Highlight target element
  if (step.target) {
    const el = document.querySelector(step.target);
    if (el) {
      el.classList.add('tour-highlight');
      // Scroll into view if needed
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
  
  nextBtn.textContent = index === tourSteps.length - 1 ? "FINISH TOUR" : "NEXT STEP";
}

nextBtn.addEventListener('click', () => {
  currentTourStep++;
  if (currentTourStep < tourSteps.length) {
    showTourStep(currentTourStep);
  } else {
    completeTour();
  }
});

skipBtn.addEventListener('click', () => {
  completeTour();
});

function completeTour() {
  document.querySelectorAll('.tour-highlight').forEach(el => el.classList.remove('tour-highlight'));
  onboardingOverlay.classList.remove('active');
  if (onboardingBackdrop) onboardingBackdrop.classList.remove('active');
  localStorage.setItem('gateQuest_tourCompleted', 'true');
  switchTab('overview'); // Return to main page
  showToast('TOUR COMPLETED', 'Welcome aboard! Log your study hours to initialize recommendations.', 'cyan');
}

// Reset tour trigger button in status bar
const resetTourBtn = document.getElementById('reset-tour-btn');
resetTourBtn.addEventListener('click', () => {
  localStorage.removeItem('gateQuest_tourCompleted');
  startTour();
});

// INITIAL APPLICATION LOAD
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  verifyStreakIntegrity();
  
  generateSyllabusAccordion();
  populateQuickLogDropdown();
  updateDashboardStats();
  
  // Sync news online
  syncBulletinOnline();
  
  // If not online, use offline countdown fallback from cached announcements
  if (!navigator.onLine) {
    const cached = localStorage.getItem('gateQuest_v2_bulletin');
    if (cached) renderBulletinFeed(JSON.parse(cached));
    else startCountdownClock("2027-02-06T09:00:00"); // hardcoded backup date
  }
  
  // Initialize Onboarding Tour
  setTimeout(initOnboardingTour, 800);
});
