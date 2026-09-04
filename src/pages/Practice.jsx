import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { ArrowLeft, RotateCcw, Trophy, ArrowRight, CheckCircle2, HelpCircle, X } from 'lucide-react';
import { initialProblems } from '../data/initialProblems';

const SHAPES = [
  { type: 'terminal', label: '단말(시작/끝)' },
  { type: 'input',    label: '입력/출력' },
  { type: 'process',  label: '처리' },
  { type: 'decision', label: '판단(조건)' },
];

const ShapeIcon = ({ type }) => {
  if (type === 'terminal') return <div className="w-5 h-2.5 rounded-full border border-emerald-400 bg-emerald-50" />;
  if (type === 'input')    return <div className="w-5 h-2.5 -skew-x-[15deg] border border-amber-400 bg-amber-50" />;
  if (type === 'process')  return <div className="w-5 h-2.5 border border-cyan-400 bg-cyan-50" />;
  if (type === 'decision') return <div className="w-3.5 h-3.5 rotate-45 border border-rose-400 bg-rose-50 flex-shrink-0" />;
  return null;
};

const RenderShape = ({ type, text, onShapeChange }) => {
  if (!type) {
    return (
      <div className="flex flex-col items-center">
        <div className="px-2 py-1 border border-dashed border-indigo-300 bg-indigo-50/40 min-h-[1.75rem] min-w-[100px] max-w-[190px] flex items-center justify-center font-medium text-[11px] text-center leading-tight">
          {text}
        </div>
        <div className="mt-0.5 flex gap-0.5 bg-white p-0.5 rounded shadow-2xs border border-slate-200 z-10">
          {SHAPES.map(s => (
            <button key={s.type} onClick={() => onShapeChange(s.type)} className="p-0.5 hover:bg-slate-100 rounded" title={s.label}>
              <ShapeIcon type={s.type} />
            </button>
          ))}
        </div>
      </div>
    );
  }

  const resetBtn = (
    <div
      className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-slate-700 text-white rounded-full flex items-center justify-center text-[8px] opacity-0 group-hover:opacity-100 z-10 transition-opacity cursor-pointer"
      onClick={(e) => { e.stopPropagation(); onShapeChange(null); }}
    >✕</div>
  );

  const base = 'w-[126px] h-[34px] px-2 py-0.5 font-medium text-center flex items-center justify-center break-words whitespace-pre-line shadow-2xs relative group cursor-pointer hover:scale-102 transition-transform text-[10px] leading-tight';

  if (type === 'terminal') return (
    <div className="flex items-center justify-center relative" onClick={() => onShapeChange(null)}>
      {resetBtn}
      <div className={`${base} rounded-full border border-emerald-500 text-emerald-800 bg-emerald-50`}>{text}</div>
    </div>
  );
  if (type === 'input') return (
    <div className="flex items-center justify-center relative" onClick={() => onShapeChange(null)}>
      {resetBtn}
      <div className={`${base} -skew-x-[12deg] border border-amber-500 text-amber-800 bg-amber-50`}>
        <span className="skew-x-[12deg] text-center">{text}</span>
      </div>
    </div>
  );
  if (type === 'process') return (
    <div className="flex items-center justify-center relative" onClick={() => onShapeChange(null)}>
      {resetBtn}
      <div className={`${base} border border-cyan-500 text-cyan-800 bg-cyan-50`}>{text}</div>
    </div>
  );
  if (type === 'decision') return (
    <div className="flex items-center justify-center relative group cursor-pointer" onClick={() => onShapeChange(null)}>
      {resetBtn}
      <div className="relative p-[1.5px] bg-rose-400 shadow-2xs" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}>
        <div className="bg-rose-50 px-2 py-1 w-[124px] h-[32px] flex items-center justify-center text-rose-800 font-medium break-words text-center text-[9.5px] leading-tight" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}>
          {text}
        </div>
      </div>
    </div>
  );
  return null;
};

const ArrowDown = () => (
  <div className="flex flex-col items-center my-0">
    <div className="w-0.5 h-2 bg-slate-400" />
    <div className="w-1.5 h-1.5 border-b-2 border-r-2 border-slate-400 rotate-45 -mt-0.5" />
  </div>
);
const ArrowDownShort = () => (
  <div className="flex flex-col items-center">
    <div className="w-0.5 h-1.5 bg-slate-400" />
    <div className="w-1 h-1 border-b-2 border-r-2 border-slate-400 rotate-45 -mt-0.5" />
  </div>
);

const SlotNode = ({ node, slots, problem, handleShapeChange }) => {
  const slotData = slots[node.id];
  const block = slotData ? problem.blocks.find(b => b.id === slotData.blockId) : null;
  return (
    <Droppable droppableId={node.id}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`w-[130px] h-[38px] flex items-center justify-center p-0.5 rounded-lg transition-colors shrink-0 ${
            snapshot.isDraggingOver ? 'bg-indigo-100 border-2 border-indigo-400' : 'border-2 border-dashed border-slate-300 bg-white/50'
          }`}
        >
          {!block && !snapshot.isDraggingOver && <span className="text-slate-400 text-[10px] font-medium select-none">여기에 드래그</span>}
          {block && (
            <Draggable draggableId={node.id + '_drag'} index={0}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="w-full h-full flex items-center justify-center">
                  <RenderShape type={slotData.shape} text={block.text} onShapeChange={(s) => handleShapeChange(node.id, s)} />
                </div>
              )}
            </Draggable>
          )}
          <div className="hidden">{provided.placeholder}</div>
        </div>
      )}
    </Droppable>
  );
};

