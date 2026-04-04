// main.js — Supabase-powered Galaxy Fusion

const SUPABASE_URL = 'https://pfsklgdqabozkglltqax.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmc2tsZ2RxYWJvemtnbGx0cWF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyNjU5NzAsImV4cCI6MjA5MDg0MTk3MH0.iEDVq_sjN3rC2w_Ywu4YYOmAFyn5tnT8URrNgkASOao';
const EMAIL_DOMAIN = '@galaxy.local';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- STATE ---
let currentUser = null;   // { id, name, roll, role, ... } from profiles
let currentManagingGroupId = null;
let currentMentorUid = null;
let currentChatGroupId = null;
let chatSubscription = null;

// --- HELPERS ---
function rollToEmail(roll) { return roll.toLowerCase().trim() + EMAIL_DOMAIN; }
function escapeHtml(str) { const d = document.createElement('div'); d.textContent = str; return d.innerHTML; }

// --- UI (unchanged) ---
window.ui = {
    toggleSidebar: () => {
        const sidebar = document.getElementById('sidebar-menu');
        const overlay = document.getElementById('sidebar-overlay');
        const isHidden = sidebar.classList.contains('-translate-x-full');
        if (isHidden) {
            sidebar.classList.remove('-translate-x-full');
            overlay.classList.remove('hidden');
            void overlay.offsetWidth;
            overlay.classList.add('opacity-100');
        } else { window.ui.closeSidebar(); }
    },
    closeSidebar: () => {
        const sidebar = document.getElementById('sidebar-menu');
        const overlay = document.getElementById('sidebar-overlay');
        sidebar.classList.add('-translate-x-full');
        overlay.classList.remove('opacity-100');
        setTimeout(() => overlay.classList.add('hidden'), 300);
    },
    toggleModal: (id) => {
        const m = document.getElementById(id);
        if (m.classList.contains('hidden')) m.classList.remove('hidden');
        else m.classList.add('hidden');
    },
    updateResume: () => {},
    updateProfileImg: (src) => {
        const el = document.getElementById('prof-img');
        if (el) el.src = src || 'https://placehold.co/128x128/E0E7FF/3B82F6?text=Profile';
    },
    viewPdf: (data) => {
        const win = window.open();
        win.document.write('<iframe src="' + data + '" frameborder="0" style="border:0;top:0;left:0;bottom:0;right:0;width:100%;height:100%;" allowfullscreen></iframe>');
    },
    showLoading: (show) => {
        const el = document.getElementById('loading-spinner');
        if (show) el.classList.remove('hidden'); else el.classList.add('hidden');
    },
    toast: (msg, type = 'info') => {
        const container = document.getElementById('toast-container');
        const el = document.createElement('div');
        el.className = `toast ${type}`;
        el.innerHTML = `<div class="toast-content">${msg}</div><button onclick="this.parentElement.remove()" class="text-gray-400 hover:text-gray-600">&times;</button>`;
        container.appendChild(el);
        requestAnimationFrame(() => { requestAnimationFrame(() => { el.classList.add('show'); }); });
        setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 300); }, 3000);
    }
};

// --- NAVIGATION ---
window.nav = {
    to: (id) => {
        const currentPages = document.querySelectorAll('.page:not(.hidden)');
        const targetPage = document.getElementById('page-' + id);
        if (!targetPage) return;

        const clearActive = () => {
            document.querySelectorAll('.nav-item').forEach(n => { n.classList.remove('active', 'text-teal-700'); n.classList.add('text-gray-400'); });
            if (id === 'dashboard') document.querySelector('#nav-home')?.classList.add('active', 'text-teal-700');
            else if (id.includes('group')) document.querySelector('#nav-groups')?.classList.add('active', 'text-teal-700');
            else if (id === 'mentorship') document.querySelector('#nav-mentors')?.classList.add('active', 'text-teal-700');
        };

        if (currentPages.length > 0) {
            currentPages.forEach(p => {
                p.classList.remove('active');
                setTimeout(() => {
                    p.classList.add('hidden');
                    p.classList.remove('flex');
                    if (p === currentPages[currentPages.length - 1]) showNewPage();
                }, 300);
            });
        } else { showNewPage(); }

        function showNewPage() {
            targetPage.classList.remove('hidden');
            targetPage.classList.add('flex');
            requestAnimationFrame(() => { setTimeout(() => { targetPage.classList.add('active'); }, 50); });
            window.scrollTo(0, 0);
            clearActive();
            window.ui.closeSidebar();
        }
    }
};

