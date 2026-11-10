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
      ['Krok 1 · lexer', 'Brak odpowiednika: zakładki 01–06 nie pokazują leksykalnego analizatora ani tokenów GF.', null],
      ['Kroki 2–3 · gramatyka i parser', 'Częściowo: AJF 05 · CFG i stos pokazuje ideę składni i parsera, ale nie parser wyrażeń arytmetycznych ani drzewa AST.', 5],
      ['Krok 4 · obliczenia GF', 'Brak odpowiednika w AJF 01–06; to zakres Algebry 02.', null]
    ]
  },
  {
    id: '03', title: 'Odwracalna maszyna Turinga',
    items: [
      ['Krok 1 · konfiguracja', 'Częściowo: AJF 06 pokazuje stan, głowicę i taśmę, ale w innej maszynie.', 6],
      ['Krok 2 · odwracalność', 'Brak odpowiednika: AJF 06 nie bada jednoznaczności poprzednika ani bijektywności przejść.', null],
      ['Krok 3 · skończony zbiór konfiguracji', 'Częściowo: AJF 06 ogranicza przykład do wejścia i pola pustego, ale nie sprawdza domknięcia zbioru konfiguracji.', 6],
      ['Krok 4 · permutacje', 'Brak odpowiednika w AJF 01–06; analizę cykli i rzędu prowadzi Algebra 03.', null]
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
        <ul>{project.items.map(([step, description, tab]) => <li key={step}><b>{step}</b><p>{description}</p>{tab&&<a href="#bloki-czesciowe" onClick={()=>window.dispatchEvent(new CustomEvent('select-ajf-tab',{detail:tab-1}))}>Otwórz zakładkę AJF {String(tab).padStart(2,'0')} <ArrowRight size={12}/></a>}</li>)}</ul>
      </article>)}</div>
    </div>
    <div className="ig-session">
      <div className="ig-session-icon"><MousePointerClick size={18}/></div>
      <div><b>Proponowany przebieg krótkiej demonstracji</b><p>Najpierw pokaż kartę projektu i jej powiązanie z algebrą. Następnie uruchom jeden przykład w Projekcie 04, poproś o przewidzenie wyniku i zmień parametr, aby omówić, co się zmienia. Na koniec przejdź do laboratorium AJF, jeśli grupa chce zobaczyć sam model automatu lub gramatyki.</p></div>
      <a href="#projekty">Przejdź do projektów <ArrowDown size={14}/></a>
    </div>
    <p className="ig-limit"><CircleHelp size={14}/> To bezpłatna demonstracja edukacyjna działająca w przeglądarce. Nie zapisuje odpowiedzi, nie ocenia studentów i nie zastępuje dowodu ani pełnej implementacji modelu. Ograniczenia danego przykładu są opisane przy jego wyniku.</p>
  </section>;
}
