import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Lightbulb,
  CheckCircle2,
  XCircle,
  Trophy,
  RotateCcw,
  BookOpen,
  HelpCircle,
  ArrowRight,
  Check,
  X
} from 'lucide-react';

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
      {
        num: 1,
        text: '원하는 결과가 정확하게 출력되는지 확인합니다.',
        sub: null
      },
      {
        num: 2,
        text: '알고리즘 구조가 단순하고 오류 수정이 쉬운지 확인합니다.',
        sub: null
      },
      {
        num: 3,
        text: '작업량과 수행 시간을 확인하고 비교합니다.',
        sub: null
      },
      {
        num: 4,
        text: '기억 장소의 사용량을 확인하고 비교합니다.',
        sub: null
      }
    ],
    highlight: '개념 학습 완료! 이제 퀴즈 15문항을 풀어봅시다.'
  }
];

const RAW_QUIZ_QUESTIONS = [
  {
    "id": 1,
    "options": [
      "어떤 문제를 해결하기 위해 거쳐야 하는 명확한 과정이나 명령어들의 집합",
      "컴퓨터 화면을 예쁘게 꾸미기 위한 디자인 작업",
      "문제를 해결하지 않고 복잡하게 만드는 방법",
      "컴퓨터 내부의 부품을 조립하는 과정"
    ],
    "adminKey": "comedu2026",
    "explanation": "[개념 슬라이드 1/7] 알고리즘은 라면을 끓이는 순서처럼 어떤 문제를 해결하기 위해 거쳐야 하는 명확한 과정이나 명령어들의 집합입니다.",
    "correctAnswer": "어떤 문제를 해결하기 위해 거쳐야 하는 명확한 과정이나 명령어들의 집합",
    "question": "알고리즘(Algorithm)에 대한 가장 올바른 정의는 무엇인가요?",
    "deleted": false
  },
  {
    "id": 10,
    "correctAnswer": "순서도",
    "explanation": "[개념 슬라이드 4/7] 순서도는 약속된 표준 기호(도형)와 선을 이용해 알고리즘의 전체 흐름을 시각적으로 명확히 표현하는 방법입니다.",
    "question": "약속된 기호와 도형, 그리고 선을 사용하여 알고리즘의 흐름을 한눈에 파악하기 쉽게 나타내는 방법은?",
    "options": [
      "순서도",
      "자연어",
      "시 모음집",
      "소설"
    ],
    "deleted": false,
    "adminKey": "comedu2026"
  },
  {
    "id": 11,
    "adminKey": "comedu2026",
    "correctAnswer": "양 옆이 둥근 사각형(타원)",
    "explanation": "[개념 슬라이드 4/7] 양 옆이 둥근 사각형(타원) 기호는 알고리즘이 시작되는 곳과 끝나는 곳을 표시하는 단자 기호입니다.",
    "options": [
      "양 옆이 둥근 사각형(타원)",
      "평행사변형",
      "직사각형",
      "마름모"
    ],
    "deleted": false,
    "question": "순서도 기호 중 '알고리즘의 시작과 끝(단자)'을 나타낼 때 사용하는 도형의 모양은?"
  },
  {
    "id": 12,
    "question": "순서도에서 '데이터의 입력과 결과의 출력'을 나타낼 때 사용하는 도형의 모양은?",
    "deleted": false,
    "correctAnswer": "평행사변형",
    "adminKey": "comedu2026",
    "explanation": "[개념 슬라이드 4/7] 평행사변형 기호는 데이터를 읽어들이거나 계산 결과를 출력할 때 사용합니다.",
    "options": [
      "평행사변형",
      "타원",
      "마름모",
      "화살표"
    ]
  },
  {
    "id": 13,
    "question": "순서도에서 데이터의 계산 등 '명령의 처리'를 나타낼 때 사용하는 도형의 모양은?",
    "explanation": "[개념 슬라이드 4/7] 직사각형 기호는 값의 대입이나 덧셈 등 데이터 연산 처리를 할 때 사용합니다.",
    "options": [
      "직사각형",
      "마름모",
      "타원",
      "평행사변형"
    ],
    "adminKey": "comedu2026",
    "deleted": false,
    "correctAnswer": "직사각형"
  },
  {
    "id": 14,
    "correctAnswer": "마름모",
    "question": "순서도 기호 중 조건식을 확인하고 '참(Yes)/거짓(No)을 판단'할 때 사용하는 도형은?",
    "options": [
      "마름모",
      "직사각형",
      "평행사변형",
      "타원"
    ],
    "explanation": "[개념 슬라이드 4/7] 마름모 기호 안에는 조건을 적으며, 결과에 따라 실행할 다음 명령의 방향이 나뉩니다.",
    "deleted": false,
    "adminKey": "comedu2026"
  },
  {
    "id": 15,
    "question": "순서도에서 명령이 실행되는 '방향과 순서'를 나타내는 기호는?",
    "options": [
      "화살표(흐름선)",
      "타원",
      "직사각형",
      "마름모"
    ],
    "correctAnswer": "화살표(흐름선)",
    "deleted": false,
    "adminKey": "comedu2026",
    "explanation": "[개념 슬라이드 4/7] 화살표(흐름선)는 기호들을 서로 연결하여 알고리즘이 진행되는 방향을 보여줍니다."
  },
  {
    "id": 16,
    "adminKey": "comedu2026",
    "deleted": false,
    "correctAnswer": "순차 구조",
    "options": [
      "순차 구조",
      "선택 구조",
      "반복 구조",
      "혼합 구조"
    ],
    "question": "알고리즘의 제어 구조 중, 조건이나 반복 없이 명령을 위에서 아래로 차례대로 실행하는 구조는?",
    "explanation": "[개념 슬라이드 5/7] '순차 구조'는 가장 기본적인 알고리즘 구조로, 작성된 순서대로 하나씩 명령을 실행합니다."
  },
  {
    "id": 17,
    "question": "주어진 조건이 참인지 거짓인지에 따라 각각 다른 명령을 실행하게 만드는 구조는?",
    "options": [
      "선택 구조",
      "순차 구조",
      "반복 구조",
      "단순 구조"
    ],
    "explanation": "[개념 슬라이드 5/7] '선택 구조'는 조건식을 만족하는지 여부에 따라 알고리즘의 흐름이 여러 갈래로 나뉘는 구조입니다.",
    "adminKey": "comedu2026",
    "correctAnswer": "선택 구조",
    "deleted": false
  },
  {
    "id": 18,
    "options": [
      "반복 구조",
      "선택 구조",
      "순차 구조",
      "조건 구조"
    ],
    "question": "특정한 조건을 만족하는 동안 동일한 명령이나 과정을 계속해서 되풀이 실행하는 구조는?",
    "explanation": "[개념 슬라이드 5/7] '반복 구조'는 일정 조건을 만족할 때까지 똑같은 작업을 반복하여 실행하는 효율적인 구조입니다.",
    "correctAnswer": "반복 구조",
    "adminKey": "comedu2026",
    "deleted": false
  },
  {
    "id": 19,
    "correctAnswer": "모니터 화면의 해상도가 얼마나 높은가?",
    "deleted": false,
    "question": "알고리즘을 평가(성능 분석)할 때 고려하는 기준으로 올바르지 않은 것은?",
    "explanation": "[개념 슬라이드 6/7] 알고리즘 분석 시에는 디자인이나 모니터 사양이 아니라 결과의 정확성, 시간, 메모리 효율성 등을 기준으로 삼습니다.",
    "adminKey": "comedu2026",
    "options": [
      "모니터 화면의 해상도가 얼마나 높은가?",
      "원하는 결과가 정확하게 출력되는가?",
      "작업량과 수행 시간은 얼마나 짧은가?",
      "기억 장소(메모리)의 사용량은 효율적인가?"
    ]
  },
  {
    "id": 2,
    "adminKey": "comedu2026",
    "correctAnswer": "무한성 (끝없이 계속 실행되어야 한다)",
    "deleted": false,
    "explanation": "[개념 슬라이드 2/7] 알고리즘은 유한한 단계 내에 반드시 종료되어야 하는 '유한성'을 가져야 하며, 무한히 실행되면 안 됩니다.",
    "options": [
      "무한성 (끝없이 계속 실행되어야 한다)",
      "입력 (입력 유무와 처리할 데이터가 정해져 있어야 한다)",
      "출력 (1개 이상의 결과가 반드시 나와야 한다)",
      "명확성 (각 단계에서 무엇을 하는지 분명해야 한다)"
    ],
    "question": "올바른 알고리즘이 되기 위해 반드시 갖추어야 할 5가지 조건에 해당하지 않는 것은 무엇인가요?"
  },
  {
    "id": 3,
    "question": "알고리즘의 조건 중, '입력 유무와 처리할 데이터가 정해져 있어야 한다'는 조건은 무엇인가요?",
    "options": [
      "입력",
      "명확성",
      "수행 가능성",
      "출력"
    ],
    "explanation": "[개념 슬라이드 2/7] '입력' 조건은 알고리즘 시작 시 외부에서 주어지는 데이터나 환경이 정의되어 있어야 함을 의미합니다.",
    "correctAnswer": "입력",
    "adminKey": "comedu2026",
    "deleted": false
  },
  {
    "id": 4,
    "adminKey": "comedu2026",
    "explanation": "[개념 슬라이드 2/7] 모든 알고리즘은 문제를 해결한 뒤 반드시 하나 이상의 결과(출력)를 도출해야 합니다.",
    "options": [
      "출력",
      "입력",
      "유한성",
      "무한성"
    ],
    "deleted": false,
    "question": "알고리즘이 성공적으로 끝났다면, 1개 이상의 결과(변화)가 반드시 나와야 합니다. 이 조건의 이름은 무엇인가요?",
    "correctAnswer": "출력"
  },
  {
    "id": 5,
    "deleted": false,
    "adminKey": "comedu2026",
    "explanation": "[개념 슬라이드 2/7] '명확성'은 각 단계에서 무엇을 하는지 명확하게 표현하여 오해가 없도록 해야 한다는 조건입니다.",
    "question": "알고리즘을 이루는 각각의 명령이 모호하지 않고 누구나 똑같이 이해할 수 있어야 한다는 조건은?",
    "options": [
      "명확성",
      "수행 가능성",
      "유한성",
      "입력"
    ],
    "correctAnswer": "명확성"
  },
  {
    "id": 6,
    "deleted": false,
    "question": "알고리즘의 각 명령은 논리적으로 실행할 수 있는 것이어야 합니다. 다음 중 이 조건을 뜻하는 것은?",
    "correctAnswer": "수행 가능성",
    "explanation": "[개념 슬라이드 2/7] '수행 가능성'은 컴퓨터나 사람이 실제로 실행하고 처리할 수 있는 논리적인 명령이어야 함을 뜻합니다.",
    "options": [
      "수행 가능성",
      "명확성",
      "유한성",
      "출력"
    ],
    "adminKey": "comedu2026"
  },
  {
    "id": 7,
    "question": "알고리즘이 언젠가는 반드시 끝이 나야 한다는 조건은 무엇인가요?",
    "options": [
      "유한성",
      "무한성",
      "명확성",
      "수행 가능성"
    ],
    "correctAnswer": "유한성",
    "explanation": "[개념 슬라이드 2/7] '유한성'은 명령이 일정한 단계나 시간 내에 반드시 종료되어 무한 반복에 빠지지 않아야 함을 의미합니다.",
    "deleted": false,
    "adminKey": "comedu2026"
  },
  {
    "id": 8,
    "deleted": false,
    "explanation": "[개념 슬라이드 3/7] 자연어는 우리가 평소에 쓰는 말과 글로 알고리즘을 쉽게 표현하는 방식입니다.",
    "question": "특별한 규칙이나 전문 지식 없이도 일상생활의 언어로 쉽게 알고리즘을 표현하는 방법은?",
    "correctAnswer": "자연어",
    "options": [
      "자연어",
      "순서도",
      "프로그래밍 언어",
      "이진 코드"
    ],
    "adminKey": "comedu2026"
  },
  {
    "id": 9,
    "explanation": "[개념 슬라이드 3/7] 자연어는 누구나 쉽게 쓸 수 있지만, 단어 선택에 따라 표현이 모호해져 오해를 부를 수 있다는 단점이 있습니다.",
    "correctAnswer": "표현이 모호해지면 다른 사람이 뜻을 오해하기 쉽다.",
    "deleted": false,
    "adminKey": "comedu2026",
    "question": "자연어로 알고리즘을 표현할 때의 단점으로 가장 올바른 것은?",
    "options": [
      "표현이 모호해지면 다른 사람이 뜻을 오해하기 쉽다.",
      "프로그래머만 작성할 수 있다.",
      "반드시 컴퓨터가 있어야만 작성할 수 있다.",
      "그림이나 기호를 외워야 해서 어렵다."
    ]
  },
  {
    "id": 20,
    "question": "순서도에서 '단말 기호'를 사용하는 때는 언제인가요?",
    "options": [
      "알고리즘이 시작할 때와 끝날 때",
      "조건을 판단할 때",
      "데이터를 입력받을 때",
      "계산을 수행할 때"
    ],
    "correctAnswer": "알고리즘이 시작할 때와 끝날 때",
    "explanation": "[개념 슬라이드 4/7] 단말 기호는 알고리즘의 시작과 끝을 명확히 표시하기 위해 사용됩니다.",
    "adminKey": "comedu2026",
    "deleted": false
  },
  {
    "id": 21,
    "question": "순서도에서 '입력/출력 기호'를 사용하는 때는 언제인가요?",
    "options": [
      "데이터를 읽어들이거나 결과를 출력할 때",
      "알고리즘을 시작할 때",
      "참/거짓을 나눌 때",
      "연산을 수행할 때"
    ],
    "correctAnswer": "데이터를 읽어들이거나 결과를 출력할 때",
    "explanation": "[개념 슬라이드 4/7] 입출력 기호는 외부로부터 데이터를 받거나 처리된 최종 결과를 보여줄 때 사용합니다.",
    "adminKey": "comedu2026",
    "deleted": false
  },
  {
    "id": 22,
    "question": "순서도에서 '처리 기호'를 사용하는 때는 언제인가요?",
    "options": [
      "데이터의 연산이나 값의 대입 등 명령을 실행할 때",
      "결과를 화면에 출력할 때",
      "조건에 따라 흐름을 나눌 때",
      "알고리즘을 종료할 때"
    ],
    "correctAnswer": "데이터의 연산이나 값의 대입 등 명령을 실행할 때",
    "explanation": "[개념 슬라이드 4/7] 처리 기호는 데이터 연산, 변수 값 저장 등 실제 계산 작업이 일어날 때 사용합니다.",
    "adminKey": "comedu2026",
    "deleted": false
  },
  {
    "id": 23,
    "question": "순서도에서 '판단 기호'를 사용하는 때는 언제인가요?",
    "options": [
      "조건식을 확인하고 참(Yes)/거짓(No)에 따라 흐름을 나눌 때",
      "알고리즘의 흐름선을 연결할 때",
      "결과값을 출력할 때",
      "명령을 차례대로 수행할 때"
    ],
    "correctAnswer": "조건식을 확인하고 참(Yes)/거짓(No)에 따라 흐름을 나눌 때",
    "explanation": "[개념 슬라이드 4/7] 판단 기호 안에는 조건을 적고, 조건을 만족하는지 여부에 따라 실행 경로를 선택합니다.",
    "adminKey": "comedu2026",
    "deleted": false
  },
  {
    "id": 24,
    "question": "순서도에서 '양 옆이 둥근 사각형(타원)' 도형이 의미하는 기호는 무엇인가요?",
    "options": [
      "단말 기호(시작/끝)",
      "입출력 기호",
      "처리 기호",
      "판단 기호"
    ],
    "correctAnswer": "단말 기호(시작/끝)",
    "explanation": "[개념 슬라이드 4/7] 양 옆이 둥근 사각형(타원)은 처음 시작과 마지막 종료를 뜻하는 단말 기호입니다.",
    "adminKey": "comedu2026",
    "deleted": false
  },
  {
    "id": 25,
    "question": "순서도에서 '평행사변형' 도형이 의미하는 기호는 무엇인가요?",
    "options": [
      "입출력 기호",
      "처리 기호",
      "단말 기호",
      "판단 기호"
    ],
    "correctAnswer": "입출력 기호",
    "explanation": "[개념 슬라이드 4/7] 평행사변형 도형은 자료의 입력과 결과의 출력을 담당하는 기호입니다.",
    "adminKey": "comedu2026",
    "deleted": false
  },
  {
    "id": 26,
    "question": "순서도에서 '직사각형' 도형이 의미하는 기호는 무엇인가요?",
    "options": [
      "처리 기호",
      "입출력 기호",
      "단말 기호",
      "판단 기호"
    ],
    "correctAnswer": "처리 기호",
    "explanation": "[개념 슬라이드 4/7] 직사각형 도형은 연산이나 명령의 처리를 나타내는 기호입니다.",
    "adminKey": "comedu2026",
    "deleted": false
  },
  {
    "id": 27,
    "question": "순서도에서 '마름모' 도형이 의미하는 기호는 무엇인가요?",
    "options": [
      "판단 기호",
      "처리 기호",
      "입출력 기호",
      "단말 기호"
    ],
    "correctAnswer": "판단 기호",
    "explanation": "[개념 슬라이드 4/7] 마름모 도형은 조건을 따져서 진행 방향을 결정하는 판단 기호입니다.",
    "adminKey": "comedu2026",
    "deleted": false
  },
  {
    "id": 28,
    "question": "순서도의 시작과 끝을 나타내는 '단말 기호'의 도형은 무엇인가요?",
    "options": [
      "양 옆이 둥근 사각형(타원)",
      "마름모",
      "직사각형",
      "평행사변형"
    ],
    "correctAnswer": "양 옆이 둥근 사각형(타원)",
    "explanation": "[개념 슬라이드 4/7] 단말 기호는 양 옆이 둥근 사각형(타원) 모양으로 그립니다.",
    "adminKey": "comedu2026",
    "deleted": false
  },
  {
    "id": 29,
    "question": "데이터 입력과 출력을 나타내는 '입출력 기호'의 도형은 무엇인가요?",
    "options": [
      "평행사변형",
      "마름모",
      "직사각형",
      "양 옆이 둥근 사각형(타원)"
    ],
    "correctAnswer": "평행사변형",
    "explanation": "[개념 슬라이드 4/7] 입출력 기호는 평행사변형 모양으로 그립니다.",
    "adminKey": "comedu2026",
    "deleted": false
  },
  {
    "id": 30,
    "question": "데이터 계산 및 처리를 나타내는 '처리 기호'의 도형은 무엇인가요?",
    "options": [
      "직사각형",
      "평행사변형",
      "마름모",
      "양 옆이 둥근 사각형(타원)"
    ],
    "correctAnswer": "직사각형",
    "explanation": "[개념 슬라이드 4/7] 처리 기호는 직사각형 모양으로 그립니다.",
    "adminKey": "comedu2026",
    "deleted": false
  },
  {
    "id": 31,
    "question": "조건을 검사하여 분기하는 '판단 기호'의 도형은 무엇인가요?",
    "options": [
      "마름모",
      "평행사변형",
      "직사각형",
      "양 옆이 둥근 사각형(타원)"
    ],
    "correctAnswer": "마름모",
    "explanation": "[개념 슬라이드 4/7] 판단 기호는 마름모 모양으로 그립니다.",
    "adminKey": "comedu2026",
    "deleted": false
  }
];

