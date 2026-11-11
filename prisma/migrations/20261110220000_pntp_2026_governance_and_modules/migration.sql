-- Migration: 20261110220000_pntp_2026_governance_and_modules
-- Non-destructive evolution for PNTP 2026 Executive Municipal requirements

-- 1. Usuario RBAC & Secretarias Autorizadas
ALTER TABLE "Usuario" ADD COLUMN IF NOT EXISTS "secretariasAutorizadas" TEXT NOT NULL DEFAULT '[]';
ALTER TABLE "Usuario" ADD COLUMN IF NOT EXISTS "cargo" TEXT;

-- 2. Secretaria Governance & Norms
ALTER TABLE "Secretaria" ADD COLUMN IF NOT EXISTS "normaCriacao" TEXT;
ALTER TABLE "Secretaria" ADD COLUMN IF NOT EXISTS "atoNomeacaoSecretario" TEXT;
ALTER TABLE "Secretaria" ADD COLUMN IF NOT EXISTS "dataUltimaConferencia" TIMESTAMP(3);
ALTER TABLE "Secretaria" ADD COLUMN IF NOT EXISTS "conferidoPor" TEXT;
ALTER TABLE "Secretaria" ADD COLUMN IF NOT EXISTS "situacaoPublicacao" TEXT NOT NULL DEFAULT 'publicado';

-- 3. Licitacao Structured Fields
ALTER TABLE "Licitacao" ADD COLUMN IF NOT EXISTS "codigoPermanente" TEXT UNIQUE;
ALTER TABLE "Licitacao" ADD COLUMN IF NOT EXISTS "numeroProcesso" TEXT;
ALTER TABLE "Licitacao" ADD COLUMN IF NOT EXISTS "valorEstimado" DOUBLE PRECISION;
ALTER TABLE "Licitacao" ADD COLUMN IF NOT EXISTS "valorHomologado" DOUBLE PRECISION;
ALTER TABLE "Licitacao" ADD COLUMN IF NOT EXISTS "dataPublicacao" TIMESTAMP(3);
ALTER TABLE "Licitacao" ADD COLUMN IF NOT EXISTS "dataHomologacao" TIMESTAMP(3);
ALTER TABLE "Licitacao" ADD COLUMN IF NOT EXISTS "unidadeResponsavel" TEXT;
ALTER TABLE "Licitacao" ADD COLUMN IF NOT EXISTS "amparoLegal" TEXT;
ALTER TABLE "Licitacao" ADD COLUMN IF NOT EXISTS "editalUrl" TEXT;
ALTER TABLE "Licitacao" ADD COLUMN IF NOT EXISTS "fasesDocumentos" TEXT NOT NULL DEFAULT '[]';
ALTER TABLE "Licitacao" ADD COLUMN IF NOT EXISTS "ataRegistroPreco" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Licitacao" ADD COLUMN IF NOT EXISTS "adesaoArp" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Licitacao" ADD COLUMN IF NOT EXISTS "fonteOrigem" TEXT DEFAULT 'Sistema de Compras Municipal / PNCP';
ALTER TABLE "Licitacao" ADD COLUMN IF NOT EXISTS "responsavelCadastro" TEXT;
ALTER TABLE "Licitacao" ADD COLUMN IF NOT EXISTS "responsavelRevisao" TEXT;
ALTER TABLE "Licitacao" ADD COLUMN IF NOT EXISTS "dataAtualizacaoEfetiva" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Licitacao" ADD COLUMN IF NOT EXISTS "dataUltimaConferencia" TIMESTAMP(3);
ALTER TABLE "Licitacao" ADD COLUMN IF NOT EXISTS "situacaoPublicacao" TEXT NOT NULL DEFAULT 'publicado';
ALTER TABLE "Licitacao" ADD COLUMN IF NOT EXISTS "criterioPntp" TEXT DEFAULT '8.1';
ALTER TABLE "Licitacao" ADD COLUMN IF NOT EXISTS "versao" INTEGER NOT NULL DEFAULT 1;

