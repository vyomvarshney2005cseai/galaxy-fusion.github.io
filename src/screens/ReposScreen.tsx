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
import { Profile, ProjectRepo } from '../types';

interface ReposScreenProps {
  user: Profile;
  repos: ProjectRepo[];
  onSubmitRepo: (title: string, desc: string, githubUrl: string, language: string) => void;
  onStarRepo: (repoId: string) => void;
}

const LANGUAGES = ['All', 'TypeScript', 'React Native', 'Python', 'C++'];

export const ReposScreen: React.FC<ReposScreenProps> = ({
  user,
  repos,
  onSubmitRepo,
  onStarRepo,
}) => {
  const [selectedLang, setSelectedLang] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [language, setLanguage] = useState('TypeScript');

  const filteredRepos =
    selectedLang === 'All'
      ? repos
      : repos.filter(
          (r) => (r.language || '').toLowerCase() === selectedLang.toLowerCase()
        );

  const handleAdd = () => {
    if (!title.trim() || !desc.trim() || !githubUrl.trim()) return;
    onSubmitRepo(title.trim(), desc.trim(), githubUrl.trim(), language);
    setTitle('');
    setDesc('');
    setGithubUrl('');
    setShowAddForm(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* GitHub Dark Banner */}
      <View style={styles.githubBanner}>
        <View style={styles.bannerTop}>
          <View>
            <Text style={styles.bannerBadge}>GITHUB CAMPUS REPOSITORIES</Text>
            <Text style={styles.bannerTitle}>Proof of Work & Open Source</Text>
            <Text style={styles.bannerSub}>
              Every project links to a live GitHub repository verified by college Roll No.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.newRepoBtn}
          onPress={() => setShowAddForm(!showAddForm)}
        >
          <Text style={styles.newRepoBtnText}>
            {showAddForm ? '✕ Close Form' : '+ Submit Project / Sync GitHub Repo'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Submit Project Form (connected to Supabase `projects`) */}
      {showAddForm && (
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Add Project to Campus Portfolio</Text>
          <TextInput
            style={styles.input}
            placeholder="Project / Repository Title (e.g. Campus Bus Tracker)"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={[styles.input, { minHeight: 68 }]}
            placeholder="Short technical description & problem solved..."
            multiline
            value={desc}
            onChangeText={setDesc}
          />
          <TextInput
            style={styles.input}
            placeholder="GitHub Repository URL (https://github.com/...)"
            value={githubUrl}
            onChangeText={setGithubUrl}
            autoCapitalize="none"
          />

          <View style={styles.langRow}>
            {['TypeScript', 'React Native', 'Python', 'C++'].map((lang) => (
              <TouchableOpacity
                key={lang}
                style={[
                  styles.langOption,
                  language === lang && styles.langOptionActive,
                ]}
                onPress={() => setLanguage(lang)}
              >
                <Text
                  style={[
                    styles.langOptionText,
                    language === lang && styles.langOptionTextActive,
                  ]}
                >
                  {lang}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.submitBtn} onPress={handleAdd}>
            <Text style={styles.submitBtnText}>Publish to GitHub Portfolio</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Language Filter Bar */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {LANGUAGES.map((lang) => (
          <TouchableOpacity
            key={lang}
            style={[
              styles.filterPill,
              selectedLang === lang && styles.filterPillActive,
            ]}
            onPress={() => setSelectedLang(lang)}
          >
            <Text
              style={[
                styles.filterPillText,
                selectedLang === lang && styles.filterPillTextActive,
              ]}
            >
              {lang}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Repository List */}
      {filteredRepos.map((repo) => (
        <View key={repo.id} style={styles.repoCard}>
          <View style={styles.repoHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.repoPath}>
                {repo.owner_roll || user.roll} /{' '}
                <Text style={styles.repoBold}>
                  {repo.repo_name || repo.title.toLowerCase().replace(/\s+/g, '-')}
                </Text>
              </Text>
              <Text style={styles.repoDisplayTitle}>{repo.title}</Text>
            </View>
            <TouchableOpacity
              style={styles.starBtn}
              onPress={() => onStarRepo(repo.id)}
            >
              <Text style={styles.starBtnText}>★ Star ({repo.stars || 12})</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.repoDesc}>{repo.description}</Text>

          {repo.topics && repo.topics.length > 0 && (
            <View style={styles.topicsRow}>
              {repo.topics.map((t) => (
                <View key={t} style={styles.topicChip}>
                  <Text style={styles.topicChipText}>{t}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.repoFooter}>
            <View style={styles.metaGroup}>
              <View
                style={[
                  styles.langDot,
                  { backgroundColor: repo.language_color || '#3178c6' },
                ]}
              />
              <Text style={styles.metaText}>{repo.language || 'TypeScript'}</Text>
              <Text style={styles.metaText}>⑂ {repo.forks || 5}</Text>
              <Text style={styles.metaText}>⊙ {repo.commits || 42} commits</Text>
            </View>

            <TouchableOpacity
              style={styles.viewCodeBtn}
              onPress={() => Linking.openURL(repo.github_url)}
            >
              <Text style={styles.viewCodeText}>View Code →</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 14, paddingBottom: 90, gap: 12 },
  githubBanner: {
    backgroundColor: COLORS.githubDark,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.githubBorder,
    gap: 12,
  },
  bannerTop: { flexDirection: 'row', justifyContent: 'space-between' },
  bannerBadge: {
    color: '#39d353',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  bannerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 4,
  },
  bannerSub: {
    color: '#8b949e',
    fontSize: 12,
    marginTop: 4,
    lineHeight: 17,
  },
  newRepoBtn: {
    backgroundColor: COLORS.githubGreen,
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: 'center',
  },
  newRepoBtnText: { color: '#ffffff', fontWeight: '800', fontSize: 13 },
  formCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 10,
  },
  formTitle: { fontSize: 15, fontWeight: '800', color: COLORS.textPrimary },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
  },
  langRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  langOption: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  langOptionActive: { backgroundColor: '#dbeafe' },
  langOptionText: { fontSize: 11, fontWeight: '700', color: '#475569' },
  langOptionTextActive: { color: '#1d4ed8' },
  submitBtn: {
    backgroundColor: COLORS.indigo,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitBtnText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  filterRow: { gap: 8, paddingVertical: 2 },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterPillActive: {
    backgroundColor: COLORS.githubDark,
    borderColor: COLORS.githubDark,
  },
  filterPillText: { fontSize: 12, fontWeight: '700', color: COLORS.textSecondary },
  filterPillTextActive: { color: '#ffffff' },
  repoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderLeftWidth: 4,
    borderLeftColor: '#2563eb',
    gap: 10,
  },
  repoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  repoPath: { fontSize: 11, color: '#2563eb', fontWeight: '600' },
  repoBold: { fontWeight: '800' },
  repoDisplayTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  starBtn: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  starBtnText: { fontSize: 11, fontWeight: '800', color: '#334155' },
  repoDesc: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 18 },
  topicsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  topicChip: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  topicChipText: { fontSize: 10, fontWeight: '700', color: '#1d4ed8' },
  repoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  metaGroup: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  langDot: { width: 9, height: 9, borderRadius: 5 },
  metaText: { fontSize: 11, color: COLORS.textSecondary, fontWeight: '600' },
  viewCodeBtn: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  viewCodeText: { fontSize: 11, fontWeight: '800', color: '#2563eb' },
});
