"use client";

import { useState, useRef } from "react";
import {
    FaBold,
    FaItalic,
    FaHeading,
    FaListUl,
    FaExternalLinkAlt,
    FaLink,
    FaEye,
    FaCode,
    FaTimes,
    FaCheck,
    FaGlobe,
    FaSitemap
} from "react-icons/fa";

interface NewsContentEditorProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
    required?: boolean;
}

// Lista estruturada de páginas internas para seleção rápida
const PAGINAS_INTERNAS = [
    {
        categoria: "Institucional",
        paginas: [
            { nome: "Página Inicial (Home)", path: "/" },
            { nome: "A Prefeitura", path: "/a-prefeitura" },
            { nome: "Secretarias Municipais", path: "/secretarias" },
            { nome: "Notícias Municipais", path: "/noticias" },
            { nome: "Galeria de Fotos", path: "/galeria" },
            { nome: "Fale Conosco / Contato", path: "/contato" },
            { nome: "Mapa do Site", path: "/mapa-do-site" },
        ],
    },
    {
        categoria: "Portal da Transparência",
        paginas: [
            { nome: "Hub de Transparência", path: "/transparencia" },
            { nome: "Licitações Públicas", path: "/transparencia/licitacoes" },
            { nome: "Contratos Administrativos", path: "/transparencia/contratos" },
            { nome: "Convênios", path: "/transparencia/convenios" },
            { nome: "Concursos e Editais", path: "/transparencia/concursos" },
            { nome: "Legislação e Leis Municipais", path: "/transparencia/legislacao" },
            { nome: "Diárias de Viagem", path: "/transparencia/diarias" },
            { nome: "Receitas Municipais", path: "/transparencia/receitas" },
            { nome: "Despesas Municipais", path: "/transparencia/despesas" },
            { nome: "Servidores Públicos", path: "/transparencia/servidores" },
            { nome: "Obras Públicas", path: "/transparencia/obras" },
            { nome: "Frota Municipal", path: "/transparencia/frota" },
            { nome: "Orçamento Municipal", path: "/transparencia/orcamento" },
        ],
    },
    {
        categoria: "Serviços ao Cidadão & Transparência Passiva",
        paginas: [
            { nome: "Ouvidoria Municipal", path: "/servicos/ouvidoria" },
            { nome: "e-SIC (Acesso à Informação)", path: "/servicos/esic" },
            { nome: "Carta de Serviços ao Cidadão", path: "/carta-de-servicos" },
            { nome: "Consulta de Protocolo", path: "/servicos/consulta-protocolo" },
            { nome: "Unidades de Saúde", path: "/unidades-de-saude" },
        ],
    },
];