-- 4. Contrato Structured Fields
ALTER TABLE "Contrato" ADD COLUMN IF NOT EXISTS "codigoPermanente" TEXT UNIQUE;
ALTER TABLE "Contrato" ADD COLUMN IF NOT EXISTS "ano" INTEGER;
ALTER TABLE "Contrato" ADD COLUMN IF NOT EXISTS "modalidadeOrigem" TEXT;
ALTER TABLE "Contrato" ADD COLUMN IF NOT EXISTS "dataAssinatura" TIMESTAMP(3);
ALTER TABLE "Contrato" ADD COLUMN IF NOT EXISTS "unidadeResponsavel" TEXT;
ALTER TABLE "Contrato" ADD COLUMN IF NOT EXISTS "instrumentoIntegralUrl" TEXT;
ALTER TABLE "Contrato" ADD COLUMN IF NOT EXISTS "aditivos" TEXT NOT NULL DEFAULT '[]';
ALTER TABLE "Contrato" ADD COLUMN IF NOT EXISTS "fiscais" TEXT NOT NULL DEFAULT '[]';
ALTER TABLE "Contrato" ADD COLUMN IF NOT EXISTS "justificativaOrdemCronologica" TEXT;
ALTER TABLE "Contrato" ADD COLUMN IF NOT EXISTS "fonteOrigem" TEXT DEFAULT 'Gestão de Contratos / PNCP';
ALTER TABLE "Contrato" ADD COLUMN IF NOT EXISTS "responsavelCadastro" TEXT;
ALTER TABLE "Contrato" ADD COLUMN IF NOT EXISTS "responsavelRevisao" TEXT;
ALTER TABLE "Contrato" ADD COLUMN IF NOT EXISTS "dataAtualizacaoEfetiva" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Contrato" ADD COLUMN IF NOT EXISTS "dataUltimaConferencia" TIMESTAMP(3);
ALTER TABLE "Contrato" ADD COLUMN IF NOT EXISTS "situacaoPublicacao" TEXT NOT NULL DEFAULT 'publicado';
ALTER TABLE "Contrato" ADD COLUMN IF NOT EXISTS "criterioPntp" TEXT DEFAULT '9.1';
ALTER TABLE "Contrato" ADD COLUMN IF NOT EXISTS "versao" INTEGER NOT NULL DEFAULT 1;

-- 5. Convenio Structured Fields
ALTER TABLE "Convenio" ADD COLUMN IF NOT EXISTS "codigoPermanente" TEXT UNIQUE;
ALTER TABLE "Convenio" ADD COLUMN IF NOT EXISTS "ano" INTEGER;
ALTER TABLE "Convenio" ADD COLUMN IF NOT EXISTS "tipoConvenio" TEXT NOT NULL DEFAULT 'recebido';
ALTER TABLE "Convenio" ADD COLUMN IF NOT EXISTS "beneficiario" TEXT;
ALTER TABLE "Convenio" ADD COLUMN IF NOT EXISTS "cnpjParticipe" TEXT;
ALTER TABLE "Convenio" ADD COLUMN IF NOT EXISTS "valorLiberado" DOUBLE PRECISION DEFAULT 0;
ALTER TABLE "Convenio" ADD COLUMN IF NOT EXISTS "obrigacoes" TEXT;
ALTER TABLE "Convenio" ADD COLUMN IF NOT EXISTS "arquivoInteiroTeor" TEXT;
ALTER TABLE "Convenio" ADD COLUMN IF NOT EXISTS "fonteOrigem" TEXT DEFAULT 'Transferegov / SICONV / Controle Municipal';
ALTER TABLE "Convenio" ADD COLUMN IF NOT EXISTS "responsavelCadastro" TEXT;
ALTER TABLE "Convenio" ADD COLUMN IF NOT EXISTS "responsavelRevisao" TEXT;
ALTER TABLE "Convenio" ADD COLUMN IF NOT EXISTS "dataAtualizacaoEfetiva" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Convenio" ADD COLUMN IF NOT EXISTS "dataUltimaConferencia" TIMESTAMP(3);
ALTER TABLE "Convenio" ADD COLUMN IF NOT EXISTS "situacaoPublicacao" TEXT NOT NULL DEFAULT 'publicado';
ALTER TABLE "Convenio" ADD COLUMN IF NOT EXISTS "criterioPntp" TEXT DEFAULT '5.1';

