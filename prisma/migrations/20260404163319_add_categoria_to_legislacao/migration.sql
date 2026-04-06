-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "perfil" TEXT NOT NULL DEFAULT 'editor',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Secretaria" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "servicos" TEXT NOT NULL DEFAULT '[]',
    "contato" TEXT,
    "telefone" TEXT,
    "email" TEXT,
    "endereco" TEXT,
    "secretario" TEXT,
    "imagem" TEXT,
    "horarioFuncionamento" TEXT,
    "ativa" BOOLEAN NOT NULL DEFAULT true,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Secretaria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Noticia" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "resumo" TEXT NOT NULL,
    "conteudo" TEXT NOT NULL,
    "imagem" TEXT,
    "publicada" BOOLEAN NOT NULL DEFAULT false,
    "destaque" BOOLEAN NOT NULL DEFAULT false,
    "publicadoEm" TIMESTAMP(3),
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,
    "secretariaId" TEXT,
    "tags" TEXT NOT NULL DEFAULT '[]',

    CONSTRAINT "Noticia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Licitacao" (
    "id" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,
    "modalidade" TEXT NOT NULL,
    "objeto" TEXT NOT NULL,
    "valor" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'aberta',
    "dataAbertura" TIMESTAMP(3),
    "dataEncerramento" TIMESTAMP(3),
    "secretaria" TEXT NOT NULL,
    "documentos" TEXT NOT NULL DEFAULT '[]',
    "resultado" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Licitacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contrato" (
    "id" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "objeto" TEXT NOT NULL,
    "fornecedor" TEXT NOT NULL,
    "cnpjFornecedor" TEXT,
    "valor" DOUBLE PRECISION NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3) NOT NULL,
    "secretaria" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'vigente',
    "documentos" TEXT NOT NULL DEFAULT '[]',
    "licitacaoId" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Contrato_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Convenio" (
    "id" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "objeto" TEXT NOT NULL,
    "concedente" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "contrapartida" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3) NOT NULL,
    "secretaria" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'vigente',
    "documentos" TEXT NOT NULL DEFAULT '[]',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Convenio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Diaria" (
    "id" TEXT NOT NULL,
    "servidor" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,
    "destino" TEXT NOT NULL,
    "motivo" TEXT NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3) NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "valorUnitario" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "quantidadeDias" INTEGER NOT NULL DEFAULT 1,
    "secretaria" TEXT NOT NULL,
    "mes" INTEGER NOT NULL,
    "ano" INTEGER NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Diaria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Servidor" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "matricula" TEXT,
    "cargo" TEXT NOT NULL,
    "vinculo" TEXT NOT NULL DEFAULT 'efetivo',
    "secretaria" TEXT NOT NULL,
    "salarioBase" DOUBLE PRECISION NOT NULL,
    "totalBruto" DOUBLE PRECISION NOT NULL,
    "totalLiquido" DOUBLE PRECISION NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "mes" INTEGER NOT NULL,
    "ano" INTEGER NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Servidor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Receita" (
    "id" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "fonte" TEXT,
    "valor" DOUBLE PRECISION NOT NULL,
    "mes" INTEGER NOT NULL,
    "ano" INTEGER NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Receita_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Despesa" (
    "id" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "secretaria" TEXT NOT NULL,
    "fornecedor" TEXT,
    "valor" DOUBLE PRECISION NOT NULL,
    "mes" INTEGER NOT NULL,
    "ano" INTEGER NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Despesa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Documento" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "arquivo" TEXT NOT NULL,
    "tamanho" INTEGER,
    "ano" INTEGER,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Documento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evento" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "local" TEXT,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3),
    "publico" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Evento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contato" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT,
    "assunto" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "respondido" BOOLEAN NOT NULL DEFAULT false,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Contato_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ouvidoria" (
    "id" TEXT NOT NULL,
    "protocolo" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "assunto" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "nome" TEXT,
    "email" TEXT,
    "anonimo" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'aberto',
    "resposta" TEXT,
    "respondidoEm" TIMESTAMP(3),
    "prazo" TIMESTAMP(3),
    "prorrogado" BOOLEAN NOT NULL DEFAULT false,
    "anexoResposta" TEXT,
    "recurso" TEXT,
    "dataRecurso" TIMESTAMP(3),
    "respostaRecurso" TEXT,
    "dataRespostaRecurso" TIMESTAMP(3),
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ouvidoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Esic" (
    "id" TEXT NOT NULL,
    "protocolo" TEXT NOT NULL,
    "orgao" TEXT NOT NULL,
    "pedido" TEXT NOT NULL,
    "nome" TEXT,
    "email" TEXT,
    "formaRetorno" TEXT NOT NULL DEFAULT 'sistema',
    "status" TEXT NOT NULL DEFAULT 'aberto',
    "grauSigilo" TEXT NOT NULL DEFAULT 'Sem Sigilo',
    "resposta" TEXT,
    "respondidoEm" TIMESTAMP(3),
    "prazo" TIMESTAMP(3),
    "prorrogado" BOOLEAN NOT NULL DEFAULT false,
    "anexoResposta" TEXT,
    "recurso" TEXT,
    "dataRecurso" TIMESTAMP(3),
    "respostaRecurso" TEXT,
    "dataRespostaRecurso" TIMESTAMP(3),
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cidadaoId" TEXT,

    CONSTRAINT "Esic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CidadaoEsic" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CidadaoEsic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GaleriaFoto" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "arquivo" TEXT NOT NULL,
    "album" TEXT,
    "publicada" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GaleriaFoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Obra" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "local" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'em-andamento',
    "dataInicio" TIMESTAMP(3),
    "previsaoTermino" TIMESTAMP(3),
    "empresa" TEXT,
    "percentual" INTEGER NOT NULL DEFAULT 0,
    "imagem" TEXT,
    "documentos" TEXT NOT NULL DEFAULT '[]',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Obra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FAQ" (
    "id" TEXT NOT NULL,
    "pergunta" TEXT NOT NULL,
    "resposta" TEXT NOT NULL,
    "categoria" TEXT,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FAQ_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Glossario" (
    "id" TEXT NOT NULL,
    "termo" TEXT NOT NULL,
    "definicao" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Glossario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Legislacao" (
    "id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "categoria" TEXT,
    "numero" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,
    "ementa" TEXT NOT NULL,
    "arquivo" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Legislacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnidadeAtendimento" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "telefone" TEXT,
    "horario" TEXT NOT NULL,
    "mapa" TEXT,
    "ativa" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UnidadeAtendimento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conselho" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "sigla" TEXT,
    "tipo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "composicao" TEXT NOT NULL,
    "presidente" TEXT,
    "email" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Conselho_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConselhoAta" (
    "id" TEXT NOT NULL,
    "conselhoId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "dataReuniao" TIMESTAMP(3) NOT NULL,
    "arquivo" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConselhoAta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImportacaoCSV" (
    "id" TEXT NOT NULL,
    "modulo" TEXT NOT NULL,
    "arquivo" TEXT NOT NULL,
    "total" INTEGER NOT NULL DEFAULT 0,
    "sucesso" INTEGER NOT NULL DEFAULT 0,
    "erros" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'pendente',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ImportacaoCSV_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LinkExterno" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "descricao" TEXT,
    "categoria" TEXT NOT NULL,
    "icone" TEXT NOT NULL DEFAULT 'FaLink',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "moduloAlvo" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LinkExterno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Configuracao" (
    "id" TEXT NOT NULL,
    "chave" TEXT NOT NULL,
    "valor" TEXT NOT NULL,
    "descricao" TEXT,
    "grupo" TEXT NOT NULL DEFAULT 'geral',
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Configuracao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medicamento" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'disponivel',
    "observacao" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Medicamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Veiculo" (
    "id" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "placa" TEXT NOT NULL,
    "ano" TEXT,
    "secretaria" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'em-uso',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Veiculo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmendaParlamentar" (
    "id" TEXT NOT NULL,
    "objeto" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "anoEmenda" INTEGER NOT NULL,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,
    "autorNome" TEXT NOT NULL,
    "codigoEmenda" TEXT NOT NULL,
    "convenioNumero" TEXT,
    "dataImportacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "favorecidoCnpjCpf" TEXT,
    "favorecidoNome" TEXT,
    "fonteDado" TEXT,
    "funcaoGoverno" TEXT,
    "instrumentoNumero" TEXT,
    "localidade" TEXT,
    "numeroEmenda" TEXT,
    "orgaoConcedente" TEXT,
    "planoAcaoNumero" TEXT,
    "situacaoExecucao" TEXT,
    "subfuncaoGoverno" TEXT,
    "tipoEmenda" TEXT,
    "uf" TEXT,
    "urlFonteOficial" TEXT,
    "valorEmpenhado" DOUBLE PRECISION DEFAULT 0,
    "valorLiquidado" DOUBLE PRECISION DEFAULT 0,
    "valorPago" DOUBLE PRECISION DEFAULT 0,
    "valorPrevisto" DOUBLE PRECISION DEFAULT 0,

    CONSTRAINT "EmendaParlamentar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Concurso" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'aberto',
    "vagas" TEXT,
    "dataPublicacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "linkEdital" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Concurso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServicoCarta" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "local" TEXT NOT NULL,
    "prazo" TEXT NOT NULL,
    "documentos" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServicoCarta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RelatorioFiscal" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "periodo" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,
    "arquivo" TEXT NOT NULL,
    "dataPublicacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RelatorioFiscal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Secretaria_slug_key" ON "Secretaria"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Noticia_slug_key" ON "Noticia"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Servidor_matricula_key" ON "Servidor"("matricula");

