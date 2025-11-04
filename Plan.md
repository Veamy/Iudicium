# Розподіл Задач на Команду (2 тижні)

## 👤 Shapitohin 1: Backend + AI Integration Lead

### Тиждень 1
**День 1-2: Архітектура та Setup**
- [ ] Setup проекту (Python FastAPI/Flask)
- [ ] Конфігурація Ollama + Gemma 3
- [ ] Дизайн API endpoints
- [ ] Setup Docker для локального деплою

**День 3-4: Core Backend**
- [ ] Реалізація REST API
  - POST /candidates - створення профілю
  - GET /candidates/{id} - отримання даних
  - POST /analyze - запуск аналізу
- [ ] Інтеграція з векторною БД (від Dev 2)
- [ ] Middleware для обробки файлів

**День 5-6: AI Integration**
- [ ] Ollama API клієнт
- [ ] Промпти для Gemma 3:
  - Аналіз текстів резюме
  - Виявлення inconsistencies
  - Генерація summary
- [ ] Кешування AI відповідей

**День 7: Testing**
- [ ] Тестування AI pipeline
- [ ] Документація endpoints

### Тиждень 2
**День 8-9: Risk Analysis Engine**
- [ ] Алгоритм розрахунку Integrity Score:
  ```
  Score = (Experience * 0.3) + 
          (Consistency * 0.25) + 
          (Education * 0.2) + 
          (Reputation * 0.15) + 
          (AI_Analysis * 0.1)
  ```
- [ ] Детектори ризиків:
  - Career gaps detector
  - Frequent job changes (<1yr)
  - Qualification mismatch
- [ ] Система вагових коефіцієнтів

**День 10-11: Report Generation**
- [ ] PDF генератор (ReportLab/WeasyPrint)
- [ ] Темплейти звітів
- [ ] Comparison engine (2+ кандидати)

**День 12-13: Integration & Optimization**
- [ ] Інтеграція з фронтендом
- [ ] Оптимізація AI запитів
- [ ] Offline mode logic

**День 14: Final Testing**
- [ ] End-to-end тестування
- [ ] Performance optimization
- [ ] Демо сценарії

---

## 👤 VALERIY 2: Data Processing + Vector DB Specialist

### Тиждень 1
**День 1-2: Infrastructure**
- [ ] Setup векторної БД (ChromaDB/Milvus/FAISS)
- [ ] Дизайн схеми даних:
  ```json
  {
    "candidate_id": "uuid",
    "personal_info": {},
    "experience": [],
    "education": [],
    "documents": [],
    "embeddings": []
  }
  ```
- [ ] Імплементація CRUD операцій

**День 3-4: Document Parser Module**
- [ ] PDF parser (PyPDF2/pdfplumber)
- [ ] DOCX parser (python-docx)
- [ ] Structured data extractor:
  - Dates extraction
  - Job titles/positions
  - Organizations
  - Education records
- [ ] Resume parser (entity recognition)

**День 5-6: Embeddings Pipeline**
- [ ] Використання Gemma 3 для embeddings
- [ ] Векторизація документів
- [ ] Semantic search функціонал
- [ ] Indexing strategy

**День 7: Data Validation**
- [ ] Валідація дат (перевірка послідовності)
- [ ] Виявлення дублікатів
- [ ] Data cleaning pipeline

### Тиждень 2
**День 8-9: Web Scraping Module**
- [ ] LinkedIn scraper (якщо є публічний профіль)
- [ ] Facebook/social media basic info
- [ ] Публічні бази даних (якщо доступні):
  - Реєстр декларацій
  - Судові реєстри (API)
- [ ] Rate limiting + ethical scraping
- [ ] Data enrichment pipeline

**День 10-11: Advanced Analytics**
- [ ] Career trajectory analyzer:
  - Promotion speed
  - Industry switches
  - Responsibility growth
- [ ] Pattern detection:
  - Similar past candidates
  - Anomaly detection
- [ ] Timeline builder

**День 12-13: Search & Filtering**
- [ ] Semantic search across candidates
- [ ] Фільтри (посада, досвід, освіта)
- [ ] Bulk operations
- [ ] Export functionality (JSON/CSV)

**День 14: Data Testing**
- [ ] Тестові датасети
- [ ] Accuracy валідація
- [ ] Stress testing БД

---

