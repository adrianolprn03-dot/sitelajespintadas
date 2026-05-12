import Link from "next/link";
import { FaFacebook, FaInstagram, FaYoutube, FaEnvelope, FaPhone, FaMapMarkerAlt, FaWhatsapp } from "react-icons/fa";
import { prisma } from "@/lib/prisma";

const footerLinks = [
    {
        title: "Institucional",
        links: [
            { label: "História da Cidade", href: "/a-prefeitura/historia" },
            { label: "Prefeito e Vice", href: "/a-prefeitura/prefeito" },
            { label: "Secretarias", href: "/secretarias" },
            { label: "Estrutura Administrativa", href: "/a-prefeitura/estrutura" },
            { label: "Agenda do Prefeito", href: "/a-prefeitura/agenda" },
        ],
    },
    {
        title: "Transparência",
        links: [
            { label: "Portal da Transparência", href: "/transparencia" },
            { label: "Institucional", href: "/transparencia/institucional" },
            { label: "Obras Públicas", href: "/transparencia/obras" },
            { label: "Receitas Públicas", href: "/transparencia/receitas" },
            { label: "Despesas Públicas", href: "/transparencia/despesas" },
            { label: "Licitações e Contratos", href: "/transparencia/licitacoes" },
            { label: "Legislação Municipal", href: "/transparencia/leis" },
            { label: "Dados Abertos", href: "/transparencia/dados-abertos" },
            { label: "Transferências e Emendas", href: "/transparencia/transferencias" },
            { label: "Dívida Ativa", href: "/transparencia/divida-ativa" },
            { label: "Radar PNTP 2026", href: "/transparencia/radar" },
            { label: "Transparência Passiva (e-SIC)", href: "/transparencia/passiva" },
        ],
    },
    {
        title: "Serviços ao Cidadão",
        links: [
            { label: "Ouvidoria Municipal", href: "/servicos/ouvidoria" },
            { label: "e-SIC (LAI)", href: "/servicos/esic" },
            { label: "Unidades de Saúde", href: "/unidades-de-saude" },
            { label: "Assistência Social", href: "/servicos/social" },
            { label: "Educação e Escolas", href: "/servicos/educacao" },
            { label: "Cultura e Esporte", href: "/servicos/cultura" },
            { label: "FAQ / Perguntas", href: "/transparencia/faq" },
            { label: "Glossário de Termos", href: "/transparencia/glossario" },
            { label: "Política de Privacidade", href: "/privacidade" },
            { label: "Acessibilidade Digital", href: "/transparencia/acessibilidade" },
            { label: "Mapa do Site", href: "/mapa-do-site" },
        ],
    },
];

async function getConfig(chave: string, padrao: string) {
    const config = await prisma.configuracao.findUnique({ where: { chave } });
    return config?.valor || padrao;
}

