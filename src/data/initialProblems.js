// src/data/initialProblems.js
// 초기 상태 및 문제 데이터 세트

export const initialProblems = [
  {
    "id": "problem_01",
    "correctAnswers": {
      "s1": {
        "type": "terminal",
        "blockId": "b1"
      },
      "s4": {
        "blockId": "b4",
        "type": "process"
      },
      "s2": {
        "type": "input",
        "blockId": "b2"
      },
      "s3": {
        "type": "process",
        "blockId": "b3"
      },
      "s5": {
        "blockId": "b5",
        "type": "input"
      },
      "s6": {
        "blockId": "b6",
        "type": "terminal"
      }
    },
    "goalState": [
      "일주일 총 사용 시간을 아는 상태"
    ],
    "adminKey": "comedu2026",
    "skeleton": [
      {
        "type": "slot",
        "id": "s1"
      },
      {
        "type": "arrow"
      },
      {
        "type": "slot",
        "id": "s2"
      },
      {
        "type": "arrow"
      },
      {
        "id": "s3",
        "type": "slot"
      },
      {
        "type": "arrow"
      },
      {
        "id": "s4",
        "type": "slot"
      },
      {
        "type": "arrow"
      },
      {
        "id": "s5",
        "type": "slot"
      },
      {
        "type": "arrow"
      },
      {
        "type": "slot",
        "id": "s6"
      }
    ],
    "emoji": "📱",
    "deleted": false,
    "category": "순차",
    "description": "하루 게임 시간과 SNS 시간을 입력받아\n일주일 동안의 총 스마트폰 사용 시간을 구해야 하는 상황입니다.",
    "initialState": [
      "하루 게임 시간, 하루 SNS 시간을 아는 상태"
    ],
    "themeColor": "#6366f1",
    "algorithm": [
      "하루 게임 시간과 하루 SNS 시간을 입력받는다.",
      "게임 시간과 SNS 시간을 더해 하루 총 사용 시간을 구한다.",
      "하루 총 사용 시간에 7을 곱해 일주일 총 사용 시간을 구한다.",
      "일주일 총 사용 시간을 출력한다."
    ],
    "blocks": [
      {
        "id": "b1",
        "text": "시작"
      },
      {
        "text": "하루 게임 시간, 하루 SNS 시간 입력",
        "id": "b2"
      },
      {
        "text": "하루 총 사용 시간 = 하루 게임 시간 + 하루 SNS 시간",
        "id": "b3"
      },
      {
        "id": "b4",
        "text": "일주일 총 사용 시간 = 하루 총 사용 시간 × 7"
      },
      {
        "id": "b5",
        "text": "일주일 총 사용 시간 출력"
      },
      {
        "id": "b6",
        "text": "끝"
      },
      {
        "id": "b7",
        "text": "일주일 총 사용 시간 = 하루 게임 시간 × 7"
      },
      {
        "id": "b8",
        "text": "하루 SNS 시간 × 7 출력"
      }
    ],
    "themeBg": "from-sky-50 to-indigo-50",
    "title": "스마트폰 주간 사용 시간 계산기",
    "ipo": {
      "input": [
        "하루 게임 시간",
        "하루 SNS 시간"
      ],
      "output": [
        "일주일 총 사용 시간"
      ],
      "process": [
        "하루 총 사용 시간 계산",
        "일주일 총 사용 시간 계산"
      ]
    }
  },
  {
    "id": "problem_02",
    "initialState": [
      "데이터 사용량을 아는 상태"
    ],
    "skeleton": [
      {
        "type": "slot",
        "id": "p2_s1"
      },
      {
        "type": "arrow"
      },
      {
        "type": "slot",
        "id": "p2_s2"
      },
      {
        "type": "arrow"
      },
      {
        "id": "p2_s3",
        "type": "slot"
      },
      {
        "left": [
          {
            "type": "slot",
            "id": "p2_s4"
          }
        ],
        "leftLabel": "예 (Yes)",
        "right": [
          {
            "id": "p2_s5",
            "type": "slot"
          }
        ],
        "rightLabel": "아니오 (No)",
        "type": "split"
      },
      {
        "id": "p2_s6",
        "type": "slot"
      },
      {
        "type": "arrow"
      },
      {
        "type": "slot",
        "id": "p2_s7"
      }
    ],
    "goalState": [
      "휴대폰 요금을 아는 상태"
    ],
    "category": "선택",
    "themeColor": "#f59e0b",
    "themeBg": "from-amber-50 to-orange-50",
    "emoji": "📱",
    "adminKey": "comedu2026",
    "ipo": {
      "output": [
        "휴대폰 요금"
      ],
      "process": [
        "휴대폰 요금 계산"
      ],
      "input": [
        "데이터 사용량"
      ]
    },
    "description": "데이터 사용량을 입력받아 10GB 이하이면 10,000원을, 10GB를 초과하면 사용량에 1,000원을 곱하여 휴대폰 요금을 계산해야 하는 상황입니다.",
    "correctAnswers": {
      "p2_s4": {
        "type": "process",
        "blockId": "p2_b4"
      },
      "p2_s7": {
        "type": "terminal",
        "blockId": "p2_b7"
      },
      "p2_s1": {
        "blockId": "p2_b1",
        "type": "terminal"
      },
      "p2_s3": {
        "type": "decision",
        "blockId": "p2_b3"
      },
      "p2_s2": {
        "type": "input",
        "blockId": "p2_b2"
      },
      "p2_s5": {
        "type": "process",
        "blockId": "p2_b5"
      },
      "p2_s6": {
        "type": "input",
        "blockId": "p2_b6"
      }
    },
    "blocks": [
      {
        "text": "시작",
        "id": "p2_b1"
      },
      {
        "text": "데이터 사용량 입력",
        "id": "p2_b2"
      },
      {
        "id": "p2_b3",
        "text": "데이터 사용량이 10GB 이하인가?"
      },
      {
        "text": "휴대폰 요금 = 10000",
        "id": "p2_b4"
      },
      {
        "id": "p2_b5",
        "text": "휴대폰 요금 = 데이터 사용량 X 1000"
      },
      {
        "text": "휴대폰 요금 출력",
        "id": "p2_b6"
      },
      {
        "text": "끝",
        "id": "p2_b7"
      },
      {
        "id": "p2_b8",
        "text": "휴대폰 요금 = 10000 X 1000"
      },
      {
        "text": "데이터 사용량 = 10GB",
        "id": "p2_b9"
      }
    ],
    "algorithm": [
      "데이터 사용량(GB)을 입력받는다.",
      "데이터 사용량이 10GB 이하인가?\n• (예): 휴대폰 요금을 10,000원으로 설정한다.\n• (아니오): 데이터 사용량에 1,000원을 곱해 휴대폰 요금을 구한다.",
      "휴대폰 요금을 출력한다."
    ],
    "title": "휴대폰 요금 계산기",
    "deleted": false
  },
  {
    "id": "problem_03",
    "deleted": false,
    "blocks": [
      {
        "text": "시작",
        "id": "p3_b1"
      },
      {
        "text": "목표 금액 입력",
        "id": "p3_b_new"
      },
      {
        "text": "누적 금액 = 0",
        "id": "p3_b2"
      },
      {
        "id": "p3_b3",
        "text": "저축할 금액 입력"
      },
      {
        "text": "누적 금액 = 누적 금액 + 저축할 금액",
        "id": "p3_b4"
      },
      {
        "id": "p3_b5",
        "text": "누적 금액이 목표 금액 이상인가?"
      },
      {
        "text": "목표 금액 미달성 메시지 출력",
        "id": "p3_b6"
      },
      {
        "id": "p3_b7",
        "text": "목표 금액 달성 안내 메시지,\n누적 금액 출력"
      },
      {
        "text": "끝",
        "id": "p3_b8"
      },
      {
        "text": "누적 금액 = 목표 금액",
        "id": "p3_b9"
      },
      {
        "text": "저축할 금액 = 누적 금액 + 목표 금액",
        "id": "p3_b10"
      }
    ],
    "initialState": [
      "목표 금액이 설정되지 않은 상태"
    ],
    "emoji": "💰",
    "themeColor": "#059669",
    "ipo": {
      "process": [
        "저축 금액 누적 계산 및 목표 금액 달성 여부 판별"
      ],
      "output": [
        "최종 누적 금액",
        "목표 금액 달성 여부 안내 메시지"
      ],
      "input": [
        "목표 금액",
        "저축할 금액"
      ]
    },
    "description": "목표 금액을 먼저 입력받아 설정하고, 누적 금액은 0원부터 시작합니다. 저축할 금액을 계속 입력받아 누적하며, 누적 금액이 목표 금액 이상이 될 때까지 입력을 반복해야 하는 상황입니다. 목표를 달성하면 달성 안내 메시지와 함께 최종 누적 금액을 출력해야 합니다.",
    "goalState": [
      "목표 금액을 달성한 상태"
    ],
    "adminKey": "comedu2026",
    "correctAnswers": {
      "p3_s1": {
        "blockId": "p3_b1",
        "type": "terminal"
      },
      "p3_s_new": {
        "blockId": "p3_b_new",
        "type": "input"
      },
      "p3_s6": {
        "blockId": "p3_b6",
        "type": "input"
      },
      "p3_s5": {
        "blockId": "p3_b5",
        "type": "decision"
      },
      "p3_s7": {
        "type": "input",
        "blockId": "p3_b7"
      },
      "p3_s4": {
        "blockId": "p3_b4",
        "type": "process"
      },
      "p3_s8": {
        "type": "terminal",
        "blockId": "p3_b8"
      },
      "p3_s2": {
        "type": "process",
        "blockId": "p3_b2"
      },
      "p3_s3": {
        "type": "input",
        "blockId": "p3_b3"
      }
    },
    "algorithm": [
      "목표 금액을 입력받는다.",
      "누적 금액을 0원으로 설정한다.",
      "저축할 금액을 입력받는다.",
      "기존 누적 금액에 입력받은 저축 금액을 더한다.",
      "누적 금액이 목표 금액 이상인가?\n• (예): 목표 달성 안내 메시지와 최종 누적 금액을 출력한다.\n• (아니오): 목표 미달성 안내 메시지를 출력하고 3번 단계로 돌아간다."
    ],
    "themeBg": "from-emerald-50 to-teal-50",
    "title": "목표 저축 프로그램",
    "category": "반복",
    "skeleton": [
      {
        "id": "p3_s1",
        "type": "slot"
      },
      {
        "type": "arrow"
      },
      {
        "type": "slot",
        "id": "p3_s_new"
      },
      {
        "type": "arrow"
      },
      {
        "id": "p3_s2",
        "type": "slot"
      },
      {
        "exitBranchLabel": "예 (Yes)",
        "body": [
          {
            "id": "p3_s3",
            "type": "slot"
          },
          {
            "type": "arrow"
          },
          {
            "type": "slot",
            "id": "p3_s4"
          },
          {
            "type": "arrow"
          },
          {
            "type": "slot",
            "id": "p3_s5"
          }
        ],
        "returnPath": [
          {
            "type": "slot",
            "id": "p3_s6"
          }
        ],
        "loopBranchLabel": "아니오 (No)",
        "type": "loop"
      },
      {
        "type": "slot",
        "id": "p3_s7"
      },
      {
        "type": "arrow"
      },
      {
        "id": "p3_s8",
        "type": "slot"
      }
    ]
  },
  {
    "id": "problem_04",
    "ipo": {
      "input": [
        "퀴즈 난이도",
        "사용자 답"
      ],
      "output": [
        "정답/오답 메시지"
      ],
      "process": [
        "난이도별 정답 설정",
        "정답 여부 판별 및 재입력 루프"
      ]
    },
    "initialState": [
      "퀴즈를 시작할 준비가 된 상태"
    ],
    "themeBg": "from-indigo-50 to-purple-50",
    "algorithm": [
      "퀴즈 난이도를 입력받는다.",
      "퀴즈 난이도가 1단계인가?\n• (예): 정답을 \"사과\"로 정한다.\n• (아니오): 정답을 \"바나나\"로 정한다.",
      "사용자 답을 입력받는다.",
      "사용자 답이 정답인가?\n• (예): 정답 안내 메시지를 출력한다.\n• (아니오): 오답 안내 메시지를 출력하고 3번 단계로 돌아간다."
    ],
    "emoji": "🧩",
    "description": "퀴즈 난이도를 입력받아 정답을 설정하고, 정답을 맞힐 때까지 답을 계속 입력받아야 하는 상황입니다.",
    "deleted": false,
    "blocks": [
      {
        "id": "p4_b1",
        "text": "시작"
      },
      {
        "id": "p4_b2",
        "text": "퀴즈 난이도 입력"
      },
      {
        "id": "p4_b3",
        "text": "퀴즈 난이도가 1단계인가?"
      },
      {
        "id": "p4_b4",
        "text": "정답 = 사과"
      },
      {
        "id": "p4_b5",
        "text": "정답 = 바나나"
      },
      {
        "id": "p4_b6",
        "text": "사용자 답 입력"
      },
      {
        "id": "p4_b7",
        "text": "사용자 답이 정답인가?"
      },
      {
        "id": "p4_b8",
        "text": "오답 안내 메시지 출력"
      },
      {
        "id": "p4_b9",
        "text": "정답 안내 메시지 출력"
      },
      {
        "id": "p4_b10",
        "text": "끝"
      },
      {
        "id": "p4_b11",
        "text": "정답 = 사과 + 바나나"
      },
      {
        "id": "p4_b12",
        "text": "사용자 답 = 정답"
      }
    ],
    "category": "선택+반복",
    "skeleton": [
      {
        "type": "slot",
        "id": "p4_s1"
      },
      {
        "type": "arrow"
      },
      {
        "type": "slot",
        "id": "p4_s2"
      },
      {
        "type": "arrow"
      },
      {
        "type": "slot",
        "id": "p4_s3"
      },
      {
        "type": "split",
        "leftLabel": "예 (Yes)",
        "rightLabel": "아니오 (No)",
        "left": [
          {
            "type": "slot",
            "id": "p4_s4"
          }
        ],
        "right": [
          {
            "type": "slot",
            "id": "p4_s5"
          }
        ]
      },
      {
        "type": "loop",
        "direction": "left",
        "loopBranchLabel": "아니오 (No)",
        "exitBranchLabel": "예 (Yes)",
        "body": [
          {
            "type": "slot",
            "id": "p4_s6"
          },
          {
            "type": "arrow"
          },
          {
            "type": "slot",
            "id": "p4_s7"
          }
        ],
        "returnPath": [
          {
            "type": "slot",
            "id": "p4_s8"
          }
        ]
      },
      {
        "type": "slot",
        "id": "p4_s9"
      },
      {
        "type": "arrow"
      },
      {
        "type": "slot",
        "id": "p4_s10"
      }
    ],
    "themeColor": "#7c3aed",
    "title": "퀴즈 프로그램",
    "adminKey": "comedu2026",
    "goalState": [
      "최종적으로 정답을 맞힌 상태"
    ],
    "correctAnswers": {
      "p4_s5": {
        "type": "process",
        "blockId": "p4_b5"
      },
      "p4_s4": {
        "type": "process",
        "blockId": "p4_b4"
      },
      "p4_s1": {
        "blockId": "p4_b1",
        "type": "terminal"
      },
      "p4_s8": {
        "blockId": "p4_b8",
        "type": "input"
      },
      "p4_s2": {
        "blockId": "p4_b2",
        "type": "input"
      },
      "p4_s10": {
        "blockId": "p4_b10",
        "type": "terminal"
      },
      "p4_s7": {
        "type": "decision",
        "blockId": "p4_b7"
      },
      "p4_s9": {
        "type": "input",
        "blockId": "p4_b9"
      },
      "p4_s3": {
        "blockId": "p4_b3",
        "type": "decision"
      },
      "p4_s6": {
        "type": "input",
        "blockId": "p4_b6"
      }
    }
  }
];