// --- AUTHENTICATION ---
window.auth = {
    check: async () => {
        ui.showLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
            if (profile) {
                currentUser = profile;
                window.nav.to('dashboard');
                const nd = document.getElementById('user-name-display');
                if (nd) nd.textContent = profile.name.split(' ')[0];
                window.ui.updateProfileImg(profile.profile_image_url);

                const jobCard = document.getElementById('faculty-post-job-card');
                const mentorSection = document.getElementById('mentor-upload-section');
                if (jobCard) {
                    if (profile.role === 'mentor' && profile.mentor_type === 'Faculty') { jobCard.classList.remove('hidden'); jobCard.classList.add('flex'); }
                    else { jobCard.classList.add('hidden'); jobCard.classList.remove('flex'); }
                }
                if (mentorSection) {
                    if (profile.role === 'mentor') mentorSection.classList.remove('hidden');
                    else mentorSection.classList.add('hidden');
                }
            }
        } else {
            currentUser = null;
            window.nav.to('welcome');
        }
        ui.showLoading(false);
    },

    signup: async (e) => {
        e.preventDefault();
        const d = new FormData(e.target);
        const name = d.get('name'), roll = d.get('roll'), pass = d.get('pass');
        if (pass.length < 6) return ui.toast('Password must be at least 6 characters!', 'error');
        ui.showLoading(true);
        const { error } = await supabase.auth.signUp({
            email: rollToEmail(roll),
            password: pass,
            options: { data: { name, roll, role: 'student' } }
        });
        ui.showLoading(false);
        if (error) return ui.toast(error.message, 'error');
        e.target.reset();
        ui.toast('Account created!', 'success');
        await window.auth.check();
    },

    login: async (e) => {
        e.preventDefault();
        const d = new FormData(e.target);
        ui.showLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email: rollToEmail(d.get('roll')),
            password: d.get('pass')
        });
        ui.showLoading(false);
        if (error) return ui.toast('Invalid credentials!', 'error');
        e.target.reset();
        await window.auth.check();
    },

    mentorSignup: async (e) => {
        e.preventDefault();
        const d = new FormData(e.target);
        const name = d.get('name'), roll = d.get('id'), pass = d.get('pass');
        ui.showLoading(true);
        const { error } = await supabase.auth.signUp({
            email: rollToEmail(roll),
            password: pass,
            options: { data: { name, roll, role: 'mentor', mentor_type: d.get('type'), expertise: d.get('exp') } }
        });
        ui.showLoading(false);
        if (error) return ui.toast(error.message, 'error');
        e.target.reset();
        ui.toast('Mentor registered!', 'success');
        await window.auth.check();
    },

    mentorLogin: async (e) => {
        e.preventDefault();
        const d = new FormData(e.target);
        ui.showLoading(true);
        const { data, error } = await supabase.auth.signInWithPassword({
            email: rollToEmail(d.get('id')),
            password: d.get('pass')
        });
        if (error) { ui.showLoading(false); return ui.toast('Invalid Mentor Login!', 'error'); }
        // verify mentor role
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single();
        if (!profile || profile.role !== 'mentor') {
            await supabase.auth.signOut();
            ui.showLoading(false);
            return ui.toast('This account is not a mentor!', 'error');
        }
        ui.showLoading(false);
        e.target.reset();
        await window.auth.check();
    },

    logout: async () => {
        if (chatSubscription) { supabase.removeChannel(chatSubscription); chatSubscription = null; }
        await supabase.auth.signOut();
        currentUser = null;
        window.auth.check();
    }
};

