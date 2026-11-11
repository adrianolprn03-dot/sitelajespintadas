import Link from "next/link";
import { FaFacebook, FaInstagram, FaYoutube, FaWhatsapp, FaLocationDot, FaPhone, FaEnvelope, FaClock } from "react-icons/fa6";
import { prisma } from "@/lib/prisma";
import { MUNICIPIO } from "@/config/municipio";

const footerLinks = [
    {
        title: "Institucional",
        links: [
            { label: "História da Cidade", href: "/a-prefeitura/historia" },
            { label: "Prefeito e Vice", href: "/a-prefeitura/prefeito" },
            { label: "Secretarias Municipais", href: "/secretarias" },
            { label: "Estrutura Administrativa", href: "/a-prefeitura/estrutura" },
            { label: "Unidades Escolares", href: "/unidades-escolares" },
            { label: "Unidades de Saúde", href: "/unidades-de-saude" },
        ],
    },
    {
        title: "Transparência Pública",
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
        links: [
            { label: "Ouvidoria Municipal", href: "/servicos/ouvidoria" },
            { label: "e-SIC (LAI)", href: "/servicos/esic" },
            { label: "Medicamentos SUS", href: "/transparencia/medicamentos-sus" },
            { label: "Central de Regulação", href: "/transparencia/central-regulacao" },
            { label: "Fila de Creches", href: "/transparencia/educacao" },
            { label: "Conselhos Municipais", href: "/transparencia/conselhos" },
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
        <footer className="bg-[#0B2545] text-slate-300 border-t-4 border-[#F39A32]" role="contentinfo">
            {/* Links e Informações Institucionais */}
            <div className="max-w-[1240px] mx-auto px-4 sm:px-6 pt-12 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
                    {/* Coluna Institucional */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/10 rounded-[8px] p-1.5 flex items-center justify-center border border-white/20 shrink-0">
                                <img
                                    src="/images/logo-lajes-pintadas-new.png"
                                    alt="Brasão de Lajes Pintadas"
                                    className="object-contain h-9 w-auto"
                                />
                            </div>
                            <div>
                                <span className="block text-[10px] uppercase tracking-wider text-amber-300 font-bold">
                                    Poder Executivo Municipal
                                </span>
                                <h4 className="text-base font-extrabold text-white font-heading">
                                    {razaoSocial}
                                </h4>
                            </div>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
                            Compromisso com a legalidade, publicidade, integridade e transparência na gestão dos recursos públicos de Lajes Pintadas/RN.
                        </p>

                        <div className="text-xs space-y-2 pt-2 text-slate-300">
                            <div className="flex items-start gap-2">
                                <FaLocationDot className="text-amber-300 shrink-0 mt-0.5" size={13} />
                                <span>{endereco}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaClock className="text-amber-300 shrink-0" size={13} />
                                <span>Segunda a Sexta-feira, das {MUNICIPIO.horario}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaPhone className="text-amber-300 shrink-0" size={13} />
                                <span>{telefone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaEnvelope className="text-amber-300 shrink-0" size={13} />
                                <span className="break-all">{email}</span>
                            </div>
                        </div>

                        <div className="text-[11px] text-slate-400 pt-1">
                            <span>CNPJ: {cnpj}</span>
                        </div>

                        {socialLinks.length > 0 && (
                            <div className="flex items-center gap-2 pt-2">
                                {socialLinks.map((s, idx) => (
                                    <a
                                        key={idx}
                                        href={s.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-8 h-8 rounded-[6px] bg-white/10 hover:bg-[#F39A32] text-white flex items-center justify-center transition-colors"
                                        aria-label={s.label}
                                    >
                                        <s.Icon size={14} />
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Colunas de Links */}
                    {footerLinks.map((col, cIdx) => (
                        <div key={cIdx} className="space-y-3">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 font-heading">
                                {col.title}
                            </h4>
                            <ul className="text-xs space-y-2">
                                {col.links.map((lnk, lIdx) => (
                                    <li key={lIdx}>
                                        <Link
                                            href={lnk.href}
                                            className="text-slate-300 hover:text-white hover:underline transition-colors block py-0.5"
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
                <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
                    <p>
                        © {new Date().getFullYear()} {razaoSocial} – Todos os direitos reservados.
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                        <span>Padrão Digital de Governo</span>
                        <span>·</span>
                        <span>WCAG 2.2 AA / e-MAG</span>
                        <span>·</span>
                        <span className="text-amber-300 font-bold">Critérios PNTP 2026</span>
                    </div>
                </div>
            </div>

            {/* FAIXA INFERIOR EXATA DA IMAGEM DE REFERÊNCIA */}
            <div className="bg-[#07192F] py-3.5 px-4 sm:px-6 border-t border-white/10">
                <div className="max-w-[1240px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/70">
                    <div className="flex items-center gap-3">
                        <img 
                            src="/images/logo-lajes-pintadas-new.png" 
                            alt="Prefeitura de Lajes Pintadas" 
                            className="h-7 w-auto object-contain brightness-0 invert opacity-90" 
                        />
                        <div className="border-l border-white/20 pl-3">
                            <span className="block text-[9px] uppercase tracking-wider text-white/60 leading-tight">PREFEITURA DE</span>
                            <span className="block text-xs font-black text-white font-heading leading-tight">LAJES PINTADAS/RN</span>
                        </div>
                    </div>
                    <div className="text-[11px] text-white/60 italic font-medium">
                        Prévia de design • imagens ilustrativas
                    </div>
                </div>
            </div>
        </footer>
    );
}
