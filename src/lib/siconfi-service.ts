/**
 * Serviço de Integração com o SICONFI (Tesouro Nacional)
 * Lajes Pintadas | Código IBGE: 2406306
 */

const BASE_URL = "https://apidatalake.tesouro.gov.br/ords/siconfi/tt";
const IBGE_LAJES = "2406306";

export interface SiconfiRequest {
    an_exercicio: number;
    periodo: number;
    nr_anexo: string;
}

export async function getRREOSiconfi({ an_exercicio, periodo, nr_anexo }: SiconfiRequest) {
    const url = `${BASE_URL}/rreo?an_exercicio=${an_exercicio}&id_ente=${IBGE_LAJES}&periodo=${periodo}&nr_anexo=${nr_anexo}`;
    
    try {
        const response = await fetch(url, {
            next: { revalidate: 86400 } // Cache de 24 horas para relatórios fiscais
        });
        
        if (!response.ok) {
            throw new Error(`Erro Siconfi: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data.items || [];
    } catch (error) {
        console.error("Falha ao buscar RREO no Siconfi:", error);
        return [];
    }
}

export async function getRGFSiconfi({ an_exercicio, periodo, nr_anexo }: SiconfiRequest) {
    const url = `${BASE_URL}/rgf?an_exercicio=${an_exercicio}&id_ente=${IBGE_LAJES}&periodo=${periodo}&nr_anexo=${nr_anexo}`;
    
    try {
        const response = await fetch(url, {
            next: { revalidate: 86400 }
        });
        
        if (!response.ok) {
            throw new Error(`Erro Siconfi: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data.items || [];
    } catch (error) {
        console.error("Falha ao buscar RGF no Siconfi:", error);
        return [];
    }
}
