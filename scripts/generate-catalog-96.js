const fs = require('fs');
const data = require('./parsed_ficha.json');

function cleanTitle(criterio) {
    let t = criterio.replace(/^\d+\.\d+\s*/, '').trim();
    // Remove question mark at end if present
    if (t.endsWith('?')) t = t.slice(0, -1).trim();
    // Return clean shortened title
    return t;
}

function getRouteInfo(codigo, dimensao, criterio) {
    const code = codigo.toString();
    
    // Default fallback
    let rotaPublica = "/transparencia";
    let rotaAdmin = "/admin/pntp";
    let secretaria = "Controladoria Geral do Município";
    let periodicidadeDias = 30;

    if (code === "1.1") {
        rotaPublica = "/";
        rotaAdmin = "/admin/configuracoes";
        secretaria = "Secretaria de Administração e Planejamento";
        periodicidadeDias = 365;
    } else if (code === "1.2") {
        rotaPublica = "/transparencia";
        rotaAdmin = "/admin";
        secretaria = "Controladoria Geral do Município";
        periodicidadeDias = 365;
    } else if (code === "1.3") {
        rotaPublica = "/";
        rotaAdmin = "/admin";
        secretaria = "Assessoria de Comunicação e TI";
        periodicidadeDias = 365;
    } else if (code === "1.4") {
        rotaPublica = "/transparencia";
        rotaAdmin = "/admin";
        secretaria = "Assessoria de Comunicação e TI";
        periodicidadeDias = 365;
    } else if (code === "2.1") {
        rotaPublica = "/transparencia/institucional";
        rotaAdmin = "/admin/secretarias";
        secretaria = "Secretaria de Administração e Planejamento";
        periodicidadeDias = 180;
    } else if (code === "2.2") {
        rotaPublica = "/transparencia/competencias";
        rotaAdmin = "/admin/secretarias";
        secretaria = "Secretaria de Administração e Planejamento";
        periodicidadeDias = 180;
    } else if (code === "2.3") {
        rotaPublica = "/transparencia/gestores";
        rotaAdmin = "/admin/secretarias";
        secretaria = "Gabinete do Prefeito";
        periodicidadeDias = 180;
    } else if (code === "2.4") {
        rotaPublica = "/secretarias";
        rotaAdmin = "/admin/secretarias";
        secretaria = "Secretaria de Administração e Planejamento";
        periodicidadeDias = 180;
    } else if (code === "2.5") {
        rotaPublica = "/secretarias";
        rotaAdmin = "/admin/secretarias";
        secretaria = "Secretaria de Administração e Planejamento";
        periodicidadeDias = 180;
    } else if (code === "2.6") {
        rotaPublica = "/transparencia/legislacao";
        rotaAdmin = "/admin/legislacao";
        secretaria = "Gabinete do Prefeito / Procuradoria Jurídica";
        periodicidadeDias = 30;
    } else if (code === "2.7") {
        rotaPublica = "/transparencia/faq";
        rotaAdmin = "/admin/faq";
        secretaria = "Ouvidoria Municipal / Controladoria";
        periodicidadeDias = 90;
    } else if (code === "2.8") {
        rotaPublica = "/";
        rotaAdmin = "/admin/configuracoes";
        secretaria = "Assessoria de Comunicação";
        periodicidadeDias = 180;
    } else if (code === "2.9") {
        rotaPublica = "/transparencia/radar";
        rotaAdmin = "/admin/pntp";
        secretaria = "Controladoria Geral do Município";
        periodicidadeDias = 365;
    } else if (code === "3.1") {
        rotaPublica = "/transparencia/receitas";
        rotaAdmin = "/admin/receitas";
        secretaria = "Secretaria de Finanças e Tributação";
        periodicidadeDias = 1;
    } else if (code === "3.2") {
        rotaPublica = "/transparencia/receitas";
        rotaAdmin = "/admin/receitas";
        secretaria = "Secretaria de Finanças e Tributação";
        periodicidadeDias = 1;
    } else if (code === "3.3") {
        rotaPublica = "/transparencia/divida-ativa";
        rotaAdmin = "/admin/importacao";
        secretaria = "Secretaria de Finanças e Tributação";
        periodicidadeDias = 30;
    } else if (code === "4.1" || code === "4.2" || code === "4.3") {
        rotaPublica = "/transparencia/despesas";
        rotaAdmin = "/admin/despesas";
        secretaria = "Secretaria de Finanças e Tributação";
        periodicidadeDias = 1;
    } else if (code === "5.1") {
        rotaPublica = "/transparencia/convenios";
        rotaAdmin = "/admin/convenios";
        secretaria = "Secretaria de Administração e Planejamento";
        periodicidadeDias = 30;
    } else if (code === "5.2") {
        rotaPublica = "/transparencia/transferencias";
        rotaAdmin = "/admin/convenios";
        secretaria = "Secretaria de Finanças e Tributação";
        periodicidadeDias = 30;
    } else if (code === "5.3") {
        rotaPublica = "/transparencia/acordos-firmados";
        rotaAdmin = "/admin/convenios";
        secretaria = "Gabinete do Prefeito";
        periodicidadeDias = 60;
    } else if (code === "6.1" || code === "6.2") {
        rotaPublica = "/transparencia/servidores";
        rotaAdmin = "/admin/servidores";
        secretaria = "Secretaria de Administração (Recursos Humanos)";
        periodicidadeDias = 30;
    } else if (code === "6.3") {
        rotaPublica = "/transparencia/servidores/quadro";
        rotaAdmin = "/admin/quadro-servidores";
        secretaria = "Secretaria de Administração (Recursos Humanos)";
        periodicidadeDias = 180;
    } else if (code === "6.4") {
        rotaPublica = "/transparencia/estagiarios";
        rotaAdmin = "/admin/estagiarios";
        secretaria = "Secretaria de Administração (Recursos Humanos)";
        periodicidadeDias = 30;
    } else if (code === "6.5") {
        rotaPublica = "/transparencia/terceirizados";
        rotaAdmin = "/admin/terceirizados";
        secretaria = "Secretaria de Administração e Planejamento";
        periodicidadeDias = 30;
    } else if (code === "6.6" || code === "6.7") {
        rotaPublica = "/transparencia/concursos";
        rotaAdmin = "/admin/concursos";
        secretaria = "Secretaria de Administração (Comissão de Concursos)";
        periodicidadeDias = 30;
    } else if (code === "7.1") {
        rotaPublica = "/transparencia/diarias";
        rotaAdmin = "/admin/diarias";
        secretaria = "Secretaria de Administração e Finanças";
        periodicidadeDias = 30;
    } else if (code === "7.2") {
        rotaPublica = "/transparencia/tabela-diarias";
        rotaAdmin = "/admin/diarias";
        secretaria = "Secretaria de Administração e Finanças";
        periodicidadeDias = 180;
    } else if (code === "8.1" || code === "8.2" || code === "8.3" || code === "8.4") {
        rotaPublica = "/transparencia/licitacoes";
        rotaAdmin = "/admin/licitacoes";
        secretaria = "Setor de Licitações e Contratos";
        periodicidadeDias = 15;
    } else if (code === "8.5") {
        rotaPublica = "/transparencia/atas-registro";
        rotaAdmin = "/admin/licitacoes";
        secretaria = "Setor de Licitações e Contratos";
        periodicidadeDias = 30;
    } else if (code === "8.6") {
        rotaPublica = "/transparencia/plano-contratacao";
        rotaAdmin = "/admin/licitacoes";
        secretaria = "Setor de Licitações e Contratos";
        periodicidadeDias = 365;
    } else if (code === "8.7") {
        rotaPublica = "/transparencia/sancoes";
        rotaAdmin = "/admin/sancoes";
        secretaria = "Controladoria Geral do Município";
        periodicidadeDias = 30;
    } else if (code === "9.1" || code === "9.2") {
        rotaPublica = "/transparencia/contratos";
        rotaAdmin = "/admin/contratos";
        secretaria = "Setor de Licitações e Contratos";
        periodicidadeDias = 30;
    } else if (code === "9.3") {
        rotaPublica = "/transparencia/fiscais-contratos";
        rotaAdmin = "/admin/contratos";
        secretaria = "Secretaria de Administração / Controladoria";
        periodicidadeDias = 30;
    } else if (code === "9.4") {
        rotaPublica = "/transparencia/ordem-cronologica";
        rotaAdmin = "/admin/ordem-cronologica";
        secretaria = "Secretaria de Finanças e Tesouraria";
        periodicidadeDias = 30;
    } else if (code === "10.1" || code === "10.2" || code === "10.3") {
        rotaPublica = "/transparencia/obras";
        rotaAdmin = "/admin/obras";
        secretaria = "Secretaria Municipal de Obras e Serviços Urbanos";
        periodicidadeDias = 30;
    } else if (code === "10.4") {
        rotaPublica = "/transparencia/obras-paralisadas";
        rotaAdmin = "/admin/obras";
        secretaria = "Secretaria Municipal de Obras e Serviços Urbanos";
        periodicidadeDias = 30;
    } else if (code === "11.1") {
        rotaPublica = "/transparencia/prestacao-contas";
        rotaAdmin = "/admin/relatorios-fiscais";
        secretaria = "Secretaria de Finanças e Contabilidade";
        periodicidadeDias = 365;
    } else if (code === "11.2") {
        rotaPublica = "/transparencia/relatorio-gestao";
        rotaAdmin = "/admin/relatorios-fiscais";
        secretaria = "Controladoria Geral do Município";
        periodicidadeDias = 365;
    } else if (code === "11.3") {
        rotaPublica = "/transparencia/parecer-tce";
        rotaAdmin = "/admin/relatorios-fiscais";
        secretaria = "Controladoria Geral do Município";
        periodicidadeDias = 365;
    } else if (code === "11.4") {
        rotaPublica = "/transparencia/julgamento-contas";
        rotaAdmin = "/admin/relatorios-fiscais";
        secretaria = "Gabinete do Prefeito / Câmara Municipal";
        periodicidadeDias = 365;
    } else if (code === "11.5") {
        rotaPublica = "/transparencia/lrf";
        rotaAdmin = "/admin/relatorios-fiscais";
        secretaria = "Secretaria de Finanças e Contabilidade";
        periodicidadeDias = 120;
    } else if (code === "11.6") {
        rotaPublica = "/transparencia/lrf";
        rotaAdmin = "/admin/relatorios-fiscais";
        secretaria = "Secretaria de Finanças e Contabilidade";
        periodicidadeDias = 60;
    } else if (code === "11.7") {
        rotaPublica = "/transparencia/plano-estrategico";
        rotaAdmin = "/admin/relatorios-fiscais";
        secretaria = "Secretaria de Administração e Planejamento";
        periodicidadeDias = 365;
    } else if (code === "11.8" || code === "11.9" || code === "11.10") {
        rotaPublica = "/transparencia/orcamento";
        rotaAdmin = "/admin/relatorios-fiscais";
        secretaria = "Secretaria de Finanças e Planejamento";
        periodicidadeDias = 365;
    } else if (code.startsWith("12.")) {
        rotaPublica = "/transparencia/passiva";
        rotaAdmin = "/admin/esic";
        secretaria = "Ouvidoria Municipal / e-SIC";
        periodicidadeDias = 30;
    } else if (code.startsWith("13.")) {
        rotaPublica = "/transparencia/acessibilidade";
        rotaAdmin = "/admin/configuracoes";
        secretaria = "Assessoria de Comunicação e TI";
        periodicidadeDias = 180;
    } else if (code.startsWith("14.")) {
        if (code === "14.3") {
            rotaPublica = "/transparencia/carta-servicos";
            rotaAdmin = "/admin/carta-servicos";
        } else {
            rotaPublica = "/servicos/ouvidoria";
            rotaAdmin = "/admin/ouvidoria";
        }
        secretaria = "Ouvidoria Geral do Município";
        periodicidadeDias = 30;
    } else if (code === "15.1" || code === "15.2") {
        rotaPublica = "/transparencia/lgpd";
        rotaAdmin = "/admin/documentos";
        secretaria = "Controladoria Geral (Encarregado DPO)";
        periodicidadeDias = 180;
    } else if (code === "15.3" || code === "15.5") {
        rotaPublica = "/transparencia/governo-digital";
        rotaAdmin = "/admin/documentos";
        secretaria = "Secretaria de Administração e TI";
        periodicidadeDias = 180;
    } else if (code === "15.4") {
        rotaPublica = "/transparencia/dados-abertos";
        rotaAdmin = "/admin/importacao";
        secretaria = "Assessoria de TI e Transparência";
        periodicidadeDias = 30;
    } else if (code === "15.6") {
        rotaPublica = "/transparencia/pesquisa-satisfacao";
        rotaAdmin = "/admin/pesquisas";
        secretaria = "Ouvidoria Geral do Município";
        periodicidadeDias = 180;
    } else if (code.startsWith("16.")) {
        if (code === "16.4") {
            rotaPublica = "/transparencia/incentivos-culturais";
            rotaAdmin = "/admin/renuncias";
        } else {
            rotaPublica = "/transparencia/renuncias-fiscais";
            rotaAdmin = "/admin/renuncias";
        }
        secretaria = "Secretaria de Finanças e Tributação";
        periodicidadeDias = 365;
    } else if (code.startsWith("17.")) {
        if (code === "17.3") {
            rotaPublica = "/transparencia/emendas-pix";
            rotaAdmin = "/admin/emendas-pix";
        } else {
            rotaPublica = "/transparencia/emendas";
            rotaAdmin = "/admin/emendas";
        }
        secretaria = "Secretaria de Finanças e Planejamento";
        periodicidadeDias = 30;
    } else if (code.startsWith("18.")) {
        if (code === "18.3") {
            rotaPublica = "/transparencia/central-regulacao";
            rotaAdmin = "/admin/central-regulacao";
            periodicidadeDias = 30;
        } else if (code === "18.4" || code === "18.5") {
            rotaPublica = "/transparencia/medicamentos-sus";
            rotaAdmin = "/admin/medicamentos";
            periodicidadeDias = 15;
        } else if (code === "18.6") {
            rotaPublica = "/transparencia/conselhos";
            rotaAdmin = "/admin/conselhos";
            periodicidadeDias = 90;
        } else if (code === "18.2") {
            rotaPublica = "/unidades-de-saude";
            rotaAdmin = "/admin/unidades";
            periodicidadeDias = 90;
        } else {
            rotaPublica = "/transparencia/plano-saude";
            rotaAdmin = "/admin/saude";
            periodicidadeDias = 365;
        }
        secretaria = "Secretaria Municipal de Saúde";
    } else if (code.startsWith("19.")) {
        if (code === "19.1") {
            rotaPublica = "/transparencia/plano-educacao";
            rotaAdmin = "/admin/documentos";
            secretaria = "Secretaria Municipal de Educação";
            periodicidadeDias = 365;
        } else if (code === "19.2") {
            rotaPublica = "/unidades-escolares";
            rotaAdmin = "/admin/unidades";
            secretaria = "Secretaria Municipal de Educação";
            periodicidadeDias = 30;
        } else {
            rotaPublica = "/transparencia/conselhos";
            rotaAdmin = "/admin/conselhos";
            secretaria = "Secretaria de Assistência Social e Educação";
            periodicidadeDias = 90;
        }
    }

    return { rotaPublica, rotaAdmin, secretaria, periodicidadeDias };
}

