import React, { useMemo, useState } from 'react';
import './partial-topics.css';

const splitSet = (value) => [...new Set(value.split(/[\s,;]+/).filter(Boolean))].sort();
const joinWords = (a, b) => [...new Set(a.flatMap(x => b.map(y => x + y)))].sort();

function LanguageOperations() {
  const [aText, setA] = useState('ε, a, ab');
  const [bText, setB] = useState('b, ab');
  const [op, setOp] = useState('union');
  const a = splitSet(aText), b = splitSet(bText);
  const epsilon = (word) => word === 'ε' ? '' : word;
  const result = useMemo(() => {
    const A = a.map(epsilon), B = b.map(epsilon);
    if (op === 'union') return [...new Set([...A, ...B])].sort();
    if (op === 'intersection') return A.filter(x => B.includes(x)).sort();
    if (op === 'difference') return A.filter(x => !B.includes(x)).sort();
    if (op === 'concat') return joinWords(A, B).map(x => x || 'ε');
    return [...new Set(A.flatMap(x => B.filter(y => x.endsWith(y)).map(y => x.slice(0, -y.length))))].sort().map(x => x || 'ε');
  }, [aText, bText, op]);
  const names = { union: 'Suma (A ∪ B)', intersection: 'Przecięcie (A ∩ B)', difference: 'Różnica (A \\ B)', concat: 'Konkatenacja (AB)', quotient: 'Prawy iloraz (A / B)' };
  return <div className="pt-grid">
    <div className="pt-card"><label>Język A<input value={aText} onChange={e => setA(e.target.value)} /></label><label>Język B<input value={bText} onChange={e => setB(e.target.value)} /></label>
      <label>Operacja<select value={op} onChange={e => setOp(e.target.value)}>{Object.entries(names).map(([k,v]) => <option key={k} value={k}>{v}</option>)}</select></label>
      <p className="pt-hint">Wpisz skończone zbiory słów, rozdzielając elementy przecinkami. Zapis ε oznacza słowo puste.</p></div>
    <div className="pt-result"><span className="pt-kicker">WYNIK OPERACJI</span><h3>{names[op]}</h3><code>{`{ ${result.map(x => x === '' ? 'ε' : x).join(', ') || '∅'} }`}</code><p>{op === 'quotient' ? 'A / B = {x : istnieje y ∈ B, xy ∈ A}. To obliczenie jest ograniczone do słów podanych w A i B.' : 'Wynik jest dokładny dla podanych, skończonych zbiorów.'}</p></div>
  </div>;
}

