"use client";
import React from "react";
import { FaUsers, FaMapMarked, FaBirthdayCake, FaInfoCircle } from "react-icons/fa";
import { motion } from "framer-motion";

const infoCards = [
    {
        icon: FaUsers,
        numero: "4.743",
        legenda: "Habitantes (Censo 2022)",
    },
    {
        icon: FaMapMarked,
        numero: "130.4 km²",
        legenda: "Área Territorial",
    },
    {
        icon: FaBirthdayCake,
        numero: "1953",
        legenda: "Ano de Fundação",
    },
    {
        icon: FaInfoCircle,
        numero: "Laje-pintadense",
        legenda: "Gentílico",
    },
];

export default function ConhecaCidade() {
    return (
        <section className="py-24 bg-[#0055A4] relative text-white" aria-labelledby="conheca-titulo">
            {/* Pattern/Textura de Fundo estilo Cocal (Simples) */}
            <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmZmZmYiLz48L3N2Zz4=')] bg-repeat" />

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="flex flex-col lg:flex-row gap-16 items-center">
                    {/* Coluna Texto */}
                    <div className="lg:w-1/3">
                        <span className="text-[#FDB913] font-black tracking-widest uppercase text-sm mb-4 block">
                            Nossa Cidade
                        </span>
                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            id="conheca-titulo"
                            className="text-4xl md:text-5xl font-black mb-6 uppercase tracking-tighter"
                        >
                            Conheça Lajes Pintadas
                        </motion.h2>
                        <p className="text-white/80 font-medium text-lg mb-8 leading-relaxed">
                            Uma cidade hospitaleira, de povo trabalhador e cultura rica no coração do Rio Grande do Norte. De suas paisagens serranas à sua história, Lajes Pintadas é orgulho de todos que aqui vivem.
                        </p>
                    </div>

                    {/* Coluna Grids Demográficos */}
                    <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                        {infoCards.map((item, index) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                key={index}
                                className="bg-white/10 backdrop-blur-sm border border-white/20 p-8 rounded-3xl flex items-center gap-6 hover:bg-white/20 transition-colors"
                            >
                                <div className="text-[#FDB913]">
                                    <item.icon size={48} />
                                </div>
                                <div>
                                    <h4 className="text-3xl font-black tracking-tight mb-1">{item.numero}</h4>
                                    <span className="text-white/70 font-bold uppercase tracking-widest text-xs">{item.legenda}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
