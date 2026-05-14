"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import PageHeader from "@/components/PageHeader";
import { 
    FaSearch, FaQuestionCircle, FaChartBar, FaUserShield, 
    FaPhone, FaEnvelope, FaMapMarker, FaClock, 
    FaFile, FaExternalLink, FaInfoCircle, FaBullhorn, 
    FaGavel, FaLock, FaBalanceScale, FaBook, FaSignOut, 
    FaHistory, FaCheckCircle, FaChevronDown, FaChevronUp,
    FaUser, FaBuilding, FaIdCard, FaBriefcase, FaArrowLeft, FaHome
} from "react-icons/fa";
import Link from "next/link";

type User = {
    id: string;
    nome: string;
    email: string;
};

type Pedido = {
    id: string;
    protocolo: string;
    orgao: string;
    pedido: string;
    status: string;
    criadoEm: string;
    resposta?: string;
    respondidoEm?: string;
};

export default function ESICPage() {
    // view: auth | dashboard | history | info
    const [view, setView] = useState<"auth" | "dashboard" | "history" | "info">("auth");
    const [authTab, setAuthTab] = useState<"login" | "register">("login");
    const [infoTab, setInfoTab] = useState("sic");
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [protocolo, setProtocolo] = useState<string | null>(null);
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    
    // PF vs PJ
    const [tipoPessoa, setTipoPessoa] = useState<"Física" | "Jurídica">("Física");

    // Form states
    const [loginForm, setLoginForm] = useState({ email: "", senha: "" });
    const [registerForm, setRegisterForm] = useState({ 
        nome: "", 
        email: "", 
        confirmEmail: "", 
        senha: "", 
        confirmSenha: "", 
        cpf: "",
        cnpj: "",
        razaoSocial: "",
        nomeFantasia: "",
        telefone: "",
        dataNascimento: "",
        sexo: "",
        escolaridade: "",
        profissao: "",
        rg: "",
        orgaoEmissor: "",
        ufEmissor: "",
        cep: "",
        endereco: "",
        numero: "",
        bairro: "",
        cidade: "Lajes Pintadas",
        uf: "RN",
        dataAbertura: "",
        concordo: false 
    });
    const [esicForm, setEsicForm] = useState({ orgao: "", pedido: "", formaRetorno: "sistema" });

    useEffect(() => {
        checkSession();
    }, []);

    const checkSession = async () => {
        const token = localStorage.getItem("esic-token");
        if (token) {
            try {
                const res = await fetch("/api/esic/auth/me", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                    setView("dashboard");
                } else {
                    localStorage.removeItem("esic-token");
                }
            } catch (error) {
                console.error("Auth check error", error);
            }
        }
        setLoading(false);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch("/api/esic/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginForm),
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem("esic-token", data.token);
                setUser(data.cidadao);
                toast.success(`Bem-vindo, ${data.cidadao.nome}!`);
                setView("dashboard");
            } else {
                toast.error(data.error || "Erro ao entrar.");
            }
        } catch {
            toast.error("Erro de conexão.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (registerForm.email !== registerForm.confirmEmail) return toast.error("Os e-mails não coincidem.");
        if (registerForm.senha !== registerForm.confirmSenha) return toast.error("As senhas não coincidem.");
        if (!registerForm.concordo) return toast.error("Você deve concordar com os termos.");

        setSubmitting(true);
        try {
            const res = await fetch("/api/esic/auth/cadastro", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...registerForm,
                    tipoPessoa
                }),
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem("esic-token", data.token);
                setUser(data.cidadao);
                toast.success("Conta criada com sucesso!");
                setView("dashboard");
            } else {
                toast.error(data.error || "Erro ao cadastrar.");
            }
        } catch {
            toast.error("Erro de conexão.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleEsicSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        const token = localStorage.getItem("esic-token");
        try {
            const res = await fetch("/api/esic", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(esicForm),
            });
            const data = await res.json();
            if (res.ok) {
                setProtocolo(data.protocolo);
                toast.success("Pedido registrado!");
                setEsicForm({ orgao: "", pedido: "", formaRetorno: "sistema" });
            } else {
                toast.error(data.error || "Erro ao enviar.");
            }
        } catch {
            toast.error("Erro de conexão.");
        } finally {
            setSubmitting(false);
        }
    };

    const fetchHistory = async () => {
        setView("history");
        setLoading(true);
        const token = localStorage.getItem("esic-token");
        try {
            const res = await fetch("/api/esic/meus-pedidos", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setPedidos(data);
            }
        } catch {
            toast.error("Erro ao carregar histórico.");
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("esic-token");
        setUser(null);
        setView("auth");
        toast.success("Sessão encerrada.");
    };

    if (loading && !user) {
        return <div className="min-h-screen bg-gray-50 flex items-center justify-center font-black uppercase tracking-widest text-primary">Carregando sistema...</div>;
    }

    const sidebarItems = [
        { id: "sic", label: "Informações do SIC", icon: FaInfoCircle, internal: true },
        { id: "faq", label: "e-SIC Perguntas e Respostas", icon: FaQuestionCircle, href: "/transparencia/passiva/perguntas" },
        { id: "relatorios", label: "Relatório estatístico SIC", icon: FaChartBar, href: "/transparencia/passiva/relatorios/estatisticas" },
        { id: "sigilo", label: "Solicitação Grau de Sigilo", icon: FaLock, href: "/transparencia/passiva/relatorios/com-sigilo" },
        { id: "nao-sigiloso", label: "Solicitação não sigilosa", icon: FaBook, href: "/transparencia/passiva/relatorios/sem-sigilo" },
        { id: "prazos", label: "Prazos de Respostas SIC", icon: FaClock, internal: true },
        { id: "regulamentacao", label: "Regulamentação da LAI", icon: FaGavel, href: "/transparencia/passiva/regulamentacao" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-['Montserrat',sans-serif]">
            <PageHeader
                title="e-SIC – Serviço de Informação ao Cidadão"
                subtitle="Solicite informações públicas conforme a Lei 12.527/2011"
                breadcrumbs={[{ label: "Início", href: "/" }, { label: "Serviços", href: "/servicos" }, { label: "e-SIC" }]}
            />

            <div className="max-w-[1240px] mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    
                    {/* ====== SIDEBAR (ESQUERDA) ====== */}
                    <div className="lg:col-span-1 space-y-4">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            {/* Botão Home / Acesso ao Sistema */}
                            <button 
                                onClick={() => { setView(user ? "dashboard" : "auth"); setInfoTab("none"); }}
                                className={`w-full text-left px-6 py-4 flex items-center gap-3 text-xs font-black uppercase tracking-widest transition-all ${view !== "info" ? "bg-primary text-white" : "text-gray-500 hover:bg-gray-50"}`}
                            >
                                <FaHome /> Acesso ao Sistema
                            </button>

                            {sidebarItems.map(item => (
                                item.internal ? (
                                    <button 
                                        key={item.id}
                                        onClick={() => { setView("info"); setInfoTab(item.id); }}
                                        className={`w-full text-left px-6 py-4 flex items-center gap-3 text-xs font-black uppercase tracking-widest transition-all ${infoTab === item.id && view === "info" ? "bg-primary text-white" : "text-gray-500 hover:bg-gray-50"}`}
                                    >
                                        <item.icon /> {item.label}
                                    </button>
                                ) : (
                                    <Link 
                                        key={item.id}
                                        href={item.href || "#"}
                                        className="w-full text-left px-6 py-4 flex items-center gap-3 text-xs font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition-all border-t border-gray-50"
                                    >
                                        <item.icon /> {item.label}
                                    </Link>
                                )
                            ))}
                        </div>

                        {/* Card de Contato Rápido (Baseado na Imagem) */}
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">Contato Presencial</h4>
                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <FaMapMarker className="text-gray-400 mt-1" size={14} />
                                    <p className="text-[11px] font-bold text-gray-600 leading-snug">Rua São Francisco, nº 275 – Centro<br/>CEP: 59.235-000</p>
                                </div>
                                <div className="flex gap-3">
                                    <FaPhone className="text-gray-400 mt-1" size={14} />
                                    <p className="text-[11px] font-bold text-gray-600 leading-snug">(84) 9.8748 – 0287</p>
                                </div>
                                <div className="flex gap-3">
                                    <FaClock className="text-gray-400 mt-1" size={14} />
                                    <p className="text-[11px] font-bold text-gray-600 leading-snug">Seg a Sex: 07h às 13h</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ====== ÁREA PRINCIPAL ====== */}
                    <div className="lg:col-span-3">
                        
                        {/* VIEW: INFO (CONTEÚDO DAS ABAS) */}
                        {view === "info" && (
                            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100 min-h-[500px] animate-fade-in">
                                {infoTab === "sic" && (
                                    <div className="space-y-8">
                                        <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tighter border-b pb-6 flex items-center gap-3">
                                            <FaInfoCircle className="text-primary" /> Informações do SIC
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed font-medium text-lg">
                                            O SIC (Serviço de Informações ao Cidadão) permite que qualquer pessoa encaminhe pedidos de informação aos órgãos e entidades do Poder Executivo Municipal.
                                        </p>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                            <div className="space-y-6">
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Autoridade de monitoramento do SIC</p>
                                                    <p className="font-black text-gray-800 text-lg uppercase">Sidcley Gomes da Silva</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Unidade/setor responsável</p>
                                                    <p className="font-black text-gray-800 text-lg uppercase">Ouvidoria</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Contatos do Ouvidoria</p>
                                                    <p className="font-bold text-gray-700">(84) 9.8748 – 0287</p>
                                                    <p className="font-bold text-gray-700">Whatsapp: (84) 9 8748 – 0287</p>
                                                    <p className="font-bold text-gray-700 break-all">Email: ouvidoria@lajespintadas.rn.gov.br</p>
                                                </div>
                                            </div>
                                            <div className="space-y-6">
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Endereço</p>
                                                    <p className="font-bold text-gray-700 uppercase">Rua São Francisco, nº 275 – Centro<br/>CEP: 59.235-000</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Horário</p>
                                                    <p className="font-bold text-gray-700 uppercase">07H ÀS 13H DE SEGUNDA A SEXTA-FEIRA</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {infoTab === "prazos" && (
                                    <div className="space-y-6">
                                        <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tighter border-b pb-6 flex items-center gap-3">
                                            <FaClock className="text-primary" /> Prazos de Resposta
                                        </h3>
                                        <div className="bg-primary-50 p-10 rounded-[2rem] border border-primary-100">
                                            <p className="text-primary-800 font-bold leading-relaxed text-lg mb-6">
                                                De acordo com a Lei de Acesso à Informação (Lei 12.527/2011):
                                            </p>
                                            <ul className="space-y-4">
                                                <li className="flex gap-4">
                                                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center shrink-0 font-black">1</div>
                                                    <p className="text-primary-900 font-medium pt-1">O órgão deve responder imediatamente se a informação estiver disponível.</p>
                                                </li>
                                                <li className="flex gap-4">
                                                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center shrink-0 font-black">2</div>
                                                    <p className="text-primary-900 font-medium pt-1">Caso não seja possível, o prazo é de <strong>20 dias corridos</strong>.</p>
                                                </li>
                                                <li className="flex gap-4">
                                                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center shrink-0 font-black">3</div>
                                                    <p className="text-primary-900 font-medium pt-1">Este prazo pode ser prorrogado por mais <strong>10 dias</strong> mediante justificativa.</p>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                )}
                                {infoTab === "faq" && (
                                    <div className="space-y-6">
                                        <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tighter border-b pb-6 flex items-center gap-3">
                                            <FaQuestionCircle className="text-primary" /> Perguntas e Respostas
                                        </h3>
                                        <div className="space-y-4">
                                            <Link href="/transparencia/passiva/perguntas" className="block p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-primary-500 transition-all group">
                                                <div className="flex justify-between items-center">
                                                    <p className="font-bold text-gray-700">Clique aqui para acessar o FAQ completo da LAI</p>
                                                    <FaExternalLink className="text-gray-400 group-hover:text-primary" />
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                )}
                                {infoTab !== "sic" && infoTab !== "prazos" && infoTab !== "faq" && (
                                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 text-4xl">
                                            <FaFile />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-gray-400 uppercase tracking-widest">Página em Construção</h3>
                                            <p className="text-gray-300 font-medium">As informações detalhadas para esta seção estão sendo migradas.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* VIEW: AUTH (LOGIN / REGISTER) - REVERTED TO PREVIOUS SIMPLE CARD LAYOUT */}
                        {view === "auth" && (
                            <div className="animate-fade-in max-w-2xl mx-auto lg:mx-0">
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                    <div className="bg-gray-50 px-8 py-6 border-b border-gray-100">
                                        <h3 className="text-sm font-black uppercase tracking-widest text-gray-700 flex items-center gap-2">
                                            {authTab === "login" ? <><FaUserShield className="text-primary" /> Identificação do Cidadão</> : <><FaUser className="text-primary" /> Cadastro de Novo Usuário</>}
                                        </h3>
                                    </div>

                                    <div className="p-8">
                                        {authTab === "login" ? (
                                            <form onSubmit={handleLogin} className="space-y-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">E-mail ou CPF/CNPJ</label>
                                                    <div className="relative">
                                                        <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                                        <input 
                                                            type="text" required
                                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-12 py-4 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary outline-none transition-all font-bold"
                                                            placeholder="Digite seu identificador"
                                                            value={loginForm.email} onChange={e => setLoginForm({...loginForm, email: e.target.value})}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Senha de Acesso</label>
                                                    <div className="relative">
                                                        <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                                        <input 
                                                            type="password" required
                                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-12 py-4 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary outline-none transition-all font-bold"
                                                            placeholder="••••••••"
                                                            value={loginForm.senha} onChange={e => setLoginForm({...loginForm, senha: e.target.value})}
                                                        />
                                                    </div>
                                                </div>
                                                <button 
                                                    type="submit" disabled={submitting}
                                                    className="w-full bg-primary hover:bg-primary-600 text-white font-black py-4 rounded-xl shadow-lg shadow-primary-500/20 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-3 disabled:opacity-50"
                                                >
                                                    {submitting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                                                    Entrar no Sistema
                                                </button>
                                                
                                                <div className="pt-4 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                                                    <button type="button" onClick={() => setAuthTab("register")} className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Criar uma nova conta</button>
                                                    <button type="button" className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:underline">Esqueci minha senha</button>
                                                </div>
                                            </form>
                                        ) : (
                                            <form onSubmit={handleRegister} className="space-y-6">
                                                <div className="flex items-center justify-between mb-6">
                                                    <button type="button" onClick={() => setAuthTab("login")} className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 hover:text-primary transition-colors">
                                                        <FaArrowLeft /> Voltar para o login
                                                    </button>
                                                    <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                                                        <button type="button" onClick={() => setTipoPessoa("Física")} className={`px-4 py-2 rounded-md text-[9px] font-black uppercase tracking-widest transition-all ${tipoPessoa === "Física" ? "bg-white shadow-sm text-primary" : "text-gray-400"}`}>Pessoa Física</button>
                                                        <button type="button" onClick={() => setTipoPessoa("Jurídica")} className={`px-4 py-2 rounded-md text-[9px] font-black uppercase tracking-widest transition-all ${tipoPessoa === "Jurídica" ? "bg-white shadow-sm text-primary" : "text-gray-400"}`}>Pessoa Jurídica</button>
                                                    </div>
                                                </div>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="md:col-span-2 space-y-1">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Nome Completo / Responsável *</label>
                                                        <input type="text" required value={registerForm.nome} onChange={e => setRegisterForm({...registerForm, nome: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:border-primary outline-none" />
                                                    </div>
                                                    
                                                    {tipoPessoa === "Física" ? (
                                                        <>
                                                            <div className="space-y-1">
                                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">CPF *</label>
                                                                <input type="text" required value={registerForm.cpf} onChange={e => setRegisterForm({...registerForm, cpf: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold" />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">RG</label>
                                                                <input type="text" value={registerForm.rg} onChange={e => setRegisterForm({...registerForm, rg: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold" />
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="space-y-1">
                                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">CNPJ *</label>
                                                                <input type="text" required value={registerForm.cnpj} onChange={e => setRegisterForm({...registerForm, cnpj: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold" />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Razão Social *</label>
                                                                <input type="text" required value={registerForm.razaoSocial} onChange={e => setRegisterForm({...registerForm, razaoSocial: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold" />
                                                            </div>
                                                        </>
                                                    )}

                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">E-mail de Acesso *</label>
                                                        <input type="email" required value={registerForm.email} onChange={e => setRegisterForm({...registerForm, email: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Senha *</label>
                                                        <input type="password" required value={registerForm.senha} onChange={e => setRegisterForm({...registerForm, senha: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold" />
                                                    </div>
                                                </div>

                                                <div className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 italic text-[10px] text-gray-500">
                                                    <input type="checkbox" checked={registerForm.concordo} onChange={e => setRegisterForm({...registerForm, concordo: e.target.checked})} className="mt-1 shrink-0 accent-primary" />
                                                    <label>DECLARO que as informações fornecidas são verdadeiras e estou ciente das responsabilidades legais e da política de privacidade (LGPD).</label>
                                                </div>

                                                <button type="submit" disabled={submitting} className="w-full bg-primary hover:bg-primary-600 text-white font-black py-4 rounded-xl uppercase tracking-widest text-xs shadow-lg transition-all disabled:opacity-50">Confirmar Cadastro</button>
                                            </form>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="mt-8 bg-primary-50 rounded-2xl p-6 border border-primary-100 flex items-start gap-4">
                                    <FaInfoCircle className="text-primary mt-1 shrink-0" />
                                    <div>
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-primary-800 mb-1">Acesso à Informação</h4>
                                        <p className="text-[11px] text-primary-700 font-medium leading-relaxed">
                                            O acesso à informação pública é um direito constitucional. Através deste sistema, você pode solicitar dados sobre a gestão municipal de forma rápida e segura.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* VIEW: DASHBOARD (USER LOGGED IN) */}
                        {view === "dashboard" && user && (
                            <div className="space-y-8 animate-fade-in">
                                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-primary-50 text-primary rounded-2xl flex items-center justify-center font-black text-xl">{user.nome.charAt(0)}</div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Bem-vindo(a)</p>
                                            <p className="text-lg font-black text-gray-800">{user.nome}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={fetchHistory} className="px-6 py-3 rounded-2xl bg-gray-50 text-gray-600 font-black text-[10px] uppercase tracking-widest border border-gray-100">Meus Pedidos</button>
                                        <button onClick={logout} className="px-6 py-3 rounded-2xl bg-red-50 text-red-600 font-black text-[10px] uppercase tracking-widest border border-red-100">Sair</button>
                                    </div>
                                </div>

                                <div className="bg-white rounded-[3rem] shadow-xl p-10 border-2 border-white">
                                    <h3 className="text-xl font-black text-primary-800 uppercase tracking-tighter mb-8 flex items-center gap-3"><FaFile /> Novo Pedido de Informação</h3>
                                    {protocolo ? (
                                        <div className="text-center py-12">
                                            <FaCheckCircle className="text-primary-500 text-5xl mx-auto mb-4" />
                                            <h4 className="text-2xl font-black text-gray-800 mb-2">Enviado com Sucesso!</h4>
                                            <p className="text-gray-400 mb-8 font-bold">Protocolo: <span className="text-primary-600">{protocolo}</span></p>
                                            <button onClick={() => setProtocolo(null)} className="bg-primary text-white font-black py-4 px-12 rounded-2xl">Novo Pedido</button>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleEsicSubmit} className="space-y-6">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Órgão / Secretaria *</label>
                                                <select required value={esicForm.orgao} onChange={e => setEsicForm({...esicForm, orgao: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold">
                                                    <option value="">Selecione...</option>
                                                    <option>Gabinete do Prefeito</option>
                                                    <option>Secretaria de Administração</option>
                                                    <option>Secretaria de Saúde</option>
                                                    <option>Secretaria de Educação</option>
                                                </select>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Descrição *</label>
                                                <textarea required rows={8} value={esicForm.pedido} onChange={e => setEsicForm({...esicForm, pedido: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold" />
                                            </div>
                                            <button type="submit" disabled={submitting} className="w-full bg-primary text-white font-black py-5 rounded-[1.5rem]">Enviar Solicitação</button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* VIEW: HISTORY */}
                        {view === "history" && (
                            <div className="bg-white rounded-[3rem] shadow-xl p-10 border-2 border-white animate-fade-in">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-xl font-black text-primary-800 uppercase tracking-tighter"><FaHistory /> Histórico de Pedidos</h2>
                                    <button onClick={() => setView("dashboard")} className="text-[10px] font-black text-primary uppercase">Voltar</button>
                                </div>
                                {pedidos.length === 0 ? <p className="text-center py-12 text-gray-400">Nenhum pedido encontrado.</p> : (
                                    <div className="space-y-4">
                                        {pedidos.map(p => (
                                            <div key={p.id} className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-[10px] font-black text-primary">#{p.protocolo}</span>
                                                    <span className="text-[9px] font-black uppercase bg-white px-2 py-1 rounded border">{p.status}</span>
                                                </div>
                                                <p className="font-bold text-gray-800 mb-1">{p.orgao}</p>
                                                <p className="text-xs text-gray-500 line-clamp-2 italic">"{p.pedido}"</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.4s ease-out forwards;
                }
            `}</style>
        </div>
    );
}
