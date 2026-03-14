// ── NEXUS JOB PORTAL – Core JS ──────────────────────────────────────

// ── DATA STORE ──────────────────────────────────────────────────────
const Store = {
  get(key) { try { return JSON.parse(localStorage.getItem('nexus_' + key)); } catch { return null; } },
  set(key, val) { localStorage.setItem('nexus_' + key, JSON.stringify(val)); },
  remove(key) { localStorage.removeItem('nexus_' + key); }
};

// ── AUTH ─────────────────────────────────────────────────────────────
const Auth = {
  currentUser() { return Store.get('user'); },
  isLoggedIn() { return !!Store.get('user'); },
  signup(data) {
    const users = Store.get('users') || [];
    if (users.find(u => u.email === data.email)) return { ok: false, msg: 'Email already registered.' };
    const user = { ...data, id: Date.now(), avatar: data.name[0].toUpperCase(), createdAt: new Date().toISOString(), applications: [], bookmarks: [] };
    users.push(user);
    Store.set('users', users);
    Store.set('user', user);
    return { ok: true };
  },
  login(email, password) {
    const users = Store.get('users') || [];
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return { ok: false, msg: 'Invalid email or password.' };
    Store.set('user', user);
    return { ok: true };
  },
  logout() { Store.remove('user'); window.location.href = 'login.html'; },
  updateUser(updates) {
    const user = this.currentUser();
    if (!user) return;
    const updated = { ...user, ...updates };
    Store.set('user', updated);
    const users = Store.get('users') || [];
    const idx = users.findIndex(u => u.id === user.id);
    if (idx > -1) { users[idx] = updated; Store.set('users', users); }
    return updated;
  },
  addApplication(job) {
    const user = this.currentUser();
    if (!user) return false;
    const apps = user.applications || [];
    if (apps.find(a => a.jobId === job.id)) return 'already';
    apps.push({ jobId: job.id, jobTitle: job.title, company: job.company, type: job.type, stipend: job.salary, domain: job.category, logo: job.logo, appliedAt: new Date().toISOString(), status: 'pending' });
    this.updateUser({ applications: apps });
    return true;
  },
  toggleBookmark(jobId) {
    const user = this.currentUser();
    if (!user) return;
    const bm = user.bookmarks || [];
    const idx = bm.indexOf(jobId);
    if (idx > -1) bm.splice(idx, 1); else bm.push(jobId);
    this.updateUser({ bookmarks: bm });
    return idx === -1;
  }
};

