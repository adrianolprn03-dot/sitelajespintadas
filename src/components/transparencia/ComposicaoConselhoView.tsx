"use client";

import { 
    HiCheck, 
    HiUserPlus, 
    HiBuildingOffice2, 
    HiAcademicCap, 
    HiHeart, 
    HiUserGroup,
    HiSparkles
} from "react-icons/hi2";

type Member = {
    role: "Titular" | "Suplente";
    name: string;
};

type EntityGroup = {
    entity: string;
    members: Member[];
};

type SegmentGroup = {
    segment: string;
    entities: EntityGroup[];
};

export function parseComposicaoText(rawText: string): SegmentGroup[] {
    if (!rawText) return [];
    let text = rawText.trim().replace(/^"/, '').replace(/"$/, '').trim();

    // Inserir marcadores
    let prep = text
        .replace(/(Poder Executivo:)/gi, '\n---SEG:Poder Executivo---\n')
        .replace(/(Segmento de Trabalhadores em Saúde:)/gi, '\n---SEG:Segmento de Trabalhadores em Saúde---\n')
        .replace(/(Segmento de Sociedade Civil:)/gi, '\n---SEG:Segmento de Sociedade Civil---\n')
        .replace(/(Centro Ecumênico de Estudos Bíblicos [–\-]\s*CEBIR:)/gi, '\n---ENT:Centro Ecumênico de Estudos Bíblicos – CEBIR---\n')
        .replace(/(Conselho Comunitário São Sebastião:)/gi, '\n---ENT:Conselho Comunitário São Sebastião---\n')
        .replace(/(46º Grupo de Escoteiros José Ferreira de Lima:)/gi, '\n---ENT:46º Grupo de Escoteiros José Ferreira de Lima---\n')
        .replace(/(Associação Comunitária da Comunidade Riacho Fechado:)/gi, '\n---ENT:Associação Comunitária da Comunidade Riacho Fechado---\n')
        .replace(/(Associação de Veteranos e Amigos Lajespintadenses:)/gi, '\n---ENT:Associação de Veteranos e Amigos Lajespintadenses---\n')
        .replace(/(Associação Cultural de Artes:)/gi, '\n---ENT:Associação Cultural de Artes---\n')
        .replace(/(Titular:|Titulares:)/gi, '\n---ROLE:Titular---\n')
        .replace(/(Suplente:|Suplentes:)/gi, '\n---ROLE:Suplente---\n');

    // Suporte genérico para qualquer outra entidade terminada em ":"
    const entityMatches = text.match(/([A-Z0-9ªºáéíóúâêôãõç\s–\-]{4,}:)/g);
    if (entityMatches) {
        entityMatches.forEach(em => {
            if (!/Poder Executivo|Segmento de|Titular|Suplente/i.test(em)) {
                const entClean = em.replace(/:$/, '').trim();
                prep = prep.replace(new RegExp(em.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), `\n---ENT:${entClean}---\n`);
            }
        });
    }

    const lines = prep.split('\n').map(l => l.trim()).filter(Boolean);

    const segments: SegmentGroup[] = [];
    let curSeg: SegmentGroup | null = null;
    let curEnt: EntityGroup | null = null;
    let curRole: "Titular" | "Suplente" = "Titular";

    for (const line of lines) {
        if (line.startsWith('---SEG:')) {
            const segName = line.replace('---SEG:', '').replace('---', '').trim();
            curSeg = { segment: segName, entities: [] };
            segments.push(curSeg);
            curEnt = null;
        } else if (line.startsWith('---ENT:')) {
            const entName = line.replace('---ENT:', '').replace('---', '').trim();
            curEnt = { entity: entName, members: [] };
            if (!curSeg) {
                curSeg = { segment: "Composição dos Membros", entities: [] };
                segments.push(curSeg);
            }
            curSeg.entities.push(curEnt);
        } else if (line.startsWith('---ROLE:')) {
            curRole = line.includes('Suplente') ? 'Suplente' : 'Titular';
        } else {
            const cleanName = line.replace(/[\.:]$/, '').trim();
            if (cleanName) {
                if (!curSeg) {
                    curSeg = { segment: "Composição dos Membros", entities: [] };
                    segments.push(curSeg);
                }
                if (!curEnt) {
                    curEnt = { entity: "", members: [] };
                    curSeg.entities.push(curEnt);
                }
                curEnt.members.push({
                    role: curRole,
                    name: cleanName
                });
            }
        }
    }

    // Filtrar vazios
    return segments.map(s => ({
        segment: s.segment,
        entities: s.entities.map(e => ({
            entity: e.entity,
            members: e.members.filter(m => m.name)
        })).filter(e => e.members.length > 0)
    })).filter(s => s.entities.length > 0);
}

export default function ComposicaoConselhoView({ composicao }: { composicao: string }) {
    const parsedData = parseComposicaoText(composicao);

    if (parsedData.length === 0) {
        return (
            <div className="text-xs text-gray-500 italic py-2">
                Nenhum membro cadastrado nesta composição.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {parsedData.map((seg, sIdx) => {
                const getSegmentIcon = (name: string) => {
                    if (/executivo/i.test(name)) return <HiBuildingOffice2 className="text-blue-600" size={18} />;
                    if (/saúde|trabalhadores/i.test(name)) return <HiHeart className="text-emerald-600" size={18} />;
                    return <HiUserGroup className="text-indigo-600" size={18} />;
                };

                return (
                    <div key={sIdx} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
                        {/* Cabeçalho do Segmento */}
                        <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
                            <div className="p-2 bg-gray-50 rounded-xl">
                                {getSegmentIcon(seg.segment)}
                            </div>
                            <h4 className="text-xs font-black uppercase tracking-wider text-gray-800">
                                {seg.segment}
                            </h4>
                        </div>

                        {/* Entidades e Membros */}
                        <div className="space-y-4">
                            {seg.entities.map((ent, eIdx) => (
                                <div key={eIdx} className="space-y-2.5">
                                    {ent.entity && (
                                        <div className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                                            <h5 className="text-[11px] font-bold text-gray-700 uppercase tracking-tight">
                                                {ent.entity}
                                            </h5>
                                        </div>
                                    )}

                                    {/* Grid de Membros */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                        {ent.members.map((m, mIdx) => (
                                            <div 
                                                key={mIdx} 
                                                className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                                                    m.role === "Titular"
                                                        ? "bg-emerald-50/50 border-emerald-200/60 text-emerald-950"
                                                        : "bg-slate-50/80 border-slate-200/60 text-slate-900"
                                                }`}
                                            >
                                                <div className="flex items-center gap-2.5 min-w-0">
                                                    {m.role === "Titular" ? (
                                                        <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                                                            <HiCheck size={14} />
                                                        </div>
                                                    ) : (
                                                        <div className="w-7 h-7 rounded-lg bg-slate-400 text-white flex items-center justify-center shrink-0 shadow-sm">
                                                            <HiUserPlus size={14} />
                                                        </div>
                                                    )}
                                                    <span className="text-[11px] font-bold truncate leading-tight">
                                                        {m.name}
                                                    </span>
                                                </div>

                                                <span 
                                                    className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider shrink-0 ${
                                                        m.role === "Titular"
                                                            ? "bg-emerald-600 text-white shadow-xs"
                                                            : "bg-slate-200 text-slate-700"
                                                    }`}
                                                >
                                                    {m.role}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