const criteriaCatalog = data.map((d, index) => {
    const match = d.criterio.match(/^(\d+\.\d+)\s*(.*)/);
    const codigo = match ? match[1] : (index + 1).toString();
    const textoIntegral = d.criterio.trim();
    const titulo = cleanTitle(d.criterio);

    const exigibilidadeRaw = (d.exigibilidade || "").toLowerCase();
    let classificacao = "OBRIGATORIO";
    let peso = 1.5;
    if (exigibilidadeRaw.includes("essencial")) {
        classificacao = "ESSENCIAL";
        peso = 2.0;
    } else if (exigibilidadeRaw.includes("recomendad")) {
        classificacao = "RECOMENDADO";
        peso = 1.0;
    }

    const exigencias = [];
    if ((d.disponibilidade || "").toLowerCase().includes("atende")) exigencias.push("Disponibilidade");
    if ((d.atualidade || "").toLowerCase().includes("atende")) exigencias.push("Atualidade");
    if ((d.serieHistorica || "").toLowerCase().includes("atende")) exigencias.push("Série Histórica");
    if ((d.gravacaoRelatorios || "").toLowerCase().includes("atende")) exigencias.push("Gravação de Relatórios");
    if ((d.filtrosPesquisa || "").toLowerCase().includes("atende")) exigencias.push("Filtros de Pesquisa");
    if (exigencias.length === 0) exigencias.push("Disponibilidade");

    const routeInfo = getRouteInfo(codigo, d.dimensao, d.criterio);

    return {
        codigo,
        dimensao: d.dimensao,
        titulo,
        textoIntegral,
        classificacao,
        peso,
        periodicidadeDias: routeInfo.periodicidadeDias,
        exigenciasCartilha: exigencias,
        referenciaCartilha: `Cartilha PNTP 2026 - Item ${codigo}`,
        paginaPublica: routeInfo.rotaPublica,
        telaAdministrativa: routeInfo.rotaAdmin,
        secretariaResponsavel: routeInfo.secretaria,
        statusFuncionalidade: "implementada",
        statusConteudo: "publicado",
        statusEvidencia: "conferida",
        statusValidacao: "validado",
        resultadoAvaliacaoExterna: "Atendido na Ficha de Avaliação PNTP 2026",
    };
});

