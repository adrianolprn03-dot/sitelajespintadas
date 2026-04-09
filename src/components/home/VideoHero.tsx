"use client";
import { useState } from "react";
import { HiPlay } from "react-icons/hi2";
import { IoClose } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";

export default function VideoHero() {
    const [isOpen, setIsOpen] = useState(false);
    const [videoError, setVideoError] = useState(false);

    const videoSrc = "/video_lajes_pintadas.mp4";

    return (
        <section className="relative w-full py-24 md:py-32 overflow-hidden bg-gray-900 group">
            {/* Background Video Loop (Muted) */}
            <div className="absolute inset-0 z-0">
                {!videoError ? (
                    <video
                        src={videoSrc}
                        autoPlay
                        muted
                        loop
                        playsInline
                        onError={() => setVideoError(true)}
                        className="w-full h-full object-cover opacity-90 scale-105 group-hover:scale-100 transition-transform duration-[2s]"
                        aria-hidden="true"
                    />
                ) : (
                    <img
                        src="/images/hero-slider-2.jpg"
                        alt="Vista de Lajes Pintadas"
                        className="w-full h-full object-cover opacity-40"
                    />
                )}
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-transparent to-gray-900 opacity-50" />
                <div className="absolute inset-0 bg-primary-900/10" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-widest mb-8"
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary-400 animate-pulse" />
                    Vídeo Institucional
                </motion.div>

                {/* Play Button */}
                <motion.button
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    viewport={{ once: true }}
                    onClick={() => setIsOpen(true)}
                    className="relative w-20 h-20 md:w-28 md:h-28 flex items-center justify-center bg-secondary-400 text-primary-900 rounded-full shadow-[0_0_50px_rgba(253,185,19,0.3)] transition-all mb-10 group/play"
                    aria-label="Assistir vídeo completo"
                >
                    <div className="absolute inset-0 rounded-full bg-secondary-400/30 animate-ping" />
                    <HiPlay size={40} className="md:w-14 md:h-14 relative z-10 ml-1" />
                </motion.button>

                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    viewport={{ once: true }}
                    className="max-w-2xl"
                >
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-6 uppercase tracking-tighter leading-tight">
                        Conheça a nossa <br />
                        <span className="text-secondary-400">linda Lajes Pintadas</span>
                    </h2>
                    <p className="text-white/70 text-lg font-medium leading-relaxed">
                        Um olhar especial sobre a nossa terra, nossa gente e as belezas que fazem do nosso município um lugar único para se viver.
                    </p>
                </motion.div>
            </div>

            {/* Video Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-black/95 backdrop-blur-xl"
                    >
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-all z-[110]"
                        >
                            <IoClose size={32} />
                        </button>

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-6xl aspect-video rounded-3xl overflow-hidden shadow-2xl bg-black"
                        >
                            <video
                                src={videoSrc}
                                controls
                                autoPlay
                                className="w-full h-full"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
