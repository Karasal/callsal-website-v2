
export const getDemoContent = (id: number): string => {
  const commonHeader = `
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Google+Sans:wght@400;500;700&display=swap" rel="stylesheet">
    <style>
      :root { 
        --md-primary: #1a73e8; 
        --md-secondary: #5f6368; 
        --md-success: #1e8e3e;
        --md-error: #d93025;
        --md-warning: #f9ab00;
        --md-surface: #ffffff;
        --md-background: #f8f9fa;
      }
      body { 
        font-family: 'Roboto', 'Google Sans', sans-serif; 
        background-color: var(--md-background); 
        color: #202124;
        margin: 0; padding: 0; 
        overflow-x: hidden; height: 100vh;
      }
      /* Hide system cursor to allow parent custom cursor to take over */
      html, body, button, a, [role="button"], input, select, textarea, * { 
        cursor: none !important; 
      }
      .md-card { 
        background: white; 
        border-radius: 8px; 
        box-shadow: 0 1px 2px 0 rgba(60,64,67,.30), 0 1px 3px 1px rgba(60,64,67,.15);
        transition: box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .md-card:hover { 
        box-shadow: 0 1px 3px 0 rgba(60,64,67,.30), 0 4px 8px 3px rgba(60,64,67,.15);
      }
      .md-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0 16px;
        height: 36px;
        border-radius: 4px;
        font-weight: 500;
        font-size: 13px;
        letter-spacing: .25px;
        cursor: none;
        transition: all 0.2s;
        border: none;
        white-space: nowrap;
      }
      .md-button-primary { background: var(--md-primary); color: white; }
      .md-button-primary:hover { background: #1765cc; }
      .md-button-outline { background: transparent; border: 1px solid #dadce0; color: var(--md-primary); }
      .md-button-outline:hover { background: #f8f9fa; }
      
      .status-chip {
        padding: 4px 10px;
        border-radius: 16px;
        font-size: 11px;
        font-weight: 500;
        white-space: nowrap;
      }
      
      @keyframes pulse-ring {
        0% { transform: scale(.33); opacity: 1; }
        80%, 100% { opacity: 0; }
      }
      .pulse-dot {
        position: relative; width: 100%; height: 100%; background-color: var(--md-success); border-radius: 50%;
      }
      .pulse-dot.warning { background-color: var(--md-warning); }
      .pulse-container {
        position: absolute; width: 12px; height: 12px;
      }
      .pulse-container::before {
        content: ''; position: absolute; display: block; width: 300%; height: 300%; box-sizing: border-box; margin-left: -100%; margin-top: -100%; border-radius: 45px; background-color: inherit; animation: pulse-ring 1.25s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
      }
      
      ::-webkit-scrollbar { width: 4px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: #dadce0; border-radius: 10px; }

      .sidebar-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 12px;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 500;
        color: #5f6368;
        cursor: none;
        transition: background 0.2s;
        white-space: nowrap;
      }
      .sidebar-item:hover { background: #f1f3f4; }
      .sidebar-item.active { background: #e8f0fe; color: #1a73e8; }
    </style>
    <script>
      // Cursor Event Relay for Parent Application
      window.addEventListener('mousemove', e => {
        window.parent.postMessage({ type: 'sal-cursor-move', x: e.clientX, y: e.clientY }, '*');
      });
      window.addEventListener('mousedown', () => window.parent.postMessage({ type: 'sal-cursor-down' }, '*'));
      window.addEventListener('mouseup', () => window.parent.postMessage({ type: 'sal-cursor-up' }, '*'));
      window.addEventListener('mouseover', e => {
        const isHovering = e.target.closest('button, a, [role="button"], select, input, textarea') !== null;
        window.parent.postMessage({ type: 'sal-cursor-hover', hovering: isHovering }, '*');
      });
    </script>
  `;

  const demos: Record<number, { title: string, html: string }> = {
    1: {
      title: "SALSPEND",
      html: `
        <div class="flex h-screen bg-[#0a0a0a] text-white flex-col lg:flex-row overflow-hidden">
          <!-- Sidebar -->
          <div class="hidden lg:flex w-64 bg-[#141414] border-r border-white/5 flex-col p-6">
            <div class="flex items-center gap-3 mb-12">
              <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black">S</div>
              <span class="font-bold text-xl tracking-tighter">SALSPEND</span>
            </div>
            <nav class="space-y-2 flex-1">
              <div class="sidebar-item active" style="background: rgba(255,255,255,0.05); color: white;" onclick="switchSalTab('dashboard')">
                Dashboard
              </div>
              <div class="sidebar-item" style="color: rgba(255,255,255,0.5);" onclick="switchSalTab('transactions')">
                Transactions
              </div>
              <div class="sidebar-item" style="color: rgba(255,255,255,0.5);" onclick="switchSalTab('insights')">
                AI Analytics
              </div>
            </nav>
            <div class="mt-auto p-4 bg-blue-600/10 border border-blue-600/20 rounded-xl">
               <p class="text-[9px] font-black text-blue-400 uppercase mb-1">Subscription Audit</p>
               <p class="text-xs font-medium">3 wasteful leaks found.</p>
            </div>
          </div>

          <!-- Main Content -->
          <div class="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
            <header class="h-16 border-b border-white/5 px-8 flex items-center justify-between shrink-0 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-30">
              <h2 class="text-lg font-bold">Financial Health Overview</h2>
              <div class="flex gap-4">
                <button class="md-button md-button-primary h-9" onclick="openExpenseModal()">+ Add Expense</button>
              </div>
            </header>

            <main class="p-8 space-y-8">
              <!-- Dashboard Content -->
              <div id="sal-dashboard" class="space-y-8">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div class="bg-[#141414] border border-white/5 p-6 rounded-2xl">
                    <p class="text-[10px] font-black text-gray-500 uppercase mb-2">Total Monthly Spend</p>
                    <p class="text-3xl font-black text-white" id="total-spend">$4,281.40</p>
                  </div>
                  <div class="bg-[#141414] border border-white/5 p-6 rounded-2xl">
                    <p class="text-[10px] font-black text-gray-500 uppercase mb-2">AI Savings Found</p>
                    <p class="text-3xl font-black text-green-500">+$142.10</p>
                  </div>
                  <div class="bg-[#141414] border border-white/5 p-6 rounded-2xl">
                    <p class="text-[10px] font-black text-gray-500 uppercase mb-2">Burn Rate</p>
                    <p class="text-3xl font-black text-orange-500">High</p>
                  </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div class="lg:col-span-8 bg-[#141414] border border-white/5 p-8 rounded-2xl">
                    <h3 class="text-xs font-black text-gray-500 uppercase mb-8 tracking-widest">Spending Trend</h3>
                    <div class="h-48 flex items-end gap-2">
                       ${[40, 60, 45, 90, 80, 55, 70, 85, 95, 100, 75, 60, 50, 40].map(v => `
                          <div class="bg-blue-600 rounded-t w-full" style="height: ${v}%"></div>
                       `).join('')}
                    </div>
                  </div>
                  <div class="lg:col-span-4 bg-blue-600 text-white p-8 rounded-2xl flex flex-col justify-between shadow-2xl shadow-blue-600/20">
                    <div>
                      <h3 class="text-lg font-black mb-4 uppercase">Sal's AI Insight</h3>
                      <p class="text-sm font-medium leading-relaxed opacity-90 italic">
                        "Hey neighbor! You're spending $42/mo on a LinkedIn Premium subscription you haven't used since October. Should I cancel it?"
                      </p>
                    </div>
                    <button class="w-full bg-white text-blue-600 font-black py-4 rounded-xl text-[10px] uppercase tracking-widest mt-8" onclick="alert('Cancelling subscription...')">EXECUTE CANCELLATION</button>
                  </div>
                </div>

                <div class="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden">
                  <div class="p-6 border-b border-white/5 flex justify-between items-center">
                    <h3 class="text-xs font-black text-gray-500 uppercase tracking-widest">Recent Transactions</h3>
                  </div>
                  <div class="divide-y divide-white/5" id="tx-list">
                    <div class="p-4 flex items-center justify-between hover:bg-white/[0.02]">
                       <div class="flex items-center gap-4">
                         <div class="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-xs font-bold text-blue-400">AMZ</div>
                         <div><p class="font-bold text-sm">Amazon Services</p><p class="text-[10px] text-gray-500">Shopping // 2m ago</p></div>
                       </div>
                       <p class="font-black text-white">-$104.20</p>
                    </div>
                    <div class="p-4 flex items-center justify-between hover:bg-white/[0.02]">
                       <div class="flex items-center gap-4">
                         <div class="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-xs font-bold text-green-400">NFLX</div>
                         <div><p class="font-bold text-sm">Netflix</p><p class="text-[10px] text-gray-500">Subscription // Today</p></div>
                       </div>
                       <p class="font-black text-white">-$18.99</p>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>

          <!-- Add Expense Modal -->
          <div id="expense-modal" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center opacity-0 pointer-events-none transition-all duration-300">
            <div class="bg-[#1a1a1a] border border-white/10 w-full max-w-md rounded-2xl p-8 space-y-6 transform scale-90 transition-all duration-300" id="expense-modal-content">
               <h3 class="text-2xl font-black tracking-tighter">Log Expense</h3>
               <div class="space-y-4">
                 <div>
                   <label class="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Merchant Name</label>
                   <input type="text" id="exp-name" class="w-full bg-white/5 border-none p-4 rounded-xl text-sm outline-none focus:ring-1 focus:ring-blue-500" placeholder="e.g. Starbucks">
                 </div>
                 <div>
                   <label class="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Amount ($)</label>
                   <input type="number" id="exp-amt" class="w-full bg-white/5 border-none p-4 rounded-xl text-sm outline-none focus:ring-1 focus:ring-blue-500" placeholder="0.00">
                 </div>
                 <button class="w-full bg-blue-600 font-black py-4 rounded-xl uppercase text-xs tracking-[0.2em]" onclick="addExpense()">Record Transaction</button>
                 <button class="w-full text-gray-500 text-[10px] font-black uppercase" onclick="closeExpenseModal()">Cancel</button>
               </div>
            </div>
          </div>
        </div>

        <script>
          let totalSpent = 4281.40;
          
          function switchSalTab(id) {
             alert('Simulating tab switch to: ' + id.toUpperCase());
          }

          function openExpenseModal() {
            document.getElementById('expense-modal').classList.remove('opacity-0', 'pointer-events-none');
            document.getElementById('expense-modal-content').classList.remove('scale-90');
          }

          function closeExpenseModal() {
            document.getElementById('expense-modal').classList.add('opacity-0', 'pointer-events-none');
            document.getElementById('expense-modal-content').classList.add('scale-90');
          }

          function addExpense() {
            const name = document.getElementById('exp-name').value;
            const amt = parseFloat(document.getElementById('exp-amt').value);
            
            if(!name || isNaN(amt)) return;

            // Update Total
            totalSpent += amt;
            document.getElementById('total-spend').innerText = '$' + totalSpent.toFixed(2);

            // Add to list
            const list = document.getElementById('tx-list');
            const row = document.createElement('div');
            row.className = 'p-4 flex items-center justify-between bg-blue-500/5 animate-pulse';
            row.innerHTML = \`
               <div class="flex items-center gap-4">
                 <div class="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-xs font-bold text-blue-400">\${name.substring(0,3).toUpperCase()}</div>
                 <div><p class="font-bold text-sm">\${name}</p><p class="text-[10px] text-gray-500">General // Just Now</p></div>
               </div>
               <p class="font-black text-white">-\$\${amt.toFixed(2)}</p>
            \`;
            list.insertBefore(row, list.firstChild);
            
            closeExpenseModal();
            
            // AI reaction
            setTimeout(() => {
              alert("SAL'S AI: I've logged that " + name + " transaction. Keep an eye on your Daily Food limit!");
              row.classList.remove('animate-pulse', 'bg-blue-500/5');
            }, 1000);
          }
        </script>
      `
    },
    2: {
      title: "RockyView Realty Dash",
      html: `
        <div class="flex h-screen bg-gray-50 flex-col lg:flex-row overflow-hidden">
          <!-- Desktop Sidebar -->
          <div class="hidden lg:flex w-72 bg-white border-r border-gray-200 flex-col shrink-0">
            <div class="p-8">
              <h1 class="text-2xl font-bold text-blue-600 flex items-center gap-2">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                RockyView
              </h1>
            </div>
            <nav class="flex-1 px-4 space-y-2">
              <div class="sidebar-item active" data-section="leads" onclick="switchSection('leads')">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                Leads Funnel
              </div>
              <div class="sidebar-item" data-section="listings" onclick="switchSection('listings')">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                Listings Manager
              </div>
              <div class="sidebar-item" data-section="analytics" onclick="switchSection('analytics')">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                Tour Analytics
              </div>
            </nav>
            <div class="p-6 border-t border-gray-200">
              <div class="bg-blue-600 text-white p-4 rounded-xl shadow-lg shadow-blue-500/20">
                <p class="text-[10px] font-bold opacity-80 uppercase mb-2 tracking-widest">AI Concierge Active</p>
                <p class="text-xs leading-snug" id="ai-status-text">Monitoring 12 live inquiries.</p>
              </div>
            </div>
          </div>
          
          <!-- Mobile Header -->
          <div class="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between z-30">
            <span class="font-bold text-blue-600 text-lg">RockyView</span>
            <div class="flex gap-1 overflow-x-auto no-scrollbar">
              <button onclick="switchSection('leads')" class="mobile-tab-btn px-3 py-1 text-[10px] font-bold bg-blue-50 text-blue-600 rounded" data-tab="leads">LEADS</button>
              <button onclick="switchSection('listings')" class="mobile-tab-btn px-3 py-1 text-[10px] font-bold text-gray-400" data-tab="listings">LISTINGS</button>
              <button onclick="switchSection('analytics')" class="mobile-tab-btn px-3 py-1 text-[10px] font-bold text-gray-400" data-tab="analytics">STATS</button>
            </div>
          </div>

          <!-- Main Content Area -->
          <div class="flex-1 flex flex-col p-4 lg:p-8 overflow-y-auto bg-gray-50">
            
            <!-- LEADS SECTION -->
            <div id="section-leads">
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                  <h2 class="text-3xl font-bold tracking-tight text-gray-900">Luxury Leads</h2>
                  <p class="text-xs text-gray-500 font-medium">Active Zone: West Springs Area</p>
                </div>
                <button class="md-button md-button-primary shadow-lg shadow-blue-500/30 px-6 h-12" onclick="openModal()">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                  New Luxury Lead
                </button>
              </div>

              <!-- Stats Cards -->
              <div class="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-8 mb-8">
                <div class="md-card p-4 lg:p-6 border-b-4 border-blue-500 bg-white">
                  <p class="text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-widest">Market Reach</p>
                  <p class="text-2xl lg:text-4xl font-black text-gray-900">14.2k</p>
                  <p class="text-[10px] text-green-600 font-bold mt-1">+12% vs last wk</p>
                </div>
                <div class="md-card p-4 lg:p-6 border-b-4 border-orange-500 bg-white">
                  <p class="text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-widest">Active Leads</p>
                  <p class="text-2xl lg:text-4xl font-black text-gray-900" id="stats-leads-count">3</p>
                  <p class="text-[10px] text-orange-600 font-bold mt-1">High conversion probability</p>
                </div>
                <div class="md-card p-4 lg:p-6 border-b-4 border-green-500 bg-white col-span-2 md:col-span-1">
                  <p class="text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-widest">Tours Booked</p>
                  <p class="text-2xl lg:text-4xl font-black text-gray-900">9</p>
                  <p class="text-[10px] text-gray-500 font-bold mt-1">Next: Elbow Park Estate</p>
                </div>
              </div>

              <!-- Leads Table -->
              <div class="md-card overflow-hidden bg-white">
                <div class="p-6 bg-white border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div class="relative w-full sm:w-64">
                    <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    <input type="text" placeholder="Search prospects..." class="w-full bg-gray-50 border-none rounded-lg py-2 pl-10 pr-4 text-xs outline-none focus:ring-2 focus:ring-blue-100" id="search-box" oninput="renderLeads()">
                  </div>
                  <div class="flex gap-2 w-full sm:w-auto">
                    <button class="flex-1 sm:flex-none text-[10px] font-bold uppercase tracking-widest text-gray-400 px-4 py-2 hover:bg-gray-50 rounded" onclick="sortLeads('score')">Sort by Score</button>
                    <button class="flex-1 sm:flex-none text-[10px] font-bold uppercase tracking-widest text-gray-400 px-4 py-2 hover:bg-gray-50 rounded" onclick="sortLeads('name')">Alphabetical</button>
                  </div>
                </div>
                <div class="overflow-x-auto">
                  <table class="w-full text-left min-w-[600px]">
                    <thead class="bg-gray-50/50 text-[9px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                      <tr>
                        <th class="p-4">Prospect Name</th>
                        <th class="p-4">Property Interest</th>
                        <th class="p-4">AI Score</th>
                        <th class="p-4">Status</th>
                        <th class="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50 text-xs" id="leads-body">
                      <!-- Rendered by JS -->
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- LISTINGS SECTION -->
            <div id="section-listings" class="hidden">
              <h2 class="text-3xl font-bold mb-8">Listings Manager</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div class="md-card overflow-hidden">
                   <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80" class="w-full h-48 object-cover" />
                   <div class="p-6">
                      <div class="flex justify-between items-start mb-2">
                        <h4 class="font-bold text-lg">Elbow River Estate</h4>
                        <span class="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[9px] font-black uppercase">ACTIVE</span>
                      </div>
                      <p class="text-gray-500 text-xs mb-4">42 Elbow River Dr, Calgary AB</p>
                      <div class="flex justify-between items-center pt-4 border-t border-gray-100">
                        <span class="font-black text-blue-600">$4.2M</span>
                        <button class="md-button md-button-outline h-8 px-4 text-[10px]">Edit Listing</button>
                      </div>
                   </div>
                </div>
                <div class="md-card overflow-hidden">
                   <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80" class="w-full h-48 object-cover" />
                   <div class="p-6">
                      <div class="flex justify-between items-start mb-2">
                        <h4 class="font-bold text-lg">Altadore Penthouse</h4>
                        <span class="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[9px] font-black uppercase">SOLD</span>
                      </div>
                      <p class="text-gray-500 text-xs mb-4">Altadore #402, Calgary AB</p>
                      <div class="flex justify-between items-center pt-4 border-t border-gray-100">
                        <span class="font-black text-blue-600">$1.8M</span>
                        <button class="md-button md-button-outline h-8 px-4 text-[10px]">View Analytics</button>
                      </div>
                   </div>
                </div>
              </div>
            </div>

            <!-- ANALYTICS SECTION -->
            <div id="section-analytics" class="hidden space-y-8">
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 class="text-3xl font-bold tracking-tight">Market Intelligence</h2>
                  <p class="text-xs text-gray-500 font-medium">Data-driven insights for West Springs Team</p>
                </div>
                <div class="flex items-center gap-3">
                  <div class="status-chip bg-green-100 text-green-700 text-[9px] font-black uppercase">AI OPTIMIZED</div>
                  <button class="md-button md-button-outline h-9 px-4 text-[10px] bg-white" onclick="location.reload()">
                    <svg class="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                    Sync Data
                  </button>
                </div>
              </div>

              <!-- Top Row Metrics -->
              <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="md-card p-6 bg-white">
                  <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Avg Lead Score</p>
                  <p class="text-3xl font-black text-blue-600">8.4<span class="text-xs text-green-500 ml-2">↑ 0.6</span></p>
                </div>
                <div class="md-card p-6 bg-white">
                  <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Time to Close</p>
                  <p class="text-3xl font-black text-gray-900">14<span class="text-xs font-normal text-gray-400 ml-1">days</span></p>
                </div>
                <div class="md-card p-6 bg-white">
                  <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Ad Spend ROI</p>
                  <p class="text-3xl font-black text-green-600">4.2x</p>
                </div>
                <div class="md-card p-6 bg-white">
                  <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Market Sentiment</p>
                  <p class="text-3xl font-black text-orange-500 uppercase">BULLISH</p>
                </div>
              </div>
              
              <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <!-- Funnel & Geo -->
                <div class="lg:col-span-8 space-y-8">
                   <div class="md-card p-8 bg-white">
                      <h3 class="text-sm font-black text-gray-800 uppercase mb-8 tracking-widest flex items-center gap-2">
                        <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>
                        Engagement Funnel
                      </h3>
                      <div class="flex flex-col gap-1 items-center">
                         <div class="w-full h-10 bg-blue-600 rounded-t-xl flex items-center justify-center text-white text-[10px] font-black tracking-widest uppercase">IMPRESSIONS: 42,400</div>
                         <div class="w-[85%] h-10 bg-blue-500 flex items-center justify-center text-white text-[10px] font-black tracking-widest uppercase">WEBSITE CLICKS: 12,100</div>
                         <div class="w-[60%] h-10 bg-blue-400 flex items-center justify-center text-white text-[10px] font-black tracking-widest uppercase">FORM SUBMITS: 2,100</div>
                         <div class="w-[30%] h-10 bg-orange-500 rounded-b-xl flex items-center justify-center text-white text-[10px] font-black tracking-widest uppercase">QUALIFIED LEADS: 284</div>
                      </div>
                   </div>

                   <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div class="md-card p-8 bg-white">
                        <h3 class="text-xs font-black text-gray-400 uppercase mb-6 tracking-widest">Quadrant Breakdown</h3>
                        <div class="space-y-6">
                          ${['South West', 'North West', 'Inner City', 'North East'].map((quad, i) => `
                            <div class="group">
                              <div class="flex justify-between items-end mb-2">
                                <span class="text-[10px] font-black text-gray-900 uppercase">${quad}</span>
                                <span class="text-xs font-black text-blue-600">${[84, 52, 61, 28][i]}%</span>
                              </div>
                              <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div class="h-full bg-blue-600 group-hover:bg-blue-400 transition-all duration-1000" style="width: ${[84, 52, 61, 28][i]}%"></div>
                              </div>
                            </div>
                          `).join('')}
                        </div>
                      </div>
                      <div class="md-card p-8 bg-white flex flex-col justify-center">
                         <h3 class="text-xs font-black text-gray-400 uppercase mb-6 tracking-widest">Forecasted Monthly ROI</h3>
                         <div class="text-6xl font-black text-gray-900 tracking-tighter mb-2">$182.4k</div>
                         <p class="text-[10px] font-black text-green-600 uppercase tracking-widest flex items-center gap-1">
                           <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                           +22% vs PREVIOUS MONTH
                         </p>
                      </div>
                   </div>
                </div>

                <!-- AI Sidebar -->
                <div class="lg:col-span-4 space-y-8">
                  <div class="md-card bg-slate-900 text-white p-8 h-full border-none shadow-2xl relative overflow-hidden group">
                    <div class="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div class="relative z-10 flex flex-col h-full">
                      <div class="flex items-center gap-4 mb-10">
                        <div class="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/40">
                          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        </div>
                        <div>
                          <p class="text-xs font-black text-blue-400 tracking-[0.2em] uppercase">SAL AI ADVISOR</p>
                          <p class="text-[8px] font-black text-white/40 uppercase tracking-[0.3em]">Neural Strategy Engine</p>
                        </div>
                      </div>

                      <div class="space-y-8 flex-1">
                        <div class="p-6 bg-white/5 rounded-2xl border border-white/10">
                           <p class="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                             <span class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                             STRATEGIC OPPORTUNITY
                           </p>
                           <p class="text-sm font-medium italic text-gray-200 leading-relaxed">
                             "Detected a cluster of high-value searches for 'Luxury Penthouse' in the Inner City. Recommend shifting 15% of SW budget to Inner City for next 7 days."
                           </p>
                        </div>

                        <div class="p-6 bg-white/5 rounded-2xl border border-white/10">
                           <p class="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-3">CONVERSION ALERT</p>
                           <p class="text-sm font-medium italic text-gray-200 leading-relaxed">
                             "Lead responsiveness drops after 4PM on Fridays. Automated SMS follow-ups scheduled for weekend buffer to maintain pipeline heat."
                           </p>
                        </div>
                      </div>

                      <div class="mt-10 pt-8 border-t border-white/10">
                        <button class="w-full py-4 bg-white text-black font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-blue-500 hover:text-white transition-all shadow-xl shadow-black/50" onclick="alert('Applying neural optimizations across all campaign sectors...')">
                          EXECUTE OPTIMIZATION
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- Add Lead Modal -->
        <div id="modal-overlay" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center opacity-0 pointer-events-none transition-opacity duration-300">
          <div class="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden transform scale-90 transition-transform duration-300" id="modal-content">
            <div class="p-8 border-b border-gray-100 flex justify-between items-center">
              <h3 class="text-2xl font-bold">New Luxury Prospect</h3>
              <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <div class="p-8 space-y-6">
              <div>
                <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Prospect Name</label>
                <input type="text" id="new-lead-name" class="w-full bg-gray-50 border-none p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 text-sm" placeholder="e.g. Sarah Connor">
              </div>
              <div>
                <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Property of Interest</label>
                <select id="new-lead-property" class="w-full bg-gray-50 border-none p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 text-sm appearance-none">
                  <option>Elbow River Estate</option>
                  <option>Altadore Penthouse</option>
                  <option>Mount Royal Modern</option>
                  <option>West Springs Family Home</option>
                </select>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                   <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Initial AI Score</label>
                   <input type="number" id="new-lead-score" class="w-full bg-gray-50 border-none p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 text-sm" value="7.5" step="0.1" max="10">
                </div>
                <div>
                   <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Status</label>
                   <select id="new-lead-status" class="w-full bg-gray-50 border-none p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 text-sm appearance-none">
                     <option value="warm">WARM</option>
                     <option value="hot">HOT</option>
                     <option value="new">NEW</option>
                   </select>
                </div>
              </div>
              <button class="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all uppercase tracking-widest text-xs" onclick="addLead()">Add Prospect to Funnel</button>
            </div>
          </div>
        </div>

        <script>
          // Local State
          let leads = [
            { id: 1, name: 'Jonathan Vance', address: '42 Elbow River Dr', score: 9.8, status: 'hot' },
            { id: 2, name: 'Linda G.', address: 'Altadore #402', score: 7.2, status: 'warm' },
            { id: 3, name: 'Marcus Sterling', address: 'West Springs #12', score: 8.5, status: 'warm' }
          ];

          function switchSection(id) {
            // Update UI
            ['section-leads', 'section-listings', 'section-analytics'].forEach(s => document.getElementById(s).classList.add('hidden'));
            document.getElementById('section-' + id).classList.remove('hidden');
            
            // Sidebar Active State
            document.querySelectorAll('.sidebar-item').forEach(item => {
              item.classList.toggle('active', item.dataset.section === id);
            });
            
            // Mobile Tab State
            document.querySelectorAll('.mobile-tab-btn').forEach(btn => {
              const active = btn.dataset.tab === id;
              btn.classList.toggle('bg-blue-50', active);
              btn.classList.toggle('text-blue-600', active);
              btn.classList.toggle('text-gray-400', !active);
            });
          }

          function renderLeads() {
            const tbody = document.getElementById('leads-body');
            const search = document.getElementById('search-box').value.toLowerCase();
            
            const filtered = leads.filter(l => 
              l.name.toLowerCase().includes(search) || 
              l.address.toLowerCase().includes(search)
            );

            tbody.innerHTML = filtered.map(lead => \`
              <tr class="hover:bg-blue-50/20 transition-colors">
                <td class="p-4">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-[10px]">
                      \${lead.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span class="font-bold text-gray-900">\${lead.name}</span>
                  </div>
                </td>
                <td class="p-4 text-gray-500 font-medium">\${lead.address}</td>
                <td class="p-4">
                  <span class="px-2 py-0.5 rounded-full text-[9px] font-black tracking-widest border \${lead.score > 9 ? 'bg-green-50 text-green-700 border-green-100' : 'bg-blue-50 text-blue-700 border-blue-100'}">
                    \${lead.score.toFixed(1)}
                  </span>
                </td>
                <td class="p-4">
                  <span class="status-chip \${lead.status === 'hot' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'} uppercase">
                    \${lead.status}
                  </span>
                </td>
                <td class="p-4 text-right space-x-2">
                  <button class="md-button md-button-primary h-7 px-3 text-[9px]" onclick="nudge(this, \${lead.id})">Nudge</button>
                  <button class="md-button md-button-outline h-7 px-2 border-red-100 text-red-500 hover:bg-red-50" onclick="deleteLead(\${lead.id})">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </td>
              </tr>
            \`).join('');

            document.getElementById('stats-leads-count').innerText = leads.length;
            document.getElementById('ai-status-text').innerText = \`Managing \${leads.length} high-intent prospects.\`;
          }

          function sortLeads(key) {
             if (key === 'score') {
                leads.sort((a,b) => b.score - a.score);
             } else {
                leads.sort((a,b) => a.name.localeCompare(b.name));
             }
             renderLeads();
          }

          function nudge(btn, id) {
            btn.innerText = 'Engaging...';
            btn.classList.add('opacity-50');
            setTimeout(() => {
              btn.innerText = 'AI Nudged ✓';
              btn.classList.remove('md-button-primary', 'opacity-50');
              btn.classList.add('bg-green-100', 'text-green-700');
              setTimeout(() => {
                btn.innerText = 'Nudge';
                btn.classList.remove('bg-green-100', 'text-green-700');
                btn.classList.add('md-button-primary');
              }, 3000);
            }, 800);
          }

          function openModal() {
            const overlay = document.getElementById('modal-overlay');
            const content = document.getElementById('modal-content');
            overlay.classList.remove('opacity-0', 'pointer-events-none');
            content.classList.remove('scale-90');
            content.classList.add('scale-100');
          }

          function closeModal() {
            const overlay = document.getElementById('modal-overlay');
            const content = document.getElementById('modal-content');
            overlay.classList.add('opacity-0', 'pointer-events-none');
            content.classList.remove('scale-100');
            content.classList.add('scale-90');
          }

          function addLead() {
            const name = document.getElementById('new-lead-name').value;
            const property = document.getElementById('new-lead-property').value;
            const score = parseFloat(document.getElementById('new-lead-score').value);
            const status = document.getElementById('new-lead-status').value;

            if(!name) { alert('Name is required'); return; }

            const newLead = {
              id: Date.now(),
              name,
              address: property,
              score,
              status
            };

            leads.unshift(newLead);
            renderLeads();
            closeModal();
            
            // Reset form
            document.getElementById('new-lead-name').value = '';
          }

          function deleteLead(id) {
            leads = leads.filter(l => l.id !== id);
            renderLeads();
          }

          // Initial Render
          renderLeads();
        </script>
      `
    },
    3: {
      title: "Stampede Staffer",
      html: `
        <div class="h-screen flex flex-col bg-white">
          <header class="bg-orange-600 p-4 lg:p-6 flex items-center justify-between text-white shadow-xl z-20">
            <h1 class="text-lg lg:text-2xl font-bold italic">Stampede Staffer</h1>
            <div class="flex items-center gap-4">
              <div class="text-right hidden sm:block">
                <p class="text-[9px] opacity-80 uppercase tracking-widest font-bold">Labor Target</p>
                <p class="text-sm font-bold">18.4%</p>
              </div>
              <div class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold">S</div>
            </div>
          </header>
          <div class="flex-1 flex overflow-hidden flex-col lg:row">
            <div class="hidden lg:flex w-80 border-r border-gray-100 p-8 space-y-10 overflow-y-auto bg-gray-50/50">
              <div class="space-y-4">
                <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Shift Swaps</h3>
                <div id="swap-1" class="md-card p-4 border-l-4 border-orange-500">
                  <p class="font-bold text-xs">Mike (Mon Eve) → (Sun Brunch)</p>
                  <div class="flex gap-2 mt-4">
                    <button class="flex-1 bg-black text-white text-[9px] py-2 rounded uppercase font-bold" onclick="resolveSwap('swap-1')">Approve</button>
                  </div>
                </div>
              </div>
            </div>
            <main class="flex-1 p-4 lg:p-10 overflow-y-auto bg-white">
              <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                <h2 class="text-2xl lg:text-4xl font-bold tracking-tight">July 12 Live Ops</h2>
                <div class="flex gap-2 w-full sm:w-auto">
                  <button class="md-button md-button-primary bg-orange-600 flex-1">Optimise Grid</button>
                </div>
              </div>
              <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-8">
                <div class="md-card p-4 lg:p-6 bg-gray-50 border-none">
                  <p class="text-[9px] font-bold text-gray-500 uppercase mb-1">Sales (Today)</p>
                  <p class="text-xl lg:text-3xl font-bold" id="live-sales">$4,291.40</p>
                </div>
                <div class="md-card p-4 lg:p-6 bg-gray-50 border-none">
                  <p class="text-[9px] font-bold text-gray-500 uppercase mb-1">Covers</p>
                  <p class="text-xl lg:text-3xl font-bold">184</p>
                </div>
                <div class="md-card p-4 lg:p-6 bg-gray-50 border-none">
                  <p class="text-[9px] font-bold text-gray-500 uppercase mb-1">Wait Time</p>
                  <p class="text-xl lg:text-3xl font-bold text-orange-600">14m</p>
                </div>
                <div class="md-card p-4 lg:p-6 bg-orange-600 text-white">
                  <p class="text-[9px] font-bold opacity-80 uppercase mb-1">ROI (Est)</p>
                  <p class="text-xl lg:text-3xl font-bold">22.4%</p>
                </div>
              </div>
              <div class="md-card p-0 overflow-hidden border-gray-100">
                <div class="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                  <h3 class="font-bold text-sm">Staff On-Floor</h3>
                </div>
                <div class="divide-y divide-gray-100">
                  <div class="p-4 flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 text-xs">SM</div>
                      <div><p class="font-bold text-xs">Sarah Miller</p><p class="text-[9px] text-gray-400">Server</p></div>
                    </div>
                    <div class="text-right"><p class="text-xs font-bold">$1,402.10</p></div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <script>
          function resolveSwap(id) {
            document.getElementById(id).innerHTML = '<p class="text-green-700 font-bold text-center text-xs">Approved ✓</p>';
            setTimeout(() => document.getElementById(id).remove(), 1500);
          }
          setInterval(() => {
            let s = document.getElementById('live-sales');
            if(s) s.innerText = '$' + (4291 + Math.random() * 50).toFixed(2);
          }, 4000);
        </script>
      `
    },
    4: {
      title: "BowValley Health Portal",
      html: `
        <div class="flex h-screen bg-[#f0f4f8] flex-col lg:flex-row">
          <div class="hidden lg:flex w-20 bg-white border-r border-gray-200 flex-col items-center py-8 gap-10">
            <div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z"/></svg></div>
          </div>
          
          <div class="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <span class="font-black text-blue-600">BowValley Health</span>
            <button class="md-button md-button-primary h-8 text-[10px]" onclick="checkIn()">+ INTAKE</button>
          </div>

          <main class="flex-1 p-4 lg:p-10 overflow-y-auto">
            <header class="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-6">
              <div>
                <p class="text-blue-600 font-bold uppercase tracking-widest text-[10px] mb-1">Triage Console</p>
                <h2 class="text-2xl lg:text-4xl font-bold text-slate-800 tracking-tight">Clinic Flow: High</h2>
              </div>
              <div class="flex gap-2 w-full sm:w-auto">
                <div class="bg-white px-4 lg:px-8 py-3 lg:py-5 rounded-xl shadow-sm border border-slate-200 flex-1 sm:flex-none">
                  <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Est. Wait</p>
                  <p class="text-xl lg:text-3xl font-bold text-slate-800" id="wait-time">22 min</p>
                </div>
                <button class="hidden sm:block md-button md-button-primary h-auto py-5 px-10 rounded-2xl shadow-xl shadow-blue-500/30 text-[10px] font-black tracking-widest uppercase" onclick="checkIn()">+ Manual Check-In</button>
              </div>
            </header>
            
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
              <div class="lg:col-span-8 space-y-4">
                <h3 class="font-bold text-sm text-slate-700 flex items-center justify-between">Queue <span class="text-xs text-slate-400 font-normal" id="queue-count">2 Active</span></h3>
                <div class="space-y-4" id="queue-container">
                  <div class="md-card p-4 lg:p-6 flex items-center justify-between border-l-4 border-red-500 shadow-sm" id="p-1">
                    <div class="flex items-center gap-4">
                      <div class="w-10 h-10 lg:w-14 lg:h-14 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-500 text-lg">AM</div>
                      <div>
                        <p class="font-black text-slate-900 text-sm lg:text-lg leading-tight">Anne-Marie D.</p>
                        <p class="text-[10px] text-slate-500">Wisdom Tooth Pressure</p>
                      </div>
                    </div>
                    <button class="md-button md-button-outline text-[10px] h-9" onclick="assignRoom('p-1')">Assign</button>
                  </div>
                </div>
              </div>
              <div class="lg:col-span-4 space-y-6">
                <div class="md-card p-6 lg:p-8 bg-blue-600 text-white shadow-2xl rounded-2xl">
                  <h4 class="font-bold text-lg mb-4">AI Analytics</h4>
                  <p class="text-[11px] opacity-90 leading-relaxed mb-6">Cluster of afternoon cancellations detected. 8/12 slots auto-confirmed via SMS.</p>
                  <div class="p-3 bg-white/10 rounded-xl border border-white/20">
                    <p class="text-[9px] font-black uppercase mb-0.5">Throughput</p>
                    <p class="text-xl font-black">+14% vs avg</p>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
        <script>
          function assignRoom(id) {
            document.getElementById(id).remove();
            updateQC();
          }
          function updateQC() {
            const count = document.getElementById('queue-container').children.length;
            document.getElementById('queue-count').innerText = count + ' Active';
            document.getElementById('wait-time').innerText = (count * 10 + 2) + ' min';
          }
          function checkIn() {
            const id = 'n-' + Math.random();
            const row = document.createElement('div');
            row.id = id; row.className = 'md-card p-4 lg:p-6 flex items-center justify-between border-l-4 border-slate-300 shadow-sm';
            row.innerHTML = '<div class="flex items-center gap-4"><div class="w-10 h-10 lg:w-14 lg:h-14 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-500 text-lg">NP</div><div><p class="font-black text-slate-900 text-sm leading-tight">New Patient</p><p class="text-[10px] text-slate-500">Walk-in</p></div></div><button class="md-button md-button-outline text-[10px] h-9" onclick="assignRoom(\\''+id+'\\')">Triage</button>';
            document.getElementById('queue-container').appendChild(row);
            updateQC();
          }
        </script>
      `
    },
    5: {
      title: "17th Ave Law Vault",
      html: `
        <div class="flex h-screen bg-[#111827] text-white flex-col lg:flex-row overflow-hidden">
          <div class="hidden lg:flex w-72 bg-[#1f2937] border-r border-white/10 p-8 flex-col">
            <h1 class="text-lg font-bold tracking-widest uppercase mb-12">LawVault.io</h1>
            <div class="space-y-2 flex-1">
              <div class="sidebar-item active" style="color: white; background: rgba(255,255,255,0.05)">Matters</div>
              <div class="sidebar-item" style="color: rgba(255,255,255,0.4)">Archive</div>
            </div>
            <div class="mt-auto p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
              <p class="text-[8px] font-bold text-yellow-500 uppercase mb-1">Billable</p>
              <p class="text-2xl font-black" id="timer">01:42:09</p>
            </div>
          </div>
          
          <div class="lg:hidden bg-[#1f2937] border-b border-white/10 p-4 flex items-center justify-between">
             <span class="font-black tracking-widest">LAWVAULT.IO</span>
             <span class="text-yellow-500 font-bold text-xs" id="mobile-timer">01:42:09</span>
          </div>

          <main class="flex-1 p-4 lg:p-12 overflow-y-auto bg-[#0a0f18]">
            <div class="flex flex-col lg:flex-row justify-between items-start mb-10 lg:mb-16 gap-8">
              <div>
                <p class="text-yellow-500 font-bold tracking-[0.4em] text-[9px] uppercase mb-2">Automation Suite</p>
                <h2 class="text-4xl lg:text-6xl font-black tracking-tighter leading-none">THE AUTO-DRAFT.</h2>
                <p class="text-white/30 max-w-lg font-medium text-xs mt-4">Select template, sync case data, and generate zero-defect drafts.</p>
              </div>
              <div class="bg-white text-black p-4 lg:p-8 rounded-2xl flex gap-6 lg:gap-12 w-full lg:w-auto">
                <div>
                  <p class="text-[8px] font-black opacity-40 uppercase mb-1">Billable</p>
                  <p class="text-xl lg:text-3xl font-black">$4,290</p>
                </div>
                <div class="w-[1px] bg-black/10"></div>
                <div>
                  <p class="text-[8px] font-black opacity-40 uppercase mb-1">Ready</p>
                  <p class="text-xl lg:text-3xl font-black" id="draft-count">14</p>
                </div>
              </div>
            </div>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 pb-10">
              <div class="bg-white/5 border border-white/10 rounded-3xl p-6 lg:p-10 space-y-8">
                <h3 class="text-lg lg:text-2xl font-black">Configuration</h3>
                <div class="space-y-6">
                  <div>
                    <label class="text-[8px] font-black text-white/40 uppercase mb-2 block">Matter</label>
                    <select class="w-full bg-[#111827] border border-white/10 p-4 rounded-xl text-xs outline-none appearance-none">
                      <option>#2024-ACME // Corporate</option>
                      <option>#2024-RE // Elbow Park</option>
                    </select>
                  </div>
                  <button class="w-full bg-white text-black font-black py-4 lg:py-6 rounded-2xl text-sm lg:text-lg uppercase tracking-widest" id="gen-btn" onclick="generate()">Generate Draft</button>
                </div>
              </div>
              
              <div id="draft-prev" class="bg-white/5 border border-white/10 rounded-3xl p-6 lg:p-12 opacity-20 blur-sm flex flex-col min-h-[300px]">
                <div class="flex items-center justify-between mb-6">
                  <h3 class="text-sm lg:text-xl font-black uppercase">Preview</h3>
                  <span class="text-[8px] font-bold text-white/40 uppercase">Read Only</span>
                </div>
                <div class="flex-1 font-serif text-xs lg:text-sm opacity-60 overflow-y-auto" id="draft-content">
                  <p class="italic text-center py-10 uppercase">Awaiting Parameters...</p>
                </div>
              </div>
            </div>
          </main>
        </div>
        <script>
          let seconds = 6129;
          setInterval(() => {
            seconds++;
            const h = Math.floor(seconds/3600).toString().padStart(2,'0'), m = Math.floor((seconds%3600)/60).toString().padStart(2,'0'), s = (seconds%60).toString().padStart(2,'0');
            const timeStr = h + ':' + m + ':' + s;
            if(document.getElementById('timer')) document.getElementById('timer').innerText = timeStr;
            if(document.getElementById('mobile-timer')) document.getElementById('mobile-timer').innerText = timeStr;
          }, 1000);
          function generate() {
            const btn = document.getElementById('gen-btn');
            btn.innerText = 'Analyzing...';
            setTimeout(() => {
              btn.innerText = 'Injecting...';
              setTimeout(() => {
                document.getElementById('draft-prev').classList.remove('opacity-20', 'blur-sm');
                document.getElementById('draft-content').innerHTML = '<p class="font-bold border-b border-white/10 pb-2 mb-4">MUTUAL NDA</p><p>This Agreement is made on July 12, 2026, between ACME HOLDINGS and [Counterparty].</p>';
                btn.innerText = 'Complete ✓';
                document.getElementById('draft-count').innerText = 15;
              }, 1200);
            }, 800);
          }
        </script>
      `
    }
  };

  const demo = demos[id] || demos[1];

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        ${commonHeader}
      </head>
      <body>
        ${demo.html}
      </body>
    </html>
  `;
};
