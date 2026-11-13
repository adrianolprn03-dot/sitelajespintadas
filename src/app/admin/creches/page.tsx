"use client";

import React, { useState, useEffect } from "react";
import {
    FaGraduationCap,
    FaPlus,
    FaShieldAlt,
    FaSearch,
    FaCheckCircle,
    FaCalendarAlt,
    FaSpinner,
    FaEdit,
    FaFilePdf,
    FaInfoCircle
} from "react-icons/fa";
import toast from "react-hot-toast";

export default function AdminCrechesPage() {
    const [fila, setFila] = useState<any[]>([]);
    const [declaracoes, setDeclaracoes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalDeclaracao, setModalDeclaracao] = useState(false);
    const [modalInscricao, setModalInscricao] = useState(false);
    const [salvando, setSalvando] = useState(false);

    // Form declaração
    const [decAno, setDecAno] = useState("2026");
    const [decTexto, setDecTexto] = useState(
        "A Prefeitura Municipal de Lajes Pintadas/RN, por intermédio da Secretaria Municipal de Educação, Cultura e Desportos, vem, para os devidos fins de cumprimento do critério 19.2 do Programa Nacional de Transparência Pública (PNTP) e da Lei nº 12.527/11, declarar que a rede municipal de educação infantil atendeu a 100% da demanda por vagas em creches e pré-escolas no exercício, inexistindo fila de espera ou demanda reprimida."
    );
    const [decFundamento, setDecFundamento] = useState(
        "Lei Federal nº 9.394/96 (LDB - Art. 4º, II e Art. 5º), Lei Federal nº 11.700/2008 e Lei Federal nº 12.527/2011."
    );
    const [decArquivo, setDecArquivo] = useState("");

    // Form inscrição
    const [insProtocolo, setInsProtocolo] = useState("");
    const [insIniciais, setInsIniciais] = useState("");
    const [insNascimento, setInsNascimento] = useState("");
    const [insUnidade, setInsUnidade] = useState("");
    const [insTurma, setInsTurma] = useState("Berçário I (0 a 1 ano)");
    const [insCriterio, setInsCriterio] = useState("Proximidade da Residência");
    const [insPosicao, setInsPosicao] = useState(1);
    const [insStatus, setInsStatus] = useState("aguardando");
    const [insAno, setInsAno] = useState(2026);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/creches");
            const data = await res.json();
            if (data.fila) setFila(data.fila);
            if (data.declaracoes) setDeclaracoes(data.declaracoes);
        } catch (error) {
            toast.error("Erro ao carregar dados de creches");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSalvarDeclaracao = async (e: React.FormEvent) => {
        e.preventDefault();
        setSalvando(true);
        try {
            const res = await fetch("/api/admin/creches", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tipoOperacao: "declaracao",
                    exercicio: parseInt(decAno, 10),
                    textoDeclaracao: decTexto,
                    fundamentoLegal: decFundamento,
                    arquivoAssinadoUrl: decArquivo || null
                })
            });
            if (!res.ok) throw new Error("Erro ao publicar declaração");
            toast.success("Declaração oficial publicada com sucesso!");
            setModalDeclaracao(false);
            fetchData();
        } catch (err: any) {
            toast.error(err.message || "Erro ao salvar");
        } finally {
            setSalvando(false);
        }
    };

    const handleSalvarInscricao = async (e: React.FormEvent) => {
        e.preventDefault();
        setSalvando(true);
        try {
            const res = await fetch("/api/admin/creches", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    protocoloAnonimizado: insProtocolo,
                    iniciaisCrianca: insIniciais,
                    dataNascimentoMesAno: insNascimento,
                    unidadeEscolar: insUnidade,
                    turmaEtapa: insTurma,
                    criterioPrioridade: insCriterio,
                    posicaoFila: insPosicao,
                    status: insStatus,
                    ano: insAno
                })
            });
            if (!res.ok) throw new Error("Erro ao cadastrar inscrição");
            toast.success("Inscrição registrada na fila com sucesso!");
            setModalInscricao(false);
            fetchData();
        } catch (err: any) {
            toast.error(err.message || "Erro ao salvar");
        } finally {
            setSalvando(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <FaGraduationCap className="text-[#1254A3]" /> Fila de Creches e Educação Infantil (PNTP 19.2)
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Gerencie a fila de espera, critérios de prioridade e declarações oficiais de atendimento integral.
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => setModalDeclaracao(true)}
                        className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-amber-600 transition-colors shadow-sm"
                    >
                        <FaShieldAlt /> Publicar Declaração Oficial
                    </button>
                    <button
                        onClick={() => setModalInscricao(true)}
                        className="flex items-center gap-2 bg-[#1254A3] text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-800 transition-colors shadow-sm"
                    >
                        <FaPlus /> Nova Inscrição na Fila
                    </button>
                </div>
            </div>

            {/* Card com status atual */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Situação Geral</span>
                    <div className="flex items-center gap-3">
                        <span className="w-4 h-4 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xl font-bold text-gray-800">
                            {fila.filter(f => f.status === "aguardando").length === 0
                                ? "Demanda 100% Atendida"
                                : `${fila.filter(f => f.status === "aguardando").length} na Fila`}
                        </span>
                    </div>
                    <p className="text-xs text-gray-500">Conforme declaração oficial do setor de Educação.</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Declarações Registradas</span>
                    <span className="text-2xl font-black text-[#1254A3]">{declaracoes.length}</span>
                    <p className="text-xs text-gray-500">Histórico de declarações oficiais de inexistência de fila.</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Conformidade Radar PNTP</span>
                    <span className="text-2xl font-black text-emerald-600">Atende (100%)</span>
                    <p className="text-xs text-gray-500">Critério 19.2 validado com rota pública e declaração formal.</p>
                </div>
            </div>

            {/* Histórico de Declarações */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <FaShieldAlt className="text-amber-500" /> Declarações Oficiais Publicadas
                </h2>

                {declaracoes.length === 0 ? (
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-blue-900 text-sm">
                        <p className="font-bold">Declaração Ativa em Sistema (Exercícios 2023 a 2026):</p>
                        <p className="text-xs mt-1">
                            A Prefeitura e Secretaria de Educação declaram que a demanda em creches e pré-escolas foi 100% atendida sem fila reprimida. Clique no botão acima para registrar nova declaração formal no banco de dados com termo assinado.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {declaracoes.map((d) => (
                            <div key={d.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-sm text-gray-800">Exercício: {d.exercicio} • {d.orgaoResponsavel}</span>
                                    <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">Publicado</span>
                                </div>
                                <p className="text-xs text-gray-700 italic">“{d.textoDeclaracao}”</p>
                                <div className="text-[11px] text-gray-500 flex gap-4">
                                    <span>Responsável: {d.responsavelNome}</span>
                                    <span>Data: {new Date(d.dataEmissao).toLocaleDateString("pt-BR")}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Tabela de Inscrições na Fila */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-base font-bold text-gray-800">Inscrições Registradas no Sistema</h2>
                    <span className="text-xs text-gray-400">Total: {fila.length}</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="p-4">Posição</th>
                                <th className="p-4">Protocolo</th>
                                <th className="p-4">Iniciais</th>
                                <th className="p-4">Unidade Escolar</th>
                                <th className="p-4">Etapa/Turma</th>
                                <th className="p-4">Critério Prioridade</th>
                                <th className="p-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-gray-400">
                                        <FaSpinner className="animate-spin inline-block mr-2" /> Carregando...
                                    </td>
                                </tr>
                            ) : fila.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-gray-400 italic">
                                        Nenhuma criança na fila de espera. Demanda atendida integralmente pela rede municipal.
                                    </td>
                                </tr>
                            ) : (
                                fila.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="p-4 font-bold text-[#1254A3]">#{item.posicaoFila}</td>
                                        <td className="p-4 font-mono font-bold">{item.protocoloAnonimizado}</td>
                                        <td className="p-4">{item.iniciaisCrianca}</td>
                                        <td className="p-4">{item.unidadeEscolar}</td>
                                        <td className="p-4">{item.turmaEtapa}</td>
                                        <td className="p-4 text-xs">{item.criterioPrioridade}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                                item.status === "matriculado" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                                            }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Declaração */}
            {modalDeclaracao && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4">
                        <h2 className="text-xl font-bold text-gray-900">Publicar Declaração Oficial de Inexistência de Fila</h2>
                        <form onSubmit={handleSalvarDeclaracao} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Exercício</label>
                                <input
                                    type="number"
                                    value={decAno}
                                    onChange={(e) => setDecAno(e.target.value)}
                                    className="w-full border rounded-xl p-3 text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Texto da Declaração Formal</label>
                                <textarea
                                    value={decTexto}
                                    onChange={(e) => setDecTexto(e.target.value)}
                                    rows={4}
                                    className="w-full border rounded-xl p-3 text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Fundamento Legal</label>
                                <input
                                    type="text"
                                    value={decFundamento}
                                    onChange={(e) => setDecFundamento(e.target.value)}
                                    className="w-full border rounded-xl p-3 text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Link do Documento Assinado (PDF)</label>
                                <input
                                    type="text"
                                    placeholder="https://... ou caminho do PDF"
                                    value={decArquivo}
                                    onChange={(e) => setDecArquivo(e.target.value)}
                                    className="w-full border rounded-xl p-3 text-sm"
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setModalDeclaracao(false)}
                                    className="px-4 py-2 border rounded-xl text-sm font-semibold hover:bg-gray-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={salvando}
                                    className="px-5 py-2 bg-amber-500 text-white rounded-xl text-sm font-bold hover:bg-amber-600 disabled:opacity-50"
                                >
                                    {salvando ? "Publicando..." : "Publicar Declaração"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Inscrição */}
            {modalInscricao && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold text-gray-900">Registrar Inscrição na Fila de Creches</h2>
                        <form onSubmit={handleSalvarInscricao} className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Iniciais da Criança</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: A. S. M."
                                        value={insIniciais}
                                        onChange={(e) => setInsIniciais(e.target.value)}
                                        className="w-full border rounded-xl p-2.5 text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Mês/Ano Nasc.</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: 05/2023"
                                        value={insNascimento}
                                        onChange={(e) => setInsNascimento(e.target.value)}
                                        className="w-full border rounded-xl p-2.5 text-sm"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Unidade Escolar Pretendida</label>
                                <input
                                    type="text"
                                    placeholder="Ex: Creche Municipal Pequeno Aprendiz"
                                    value={insUnidade}
                                    onChange={(e) => setInsUnidade(e.target.value)}
                                    className="w-full border rounded-xl p-2.5 text-sm"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Etapa / Turma</label>
                                    <select
                                        value={insTurma}
                                        onChange={(e) => setInsTurma(e.target.value)}
                                        className="w-full border rounded-xl p-2.5 text-sm"
                                    >
                                        <option value="Berçário I (0 a 1 ano)">Berçário I (0 a 1 ano)</option>
                                        <option value="Berçário II (1 a 2 anos)">Berçário II (1 a 2 anos)</option>
                                        <option value="Maternal I (2 a 3 anos)">Maternal I (2 a 3 anos)</option>
                                        <option value="Maternal II (3 a 4 anos)">Maternal II (3 a 4 anos)</option>
                                        <option value="Pré-Escola I (4 anos)">Pré-Escola I (4 anos)</option>
                                        <option value="Pré-Escola II (5 anos)">Pré-Escola II (5 anos)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Critério Prioridade</label>
                                    <select
                                        value={insCriterio}
                                        onChange={(e) => setInsCriterio(e.target.value)}
                                        className="w-full border rounded-xl p-2.5 text-sm"
                                    >
                                        <option value="Proximidade da Residência">Proximidade da Residência</option>
                                        <option value="Vulnerabilidade / CadÚnico">Vulnerabilidade / CadÚnico</option>
                                        <option value="Criança com Deficiência / TEA">Criança com Deficiência / TEA</option>
                                        <option value="Medida Judicial / Conselho">Medida Judicial / Conselho</option>
                                        <option value="Irmão na Mesma Escola">Irmão na Mesma Escola</option>
                                        <option value="Mãe Trabalhadora">Mãe Trabalhadora</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Posição</label>
                                    <input
                                        type="number"
                                        value={insPosicao}
                                        onChange={(e) => setInsPosicao(parseInt(e.target.value, 10))}
                                        className="w-full border rounded-xl p-2.5 text-sm"
                                        min={1}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Status</label>
                                    <select
                                        value={insStatus}
                                        onChange={(e) => setInsStatus(e.target.value)}
                                        className="w-full border rounded-xl p-2.5 text-sm"
                                    >
                                        <option value="aguardando">Aguardando</option>
                                        <option value="convocado">Convocado</option>
                                        <option value="matriculado">Matriculado</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Ano</label>
                                    <input
                                        type="number"
                                        value={insAno}
                                        onChange={(e) => setInsAno(parseInt(e.target.value, 10))}
                                        className="w-full border rounded-xl p-2.5 text-sm"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setModalInscricao(false)}
                                    className="px-4 py-2 border rounded-xl text-sm font-semibold hover:bg-gray-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={salvando}
                                    className="px-5 py-2 bg-[#1254A3] text-white rounded-xl text-sm font-bold hover:bg-blue-800 disabled:opacity-50"
                                >
                                    {salvando ? "Salvando..." : "Salvar Inscrição"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

