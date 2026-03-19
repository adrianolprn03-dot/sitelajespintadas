import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const base = "https://www.lajespintadas.rn.gov.br";
    return [
        { url: base, priority: 1.0 },
        { url: `${base}/a-prefeitura`, priority: 0.8 },
        { url: `${base}/secretarias`, priority: 0.8 },
        { url: `${base}/noticias`, priority: 0.7 },
        { url: `${base}/galeria`, priority: 0.5 },
        { url: `${base}/transparencia`, priority: 0.9 },
        { url: `${base}/transparencia/receitas`, priority: 0.8 },
        { url: `${base}/transparencia/despesas`, priority: 0.8 },
        { url: `${base}/transparencia/licitacoes`, priority: 0.8 },
        { url: `${base}/transparencia/contratos`, priority: 0.8 },
        { url: `${base}/transparencia/convenios`, priority: 0.7 },
        { url: `${base}/transparencia/diarias`, priority: 0.7 },
        { url: `${base}/transparencia/servidores`, priority: 0.8 },
        { url: `${base}/transparencia/obras`, priority: 0.8 },
        { url: `${base}/transparencia/relatorios`, priority: 0.9 },
        { url: `${base}/transparencia/orcamento`, priority: 0.9 },
        { url: `${base}/transparencia/legislacao`, priority: 0.9 },
        { url: `${base}/transparencia/dados-abertos`, priority: 0.7 },
        { url: `${base}/transparencia/faq`, priority: 0.7 },
        { url: `${base}/transparencia/glossario`, priority: 0.6 },
        { url: `${base}/servicos/esic`, priority: 0.9 },
        { url: `${base}/servicos/ouvidoria`, priority: 0.8 },
        { url: `${base}/privacidade`, priority: 0.5 },
        { url: `${base}/mapa-do-site`, priority: 0.4 },
    ];
}
