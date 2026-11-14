import Link from "next/link";
import Image from "next/image";
import { 
    FaPhone, 
    FaEnvelope, 
    FaLocationDot, 
    FaClock, 
    FaShieldHalved, 
    FaFileLines, 
    FaUniversalAccess 
} from "react-icons/fa6";
import { MUNICIPIO } from "@/config/municipio";

export default function PreviaFooter() {
    return (
        <footer id="rodape-previa" className="bg-[#0B2545] text-white border-t-4 border-[#F39A32]">
            <div className="max-w-[1240px] mx-auto px-4 sm:px-6 pt-14 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
                    {/* Coluna 1: Identidade */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/10 rounded-[10px] p-1.5 flex items-center justify-center border border-white/20">
                                <Image
                                    src="/images/logo-lajes-pintadas-new.png"
                                    alt="Brasão de Lajes Pintadas"
                                    width={40}
                                    height={40}
                                    className="object-contain"
                                />
                            </div>
                            <div>
                                <span className="block text-[10px] uppercase tracking-widest text-amber-300 font-bold">
                                    Prefeitura Municipal
                                </span>
                                <h3 className="text-base font-extrabold text-white font-heading">
                                    Lajes Pintadas / RN
                                </h3>
                            </div>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed font-normal">
                            Portal oficial do Poder Executivo de Lajes Pintadas. Transparência ativa, governança pública e serviços acessíveis ao cidadão.
                        </p>

                        <div className="pt-2 text-[11px] text-slate-400">
                            <span>CNPJ: {MUNICIPIO.cnpj}</span>
                        </div>
                    </div>

                    {/* Coluna 2: Atendimento e Sede */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 font-heading flex items-center gap-2">
                            <FaLocationDot size={12} /> Sede Administrativa
                        </h4>
                        <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
                            <p>{MUNICIPIO.nomeCompleto}</p>
                            <p>{MUNICIPIO.endereco}</p>
                            <p>Lajes Pintadas / RN – CEP: {MUNICIPIO.cep}</p>
                        </div>
                        <div className="pt-1 flex items-center gap-2 text-xs text-slate-300">
                            <FaClock size={12} className="text-amber-300 shrink-0" />
                            <span>Seg. a Sex., {MUNICIPIO.horario}</span>
                        </div>
                    </div>

                    {/* Coluna 3: Contatos Oficiais */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 font-heading flex items-center gap-2">
                            <FaPhone size={12} /> Contatos e Canais
                        </h4>
                        <div className="text-xs text-slate-300 space-y-2.5">
                            <div className="flex items-center gap-2">
                                <FaPhone size={12} className="text-slate-400" />
                                <span>{MUNICIPIO.telefone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaEnvelope size={12} className="text-slate-400" />
                                <span className="break-all">{MUNICIPIO.email}</span>
                            </div>
                            <div className="pt-2">
                                <Link
                                    href="/servicos/ouvidoria"
                                    className="inline-flex items-center gap-1.5 text-xs text-amber-300 hover:underline font-semibold"
                                >
                                    <span>Ouvidoria Geral do Município →</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Coluna 4: Transparência e Acesso */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 font-heading flex items-center gap-2">
                            <FaShieldHalved size={12} /> Transparência e Leis
                        </h4>
                        <ul className="text-xs text-slate-300 space-y-2">
                            <li>
                                <Link href="/previa/transparencia" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                                    <span>• Portal da Transparência</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/previa/licitacoes" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                                    <span>• Licitações e Contratos</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/servicos/esic" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                                    <span>• e-SIC (Acesso à Informação)</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/transparencia/dados-abertos" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                                    <span>• Dados Abertos e API</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacidade" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                                    <span>• Política de Privacidade (LGPD)</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Barra Inferior */}
                <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
                    <p>
                        © {new Date().getFullYear()} Prefeitura Municipal de Lajes Pintadas / RN. Todos os direitos reservados.
                    </p>
                    <div className="flex items-center gap-4 text-slate-400">
                        <span>Padrão Digital de Governo</span>
                        <span>·</span>
                        <span>WCAG 2.2 AA / e-MAG</span>
                        <span>·</span>
                        <span className="text-amber-300 font-semibold">Critérios PNTP 2026</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