// ── JOB DATA ─────────────────────────────────────────────────────────
const JOBS = [
  { id: 1, title: 'Frontend Developer', company: 'TechNova Inc.', logo: '🚀', logoColor: '#6c63ff', category: 'Engineering', type: 'Full-time', mode: 'Remote', salary: '₹8–14 LPA', location: 'Bengaluru', experience: '2–4 yrs', deadline: '2025-07-15', posted: '2 days ago', featured: true, description: 'We are seeking a talented Frontend Developer to join our growing engineering team. You will build responsive and performant web applications using modern technologies.', responsibilities: ['Build reusable, testable, and efficient code', 'Translate designs into high-quality code', 'Collaborate with backend teams via APIs', 'Optimize applications for maximum speed and scalability', 'Participate in code reviews and maintain standards'], requirements: ['3+ years React/Vue.js experience', 'Strong knowledge of HTML5, CSS3, JavaScript (ES6+)', 'Experience with REST APIs and Git', 'Understanding of responsive design principles'], skills: ['React', 'TypeScript', 'Tailwind CSS', 'REST API', 'Git'] },
  { id: 2, title: 'Data Science Intern', company: 'Analytics Pro', logo: '📊', logoColor: '#ff6584', category: 'Data Science', type: 'Internship', mode: 'Hybrid', salary: '₹15,000/mo', location: 'Mumbai', experience: 'Fresher', deadline: '2025-06-30', posted: '1 day ago', featured: true, description: 'Join our data science team and work on cutting-edge machine learning projects. This is a 6-month internship with possibility of full-time conversion.', responsibilities: ['Analyze large datasets using Python and SQL', 'Build and evaluate ML models', 'Create data visualizations and dashboards', 'Present insights to stakeholders'], requirements: ['Pursuing B.Tech/M.Tech in CS or related field', 'Knowledge of Python, Pandas, NumPy', 'Basic understanding of ML algorithms', 'Good analytical and problem-solving skills'], skills: ['Python', 'Machine Learning', 'SQL', 'Pandas', 'Jupyter'] },
  { id: 3, title: 'UI/UX Designer', company: 'Pixel Studio', logo: '🎨', logoColor: '#43e97b', category: 'Design', type: 'Full-time', mode: 'Remote', salary: '₹6–10 LPA', location: 'Pune', experience: '1–3 yrs', deadline: '2025-07-01', posted: '3 days ago', featured: false, description: 'Create stunning and user-centered designs for web and mobile applications. Work closely with product and engineering teams to deliver exceptional user experiences.', responsibilities: ['Design wireframes, prototypes, and high-fidelity mockups', 'Conduct user research and usability testing', 'Maintain and evolve design systems', 'Collaborate with developers for implementation'], requirements: ['Proficiency in Figma/Sketch', '1+ year of product design experience', 'Strong portfolio demonstrating UX thinking', 'Understanding of front-end development basics'], skills: ['Figma', 'Prototyping', 'User Research', 'Design Systems', 'Adobe XD'] },
  { id: 4, title: 'Backend Developer', company: 'CloudBase', logo: '☁️', logoColor: '#f7b731', category: 'Engineering', type: 'Full-time', mode: 'Onsite', salary: '₹10–18 LPA', location: 'Hyderabad', experience: '3–5 yrs', deadline: '2025-07-20', posted: '5 days ago', featured: false, description: 'Build and scale our microservices architecture handling millions of requests daily. Passionate engineers who love solving distributed systems challenges needed.', responsibilities: ['Design and build scalable RESTful APIs', 'Manage databases and caching layers', 'Work on cloud infrastructure and CI/CD pipelines', 'Code reviews and mentoring juniors'], requirements: ['Strong experience with Node.js or Python', 'Knowledge of databases (PostgreSQL, MongoDB)', 'Experience with Docker and Kubernetes', 'AWS/GCP cloud experience preferred'], skills: ['Node.js', 'PostgreSQL', 'Docker', 'AWS', 'Redis'] },
  { id: 5, title: 'ML Engineering Intern', company: 'NeuralWave AI', logo: '🤖', logoColor: '#9b8fff', category: 'AI/ML', type: 'Internship', mode: 'Remote', salary: '₹20,000/mo', location: 'Remote', experience: 'Fresher/1yr', deadline: '2025-06-25', posted: 'Today', featured: true, description: 'Work at the cutting edge of AI! Help build and deploy ML models that power our AI-driven products. Great learning opportunity with top engineers.', responsibilities: ['Train and fine-tune ML models', 'Build data pipelines', 'Implement model deployment infrastructure', 'Research and implement new techniques'], requirements: ['Knowledge of deep learning frameworks (PyTorch/TensorFlow)', 'Good Python skills', 'Familiarity with NLP/CV basics', 'Research mindset'], skills: ['PyTorch', 'TensorFlow', 'Python', 'NLP', 'Computer Vision'] },
  { id: 6, title: 'Product Manager', company: 'Startup Hub', logo: '💼', logoColor: '#60cdff', category: 'Product', type: 'Full-time', mode: 'Hybrid', salary: '₹12–20 LPA', location: 'Bengaluru', experience: '3–6 yrs', deadline: '2025-07-30', posted: '1 week ago', featured: false, description: 'Drive product strategy and roadmap for our SaaS platform. Work cross-functionally with engineering, design, and business teams to build products users love.', responsibilities: ['Define product vision and roadmap', 'Gather and prioritize product requirements', 'Work with engineering teams on delivery', 'Analyze product metrics and user feedback'], requirements: ['3+ years product management experience', 'Strong analytical and communication skills', 'Experience with agile methodologies', 'Technical background preferred'], skills: ['Product Strategy', 'Agile', 'Data Analysis', 'Roadmapping', 'Stakeholder Management'] },
  { id: 7, title: 'DevOps Engineer', company: 'Infra360', logo: '⚙️', logoColor: '#ff9d6c', category: 'Engineering', type: 'Full-time', mode: 'Onsite', salary: '₹9–16 LPA', location: 'Chennai', experience: '2–4 yrs', deadline: '2025-07-10', posted: '4 days ago', featured: false, description: 'Join our infrastructure team and help build reliable, scalable systems. You will manage our cloud infrastructure and improve developer experience.', responsibilities: ['Manage CI/CD pipelines', 'Maintain Kubernetes clusters', 'Monitor and improve system reliability', 'Security hardening and compliance'], requirements: ['Experience with Docker and Kubernetes', 'Proficiency in scripting (Bash, Python)', 'AWS/Azure/GCP certifications preferred', 'Knowledge of monitoring tools (Grafana, Prometheus)'], skills: ['Kubernetes', 'Docker', 'Terraform', 'CI/CD', 'Linux'] },
  { id: 8, title: 'Marketing Intern', company: 'GrowthX', logo: '📈', logoColor: '#ffd93d', category: 'Marketing', type: 'Internship', mode: 'Remote', salary: '₹10,000/mo', location: 'Remote', experience: 'Fresher', deadline: '2025-06-20', posted: '2 days ago', featured: false, description: 'Join our growth marketing team and learn digital marketing from industry experts. Help us grow our user base through data-driven campaigns.', responsibilities: ['Manage social media accounts', 'Assist with content creation and SEO', 'Analyze marketing campaign performance', 'Research and identify growth opportunities'], requirements: ['Interest in digital marketing', 'Good written communication', 'Basic knowledge of social media platforms', 'Analytical mindset'], skills: ['Social Media', 'Content Writing', 'SEO', 'Google Analytics', 'Canva'] }
];

