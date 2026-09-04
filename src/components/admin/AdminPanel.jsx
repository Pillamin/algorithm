// src/components/admin/AdminPanel.jsx
// 교사용 PIN 인증 및 문제 CRUD 모달 패널

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Lock, Plus, Pencil, Trash2, Save, X, ShieldCheck, Check, Info, Search, Filter, Eye, EyeOff, CloudUpload, Download, Upload, ArrowUpDown, GripVertical, RotateCcw, History, AlertTriangle } from 'lucide-react';
import { saveProblem, deleteProblemFromDB, saveQuizQuestion, deleteQuizQuestionFromDB, saveVersionSnapshot, fetchVersionSnapshots, deleteVersionSnapshot, saveProblemsBatch, saveQuizQuestionsBatch, fetchProblems, fetchQuizQuestions } from '../../config/firebase';

const ADMIN_PIN = import.meta.env.VITE_ADMIN_PIN || 'comedu2026';

const EMOJI_CATEGORIES = [
  { name: '디지털/기기', emojis: ['📱', '💻', '🖥️', '🤖', '⏰', '🎮', '🔍', '⚙️', '🔋', '📷', '🎧', '📡'] },
  { name: '생활/일상', emojis: ['🧺', '☕', '🛒', '🍔', '🎒', '📚', '🧹', '🔑', '💡', '💳', '🎁', '📫'] },
  { name: '이동/교통', emojis: ['🧭', '🚗', '🚌', '🚲', '✈️', '🚦', '🗺️', '⛽', '🎫', '🚇'] },
  { name: '문화/예술', emojis: ['🎵', '🎨', '🎬', '⚽', '🏆', '🧩', '🎤', '🍿', '🎟️', '📸'] },
  { name: '자연/상황', emojis: ['🌱', '☀️', '🌧️', '🐶', '🐱', '🏥', '🏫', '🏪', '🚨', '📌'] }
];

const CATEGORY_PRESETS = [
  '추상화 연습',
  '생활가전',
  '음식/앱',
  '교통',
  '도서관',
  '스마트폰',
  '음식/가전',
  '날씨/앱',
  '엔터테인먼트',
  '앱/쇼핑'
];

function normalizeProblemData(p) {
  const prob = JSON.parse(JSON.stringify(p || {}));
  if (!prob.id) prob.id = `problem_${Date.now()}`;
  if (!prob.title) prob.title = '';
  if (!prob.category) prob.category = '생활/편의';
  if (!prob.emoji) prob.emoji = '📝';
  if (!prob.description) prob.description = '';
  if (!prob.badgeIcon) prob.badgeIcon = '🏅';
  if (!prob.themeColor) prob.themeColor = '#6366f1';
  if (!prob.themeBg) prob.themeBg = 'from-indigo-50 to-violet-50';

  if (!prob.step1) prob.step1 = {};
  if (!prob.step1.question) prob.step1.question = '다음 상태 카드를 [초기 상태]와 [목표 상태] 상자에 배치하세요.';
  if (!prob.step1.initialStateAnswer) prob.step1.initialStateAnswer = '';
  if (!prob.step1.finalStateAnswer) prob.step1.finalStateAnswer = '';
  if (!prob.step1.options) prob.step1.options = [];
  if (!prob.step1.hint) prob.step1.hint = '';
  if (!prob.step1.explanation) prob.step1.explanation = '';

  if (!prob.step2) prob.step2 = {};
  if (!prob.step2.question) prob.step2.question = '다음 정보 카드 중 문제 해결에 꼭 필요한 것과 불필요한 것을 분류하세요.';
  if (!prob.step2.coreFeatures) prob.step2.coreFeatures = [];
  if (!prob.step2.nonCoreFeatures) prob.step2.nonCoreFeatures = [];
  if (!prob.step2.hint) prob.step2.hint = '';
  if (!prob.step2.explanation) prob.step2.explanation = '';

  if (!prob.step3) prob.step3 = {};
  if (!prob.step3.question) prob.step3.question = 'IPO(입력-처리-출력) 모델을 완성하고, 처리(Process) 단계의 빈칸을 채우세요.';
  if (!prob.step3.input) prob.step3.input = [];
  if (!prob.step3.inputOptions) prob.step3.inputOptions = [];
  if (!prob.step3.output) prob.step3.output = [];
  if (!prob.step3.outputOptions) prob.step3.outputOptions = [];
  if (!prob.step3.processQuestion) prob.step3.processQuestion = '';
  if (!prob.step3.processAnswer) prob.step3.processAnswer = '';
  if (!prob.step3.processOptions) prob.step3.processOptions = [];
  if (!prob.step3.hint) prob.step3.hint = '';
  if (!prob.step3.explanation) prob.step3.explanation = '';

  return prob;
}