export default async function Footer() {
    const cnpj = await getConfig("cnpj", "08.159.394/0001-37");
    const endereco = await getConfig("endereco_sede", "Rua São Francisco, 275, Centro, Lajes Pintadas/RN");
    const email = await getConfig("contato_email", "ouvidoria@lajespintadas.rn.gov.br");
    const telefone = await getConfig("contato_telefone", "(84) 9 8748-0287");
    const razaoSocial = await getConfig("municipio_nome", "Prefeitura Municipal de Lajes Pintadas");
    const whatsapp = await getConfig("contato_whatsapp", "");
    const facebook = await getConfig("redes_facebook", "#");
    const instagram = await getConfig("redes_instagram", "#");
    const youtube = await getConfig("redes_youtube", "#");

    const whatsappHref = whatsapp
        ? `https://wa.me/55${whatsapp.replace(/\D/g, "")}`
        : "#";

    const socialLinks = [
        { Icon: FaFacebook, href: facebook, color: "hover:bg-blue-600", label: "Facebook" },
        { Icon: FaInstagram, href: instagram, color: "hover:bg-pink-600", label: "Instagram" },
        { Icon: FaYoutube, href: youtube, color: "hover:bg-red-600", label: "YouTube" },
        { Icon: FaWhatsapp, href: whatsappHref, color: "hover:bg-green-600", label: "WhatsApp" },
    ];

    return (
        <footer className="bg-[#0088b9] text-blue-50/70" role="contentinfo">
            {/* Newsletter / CTA */}
            <div className="bg-[#01b0ef] border-b-8 border-[#FDB913]">
                <div className="max-w-[1300px] mx-auto px-6 py-14 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div>
                        <h3 className="text-white font-black text-2xl lg:text-4xl uppercase tracking-tighter mb-4">Central de Atendimento</h3>
                        <p className="text-[#FDB913] font-black text-[11px] tracking-[0.3em] uppercase opacity-90">Prefeitura de Lajes Pintadas – RN</p>
                    </div>
                    <div className="flex flex-wrap gap-4 w-full md:w-auto">
                        <Link
                            href="/servicos/ouvidoria"
                            className="flex-1 md:flex-none text-center bg-[#FDB913] text-[#01b0ef] font-black px-10 py-5 rounded-[2rem] hover:bg-white transition-all text-[11px] uppercase tracking-widest shadow-xl shadow-black/10"
                        >
                            Fale com a Ouvidoria
                        </Link>
                        <Link
                            href="/transparencia"
                            className="flex-1 md:flex-none text-center border-2 border-white/20 text-white font-black px-10 py-5 rounded-[2rem] hover:bg-white hover:text-[#01b0ef] transition-all text-[11px] uppercase tracking-widest shadow-xl shadow-black/10 backdrop-blur-sm"
                        >
                            Portal da Transparência
                        </Link>
                    </div>
                </div>
            </div>

            {/* Links e Info */}
            <div className="max-w-[1300px] mx-auto px-6 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16">
                    
                    {/* Logo e Contato (4 colunas) - REFOÇADO V7 */}
                    <div className="lg:col-span-4">
                        <div className="flex items-center gap-6 mb-12 group cursor-default">
                            <div className="p-2 transition-transform duration-500 group-hover:scale-105 group-hover:rotate-2">
                                <img
                                    src="/logo_v2_white.png"
                                    alt="Brasão Oficial de Lajes Pintadas"
                                    className="h-16 md:h-20 w-auto object-contain drop-shadow-md max-w-[200px]"
                                />
                            </div>
                            <div className="text-white font-black text-2xl leading-[1.1] uppercase tracking-tighter">
                                Prefeitura Municipal <br />
                                <span className="text-[#FDB913] drop-shadow-sm">Lajes Pintadas</span>
                                <div className="text-[10px] text-blue-100/30 mt-2 font-black tracking-[0.3em]">Rio Grande do Norte</div>
                            </div>
                        </div>
                        
                        <p className="text-blue-100/60 text-sm mb-8 leading-relaxed font-medium">
                            Compromisso com o desenvolvimento sustentável e a transparência em prol de todos os cidadãos lajes-pintadenses.
                        </p>

                        <div className="space-y-4 text-sm font-bold">
                            <div className="flex items-start gap-4 text-blue-100/80">
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                                    <FaMapMarkerAlt className="text-[#FDB913]" />
                                </div>
                                <span className="leading-tight">{endereco}</span>
                            </div>
                            <div className="flex items-center gap-4 text-blue-100/80">
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                                    <FaPhone className="text-[#FDB913]" />
                                </div>
                                <span>{telefone}</span>
                            </div>
                            <div className="flex items-center gap-4 text-blue-100/80">
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                                    <FaEnvelope className="text-[#FDB913]" />
                                </div>
                                <a href={`mailto:${email}`} className="hover:text-white transition-colors">
                                    {email}
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Links de Navegação (8 colunas divididas) */}
                    <div className="lg:col-span-8">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
                            {footerLinks.map((section) => (
                                <div key={section.title}>
                                    <h4 className="text-white font-black text-[11px] uppercase tracking-[0.2em] mb-8 relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-1 after:bg-[#FDB913] after:rounded-full">
                                        {section.title}
                                    </h4>
                                    <ul className="space-y-4">
                                        {section.links.map((link) => (
                                            <li key={link.href}>
                                                <Link
                                                    href={link.href}
                                                    className="text-blue-100/50 text-[13px] font-bold hover:text-white hover:translate-x-1 transition-all duration-300 block"
                                                >
                                                    {link.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Barra Inferior com Redes Sociais */}
                <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-100/30">Mídias Sociais</span>
                        <div className="flex gap-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target={social.href !== "#" ? "_blank" : undefined}
                                    rel={social.href !== "#" ? "noopener noreferrer" : undefined}
                                    aria-label={social.label}
                                    title={social.label}
                                    className={`w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center transition-all duration-300 text-white/50 hover:text-white hover:scale-110 shadow-lg ${social.color} ${social.href === "#" ? "opacity-30 cursor-default pointer-events-none" : ""}`}
                                >
                                    <social.Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-blue-100/30">
                        <Link href="/mapa-do-site" className="hover:text-white transition-colors">Mapa do Site</Link>
                        <Link href="/privacidade" className="hover:text-white transition-colors">Privacidade</Link>
                        <a href="/admin" className="px-6 py-2.5 bg-white/5 rounded-full hover:bg-white/10 transition-all border border-white/5 shadow-inner">Painel Administrativo</a>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-12 text-center">
                    <div className="text-[10px] font-bold text-blue-100/20 uppercase tracking-[0.2em] space-y-2">
                        <p>© {new Date().getFullYear()} {razaoSocial}. CNPJ {cnpj}</p>
                        <p>Desenvolvido com foco em acessibilidade e transparência pública.</p>
                    </div>
                </div>
            </div>

            {/* LGPD */}
            <div className="bg-[#003670] text-center py-5 px-6 border-t border-white/5">
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-100/20">
                    Este site utiliza cookies para melhorar sua experiência. Em conformidade com a LGPD (Lei nº 13.709/2018).
                </p>
            </div>
        </footer>
    );
}