const automaton = {
  states: ['q0', 'q1', 'q2'], alphabet: ['a', 'b'], start: 'q0', final: ['q2'],
  transitions: { q0: { a: ['q0', 'q1'], b: ['q0'] }, q1: { b: ['q2'] }, q2: {} },
  eps: { q0: ['q1'] }
};
function closure(states) {
  const result = new Set(states), todo = [...states];
  while (todo.length) for (const next of (automaton.eps[todo.pop()] || [])) if (!result.has(next)) { result.add(next); todo.push(next); }
  return [...result].sort();
}
function AutomatonSimulator() {
  const [word, setWord] = useState('aab');
  const [ran, setRan] = useState(false);
  const rows = [];
  let current = closure([automaton.start]);
  rows.push({ input: '—', states: current.join(', '), note: 'stan początkowy i ε-domknięcie' });
  for (const symbol of word) {
    if (!automaton.alphabet.includes(symbol)) { rows.push({ input: symbol, states: '—', note: `symbol spoza alfabetu {${automaton.alphabet.join(', ')}}` }); current = []; continue; }
    const moved = current.flatMap(q => automaton.transitions[q]?.[symbol] || []);
    current = closure(moved);
    rows.push({ input: symbol, states: current.join(', ') || '∅', note: 'przejście, następnie ε-domknięcie' });
  }
  const accepted = current.some(q => automaton.final.includes(q));
  const move = (subset, symbol) => closure(subset.flatMap(q => automaton.transitions[q]?.[symbol] || []));
  const dfa = [], dfaTransitions = {}, queue = [closure([automaton.start])];
  while (queue.length) {
    const subset = queue.shift(), name = subset.join(',') || '∅';
    if (dfa.includes(name)) continue;
    dfa.push(name); dfaTransitions[name] = {};
    for (const symbol of automaton.alphabet) {
      const target = move(subset, symbol), targetName = target.join(',') || '∅';
      dfaTransitions[name][symbol] = targetName;
      if (!dfa.includes(targetName) && !queue.some(s => (s.join(',') || '∅') === targetName)) queue.push(target);
    }
  }
  let partitions = [dfa.filter(name => name.split(',').some(q => automaton.final.includes(q))), dfa.filter(name => !name.split(',').some(q => automaton.final.includes(q)))].filter(group => group.length);
  let changed = true;
  while (changed) {
    changed = false; const next = [];
    for (const group of partitions) {
      const buckets = new Map();
      for (const name of group) {
        const signature = automaton.alphabet.map(symbol => partitions.findIndex(part => part.includes(dfaTransitions[name][symbol]))).join('|');
        if (!buckets.has(signature)) buckets.set(signature, []);
        buckets.get(signature).push(name);
      }
      next.push(...buckets.values()); if (buckets.size > 1) changed = true;
    }
    partitions = next;
  }
  return <div className="pt-grid">
    <div className="pt-card"><span className="pt-kicker">NFA Z ε-PRZEJŚCIEM</span><p>Stany: <b>q0, q1, q2</b> · start: <b>q0</b> · akceptujący: <b>q2</b></p><p>Przejścia: q0 —a→ {`{q0,q1}`}, q0 —b→ {`{q0}`}, q1 —b→ {`{q2}`} · q0 —ε→ {`{q1}`}</p><label>Słowo do sprawdzenia<input value={word} onChange={e => { setWord(e.target.value); setRan(false); }} /></label><button className="pt-button" onClick={() => setRan(true)}>Uruchom symulację</button>
      {ran && <div className={`pt-verdict ${accepted ? 'yes' : 'no'}`}>{accepted ? 'Słowo zaakceptowane' : 'Słowo odrzucone'}</div>}</div>
    <div className="pt-result"><span className="pt-kicker">ŚLAD, DETERMINIZACJA I MINIMALIZACJA</span><div className="pt-table"><div className="pt-row pt-head"><span>Wejście</span><span>Aktywne stany</span><span>Operacja</span></div>{rows.map((r,i)=><div className="pt-row" key={i}><span>{r.input}</span><span>{r.states}</span><span>{r.note}</span></div>)}</div><p>ε-domknięcie jest liczone po każdym przejściu. Konstrukcja podzbiorów daje <b>{dfa.length}</b> osiągalne stany DFA złożone z: {dfa.map(name => `{${name}}`).join(', ')}. W najgorszym przypadku NFA z n stanami może dać do 2ⁿ stanów DFA.</p><div className="pt-table"><div className="pt-row pt-head"><span>Stan DFA</span><span>Po a / po b</span><span>Akceptujący?</span></div>{dfa.map(name=><div className="pt-row" key={name}><span>{`{${name}}`}</span><span>{dfaTransitions[name].a} / {dfaTransitions[name].b}</span><span>{name.split(',').some(q=>automaton.final.includes(q))?'tak':'nie'}</span></div>)}</div><p><b>Wynik minimalizacji przez podział na klasy nierozróżnialne:</b> {partitions.length} klasy: {partitions.map(group=>`{${group.join(' ≡ ')}}`).join(', ')}. Algorytm zaczyna od podziału akceptujące/nieakceptujące i rozszczepia klasy, gdy dla symbolu przejście prowadzi do różnych klas.</p></div>
  </div>;
}

