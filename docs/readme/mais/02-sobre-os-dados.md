### 📚 Sobre os dados

| Dado | Fonte |
| --- | --- |
| Resultados por Brasil, UF, exterior e município (1º e 2º turno) | API de resultados do TSE, `resultados.tse.jus.br/oficial/ele2026` (`6258` = 2º turno, `6257` = 1º turno) |
| Fotos dos candidatos | Arquivos de fotos do TSE, copiados para `public/img/candidatos/` |
| Geometrias | API de malhas do IBGE, simplificadas em `scripts/build-geo.ts` |
| Horário de encerramento das seções | Boletim de Urna, dados abertos do TSE |

Limitações conhecidas:

- A abstenção no arquivo do TSE é 19,22%. A imprensa cita entre 19% e 19,2%. A diferença está em “Notas”, na própria página.
- O município de Boa Esperança do Norte (MT) tem resultado, mas não tem polígono na malha do IBGE. Ele entra nos totais e na busca, não no desenho.
- O exterior é um território à parte e não aparece no mapa.
- A API do TSE não é documentada formalmente, então o caminho dos arquivos pode mudar.
- O corte de 15 minutos é um critério de medição, não uma definição legal de prorrogação.

<details><summary><b>Como o mapa carrega os municípios</b></summary>

1. O mapa do Brasil desenha só os 27 estados (SVG), leve e imediato.
2. Ao clicar num estado, o arquivo `municipios-XX.json` e a malha `municipios-XX.topo.json` dele são baixados sob demanda.
3. Os municípios são desenhados em Canvas, com índice em grade e `isPointInPath` para saber qual está sob o mouse.
4. Durante zoom e arraste, o Canvas reaproveita uma imagem pronta do desenho e só redesenha ao parar.
5. A lista de busca usa um arquivo único leve (`municipios.json`), carregado quando você foca o campo.

</details>
