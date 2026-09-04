// src/components/common/ConceptIntroModal.jsx
// 개념 학습 슬라이드 6단계 팝업 모달

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Lightbulb } from 'lucide-react';

const STORY_STEPS = [
  {
    type: 'TYPE_1_ALGORITHM_DEF',
    badge: '1/6 단계',
    icon: '📜',
    title: '알고리즘이란?',
    definition: [
      '문제 해결의 방법을 단계적인 절차로 표현한 것',
      '어떤 문제를 해결하기 위한 동작들의 모임'
    ],
    bulletsTitle: '알고리즘의 중요성',
    bullets: [
      '정확한 결과 보장: 순서대로만 따라하면 누구나 똑같은 정답을 얻을 수 있습니다.',
      '시간/비용 절약: 불필요한 단계를 줄여 빠르고 효율적으로 문제를 해결합니다.',
      '쉬운 오류 수정: 단계별로 논리가 명확해 어디서 틀렸는지 쉽게 찾을 수 있습니다.'
    ],
    exampleTitle: '예시: 라면 끓이기',
    example: [
      '1. 물 끓이기',
      '2. 스프 넣기',
      '3. 면 넣기',
      '4. 3분 기다리기'
    ],
    highlight: '컴퓨터는 스스로 생각할 수 없으므로, 사람이 만든 구체적인 명령(알고리즘)이 꼭 필요합니다!'
  },
  {
    type: 'TYPE_2_ALGORITHM_CONDITIONS',
    badge: '2/6 단계',
    icon: '✅',
    title: '알고리즘의 특징(조건)',
    conditions: [
      { name: '입력', desc: '입력 유무와 처리할 데이터가 정해져 있어야 합니다.', icon: '📥', color: 'bg-blue-50 text-blue-700 border-blue-200' },
      { name: '출력', desc: '1개 이상의 결과(변화)가 반드시 나와야 합니다.', icon: '📤', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
      { name: '명확성', desc: '각 단계에서 무엇을 하는지 명확하게 표현해야 합니다.', icon: '🔍', color: 'bg-purple-50 text-purple-700 border-purple-200' },
      { name: '수행 가능성', desc: '각 명령은 논리적으로 수행 가능해야 합니다.', icon: '⚙️', color: 'bg-amber-50 text-amber-700 border-amber-200' },
      { name: '유한성', desc: '명령은 유한한 단계 내에 반드시 종료되어야 합니다.', icon: '⏳', color: 'bg-rose-50 text-rose-700 border-rose-200' },
    ],
    highlight: '이 5가지 조건을 모두 만족해야 올바른 알고리즘이라고 할 수 있습니다.'
  },
  {
    type: 'TYPE_3_ALGORITHM_EXPRESSION_1',
    badge: '3/6 단계',
    icon: '📝',
    title: '알고리즘 표현 방법',
    methods: [
      {
        name: '자연어',
        icon: '🗣️',
        color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        desc: [
          '특별한 규칙이나 지식 없이도 일상생활의 언어로 쉽게 표현할 수 있습니다.',
          '문법이나 순서가 조금 틀려도 사람이 의미를 쉽게 이해할 수 있습니다.',
          '단, 표현이 모호하거나 명확하지 않으면 다른 사람이 뜻을 오해하기 쉽습니다.'
        ],
        example: [
          '1. 국어, 영어, 수학 점수를 입력받는다.',
          '2. 세 과목의 점수를 모두 더해 총점을 구한다.',
          '3. 총점을 3으로 나누어 평균을 구한다.',
          '4. 평균 점수를 출력한다.'
        ]
      },
      {
        name: '의사 코드(흉내 코드)',
        icon: '💻',
        color: 'bg-purple-50 text-purple-700 border-purple-200',
        desc: [
          '프로그래밍 언어의 문법을 흉내 내어 나중에 코드로 옮기기 쉽게 작성합니다.',
          '논리적인 흐름을 한눈에 파악하기 좋고, If/then이나 연산 기호(←, +, /)를 주로 씁니다.',
          '규칙을 갖춘 흉내 코드일 뿐이므로 실제 컴퓨터에서 바로 실행되지는 않습니다.'
        ],
        example: [
          '입력: 국어, 영어, 수학',
          '총점 ← 국어 + 영어 + 수학',
          '평균 ← 총점 / 3',
          '출력: 평균'
        ]
      }
    ],
    highlight: '자연어 알고리즘은 표현하는 사람이나 단어 선택에 따라 조금씩 다를 수 있습니다.'
  },
  {
    type: 'TYPE_4_ALGORITHM_EXPRESSION_2',
    badge: '4/6 단계',
    icon: '📝',
    title: '알고리즘 표현 방법',
    methodName: '순서도(Flowchart)',
    desc: [
      '미리 약속된 정해진 기호를 사용하여 알고리즘의 흐름을 시각적으로 표현합니다.',
      '처리 순서와 논리적인 흐름을 한눈에 쉽게 파악할 수 있습니다.',
      '단, 정해진 기호와 작성 규칙을 미리 알고 있어야 이해할 수 있습니다.'
    ],
    symbols: [
      { name: '단말', icon: 'oval', desc: '순서도의 시작과 끝을 표시할 때 사용', color: 'bg-emerald-100 border-emerald-400' },
      { name: '입출력', icon: 'parallelogram', desc: '데이터의 입력과 출력에 사용', color: 'bg-amber-100 border-amber-400' },
      { name: '처리', icon: 'rectangle', desc: '데이터의 연산과 같은 처리에 사용', color: 'bg-cyan-100 border-cyan-400' },
      { name: '판단', icon: 'diamond', desc: '조건에 따른 비교, 판단에 사용', color: 'bg-rose-100 border-rose-400' },
      { name: '흐름선', icon: 'arrow', desc: '실행의 흐름을 나타낼 때 사용', color: 'bg-slate-100 border-slate-300' }
    ],
    flowchartExample: [
      { text: '시작', color: 'bg-emerald-100 border-emerald-400', shape: 'rounded-full' },
      { isArrow: true },
      { text: '국어, 영어, 수학 입력', color: 'bg-amber-100 border-amber-400', shape: '-skew-x-[15deg]' },
      { isArrow: true },
      { text: '총점 = 국어 + 영어 + 수학', color: 'bg-cyan-100 border-cyan-400', shape: 'rounded-none' },
      { isArrow: true },
      { text: '평균 = 총점 / 3', color: 'bg-cyan-100 border-cyan-400', shape: 'rounded-none' },
      { isArrow: true },
      { text: '평균 출력', color: 'bg-amber-100 border-amber-400', shape: '-skew-x-[15deg]' },
      { isArrow: true },
      { text: '끝', color: 'bg-emerald-100 border-emerald-400', shape: 'rounded-full' },
    ],
    highlight: '순서도를 이용하면 복잡한 처리 과정도 그림처럼 직관적으로 이해할 수 있습니다.'
  },
  {
    type: 'TYPE_5_ALGORITHM_STRUCTURES',
    badge: '5/6 단계',
    icon: '🔀',
    title: '알고리즘의 구조',
    structures: [
      {
        name: '순차 구조',
        desc: '처음부터 끝까지 차례대로 명령을 실행하는 구조',
        example: '수업 참여하기',
        image: '/structure_seq.png'
      },
      {
        name: '선택 구조',
        desc: '조건에 따라 처리 내용이나 순서가 달라지는 구조',
        example: '비 올 때 우산 챙기기',
        image: '/structure_sel.png'
      },
      {
        name: '반복 구조',
        desc: '조건을 만족할 때까지/만족하는 동안 특정 명령을 반복하여 실행하는 구조',
        example: '샴푸 거품 헹구기',
        image: '/structure_loop.png'
      }
    ],
    highlight: '모든 복잡한 알고리즘은 이 3가지 기본 구조(순차, 선택, 반복)의 조합으로 만들어집니다.'
  },
  {
    type: 'TYPE_6_ALGORITHM_ANALYSIS',
    badge: '6/6 단계',
    icon: '📊',
    title: '알고리즘 설계 및 성능 분석',
    designBullet: '똑같은 문제 상황에서도 다양한 알고리즘을 설계할 수 있습니다.',
    analysisBullets: [
      { num: 1, text: '원하는 결과가 정확하게 출력되는지 확인합니다.' },
      { num: 2, text: '알고리즘 구조가 단순하고 오류 수정이 쉬운지 확인합니다.' },
      { num: 3, text: '작업량과 수행 시간을 확인하고 비교합니다.' },
      { num: 4, text: '기억 장소의 사용량을 확인하고 비교합니다.' }
    ],
    highlight: '개념 학습 완료! 이제 문제를 직접 해결해봅시다.'
  }
];

export default function ConceptIntroModal({ isOpen, onClose }) {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setCurrentIdx(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const current = STORY_STEPS[currentIdx];

  function handleNext() {
    if (currentIdx < STORY_STEPS.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      onClose();
    }
  }

  function handlePrev() {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-up">
      {/* 팝업 창 규격: 데스크톱 780px x 600px, 모바일 반응형 */}
      <div className="card-bento responsive-concept-card w-full max-w-[780px] h-[600px] bg-white shadow-2xl p-6 relative overflow-hidden flex flex-col justify-between rounded-3xl border border-indigo-100">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="bg-indigo-100 text-indigo-700 text-xs font-extrabold px-3 py-1 rounded-full">
              {current.badge}
            </span>
            <span className="text-slate-400 text-xs font-semibold">
              개념 학습 슬라이드
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
              <span>{currentIdx + 1}</span>
              <span>/</span>
              <span>{STORY_STEPS.length}</span>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer p-1.5 rounded-xl hover:bg-slate-100"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Dynamic Card Content Area */}
        <div className="mt-1.5 mb-1 flex-1 flex flex-col justify-between overflow-y-auto custom-scrollbar pr-1 pb-2 animate-fade-up" key={currentIdx}>
          <div className="flex flex-col gap-1.5 h-full">
            <div className="flex flex-col gap-1">
              {current.type !== 'TYPE_6_ALGORITHM_ANALYSIS' && (
                <div className="mb-1 flex items-center gap-1.5">
                  <span className="text-lg sm:text-xl shrink-0">{current.icon}</span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight">
                    {current.title}
                  </h3>
                </div>
              )}

              {/* SLIDE 1: TYPE_1_ALGORITHM_DEF */}
              {current.type === 'TYPE_1_ALGORITHM_DEF' && (
                <div className="space-y-2 mb-2">
                  <div>
                    <div className="p-3 sm:p-4 rounded-2xl bg-indigo-50 border-2 border-indigo-200 shadow-sm flex flex-col justify-center gap-1.5 mb-4">
                      {current.definition.map((def, i) => (
                        <p key={i} className="text-[13px] sm:text-[15px] font-medium text-slate-800 leading-relaxed break-keep text-left">
                          {i + 1}. {def}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 items-stretch">
                    <div className="flex-[3] flex flex-col bg-white border border-slate-200 shadow-sm rounded-2xl p-3 sm:p-4">
                      <p className="text-sm sm:text-base font-bold text-slate-800 mb-2.5 text-left flex items-center gap-1.5">
                        <span className="text-base sm:text-lg">💡</span>
                        <span>{current.bulletsTitle}</span>
                      </p>
                      <div className="flex flex-col gap-2.5 flex-1 justify-center pl-1">
                        {current.bullets.map((b, i) => (
                          <div key={i} className="flex items-start gap-2 text-slate-700 font-medium text-[13px] sm:text-[14px]">
                            <span className="text-emerald-500 text-sm sm:text-base shrink-0 leading-tight mt-px">✔</span>
                            <span className="break-keep leading-snug flex-1">{b}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {current.example && (
                      <div className="flex-[1] flex flex-col bg-white border border-slate-200 shadow-sm rounded-2xl p-3 sm:p-4">
                        <p className="text-sm sm:text-base font-bold text-slate-800 mb-2.5 text-left flex items-center gap-1.5">
                          <span className="text-base sm:text-lg">🍜</span>
                          <span>{current.exampleTitle}</span>
                        </p>
                        <div className="flex-1 flex flex-col justify-center gap-2 pl-1">
                          {current.example.map((ex, i) => (
                            <p key={i} className="text-[12px] sm:text-[13px] font-medium text-slate-700 break-keep">
                              {ex}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SLIDE 2: TYPE_2_ALGORITHM_CONDITIONS */}
              {current.type === 'TYPE_2_ALGORITHM_CONDITIONS' && (
                <div className="space-y-2 mt-2 mb-auto py-0">
                  <div className="grid grid-cols-1 gap-2">
                    {current.conditions.map((cond, i) => (
                      <div key={i} className="py-2 px-4 rounded-2xl border border-slate-200 bg-white flex items-center gap-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
                        <span className="text-[14px] sm:text-[15px] font-bold w-24 shrink-0 text-center text-slate-800">{cond.name}</span>
                        <div className="w-px h-5 bg-slate-200 shrink-0"></div>
                        <p className="text-[13px] sm:text-[14px] font-medium text-slate-600 break-keep flex-1 pl-1">
                          {cond.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SLIDE 3: TYPE_3_ALGORITHM_EXPRESSION_1 */}
              {current.type === 'TYPE_3_ALGORITHM_EXPRESSION_1' && (
                <div className="space-y-2 mt-1 mb-auto py-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-stretch h-full">
                    {current.methods.map((method, i) => (
                      <div key={i} className="px-3.5 pt-2 pb-3 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between gap-3 transition-all hover:shadow-md h-full">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 shrink-0">
                          <span className="text-xl">{method.icon}</span>
                          <span className="text-[15px] sm:text-[16px] font-bold text-slate-800">{method.name}</span>
                        </div>

                        <div className="space-y-1.5 text-left flex-1 flex flex-col justify-center px-0.5">
                          {method.desc.map((d, j) => (
                            <div key={j} className="text-[12px] sm:text-[13px] font-medium text-slate-700 break-keep flex items-start gap-1.5 leading-snug">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0 mt-[6px]"></span>
                              <span className="flex-1">{d}</span>
                            </div>
                          ))}
                        </div>

                        <div className="bg-slate-50 border border-slate-200/70 p-3 rounded-xl text-left shrink-0">
                          <div className="flex items-center gap-1.5 pb-1.5 mb-2 border-b border-slate-200/70">
                            <span className="text-xs font-bold text-slate-700">
                              💡 평균 점수 구하기 예시
                            </span>
                          </div>
                          <div className="space-y-1">
                            {method.example.map((ex, j) => (
                              <p key={j} className="text-[11.5px] sm:text-[12.5px] font-medium text-slate-800 break-keep leading-tight font-mono">
                                {ex}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SLIDE 4: TYPE_4_ALGORITHM_EXPRESSION_2 */}
              {current.type === 'TYPE_4_ALGORITHM_EXPRESSION_2' && (
                <div className="space-y-2 mt-0.5 mb-auto py-0">
                  <div className="p-2.5 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col gap-1 transition-all hover:shadow-md">
                    <div className="flex items-center gap-1.5 pb-1 border-b border-slate-100">
                      <span className="text-lg">📊</span>
                      <span className="text-[14px] sm:text-[15px] font-bold text-slate-800">{current.methodName}</span>
                    </div>
                    <div className="space-y-0.5 text-left px-0.5">
                      {current.desc.map((d, j) => (
                        <div key={j} className="text-[11.5px] sm:text-[12.5px] font-medium text-slate-700 break-keep flex items-start gap-1.5 leading-snug">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0 mt-[5.5px]"></span>
                          <span className="flex-1">{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 items-stretch">
                    <div className="flex-[1.4] rounded-2xl border border-slate-200 bg-white shadow-sm overflow-x-auto text-left flex flex-col justify-between custom-scrollbar">
                      <table className="w-full min-w-[280px] border-collapse text-left flex-1">
                        <thead>
                          <tr className="bg-slate-50/50 border-b border-slate-200/60 text-[10.5px] font-bold text-slate-600">
                            <th className="py-1 px-2 w-[22%] text-center">기호</th>
                            <th className="py-1 px-2 w-[24%] text-center">도형</th>
                            <th className="py-1 px-2.5 flex-1 text-center">의미</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {current.symbols.map((sym, i) => (
                            <tr key={i} className="hover:bg-slate-50/40 transition-colors">
                              <td className="py-1 px-2 text-center border-r border-slate-100">
                                <span className="text-[11px] sm:text-xs font-bold text-slate-800">
                                  {sym.name}
                                </span>
                              </td>
                              <td className="py-1 px-2 text-center border-r border-slate-100">
                                <div className="flex items-center justify-center">
                                  {sym.icon === 'oval' && (
                                    <div className={`w-8 h-4 rounded-full border-2 ${sym.color} shadow-2xs`} />
                                  )}
                                  {sym.icon === 'parallelogram' && (
                                    <div className={`w-8 h-4 border-2 ${sym.color} shadow-2xs -skew-x-[20deg]`} />
                                  )}
                                  {sym.icon === 'rectangle' && (
                                    <div className={`w-8 h-4 border-2 ${sym.color} shadow-2xs rounded-none`} />
                                  )}
                                  {sym.icon === 'diamond' && (
                                    <div className="w-4 h-4 flex items-center justify-center">
                                      <div className={`w-3.5 h-3.5 border-2 ${sym.color} shadow-2xs rotate-45 transform`} />
                                    </div>
                                  )}
                                  {sym.icon === 'arrow' && (
                                    <svg className="w-5 h-2.5 text-slate-700" viewBox="0 0 32 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                      <line x1="2" y1="8" x2="28" y2="8" />
                                      <polyline points="22 2 28 8 22 14" fill="none" />
                                    </svg>
                                  )}
                                </div>
                              </td>
                              <td className="py-1 px-2.5">
                                <span className="text-[10.5px] sm:text-[11px] font-medium text-slate-700 break-keep leading-tight block">
                                  {sym.desc}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="w-full sm:w-[210px] shrink-0 p-2 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between">
                      <div className="flex items-center justify-center gap-1 pb-1 mb-1 border-b border-slate-100 shrink-0">
                        <span className="text-xs font-bold text-slate-700">💡 평균 점수 구하기 예시</span>
                      </div>
                      <div className="flex flex-col items-center justify-center flex-1 gap-[1px] bg-slate-50 border border-slate-200/60 p-1.5 rounded-xl">
                        {current.flowchartExample.map((node, i) => {
                          if (node.isArrow) {
                            return (
                              <svg key={i} className="w-3 h-2 text-slate-600 my-0" viewBox="0 0 16 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="8" y1="2" x2="8" y2="16" />
                                <polyline points="3 11 8 16 13 11" fill="none" />
                              </svg>
                            );
                          }
                          return (
                            <div key={i} className={`flex items-center justify-center font-bold text-[9px] sm:text-[9.5px] text-slate-800 py-0.5 px-2 border-2 ${node.color} shadow-xs whitespace-nowrap ${node.shape}`}>
                              <span style={node.shape.includes('skew') ? { transform: 'skewX(15deg)' } : {}}>{node.text}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SLIDE 5: TYPE_5_ALGORITHM_STRUCTURES */}
              {current.type === 'TYPE_5_ALGORITHM_STRUCTURES' && (
                <div className="space-y-2 mt-0.5 mb-auto py-0">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-stretch">
                    {current.structures.map((st, i) => (
                      <div key={i} className="px-3.5 pt-2 pb-3 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between gap-2.5 transition-all hover:shadow-md text-left">
                        <div className="space-y-1.5">
                          <div className="flex items-center pb-1.5 border-b border-slate-100">
                            <span className="text-[15px] sm:text-[16px] font-bold text-slate-800">
                              {st.name}
                            </span>
                          </div>
                          <p className="text-[12px] sm:text-[12.5px] font-medium text-slate-700 break-keep leading-snug min-h-[48px]">
                            {st.desc}
                          </p>
                        </div>

                        <div className="bg-slate-50 border border-slate-200/70 p-2 rounded-xl flex items-center justify-center h-[180px] shrink-0 overflow-hidden">
                          <img
                            src={st.image}
                            alt={`${st.name} 순서도`}
                            className="max-h-full max-w-full object-contain drop-shadow-xs"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SLIDE 6: TYPE_6_ALGORITHM_ANALYSIS */}
              {current.type === 'TYPE_6_ALGORITHM_ANALYSIS' && (
                <div className="space-y-3 mt-0.5 mb-auto py-0 text-left">
                  <div className="flex flex-col gap-1.5">
                    <div className="mb-1 flex items-center gap-1.5">
                      <span className="text-lg sm:text-xl shrink-0">📝</span>
                      <h3 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight">
                        알고리즘 설계
                      </h3>
                    </div>
                    <div className="p-3 sm:p-4 rounded-2xl border border-slate-200 bg-white shadow-sm flex items-start">
                      <p className="text-[13px] sm:text-[14px] font-medium text-slate-800 break-keep leading-snug">
                        {current.designBullet}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 mt-2">
                    <div className="mb-1 flex items-center gap-1.5">
                      <span className="text-lg sm:text-xl shrink-0">⚖️</span>
                      <h3 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight">
                        알고리즘 효율 및 성능 분석
                      </h3>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 items-stretch">
                      <div className="flex-[1.2] p-3 sm:p-4 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col">
                        <p className="text-sm font-bold text-slate-800 pb-2 mb-2 border-b border-slate-100">성능 분석 기준</p>
                        <div className="flex flex-col gap-2 flex-1">
                          {current.analysisBullets.map((b, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <span className="text-emerald-500 font-bold shrink-0 leading-tight">✔</span>
                              <p className="text-[13px] sm:text-[14px] font-medium text-slate-800 break-keep leading-snug">
                                {b.text}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex-[1] p-3 sm:p-4 rounded-2xl border border-slate-200 bg-slate-50/50 shadow-sm flex flex-col">
                        <p className="text-sm font-bold text-slate-800 pb-2 mb-2 border-b border-slate-100 flex items-center gap-1.5">
                          <span className="text-base">💡</span>
                          <span>실생활 예시 (집 → 학교)</span>
                        </p>
                        <div className="flex flex-col gap-2 flex-1">
                          {[
                            "학교에 정확하게 도착하는가?",
                            "가는 길이 복잡한 골목은 아닌가?",
                            "가는데 걸리는 시간은 얼마인가?",
                            "가는데 쓰는 비용(체력/차비)은 얼마인가?"
                          ].map((text, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0 mt-[6px]" />
                              <p className="text-[12.5px] sm:text-[13px] text-slate-700 break-keep font-medium leading-snug">
                                {text}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Highlight */}
          {current.highlight && (
            <div className="flex flex-col gap-1.5 mt-3 shrink-0">
              <div className="py-2.5 px-3.5 bg-amber-50 border border-amber-300 rounded-xl text-xs sm:text-[13px] text-amber-950 font-medium leading-snug flex items-center gap-2.5 break-keep shadow-2xs">
                <Lightbulb size={18} className="text-amber-500 shrink-0" />
                <span>{current.highlight}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-3.5 shrink-0">
          <div className="flex gap-2">
            {STORY_STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-2.5 rounded-full transition-all ${
                  i === currentIdx ? 'bg-indigo-600 w-7' : 'bg-slate-200 w-2.5'
                }`}
              />
            ))}
          </div>

          <div className="flex gap-2.5">
            {currentIdx > 0 && (
              <button
                onClick={handlePrev}
                className="btn-secondary text-xs sm:text-sm py-2 px-4 inline-flex items-center justify-center gap-1.5 cursor-pointer font-bold leading-none"
              >
                <ChevronLeft size={16} />
                <span>이전</span>
              </button>
            )}
            <button
              onClick={handleNext}
              className="btn-primary text-xs sm:text-sm py-2 px-6 inline-flex items-center justify-center gap-1.5 cursor-pointer font-extrabold leading-none"
            >
              {currentIdx < STORY_STEPS.length - 1 ? (
                <>
                  <span>다음 개념</span>
                  <ChevronRight size={16} />
                </>
              ) : (
                <>
                  <span>닫기</span>
                  <X size={16} />
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
