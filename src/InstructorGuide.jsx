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
      'Blok 4: zmień n, pierwszą p > n i d. Omów, czemu długość po pompowaniu p(d + 1) jest złożona.',
      'Blok 8: wybierz położenie v i y i porównaj wektory liczności przed i po pompowaniu.',
      'Blok 9: zmień słowo nad {a,b} i odczytaj tablicę CYK; obok sprawdź decyzję automatu dla reszty n mod m.'
    ]
  },
  {
    number: 'AJF',
    title: 'Laboratorium uzupełniające',
    label: 'ĆWICZENIA TEMATYCZNE',
    steps: [
      'Przejdź do „Laboratorium AJF” i wybierz zakładkę odpowiadającą omawianemu blokowi.',
      'Edytuj słowa, zbiory lub parametry; w symulatorze automatu i maszynie Turinga uruchom obliczenie przyciskiem.',
      'W zakładce DFA/NFA prześledź ε-domknięcie, konstrukcję podzbiorów i wynik minimalizacji.'
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
    <div className="ig-session">
      <div className="ig-session-icon"><MousePointerClick size={18}/></div>
      <div><b>Proponowany przebieg krótkiej demonstracji</b><p>Najpierw pokaż kartę projektu i jej powiązanie z algebrą. Następnie uruchom jeden przykład w Projekcie 04, poproś o przewidzenie wyniku i zmień parametr, aby omówić, co się zmienia. Na koniec przejdź do laboratorium AJF, jeśli grupa chce zobaczyć sam model automatu lub gramatyki.</p></div>
      <a href="#projekty">Przejdź do projektów <ArrowDown size={14}/></a>
    </div>
    <p className="ig-limit"><CircleHelp size={14}/> To bezpłatna demonstracja edukacyjna działająca w przeglądarce. Nie zapisuje odpowiedzi, nie ocenia studentów i nie zastępuje dowodu ani pełnej implementacji modelu. Ograniczenia danego przykładu są opisane przy jego wyniku.</p>
  </section>;
}
