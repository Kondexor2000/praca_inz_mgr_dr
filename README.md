# Algebra and Theory of Computation

Połączone, bezbazodanowe laboratorium edukacyjne w React: struktury algebraiczne, arytmetyka modularna, ciała skończone, permutacje oraz projekty z automatów, gramatyk i teorii obliczeń.

## Połączone ścieżki projektowe

- Algebra 01: półpierścienie i algebra Kleene’ego + automat 01: silnik wyrażeń regularnych.
- Algebra 02: ciała Galois + automat 02: parser wyrażeń obliczanych w ciele skończonym.
- Algebra 03: grupa permutacji + automat 03: odwracalna maszyna Turinga analizowana na skończonym, zamkniętym zbiorze konfiguracji.
- Projekt 04 (przekrojowy): Algebra dla informatyków (W1, W2, U1, U2) + bloki 4, 8 i 9 Automatów i Języków Formalnych. To osobne laboratorium o lemacie regularnym, lemacie bezkontekstowym, CYK i klasach reszt.

## Laboratorium uzupełniające AJF

Osobna sekcja strony uzupełnia częściowo pokazane bloki przedmiotu Automaty i Języki Formalne. Nie jest projektem 04 ani kolejną parą projektów. Numery 01–06 w menu są numerami zakładek, nie oficjalną numeracją bloków sylabusa. Sześć zakładek obejmuje siedem zagadnień; ε-przejścia, determinizacja i minimalizacja są zebrane w zakładce DFA / NFA.

Projekt 04 odnosi się do następujących bloków AJF: 4 — lemat o pompowaniu dla języków regularnych; 8 — lemat o pompowaniu dla języków bezkontekstowych i języki poza klasą CF; 9 — problemy decyzyjne i rozstrzygalność dla języków regularnych/bezkontekstowych oraz algorytm CYK. Ich pełne opisy są pokazane przy laboratorium projektu 04 na stronie.

## Przewodnik dla prowadzącego

Na stronie, w nagłówku laboratorium teorii obliczeń, znajduje się odnośnik **Dla prowadzącego**. Sekcja wyjaśnia, jak przechodzić między kartami projektów a symulatorami, jak poprowadzić krótką demonstrację oraz jakie są ograniczenia przykładów. Aplikacja nie zapisuje odpowiedzi ani nie prowadzi oceniania.

## Lokalnie

Wymagany Node.js 22. Uruchom `npm ci`, następnie `npm run dev`. Produkcyjny build: `npm run build`.

## GitHub Pages

Workflow GitHub Actions buduje stronę po każdym pushu do `main` i publikuje artefakt Pages. W ustawieniach repozytorium wybierz **Settings → Pages → GitHub Actions**. Strona: https://kondexor2000.github.io/praca_inz_mgr_dr/.

Aplikacja nie używa backendu ani bazy danych.