const SplitNode = ({ node, renderNodes }) => (
  <div className="flex flex-col items-center w-full my-0.5">
    {/* 상단 분기선 (중앙 50%에서 내려와 25%와 75%로 분기) */}
    <svg width="100%" height="16" style={{ overflow: 'visible', display: 'block' }}>
      <line x1="50%" y1="0" x2="50%" y2="8" stroke="#94a3b8" strokeWidth="1.5" />
      <line x1="25%" y1="8" x2="75%" y2="8" stroke="#94a3b8" strokeWidth="1.5" />
      <line x1="25%" y1="8" x2="25%" y2="16" stroke="#94a3b8" strokeWidth="1.5" />
      <line x1="75%" y1="8" x2="75%" y2="16" stroke="#94a3b8" strokeWidth="1.5" />
    </svg>
    <div className="flex w-full">
      <div className="w-1/2 flex flex-col items-center">
        <span className="text-[8px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-300 rounded-full px-2 py-0.5 mb-0.5 shadow-2xs">
          {node.leftLabel}
        </span>
        <ArrowDownShort />
        {renderNodes(node.left)}
      </div>
      <div className="w-1/2 flex flex-col items-center">
        <span className="text-[8px] font-bold text-rose-700 bg-rose-50 border border-rose-300 rounded-full px-2 py-0.5 mb-0.5 shadow-2xs">
          {node.rightLabel}
        </span>
        <ArrowDownShort />
        {renderNodes(node.right)}
      </div>
    </div>
    {/* 하단 합류선 (25%와 75%에서 모여 중앙 50%로 합류) */}
    <svg width="100%" height="18" style={{ overflow: 'visible', display: 'block' }}>
      <line x1="25%" y1="0" x2="25%" y2="9" stroke="#94a3b8" strokeWidth="1.5" />
      <line x1="75%" y1="0" x2="75%" y2="9" stroke="#94a3b8" strokeWidth="1.5" />
      <line x1="25%" y1="9" x2="75%" y2="9" stroke="#94a3b8" strokeWidth="1.5" />
      <line x1="50%" y1="9" x2="50%" y2="18" stroke="#94a3b8" strokeWidth="1.5" />
    </svg>
    <ArrowDown />
  </div>
);

const LoopBranchNode = ({ node, renderNodes }) => (
  <div className="flex w-full">
    <div style={{ width: '34%', flexShrink: 0, position: 'relative' }}>
      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
        <span className="text-[9px] font-bold text-rose-500 bg-white px-0.5">{node.branchLabel}</span>
      </div>
      <svg width="100%" height="70" viewBox="0 0 120 70" preserveAspectRatio="none" style={{ display: 'block', overflow: 'visible' }}>
        <line x1="120" y1="0" x2="10" y2="0" stroke="#f43f5e" strokeWidth="1.5" />
        <line x1="10" y1="0" x2="10" y2="60" stroke="#f43f5e" strokeWidth="1.5" />
        <line x1="10" y1="60" x2="120" y2="60" stroke="#f43f5e" strokeWidth="1.5" />
        <polyline points="108,54 120,60 108,66" stroke="#f43f5e" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      </svg>
    </div>
    <div style={{ flex: 1 }} className="flex flex-col items-center">
      <span className="text-[9px] font-bold text-slate-500 mb-0">{node.mainLabel}</span>
      <ArrowDownShort />
      {node.left && renderNodes(node.left)}
    </div>
  </div>
);

// ==================== 2번 문제 전용 정밀 순서도 ====================
const Problem2Flowchart = ({ slots, problem, handleShapeChange }) => {
  const s = (id) => {
    const node = { id, type: 'slot' };
    return <SlotNode node={node} slots={slots} problem={problem} handleShapeChange={handleShapeChange} />;
  };

  return (
    <div className="relative w-[420px] h-[450px] my-1 select-none mx-auto">
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
        <line x1="140" y1="38" x2="140" y2="56" stroke="#94a3b8" strokeWidth="1.5" />
        <polyline points="137,51 140,56 143,51" stroke="#94a3b8" strokeWidth="1.5" fill="none" strokeLinejoin="round" />

        <line x1="140" y1="94" x2="140" y2="112" stroke="#94a3b8" strokeWidth="1.5" />
        <polyline points="137,107 140,112 143,107" stroke="#94a3b8" strokeWidth="1.5" fill="none" strokeLinejoin="round" />

        <line x1="140" y1="150" x2="140" y2="182" stroke="#94a3b8" strokeWidth="1.5" />
        <polyline points="137,177 140,182 143,177" stroke="#94a3b8" strokeWidth="1.5" fill="none" strokeLinejoin="round" />

        <line x1="205" y1="131" x2="280" y2="131" stroke="#94a3b8" strokeWidth="1.5" />
        <line x1="280" y1="131" x2="280" y2="182" stroke="#94a3b8" strokeWidth="1.5" />
        <polyline points="277,177 280,182 283,177" stroke="#94a3b8" strokeWidth="1.5" fill="none" strokeLinejoin="round" />

        <line x1="140" y1="220" x2="140" y2="260" stroke="#94a3b8" strokeWidth="1.5" />
        <line x1="280" y1="220" x2="280" y2="240" stroke="#94a3b8" strokeWidth="1.5" />
        <line x1="280" y1="240" x2="140" y2="240" stroke="#94a3b8" strokeWidth="1.5" />
        <polyline points="137,255 140,260 143,255" stroke="#94a3b8" strokeWidth="1.5" fill="none" strokeLinejoin="round" />

        <line x1="140" y1="298" x2="140" y2="320" stroke="#94a3b8" strokeWidth="1.5" />
        <polyline points="137,315 140,320 143,315" stroke="#94a3b8" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      </svg>

      <div className="absolute left-[75px] top-[0px] w-[130px] h-[38px] flex items-center justify-center z-10">{s('p2_s1')}</div>
      <div className="absolute left-[75px] top-[56px] w-[130px] h-[38px] flex items-center justify-center z-10">{s('p2_s2')}</div>
      <div className="absolute left-[75px] top-[112px] w-[130px] h-[38px] flex items-center justify-center z-10">{s('p2_s3')}</div>
      
      <div className="absolute left-[120px] top-[156px] z-20">
        <span className="text-[8px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-300 rounded-full px-1.5 py-0.5 shadow-2xs">예 (Yes)</span>
      </div>
      <div className="absolute left-[225px] top-[116px] z-20">
        <span className="text-[8px] font-bold text-rose-700 bg-rose-50 border border-rose-300 rounded-full px-1.5 py-0.5 shadow-2xs">아니오 (No)</span>
      </div>

      <div className="absolute left-[75px] top-[182px] w-[130px] h-[38px] flex items-center justify-center z-10">{s('p2_s4')}</div>
      <div className="absolute left-[215px] top-[182px] w-[130px] h-[38px] flex items-center justify-center z-10">{s('p2_s5')}</div>
      <div className="absolute left-[75px] top-[260px] w-[130px] h-[38px] flex items-center justify-center z-10">{s('p2_s6')}</div>
      <div className="absolute left-[75px] top-[320px] w-[130px] h-[38px] flex items-center justify-center z-10">{s('p2_s7')}</div>
    </div>
  );
};

