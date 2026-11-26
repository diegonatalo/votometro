/** Textos da landing (`/`). As seções ficam em `components/landing/`. */

export const HERO = {
  kicker: "Eleição presidencial 2026 · 2º turno",
  title: "A apuração do 2º turno inteira,",
  titleEm: "num mapa só.",
  subtitle:
    "O resultado nacional, cada estado e cada município, a comparação com o 1º turno e as seções que votaram além do horário. Todos os números vêm do TSE, com a fonte e o horário ao lado.",
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

export type Step = { title: string; text: string };

export const HOW: { title: string; intro: string; steps: Step[] } = {
  title: "Como funciona",
  intro: "Em noite de eleição os números chegam picados e cheios de ruído. Aqui eles chegam juntos, conferidos.",
  steps: [
    { title: "Os arquivos do TSE", text: "Os números saem dos arquivos públicos de resultado, sem estimativa nem projeção." },
    { title: "Conferidos no build", text: "Se os totais não fecharem com os do TSE, o site nem é publicado." },
    { title: "A mesma régua", text: "Os dois candidatos com o mesmo tratamento visual, em todas as telas, com a fonte e o horário ao lado." },
  ],
};

/** Prints em `public/landing/`, gerados por `e2e/screenshots.spec.ts`. */
export const PREVIEW = {
  title: "Uma página,",
  em: "a mesma régua",
  alt: "Tela do app com o resultado do 2º turno: os dois candidatos, os percentuais e a barra dividida",
  width: 2160,
  height: 1350,
};

export const PRIVACY_NOTE = "O Votômetro não guarda nenhum dado seu: só a escolha de tema, no seu navegador.";

export const FINAL_CTA = { title: "Estado por estado,", em: "cidade por cidade." };

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