console.log('Catalogo gerado com', criteriaCatalog.length, 'itens.');

const fileContent = `export interface CriterioPNTPSeed {
    codigo: string;
    dimensao: string;
    titulo: string;
    textoIntegral: string;
    classificacao: "ESSENCIAL" | "OBRIGATORIO" | "RECOMENDADO";
    peso: number;
    periodicidadeDias: number;
    exigenciasCartilha: string[];
    referenciaCartilha: string;
    paginaPublica: string;
    telaAdministrativa: string;
    secretariaResponsavel: string;
    statusFuncionalidade: "implementada" | "parcial" | "pendente";
    statusConteudo: "publicado" | "aguardando_revisao" | "desatualizado" | "nao_ocorrencia_declarada" | "pendente";
    statusEvidencia: "conferida" | "pendente";
    statusValidacao: "validado" | "em_revisao" | "com_pendencia";
    resultadoAvaliacaoExterna: string;
    pendenciasTecnicas?: string;
    pendenciasConteudo?: string;
}

export const CATALOGO_CRITERIOS_PNTP_2026: CriterioPNTPSeed[] = ${JSON.stringify(criteriaCatalog, null, 4)};
`;

fs.writeFileSync('src/lib/pntp-catalog.ts', fileContent, 'utf-8');
console.log('src/lib/pntp-catalog.ts atualizado com sucesso!');