-- 6. Diaria & Servidor Structured Fields
ALTER TABLE "Diaria" ADD COLUMN IF NOT EXISTS "codigoPermanente" TEXT UNIQUE;
ALTER TABLE "Diaria" ADD COLUMN IF NOT EXISTS "matricula" TEXT;
ALTER TABLE "Diaria" ADD COLUMN IF NOT EXISTS "tipoDestino" TEXT DEFAULT 'estadual';
ALTER TABLE "Diaria" ADD COLUMN IF NOT EXISTS "numeroPortaria" TEXT;
ALTER TABLE "Diaria" ADD COLUMN IF NOT EXISTS "relatorioViagemUrl" TEXT;
ALTER TABLE "Diaria" ADD COLUMN IF NOT EXISTS "fonteOrigem" TEXT DEFAULT 'Sistema de Recursos Humanos / Contabilidade';
ALTER TABLE "Diaria" ADD COLUMN IF NOT EXISTS "responsavelCadastro" TEXT;
ALTER TABLE "Diaria" ADD COLUMN IF NOT EXISTS "responsavelRevisao" TEXT;
ALTER TABLE "Diaria" ADD COLUMN IF NOT EXISTS "dataAtualizacaoEfetiva" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Diaria" ADD COLUMN IF NOT EXISTS "dataUltimaConferencia" TIMESTAMP(3);
ALTER TABLE "Diaria" ADD COLUMN IF NOT EXISTS "situacaoPublicacao" TEXT NOT NULL DEFAULT 'publicado';
ALTER TABLE "Diaria" ADD COLUMN IF NOT EXISTS "criterioPntp" TEXT DEFAULT '7.1';

ALTER TABLE "Servidor" ADD COLUMN IF NOT EXISTS "cpfAnonimizado" TEXT;
ALTER TABLE "Servidor" ADD COLUMN IF NOT EXISTS "lotacao" TEXT;
ALTER TABLE "Servidor" ADD COLUMN IF NOT EXISTS "cargaHorariaSemanal" INTEGER DEFAULT 40;
ALTER TABLE "Servidor" ADD COLUMN IF NOT EXISTS "dataAdmissao" TIMESTAMP(3);
ALTER TABLE "Servidor" ADD COLUMN IF NOT EXISTS "padraoRemuneratorio" TEXT;
ALTER TABLE "Servidor" ADD COLUMN IF NOT EXISTS "vantagens" DOUBLE PRECISION DEFAULT 0;
ALTER TABLE "Servidor" ADD COLUMN IF NOT EXISTS "descontos" DOUBLE PRECISION DEFAULT 0;
ALTER TABLE "Servidor" ADD COLUMN IF NOT EXISTS "fonteOrigem" TEXT DEFAULT 'Sistema de Folha de Pagamento';
ALTER TABLE "Servidor" ADD COLUMN IF NOT EXISTS "dataAtualizacaoEfetiva" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Servidor" ADD COLUMN IF NOT EXISTS "dataUltimaConferencia" TIMESTAMP(3);
ALTER TABLE "Servidor" ADD COLUMN IF NOT EXISTS "situacaoPublicacao" TEXT NOT NULL DEFAULT 'publicado';

