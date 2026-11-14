import { prisma } from "@/lib/prisma";
import {
    CONFIG_CHAVE_ORIENTACOES,
    DEFAULT_ORIENTACOES_MEDICAMENTOS,
    sanitizeOrientacoesMedicamentos,
    type OrientacoesMedicamentosSUS,
} from "@/lib/assistencia-farmaceutica";

/**
 * Busca no banco de dados (tabela Configuracao) as orientações configuradas
 * pelo Admin para obtenção de medicamentos básicos (CBAF), de alto custo (CEAF)
 * e estratégicos (CESAF). Retorna o modelo padrão municipal caso ainda não tenha
 * sido personalizado no painel administrativo.
 */
export async function getOrientacoesMedicamentosFromDb(): Promise<OrientacoesMedicamentosSUS> {
    try {
        const config = await prisma.configuracao.findUnique({
            where: { chave: CONFIG_CHAVE_ORIENTACOES },
        });
        if (!config?.valor) {
            return DEFAULT_ORIENTACOES_MEDICAMENTOS;
        }
        const parsed = JSON.parse(config.valor);
        const sanitized = sanitizeOrientacoesMedicamentos(parsed);
        return {
            ...sanitized,
            atualizadoEm: sanitized.atualizadoEm || config.atualizadoEm.toISOString(),
        };
    } catch (error) {
        console.error("Erro ao carregar orientações da assistência farmacêutica:", error);
        return DEFAULT_ORIENTACOES_MEDICAMENTOS;
    }
}
