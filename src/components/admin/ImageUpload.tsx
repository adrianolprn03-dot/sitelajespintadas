"use client";
import { useState, useRef } from "react";
import { FaCloudUploadAlt, FaTrash, FaSpinner, FaImage } from "react-icons/fa";
import toast from "react-hot-toast";

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    label?: string;
}

export default function ImageUpload({ value, onChange, label }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validar tipo de arquivo
        if (!file.type.startsWith("image/")) {
            toast.error("Por favor, selecione uma imagem (JPG, PNG, WebP)");
            return;
        }

        // Limite de 2MB para evitar Strings muito granes no Banco de Dados
        const MAX_SIZE = 2 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            toast.error("O arquivo é muito grande. O limite máximo é 2MB.");
            return;
        }

        setUploading(true);

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            onChange(base64String);
            toast.success("Foto carregada! Clique em 'Salvar Alterações' para confirmar.");
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        };
        reader.onerror = () => {
            toast.error("Erro ao processar a imagem.");
            setUploading(false);
        };
        
        reader.readAsDataURL(file);
    };

    return (
        <div className="space-y-2">
            {label && (
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">
                    {label}
                </label>
            )}
            
            <div className="flex flex-col gap-4">
                {value ? (
                    <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-gray-100 group">
                        <img 
                            src={value} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-white text-gray-800 p-3 rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
                                title="Alterar Foto"
                            >
                                <FaCloudUploadAlt size={20} />
                            </button>
                            <button
                                type="button"
                                onClick={() => onChange("")}
                                className="bg-red-500 text-white p-3 rounded-xl hover:bg-red-600 transition-colors shadow-lg"
                                title="Remover Foto"
                            >
                                <FaTrash size={18} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="w-full h-48 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center gap-3 hover:border-blue-400 hover:bg-blue-50/30 transition-all text-gray-400 hover:text-blue-500 group"
                    >
                        {uploading ? (
                            <FaSpinner className="animate-spin text-3xl text-blue-500" />
                        ) : (
                            <>
                                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <FaCloudUploadAlt size={24} />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-bold uppercase tracking-tight">Clique para carregar</p>
                                    <p className="text-[10px] font-medium opacity-60 italic">PNG, JPG ou WebP até 5MB</p>
                                </div>
                            </>
                        )}
                    </button>
                )}
                
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleUpload}
                    accept="image/*"
                    className="hidden"
                />
                
                {value && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl border border-blue-100">
                        <FaImage className="text-blue-500 text-xs" />
                        <span className="text-[9px] font-mono text-blue-600 truncate max-w-[200px]">{value}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