-- 7. Receita & Despesa Structured Fields
ALTER TABLE "Receita" ADD COLUMN IF NOT EXISTS "codigoPermanente" TEXT UNIQUE;
ALTER TABLE "Receita" ADD COLUMN IF NOT EXISTS "naturezaCodigo" TEXT;
ALTER TABLE "Receita" ADD COLUMN IF NOT EXISTS "orgao" TEXT DEFAULT 'Prefeitura Municipal de Lajes Pintadas';
ALTER TABLE "Receita" ADD COLUMN IF NOT EXISTS "unidade" TEXT;
ALTER TABLE "Receita" ADD COLUMN IF NOT EXISTS "valorPrevisto" DOUBLE PRECISION;
ALTER TABLE "Receita" ADD COLUMN IF NOT EXISTS "valorAtualizado" DOUBLE PRECISION;
ALTER TABLE "Receita" ADD COLUMN IF NOT EXISTS "valorLancado" DOUBLE PRECISION;
ALTER TABLE "Receita" ADD COLUMN IF NOT EXISTS "valorArrecadado" DOUBLE PRECISION;
ALTER TABLE "Receita" ADD COLUMN IF NOT EXISTS "fonteOrigem" TEXT DEFAULT 'Sistema Contábil / SICONFI';
ALTER TABLE "Receita" ADD COLUMN IF NOT EXISTS "responsavelCadastro" TEXT;
ALTER TABLE "Receita" ADD COLUMN IF NOT EXISTS "responsavelRevisao" TEXT;
ALTER TABLE "Receita" ADD COLUMN IF NOT EXISTS "dataAtualizacaoEfetiva" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Receita" ADD COLUMN IF NOT EXISTS "dataUltimaConferencia" TIMESTAMP(3);
ALTER TABLE "Receita" ADD COLUMN IF NOT EXISTS "situacaoPublicacao" TEXT NOT NULL DEFAULT 'publicado';
ALTER TABLE "Receita" ADD COLUMN IF NOT EXISTS "criterioPntp" TEXT DEFAULT '3.1';

ALTER TABLE "Despesa" ADD COLUMN IF NOT EXISTS "codigoPermanente" TEXT UNIQUE;
ALTER TABLE "Despesa" ADD COLUMN IF NOT EXISTS "numeroEmpenho" TEXT;
ALTER TABLE "Despesa" ADD COLUMN IF NOT EXISTS "dataEmpenho" TIMESTAMP(3);
ALTER TABLE "Despesa" ADD COLUMN IF NOT EXISTS "orgao" TEXT DEFAULT 'Prefeitura Municipal de Lajes Pintadas';
ALTER TABLE "Despesa" ADD COLUMN IF NOT EXISTS "unidade" TEXT;
ALTER TABLE "Despesa" ADD COLUMN IF NOT EXISTS "credorCpfCnpj" TEXT;
ALTER TABLE "Despesa" ADD COLUMN IF NOT EXISTS "classificacaoOrcamentaria" TEXT;
ALTER TABLE "Despesa" ADD COLUMN IF NOT EXISTS "funcao" TEXT;
ALTER TABLE "Despesa" ADD COLUMN IF NOT EXISTS "subfuncao" TEXT;
ALTER TABLE "Despesa" ADD COLUMN IF NOT EXISTS "programa" TEXT;
ALTER TABLE "Despesa" ADD COLUMN IF NOT EXISTS "elementoDespesa" TEXT;
ALTER TABLE "Despesa" ADD COLUMN IF NOT EXISTS "fonteRecurso" TEXT;
ALTER TABLE "Despesa" ADD COLUMN IF NOT EXISTS "valorEmpenhado" DOUBLE PRECISION;
ALTER TABLE "Despesa" ADD COLUMN IF NOT EXISTS "valorLiquidado" DOUBLE PRECISION;
ALTER TABLE "Despesa" ADD COLUMN IF NOT EXISTS "valorPago" DOUBLE PRECISION;
ALTER TABLE "Despesa" ADD COLUMN IF NOT EXISTS "modalidadeLicitacao" TEXT;
ALTER TABLE "Despesa" ADD COLUMN IF NOT EXISTS "numeroProcessoLicitatorio" TEXT;
ALTER TABLE "Despesa" ADD COLUMN IF NOT EXISTS "licitacaoId" TEXT;
ALTER TABLE "Despesa" ADD COLUMN IF NOT EXISTS "contratoId" TEXT;
ALTER TABLE "Despesa" ADD COLUMN IF NOT EXISTS "fonteOrigem" TEXT DEFAULT 'Sistema Contábil / SICONFI';
ALTER TABLE "Despesa" ADD COLUMN IF NOT EXISTS "responsavelCadastro" TEXT;
ALTER TABLE "Despesa" ADD COLUMN IF NOT EXISTS "responsavelRevisao" TEXT;
ALTER TABLE "Despesa" ADD COLUMN IF NOT EXISTS "dataAtualizacaoEfetiva" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Despesa" ADD COLUMN IF NOT EXISTS "dataUltimaConferencia" TIMESTAMP(3);
ALTER TABLE "Despesa" ADD COLUMN IF NOT EXISTS "situacaoPublicacao" TEXT NOT NULL DEFAULT 'publicado';
ALTER TABLE "Despesa" ADD COLUMN IF NOT EXISTS "criterioPntp" TEXT DEFAULT '4.1';