// ==================== 3번 문제 전용 정밀 순서도 ====================
const Problem3Flowchart = ({ slots, problem, handleShapeChange }) => {
  const node = problem.skeleton.find(n => n.type === 'loop');
  const slot3 = node?.body?.[0]; // 저축할 금액 입력 (p3_s3)
  const slot4 = node?.body?.[2]; // 누적 금액 계산 (p3_s4)
  const slot5 = node?.body?.[4]; // 마름모 조건 판단 (p3_s5)
  const returnSlot = node?.returnPath?.[0]; // 금액 부족 메시지 (p3_s6)

  const s = (n) => n && <SlotNode node={n} slots={slots} problem={problem} handleShapeChange={handleShapeChange} />;

  return (
    <div className="relative w-[420px] h-[456px] my-1 select-none mx-auto">
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
        <line x1="140" y1="38" x2="140" y2="56" stroke="#94a3b8" strokeWidth="1.5" />
        <polyline points="137,51 140,56 143,51" stroke="#94a3b8" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
        
        <line x1="140" y1="94" x2="140" y2="112" stroke="#94a3b8" strokeWidth="1.5" />
        <polyline points="137,107 140,112 143,107" stroke="#94a3b8" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
        
        <line x1="140" y1="150" x2="140" y2="168" stroke="#94a3b8" strokeWidth="1.5" />
        <polyline points="137,163 140,168 143,163" stroke="#94a3b8" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
        
        <line x1="140" y1="206" x2="140" y2="224" stroke="#94a3b8" strokeWidth="1.5" />
        <polyline points="137,219 140,224 143,219" stroke="#94a3b8" strokeWidth="1.5" fill="none" strokeLinejoin="round" />

        <line x1="140" y1="262" x2="140" y2="280" stroke="#94a3b8" strokeWidth="1.5" />
        <polyline points="137,275 140,280 143,275" stroke="#94a3b8" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
        
        <line x1="205" y1="299" x2="280" y2="299" stroke="#94a3b8" strokeWidth="1.5" />
        <line x1="280" y1="299" x2="280" y2="262" stroke="#94a3b8" strokeWidth="1.5" />
        <polyline points="277,267 280,262 283,267" stroke="#94a3b8" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
        
        <line x1="280" y1="224" x2="280" y2="159" stroke="#94a3b8" strokeWidth="1.5" />
        <line x1="280" y1="159" x2="140" y2="159" stroke="#94a3b8" strokeWidth="1.5" />
        
        <line x1="140" y1="318" x2="140" y2="348" stroke="#94a3b8" strokeWidth="1.5" />
        <polyline points="137,343 140,348 143,343" stroke="#94a3b8" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
        
        <line x1="140" y1="386" x2="140" y2="404" stroke="#94a3b8" strokeWidth="1.5" />
        <polyline points="137,399 140,404 143,399" stroke="#94a3b8" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      </svg>

      <div className="absolute left-[75px] top-[0px] w-[130px] h-[38px] flex items-center justify-center z-10">{s({ id: 'p3_s1', type: 'slot' })}</div>
      <div className="absolute left-[75px] top-[56px] w-[130px] h-[38px] flex items-center justify-center z-10">{s({ id: 'p3_s_new', type: 'slot' })}</div>
      <div className="absolute left-[75px] top-[112px] w-[130px] h-[38px] flex items-center justify-center z-10">{s({ id: 'p3_s2', type: 'slot' })}</div>
      <div className="absolute left-[75px] top-[168px] w-[130px] h-[38px] flex items-center justify-center z-10">{s(slot3)}</div>
      <div className="absolute left-[75px] top-[224px] w-[130px] h-[38px] flex items-center justify-center z-10">{s(slot4)}</div>
      <div className="absolute left-[75px] top-[280px] w-[130px] h-[38px] flex items-center justify-center z-10">{s(slot5)}</div>
      <div className="absolute left-[215px] top-[224px] w-[130px] h-[38px] flex items-center justify-center z-10">{s(returnSlot)}</div>
      <div className="absolute left-[75px] top-[348px] w-[130px] h-[38px] flex items-center justify-center z-10">{s({ id: 'p3_s7', type: 'slot' })}</div>
      <div className="absolute left-[75px] top-[404px] w-[130px] h-[38px] flex items-center justify-center z-10">{s({ id: 'p3_s8', type: 'slot' })}</div>

      <div className="absolute left-[215px] top-[284px] z-20">
        <span className="text-[8px] font-bold text-rose-700 bg-rose-50 border border-rose-300 rounded-full px-1.5 py-0.5 shadow-2xs">아니오 (No)</span>
      </div>
      <div className="absolute left-[150px] top-[322px] z-20">
        <span className="text-[8px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-300 rounded-full px-1.5 py-0.5 shadow-2xs">예 (Yes)</span>
      </div>
    </div>
  );
};

