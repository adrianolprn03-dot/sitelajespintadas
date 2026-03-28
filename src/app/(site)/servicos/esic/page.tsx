"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import PageHeader from "@/components/PageHeader";
import { 
    FaSearch, FaQuestionCircle, FaChartBar, FaUserShield, 
    FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock, 
    FaFileAlt, FaExternalLinkAlt, FaInfoCircle, FaBullhorn, 
    FaGavel, FaLock, FaBalanceScale, FaBook, FaSignOutAlt, 
    FaHistory, FaCheckCircle, FaChevronDown, FaChevronUp 
} from "react-icons/fa";
import Link from "next/link";

const linksLaterais = [
    { label: "Institucional do SIC", href: "/transparencia/institucional", icon: FaInfoCircle },
    { label: "Perguntas Frequentes (FAQ-LAI)", href: "/transparencia/faq", icon: FaQuestionCircle },
    { label: "Relatório de Solicitações do SIC", href: "/transparencia/relatorios", icon: FaChartBar },
    { label: "Gráficos e Estatísticas do SIC", href: "/transparencia/relatorios", icon: FaChartBar },
    { label: "Regulamentação da LAI", href: "/transparencia/legislacao", icon: FaGavel },
    { label: "Acesso à Informação", href: "/transparencia", icon: FaBook },
];

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
};