-- 8. Documento, Obra, Legislacao, Medicamento, Esic, Ouvidoria
ALTER TABLE "Documento" ADD COLUMN IF NOT EXISTS "codigoPermanente" TEXT UNIQUE;
ALTER TABLE "Documento" ADD COLUMN IF NOT EXISTS "descricao" TEXT;
ALTER TABLE "Documento" ADD COLUMN IF NOT EXISTS "orgaoResponsavel" TEXT;
ALTER TABLE "Documento" ADD COLUMN IF NOT EXISTS "secretaria" TEXT;
ALTER TABLE "Documento" ADD COLUMN IF NOT EXISTS "arquivoEditavelUrl" TEXT;
ALTER TABLE "Documento" ADD COLUMN IF NOT EXISTS "competencia" TEXT;
ALTER TABLE "Documento" ADD COLUMN IF NOT EXISTS "pesquisavelOcr" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Documento" ADD COLUMN IF NOT EXISTS "acessoRestrito" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Documento" ADD COLUMN IF NOT EXISTS "versao" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "Documento" ADD COLUMN IF NOT EXISTS "documentoAnteriorId" TEXT;
ALTER TABLE "Documento" ADD COLUMN IF NOT EXISTS "criterioPntp" TEXT;
ALTER TABLE "Documento" ADD COLUMN IF NOT EXISTS "situacaoPublicacao" TEXT NOT NULL DEFAULT 'publicado';
ALTER TABLE "Documento" ADD COLUMN IF NOT EXISTS "responsavelCadastro" TEXT;
ALTER TABLE "Documento" ADD COLUMN IF NOT EXISTS "responsavelRevisao" TEXT;
ALTER TABLE "Documento" ADD COLUMN IF NOT EXISTS "dataAtualizacaoEfetiva" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Documento" ADD COLUMN IF NOT EXISTS "dataUltimaConferencia" TIMESTAMP(3);

ALTER TABLE "Obra" ADD COLUMN IF NOT EXISTS "codigoPermanente" TEXT UNIQUE;
ALTER TABLE "Obra" ADD COLUMN IF NOT EXISTS "secretaria" TEXT DEFAULT 'Secretaria de Obras e Infraestrutura';
ALTER TABLE "Obra" ADD COLUMN IF NOT EXISTS "numeroContrato" TEXT;
ALTER TABLE "Obra" ADD COLUMN IF NOT EXISTS "contratoId" TEXT;
ALTER TABLE "Obra" ADD COLUMN IF NOT EXISTS "valorPago" DOUBLE PRECISION DEFAULT 0;
ALTER TABLE "Obra" ADD COLUMN IF NOT EXISTS "cnpjEmpresa" TEXT;
ALTER TABLE "Obra" ADD COLUMN IF NOT EXISTS "quantitativosContratados" TEXT NOT NULL DEFAULT '[]';
ALTER TABLE "Obra" ADD COLUMN IF NOT EXISTS "medicoes" TEXT NOT NULL DEFAULT '[]';
ALTER TABLE "Obra" ADD COLUMN IF NOT EXISTS "motivoParalisacao" TEXT;
ALTER TABLE "Obra" ADD COLUMN IF NOT EXISTS "responsavelParalisacao" TEXT;
ALTER TABLE "Obra" ADD COLUMN IF NOT EXISTS "previsaoReinicio" TIMESTAMP(3);
ALTER TABLE "Obra" ADD COLUMN IF NOT EXISTS "fonteOrigem" TEXT DEFAULT 'Secretaria de Obras / Engenharia';
ALTER TABLE "Obra" ADD COLUMN IF NOT EXISTS "responsavelCadastro" TEXT;
ALTER TABLE "Obra" ADD COLUMN IF NOT EXISTS "responsavelRevisao" TEXT;
ALTER TABLE "Obra" ADD COLUMN IF NOT EXISTS "dataAtualizacaoEfetiva" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Obra" ADD COLUMN IF NOT EXISTS "dataUltimaConferencia" TIMESTAMP(3);
ALTER TABLE "Obra" ADD COLUMN IF NOT EXISTS "situacaoPublicacao" TEXT NOT NULL DEFAULT 'publicado';
ALTER TABLE "Obra" ADD COLUMN IF NOT EXISTS "criterioPntp" TEXT DEFAULT '10.1';

