import React, { useMemo, useState } from 'react';
import './project-four.css';

const isPrime = (n) => {
  if (!Number.isInteger(n) || n < 2) return false;
  for (let d = 2; d * d <= n; d++) if (n % d === 0) return false;
  return true;
};

function RegularPumping() {
  const [bound, setBound] = useState(10);
  const [prime, setPrime] = useState(17);
  const [segment, setSegment] = useState(3);
  const valid = Number.isInteger(bound) && bound >= 1 && bound < prime && isPrime(prime) && Number.isInteger(segment) && segment >= 1 && segment <= bound;
  const pumped = prime * (segment + 1);
  return <div className="p4-columns">
    <div className="p4-card"><span className="p4-eyebrow">BLOK 4 · LEMAT DLA JĘZYKÓW REGULARNYCH</span><h3>Słowa o pierwszej długości</h3><p>Rozważ język <code>L = {'{ aᵖ : p jest pierwsza }'}</code>. Jeśli byłby regularny, miałby długość pompowania n. Wybierz pierwszą p &gt; n.</p>
      <label>Długość pompowania n<input type="number" min="1" max="500" value={bound} onChange={e=>setBound(Number(e.target.value))}/></label>
      <label>Wybrana liczba pierwsza p<input type="number" min="2" max="1000" value={prime} onChange={e=>setPrime(Number(e.target.value))}/></label>
      <label>długość pompowanego fragmentu |y|<input type="number" min="1" max={Math.max(1,bound)} value={segment} onChange={e=>setSegment(Number(e.target.value))}/></label>
      {valid ? <div className="p4-result good"><b>p = {prime} jest pierwsza i p &gt; n.</b><br/>Dla dowolnego dopuszczalnego podziału mamy y = aᵈ, 1 ≤ d ≤ n. Pompowanie i = p + 1 daje długość p + p·d = {prime}·{segment+1} = <b>{pumped}</b>, która jest złożona. Słowo wypada z L — sprzeczność.</div> : <div className="p4-result warn">Wybierz liczbę pierwszą p większą od n oraz 1 ≤ d ≤ n.</div>}
    </div>
    <div className="p4-explain"><span className="p4-eyebrow">POWIĄZANIE Z ALGEBRĄ</span><div className="p4-equation">p + p·d = p(d + 1)</div><p>Dowód korzysta wprost z własności liczb pierwszych i podzielności omawianych w sylabusie Algebry (W1). Jest to konkretne zastosowanie lematu regularnego do wykazania nie-regularności.</p><p><b>Granica przykładu:</b> interfejs pokazuje argument dla dowolnego d z zakresu lematu; wyświetlone p i d ilustrują jego rachunek.</p></div>
  </div>;
}

