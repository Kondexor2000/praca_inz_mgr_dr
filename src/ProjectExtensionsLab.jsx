import React, { useEffect, useMemo, useState } from 'react';
import { Check, CircleHelp, RotateCcw } from 'lucide-react';
import './project-extensions.css';

const fieldSettings = {
  4: { size: 16, degree: 4, polynomial: 0x13, digits: 1 },
  8: { size: 256, degree: 8, polynomial: 0x11b, digits: 2 }
};

function tokenize(source) {
  const tokens = [];
  let index = 0;
  while (index < source.length) {
    if (/\s/.test(source[index])) { index++; continue; }
    const match = /^(0x[0-9a-f]+|[()+*])/i.exec(source.slice(index));
    if (!match) throw new Error(`Nieznany symbol „${source[index]}”. Użyj liczb szesnastkowych, nawiasów, + i *.`);
    tokens.push(match[1].startsWith('0x') ? { type: 'number', text: match[1], value: Number.parseInt(match[1].slice(2), 16) } : { type: match[1], text: match[1] });
    index += match[1].length;
  }
  return tokens;
}

function parseExpression(tokens, fieldSize) {
  let position = 0;
  const atom = () => {
    const token = tokens[position++];
    if (!token) throw new Error('Wyrażenie kończy się przedwcześnie.');
    if (token.type === 'number') {
      if (token.value >= fieldSize) throw new Error(`${token.text} nie należy do wybranego GF(2ᵐ); zmniejsz liczbę albo wybierz większe ciało.`);
      return { type: 'number', value: token.value };
    }
    if (token.type === '(') {
      const inner = expression();
      if (tokens[position]?.type !== ')') throw new Error('Brakuje zamykającego nawiasu „)”.');
      position++;
      return inner;
    }
    throw new Error(`W tym miejscu oczekiwano liczby lub nawiasu, otrzymano „${token.text}”.`);
  };
  const product = () => {
    let node = atom();
    while (tokens[position]?.type === '*') { position++; node = { type: 'multiply', left: node, right: atom() }; }
    return node;
  };
  const expression = () => {
    let node = product();
    while (tokens[position]?.type === '+') { position++; node = { type: 'add', left: node, right: product() }; }
    return node;
  };
  if (!tokens.length) throw new Error('Wpisz wyrażenie, np. 0x57 * 0x83.');
  const tree = expression();
  if (position !== tokens.length) throw new Error(`Nieoczekiwany token „${tokens[position].text}”. Sprawdź składnię i nawiasy.`);
  return tree;
}

function multiplyInField(left, right, settings) {
  let a = left, b = right, result = 0;
  while (b > 0) {
    if (b & 1) result ^= a;
    b >>= 1;
    a <<= 1;
    if (a & (1 << settings.degree)) a ^= settings.polynomial;
  }
  return result & (settings.size - 1);
}

function evaluate(tree, settings) {
  if (tree.type === 'number') return tree.value;
  const left = evaluate(tree.left, settings), right = evaluate(tree.right, settings);
  return tree.type === 'add' ? left ^ right : multiplyInField(left, right, settings);
}

function printTree(tree) {
  if (tree.type === 'number') return `0x${tree.value.toString(16).toUpperCase()}`;
  return `(${printTree(tree.left)} ${tree.type === 'add' ? '+' : '×'} ${printTree(tree.right)})`;
}

