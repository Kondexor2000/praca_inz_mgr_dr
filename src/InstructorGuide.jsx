import React from 'react';
import { ArrowDown, ArrowRight, BookOpenCheck, CircleHelp, MousePointerClick } from 'lucide-react';
import './instructor-guide.css';

const areas = [
  {
    number: '01–03',
    title: 'Ścieżki projektowe',
    label: 'PARY ALGEBRA ↔ AJF',
    steps: [
      'Wybierz kartę projektu i rozwiń ją, aby zobaczyć cel, plan pracy i powiązanie z algebrą.',
      'Kliknij wiersz z nazwą algebry, aby przejść do odpowiadającego laboratorium algebraicznego.',
      'Użyj kart jako propozycji tematów projektowych: opisują zakres i możliwy rezultat, nie gotowe oddane prace.'
    ]
  },
  {
    number: '04',
    title: 'Projekt przekrojowy',
    label: 'ALGEBRA + BLOKI AJF 4, 8, 9',
    steps: [
      'Otwórz „Otwórz laboratorium projektu 04”, a potem wybieraj zakładki 4, 8 i 9.',
      'Blok 4 — „Lemat o pompowaniu dla języków regularnych i jego zastosowanie”: zmień n, pierwszą p > n i d; omów długość p(d + 1).',
      'Blok 8 — „Lemat o pompowaniu dla języków bezkontekstowych; języki poza klasą CF”: wybierz położenie v i y, porównaj wektory liczności.',
      'Blok 9 — „Problemy decyzyjne i algorytm CYK”: zmień słowo nad {a,b}, odczytaj tablicę; obok sprawdź automat dla reszty n mod m.'
    ]
  },
  {
    number: 'AJF',
    title: 'Laboratorium uzupełniające',
    label: 'ĆWICZENIA TEMATYCZNE',
    steps: [
      'Przejdź do „Laboratorium AJF” i wybierz zakładkę odpowiadającą omawianemu tematowi. Jej numer 01–06 oznacza kolejność karty, nie oficjalny numer bloku sylabusa.',
      'Edytuj słowa, zbiory lub parametry; w symulatorze automatu i maszynie Turinga uruchom obliczenie przyciskiem.',
      'W zakładce DFA/NFA prześledź ε-domknięcie, konstrukcję podzbiorów i wynik minimalizacji.'
    ]
  }
];

const projectStepMap = [
  {
    id: '01', title: 'Silnik wyrażeń regularnych',
    items: [
      ['Kroki 1–4', 'Bezpośrednio: AJF 03 · Regex i automaty', 3],
      ['Dlaczego', 'Zakładka buduje NFA z regexu i sprawdza, czy słowo należy do opisanego języka.', 3]
    ]
  },
  {
    id: '02', title: 'Parser wyrażeń w ciele skończonym',
    items: [
      ['Krok 1 · lexer', 'Bezpośrednio: laboratorium projektu 02 pokazuje tokeny liczb hex, nawiasów i operatorów.', 2],
      ['Krok 2 · priorytety', 'Bezpośrednio: parser respektuje kolejność mnożenia, dodawania i nawiasów.', 2],
      ['Krok 3 · AST', 'Bezpośrednio: podgląd pokazuje drzewo składniowe zbudowane przez parser.', 2],
      ['Krok 4 · GF', 'Bezpośrednio: interpreter oblicza wyrażenie w GF(2⁴) lub GF(2⁸).', 2]
    ]
  },
  {
    id: '03', title: 'Odwracalna maszyna Turinga',
    items: [
      ['Krok 1 · konfiguracja', 'Bezpośrednio: laboratorium projektu 03 definiuje jawny skończony zbiór konfiguracji Cᵢ.', 3],
      ['Krok 2 · odwracalność', 'Bezpośrednio: narzędzie liczy poprzedników i sprawdza, czy krok jest bijekcją.', 3],
      ['Krok 3 · domknięcie', 'Bezpośrednio: waliduje, że każdy następnik należy do analizowanego zbioru konfiguracji.', 3],
      ['Krok 4 · permutacje', 'Bezpośrednio: dla bijekcji wyznacza cykle oraz rząd permutacji.', 3]
    ]
  }
];

export default function InstructorGuide() {
  return <section className="instructor-guide section" id="dla-prowadzacego">
    <div className="section-heading">
      <div><div className="eyebrow"><span className="section-number"><BookOpenCheck size={14}/></span> INSTRUKCJA OBSŁUGI</div><h2>Przewodnik<br/><span>dla prowadzącego.</span></h2></div>
      <p>Krótka mapa strony: gdzie są projekty, co można uruchomić i jak odnieść demonstrację do bloków przedmiotu.</p>
    </div>
    <div className="ig-cards">{areas.map(area => <article className="ig-card" key={area.number}>
      <div className="ig-card-top"><span>{area.number}</span><small>{area.label}</small></div>
      <h3>{area.title}</h3>
      <ol>{area.steps.map((step, i) => <li key={step}><span>{String(i + 1).padStart(2, '0')}</span><p>{step}</p></li>)}</ol>
    </article>)}</div>
    <div className="ig-step-map">
      <div className="ig-map-heading"><span className="eyebrow">MAPA DOPASOWANIA</span><h3>Które zakładki pasują do kroków projektów 01–03?</h3><p>Numery zakładek AJF 01–06 są zgodne z menu na stronie. „Częściowo” oznacza podobną ideę, ale ćwiczenie nie realizuje danego kroku wprost.</p></div>
      <div className="ig-map-grid">{projectStepMap.map(project => <article className="ig-map-card" key={project.id}>
        <div className="ig-map-title"><span>PROJEKT {project.id}</span><h4>{project.title}</h4></div>
        <ul>{project.items.map(([step, description, tab]) => <li key={step}><b>{step}</b><p>{description}</p>{tab===2||tab===3?<a href="#laboratoria-projektowe" onClick={()=>window.dispatchEvent(new CustomEvent('select-project-lab',{detail:tab-2}))}>Otwórz laboratorium projektu {String(tab).padStart(2,'0')} <ArrowRight size={12}/></a>:tab&&<a href="#bloki-czesciowe" onClick={()=>window.dispatchEvent(new CustomEvent('select-ajf-tab',{detail:tab-1}))}>Otwórz zakładkę AJF {String(tab).padStart(2,'0')} <ArrowRight size={12}/></a>}</li>)}</ul>
      </article>)}</div>
    </div>
    <div className="ig-session">
      <div className="ig-session-icon"><MousePointerClick size={18}/></div>
      <div><b>Proponowany przebieg krótkiej demonstracji</b><p>Najpierw pokaż kartę projektu i jej powiązanie z algebrą. Następnie uruchom jeden przykład w Projekcie 04, poproś o przewidzenie wyniku i zmień parametr, aby omówić, co się zmienia. Na koniec przejdź do laboratorium AJF, jeśli grupa chce zobaczyć sam model automatu lub gramatyki.</p></div>
      <a href="#projekty">Przejdź do projektów <ArrowDown size={14}/></a>
    </div>
    <p className="ig-limit"><CircleHelp size={14}/> To bezpłatna demonstracja edukacyjna działająca w przeglądarce. Nie zapisuje odpowiedzi ani nie ocenia studentów. Laboratorium projektu 03 sprawdza bijekcję na skończonym zbiorze abstrakcyjnych konfiguracji; nie weryfikuje lokalnych reguł taśmowej maszyny Turinga. Ograniczenia są opisane przy wynikach.</p>
  </section>;
}
