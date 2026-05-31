const fs = require('fs');
const path = require('path');
const outputDir = path.join(process.cwd(), 'public', 'docs', 'incentivos');

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const linhas = [
  { texto: 'PREFEITURA MUNICIPAL DE LAJES PINTADAS', tamanho: 13 },
  { texto: 'Estado do Rio Grande do Norte - CNPJ: 08.352.027/0001-00', tamanho: 10 },
  { texto: '', tamanho: 10 },
  { texto: 'DECLARACAO DE INEXISTENCIA DE PROJETOS APROVADOS', tamanho: 13 },
  { texto: 'PROGRAMAS DE INCENTIVO A CULTURA, AO ESPORTE E AO LAZER', tamanho: 11 },
  { texto: '', tamanho: 10 },
  { texto: 'Data de Referencia: 01 de janeiro de 2026', tamanho: 11 },
  { texto: '', tamanho: 10 },
  { texto: 'A Prefeitura Municipal de Lajes Pintadas, por meio da Secretaria Municipal', tamanho: 11 },
  { texto: 'de Administracao, em cumprimento as disposicoes da Politica Nacional de', tamanho: 11 },
  { texto: 'Transparencia Publica - PNTP e da Lei Federal no 12.527/2011 - LAI,', tamanho: 11 },
  { texto: 'DECLARA, para os devidos fins e efeitos de direito, que:', tamanho: 11 },
  { texto: '', tamanho: 10 },
  { texto: '1. NAO EXISTEM, nesta data de referencia (01/01/2026), projetos aprovados', tamanho: 11 },
  { texto: '   no ambito dos programas de incentivo a cultura, ao esporte e ao lazer', tamanho: 11 },
  { texto: '   no municipio de Lajes Pintadas/RN.', tamanho: 11 },
  { texto: '', tamanho: 10 },
  { texto: '2. Esta declaracao abrange, sem limitacao:', tamanho: 11 },
  { texto: '   a) Incentivos fiscais - isencoes, reducoes ou diferimentos tributarios;', tamanho: 10 },
  { texto: '   b) Subvencoes, auxilios e contribuicoes a entidades culturais/esportivas;', tamanho: 10 },
  { texto: '   c) Patrocinios, premios e bolsas vinculadas a projetos culturais/esportivos;', tamanho: 10 },
  { texto: '   d) Contratos, convenios ou acordos de cooperacao para fomento cultural;', tamanho: 10 },
  { texto: '   e) Titulos de utilidade publica com efeito financeiro em atividades culturais.', tamanho: 10 },
  { texto: '', tamanho: 10 },
  { texto: '3. A Administracao Municipal compromete-se a publicar imediatamente qualquer', tamanho: 11 },
  { texto: '   aprovacao futura, incluindo: identificacao completa do beneficiario,', tamanho: 11 },
  { texto: '   natureza e valor do incentivo, prazo de vigencia e contrapartidas exigidas.', tamanho: 11 },
  { texto: '', tamanho: 10 },
  { texto: '4. Esta declaracao sera atualizada anualmente ou sempre que houver alteracao', tamanho: 11 },
  { texto: '   na situacao declarada, conforme determina o art. 48 da LRF.', tamanho: 11 },
  { texto: '', tamanho: 10 },
  { texto: 'BASE LEGAL:', tamanho: 12 },
  { texto: '- Lei Federal no 12.527/2011 - Lei de Acesso a Informacao (LAI)', tamanho: 10 },
  { texto: '- Lei Complementar no 101/2000 - Lei de Responsabilidade Fiscal (LRF)', tamanho: 10 },
  { texto: '- Lei Federal no 13.709/2018 - Lei Geral de Protecao de Dados (LGPD)', tamanho: 10 },
  { texto: '- Lei Federal no 14.129/2021 - Governo Digital', tamanho: 10 },
  { texto: '- Decreto Federal no 9.203/2017 - Politica de Governanca Publica', tamanho: 10 },
  { texto: '- Portaria SECOM/PR - Politica Nacional de Transparencia Publica (PNTP)', tamanho: 10 },
  { texto: '', tamanho: 10 },
  { texto: 'Lajes Pintadas/RN, 01 de janeiro de 2026.', tamanho: 11 },
  { texto: '', tamanho: 10 },
  { texto: '', tamanho: 10 },
  { texto: '___________________________________________', tamanho: 11 },
  { texto: 'Prefeito Municipal de Lajes Pintadas', tamanho: 11 },
  { texto: '', tamanho: 10 },
  { texto: '___________________________________________', tamanho: 11 },
  { texto: 'Secretaria Municipal de Administracao', tamanho: 11 },
  { texto: 'Responsavel pela Transparencia Publica', tamanho: 11 },
];

let streamContent = 'BT\n';
const xPos = 72;
let yPos = 790;
const lineHeight = 16;

for (const { texto, tamanho } of linhas) {
  streamContent += `/F1 ${tamanho} Tf\n`;
  streamContent += `${xPos} ${yPos} Td\n`;
  const safe = texto.replace(/[()\\]/g, ' ');
  streamContent += `(${safe}) Tj\n`;
  if (texto === '') {
    yPos -= lineHeight * 0.5;
  } else {
    yPos -= lineHeight;
  }
}
streamContent += 'ET\n';

const header = '%PDF-1.4\n';
let pdf = header;
let off = header.length;
const offs = [];

function addObj(idx, content) {
  const s = `${idx} 0 obj\n${content}\nendobj\n`;
  offs.push(off);
  off += s.length;
  pdf += s;
}

addObj(1, '<< /Type /Catalog /Pages 2 0 R >>');
addObj(2, '<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
addObj(3, '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>');
addObj(4, `<< /Length ${streamContent.length} >>\nstream\n${streamContent}endstream`);
addObj(5, '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');

const xref = off;
pdf += 'xref\n0 6\n0000000000 65535 f \n';
for (const o of offs) pdf += `${String(o).padStart(10, '0')} 00000 n \n`;
pdf += `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;

const filePath = path.join(outputDir, 'declaracao-inexistencia-incentivos-2026.pdf');
fs.writeFileSync(filePath, pdf, 'binary');
console.log(`PDF gerado: ${filePath}`);
