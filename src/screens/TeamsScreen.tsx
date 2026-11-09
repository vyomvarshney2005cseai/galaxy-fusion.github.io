import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import { COLORS } from '../theme/colors';
import {
  Profile,
  SkillGroup,
  JoinRequest,
  GroupMessage,
  HackathonTeam,
} from '../types';
import { CAMPUS_STUDENTS_DIRECTORY } from '../data/mockCampusData';

interface TeamsScreenProps {
  user: Profile;
  collegeShortName: string;
  initialSubTab?: 'teammates' | 'groups' | 'hackathons';
  groups: SkillGroup[];
  joinRequests: JoinRequest[];
  messagesByGroup: Record<string, GroupMessage[]>;
  hackathonTeams: HackathonTeam[];
  onCreateGroup: (skill: string, branch: string, year: string) => void;
  onRequestJoinGroup: (groupId: string) => void;
  onHandleJoinRequest: (
    reqId: string,
    groupId: string,
    userId: string,
    action: 'approve' | 'decline'
  ) => void;
  onSendGroupMessage: (groupId: string, text: string) => void;
  onApplyHackathonTeam: (teamId: string) => void;
  onPostHackathonTeam: (
    hackathonName: string,
    teamName: string,
    problem: string,
    haveSkills: string[],
    missingSkills: string[]
  ) => void;
  onInvitePeer: (studentName: string) => void;
}