// Fisher-Yates shuffle
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function Learn({ quizPool }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Mode: 'SLIDES' | 'QUIZ' | 'RESULT'
  const [mode, setMode] = useState(() => (location.state?.mode === 'QUIZ' ? 'QUIZ' : 'SLIDES'));
  const [slideIdx, setSlideIdx] = useState(0);

  // Quiz state
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizIdx, setQuizIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { qIndex: selectedOptionString }

  // State for explanation modal
  const [selectedDetailQuestion, setSelectedDetailQuestion] = useState(null);

  // Generate randomized quiz
  function startQuiz() {
    const questionsToUse = (Array.isArray(quizPool) && quizPool.length > 0) ? quizPool : RAW_QUIZ_QUESTIONS;
    const selected15 = shuffleArray(questionsToUse).slice(0, 15);
    const shuffledQuestions = selected15.map((q) => {
      const shuffledOptions = shuffleArray(q.options);
      return {
        ...q,
        options: shuffledOptions
      };
    });
    setQuizQuestions(shuffledQuestions);
    setQuizIdx(0);
    setUserAnswers({});
    setMode('QUIZ');
  }

  // Handle route mode changes
  useEffect(() => {
    if (location.state?.mode === 'QUIZ') {
      startQuiz();
    } else if (location.state?.mode === 'SLIDES') {
      setMode('SLIDES');
      setSlideIdx(0);
    }
  }, [location.state]);

  // Initial load for quiz mode if directly accessed
  useEffect(() => {
    if (mode === 'QUIZ' && quizQuestions.length === 0) {
      startQuiz();
    }
  }, [mode]);

  // Mark conceptual learn as completed when reaching the last slide (Slide 6)
  useEffect(() => {
    if (mode === 'SLIDES' && slideIdx === STORY_STEPS.length - 1) {
      localStorage.setItem('abstraction_learn_completed', 'true');
    }
  }, [mode, slideIdx]);

  // Handle choice select
  function handleSelectAnswer(option) {
    setUserAnswers((prev) => ({
      ...prev,
      [quizIdx]: option
    }));
  }

  // Calculate score & finish quiz
  const scoreResult = useMemo(() => {
    if (mode !== 'RESULT' || quizQuestions.length === 0) return { score: 0, passed: false, details: [] };

    let score = 0;
    const details = quizQuestions.map((q, idx) => {
      const selected = userAnswers[idx];
      const isCorrect = selected === q.correctAnswer;
      if (isCorrect) score += 1;
      return {
        ...q,
        selectedAnswer: selected,
        isCorrect
      };
    });

    const passed = score >= 14; // 14개 이상 정답 시 통과

    if (passed) {
      localStorage.setItem('abstraction_quiz_passed', 'true');
    }

    return { score, passed, details };
  }, [mode, quizQuestions, userAnswers]);

  // Navigate to problem grid or tutorial after quiz pass
  function handleGoToProblems() {
    const tutorialDone = localStorage.getItem('abstraction_tutorial_first_done') === 'true';
    if (!tutorialDone) {
      navigate('/practice/problem_practice');
    } else {
      navigate('/practice');
    }
  }

  const currentSlide = STORY_STEPS[slideIdx];
  const currentQuiz = quizQuestions[quizIdx];

  return (
    <div className="h-full w-full flex items-center justify-center p-4 overflow-hidden relative">
      <div className="relative w-full max-w-[780px]">
        {/* 메인 콘텐츠 바깥 왼쪽 위 모서리에 떠 있는 버튼 */}
        <button
          onClick={() => navigate('/', { state: { resetHome: Date.now() } })}
          className="absolute top-0 -left-[105px] flex items-center gap-1.5 bg-white/80 backdrop-blur hover:bg-white text-slate-600 hover:text-slate-900 border border-slate-200 px-3 py-2 rounded-xl text-sm font-extrabold transition-all cursor-pointer shadow-sm hover:shadow-md z-50"
        >
          <span className="text-lg leading-none">←</span>
          <span>메인화면</span>
        </button>
        {/* MODE 1: CONCEPT SLIDES (데스크톱: 780px x 600px, 모바일: 반응형 및 스크롤 지원) */}
        {mode === 'SLIDES' && (
          <div className="card-bento responsive-learn-card w-full max-w-[780px] h-[600px] bg-white shadow-2xl px-6 py-5 relative overflow-hidden flex flex-col justify-between rounded-3xl border border-indigo-100 animate-fade-up">
            {/* Header Bar */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="bg-indigo-100 text-indigo-700 text-xs font-extrabold px-3 py-1 rounded-full">
                  {currentSlide.badge}
                </span>
                <span className="text-slate-400 text-xs font-semibold">
                  개념 학습 슬라이드
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
                <span>{slideIdx + 1}</span>
                <span>/</span>
                <span>{STORY_STEPS.length}</span>
              </div>
            </div>

            {/* Dynamic Card Content Area */}
            <div className="mt-1.5 mb-1 flex-1 flex flex-col justify-between overflow-y-auto custom-scrollbar pr-1 pb-2 animate-fade-up" key={slideIdx}>
              <div className="flex flex-col gap-1.5 h-full">
                <div className="flex flex-col gap-1">
                  {currentSlide.type !== 'TYPE_6_ALGORITHM_ANALYSIS' && (
                    <div className="mb-1 flex items-center gap-1.5">
                      <span className="text-lg sm:text-xl shrink-0">{currentSlide.icon}</span>
                      <h3 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight">
                        {currentSlide.title}
                      </h3>
                    </div>
                  )}

                  {/* SLIDE 1: TYPE_1_ALGORITHM_DEF */}
                  {currentSlide.type === 'TYPE_1_ALGORITHM_DEF' && (
                    <div className="space-y-2 mb-2">
                      <div>
                        <div className="p-3 sm:p-4 rounded-2xl bg-indigo-50 border-2 border-indigo-200 shadow-sm flex flex-col justify-center gap-1.5 mb-4">
                          {currentSlide.definition.map((def, i) => (
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
                            <span>{currentSlide.bulletsTitle}</span>
                          </p>
                          <div className="flex flex-col gap-2.5 flex-1 justify-center pl-1">
                            {currentSlide.bullets.map((b, i) => (
                              <div key={i} className="flex items-start gap-2 text-slate-700 font-medium text-[13px] sm:text-[14px]">
                                <span className="text-emerald-500 text-sm sm:text-base shrink-0 leading-tight mt-px">✔</span>
                                <span className="break-keep leading-snug flex-1">{b}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {currentSlide.example && (
                          <div className="flex-[1] flex flex-col bg-white border border-slate-200 shadow-sm rounded-2xl p-3 sm:p-4">
                            <p className="text-sm sm:text-base font-bold text-slate-800 mb-2.5 text-left flex items-center gap-1.5">
                              <span className="text-base sm:text-lg">🍜</span>
                              <span>{currentSlide.exampleTitle}</span>
                            </p>
                            <div className="flex-1 flex flex-col justify-center gap-2 pl-1">
                              {currentSlide.example.map((ex, i) => (
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
                  {currentSlide.type === 'TYPE_2_ALGORITHM_CONDITIONS' && (
                    <div className="space-y-2 mt-2 mb-auto py-0">
                      <div className="grid grid-cols-1 gap-2">
                        {currentSlide.conditions.map((cond, i) => (
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
                  {currentSlide.type === 'TYPE_3_ALGORITHM_EXPRESSION_1' && (
                    <div className="space-y-2 mt-1 mb-auto py-0">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-stretch h-full">
                        {currentSlide.methods.map((method, i) => (
                          <div key={i} className="px-3.5 pt-2 pb-3 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between gap-3 transition-all hover:shadow-md h-full">
                            {/* 1. 상단 헤더: 방법명 */}
                            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 shrink-0">
                              <span className="text-xl">{method.icon}</span>
                              <span className="text-[15px] sm:text-[16px] font-bold text-slate-800">{method.name}</span>
                            </div>

                            {/* 2. 설명 본문 불릿 (첫 줄 중심 정렬) */}
                            <div className="space-y-1.5 text-left flex-1 flex flex-col justify-center px-0.5">
                              {method.desc.map((d, j) => (
                                <div key={j} className="text-[12px] sm:text-[13px] font-medium text-slate-700 break-keep flex items-start gap-1.5 leading-snug">
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0 mt-[6px]"></span>
                                  <span className="flex-1">{d}</span>
                                </div>
                              ))}
                            </div>

                            {/* 3. 하단: 예시 박스 (상단에 제목 라벨 + 구분선 + 예시 내용 일체화) */}
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
                  {currentSlide.type === 'TYPE_4_ALGORITHM_EXPRESSION_2' && (
                    <div className="space-y-2 mt-0.5 mb-auto py-0">
                      {/* 상단: 순서도 특성 불릿 (컴팩트) */}
                      <div className="p-2.5 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col gap-1 transition-all hover:shadow-md">
                        <div className="flex items-center gap-1.5 pb-1 border-b border-slate-100">
                          <span className="text-lg">📊</span>
                          <span className="text-[14px] sm:text-[15px] font-bold text-slate-800">{currentSlide.methodName}</span>
                        </div>
                        <div className="space-y-0.5 text-left px-0.5">
                          {currentSlide.desc.map((d, j) => (
                            <div key={j} className="text-[11.5px] sm:text-[12.5px] font-medium text-slate-700 break-keep flex items-start gap-1.5 leading-snug">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0 mt-[5.5px]"></span>
                              <span className="flex-1">{d}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 하단 좌우 배치: 좌측 기호 표 (3단: 기호명 / 도형 / 의미) + 우측 평균 점수 순서도 예시 카드 */}
                      <div className="flex flex-col sm:flex-row gap-3 items-stretch">
                        {/* 좌측: 순서도 기호 표 ('순서도의 기호와 의미' 헤더 바 제거) */}
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
                              {currentSlide.symbols.map((sym, i) => (
                                <tr key={i} className="hover:bg-slate-50/40 transition-colors">
                                  {/* 1. 기호명 */}
                                  <td className="py-1 px-2 text-center border-r border-slate-100">
                                    <span className="text-[11px] sm:text-xs font-bold text-slate-800">
                                      {sym.name}
                                    </span>
                                  </td>

                                  {/* 2. 도형 */}
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

                                  {/* 3. 의미 */}
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

                        {/* 우측: 평균 점수 순서도 예시 카드 */}
                        <div className="w-full sm:w-[210px] shrink-0 p-2 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between">
                          <div className="flex items-center justify-center gap-1 pb-1 mb-1 border-b border-slate-100 shrink-0">
                            <span className="text-xs font-bold text-slate-700">💡 평균 점수 구하기 예시</span>
                          </div>
                          <div className="flex flex-col items-center justify-center flex-1 gap-[1px] bg-slate-50 border border-slate-200/60 p-1.5 rounded-xl">
                            {currentSlide.flowchartExample.map((node, i) => {
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
                  {currentSlide.type === 'TYPE_5_ALGORITHM_STRUCTURES' && (
                    <div className="space-y-2 mt-0.5 mb-auto py-0">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-stretch">
                        {currentSlide.structures.map((st, i) => (
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

                            {/* 순서도 이미지 예시 */}
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
                  {currentSlide.type === 'TYPE_6_ALGORITHM_ANALYSIS' && (
                    <div className="space-y-3 mt-0.5 mb-auto py-0 text-left">
                      {/* 1. 알고리즘 설계 */}
                      <div className="flex flex-col gap-1.5">
                        <div className="mb-1 flex items-center gap-1.5">
                          <span className="text-lg sm:text-xl shrink-0">📝</span>
                          <h3 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight">
                            알고리즘 설계
                          </h3>
                        </div>
                        <div className="p-3 sm:p-4 rounded-2xl border border-slate-200 bg-white shadow-sm flex items-start">
                          <p className="text-[13px] sm:text-[14px] font-medium text-slate-800 break-keep leading-snug">
                            {currentSlide.designBullet}
                          </p>
                        </div>
                      </div>

                      {/* 2. 알고리즘 효율 및 성능 분석 */}
                      <div className="flex flex-col gap-1.5 mt-2">
                        <div className="mb-1 flex items-center gap-1.5">
                          <span className="text-lg sm:text-xl shrink-0">⚖️</span>
                          <h3 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight">
                            알고리즘 효율 및 성능 분석
                          </h3>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 items-stretch">
                          {/* 좌측 카드: 분석 기준 */}
                          <div className="flex-[1.2] p-3 sm:p-4 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col">
                            <p className="text-sm font-bold text-slate-800 pb-2 mb-2 border-b border-slate-100">성능 분석 기준</p>
                            <div className="flex flex-col gap-2 flex-1">
                              {currentSlide.analysisBullets.map((b, idx) => (
                                <div key={idx} className="flex items-start gap-2">
                                  <span className="text-emerald-500 font-bold shrink-0 leading-tight">✔</span>
                                  <p className="text-[13px] sm:text-[14px] font-medium text-slate-800 break-keep leading-snug">
                                    {b.text}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* 우측 카드: 실생활 예시 */}
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

                  {/* SLIDE 7: TYPE_7_PROBLEM_SOLVING_STRATEGY */}
                  {currentSlide.type === 'TYPE_7_PROBLEM_SOLVING_STRATEGY' && (
                    <div className="space-y-2 my-auto py-0">
                      <div className="grid grid-cols-1 gap-2">
                        {currentSlide.strategies.map((st, i) => (
                          <div key={i} className="py-2 px-3 sm:px-4 rounded-2xl border border-slate-200 bg-white flex items-center gap-3 sm:gap-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
                            <span className="text-[13px] sm:text-[14px] font-bold w-20 sm:w-24 shrink-0 text-slate-800 text-center">{st.name}</span>
                            <div className="w-px h-6 bg-slate-200 shrink-0"></div>
                            <div className="flex items-center justify-start flex-1 pl-1 gap-3 sm:gap-4">
                              <p className="text-[12px] sm:text-[13px] font-medium text-slate-700 break-keep leading-snug w-[130px] sm:w-[150px] shrink-0">
                                {st.desc}
                              </p>
                              <div className="w-px h-5 bg-slate-200 shrink-0"></div>
                              <p className="text-[11px] sm:text-[12px] font-normal text-slate-500 break-keep flex-1">
                                예: {st.example}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Highlight */}
              {currentSlide.highlight && (
                <div className="flex flex-col gap-1.5 mt-3 shrink-0">
                  <div className="py-2.5 px-3.5 bg-amber-50 border border-amber-300 rounded-xl text-xs sm:text-[13px] text-amber-950 font-medium leading-snug flex items-center gap-2.5 break-keep shadow-2xs">
                    <Lightbulb size={18} className="text-amber-500 shrink-0" />
                    <span>{currentSlide.highlight}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Navigation */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 shrink-0">
              <div className="flex gap-2">
                {STORY_STEPS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSlideIdx(i)}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${i === slideIdx ? 'bg-indigo-600 w-7' : 'bg-slate-200 w-2.5 hover:bg-slate-300'
                      }`}
                  />
                ))}
              </div>

              <div className="flex gap-2.5">
                {slideIdx > 0 && (
                  <button
                    onClick={() => setSlideIdx((i) => i - 1)}
                    className="btn-secondary text-xs sm:text-sm py-2 px-4 inline-flex items-center justify-center gap-1.5 cursor-pointer font-bold leading-none"
                  >
                    <ChevronLeft size={16} />
                    <span>이전</span>
                  </button>
                )}
                {slideIdx < STORY_STEPS.length - 1 ? (
                  <button
                    onClick={() => setSlideIdx((i) => i + 1)}
                    className="btn-primary text-xs sm:text-sm py-2 px-6 inline-flex items-center justify-center gap-1.5 cursor-pointer font-extrabold leading-none"
                  >
                    <span>다음 개념</span>
                    <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      localStorage.setItem('abstraction_learn_completed', 'true');
                      navigate('/', { state: { resetHome: Date.now() } });
                    }}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs sm:text-sm py-2.5 px-6 rounded-2xl font-black shadow-md hover:shadow-lg transition-all inline-flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5 animate-bounce-in leading-none"
                  >
                    <span>🏁</span>
                    <span>학습 완료</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* MODE 2: QUIZ SOLVING (데스크톱: 780px x 600px, 모바일: 반응형) */}
        {mode === 'QUIZ' && currentQuiz && (
          <div className="card-bento responsive-learn-card w-full max-w-[780px] h-[600px] bg-white shadow-2xl p-6 relative overflow-hidden flex flex-col justify-between rounded-3xl border border-indigo-100 animate-fade-up">
            {/* Header Bar */}
            <div className="flex flex-col gap-2 shrink-0 border-b border-slate-100 pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="bg-purple-100 text-purple-700 text-xs font-extrabold px-3 py-1 rounded-full">
                    개념 퀴즈
                  </span>
                  <span className="text-slate-400 text-xs font-bold">
                    문제 {quizIdx + 1} / {quizQuestions.length}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setSlideIdx(0);
                    setMode('SLIDES');
                  }}
                  className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 cursor-pointer font-bold"
                >
                  <BookOpen size={14} />
                  <span>다시 학습하기</span>
                </button>
              </div>

              {/* Progress Bar */}
              <div className="progress-bar">
                <div
                  className="progress-fill bg-gradient-to-r from-purple-500 to-indigo-600"
                  style={{ width: `${((quizIdx + 1) / quizQuestions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question & Options Area */}
            <div className="my-2 flex-1 flex flex-col justify-start gap-2.5 overflow-hidden" key={quizIdx}>
              {/* Question Text */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 shrink-0 shadow-xs">
                <span className="inline-block text-xs font-black text-indigo-600 mb-1">
                  Q{quizIdx + 1}.
                </span>
                <h3 className="text-base font-black text-slate-800 leading-snug break-keep">
                  {currentQuiz.question}
                </h3>
              </div>

              {/* Options List */}
              <div className="space-y-2.5 flex-1 flex flex-col justify-start overflow-y-auto pt-1">
                {currentQuiz.options.map((option, optIdx) => {
                  const isSelected = userAnswers[quizIdx] === option;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectAnswer(option)}
                      className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all flex items-center gap-3 cursor-pointer ${isSelected
                        ? 'border-indigo-600 bg-indigo-50/90 text-indigo-950 font-extrabold shadow-sm'
                        : 'border-slate-200 bg-white hover:border-indigo-300 text-slate-700 font-bold hover:bg-slate-50/50'
                        }`}
                    >
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
                        }`}>
                        {optIdx + 1}
                      </span>
                      <span className="text-xs sm:text-sm font-extrabold leading-snug break-keep">{option}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer Controls */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-3 shrink-0">
              <button
                onClick={() => setQuizIdx((i) => Math.max(0, i - 1))}
                disabled={quizIdx === 0}
                className="btn-secondary text-xs sm:text-sm py-2 px-4 inline-flex items-center justify-center gap-1 cursor-pointer font-bold leading-none disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
                <span>이전 문제</span>
              </button>

              {quizIdx < quizQuestions.length - 1 ? (
                <button
                  onClick={() => setQuizIdx((i) => i + 1)}
                  disabled={!userAnswers[quizIdx]}
                  className="btn-primary text-xs sm:text-sm py-2 px-5 inline-flex items-center justify-center gap-1.5 cursor-pointer font-extrabold leading-none disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span>다음 문제</span>
                  <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  onClick={() => setMode('RESULT')}
                  disabled={Object.keys(userAnswers).length < quizQuestions.length}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm py-2.5 px-6 rounded-2xl font-black shadow-md hover:shadow-lg transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed leading-none"
                >
                  <span>🚀</span>
                  <span>퀴즈 제출하기</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* MODE 3: RESULT & EXPLANATION (데스크톱: 780px x 600px, 모바일: 반응형) */}
        {mode === 'RESULT' && (
          <div className="card-bento responsive-learn-card w-full max-w-[780px] h-[600px] bg-white shadow-2xl p-6 relative overflow-hidden flex flex-col justify-between rounded-3xl border border-indigo-100 animate-fade-up">
            {/* Result Banner (Top Half) */}
            <div className={`p-5 rounded-2xl border-2 text-center flex flex-col items-center justify-center shrink-0 ${scoreResult.passed
              ? 'bg-gradient-to-br from-emerald-50 via-teal-50 to-indigo-50 border-emerald-300'
              : 'bg-gradient-to-br from-amber-50 via-orange-50 to-indigo-50 border-amber-300'
              }`}>
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-2xl">{scoreResult.passed ? '🎉' : '💡'}</span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-800">
                  {scoreResult.passed ? '축하합니다! 통과하셨습니다' : '아쉽지만 조금 더 복습해볼까요?'}
                </h2>
              </div>

              <p className="text-slate-600 text-sm font-bold mb-3">
                총 {quizQuestions.length}문항 중 <span className="text-indigo-600 text-xl font-black">{scoreResult.score}</span>문항 정답 (100점 만점 기준 {Math.round((scoreResult.score / quizQuestions.length) * 100)}점)
              </p>

              {/* CTA Buttons */}
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <button
                  onClick={handleGoToProblems}
                  className="btn-primary text-xs sm:text-sm px-6 py-2.5 flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer font-black transform hover:-translate-y-0.5"
                >
                  <span>✏️</span>
                  <span>실생활 문제 풀러가기</span>
                  <ChevronRight size={18} />
                </button>
                <button
                  onClick={startQuiz}
                  className="btn-secondary text-xs sm:text-sm px-5 py-2.5 flex items-center gap-1.5 cursor-pointer font-extrabold"
                >
                  <RotateCcw size={16} />
                  <span>퀴즈 다시 풀기</span>
                </button>
                <button
                  onClick={() => {
                    setSlideIdx(0);
                    setMode('SLIDES');
                  }}
                  className="btn-secondary text-xs sm:text-sm px-5 py-2.5 flex items-center gap-1.5 cursor-pointer font-extrabold"
                >
                  <BookOpen size={16} />
                  <span>개념 다시 학습하기</span>
                </button>
              </div>

              {!scoreResult.passed && (
                <p className="text-[11px] text-amber-700 font-extrabold mt-2">
                  ※ 10문항을 모두 맞히면 [개념 퀴즈 학습 완료] 뱃지가 부여됩니다! 아래 오답 카드를 클릭하여 정답 해설을 확인해보세요.
                </p>
              )}
            </div>

            {/* Question Grid Section (Bottom Half) */}
            <div className="flex-1 flex flex-col justify-start overflow-hidden mt-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2 shrink-0">
                <h3 className="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-1.5">
                  <Sparkles size={16} className="text-indigo-600" />
                  <span>문항별 정/오답 확인 (클릭 시 상세 해설 팝업)</span>
                </h3>
              </div>

              {/* 10 Question Grid Buttons */}
              <div className="grid grid-cols-2 gap-2 flex-1 overflow-y-auto pr-1">
                {scoreResult.details.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedDetailQuestion(item)}
                    className={`p-2.5 rounded-xl border-2 text-left flex items-center justify-between transition-all cursor-pointer hover:shadow-sm ${item.isCorrect
                      ? 'border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/60'
                      : 'border-rose-200 bg-rose-50/50 hover:bg-rose-100/60'
                      }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden pr-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white shrink-0 ${item.isCorrect ? 'bg-emerald-600' : 'bg-rose-500'
                        }`}>
                        {idx + 1}
                      </span>
                      <span className="text-xs font-extrabold text-slate-800 truncate">
                        {item.question}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded ${item.isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                        }`}>
                        {item.isCorrect ? '정답 ✓' : '오답 ✕'}
                      </span>
                      <span className="text-[10px] font-extrabold text-indigo-600 underline">해설</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Explanation Detail Popup Modal */}
        {selectedDetailQuestion && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-up">
            <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-indigo-100 text-left space-y-4 animate-bounce-in relative">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-black px-2.5 py-1 rounded-full text-white ${selectedDetailQuestion.isCorrect ? 'bg-emerald-600' : 'bg-rose-500'
                    }`}>
                    문항 {selectedDetailQuestion.id} - {selectedDetailQuestion.isCorrect ? '정답 ✓' : '오답 ✕'}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedDetailQuestion(null)}
                  className="text-xs text-slate-400 hover:text-slate-600 font-bold p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  ✕ 닫기
                </button>
              </div>

              {/* Question */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <h4 className="text-sm sm:text-base font-black text-slate-800 leading-snug">
                  Q{selectedDetailQuestion.id}. {selectedDetailQuestion.question}
                </h4>
              </div>

              {/* Detailed Explanation */}
              <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl text-xs sm:text-sm text-slate-800 font-semibold leading-relaxed shadow-xs">
                <div className="flex items-center gap-1.5 text-amber-800 font-black mb-1.5 pb-1 border-b border-amber-200/60">
                  <span className="text-base">💡</span>
                  <span className="text-sm font-extrabold">해설</span>
                </div>
                <p className="text-slate-800 font-bold break-keep leading-relaxed">{selectedDetailQuestion.explanation}</p>
              </div>

              <div className="text-right pt-2 border-t border-slate-100">
                <button
                  onClick={() => setSelectedDetailQuestion(null)}
                  className="btn-primary text-xs py-2 px-5 rounded-xl font-bold cursor-pointer"
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
