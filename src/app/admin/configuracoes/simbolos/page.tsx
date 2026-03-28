"use client";

import { useState, useEffect } from "react";
import { FaGlobe, FaImage, FaHistory, FaSave, FaQuoteRight, FaMusic } from "react-icons/fa";
import toast from "react-hot-toast";

export default function SimbolosMunicipaisPage() {
    const [loading, setLoading] = useState(true);
    const [salvando, setSalvando] = useState(false);
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
                toast.error("Erro ao carregar configurações.");
            } finally {
                setLoading(false);
            }
        };
        fetchConfigs();
    }, []);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, chave: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const isAudio = file.type.startsWith("audio/");
        const maxSize = isAudio ? 10 * 1024 * 1024 : 2 * 1024 * 1024;

        if (file.size > maxSize) {
            toast.error(isAudio ? "Áudio muito grande (máx 10MB)" : "Imagem muito grande (máx 2MB)");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setConfigs({ ...configs, [chave]: reader.result as string });
        };
        reader.readAsDataURL(file);
    };

    const handleSave = async () => {
        setSalvando(true);
        try {
            const res = await fetch("/api/admin/configuracoes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    configs: Object.entries(configs).map(([chave, valor]) => ({ chave, valor })),
                }),
            });

            if (res.ok) {
                toast.success("Símbolos atualizados com sucesso!");
            } else {
                toast.error("Erro ao salvar.");
            }
        } catch (error) {
            toast.error("Erro de conexão.");
        } finally {
            setSalvando(false);
        }
    };

    if (loading) return <div className="p-10 text-center font-bold text-gray-400">Carregando símbolos...</div>;

    return (
        <div className="p-6 max-w-5xl mx-auto font-['Montserrat',sans-serif]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tighter">Símbolos Oficiais</h1>
                    <p className="text-gray-500 text-sm font-medium">Gestão dos símbolos oficiais: Brasão, Bandeira e Hino.</p>
                </div>
                <button 
                    onClick={handleSave}
                    disabled={salvando}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
                >
                    <FaSave /> {salvando ? "Salvando..." : "Salvar Alterações"}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Brasão e Bandeira */}
                <div className="space-y-8">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                                <FaImage size={24} />
                            </div>
                            <h2 className="text-lg font-black text-gray-800 uppercase tracking-tight">Brasão Municipal</h2>
                        </div>
                        <div className="flex flex-col items-center gap-6 p-6 border-2 border-dashed border-gray-100 rounded-[2rem] bg-gray-50/50">
                            {configs.simbolo_brasao ? (
                                <img src={configs.simbolo_brasao} alt="Brasão" className="h-32 object-contain" />
                            ) : (
                                <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center text-gray-300"><FaImage size={40} /></div>
                            )}
                            <input 
                                type="file" accept="image/*"
                                onChange={(e) => handleFileUpload(e, "simbolo_brasao")}
                                className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all cursor-pointer"
                            />
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                                <FaGlobe size={24} />
                            </div>
                            <h2 className="text-lg font-black text-gray-800 uppercase tracking-tight">Bandeira Municipal</h2>
                        </div>
                        <div className="flex flex-col items-center gap-6 p-6 border-2 border-dashed border-gray-100 rounded-[2rem] bg-gray-50/50">
                            {configs.simbolo_bandeira ? (
                                <img src={configs.simbolo_bandeira} alt="Bandeira" className="h-32 object-contain shadow-sm" />
                            ) : (
                                <div className="w-32 h-32 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-300"><FaGlobe size={40} /></div>
                            )}
                            <input 
                                type="file" accept="image/*"
                                onChange={(e) => handleFileUpload(e, "simbolo_bandeira")}
                                className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition-all cursor-pointer"
                            />
                        </div>
                    </div>
                </div>

                {/* Hino */}
                <div className="h-full">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl h-full flex flex-col">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                                <FaQuoteRight size={20} />
                            </div>
                            <h2 className="text-lg font-black text-gray-800 uppercase tracking-tight">Letra do Hino</h2>
                        </div>
                        <textarea 
                            className="flex-1 w-full p-8 bg-gray-50 border border-transparent rounded-[2rem] text-sm font-medium leading-relaxed focus:bg-white focus:ring-4 focus:ring-amber-50 transition-all outline-none min-h-[300px]"
                            placeholder="Insira a letra oficial do hino aqui..."
                            value={configs.simbolo_hino}
                            onChange={(e) => setConfigs({ ...configs, simbolo_hino: e.target.value })}
                        />
                        <div className="mt-6 p-6 bg-amber-50/50 rounded-[2rem] border border-amber-100 flex flex-col gap-4">
                            <h3 className="text-xs font-black text-amber-800 uppercase tracking-widest flex items-center gap-2"><FaMusic /> Áudio do Hino (MP3/WAV)</h3>
                            {configs.simbolo_hino_audio && (
                                <audio controls src={configs.simbolo_hino_audio} className="w-full" />
                            )}
                            <input 
                                type="file" accept="audio/*"
                                onChange={(e) => handleFileUpload(e, "simbolo_hino_audio")}
                                className="text-xs text-amber-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-amber-800 hover:file:bg-amber-200 transition-all cursor-pointer mt-2"
                            />
                        </div>
                        <p className="mt-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center">A letra e o áudio serão exibidos no Portal.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
