"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FaBuilding, FaSpinner } from "react-icons/fa";
import PageHeader from "@/components/PageHeader";
import { getSecretariaIcon } from "@/lib/icons";



type Secretaria = {
    id: string;
    nome: string;
    slug: string;
    descricao: string;
    secretario?: string;
    imagem?: string;
    telefone?: string;
    email?: string;
    endereco?: string;
    horarioFuncionamento?: string;
    servicos: string; // Store as JSON string or array
};

const defaultCores = [
    "from-blue-600 to-blue-800",
    "from-green-500 to-green-700",
    "from-yellow-500 to-orange-600",
    "from-gray-600 to-gray-800",
    "from-emerald-600 to-teal-700",
    "from-purple-500 to-purple-700",
    "from-lime-600 to-green-700",
    "from-pink-500 to-rose-600",
];

export default function SecretariasPage() {
    const [secretarias, setSecretarias] = useState<Secretaria[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSecretarias = async () => {
            setLoading(true);
            try {
                const res = await fetch("/api/secretarias");
                const data = await res.json();
                setSecretarias(data || []);
            } catch (error) {
                console.error("Erro ao buscar secretarias:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSecretarias();
    }, []);

    return (
        <div>
            <PageHeader
                title="Secretarias Municipais"
                subtitle="Conheça as secretarias da Prefeitura de Lajes Pintadas e os serviços que cada uma oferece"
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Secretarias" }
                ]}
            />

            <div className="py-16 bg-gray-50 min-h-[400px]">
                <div className="max-w-[1200px] mx-auto px-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-10 h-10 border-4 border-[#01b0ef] border-t-transparent rounded-full animate-spin mb-4" />
                            <p className="text-[#0088b9] font-black uppercase tracking-widest text-xs">Carregando secretarias...</p>
                        </div>
                    ) : secretarias.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
                            <span className="text-6xl mb-4 block">🏢</span>
                            <h2 className="text-xl font-black text-[#0088b9] mb-2 uppercase">Nenhuma secretaria encontrada</h2>
                            <p className="text-gray-500 text-sm">Aguarde a atualização das informações institucionais.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-['Montserrat',sans-serif]">
                            {secretarias.map((s, idx) => {
                                const servicos = JSON.parse(s.servicos || "[]");
                                const cor = defaultCores[idx % defaultCores.length];
                                return (
                                    <Link key={s.id} href={`/secretarias/${s.slug}`} className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:border-primary-100 overflow-hidden transition-all duration-500 hover:-translate-y-2 group border border-gray-50">
                                        <div className={`bg-gradient-to-r ${cor} p-10 flex items-center gap-6`}>
                                            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center shrink-0 backdrop-blur-sm shadow-inner">
                                                {s.imagem ? (
                                                    <img src={s.imagem} alt="" className="w-12 h-12 object-contain" />
                                                ) : (() => {
                                                    const IconCard = getSecretariaIcon(s.nome);
                                                    return <IconCard className="text-white text-4xl" />;
                                                })()}
                                            </div>
                                            <div>
                                                <h2 className="font-black text-white text-xl leading-tight uppercase tracking-tighter">{s.nome}</h2>
                                                {s.secretario && <p className="text-white/80 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Gestor: {s.secretario}</p>}
                                            </div>
                                        </div>
                                        <div className="p-10">
                                            <p className="text-gray-500 text-sm mb-8 leading-relaxed line-clamp-2 font-medium">{s.descricao}</p>
                                            
                                            {/* Bloco de Contatos PNTP */}
                                            <div className="bg-gray-50/50 rounded-3xl p-6 mb-8 space-y-3 border border-gray-100">
                                                {s.telefone && (
                                                    <div className="flex items-center gap-3 text-gray-700">
                                                        <span className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm text-sm">📞</span>
                                                        <span className="font-bold text-xs tracking-tight text-gray-600">{s.telefone}</span>
                                                    </div>
                                                )}
                                                {s.email && (
                                                    <div className="flex items-center gap-3 text-gray-700">
                                                        <span className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm text-sm">✉️</span>
                                                        <span className="font-bold text-xs tracking-tight text-gray-600">{s.email}</span>
                                                    </div>
                                                )}
                                                {s.horarioFuncionamento && (
                                                    <div className="flex items-center gap-3 text-gray-700">
                                                        <span className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm text-sm">⏰</span>
                                                        <span className="font-bold text-xs tracking-tight text-gray-600">{s.horarioFuncionamento}</span>
                                                    </div>
                                                )}
                                                {s.endereco && (
                                                    <div className="flex items-start gap-3 text-gray-700 mt-4 pt-4 border-t border-gray-100">
                                                        <span className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm text-sm shrink-0">📍</span>
                                                        <span className="font-bold text-[11px] text-gray-500 leading-tight tracking-tight uppercase">
                                                            {s.endereco}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-3 text-primary-500 font-black text-[10px] uppercase tracking-[0.2em] group-hover:gap-4 transition-all">
                                                Ver estrutura institucional <span className="text-lg">→</span>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
