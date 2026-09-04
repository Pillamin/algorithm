// src/App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/common/Header';
import Home from './pages/Home';
import Practice from './pages/Practice';
import Admin from './pages/Admin';
import Learn from './pages/Learn';
import { initialProblems } from './data/initialProblems';
import { initialQuizQuestions } from './data/initialQuizQuestions';
import { fetchProblems, saveProblem, fetchQuizQuestions } from './config/firebase';

const STORAGE_KEY = 'abstraction_completed';

import Footer from './components/common/Footer';

function AppContent({ problems, setProblems, quizQuestions, setQuizQuestions }) {
  const location = useLocation();
  const [soundOn, setSoundOn] = useState(true);
  const [entered, setEntered] = useState(false);
  const [completedIds, setCompletedIds] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    if (location.state?.showGrid) {
      setEntered(true);
    } else if (location.state?.resetHome) {
      setEntered(false);
    }
  }, [location.state]);

  const isPractice = location.pathname.startsWith('/practice');
  const isAdmin = location.pathname.startsWith('/admin');
  const showConceptBtn = !isAdmin && isPractice;

  function handleComplete(problemId) {
    setCompletedIds((prev) => {
      const next = new Set(prev);
      next.add(problemId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      return next;
    });
  }

  return (
    <div id="app-root" className="app-container h-screen w-screen flex flex-col bg-slate-50 overflow-hidden">
      <Header
        soundOn={soundOn}
        onToggleSound={() => setSoundOn((s) => !s)}
        completedCount={completedIds.has('problem_practice') ? completedIds.size - 1 : completedIds.size}
        totalCount={problems.filter((p) => !p.isTutorial && !p.hidden).length}
        showProgress={!isAdmin}
        showConceptBtn={showConceptBtn}
      />
      <main id="app-main" className="app-main flex-1 overflow-hidden relative">
        <Routes>
          <Route
            path="/"
            element={
              <div className="page-scroll-container h-full overflow-y-auto overflow-x-hidden">
                <Home
                  problems={problems}
                  completedIds={completedIds}
                  entered={entered}
                  setEntered={setEntered}
                />
              </div>
            }
          />
          <Route
            path="/learn"
            element={
              <div className="page-scroll-container h-full overflow-y-auto overflow-x-hidden">
                <Learn quizPool={quizQuestions} />
              </div>
            }
          />
          <Route
            path="/practice"
            element={
              <div className="page-scroll-container h-full overflow-y-auto overflow-x-hidden">
                <Home
                  problems={problems}
                  completedIds={completedIds}
                  entered={true}
                  setEntered={setEntered}
                />
              </div>
            }
          />
          <Route
            path="/practice/:id"
            element={
              <div className="page-scroll-container practice-scroll-container h-full overflow-y-auto overflow-x-hidden">
                <Practice
                  problems={problems}
                  completedIds={completedIds}
                  onComplete={handleComplete}
                  soundOn={soundOn}
                />
              </div>
            }
          />
          <Route
            path="/admin"
            element={
              <div className="page-scroll-container h-full overflow-y-auto overflow-x-hidden">
                <Admin
                  problems={problems}
                  onProblemsChange={setProblems}
                  quizQuestions={quizQuestions}
                  onQuizQuestionsChange={setQuizQuestions}
                />
              </div>
            }
          />
        </Routes>
      </main>
      {!location.pathname.startsWith('/practice/') && <Footer />}
    </div>
  );
}

function cleanProblemTitle(title) {
  if (!title || typeof title !== 'string') return title;
  // "[실습 문제 1] 순차 구조 - 스마트폰 주간 사용 시간 계산기" 또는 "순차 구조 - ..." 형식 정제
  return title.replace(/^(\[[^\]]+\]\s*)?([가-힣+]+(?:\s*구조)?)\s*[-–—]\s*/, '').trim();
}

function sanitizeProblemText(obj) {
  if (typeof obj === 'string') {
    return obj.replace(/최종 상태/g, '목표 상태').replace(/\[최종 상태\]/g, '[목표 상태]');
  }
  if (Array.isArray(obj)) {
    return obj.map(sanitizeProblemText);
  }
  if (obj && typeof obj === 'object') {
    const res = {};
    for (const key of Object.keys(obj)) {
      if (key === 'title' && typeof obj[key] === 'string') {
        res[key] = cleanProblemTitle(obj[key]);
      } else {
        res[key] = sanitizeProblemText(obj[key]);
      }
    }
    return res;
  }
  return obj;
}

