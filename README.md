# Galaxy-Fusion
Building the future of campus networking! 🚀 Campus Connect helps students find project collaborators based on granular skills, not just names. Verified, hyper-local, and real-time. 🤝 From hackathons to startups, find your technical co-pilot today. 🛠️  #CampusConnect #EdTech #StudentDevelopers #Networking #Innovation #BuildTogether
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Galaxy Fusion</title>
    <script src="https://cdn.tailwindcss.com"></script>

    <meta name="theme-color" content="#0f766e">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">

    <style>
        body {
            font-family: 'Inter', sans-serif;
            -webkit-tap-highlight-color: transparent;
        }

        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }

        .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }

        .modern-input {
            width: 100%;
            padding: 0.75rem 1rem;
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 0.75rem;
            transition: all 0.2s;
            outline: none;
        }

        .modern-input:focus {
            background-color: #fff;
            border-color: #0f766e;
            box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.1);
        }

        .dashboard-card {
            transition: transform 0.2s, box-shadow 0.2s;
            cursor: pointer;
        }

        .dashboard-card:active {
            transform: scale(0.98);
        }

        .nav-item.active {
            color: #0f766e;
        }

        .nav-item.active svg {
            fill: currentColor;
            fill-opacity: 0.2;
        }


        .star-rating input {
            display: none;
        }

        .star-rating label {
            float: right;
            cursor: pointer;
            color: #ccc;
            transition: color 0.2s;
        }

        .star-rating label:before {
            content: '★';
            font-size: 30px;
        }

        .star-rating input:checked~label {
            color: #fbbf24;
        }

        .star-rating:not(:checked)>label:hover,
        .star-rating:not(:checked)>label:hover~label {
            color: #fbbf24;
        }

        /* Sidebar Transition */
        #sidebar-menu {
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        #sidebar-overlay {
            transition: opacity 0.3s ease-in-out;
        }

        /* Smooth Page Transitions */
        .page {
            transition: opacity 0.3s ease, transform 0.3s ease;
            opacity: 0;
            transform: scale(0.98);
            display: none;
            /* Default hidden */
        }

        .page.flex {
            display: flex;
            /* Override display none when active */
        }

        .page.active {
            opacity: 1;
            transform: scale(1);
        }

        /* Toast Notifications */
        #toast-container {
            position: fixed;
            top: 1rem;
            left: 50%;
            transform: translateX(-50%);
            z-index: 100;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            width: 90%;
            max-width: 400px;
            pointer-events: none;
        }

        .toast {
            background: white;
            border-radius: 12px;
            padding: 12px 16px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            display: flex;
            align-items: center;
            justify-content: space-between;
            transform: translateY(-20px);
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
            pointer-events: auto;
            border-left: 4px solid;
        }

        .toast.show {
            transform: translateY(0);
            opacity: 1;
        }

        .toast.info {
            border-color: #3b82f6;
        }

        .toast.success {
            border-color: #22c55e;
        }

        .toast.error {
            border-color: #ef4444;
        }

        .toast-content {
            flex-grow: 1;
            margin-right: 10px;
            font-size: 0.9rem;
            color: #334155;
            font-weight: 500;
        }
    </style>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
</head>

