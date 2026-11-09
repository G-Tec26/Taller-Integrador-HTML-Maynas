// ==========================================================================
// Lógica de la Landing Page +ChicasTec
// Paleta Armoniosa: Azul Marino (#1b365d / #0f233d) & Palo Rosa (#b76e79 / #c47d89)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Estado de la aplicación
  let currentFilter = 'all';
  let currentCity = 'all';
  let searchQuery = '';
  let currentSort = 'featured';
  let viewMode = 'grid'; // 'grid' | 'list'
  let activeModalIndex = 0;
  let filteredStudents = [...studentsData];

  // Recuperar 'me gusta' almacenados localmente
  const userLikes = JSON.parse(localStorage.getItem('chicasTec_likes') || '{}');

  // Elementos del DOM
  const cardsContainer = document.getElementById('studentsGrid');
  const counterText = document.getElementById('studentsCounter');
  const searchInput = document.getElementById('searchInput');
  const sortSelect = document.getElementById('sortSelect');
  const citySelect = document.getElementById('citySelect');
  const gridViewBtn = document.getElementById('gridViewBtn');
  const listViewBtn = document.getElementById('listViewBtn');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const noResultsDiv = document.getElementById('noResults');
  const resetFiltersBtn = document.getElementById('resetFiltersBtn');
  const backToTopBtn = document.getElementById('backToTopBtn');
  const toastNotification = document.getElementById('toastNotification');
  const toastTitle = document.getElementById('toastTitle');
  const toastMessage = document.getElementById('toastMessage');

  // Elementos del Modal
  const modal = document.getElementById('studentModal');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const prevModalBtn = document.getElementById('prevModalBtn');
  const nextModalBtn = document.getElementById('nextModalBtn');

  // Elementos internos del Modal
  const modalAvatar = document.getElementById('modalAvatar');
  const modalName = document.getElementById('modalName');
  const modalRole = document.getElementById('modalRole');
  const modalCity = document.getElementById('modalCity');
  const modalQuote = document.getElementById('modalQuote');
  const modalProjectTitle = document.getElementById('modalProjectTitle');
  const modalProjectSubtitle = document.getElementById('modalProjectSubtitle');
  const modalProjectDesc = document.getElementById('modalProjectDesc');
  const modalTechStack = document.getElementById('modalTechStack');
  const modalSkills = document.getElementById('modalSkills');
  const modalUrlDisplay = document.getElementById('modalUrlDisplay');
  const modalVisitBtn = document.getElementById('modalVisitBtn');
  const modalGithubBtn = document.getElementById('modalGithubBtn');
  const modalLinkedinBtn = document.getElementById('modalLinkedinBtn');
  const modalPreviewBanner = document.getElementById('modalPreviewBanner');
  const modalProjectHeading = document.getElementById('modalProjectHeading');
  const modalProjectCategory = document.getElementById('modalProjectCategory');

  // ==========================================================================
  // Notificación Toast Reutilizable
  // ==========================================================================
  let toastTimer = null;
  function showToast(title, message, iconClass = 'fa-heart text-[#b76e79]') {
    if (!toastNotification) return;
    if (toastTitle) toastTitle.textContent = title;
    if (toastMessage) toastMessage.textContent = message;

    const iconEl = toastNotification.querySelector('i');
    if (iconEl) iconEl.className = `fa-solid ${iconClass} text-sm`;

    toastNotification.classList.remove('translate-y-20', 'opacity-0', 'pointer-events-none');
    toastNotification.classList.add('translate-y-0', 'opacity-100', 'pointer-events-auto');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastNotification.classList.remove('translate-y-0', 'opacity-100', 'pointer-events-auto');
      toastNotification.classList.add('translate-y-20', 'opacity-0', 'pointer-events-none');
    }, 3200);
  }

  // ==========================================================================
  // Renderizar Tarjetas de las 30 Participantes (Modo Claro)
  // ==========================================================================
  function renderCards(list) {
    if (!cardsContainer) return;
    cardsContainer.innerHTML = '';

    if (list.length === 0) {
      if (noResultsDiv) noResultsDiv.classList.remove('hidden');
      if (counterText) counterText.textContent = 'Mostrando 0 de 30 creadoras';
      return;
    }

    if (noResultsDiv) noResultsDiv.classList.add('hidden');
    if (counterText) {
      counterText.innerHTML = `Mostrando <span class="text-[#1b365d] font-bold">${list.length}</span> de <span class="text-[#b76e79] font-bold">${studentsData.length}</span> creadoras del programa`;
    }

    // Configurar clase del contenedor según vista
    if (viewMode === 'list') {
      cardsContainer.className = 'flex flex-col gap-3.5';
    } else {
      cardsContainer.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
    }

    list.forEach((student) => {
      const isLiked = !!userLikes[student.id];
      const likesCount = student.likes + (isLiked ? 1 : 0);

      const categoryBadgeClass = {
        'frontend': 'badge-tag-frontend',
        'ui-ux': 'badge-tag-ui-ux',
        'fullstack': 'badge-tag-fullstack',
        'impacto': 'badge-tag-impacto'
      }[student.category] || 'badge-tech';

      const categoryLabel = {
        'frontend': 'Frontend Dev',
        'ui-ux': 'UI/UX & Web',
        'fullstack': 'Full Stack',
        'impacto': 'Impacto Social'
      }[student.category] || student.category;

      const card = document.createElement('article');

      if (viewMode === 'list') {
        // Vista Lista / Directorio Compacto
        card.className = 'glass-card rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-200 hover:border-[#b76e79] transition-all group';
        card.setAttribute('data-id', student.id);

        card.innerHTML = `
          <div class="flex items-center gap-3.5">
            <div class="w-13 h-13 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr ${student.previewColor} shrink-0 shadow-sm">
              <img 
                src="${student.avatar}" 
                alt="${student.name}" 
                class="w-12 h-12 object-cover rounded-full"
                loading="lazy"
                onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=1b365d&color=fff&size=128'"
              />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h4 class="text-base font-bold text-slate-900 group-hover:text-[#1b365d] transition-colors font-heading">
                  ${student.name}
                </h4>
                <span class="${categoryBadgeClass} px-2 py-0.5 text-[10px] rounded-full">
                  ${categoryLabel}
                </span>
                ${student.featured ? '<span class="text-[#b76e79] text-xs"><i class="fa-solid fa-star"></i></span>' : ''}
              </div>
              <p class="text-xs text-[#1b365d] font-semibold">${student.role} • <span class="text-slate-500 font-normal"><i class="fa-solid fa-location-dot text-[#b76e79]"></i> ${student.city}</span></p>
              <p class="text-xs text-slate-600 mt-0.5 line-clamp-1"><strong class="text-slate-800">Proyecto:</strong> ${student.projectTitle} - ${student.projectSubtitle}</p>
            </div>
          </div>

          <div class="flex items-center gap-2 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
            <div class="hidden lg:flex items-center gap-1">
              ${student.techStack.slice(0, 2).map(t => `<span class="badge-tech text-[10px]">${t}</span>`).join('')}
            </div>

            <button 
              type="button" 
              class="like-btn p-2 rounded-lg hover:bg-[#f9eff1] text-slate-400 hover:text-[#b76e79] transition-colors ${isLiked ? 'text-[#b76e79] liked' : ''}" 
              data-like-id="${student.id}"
              title="Apoyar con un me gusta"
            >
              <i class="${isLiked ? 'fa-solid text-[#b76e79]' : 'fa-regular'} fa-heart text-sm"></i>
              <span class="like-counter text-xs ml-0.5 font-bold">${likesCount}</span>
            </button>

            <button 
              type="button" 
              class="open-modal-btn py-2 px-3.5 rounded-xl bg-[#f0f4f9] hover:bg-gradient-to-r hover:from-[#1b365d] hover:to-[#b76e79] text-[#1b365d] hover:text-white border border-[#cbd5e1] hover:border-transparent text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
              data-student-id="${student.id}"
            >
              <span>Ver Web</span>
              <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
            </button>
          </div>
        `;
      } else {
        // Vista Cuadrícula Completa
        card.className = 'glass-card rounded-2xl overflow-hidden relative flex flex-col group';
        card.setAttribute('data-id', student.id);

        card.innerHTML = `
          <!-- Borde superior con gradiente luminoso Azul Marino a Palo Rosa -->
          <div class="card-glow-accent"></div>

          <!-- Encabezado de la Tarjeta / Banner con Avatar -->
          <div class="p-6 pb-4">
            <div class="flex items-start justify-between gap-3 mb-4">
              <div class="relative">
                <div class="w-16 h-16 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr ${student.previewColor} shadow-md shadow-slate-300/40">
                  <img 
                    src="${student.avatar}" 
                    alt="${student.name}" 
                    class="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=1b365d&color=fff&size=128'"
                  />
                </div>
                <span class="absolute bottom-0 right-0 w-4 h-4 bg-[#b76e79] border-2 border-white rounded-full shadow-sm" title="Graduada Activa"></span>
              </div>

              <div class="flex items-center gap-1.5">
                <span class="${categoryBadgeClass} px-2.5 py-1 text-xs rounded-full">
                  ${categoryLabel}
                </span>
                <button 
                  type="button" 
                  class="like-btn p-2 rounded-full hover:bg-[#f9eff1] transition-colors ${isLiked ? 'text-[#b76e79] liked' : ''}" 
                  data-like-id="${student.id}"
                  title="Apoyar con un me gusta"
                  aria-label="Dar me gusta"
                >
                  <i class="${isLiked ? 'fa-solid text-[#b76e79]' : 'fa-regular'} fa-heart text-sm"></i>
                  <span class="like-counter text-xs ml-0.5 font-bold text-slate-600">${likesCount}</span>
                </button>
              </div>
            </div>

            <!-- Nombre y Rol -->
            <div class="mb-3">
              <div class="flex items-center gap-2">
                <h3 class="text-xl font-bold text-slate-900 group-hover:text-[#1b365d] transition-colors font-heading">
                  ${student.name}
                </h3>
                ${student.featured ? '<span class="text-[#b76e79] text-xs" title="Proyecto Destacado"><i class="fa-solid fa-star"></i></span>' : ''}
              </div>
              <p class="text-xs text-[#1b365d] font-semibold">${student.role}</p>
              <p class="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <i class="fa-solid fa-location-dot text-[#b76e79]"></i> ${student.city}
              </p>
            </div>

            <!-- Titular o frase personal -->
            <p class="text-xs text-slate-700 italic line-clamp-2 mb-4 bg-[#f0f4f9]/80 p-2.5 rounded-lg border border-[#cbd5e1]/70">
              "${student.headline}"
            </p>

            <!-- Sección Proyecto Personal -->
            <div class="pt-3 border-t border-slate-100">
              <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                <i class="fa-solid fa-laptop-code text-[#b76e79] mr-1"></i> Trabajo de Página Personal:
              </span>
              <h4 class="text-sm font-bold text-slate-900 group-hover:text-[#b76e79] transition-colors">
                ${student.projectTitle}
              </h4>
              <p class="text-xs text-slate-600 line-clamp-2 mt-1">
                ${student.projectDescription}
              </p>
            </div>

            <!-- Badges de Tecnologías interactivos -->
            <div class="flex flex-wrap gap-1.5 mt-3">
              ${student.techStack.slice(0, 3).map(tech => `
                <span class="badge-tech tech-filter-badge" data-tech="${tech}" title="Filtrar por ${tech}">${tech}</span>
              `).join('')}
              ${student.techStack.length > 3 ? `<span class="badge-tech">+${student.techStack.length - 3}</span>` : ''}
            </div>
          </div>

          <!-- Acciones en el Pie de la Tarjeta -->
          <div class="mt-auto p-4 pt-0">
            <div class="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <!-- Botón Ver Página Personal / Demo -->
              <button 
                type="button" 
                class="open-modal-btn w-full py-2.5 px-3 rounded-xl bg-[#f0f4f9] hover:bg-gradient-to-r hover:from-[#1b365d] hover:to-[#b76e79] text-[#1b365d] hover:text-white border border-[#cbd5e1] hover:border-transparent text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 shadow-sm"
                data-student-id="${student.id}"
              >
                <span>Conocer Trabajo &amp; Web</span>
                <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
              </button>

              <!-- Links Rápidos Redes -->
              <div class="flex items-center gap-1">
                <a 
                  href="${student.github}" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors"
                  title="Ver GitHub"
                  aria-label="GitHub de ${student.name}"
                >
                  <i class="fa-brands fa-github text-xs"></i>
                </a>
                <a 
                  href="${student.linkedin}" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  class="w-8 h-8 rounded-lg bg-[#f0f4f9] hover:bg-[#e2eaf3] flex items-center justify-center text-[#1b365d] transition-colors"
                  title="Ver LinkedIn"
                  aria-label="LinkedIn de ${student.name}"
                >
                  <i class="fa-brands fa-linkedin-in text-xs"></i>
                </a>
              </div>
            </div>
          </div>
        `;
      }

      cardsContainer.appendChild(card);
    });

    // Reasignar eventos
    attachCardEvents();
  }

  // ==========================================================================
  // Manejo de Eventos en Tarjetas (Modal, Likes, Filtros por Tag)
  // ==========================================================================
  function attachCardEvents() {
    // Abrir Modal
    const openButtons = document.querySelectorAll('.open-modal-btn');
    openButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const studentId = parseInt(btn.getAttribute('data-student-id'));
        openStudentModal(studentId);
      });
    });

    // Likes
    const likeButtons = document.querySelectorAll('.like-btn');
    likeButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const studentId = parseInt(btn.getAttribute('data-like-id'));
        toggleLike(studentId, btn);
      });
    });

    // Clic en badge de tecnología para filtrar
    const techBadges = document.querySelectorAll('.tech-filter-badge');
    techBadges.forEach(badge => {
      badge.addEventListener('click', (e) => {
        e.stopPropagation();
        const tech = badge.getAttribute('data-tech');
        if (searchInput) {
          searchInput.value = tech;
          searchQuery = tech;
          applyFiltersAndSort();
          showToast(`Filtro aplicado`, `Mostrando proyectos que usan ${tech}`, 'fa-filter text-[#1b365d]');
        }
      });
    });
  }

  // ==========================================================================
  // Sistema de 'Me Gusta' con LocalStorage & Toast
  // ==========================================================================
  function toggleLike(studentId, btnElement) {
    const isLiked = !!userLikes[studentId];
    const student = studentsData.find(s => s.id === studentId);
    if (!student) return;

    if (isLiked) {
      delete userLikes[studentId];
      btnElement.classList.remove('liked');
      btnElement.querySelector('i').className = 'fa-regular fa-heart text-sm';
      showToast('Apoyo retirado', `Se retiró el corazón a ${student.name}`, 'fa-heart-crack text-slate-400');
    } else {
      userLikes[studentId] = true;
      btnElement.classList.add('liked');
      btnElement.querySelector('i').className = 'fa-solid fa-heart text-sm text-[#b76e79]';
      btnElement.style.transform = 'scale(1.25)';
      setTimeout(() => { btnElement.style.transform = 'scale(1)'; }, 200);
      showToast('¡Apoyo registrado! ❤️', `Has apoyado el proyecto de ${student.name}`, 'fa-heart text-[#b76e79]');
    }

    localStorage.setItem('chicasTec_likes', JSON.stringify(userLikes));

    // Actualizar contador numérico
    const newCount = student.likes + (userLikes[studentId] ? 1 : 0);
    const counterSpan = btnElement.querySelector('.like-counter');
    if (counterSpan) counterSpan.textContent = newCount;
  }

  // ==========================================================================
  // Filtros y Búsqueda
  // ==========================================================================
  function applyFiltersAndSort() {
    let result = [...studentsData];

    // Filtro por categoría
    if (currentFilter !== 'all') {
      result = result.filter(student => student.category === currentFilter);
    }

    // Filtro por ciudad
    if (currentCity !== 'all') {
      result = result.filter(student => student.city.toLowerCase().includes(currentCity.toLowerCase()));
    }

    // Búsqueda en vivo (Nombre, Rol, Ciudad, Proyecto, Tecnologías)
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(student => {
        const nameMatch = student.name.toLowerCase().includes(q);
        const cityMatch = student.city.toLowerCase().includes(q);
        const roleMatch = student.role.toLowerCase().includes(q);
        const projectMatch = student.projectTitle.toLowerCase().includes(q) || student.projectDescription.toLowerCase().includes(q);
        const techMatch = student.techStack.some(t => t.toLowerCase().includes(q));
        const skillsMatch = student.skills.some(s => s.toLowerCase().includes(q));
        return nameMatch || cityMatch || roleMatch || projectMatch || techMatch || skillsMatch;
      });
    }

    // Ordenamiento
    if (currentSort === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (currentSort === 'name-desc') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else if (currentSort === 'likes') {
      result.sort((a, b) => {
        const likesA = a.likes + (userLikes[a.id] ? 1 : 0);
        const likesB = b.likes + (userLikes[b.id] ? 1 : 0);
        return likesB - likesA;
      });
    } else {
      // Destacadas primero
      result.sort((a, b) => (b.featured === true ? 1 : 0) - (a.featured === true ? 1 : 0));
    }

    filteredStudents = result;
    renderCards(filteredStudents);
  }

  // Event Listeners para Filtros por Categoría
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter');
      applyFiltersAndSort();
    });
  });

  // Event Listener para Ciudad
  if (citySelect) {
    citySelect.addEventListener('change', (e) => {
      currentCity = e.target.value;
      applyFiltersAndSort();
    });
  }

  // Event Listener para Búsqueda
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      applyFiltersAndSort();
    });
  }

  // Event Listener para Ordenar
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      applyFiltersAndSort();
    });
  }

  // Conmutador de Vista (Cuadrícula / Lista)
  if (gridViewBtn && listViewBtn) {
    gridViewBtn.addEventListener('click', () => {
      viewMode = 'grid';
      gridViewBtn.className = 'p-1.5 px-2.5 rounded-lg text-xs font-bold transition-all bg-white text-[#1b365d] shadow-sm';
      listViewBtn.className = 'p-1.5 px-2.5 rounded-lg text-xs font-bold transition-all text-slate-500 hover:text-slate-800';
      renderCards(filteredStudents);
    });

    listViewBtn.addEventListener('click', () => {
      viewMode = 'list';
      listViewBtn.className = 'p-1.5 px-2.5 rounded-lg text-xs font-bold transition-all bg-white text-[#1b365d] shadow-sm';
      gridViewBtn.className = 'p-1.5 px-2.5 rounded-lg text-xs font-bold transition-all text-slate-500 hover:text-slate-800';
      renderCards(filteredStudents);
    });
  }

  // Botón Resetear Filtros
  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', () => {
      currentFilter = 'all';
      currentCity = 'all';
      searchQuery = '';
      currentSort = 'featured';
      if (searchInput) searchInput.value = '';
      if (sortSelect) sortSelect.value = 'featured';
      if (citySelect) citySelect.value = 'all';
      filterButtons.forEach(b => {
        if (b.getAttribute('data-filter') === 'all') b.classList.add('active');
        else b.classList.remove('active');
      });
      applyFiltersAndSort();
      showToast('Filtros restablecidos', 'Mostrando las 30 creadoras del programa', 'fa-rotate-left text-[#1b365d]');
    });
  }

  // ==========================================================================
  // Botón Volver Arriba
  // ==========================================================================
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
        backToTopBtn.classList.add('opacity-100', 'pointer-events-auto');
      } else {
        backToTopBtn.classList.remove('opacity-100', 'pointer-events-auto');
        backToTopBtn.classList.add('opacity-0', 'pointer-events-none');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ==========================================================================
  // Modal de Detalle de la Estudiante y Proyecto de Página Personal
  // ==========================================================================
  function openStudentModal(studentId) {
    const studentIndex = studentsData.findIndex(s => s.id === studentId);
    if (studentIndex === -1) return;

    activeModalIndex = studentIndex;
    updateModalContent(studentsData[activeModalIndex]);

    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      document.body.style.overflow = 'hidden';
    }
  }

  function updateModalContent(student) {
    if (!student) return;

    // Foto e info personal
    if (modalAvatar) {
      modalAvatar.src = student.avatar;
      modalAvatar.alt = student.name;
    }
    if (modalName) modalName.textContent = student.name;
    if (modalRole) modalRole.textContent = student.role;
    if (modalCity) modalCity.innerHTML = `<i class="fa-solid fa-location-dot text-[#b76e79] mr-1"></i> ${student.city}`;
    if (modalQuote) modalQuote.textContent = `"${student.quote}"`;

    // Proyecto
    if (modalProjectTitle) modalProjectTitle.textContent = student.projectTitle;
    if (modalProjectSubtitle) modalProjectSubtitle.textContent = student.projectSubtitle;
    if (modalProjectDesc) modalProjectDesc.textContent = student.projectDescription;
    if (modalUrlDisplay) modalUrlDisplay.textContent = student.portfolioUrl;

    if (modalProjectHeading) modalProjectHeading.textContent = student.projectTitle;
    if (modalProjectCategory) {
      const labels = {
        'frontend': 'Desarrollo Frontend & Interacción',
        'ui-ux': 'Diseño UI/UX & Código Creativo',
        'fullstack': 'Aplicación Web & Lógica',
        'impacto': 'Impacto Social & Sostenibilidad'
      };
      modalProjectCategory.textContent = labels[student.category] || 'Página Web Personal';
    }

    // Banner del Modal
    if (modalPreviewBanner) {
      modalPreviewBanner.className = `relative h-56 md:h-64 rounded-2xl overflow-hidden p-6 flex flex-col justify-between bg-gradient-to-br ${student.previewColor} shadow-lg`;
    }

    // Tecnologías
    if (modalTechStack) {
      modalTechStack.innerHTML = student.techStack.map(t => `
        <span class="px-3 py-1 rounded-lg text-xs font-semibold bg-[#f0f4f9] text-[#1b365d] border border-[#cbd5e1]">
          <i class="fa-solid fa-check text-[#1b365d] mr-1 text-[10px]"></i>${t}
        </span>
      `).join('');
    }

    // Habilidades / Competencias
    if (modalSkills) {
      modalSkills.innerHTML = student.skills.map(s => `
        <span class="px-3 py-1 rounded-lg text-xs font-semibold bg-[#f9eff1] text-[#8e4c56] border border-[#e6c5cb]">
          <i class="fa-solid fa-star text-[#b76e79] mr-1 text-[10px]"></i>${s}
        </span>
      `).join('');
    }

    // Enlaces
    if (modalVisitBtn) modalVisitBtn.href = student.portfolioUrl;
    if (modalGithubBtn) modalGithubBtn.href = student.github;
    if (modalLinkedinBtn) modalLinkedinBtn.href = student.linkedin;
  }

  function closeModal() {
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      document.body.style.overflow = '';
    }
  }

  function showNextStudent() {
    activeModalIndex = (activeModalIndex + 1) % studentsData.length;
    updateModalContent(studentsData[activeModalIndex]);
  }

  function showPrevStudent() {
    activeModalIndex = (activeModalIndex - 1 + studentsData.length) % studentsData.length;
    updateModalContent(studentsData[activeModalIndex]);
  }

  // Event Listeners del Modal
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
  if (nextModalBtn) nextModalBtn.addEventListener('click', showNextStudent);
  if (prevModalBtn) prevModalBtn.addEventListener('click', showPrevStudent);

  // Navegación con teclado
  document.addEventListener('keydown', (e) => {
    if (!modal || modal.classList.contains('hidden')) return;

    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowRight') showNextStudent();
    if (e.key === 'ArrowLeft') showPrevStudent();
  });

  // ==========================================================================
  // Renderizar Pilares Formativos (Modo Claro)
  // ==========================================================================
  function renderProgramPillars() {
    const pillarsContainer = document.getElementById('pillarsGrid');
    if (!pillarsContainer || !programStats.pillars) return;

    pillarsContainer.innerHTML = programStats.pillars.map((pillar, idx) => `
      <div class="glass-card p-6 rounded-2xl relative overflow-hidden group hover:border-[#b76e79] transition-all">
        <div class="w-12 h-12 rounded-xl bg-gradient-to-tr ${pillar.color} flex items-center justify-center text-white text-xl mb-4 shadow-md group-hover:scale-105 transition-transform">
          <i class="fa-solid ${pillar.icon}"></i>
        </div>
        <div class="text-xs font-bold text-[#1b365d] tracking-wider uppercase mb-1">Pilar 0${idx + 1}</div>
        <h3 class="text-lg font-bold text-slate-900 mb-2 font-heading">${pillar.title}</h3>
        <p class="text-sm text-slate-600 leading-relaxed">${pillar.desc}</p>
      </div>
    `).join('');
  }

  // ==========================================================================
  // Menú Móvil
  // ==========================================================================
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  // ==========================================================================
  // Inicialización
  // ==========================================================================
  renderProgramPillars();
  applyFiltersAndSort();
});