// --- LOGIC & FEATURES ---
const clubData = {
    technical: ['Coding', 'Robotics', 'AI/ML', 'Cyber Security'],
    sports: ['Cricket', 'Football', 'Basketball', 'Badminton'],
    cultural: ['Dance', 'Music', 'Drama', 'Fine Arts']
};

window.logic = {
    // ==================== GROUPS ====================
    createGroup: async (e) => {
        e.preventDefault();
        if (!currentUser) return;
        const skill = document.getElementById('mk-skill').value;
        const branch = document.getElementById('mk-branch').value;
        const year = document.querySelector('input[name="year"]:checked')?.value;
        if (!year) return ui.toast('Select a year!', 'error');

        const { data: group, error } = await supabase.from('groups').insert({ skill, branch, year, creator_id: currentUser.id }).select().single();
        if (error) return ui.toast('Error creating group', 'error');
        // add creator as member
        await supabase.from('group_members').insert({ group_id: group.id, user_id: currentUser.id });
        e.target.reset();
        ui.toast('Group created!', 'success');
        window.nav.to('skill-groups');
    },

    loadGroups: async () => {
        if (!currentUser) return;
        const list = document.getElementById('join-list');
        if (!list) return;
        list.innerHTML = '<p class="text-center text-gray-400 py-4">Loading...</p>';

        const { data: groups } = await supabase.from('groups').select('*, group_members(user_id)');
        list.innerHTML = '';
        if (!groups || groups.length === 0) { list.innerHTML = '<p class="text-center text-gray-400">No groups yet.</p>'; return; }

        groups.forEach(g => {
            const memberIds = (g.group_members || []).map(m => m.user_id);
            const joined = memberIds.includes(currentUser.id);
            list.innerHTML += `
                <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-3">
                    <div class="flex justify-between">
                        <div><h3 class="font-bold text-slate-800">${escapeHtml(g.skill)}</h3><p class="text-xs text-slate-500">${escapeHtml(g.branch)} • ${escapeHtml(g.year)}</p></div>
                        ${joined ? '<span class="text-green-600 text-xs font-bold">Joined</span>' : `<button onclick="window.logic.requestJoin('${g.id}')" class="bg-teal-600 text-white px-3 py-1 rounded-lg text-xs">Join</button>`}
                    </div>
                </div>`;
        });
    },

    requestJoin: async (gid) => {
        if (!currentUser) return;
        const { error } = await supabase.from('group_join_requests').insert({
            group_id: gid, user_id: currentUser.id, name: currentUser.name, roll: currentUser.roll
        });
        if (error) return ui.toast('Already requested or joined!', 'error');
        ui.toast('Join Request Sent!', 'success');
        window.logic.loadGroups();
    },

    loadMyGroups: async () => {
        if (!currentUser) return;
        const list = document.getElementById('my-groups-list');
        if (!list) return;
        list.innerHTML = '<p class="text-center text-gray-400 py-4">Loading...</p>';

        const { data: memberships } = await supabase.from('group_members').select('group_id, groups(*)').eq('user_id', currentUser.id);
        list.innerHTML = '';
        if (!memberships || memberships.length === 0) { list.innerHTML = '<p class="text-center text-gray-400 py-8">You haven\'t joined any groups yet.</p>'; return; }

        const colors = ['#f97316', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#eab308', '#ef4444', '#6366f1'];

        for (let i = 0; i < memberships.length; i++) {
            const g = memberships[i].groups;
            if (!g) continue;
            const { data: lastMsgArr } = await supabase.from('group_messages').select('sender_name,text').eq('group_id', g.id).order('created_at', { ascending: false }).limit(1);
            const lastMsg = lastMsgArr?.[0];
            const preview = lastMsg ? `${lastMsg.sender_name}: ${lastMsg.text}` : 'No messages yet. Tap to chat!';
            const isCreator = g.creator_id === currentUser.id;
            const bgColor = colors[i % colors.length];

            const card = document.createElement('div');
            card.className = 'group-chat-card mb-3';
            card.setAttribute('data-gid', g.id);
            card.onclick = () => window.logic.openGroupChat(g.id);
            card.innerHTML = `
                <div class="group-chat-avatar" style="background:${bgColor};">${g.skill.charAt(0).toUpperCase()}</div>
                <div class="group-chat-meta">
                    <div class="group-chat-name">${escapeHtml(g.skill)}</div>
                    <div class="group-chat-preview">${escapeHtml(preview)}</div>
                </div>
                <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;">
                    <span class="group-chat-badge" style="background:${isCreator ? '#dbeafe' : '#f0fdf4'};color:${isCreator ? '#2563eb' : '#16a34a'};">${isCreator ? 'Owner' : 'Member'}</span>
                    ${isCreator ? `<button onclick="event.stopPropagation(); window.logic.loadReqs('${g.id}')" class="text-xs text-indigo-600 font-bold hover:underline">Requests</button>` : ''}
                </div>`;
            list.appendChild(card);
        }
    },

    openGroupChat: async (groupId) => {
        currentChatGroupId = groupId;
        const { data: group } = await supabase.from('groups').select('*, group_members(user_id)').eq('id', groupId).single();
        if (!group) return;

        const headerTitle = document.getElementById('chat-group-name');
        const headerSub = document.getElementById('chat-group-subtitle');
        if (headerTitle) headerTitle.textContent = group.skill;
        const mc = group.group_members?.length || 0;
        if (headerSub) headerSub.textContent = `${group.branch} • ${group.year} • ${mc} member${mc > 1 ? 's' : ''}`;

        window.nav.to('group-chat');
        setTimeout(async () => {
            await window.logic.renderGroupMessages();
            window.logic.subscribeToChat(groupId);
        }, 350);
    },

    subscribeToChat: (groupId) => {
        if (chatSubscription) { supabase.removeChannel(chatSubscription); chatSubscription = null; }
        chatSubscription = supabase
            .channel('group-chat-' + groupId)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'group_messages', filter: `group_id=eq.${groupId}` },
                (payload) => {
                    const m = payload.new;
                    const container = document.getElementById('chat-messages-area');
                    if (!container) return;
                    // Remove empty state if present
                    const empty = container.querySelector('.chat-empty-state');
                    if (empty) empty.remove();

                    const isSent = m.sender_id === currentUser?.id;
                    const bubble = document.createElement('div');
                    bubble.className = `chat-bubble ${isSent ? 'sent' : 'received'}`;
                    const timeStr = new Date(m.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
                    bubble.innerHTML = `
                        <div class="chat-bubble-sender">${isSent ? 'You' : escapeHtml(m.sender_name)}</div>
                        <div>${escapeHtml(m.text)}</div>
                        <div class="chat-bubble-time">${timeStr}</div>`;
                    container.appendChild(bubble);
                    container.scrollTop = container.scrollHeight;
                })
            .subscribe();
    },

    renderGroupMessages: async () => {
        const container = document.getElementById('chat-messages-area');
        if (!container || !currentChatGroupId) return;

        const { data: msgs } = await supabase.from('group_messages').select('*').eq('group_id', currentChatGroupId).order('created_at', { ascending: true });

        if (!msgs || msgs.length === 0) {
            container.innerHTML = `<div class="chat-empty-state"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg><p>No messages yet.<br>Be the first to say hello!</p></div>`;
            return;
        }

        container.innerHTML = '';
        let lastDate = '';
        msgs.forEach(m => {
            const msgDate = new Date(m.created_at).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
            if (msgDate !== lastDate) {
                lastDate = msgDate;
                const div = document.createElement('div');
                div.className = 'chat-date-divider';
                div.textContent = msgDate;
                container.appendChild(div);
            }
            const isSent = m.sender_id === currentUser?.id;
            const bubble = document.createElement('div');
            bubble.className = `chat-bubble ${isSent ? 'sent' : 'received'}`;
            const timeStr = new Date(m.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
            bubble.innerHTML = `<div class="chat-bubble-sender">${isSent ? 'You' : escapeHtml(m.sender_name)}</div><div>${escapeHtml(m.text)}</div><div class="chat-bubble-time">${timeStr}</div>`;
            container.appendChild(bubble);
        });
        container.scrollTop = container.scrollHeight;
    },

    sendGroupMessage: async (e) => {
        e.preventDefault();
        const input = document.getElementById('chat-message-input');
        const text = input.value.trim();
        if (!text || !currentChatGroupId || !currentUser) return;

        // Insert into DB — realtime subscription will render it
        const { error } = await supabase.from('group_messages').insert({
            group_id: currentChatGroupId,
            sender_id: currentUser.id,
            sender_name: currentUser.name,
            text: text
        });
        if (error) return ui.toast('Failed to send message', 'error');
        input.value = '';
    },

    loadReqs: async (gid) => {
        currentManagingGroupId = gid;
        window.nav.to('requests');
        const list = document.getElementById('requests-list');
        if (!list) return;
        list.innerHTML = '<p class="text-center text-gray-400 py-4">Loading...</p>';

        const { data: reqs } = await supabase.from('group_join_requests').select('*').eq('group_id', gid).eq('status', 'pending');
        list.innerHTML = '';
        if (!reqs || reqs.length === 0) { list.innerHTML = '<p class="text-center text-gray-400">No pending requests.</p>'; return; }
        reqs.forEach(r => {
            list.innerHTML += `<div class="bg-white p-4 mb-2 rounded-xl shadow-sm"><p class="font-bold">${escapeHtml(r.name)}</p><p class="text-xs">${escapeHtml(r.roll)}</p><div class="flex gap-2 mt-2"><button onclick="window.logic.handleReq('${r.id}','${r.user_id}','approve')" class="flex-1 bg-green-500 text-white py-1 rounded text-xs">Approve</button><button onclick="window.logic.handleReq('${r.id}','${r.user_id}','decline')" class="flex-1 bg-red-500 text-white py-1 rounded text-xs">Decline</button></div></div>`;
        });
    },

    handleReq: async (reqId, userId, action) => {
        await supabase.from('group_join_requests').update({ status: action }).eq('id', reqId);
        if (action === 'approve') {
            await supabase.from('group_members').insert({ group_id: currentManagingGroupId, user_id: userId });
        }
        window.logic.loadReqs(currentManagingGroupId);
    },

    // ==================== MENTORS ====================
    loadMentors: async () => {
        const list = document.getElementById('mentor-list');
        if (!list) return;
        list.innerHTML = '<p class="text-center text-gray-400 py-4">Loading...</p>';
        const { data: mentors } = await supabase.from('profiles').select('*').eq('role', 'mentor');
        list.innerHTML = '';
        if (!mentors || mentors.length === 0) { list.innerHTML = '<p class="text-center text-gray-400">No mentors yet.</p>'; return; }

        mentors.forEach(m => {
            let bc = "bg-gray-100 text-gray-600";
            if (m.mentor_type === "Faculty") bc = "bg-blue-100 text-blue-700";
            else if (m.mentor_type === "Alumni") bc = "bg-purple-100 text-purple-700";
            else if (m.mentor_type === "Expert") bc = "bg-emerald-100 text-emerald-700";
            list.innerHTML += `
            <div class="bg-white p-4 mb-3 rounded-xl shadow-sm flex items-center gap-3 border-l-4 border-indigo-500">
                <div class="h-10 w-10 rounded-full bg-gray-200 overflow-hidden"><img src="${m.profile_image_url || 'https://placehold.co/100'}" class="w-full h-full object-cover"></div>
                <div class="flex-grow"><div class="flex items-center gap-2"><h3 class="font-bold text-slate-800">${escapeHtml(m.name)}</h3><span class="${bc} text-[10px] px-2 py-0.5 rounded-full uppercase font-bold">${m.mentor_type || 'Mentor'}</span></div><p class="text-xs text-slate-500 truncate w-40">${escapeHtml(m.expertise || '')}</p></div>
                <button onclick="window.logic.openMessageModal('${m.id}')" class="bg-indigo-50 p-2 rounded-full text-indigo-600"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></button>
            </div>`;
        });
    },
    openMessageModal: (uid) => { currentMentorUid = uid; window.ui.toggleModal('message-modal'); },

    sendMessage: async () => {
        const msg = document.getElementById('msg-input').value.trim();
        if (!msg || !currentUser) return;
        await supabase.from('notifications').insert({ to_user_id: currentMentorUid, from_user_name: currentUser.name, type: 'mentor_msg', message: msg });
        document.getElementById('msg-input').value = '';
        window.ui.toggleModal('message-modal');
        ui.toast("Message Sent!", 'success');
    },

    loadNotifications: async () => {
        if (!currentUser) return;
        const list = document.getElementById('notifications-list');
        const { data: notifs } = await supabase.from('notifications').select('*').eq('to_user_id', currentUser.id).order('created_at', { ascending: false });
        if (notifs && notifs.length > 0) {
            notifs.forEach(n => {
                list.insertAdjacentHTML('afterbegin', `<div class="p-3 bg-indigo-50 rounded-xl border-l-4 border-indigo-500 text-sm mb-2"><div class="flex justify-between items-start"><p class="font-bold text-indigo-800">Message from ${escapeHtml(n.from_user_name)}</p><span class="text-[10px] text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">Message</span></div><p class="text-xs text-slate-600 mt-1">${escapeHtml(n.message)}</p></div>`);
            });
        }
    },

    // ==================== SUGGESTIONS ====================
    addSuggestion: async () => {
        const t = document.getElementById('sug-text').value;
        if (!t || !currentUser) return;
        await supabase.from('suggestions').insert({ text: t, user_id: currentUser.id });
        document.getElementById('sug-text').value = '';
        window.logic.loadSuggestions();
    },
    loadSuggestions: async () => {
        const list = document.getElementById('sug-list');
        if (!list) return;
        const { data } = await supabase.from('suggestions').select('*').order('created_at', { ascending: false });
        list.innerHTML = '';
        if (data) data.forEach(s => list.innerHTML += `<div class="bg-white p-3 rounded-lg text-sm shadow-sm border border-slate-100">${escapeHtml(s.text)}</div>`);
    },

    // ==================== PROJECTS ====================
    submitProject: async (e) => {
        e.preventDefault();
        if (!currentUser) return;
        const d = new FormData(e.target);
        await supabase.from('projects').insert({ title: d.get('title'), description: d.get('desc'), github_url: d.get('github'), user_id: currentUser.id });
        e.target.reset();
        ui.toast("Project Added!", 'success');
        window.logic.loadProjects();
    },
    loadProjects: async () => {
        if (!currentUser) return;
        const list = document.getElementById('projects-list');
        if (!list) return;
        const { data } = await supabase.from('projects').select('*').eq('user_id', currentUser.id).order('created_at', { ascending: false });
        list.innerHTML = '';
        if (!data || data.length === 0) { list.innerHTML = '<p class="text-center text-slate-400 text-sm">No projects submitted yet.</p>'; return; }
        data.forEach(p => {
            list.innerHTML += `<div class="bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-500"><h3 class="font-bold text-slate-800">${escapeHtml(p.title)}</h3><p class="text-xs text-slate-500 mt-1">${escapeHtml(p.description || '')}</p><a href="${p.github_url}" target="_blank" class="text-xs text-blue-600 mt-2 block hover:underline font-bold">View Code &rarr;</a></div>`;
        });
    },

    // ==================== PLACEMENTS ====================
    submitPlacement: (e) => { e.preventDefault(); e.target.reset(); window.ui.toggleModal('placement-modal'); },

    postJob: async (e) => {
        e.preventDefault();
        if (!currentUser) return;
        const d = new FormData(e.target);
        await supabase.from('jobs').insert({ company: d.get('company'), role: d.get('role'), salary: d.get('salary'), eligibility: d.get('eligibility'), posted_by: currentUser.id });
        e.target.reset();
        ui.toast("Job Opening Posted!", 'success');
        window.logic.loadJobsForFaculty();
    },
    loadJobsForFaculty: async () => {
        const list = document.getElementById('faculty-job-list');
        if (!list) return;
        const { data } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
        list.innerHTML = '';
        if (data) data.forEach(j => { list.innerHTML += `<div class="bg-purple-50 p-3 rounded-lg border border-purple-100 text-sm"><b>${escapeHtml(j.company)}</b> - ${escapeHtml(j.role)} (${escapeHtml(j.salary)})</div>`; });
    },
    loadJobsForStudent: async () => {
        const list = document.getElementById('student-job-list');
        if (!list) return;
        const { data } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
        list.innerHTML = '';
        if (!data || data.length === 0) { list.innerHTML = '<p class="text-center text-gray-400 text-sm">No job openings yet.</p>'; return; }
        data.forEach(j => {
            list.innerHTML += `<div class="bg-white p-4 rounded-xl shadow-sm border-l-4 border-cyan-500"><div class="flex justify-between items-start"><h3 class="font-bold text-slate-800">${escapeHtml(j.company)}</h3><span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">${escapeHtml(j.salary)}</span></div><p class="text-sm text-cyan-700 font-medium mt-1">${escapeHtml(j.role)}</p><p class="text-xs text-gray-500 mt-2 bg-gray-50 p-2 rounded">${escapeHtml(j.eligibility || '')}</p></div>`;
        });
    },

    // ==================== MATERIALS ====================
    addMaterial: async (e) => {
        e.preventDefault();
        if (!currentUser) return;
        const d = new FormData(e.target);
        const file = document.getElementById('material-file-input')?.files[0];
        await supabase.from('materials').insert({ title: d.get('title'), type: d.get('type'), link: d.get('link') || null, description: d.get('desc'), file_name: file ? file.name : null, uploaded_by: currentUser.id });
        e.target.reset();
        ui.toast("Material Uploaded!", 'success');
        window.logic.loadMaterials();
    },
    loadMaterials: async () => {
        const list = document.getElementById('materials-list');
        if (!list) return;
        const { data } = await supabase.from('materials').select('*').order('created_at', { ascending: false });
        list.innerHTML = '';
        if (!data || data.length === 0) { list.innerHTML = '<p class="text-center text-slate-400 text-sm">No materials uploaded yet.</p>'; return; }
        data.forEach(m => {
            let icon = '', action = '';
            if (m.type === 'pdf') icon = '<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>';
            else if (m.type === 'link') icon = '<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>';
            else if (m.type === 'video') icon = '<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/></svg>';
            else if (m.type === 'image') icon = '<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';
            if (m.link) action = `<a href="${m.link}" target="_blank" class="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold">Open</a>`;
            else if (m.file_name) action = `<span class="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-bold">${escapeHtml(m.file_name)}</span>`;
            list.innerHTML += `<div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-start gap-3"><div class="bg-gray-50 p-2 rounded-lg">${icon}</div><div class="flex-grow"><h3 class="font-bold text-slate-800 text-sm">${escapeHtml(m.title)}</h3><p class="text-xs text-slate-500 mt-1">${escapeHtml(m.description || '')}</p></div><div class="self-center">${action}</div></div>`;
        });
    },

    // ==================== FEEDBACK ====================
    submitAppFeedback: async () => {
        const rating = document.querySelector('input[name="rating"]:checked');
        const text = document.getElementById('feedback-text').value.trim();
        if (!rating) return ui.toast('Please select a star rating.', 'error');
        await supabase.from('feedback').insert({ rating: parseInt(rating.value), text, user_id: currentUser?.id });
        document.getElementById('feedback-text').value = '';
        document.querySelectorAll('input[name="rating"]').forEach(r => r.checked = false);
        ui.toast('Thank you for your feedback!', 'success');
    },

    // ==================== CLUBS ====================
    joinClub: (club) => {
        if (!currentUser) return;
        window.location.href = `mailto:kcvinay321@gmail.com?subject=Join ${club} Club&body=Name: ${currentUser.name}%0ARoll: ${currentUser.roll}`;
    },
    showClubSubCategory: (category) => {
        document.getElementById('club-categories').classList.add('hidden');
        const c = document.getElementById('sub-club-list-container');
        c.classList.remove('hidden');
        document.getElementById('sub-club-title').textContent = category.charAt(0).toUpperCase() + category.slice(1) + " Clubs";
        const items = document.getElementById('sub-club-items');
        items.innerHTML = '';
        clubData[category].forEach(sub => {
            items.innerHTML += `<div onclick="window.logic.joinClub('${sub}')" class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center cursor-pointer"><span class="font-bold text-slate-700">${sub}</span><span class="text-xs text-teal-600 bg-teal-50 px-2 py-1 rounded-full font-bold">Join</span></div>`;
        });
    },
    hideClubSubCategory: () => {
        document.getElementById('sub-club-list-container').classList.add('hidden');
        document.getElementById('club-categories').classList.remove('hidden');
    },

    // ==================== PROFILE ====================
    uploadImage: (input) => {
        const file = input.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (e) => {
            await supabase.from('profiles').update({ profile_image_url: e.target.result }).eq('id', currentUser.id);
            currentUser.profile_image_url = e.target.result;
            window.ui.updateProfileImg(currentUser.profile_image_url);
            window.logic.renderProfile();
        };
        reader.readAsDataURL(file);
    },
    uploadResume: async (input) => {
        const file = input.files[0];
        if (file && file.type === 'application/pdf') {
            await supabase.from('profiles').update({ resume_name: file.name }).eq('id', currentUser.id);
            currentUser.resume_name = file.name;
            window.logic.renderProfile();
        }
    },
    addSkill: async (e) => {
        e.preventDefault();
        const val = e.target.skill.value;
        if (!val || !currentUser) return;
        const skills = [...(currentUser.skills || []), val];
        await supabase.from('profiles').update({ skills }).eq('id', currentUser.id);
        currentUser.skills = skills;
        e.target.reset();
        window.logic.renderProfile();
    },
    addCert: async (e) => {
        e.preventDefault();
        const d = new FormData(e.target);
        const c = { name: d.get('name'), org: d.get('org') };
        const certs = [...(currentUser.certs || []), c];
        await supabase.from('profiles').update({ certs }).eq('id', currentUser.id);
        currentUser.certs = certs;
        e.target.reset();
        window.logic.renderProfile();
    },
    renderProfile: () => {
        if (!currentUser) return;
        document.getElementById('prof-img').src = currentUser.profile_image_url || 'https://placehold.co/128x128/E0E7FF/3B82F6?text=Profile';
        document.getElementById('prof-name').textContent = currentUser.name;
        document.getElementById('prof-roll').textContent = currentUser.roll;

        const resEl = document.getElementById('prof-resume-text');
        const viewBtn = document.getElementById('prof-view-resume');
        if (currentUser.resume_name) { resEl.textContent = currentUser.resume_name; viewBtn.classList.remove('hidden'); }
        else { resEl.textContent = "No resume"; viewBtn.classList.add('hidden'); }

        const sl = document.getElementById('prof-skills');
        sl.innerHTML = '';
        (currentUser.skills || []).forEach(s => sl.innerHTML += `<span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">${escapeHtml(s)}</span>`);

        const cl = document.getElementById('prof-certs');
        cl.innerHTML = '';
        (currentUser.certs || []).forEach(c => {
            cl.innerHTML += `<div class="bg-gray-100 p-2 rounded text-sm flex justify-between"><span><b>${escapeHtml(c.name)}</b> <span class="text-xs text-gray-500">${escapeHtml(c.org)}</span></span></div>`;
        });
    },
    viewResume: () => ui.toast("Resume file saved.", 'success')
};

// --- INIT ---
window.auth.check();
