/** Textos da landing (`/`). As seções ficam em `components/landing/`. */

export const HERO = {
  kicker: "Eleição presidencial 2026 · 2º turno",
  title: "A apuração do 2º turno inteira, num mapa só.",
  subtitle:
    "O resultado nacional, cada estado e cada município, a comparação com o 1º turno e as seções que votaram além do horário regular. Todos os números vêm do TSE, com a fonte e o horário de referência ao lado.",
};

export type Highlight = { title: string; text: string };

export const HIGHLIGHTS: Highlight[] = [
  {
    title: "Mapa até o município",
    text: "Cor pelo candidato à frente e intensidade pela margem. Clique num estado para aproximar e ver as cidades.",
  },
  {
    title: "Regiões e estados",
    text: "O recorte por região e a tabela com todos os estados, com busca e ordenação.",
  },
  {
    title: "1º contra 2º turno",
    text: "Quanto cada candidato ganhou ou perdeu entre o 1º e o 2º turno.",
  },
  {
    title: "Votação além das 17h",
    text: "Quantas seções fecharam depois do horário regular, em cada estado, segundo o boletim de urna.",
  },
];

export const WHY = {
  title: "Por que existe",
  text: "Em noite de eleição, os números chegam picados e cheios de ruído. O Votômetro junta tudo numa página, com a mesma régua para os dois candidatos, e o build falha se os totais não fecharem com os do TSE.",
};

export type Faq = { question: string; answer: string };

export const FAQ: Faq[] = [
  {
    question: "De onde vêm os dados?",
    answer: "Dos arquivos públicos de resultado do TSE. Cada seção mostra a fonte e o horário de referência.",
  },
  {
    question: "É um site oficial?",
    answer: "Não. É um projeto independente, sem ligação com o TSE nem com partidos ou candidatos.",
  },
  {
    question: "Guarda algum dado meu?",
    answer: "Não. O site só guarda no navegador a sua escolha de tema claro ou escuro.",
  },
];