const pumpCases = [
  ['Wewnątrz bloku a', [1,0,0]], ['Przez granicę a/b', [1,1,0]], ['Wewnątrz bloku b', [0,1,0]], ['Przez granicę b/c', [0,1,1]], ['Wewnątrz bloku c', [0,0,1]]
];
function ContextFreePumping() {
  const [p, setP] = useState(5);
  const [caseIndex, setCaseIndex] = useState(1);
  const safeP = Math.max(3, Math.min(30, Number.isFinite(p) ? p : 3));
  const [da,db,dc] = pumpCases[caseIndex][1];
  return <div className="p4-columns">
    <div className="p4-card"><span className="p4-eyebrow">BLOK 8 · LEMAT DLA JĘZYKÓW BEZKONTEKSTOWYCH</span><h3>Poza przekątną w ℤ³</h3><p>Język <code>L = {'{ aⁿbⁿcⁿ : n ≥ 0 }'}</code> ma wektory liczności leżące na przekątnej (n,n,n) addytywnej grupy ℤ³.</p>
      <label>Wykładnik p ≥ 3<input type="number" min="3" max="30" value={p} onChange={e=>setP(Number(e.target.value))}/></label>
      <label>Położenie fragmentów v i y<select value={caseIndex} onChange={e=>setCaseIndex(Number(e.target.value))}>{pumpCases.map(([label],i)=><option key={label} value={i}>{label}</option>)}</select></label>
      <div className="p4-vector"><span>Przed pompowaniem</span><b>({safeP}, {safeP}, {safeP})</b><span>Po usunięciu v i y (i = 0)</span><b>({safeP-da}, {safeP-db}, {safeP-dc})</b></div>
      <div className="p4-result good">Wektor po pompowaniu nie leży na przekątnej, więc słowo nie należy do L. Lemat wymaga |vxy| ≤ p: fragmenty mogą obejmować najwyżej jeden z dwóch granicznych styków, zatem co najmniej jeden blok pozostaje bez zmian.</div>
    </div>
    <div className="p4-explain"><span className="p4-eyebrow">POWIĄZANIE Z ALGEBRĄ</span><div className="p4-equation">(n,n,n) ∈ ℤ × ℤ × ℤ</div><p>Liczby symboli kodujemy wektorem w iloczynie prostym addytywnych grup liczb całkowitych. Język wybiera przekątną tych wektorów; pompowanie zmienia najwyżej dwa współrzędne, więc nie zachowuje warunku równości.</p><p><b>Uczciwe rozgraniczenie:</b> dowód lematem jest narzędziem teorii języków, a ℤ³ daje algebraiczny model liczności — sylabus omawia grupy i iloczyny proste, lecz nie podaje tego zastosowania wprost.</p></div>
  </div>;
}

function cyk(word) {
  const n = word.length;
  if (!n) return { accepted: false, table: [], error: 'Podaj niepuste słowo.' };
  if (!/^[ab]+$/.test(word)) return { accepted: false, table: [], error: 'To przykładowa gramatyka nad alfabetem {a, b}.' };
  if (n > 18) return { accepted: false, table: [], error: 'Dla czytelności ograniczono wejście do 18 symboli.' };
  const table = Array.from({length:n},()=>Array.from({length:n},()=>new Set()));
  for (let i=0;i<n;i++) { if(word[i]==='a') table[i][0].add('A'); else table[i][0].add('B'); }
  const rules = { 'AB':['S'], 'AC':['S'], 'SB':['C'] };
  for(let len=2;len<=n;len++) for(let start=0;start<=n-len;start++) for(let cut=1;cut<len;cut++) {
    const left=table[start][cut-1], right=table[start+cut][len-cut-1];
    for(const a of left) for(const b of right) for(const parent of (rules[a+b]||[])) table[start][len-1].add(parent);
  }
  return { accepted: table[0][n-1].has('S'), table, error: '' };
}
function DecisionAndCYK() {
  const [word,setWord]=useState('aaabbb'); const [length,setLength]=useState(17); const [modulus,setModulus]=useState(5); const [residue,setResidue]=useState(2);
  const result=useMemo(()=>cyk(word),[word]);
  const validMod=Number.isInteger(modulus)&&modulus>=2&&modulus<=50&&Number.isInteger(length)&&length>=0&&Number.isInteger(residue)&&residue>=0&&residue<modulus;
  return <div className="p4-columns p4-cyk-layout">
    <div className="p4-card"><span className="p4-eyebrow">BLOK 9 · PROBLEM DECYZYJNY I CYK</span><h3>Czy słowo należy do CFG?</h3><p>Przykładowa gramatyka w postaci Chomsky’ego: S → AB | AC, C → SB, A → a, B → b. Generuje język {`{aⁿbⁿ : n ≥ 1}`}.</p><label>Słowo nad {`{a, b}`}<input value={word} onChange={e=>setWord(e.target.value.replace(/[^ab]/g,''))}/></label>
      {result.error ? <div className="p4-result warn">{result.error}</div> : <div className={`p4-result ${result.accepted?'good':'warn'}`}>{result.accepted?'TAK — S należy do tablicy CYK.':'NIE — S nie należy do tablicy CYK.'} Problem słowa dla tej CFG jest rozstrzygany przez algorytm.</div>}
      {!result.error&&<div className="p4-cyk-table"><b>Tablica CYK — wiersze oznaczają długość fragmentu</b>{result.table.map((row,len)=><div className="p4-cyk-row" key={len}><span>{len+1}</span>{row.slice(0,result.table.length-len).map((set,start)=><span key={start} title={word.slice(start,start+len+1)}><small>{word.slice(start,start+len+1)}</small>{`{${[...set].sort().join(',')||'∅'}}`}</span>)}</div>)}</div>}
    </div>
    <div className="p4-explain"><span className="p4-eyebrow">KLASY RESZT JAKO MAŁY AUTOMAT DECYZYJNY</span><div className="p4-equation">[n]ₘ = n mod m ∈ ℤ/mℤ</div><label>Długość słowa aⁿ<input type="number" min="0" max="1000000" value={length} onChange={e=>setLength(Number(e.target.value))}/></label><label>Moduł m<input type="number" min="2" max="50" value={modulus} onChange={e=>setModulus(Number(e.target.value))}/></label><label>Akceptowana reszta r<input type="number" min="0" max={Math.max(0,modulus-1)} value={residue} onChange={e=>setResidue(Number(e.target.value))}/></label>
      {validMod ? <div className={`p4-result ${length%modulus===residue?'good':'warn'}`}>Reszta {length%modulus}; stan automatu [ {length%modulus} ] w ℤ/{modulus}ℤ. {length%modulus===residue?'Słowo zaakceptowane.':'Słowo odrzucone.'}</div> : <div className="p4-result warn">Wymagane: m ≥ 2 oraz 0 ≤ r &lt; m.</div>}
      <p>To rozstrzygalny problem regularny: DFA ma m stanów i przechowuje aktualną resztę. Związek z sylabusem jest bezpośredni przez kongruencje, klasy reszt i grupy cykliczne. CYK z kolei jest algorytmem dla ogólnej gramatyki bezkontekstowej, nie algorytmem algebry abstrakcyjnej.</p>
    </div>
  </div>;
}

