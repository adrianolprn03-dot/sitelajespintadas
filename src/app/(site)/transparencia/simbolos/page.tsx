"use client";

import { useState, useEffect } from "react";
import { FaGlobe, FaImage, FaQuoteRight, FaMusic, FaFlag } from "react-icons/fa";
import PageHeader from "@/components/PageHeader";

export default function SimbolosPage() {
    const [loading, setLoading] = useState(true);
    const [configs, setConfigs] = useState({
        "simbolo_brasao": "",
        "simbolo_bandeira": "",
        "simbolo_hino": "",
        "simbolo_hino_audio": "",
    });

    useEffect(() => {
        const fetchConfigs = async () => {
            try {
                const res = await fetch("/api/admin/configuracoes");
                if (res.ok) {
                    const data = await res.json();
                    const filtered = {
                        "simbolo_brasao": data.find((c: any) => c.chave === "simbolo_brasao")?.valor || "",
                        "simbolo_bandeira": data.find((c: any) => c.chave === "simbolo_bandeira")?.valor || "",
                        "simbolo_hino": data.find((c: any) => c.chave === "simbolo_hino")?.valor || "",
                        "simbolo_hino_audio": data.find((c: any) => c.chave === "simbolo_hino_audio")?.valor || "",
                    };
                    setConfigs(filtered);
                }
            } catch (error) {
                console.error("Erro ao carregar símbolos:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchConfigs();
    }, []);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Símbolos Oficiais"
                subtitle="Identidade, história e Símbolos Oficiais do Município"
                variant="premium"
                icon={<FaFlag />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Símbolos Oficiais" }
                ]}
            />

            <div className="max-w-7xl mx-auto px-6 py-16">
                
                {/* Brasão e Bandeira Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
                    {/* Brasão Area */}
                    <div className="flex flex-col items-center">
                        <div className="bg-white p-12 rounded-[3rem] shadow-2xl shadow-gray-200 border border-gray-100 flex items-center justify-center w-full aspect-square max-w-sm group hover:-translate-y-2 transition-all duration-500">
                            {configs.simbolo_brasao ? (
                                <img src={configs.simbolo_brasao} alt="Brasão de Lajes Pintadas" className="w-full h-full object-contain" />
                            ) : (
                                <div className="text-gray-300 flex flex-col items-center gap-4">
                                    <FaImage size={64} className="opacity-20" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Logo Oficial</span>
                                </div>
                            )}
                        </div>
                        <h2 className="mt-8 text-2xl font-black text-gray-800 uppercase tracking-tighter">Brasão Municipal</h2>
                        <div className="w-12 h-1 bg-primary-500 mt-4 rounded-full"></div>
                    </div>

                    {/* Bandeira Area */}
                    <div className="flex flex-col items-center">
                        <div className="bg-white p-12 rounded-[3rem] shadow-2xl shadow-gray-200 border border-gray-100 flex items-center justify-center w-full aspect-square max-w-sm group hover:-translate-y-2 transition-all duration-500 overflow-hidden">
                             {configs.simbolo_bandeira ? (
                                <img src={configs.simbolo_bandeira} alt="Bandeira de Lajes Pintadas" className="w-full h-full object-contain shadow-sm" />
                            ) : (
                                <div className="text-gray-300 flex flex-col items-center gap-4">
                                    <FaGlobe size={64} className="opacity-20" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Pavilhão Municipal</span>
                                </div>
                            )}
                        </div>
                        <h2 className="mt-8 text-2xl font-black text-gray-800 uppercase tracking-tighter">Bandeira Municipal</h2>
                        <div className="w-12 h-1 bg-secondary-400 mt-4 rounded-full"></div>
                    </div>
                </div>

                {/* Hino Section */}
                <div className="bg-white rounded-[4rem] p-10 md:p-20 shadow-2xl shadow-primary-500/5 border border-primary-50 flex flex-col items-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-400/5 rounded-full blur-3xl -ml-32 -mb-32"></div>

                    <div className="w-20 h-20 bg-primary-500 text-white rounded-3xl flex items-center justify-center mb-10 shadow-lg shadow-primary-500/30">
                        <FaMusic size={32} />
                    </div>

                    <h2 className="text-4xl font-black text-gray-800 uppercase tracking-tighter text-center mb-4">Hino Municipal</h2>
                    <p className="text-[10px] font-black text-primary-500 uppercase tracking-[0.4em] mb-12">Letra e Identidade Vocal</p>

                    <div className="max-w-2xl w-full">
                        <div className="bg-gray-50/50 p-10 md:p-16 rounded-[3rem] border border-gray-100 relative group">
                            <FaQuoteRight size={40} className="absolute top-8 left-8 text-primary-500/10 group-hover:scale-110 transition-transform" />
                            <div className="whitespace-pre-line text-center text-lg md:text-xl font-medium leading-loose text-gray-600 italic">
                                {configs.simbolo_hino || "A letra do hino oficial está sendo processada pela administração municipal."}
                            </div>
                        </div>
                        
                        {configs.simbolo_hino_audio && (
                            <div className="mt-8 flex justify-center">
                                <div className="bg-white/50 backdrop-blur border border-primary-100 p-4 rounded-3xl shadow-xl shadow-primary-500/5 w-full max-w-md">
                                    <audio controls src={configs.simbolo_hino_audio} className="w-full h-10 outline-none" />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-20 flex flex-col items-center gap-4 opacity-40">
                         <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                         <span className="text-[10px] font-black uppercase tracking-[0.2em]">Prefeitura de Lajes Pintadas · RN</span>
                    </div>
                </div>

            </div>
        </div>
    );
}