// ── TOAST ────────────────────────────────────────────────────────────
function toast(msg, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = `<span>${icons[type]}</span><span>${msg}</span>`;
  container.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity 0.3s'; setTimeout(() => t.remove(), 300); }, 3500);
}

// ── NAV HIGHLIGHT ────────────────────────────────────────────────────
function setActiveNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });
}

// ── AUTH GUARD ───────────────────────────────────────────────────────
function requireAuth() {
  if (!Auth.isLoggedIn()) { window.location.href = 'login.html'; return false; }
  return true;
}

// ── RENDER NAV BASED ON AUTH ─────────────────────────────────────────
function renderNavAuth() {
  const el = document.getElementById('nav-auth');
  if (!el) return;
  if (Auth.isLoggedIn()) {
    const u = Auth.currentUser();
    el.innerHTML = `
      <a href="dashboard.html" class="btn btn-ghost btn-sm">Dashboard</a>
      <div style="width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,var(--accent),var(--accent2));display:flex;align-items:center;justify-content:center;font-weight:800;font-size:15px;cursor:pointer;" onclick="window.location.href='dashboard.html'">${u.avatar}</div>
    `;
  } else {
    el.innerHTML = `
      <a href="login.html" class="btn btn-outline btn-sm">Log In</a>
      <a href="signup.html" class="btn btn-primary btn-sm">Sign Up</a>
    `;
  }
}

// ── JOB CARD HTML ────────────────────────────────────────────────────
function jobCardHTML(job, bookmarked = false) {
  return `
    <a href="jobdetail.html?id=${job.id}" class="job-card">
      <div class="job-card-header">
        <div class="company-logo" style="background:${job.logoColor}22;">${job.logo}</div>
        <div class="job-bookmark ${bookmarked ? 'bookmarked' : ''}" onclick="event.preventDefault();toggleBookmark(${job.id},this)" title="Bookmark">
          ${bookmarked ? '🔖' : '🔗'}
        </div>
      </div>
      <div class="job-title">${job.title}</div>
      <div class="job-company">🏢 ${job.company} · ${job.location}</div>
      <div class="job-tags">
        <span class="tag ${job.mode.toLowerCase().replace(' ','-')}">${job.mode}</span>
        <span class="tag ${job.type.toLowerCase().replace('-','')}">${job.type}</span>
        <span class="tag">${job.category}</span>
      </div>
      <div class="job-card-footer">
        <span class="job-salary">${job.salary}</span>
        <span class="job-date">🕐 ${job.posted}</span>
      </div>
    </a>
  `;
}

