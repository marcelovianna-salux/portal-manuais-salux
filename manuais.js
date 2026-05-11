/* =========================================================
   CATÁLOGO DE MANUAIS - SALUX
   =========================================================
   IMPORTANTE: Este arquivo substitui o antigo manuais.json
   (mudança feita para permitir abrir o site direto do disco
   com duplo clique, sem precisar de servidor web).

   Para adicionar um novo manual, basta incluir um item no
   array "manuais" abaixo, seguindo o mesmo padrão dos
   exemplos. Não esqueça da vírgula entre os itens.

   Após editar, salve o arquivo e recarregue o navegador
   (F5). O hub atualiza automaticamente os filtros, contagens
   e agrupamentos com base nos dados aqui.
   ========================================================= */

window.MANUAIS_CATALOG = {

	"_versao_catalogo": "1.0",
	"_atualizado_em": "08/05/2026",

	"manuais": [

		{
			"id": "gestao-glosas",
			"titulo": "Gestão de Glosas",
			"descricao": "Módulo completo de análise e gerenciamento de pagamentos do convênio, incluindo cadastro de demonstrativo, sinaleira, motivos de glosa, conciliação de contas e encerramento.",
			"modulo": "Gestão de Glosas",
			"categoria": "Movimentação",
			"telas": ["GGCA001_T", "GGCA002_T", "FCCA010_T", "GGMV001_T", "GGMV003_T", "GGMV005_T", "GGMV006_T", "GGMV007_T"],
			"tags": ["glosa", "demonstrativo", "convênio", "sinaleira", "conciliação", "recurso", "ANS", "TISS"],
			"url": "modulos/gestao-glosas/index.html",
			"data_publicacao": "2019-09-05",
			"versao": "1.0",
			"autor": "Equipe Salux",
			"tem_video": true,
			"icone": "fas fa-coins"
		},

		{
			"id": "prescricoes-documentos-obrigatorios",
			"titulo": "Configuração de Prescrições x Documentos Obrigatórios",
			"descricao": "Configuração de procedimentos que exigem documento obrigatório no momento da prescrição (ex.: Termo de Consentimento), com vínculo de modelo de documento por Hospital, Unidade e Tipo.",
			"modulo": "Gerador de Documentos",
			"categoria": "Vínculo",
			"telas": ["EDOV014_T", "CFPQ003_T"],
			"tags": ["prescrição", "documento obrigatório", "consentimento", "modelo", "obrigatoriedade", "compliance"],
			"url": "modulos/gerador-documentos/prescricoes-documentos-obrigatorios/index.html",
			"data_publicacao": "2026-05-08",
			"versao": "1.0",
			"autor": "Carlos Eduardo do Bomfim Brito",
			"tem_video": true,
			"icone": "fas fa-file-medical"
		}

	]
};