ALTER TABLE "Medicamento" ADD COLUMN IF NOT EXISTS "principioAtivo" TEXT;
ALTER TABLE "Medicamento" ADD COLUMN IF NOT EXISTS "apresentacao" TEXT DEFAULT 'Comprimido / Frasco';
ALTER TABLE "Medicamento" ADD COLUMN IF NOT EXISTS "unidadeMedida" TEXT DEFAULT 'Unidade';
ALTER TABLE "Medicamento" ADD COLUMN IF NOT EXISTS "tipoComponente" TEXT DEFAULT 'Básico (CBAF)';
ALTER TABLE "Medicamento" ADD COLUMN IF NOT EXISTS "quantidadeEstoque" INTEGER DEFAULT 0;
ALTER TABLE "Medicamento" ADD COLUMN IF NOT EXISTS "estoqueMinimo" INTEGER DEFAULT 10;
ALTER TABLE "Medicamento" ADD COLUMN IF NOT EXISTS "unidadeSaude" TEXT DEFAULT 'CAF / Farmácia Básica Municipal';
ALTER TABLE "Medicamento" ADD COLUMN IF NOT EXISTS "loteValidade" TEXT;
ALTER TABLE "Medicamento" ADD COLUMN IF NOT EXISTS "dataReferenciaEstoque" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Medicamento" ADD COLUMN IF NOT EXISTS "situacaoPublicacao" TEXT NOT NULL DEFAULT 'publicado';

ALTER TABLE "Esic" ADD COLUMN IF NOT EXISTS "codigoVerificacao" TEXT;
ALTER TABLE "Esic" ADD COLUMN IF NOT EXISTS "fundamentoSigilo" TEXT;
ALTER TABLE "Esic" ADD COLUMN IF NOT EXISTS "autoridadeClassificadora" TEXT;
ALTER TABLE "Esic" ADD COLUMN IF NOT EXISTS "dataClassificacao" TIMESTAMP(3);
ALTER TABLE "Esic" ADD COLUMN IF NOT EXISTS "dataDesclassificacao" TIMESTAMP(3);
ALTER TABLE "Esic" ADD COLUMN IF NOT EXISTS "justificativaProrrogacao" TEXT;
ALTER TABLE "Esic" ADD COLUMN IF NOT EXISTS "recursoSegundaInstancia" TEXT;
ALTER TABLE "Esic" ADD COLUMN IF NOT EXISTS "dataRecursoSegunda" TIMESTAMP(3);
ALTER TABLE "Esic" ADD COLUMN IF NOT EXISTS "respostaRecursoSegunda" TEXT;
ALTER TABLE "Esic" ADD COLUMN IF NOT EXISTS "dataRespostaSegunda" TIMESTAMP(3);
ALTER TABLE "Esic" ADD COLUMN IF NOT EXISTS "historicoTramitacao" TEXT NOT NULL DEFAULT '[]';