<body class="bg-gray-100 flex items-center justify-center min-h-screen">

    <!-- Main Container -->
    <div class="w-full max-w-md mx-auto bg-gray-50 shadow-2xl overflow-hidden min-h-screen flex flex-col relative">

        <!-- Loading Spinner -->
        <div id="loading-spinner"
            class="hidden fixed inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
            <div class="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-2"></div>
            <p id="spinner-text" class="text-teal-800 font-semibold text-sm">Loading...</p>
        </div>

        <!-- Error Banner (Legacy - kept for fallback but hidden) -->
        <div id="error-banner"
            class="hidden fixed top-0 left-0 right-0 bg-red-600 text-white p-4 text-center z-50 shadow-md">
            <p><strong>Error:</strong> <span id="error-message"></span></p>
        </div>

        <!-- Toast Container -->
        <div id="toast-container"></div>

        <!-- SIDEBAR MENU -->
        <div id="sidebar-overlay" class="hidden fixed inset-0 bg-black/50 z-40"></div>
        <div id="sidebar-menu"
            class="fixed inset-y-0 left-0 w-64 bg-white shadow-2xl transform -translate-x-full z-50 flex flex-col h-full">
            <div class="p-6 bg-gradient-to-r from-teal-600 to-teal-700 text-white">
                <h2 class="text-2xl font-extrabold tracking-tight">Galaxy Fusion</h2>
                <p class="text-teal-100 text-sm mt-1">Menu</p>
            </div>
            <nav class="flex-grow p-4 space-y-1 overflow-y-auto">
                <button onclick="nav.to('dashboard'); ui.closeSidebar()"
                    class="w-full flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors font-medium text-left">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2">
                        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                    </svg> Home
                </button>
                <button onclick="nav.to('skill-groups'); ui.closeSidebar()"
                    class="w-full flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors font-medium text-left">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg> Skill Groups
                </button>
                <button onclick="nav.to('projects'); logic.loadProjects(); ui.closeSidebar()"
                    class="w-full flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors font-medium text-left">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="m16 18 6-6-6-6" />
                        <path d="m8 6-6 6 6 6" />
                    </svg> Projects
                </button>
                <button onclick="nav.to('placements'); logic.loadJobsForStudent(); ui.closeSidebar()"
                    class="w-full flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors font-medium text-left">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2">
                        <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg> Placements
                </button>
                <button onclick="nav.to('materials'); logic.loadMaterials(); ui.closeSidebar()"
                    class="w-full flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors font-medium text-left">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2">
                        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                        <polyline points="10 2 10 10 13 7 16 10 16 2" />
                    </svg> Materials
                </button>
                <button onclick="nav.to('mentorship'); logic.loadMentors(); ui.closeSidebar()"
                    class="w-full flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors font-medium text-left">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </svg> Find a Mentor
                </button>
                <button onclick="nav.to('clubs'); ui.closeSidebar()"
                    class="w-full flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors font-medium text-left">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="m12 8 4 4-4 4" />
                        <path d="M8 12h8" />
                    </svg> Join Clubs
                </button>
                <button onclick="nav.to('suggestions'); logic.loadSuggestions(); ui.closeSidebar()"
                    class="w-full flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors font-medium text-left">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </svg> College Suggestions
                </button>
                <button onclick="nav.to('app-feedback'); ui.closeSidebar()"
                    class="w-full flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors font-medium text-left">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                    </svg> App Feedback
                </button>
                <button onclick="ui.toggleModal('profile-modal'); logic.renderProfile(); ui.closeSidebar()"
                    class="w-full flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors font-medium text-left">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2">
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg> Profile
                </button>
            </nav>
            <div class="p-4 border-t border-gray-100">
                <button onclick="auth.logout(); ui.closeSidebar()"
                    class="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-bold text-left">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" x2="9" y1="12" y2="12" />
                    </svg> Logout
                </button>
            </div>
        </div>

        <!-- Welcome Page -->
        <div id="page-welcome"
            class="page flex flex-col items-center justify-center text-center p-8 flex-grow bg-teal-800 text-white relative">
            <div class="absolute top-[-10%] left-[-10%] w-64 h-64 bg-teal-500 opacity-20 rounded-full blur-3xl"></div>
            <div class="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-emerald-500 opacity-20 rounded-full blur-3xl">
            </div>
            <div
                class="relative z-10 mb-8 bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 shadow-xl">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
                    class="text-white">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
            </div>
            <h1 class="text-4xl font-extrabold mb-2">Galaxy Fusion</h1>
            <p class="text-teal-100 mb-10">Learn. Connect. Grow.</p>
            <div class="space-y-3 w-full max-w-xs relative z-10">
                <button onclick="nav.to('login')"
                    class="w-full py-3 bg-white text-teal-900 rounded-xl font-bold shadow-lg active:scale-95 transition-all">Login</button>
                <button onclick="nav.to('signup')"
                    class="w-full py-3 bg-teal-900/40 text-white border border-teal-400/30 rounded-xl font-bold active:scale-95 transition-all">Sign
                    Up</button>
                <button onclick="nav.to('mentor-login')"
                    class="text-sm text-teal-200 hover:text-white mt-4 block w-full">Mentor Access</button>
            </div>
        </div>

        <!-- Auth Pages -->
        <div id="page-signup" class="page hidden flex-col p-6 bg-white h-full overflow-y-auto">
            <div class="mb-8 pt-8">
                <h2 class="text-3xl font-extrabold text-slate-800">Create Account</h2>
                <p class="text-slate-500 mt-2">Join the student community</p>
            </div>
            <form onsubmit="auth.signup(event)" class="space-y-5">
                <input type="text" name="name" class="modern-input" placeholder="Full Name" required>
                <input type="text" name="roll" class="modern-input" placeholder="Roll Number (e.g. 21BCS001)" required>
                <input type="password" name="pass" class="modern-input" placeholder="Password (Min. 6 chars)" required>
                <p id="signup-error-message" class="text-rose-500 text-sm text-center font-medium"></p>
                <div class="pt-4 space-y-4"><button type="submit"
                        class="w-full py-4 bg-teal-700 text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-transform">Create
                        Account</button>
                    <p class="text-center text-sm text-slate-500">Already have an account? <button type="button"
                            onclick="nav.to('login')" class="font-bold text-teal-700">Sign In</button></p>
                </div>
            </form>
        </div>

        <div id="page-login" class="page hidden flex-col p-6 bg-white h-full overflow-y-auto">
            <div class="mb-8 pt-8">
                <h2 class="text-3xl font-extrabold text-slate-800">Welcome Back</h2>
                <p class="text-slate-500 mt-2">Enter your details to login</p>
            </div>
            <form onsubmit="auth.login(event)" class="space-y-5">
                <input type="text" name="roll" class="modern-input" placeholder="Roll Number" required>
                <input type="password" name="pass" class="modern-input" placeholder="Password" required>
                <p id="login-error-message" class="text-rose-500 text-sm text-center font-medium"></p>
                <div class="pt-4 space-y-4"><button type="submit"
                        class="w-full py-4 bg-teal-700 text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-transform">Sign
                        In</button>
                    <p class="text-center text-sm text-slate-500">Don't have an account? <button type="button"
                            onclick="nav.to('signup')" class="font-bold text-teal-700">Sign Up</button></p>
                    <div class="text-center mt-4"><button type="button" onclick="nav.to('mentor-login')"
                            class="text-xs text-slate-400 hover:text-teal-600">Go to Mentor Login</button></div>
                </div>
            </form>
        </div>

        <div id="page-mentor-login" class="page hidden flex-col p-6 bg-slate-50 h-full overflow-y-auto">
            <div class="mb-8 pt-8"><span
                    class="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Mentor</span>
                <h2 class="text-3xl font-extrabold text-slate-800 mt-4">Mentor Login</h2>
            </div>
            <form onsubmit="auth.mentorLogin(event)" class="space-y-5">
                <input type="text" name="id" class="modern-input" placeholder="Username / ID" required>
                <input type="password" name="pass" class="modern-input" placeholder="Password" required>
                <p id="mentor-login-error-message" class="text-rose-500 text-sm text-center font-medium"></p>
                <div class="pt-4 space-y-4"><button type="submit"
                        class="w-full py-4 bg-indigo-700 text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-transform">Login</button>
                    <p class="text-center text-sm text-slate-500">New? <button type="button"
                            onclick="nav.to('mentor-signup')" class="font-bold text-indigo-700">Register</button></p>
                    <div class="text-center mt-4"><button type="button" onclick="nav.to('welcome')"
                            class="text-xs text-slate-400">Back to Home</button></div>
                </div>
            </form>
        </div>

        <div id="page-mentor-signup" class="page hidden flex-col p-6 bg-slate-50 h-full overflow-y-auto">
            <div class="mb-8 pt-8"><span
                    class="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Mentor</span>
                <h2 class="text-3xl font-extrabold text-slate-800 mt-4">Register</h2>
            </div>
            <form onsubmit="auth.mentorSignup(event)" class="space-y-5">
                <input type="text" name="name" class="modern-input" placeholder="Full Name" required>
                <input type="text" name="id" class="modern-input" placeholder="Username / ID" required>
                <select name="type" class="modern-input bg-white">
                    <option value="Faculty">Faculty</option>
                    <option value="Alumni">Alumni</option>
                    <option value="Expert">Expert</option>
                </select>
                <input type="text" name="exp" class="modern-input" placeholder="Area of Expertise" required>
                <input type="password" name="pass" class="modern-input" placeholder="Password" required>
                <p id="mentor-signup-error-message" class="text-rose-500 text-sm text-center font-medium"></p>
                <div class="pt-4 space-y-4"><button type="submit"
                        class="w-full py-4 bg-indigo-700 text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-transform">Register</button>
                    <p class="text-center text-sm text-slate-500">Already registered? <button type="button"
                            onclick="nav.to('mentor-login')" class="font-bold text-indigo-700">Login</button></p>
                </div>
            </form>
        </div>

        <!-- DASHBOARD -->
        <div id="page-dashboard" class="page hidden w-full bg-gray-50 h-full flex-col">
            <!-- Header -->
            <div class="bg-[#0f766e] text-white p-5 pb-8 rounded-b-[2rem] shadow-lg relative z-10">
                <div class="flex justify-between items-center mb-4">
                    <button onclick="ui.toggleSidebar()" class="p-1 transition-transform active:scale-90">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="3" x2="21" y1="6" y2="6" />
                            <line x1="3" x2="21" y1="12" y2="12" />
                            <line x1="3" x2="21" y1="18" y2="18" />
                        </svg>
                    </button>
                    <div class="text-lg font-medium">Hi <span id="user-name-display" class="font-bold">Student</span>
                    </div>
                    <div class="flex items-center space-x-4">
                        <!-- Notification Bell -->
                        <button onclick="ui.toggleModal('notifications-modal'); logic.loadNotifications()"
                            class="relative p-1 transition-transform active:scale-90">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                            </svg>
                            <span id="notif-dot"
                                class="hidden absolute top-0 right-0 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-[#0f766e]"></span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Grid Content -->
            <main class="flex-grow overflow-y-auto no-scrollbar -mt-4 px-4 pb-24 pt-2">
                <div class="grid grid-cols-2 gap-4">

                    <!-- Skill Groups (Orange) -->
                    <div onclick="nav.to('skill-groups')"
                        class="dashboard-card bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl p-4 h-32 flex flex-col justify-between shadow-lg text-white relative overflow-hidden">
                        <h3 class="font-bold text-lg leading-tight z-10">Skill<br>Groups</h3>
                        <div class="absolute -right-4 -bottom-4 text-white opacity-20"><svg
                                xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg></div>
                    </div>

                    <!-- Placements (Blue/Cyan) -->
                    <div onclick="nav.to('placements'); logic.loadJobsForStudent()"
                        class="dashboard-card bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-4 h-32 flex flex-col justify-between shadow-lg text-white relative overflow-hidden">
                        <h3 class="font-bold text-lg leading-tight z-10">Campus<br>Placement</h3>
                        <div class="absolute -right-4 -bottom-4 text-white opacity-20"><svg
                                xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2">
                                <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
                                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                            </svg></div>
                    </div>

                    <!-- Mentorship (Yellow) -->
                    <div onclick="nav.to('mentorship'); logic.loadMentors()"
                        class="dashboard-card bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl p-4 h-32 flex flex-col justify-between shadow-lg text-white relative overflow-hidden">
                        <h3 class="font-bold text-lg leading-tight z-10">Find<br>Mentor</h3>
                        <div class="absolute -right-4 -bottom-4 text-white opacity-20"><svg
                                xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                            </svg></div>
                    </div>

                    <!-- College Suggestions (Green - RENAMED) -->
                    <div onclick="nav.to('suggestions'); logic.loadSuggestions()"
                        class="dashboard-card bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl p-4 h-32 flex flex-col justify-between shadow-lg text-white relative overflow-hidden">
                        <h3 class="font-bold text-lg leading-tight z-10">College<br>Suggestions</h3>
                        <div class="absolute -right-4 -bottom-4 text-white opacity-20"><svg
                                xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2">
                                <path
                                    d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                                <path d="M9 18h6" />
                                <path d="M10 22h4" />
                            </svg></div>
                    </div>

                    <!-- Projects (Blue-Indigo) - NEW -->
                    <div onclick="nav.to('projects'); logic.loadProjects()"
                        class="dashboard-card bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-4 h-32 flex flex-col justify-between shadow-lg text-white relative overflow-hidden">
                        <h3 class="font-bold text-lg leading-tight z-10">Projects</h3>
                        <div class="absolute -right-4 -bottom-4 text-white opacity-20"><svg
                                xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2">
                                <path d="m16 18 6-6-6-6" />
                                <path d="m8 6-6 6 6 6" />
                            </svg></div>
                    </div>

                    <!-- Study Materials (Pink) -->
                    <div onclick="nav.to('materials'); logic.loadMaterials()"
                        class="dashboard-card bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-4 h-32 flex flex-col justify-between shadow-lg text-white relative overflow-hidden">
                        <h3 class="font-bold text-lg leading-tight z-10">Study<br>Materials</h3>
                        <div class="absolute -right-4 -bottom-4 text-white opacity-20"><svg
                                xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                                <polyline points="10 2 10 10 13 7 16 10 16 2" />
                            </svg></div>
                    </div>

                    <!-- Clubs (Teal) -->
                    <div onclick="nav.to('clubs')"
                        class="dashboard-card bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl p-4 h-32 flex flex-col justify-between shadow-lg text-white relative overflow-hidden">
                        <h3 class="font-bold text-lg leading-tight z-10">Join<br>Clubs</h3>
                        <div class="absolute -right-4 -bottom-4 text-white opacity-20"><svg
                                xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10" />
                                <path d="m12 8 4 4-4 4" />
                                <path d="M8 12h8" />
                            </svg></div>
                    </div>

                    <!-- App Feedback (Purple - NEW) -->
                    <div onclick="nav.to('app-feedback')"
                        class="dashboard-card bg-gradient-to-br from-violet-500 to-violet-700 rounded-2xl p-4 h-32 flex flex-col justify-between shadow-lg text-white relative overflow-hidden">
                        <h3 class="font-bold text-lg leading-tight z-10">App<br>Feedback</h3>
                        <div class="absolute -right-4 -bottom-4 text-white opacity-20"><svg
                                xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path d="M12 20h9" />
                                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                            </svg></div>
                    </div>

                    <!-- Post Jobs (Faculty Only) -->
                    <div id="faculty-post-job-card" onclick="nav.to('post-jobs'); logic.loadJobsForFaculty()"
                        class="hidden dashboard-card bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-4 h-32 flex-col justify-between shadow-lg text-white relative overflow-hidden col-span-2">
                        <h3 class="font-bold text-lg leading-tight z-10">Post<br>Jobs</h3>
                        <p class="text-xs text-white/80 z-10">Add Placement & Internships</p>
                        <div class="absolute -right-4 -bottom-4 text-white opacity-20"><svg
                                xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2">
                                <rect width="20" height="14" x="2" y="3" rx="2" />
                                <line x1="8" x2="16" y1="21" y2="21" />
                                <line x1="12" x2="12" y1="17" y2="21" />
                            </svg></div>
                    </div>
                </div>
            </main>

            <!-- Bottom Nav -->
            <div
                class="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-200 flex justify-around items-center py-3 z-40">
                <button id="nav-home" onclick="nav.to('dashboard')"
                    class="nav-item active flex flex-col items-center"><svg xmlns="http://www.w3.org/2000/svg"
                        width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="opacity-20 absolute"
                        stroke="none">
                        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    </svg><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2">
                        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                    </svg><span class="text-[10px] mt-1">Home</span></button>
                <button id="nav-groups" onclick="nav.to('skill-groups')"
                    class="nav-item flex flex-col items-center text-gray-400"><svg xmlns="http://www.w3.org/2000/svg"
                        width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg><span class="text-[10px] mt-1">Groups</span></button>
                <button id="nav-mentors" onclick="nav.to('mentorship'); logic.loadMentors()"
                    class="nav-item flex flex-col items-center text-gray-400"><svg xmlns="http://www.w3.org/2000/svg"
                        width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                    </svg><span class="text-[10px] mt-1">Mentors</span></button>
                <button id="profile-button-nav" onclick="ui.toggleModal('profile-modal'); logic.renderProfile()"
                    class="nav-item flex flex-col items-center text-gray-400"><svg xmlns="http://www.w3.org/2000/svg"
                        width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg><span class="text-[10px] mt-1">Profile</span></button>
            </div>
        </div>

        <!-- SUB PAGES (Hidden by default) -->

        <!-- Projects Page (NEW) -->
        <div id="page-projects" class="page hidden w-full bg-gray-50 h-full flex-col">
            <div class="bg-white p-4 shadow-sm flex items-center sticky top-0 z-10"><button
                    onclick="nav.to('dashboard')" class="p-2 bg-gray-100 rounded-full"><svg
                        xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2">
                        <path d="m12 19-7-7 7-7" />
                        <path d="M19 12H5" />
                    </svg></button>
                <h1 class="ml-4 font-bold text-lg">My Projects</h1>
            </div>
            <main class="p-4 pb-24 overflow-y-auto space-y-6">
                <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 class="text-lg font-bold text-slate-800 mb-2">Submit Project</h2>
                    <form onsubmit="logic.submitProject(event)" class="space-y-4">
                        <input type="text" name="title" class="modern-input" placeholder="Project Title" required>
                        <textarea name="desc" class="modern-input h-24" placeholder="Short Description"
                            required></textarea>
                        <input type="url" name="github" class="modern-input" placeholder="GitHub Repository Link"
                            required>
                        <button type="submit"
                            class="w-full py-2 bg-indigo-600 text-white rounded-xl font-bold shadow-md">Add to
                            Portfolio</button>
                    </form>
                </div>

                <div>
                    <h2 class="text-lg font-bold text-slate-800 mb-3 px-1">Submitted Projects</h2>
                    <div id="projects-list" class="space-y-3">
                        <p class="text-center text-slate-400 text-sm">No projects submitted yet.</p>
                    </div>
                </div>
            </main>
        </div>

        <!-- Materials Page -->
        <div id="page-materials" class="page hidden w-full bg-gray-50 h-full flex-col">
            <div class="bg-white p-4 shadow-sm flex items-center sticky top-0 z-10"><button
                    onclick="nav.to('dashboard')" class="p-2 bg-gray-100 rounded-full"><svg
                        xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2">
                        <path d="m12 19-7-7 7-7" />
                        <path d="M19 12H5" />
                    </svg></button>
                <h1 class="ml-4 font-bold text-lg">Study Materials</h1>
            </div>
            <main class="p-4 pb-24 overflow-y-auto space-y-6">
                <!-- Mentor Upload Section (Visible to Mentors Only) -->
                <div id="mentor-upload-section"
                    class="hidden bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 class="text-lg font-bold text-slate-800 mb-2">Upload Material</h2>
                    <form onsubmit="logic.addMaterial(event)" class="space-y-4">
                        <input type="text" name="title" class="modern-input" placeholder="Title (e.g. Java Notes)"
                            required>
                        <select name="type" class="modern-input bg-white">
                            <option value="pdf">PDF Document</option>
                            <option value="link">External Link</option>
                            <option value="video">Video Link</option>
                            <option value="image">Image</option>
                        </select>
                        <input type="text" name="link" id="material-link-input" class="modern-input"
                            placeholder="Paste Link (URL)">
                        <div class="text-xs text-slate-500">OR Upload File (PDF/Image)</div>
                        <input type="file" name="file" id="material-file-input" class="text-sm w-full">
                        <textarea name="desc" class="modern-input h-20" placeholder="Description..."></textarea>
                        <button type="submit"
                            class="w-full py-2 bg-pink-600 text-white rounded-xl font-bold shadow-md">Upload</button>
                    </form>
                </div>

                <div>
                    <h2 class="text-lg font-bold text-slate-800 mb-3 px-1">Available Materials</h2>
                    <div id="materials-list" class="space-y-3">
                        <p class="text-center text-slate-400 text-sm">No materials uploaded yet.</p>
                    </div>
                </div>
            </main>
        </div>

        <!-- Placements Page -->
        <div id="page-placements" class="page hidden w-full bg-gray-50 h-full flex-col">
            <div class="bg-white p-4 shadow-sm flex items-center sticky top-0 z-10"><button
                    onclick="nav.to('dashboard')" class="p-2 bg-gray-100 rounded-full"><svg
                        xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2">
                        <path d="m12 19-7-7 7-7" />
                        <path d="M19 12H5" />
                    </svg></button>
                <h1 class="ml-4 font-bold text-lg">Campus Placement</h1>
            </div>
            <main class="p-4 pb-24 overflow-y-auto space-y-6">
                <div class="flex gap-2 overflow-x-auto no-scrollbar mb-2">
                    <span
                        class="px-4 py-2 bg-cyan-600 text-white rounded-full text-sm font-bold whitespace-nowrap">All</span>
                    <span
                        class="px-4 py-2 bg-white text-gray-600 border rounded-full text-sm font-bold whitespace-nowrap">Super
                        Dream</span>
                    <span
                        class="px-4 py-2 bg-white text-gray-600 border rounded-full text-sm font-bold whitespace-nowrap">Dream</span>
                    <span
                        class="px-4 py-2 bg-white text-gray-600 border rounded-full text-sm font-bold whitespace-nowrap">Core</span>
                </div>
                <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 class="text-xl font-bold text-slate-800 mb-1">Profile Registration</h2>
                    <p class="text-sm text-slate-500 mb-4">Keep your academic profile updated.</p>
                    <form id="placement-form" onsubmit="logic.submitPlacement(event)" class="space-y-4">
                        <div class="grid grid-cols-2 gap-4">
                            <select name="year" class="modern-input bg-white" required>
                                <option value="" disabled selected>Year</option>
                                <option value="1">1st</option>
                                <option value="2">2nd</option>
                                <option value="3">3rd</option>
                                <option value="4">4th</option>
                            </select>
                            <input type="text" name="branch" class="modern-input" placeholder="Branch" required>
                        </div>
                        <input type="email" name="email" class="modern-input" placeholder="College Email" required>
                        <div>
                            <label class="block text-xs font-bold text-slate-500 mb-2 ml-1 uppercase">Semester
                                CGPA</label>
                            <div class="grid grid-cols-4 gap-2">
                                <input type="text" name="cgpa1" class="modern-input text-center px-1"
                                    placeholder="1"><input type="text" name="cgpa2"
                                    class="modern-input text-center px-1" placeholder="2"><input type="text"
                                    name="cgpa3" class="modern-input text-center px-1" placeholder="3"><input
                                    type="text" name="cgpa4" class="modern-input text-center px-1" placeholder="4">
                                <input type="text" name="cgpa5" class="modern-input text-center px-1"
                                    placeholder="5"><input type="text" name="cgpa6"
                                    class="modern-input text-center px-1" placeholder="6"><input type="text"
                                    name="cgpa7" class="modern-input text-center px-1" placeholder="7"><input
                                    type="text" name="cgpa8" class="modern-input text-center px-1" placeholder="8">
                            </div>
                        </div>
                        <button type="submit"
                            class="w-full py-3 bg-cyan-600 text-white rounded-xl font-bold shadow-lg mt-2">Register</button>
                    </form>
                </div>
                <div>
                    <h2 class="text-lg font-bold text-slate-800 mb-3 px-1">Current Openings</h2>
                    <div id="student-job-list" class="space-y-3">
                        <p class="text-center text-slate-400 text-sm">No job openings yet.</p>
                    </div>
                </div>
            </main>
        </div>

        <!-- Post Jobs Page -->
        <div id="page-post-jobs" class="page hidden w-full bg-gray-50 h-full flex-col">
            <div class="bg-white p-4 shadow-sm flex items-center sticky top-0 z-10"><button
                    onclick="nav.to('dashboard')" class="p-2 bg-gray-100 rounded-full"><svg
                        xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2">
                        <path d="m12 19-7-7 7-7" />
                        <path d="M19 12H5" />
                    </svg></button>
                <h1 class="ml-4 font-bold text-lg">Post a Job</h1>
            </div>
            <main class="p-4 pb-24 overflow-y-auto space-y-6">
                <form onsubmit="logic.postJob(event)"
                    class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                    <input type="text" name="company" class="modern-input" placeholder="Company Name" required>
                    <input type="text" name="role" class="modern-input" placeholder="Job Role" required>
                    <input type="text" name="salary" class="modern-input" placeholder="Package (e.g. 10 LPA)" required>
                    <textarea name="eligibility" class="modern-input h-24" placeholder="Eligibility Criteria & Details"
                        required></textarea>
                    <button type="submit"
                        class="w-full py-3 bg-purple-600 text-white rounded-xl font-bold shadow-lg">Post
                        Opening</button>
                </form>
                <div>
                    <h3 class="font-bold text-slate-700 mb-2 px-1">Posted Jobs</h3>
                    <div id="faculty-job-list" class="space-y-3"></div>
                </div>
            </main>
        </div>

        <!-- Skill Groups -->
        <div id="page-skill-groups" class="page hidden w-full bg-gray-50 h-full flex-col">
            <div class="bg-white p-4 shadow-sm flex items-center justify-between sticky top-0 z-10">
                <button onclick="nav.to('dashboard')" class="p-2 bg-gray-100 rounded-full"><svg
                        xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2">
                        <path d="m12 19-7-7 7-7" />
                        <path d="M19 12H5" />
                    </svg></button>
                <h1 class="font-bold text-lg">Skill Groups</h1>
                <button onclick="ui.toggleModal('roadmap-modal')"
                    class="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-bold">✨ AI Roadmap</button>
            </div>
            <main class="p-4 space-y-4 overflow-y-auto pb-24">
                <div onclick="nav.to('make-group')"
                    class="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer">
                    <div class="bg-teal-100 p-3 rounded-full text-teal-600"><svg xmlns="http://www.w3.org/2000/svg"
                            width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" x2="12" y1="8" y2="16" />
                            <line x1="8" x2="16" y1="12" y2="12" />
                        </svg></div>
                    <h2 class="font-bold">Make a Group</h2>
                </div>
                <div onclick="nav.to('join-group'); logic.loadGroups()"
                    class="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer">
                    <div class="bg-blue-100 p-3 rounded-full text-blue-600"><svg xmlns="http://www.w3.org/2000/svg"
                            width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" x2="16.65" y1="21" y2="16.65" />
                        </svg></div>
                    <h2 class="font-bold">Join a Group</h2>
                </div>
                <div onclick="nav.to('manage-groups'); logic.loadMyGroups()"
                    class="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer">
                    <div class="bg-purple-100 p-3 rounded-full text-purple-600"><svg xmlns="http://www.w3.org/2000/svg"
                            width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path d="M10 17l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                            <path d="M3 12h.01" />
                            <path d="M3 17h.01" />
                            <path d="M3 7h.01" />
                            <path d="M7 12h14" />
                            <path d="M7 17h14" />
                            <path d="M7 7h14" />
                        </svg></div>
                    <h2 class="font-bold">Manage My Groups</h2>
                </div>
            </main>
        </div>

        <div id="page-make-group" class="page hidden w-full bg-gray-50 h-full flex-col">
            <div class="bg-white p-4 shadow-sm flex items-center sticky top-0 z-10"><button
                    onclick="nav.to('skill-groups')" class="p-2 bg-gray-100 rounded-full"><svg
                        xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2">
                        <path d="m12 19-7-7 7-7" />
                        <path d="M19 12H5" />
                    </svg></button>
                <h1 class="ml-4 font-bold">Create Group</h1>
            </div>
            <main class="p-6">
                <form onsubmit="logic.createGroup(event)" class="space-y-4 bg-white p-6 rounded-2xl shadow-sm">
                    <input id="mk-skill" class="modern-input" placeholder="Skill (e.g. React)" required>
                    <input id="mk-branch" class="modern-input" placeholder="Branch" required>
                    <div class="flex justify-between gap-2">
                        <label class="flex-1 text-center border rounded-lg p-2 cursor-pointer bg-gray-50"><input
                                type="radio" name="year" value="1st" required> 1st</label>
                        <label class="flex-1 text-center border rounded-lg p-2 cursor-pointer bg-gray-50"><input
                                type="radio" name="year" value="2nd"> 2nd</label>
                        <label class="flex-1 text-center border rounded-lg p-2 cursor-pointer bg-gray-50"><input
                                type="radio" name="year" value="3rd"> 3rd</label>
                        <label class="flex-1 text-center border rounded-lg p-2 cursor-pointer bg-gray-50"><input
                                type="radio" name="year" value="4th"> 4th</label>
                    </div>
                    <button type="submit"
                        class="w-full py-3 bg-teal-600 text-white rounded-xl font-bold">Create</button>
                </form>
            </main>
        </div>

        <div id="page-join-group" class="page hidden w-full bg-gray-50 h-full flex-col">
            <div class="bg-white p-4 shadow-sm flex items-center sticky top-0 z-10"><button
                    onclick="nav.to('skill-groups')" class="p-2 bg-gray-100 rounded-full"><svg
                        xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2">
                        <path d="m12 19-7-7 7-7" />
                        <path d="M19 12H5" />
                    </svg></button>
                <h1 class="ml-4 font-bold">Join Group</h1>
            </div>
            <main id="join-list" class="p-4 space-y-3 overflow-y-auto pb-24"></main>
        </div>

        <div id="page-manage-groups" class="page hidden w-full bg-gray-50 h-full flex-col">
            <div class="bg-white p-4 shadow-sm flex items-center sticky top-0 z-10"><button
                    onclick="nav.to('skill-groups')" class="p-2 bg-gray-100 rounded-full"><svg
                        xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2">
                        <path d="m12 19-7-7 7-7" />
                        <path d="M19 12H5" />
                    </svg></button>
                <h1 class="ml-4 font-bold">My Groups</h1>
            </div>
            <main id="my-groups-list" class="p-4 space-y-3 overflow-y-auto pb-24"></main>
        </div>

        <div id="page-requests" class="page hidden w-full bg-gray-50 h-full flex-col">
            <div class="bg-white p-4 shadow-sm flex items-center sticky top-0 z-10"><button
                    onclick="nav.to('manage-groups')" class="p-2 bg-gray-100 rounded-full"><svg
                        xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2">
                        <path d="m12 19-7-7 7-7" />
                        <path d="M19 12H5" />
                    </svg></button>
                <h1 class="ml-4 font-bold">Requests</h1>
            </div>
            <main id="requests-list" class="p-4 space-y-3 overflow-y-auto pb-24"></main>
        </div>

        <div id="page-suggestions" class="page hidden w-full bg-gray-50 h-full flex-col">
            <div class="bg-white p-4 shadow-sm flex items-center sticky top-0 z-10"><button
                    onclick="nav.to('dashboard')" class="p-2 bg-gray-100 rounded-full"><svg
                        xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2">
                        <path d="m12 19-7-7 7-7" />
                        <path d="M19 12H5" />
                    </svg></button>
                <h1 class="ml-4 font-bold">College Suggestions</h1>
            </div>
            <main class="p-4 flex-grow pb-24">
                <div class="bg-white p-4 rounded-2xl shadow-sm mb-6">
                    <textarea id="sug-text" class="modern-input h-24 mb-2"
                        placeholder="Your anonymous suggestion..."></textarea>
                    <div class="flex gap-2">
                        <button onclick="ai.polish()"
                            class="flex-1 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-bold">✨ AI
                            Polish</button>
                        <button onclick="logic.addSuggestion()"
                            class="flex-1 py-2 bg-teal-600 text-white rounded-lg text-sm font-bold">Submit</button>
                    </div>
                </div>
                <h3 class="font-bold mb-2 text-slate-700">Recent</h3>
                <div id="sug-list" class="space-y-3"></div>
            </main>
        </div>

        <!-- App Feedback Page -->
        <div id="page-app-feedback" class="page hidden w-full bg-gray-50 h-full flex-col">
            <div class="bg-white p-4 shadow-sm flex items-center sticky top-0 z-10"><button
                    onclick="nav.to('dashboard')" class="p-2 bg-gray-100 rounded-full"><svg
                        xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2">
                        <path d="m12 19-7-7 7-7" />
                        <path d="M19 12H5" />
                    </svg></button>
                <h1 class="ml-4 font-bold">App Feedback</h1>
            </div>
            <main class="p-4 flex-grow pb-24">
                <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                    <h2 class="text-lg font-bold text-slate-800 mb-2">Rate Your Experience</h2>
                    <p class="text-sm text-slate-500 mb-4">Help us improve Galaxy Fusion.</p>
                    <div class="star-rating flex justify-center flex-row-reverse mb-6 gap-2">
                        <input type="radio" id="star5" name="rating" value="5"><label for="star5"></label>
                        <input type="radio" id="star4" name="rating" value="4"><label for="star4"></label>
                        <input type="radio" id="star3" name="rating" value="3"><label for="star3"></label>
                        <input type="radio" id="star2" name="rating" value="2"><label for="star2"></label>
                        <input type="radio" id="star1" name="rating" value="1"><label for="star1"></label>
                    </div>
                    <textarea id="feedback-text" class="modern-input h-32 mb-4"
                        placeholder="Tell us what you think..."></textarea>
                    <button onclick="logic.submitAppFeedback()"
                        class="w-full py-3 bg-violet-600 text-white rounded-xl font-bold shadow-lg">Send
                        Feedback</button>
                </div>
            </main>
        </div>

        <!-- Mentors -->
        <div id="page-mentorship" class="page hidden w-full bg-gray-50 h-full flex-col">
            <div class="bg-white p-4 shadow-sm flex items-center sticky top-0 z-10"><button
                    onclick="nav.to('dashboard')" class="p-2 bg-gray-100 rounded-full"><svg
                        xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2">
                        <path d="m12 19-7-7 7-7" />
                        <path d="M19 12H5" />
                    </svg></button>
                <h1 class="ml-4 font-bold">Mentors</h1>
            </div>
            <main id="mentor-list" class="p-4 space-y-3 overflow-y-auto pb-24"></main>
        </div>

        <!-- Clubs -->
        <div id="page-clubs" class="page hidden w-full bg-gray-50 h-full flex-col">
            <div class="bg-white p-4 shadow-sm flex items-center sticky top-0 z-10"><button
                    onclick="nav.to('dashboard')" class="p-2 bg-gray-100 rounded-full"><svg
                        xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2">
                        <path d="m12 19-7-7 7-7" />
                        <path d="M19 12H5" />
                    </svg></button>
                <h1 class="ml-4 font-bold">Clubs</h1>
            </div>
            <main class="p-4 space-y-4">
                <!-- Club Categories -->
                <div id="club-categories" class="space-y-4">
                    <div onclick="logic.showClubSubCategory('technical')"
                        class="dashboard-card bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-2xl text-white flex items-center justify-between shadow-lg cursor-pointer">
                        <div>
                            <h3 class="font-bold text-xl">Technical Club</h3>
                            <p class="text-sm opacity-90">Coding, AI & Robotics</p>
                        </div><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" stroke-width="2">
                            <path d="m9 18 6-6-6-6" />
                        </svg>
                    </div>
                    <div onclick="logic.showClubSubCategory('sports')"
                        class="dashboard-card bg-gradient-to-r from-indigo-500 to-indigo-600 p-6 rounded-2xl text-white flex items-center justify-between shadow-lg cursor-pointer">
                        <div>
                            <h3 class="font-bold text-xl">Sports Club</h3>
                            <p class="text-sm opacity-90">Football, Cricket & More</p>
                        </div><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" stroke-width="2">
                            <path d="m9 18 6-6-6-6" />
                        </svg>
                    </div>
                    <div onclick="logic.showClubSubCategory('cultural')"
                        class="dashboard-card bg-gradient-to-r from-pink-500 to-rose-600 p-6 rounded-2xl text-white flex items-center justify-between shadow-lg cursor-pointer">
                        <div>
                            <h3 class="font-bold text-xl">Cultural Club</h3>
                            <p class="text-sm opacity-90">Dance, Music & Drama</p>
                        </div><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" stroke-width="2">
                            <path d="m9 18 6-6-6-6" />
                        </svg>
                    </div>
                </div>

                <!-- Sub-Club List (Hidden by default) -->
                <div id="sub-club-list-container" class="hidden">
                    <div class="flex items-center mb-4">
                        <button onclick="logic.hideClubSubCategory()" class="text-slate-500 mr-2 font-bold">&larr;
                            Back</button>
                        <h2 id="sub-club-title" class="font-bold text-lg text-slate-800">Category</h2>
                    </div>
                    <div id="sub-club-items" class="space-y-3"></div>
                </div>
            </main>
        </div>

        <!-- ==================== MODALS ==================== -->

        <!-- Notifications Modal -->
        <div id="notifications-modal"
            class="hidden fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div class="modal-content bg-white w-full max-w-sm rounded-2xl p-5 shadow-2xl">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="font-bold text-lg">Notifications</h3><button
                        onclick="ui.toggleModal('notifications-modal')" class="text-gray-400 text-xl">&times;</button>
                </div>
                <div class="space-y-3 max-h-[60vh] overflow-y-auto no-scrollbar" id="notifications-list">
                    <!-- Static example notifications -->
                    <div class="p-3 bg-indigo-50 rounded-xl border-l-4 border-indigo-500 text-sm">
                        <p class="font-bold text-indigo-800">Mentor Q&A</p><span class="text-xs text-slate-500">New
                            message.</span>
                    </div>
                    <div class="p-3 bg-orange-50 rounded-xl border-l-4 border-orange-500 text-sm">
                        <p class="font-bold text-orange-800">College Event</p><span class="text-xs text-slate-500">Tech
                            Fest Registration Open.</span>
                    </div>
                    <div class="p-3 bg-teal-50 rounded-xl border-l-4 border-teal-500 text-sm">
                        <p class="font-bold text-teal-800">App Update</p><span class="text-xs text-slate-500">New
                            Placement Section added!</span>
                    </div>
                    <!-- Dynamic notifications will be appended here -->
                </div>
            </div>
        </div>

        <!-- Placement Success Modal -->
        <div id="placement-modal"
            class="hidden fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div class="modal-content bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl text-center">
                <div
                    class="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="3">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                </div>
                <h3 class="font-bold text-xl text-slate-800 mb-2">Success!</h3>
                <p class="text-slate-500 mb-6">You get updates on your email.</p>
                <button onclick="ui.toggleModal('placement-modal'); nav.to('dashboard')"
                    class="w-full py-3 bg-green-600 text-white rounded-xl font-bold shadow-lg">Done</button>
            </div>
        </div>

        <!-- Message Modal -->
        <div id="message-modal"
            class="hidden fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div class="modal-content bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="font-bold text-lg">Send Message</h3><button onclick="ui.toggleModal('message-modal')"
                        class="text-gray-400 text-xl">&times;</button>
                </div>
                <textarea id="msg-input" class="modern-input h-32 mb-4"
                    placeholder="Type your message to the mentor..."></textarea>
                <button onclick="logic.sendMessage()"
                    class="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg">Send</button>
            </div>
        </div>

        <!-- AI Roadmap Modal -->
        <div id="roadmap-modal"
            class="hidden fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div class="bg-white w-full max-w-md rounded-2xl p-0 shadow-2xl flex flex-col h-[70vh]">
                <div class="p-4 border-b flex justify-between items-center">
                    <h3 class="font-bold">✨ AI Roadmap</h3><button onclick="ui.toggleModal('roadmap-modal')"
                        class="text-gray-400">&times;</button>
                </div>
                <div class="p-4 bg-gray-50 border-b">
                    <div class="flex gap-2"><input id="roadmap-topic" class="modern-input py-2 text-sm"
                            placeholder="Goal (e.g. Web Dev)"><button onclick="ai.roadmap()"
                            class="bg-indigo-600 text-white px-4 rounded-xl font-bold text-sm">Go</button></div>
                </div>
                <div id="roadmap-output" class="p-4 overflow-y-auto ai-content text-sm">
                    <p class="text-center text-gray-400">Enter a topic.</p>
                </div>
            </div>
        </div>

        <!-- Profile Modal -->
        <div id="profile-modal"
            class="hidden fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div class="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden h-[80vh] flex flex-col">
                <div class="p-4 border-b flex justify-between items-center">
                    <h3 class="font-bold text-lg">Profile</h3><button onclick="ui.toggleModal('profile-modal')"
                        class="text-gray-400 text-2xl">&times;</button>
                </div>
                <div class="p-6 overflow-y-auto no-scrollbar space-y-6">
                    <!-- Img -->
                    <div class="flex flex-col items-center">
                        <img id="prof-img" src=""
                            class="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg bg-gray-200">
                        <button onclick="document.getElementById('prof-img-input').click()"
                            class="text-blue-600 text-sm mt-2 font-medium">Change Photo</button>
                        <input type="file" id="prof-img-input" class="hidden" accept="image/*"
                            onchange="logic.uploadImage(this)">
                    </div>
                    <!-- Info -->
                    <div class="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
                        <h2 id="prof-name" class="font-bold text-lg"></h2>
                        <p id="prof-roll" class="text-gray-500 text-sm"></p>
                    </div>
                    <!-- Resume -->
                    <div>
                        <h4 class="font-bold text-gray-800 mb-2">Resume</h4>
                        <div class="bg-indigo-50 p-3 rounded-xl flex justify-between items-center">
                            <div class="flex-grow mr-2 overflow-hidden">
                                <span id="prof-resume-text" class="text-sm text-indigo-800 truncate block">No
                                    resume.</span>
                            </div>
                            <div class="flex gap-2 shrink-0">
                                <button onclick="document.getElementById('prof-resume-upload').click()"
                                    class="text-xs bg-white text-indigo-600 border border-indigo-200 px-2 py-1 rounded-lg font-bold">Upload</button>
                                <button id="prof-view-resume"
                                    class="hidden text-xs bg-indigo-600 text-white px-3 py-1 rounded-lg font-bold"
                                    onclick="logic.viewResume()">View</button>
                            </div>
                            <input type="file" id="prof-resume-upload" class="hidden" accept=".pdf"
                                onchange="logic.uploadResume(this)">
                        </div>
                    </div>
                    <!-- Skills -->
                    <div>
                        <h4 class="font-bold text-gray-800 mb-2">Skills</h4>
                        <form onsubmit="logic.addSkill(event)" class="flex gap-2 mb-2"><input name="skill"
                                class="modern-input py-2 text-sm" placeholder="Add..."><button
                                class="bg-slate-800 text-white px-3 rounded-lg text-sm">Add</button></form>
                        <div id="prof-skills" class="flex flex-wrap gap-2"></div>
                    </div>
                    <!-- Certs -->
                    <div>
                        <h4 class="font-bold text-gray-800 mb-2">Certifications</h4>
                        <form onsubmit="logic.addCert(event)" class="space-y-2 mb-2 p-3 bg-gray-50 rounded-xl">
                            <input name="name" class="modern-input py-1 text-sm" placeholder="Name">
                            <input name="org" class="modern-input py-1 text-sm" placeholder="Org">
                            <input type="file" name="pdf" class="text-xs w-full" accept=".pdf">
                            <button class="w-full bg-slate-800 text-white py-1 rounded-lg text-sm">Add</button>
                        </form>
                        <div id="prof-certs" class="space-y-2"></div>
                    </div>
                </div>
            </div>
        </div>

    </div>


    <!-- Firebase SDKs (Compat) -->
    <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-storage-compat.js"></script>

    <script>
        document.addEventListener('DOMContentLoaded', () => {

            // --- FIREBASE CONFIGURATION (PLACEHOLDER) ---
            const firebaseConfig = {
                apiKey: "YOUR_API_KEY_HERE",
                authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
                projectId: "YOUR_PROJECT_ID",
                storageBucket: "YOUR_PROJECT_ID.appspot.com",
                messagingSenderId: "YOUR_SENDER_ID",
                appId: "YOUR_APP_ID"
            };

            // Initialize Firebase
            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }
            const authRef = firebase.auth();
            const dbRef = firebase.firestore();
            const storageRef = firebase.storage();

            const API_KEY = "";


            const db = {
                KEYS: { USERS: 'galaxy_users', GROUPS: 'galaxy_groups', REQUESTS: 'galaxy_requests', SESSION: 'galaxy_session', SUGGESTIONS: 'galaxy_suggestions', JOBS: 'galaxy_jobs', NOTIFICATIONS: 'galaxy_notifications', MATERIALS: 'galaxy_materials', FEEDBACK: 'galaxy_feedback', PROJECTS: 'galaxy_projects' },
                get: (k) => JSON.parse(localStorage.getItem('gf_' + k) || (k === 'users' ? '{}' : '[]')),
                set: (k, v) => localStorage.setItem('gf_' + k, JSON.stringify(v)),
                user: () => { try { return JSON.parse(localStorage.getItem('gf_session')); } catch { return null; } },
                login: (u) => localStorage.setItem('gf_session', JSON.stringify(u)),
                logout: () => localStorage.removeItem('gf_session'),
                getNotifications: () => JSON.parse(localStorage.getItem(db.KEYS.NOTIFICATIONS)) || [],
                saveNotifications: (notifs) => localStorage.setItem(db.KEYS.NOTIFICATIONS, JSON.stringify(notifs)),
                saveFeedback: (fb) => { const fbs = JSON.parse(localStorage.getItem(db.KEYS.FEEDBACK)) || []; fbs.push(fb); localStorage.setItem(db.KEYS.FEEDBACK, JSON.stringify(fbs)); }
            };

            const clubData = {
                technical: ['Coding', 'Robotics', 'AI/ML', 'Cyber Security'],
                sports: ['Cricket', 'Football', 'Basketball', 'Badminton'],
                cultural: ['Dance', 'Music', 'Drama', 'Fine Arts']
            };


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
                    } else {
                        window.ui.closeSidebar();
                    }
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
                updateResume: (r) => {

                },
                updateProfileImg: (src) => {

                    const el = document.getElementById('prof-img');
                    if (el) el.src = src || 'https://placehold.co/128x128/E0E7FF/3B82F6?text=Profile';
                },
                viewPdf: (data) => {
                    const win = window.open();
                    win.document.write('<iframe src="' + data + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
                },
                showLoading: (show) => {
                    const el = document.getElementById('loading-spinner');
                    if (show) el.classList.remove('hidden');
                    else el.classList.add('hidden');
                },
                toast: (msg, type = 'info') => {
                    const container = document.getElementById('toast-container');
                    const el = document.createElement('div');
                    el.className = `toast ${type}`;
                    el.innerHTML = `<div class="toast-content">${msg}</div><button onclick="this.parentElement.remove()" class="text-gray-400 hover:text-gray-600">&times;</button>`;
                    container.appendChild(el);

                    // Trigger animation - using double rAF ensures browser paints initial state
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            el.classList.add('show');
                        });
                    });

                    // Auto remove
                    setTimeout(() => {
                        el.classList.remove('show');
                        setTimeout(() => el.remove(), 300);
                    }, 3000);
                },
                triggerResume: () => {
                    // Logic moved to profile, but keeping safety
                    const input = document.getElementById('resume-input-dash');
                    if (input) input.click();
                }
            };

            window.nav = {
                to: (id) => {
                    const currentPages = document.querySelectorAll('.page:not(.hidden)');
                    const targetPage = document.getElementById('page-' + id);

                    if (!targetPage) return;

                    // Helper to clear active state
                    const clearActive = () => {
                        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active', 'text-teal-700'));
                        document.querySelectorAll('.nav-item').forEach(n => n.classList.add('text-gray-400'));
                        if (id === 'dashboard') document.querySelector('#nav-home')?.classList.add('active', 'text-teal-700');
                        else if (id.includes('group')) document.querySelector('#nav-groups')?.classList.add('active', 'text-teal-700');
                        else if (id === 'mentorship') document.querySelector('#nav-mentors')?.classList.add('active', 'text-teal-700');
                        else if (id === 'profile-modal') document.querySelector('#profile-button-nav')?.classList.add('active', 'text-teal-700');
                    }

                    // 1. If we have current pages, fade them out first
                    if (currentPages.length > 0) {
                        currentPages.forEach(p => {
                            p.classList.remove('active');
                            setTimeout(() => {
                                p.classList.add('hidden');
                                p.classList.remove('flex');

                                // Only show new page AFTER the old one is gone
                                if (p === currentPages[currentPages.length - 1]) {
                                    showNewPage();
                                }
                            }, 300); // Match CSS transition duration
                        });
                    } else {
                        // Initial load
                        showNewPage();
                    }

                    function showNewPage() {
                        // 2. Prepare target
                        targetPage.classList.remove('hidden');
                        targetPage.classList.add('flex');

                        // 3. Fade in target (small delay to ensure DOM render)
                        requestAnimationFrame(() => {
                            setTimeout(() => {
                                targetPage.classList.add('active');
                            }, 50);
                        });

                        window.scrollTo(0, 0);
                        clearActive();
                        window.ui.closeSidebar();
                    }
                }
            };

            let currentUser = null;
            let currentManagingGroupId = null;
            let currentMentorUid = null;

            // --- AUTHENTICATION ---
            window.auth = {
                check: () => {
                    const u = db.user();
                    if (u) {
                        window.nav.to('dashboard');
                        const nameDisplay = document.getElementById('user-name-display');
                        if (nameDisplay) nameDisplay.textContent = u.name.split(' ')[0];
                        window.ui.updateResume(u.resume);
                        window.ui.updateProfileImg(u.profileImage);

                        // Faculty Check
                        const jobCard = document.getElementById('faculty-post-job-card');
                        const mentorUploadSection = document.getElementById('mentor-upload-section');

                        if (jobCard) {
                            if (u.role === 'mentor' && u.type === 'Faculty') {
                                jobCard.classList.remove('hidden');
                                jobCard.classList.add('flex');
                            } else {
                                jobCard.classList.add('hidden');
                                jobCard.classList.remove('flex');
                            }
                        }

                        if (mentorUploadSection) {
                            if (u.role === 'mentor') {
                                mentorUploadSection.classList.remove('hidden');
                            } else {
                                mentorUploadSection.classList.add('hidden');
                            }
                        }
                    } else {
                        window.nav.to('welcome');
                    }
                },
                signup: (e) => {
                    e.preventDefault();
                    const d = new FormData(e.target);
                    const u = {
                        uid: 'u_' + Date.now(), name: d.get('name'), roll: d.get('roll'), pass: d.get('pass'),
                        role: 'student', skills: [], certs: [], resume: null, profileImage: null
                    };
                    const users = db.get('users');
                    if (users[u.roll]) return ui.toast('User already exists!', 'error');
                    users[u.roll] = u;
                    db.set('users', users);
                    db.login(u);
                    e.target.reset();
                    window.auth.check();
                },
                login: (e) => {
                    e.preventDefault();
                    const d = new FormData(e.target);
                    const users = db.get('users');
                    const u = users[d.get('roll')];
                    if (u && u.pass === d.get('pass')) { db.login(u); e.target.reset(); window.auth.check(); }
                    else ui.toast('Invalid credentials!', 'error');
                },
                mentorSignup: (e) => {
                    e.preventDefault();
                    const d = new FormData(e.target);
                    const u = {
                        uid: 'm_' + Date.now(), name: d.get('name'), roll: d.get('id'), pass: d.get('pass'),
                        role: 'mentor', type: d.get('type'), exp: d.get('exp'), profileImage: null,
                        skills: [], certs: [], resume: null
                    };
                    const users = db.get('users');
                    if (users[u.roll]) return ui.toast('ID already exists!', 'error');
                    users[u.roll] = u;
                    db.set('users', users);
                    db.login(u);
                    e.target.reset();
                    window.auth.check();
                },
                mentorLogin: (e) => {
                    e.preventDefault();
                    const d = new FormData(e.target);
                    const users = db.get('users');
                    const u = users[d.get('id')];
                    if (u && u.pass === d.get('pass') && u.role === 'mentor') { db.login(u); e.target.reset(); window.auth.check(); }
                    else ui.toast('Invalid Mentor Login!', 'error');
                },
                logout: () => { db.logout(); window.auth.check(); }
            };

            // --- LOGIC & FEATURES ---
            window.logic = {
                createGroup: (e) => {
                    e.preventDefault();
                    const u = db.user();
                    const skillVal = document.getElementById('mk-skill').value;
                    const branchVal = document.getElementById('mk-branch').value;
                    const yearVal = document.querySelector('input[name="year"]:checked').value;

                    const gs = db.get('groups');
                    gs.push({
                        id: 'g_' + Date.now(),
                        skill: skillVal,
                        branch: branchVal,
                        year: yearVal,
                        creator: u.uid, members: [u.uid]
                    });
                    db.set('groups', gs);
                    e.target.reset();
                    window.nav.to('skill-groups');
                },
                loadGroups: () => {
                    const u = db.user();
                    const list = document.getElementById('join-list');
                    if (list) list.innerHTML = '';
                    db.get('groups').forEach(g => {
                        const joined = g.members.includes(u.uid);
                        list.innerHTML += `
                            <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-3">
                                <div class="flex justify-between">
                                    <div><h3 class="font-bold text-slate-800">${g.skill}</h3><p class="text-xs text-slate-500">${g.branch} • ${g.year}</p></div>
                                    ${joined ? '<span class="text-green-600 text-xs font-bold">Joined</span>' : `<button onclick="window.logic.requestJoin('${g.id}')" class="bg-teal-600 text-white px-3 py-1 rounded-lg text-xs">Join</button>`}
                                </div>
                            </div>`;
                    });
                },
                requestJoin: (gid) => {
                    const reqs = db.get('requests');
                    const u = db.user();
                    reqs.push({ gid, uid: u.uid, name: u.name, roll: u.roll, status: 'pending' });
                    db.set('requests', reqs);
                    ui.toast('Join Request Sent!', 'success');
                    window.logic.loadGroups();
                },
                loadMyGroups: () => {
                    const u = db.user();
                    const list = document.getElementById('my-groups-list'); // Corrected ID
                    if (list) list.innerHTML = '';
                    const myGs = db.get('groups').filter(g => g.creator === u.uid);
                    if (myGs.length === 0) return list.innerHTML = '<p class="text-center text-gray-400">None.</p>';
                    myGs.forEach(g => {
                        list.innerHTML += `<div class="bg-white p-4 mb-2 rounded-xl shadow-sm flex justify-between items-center"><b>${g.skill}</b> <button onclick="window.logic.loadReqs('${g.id}')" class="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">Requests</button></div>`;
                    });
                },
                loadReqs: (gid) => {
                    currentManagingGroupId = gid;
                    window.nav.to('requests');
                    const list = document.getElementById('requests-list');
                    if (list) list.innerHTML = '';
                    const reqs = db.get('requests').filter(r => r.gid === gid && r.status === 'pending');
                    if (reqs.length === 0) list.innerHTML = '<p class="text-center text-gray-400">No pending requests.</p>';
                    reqs.forEach((r, i) => {
                        list.innerHTML += `<div class="bg-white p-4 mb-2 rounded-xl shadow-sm"><p class="font-bold">${r.name}</p><p class="text-xs">${r.roll}</p><div class="flex gap-2 mt-2"><button onclick="window.logic.handleReq('${r.uid}', 'approve')" class="flex-1 bg-green-500 text-white py-1 rounded text-xs">Approve</button><button onclick="window.logic.handleReq('${r.uid}', 'decline')" class="flex-1 bg-red-500 text-white py-1 rounded text-xs">Decline</button></div></div>`;
                    });
                },
                handleReq: (uid, action) => {
                    const reqs = db.get('requests');
                    const rIdx = reqs.findIndex(r => r.gid === currentManagingGroupId && r.uid === uid && r.status === 'pending');
                    if (rIdx > -1) {
                        reqs[rIdx].status = action;
                        db.set('requests', reqs);
                    }
                    if (action === 'approve') {
                        const gs = db.get('groups');
                        const g = gs.find(g => g.id === window.currentGid);
                        if (g) { g.members.push(uid); db.set('groups', gs); }
                    }
                    window.logic.loadReqs(currentManagingGroupId);
                },
                loadMentors: () => {
                    const list = document.getElementById('mentor-list');
                    if (list) list.innerHTML = '';
                    const users = Object.values(db.get('users')).filter(u => u.role === 'mentor');
                    users.forEach(m => {
                        let badgeClass = "bg-gray-100 text-gray-600";
                        if (m.type === "Faculty") badgeClass = "bg-blue-100 text-blue-700";
                        else if (m.type === "Alumni") badgeClass = "bg-purple-100 text-purple-700";
                        else if (m.type === "Expert") badgeClass = "bg-emerald-100 text-emerald-700";

                        list.innerHTML += `
                        <div class="bg-white p-4 mb-3 rounded-xl shadow-sm flex items-center gap-3 border-l-4 border-indigo-500">
                            <div class="h-10 w-10 rounded-full bg-gray-200 overflow-hidden"><img src="${m.profileImage || 'https://placehold.co/100'}" class="w-full h-full object-cover"></div>
                            <div class="flex-grow">
                                <div class="flex items-center gap-2">
                                    <h3 class="font-bold text-slate-800">${m.name}</h3>
                                    <span class="${badgeClass} text-[10px] px-2 py-0.5 rounded-full uppercase font-bold">${m.type || 'Mentor'}</span>
                                </div>
                                <p class="text-xs text-slate-500 truncate w-40">${m.exp}</p>
                            </div>
                            <button onclick="window.logic.openMessageModal('${m.uid}')" class="bg-indigo-50 p-2 rounded-full text-indigo-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                            </button>
                        </div>`;
                    });
                },
                openMessageModal: (uid) => {
                    currentMentorUid = uid;
                    window.ui.toggleModal('message-modal');
                },
                sendMessage: () => {
                    const msg = document.getElementById('msg-input').value.trim();
                    if (!msg) return;
                    const notifs = db.getNotifications();
                    const currentUser = db.user();

                    notifs.push({
                        to: currentMentorUid,
                        fromName: currentUser.name,
                        type: 'mentor_msg',
                        message: msg,
                        date: new Date().toISOString()
                    });
                    db.saveNotifications(notifs);
                    document.getElementById('msg-input').value = '';
                    window.ui.toggleModal('message-modal');
                    ui.toast("Message Sent!", 'success');
                },
                loadNotifications: () => {
                    const list = document.getElementById('notifications-list');
                    const notifs = db.getNotifications();
                    const currentUser = db.user();
                    const myNotifs = notifs.filter(n => n.to === currentUser.uid);

                    // Clear list and re-add static ones + dynamic ones
                    // For simplicity in this demo, we just append dynamic ones. In a real app, you'd clear and re-render.
                    // Here we just render the static ones again + dynamic ones.

                    if (myNotifs.length > 0) {
                        myNotifs.forEach(n => {
                            const html = `
                             <div class="p-3 bg-indigo-50 rounded-xl border-l-4 border-indigo-500 text-sm mb-2">
                                <div class="flex justify-between items-start">
                                    <p class="font-bold text-indigo-800">Message from ${n.fromName}</p>
                                    <span class="text-[10px] text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">Message</span>
                                </div>
                                <p class="text-xs text-slate-600 mt-1">${n.message}</p>
                            </div>`;
                            list.insertAdjacentHTML('afterbegin', html);
                        });
                    }
                },
                openNotifications: () => {
                    window.logic.loadNotifications();
                    window.ui.toggleModal('notifications-modal');
                },
                addSuggestion: () => {
                    const t = document.getElementById('sug-text').value;
                    if (!t) return;
                    const s = db.get('suggestions');
                    s.unshift({ text: t });
                    db.set('suggestions', s);
                    document.getElementById('sug-text').value = '';
                    window.logic.loadSuggestions();
                },
                loadSuggestions: () => {
                    const list = document.getElementById('sug-list');
                    if (list) list.innerHTML = '';
                    db.get('suggestions').forEach(s => list.innerHTML += `<div class="bg-white p-3 rounded-lg text-sm shadow-sm border border-slate-100">${s.text}</div>`);
                },
                joinClub: (club) => {
                    const u = db.user();
                    window.location.href = `mailto:kcvinay321@gmail.com?subject=Join ${club} Club&body=Name: ${u.name}%0ARoll: ${u.roll}`;
                },
                showClubSubCategory: (category) => {
                    const subListContainer = document.getElementById('sub-club-list-container');
                    const mainCategories = document.getElementById('club-categories');
                    const itemsContainer = document.getElementById('sub-club-items');
                    const title = document.getElementById('sub-club-title');

                    mainCategories.classList.add('hidden');
                    subListContainer.classList.remove('hidden');
                    title.textContent = category.charAt(0).toUpperCase() + category.slice(1) + " Clubs";
                    itemsContainer.innerHTML = '';

                    clubData[category].forEach(subClub => {
                        itemsContainer.innerHTML += `
                          <div onclick="window.logic.joinClub('${subClub}')" class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center cursor-pointer">
                              <span class="font-bold text-slate-700">${subClub}</span>
                              <span class="text-xs text-teal-600 bg-teal-50 px-2 py-1 rounded-full font-bold">Join</span>
                          </div>`;
                    });
                },
                hideClubSubCategory: () => {
                    document.getElementById('sub-club-list-container').classList.add('hidden');
                    document.getElementById('club-categories').classList.remove('hidden');
                },
                submitProject: (e) => {
                    e.preventDefault();
                    const d = new FormData(e.target);
                    const p = {
                        title: d.get('title'),
                        desc: d.get('desc'),
                        github: d.get('github'),
                        user: db.user().name
                    };
                    const projects = db.get('projects') || [];
                    projects.unshift(p);
                    db.set('projects', projects);
                    e.target.reset();
                    ui.toast("Project Added to Portfolio!", 'success');
                    window.logic.loadProjects();
                },
                loadProjects: () => {
                    const list = document.getElementById('projects-list');
                    if (list) list.innerHTML = '';
                    const projects = db.get('projects') || [];
                    const u = db.user();
                    const myProjects = projects.filter(p => p.user === u.name);

                    if (myProjects.length === 0) {
                        list.innerHTML = '<p class="text-center text-slate-400 text-sm">No projects submitted yet.</p>';
                        return;
                    }

                    myProjects.forEach(p => {
                        list.innerHTML += `
                         <div class="bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-500">
                            <h3 class="font-bold text-slate-800">${p.title}</h3>
                            <p class="text-xs text-slate-500 mt-1">${p.desc}</p>
                            <a href="${p.github}" target="_blank" class="text-xs text-blue-600 mt-2 block hover:underline font-bold">View Code &rarr;</a>
                         </div>`;
                    });
                },
                submitPlacement: (e) => {
                    e.preventDefault();
                    e.target.reset();
                    window.ui.toggleModal('placement-modal');
                },
                postJob: (e) => {
                    e.preventDefault();
                    const d = new FormData(e.target);
                    const job = {
                        id: 'job_' + Date.now(),
                        company: d.get('company'),
                        role: d.get('role'),
                        salary: d.get('salary'),
                        eligibility: d.get('eligibility')
                    };
                    const jobs = db.get('jobs');
                    jobs.unshift(job);
                    db.set('jobs', jobs);
                    e.target.reset();
                    window.logic.loadJobsForFaculty();
                    ui.toast("Job Opening Posted!", 'success');
                },
                loadJobsForFaculty: () => {
                    const list = document.getElementById('faculty-job-list');
                    if (list) list.innerHTML = '';
                    const jobs = db.get('jobs');
                    jobs.forEach(j => {
                        list.innerHTML += `<div class="bg-purple-50 p-3 rounded-lg border border-purple-100 text-sm"><b>${j.company}</b> - ${j.role} (${j.salary})</div>`;
                    });
                },
                loadJobsForStudent: () => {
                    const list = document.getElementById('student-job-list');
                    if (list) list.innerHTML = '';
                    const jobs = db.get('jobs');
                    if (jobs.length === 0) return list.innerHTML = '<p class="text-center text-gray-400 text-sm">No job openings yet.</p>';
                    jobs.forEach(j => {
                        list.innerHTML += `
                         <div class="bg-white p-4 rounded-xl shadow-sm border-l-4 border-cyan-500">
                            <div class="flex justify-between items-start">
                                <h3 class="font-bold text-slate-800">${j.company}</h3>
                                <span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">${j.salary}</span>
                            </div>
                            <p class="text-sm text-cyan-700 font-medium mt-1">${j.role}</p>
                            <p class="text-xs text-gray-500 mt-2 bg-gray-50 p-2 rounded">${j.eligibility}</p>
                         </div>`;
                    });
                },
                addMaterial: (e) => {
                    e.preventDefault();
                    const d = new FormData(e.target);
                    const mat = {
                        id: 'mat_' + Date.now(),
                        title: d.get('title'),
                        type: d.get('type'),
                        link: d.get('link'),
                        desc: d.get('desc'),
                        file: null
                    };

                    // Handle file upload simulation
                    const file = document.getElementById('material-file-input').files[0];
                    if (file && (mat.type === 'pdf' || mat.type === 'image')) {
                        // For stability, we just store name/size, not heavy data
                        mat.file = { name: file.name, size: file.size };
                    }

                    const materials = db.get('materials');
                    materials.unshift(mat);
                    db.set('materials', materials);
                    e.target.reset();
                    ui.toast("Material Uploaded Successfully!", 'success');
                    window.logic.loadMaterials();
                },
                loadMaterials: () => {
                    const list = document.getElementById('materials-list');
                    if (list) list.innerHTML = '';
                    const materials = db.get('materials');

                    if (materials.length === 0) {
                        list.innerHTML = '<p class="text-center text-slate-400 text-sm">No materials uploaded yet.</p>';
                        return;
                    }

                    materials.forEach(m => {
                        let icon = '';
                        let action = '';
                        if (m.type === 'pdf') icon = '<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>';
                        else if (m.type === 'link') icon = '<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>';
                        else if (m.type === 'video') icon = '<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>'; // Film icon
                        else if (m.type === 'image') icon = '<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';

                        if (m.link) action = `<a href="${m.link}" target="_blank" class="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold">Open</a>`;
                        else if (m.file) action = `<button class="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-bold">Download</button>`; // Simulated

                        list.innerHTML += `
                        <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-start gap-3">
                            <div class="bg-gray-50 p-2 rounded-lg">${icon}</div>
                            <div class="flex-grow">
                                <h3 class="font-bold text-slate-800 text-sm">${m.title}</h3>
                                <p class="text-xs text-slate-500 mt-1">${m.desc}</p>
                            </div>
                            <div class="self-center">${action}</div>
                        </div>`;
                    });
                },
                uploadResume: (input) => {
                    const file = input.files[0];
                    if (file && file.type === 'application/pdf') {
                        const r = { name: file.name, size: file.size, data: "placeholder" };
                        const u = db.user(); u.resume = r;
                        const all = db.get('users'); all[u.roll].resume = r;
                        db.set('users', all); db.login(u);
                        window.ui.updateResume(r);
                    }
                },
                uploadImage: (input) => {
                    const file = input.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            const u = db.user(); u.profileImage = e.target.result;
                            const all = db.get('users'); all[u.roll].profileImage = e.target.result;
                            db.set('users', all); db.login(u);
                            window.ui.updateProfileImg(u.profileImage);
                            window.logic.renderProfile();
                        };
                        reader.readAsDataURL(file);
                    }
                },
                addSkill: (e) => {
                    e.preventDefault();
                    const val = e.target.skill.value;
                    if (val) {
                        const u = db.user(); u.skills.push(val);
                        const all = db.get('users'); all[u.roll].skills = u.skills;
                        db.set('users', all); db.login(u);
                        e.target.reset(); window.logic.renderProfile();
                    }
                },
                addCert: (e) => {
                    e.preventDefault();
                    const d = new FormData(e.target);
                    const c = { name: d.get('name'), org: d.get('org'), pdf: null };
                    const file = e.target.pdf.files[0];

                    const save = (certObj) => {
                        const u = db.user(); u.certs.push(certObj);
                        const all = db.get('users'); all[u.roll].certs = u.certs;
                        db.set('users', all); db.login(u);
                        e.target.reset(); window.logic.renderProfile();
                    };

                    if (file) {
                        const r = new FileReader();
                        r.onload = (ev) => { c.pdf = ev.target.result; save(c); };
                        r.readAsDataURL(file);
                    } else { save(c); }
                },
                renderProfile: () => {
                    const u = db.user();
                    if (!u) return;
                    document.getElementById('prof-img').src = u.profileImage || 'https://placehold.co/128x128/E0E7FF/3B82F6?text=Profile';
                    document.getElementById('prof-name').textContent = u.name;
                    document.getElementById('prof-roll').textContent = u.roll;

                    // Resume
                    const resEl = document.getElementById('prof-resume-text');
                    const viewBtn = document.getElementById('prof-view-resume');
                    if (u.resume) { resEl.textContent = u.resume.name; viewBtn.classList.remove('hidden'); }
                    else { resEl.textContent = "No resume"; viewBtn.classList.add('hidden'); }

                    // Skills
                    const sl = document.getElementById('prof-skills'); sl.innerHTML = '';
                    u.skills.forEach(s => sl.innerHTML += `<span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">${s}</span>`);

                    // Certs
                    const cl = document.getElementById('prof-certs'); cl.innerHTML = '';
                    u.certs.forEach(c => {
                        cl.innerHTML += `<div class="bg-gray-100 p-2 rounded text-sm flex justify-between"><span><b>${c.name}</b> <span class="text-xs text-gray-500">${c.org}</span></span> ${c.pdf ? `<button onclick="window.ui.viewPdf('${c.pdf}')" class="text-blue-600 text-xs">View</button>` : ''}</div>`;
                    });
                },
                viewResume: () => {
                    // Placeholder for stability
                    ui.toast("Resume file saved.", 'success');
                }
            };

            // --- AI ---
            window.ai = {
                polish: async () => {
                    const t = document.getElementById('sug-text');
                    if (!t.value) return;
                    window.ui.showLoading(true);
                    const res = await callGemini(`Rewrite professionally: "${t.value}"`);
                    t.value = res.replace(/^"|"$/g, '');
                    window.ui.showLoading(false);
                },
                roadmap: async () => {
                    const t = document.getElementById('roadmap-topic').value;
                    if (!t) return;
                    window.ui.showLoading(true);
                    const res = await callGemini(`Create a 4-week learning roadmap for "${t}". Use HTML tags <h3> and <ul>.`);
                    document.getElementById('roadmap-output').innerHTML = res;
                    window.ui.showLoading(false);
                }
            };

            // API Helper
            async function callGemini(prompt) {
                if (!API_KEY) return "API Key missing. Please configure code.";
                try {
                    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${API_KEY}`, {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
                    });
                    const d = await r.json();
                    return d.candidates?.[0]?.content?.parts?.[0]?.text || "Error generating.";
                } catch { return "Network Error"; }
            }

            // --- INIT ---
            window.auth.check();
        });
    </script>
</body>

</html>