export const TeamsScreen: React.FC<TeamsScreenProps> = ({
  user,
  collegeShortName,
  initialSubTab = 'teammates',
  groups,
  joinRequests,
  messagesByGroup,
  hackathonTeams,
  onCreateGroup,
  onRequestJoinGroup,
  onHandleJoinRequest,
  onSendGroupMessage,
  onApplyHackathonTeam,
  onPostHackathonTeam,
  onInvitePeer,
}) => {
  const [subTab, setSubTab] = useState<'teammates' | 'groups' | 'hackathons'>(
    initialSubTab
  );
  const [groupMode, setGroupMode] = useState<
    'my' | 'join' | 'create' | 'requests' | 'chat'
  >('my');
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);

  // Create group state
  const [skillInput, setSkillInput] = useState('');
  const [branchInput, setBranchInput] = useState('');
  const [yearInput, setYearInput] = useState('3rd');

  // Create Teammate Ask / Squad state
  const [showAskModal, setShowAskModal] = useState(false);
  const [hackEvent, setHackEvent] = useState('');
  const [squadName, setSquadName] = useState('');
  const [problemStmt, setProblemStmt] = useState('');
  const [haveSkillsStr, setHaveSkillsStr] = useState('React Native, TypeScript');
  const [missingSkillsStr, setMissingSkillsStr] = useState('Python ML, UI/UX');

  // Peer directory state
  const [peerSearch, setPeerSearch] = useState('');
  const [invitedIds, setInvitedIds] = useState<string[]>([]);

  // Chat state
  const [chatText, setChatText] = useState('');

  const myGroups = groups.filter(
    (g) => g.creator_id === user.id || (g.member_ids || []).includes(user.id)
  );
  const activeGroup = groups.find((g) => g.id === activeGroupId);
  const activeMessages = activeGroupId ? messagesByGroup[activeGroupId] || [] : [];

  const filteredPeers = CAMPUS_STUDENTS_DIRECTORY.filter(
    (st) =>
      !peerSearch.trim() ||
      st.name.toLowerCase().includes(peerSearch.toLowerCase()) ||
      st.branch.toLowerCase().includes(peerSearch.toLowerCase()) ||
      st.skills.some((s) => s.toLowerCase().includes(peerSearch.toLowerCase()))
  );

  const handleCreate = () => {
    if (!skillInput.trim() || !branchInput.trim()) return;
    onCreateGroup(skillInput.trim(), branchInput.trim(), yearInput);
    setSkillInput('');
    setBranchInput('');
    setGroupMode('my');
  };

  const handleCreateSquadAsk = () => {
    if (!squadName.trim() || !problemStmt.trim()) return;
    onPostHackathonTeam(
      hackEvent.trim() || `${collegeShortName} Project / Hackathon`,
      squadName.trim(),
      problemStmt.trim(),
      haveSkillsStr
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      missingSkillsStr
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    );
    setHackEvent('');
    setSquadName('');
    setProblemStmt('');
    setShowAskModal(false);
  };

  const handleSendChat = () => {
    if (!chatText.trim() || !activeGroupId) return;
    onSendGroupMessage(activeGroupId, chatText.trim());
    setChatText('');
  };

  if (groupMode === 'chat' && activeGroup) {
    return (
      <View style={styles.chatContainer}>
        <View style={styles.chatHeader}>
          <TouchableOpacity
            style={styles.chatBackBtn}
            onPress={() => setGroupMode('my')}
          >
            <Text style={styles.chatBackText}>←</Text>
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.chatTitle}>{activeGroup.skill}</Text>
            <Text style={styles.chatSubtitle}>
              {collegeShortName} • {activeGroup.branch} • {activeGroup.year} •
              Supabase Realtime
            </Text>
          </View>
        </View>

        <ScrollView
          style={styles.chatMessages}
          contentContainerStyle={{ padding: 14, gap: 10 }}
        >
          {activeMessages.length === 0 ? (
            <View style={styles.emptyChat}>
              <Text style={styles.emptyChatText}>
                No messages yet. Say hello to your squad!
              </Text>
            </View>
          ) : (
            activeMessages.map((m) => {
              const isSent = m.sender_id === user.id;
              return (
                <View
                  key={m.id}
                  style={[
                    styles.chatBubble,
                    isSent ? styles.chatBubbleSent : styles.chatBubbleReceived,
                  ]}
                >
                  <Text
                    style={[
                      styles.chatSender,
                      isSent ? { color: '#ccfbf1' } : { color: COLORS.primary },
                    ]}
                  >
                    {isSent ? 'YOU' : m.sender_name}
                  </Text>
                  <Text
                    style={[
                      styles.chatMsgText,
                      isSent ? { color: '#ffffff' } : { color: '#1e293b' },
                    ]}
                  >
                    {m.text}
                  </Text>
                  <Text
                    style={[
                      styles.chatTime,
                      isSent ? { color: '#99f6e4' } : { color: '#94a3b8' },
                    ]}
                  >
                    {m.created_at}
                  </Text>
                </View>
              );
            })
          )}
        </ScrollView>

        <View style={styles.chatInputBar}>
          <TextInput
            style={styles.chatInput}
            placeholder="Message your skill group..."
            value={chatText}
            onChangeText={setChatText}
          />
          <TouchableOpacity style={styles.chatSendBtn} onPress={handleSendChat}>
            <Text style={styles.chatSendText}>➤</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Student <-> Student Collaboration Switcher */}
      <View style={styles.topSegment}>
        <TouchableOpacity
          style={[
            styles.segmentBtn,
            subTab === 'teammates' && styles.segmentBtnActive,
          ]}
          onPress={() => setSubTab('teammates')}
        >
          <Text
            style={[
              styles.segmentText,
              subTab === 'teammates' && styles.segmentTextActive,
            ]}
          >
            🤝 Ask Teammates
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.segmentBtn,
            subTab === 'hackathons' && styles.segmentBtnActive,
          ]}
          onPress={() => setSubTab('hackathons')}
        >
          <Text
            style={[
              styles.segmentText,
              subTab === 'hackathons' && styles.segmentTextActive,
            ]}
          >
            🔍 Find Peers
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.segmentBtn,
            subTab === 'groups' && styles.segmentBtnActive,
          ]}
          onPress={() => setSubTab('groups')}
        >
          <Text
            style={[
              styles.segmentText,
              subTab === 'groups' && styles.segmentTextActive,
            ]}
          >
            💬 Skill Groups
          </Text>
        </TouchableOpacity>
      </View>

      {subTab === 'teammates' && (
        <View style={{ gap: 12 }}>
          <View style={styles.hackBanner}>
            <Text style={styles.hackBannerBadge}>
              STUDENT ↔ STUDENT • {collegeShortName.toUpperCase()}
            </Text>
            <Text style={styles.hackBannerTitle}>
              Ask for Teammates & Form Cross-Branch Squads
            </Text>
            <Text style={styles.hackBannerSub}>
              Post what skills your project or hackathon squad already has and what skills you are missing.
            </Text>
            <TouchableOpacity
              style={styles.postSquadBtn}
              onPress={() => setShowAskModal(!showAskModal)}
            >
              <Text style={styles.postSquadBtnText}>
                {showAskModal
                  ? '✕ Close Teammate Request Form'
                  : '+ Post "Looking for Teammates" Request'}
              </Text>
            </TouchableOpacity>
          </View>

          {showAskModal && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                Ask {collegeShortName} Students to Join Your Squad
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Hackathon / Course / Startup (e.g. SIH 2026 Internal Round)"
                value={hackEvent}
                onChangeText={setHackEvent}
              />
              <TextInput
                style={styles.input}
                placeholder="Squad / Project Name (e.g. Neural Nexus)"
                value={squadName}
                onChangeText={setSquadName}
              />
              <TextInput
                style={[styles.input, { minHeight: 58 }]}
                placeholder="Problem Statement & what your squad is building..."
                multiline
                value={problemStmt}
                onChangeText={setProblemStmt}
              />
              <TextInput
                style={styles.input}
                placeholder="Skills We Have (comma-separated: React Native, Node.js)"
                value={haveSkillsStr}
                onChangeText={setHaveSkillsStr}
              />
              <TextInput
                style={styles.input}
                placeholder="Missing Skills Needed (comma-separated: Python ML, UI/UX)"
                value={missingSkillsStr}
                onChangeText={setMissingSkillsStr}
              />
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={handleCreateSquadAsk}
              >
                <Text style={styles.primaryBtnText}>
                  Broadcast Teammate Request
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {hackathonTeams.map((team) => (
            <View key={team.id} style={styles.hackCard}>
              <View style={styles.hackHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.hackEvent}>{team.hackathon_name}</Text>
                  <Text style={styles.hackTeamName}>{team.team_name}</Text>
                  <Text style={styles.hackLeader}>
                    Lead: {team.leader_name} ({team.leader_roll} •{' '}
                    {team.leader_branch})
                  </Text>
                </View>
                <View style={styles.slotsBadge}>
                  <Text style={styles.slotsBadgeText}>
                    {team.current_members}/{team.max_members} Filled
                  </Text>
                </View>
              </View>

              <Text style={styles.hackProblem}>{team.problem_statement}</Text>

              <View style={styles.skillsSection}>
                <Text style={styles.skillSectionLabel}>HAVE SKILLS:</Text>
                <View style={styles.chipWrap}>
                  {team.existing_skills.map((s) => (
                    <View key={s} style={styles.haveSkillChip}>
                      <Text style={styles.haveSkillText}>✓ {s}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.skillsSection}>
                <Text style={[styles.skillSectionLabel, { color: '#dc2626' }]}>
                  MISSING SKILLS NEEDED:
                </Text>
                <View style={styles.chipWrap}>
                  {team.missing_skills.map((s) => (
                    <View key={s} style={styles.missingSkillChip}>
                      <Text style={styles.missingSkillText}>+ {s}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.hackFooter}>
                <Text style={styles.deadlineText}>⏰ {team.deadline}</Text>
                <TouchableOpacity
                  style={[
                    styles.teamUpBtn,
                    team.applied && { backgroundColor: '#16a34a' },
                  ]}
                  onPress={() => onApplyHackathonTeam(team.id)}
                >
                  <Text style={styles.teamUpBtnText}>
                    {team.applied
                      ? '✓ Pitch Sent (GitHub Attached)'
                      : 'Pitch to Join Squad →'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      {subTab === 'hackathons' && (
        /* Student Directory & Skill-Gap Peer Matcher */
        <View style={{ gap: 12 }}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              🔍 Verified {collegeShortName} Student Builders
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Search peers by skill (e.g. PyTorch, ESP32, UI/UX, ECE)..."
              value={peerSearch}
              onChangeText={setPeerSearch}
            />
          </View>

          {filteredPeers.map((peer) => {
            const isInvited = invitedIds.includes(peer.id);
            return (
              <View key={peer.id} style={styles.hackCard}>
                <View style={styles.hackHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.hackTeamName}>
                      {peer.name}{' '}
                      <Text style={{ fontSize: 11, color: COLORS.primary }}>
                        ✓ {peer.roll}
                      </Text>
                    </Text>
                    <Text style={styles.hackLeader}>
                      {peer.branch} • {peer.year} • CGPA {peer.cgpa}
                    </Text>
                    <Text style={{ fontSize: 11, color: '#0a66c2', marginTop: 2 }}>
                      🐙 @{peer.github_handle} ({peer.commits} commits) • Top:{' '}
                      {peer.topRepo}
                    </Text>
                  </View>
                  <View style={styles.matchBadge}>
                    <Text style={styles.matchBadgeText}>
                      {peer.matchScore}% Match
                    </Text>
                  </View>
                </View>

                <View style={styles.chipWrap}>
                  {peer.skills.map((s) => (
                    <View key={s} style={styles.haveSkillChip}>
                      <Text style={styles.haveSkillText}>{s}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.hackFooter}>
                  <Text style={styles.deadlineText}>🟢 {peer.status}</Text>
                  <TouchableOpacity
                    style={[
                      styles.teamUpBtn,
                      isInvited && { backgroundColor: '#16a34a' },
                    ]}
                    onPress={() => {
                      if (!isInvited) setInvitedIds([...invitedIds, peer.id]);
                      onInvitePeer(peer.name);
                    }}
                  >
                    <Text style={styles.teamUpBtnText}>
                      {isInvited ? '✓ Invite Sent' : 'Invite to My Team →'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      )}

      {subTab === 'groups' && (
        <>
          <View style={styles.groupActionRow}>
            <TouchableOpacity
              style={[
                styles.actionPill,
                groupMode === 'my' && styles.actionPillActive,
              ]}
              onPress={() => setGroupMode('my')}
            >
              <Text
                style={[
                  styles.actionPillText,
                  groupMode === 'my' && styles.actionPillTextActive,
                ]}
              >
                My Groups ({myGroups.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionPill,
                groupMode === 'join' && styles.actionPillActive,
              ]}
              onPress={() => setGroupMode('join')}
            >
              <Text
                style={[
                  styles.actionPillText,
                  groupMode === 'join' && styles.actionPillTextActive,
                ]}
              >
                Join a Group
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionPill,
                groupMode === 'create' && styles.actionPillActive,
              ]}
              onPress={() => setGroupMode('create')}
            >
              <Text
                style={[
                  styles.actionPillText,
                  groupMode === 'create' && styles.actionPillTextActive,
                ]}
              >
                + Make Group
              </Text>
            </TouchableOpacity>
          </View>

          {groupMode === 'create' && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                Create a {collegeShortName} Skill Group
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Skill / Squad Name (e.g. React Native Builders)"
                value={skillInput}
                onChangeText={setSkillInput}
              />
              <TextInput
                style={styles.input}
                placeholder="Branch (e.g. CSE / ECE / All Branches)"
                value={branchInput}
                onChangeText={setBranchInput}
              />
              <View style={styles.yearRow}>
                {['1st', '2nd', '3rd', '4th'].map((yr) => (
                  <TouchableOpacity
                    key={yr}
                    style={[
                      styles.yearPill,
                      yearInput === yr && styles.yearPillActive,
                    ]}
                    onPress={() => setYearInput(yr)}
                  >
                    <Text
                      style={[
                        styles.yearPillText,
                        yearInput === yr && styles.yearPillTextActive,
                      ]}
                    >
                      {yr} Year
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity style={styles.primaryBtn} onPress={handleCreate}>
                <Text style={styles.primaryBtnText}>Create Skill Group</Text>
              </TouchableOpacity>
            </View>
          )}

          {groupMode === 'my' &&
            myGroups.map((g, idx) => {
              const isOwner = g.creator_id === user.id;
              const pendingCount = joinRequests.filter(
                (r) => r.group_id === g.id && r.status === 'pending'
              ).length;
              const avatarColors = ['#f97316', '#3b82f6', '#8b5cf6', '#14b8a6'];
              return (
                <TouchableOpacity
                  key={g.id}
                  style={styles.groupChatCard}
                  onPress={() => {
                    setActiveGroupId(g.id);
                    setGroupMode('chat');
                  }}
                >
                  <View
                    style={[
                      styles.groupAvatar,
                      {
                        backgroundColor: avatarColors[idx % avatarColors.length],
                      },
                    ]}
                  >
                    <Text style={styles.groupAvatarText}>
                      {g.skill.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.groupName}>{g.skill}</Text>
                    <Text style={styles.groupMeta}>
                      {g.branch} • {g.year} Year
                    </Text>
                    <Text style={styles.groupPreview} numberOfLines={1}>
                      {g.last_message || 'Tap to open live group chat →'}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end', gap: 6 }}>
                    <View
                      style={[
                        styles.ownerBadge,
                        { backgroundColor: isOwner ? '#dbeafe' : '#dcfce7' },
                      ]}
                    >
                      <Text
                        style={{
                          fontSize: 9,
                          fontWeight: '800',
                          color: isOwner ? '#1d4ed8' : '#15803d',
                        }}
                      >
                        {isOwner ? 'OWNER' : 'MEMBER'}
                      </Text>
                    </View>
                    {isOwner && (
                      <TouchableOpacity
                        onPress={() => {
                          setActiveGroupId(g.id);
                          setGroupMode('requests');
                        }}
                      >
                        <Text style={styles.requestsLink}>
                          Requests ({pendingCount})
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}

          {groupMode === 'join' &&
            groups.map((g) => {
              const isJoined =
                g.creator_id === user.id ||
                (g.member_ids || []).includes(user.id);
              return (
                <View key={g.id} style={styles.groupChatCard}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.groupName}>{g.skill}</Text>
                    <Text style={styles.groupMeta}>
                      {g.branch} • {g.year} Year •{' '}
                      {(g.member_ids || []).length || 1} members
                    </Text>
                  </View>
                  {isJoined ? (
                    <Text style={styles.joinedLabel}>✓ Joined</Text>
                  ) : (
                    <TouchableOpacity
                      style={styles.joinBtn}
                      onPress={() => onRequestJoinGroup(g.id)}
                    >
                      <Text style={styles.joinBtnText}>Request Join</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}

          {groupMode === 'requests' && (
            <View style={styles.card}>
              <View style={styles.reqHeader}>
                <Text style={styles.cardTitle}>
                  Join Requests — {activeGroup?.skill}
                </Text>
                <TouchableOpacity onPress={() => setGroupMode('my')}>
                  <Text style={styles.requestsLink}>← Back</Text>
                </TouchableOpacity>
              </View>
              {joinRequests.filter(
                (r) => r.group_id === activeGroupId && r.status === 'pending'
              ).length === 0 ? (
                <Text style={styles.emptyText}>No pending join requests.</Text>
              ) : (
                joinRequests
                  .filter(
                    (r) => r.group_id === activeGroupId && r.status === 'pending'
                  )
                  .map((r) => (
                    <View key={r.id} style={styles.reqItem}>
                      <View>
                        <Text style={styles.groupName}>{r.name}</Text>
                        <Text style={styles.groupMeta}>Roll No: {r.roll}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', gap: 8 }}>
                        <TouchableOpacity
                          style={styles.approveBtn}
                          onPress={() =>
                            onHandleJoinRequest(
                              r.id,
                              r.group_id,
                              r.user_id,
                              'approve'
                            )
                          }
                        >
                          <Text style={styles.approveBtnText}>Approve</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.declineBtn}
                          onPress={() =>
                            onHandleJoinRequest(
                              r.id,
                              r.group_id,
                              r.user_id,
                              'decline'
                            )
                          }
                        >
                          <Text style={styles.declineBtnText}>Decline</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))
              )}
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 14, paddingBottom: 90, gap: 12 },
  topSegment: {
    flexDirection: 'row',
    backgroundColor: '#e2e8f0',
    borderRadius: 12,
    padding: 4,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: 'center',
  },
  segmentBtnActive: { backgroundColor: '#ffffff' },
  segmentText: { fontSize: 11, fontWeight: '700', color: '#64748b' },
  segmentTextActive: { color: COLORS.primary, fontWeight: '800' },
  groupActionRow: { flexDirection: 'row', gap: 8 },
  actionPill: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  actionPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  actionPillText: { fontSize: 11, fontWeight: '700', color: COLORS.textSecondary },
  actionPillTextActive: { color: '#ffffff' },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 10,
  },
  cardTitle: { fontSize: 15, fontWeight: '800', color: COLORS.textPrimary },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
  },
  yearRow: { flexDirection: 'row', gap: 8 },
  yearPill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
  },
  yearPillActive: {
    backgroundColor: '#ccfbf1',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  yearPillText: { fontSize: 11, fontWeight: '700', color: '#64748b' },
  yearPillTextActive: { color: COLORS.primary },
  primaryBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryBtnText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  groupChatCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 13,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  groupAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupAvatarText: { color: '#fff', fontWeight: '800', fontSize: 17 },
  groupName: { fontSize: 14, fontWeight: '800', color: COLORS.textPrimary },
  groupMeta: { fontSize: 11, color: COLORS.textSecondary, marginTop: 1 },
  groupPreview: { fontSize: 11, color: COLORS.textMuted, marginTop: 3 },
  ownerBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  requestsLink: { fontSize: 11, fontWeight: '800', color: COLORS.indigo },
  joinedLabel: { fontSize: 12, fontWeight: '800', color: COLORS.success },
  joinBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  joinBtnText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  reqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
    paddingVertical: 12,
  },
  reqItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  approveBtn: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  approveBtnText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  declineBtn: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  declineBtnText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  chatContainer: { flex: 1, backgroundColor: '#f0f4f3' },
  chatHeader: {
    backgroundColor: COLORS.primary,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  chatBackBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatBackText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  chatTitle: { color: '#fff', fontSize: 15, fontWeight: '800' },
  chatSubtitle: { color: '#ccfbf1', fontSize: 11 },
  chatMessages: { flex: 1 },
  emptyChat: { padding: 32, alignItems: 'center' },
  emptyChatText: { color: '#64748b', fontSize: 13 },
  chatBubble: { maxWidth: '82%', padding: 11, borderRadius: 14 },
  chatBubbleSent: { alignSelf: 'flex-end', backgroundColor: COLORS.primary },
  chatBubbleReceived: { alignSelf: 'flex-start', backgroundColor: '#ffffff' },
  chatSender: { fontSize: 9, fontWeight: '800', marginBottom: 2 },
  chatMsgText: { fontSize: 13, lineHeight: 18 },
  chatTime: { fontSize: 9, marginTop: 4, textAlign: 'right' },
  chatInputBar: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    gap: 8,
    marginBottom: 64,
  },
  chatInput: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 9,
    fontSize: 13,
  },
  chatSendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatSendText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  hackBanner: {
    backgroundColor: '#0f766e',
    borderRadius: 16,
    padding: 15,
    gap: 6,
  },
  hackBannerBadge: { color: '#99f6e4', fontSize: 10, fontWeight: '800' },
  hackBannerTitle: { color: '#ffffff', fontSize: 17, fontWeight: '800' },
  hackBannerSub: { color: '#ccfbf1', fontSize: 12, lineHeight: 17 },
  postSquadBtn: {
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 6,
  },
  postSquadBtnText: { color: '#0f766e', fontWeight: '800', fontSize: 12 },
  hackCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 10,
  },
  hackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  hackEvent: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.indigo,
    textTransform: 'uppercase',
  },
  hackTeamName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  hackLeader: { fontSize: 11, color: COLORS.textSecondary, marginTop: 1 },
  slotsBadge: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  slotsBadgeText: { fontSize: 10, fontWeight: '800', color: '#3730a3' },
  matchBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  matchBadgeText: { fontSize: 10, fontWeight: '800', color: '#166534' },
  hackProblem: { fontSize: 12, color: '#334155', lineHeight: 18 },
  skillsSection: { gap: 4 },
  skillSectionLabel: { fontSize: 10, fontWeight: '800', color: '#15803d' },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  haveSkillChip: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  haveSkillText: { fontSize: 10, fontWeight: '700', color: '#166534' },
  missingSkillChip: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  missingSkillText: { fontSize: 10, fontWeight: '800', color: '#991b1b' },
  hackFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  deadlineText: { fontSize: 11, fontWeight: '700', color: COLORS.textSecondary },
  teamUpBtn: {
    backgroundColor: COLORS.indigo,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 9,
  },
  teamUpBtnText: { color: '#fff', fontSize: 11, fontWeight: '800' },
});