function compileThompson(source) {
  const raw = source.replace(/\s/g, '');
  if (!raw || !/^[a-zA-Z0-9|()*]+$/.test(raw)) throw new Error('Użyj niepustego wyrażenia nad literami/cyframi oraz |, *, nawiasami.');
  const tokens = [];
  const ends = (x) => /[a-zA-Z0-9)]/.test(x) || x === '*';
  const starts = (x) => /[a-zA-Z0-9(]/.test(x);
  for (let i=0;i<raw.length;i++) { const x=raw[i], prev=raw[i-1]; if (i && ends(prev) && starts(x)) tokens.push('.'); tokens.push(x); }
  const output=[], operators=[], precedence={'|':1,'.':2};
  for (const t of tokens) {
    if (/[a-zA-Z0-9]/.test(t)) output.push(t);
    else if (t==='(') operators.push(t);
    else if (t===')') { while (operators.length && operators.at(-1)!=='(') output.push(operators.pop()); if (operators.pop()!=='(') throw new Error('Niedopasowane nawiasy.'); }
    else if (t==='*') output.push(t);
    else { while (operators.length && operators.at(-1)!=='(' && precedence[operators.at(-1)]>=precedence[t]) output.push(operators.pop()); operators.push(t); }
  }
  while(operators.length) { const op=operators.pop(); if(op==='(') throw new Error('Niedopasowane nawiasy.'); output.push(op); }
  const edges=[], stack=[]; let next=0;
  const state=()=>next++;
  for(const t of output) {
    if(/[a-zA-Z0-9]/.test(t)){const s=state(),e=state();edges.push({s,e,label:t});stack.push({start:s,end:e});}
    else if(t==='.') {const b=stack.pop(),a=stack.pop();if(!a||!b)throw new Error('Niepoprawna składnia wyrażenia.');edges.push({s:a.end,e:b.start,label:'ε'});stack.push({start:a.start,end:b.end});}
    else if(t==='|') {const b=stack.pop(),a=stack.pop();if(!a||!b)throw new Error('Niepoprawna składnia wyrażenia.');const s=state(),e=state();edges.push({s,e:a.start,label:'ε'},{s,e:b.start,label:'ε'},{s:a.end,e,label:'ε'},{s:b.end,e,label:'ε'});stack.push({start:s,end:e});}
    else if(t==='*') {const a=stack.pop();if(!a)throw new Error('Niepoprawna składnia wyrażenia.');const s=state(),e=state();edges.push({s,e,label:'ε'},{s,e:a.start,label:'ε'},{s:a.end,e:a.start,label:'ε'},{s:a.end,e,label:'ε'});stack.push({start:s,end:e});}
  }
  if(stack.length!==1) throw new Error('Niepoprawna składnia wyrażenia.');
  return {...stack[0],edges,states:next};
}
function runThompson(machine, word) {
  const closure=(states)=>{const out=new Set(states),todo=[...states];while(todo.length){const q=todo.pop();for(const e of machine.edges)if(e.s===q&&e.label==='ε'&&!out.has(e.e)){out.add(e.e);todo.push(e.e);}}return [...out];};
  let current=closure([machine.start]);
  for(const symbol of word){current=closure(current.flatMap(q=>machine.edges.filter(e=>e.s===q&&e.label===symbol).map(e=>e.e)));}
  return current.includes(machine.end);
}
function RegexBridge() {
  const [regex, setRegex] = useState('(a|b)*abb');
  const [word, setWord] = useState('aabb');
  let machine=null,error='';
  try { machine=compileThompson(regex); } catch(e) { error=e.message; }
  const matches=machine ? runThompson(machine,word) : false;
  return <div className="pt-grid"><div className="pt-card"><span className="pt-kicker">WYRAŻENIE → JĘZYK → NFA</span><label>Wyrażenie regularne<input value={regex} onChange={e => setRegex(e.target.value)} /></label><label>Słowo<input value={word} onChange={e => setWord(e.target.value)} /></label>{error ? <div className="pt-verdict no">{error}</div> : <div className={`pt-verdict ${matches ? 'yes' : 'no'}`}>{matches ? 'Słowo należy do języka' : 'Słowo nie należy do języka'}</div>}</div>
    <div className="pt-result"><span className="pt-kicker">KONSTRUKCJA THOMPSONA · {machine?.states ?? 0} STANÓW</span><div className="pt-table"><div className="pt-row pt-head"><span>Ze stanu</span><span>Etykieta</span><span>Do stanu</span></div>{machine?.edges.map((e,i)=><div className="pt-row" key={i}><span>q{e.s}</span><span>{e.label}</span><span>q{e.e}</span></div>)}</div><p>Przejścia ε łączą fragmenty dla alternatywy, konkatenacji i gwiazdki. Test słowa jest wykonywany na zbudowanym NFA z uwzględnieniem ε-domknięcia.</p><p><b>Twierdzenie Kleene’ego:</b> każde wyrażenie regularne opisuje język rozpoznawany przez automat skończony i każdy język regularny ma opis regexem. Dopełnienie uzyskuje się przez dopełnienie stanów akceptujących kompletnego DFA, a przecięcie przez iloczyn automatów.</p></div></div>;
}