export default function NewsContentEditor({
    value,
    onChange,
    label = "Conteúdo Completo *",
    required = true,
}: NewsContentEditorProps) {
    const [isPreview, setIsPreview] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Estado do Modal de Link Externo
    const [showExternalModal, setShowExternalModal] = useState(false);
    const [externalUrl, setExternalUrl] = useState("");
    const [externalText, setExternalText] = useState("");
    const [externalNewTab, setExternalNewTab] = useState(true);

    // Estado do Modal de Link Interno
    const [showInternalModal, setShowInternalModal] = useState(false);
    const [internalPath, setInternalPath] = useState("/");
    const [customPath, setCustomPath] = useState("");
    const [isCustomPath, setIsCustomPath] = useState(false);
    const [internalText, setInternalText] = useState("");

    // Helper para obter texto selecionado no textarea
    const getSelectedText = () => {
        if (!textareaRef.current) return "";
        const start = textareaRef.current.selectionStart;
        const end = textareaRef.current.selectionEnd;
        return textareaRef.current.value.substring(start, end);
    };

    // Helper para inserir trecho de texto/HTML no ponto exato do cursor
    const insertAtCursor = (htmlToInsert: string) => {
        if (!textareaRef.current) {
            onChange(value + htmlToInsert);
            return;
        }

        const start = textareaRef.current.selectionStart;
        const end = textareaRef.current.selectionEnd;
        const newValue = value.substring(0, start) + htmlToInsert + value.substring(end);
        onChange(newValue);

        // Reposiciona o cursor após a inserção
        setTimeout(() => {
            if (textareaRef.current) {
                textareaRef.current.focus();
                const newCursorPos = start + htmlToInsert.length;
                textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
            }
        }, 50);
    };

    // Abrir Modal de Link Externo com texto pré-selecionado
    const handleOpenExternalModal = () => {
        const selected = getSelectedText();
        setExternalText(selected);
        setExternalUrl("");
        setExternalNewTab(true);
        setShowExternalModal(true);
    };

    // Abrir Modal de Link Interno com texto pré-selecionado
    const handleOpenInternalModal = () => {
        const selected = getSelectedText();
        setInternalText(selected);
        setInternalPath("/");
        setCustomPath("");
        setIsCustomPath(false);
        setShowInternalModal(true);
    };

    // Confirmar inserção de Link Externo
    const handleConfirmExternalLink = () => {
        if (!externalUrl.trim()) return;

        let formattedUrl = externalUrl.trim();
        if (!/^https?:\/\//i.test(formattedUrl)) {
            formattedUrl = `https://${formattedUrl}`;
        }

        const linkText = externalText.trim() || formattedUrl;
        const targetAttr = externalNewTab ? ' target="_blank" rel="noopener noreferrer"' : '';
        const linkHtml = `<a href="${formattedUrl}"${targetAttr}>${linkText}</a>`;

        insertAtCursor(linkHtml);
        setShowExternalModal(false);
    };

    // Confirmar inserção de Link Interno
    const handleConfirmInternalLink = () => {
        const finalPath = isCustomPath ? customPath.trim() : internalPath;
        if (!finalPath) return;

        const linkText = internalText.trim() || finalPath;
        const linkHtml = `<a href="${finalPath}">${linkText}</a>`;

        insertAtCursor(linkHtml);
        setShowInternalModal(false);
    };

    // Botões de Formatação Básica
    const wrapFormat = (openTag: string, closeTag: string, defaultText: string) => {
        const selected = getSelectedText();
        const textToWrap = selected || defaultText;
        insertAtCursor(`${openTag}${textToWrap}${closeTag}`);
    };

    return (
        <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                <label className="block text-sm font-semibold text-gray-700">{label}</label>

                {/* Abas Editor / Preview */}
                <div className="flex items-center bg-gray-100 p-1 rounded-xl">
                    <button
                        type="button"
                        onClick={() => setIsPreview(false)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                            !isPreview
                                ? "bg-white text-[#0088b9] shadow-sm"
                                : "text-gray-600 hover:text-gray-900"
                        }`}
                    >
                        <FaCode className="w-3.5 h-3.5" /> Editor
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsPreview(true)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                            isPreview
                                ? "bg-white text-[#0088b9] shadow-sm"
                                : "text-gray-600 hover:text-gray-900"
                        }`}
                    >
                        <FaEye className="w-3.5 h-3.5" /> Visualizar Prévia
                    </button>
                </div>
            </div>

            {/* BARRA DE FERRAMENTAS DO EDITOR */}
            {!isPreview && (
                <div className="flex flex-wrap items-center gap-1.5 p-2 bg-gray-50 border border-gray-200 rounded-t-xl">
                    <span className="text-xs font-bold text-gray-500 uppercase px-2 tracking-wider">Formatos:</span>

                    <button
                        type="button"
                        title="Negrito <b>"
                        onClick={() => wrapFormat("<b>", "</b>", "Texto em negrito")}
                        className="p-2 text-gray-700 hover:bg-white hover:text-primary-600 rounded-lg border border-transparent hover:border-gray-200 transition-all"
                    >
                        <FaBold className="w-4 h-4" />
                    </button>

                    <button
                        type="button"
                        title="Itálico <i>"
                        onClick={() => wrapFormat("<i>", "</i>", "Texto em itálico")}
                        className="p-2 text-gray-700 hover:bg-white hover:text-primary-600 rounded-lg border border-transparent hover:border-gray-200 transition-all"
                    >
                        <FaItalic className="w-4 h-4" />
                    </button>

                    <button
                        type="button"
                        title="Título <h3>"
                        onClick={() => wrapFormat("<h3>", "</h3>", "Subtítulo da Notícia")}
                        className="p-2 text-gray-700 hover:bg-white hover:text-primary-600 rounded-lg border border-transparent hover:border-gray-200 transition-all"
                    >
                        <FaHeading className="w-4 h-4" />
                    </button>

                    <button
                        type="button"
                        title="Lista com marcadores"
                        onClick={() => wrapFormat("<ul>\n  <li>", "</li>\n  <li>Outro item</li>\n</ul>", "Item da lista")}
                        className="p-2 text-gray-700 hover:bg-white hover:text-primary-600 rounded-lg border border-transparent hover:border-gray-200 transition-all"
                    >
                        <FaListUl className="w-4 h-4" />
                    </button>

                    <div className="h-5 w-px bg-gray-300 mx-1" />

                    <span className="text-xs font-bold text-gray-500 uppercase px-2 tracking-wider">Inserir Links:</span>

                    {/* BOTÃO LINK EXTERNO */}
                    <button
                        type="button"
                        onClick={handleOpenExternalModal}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-all"
                    >
                        <FaExternalLinkAlt className="w-3.5 h-3.5 text-emerald-600" /> Link Externo (Site)
                    </button>

                    {/* BOTÃO LINK INTERNO */}
                    <button
                        type="button"
                        onClick={handleOpenInternalModal}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#0088b9] bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-all"
                    >
                        <FaLink className="w-3.5 h-3.5 text-[#01b0ef]" /> Link Interno (Página do Site)
                    </button>
                </div>
            )}

            {/* ÁREA DE TEXTO / PREVIEW */}
            {!isPreview ? (
                <textarea
                    ref={textareaRef}
                    required={required}
                    rows={12}
                    className={`w-full p-4 bg-white border border-gray-200 ${
                        !isPreview ? "rounded-b-xl" : "rounded-xl"
                    } font-mono text-sm leading-relaxed text-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all`}
                    placeholder="Digite ou cole o texto da notícia. Use os botões acima para incluir links externos ou internos..."
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            ) : (
                <div className="min-h-[300px] p-6 bg-white border border-gray-200 rounded-xl shadow-inner overflow-y-auto">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 pb-2 border-b border-gray-100 flex items-center justify-between">
                        <span>Pré-visualização do conteúdo</span>
                        <span className="text-emerald-600 flex items-center gap-1"><FaCheck /> Modo leitura</span>
                    </div>

                    {value.trim() ? (
                        <div
                            className="prose prose-blue max-w-none text-gray-700
                            prose-headings:font-bold prose-headings:text-[#0088b9]
                            prose-a:text-[#01b0ef] hover:prose-a:text-[#0088b9] prose-a:font-bold prose-a:underline
                            prose-p:leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: value }}
                        />
                    ) : (
                        <p className="text-gray-400 italic text-center py-12">Nenhum conteúdo digitado ainda.</p>
                    )}
                </div>
            )}

            {/* MODAL LINK EXTERNO */}
            {showExternalModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-md w-full p-6 space-y-5 relative">
                        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                            <div className="flex items-center gap-2 text.emerald-700">
                                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                                    <FaGlobe className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 leading-tight">Incluir Link Externo</h3>
                                    <p className="text-xs text-gray-500">Link direcionando para um site fora do portal</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowExternalModal(false)}
                                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg"
                            >
                                <FaTimes className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                    Texto a ser exibido no link *
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ex: Clique aqui para acessar o Portal do Governo"
                                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                                    value={externalText}
                                    onChange={(e) => setExternalText(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                    URL do Site Externo *
                                </label>
                                <input
                                    type="url"
                                    placeholder="Ex: https://www.gov.br ou https://rn.gov.br"
                                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                                    value={externalUrl}
                                    onChange={(e) => setExternalUrl(e.target.value)}
                                />
                            </div>

                            <label className="flex items-center gap-2.5 p-3 bg-emerald-50/60 rounded-xl cursor-pointer border border-emerald-100">
                                <input
                                    type="checkbox"
                                    checked={externalNewTab}
                                    onChange={(e) => setExternalNewTab(e.target.checked)}
                                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                                />
                                <span className="text-xs font-medium text-emerald-900">
                                    Abrir link em uma nova aba (target="_blank")
                                </span>
                            </label>
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setShowExternalModal(false)}
                                className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmExternalLink}
                                disabled={!externalUrl.trim()}
                                className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-xl shadow-md transition-all flex items-center gap-1.5"
                            >
                                <FaCheck /> Inserir Link
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL LINK INTERNO */}
            {showInternalModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-lg w-full p-6 space-y-5 relative max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                            <div className="flex items-center gap-2 text-[#0088b9]">
                                <div className="p-2 bg-blue-100 rounded-lg text-[#01b0ef]">
                                    <FaSitemap className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 leading-tight">Incluir Link de Página Interna</h3>
                                    <p className="text-xs text-gray-500">Selecione uma seção do próprio site institucional</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowInternalModal(false)}
                                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg"
                            >
                                <FaTimes className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                    Texto a ser exibido no link *
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ex: Acesse a página de Licitações"
                                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#01b0ef] outline-none"
                                    value={internalText}
                                    onChange={(e) => setInternalText(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                    Selecione a Página Interna *
                                </label>

                                <div className="space-y-2">
                                    <select
                                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#01b0ef] outline-none"
                                        value={isCustomPath ? "CUSTOM" : internalPath}
                                        onChange={(e) => {
                                            if (e.target.value === "CUSTOM") {
                                                setIsCustomPath(true);
                                            } else {
                                                setIsCustomPath(false);
                                                setInternalPath(e.target.value);
                                            }
                                        }}
                                    >
                                        {PAGINAS_INTERNAS.map((cat, idx) => (
                                            <optgroup key={idx} label={cat.categoria}>
                                                {cat.paginas.map((p) => (
                                                    <option key={p.path} value={p.path}>
                                                        {p.nome} ({p.path})
                                                    </option>
                                                ))}
                                            </optgroup>
                                        ))}
                                        <optgroup label="Outro Caminho">
                                            <option value="CUSTOM">Digitar rota interna personalizada...</option>
                                        </optgroup>
                                    </select>

                                    {isCustomPath && (
                                        <input
                                            type="text"
                                            placeholder="Ex: /noticias/minha-noticia-especifica"
                                            className="w-full px-3.5 py-2.5 bg-blue-50/50 border border-blue-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-[#01b0ef] outline-none"
                                            value={customPath}
                                            onChange={(e) => setCustomPath(e.target.value)}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setShowInternalModal(false)}
                                className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmInternalLink}
                                disabled={isCustomPath && !customPath.trim()}
                                className="px-5 py-2 text-xs font-bold text-white bg-[#0088b9] hover:bg-[#00739d] disabled:opacity-50 rounded-xl shadow-md transition-all flex items-center gap-1.5"
                            >
                                <FaCheck /> Inserir Link Interno
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