export default function ESICPage() {
    const [view, setView] = useState<"login" | "register" | "form" | "history">("login");
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [protocolo, setProtocolo] = useState<string | null>(null);
    const [pedidos, setPedidos] = useState<Pedido[]>([]);

    // Form states
    const [loginForm, setLoginForm] = useState({ email: "", senha: "" });
    const [registerForm, setRegisterForm] = useState({ nome: "", email: "", confirmEmail: "", cpf: "", senha: "", confirmSenha: "", concordo: false });
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
                    setView("form");
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
                setView("form");
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
                    nome: registerForm.nome,
                    email: registerForm.email,
                    cpf: registerForm.cpf,
                    senha: registerForm.senha
                }),
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem("esic-token", data.token);
                setUser(data.cidadao);
                toast.success("Conta criada com sucesso!");
                setView("form");
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
        setView("login");
        toast.success("Sessão encerrada.");
    };

    if (loading && !user) {
        return <div className="min-h-screen bg-gray-50 flex items-center justify-center font-black uppercase tracking-widest text-[#0088b9]">Carregando sistema...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <PageHeader
                title="e-SIC – Serviço de Informação ao Cidadão"
                subtitle="Solicite informações públicas conforme a Lei 12.527/2011"
                breadcrumbs={[{ label: "Início", href: "/" }, { label: "Serviços", href: "/servicos" }, { label: "e-SIC" }]}
            />

            <div className="max-w-[1240px] mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    
                    {/* ====== COLUNA PRINCIPAL ====== */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* Header de Usuário logado */}
                        {user && (
                            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black">
                                        {user.nome.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Logado como</p>
                                        <p className="text-sm font-bold text-gray-800">{user.nome}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => view === "history" ? setView("form") : fetchHistory()}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest bg-gray-50 text-gray-600 hover:bg-gray-100 transition-all border border-gray-100"
                                    >
                                        {view === "history" ? <FaFileAlt /> : <FaHistory />}
                                        {view === "history" ? "Fazer Pedido" : "Meus Pedidos"}
                                    </button>
                                    <button onClick={logout} className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest bg-red-50 text-red-600 hover:bg-red-100 transition-all border border-red-100">
                                        <FaSignOutAlt /> Sair
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ESTADO: LOGIN */}
                        {view === "login" && !user && (
                            <div className="bg-white rounded-[3.5rem] p-12 shadow-xl shadow-gray-200/40 border-2 border-white lg:max-w-xl mx-auto text-center border-white">
                                <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-8">
                                    <FaLock />
                                </div>
                                <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter mb-2">Acesse o sistema</h2>
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-8">Caso já tenha conta, informe seu e-mail</p>
                                
                                <form onSubmit={handleLogin} className="space-y-4 text-left">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Seu E-mail</label>
                                        <input 
                                            type="email" required
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold"
                                            value={loginForm.email} onChange={e => setLoginForm({...loginForm, email: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Sua Senha</label>
                                        <input 
                                            type="password" required
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold"
                                            value={loginForm.senha} onChange={e => setLoginForm({...loginForm, senha: e.target.value})}
                                        />
                                    </div>
                                    <div className="flex justify-between items-center py-2">
                                        <button type="button" onClick={() => setView("register")} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Não tenho conta</button>
                                        <button type="button" className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:underline">Esqueci minha senha</button>
                                    </div>
                                    <button 
                                        type="submit" disabled={submitting}
                                        className="w-full bg-[#01b0ef] hover:bg-blue-600 text-white font-black py-5 rounded-[1.5rem] shadow-xl shadow-blue-500/20 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {submitting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                                        Clique aqui para entrar
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* ESTADO: CADASTRO */}
                        {view === "register" && (
                            <div className="bg-white rounded-[3.5rem] p-12 shadow-xl shadow-gray-200/40 border-2 border-white lg:max-w-2xl mx-auto">
                                <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter mb-2">Criar sua conta</h2>
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-8 border-b border-gray-50 pb-6">Preencha os campos para acesso ao e-SIC</p>

                                <form onSubmit={handleRegister} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Nome Completo *</label>
                                            <input type="text" required value={registerForm.nome} onChange={e => setRegisterForm({...registerForm, nome: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">CPF</label>
                                            <input type="text" value={registerForm.cpf} onChange={e => setRegisterForm({...registerForm, cpf: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="000.000.000-00" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">E-mail *</label>
                                            <input type="email" required value={registerForm.email} onChange={e => setRegisterForm({...registerForm, email: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Confirmar E-mail *</label>
                                            <input type="email" required value={registerForm.confirmEmail} onChange={e => setRegisterForm({...registerForm, confirmEmail: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Senha *</label>
                                            <input type="password" required value={registerForm.senha} onChange={e => setRegisterForm({...registerForm, senha: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Confirmar Senha *</label>
                                            <input type="password" required value={registerForm.confirmSenha} onChange={e => setRegisterForm({...registerForm, confirmSenha: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                                        </div>
                                    </div>

                                    <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100 italic text-[10px] text-amber-700 leading-relaxed">
                                        <input type="checkbox" id="lgpd" checked={registerForm.concordo} onChange={e => setRegisterForm({...registerForm, concordo: e.target.checked})} className="mr-3 accent-amber-600" />
                                        <label htmlFor="lgpd">
                                            DECLARO, para fins de direito, sob as penas da lei, que as informações prestadas são verdadeiras e autênticas. Estou ciente de que a falsidade desta declaração configura crime previsto no Código Penal Brasileiro. Meus dados serão tratados de acordo com a <strong>LGPD (Lei 13.709/2018)</strong>.
                                        </label>
                                    </div>

                                    <button 
                                        type="submit" disabled={submitting} 
                                        className="w-full bg-[#0088b9] text-white font-black py-5 rounded-[1.5rem] uppercase tracking-widest text-xs shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                                    >
                                        Clique aqui para concluir o cadastro
                                    </button>

                                    <button type="button" onClick={() => setView("login")} className="w-full text-center text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-blue-600 transition-colors">Já tenho uma conta</button>
                                </form>
                            </div>
                        )}

                        {/* ESTADO: FORMULÁRIO */}
                        {view === "form" && user && (
                            <>
                                {protocolo ? (
                                    <div className="bg-white rounded-[3.5rem] p-12 text-center shadow-xl border-2 border-white animate-fade-in-up">
                                        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                                            <FaCheckCircle />
                                        </div>
                                        <h2 className="text-2xl font-black text-[#0088b9] mb-3 uppercase tracking-tighter">Pedido Registrado!</h2>
                                        <p className="text-gray-500 mb-8 font-medium">Seu pedido foi encaminhado com sucesso. Guarde seu protocolo:</p>
                                        <div className="bg-blue-50/50 border-2 border-blue-100/50 rounded-3xl p-8 mb-8">
                                            <p className="text-[10px] text-gray-400 mb-2 font-black uppercase tracking-widest">Número de Protocolo</p>
                                            <p className="text-3xl font-mono font-black text-[#01b0ef] tracking-wider">{protocolo}</p>
                                        </div>
                                        <button onClick={() => setProtocolo(null)} className="bg-[#01b0ef] text-white font-black py-4 px-12 rounded-2xl shadow-lg hover:bg-blue-600 transition-all uppercase tracking-widest text-xs">Fazer um novo pedido</button>
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-[3.5rem] shadow-xl p-10 border-2 border-white">
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="w-12 h-12 bg-[#01b0ef]/10 text-[#01b0ef] rounded-2xl flex items-center justify-center text-xl">
                                                <FaFileAlt />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-black text-[#0088b9] uppercase tracking-tighter">Fazer Pedido de Informação</h2>
                                                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-0.5">Preencha os campos abaixo</p>
                                            </div>
                                        </div>
                                        
                                        <form onSubmit={handleEsicSubmit} className="space-y-6">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Órgão / Secretaria *</label>
                                                <select 
                                                    required value={esicForm.orgao} onChange={e => setEsicForm({...esicForm, orgao: e.target.value})}
                                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
                                                >
                                                    <option value="">Selecione o órgão...</option>
                                                    <option>Gabinete do Prefeito</option>
                                                    <option>Secretaria de Administração</option>
                                                    <option>Secretaria de Saúde</option>
                                                    <option>Secretaria de Educação</option>
                                                    <option>Secretaria de Infraestrutura</option>
                                                    <option>Secretaria de Finanças</option>
                                                    <option>Secretaria de Assistência Social</option>
                                                </select>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Forma de Retorno *</label>
                                                <select 
                                                    required value={esicForm.formaRetorno} onChange={e => setEsicForm({...esicForm, formaRetorno: e.target.value})}
                                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
                                                >
                                                    <option value="sistema">De forma eletrônica via sistema (Recomendado)</option>
                                                    <option value="email">Por E-mail</option>
                                                    <option value="retirar">Retirar Pessoalmente</option>
                                                </select>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Descrição do Pedido *</label>
                                                <textarea 
                                                    required rows={6} value={esicForm.pedido} onChange={e => setEsicForm({...esicForm, pedido: e.target.value})}
                                                    placeholder="Descreva claramente a informação que deseja solicitar..."
                                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                                />
                                            </div>
                                            <button 
                                                type="submit" disabled={submitting}
                                                className="w-full bg-[#01b0ef] text-white font-black py-5 rounded-[1.5rem] uppercase tracking-widest text-xs shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                                            >
                                                {submitting ? "Processando..." : "Enviar Pedido de Informação"}
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </>
                        )}

                        {/* ESTADO: HISTORY */}
                        {view === "history" && (
                            <div className="bg-white rounded-[3.5rem] shadow-xl p-10 border-2 border-white">
                                <h2 className="text-xl font-black text-[#0088b9] uppercase tracking-tighter mb-8 flex items-center gap-3">
                                    <FaHistory /> Meus Pedidos Realizados
                                </h2>
                                
                                {pedidos.length === 0 ? (
                                    <div className="text-center py-20 text-gray-400 italic">Você ainda não possui pedidos registrados.</div>
                                ) : (
                                    <div className="space-y-4">
                                        {pedidos.map(p => (
                                            <div key={p.id} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-[#01b0ef] transition-colors">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-1 block">Protocolo {p.protocolo}</span>
                                                        <h4 className="font-bold text-gray-800">{p.orgao}</h4>
                                                    </div>
                                                    <span className="px-3 py-1 bg-white text-[10px] font-bold text-gray-500 rounded-full border border-gray-200 uppercase tracking-widest">{p.status}</span>
                                                </div>
                                                <p className="text-xs text-gray-500 line-clamp-2 italic mb-2">"{p.pedido}"</p>
                                                <div className="text-[9px] text-gray-300 font-bold uppercase">Solicitado em: {new Date(p.criadoEm).toLocaleDateString()}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                    </div>

                    {/* ====== SIDEBAR DIREITA ====== */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-7 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#01b0ef] to-[#0088b9]" />
                            <h3 className="text-sm font-black text-gray-800 uppercase tracking-tighter mb-6 flex items-center gap-2 pt-2">
                                <FaInfoCircle className="text-[#01b0ef]" /> Informações do SIC
                            </h3>
                            <div className="space-y-5">
                                <div className="flex items-start gap-3">
                                    <div className="w-9 h-9 bg-blue-50 text-[#01b0ef] rounded-xl flex items-center justify-center shrink-0 text-sm">
                                        <FaPhoneAlt />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Contatos do SIC</p>
                                        <p className="text-sm font-bold text-gray-700">(84) 3533-2244</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-9 h-9 bg-blue-50 text-[#01b0ef] rounded-xl flex items-center justify-center shrink-0 text-sm">
                                        <FaEnvelope />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">E-mail</p>
                                        <p className="text-sm font-bold text-gray-700 break-all">esic@lajespintadas.rn.gov.br</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Links Laterais */}
                        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-7">
                            <h3 className="text-sm font-black text-gray-800 uppercase tracking-tighter mb-5">Mais Informações</h3>
                            <div className="space-y-1.5">
                                {linksLaterais.map((link, idx) => (
                                    <Link key={idx} href={link.href} className="flex items-center gap-3 text-sm font-semibold text-gray-600 hover:text-[#01b0ef] hover:bg-blue-50/50 px-4 py-3 rounded-xl transition-all group">
                                        <link.icon className="text-gray-400 group-hover:text-[#01b0ef] transition-colors shrink-0" />
                                        <span className="flex-1">{link.label}</span>
                                        <FaExternalLinkAlt className="text-[10px] text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
