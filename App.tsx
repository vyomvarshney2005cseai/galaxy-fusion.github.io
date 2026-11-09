import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  StatusBar,
} from 'react-native';
import { COLORS } from './src/theme/colors';
import { supabase } from './src/lib/supabase';
import {
  CollegeInstance,
  Profile,
  CampusPost,
  ProjectRepo,
  SkillGroup,
  JoinRequest,
  GroupMessage,
  HackathonTeam,
  FacultyProjectSlot,
  JobOpening,
  TownhallProposal,
  StudyMaterial,
  CampusNotification,
} from './src/types';
import {
  CAMPUS_COLLEGES,
  DEMO_STUDENT_PROFILE,
  DEMO_FACULTY_PROFILE,
  DEMO_COLLEGE_ADMIN_PROFILE,
  INITIAL_POSTS,
  INITIAL_REPOS,
  INITIAL_GROUPS,
  INITIAL_HACKATHON_TEAMS,
  INITIAL_FACULTY_PROJECTS,
  INITIAL_MENTORS,
  INITIAL_JOBS,
  INITIAL_TOWNHALL_PROPOSALS,
  INITIAL_MATERIALS,
  INITIAL_NOTIFICATIONS,
} from './src/data/mockCampusData';
import { AuthScreen } from './src/screens/AuthScreen';
import { FeedScreen } from './src/screens/FeedScreen';
import { ReposScreen } from './src/screens/ReposScreen';
import { TeamsScreen } from './src/screens/TeamsScreen';
import { CareerScreen } from './src/screens/CareerScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';

type ActiveTab = 'feed' | 'repos' | 'teams' | 'career' | 'profile';

