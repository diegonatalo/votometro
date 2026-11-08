### 🧠 Como funciona

| Conceito | Regra |
| --- | --- |
| **Dados** | Tudo que aparece na tela sai de `public/data/*.json`, gerado por `npm run build-data`. Nenhum número é digitado à mão. |
| **Percentuais** | Calculados sobre os votos válidos (sem brancos e nulos), com os dois candidatos no mesmo formato. |
| **Cor do mapa** | Vermelho para Lula à frente, azul para Flávio Bolsonaro à frente. Cinza em 50%. A intensidade cresce até 30 pontos de diferença. |
| **Validação** | O build falha se estados + exterior ≠ total nacional, se os totais fugirem dos valores de referência ou se as contas de comparecimento e abstenção não fecharem. |
| **Fonte e horário** | Cada seção mostra “Fonte: TSE”, o arquivo de origem e a data/hora de referência do arquivo. |
| **Seções após as 17h** | O Boletim de Urna traz a hora de abertura e de encerramento de cada seção, mas não a hora de cada voto. Por isso o painel mede as **seções** que encerraram mais de 15 minutos depois das 17h (Brasília), nunca “votos depois das 17h”. |

> [!NOTE]
> Os Boletins de Urna do 2º turno ainda não estavam publicados quando os dados foram gerados. Enquanto isso,
> o painel mostra “indisponível” e explica o motivo, sem números. Rode `npm run build-data` de novo quando o
> TSE publicar. O cálculo foi testado com os boletins do 1º turno (Acre).