// ==================== 4번 문제 전용 정밀 순서도 ====================
const Problem4Flowchart = ({ slots, problem, handleShapeChange }) => {
  const s = (id) => {
    const node = { id, type: 'slot' };
    return <SlotNode node={node} slots={slots} problem={problem} handleShapeChange={handleShapeChange} />;
  };

  return (
    <div className="relative w-[390px] h-[525px] my-1 select-none mx-auto">
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
        <line x1="195" y1="38" x2="195" y2="56" stroke="#94a3b8" strokeWidth="1.5" />
        <polyline points="192,51 195,56 198,51" stroke="#94a3b8" strokeWidth="1.5" fill="none" strokeLinejoin="round" />

        <line x1="195" y1="94" x2="195" y2="112" stroke="#94a3b8" strokeWidth="1.5" />
        <polyline points="192,107 195,112 198,107" stroke="#94a3b8" strokeWidth="1.5" fill="none" strokeLinejoin="round" />

        <line x1="195" y1="150" x2="195" y2="182" stroke="#94a3b8" strokeWidth="1.5" />
        <polyline points="192,177 195,182 198,177" stroke="#94a3b8" strokeWidth="1.5" fill="none" strokeLinejoin="round" />

        <line x1="260" y1="131" x2="325" y2="131" stroke="#94a3b8" strokeWidth="1.5" />
        <line x1="325" y1="131" x2="325" y2="182" stroke="#94a3b8" strokeWidth="1.5" />
        <polyline points="322,177 325,182 328,177" stroke="#94a3b8" strokeWidth="1.5" fill="none" strokeLinejoin="round" />

        <line x1="195" y1="220" x2="195" y2="268" stroke="#94a3b8" strokeWidth="1.5" />
        <line x1="325" y1="220" x2="325" y2="242" stroke="#94a3b8" strokeWidth="1.5" />
        <line x1="325" y1="242" x2="195" y2="242" stroke="#94a3b8" strokeWidth="1.5" />
        <polyline points="192,263 195,268 198,263" stroke="#94a3b8" strokeWidth="1.5" fill="none" strokeLinejoin="round" />

        <line x1="195" y1="306" x2="195" y2="336" stroke="#94a3b8" strokeWidth="1.5" />
        <polyline points="192,331 195,336 198,331" stroke="#94a3b8" strokeWidth="1.5" fill="none" strokeLinejoin="round" />

        <line x1="130" y1="355" x2="65" y2="355" stroke="#94a3b8" strokeWidth="1.5" />
        <line x1="65" y1="355" x2="65" y2="306" stroke="#94a3b8" strokeWidth="1.5" />
        <polyline points="62,311 65,306 68,311" stroke="#94a3b8" strokeWidth="1.5" fill="none" strokeLinejoin="round" />

        <line x1="65" y1="268" x2="65" y2="242" stroke="#94a3b8" strokeWidth="1.5" />
        <line x1="65" y1="242" x2="195" y2="242" stroke="#94a3b8" strokeWidth="1.5" />

        <line x1="195" y1="374" x2="195" y2="408" stroke="#94a3b8" strokeWidth="1.5" />
        <polyline points="192,403 195,408 198,403" stroke="#94a3b8" strokeWidth="1.5" fill="none" strokeLinejoin="round" />

        <line x1="195" y1="446" x2="195" y2="472" stroke="#94a3b8" strokeWidth="1.5" />
        <polyline points="192,467 195,472 198,467" stroke="#94a3b8" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      </svg>

      <div className="absolute left-[130px] top-[0px] w-[130px] h-[38px] flex items-center justify-center z-10">{s('p4_s1')}</div>
      <div className="absolute left-[130px] top-[56px] w-[130px] h-[38px] flex items-center justify-center z-10">{s('p4_s2')}</div>
      <div className="absolute left-[130px] top-[112px] w-[130px] h-[38px] flex items-center justify-center z-10">{s('p4_s3')}</div>
      
      <div className="absolute left-[270px] top-[116px] z-20">
        <span className="text-[8px] font-bold text-rose-700 bg-rose-50 border border-rose-300 rounded-full px-1.5 py-0.5 shadow-2xs">아니오 (No)</span>
      </div>
      <div className="absolute left-[205px] top-[156px] z-20">
        <span className="text-[8px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-300 rounded-full px-1.5 py-0.5 shadow-2xs">예 (Yes)</span>
      </div>

      <div className="absolute left-[130px] top-[182px] w-[130px] h-[38px] flex items-center justify-center z-10">{s('p4_s4')}</div>
      <div className="absolute left-[260px] top-[182px] w-[130px] h-[38px] flex items-center justify-center z-10">{s('p4_s5')}</div>
      <div className="absolute left-[0px] top-[268px] w-[130px] h-[38px] flex items-center justify-center z-10">{s('p4_s8')}</div>
      <div className="absolute left-[130px] top-[268px] w-[130px] h-[38px] flex items-center justify-center z-10">{s('p4_s6')}</div>
      <div className="absolute left-[130px] top-[336px] w-[130px] h-[38px] flex items-center justify-center z-10">{s('p4_s7')}</div>

      <div className="absolute left-[80px] top-[340px] z-20">
        <span className="text-[8px] font-bold text-rose-700 bg-rose-50 border border-rose-300 rounded-full px-1.5 py-0.5 shadow-2xs">아니오 (No)</span>
      </div>
      <div className="absolute left-[205px] top-[380px] z-20">
        <span className="text-[8px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-300 rounded-full px-1.5 py-0.5 shadow-2xs">예 (Yes)</span>
      </div>

      <div className="absolute left-[130px] top-[408px] w-[130px] h-[38px] flex items-center justify-center z-10">{s('p4_s9')}</div>
      <div className="absolute left-[130px] top-[472px] w-[130px] h-[38px] flex items-center justify-center z-10">{s('p4_s10')}</div>
    </div>
  );
};

