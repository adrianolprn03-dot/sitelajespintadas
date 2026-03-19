"use client";

import { FaDownload } from "react-icons/fa";
import { exportToCSV, exportToJSON } from "@/lib/exportUtils";

interface ObrasExportProps {
    data: any[];
}

export default function ObrasExport({ data }: ObrasExportProps) {
    return (
        <div className="flex gap-2">
            <button
                onClick={() => exportToCSV(data, "obras_publicas")}
                className="flex items-center gap-2 bg-[#50B749] hover:bg-green-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all shadow-sm"
            >
                <FaDownload /> CSV
            </button>
            <button
                onClick={() => exportToJSON(data, "obras_publicas")}
                className="flex items-center gap-2 bg-[#01b0ef] hover:bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all shadow-sm"
            >
                <FaDownload /> JSON
            </button>
        </div>
    );
}