export default function AdminPanel({ problems, onProblemsChange, quizQuestions = [], onQuizQuestionsChange }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);

  // Main Section Tab: 'quiz' (개념 퀴즈) | 'problems' (실생활 문제)
  const [mainSectionTab, setMainSectionTab] = useState('quiz');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'public' | 'hidden'

  // Edit / Add Modal States for Real-Life Problems
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState('basic'); // 'basic' | 'step1' | 'step2' | 'step3'
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editingOriginalId, setEditingOriginalId] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Edit / Add Modal States for Concept Quiz Questions
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [quizForm, setQuizForm] = useState(null);
  const [isAddingQuiz, setIsAddingQuiz] = useState(false);
  const [deleteQuizConfirm, setDeleteQuizConfirm] = useState(null);

  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState('');

  // Version History Modal State & Version Delete Confirm State
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [versionList, setVersionList] = useState([]);
  const [loadingVersions, setLoadingVersions] = useState(false);
  const [deleteVersionConfirm, setDeleteVersionConfirm] = useState(null); // { id, dateStr, note }

  // Drag and drop state & Order History for Undo
  const [draggedId, setDraggedId] = useState(null);
  const [orderedProblems, setOrderedProblems] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]); // Stack of previous problem lists for Undo
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false); // 순서 또는 숨김 변경 시 true
  const [showUnsavedWarningModal, setShowUnsavedWarningModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null); // () => void

  const navigate = useNavigate();

  // 브라우저 탭 닫기/새로고침 및 헤더 홈 버튼 클릭 시 미저장 경고
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    const handleRequestNavigateHome = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault(); // 기본 Header의 navigate('/') 방지
        setPendingAction(() => () => navigate('/', { state: { resetHome: Date.now() } }));
        setShowUnsavedWarningModal(true);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('request-navigate-home', handleRequestNavigateHome);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('request-navigate-home', handleRequestNavigateHome);
    };
  }, [hasUnsavedChanges, navigate]);

  // 페이지/탭 이탈 가드 함수
  function requestNavigation(action) {
    if (hasUnsavedChanges) {
      setPendingAction(() => action);
      setShowUnsavedWarningModal(true);
    } else {
      action();
    }
  }

  function handleDiscardAndProceed() {
    setHasUnsavedChanges(false);
    setOrderHistory([]);
    setShowUnsavedWarningModal(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  }

  async function handleSaveAndProceed() {
    await handleSyncToDB();
    setShowUnsavedWarningModal(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  }

  async function openVersionModal(type) {
    setShowVersionModal(true);
    setLoadingVersions(true);
    try {
      const list = await fetchVersionSnapshots(type);
      setVersionList(list);
    } catch (e) {
      console.error(e);
      setVersionList([]);
    } finally {
      setLoadingVersions(false);
    }
  }

  async function confirmDeleteVersion(ver) {
    setDeleteVersionConfirm(ver);
  }

  async function executeDeleteVersion() {
    if (!deleteVersionConfirm) return;
    const versionId = deleteVersionConfirm.id;
    const type = mainSectionTab === 'quiz' ? 'quiz' : 'problems';
    try {
      await deleteVersionSnapshot(type, versionId);
      setVersionList((prev) => prev.filter((v) => v.id !== versionId));
      setSyncMsg('🗑️ 해당 버전 스냅샷이 영구 삭제되었습니다.');
      setTimeout(() => setSyncMsg(''), 4000);
    } catch (e) {
      console.error(e);
      setSyncMsg('❌ 버전 삭제 실패');
      setTimeout(() => setSyncMsg(''), 4000);
    } finally {
      setDeleteVersionConfirm(null);
    }
  }

  async function handleRestoreVersion(versionItem) {
    const type = mainSectionTab === 'quiz' ? 'quiz' : 'problems';
    if (!versionItem || !versionItem.data) return;

    if (type === 'quiz') {
      onQuizQuestionsChange(versionItem.data);
      setSyncing(true);
      setSyncMsg('☁️ 복원된 개념 퀴즈를 DB에 반영 중...');
      try {
        for (const q of versionItem.data) {
          await saveQuizQuestion(q);
        }
        setSyncMsg(`✅ [${versionItem.dateStr}] 버전 (${versionItem.data.length}문항) 복원 완료!`);
      } catch {
        setSyncMsg(`✅ [${versionItem.dateStr}] 버전으로 로컬 복원 완료!`);
      } finally {
        setSyncing(false);
        setTimeout(() => setSyncMsg(''), 5000);
      }
    } else {
      onProblemsChange(versionItem.data);
      saveToDiskFile(versionItem.data);
      setSyncing(true);
      setSyncMsg('☁️ 복원된 실생활 문제를 DB에 반영 중...');
      try {
        for (const p of versionItem.data) {
          await saveProblem(p);
        }
        setSyncMsg(`✅ [${versionItem.dateStr}] 버전 (${versionItem.data.length}개 문제) 복원 완료!`);
      } catch {
        setSyncMsg(`✅ [${versionItem.dateStr}] 버전으로 로컬 복원 완료!`);
      } finally {
        setSyncing(false);
        setTimeout(() => setSyncMsg(''), 5000);
      }
    }
    setShowVersionModal(false);
  }

  function handleCardDragStart(e, problem) {
    if (problem.isTutorial || searchQuery || statusFilter !== 'all') {
      e.preventDefault();
      return;
    }
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', problem.id);
    setDraggedId(problem.id);
    setOrderedProblems(problems);
  }

  function handleCardDragOver(e, targetProblem) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!draggedId || targetProblem.isTutorial) return;

    // Use current ordered list or fallback to problems
    const current = orderedProblems || problems;
    const currentSrcIdx = current.findIndex((p) => p.id === draggedId);
    const targetIdx = current.findIndex((p) => p.id === targetProblem.id);

    if (currentSrcIdx !== -1 && targetIdx !== -1 && currentSrcIdx !== targetIdx) {
      const next = Array.from(current);
      const [item] = next.splice(currentSrcIdx, 1);
      next.splice(targetIdx, 0, item);
      setOrderedProblems(next);
    }
  }

  function handleCardDrop(e) {
    e.preventDefault();
    if (!draggedId || !orderedProblems) {
      setDraggedId(null);
      setOrderedProblems(null);
      return;
    }

    const nextList = orderedProblems;

    // Save previous state to history before committing new order
    setOrderHistory((prev) => [...prev, problems]);
    setHasUnsavedChanges(true);

    setDraggedId(null);
    setOrderedProblems(null);

    // 순서 변경은 로컬 상태에만 반영 (수동 [DB 저장] 버튼 클릭 시에만 DB/디스크/버전 반영)
    onProblemsChange(nextList);
    setSyncMsg('⚠️ 문제 순서가 변경되었습니다. 상단 [DB 저장]을 눌러야 최종 반영됩니다.');
    setTimeout(() => setSyncMsg(''), 4000);
  }

  function handleCardDragEnd() {
    setDraggedId(null);
    setOrderedProblems(null);
  }

  // 변경사항 되돌리기 (Undo)
  function handleUndoChanges() {
    if (orderHistory.length === 0) return;
    const previousList = orderHistory[orderHistory.length - 1];
    const newHistory = orderHistory.slice(0, -1);
    setOrderHistory(newHistory);
    if (newHistory.length === 0) {
      setHasUnsavedChanges(false);
    }

    // 이전 상태로 로컬 되돌리기
    onProblemsChange(previousList);
    setSyncMsg('↩️ 최근 변경사항을 이전 상태로 되돌렸습니다.');
    setTimeout(() => setSyncMsg(''), 3000);
  }

  function saveToDiskFile(list) {
    fetch('/api/save-initial-problems', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(list),
    }).catch((e) => console.warn('Disk save skipped:', e));
  }

  async function handleSyncToDB() {
    setSyncing(true);
    setSyncMsg('');
    try {
      await saveProblemsBatch(problems);
      saveToDiskFile(problems);
      // Automatically record a timestamped version snapshot
      await recordVersionSnapshot('problems', problems, '수동 DB 직접 저장', true);
      setHasUnsavedChanges(false);
      setOrderHistory([]);
    } catch (e) {
      console.error(e);
      setSyncMsg('❌ DB 전송 실패: Firestore 규칙을 확인해 주세요.');
    } finally {
      setSyncing(false);
    }
  }

  function getVersionTimestamp() {
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, '0');
    return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}`;
  }

  function handleDownloadFile() {
    const version = getVersionTimestamp();
    const fileContent = `// src/data/initialProblems.js\n// 버전: v_${version}\n// 저장일시: ${new Date().toLocaleString('ko-KR')}\n// 문제 데이터 세트 (총 ${problems.length}개)\n\nexport const initialProblems = ${JSON.stringify(problems, null, 2)};\n`;
    const blob = new Blob([fileContent], { type: 'text/javascript;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `initialProblems_v${version}.js`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  async function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const rawText = evt.target.result || '';

        // Strip single line (// ...) and block (/* ... */) JS comments
        const cleanText = rawText
          .replace(/\/\*[\s\S]*?\*\//g, '')
          .replace(/\/\/.*/g, '');

        let parsedProblems = null;

        const jsonStart = cleanText.indexOf('[');
        const jsonEnd = cleanText.lastIndexOf(']');
        if (jsonStart !== -1 && jsonEnd !== -1) {
          const jsonStr = cleanText.substring(jsonStart, jsonEnd + 1);
          parsedProblems = JSON.parse(jsonStr);
        } else {
          parsedProblems = JSON.parse(cleanText);
        }

        if (!Array.isArray(parsedProblems) || parsedProblems.length === 0) {
          alert('올바른 문제 데이터 (.js 또는 .json) 파일이 아닙니다.');
          return;
        }

        const normalized = parsedProblems.map(normalizeProblemData);

        // 기존 문제 목록과 업로드된 문제 병합 (id 일치 시 업데이트, 신규 id는 추가, 미포함 기존 문제도 모두 유지)
        const uploadedMap = new Map(normalized.map((p) => [p.id, p]));
        const mergedMap = new Map();

        // 1. 기존 문제 순서 유지하며 id 일치 항목 업데이트
        problems.forEach((p) => {
          if (p && p.id) {
            if (uploadedMap.has(p.id)) {
              mergedMap.set(p.id, uploadedMap.get(p.id));
              uploadedMap.delete(p.id);
            } else {
              mergedMap.set(p.id, p);
            }
          }
        });

        // 2. 업로드 파일에만 있는 신규 문제 추가
        uploadedMap.forEach((p, id) => {
          mergedMap.set(id, p);
        });

        const mergedProblems = Array.from(mergedMap.values());

        // 1. Update React state & localStorage
        onProblemsChange(mergedProblems);

        // 2. Save to local disk initialProblems.js
        saveToDiskFile(mergedProblems);

        // 3. Sync all merged problems to Firestore DB
        setSyncing(true);
        setSyncMsg('☁️ 업로드된 문제를 DB에 반영 중...');
        for (const p of mergedProblems) {
          await saveProblem(p);
        }

        setSyncMsg(`✅ ${normalized.length}개 업로드 처리 완료! (총 ${mergedProblems.length}개 문제 유지 및 반영)`);
        setTimeout(() => setSyncMsg(''), 5000);
      } catch (err) {
        console.error(err);
        alert('파일을 다루는 중 오류가 발생했습니다: ' + err.message);
      } finally {
        setSyncing(false);
        e.target.value = '';
      }
    };
    reader.readAsText(file);
  }

  // --- Concept Quiz Download / Upload / DB Sync ---
  function handleQuizDownloadFile() {
    const version = getVersionTimestamp();
    const fileContent = `// src/data/initialQuizQuestions.js\n// 버전: v_${version}\n// 저장일시: ${new Date().toLocaleString('ko-KR')}\n// 초기 개념 퀴즈 데이터 세트 (총 ${quizQuestions.length}문항)\n\nexport const initialQuizQuestions = ${JSON.stringify(quizQuestions, null, 2)};\n`;
    const blob = new Blob([fileContent], { type: 'text/javascript;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `initialQuizQuestions_v${version}.js`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  async function handleQuizFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const rawText = evt.target.result || '';
        const cleanText = rawText.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*/g, '');
        let parsed = null;
        const jsonStart = cleanText.indexOf('[');
        const jsonEnd = cleanText.lastIndexOf(']');
        if (jsonStart !== -1 && jsonEnd !== -1) {
          parsed = JSON.parse(cleanText.substring(jsonStart, jsonEnd + 1));
        } else {
          parsed = JSON.parse(cleanText);
        }

        if (!Array.isArray(parsed) || parsed.length === 0) {
          alert('올바른 개념 퀴즈 데이터 (.js 또는 .json) 파일이 아닙니다.');
          return;
        }

        onQuizQuestionsChange(parsed);

        // Try syncing to Firebase in background without blocking local state update if permissions fail
        setSyncing(true);
        setSyncMsg('☁️ 업로드된 퀴즈를 DB에 반영 중...');
        try {
          for (const q of parsed) {
            await saveQuizQuestion(q);
          }
          setSyncMsg(`✅ ${parsed.length}개 개념 퀴즈 업로드 및 DB 전송 완료!`);
        } catch (dbErr) {
          console.warn('Firebase sync failed (permission or rule setting issue):', dbErr);
          setSyncMsg(`✅ ${parsed.length}개 개념 퀴즈 업로드 완료! (DB 전송은 권한 필요)`);
        }
        setTimeout(() => setSyncMsg(''), 5000);
      } catch (err) {
        console.error(err);
        alert('퀴즈 파일 파싱 중 오류가 발생했습니다: ' + err.message);
      } finally {
        setSyncing(false);
        e.target.value = '';
      }
    };
    reader.readAsText(file);
  }

  async function handleSyncQuizToDB() {
    setSyncing(true);
    setSyncMsg('');
    try {
      await saveQuizQuestionsBatch(quizQuestions);
      // Automatically record a timestamped version snapshot for quizzes
      await recordVersionSnapshot('quiz', quizQuestions, '수동 개념 퀴즈 DB 저장', true);
      setHasUnsavedChanges(false);
      setOrderHistory([]);
    } catch (e) {
      console.error(e);
      setSyncMsg('❌ 퀴즈 DB 전송 실패: Firestore 규칙을 확인해 주세요.');
    } finally {
      setSyncing(false);
    }
  }

  function createNewProblemTemplate() {
    const nextNum = (problems.length + 1).toString().padStart(2, '0');
    return normalizeProblemData({
      id: `problem_${nextNum}`,
      title: '',
      emoji: '💡',
      category: '신규 카테고리',
      badgeIcon: '🏅',
      description: '',
      hidden: false,
      step1: {
        question: '다음 상태 카드를 [초기 상태]와 [목표 상태] 상자에 배치하세요.',
        initialStateAnswer: '주어진 자원과 데이터가 준비된 상태',
        finalStateAnswer: '목표 결과가 완성된 상태',
        options: [
          { id: 'c1', text: '주어진 자원과 데이터가 준비된 상태', type: 'initial' },
          { id: 'c2', text: '목표 결과가 완성된 상태', type: 'final' },
          { id: 'c3', text: '과정을 진행하고 있는 중간 상태', type: 'wrong' },
          { id: 'c4', text: '관련 없는 엉뚱한 행동을 하는 상태', type: 'wrong' },
        ],
        hint: '문제 해결의 출발점(기초 데이터)과 최종 목표 결과를 고르세요.',
        explanation: '초기 상태는 출발점 데이터이며, 목표 상태는 문제 해결 완결 상태입니다.',
      },
      step2: {
        question: '다음 정보 카드 중 문제 해결에 꼭 필요한 것과 불필요한 것을 분류하세요.',
        coreFeatures: [
          { id: 'f1', text: '핵심 정보 1' },
          { id: 'f2', text: '핵심 정보 2' },
          { id: 'f3', text: '핵심 정보 3' },
        ],
        nonCoreFeatures: [
          { id: 'f4', text: '불필요한 정보 1' },
          { id: 'f5', text: '불필요한 정보 2' },
          { id: 'f6', text: '불필요한 정보 3' },
        ],
        hint: '결과를 계산하거나 결정할 때 실제 영향을 미치는 요소만 고르세요.',
        explanation: '문제와 직접적 영향이 없는 비핵심 요소를 버려 복잡함을 단순화합니다.',
      },
      step3: {
        question: 'IPO(입력-처리-출력) 모델을 완성하고, 처리(Process) 단계의 빈칸을 채우세요.',
        input: ['입력 데이터 1', '입력 데이터 2'],
        inputOptions: ['입력 데이터 1', '입력 데이터 2', '불필요한 입력 데이터'],
        output: ['출력 결과 1', '출력 결과 2'],
        outputOptions: ['출력 결과 1', '출력 결과 2', '불필요한 출력 결과'],
        processQuestion: '입력된 데이터를 바탕으로 조건이 맞으면 [빈칸1] 처리한다.',
        processAnswer: '확인하여',
        processOptions: ['확인하여', '무시하고', '삭제하여'],
        hint: '컴퓨터의 입-출력 흐름과 처리 기준을 생각해보세요.',
        explanation: 'IPO 구조는 컴퓨터가 문제 해결을 처리하는 기본 골격입니다.',
      },
    });
  }

  async function fetchLatestDataFromDB() {
    setSyncing(true);
    setSyncMsg('☁️ 최신 DB 데이터를 불러오는 중...');
    try {
      const [remoteProblems, remoteQuiz] = await Promise.all([
        fetchProblems(),
        fetchQuizQuestions()
      ]);
      
      if (remoteProblems && remoteProblems.length > 0) {
        const hasTutorial = remoteProblems.some(p => p.id === 'problem_practice' || p.isTutorial);
        let merged = remoteProblems;
        if (!hasTutorial) {
          const existingTutorial = problems.find(p => p.isTutorial);
          if (existingTutorial) {
            merged = [existingTutorial, ...remoteProblems];
          }
        }
        onProblemsChange(merged);
      }

      if (remoteQuiz && remoteQuiz.length > 0) {
        onQuizQuestionsChange(remoteQuiz);
      }

      setSyncMsg('✅ 최신 DB 데이터를 성공적으로 불러왔습니다.');
      setTimeout(() => setSyncMsg(''), 3000);
    } catch (e) {
      console.error(e);
      setSyncMsg('❌ 최신 DB 데이터를 불러오는 데 실패했습니다.');
    } finally {
      setSyncing(false);
    }
  }

  function handlePinSubmit(e) {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      setAuthenticated(true);
      setPinError(false);
      fetchLatestDataFromDB();
    } else {
      setPinError(true);
      setPin('');
    }
  }

  function startAdd() {
    setIsAdding(true);
    setEditForm(createNewProblemTemplate());
    setEditingOriginalId(null);
    setActiveTab('basic');
    setShowEmojiPicker(false);
    setShowEditModal(true);
  }

  function startEdit(problem) {
    setIsAdding(false);
    const normalized = normalizeProblemData(problem);
    setEditForm(normalized);
    setEditingOriginalId(problem.id);
    setActiveTab('basic');
    setShowEmojiPicker(false);
    setShowEditModal(true);
  }

  function closeModal() {
    setShowEditModal(false);
    setEditForm(null);
    setEditingOriginalId(null);
    setIsAdding(false);
    setShowEmojiPicker(false);
  }

  // 공통 버전 스냅샷 기록 함수 (수동/자동 저장 시 버전 및 수정 로그 생성)
  async function recordVersionSnapshot(type, dataList, note = '', showNotification = false) {
    try {
      const snapshot = await saveVersionSnapshot(type, dataList, note);
      if (showNotification && snapshot?.dateStr) {
        const typeLabel = type === 'quiz' ? '개념 퀴즈' : '실생활 문제';
        setSyncMsg(`✅ ${typeLabel} DB 저장 및 버전 기록 완료! (${snapshot.dateStr})`);
        setTimeout(() => setSyncMsg(''), 5000);
      }
      return snapshot;
    } catch (e) {
      console.warn(`[${type}] 버전 스냅샷 기록 실패:`, e);
    }
  }

  function handleSave() {
    if (!editForm.title.trim()) {
      alert('문제 제목을 입력해주세요.');
      return;
    }
    if (!editForm.id.trim()) {
      alert('문제 ID를 입력해주세요.');
      return;
    }

    const timeStr = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    let logNote = '';

    let updatedList;
    if (isAdding) {
      updatedList = [...problems, editForm];
      logNote = `[${timeStr}] 자동저장: [${editForm.id}] '${editForm.title}' 신규 추가`;
    } else {
      const original = problems.find((p) => p.id === editingOriginalId);
      const changedFields = [];
      if (original) {
        if (original.title !== editForm.title) changedFields.push('제목');
        if (original.category !== editForm.category) changedFields.push('카테고리');
        if (original.emoji !== editForm.emoji) changedFields.push('이모지');
        if (original.description !== editForm.description) changedFields.push('설명');
        if (JSON.stringify(original.step1) !== JSON.stringify(editForm.step1)) changedFields.push('1단계');
        if (JSON.stringify(original.step2) !== JSON.stringify(editForm.step2)) changedFields.push('2단계');
        if (JSON.stringify(original.step3) !== JSON.stringify(editForm.step3)) changedFields.push('3단계');
      }
      const fieldSummary = changedFields.length > 0 ? ` (${changedFields.join(', ')} 수정)` : '';
      logNote = `[${timeStr}] 자동저장: [${editForm.id}] '${editForm.title}'${fieldSummary}`;
      updatedList = problems.map((p) => (p.id === editingOriginalId ? editForm : p));
    }

    // Update local state & localStorage instantly
    onProblemsChange(updatedList);
    setHasUnsavedChanges(true);

    closeModal();
  }

  function handleDelete(id) {
    const timeStr = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const target = problems.find((p) => p.id === id);
    const updatedList = problems.filter((p) => p.id !== id);

    // Update local state & localStorage instantly
    onProblemsChange(updatedList);
    setHasUnsavedChanges(true);

    setDeleteConfirm(null);
  }

  // --- Concept Quiz Handlers ---
  function startQuizAdd() {
    setIsAddingQuiz(true);
    const nextId = quizQuestions.length > 0 ? Math.max(...quizQuestions.map(q => Number(q.id) || 0)) + 1 : 1;
    setQuizForm({
      id: nextId,
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      explanation: '[개념 슬라이드 1/6] 해설 문구를 작성하세요.'
    });
    setShowQuizModal(true);
  }

  function startQuizEdit(qItem) {
    setIsAddingQuiz(false);
    setQuizForm({
      ...qItem,
      options: [...(qItem.options || ['', '', '', ''])]
    });
    setShowQuizModal(true);
  }

  function closeQuizModal() {
    setShowQuizModal(false);
    setQuizForm(null);
    setIsAddingQuiz(false);
  }

  function handleQuizSave() {
    if (!quizForm.question.trim()) {
      alert('퀴즈 질문을 입력해주세요.');
      return;
    }
    if (!quizForm.correctAnswer.trim()) {
      alert('정답을 선택하거나 입력해주세요.');
      return;
    }

    const timeStr = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    let logNote = '';

    let updatedQuizList;
    if (isAddingQuiz) {
      updatedQuizList = [...quizQuestions, quizForm];
      logNote = `[${timeStr}] 자동저장: 문항 #${quizForm.id} 신규 추가`;
    } else {
      const original = quizQuestions.find((q) => q.id === quizForm.id);
      const changedFields = [];
      if (original) {
        if (original.question !== quizForm.question) changedFields.push('질문');
        if (original.correctAnswer !== quizForm.correctAnswer) changedFields.push('정답');
        if (JSON.stringify(original.options) !== JSON.stringify(quizForm.options)) changedFields.push('보기');
        if (original.explanation !== quizForm.explanation) changedFields.push('해설');
      }
      const fieldSummary = changedFields.length > 0 ? ` (${changedFields.join(', ')} 수정)` : '';
      logNote = `[${timeStr}] 자동저장: 문항 #${quizForm.id}${fieldSummary}`;
      updatedQuizList = quizQuestions.map((q) => (q.id === quizForm.id ? quizForm : q));
    }

    onQuizQuestionsChange(updatedQuizList);
    setHasUnsavedChanges(true);

    closeQuizModal();
  }

  function handleQuizDelete(id) {
    const timeStr = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const updatedList = quizQuestions.filter((q) => q.id !== id);
    onQuizQuestionsChange(updatedList);
    setHasUnsavedChanges(true);

    setDeleteQuizConfirm(null);
  }

  function handleResetAllProgress() {
    setShowResetConfirmModal(true);
  }

  function toggleProblemVisibility(problem, e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const currentHidden = Boolean(problem.hidden);
    const updated = { ...problem, hidden: !currentHidden };
    const nextProblems = problems.map((p) => (p.id === problem.id ? updated : p));

    // 변경 전 상태 히스토리 보관 및 미저장 플래그 설정
    setOrderHistory((prev) => [...prev, problems]);
    setHasUnsavedChanges(true);

    // Update state immediately for instant UI feedback (수동 [DB 저장] 버튼으로 최종 저장)
    onProblemsChange(nextProblems);
    setSyncMsg(`⚠️ [${problem.title || problem.id}] 공개 상태가 변경되었습니다. 상단 [DB 저장]을 눌러야 최종 반영됩니다.`);
    setTimeout(() => setSyncMsg(''), 4000);
  }

  // Source list to display: during drag, use live ordered list; otherwise normal problems list
  const displayProblems = orderedProblems || problems;

  // Filtered & Sorted problems list (Tutorial #00 always stays at index 0)
  const sortedProblems = [...displayProblems].sort((a, b) => {
    if (a.isTutorial || a.id === 'problem_practice') return -1;
    if (b.isTutorial || b.id === 'problem_practice') return 1;
    return 0;
  });

  const filteredProblems = sortedProblems.filter((p) => {
    const matchSearch =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchStatus =
      statusFilter === 'all' ||
      (statusFilter === 'public' && !p.hidden) ||
      (statusFilter === 'hidden' && p.hidden);

    return matchSearch && matchStatus;
  });

  // --- PIN Auth Screen ---
  if (!authenticated) {
    return (
      <div className="card-bento max-w-sm mx-auto my-16 text-center space-y-6 animate-fade-up">
        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto text-2xl shadow-xs">
          🔒
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-slate-800">교사 인증 (관리자)</h2>
          <p className="text-xs text-slate-400 mt-1 font-semibold">교사 전용 인증 암호를 입력해주세요.</p>
        </div>
        <form onSubmit={handlePinSubmit} className="space-y-4">
          <input
            type="password"
            maxLength={30}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="교사 인증 암호 입력"
            className="w-full text-center text-lg tracking-wider font-extrabold py-3 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            autoFocus
          />
          {pinError && (
            <p className="text-xs text-rose-500 font-extrabold">PIN 번호가 일치하지 않습니다.</p>
          )}
          <button type="submit" className="btn-primary w-full py-3 font-extrabold cursor-pointer">
            인증하기
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100">
          <button
            onClick={handleResetAllProgress}
            className="text-xs font-black text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 py-2.5 px-4 rounded-xl transition-all cursor-pointer w-full flex items-center justify-center gap-1.5"
          >
            <span>🔄</span>
            <span>학습 데이터 초기화 (최초 접속 상태로)</span>
          </button>
        </div>

        {/* Reset Confirmation Modal */}
        {showResetConfirmModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fade-up">
            <div className="bg-white rounded-3xl p-7 max-w-sm w-full shadow-2xl border border-rose-100 text-center space-y-5 animate-bounce-in">
              <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto text-3xl shadow-xs">
                🔄
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800 mb-1.5">학습 데이터 전체 초기화</h3>
                <p className="text-xs text-slate-500 font-bold leading-relaxed">
                  퀴즈 통과 기록, 튜토리얼 완료 상태, 풀어본 문제 목록이 모두 완전히 삭제되며 최초 접속 상태로 돌아갑니다.
                </p>
              </div>
              <div className="flex gap-2.5 pt-2">
                <button
                  onClick={() => setShowResetConfirmModal(false)}
                  className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-2xl text-xs transition-all cursor-pointer"
                >
                  취소
                </button>
                <button
                  onClick={() => {
                    localStorage.clear();
                    sessionStorage.clear();
                    window.location.href = '/';
                  }}
                  className="flex-1 py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-2xl text-xs shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  초기화 실행
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- Admin Panel Main Screen ---
  return (
    <div className="animate-fade-up pb-12">
      {/* Header Bar */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
              <span>⚙️ 관리자 메뉴</span>
            </h1>
            <button
              onClick={() => requestNavigation(() => setAuthenticated(false))}
              className="text-xs font-bold text-slate-500 hover:text-slate-700 flex items-center gap-1 cursor-pointer bg-slate-100 hover:bg-slate-200 py-1.5 px-2.5 rounded-xl transition-colors"
              title="로그아웃"
            >
              <Lock size={12} />
              <span>로그아웃</span>
            </button>
          </div>
          <p className="text-slate-400 text-xs mt-1 font-medium">
            실생활 문제: <strong className="text-indigo-600 font-bold">{problems.length}개</strong> | 개념 퀴즈: <strong className="text-amber-600 font-bold">{quizQuestions.length}개</strong>
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">

          {/* Hidden File Input for Quiz Upload */}
          <input
            id="quiz-file-upload-input"
            type="file"
            accept=".js,.json"
            onChange={handleQuizFileUpload}
            className="hidden"
          />

          {mainSectionTab === 'quiz' && (
            <>
              <button
                type="button"
                onClick={() => document.getElementById('quiz-file-upload-input')?.click()}
                disabled={syncing}
                className="h-9 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 flex items-center gap-1 text-xs px-2.5 rounded-xl cursor-pointer font-bold transition-all disabled:opacity-50 shrink-0"
                title="수정된 개념 퀴즈 .js 또는 .json 파일 선택 업로드"
              >
                <Upload size={13} className="text-slate-600" />
                <span>업로드</span>
              </button>

              <button
                type="button"
                onClick={handleQuizDownloadFile}
                className="h-9 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 flex items-center gap-1 text-xs px-2.5 rounded-xl cursor-pointer font-bold transition-all shrink-0"
                title="현재 개념 퀴즈 데이터 세트를 initialQuizQuestions.js 파일로 내보내기 다운로드"
              >
                <Download size={13} className="text-slate-600" />
                <span>다운로드</span>
              </button>

              <button
                onClick={handleSyncQuizToDB}
                disabled={syncing}
                className={`h-9 text-white flex items-center gap-1 text-xs px-3 rounded-xl cursor-pointer font-black shadow-2xs hover:shadow-xs transition-all disabled:opacity-50 shrink-0 ${hasUnsavedChanges ? 'bg-amber-600 hover:bg-amber-700 ring-2 ring-amber-400 ring-offset-1 animate-pulse' : 'bg-amber-600 hover:bg-amber-700'}`}
                title="현재 전체 개념 퀴즈 데이터를 구글 Firestore 클라우드 DB로 전송합니다."
              >
                <CloudUpload size={14} />
                <span>{syncing ? '저장 중...' : 'DB 저장'}</span>
              </button>

              <button
                type="button"
                onClick={() => openVersionModal('quiz')}
                className="h-9 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 flex items-center gap-1 text-xs px-2.5 rounded-xl cursor-pointer font-bold transition-all shadow-2xs shrink-0"
                title="개념 퀴즈 저장 일시/버전 기록 목록 및 복원·삭제 관리"
              >
                <History size={13} className="text-amber-600" />
                <span>버전 관리</span>
              </button>

              <button
                onClick={startQuizAdd}
                className="h-9 bg-amber-500 hover:bg-amber-600 text-white text-xs font-black rounded-xl cursor-pointer shadow-sm hover:shadow-md transition-all flex items-center gap-1 px-3 shrink-0"
              >
                <Plus size={14} />
                <span>퀴즈 추가</span>
              </button>
            </>
          )}

          {mainSectionTab === 'problems' && (
            <>
              {orderHistory.length > 0 && (
                <button
                  type="button"
                  onClick={handleUndoChanges}
                  disabled={syncing}
                  className="h-9 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1 text-xs px-2.5 rounded-xl cursor-pointer font-black transition-all disabled:opacity-50 shadow-2xs shrink-0 animate-fade-in"
                  title={`순서/숨김 등 최근 변경사항 되돌리기 (남은 기록: ${orderHistory.length}회)`}
                >
                  <RotateCcw size={13} className="text-amber-700 shrink-0" />
                  <span>변경 되돌리기({orderHistory.length})</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => document.getElementById('file-upload-input')?.click()}
                disabled={syncing}
                className="h-9 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 flex items-center gap-1 text-xs px-2.5 rounded-xl cursor-pointer font-bold transition-all disabled:opacity-50 shrink-0"
                title="수정된 문제 .js 또는 .json 파일 선택 업로드"
              >
                <Upload size={13} className="text-slate-600" />
                <span>업로드</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadFile}
                className="h-9 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 flex items-center gap-1 text-xs px-2.5 rounded-xl cursor-pointer font-bold transition-all shrink-0"
                title="현재 문제 데이터 세트를 버전 포함 .js 파일로 다운로드 백업"
              >
                <Download size={13} className="text-slate-600" />
                <span>다운로드</span>
              </button>

              <button
                onClick={handleSyncToDB}
                disabled={syncing}
                className={`h-9 text-white flex items-center gap-1 text-xs px-3 rounded-xl cursor-pointer font-black shadow-2xs hover:shadow-xs transition-all disabled:opacity-50 shrink-0 ${hasUnsavedChanges ? 'bg-emerald-600 hover:bg-emerald-700 ring-2 ring-amber-400 ring-offset-1 animate-pulse' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                title="현재 전체 문제 데이터를 구글 Firestore 클라우드 DB로 전송합니다."
              >
                <CloudUpload size={14} />
                <span>{syncing ? '저장 중...' : 'DB 저장'}</span>
              </button>

              <button
                type="button"
                onClick={() => openVersionModal('problems')}
                className="h-9 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 flex items-center gap-1 text-xs px-2.5 rounded-xl cursor-pointer font-bold transition-all shadow-2xs shrink-0"
                title="실생활 문제 저장 일시/버전 기록 목록 및 복원·삭제 관리"
              >
                <History size={13} className="text-indigo-600" />
                <span>버전 관리</span>
              </button>

              <button
                onClick={startAdd}
                className="h-9 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl cursor-pointer shadow-sm hover:shadow-md transition-all flex items-center gap-1 px-3 shrink-0"
              >
                <Plus size={14} />
                <span>문제 추가</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Section Navigation Tabs (개념 퀴즈가 왼쪽에 오도록 순서 배치) */}
      <div className="flex border-b border-slate-200 mb-5 gap-2">
        <button
          onClick={() => requestNavigation(() => setMainSectionTab('quiz'))}
          className={`pb-2.5 px-4 text-sm font-black transition-all border-b-2 cursor-pointer ${mainSectionTab === 'quiz'
              ? 'border-amber-500 text-amber-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
        >
          💡 개념 퀴즈 문제 편집 ({quizQuestions.length})
        </button>
        <button
          onClick={() => requestNavigation(() => setMainSectionTab('problems'))}
          className={`pb-2.5 px-4 text-sm font-black transition-all border-b-2 cursor-pointer ${mainSectionTab === 'problems'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
        >
          🧩 실생활 문제 편집 ({problems.length})
        </button>
      </div>

      {/* SECTION 1: 실생활 문제 편집 목록 */}
      {mainSectionTab === 'problems' && (
        <>
          {/* 🔍 Search & Filter Bar */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 mb-5 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="문제 제목 또는 카테고리 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-3 text-xs font-bold bg-slate-50 border border-slate-200 focus:border-indigo-400 rounded-xl outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
              <span className="text-[11px] font-extrabold text-slate-400 mr-1 flex items-center gap-1">
                <Filter size={12} /> 상태:
              </span>
              {[
                { id: 'all', label: `전체 (${problems.length})` },
                { id: 'public', label: `🟢 공개 (${problems.filter((p) => !p.hidden).length})` },
                { id: 'hidden', label: `🙈 숨김 (${problems.filter((p) => p.hidden).length})` },
              ].map((tab) => {
                const isActive = statusFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setStatusFilter(tab.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${isActive
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Problem Cards Bento Grid (4열 격자 및 드래그 앤 드롭 순서 변경) */}
          {filteredProblems.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-200 text-center space-y-2">
              <p className="text-2xl">🔍</p>
              <p className="text-sm font-extrabold text-slate-600">검색 조건에 맞는 문제가 없습니다.</p>
              <p className="text-xs text-slate-400">검색어나 상태 필터를 확인해 보세요.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
              {filteredProblems.map((problem) => {
                const mainProblemsOnly = displayProblems.filter((p) => !p.isTutorial);
                const mainIdx = mainProblemsOnly.findIndex((p) => p.id === problem.id);
                const numStr = problem.isTutorial ? '00' : (mainIdx + 1).toString().padStart(2, '0');
                const isDragDisabled = Boolean(problem.isTutorial || searchQuery || statusFilter !== 'all');
                const isDragging = draggedId === problem.id;

                return (
                  <div
                    key={problem.id}
                    draggable={!isDragDisabled}
                    onDragStart={(e) => handleCardDragStart(e, problem)}
                    onDragOver={(e) => handleCardDragOver(e, problem)}
                    onDrop={(e) => handleCardDrop(e)}
                    onDragEnd={handleCardDragEnd}
                    className={`group relative bg-white border rounded-2xl p-3.5 transition-all duration-150 flex flex-col justify-between overflow-hidden select-none ${isDragging
                        ? 'opacity-40 border-2 border-dashed border-indigo-400 scale-[0.97] bg-indigo-50/40'
                        : problem.isTutorial
                          ? 'border-purple-200/80 bg-purple-50/20'
                          : problem.hidden
                            ? 'border-slate-300 bg-slate-100/80 grayscale opacity-75 hover:grayscale-0 hover:opacity-100 hover:shadow-md'
                            : 'border-slate-200/80 hover:border-indigo-300 hover:shadow-md'
                      } ${!isDragDisabled ? 'cursor-grab active:cursor-grabbing' : ''}`}
                  >
                    {/* Subtle muted overlay for hidden cards */}
                    {problem.hidden && (
                      <div className="absolute inset-0 bg-slate-900/5 pointer-events-none" />
                    )}

                    {/* Header Row: Drag Handle, #Index, Action Icons */}
                    <div className="flex items-center justify-between gap-1.5 mb-2.5 relative z-10">
                      <div className="flex items-center gap-1.5 min-w-0">
                        {!problem.isTutorial && !isDragDisabled && (
                          <div
                            className="text-slate-400 group-hover:text-indigo-600 p-0.5 rounded shrink-0 transition-colors"
                            title="드래그하여 문제 순서 변경"
                          >
                            <GripVertical size={16} />
                          </div>
                        )}
                        {problem.isTutorial ? (
                          <span className="text-[10px] font-black text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md border border-purple-200 shrink-0">
                            #튜토리얼
                          </span>
                        ) : (
                          <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 border border-indigo-100/80 px-2 py-0.5 rounded-md shrink-0">
                            #{numStr}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {/* Visibility Toggle Icon Button */}
                        <button
                          type="button"
                          onClick={(e) => toggleProblemVisibility(problem, e)}
                          className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all cursor-pointer border ${problem.hidden
                              ? 'bg-slate-200/80 text-slate-400 border-slate-300 hover:bg-slate-300'
                              : 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 shadow-2xs'
                            }`}
                          title={problem.hidden ? '학생에게 숨김 상태 (클릭 시 공개)' : '학생에게 공개 중 (클릭 시 숨김)'}
                        >
                          {problem.hidden ? <EyeOff size={13} /> : <Eye size={13} />}
                        </button>

                        {/* Edit Icon Button */}
                        <button
                          onClick={() => startEdit(problem)}
                          className="w-7 h-7 rounded-xl bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white border border-indigo-200/80 hover:border-indigo-600 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                          title="문제 상세 수정"
                        >
                          <Pencil size={13} />
                        </button>

                        {/* Delete Icon Button */}
                        {deleteConfirm === problem.id ? (
                          <div className="flex items-center gap-1 animate-fade-up">
                            <button
                              onClick={() => handleDelete(problem.id)}
                              className="h-7 px-2 bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-black rounded-lg transition-colors cursor-pointer"
                            >
                              삭제
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="h-7 px-1.5 bg-slate-200 text-slate-700 text-[11px] font-bold rounded-lg cursor-pointer"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(problem.id)}
                            className="w-7 h-7 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-500 flex items-center justify-center transition-all cursor-pointer border border-rose-100"
                            title="문제 삭제"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Card Content: Emoji & Title */}
                    <div className="flex items-start gap-3 pt-1 pb-1 relative z-10">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50/80 text-2xl flex items-center justify-center border border-indigo-100/60 shrink-0 shadow-2xs group-hover:scale-105 transition-transform mt-0.5">
                        {problem.emoji}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-extrabold text-slate-800 text-sm leading-snug break-keep group-hover:text-indigo-600 transition-colors">
                          {problem.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* SECTION 2: 개념 퀴즈 문제 편집 목록 (가로 한 줄 배치 UI) */}
      {mainSectionTab === 'quiz' && (
        <div className="space-y-3">
          <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200/80 flex items-center justify-between text-xs text-amber-900 font-bold">
            <div className="flex items-center gap-2">
              <Info size={16} className="text-amber-600 shrink-0" />
              <span>개념 학습 후 풀게 되는 객관식 퀴즈 문항 목록입니다. (풀에서 무작위 10문항 자동 출제)</span>
            </div>
            <span className="text-amber-700 font-black bg-amber-100 px-2.5 py-0.5 rounded-full shrink-0">
              총 {quizQuestions.length}문항
            </span>
          </div>

          <div className="space-y-2">
            {quizQuestions.map((q, idx) => (
              <div
                key={q.id}
                className="bg-white border border-slate-200/80 hover:border-amber-400 rounded-2xl p-3.5 shadow-2xs hover:shadow-xs transition-all flex items-center justify-between gap-4"
              >
                {/* Left: Index badge & Horizontal Quiz Question title */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 font-black text-xs flex items-center justify-center shrink-0">
                    Q{idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-800 truncate">
                      {q.question}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                      정답: <span className="text-emerald-600 font-extrabold">{q.correctAnswer}</span>
                    </p>
                  </div>
                </div>

                {/* Right: Actions (Edit, Delete) */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => startQuizEdit(q)}
                    className="h-8 px-3 rounded-xl bg-amber-50 hover:bg-amber-500 text-amber-700 hover:text-white border border-amber-200 hover:border-amber-500 text-xs font-black transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Pencil size={13} />
                    <span>수정</span>
                  </button>

                  {deleteQuizConfirm === q.id ? (
                    <div className="flex items-center gap-1 animate-fade-up">
                      <button
                        onClick={() => handleQuizDelete(q.id)}
                        className="h-8 px-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-xl transition-colors cursor-pointer"
                      >
                        삭제
                      </button>
                      <button
                        onClick={() => setDeleteQuizConfirm(null)}
                        className="h-8 px-2 bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setDeleteQuizConfirm(q.id)}
                      className="w-8 h-8 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-500 flex items-center justify-center transition-all cursor-pointer border border-rose-100"
                      title="퀴즈 문제 삭제"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🚀 PROBLEM EDIT / ADD POPUP MODAL */}
      {/* ========================================================================= */}
      {showEditModal && editForm && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 bg-slate-900/80 backdrop-blur-md animate-fade-up">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] my-auto flex flex-col shadow-2xl overflow-hidden ring-1 ring-slate-900/10 animate-bounce-in">

            {/* Modal Header */}
            <div className="bg-slate-50 border-b border-slate-200 px-6 pt-5 pb-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{editForm.emoji || '📝'}</span>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
                    <span>{isAdding ? '➕ 새 실생활 문제 추가' : '✏️ 문제 콘텐츠 상세 수정'}</span>
                    {editForm.isTutorial && (
                      <span className="text-xs bg-purple-100 text-purple-700 font-extrabold px-2.5 py-0.5 rounded-md border border-purple-200">
                        🎓 튜토리얼
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium truncate max-w-md">
                    {editForm.title ? editForm.title : '새 문제를 작성해 주세요'} (ID: {editForm.id})
                  </p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            
            {/* Lego Builder UI */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1 text-slate-800">
              <label className="text-lg font-extrabold text-slate-800">순서도 뼈대 조립기 (Lego Builder)</label>
              
              <div className="flex gap-2">
                <button type="button" onClick={() => {
                  let newForm = {...editForm};
                  if(!newForm.skeleton) newForm.skeleton = [];
                  newForm.skeleton.push({ type: 'slot', id: 's' + Date.now() });
                  setEditForm(newForm);
                }} className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg shadow-sm text-sm font-bold hover:bg-indigo-200">+ 빈칸(Slot) 추가</button>
                
                <button type="button" onClick={() => {
                  let newForm = {...editForm};
                  if(!newForm.skeleton) newForm.skeleton = [];
                  newForm.skeleton.push({ type: 'arrow' });
                  setEditForm(newForm);
                }} className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg shadow-sm text-sm font-bold hover:bg-slate-300">+ 화살표 추가</button>
                
                <button type="button" onClick={() => {
                  let newForm = {...editForm};
                  if(!newForm.skeleton) newForm.skeleton = [];
                  newForm.skeleton.push({ 
                    type: 'split', leftLabel: 'Yes', rightLabel: 'No', 
                    left: [{type: 'arrow'}, {type:'slot', id: 's'+Date.now()+'_l'}, {type:'arrow'}], 
                    right: [{type: 'arrow'}, {type:'slot', id: 's'+Date.now()+'_r'}, {type:'arrow'}] 
                  });
                  setEditForm(newForm);
                }} className="px-4 py-2 bg-rose-100 text-rose-700 rounded-lg shadow-sm text-sm font-bold hover:bg-rose-200">+ 분기 추가</button>
                
                <button type="button" onClick={() => {
                  let newForm = {...editForm};
                  newForm.skeleton = [];
                  setEditForm(newForm);
                }} className="px-4 py-2 bg-red-100 text-red-700 rounded-lg shadow-sm text-sm font-bold hover:bg-red-200">초기화</button>
              </div>

              <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-xl min-h-[300px]">
                <h4 className="font-bold text-slate-700 mb-4 text-center">미리보기 (Preview)</h4>
                <div className="flex flex-col items-center">
                  {(()=>{
                    const renderSkel = (nodes) => {
                      if(!nodes) return null;
                      return nodes.map((n, i) => {
                        if(n.type === 'slot') return <div key={i} className="px-8 py-3 border-2 border-dashed border-indigo-400 bg-white rounded-lg my-1 font-bold text-indigo-500 min-w-[150px] text-center shadow-sm">빈칸 ({n.id})</div>;
                        if(n.type === 'arrow') return <div key={i} className="text-slate-400 my-1 font-black">↓</div>;
                        if(n.type === 'split') return (
                          <div key={i} className="flex w-full max-w-sm justify-center border-t-2 border-slate-300 pt-2 mt-2">
                            <div className="w-1/2 flex flex-col items-center border-r-2 border-slate-300 relative">
                              <span className="absolute -top-3 right-2 text-xs font-bold text-slate-500 bg-slate-50 px-1">{n.leftLabel}</span>
                              {renderSkel(n.left)}
                            </div>
                            <div className="w-1/2 flex flex-col items-center relative">
                              <span className="absolute -top-3 left-2 text-xs font-bold text-slate-500 bg-slate-50 px-1">{n.rightLabel}</span>
                              {renderSkel(n.right)}
                            </div>
                          </div>
                        );
                        return null;
                      });
                    };
                    return renderSkel(editForm.skeleton);
                  })()}
                </div>
              </div>
              
              <label className="text-xs font-extrabold text-slate-600 block mt-6">전체 JSON 데이터 (미세 조정 및 정답/보기 세팅용)</label>
              <textarea
                className="w-full h-[400px] font-mono text-xs p-4 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all"
                value={JSON.stringify(editForm, null, 2)}
                onChange={(e) => {
                  try {
                    setEditForm(JSON.parse(e.target.value));
                  } catch(err) {
                    // ignore invalid JSON while typing
                  }
                }}
              />
            </div>
            {/* Modal Footer */}
            <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={closeQuizModal}
                className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-200/80 text-slate-700 text-xs font-black transition-all cursor-pointer flex items-center gap-1.5"
              >
                <X size={16} /> 취소
              </button>

              <button
                type="button"
                onClick={handleQuizSave}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black transition-all cursor-pointer shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <Save size={16} />
                <span>퀴즈 저장하기</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Version History Management Modal */}
      {showVersionModal && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fade-up">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-bounce-in">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${mainSectionTab === 'quiz' ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'}`}>
                  <History size={18} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-800">
                    {mainSectionTab === 'quiz' ? '개념 퀴즈' : '실생활 문제'} 버전 관리 히스토리
                  </h3>
                  <p className="text-[11px] text-slate-400 font-bold">
                    DB에 저장된 시점별 스냅샷 목록을 확인하고 복원하거나 삭제할 수 있습니다.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowVersionModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-3 flex-1">
              {loadingVersions ? (
                <div className="py-12 text-center space-y-2">
                  <div className="w-7 h-7 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs font-bold text-slate-500">버전 기록을 불러오는 중...</p>
                </div>
              ) : versionList.length === 0 ? (
                <div className="py-12 text-center space-y-2 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-2xl">⏳</p>
                  <p className="text-xs font-black text-slate-600">저장된 버전 기록이 없습니다.</p>
                  <p className="text-[11px] text-slate-400">
                    상단의 <strong>[DB 저장]</strong> 버튼을 누르면 날짜와 시간이 자동 기록됩니다.
                  </p>
                </div>
              ) : (
                versionList.map((ver, idx) => (
                  <div
                    key={ver.id}
                    className="p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-3 transition-all"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${idx === 0 ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-slate-200 text-slate-600'}`}>
                          {idx === 0 ? '최신 버전' : `v_${ver.id.replace('v_', '')}`}
                        </span>
                        <span className="text-xs font-black text-slate-700">
                          {ver.dateStr || new Date(ver.timestamp).toLocaleString('ko-KR')}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-bold">
                        {mainSectionTab === 'quiz' ? `퀴즈 ${ver.count || ver.data?.length || 0}문항` : `문제 ${ver.count || ver.data?.length || 0}개`}
                        {ver.note && ` · ${ver.note}`}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleRestoreVersion(ver)}
                        className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white border border-indigo-200/80 hover:border-indigo-600 rounded-xl text-xs font-black transition-all cursor-pointer shadow-2xs"
                        title="이 버전 상태로 데이터 복원"
                      >
                        복원
                      </button>
                      <button
                        onClick={() => confirmDeleteVersion(ver)}
                        className="w-7 h-7 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-500 flex items-center justify-center transition-all cursor-pointer border border-rose-100"
                        title="이 버전 기록 영구 삭제"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center text-xs font-bold text-slate-400">
              <span>총 {versionList.length}개 버전 기록</span>
              <button
                onClick={() => setShowVersionModal(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-extrabold cursor-pointer transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Version Delete Confirmation Modal (추가 팝업 경고창: 복원 불가 안내) */}
      {deleteVersionConfirm && createPortal(
        <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-md animate-fade-up">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-rose-200 text-center space-y-4 animate-bounce-in">
            <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto text-2xl shadow-xs">
              <AlertTriangle size={28} />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-800 mb-1">버전 기록 영구 삭제</h3>
              <p className="text-xs text-rose-600 font-extrabold mb-1">
                ⚠️ 삭제된 버전 기록은 다시 복원할 수 없습니다!
              </p>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <strong>[{deleteVersionConfirm.dateStr}]</strong><br />
                {deleteVersionConfirm.note ? `로그: ${deleteVersionConfirm.note}` : '이 스냅샷'}을 영구히 삭제하시겠습니까?
              </p>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setDeleteVersionConfirm(null)}
                className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-xl text-xs transition-all cursor-pointer"
              >
                취소
              </button>
              <button
                onClick={executeDeleteVersion}
                className="flex-1 py-2.5 px-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl text-xs shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                영구 삭제
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirmModal && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fade-up">
          <div className="bg-white rounded-3xl p-7 max-w-sm w-full shadow-2xl border border-rose-100 text-center space-y-5 animate-bounce-in">
            <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto text-3xl shadow-xs">
              🔄
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800 mb-1.5">학습 데이터 전체 초기화</h3>
              <p className="text-xs text-slate-500 font-bold leading-relaxed">
                퀴즈 통과 기록, 튜토리얼 완료 상태, 풀어본 문제 목록이 모두 완전히 삭제되며 최초 접속 상태로 돌아갑니다.
              </p>
            </div>
            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setShowResetConfirmModal(false)}
                className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-2xl text-xs transition-all cursor-pointer"
              >
                취소
              </button>
              <button
                onClick={() => {
                  localStorage.clear();
                  sessionStorage.clear();
                  window.location.href = '/';
                }}
                className="flex-1 py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-2xl text-xs shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                초기화 실행
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Unsaved Changes Warning Modal (미저장 상태 이탈 경고 모달) */}
      {showUnsavedWarningModal && createPortal(
        <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-md animate-fade-up">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-amber-200 text-center space-y-4 animate-bounce-in">
            <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto text-2xl shadow-xs">
              <AlertTriangle size={28} />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-800 mb-1">저장되지 않은 변경사항</h3>
              <p className="text-xs text-amber-700 font-extrabold mb-1.5">
                문제 순서 또는 공개/숨김 상태 변경 내용이 아직 DB에 저장되지 않았습니다!
              </p>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed bg-amber-50/70 p-2.5 rounded-xl border border-amber-100">
                저장하지 않고 이동하면 변경된 순서 및 공개 상태가 <strong>초기화(유실)</strong>됩니다.
              </p>
            </div>
            <div className="flex flex-col gap-2 pt-1">
              <button
                onClick={handleSaveAndProceed}
                className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <CloudUpload size={14} />
                <span>DB 저장 후 이동</span>
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowUnsavedWarningModal(false);
                    setPendingAction(null);
                  }}
                  className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-extrabold rounded-xl text-xs transition-all cursor-pointer"
                >
                  취소 (머무르기)
                </button>
                <button
                  onClick={handleDiscardAndProceed}
                  className="flex-1 py-2.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-extrabold rounded-xl text-xs transition-all cursor-pointer"
                >
                  저장 안 함
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Floating Toast Notification (화면 상단 중앙 플로팅 토스트) */}
      {syncMsg && createPortal(
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[999999] animate-bounce-in">
          <div className={`px-5 py-3 rounded-2xl shadow-2xl text-xs font-black border flex items-center gap-2.5 backdrop-blur-md ${syncMsg.includes('✅')
              ? 'bg-emerald-600/95 text-white border-emerald-400'
              : syncMsg.includes('☁️')
                ? 'bg-amber-500/95 text-white border-amber-300'
                : 'bg-rose-600/95 text-white border-rose-400'
            }`}>
            <span>{syncMsg}</span>
            <button
              onClick={() => setSyncMsg('')}
              className="ml-1 hover:bg-white/20 rounded-full w-4 h-4 flex items-center justify-center text-[10px] cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