const topics=[['regular','4 · Lemat regularny',RegularPumping],['cfl','8 · Lemat bezkontekstowy',ContextFreePumping],['decision','9 · CYK i rozstrzygalność',DecisionAndCYK]];
export default function ProjectFourLab(){
  const [active,setActive]=useState(0); const [id,label,Panel]=topics[active];
  return <section className="project-four section" id="projekt-04"><div className="section-heading"><div><div className="eyebrow"><span className="section-number">04</span> PROJEKT PRZEKROJOWY · ALGEBRA DLA INFORMATYKÓW + AJF</div><h2>Granice języków,<br/><span>struktura liczb.</span></h2></div><p><b>Powiązanie:</b> Algebra dla informatyków — W1, W2, U1 i U2; Automaty i Języki Formalne — bloki 4, 8 i 9. Laboratorium uzupełniające AJF powyżej jest odrębną częścią strony. Każda zakładka wskazuje, gdzie algebra ma bezpośrednie zastosowanie, a gdzie pełni rolę modelu lub kontekstu.</p></div>
    <div className="p4-panel"><div className="p4-tabs" role="tablist">{topics.map(([key,title],i)=><button key={key} role="tab" aria-selected={active===i} className={active===i?'active':''} onClick={()=>setActive(i)}><span>0{i+1}</span>{title}</button>)}</div><div className="p4-content" key={id}><Panel/></div></div>
    <p className="p4-footnote">Blok 4: konkretne zastosowanie własności liczb pierwszych. Blok 8: wektorowy model w ℤ³ plus dowód pumpingiem. Blok 9: CYK dla CFG i test DFA dla klas reszt; oba wyniki są decyzjami tak/nie, ale tylko drugi korzysta bezpośrednio z Z/mZ.</p>
  </section>;
}