function FiniteFieldParser() {
  const [expression, setExpression] = useState('0x57 * 0x83');
  const [degree, setDegree] = useState(8);
  const result = useMemo(() => {
    try {
      const tokens = tokenize(expression);
      const tree = parseExpression(tokens, fieldSettings[degree].size);
      return { tokens, tree, value: evaluate(tree, fieldSettings[degree]), error: '' };
    } catch (error) { return { tokens: [], tree: null, value: null, error: error.message }; }
  }, [expression, degree]);
  const format = value => `0x${value.toString(16).toUpperCase().padStart(fieldSettings[degree].digits, '0')}`;
  return <div className="px-lab-grid">
    <div className="px-control">
      <label>Ciało skończone<select value={degree} onChange={event => setDegree(Number(event.target.value))}><option value={4}>GF(2⁴), wielomian x⁴ + x + 1</option><option value={8}>GF(2⁸), wielomian x⁸ + x⁴ + x³ + x + 1</option></select></label>
      <label>Wyrażenie<input value={expression} onChange={event => setExpression(event.target.value)} spellCheck="false" /></label>
      <p>Składnia: liczby szesnastkowe <code>0x…</code>, nawiasy, dodawanie <code>+</code> i mnożenie <code>*</code>. Mnożenie ma wyższy priorytet. W GF(2ᵐ) dodawanie to XOR, a mnożenie redukujemy przez wybrany wielomian.</p>
      <button type="button" className="px-reset" onClick={() => { setDegree(8); setExpression('0x57 * 0x83'); }}><RotateCcw size={13}/> Przywróć przykład AES</button>
    </div>
    <div className="px-output">
      <div className="px-step"><span>01 · LEKSER</span><b>Tokeny</b><div className="px-token-list">{result.tokens.length ? result.tokens.map((token, index) => <code key={`${token.text}-${index}`}>{token.text}</code>) : <small>Brak poprawnych tokenów</small>}</div></div>
      <div className="px-step"><span>02–03 · PARSER</span><b>Drzewo składniowe</b><code className="px-tree">{result.tree ? printTree(result.tree) : '—'}</code></div>
      <div className="px-step px-evaluation"><span>04 · INTERPRETER</span><b>Wynik w GF(2<sup>{degree}</sup>)</b>{result.error ? <p className="px-error">{result.error}</p> : <code className="px-result">{format(result.value)}</code>}</div>
    </div>
  </div>;
}

const presets = {
  cycle: { label: 'Pełny cykl', map: '1, 2, 3, 0' },
  swap: { label: 'Dwie zamiany', map: '1, 0, 3, 2' },
  merge: { label: 'Kontrprzykład: zlanie konfiguracji', map: '1, 1, 3, 0' }
};

function gcd(a, b) { while (b) [a, b] = [b, a % b]; return a; }
function lcm(a, b) { return a / gcd(a, b) * b; }

function analyzePermutation(mapping) {
  const seen = new Set(), cycles = [];
  for (let start = 0; start < mapping.length; start++) {
    if (seen.has(start)) continue;
    const cycle = [];
    let current = start;
    while (!seen.has(current)) { seen.add(current); cycle.push(current); current = mapping[current]; }
    cycles.push(cycle);
  }
  return { cycles, order: cycles.reduce((value, cycle) => lcm(value, cycle.length), 1) };
}

