import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Linking,
} from 'react-native';
import { COLORS } from '../theme/colors';
import { CampusPost, CollegeInstance, CollabPillar, Profile } from '../types';

interface FeedScreenProps {
  user: Profile;
  college: CollegeInstance;
  posts: CampusPost[];
  onToggleLike: (postId: string) => void;
  onAddPost: (
    content: string,
    collabType: 'student-student' | 'student-faculty' | 'student-college',
    repoName?: string,
    teammateAsk?: {
      project_title: string;
      category: 'Hackathon' | 'Project' | 'Startup' | 'Competition';
      needed_skills: string[];
      slots_left: number;
      total_slots: number;
    }
  ) => void;
  onJoinTeammateAsk: (postId: string) => void;
  onNavigateTab: (tab: string, subView?: string) => void;
}

export const FeedScreen: React.FC<FeedScreenProps> = ({
  user,
  college,
  posts,
  onToggleLike,
  onAddPost,
  onJoinTeammateAsk,
  onNavigateTab,
}) => {
  const [pillarFilter, setPillarFilter] = useState<CollabPillar>('all');
  const [showComposer, setShowComposer] = useState(false);
  const [composerMode, setComposerMode] = useState<'teammate' | 'update'>('teammate');

  // Composer inputs
  const [postText, setPostText] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [neededSkills, setNeededSkills] = useState('');
  const [slotsLeft, setSlotsLeft] = useState('2');
  const [repoAttach, setRepoAttach] = useState('');

  const filteredPosts =
    pillarFilter === 'all'
      ? posts
      : posts.filter((p) => p.collab_type === pillarFilter);

  const handlePublish = () => {
    if (!postText.trim()) return;
    const defaultCollab =
      user.role === 'college_admin'
        ? 'student-college'
        : user.role === 'mentor'
        ? 'student-faculty'
        : 'student-student';

    const askPayload =
      composerMode === 'teammate' && projectTitle.trim()
        ? {
            project_title: projectTitle.trim(),
            category: 'Hackathon' as const,
            needed_skills: neededSkills
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean),
            slots_left: parseInt(slotsLeft, 10) || 2,
            total_slots: 5,
          }
        : undefined;

    onAddPost(
      postText.trim(),
      defaultCollab,
      repoAttach.trim() || undefined,
      askPayload
    );
    setPostText('');
    setProjectTitle('');
    setNeededSkills('');
    setRepoAttach('');
    setShowComposer(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* College-Specific Verified Hub Banner */}
      <View style={styles.collegeHubBanner}>
        <View style={styles.collegeHubTop}>
          <View style={{ flex: 1 }}>
            <Text style={styles.collegeDomainTag}>
              🏛️ VERIFIED CAMPUS HUB • {college.domain.toUpperCase()}
            </Text>
            <Text style={styles.collegeHubName}>{college.name}</Text>
          </View>
          <View style={styles.onlinePill}>
            <Text style={styles.onlinePillText}>
              {college.verifiedStudents} Verified
            </Text>
          </View>
        </View>

        {/* 3 Collaboration Hubs Quick Cards */}
        <View style={styles.threeWayRow}>
          <TouchableOpacity
            style={[styles.wayCard, { borderLeftColor: '#14b8a6' }]}
            onPress={() => onNavigateTab('teams', 'teammates')}
          >
            <Text style={styles.wayTitle}>🤝 Student–Student</Text>
            <Text style={styles.waySub}>{college.activeTeams} Active Squads</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.wayCard, { borderLeftColor: '#818cf8' }]}
            onPress={() => onNavigateTab('career', 'faculty-labs')}
          >
            <Text style={styles.wayTitle}>🎓 Student–Faculty</Text>
            <Text style={styles.waySub}>Research & SIH Labs</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.wayCard, { borderLeftColor: '#38bdf8' }]}
            onPress={() => onNavigateTab('career', 'placements')}
          >
            <Text style={styles.wayTitle}>🏛️ Student–College</Text>
            <Text style={styles.waySub}>{college.openingsCount} T&P Openings</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Ask for Teammates / Broadcast Composer */}
      <View style={styles.composerCard}>
        <View style={styles.composerActionRow}>
          <TouchableOpacity
            style={styles.askTeammateBtn}
            onPress={() => {
              setComposerMode('teammate');
              setShowComposer(!showComposer);
            }}
          >
            <Text style={styles.askTeammateBtnText}>
              🤝 Ask for Teammates
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.shareRepoBtn}
            onPress={() => {
              setComposerMode('update');
              setShowComposer(!showComposer);
            }}
          >
            <Text style={styles.shareRepoBtnText}>
              {user.role === 'college_admin'
                ? '🏛️ Post College Notice'
                : user.role === 'mentor'
                ? '🎓 Post Faculty Lab Slot'
                : '🐙 Share GitHub Commit'}
            </Text>
          </TouchableOpacity>
        </View>

        {showComposer && (
          <View style={styles.composerExpanded}>
            <Text style={styles.composerHeaderTitle}>
              {composerMode === 'teammate'
                ? `Broadcast Teammate Request to ${college.shortName}`
                : `Share Update with ${college.shortName}`}
            </Text>

            {composerMode === 'teammate' && (
              <>
                <TextInput
                  style={styles.repoInput}
                  placeholder="Project / Hackathon Name (e.g. SIH Smart Traffic AI)"
                  value={projectTitle}
                  onChangeText={setProjectTitle}
                />
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TextInput
                    style={[styles.repoInput, { flex: 2 }]}
                    placeholder="Skills Needed (comma-separated: UI/UX, PyTorch)"
                    value={neededSkills}
                    onChangeText={setNeededSkills}
                  />
                  <TextInput
                    style={[styles.repoInput, { flex: 1 }]}
                    placeholder="Slots (e.g. 2)"
                    value={slotsLeft}
                    onChangeText={setSlotsLeft}
                    keyboardType="numeric"
                  />
                </View>
              </>
            )}

            <TextInput
              style={styles.composerInput}
              placeholder="Describe what you're building and who you're looking to collaborate with..."
              multiline
              value={postText}
              onChangeText={setPostText}
            />
            <TextInput
              style={styles.repoInput}
              placeholder="Optional: Attach GitHub Repo (e.g. user/project-name)"
              value={repoAttach}
              onChangeText={setRepoAttach}
            />
            <TouchableOpacity style={styles.publishBtn} onPress={handlePublish}>
              <Text style={styles.publishBtnText}>
                Publish to {college.shortName} Feed
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Filter Feed by Collaboration Pillar */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.pillarFilterRow}
      >
        {(
          [
            { id: 'all', label: '🌐 All Campus Activity' },
            { id: 'student-student', label: '🤝 Student–Student (Teammates)' },
            { id: 'student-faculty', label: '🎓 Student–Faculty (Labs)' },
            { id: 'student-college', label: '🏛️ Student–College (Openings)' },
          ] as const
        ).map((f) => (
          <TouchableOpacity
            key={f.id}
            style={[
              styles.pillarPill,
              pillarFilter === f.id && styles.pillarPillActive,
            ]}
            onPress={() => setPillarFilter(f.id)}
          >
            <Text
              style={[
                styles.pillarPillText,
                pillarFilter === f.id && styles.pillarPillTextActive,
              ]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Campus Collaboration Stream */}
      {filteredPosts.map((post) => {
        const pillarBadge =
          post.collab_type === 'student-student'
            ? { label: '🤝 STUDENT ↔ STUDENT', bg: '#ccfbf1', color: '#0f766e' }
            : post.collab_type === 'student-faculty'
            ? { label: '🎓 STUDENT ↔ FACULTY', bg: '#e0e7ff', color: '#4338ca' }
            : { label: '🏛️ STUDENT ↔ COLLEGE', bg: '#e0f2fe', color: '#0369a1' };

        return (
          <View key={post.id} style={styles.postCard}>
            <View style={styles.postTopMeta}>
              <View
                style={[
                  styles.collabTypeBadge,
                  { backgroundColor: pillarBadge.bg },
                ]}
              >
                <Text
                  style={[
                    styles.collabTypeText,
                    { color: pillarBadge.color },
                  ]}
                >
                  {pillarBadge.label}
                </Text>
              </View>
              <Text style={styles.postTime}>{post.timestamp}</Text>
            </View>

            <View style={styles.postHeader}>
              <View style={styles.postAvatar}>
                <Text style={styles.postAvatarText}>
                  {post.author_name
                    .split(' ')
                    .map((w) => w[0])
                    .join('')
                    .slice(0, 2)}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.postAuthorRow}>
                  <Text style={styles.postAuthor}>{post.author_name}</Text>
                  <View style={styles.rolePill}>
                    <Text style={styles.rolePillText}>{post.author_role}</Text>
                  </View>
                </View>
                <Text style={styles.postHeadline}>
                  {post.author_roll} • {post.author_headline}
                </Text>
              </View>
            </View>

            <Text style={styles.postBody}>{post.content}</Text>

            {/* Structured "Ask for Teammates" Card inside Feed */}
            {post.teammate_ask && (
              <View style={styles.teammateAskCard}>
                <View style={styles.teammateAskHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.teammateAskCategory}>
                      LOOKING FOR TEAMMATES • {post.teammate_ask.category.toUpperCase()}
                    </Text>
                    <Text style={styles.teammateAskTitle}>
                      {post.teammate_ask.project_title}
                    </Text>
                  </View>
                  <View style={styles.slotsPill}>
                    <Text style={styles.slotsPillText}>
                      {post.teammate_ask.slots_left} slots open
                    </Text>
                  </View>
                </View>

                <View style={styles.neededSkillsRow}>
                  {post.teammate_ask.needed_skills.map((sk) => (
                    <View key={sk} style={styles.neededSkillBadge}>
                      <Text style={styles.neededSkillText}>+ Needs: {sk}</Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity
                  style={styles.pitchJoinBtn}
                  onPress={() => onJoinTeammateAsk(post.id)}
                >
                  <Text style={styles.pitchJoinBtnText}>
                    ⚡ Pitch to Join with My GitHub Profile →
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Embedded GitHub Repository Card */}
            {post.linked_repo && (
              <TouchableOpacity
                style={styles.githubEmbedCard}
                onPress={() => Linking.openURL(post.linked_repo!.url)}
              >
                <View style={styles.githubEmbedHeader}>
                  <Text style={styles.githubRepoTitle}>
                    📦 {post.linked_repo.name}
                  </Text>
                  <Text style={styles.githubOpenBadge}>View Code ↗</Text>
                </View>
                <View style={styles.githubMetaRow}>
                  <View
                    style={[
                      styles.langDot,
                      { backgroundColor: post.linked_repo.language_color },
                    ]}
                  />
                  <Text style={styles.githubMetaText}>
                    {post.linked_repo.language}
                  </Text>
                  <Text style={styles.githubMetaText}>
                    ★ {post.linked_repo.stars}
                  </Text>
                  <Text style={styles.githubMetaText}>
                    ⑂ {post.linked_repo.forks}
                  </Text>
                </View>
              </TouchableOpacity>
            )}

            <View style={styles.tagsRow}>
              {post.tags.map((tag) => (
                <Text key={tag} style={styles.tagText}>
                  {tag}
                </Text>
              ))}
            </View>

            <View style={styles.postActionsRow}>
              <TouchableOpacity
                style={styles.postActionBtn}
                onPress={() => onToggleLike(post.id)}
              >
                <Text
                  style={[
                    styles.postActionText,
                    post.liked && { color: COLORS.linkedinBlue, fontWeight: '800' },
                  ]}
                >
                  {post.liked ? '▲ Endorsed' : '△ Endorse'} ({post.likes})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.postActionBtn}
                onPress={() => onNavigateTab('teams', 'groups')}
              >
                <Text style={styles.postActionText}>
                  💬 Squad Chat ({post.comments})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.postActionBtn}
                onPress={() =>
                  onNavigateTab(
                    post.collab_type === 'student-college'
                      ? 'career'
                      : post.collab_type === 'student-faculty'
                      ? 'career'
                      : 'teams',
                    post.collab_type === 'student-college'
                      ? 'placements'
                      : post.collab_type === 'student-faculty'
                      ? 'faculty-labs'
                      : 'teammates'
                  )
                }
              >
                <Text style={[styles.postActionText, { color: COLORS.primary }]}>
                  {post.collab_type === 'student-college'
                    ? '🏛️ View Opening →'
                    : post.collab_type === 'student-faculty'
                    ? '🎓 Apply to Lab →'
                    : '🤝 Collaborate →'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 14, paddingBottom: 90, gap: 12 },
  collegeHubBanner: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 14,
    gap: 12,
  },
  collegeHubTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  collegeDomainTag: {
    color: '#5eead4',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  collegeHubName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    marginTop: 2,
  },
  onlinePill: {
    backgroundColor: 'rgba(20, 184, 166, 0.2)',
    borderWidth: 1,
    borderColor: '#14b8a6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  onlinePillText: { color: '#5eead4', fontSize: 10, fontWeight: '800' },
  threeWayRow: {
    flexDirection: 'row',
    gap: 8,
  },
  wayCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 10,
    padding: 9,
    borderLeftWidth: 3,
  },
  wayTitle: { color: '#ffffff', fontSize: 10, fontWeight: '800' },
  waySub: { color: '#94a3b8', fontSize: 9, marginTop: 2 },
  composerCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  composerActionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  askTeammateBtn: {
    flex: 1,
    backgroundColor: '#f0fdfa',
    borderWidth: 1,
    borderColor: '#99f6e4',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  askTeammateBtnText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '800',
  },
  shareRepoBtn: {
    flex: 1,
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  shareRepoBtnText: {
    color: COLORS.linkedinBlue,
    fontSize: 12,
    fontWeight: '800',
  },
  composerExpanded: { marginTop: 12, gap: 8 },
  composerHeaderTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  composerInput: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    padding: 10,
    minHeight: 64,
    fontSize: 13,
  },
  repoInput: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 12,
  },
  publishBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: 'center',
  },
  publishBtnText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  pillarFilterRow: { gap: 8, paddingVertical: 2 },
  pillarPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  pillarPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  pillarPillText: { fontSize: 11, fontWeight: '700', color: COLORS.textSecondary },
  pillarPillTextActive: { color: '#ffffff' },
  postCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 10,
  },
  postTopMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  collabTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  collabTypeText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.4 },
  postHeader: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  postAvatarText: { color: '#1d4ed8', fontWeight: '800', fontSize: 14 },
  postAuthorRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  postAuthor: { fontSize: 14, fontWeight: '800', color: COLORS.textPrimary },
  rolePill: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  rolePillText: { fontSize: 9, fontWeight: '800', color: '#475569' },
  postHeadline: { fontSize: 11, color: COLORS.textSecondary },
  postTime: { fontSize: 10, color: COLORS.textMuted },
  postBody: { fontSize: 13, color: '#1e293b', lineHeight: 19 },
  teammateAskCard: {
    backgroundColor: '#f0fdfa',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#99f6e4',
    gap: 8,
  },
  teammateAskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  teammateAskCategory: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.primary,
  },
  teammateAskTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  slotsPill: {
    backgroundColor: '#ccfbf1',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  slotsPillText: { fontSize: 10, fontWeight: '800', color: '#0f766e' },
  neededSkillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  neededSkillBadge: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#5eead4',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  neededSkillText: { fontSize: 10, fontWeight: '800', color: '#0f766e' },
  pitchJoinBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 9,
    borderRadius: 8,
    alignItems: 'center',
  },
  pitchJoinBtnText: { color: '#ffffff', fontSize: 11, fontWeight: '800' },
  githubEmbedCard: {
    backgroundColor: COLORS.githubDark,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.githubBorder,
  },
  githubEmbedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  githubRepoTitle: { color: '#58a6ff', fontWeight: '800', fontSize: 12 },
  githubOpenBadge: { color: '#39d353', fontSize: 10, fontWeight: '700' },
  githubMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  langDot: { width: 8, height: 8, borderRadius: 4 },
  githubMetaText: { color: '#8b949e', fontSize: 11, fontWeight: '600' },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tagText: { fontSize: 11, color: COLORS.linkedinBlue, fontWeight: '600' },
  postActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  postActionBtn: { paddingVertical: 4, paddingHorizontal: 4 },
  postActionText: { fontSize: 11, color: COLORS.textSecondary, fontWeight: '700' },
});
