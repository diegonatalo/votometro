### 🧠 Como funciona

| Conceito | Regra |
| --- | --- |
| **Dados** | Tudo que aparece na tela sai de `public/data/*.json`, gerado por `pnpm build-data`. Nenhum número é digitado à mão. |
| **Percentuais** | Calculados sobre os votos válidos (sem brancos e nulos), com os dois candidatos no mesmo formato. |
| **Cor do mapa** | Vermelho para Lula à frente, azul para Flávio Bolsonaro à frente, em 4 faixas pelo percentual do mais votado: 50–55%, 55–60%, 60–70% e 70% ou mais. |
| **Validação** | O build falha se estados + exterior ≠ total nacional, se os totais fugirem dos valores de referência ou se as contas de comparecimento e abstenção não fecharem. |
| **Fonte e horário** | Cada seção mostra “Fonte: TSE”, o arquivo de origem e a data/hora de referência do arquivo. |
| **Seções após as 17h** | O Boletim de Urna traz a hora de abertura e de encerramento de cada seção, mas não a hora de cada voto. Por isso o painel mede as **seções** que encerraram mais de 15 minutos depois das 17h (Brasília), nunca “votos depois das 17h”. |

> [!NOTE]
> O TSE publicou os Boletins de Urna do 2º turno em 27/10/2026. Os dados de `overtime.json` vêm dos boletins
> dos 27 estados (`pnpm overtime`), e a soma das seções, dos votos e do comparecimento bate com a totalização
> do TSE sem o exterior. O exterior (arquivo ZZ) fica fora desse cálculo.
