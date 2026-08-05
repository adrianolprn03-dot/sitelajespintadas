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

    const rawLines = text.split('\n').map(l => l.trim()).filter(Boolean);

    const segments: SegmentGroup[] = [];
    let curSeg: SegmentGroup | null = null;
    let curEnt: EntityGroup | null = null;
    let curRole: "Titular" | "Suplente" = "Titular";

    const isSegmentHeader = (l: string) => {
        return /^(Poder Executivo|Segmento de [^:]+|Segmento [^:]+):?$/i.test(l) ||
               /^---SEG:.*---$/.test(l);
    };

    const isEntityHeader = (l: string) => {
        if (/^(Titular|Titulares|Suplente|Suplentes):?$/i.test(l)) return false;
        if (isSegmentHeader(l)) return false;
        return /:$/.test(l) && !/^(Titular|Suplente)/i.test(l);
    };

    for (let line of rawLines) {
        line = line.trim();
        if (!line) continue;

        if (isSegmentHeader(line)) {
            const segName = line.replace(/^---SEG:/, '').replace(/---$/, '').replace(/:$/, '').trim();
            curSeg = { segment: segName, entities: [] };
            segments.push(curSeg);
            curEnt = null;
            curRole = "Titular";
            continue;
        }

        if (isEntityHeader(line)) {
            const entName = line.replace(/:$/, '').trim();
            curEnt = { entity: entName, members: [] };
            if (!curSeg) {
                curSeg = { segment: "Composição dos Membros", entities: [] };
                segments.push(curSeg);
            }
            curSeg.entities.push(curEnt);
            curRole = "Titular";
            continue;
        }

        const standaloneRoleMatch = line.match(/^(Titular|Titulares|Suplente|Suplentes):?$/i);
        if (standaloneRoleMatch) {
            curRole = /suplente/i.test(standaloneRoleMatch[1]) ? "Suplente" : "Titular";
            continue;
        }

        let role: "Titular" | "Suplente" = curRole;
        let name = line;

        const prefixMatch = line.match(/^(Titular|Titulares|Suplente|Suplentes|Presidente|Vice-Presidente|Membro)\s*[:\-\t]\s*(.+)$/i);
        if (prefixMatch) {
            role = /suplente/i.test(prefixMatch[1]) ? "Suplente" : "Titular";
            name = prefixMatch[2];
        } else {
            const suffixMatch = line.match(/^(.+?)\s*[\t\-\(\:]+\s*(Suplente|Suplentes|Titular|Titulares|Presidente|Vice-Presidente|Vice-Presidenta|Membro)\s*\)?$/i);
            if (suffixMatch) {
                role = /suplente/i.test(suffixMatch[2]) ? "Suplente" : "Titular";
                name = suffixMatch[1];
            } else {
                const trailingMatch = line.match(/^(.+?)\s+(Suplente|Suplentes|Titular|Titulares)$/i);
                if (trailingMatch) {
                    role = /suplente/i.test(trailingMatch[2]) ? "Suplente" : "Titular";
                    name = trailingMatch[1];
                }
            }
        }

        name = name.replace(/[\.:;,]+$/, '').trim();

        if (name) {
            if (!curSeg) {
                curSeg = { segment: "Composição dos Membros", entities: [] };
                segments.push(curSeg);
            }
            if (!curEnt) {
                curEnt = { entity: "", members: [] };
                curSeg.entities.push(curEnt);
            }
            curEnt.members.push({ role, name });
        }
    }

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
