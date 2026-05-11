/* =========================================================
   HUB DE MANUAIS - SALUX
   Carrega manuais.json, renderiza cards, busca e filtros
   ========================================================= */

(function () {
	'use strict';

	// Estado global
	const state = {
		manuais: [],
		filtros: {
			busca: '',
			modulo: '*',
			categoria: '*',
			video: null
		},
		catalogVersion: '',
		catalogUpdated: ''
	};

	// =====================================================
	// CARREGAMENTO DO CATÁLOGO
	// O catálogo é carregado via <script src="manuais.js"> no
	// index.html, que define window.MANUAIS_CATALOG. Essa
	// abordagem evita o erro de CORS quando o site é aberto
	// direto do disco (file://) com duplo clique.
	// =====================================================
	function carregarCatalogo() {
		try {
			const data = window.MANUAIS_CATALOG;
			if (!data) {
				throw new Error('Catálogo não encontrado. Verifique se o arquivo manuais.js está presente e foi carregado antes do hub.js no index.html.');
			}
			state.manuais = data.manuais || [];
			state.catalogVersion = data._versao_catalogo || '';
			state.catalogUpdated = data._atualizado_em || '';
			inicializar();
		} catch (err) {
			console.error(err);
			exibirErroCatalogo(err.message);
		}
	}

	function exibirErroCatalogo(msg) {
		document.getElementById('manuaisGrid').innerHTML =
			'<div class="col-12"><div class="alert alert-warning" role="alert">' +
			'<h5 class="alert-heading"><i class="fas fa-exclamation-triangle"></i> Não foi possível carregar o catálogo</h5>' +
			'<p>' + escapeHtml(msg) + '</p>' +
			'</div></div>';
	}

	// =====================================================
	// INICIALIZAÇÃO
	// =====================================================
	function inicializar() {
		// Atualizar info de versão no rodapé
		document.getElementById('catalogVersion').textContent = state.catalogVersion;
		document.getElementById('catalogUpdated').textContent = state.catalogUpdated;
		document.getElementById('totalManuais').textContent = state.manuais.length;

		construirFiltrosLaterais();
		bindEventos();
		renderizar();
	}

	// =====================================================
	// FILTROS LATERAIS DINÂMICOS
	// =====================================================
	function construirFiltrosLaterais() {
		// Módulos únicos (com contagem)
		const modulos = {};
		const categorias = {};
		let comVideo = 0;

		state.manuais.forEach(m => {
			modulos[m.modulo] = (modulos[m.modulo] || 0) + 1;
			categorias[m.categoria] = (categorias[m.categoria] || 0) + 1;
			if (m.tem_video) comVideo++;
		});

		// Módulos
		const filterModulos = document.getElementById('filterModulos');
		document.getElementById('countModulosAll').textContent = state.manuais.length;
		Object.keys(modulos).sort().forEach(nome => {
			const li = document.createElement('li');
			li.className = 'hub-filter-item';
			li.dataset.filterType = 'modulo';
			li.dataset.filterValue = nome;
			li.innerHTML = '<span><i class="fas fa-cube"></i> ' + escapeHtml(nome) + '</span>' +
				'<span class="hub-filter-count">' + modulos[nome] + '</span>';
			filterModulos.appendChild(li);
		});

		// Categorias
		const filterCategorias = document.getElementById('filterCategorias');
		document.getElementById('countCategoriasAll').textContent = state.manuais.length;
		Object.keys(categorias).sort().forEach(nome => {
			const li = document.createElement('li');
			li.className = 'hub-filter-item';
			li.dataset.filterType = 'categoria';
			li.dataset.filterValue = nome;
			li.innerHTML = '<span><i class="fas fa-tag"></i> ' + escapeHtml(nome) + '</span>' +
				'<span class="hub-filter-count">' + categorias[nome] + '</span>';
			filterCategorias.appendChild(li);
		});

		document.getElementById('countComVideo').textContent = comVideo;
	}

	// =====================================================
	// EVENTOS
	// =====================================================
	function bindEventos() {
		const searchInput = document.getElementById('searchInput');
		const clearBtn = document.getElementById('clearSearch');

		searchInput.addEventListener('input', e => {
			state.filtros.busca = e.target.value.trim().toLowerCase();
			clearBtn.style.display = state.filtros.busca ? 'flex' : 'none';
			renderizar();
		});

		clearBtn.addEventListener('click', () => {
			searchInput.value = '';
			state.filtros.busca = '';
			clearBtn.style.display = 'none';
			renderizar();
			searchInput.focus();
		});

		// Filtros laterais (delegação)
		document.querySelectorAll('.hub-filter-list').forEach(list => {
			list.addEventListener('click', e => {
				const item = e.target.closest('.hub-filter-item');
				if (!item) return;
				const tipo = item.dataset.filterType;
				const valor = item.dataset.filterValue;
				aplicarFiltro(tipo, valor, item);
			});
		});

		document.getElementById('resetFilters').addEventListener('click', resetarFiltros);

		// Busca por atalho de teclado (/) — UX comum
		document.addEventListener('keydown', e => {
			if (e.key === '/' && document.activeElement !== searchInput) {
				e.preventDefault();
				searchInput.focus();
			}
			if (e.key === 'Escape' && document.activeElement === searchInput) {
				searchInput.blur();
			}
		});
	}

	function aplicarFiltro(tipo, valor, itemEl) {
		if (tipo === 'modulo') {
			state.filtros.modulo = valor;
			marcarAtivo('filterModulos', itemEl);
		} else if (tipo === 'categoria') {
			state.filtros.categoria = valor;
			marcarAtivo('filterCategorias', itemEl);
		} else if (tipo === 'video') {
			// toggle
			state.filtros.video = state.filtros.video === true ? null : true;
			itemEl.classList.toggle('active', state.filtros.video === true);
		}
		renderizar();
	}

	function marcarAtivo(listId, itemEl) {
		document.querySelectorAll('#' + listId + ' .hub-filter-item').forEach(el => {
			el.classList.remove('active');
		});
		itemEl.classList.add('active');
	}

	function resetarFiltros() {
		state.filtros = { busca: '', modulo: '*', categoria: '*', video: null };
		document.getElementById('searchInput').value = '';
		document.getElementById('clearSearch').style.display = 'none';
		// Restaurar "Todos" como ativo
		document.querySelectorAll('#filterModulos .hub-filter-item').forEach(el => {
			el.classList.toggle('active', el.dataset.filterValue === '*');
		});
		document.querySelectorAll('#filterCategorias .hub-filter-item').forEach(el => {
			el.classList.toggle('active', el.dataset.filterValue === '*');
		});
		document.querySelectorAll('[data-filter-type="video"]').forEach(el => {
			el.classList.remove('active');
		});
		renderizar();
	}

	// Expor reset globalmente para o botão do empty state
	window.resetFilters = resetarFiltros;

	// =====================================================
	// FILTRAGEM
	// =====================================================
	function filtrar(manuais) {
		const q = state.filtros.busca;
		return manuais.filter(m => {
			// Filtro de módulo
			if (state.filtros.modulo !== '*' && m.modulo !== state.filtros.modulo) return false;
			// Filtro de categoria
			if (state.filtros.categoria !== '*' && m.categoria !== state.filtros.categoria) return false;
			// Filtro de vídeo
			if (state.filtros.video === true && !m.tem_video) return false;
			// Busca por texto
			if (q) {
				const haystack = [
					m.titulo,
					m.descricao,
					m.modulo,
					m.categoria,
					(m.tags || []).join(' '),
					(m.telas || []).join(' '),
					m.autor || ''
				].join(' ').toLowerCase();
				if (!haystack.includes(q)) return false;
			}
			return true;
		});
	}

	// =====================================================
	// RENDERIZAÇÃO
	// =====================================================
	function renderizar() {
		const filtrados = filtrar(state.manuais);
		document.getElementById('resultsCount').textContent = filtrados.length;
		renderizarChipsAtivos();

		const grid = document.getElementById('manuaisGrid');
		const empty = document.getElementById('emptyState');

		if (filtrados.length === 0) {
			grid.innerHTML = '';
			empty.style.display = 'block';
			return;
		}

		empty.style.display = 'none';

		// Agrupamento por módulo (só quando filtro de módulo é "todos")
		let html = '';
		if (state.filtros.modulo === '*') {
			const grupos = agruparPorModulo(filtrados);
			Object.keys(grupos).sort().forEach(modulo => {
				html += '<div class="hub-group-header">' +
					'<h3 class="hub-group-title"><i class="fas fa-cube"></i>' + escapeHtml(modulo) + '</h3>' +
					'<span class="hub-group-count">' + grupos[modulo].length + '</span>' +
					'</div>';
				grupos[modulo].forEach(m => {
					html += renderCard(m);
				});
			});
		} else {
			filtrados.forEach(m => {
				html += renderCard(m);
			});
		}

		grid.innerHTML = html;
	}

	function agruparPorModulo(manuais) {
		const grupos = {};
		manuais.forEach(m => {
			if (!grupos[m.modulo]) grupos[m.modulo] = [];
			grupos[m.modulo].push(m);
		});
		return grupos;
	}

	function renderCard(m) {
		const q = state.filtros.busca;
		const titulo = highlight(m.titulo, q);
		const descricao = highlight(m.descricao, q);

		const dataFmt = formatarData(m.data_publicacao);
		const tagsHtml = (m.tags || []).slice(0, 4).map(t =>
			'<span class="hub-card-tag">' + escapeHtml(t) + '</span>'
		).join('');

		const badgeVideo = m.tem_video
			? '<span class="hub-card-badge-video"><i class="fas fa-video"></i> Vídeo</span>'
			: '';

		const icone = m.icone || 'fas fa-file-alt';

		return '<div class="col-lg-4 col-md-6 col-sm-12 hub-card-wrapper">' +
			'<a href="' + escapeAttr(m.url) + '" class="hub-card">' +
				badgeVideo +
				'<div class="hub-card-icon"><i class="' + escapeAttr(icone) + '"></i></div>' +
				'<div class="hub-card-modulo">' + escapeHtml(m.modulo) + '</div>' +
				'<h4 class="hub-card-title">' + titulo + '</h4>' +
				'<p class="hub-card-desc">' + descricao + '</p>' +
				'<div class="hub-card-tags">' + tagsHtml + '</div>' +
				'<div class="hub-card-meta">' +
					'<span class="hub-card-meta-item"><i class="fas fa-tag"></i> ' + escapeHtml(m.categoria) + '</span>' +
					'<span class="hub-card-meta-item"><i class="fas fa-code-branch"></i> v' + escapeHtml(m.versao || '1.0') + '</span>' +
					'<span class="hub-card-meta-item"><i class="fas fa-calendar-alt"></i> ' + escapeHtml(dataFmt) + '</span>' +
				'</div>' +
			'</a>' +
		'</div>';
	}

	function renderizarChipsAtivos() {
		const container = document.getElementById('activeFilters');
		const chips = [];

		if (state.filtros.busca) {
			chips.push(chip('Busca: "' + state.filtros.busca + '"', 'busca'));
		}
		if (state.filtros.modulo !== '*') {
			chips.push(chip('Módulo: ' + state.filtros.modulo, 'modulo'));
		}
		if (state.filtros.categoria !== '*') {
			chips.push(chip('Categoria: ' + state.filtros.categoria, 'categoria'));
		}
		if (state.filtros.video === true) {
			chips.push(chip('Com vídeo', 'video'));
		}

		container.innerHTML = chips.join('');
		container.querySelectorAll('[data-remove-chip]').forEach(el => {
			el.addEventListener('click', () => removerChip(el.dataset.removeChip));
		});
	}

	function chip(texto, tipo) {
		return '<span class="hub-active-filter-chip">' + escapeHtml(texto) +
			' <i class="fas fa-times" data-remove-chip="' + tipo + '" title="Remover"></i></span>';
	}

	function removerChip(tipo) {
		if (tipo === 'busca') {
			document.getElementById('searchInput').value = '';
			document.getElementById('clearSearch').style.display = 'none';
			state.filtros.busca = '';
		} else if (tipo === 'modulo') {
			state.filtros.modulo = '*';
			document.querySelectorAll('#filterModulos .hub-filter-item').forEach(el => {
				el.classList.toggle('active', el.dataset.filterValue === '*');
			});
		} else if (tipo === 'categoria') {
			state.filtros.categoria = '*';
			document.querySelectorAll('#filterCategorias .hub-filter-item').forEach(el => {
				el.classList.toggle('active', el.dataset.filterValue === '*');
			});
		} else if (tipo === 'video') {
			state.filtros.video = null;
			document.querySelectorAll('[data-filter-type="video"]').forEach(el => {
				el.classList.remove('active');
			});
		}
		renderizar();
	}

	// =====================================================
	// HELPERS
	// =====================================================
	function escapeHtml(s) {
		if (s == null) return '';
		return String(s)
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#039;');
	}

	function escapeAttr(s) {
		return escapeHtml(s);
	}

	function highlight(texto, termo) {
		if (!termo) return escapeHtml(texto);
		const escaped = escapeHtml(texto);
		// Escapar regex
		const safe = termo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const re = new RegExp('(' + safe + ')', 'gi');
		return escaped.replace(re, '<span class="hub-highlight">$1</span>');
	}

	function formatarData(iso) {
		if (!iso) return '';
		// "2026-05-08" -> "08/05/2026"
		const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
		if (m) return m[3] + '/' + m[2] + '/' + m[1];
		return iso;
	}

	// Iniciar quando DOM estiver pronto
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', carregarCatalogo);
	} else {
		carregarCatalogo();
	}
})();
