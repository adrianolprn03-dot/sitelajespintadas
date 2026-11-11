"use client";

import { useState, useEffect } from "react";
import { FaQuoteRight, FaMusic, FaFlag } from "react-icons/fa6";
import PageHeader from "@/components/PageHeader";
import { MUNICIPIO } from "@/config/municipio";

export default function SimbolosPage() {
    const [loading, setLoading] = useState(true);
    const [configs, setConfigs] = useState({
        simbolo_brasao: "/images/brasao-lajes-pintadas.png",
        simbolo_bandeira: "/images/bandeira-lajes-pintadas.png",
        simbolo_hino: "",
        simbolo_hino_audio: "",
    });

    useEffect(() => {
        const fetchConfigs = async () => {
            try {
                const res = await fetch("/api/admin/configuracoes");
                if (res.ok) {
                    const data = await res.json();
                    const dbBrasao = data.find((c: any) => c.chave === "simbolo_brasao")?.valor;
                    const dbBandeira = data.find((c: any) => c.chave === "simbolo_bandeira")?.valor;
                    setConfigs({
                        simbolo_brasao:
                            dbBrasao && !dbBrasao.includes("saotome")
                                ? dbBrasao
                                : "/images/brasao-lajes-pintadas.png",
                        simbolo_bandeira: dbBandeira || "/images/bandeira-lajes-pintadas.png",
                        simbolo_hino: data.find((c: any) => c.chave === "simbolo_hino")?.valor || "",
                        simbolo_hino_audio:
                            data.find((c: any) => c.chave === "simbolo_hino_audio")?.valor || "",
                    });
                }
            } catch (error) {
                console.error("Erro ao carregar símbolos:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchConfigs();
    }, []);

    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F4F7FB]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0072CE]"></div>
            </div>
        );

    return (
        <div className="min-h-screen bg-[#F4F7FB]">
            <PageHeader
                title="Símbolos Municipais"
                subtitle={`Conheça o Brasão Oficial, a Bandeira, as cores heráldicas e o Hino que representam a história e a cultura de ${MUNICIPIO.nome}/${MUNICIPIO.uf}.`}
                variant="premium"
                icon={<FaFlag />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "O Município", href: "/a-prefeitura" },
                    { label: "Símbolos Municipais" },
                ]}
            />

            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-14">
                {/* Brasão e Bandeira Grid (Modelo 3) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Brasão Oficial */}
                    <div className="bg-white rounded-[28px] p-8 sm:p-10 shadow-gov border border-[#DCE4EE] border-b-4 border-b-[#0072CE] flex flex-col items-center text-center">
                        <div className="w-60 h-60 sm:w-64 sm:h-64 rounded-3xl bg-[#F8FAFC] border border-[#DCE4EE] p-6 flex items-center justify-center mb-6 shadow-inner">
                            <img
                                src={configs.simbolo_brasao}
                                alt={`Brasão Oficial de ${MUNICIPIO.nome}/${MUNICIPIO.uf}`}
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#0072CE] bg-sky-50 px-3 py-1 rounded-full mb-2">
                            Armas do Município • 31/12/1958
                        </span>
                        <h2 className="text-2xl font-black text-[#0F2942] font-heading">
                            Brasão Municipal de {MUNICIPIO.nome}
                        </h2>
                        <p className="text-xs sm:text-sm text-[#526B84] mt-2 max-w-md leading-relaxed">
                            Representa as riquezas minerais, o riacho, as históricas lajes com inscrições rupestres, a fé cristã e a força agrícola do agave e do algodão.
                        </p>
                    </div>

                    {/* Bandeira Oficial */}
                    <div className="bg-white rounded-[28px] p-8 sm:p-10 shadow-gov border border-[#DCE4EE] border-b-4 border-b-[#15803D] flex flex-col items-center text-center">
                        <div className="w-60 h-60 sm:w-64 sm:h-64 rounded-3xl bg-[#F8FAFC] border border-[#DCE4EE] p-6 flex items-center justify-center mb-6 shadow-inner">
                            <img
                                src={configs.simbolo_bandeira}
                                alt={`Bandeira Oficial de ${MUNICIPIO.nome}/${MUNICIPIO.uf}`}
                                className="w-full h-full object-contain rounded-lg shadow-sm"
                            />
                        </div>
                        <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#15803D] bg-emerald-50 px-3 py-1 rounded-full mb-2">
                            Pavilhão Tricolor Oficial
                        </span>
                        <h2 className="text-2xl font-black text-[#0F2942] font-heading">
                            Bandeira Municipal de {MUNICIPIO.nome}
                        </h2>
                        <p className="text-xs sm:text-sm text-[#526B84] mt-2 max-w-md leading-relaxed">
                            Composta por três faixas verticais nas cores Verde Agave, Amarelo Ouro e Azul Safira, trazendo ao centro o Brasão de Armas do Município.
                        </p>
                    </div>
                </div>

                {/* Seção do Hino Municipal */}
                <div className="bg-white rounded-[28px] p-8 sm:p-12 shadow-gov border border-[#DCE4EE] flex flex-col items-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1.5 heraldic-stripe" />

                    <div className="w-16 h-16 bg-gradient-to-br from-[#0072CE] to-[#003B73] text-white rounded-2xl flex items-center justify-center mb-6 shadow-md ring-2 ring-[#FACC15]">
                        <FaMusic size={26} />
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-black text-[#0F2942] font-heading text-center mb-2">
                        Hino Oficial de {MUNICIPIO.nome}
                    </h2>
                    <p className="text-xs font-extrabold text-[#15803D] uppercase tracking-widest mb-8">
                        Patrimônio Cultural e Cívico
                    </p>

                    <div className="max-w-2xl w-full">
                        <div className="bg-[#F8FAFC] p-8 sm:p-12 rounded-3xl border border-[#DCE4EE] relative">
                            <FaQuoteRight size={32} className="absolute top-6 left-6 text-[#0072CE]/15" />
                            <div className="whitespace-pre-line text-center text-base sm:text-lg font-medium leading-loose text-[#0F2942]">
                                {configs.simbolo_hino ||
                                    "A letra oficial do Hino Municipal de Lajes Pintadas integra o acervo histórico e cultural do município."}
                            </div>
                        </div>

                        {configs.simbolo_hino_audio && (
                            <div className="mt-6 flex justify-center">
                                <div className="bg-white border border-[#DCE4EE] p-4 rounded-2xl shadow-sm w-full max-w-md">
                                    <audio controls src={configs.simbolo_hino_audio} className="w-full h-10 outline-none" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