-- CreateIndex
CREATE UNIQUE INDEX "Ouvidoria_protocolo_key" ON "Ouvidoria"("protocolo");

-- CreateIndex
CREATE UNIQUE INDEX "Esic_protocolo_key" ON "Esic"("protocolo");

-- CreateIndex
CREATE UNIQUE INDEX "CidadaoEsic_cpf_key" ON "CidadaoEsic"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "CidadaoEsic_email_key" ON "CidadaoEsic"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Configuracao_chave_key" ON "Configuracao"("chave");

-- CreateIndex
CREATE UNIQUE INDEX "Veiculo_placa_key" ON "Veiculo"("placa");

-- CreateIndex
CREATE UNIQUE INDEX "EmendaParlamentar_codigoEmenda_key" ON "EmendaParlamentar"("codigoEmenda");

-- CreateIndex
CREATE UNIQUE INDEX "Concurso_slug_key" ON "Concurso"("slug");

-- AddForeignKey
ALTER TABLE "Noticia" ADD CONSTRAINT "Noticia_secretariaId_fkey" FOREIGN KEY ("secretariaId") REFERENCES "Secretaria"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contrato" ADD CONSTRAINT "Contrato_licitacaoId_fkey" FOREIGN KEY ("licitacaoId") REFERENCES "Licitacao"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Esic" ADD CONSTRAINT "Esic_cidadaoId_fkey" FOREIGN KEY ("cidadaoId") REFERENCES "CidadaoEsic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConselhoAta" ADD CONSTRAINT "ConselhoAta_conselhoId_fkey" FOREIGN KEY ("conselhoId") REFERENCES "Conselho"("id") ON DELETE CASCADE ON UPDATE CASCADE;
