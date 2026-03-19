"use client";
import { FaDownload } from "react-icons/fa";
import { exportToCSV, exportToJSON } from "@/lib/exportUtils";

export default function ExportButtons({ data, filename }: { data: any[], filename: string }) {
    return (
        <div className="flex gap-2">
            <button 
                onClick={() => exportToCSV(data, filename)}
                className="flex items-center gap-2 bg-[#50B749] hover:bg-green-600 text-white text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-xl transition-all shadow-lg shadow-green-900/10"
            >
                <FaDownload size={14} /> CSV
            </button>
            <button 
                onClick={() => exportToJSON(data, filename)}
                className="flex items-center gap-2 bg-[#01b0ef] hover:bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-900/10"
            >
                <FaDownload size={14} /> JSON
            </button>
        </div>
    );
}
