import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { COLORS } from '../theme/colors';
import { supabase, rollToEmail } from '../lib/supabase';
import { Profile, MentorType, CollegeInstance } from '../types';
import {
  CAMPUS_COLLEGES,
  DEMO_STUDENT_PROFILE,
  DEMO_FACULTY_PROFILE,
  DEMO_COLLEGE_ADMIN_PROFILE,
} from '../data/mockCampusData';

interface AuthScreenProps {
  selectedCollege: CollegeInstance;
  onSelectCollege: (college: CollegeInstance) => void;
  onAuthenticated: (profile: Profile) => void;
  showToast: (msg: string, type?: 'info' | 'success' | 'error') => void;
}

type AuthMode = 'welcome' | 'student-login' | 'student-signup' | 'mentor-login' | 'mentor-signup';

export const AuthScreen: React.FC<AuthScreenProps> = ({
  selectedCollege,
  onSelectCollege,
  onAuthenticated,
  showToast,
}) => {
  const [mode, setMode] = useState<AuthMode>('welcome');
  const [loading, setLoading] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [roll, setRoll] = useState('');
  const [password, setPassword] = useState('');
  const [mentorType, setMentorType] = useState<MentorType>('Faculty');
  const [expertise, setExpertise] = useState('');

  const handleStudentLogin = async () => {
    if (!roll.trim() || !password) {
      showToast('Please enter your Roll Number and Password', 'error');
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: rollToEmail(roll),
        password,
      });
      if (error || !data.user) {
        showToast('Invalid Roll Number or Password!', 'error');
        setLoading(false);
        return;
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profile) {
        onAuthenticated({
          ...DEMO_STUDENT_PROFILE,
          ...profile,
          college_id: selectedCollege.id,
          college_name: selectedCollege.name,
          skills: Array.isArray(profile.skills) ? profile.skills : DEMO_STUDENT_PROFILE.skills,
          certs: Array.isArray(profile.certs) ? profile.certs : DEMO_STUDENT_PROFILE.certs,
        });
      }
    } catch (err: any) {
      showToast(err?.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStudentSignup = async () => {
    if (!name.trim() || !roll.trim() || password.length < 6) {
      showToast('Enter Name, Roll No., and 6+ char Password!', 'error');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: rollToEmail(roll),
        password,
        options: {
          data: {
            name: name.trim(),
            roll: roll.toUpperCase().trim(),
            role: 'student',
            college_id: selectedCollege.id,
            college_name: selectedCollege.name,
          },
        },
      });
      if (error) {
        showToast(error.message, 'error');
        setLoading(false);
        return;
      }
      showToast(`Verified account created for ${selectedCollege.shortName}!`, 'success');
      await handleStudentLogin();
    } catch (err: any) {
      showToast(err?.message || 'Sign up failed', 'error');
      setLoading(false);
    }
  };

  const handleMentorAuth = async (isSignup: boolean) => {
    if (!roll.trim() || password.length < 6 || (isSignup && (!name.trim() || !expertise.trim()))) {
      showToast('Please fill all required Faculty / College fields', 'error');
      return;
    }
    setLoading(true);
    try {
      if (isSignup) {
        const { error } = await supabase.auth.signUp({
          email: rollToEmail(roll),
          password,
          options: {
            data: {
              name: name.trim(),
              roll: roll.toUpperCase().trim(),
              role: 'mentor',
              mentor_type: mentorType,
              expertise: expertise.trim(),
              college_id: selectedCollege.id,
              college_name: selectedCollege.name,
            },
          },
        });
        if (error) {
          showToast(error.message, 'error');
          setLoading(false);
          return;
        }
        showToast('Faculty / Mentor Registered!', 'success');
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: rollToEmail(roll),
        password,
      });
      if (error || !data.user) {
        showToast('Invalid Credentials!', 'error');
        setLoading(false);
        return;
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      onAuthenticated({
        ...DEMO_FACULTY_PROFILE,
        ...(profile || {}),
        college_id: selectedCollege.id,
        college_name: selectedCollege.name,
      });
    } catch (err: any) {
      showToast(err?.message || 'Auth failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (mode === 'welcome') {
    return (
      <ScrollView contentContainerStyle={styles.welcomeContainer}>
        <View style={styles.badgePill}>
          <Text style={styles.badgePillText}>
            REACT NATIVE · 3-WAY CAMPUS COLLABORATION HUB
          </Text>
        </View>

        <Text style={styles.heroTitle}>Galaxy Fusion</Text>
        <Text style={styles.heroSubtitle}>
          The LinkedIn + GitHub for Individual Colleges{'\n'}
          Student–Student · Student–Faculty · Student–College
        </Text>

        {/* Individual College Selector */}
        <View style={styles.collegeSelectorBox}>
          <Text style={styles.collegeLabel}>SELECT YOUR VERIFIED COLLEGE WORKSPACE</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.collegePillsRow}
          >
            {CAMPUS_COLLEGES.map((col) => {
              const active = col.id === selectedCollege.id;
              return (
                <TouchableOpacity
                  key={col.id}
                  style={[
                    styles.collegePill,
                    active && styles.collegePillActive,
                  ]}
                  onPress={() => onSelectCollege(col)}
                >
                  <Text
                    style={[
                      styles.collegePillTitle,
                      active && { color: '#0f766e' },
                    ]}
                  >
                    🏛️ {col.shortName}
                  </Text>
                  <Text
                    style={[
                      styles.collegePillSub,
                      active && { color: '#115e59' },
                    ]}
                  >
                    {col.verifiedStudents} students • {col.domain}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* 3 Collaboration Pillars Visual Summary */}
        <View style={styles.pillarsRow}>
          <View style={styles.pillarBox}>
            <Text style={styles.pillarIcon}>🤝</Text>
            <Text style={styles.pillarTitle}>Student–Student</Text>
            <Text style={styles.pillarSub}>Ask for Teammates & GitHub Squads</Text>
          </View>
          <View style={styles.pillarBox}>
            <Text style={styles.pillarIcon}>🎓</Text>
            <Text style={styles.pillarTitle}>Student–Faculty</Text>
            <Text style={styles.pillarSub}>Research Labs, SIH & Reviews</Text>
          </View>
          <View style={styles.pillarBox}>
            <Text style={styles.pillarIcon}>🏛️</Text>
            <Text style={styles.pillarTitle}>Student–College</Text>
            <Text style={styles.pillarSub}>T&P Drives, Grants & Townhall</Text>
          </View>
        </View>

        <View style={styles.buttonStack}>
          <TouchableOpacity style={styles.primaryWhiteBtn} onPress={() => setMode('student-login')}>
            <Text style={styles.primaryWhiteBtnText}>
              Sign In to {selectedCollege.shortName} (Roll No.)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.outlineTealBtn} onPress={() => setMode('student-signup')}>
            <Text style={styles.outlineTealBtnText}>
              Create Verified Student Account
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.mentorAccessBtn} onPress={() => setMode('mentor-login')}>
            <Text style={styles.mentorAccessText}>
              Faculty / College T&P Cell Portal →
            </Text>
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>1-TAP ROLE PREVIEW ({selectedCollege.id})</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.demoRow}>
            <TouchableOpacity
              style={styles.demoBtn}
              onPress={() => {
                showToast(`Entered ${selectedCollege.shortName} as Student (Aarav · 23BCS014)`, 'success');
                onAuthenticated({
                  ...DEMO_STUDENT_PROFILE,
                  college_id: selectedCollege.id,
                  college_name: selectedCollege.name,
                });
              }}
            >
              <Text style={styles.demoBtnTitle}>⚡ Student</Text>
              <Text style={styles.demoBtnSub}>Ask Teammates</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.demoBtn, styles.demoFacultyBtn]}
              onPress={() => {
                showToast(`Entered ${selectedCollege.shortName} as Faculty (Dr. Neha Gupta)`, 'info');
                onAuthenticated({
                  ...DEMO_FACULTY_PROFILE,
                  college_id: selectedCollege.id,
                  college_name: selectedCollege.name,
                });
              }}
            >
              <Text style={styles.demoBtnTitle}>🎓 Faculty</Text>
              <Text style={styles.demoBtnSub}>Research Labs</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.demoBtn, styles.demoCollegeBtn]}
              onPress={() => {
                showToast(`Entered ${selectedCollege.shortName} as College T&P Admin`, 'success');
                onAuthenticated({
                  ...DEMO_COLLEGE_ADMIN_PROFILE,
                  college_id: selectedCollege.id,
                  college_name: selectedCollege.name,
                });
              }}
            >
              <Text style={styles.demoBtnTitle}>🏛️ College T&P</Text>
              <Text style={styles.demoBtnSub}>Post Openings</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }

  const isMentor = mode === 'mentor-login' || mode === 'mentor-signup';
  const isSignup = mode === 'student-signup' || mode === 'mentor-signup';

  return (
    <ScrollView contentContainerStyle={styles.authFormContainer}>
      <TouchableOpacity style={styles.backLink} onPress={() => setMode('welcome')}>
        <Text style={styles.backLinkText}>← Change College ({selectedCollege.shortName})</Text>
      </TouchableOpacity>

      <View
        style={[
          styles.roleTag,
          { backgroundColor: isMentor ? '#e0e7ff' : '#ccfbf1' },
        ]}
      >
        <Text
          style={[
            styles.roleTagText,
            { color: isMentor ? '#4338ca' : '#0f766e' },
          ]}
        >
          {selectedCollege.shortName.toUpperCase()} · {isMentor ? 'FACULTY & T&P PORTAL' : 'VERIFIED STUDENT'}
        </Text>
      </View>

      <Text style={styles.formTitle}>
        {mode === 'student-login' && 'Student Sign In'}
        {mode === 'student-signup' && 'Create Campus Profile'}
        {mode === 'mentor-login' && 'Faculty & T&P Login'}
        {mode === 'mentor-signup' && 'Register as Faculty / Mentor'}
      </Text>
      <Text style={styles.formSub}>
        Verified workspace for {selectedCollege.name} ({selectedCollege.domain})
      </Text>

      <View style={styles.inputGroup}>
        {isSignup && (
          <TextInput
            style={styles.input}
            placeholder="Full Name (e.g. Aarav Sharma)"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#94a3b8"
          />
        )}

        <TextInput
          style={styles.input}
          placeholder={isMentor ? 'Faculty / T&P ID' : 'College Roll Number (e.g. 23BCS014)'}
          value={roll}
          onChangeText={setRoll}
          autoCapitalize="characters"
          placeholderTextColor="#94a3b8"
        />

        {mode === 'mentor-signup' && (
          <>
            <View style={styles.mentorTypeSelector}>
              {(['Faculty', 'Alumni', 'Expert'] as MentorType[]).map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[
                    styles.mentorTypePill,
                    mentorType === t && styles.mentorTypePillActive,
                  ]}
                  onPress={() => setMentorType(t)}
                >
                  <Text
                    style={[
                      styles.mentorTypePillText,
                      mentorType === t && styles.mentorTypePillTextActive,
                    ]}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.input}
              placeholder="Department / Expertise (e.g. CSE AI Lab, T&P Cell)"
              value={expertise}
              onChangeText={setExpertise}
              placeholderTextColor="#94a3b8"
            />
          </>
        )}

        <TextInput
          style={styles.input}
          placeholder="Password (min. 6 characters)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#94a3b8"
        />

        <TouchableOpacity
          style={[
            styles.submitBtn,
            { backgroundColor: isMentor ? COLORS.indigo : COLORS.primary },
          ]}
          disabled={loading}
          onPress={() => {
            if (mode === 'student-login') handleStudentLogin();
            else if (mode === 'student-signup') handleStudentSignup();
            else if (mode === 'mentor-login') handleMentorAuth(false);
            else handleMentorAuth(true);
          }}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.submitBtnText}>
              {isSignup ? 'Create Verified Campus Account' : `Enter ${selectedCollege.shortName} Hub`}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.switchModeBtn}
          onPress={() => {
            if (mode === 'student-login') setMode('student-signup');
            else if (mode === 'student-signup') setMode('student-login');
            else if (mode === 'mentor-login') setMode('mentor-signup');
            else setMode('mentor-login');
          }}
        >
          <Text style={styles.switchModeText}>
            {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Register"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  welcomeContainer: {
    flexGrow: 1,
    backgroundColor: '#0b4f4a',
    paddingHorizontal: 20,
    paddingVertical: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgePill: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    marginBottom: 12,
  },
  badgePillText: {
    color: '#99f6e4',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 12,
    color: '#ccfbf1',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  collegeSelectorBox: {
    width: '100%',
    marginTop: 18,
    marginBottom: 14,
  },
  collegeLabel: {
    color: '#5eead4',
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  collegePillsRow: {
    gap: 8,
    paddingHorizontal: 2,
  },
  collegePill: {
    backgroundColor: 'rgba(13, 17, 23, 0.45)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  collegePillActive: {
    backgroundColor: '#ffffff',
    borderColor: '#ffffff',
  },
  collegePillTitle: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  collegePillSub: {
    color: '#99f6e4',
    fontSize: 10,
    marginTop: 2,
  },
  pillarsRow: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
    marginBottom: 18,
  },
  pillarBox: {
    flex: 1,
    backgroundColor: 'rgba(13, 17, 23, 0.4)',
    borderRadius: 12,
    padding: 9,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  pillarIcon: { fontSize: 18 },
  pillarTitle: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
    marginTop: 4,
    textAlign: 'center',
  },
  pillarSub: {
    color: '#cbd5e1',
    fontSize: 9,
    textAlign: 'center',
    marginTop: 2,
  },
  buttonStack: {
    width: '100%',
    gap: 10,
  },
  primaryWhiteBtn: {
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  primaryWhiteBtnText: {
    color: '#0f766e',
    fontWeight: '800',
    fontSize: 14,
  },
  outlineTealBtn: {
    backgroundColor: 'rgba(15, 118, 110, 0.45)',
    borderWidth: 1,
    borderColor: 'rgba(94, 234, 212, 0.4)',
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
  },
  outlineTealBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  mentorAccessBtn: {
    paddingVertical: 6,
    alignItems: 'center',
  },
  mentorAccessText: {
    color: '#99f6e4',
    fontSize: 12,
    fontWeight: '600',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    gap: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  dividerText: {
    color: '#99f6e4',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  demoRow: {
    flexDirection: 'row',
    gap: 8,
  },
  demoBtn: {
    flex: 1,
    backgroundColor: 'rgba(13, 17, 23, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(94, 234, 212, 0.4)',
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 12,
    alignItems: 'center',
  },
  demoFacultyBtn: {
    borderColor: 'rgba(165, 180, 252, 0.5)',
  },
  demoCollegeBtn: {
    borderColor: 'rgba(253, 224, 71, 0.5)',
  },
  demoBtnTitle: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 11,
  },
  demoBtnSub: {
    color: '#cbd5e1',
    fontSize: 9,
    marginTop: 2,
  },
  authFormContainer: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
    padding: 24,
  },
  backLink: { marginBottom: 18 },
  backLinkText: { color: COLORS.primary, fontWeight: '700', fontSize: 13 },
  roleTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 10,
  },
  roleTagText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  formTitle: { fontSize: 26, fontWeight: '800', color: COLORS.textPrimary },
  formSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
    marginBottom: 20,
  },
  inputGroup: { gap: 12 },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  mentorTypeSelector: { flexDirection: 'row', gap: 8 },
  mentorTypePill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
    alignItems: 'center',
  },
  mentorTypePillActive: { backgroundColor: '#e0e7ff', borderColor: '#4f46e5' },
  mentorTypePillText: { fontSize: 12, fontWeight: '700', color: '#64748b' },
  mentorTypePillTextActive: { color: '#4338ca' },
  submitBtn: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  submitBtnText: { color: '#ffffff', fontWeight: '800', fontSize: 14 },
  switchModeBtn: { paddingVertical: 10, alignItems: 'center' },
  switchModeText: { color: COLORS.primary, fontWeight: '700', fontSize: 13 },
});