## 👤 СКРОМНЕ БОЖЕСТКО 3: Frontend + UX Lead

### Тиждень 1
**День 1-2: Setup & Design**
- [ ] Setup React/Vue/Svelte проекту
- [ ] UI/UX wireframes (Figma/paper)
- [ ] Дизайн система:
  - Кольорова палітра (професійна)
  - Typography
  - Component library
- [ ] Routing structure

**День 3-4: Core Pages (Skeleton)**
- [ ] Landing/Dashboard page
- [ ] Candidate input form:
  - Personal info
  - File upload (drag-n-drop)
  - Manual data entry
- [ ] Навігація та layout

**День 5-6: Data Input Components**
- [ ] Multi-step форма:
  1. Основні дані
  2. Досвід (dynamic fields)
  3. Освіта
  4. Документи
- [ ] Validation (client-side)
- [ ] Progress indicator
- [ ] File upload з preview## Technologies Used


**День 7: API Integration Start**
- [ ] Axios/Fetch setup
- [ ] API service layer
- [ ] Loading states
- [ ] Error handling

### Тиждень 2
**День 8-9: Visual Trust Dashboard**
- [ ] Spider/Radar chart (Chart.js/Recharts):
  ```
  Осі:
  - Професійність
  - Доброчесність
  - Відповідальність
  - Управлінська зрілість
  - Надійність
  ```
- [ ] Risk heatmap (цветова індикація)
- [ ] Career timeline visualization:
  - Horizontal timeline
  - Positions as nodes
  - Gaps highlighted
  - Duration indicators

**День 10-11: Analysis Results Page**
- [ ] Integrity Score display (gauge chart)
- [ ] Tabbed interface:
  - Overview
  - Experience
  - Risks
  - AI Insights
  - Comparison (if multiple)
- [ ] Interactive elements:
  - Розкладні секції
  - Tooltips з поясненнями
  - Drill-down в деталі

**День 12: Advanced Features**
- [ ] Candidates comparison view (side-by-side)
- [ ] Export buttons (PDF/JSON)
- [ ] Search/filter candidates list
- [ ] Sorting та pagination

**День 13: Polish & Responsiveness**
- [ ] Mobile adaptація
- [ ] Dark/Light theme (опційно)
- [ ] Animations та transitions
- [ ] Accessibility (a11y basics)

**День 14: Final UX**
- [ ] User testing сценарії
- [ ] Bug fixes
- [ ] Performance optimization
- [ ] Demo flow preparation

---

## 🔧 СПІЛЬНІ ЗАДАЧІ (Daily Standups)

### Щоденно (15 хв):
- Sync прогресу
- Blocker розв'язання
- API contract узгодження

### День 7 (Mid-Sprint Review):
- Демо поточного прогресу
- Adjust priorities
- Integration testing

### День 14 (Final):
- Загальна інтеграція
- Презентація підготовка
- Deploy та демо

---

## 📦 TECH STACK

**Backend (Dev 1):**
- Python 3.10+
- FastAPI
- Ollama (Gemma 3)
- Pydantic
- ReportLab

**Data Layer (Dev 2):**
- ChromaDB / FAISS
- Scrapy / BeautifulSoup
- spaCy / transformers
- pandas

**Frontend (Dev 3):**
- React 18 / Vue 3
- TailwindCSS
- Chart.js / Recharts
- Axios

**Shared:**
- Docker
- Git/GitHub
- Postman (API testing)

---

## 🎯 SUCCESS METRICS

- ✅ Обробка 1 кандидата за <30 сек
- ✅ Accuracy аналізу >85%
- ✅ Повна офлайн робота
- ✅ Інтуїтивний UX (<5 хв навчання)
- ✅ Готовий PDF звіт за 1 клік

---

## ⚠️ RISKS & MITIGATION

| Risk | Mitigation |
|------|------------|
| Ollama setup складний | Pre-test на Day 1, fallback на OpenAI API |
| Web scraping блокується | Focus на document parsing, scraping - bonus |
| AI hallucinations | Multiple prompts validation, confidence scores |
| Time overrun | Cut features: порівняння кандидатів, тестування |

---

## 📊 DELIVERABLES (День 14)

1. ✅ Робочий MVP
2. ✅ Демо відео (3 хв)
3. ✅ GitHub repo + README
4. ✅ Architecture diagram
5. ✅ Презентація (10-15 слайдів)