function toggleBookmark(jobId, el) {
  if (!Auth.isLoggedIn()) { toast('Please login to bookmark jobs', 'warning'); window.location.href = 'login.html'; return; }
  const added = Auth.toggleBookmark(jobId);
  el.innerHTML = added ? '🔖' : '🔗';
  toast(added ? 'Job bookmarked!' : 'Bookmark removed', added ? 'success' : 'info');
}

// ── PDF OFFER LETTER GENERATOR ───────────────────────────────────────
function generateOfferLetter(user, job) {
  const date = new Date().toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' });
  const startDate = new Date(Date.now() + 7 * 86400000).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' });
  const endDate = new Date(Date.now() + 187 * 86400000).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' });

  const isInternship = job.type === 'Internship';
  const letterHTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: 'Times New Roman', serif; color: #1a1a1a; background: #fff; padding: 50px; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; padding-bottom: 24px; border-bottom: 3px solid #6c63ff; }
  .logo-area { display: flex; flex-direction: column; gap: 4px; }
  .logo-name { font-size: 28px; font-weight: 900; color: #6c63ff; letter-spacing: -1px; font-family: Arial, sans-serif; }
  .logo-sub { font-size: 12px; color: #666; font-family: Arial, sans-serif; }
  .doc-id { font-size: 12px; color: #888; text-align: right; font-family: Arial, sans-serif; }
  .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%) rotate(-45deg); font-size: 80px; font-weight: 900; color: rgba(108,99,255,0.06); font-family: Arial, sans-serif; pointer-events: none; z-index: -1; }
  .date-line { text-align: right; margin-bottom: 32px; font-size: 14px; color: #555; }
  .greeting { font-size: 16px; margin-bottom: 20px; }
  .offer-box { background: linear-gradient(135deg, #f0eeff, #fff); border: 2px solid #6c63ff; border-radius: 12px; padding: 28px; margin: 28px 0; }
  .offer-box h2 { font-size: 22px; color: #6c63ff; margin-bottom: 20px; text-align: center; text-transform: uppercase; letter-spacing: 2px; }
  .detail-table { width: 100%; border-collapse: collapse; }
  .detail-table tr td { padding: 10px 0; border-bottom: 1px solid rgba(108,99,255,0.1); font-size: 14px; }
  .detail-table tr td:first-child { font-weight: 700; color: #444; width: 200px; }
  .detail-table tr td:last-child { color: #6c63ff; font-weight: 600; }
  .body-text { font-size: 14px; line-height: 1.8; color: #333; margin-bottom: 16px; }
  .highlight { color: #6c63ff; font-weight: 700; }
  .sign-section { margin-top: 50px; display: flex; justify-content: space-between; }
  .sign-block { display: flex; flex-direction: column; gap: 4px; }
  .sign-name { font-weight: 700; font-size: 14px; }
  .sign-title { font-size: 12px; color: #666; }
  .sign-line { border-bottom: 2px solid #333; width: 200px; margin-bottom: 8px; height: 30px; }
  .footer-note { margin-top: 48px; padding-top: 16px; border-top: 1px solid #ddd; font-size: 11px; color: #888; text-align: center; }
  .badge { display: inline-block; background: #6c63ff; color: #fff; padding: 4px 12px; border-radius: 100px; font-size: 12px; font-weight: 700; margin-bottom: 12px; }
</style>
</head>
<body>
<div class="watermark">NEXUS</div>
<div class="header">
  <div class="logo-area">
    <div class="logo-name">⚡ NEXUS</div>
    <div class="logo-sub">Career & Talent Platform</div>
    <div class="logo-sub">jobs@nexusportal.in | +91-9876543210</div>
  </div>
  <div class="doc-id">
    <strong>Reference No:</strong> NXS-${Date.now().toString().slice(-8)}<br>
    <strong>Issued via:</strong> Nexus Job Portal<br>
    <strong>Type:</strong> ${isInternship ? 'INTERNSHIP' : 'JOB'} OFFER
  </div>
</div>

<div class="date-line">Date: ${date}</div>

<p class="greeting"><strong>Dear ${user.name},</strong></p>

<p class="body-text">We are thrilled to extend this <span class="highlight">${isInternship ? 'Internship Offer Letter' : 'Employment Offer Letter'}</span> to you on behalf of <span class="highlight">${job.company}</span>. After careful consideration of your profile and qualifications, we are pleased to welcome you to our team.</p>

<div class="offer-box">
  <div class="badge">${isInternship ? '🎓 INTERNSHIP OFFER' : '💼 EMPLOYMENT OFFER'}</div>
  <h2>${job.title}</h2>
  <table class="detail-table">
    <tr><td>Candidate Name</td><td>${user.name}</td></tr>
    <tr><td>Email Address</td><td>${user.email}</td></tr>
    <tr><td>Phone Number</td><td>${user.phone || 'N/A'}</td></tr>
    <tr><td>Company Name</td><td>${job.company}</td></tr>
    <tr><td>Role / Position</td><td>${job.title}</td></tr>
    <tr><td>Domain / Department</td><td>${job.category}</td></tr>
    <tr><td>Employment Type</td><td>${job.type}</td></tr>
    <tr><td>Work Mode</td><td>${job.mode}</td></tr>
    <tr><td>Location</td><td>${job.location}</td></tr>
    ${isInternship ? `<tr><td>Stipend</td><td>${job.salary}</td></tr>` : `<tr><td>CTC / Salary</td><td>${job.salary}</td></tr>`}
    <tr><td>Start Date</td><td>${startDate}</td></tr>
    ${isInternship ? `<tr><td>End Date</td><td>${endDate}</td></tr><tr><td>Duration</td><td>6 Months</td></tr>` : ''}
    <tr><td>Offer Valid Till</td><td>${job.deadline}</td></tr>
  </table>
</div>

<p class="body-text">
  ${isInternship
    ? `As an intern in the <strong>${job.category}</strong> domain at <strong>${job.company}</strong>, you will gain hands-on experience, work on real-world projects, and receive a monthly stipend of <span class="highlight">${job.salary}</span>. This internship is a stepping stone toward building an outstanding career.`
    : `As a <strong>${job.title}</strong> at <strong>${job.company}</strong>, you will be part of a dynamic team working on cutting-edge solutions. Your annual compensation will be <span class="highlight">${job.salary}</span> inclusive of all benefits.`
  }
</p>

<p class="body-text">This offer is contingent upon the successful completion of background verification and submission of required documents before your start date. Please accept this offer by replying to this letter or logging into the Nexus portal.</p>

<p class="body-text">We look forward to having you on board and wish you a rewarding journey with <strong>${job.company}</strong>. Welcome to the team!</p>

<div class="sign-section">
  <div class="sign-block">
    <div class="sign-line"></div>
    <div class="sign-name">HR Department</div>
    <div class="sign-title">${job.company}</div>
  </div>
  <div class="sign-block" style="text-align:right">
    <div class="sign-line"></div>
    <div class="sign-name">${user.name}</div>
    <div class="sign-title">Candidate Acceptance</div>
  </div>
</div>

<div class="footer-note">
  This offer letter was generated digitally via the Nexus Job Portal. Reference: NXS-${Date.now().toString().slice(-8)} | This document is legally valid and binding upon acceptance. | nexusportal.in
</div>
</body>
</html>`;

  const win = window.open('', '_blank');
  win.document.write(letterHTML);
  win.document.close();
  setTimeout(() => win.print(), 500);
}

// ── INIT ON EACH PAGE ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  setActiveNav();
  renderNavAuth();
});