function RegularGrammar() {
  const [word, setWord] = useState('aaab');
  const accepts = /^a*b$/.test(word);
  return <div className="pt-grid"><div className="pt-card"><span className="pt-kicker">GRAMATYKA PRAWOstronna (TYPE 3)</span><div className="pt-grammar">S → aS<br/>S → b</div><p>Nieterminal S jest stanem startowym. Produkcja S → aS daje pętlę po a; produkcja S → b prowadzi do stanu akceptującego F.</p><label>Słowo<input value={word} onChange={e => setWord(e.target.value)} /></label><div className={`pt-verdict ${accepts ? 'yes' : 'no'}`}>{accepts ? 'Słowo generowane przez gramatykę' : 'Słowo nie jest generowane'}</div></div>
    <div className="pt-result"><span className="pt-kicker">RÓWNOWAŻNY DFA</span><div className="pt-grammar">S —a→ S<br/>S —b→ F<br/>F —a,b→ ⊥<br/>⊥ —a,b→ ⊥</div><p>Automat akceptuje dokładnie język <code>{'{ aⁿb : n ≥ 0 }'}</code>, który generuje podana gramatyka. Produkcje prawostronne A → aB oraz A → a można mechanicznie zamieniać na przejścia automatu.</p><p>Sprawdź przykłady: ε — odrzucone, ab — zaakceptowane, aaab — zaakceptowane, abb — odrzucone.</p></div></div>;
}

function PushdownParser() {
  const [input, setInput] = useState('(()())');
  const trace = [{ symbol: '—', stack: 'Z₀', action: 'stos początkowy' }];
  let depth = 0, valid = true;
  for (const ch of input) {
    if (ch === '(') depth++;
    else if (ch === ')' && depth > 0) depth--;
    else { valid = false; depth = Math.min(depth, 0); }
    trace.push({ symbol: ch, stack: `${'('.repeat(Math.max(0, depth))}Z₀`, action: ch === '(' ? 'push: zapamiętaj (' : ch === ')' && valid ? 'pop: usuń (' : 'brak poprawnego przejścia' });
  }
  const accepted = valid && depth === 0;
  return <div className="pt-grid"><div className="pt-card"><span className="pt-kicker">GRAMATYKA BEZKONTEKSTOWA I PDA</span><div className="pt-grammar">S → (S)S | ε</div><p>Automat ze stosem pamięta otwarte nawiasy. Akceptuje po przeczytaniu wejścia, gdy nie pozostał żaden nawias na stosie.</p><label>Wejście nad alfabetem {`{(, )}`}<input value={input} onChange={e => setInput(e.target.value)} /></label><div className={`pt-verdict ${accepted ? 'yes' : 'no'}`}>{accepted ? 'Poprawne słowo: akceptacja' : 'Niepoprawne słowo: odrzucenie'}</div></div>
    <div className="pt-result"><span className="pt-kicker">KONFIGURACJE PDA</span><div className="pt-table"><div className="pt-row pt-head"><span>Symbol</span><span>Stos</span><span>Operacja</span></div>{trace.map((r,i)=><div className="pt-row" key={i}><span>{r.symbol}</span><span>{r.stack}</span><span>{r.action}</span></div>)}</div><p>To PDA rozpoznaje język Dycka z jednym typem nawiasów. Gramatyka CFG i automat ze stosem opisują ten sam język; ślad stosu działa jak proste sprawdzenie/parser słowa dla tej gramatyki.</p><details className="pt-normalforms"><summary>Postacie normalne gramatyk</summary><p><b>Gramatyka regularna (prawostronna):</b> każda produkcja ma postać A → aB, A → a lub A → ε. Odpowiada bezpośrednio przejściom automatu skończonego.</p><p><b>Postać Chomsky’ego (CFG):</b> produkcje mają postać A → BC albo A → a; dopuszcza się S → ε, jeśli ε należy do języka i S nie występuje po prawej stronie. Otrzymuje się ją m.in. przez usunięcie produkcji ε, jednostkowych i bezużytecznych oraz binaryzację prawych stron.</p><p><b>Postać Greibach:</b> A → aA₁…Aₖ, czyli prawa strona zaczyna się terminalem. To ułatwia powiązanie wyprowadzeń z krokami automatu ze stosem.</p></details></div></div>;
}

