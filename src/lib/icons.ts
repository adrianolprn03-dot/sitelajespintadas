import { 
    FaBuilding, FaHeartbeat, FaGraduationCap, 
    FaHardHat, FaTractor, FaHandsHelping, FaFileInvoiceDollar, FaBalanceScale,
    FaBus, FaTheaterMasks, FaLandmark, FaShieldAlt
} from "react-icons/fa";

export function getSecretariaIcon(nome: string) {
    if (!nome) return FaBuilding;
    const n = nome.toLowerCase();
    if (n.includes('saúde') || n.includes('saude')) return FaHeartbeat;
    if (n.includes('educação') || n.includes('educacao') || n.includes('cultura')) return FaGraduationCap;
    if (n.includes('obras') || n.includes('infraestrutura') || n.includes('urbanismo')) return FaHardHat;
    if (n.includes('agricultura') || n.includes('meio ambiente') || n.includes('recursos hídricos')) return FaTractor;
    if (n.includes('social') || n.includes('trabalho') || n.includes('habitação')) return FaHandsHelping;
    if (n.includes('finanças') || n.includes('financas') || n.includes('tributação') || n.includes('tributacao')) return FaFileInvoiceDollar;
    if (n.includes('procuradoria') || n.includes('jurídico')) return FaBalanceScale;
    if (n.includes('transporte') || n.includes('trânsito')) return FaBus;
    if (n.includes('esporte') || n.includes('lazer') || n.includes('turismo')) return FaTheaterMasks;
    if (n.includes('gabinete') || n.includes('prefeito')) return FaLandmark;
    if (n.includes('controladoria') || n.includes('controle')) return FaShieldAlt;
    
    return FaBuilding; // Ícone Padrão
}
