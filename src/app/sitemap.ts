import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const base = "https://www.lajespintadas.rn.gov.br";
    const now = new Date();

    return [
        // === RAIZ ===
        { url: base, lastModified: now, priority: 1.0, changeFrequency: "daily" },

        // === INSTITUCIONAL ===
        { url: `${base}/a-prefeitura`, lastModified: now, priority: 0.8 },
        { url: `${base}/secretarias`, lastModified: now, priority: 0.8 },
        { url: `${base}/municipio`, lastModified: now, priority: 0.7 },
        { url: `${base}/galeria`, lastModified: now, priority: 0.5 },
        { url: `${base}/noticias`, lastModified: now, priority: 0.7, changeFrequency: "daily" },
        { url: `${base}/contato`, lastModified: now, priority: 0.6 },
        { url: `${base}/mapa-do-site`, lastModified: now, priority: 0.4 },
        { url: `${base}/privacidade`, lastModified: now, priority: 0.5 },

        // === SERVIÇOS AO CIDADÃO ===
        { url: `${base}/servicos/esic`, lastModified: now, priority: 0.9, changeFrequency: "weekly" },
        { url: `${base}/servicos/esic/relatorio-anual`, lastModified: now, priority: 0.8 },
        { url: `${base}/servicos/ouvidoria`, lastModified: now, priority: 0.8 },
        { url: `${base}/servicos/consulta-protocolo`, lastModified: now, priority: 0.7 },
        { url: `${base}/servicos/saude`, lastModified: now, priority: 0.7 },
        { url: `${base}/servicos/educacao`, lastModified: now, priority: 0.7 },
        { url: `${base}/servicos/social`, lastModified: now, priority: 0.7 },
        { url: `${base}/servicos/cultura`, lastModified: now, priority: 0.6 },

        // === PORTAL DA TRANSPARÊNCIA — HUB ===
        { url: `${base}/transparencia`, lastModified: now, priority: 0.95, changeFrequency: "weekly" },

        // === EXECUÇÃO ORÇAMENTÁRIA ===
        { url: `${base}/transparencia/receitas`, lastModified: now, priority: 0.9 },
        { url: `${base}/transparencia/despesas`, lastModified: now, priority: 0.9 },
        { url: `${base}/transparencia/transferencias`, lastModified: now, priority: 0.8 },
        { url: `${base}/transparencia/emendas`, lastModified: now, priority: 0.8 },
        { url: `${base}/transparencia/emenda-pix`, lastModified: now, priority: 0.7 },
        { url: `${base}/transparencia/ordem-cronologica`, lastModified: now, priority: 0.8 },
        { url: `${base}/transparencia/orcamento`, lastModified: now, priority: 0.9 },
        { url: `${base}/transparencia/divida-ativa`, lastModified: now, priority: 0.7 },

        // === FISCAL E CONTAS PÚBLICAS ===
        { url: `${base}/transparencia/lrf`, lastModified: now, priority: 0.95, changeFrequency: "monthly" },
        { url: `${base}/transparencia/pcg`, lastModified: now, priority: 0.9 },
        { url: `${base}/transparencia/pcs`, lastModified: now, priority: 0.9 },
        { url: `${base}/transparencia/parecer-tce`, lastModified: now, priority: 0.9 },
        { url: `${base}/transparencia/julgamento-contas`, lastModified: now, priority: 0.9 },
        { url: `${base}/transparencia/relatorio-gestao`, lastModified: now, priority: 0.8 },
        { url: `${base}/transparencia/prestacao-contas`, lastModified: now, priority: 0.8 },
        { url: `${base}/transparencia/renuncias-fiscais`, lastModified: now, priority: 0.7 },
        { url: `${base}/transparencia/desoneracoes`, lastModified: now, priority: 0.7 },

        // === GESTÃO ADMINISTRATIVA ===
        { url: `${base}/transparencia/licitacoes`, lastModified: now, priority: 0.9 },
        { url: `${base}/transparencia/contratos`, lastModified: now, priority: 0.9 },
        { url: `${base}/transparencia/convenios`, lastModified: now, priority: 0.8 },
        { url: `${base}/transparencia/atas-registro`, lastModified: now, priority: 0.8 },
        { url: `${base}/transparencia/obras`, lastModified: now, priority: 0.8 },
        { url: `${base}/transparencia/diarias`, lastModified: now, priority: 0.7 },
        { url: `${base}/transparencia/tabela-diarias`, lastModified: now, priority: 0.6 },
        { url: `${base}/transparencia/regulamentacao-diarias`, lastModified: now, priority: 0.6 },
        { url: `${base}/transparencia/frota`, lastModified: now, priority: 0.7 },
        { url: `${base}/transparencia/publicacoes`, lastModified: now, priority: 0.8 },
        { url: `${base}/transparencia/plano-contratacao`, lastModified: now, priority: 0.8 },

        // === NORMATIVO ===
        { url: `${base}/transparencia/legislacao`, lastModified: now, priority: 0.8 },
        { url: `${base}/transparencia/leis`, lastModified: now, priority: 0.8 },
        { url: `${base}/transparencia/decretos`, lastModified: now, priority: 0.8 },
        { url: `${base}/transparencia/portarias`, lastModified: now, priority: 0.7 },

        // === PESSOAL ===
        { url: `${base}/transparencia/servidores`, lastModified: now, priority: 0.9 },
        { url: `${base}/transparencia/servidores/folha-pagamento`, lastModified: now, priority: 0.9 },
        { url: `${base}/transparencia/servidores/agentes-politicos`, lastModified: now, priority: 0.9 },
        { url: `${base}/transparencia/servidores/terceirizados`, lastModified: now, priority: 0.8 },
        { url: `${base}/transparencia/servidores/estagiarios`, lastModified: now, priority: 0.8 },
        { url: `${base}/transparencia/servidores/cargos-e-salarios`, lastModified: now, priority: 0.8 },
        { url: `${base}/transparencia/concursos`, lastModified: now, priority: 0.8 },
        { url: `${base}/transparencia/processo-seletivo`, lastModified: now, priority: 0.7 },

        // === SAÚDE ===
        { url: `${base}/transparencia/saude`, lastModified: now, priority: 0.8 },
        { url: `${base}/transparencia/medicamentos-sus`, lastModified: now, priority: 0.8 },
        { url: `${base}/transparencia/plano-saude`, lastModified: now, priority: 0.7 },
        { url: `${base}/transparencia/unidades-saude`, lastModified: now, priority: 0.7 },
        { url: `${base}/transparencia/central-regulacao`, lastModified: now, priority: 0.7 },

        // === PLANEJAMENTO ===
        { url: `${base}/transparencia/plano-educacao`, lastModified: now, priority: 0.7 },
        { url: `${base}/transparencia/plano-estrategico`, lastModified: now, priority: 0.7 },

        // === INSTITUCIONAL TRANSPARÊNCIA ===
        { url: `${base}/transparencia/institucional`, lastModified: now, priority: 0.8 },
        { url: `${base}/transparencia/gestores`, lastModified: now, priority: 0.8 },
        { url: `${base}/transparencia/conselhos`, lastModified: now, priority: 0.7 },
        { url: `${base}/transparencia/associacoes`, lastModified: now, priority: 0.6 },
        { url: `${base}/transparencia/simbolos`, lastModified: now, priority: 0.5 },

        // === CIVIC / CIDADANIA ===
        { url: `${base}/transparencia/carta-servicos`, lastModified: now, priority: 0.8 },
        { url: `${base}/transparencia/pesquisa-satisfacao`, lastModified: now, priority: 0.7 },
        { url: `${base}/transparencia/covid19`, lastModified: now, priority: 0.6 },
        { url: `${base}/transparencia/incentivos-culturais`, lastModified: now, priority: 0.7 },

        // === TECNOLOGIA / DADOS ===
        { url: `${base}/transparencia/dados-abertos`, lastModified: now, priority: 0.8 },
        { url: `${base}/transparencia/governo-digital`, lastModified: now, priority: 0.7 },
        { url: `${base}/transparencia/lgpd`, lastModified: now, priority: 0.7 },
        { url: `${base}/transparencia/integridade`, lastModified: now, priority: 0.8 },

        // === ACESSIBILIDADE E AJUDA ===
        { url: `${base}/transparencia/acessibilidade`, lastModified: now, priority: 0.8 },
        { url: `${base}/transparencia/faq`, lastModified: now, priority: 0.7 },
        { url: `${base}/transparencia/glossario`, lastModified: now, priority: 0.6 },
        { url: `${base}/transparencia/radar`, lastModified: now, priority: 0.8 },

        // === TRANSPARÊNCIA PASSIVA ===
        { url: `${base}/transparencia/passiva`, lastModified: now, priority: 0.8 },
        { url: `${base}/transparencia/passiva/institucional`, lastModified: now, priority: 0.7 },
    ];
}