const tmRules = { scan: { '1': ['1','R','scan'], '□': ['1','S','accept'] } };
function TuringMachine() {
  const [input, setInput] = useState('111');
  const [steps, setSteps] = useState(null);
  function run() {
    const tape = [...input, '□']; let head = 0, state = 'scan'; const log = [];
    for (let i=0; i<Math.max(2,input.length+2) && state !== 'accept'; i++) {
      const read = tape[head] || '□'; const [write, move, next] = tmRules.scan[read];
      tape[head] = write; log.push({ state, tape: tape.join(''), head, read, write, next });
      if (move === 'R') head++; state = next;
    }
    setSteps(log);
  }
  const valid = /^[1]*$/.test(input);
  return <div className="pt-grid"><div className="pt-card"><span className="pt-kicker">MASZYNA TURINGA: INKREMENT UNARNY</span><p>Maszyna przesuwa głowicę w prawo po jedynkach. Na pierwszym pustym polu zapisuje 1 i akceptuje.</p><label>Wejście w kodzie unarnym<input value={input} onChange={e => { setInput(e.target.value); setSteps(null); }} /></label><button className="pt-button" onClick={run} disabled={!valid}>Wykonaj kroki</button>{!valid && <p className="pt-warning">Wpisz wyłącznie symbole 1.</p>}{steps && <div className="pt-verdict yes">Wynik: {'1'.repeat(input.length+1)} (wartość zwiększona o 1)</div>}</div>
    <div className="pt-result"><span className="pt-kicker">HISTORIA OBLICZENIA</span>{steps ? <div className="pt-table"><div className="pt-row pt-head"><span>Stan</span><span>Taśma</span><span>Krok</span></div>{steps.map((s,i)=><div className="pt-row" key={i}><span>{s.state}</span><span className="pt-tape">{s.tape.split('').map((c,j)=><i className={j===s.head?'head':''} key={j}>{c}</i>)}</span><span>{s.read} → {s.write}, {s.next}</span></div>)}</div> : <p>Definicja: Q={ '{scan, accept}' }, Σ={ '{1}' }, Γ={ '{1, □}' }. Akceptacja i rozstrzyganie są różne: rozstrzygająca maszyna musi zakończyć pracę dla każdego wejścia, podczas gdy rozpoznająca może zapętlić się dla słowa spoza języka.</p>}<p>To demonstracyjny wariant podstawowej maszyny z taśmą ograniczoną do podanego wejścia i jednego pustego pola.</p></div></div>;
}

const topics = [
  ['języki','Operacje na językach',LanguageOperations],
  ['dfa-nfa','DFA / NFA',AutomatonSimulator],
  ['regex','Regex i automaty',RegexBridge],
  ['regular','Gramatyki regularne',RegularGrammar],
  ['cfg-pda','CFG i stos',PushdownParser],
  ['turing','Maszyna Turinga',TuringMachine]
];
export default function PartialTopicsLab() {
  const [active, setActive] = useState(0); const [key, title, Component] = topics[active];
  return <section className="partial-lab section" id="bloki-czesciowe"><div className="section-heading"><div><div className="eyebrow"><span className="section-number">04</span> BLOKI CZĘŚCIOWO POKAZANE</div><h2>Sprawdź teorię<br/><span>w działaniu.</span></h2></div><p>Interaktywne uzupełnienia obejmują siedem częściowo pokazanych bloków: operacje na językach, automaty, regexy, gramatyki, parsery i maszyny Turinga.</p></div>
    <div className="partial-panel"><div className="partial-tabs" role="tablist">{topics.map(([id,label],i)=><button key={id} role="tab" aria-selected={active===i} className={active===i?'active':''} onClick={()=>setActive(i)}><span>0{i+1}</span>{label}</button>)}</div><div className="partial-content" key={key}><h3>{title}</h3><Component/></div></div>
    <p className="partial-note">Moduły są ćwiczeniami edukacyjnymi dla jawnie wskazanych modeli i przykładów; ograniczenia każdego modułu opisano przy jego wyniku.</p>
  </section>;
}
