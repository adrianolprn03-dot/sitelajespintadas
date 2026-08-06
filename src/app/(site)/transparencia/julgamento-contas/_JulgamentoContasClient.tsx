"use client";
import RelatoriosFiscaisTemplate from "@/components/transparencia/RelatoriosFiscaisTemplate";
import { FaGavel } from "react-icons/fa";

export default function JulgamentoContasPage() {
    return (
        <RelatoriosFiscaisTemplate
            title="Julgamento de Contas (Câmara)"
            subtitle="Resultados do julgamento das contas do Poder Executivo realizado pela Câmara Municipal de Lajes Pintadas."
            icon={<FaGavel />}
            tipo="JULGAMENTO_CAMARA"
            breadcrumbLabel="Julgamento de Contas"
            declaracao={{
                exercicios: "EXERCÍCIOS DE 2023 A 2026",
                textoInicial: "A PREFEITURA MUNICIPAL DE LAJES PINTADAS, após consulta aos registros administrativos internos e às páginas oficiais de resultados das Contas Anuais Municipais disponibilizadas.",
                declaracao: "DECLARA, para fins de transparência pública, controle social e atendimento ao critério do Programa Nacional de Transparência Pública – PNTP, que as Contas Anuais de Gestão da Prefeitura Municipal de Lajes Pintadas/RN, referentes aos exercícios de 2023, 2024 e 2025 não foram objeto de julgamento específico da Câmara Municipal de Lajes Pintadas/RN, não existindo, até a presente data, acórdão, decisão, parecer ou outro ato de julgamento a ser publicado.",
                dataAtualizacao: "06/08/2026"
            }}
        />
    );
}
