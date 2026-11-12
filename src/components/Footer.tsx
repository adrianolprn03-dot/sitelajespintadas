import Link from "next/link";
import {
    FaFacebook,
    FaInstagram,
    FaYoutube,
    FaWhatsapp,
    FaLocationDot,
    FaPhone,
    FaEnvelope,
    FaClock,
} from "react-icons/fa6";
import { prisma } from "@/lib/prisma";
import { MUNICIPIO } from "@/config/municipio";

const footerLinks = [
    {
        title: "Institucional",
        color: "bg-[#0072CE]",
        links: [
            { label: "A Prefeitura", href: "/a-prefeitura" },
            { label: "Prefeito e Vice", href: "/a-prefeitura/prefeito" },
            { label: "História da Cidade", href: "/a-prefeitura/historia" },
            { label: "Símbolos Municipais", href: "/municipio/simbolos" },
            { label: "Secretarias Municipais", href: "/secretarias" },
            { label: "Estrutura Administrativa", href: "/a-prefeitura/estrutura" },
            { label: "Unidades Escolares", href: "/unidades-escolares" },
            { label: "Unidades de Saúde", href: "/unidades-de-saude" },
        ],
    },
    {
        title: "Transparência Pública",
        color: "bg-[#FACC15]",
        links: [
            { label: "Portal da Transparência", href: "/transparencia" },
            { label: "Licitações Públicas (PNCP)", href: "/transparencia/licitacoes" },
            { label: "Contratos Administrativos", href: "/transparencia/contratos" },
            { label: "Receitas e Despesas", href: "/transparencia/receitas" },
            { label: "Quadro de Servidores", href: "/transparencia/servidores" },
            { label: "Obras Públicas", href: "/transparencia/obras" },
            { label: "Legislação Municipal", href: "/transparencia/legislacao" },
            { label: "Dados Abertos e API", href: "/transparencia/dados-abertos" },
            { label: "Transparência Passiva (e-SIC)", href: "/transparencia/passiva" },
        ],
    },
    {
        title: "Serviços ao Cidadão",
        color: "bg-[#0072CE]",
        links: [
            { label: "Carta de Serviços", href: "/transparencia/carta-servicos" },
            { label: "Ouvidoria Municipal", href: "/servicos/ouvidoria" },
            { label: "e-SIC (Acesso à Informação)", href: "/servicos/esic" },
            { label: "Consulta de Protocolo", href: "/servicos/consulta-protocolo" },
            { label: "Medicamentos SUS", href: "/transparencia/medicamentos-sus" },
            { label: "Central de Regulação", href: "/transparencia/central-regulacao" },
            { label: "Fila de Creches", href: "/transparencia/fila-creches" },
            { label: "Política de Privacidade (LGPD)", href: "/privacidade" },
            { label: "Mapa do Site", href: "/mapa-do-site" },
        ],
    },
];

async function getConfig(chave: string, padrao: string) {
    try {
        const config = await prisma.configuracao.findUnique({ where: { chave } });
        return config?.valor || padrao;
    } catch {
        return padrao;
    }
}