export default function App() {
  const [problems, setProblems] = useState(() => {
    try {
      const saved = localStorage.getItem('flowchart_problems_v3');
      let loaded = saved ? JSON.parse(saved) : initialProblems;

      // Sync newly added problems from initialProblems
      initialProblems.forEach((initP) => {
        const existingIdx = loaded.findIndex((p) => p.id === initP.id);
        if (existingIdx === -1) {
          loaded.push(initP);
        } else {
          if (!loaded[existingIdx].skeleton || loaded[existingIdx].skeleton.length === 0) {
            loaded[existingIdx] = initP;
          } else if (['problem_01', 'problem_02', 'problem_03', 'problem_04'].includes(initP.id)) {
            // 기본 내장 문제의 경우 설명, 알고리즘, 블록 최신 텍스트 강제 동기화
            loaded[existingIdx].title = initP.title;
            loaded[existingIdx].description = initP.description;
            loaded[existingIdx].algorithm = initP.algorithm;
            loaded[existingIdx].initialState = initP.initialState;
            loaded[existingIdx].goalState = initP.goalState;
            loaded[existingIdx].ipo = initP.ipo;
            loaded[existingIdx].blocks = initP.blocks;
            loaded[existingIdx].skeleton = initP.skeleton;
            loaded[existingIdx].correctAnswers = initP.correctAnswers;
          }
        }
      });

      const res = sanitizeProblemText(loaded);
      try {
        localStorage.setItem('flowchart_problems_v3', JSON.stringify(res));
      } catch (_) {}
      return res;
    } catch {
      return sanitizeProblemText(initialProblems);
    }
  });

  const [quizQuestions, setQuizQuestions] = useState(() => {
    try {
      const saved = localStorage.getItem('custom_quiz_questions');
      return saved ? JSON.parse(saved) : initialQuizQuestions;
    } catch {
      return initialQuizQuestions;
    }
  });

  const handleProblemsChange = (newProblems) => {
    const sanitized = sanitizeProblemText(newProblems);
    setProblems(sanitized);
    try {
      localStorage.setItem('flowchart_problems_v3', JSON.stringify(sanitized));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  };

  const handleQuizQuestionsChange = (newQuizQuestions) => {
    setQuizQuestions(newQuizQuestions);
    try {
      localStorage.setItem('custom_quiz_questions', JSON.stringify(newQuizQuestions));
    } catch (e) {
      console.error('Failed to save quiz questions to localStorage:', e);
    }
  };

  useEffect(() => {
    // Try to load problems from Firebase; fall back to local data silently
    fetchProblems().then((remote) => {
      let merged = (remote && remote.length > 0) ? [...remote] : [...initialProblems];

      // Always sync all initialProblems (ensuring problem_01, problem_02, problem_03, problem_04 exist)
      initialProblems.forEach((initP) => {
        const idx = merged.findIndex((p) => p.id === initP.id);
        if (idx === -1) {
          merged.push(initP);
          try { saveProblem(initP); } catch (_) {}
        } else if (!merged[idx].skeleton || merged[idx].skeleton.length === 0) {
          merged[idx] = { ...merged[idx], ...initP };
          try { saveProblem(merged[idx]); } catch (_) {}
        } else if (['problem_01', 'problem_02', 'problem_03', 'problem_04'].includes(initP.id)) {
          // Firebase에 저장된 구버전 텍스트가 있을 경우 최신 텍스트로 갱신
          merged[idx] = {
            ...merged[idx],
            title: initP.title,
            description: initP.description,
            algorithm: initP.algorithm,
            initialState: initP.initialState,
            goalState: initP.goalState,
            ipo: initP.ipo,
            blocks: initP.blocks,
            skeleton: initP.skeleton,
            correctAnswers: initP.correctAnswers
          };
          try { saveProblem(merged[idx]); } catch (_) {}
        }
      });

      const tutorialProb = initialProblems.find((p) => p.isTutorial);
      const hasTutorial = merged.some((p) => p.id === 'problem_practice' || p.isTutorial);
      if (tutorialProb && !hasTutorial) {
        merged.unshift(tutorialProb);
      }
      
      const sanitized = sanitizeProblemText(merged);
      setProblems(sanitized);
      try {
        localStorage.setItem('flowchart_problems_v3', JSON.stringify(sanitized));
      } catch (e) {
        console.error(e);
      }
    }).catch(() => {
      // Offline fallback
    });

    // Try to load quiz questions from Firebase
    fetchQuizQuestions().then((remoteQuiz) => {
      if (remoteQuiz && remoteQuiz.length > 0) {
        setQuizQuestions(remoteQuiz);
        try {
          localStorage.setItem('custom_quiz_questions', JSON.stringify(remoteQuiz));
        } catch (e) {
          console.error(e);
        }
      }
    });
  }, []);

  return (
    <BrowserRouter>
      <AppContent
        problems={problems}
        setProblems={handleProblemsChange}
        quizQuestions={quizQuestions}
        setQuizQuestions={handleQuizQuestionsChange}
      />
    </BrowserRouter>
  );
}