export default function App() {
  const [selectedCollege, setSelectedCollege] = useState<CollegeInstance>(
    CAMPUS_COLLEGES[0]
  );
  const [user, setUser] = useState<Profile | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('feed');
  const [subView, setSubView] = useState<string | undefined>(undefined);

  // App state synced with Supabase + initial campus seed data
  const [posts, setPosts] = useState<CampusPost[]>(INITIAL_POSTS);
  const [repos, setRepos] = useState<ProjectRepo[]>(INITIAL_REPOS);
  const [groups, setGroups] = useState<SkillGroup[]>(INITIAL_GROUPS);
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([
    {
      id: 'req-demo-1',
      group_id: 'grp-react-devs',
      user_id: 'demo-rohan',
      name: 'Rohan Mehra',
      roll: '24BCS055',
      status: 'pending',
    },
  ]);
  const [messagesByGroup, setMessagesByGroup] = useState<
    Record<string, GroupMessage[]>
  >({
    'grp-react-devs': [
      {
        id: 'm1',
        group_id: 'grp-react-devs',
        sender_id: 'demo-isha',
        sender_name: 'Isha Kapoor',
        text: 'Team, SIH internal round is on Friday. Who is taking the React Native frontend?',
        created_at: '10:10 PM',
      },
      {
        id: 'm2',
        group_id: 'grp-react-devs',
        sender_id: 'demo-student-aarav',
        sender_name: 'Aarav Sharma',
        text: 'I will build the React Native LinkedIn + GitHub dashboard. Kabir can wire the Supabase API.',
        created_at: '10:18 PM',
      },
      {
        id: 'm3',
        group_id: 'grp-react-devs',
        sender_id: 'demo-kabir',
        sender_name: 'Kabir Khan',
        text: 'Done. Pushing the repo link to GitHub Projects tonight.',
        created_at: '10:25 PM',
      },
    ],
  });
  const [hackathonTeams, setHackathonTeams] = useState<HackathonTeam[]>(
    INITIAL_HACKATHON_TEAMS
  );
  const [facultyProjects, setFacultyProjects] = useState<FacultyProjectSlot[]>(
    INITIAL_FACULTY_PROJECTS
  );
  const [townhallProposals, setTownhallProposals] = useState<
    TownhallProposal[]
  >(INITIAL_TOWNHALL_PROPOSALS);
  const [mentors, setMentors] = useState<Profile[]>(INITIAL_MENTORS);
  const [jobs, setJobs] = useState<JobOpening[]>(INITIAL_JOBS);
  const [materials, setMaterials] = useState<StudyMaterial[]>(INITIAL_MATERIALS);
  const [notifications] = useState<CampusNotification[]>(
    INITIAL_NOTIFICATIONS
  );
  const [suggestions, setSuggestions] = useState<string[]>([
    'Extend 24x7 Innovation & AI Lab access during Smart India Hackathon week.',
    'Add GitHub Actions CI/CD workshop for 2nd-year students in Technical Club.',
  ]);

  const [showNotifModal, setShowNotifModal] = useState(false);
  const [showCollegeModal, setShowCollegeModal] = useState(false);
  const [toast, setToast] = useState<{
    msg: string;
    type: 'info' | 'success' | 'error';
  } | null>(null);

  const showToast = (
    msg: string,
    type: 'info' | 'success' | 'error' = 'info'
  ) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const { data: dbProjects } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });
        if (dbProjects && dbProjects.length > 0) {
          const mapped: ProjectRepo[] = dbProjects.map((p: any) => ({
            id: p.id,
            title: p.title,
            description: p.description || '',
            github_url: p.github_url || 'https://github.com',
            language: 'TypeScript',
            language_color: '#3178c6',
            stars: 18,
            forks: 4,
            commits: 32,
            user_id: p.user_id,
          }));
          setRepos([...mapped, ...INITIAL_REPOS]);
        }

        const { data: dbJobs } = await supabase
          .from('jobs')
          .select('*')
          .order('created_at', { ascending: false });
        if (dbJobs && dbJobs.length > 0) {
          setJobs([...dbJobs, ...INITIAL_JOBS]);
        }
      } catch {}
    })();
  }, [user]);

  const handleNavigateTab = (tab: string, sub?: string) => {
    setActiveTab(tab as ActiveTab);
    setSubView(sub);
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#0b4f4a" />
        {toast && (
          <View style={[styles.toastBanner, styles[`toast_${toast.type}`]]}>
            <Text style={styles.toastText}>{toast.msg}</Text>
          </View>
        )}
        <AuthScreen
          selectedCollege={selectedCollege}
          onSelectCollege={setSelectedCollege}
          onAuthenticated={(profile) => setUser(profile)}
          showToast={showToast}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {toast && (
        <View style={[styles.toastBanner, styles[`toast_${toast.type}`]]}>
          <Text style={styles.toastText}>{toast.msg}</Text>
        </View>
      )}

      {/* Top Navigation Header with College Switcher & Role Switcher */}
      <View style={styles.topHeader}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={styles.brandTitle}>Galaxy Fusion</Text>
            <TouchableOpacity
              style={styles.collegeBadgeBtn}
              onPress={() => setShowCollegeModal(true)}
            >
              <Text style={styles.collegeBadgeText}>
                🏛️ {selectedCollege.shortName} ▾
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.brandSub}>
            {user.name} ({user.roll}) •{' '}
            {user.role === 'college_admin'
              ? 'College T&P Admin'
              : user.role === 'mentor'
              ? 'Faculty Mentor'
              : 'Verified Student'}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.notifBtn}
          onPress={() => setShowNotifModal(true)}
        >
          <Text style={styles.notifIcon}>🔔</Text>
          <View style={styles.notifDot} />
        </TouchableOpacity>
      </View>

      {/* 1-Tap Perspective Bar: Student vs Faculty vs College T&P */}
      <View style={styles.roleSwitcherBar}>
        <Text style={styles.roleSwitcherLabel}>VIEW AS:</Text>
        {(
          [
            {
              key: 'student',
              label: '⚡ Student',
              profile: DEMO_STUDENT_PROFILE,
            },
            {
              key: 'mentor',
              label: '🎓 Faculty',
              profile: DEMO_FACULTY_PROFILE,
            },
            {
              key: 'college_admin',
              label: '🏛️ College T&P',
              profile: DEMO_COLLEGE_ADMIN_PROFILE,
            },
          ] as const
        ).map((r) => {
          const active = user.role === r.key;
          return (
            <TouchableOpacity
              key={r.key}
              style={[
                styles.roleSwitchPill,
                active && styles.roleSwitchPillActive,
              ]}
              onPress={() => {
                setUser({
                  ...r.profile,
                  college_id: selectedCollege.id,
                  college_name: selectedCollege.name,
                });
                showToast(`Switched to ${r.label} View`, 'info');
              }}
            >
              <Text
                style={[
                  styles.roleSwitchText,
                  active && styles.roleSwitchTextActive,
                ]}
              >
                {r.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Main Screen Content */}
      <View style={{ flex: 1 }}>
        {activeTab === 'feed' && (
          <FeedScreen
            user={user}
            college={selectedCollege}
            posts={posts}
            onToggleLike={(postId) => {
              setPosts((prev) =>
                prev.map((p) =>
                  p.id === postId
                    ? {
                        ...p,
                        liked: !p.liked,
                        likes: p.liked ? p.likes - 1 : p.likes + 1,
                      }
                    : p
                )
              );
            }}
            onAddPost={(content, collabType, repoName, teammateAsk) => {
              const newPost: CampusPost = {
                id: 'post-' + Date.now(),
                collab_type: collabType,
                author_name: user.name,
                author_roll: user.roll,
                author_headline:
                  user.headline ||
                  `${user.branch || 'CSE'} • ${selectedCollege.shortName}`,
                author_role:
                  user.role === 'college_admin'
                    ? 'College T&P'
                    : user.role === 'mentor'
                    ? 'Faculty'
                    : 'Student',
                timestamp: 'Just now',
                type: teammateAsk ? 'teammate_ask' : 'repo_launch',
                content,
                tags: teammateAsk
                  ? ['#AskForTeammates', '#StudentToStudent', `#${selectedCollege.id}`]
                  : ['#CampusCollab', `#${selectedCollege.id}`, '#GalaxyFusion'],
                teammate_ask: teammateAsk,
                linked_repo: repoName
                  ? {
                      name: repoName,
                      language: 'TypeScript',
                      language_color: '#3178c6',
                      stars: 1,
                      forks: 0,
                      url: 'https://github.com/vyomvarshney2005cseai/galaxy-fusion.github.io',
                    }
                  : undefined,
                likes: 1,
                comments: 0,
                liked: true,
              };
              setPosts([newPost, ...posts]);
              showToast(
                teammateAsk
                  ? 'Teammate Request Broadcasted to Campus!'
                  : 'Published to Campus Feed!',
                'success'
              );
            }}
            onJoinTeammateAsk={(postId) => {
              setPosts((prev) =>
                prev.map((p) =>
                  p.id === postId && p.teammate_ask
                    ? {
                        ...p,
                        teammate_ask: {
                          ...p.teammate_ask,
                          slots_left: Math.max(0, p.teammate_ask.slots_left - 1),
                        },
                      }
                    : p
                )
              );
              showToast(
                'Sent your Verified GitHub + Skill Profile to Squad Leader!',
                'success'
              );
            }}
            onNavigateTab={handleNavigateTab}
          />
        )}

        {activeTab === 'repos' && (
          <ReposScreen
            user={user}
            repos={repos}
            onSubmitRepo={async (title, description, github_url, language) => {
              const newRepo: ProjectRepo = {
                id: 'repo-' + Date.now(),
                title,
                description,
                github_url,
                language,
                language_color: '#3178c6',
                stars: 1,
                forks: 0,
                commits: 12,
                owner_name: user.name,
                owner_roll: user.roll,
                user_id: user.id,
              };
              setRepos([newRepo, ...repos]);
              showToast('GitHub Project Added to Portfolio!', 'success');
              try {
                await supabase
                  .from('projects')
                  .insert({ title, description, github_url, user_id: user.id });
              } catch {}
            }}
            onStarRepo={(repoId) => {
              setRepos((prev) =>
                prev.map((r) =>
                  r.id === repoId ? { ...r, stars: (r.stars || 0) + 1 } : r
                )
              );
              showToast('Starred repository ★', 'info');
            }}
          />
        )}

        {activeTab === 'teams' && (
          <TeamsScreen
            user={user}
            collegeShortName={selectedCollege.shortName}
            initialSubTab={
              subView === 'groups'
                ? 'groups'
                : subView === 'hackathons'
                ? 'hackathons'
                : 'teammates'
            }
            groups={groups}
            joinRequests={joinRequests}
            messagesByGroup={messagesByGroup}
            hackathonTeams={hackathonTeams}
            onCreateGroup={async (skill, branch, year) => {
              const newGrp: SkillGroup = {
                id: 'grp-' + Date.now(),
                skill,
                branch,
                year,
                creator_id: user.id,
                member_ids: [user.id],
                last_message: 'Group created! Tap to start chatting.',
              };
              setGroups([newGrp, ...groups]);
              showToast('Skill Group Created!', 'success');
            }}
            onRequestJoinGroup={async () => {
              showToast('Join Request Sent to Group Owner!', 'success');
            }}
            onHandleJoinRequest={(reqId, groupId, userId, action) => {
              setJoinRequests((prev) =>
                prev.map((r) => (r.id === reqId ? { ...r, status: action } : r))
              );
              if (action === 'approve') {
                setGroups((prev) =>
                  prev.map((g) =>
                    g.id === groupId
                      ? { ...g, member_ids: [...(g.member_ids || []), userId] }
                      : g
                  )
                );
                showToast('Member Approved & Added to Group!', 'success');
              } else {
                showToast('Join request declined.', 'info');
              }
            }}
            onSendGroupMessage={async (groupId, text) => {
              const msg: GroupMessage = {
                id: 'msg-' + Date.now(),
                group_id: groupId,
                sender_id: user.id,
                sender_name: user.name,
                text,
                created_at: new Date().toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                }),
              };
              setMessagesByGroup((prev) => ({
                ...prev,
                [groupId]: [...(prev[groupId] || []), msg],
              }));
            }}
            onApplyHackathonTeam={(teamId) => {
              setHackathonTeams((prev) =>
                prev.map((t) =>
                  t.id === teamId ? { ...t, applied: true } : t
                )
              );
              showToast(
                'Sent GitHub + Skill Profile to Squad Leader!',
                'success'
              );
            }}
            onPostHackathonTeam={(
              hackathonName,
              teamName,
              problem,
              haveSkills,
              missingSkills
            ) => {
              const newTeam: HackathonTeam = {
                id: 'hack-' + Date.now(),
                hackathon_name: hackathonName,
                team_name: teamName,
                leader_name: user.name,
                leader_roll: user.roll,
                leader_branch: user.branch || 'CSE',
                problem_statement: problem,
                current_members: 1,
                max_members: 5,
                existing_skills: haveSkills,
                missing_skills: missingSkills,
                deadline: 'Open Now',
                applied: false,
              };
              setHackathonTeams([newTeam, ...hackathonTeams]);
              showToast('Teammate Request Posted to Campus!', 'success');
            }}
            onInvitePeer={(studentName) => {
              showToast(
                `Invited ${studentName} to collaborate on your project!`,
                'success'
              );
            }}
          />
        )}

        {activeTab === 'career' && (
          <CareerScreen
            user={user}
            collegeShortName={selectedCollege.shortName}
            initialSubTab={
              subView === 'faculty-labs'
                ? 'faculty-labs'
                : subView === 'mentors'
                ? 'mentors'
                : subView === 'townhall'
                ? 'townhall'
                : 'placements'
            }
            jobs={jobs}
            facultyProjects={facultyProjects}
            townhallProposals={townhallProposals}
            mentors={mentors}
            onApplyJob={(jobId) => {
              setJobs((prev) =>
                prev.map((j) =>
                  j.id === jobId
                    ? {
                        ...j,
                        applied: true,
                        applicants_count: (j.applicants_count || 20) + 1,
                      }
                    : j
                )
              );
              showToast(
                'Applied with Verified CGPA & GitHub Portfolio!',
                'success'
              );
            }}
            onPostJob={async (
              company,
              role,
              salary,
              eligibility,
              openingType
            ) => {
              const newJob: JobOpening = {
                id: 'job-' + Date.now(),
                opening_type: openingType,
                company,
                role,
                salary,
                tier:
                  openingType === 'Incubation Grant'
                    ? 'College Grant'
                    : 'Super Dream',
                min_cgpa: 7.0,
                eligibility,
                posted_by: user.id,
                applicants_count: 1,
              };
              setJobs([newJob, ...jobs]);
              showToast(
                `Official Opening Posted to ${selectedCollege.shortName}!`,
                'success'
              );
            }}
            onRegisterPlacementProfile={(cgpaAvg, branch, year) => {
              setUser({ ...user, cgpa: cgpaAvg, branch, year: `${year}th Year` });
              showToast(`Placement Profile Updated! CGPA: ${cgpaAvg}`, 'success');
            }}
            onApplyFacultyLab={(slotId) => {
              setFacultyProjects((prev) =>
                prev.map((fp) =>
                  fp.id === slotId ? { ...fp, applied: true } : fp
                )
              );
              showToast(
                'Sent GitHub Portfolio to Faculty Lab Lead!',
                'success'
              );
            }}
            onPostFacultyLab={(title, type, description, skills, perks) => {
              const newLab: FacultyProjectSlot = {
                id: 'fac-' + Date.now(),
                faculty_name: user.name,
                faculty_id: user.id,
                department: user.branch || 'CSE Department',
                designation: 'Faculty Mentor',
                title,
                type,
                description,
                required_skills: skills,
                slots_open: 2,
                perks,
                applied: false,
              };
              setFacultyProjects([newLab, ...facultyProjects]);
              showToast('Faculty Research Lab Slot Posted!', 'success');
            }}
            onUpvoteTownhall={(proposalId) => {
              setTownhallProposals((prev) =>
                prev.map((tp) =>
                  tp.id === proposalId
                    ? {
                        ...tp,
                        upvoted: !tp.upvoted,
                        upvotes: tp.upvoted ? tp.upvotes - 1 : tp.upvotes + 1,
                      }
                    : tp
                )
              );
            }}
            onAddTownhallProposal={(title, category) => {
              const newProp: TownhallProposal = {
                id: 'th-' + Date.now(),
                title,
                category,
                author_roll: user.roll,
                upvotes: 1,
                upvoted: true,
                status: 'Under T&P Review',
              };
              setTownhallProposals([newProp, ...townhallProposals]);
              showToast(
                `Submitted Proposal to ${selectedCollege.shortName} Admin!`,
                'success'
              );
            }}
            onMessageMentor={async (mentor, message) => {
              showToast(`Message sent to ${mentor.name}!`, 'success');
            }}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileScreen
            user={user}
            initialSubSection={
              (['portfolio', 'materials', 'clubs', 'suggestions', 'feedback'].includes(
                subView || ''
              )
                ? subView
                : 'portfolio') as any
            }
            materials={materials}
            suggestions={suggestions}
            onAddSkill={async (skill) => {
              const nextSkills = [...(user.skills || []), skill];
              setUser({ ...user, skills: nextSkills });
              showToast(`Added skill: ${skill}`, 'success');
            }}
            onAddCert={async (name, org) => {
              const nextCerts = [...(user.certs || []), { name, org }];
              setUser({ ...user, certs: nextCerts });
              showToast('Certification added!', 'success');
            }}
            onAddMaterial={async (title, type, link, description) => {
              setMaterials([
                { id: 'mat-' + Date.now(), title, type, link, description },
                ...materials,
              ]);
              showToast('Study Material Uploaded!', 'success');
            }}
            onAddSuggestion={async (text) => {
              setSuggestions([text, ...suggestions]);
              showToast('Anonymous suggestion submitted!', 'success');
            }}
            onSubmitFeedback={async (rating) => {
              showToast(`Thank you for your ${rating}★ feedback!`, 'success');
            }}
            onLogout={async () => {
              await supabase.auth.signOut();
              setUser(null);
              setActiveTab('feed');
            }}
          />
        )}
      </View>

      {/* React Native Bottom Tab Bar */}
      <View style={styles.bottomTabBar}>
        {(
          [
            { id: 'feed', icon: '🏠', label: 'Campus Hub' },
            { id: 'teams', icon: '🤝', label: 'Teammates' },
            { id: 'repos', icon: '🐙', label: 'GitHub' },
            { id: 'career', icon: '🏛️', label: 'College & Labs' },
            { id: 'profile', icon: '👤', label: 'Profile' },
          ] as const
        ).map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tabItem}
              onPress={() => {
                setActiveTab(tab.id);
                setSubView(undefined);
              }}
            >
              <Text style={styles.tabIcon}>{tab.icon}</Text>
              <Text
                style={[
                  styles.tabLabel,
                  isActive && { color: COLORS.primary, fontWeight: '800' },
                ]}
              >
                {tab.label}
              </Text>
              {isActive && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* College Switcher Modal */}
      <Modal visible={showCollegeModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Switch Individual College Workspace
              </Text>
              <TouchableOpacity onPress={() => setShowCollegeModal(false)}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>
            {CAMPUS_COLLEGES.map((col) => (
              <TouchableOpacity
                key={col.id}
                style={[
                  styles.notifItem,
                  col.id === selectedCollege.id && {
                    borderLeftColor: COLORS.primary,
                    backgroundColor: '#f0fdfa',
                  },
                ]}
                onPress={() => {
                  setSelectedCollege(col);
                  setShowCollegeModal(false);
                  showToast(`Switched workspace to ${col.name}`, 'success');
                }}
              >
                <Text style={styles.notifSender}>🏛️ {col.name}</Text>
                <Text style={styles.notifMsg}>
                  {col.verifiedStudents} Verified Students • {col.activeTeams}{' '}
                  Active Squads • {col.openingsCount} Openings
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Notifications Modal */}
      <Modal visible={showNotifModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>3-Way Collaboration Alerts</Text>
              <TouchableOpacity onPress={() => setShowNotifModal(false)}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 340 }}>
              {notifications.map((n) => (
                <View key={n.id} style={styles.notifItem}>
                  <Text style={styles.notifSender}>{n.from_user_name}</Text>
                  <Text style={styles.notifMsg}>{n.message}</Text>
                  <Text style={styles.notifTime}>{n.created_at}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.bg },
  topHeader: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandTitle: { color: '#ffffff', fontSize: 17, fontWeight: '800' },
  collegeBadgeBtn: {
    backgroundColor: 'rgba(13, 17, 23, 0.35)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  collegeBadgeText: { color: '#99f6e4', fontSize: 10, fontWeight: '800' },
  brandSub: { color: '#ccfbf1', fontSize: 10, marginTop: 2 },
  roleSwitcherBar: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  roleSwitcherLabel: {
    color: '#94a3b8',
    fontSize: 9,
    fontWeight: '800',
    marginRight: 2,
  },
  roleSwitchPill: {
    flex: 1,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
  },
  roleSwitchPillActive: {
    backgroundColor: '#14b8a6',
  },
  roleSwitchText: { color: '#cbd5e1', fontSize: 10, fontWeight: '700' },
  roleSwitchTextActive: { color: '#0f172a', fontWeight: '800' },
  notifBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifIcon: { fontSize: 15 },
  notifDot: {
    position: 'absolute',
    top: 5,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
  },
  bottomTabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  tabItem: { alignItems: 'center', flex: 1, position: 'relative' },
  tabIcon: { fontSize: 17 },
  tabLabel: { fontSize: 10, color: '#64748b', marginTop: 2, fontWeight: '600' },
  activeIndicator: {
    width: 18,
    height: 3,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
    marginTop: 3,
  },
  toastBanner: {
    position: 'absolute',
    top: 56,
    left: 20,
    right: 20,
    zIndex: 100,
    backgroundColor: '#0f172a',
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderLeftWidth: 4,
  },
  toast_info: { borderLeftColor: '#3b82f6' },
  toast_success: { borderLeftColor: '#22c55e' },
  toast_error: { borderLeftColor: '#ef4444' },
  toastText: { color: '#ffffff', fontSize: 12, fontWeight: '700' },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalBox: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: { fontSize: 15, fontWeight: '800', color: COLORS.textPrimary },
  closeBtn: { fontSize: 18, color: '#64748b', fontWeight: '800' },
  notifItem: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.indigo,
    marginBottom: 8,
  },
  notifSender: { fontSize: 12, fontWeight: '800', color: COLORS.textPrimary },
  notifMsg: { fontSize: 11, color: COLORS.textSecondary, marginTop: 3 },
  notifTime: { fontSize: 10, color: COLORS.textMuted, marginTop: 4 },
});