function ReversibleStepLab() {
  const [preset, setPreset] = useState('cycle');
  const [mappingText, setMappingText] = useState(presets.cycle.map);
  const values = mappingText.split(/[\s,;]+/).filter(Boolean).map(Number);
  const count = 4;
  const validShape = values.length === count && values.every(Number.isInteger) && values.every(value => value >= 0 && value < count);
  const predecessors = Array.from({ length: count }, (_, target) => values.reduce((total, value) => total + Number(value === target), 0));
  const bijective = validShape && new Set(values).size === count;
  const analysis = bijective ? analyzePermutation(values) : null;
  return <div className="px-lab-grid">
    <div className="px-control">
      <label>Przykładowe przejście<select value={preset} onChange={event => { const next = event.target.value; setPreset(next); if (presets[next]) setMappingText(presets[next].map); }}><option value="cycle">{presets.cycle.label}</option><option value="swap">{presets.swap.label}</option><option value="merge">{presets.merge.label}</option><option value="custom">Własne przejście</option></select></label>
      <label>Następnik dla C0, C1, C2, C3<input value={mappingText} onChange={event => { setPreset('custom'); setMappingText(event.target.value); }} spellCheck="false" /></label>
      <p>Zbiór zawiera cztery konfiguracje dla taśmy <code>00</code>: C0=(q0,h0), C1=(q1,h0), C2=(q0,h1), C3=(q1,h1). Wpisz numer konfiguracji docelowej dla każdego wejściowego Cᵢ. Zbiór jest zamknięty, gdy wszystkie wyniki należą do {`{C0, C1, C2, C3}`}.</p>
      <div className={`px-result-banner ${bijective ? 'is-good' : 'is-bad'}`}>{bijective ? <><Check size={15}/><span>Przejście jest bijekcją na tym skończonym zbiorze; ma jednoznaczne odwrócenie.</span></> : <><CircleHelp size={15}/><span>{validShape ? 'Przejście nie jest różnowartościowe: co najmniej dwie konfiguracje mają ten sam następnik.' : 'Podaj dokładnie cztery numery od 0 do 3, oddzielone przecinkami.'}</span></>}</div>
    </div>
    <div className="px-output px-machine-output">
      <div className="px-step"><span>PRZEJŚCIE MASZYNY</span><b>Obraz konfiguracji</b>{validShape ? <div className="px-transition-list">{values.map((target, source) => <code key={source}>C{source}=(q{source % 2},h{Math.floor(source / 2)},00) → C{target}</code>)}</div> : <p className="px-error">Wartości przejścia nie tworzą poprawnej tabeli.</p>}</div>
      <div className="px-step"><span>ODWRACALNOŚĆ</span><b>Liczba poprzedników konfiguracji</b><div className="px-predecessors">{predecessors.map((number, index) => <span key={index}>C{index}<b>{validShape ? number : '—'}</b></span>)}</div><p>W bijekcji każda konfiguracja ma dokładnie jednego poprzednika. Przy powtórzonym obrazie co najmniej jedna ma ich kilka, a inna nie ma żadnego.</p></div>
      <div className="px-step px-evaluation"><span>ALGEBRA PERMUTACJI</span><b>Cykle i rząd</b>{analysis ? <><code className="px-tree">{analysis.cycles.map(cycle => `(${cycle.map(value => `C${value}`).join(' ')})`).join(' ')}</code><code className="px-result">rząd = {analysis.order}</code></> : <p className="px-error">Nie można wyznaczyć permutacji: krok nie jest bijekcją.</p>}</div>
    </div>
  </div>;
}

const labs = [
  { id: 'gf', title: 'Projekt 02 · Parser GF', label: 'LEKSER → GRAMATYKA → AST → WYNIK', component: FiniteFieldParser },
  { id: 'reversible', title: 'Projekt 03 · Przejście odwracalne', label: 'KONFIGURACJE → BIJEKCJA → PERMUTACJA', component: ReversibleStepLab }
];

export default function ProjectExtensionsLab() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const selectLab = event => { if (Number.isInteger(event.detail) && labs[event.detail]) setActive(event.detail); };
    window.addEventListener('select-project-lab', selectLab);
    return () => window.removeEventListener('select-project-lab', selectLab);
  }, []);
  const ActiveLab = labs[active].component;
  return <section className="project-extensions section" id="laboratoria-projektowe">
    <div className="section-heading"><div><div className="eyebrow"><span className="section-number">P02–P03</span> BRAKUJĄCE ODPOWIEDNIKI PROJEKTOWE</div><h2>Uruchom parser.<br/><span>Odwróć przejście.</span></h2></div><p>Dwa interaktywne laboratoria realizują kroki projektów 02 i 03, których nie obejmowały zakładki tematyczne AJF 01–06. To dodatki projektowe, nie nowe bloki sylabusa.</p></div>
    <div className="px-panel"><div className="px-tabs" role="tablist">{labs.map((lab, index) => <button type="button" key={lab.id} role="tab" aria-selected={active === index} className={active === index ? 'active' : ''} onClick={() => setActive(index)}><span>{lab.id === 'gf' ? 'P02' : 'P03'}</span>{lab.title}<small>{lab.label}</small></button>)}</div><div className="px-content" key={labs[active].id}><ActiveLab/></div></div>
    <p className="px-footnote">Model edukacyjny: parser obsługuje liczby szesnastkowe, nawiasy, + i * w GF(2⁴) lub GF(2⁸). Analiza odwracalności działa na jawnie zadanym skończonym zbiorze konfiguracji i sprawdza, czy krok jest permutacją; nie weryfikuje lokalnych reguł taśmowej maszyny Turinga.</p>
  </section>;
}