export default async function Footer() {
    const cnpj = await getConfig("cnpj", MUNICIPIO.cnpj);
    const endereco = await getConfig("endereco_sede", `${MUNICIPIO.endereco}, ${MUNICIPIO.nome}/${MUNICIPIO.uf}`);
    const email = await getConfig("contato_email", MUNICIPIO.email);
    const telefone = await getConfig("contato_telefone", MUNICIPIO.telefone);
    const razaoSocial = await getConfig("municipio_nome", MUNICIPIO.nomeCompleto);
    const whatsapp = await getConfig("contato_whatsapp", "");
    const facebook = await getConfig("redes_facebook", "#");
    const instagram = await getConfig("redes_instagram", "#");
    const youtube = await getConfig("redes_youtube", "#");

    const whatsappHref = whatsapp ? `https://wa.me/55${whatsapp.replace(/\D/g, "")}` : "#";

    const socialLinks = [
        { Icon: FaInstagram, href: instagram, label: "Instagram" },
        { Icon: FaFacebook, href: facebook, label: "Facebook" },
        { Icon: FaYoutube, href: youtube, label: "YouTube" },
        { Icon: FaWhatsapp, href: whatsappHref, label: "WhatsApp" },
    ].filter((s) => s.href && s.href !== "#");

    return (
        <footer className="bg-gradient-to-b from-[#002B5C] to-[#041A38] text-slate-200 relative pb-16 lg:pb-0" role="contentinfo">
            {/* Filete Superior com as 4 Cores Oficiais do Brasão de Lajes Pintadas */}
            <div className="h-1.5 w-full heraldic-stripe" />

            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 pt-14 pb-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-10">
                    {/* Coluna Institucional com Brasão Colorido Oficial e Logo */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center gap-3.5">
                            <div className="w-14 h-14 bg-white rounded-2xl p-1.5 flex items-center justify-center shadow-md ring-2 ring-[#FACC15]/80 shrink-0">
                                <img
                                    src="/images/brasao-lajes-pintadas.png"
                                    alt={`Brasão Oficial de ${MUNICIPIO.nome}/${MUNICIPIO.uf}`}
                                    className="object-contain h-11 w-11"
                                />
                            </div>
                            <div>
                                <span className="block text-[10px] uppercase tracking-widest text-[#FACC15] font-extrabold">
                                    Poder Executivo Municipal
                                </span>
                                <h4 className="text-base sm:text-lg font-black text-white font-heading leading-tight">
                                    {razaoSocial}
                                </h4>
                                <span className="block text-[11px] text-sky-200/80 font-medium">
                                    Estado do {MUNICIPIO.estado} – {MUNICIPIO.uf}
                                </span>
                            </div>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
                            Compromisso permanente com a legalidade, publicidade, eficiência e transparência ativa na gestão pública de {MUNICIPIO.nome}/{MUNICIPIO.uf}.
                        </p>

                        <div className="text-xs space-y-2.5 pt-2 text-slate-200">
                            <div className="flex items-start gap-2.5">
                                <FaLocationDot className="text-[#FACC15] shrink-0 mt-0.5" size={13} />
                                <span>{endereco} – CEP {MUNICIPIO.cep}</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <FaClock className="text-[#FACC15] shrink-0" size={13} />
                                <span>Segunda a Sexta-feira, das {MUNICIPIO.horario}</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <FaPhone className="text-[#FACC15] shrink-0" size={13} />
                                <span>{telefone}</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <FaEnvelope className="text-[#FACC15] shrink-0" size={13} />
                                <span className="break-all">{email}</span>
                            </div>
                        </div>

                        <div className="text-[11px] text-slate-300/80 pt-1 flex flex-wrap items-center gap-2">
                            <span className="bg-white/10 px-2.5 py-1 rounded-md font-semibold text-white">
                                CNPJ: {cnpj}
                            </span>
                            <span className="bg-white/10 px-2.5 py-1 rounded-md font-semibold text-white">
                                IBGE: {MUNICIPIO.ibge}
                            </span>
                        </div>

                        {socialLinks.length > 0 && (
                            <div className="flex items-center gap-2 pt-2">
                                {socialLinks.map((s, idx) => (
                                    <a
                                        key={idx}
                                        href={s.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#0072CE] text-white flex items-center justify-center transition-colors"
                                        aria-label={s.label}
                                    >
                                        <s.Icon size={15} />
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Colunas de Links com marcadores nas cores do Brasão */}
                    {footerLinks.map((col, cIdx) => (
                        <div key={cIdx} className="space-y-3.5">
                            <div className="flex items-center gap-2">
                                <span className={`w-2 h-4 rounded-full ${col.color}`} />
                                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#FACC15] font-heading">
                                    {col.title}
                                </h4>
                            </div>
                            <ul className="text-xs space-y-2">
                                {col.links.map((lnk, lIdx) => (
                                    <li key={lIdx}>
                                        <Link
                                            href={lnk.href}
                                            className="text-slate-300 hover:text-white hover:translate-x-0.5 transition-all inline-block py-0.5"
                                        >
                                            {lnk.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Linha de Direitos e Normas */}
                <div className="pt-6 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-300">
                    <p>
                        © {new Date().getFullYear()} {razaoSocial} – Todos os direitos reservados.
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#FACC15]" />
                            Padrão Digital de Governo
                        </span>
                        <span>·</span>
                        <span>WCAG 2.2 AA / e-MAG 3.1</span>
                        <span>·</span>
                        <span className="text-[#FACC15] font-bold">Conformidade LAI, LRF & PNTP 2026</span>
                    </div>
                </div>
            </div>

            {/* Faixa Inferior Institucional com a Logo Oficial da Prefeitura de Lajes Pintadas/RN */}
            <div className="bg-[#021226] py-4 px-4 sm:px-6 border-t border-white/10">
                <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/80">
                    <div className="flex items-center gap-3">
                        <img
                            src="/images/logo-lajes-pintadas-new.png"
                            alt={`Logo da ${MUNICIPIO.nomeCompleto}`}
                            className="h-8 w-auto object-contain opacity-95"
                        />
                        <div className="border-l border-white/20 pl-3">
                            <span className="block text-[9px] uppercase tracking-wider text-[#FACC15] font-bold leading-tight">
                                PORTAL OFICIAL DO MUNICÍPIO
                            </span>
                            <span className="block text-xs font-black text-white font-heading leading-tight">
                                {MUNICIPIO.nome.toUpperCase()} / {MUNICIPIO.uf}
                            </span>
                        </div>
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium">
                        Encarregado de Dados (LGPD): {MUNICIPIO.dpo} ({MUNICIPIO.dpoEmail})
                    </div>
                </div>
            </div>
        </footer>
    );
}
