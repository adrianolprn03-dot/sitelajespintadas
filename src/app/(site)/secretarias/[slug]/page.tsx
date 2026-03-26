import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import { FaBuilding, FaUserTie, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaNewspaper } from "react-icons/fa";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSecretariaIcon } from "@/lib/icons";

export default async function SecretariaDetalhesPage({ params }: { params: { slug: string } }) {
    const secretaria = await prisma.secretaria.findUnique({
        where: { slug: params.slug },
        include: {
            noticias: {
                where: { publicada: true },
                orderBy: { publicadoEm: "desc" },
                take: 3
            }
        }
    });

    if (!secretaria) {
        notFound();
    }

    let servicos: string[] = [];
    try {
        servicos = JSON.parse(secretaria.servicos || "[]");
    } catch (e) {
        console.error("Erro ao parsear serviços:", e);
    }

    return (
        <div className="min-h-screen bg-white font-['Montserrat',sans-serif]">
            <PageHeader
                title={secretaria.nome}
                subtitle="Informações institucionais, gestão e canais de contato."
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Secretarias", href: "/secretarias" },
                    { label: secretaria.nome }
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-6 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    
                    {/* Coluna da Esquerda: Info e Gestor */}
                    <div className="lg:col-span-2 space-y-12">
                        <section>
                            <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter mb-6 flex items-center gap-3">
                                {(() => {
                                    const IconHeader = getSecretariaIcon(secretaria.nome);
                                    return <IconHeader className="text-blue-600" />;
                                })()}
                                Sobre a Secretaria
                            </h2>
                            <p className="text-gray-600 text-lg leading-relaxed font-medium">
                                {secretaria.descricao}
                            </p>
                        </section>

                        <section className="bg-gray-50 rounded-[3rem] p-12 border border-gray-100">
                             <h2 className="text-xl font-black text-gray-800 uppercase tracking-tighter mb-8">Estrutura de Gestão</h2>
                             <div className="flex flex-col md:flex-row items-center gap-8">
                                <div className="w-32 h-32 bg-white rounded-[2.5rem] shadow-xl flex items-center justify-center text-blue-600 shrink-0 border border-gray-50">
                                    <FaUserTie size={48} />
                                </div>
                                <div>
                                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-2 block">Secretário(a) Responsável</span>
                                    <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tighter mb-4">{secretaria.secretario || "Informação em atualização"}</h3>
                                    <p className="text-gray-500 text-sm font-medium leading-relaxed">Responsável pela gestão da pasta, coordenação de equipes e execução das políticas públicas da área.</p>
                                </div>
                             </div>
                        </section>

                        {servicos.length > 0 && (
                            <section>
                                <h2 className="text-xl font-black text-gray-800 uppercase tracking-tighter mb-8">Serviços Oferecidos</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {servicos.map((s: string, i: number) => (
                                        <div key={i} className="flex items-center gap-4 p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                            <span className="text-sm font-bold text-gray-700">{s}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Coluna da Direita: Sidebar de Contato */}
                    <div className="space-y-8">
                        <div className="bg-blue-600 rounded-[3rem] p-10 text-white shadow-2xl shadow-blue-900/20 sticky top-32">
                            <h3 className="text-xl font-black uppercase tracking-tighter mb-8">Canais de Atendimento</h3>
                            
                            <div className="space-y-8">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                                        <FaPhone size={14} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-200 mb-1">Telefone</p>
                                        <p className="font-bold">{secretaria.telefone || "Não informado"}</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                                        <FaEnvelope size={14} />
                                    </div>
                                    <div className="break-all">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-200 mb-1">E-mail</p>
                                        <p className="font-bold">{secretaria.email || "Não informado"}</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                                        <FaClock size={14} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-200 mb-1">Funcionamento</p>
                                        <p className="font-bold">{secretaria.horarioFuncionamento || "08h às 14h (Segunda a Sexta)"}</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                                        <FaMapMarkerAlt size={14} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-200 mb-1">Endereço</p>
                                        <p className="text-sm font-bold leading-relaxed">{secretaria.endereco || "Sede Administrativa Municipal"}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 pt-8 border-t border-white/10">
                                <Link href="/servicos/ouvidoria" className="block text-center bg-white text-blue-600 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-50 transition-colors">
                                    Manifestação Ouvidoria
                                </Link>
                            </div>
                        </div>

                        {secretaria.noticias && secretaria.noticias.length > 0 && (
                            <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100">
                                <h4 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <FaNewspaper className="text-blue-500" /> Notícias da Pasta
                                </h4>
                                <div className="space-y-6">
                                    {secretaria.noticias.map((n: any) => (
                                        <Link key={n.id} href={`/noticias/${n.slug}`} className="block group">
                                            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">{n.publicadoEm ? new Date(n.publicadoEm).toLocaleDateString('pt-BR') : 'Recentemenete'}</p>
                                            <h5 className="font-bold text-sm text-gray-700 group-hover:text-blue-600 leading-tight transition-colors line-clamp-2">{n.titulo}</h5>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
