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
import { Profile, StudyMaterial } from '../types';
import { CLUB_CATEGORIES } from '../data/mockCampusData';

interface ProfileScreenProps {
  user: Profile;
  initialSubSection?: 'portfolio' | 'materials' | 'clubs' | 'suggestions' | 'feedback';
  materials: StudyMaterial[];
  suggestions: string[];
  onAddSkill: (skill: string) => void;
  onAddCert: (name: string, org: string) => void;
  onAddMaterial: (title: string, type: StudyMaterial['type'], link: string, desc: string) => void;
  onAddSuggestion: (text: string) => void;
  onSubmitFeedback: (rating: number, text: string) => void;
  onLogout: () => void;
}

const HEATMAP_WEEKS = [
  [1, 3, 2, 4, 2, 0, 1],
  [2, 4, 3, 1, 2, 1, 0],
  [0, 2, 4, 4, 3, 2, 1],
  [3, 1, 2, 3, 4, 1, 0],
  [2, 3, 4, 2, 1, 3, 2],
  [1, 2, 1, 3, 4, 2, 0],
  [3, 4, 4, 2, 3, 1, 1],
  [2, 1, 3, 4, 4, 3, 2],
  [0, 3, 2, 1, 3, 4, 1],
  [4, 3, 4, 3, 2, 2, 1],
  [2, 4, 3, 4, 4, 3, 2],
  [3, 2, 4, 3, 4, 4, 3],
];

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  initialSubSection = 'portfolio',
  materials,
  suggestions,
  onAddSkill,
  onAddCert,
  onAddMaterial,
  onAddSuggestion,
  onSubmitFeedback,
  onLogout,
}) => {
  const [section, setSection] = useState<
    'portfolio' | 'materials' | 'clubs' | 'suggestions' | 'feedback'
  >(initialSubSection);

  // Portfolio inputs
  const [newSkill, setNewSkill] = useState('');
  const [certName, setCertName] = useState('');
  const [certOrg, setCertOrg] = useState('');

  // Materials inputs (Mentors)
  const [matTitle, setMatTitle] = useState('');
  const [matType, setMatType] = useState<StudyMaterial['type']>('pdf');
  const [matLink, setMatLink] = useState('');
  const [matDesc, setMatDesc] = useState('');

  // Clubs state
  const [clubCat, setClubCat] = useState<'technical' | 'sports' | 'cultural'>('technical');

  // Suggestions & Feedback state
  const [sugText, setSugText] = useState('');
  const [rating, setRating] = useState(5);
  const [fbText, setFbText] = useState('');

  const heatColors = [
    COLORS.githubHeat0,
    COLORS.githubHeat1,
    COLORS.githubHeat2,
    COLORS.githubHeat3,
    COLORS.githubHeat4,
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Sub-navigation Pills for Profile & Campus Utilities */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.subNavRow}
      >
        {(
          [
            { id: 'portfolio', label: '👤 LinkedIn + GitHub Profile' },
            { id: 'materials', label: '📚 Study Materials' },
            { id: 'clubs', label: '🚀 Campus Clubs' },
            { id: 'suggestions', label: '💡 Suggestions' },
            { id: 'feedback', label: '⭐ App Feedback' },
          ] as const
        ).map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.subNavPill,
              section === item.id && styles.subNavPillActive,
            ]}
            onPress={() => setSection(item.id)}
          >
            <Text
              style={[
                styles.subNavText,
                section === item.id && styles.subNavTextActive,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {section === 'portfolio' && (
        <>
          {/* LinkedIn-Style Header Banner & Identity Card */}
          <View style={styles.profileCard}>
            <View style={styles.coverBanner}>
              <Text style={styles.coverTag}>COLLEGE-VERIFIED DIGITAL IDENTITY</Text>
            </View>
            <View style={styles.profileBody}>
              <View style={styles.avatarRow}>
                <View style={styles.largeAvatar}>
                  <Text style={styles.largeAvatarText}>
                    {user.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)}
                  </Text>
                </View>
                <View style={styles.badgesCol}>
                  <View style={styles.rollVerifiedPill}>
                    <Text style={styles.rollVerifiedText}>
                      ✓ Roll No: {user.roll}
                    </Text>
                  </View>
                  <View style={styles.githubHandlePill}>
                    <Text style={styles.githubHandleText}>
                      🐙 @{user.github_handle || user.roll.toLowerCase()}
                    </Text>
                  </View>
                </View>
              </View>

              <Text style={styles.profileName}>{user.name}</Text>
              <Text style={styles.profileHeadline}>
                {user.headline ||
                  `${user.branch || 'CSE'} • ${user.year || '3rd Year'} • Verified Student Builder`}
              </Text>
              {user.bio ? <Text style={styles.profileBio}>{user.bio}</Text> : null}

              <View style={styles.statsBar}>
                <View style={styles.statBox}>
                  <Text style={styles.statNum}>{user.connections_count || 348}</Text>
                  <Text style={styles.statLbl}>Connections</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={[styles.statNum, { color: COLORS.githubGreen }]}>
                    {user.commits_count || 412}
                  </Text>
                  <Text style={styles.statLbl}>Commits</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={[styles.statNum, { color: COLORS.linkedinBlue }]}>
                    {user.cgpa || '8.92'}
                  </Text>
                  <Text style={styles.statLbl}>CGPA</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={[styles.statNum, { color: '#ea580c' }]}>
                    🔥 {user.streak_days || 19}d
                  </Text>
                  <Text style={styles.statLbl}>Code Streak</Text>
                </View>
              </View>
            </View>
          </View>

          {/* GitHub Contribution Heatmap Card */}
          <View style={styles.heatmapCard}>
            <View style={styles.heatmapHeader}>
              <Text style={styles.heatmapTitle}>
                🟩 GitHub Contribution Graph
              </Text>
              <Text style={styles.heatmapSub}>
                {user.commits_count || 412} contributions in the last year
              </Text>
            </View>
            <View style={styles.heatmapGrid}>
              {HEATMAP_WEEKS.map((week, wIdx) => (
                <View key={wIdx} style={styles.heatmapCol}>
                  {week.map((lvl, dIdx) => (
                    <View
                      key={dIdx}
                      style={[
                        styles.heatCell,
                        { backgroundColor: heatColors[lvl] || COLORS.githubHeat0 },
                      ]}
                    />
                  ))}
                </View>
              ))}
            </View>
          </View>

          {/* Verified Resume Section */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>📄 Verified Campus Resume</Text>
            <View style={styles.resumeBox}>
              <Text style={styles.resumeName} numberOfLines={1}>
                {user.resume_name || `${user.name.replace(/\s+/g, '_')}_Resume.pdf`}
              </Text>
              <View style={{ flexDirection: 'row', gap: 6 }}>
                <View style={styles.resumeBadge}>
                  <Text style={styles.resumeBadgeText}>PDF Verified</Text>
                </View>
              </View>
            </View>
          </View>

          {/* LinkedIn-Style Skills & Endorsements */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>⚡ Verified Skills & Endorsements</Text>
            <View style={styles.addRow}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Add a skill (e.g. React Native, Rust, PyTorch)..."
                value={newSkill}
                onChangeText={setNewSkill}
              />
              <TouchableOpacity
                style={styles.darkBtn}
                onPress={() => {
                  if (!newSkill.trim()) return;
                  onAddSkill(newSkill.trim());
                  setNewSkill('');
                }}
              >
                <Text style={styles.darkBtnText}>+ Add</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.skillsWrap}>
              {(user.skills || []).map((sk, idx) => (
                <View key={`${sk}-${idx}`} style={styles.skillPill}>
                  <Text style={styles.skillPillText}>{sk}</Text>
                  <View style={styles.endorseCountCircle}>
                    <Text style={styles.endorseCountText}>{12 + ((idx * 5) % 19)}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Certifications */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🏅 Certifications & Licenses</Text>
            <View style={{ gap: 8 }}>
              <TextInput
                style={styles.input}
                placeholder="Certification Name (e.g. AWS Cloud Practitioner)"
                value={certName}
                onChangeText={setCertName}
              />
              <View style={styles.addRow}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Issuing Organization (e.g. Amazon)"
                  value={certOrg}
                  onChangeText={setCertOrg}
                />
                <TouchableOpacity
                  style={styles.darkBtn}
                  onPress={() => {
                    if (!certName.trim() || !certOrg.trim()) return;
                    onAddCert(certName.trim(), certOrg.trim());
                    setCertName('');
                    setCertOrg('');
                  }}
                >
                  <Text style={styles.darkBtnText}>Add Cert</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ gap: 8, marginTop: 4 }}>
              {(user.certs || []).map((c, idx) => (
                <View key={idx} style={styles.certItem}>
                  <Text style={styles.certTitle}>{c.name}</Text>
                  <Text style={styles.certOrg}>{c.org}</Text>
                </View>
              ))}
            </View>
          </View>

          <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
            <Text style={styles.logoutBtnText}>Sign Out of Galaxy Fusion</Text>
          </TouchableOpacity>
        </>
      )}

      {section === 'materials' && (
        <View style={{ gap: 12 }}>
          {user.role === 'mentor' && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Upload Study Material (Mentor)</Text>
              <TextInput
                style={styles.input}
                placeholder="Title (e.g. React Native & System Design Notes)"
                value={matTitle}
                onChangeText={setMatTitle}
              />
              <View style={{ flexDirection: 'row', gap: 6 }}>
                {(['pdf', 'link', 'video', 'image'] as const).map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[
                      styles.subNavPill,
                      matType === t && { backgroundColor: COLORS.pink },
                    ]}
                    onPress={() => setMatType(t)}
                  >
                    <Text
                      style={[
                        styles.subNavText,
                        matType === t && { color: '#fff' },
                      ]}
                    >
                      {t.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput
                style={styles.input}
                placeholder="Resource URL or File Link"
                value={matLink}
                onChangeText={setMatLink}
              />
              <TextInput
                style={styles.input}
                placeholder="Short description..."
                value={matDesc}
                onChangeText={setMatDesc}
              />
              <TouchableOpacity
                style={[styles.darkBtn, { backgroundColor: COLORS.pink, alignItems: 'center' }]}
                onPress={() => {
                  if (!matTitle.trim()) return;
                  onAddMaterial(matTitle.trim(), matType, matLink.trim(), matDesc.trim());
                  setMatTitle('');
                  setMatLink('');
                  setMatDesc('');
                }}
              >
                <Text style={styles.darkBtnText}>Upload Material</Text>
              </TouchableOpacity>
            </View>
          )}

          {materials.map((m) => (
            <View key={m.id} style={styles.card}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{m.title}</Text>
                  <Text style={styles.certOrg}>{m.description}</Text>
                </View>
                {m.link ? (
                  <TouchableOpacity
                    style={styles.openPill}
                    onPress={() => Linking.openURL(m.link!)}
                  >
                    <Text style={styles.openPillText}>Open ↗</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.openPill}>
                    <Text style={styles.openPillText}>{m.type.toUpperCase()}</Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
      )}

      {section === 'clubs' && (
        <View style={{ gap: 12 }}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {(['technical', 'sports', 'cultural'] as const).map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.subNavPill,
                  { flex: 1, alignItems: 'center' },
                  clubCat === cat && styles.subNavPillActive,
                ]}
                onPress={() => setClubCat(cat)}
              >
                <Text
                  style={[
                    styles.subNavText,
                    clubCat === cat && styles.subNavTextActive,
                  ]}
                >
                  {cat.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {(CLUB_CATEGORIES[clubCat] || []).map((club) => (
            <View key={club.name} style={styles.card}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <Text style={styles.cardTitle}>{club.name}</Text>
                  <Text style={styles.certOrg}>
                    Lead: {club.lead} • {club.members} Members • {club.tag}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.openPill}
                  onPress={() =>
                    Linking.openURL(
                      `mailto:kcvinay321@gmail.com?subject=Join ${club.name}&body=Name: ${user.name}%0ARoll: ${user.roll}`
                    )
                  }
                >
                  <Text style={styles.openPillText}>Join Club</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      {section === 'suggestions' && (
        <View style={{ gap: 12 }}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>💡 Anonymous College Suggestion Box</Text>
            <TextInput
              style={[styles.input, { minHeight: 72 }]}
              placeholder="Share your anonymous suggestion for campus labs, Wi-Fi, hackathons, or T&P..."
              multiline
              value={sugText}
              onChangeText={setSugText}
            />
            <TouchableOpacity
              style={[styles.darkBtn, { backgroundColor: COLORS.primary, alignItems: 'center' }]}
              onPress={() => {
                if (!sugText.trim()) return;
                onAddSuggestion(sugText.trim());
                setSugText('');
              }}
            >
              <Text style={styles.darkBtnText}>Submit Anonymous Suggestion</Text>
            </TouchableOpacity>
          </View>

          {suggestions.map((s, idx) => (
            <View key={idx} style={styles.card}>
              <Text style={{ fontSize: 13, color: COLORS.textPrimary }}>{s}</Text>
            </View>
          ))}
        </View>
      )}

      {section === 'feedback' && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>⭐ Rate Your Galaxy Fusion Experience</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 12, marginVertical: 8 }}>
            {[1, 2, 3, 4, 5].map((st) => (
              <TouchableOpacity key={st} onPress={() => setRating(st)}>
                <Text style={{ fontSize: 30, color: st <= rating ? '#fbbf24' : '#cbd5e1' }}>
                  ★
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TextInput
            style={[styles.input, { minHeight: 72 }]}
            placeholder="Tell us what you think about the LinkedIn + GitHub React Native interface..."
            multiline
            value={fbText}
            onChangeText={setFbText}
          />
          <TouchableOpacity
            style={[styles.darkBtn, { backgroundColor: COLORS.purple, alignItems: 'center' }]}
            onPress={() => {
              onSubmitFeedback(rating, fbText.trim());
              setFbText('');
            }}
          >
            <Text style={styles.darkBtnText}>Send App Feedback</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 14, paddingBottom: 90, gap: 12 },
  subNavRow: { gap: 8, paddingBottom: 2 },
  subNavPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  subNavPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  subNavText: { fontSize: 11, fontWeight: '700', color: COLORS.textSecondary },
  subNavTextActive: { color: '#ffffff' },
  profileCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  coverBanner: {
    height: 64,
    backgroundColor: '#0f766e',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  coverTag: {
    color: '#99f6e4',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  profileBody: { padding: 14, paddingTop: 0 },
  avatarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: -26,
    marginBottom: 10,
  },
  largeAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.linkedinBlue,
    borderWidth: 3,
    borderColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  largeAvatarText: { color: '#fff', fontSize: 22, fontWeight: '800' },
  badgesCol: { alignItems: 'flex-end', gap: 4 },
  rollVerifiedPill: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 999,
  },
  rollVerifiedText: { fontSize: 10, fontWeight: '800', color: '#166534' },
  githubHandlePill: {
    backgroundColor: '#0d1117',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 999,
  },
  githubHandleText: { fontSize: 10, fontWeight: '700', color: '#f0f6fc' },
  profileName: { fontSize: 19, fontWeight: '800', color: COLORS.textPrimary },
  profileHeadline: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  profileBio: { fontSize: 12, color: '#334155', marginTop: 6, lineHeight: 17 },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  statBox: { alignItems: 'center' },
  statNum: { fontSize: 15, fontWeight: '800', color: COLORS.textPrimary },
  statLbl: { fontSize: 10, color: COLORS.textMuted, fontWeight: '600' },
  heatmapCard: {
    backgroundColor: COLORS.githubDark,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.githubBorder,
  },
  heatmapHeader: { marginBottom: 10 },
  heatmapTitle: { color: '#ffffff', fontSize: 14, fontWeight: '800' },
  heatmapSub: { color: '#8b949e', fontSize: 11, marginTop: 2 },
  heatmapGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heatmapCol: { gap: 4 },
  heatCell: { width: 14, height: 14, borderRadius: 3 },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 10,
  },
  cardTitle: { fontSize: 14, fontWeight: '800', color: COLORS.textPrimary },
  resumeBox: {
    backgroundColor: '#eef2ff',
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resumeName: { fontSize: 12, fontWeight: '700', color: '#312e81', flex: 1 },
  resumeBadge: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  resumeBadgeText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  addRow: { flexDirection: 'row', gap: 8 },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
  },
  darkBtn: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    justifyContent: 'center',
  },
  darkBtnText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  skillsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  skillPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    paddingLeft: 10,
    paddingRight: 6,
    paddingVertical: 5,
    borderRadius: 999,
    gap: 6,
  },
  skillPillText: { fontSize: 11, fontWeight: '700', color: '#1e40af' },
  endorseCountCircle: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 999,
  },
  endorseCountText: { fontSize: 10, fontWeight: '800', color: '#1d4ed8' },
  certItem: {
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.linkedinBlue,
  },
  certTitle: { fontSize: 13, fontWeight: '800', color: COLORS.textPrimary },
  certOrg: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  openPill: {
    backgroundColor: '#ccfbf1',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  openPillText: { fontSize: 11, fontWeight: '800', color: COLORS.primary },
  logoutBtn: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
  },
  logoutBtnText: { color: '#dc2626', fontWeight: '800', fontSize: 13 },
});