-- 9. New Governance & PNTP Tables
CREATE TABLE IF NOT EXISTS "TabelaDiaria" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "cargo" TEXT NOT NULL,
  "valorEstadual" DOUBLE PRECISION NOT NULL,
  "valorDemaisCidades" DOUBLE PRECISION NOT NULL,
  "valorOutrosEstados" DOUBLE PRECISION NOT NULL,
  "valorCapitalFederal" DOUBLE PRECISION NOT NULL,
  "valorInternacional" DOUBLE PRECISION,
  "normaLegal" TEXT NOT NULL,
  "vigenciaInicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "vigenciaFim" TIMESTAMP(3),
  "versao" INTEGER NOT NULL DEFAULT 1,
  "ativo" BOOLEAN NOT NULL DEFAULT true,
  "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "atualizadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "FilaEsperaCreche" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "protocoloAnonimizado" TEXT NOT NULL UNIQUE,
  "iniciaisCrianca" TEXT NOT NULL,
  "dataNascimentoMesAno" TEXT NOT NULL,
  "unidadeEscolar" TEXT NOT NULL,
  "turmaEtapa" TEXT NOT NULL,
  "criterioPrioridade" TEXT NOT NULL,
  "posicaoFila" INTEGER NOT NULL,
  "dataInscricao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "status" TEXT NOT NULL DEFAULT 'aguardando',
  "ano" INTEGER NOT NULL,
  "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "atualizadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "DeclaracaoTransparencia" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "modulo" TEXT NOT NULL,
  "criterioPntp" TEXT,
  "orgaoResponsavel" TEXT NOT NULL,
  "exercicio" INTEGER NOT NULL,
  "competencia" TEXT,
  "tipoSituacao" TEXT NOT NULL DEFAULT 'nao_ocorrencia_declarada',
  "textoDeclaracao" TEXT NOT NULL,
  "fundamentoLegal" TEXT,
  "responsavelNome" TEXT NOT NULL,
  "responsavelCargo" TEXT,
  "arquivoAssinadoUrl" TEXT,
  "dataEmissao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "dataConferencia" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "situacaoPublicacao" TEXT NOT NULL DEFAULT 'publicado',
  "ativa" BOOLEAN NOT NULL DEFAULT true,
  "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "atualizadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "HistoricoAlteracao" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "entidade" TEXT NOT NULL,
  "entidadeId" TEXT NOT NULL,
  "acao" TEXT NOT NULL,
  "dadosAnteriores" TEXT,
  "dadosNovos" TEXT,
  "resumoAlteracao" TEXT NOT NULL,
  "isConferenciaSemAlteracao" BOOLEAN NOT NULL DEFAULT false,
  "usuarioId" TEXT,
  "usuarioNome" TEXT NOT NULL,
  "usuarioPerfil" TEXT NOT NULL,
  "secretaria" TEXT,
  "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "CriterioPNTP" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "codigo" TEXT NOT NULL UNIQUE,
  "dimensao" TEXT NOT NULL,
  "titulo" TEXT NOT NULL,
  "textoIntegral" TEXT NOT NULL,
  "classificacao" TEXT NOT NULL,
  "peso" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
  "periodicidadeDias" INTEGER NOT NULL DEFAULT 30,
  "exigenciasCartilha" TEXT NOT NULL,
  "referenciaCartilha" TEXT,
  "paginaPublica" TEXT NOT NULL,
  "telaAdministrativa" TEXT NOT NULL,
  "secretariaResponsavel" TEXT NOT NULL,
  "statusFuncionalidade" TEXT NOT NULL DEFAULT 'implementada',
  "statusConteudo" TEXT NOT NULL DEFAULT 'publicado',
  "statusEvidencia" TEXT NOT NULL DEFAULT 'conferida',
  "statusValidacao" TEXT NOT NULL DEFAULT 'validado',
  "resultadoAvaliacaoExterna" TEXT DEFAULT 'Atendido na Ficha Histórica',
  "pendenciasTecnicas" TEXT,
  "pendenciasConteudo" TEXT,
  "evidenciaUrl" TEXT,
  "dataUltimaVerificacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "verificadoPor" TEXT DEFAULT 'Controladoria Geral do Município',
  "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "atualizadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