export default function Practice({ problems, completedIds, onComplete }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const rawProblem = problems.find((p) => p.id === id);
  const initProblem = initialProblems.find((p) => p.id === id);
  const problem = rawProblem
    ? (initProblem ? { ...rawProblem, ...initProblem, skeleton: rawProblem.skeleton || initProblem.skeleton } : rawProblem)
    : null;

  const [palette, setPalette] = useState([]);
  const [slots, setSlots] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isFlowchartModalOpen, setIsFlowchartModalOpen] = useState(false);

  const FLOWCHART_SYMBOLS = [
    { name: '단말', icon: 'oval', desc: '순서도의 시작과 끝을 표시할 때 사용', color: 'bg-emerald-100 border-emerald-400' },
    { name: '입출력', icon: 'parallelogram', desc: '데이터의 입력과 출력에 사용', color: 'bg-amber-100 border-amber-400' },
    { name: '처리', icon: 'rectangle', desc: '데이터의 연산과 같은 처리에 사용', color: 'bg-cyan-100 border-cyan-400' },
    { name: '판단', icon: 'diamond', desc: '조건에 따른 비교, 판단에 사용', color: 'bg-rose-100 border-rose-400' },
    { name: '흐름선', icon: 'arrow', desc: '실행의 흐름을 나타낼 때 사용', color: 'bg-slate-100 border-slate-300' }
  ];

  // 문장 블록들을 무작위(랜덤)로 섞는 Fisher-Yates 셔플 함수
  const shuffleBlocks = (blocks) => {
    if (!blocks || !Array.isArray(blocks)) return [];
    const shuffled = [...blocks];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // 문제 변경 시 또는 블록 데이터 로드 시 팔레트 초기화
  useEffect(() => {
    if (problem && problem.blocks) {
      setPalette(shuffleBlocks(problem.blocks));
      setSlots({});
      setIsSuccess(false);
      setErrorMsg('');
    }
  }, [id, problem?.blocks?.length]);

  // problem.blocks 내용(텍스트)이 수정된 경우 팔레트에 있는 블록 텍스트도 동기화
  useEffect(() => {
    if (problem && problem.blocks) {
      setPalette((prev) =>
        prev.map((b) => {
          const fresh = problem.blocks.find((fb) => fb.id === b.id);
          return fresh ? { ...b, text: fresh.text } : b;
        })
      );
    }
  }, [problem?.blocks]);

  if (!problem) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-slate-400 text-lg mb-4">문제를 찾을 수 없습니다.</p>
        <button onClick={() => navigate('/')} className="btn-primary">홈으로</button>
      </div>
    );
  }

  const onDragEnd = ({ source, destination }) => {
    if (!destination) return;
    const srcId = source.droppableId;
    const destId = destination.droppableId;
    if (srcId === destId) return;
    let newPalette = [...palette];
    let newSlots = { ...slots };
    let draggedBlock;
    if (srcId === 'palette') {
      draggedBlock = newPalette[source.index];
      newPalette.splice(source.index, 1);
    } else {
      draggedBlock = problem.blocks.find(b => b.id === newSlots[srcId].blockId);
      delete newSlots[srcId];
    }
    if (destId === 'palette') {
      newPalette.push(draggedBlock);
    } else {
      const existing = newSlots[destId];
      if (existing) {
        const old = problem.blocks.find(b => b.id === existing.blockId);
        if (old) newPalette.push(old);
      }
      newSlots[destId] = { blockId: draggedBlock.id, shape: null };
    }
    setPalette(newPalette);
    setSlots(newSlots);
    setErrorMsg('');
  };

  const handleShapeChange = (slotId, shapeType) =>
    setSlots(prev => ({ ...prev, [slotId]: { ...prev[slotId], shape: shapeType } }));

  const handleCheck = () => {
    const allCorrect = Object.entries(problem.correctAnswers).every(([slotId, ans]) => {
      const u = slots[slotId];
      return u && u.blockId === ans.blockId && u.shape === ans.type;
    });
    if (allCorrect) { setIsSuccess(true); onComplete(problem.id); }
    else setErrorMsg('정답이 아닙니다! 문장이나 도형 기호가 틀린 곳이 있습니다.');
  };

  const renderNodes = (nodes) => (
    <div className="flex flex-col items-center w-full">
      {nodes.map((node, i) => {
        const key = node.id ?? `${node.type}-${i}`;
        if (node.type === 'slot') {
          return (
            <div key={key} className="my-0.5 flex justify-center w-full">
              <SlotNode node={node} slots={slots} problem={problem} handleShapeChange={handleShapeChange} />
            </div>
          );
        }
        if (node.type === 'arrow') {
          return (
            <div key={key} className="my-0 flex justify-center w-full">
              <ArrowDown />
            </div>
          );
        }
        if (node.type === 'split')       return <SplitNode key={key} node={node} renderNodes={renderNodes} />;
        if (node.type === 'loop_branch') return <LoopBranchNode key={key} node={node} renderNodes={renderNodes} />;
        return null;
      })}
    </div>
  );

  if (isSuccess) {
    return (
      <div className="h-full w-full flex flex-col p-4 overflow-hidden">
        <div className="relative w-full max-w-[820px] mx-auto flex-1 flex flex-col min-h-0 items-center justify-center">
          <div className="card-bento p-8 text-center bg-white shadow-2xl rounded-3xl border border-indigo-100 animate-fade-up">
            <div className="inline-flex p-4 rounded-full bg-amber-100 text-amber-500 mb-4 animate-bounce"><Trophy size={44} /></div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">정답입니다!</h2>
            <p className="text-slate-600 mb-8">완벽하게 순서도를 구성하셨네요!</p>
            <button onClick={() => navigate('/practice')} className="btn-primary w-full">목록으로 돌아가기</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col px-3 pt-2 pb-2 overflow-hidden">
      <div className="relative w-full max-w-[1240px] mx-auto flex-1 flex flex-col min-h-0">
        {/* 카드보드 왼쪽 변 상단: 목록으로 이동 버튼 */}
        <button
          onClick={() => navigate('/practice')}
          className="absolute top-0 -left-3 -translate-x-full flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 bg-white/90 hover:bg-white border border-slate-200/90 px-3 py-1.5 rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer z-50 whitespace-nowrap"
        >
          <ArrowLeft size={13} /> 목록으로
        </button>

        {/* Home과 동일한 card-bento 카드보드 (4열 확장형) */}
        <div className="card-bento !p-0 w-full bg-white shadow-2xl relative overflow-hidden flex flex-col rounded-3xl border border-indigo-100 flex-1 min-h-0">

          {/* 카드 헤더: 적절한 균형 잡힌 상하 여백 */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xl shrink-0">{problem.emoji}</span>
              <h1 className="text-base font-black text-slate-800 leading-tight truncate">{problem.title}</h1>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsGuideOpen(true)}
                className="flex items-center gap-1 text-xs font-bold text-indigo-700 hover:text-indigo-900 border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-xl transition-colors cursor-pointer shadow-2xs"
                title="학습 가이드 확인"
              >
                <span>💡</span> 가이드
              </button>
              <button
                onClick={() => setIsFlowchartModalOpen(true)}
                className="flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-900 border border-teal-200 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded-xl transition-colors cursor-pointer shadow-2xs"
                title="순서도 기호 의미 확인"
              >
                <span>📊</span> 순서도
              </button>
              <button
                onClick={() => { setPalette(shuffleBlocks(problem.blocks)); setSlots({}); setErrorMsg(''); }}
                className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900 border border-slate-200 bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded-xl transition-colors cursor-pointer shadow-2xs"
              >
                <RotateCcw size={12} /> 블록 초기화
              </button>
            </div>
          </div>

          {/* 4개 개별 카드블록 본문: 1열(문제 추상화) | 2열(자연어 알고리즘) | 3열(문장 블록) | 4열(순서도 완성) */}
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex-1 grid grid-cols-[260px_210px_220px_1fr] gap-2.5 p-2.5 bg-slate-50/60 overflow-hidden min-h-0">

              {/* [카드블록 1]: 문제 추상화 */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                <div className="px-3.5 py-2 border-b border-slate-100 bg-white flex items-center justify-between shrink-0">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <span>🔍</span> 문제 추상화
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded-md">
                    이해 및 분석
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar bg-white">
                  {/* 1) 문제 상황 */}
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                    <div className="text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
                      <span>📌</span> 상황 설명
                    </div>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed whitespace-pre-line break-keep">
                      {problem.description?.replace(/10,000원을,\s*\n/g, '10,000원을, ')}
                    </p>
                  </div>

                  {/* 2) 상태 정의 */}
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
                    <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <span>🔄</span> 상태 정의
                    </div>
                    <div className="flex flex-col gap-1.5 text-xs">
                      <div className="bg-white p-2 rounded-lg border border-slate-200 flex items-start gap-1.5">
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-1.5 h-5 flex items-center justify-center rounded shrink-0">초기</span>
                        <span className="text-slate-700 font-medium break-keep leading-5">{(problem.initialState || []).join(', ')}</span>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-slate-200 flex items-start gap-1.5">
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-1.5 h-5 flex items-center justify-center rounded shrink-0">목표</span>
                        <span className="text-slate-700 font-medium break-keep leading-5">{(problem.goalState || []).join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  {/* 3) IPO 분석 */}
                  {problem.ipo && (
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
                      <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                        <span>⚙️</span> IPO 분석
                      </div>
                      <div className="space-y-1.5">
                        <div className="bg-white p-2 rounded-lg border border-slate-200 flex items-start gap-1.5 text-xs">
                          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-1.5 h-5 flex items-center justify-center rounded shrink-0">입력</span>
                          <span className="text-slate-600 font-medium leading-5 break-keep">{(problem.ipo.input || []).join(', ')}</span>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-slate-200 flex items-start gap-1.5 text-xs">
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-100 px-1.5 h-5 flex items-center justify-center rounded shrink-0">처리</span>
                          <span className="text-slate-600 font-medium leading-5 break-keep">{(problem.ipo.process || []).join(', ')}</span>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-slate-200 flex items-start gap-1.5 text-xs">
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-1.5 h-5 flex items-center justify-center rounded shrink-0">출력</span>
                          <span className="text-slate-600 font-medium leading-5 break-keep">{(problem.ipo.output || []).join(', ')}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* [카드블록 2]: 자연어 알고리즘 */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                <div className="px-3.5 py-2 border-b border-slate-100 bg-white flex items-center justify-between shrink-0">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <span>📝</span> 자연어 알고리즘
                  </span>
                  {problem.algorithm && (
                    <span className="text-[10px] font-bold text-slate-600 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded-md">
                      {problem.algorithm.length}단계
                    </span>
                  )}
                </div>
                <div className="flex-1 overflow-y-auto p-2.5 space-y-2 custom-scrollbar bg-white">
                  {problem.algorithm && (
                    <ol className="space-y-2">
                      {problem.algorithm.map((step, i) => {
                        const hasBranches = step.includes('(예)') || step.includes('(아니오)');
                        if (!hasBranches) {
                          return (
                            <li key={i} className="flex items-start gap-1.5 p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
                              <span className="shrink-0 w-4 h-4 rounded-full bg-indigo-50 text-indigo-700 font-bold text-[9px] flex items-center justify-center mt-0.5">
                                {i + 1}
                              </span>
                              <span className="text-xs text-slate-700 leading-snug font-medium break-keep">
                                {step}
                              </span>
                            </li>
                          );
                        }

                        // 조건식과 (예), (아니오) 분리 파싱
                        const lines = step.split('\n').map(l => l.trim()).filter(Boolean);
                        const conditionTitle = lines[0] || '';
                        const branchLines = lines.slice(1);

                        return (
                          <li key={i} className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
                            <div className="flex items-start gap-1.5">
                              <span className="shrink-0 w-4 h-4 rounded-full bg-indigo-50 text-indigo-700 font-bold text-[9px] flex items-center justify-center mt-0.5">
                                {i + 1}
                              </span>
                              <span className="text-xs text-slate-700 font-medium leading-snug break-keep">
                                {conditionTitle}
                              </span>
                            </div>

                            {/* 조건식 안의 (예)/(아니오) 카드보드 컨테이너 */}
                            <div className="space-y-2 pt-0.5">
                              {branchLines.map((branch, bIdx) => {
                                const isYes = branch.includes('(예)');
                                const isNo = branch.includes('(아니오)');
                                const cleanText = branch.replace(/^[•\-\*\s]+/, '').replace(/^\((?:예|아니오)\):\s*/, '');

                                return (
                                  <div
                                    key={bIdx}
                                    className={`p-2 rounded-xl border text-xs shadow-2xs flex flex-col gap-1.5 ${
                                      isYes
                                        ? 'bg-emerald-50/40 border-emerald-200 text-emerald-950'
                                        : isNo
                                        ? 'bg-amber-50/40 border-amber-200 text-amber-950'
                                        : 'bg-slate-50 border-slate-200 text-slate-700'
                                    }`}
                                  >
                                    {/* 실행 내용 카드보드 위쪽에 배치된 뱃지 */}
                                    <div className="flex items-center">
                                      <span
                                        className={`text-[10px] font-black px-1.5 py-0.5 rounded-md shadow-2xs leading-none ${
                                          isYes
                                            ? 'bg-emerald-600 text-white'
                                            : isNo
                                            ? 'bg-amber-600 text-white'
                                            : 'bg-slate-500 text-white'
                                        }`}
                                      >
                                        {isYes ? '예' : isNo ? '아니오' : '분기'}
                                      </span>
                                    </div>
                                    <p className="font-medium leading-snug break-keep">
                                      {cleanText}
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                          </li>
                        );
                      })}
                    </ol>
                  )}
                </div>
              </div>

              {/* [카드블록 3]: 문장 블록 팔레트 */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                <div className="px-3.5 py-2 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <span>🧩</span> 문장 블록
                  </span>
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded-md">
                    {palette.length}개 남음
                  </span>
                </div>
                <Droppable droppableId="palette" direction="vertical">
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="flex-1 overflow-y-auto flex flex-col gap-1.5 p-2.5 min-h-[80px] custom-scrollbar bg-white"
                    >
                      {palette.map((block, index) => (
                        <Draggable key={block.id} draggableId={block.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`px-2.5 py-2 bg-white rounded-xl border text-xs font-medium text-center leading-snug transition-all cursor-grab active:cursor-grabbing select-none whitespace-pre-line
                                ${snapshot.isDragging
                                  ? 'border-indigo-400 shadow-xl ring-2 ring-indigo-300 scale-102 bg-indigo-50 z-50'
                                  : 'border-slate-200 shadow-2xs hover:border-slate-300 hover:shadow-xs hover:-translate-y-0.5'
                                }`}
                            >
                              {block.text}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {palette.length === 0 && (
                        <div className="flex-1 flex items-center justify-center p-3">
                          <p className="text-slate-400 text-xs text-center font-medium">모든 블록 배치 완료 ✓</p>
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>

              {/* [카드블록 4]: 순서도 캔버스 */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                <div className="px-3.5 py-2 border-b border-slate-100 shrink-0 flex items-center justify-between bg-white">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <span>📊</span> 순서도 완성
                  </span>
                  <span className="text-[10px] text-slate-400">도형 기호 선택</span>
                </div>
                <div className="flex-1 overflow-y-auto flex justify-center p-2 custom-scrollbar bg-slate-50/30">
                  <div className="w-full max-w-[380px]">
                    {problem.id === 'problem_02' ? (
                      <Problem2Flowchart slots={slots} problem={problem} handleShapeChange={handleShapeChange} />
                    ) : problem.id === 'problem_03' ? (
                      <Problem3Flowchart slots={slots} problem={problem} handleShapeChange={handleShapeChange} />
                    ) : problem.id === 'problem_04' ? (
                      <Problem4Flowchart slots={slots} problem={problem} handleShapeChange={handleShapeChange} />
                    ) : (
                      renderNodes(problem.skeleton)
                    )}
                  </div>
                </div>
                <div className="shrink-0 border-t border-slate-100 px-3 py-2 flex flex-col gap-1.5 bg-white">
                  {errorMsg && (
                    <div className="text-rose-600 text-xs text-center bg-rose-50 border border-rose-200 px-2 py-1 rounded-lg font-medium">
                      ⚠️ {errorMsg}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCheck}
                      disabled={Object.keys(slots).length !== Object.keys(problem.correctAnswers).length}
                      className="btn-primary py-1.5 px-3 text-xs flex-1 flex items-center justify-center gap-1.5 disabled:opacity-40 shadow-2xs cursor-pointer rounded-xl font-bold"
                    >
                      <CheckCircle2 size={13} /> 정답 확인
                    </button>
                    <span className="text-xs text-slate-400 font-bold whitespace-nowrap bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                      {Object.keys(slots).length}/{Object.keys(problem.correctAnswers).length}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </DragDropContext>

        </div>
      </div>

      {/* 가이드 설명 팝업 모달 */}
      {isGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-indigo-100 w-full max-w-md overflow-hidden flex flex-col animate-scale-up">
            {/* 헤더 */}
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <div className="flex items-center gap-2">
                <span className="text-xl">💡</span>
                <h2 className="text-sm sm:text-base font-black text-slate-800">실생활 문제 해결 가이드</h2>
              </div>
              <button
                onClick={() => setIsGuideOpen(false)}
                className="w-8 h-8 rounded-xl hover:bg-slate-200/60 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                title="닫기"
              >
                <X size={18} />
              </button>
            </div>

            {/* 내용 */}
            <div className="p-5 space-y-3.5 text-xs sm:text-sm text-slate-700">
              <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-2xl">
                <p className="font-bold text-indigo-950 leading-relaxed break-keep">
                  좌측의 <span className="text-indigo-600 font-black underline">문제 추상화</span>와 <span className="text-indigo-600 font-black underline">자연어 알고리즘</span> 순서를 참고하여 문제를 해결해보세요.
                </p>
              </div>

              <ol className="space-y-2.5 font-medium leading-snug break-keep">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                  <span className="break-keep"><strong>문장 블록</strong>을 드래그하여 우측 <strong>순서도 빈칸</strong>에 올바른 순서대로 배치합니다.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                  <span className="break-keep">배치된 블록 하단의 기호 목록 중 알맞은 <strong>도형 기호</strong>(단말, 입출력, 처리, 판단)를 선택합니다.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                  <span className="break-keep">모든 슬롯이 완성되면 하단의 <strong>[정답 확인]</strong> 버튼을 눌러 채점합니다.</span>
                </li>
              </ol>
            </div>

            {/* 푸터 */}
            <div className="p-3.5 bg-slate-50/80 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setIsGuideOpen(false)}
                className="btn-primary py-2 px-5 text-xs font-bold rounded-xl shadow-xs cursor-pointer"
              >
                확인 및 계속 풀기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 순서도 기호 안내 모달 */}
      {isFlowchartModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-indigo-100 w-full max-w-lg overflow-hidden flex flex-col animate-scale-up">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <div className="flex items-center gap-2">
                <span className="text-xl">📊</span>
                <h2 className="text-sm sm:text-base font-black text-slate-800">순서도 기호 의미</h2>
              </div>
              <button
                onClick={() => setIsFlowchartModalOpen(false)}
                className="w-8 h-8 rounded-xl hover:bg-slate-200/60 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                title="닫기"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="p-4 sm:p-5 overflow-x-auto text-left">
              <table className="w-full min-w-[280px] border-collapse text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-200/60 text-[11px] sm:text-xs font-bold text-slate-600">
                    <th className="py-2 px-2 text-center w-[20%]">기호</th>
                    <th className="py-2 px-2 text-center w-[25%]">도형</th>
                    <th className="py-2 px-3 text-center">의미</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {FLOWCHART_SYMBOLS.map((sym, i) => (
                    <tr key={i} className="hover:bg-slate-50/40 transition-colors">
                      <td className="py-2 px-2 text-center border-r border-slate-100">
                        <span className="text-xs sm:text-sm font-bold text-slate-800">{sym.name}</span>
                      </td>
                      <td className="py-2 px-2 text-center border-r border-slate-100">
                        <div className="flex items-center justify-center">
                          {sym.icon === 'oval' && <div className={`w-10 h-5 rounded-full border-2 ${sym.color} shadow-2xs`} />}
                          {sym.icon === 'parallelogram' && <div className={`w-10 h-5 border-2 ${sym.color} shadow-2xs -skew-x-[20deg]`} />}
                          {sym.icon === 'rectangle' && <div className={`w-10 h-5 border-2 ${sym.color} shadow-2xs rounded-none`} />}
                          {sym.icon === 'diamond' && (
                            <div className="w-5 h-5 flex items-center justify-center">
                              <div className={`w-4 h-4 border-2 ${sym.color} shadow-2xs rotate-45 transform`} />
                            </div>
                          )}
                          {sym.icon === 'arrow' && (
                            <svg className="w-6 h-3 text-slate-700" viewBox="0 0 32 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="2" y1="8" x2="28" y2="8" />
                              <polyline points="22 2 28 8 22 14" fill="none" />
                            </svg>
                          )}
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <span className="text-xs sm:text-sm font-medium text-slate-700 break-keep leading-tight">{sym.desc}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-3.5 bg-slate-50/80 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setIsFlowchartModalOpen(false)}
                className="btn-primary py-2 px-5 text-xs font-bold rounded-xl shadow-xs cursor-pointer"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

