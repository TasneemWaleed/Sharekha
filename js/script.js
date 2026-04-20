// Mock Database for Sharek-ha
const mockTools = [
  {
    id: 1,
    title: "مجموعة أدوات هندسة معمارية",
    category: "هندسة",
    price: "15",
    faculty: "engineering",
    image: "https://images.unsplash.com/photo-1528151528253-61b4db13689f?auto=format&fit=crop&q=80&w=800",
    description: "مجموعة أدوات كاملة لطلاب قسم العمارة، تتضمن مساطر T، مثلثات، وبوصلة احترافية. الحالة ممتازة.",
    owner: "أحمد محمد"
  },
  {
    id: 2,
    title: "بالطو طبي (معمل) - مقاس M",
    category: "طب",
    price: "10",
    faculty: "medicine",
    image: "https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&q=80&w=800",
    description: "بالطو أبيض نظيف ومكوي، مناسب لطلاب كليات الطب والصيدلة والعلوم. يستخدم في المعامل.",
    owner: "سارة خالد"
  },
  {
    id: 3,
    title: "آلة حاسبة علمية Casio fx-991ARX",
    category: "عام",
    price: "20",
    faculty: "all",
    image: "https://images.unsplash.com/photo-1616423640778-28d1b53229bd?auto=format&fit=crop&q=80&w=800",
    description: "آلة حاسبة علمية متطورة تدعم اللغة العربية وحل المعادلات المعقدة. مسموح بها في الامتحانات.",
    owner: "محمد علي"
  },
  {
    id: 4,
    title: "ألوان زيتية وفرش احترافية",
    category: "فنون جميلة",
    price: "25",
    faculty: "arts",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800",
    description: "طقم ألوان زيتية 12 لون مع 5 فرش بمقاسات مختلفة. مستخدمة بشكل خفيف جداً.",
    owner: "نور حسن"
  },
  {
    id: 5,
    title: "ميكروسكوب طلابي ضوئي",
    category: "علوم",
    price: "40",
    faculty: "science",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800",
    description: "ميكروسكوب ضوئي بقوة تكبير تصل إلى 1000x، مثالي لعمل شرائح البيولوجي.",
    owner: "عمر فاروق"
  },
  {
    id: 6,
    title: "أردوينو أونو (Arduino Uno) مع ملحقات",
    category: "هندسة حاسبات",
    price: "15",
    faculty: "engineering",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800",
    description: "بوردة أردوينو أصلية مع أسلاك توصيل ومقاومات ولمبات LED لمشاريع التخرج.",
    owner: "طارق زياد"
  }
];

// Utility function to generate tool cards HTML
function generateToolCard(tool) {
  return `
    <a href="product-detail.html?id=${tool.id}" class="tool-card animate-in">
      <img src="${tool.image}" alt="${tool.title}" class="tool-img">
      <div class="tool-info">
        <span class="tool-category">${tool.category}</span>
        <h3 class="tool-title">${tool.title}</h3>
        <span class="tool-price">${tool.price} ج.م / يوم</span>
      </div>
    </a>
  `;
}

// Function to render featured tools on the homepage
function renderFeaturedTools() {
  const container = document.getElementById('featured-tools');
  if (!container) return; // Only run on index.html
  
  // Show first 4 items as featured
  const featuredHTML = mockTools.slice(0, 4).map(generateToolCard).join('');
  container.innerHTML = featuredHTML;
}

// Function to render all tools with filtering on the search page
function renderSearchTools() {
  const container = document.getElementById('search-results');
  if (!container) return; // Only run on search.html
  
  const facultyFilter = document.getElementById('faculty-filter');
  
  // Render function
  const render = (faculty) => {
    let filteredTools = mockTools;
    if (faculty && faculty !== 'all') {
      filteredTools = mockTools.filter(tool => tool.faculty === faculty);
    }
    
    if (filteredTools.length === 0) {
      container.innerHTML = '<div class="empty-state">لا توجد أدوات مطابقة لبحثك في الوقت الحالي.</div>';
    } else {
      container.innerHTML = filteredTools.map(generateToolCard).join('');
    }
  };
  
  // Initial render
  render('all');
  
  // Listen to filter changes
  if (facultyFilter) {
    facultyFilter.addEventListener('change', (e) => {
      render(e.target.value);
    });
  }
}

// Function to render product details
function renderProductDetail() {
  const container = document.getElementById('product-detail');
  if (!container) return; // Only run on product-detail.html
  
  const urlParams = new URLSearchParams(window.location.search);
  const id = parseInt(urlParams.get('id'));
  
  const tool = mockTools.find(t => t.id === id);
  
  if (!tool) {
    container.innerHTML = '<div class="empty-state">هذه الأداة غير متوفرة.</div>';
    return;
  }
  
  // Update page title
  document.title = `${tool.title} - شاركها`;
  
  const detailHTML = `
    <div class="product-gallery animate-in">
      <img src="${tool.image}" alt="${tool.title}">
    </div>
    <div class="product-info animate-in" style="animation-delay: 0.2s">
      <div class="product-meta">
        <span class="badge">${tool.category}</span>
        <span class="badge">المالك: ${tool.owner}</span>
      </div>
      <h1>${tool.title}</h1>
      <p class="product-desc">${tool.description}</p>
      <div class="price-tag">${tool.price} ج.م / يوم</div>
      
      <button onclick="window.open('https://wa.me/201234567890?text=مرحباً، أريد استئجار ${tool.title}', '_blank')" class="btn btn-primary" style="width: 100%; font-size: 1.2rem; padding: 1rem;">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-left: 10px;"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
        تواصل عبر واتساب
      </button>
    </div>
  `;
  
  container.innerHTML = detailHTML;
}

// Simple logic for Dashboard Tabs
function initDashboardTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  const sections = document.querySelectorAll('.dashboard-section');
  
  if (tabs.length === 0) return;
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active from all
      tabs.forEach(t => t.classList.remove('active'));
      sections.forEach(s => s.style.display = 'none');
      
      // Add active to current
      tab.classList.add('active');
      const targetId = tab.getAttribute('data-target');
      document.getElementById(targetId).style.display = 'block';
    });
  });
}

// Simple Form Validation (Registration)
function initForms() {
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      
      if (!email.endsWith('.edu.eg') && !email.endsWith('.edu')) {
        alert('عفواً، يجب استخدام بريد جامعي ينتهي بـ .edu أو .edu.eg');
        return;
      }
      
      alert('تم التسجيل بنجاح! سيتم تحويلك إلى لوحة التحكم.');
      window.location.href = 'dashboard.html';
    });
  }
  
  const addToolForm = document.getElementById('add-tool-form');
  if (addToolForm) {
    addToolForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('تم إضافة الأداة بنجاح وستظهر بعد مراجعة الإدارة.');
      window.location.href = 'dashboard.html';
    });
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  renderFeaturedTools();
  renderSearchTools();
  renderProductDetail();
  initDashboardTabs();
  initForms();
});
