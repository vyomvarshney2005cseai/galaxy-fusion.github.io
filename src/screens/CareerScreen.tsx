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
  FacultyProjectSlot,
  JobOpening,
  Profile,
  TownhallProposal,
} from '../types';

interface CareerScreenProps {
  user: Profile;
  collegeShortName: string;
  initialSubTab?: 'placements' | 'faculty-labs' | 'townhall' | 'mentors';
  jobs: JobOpening[];
  facultyProjects: FacultyProjectSlot[];
  townhallProposals: TownhallProposal[];
  mentors: Profile[];
  onApplyJob: (jobId: string) => void;
  onPostJob: (
    company: string,
    role: string,
    salary: string,
    eligibility: string,
    openingType: JobOpening['opening_type']
  ) => void;
  onRegisterPlacementProfile: (cgpaAvg: string, branch: string, year: string) => void;
  onApplyFacultyLab: (slotId: string) => void;
  onPostFacultyLab: (
    title: string,
    type: FacultyProjectSlot['type'],
    desc: string,
    skills: string[],
    perks: string
  ) => void;
  onUpvoteTownhall: (proposalId: string) => void;
  onAddTownhallProposal: (title: string, category: TownhallProposal['category']) => void;
  onMessageMentor: (mentor: Profile, message: string) => void;
}

export const CareerScreen: React.FC<CareerScreenProps> = ({
  user,
  collegeShortName,
  initialSubTab = 'placements',
  jobs,
  facultyProjects,
  townhallProposals,
  mentors,
  onApplyJob,
  onPostJob,
  onRegisterPlacementProfile,
  onApplyFacultyLab,
  onPostFacultyLab,
  onUpvoteTownhall,
  onAddTownhallProposal,
  onMessageMentor,
}) => {
  const [subTab, setSubTab] = useState<
    'placements' | 'faculty-labs' | 'townhall' | 'mentors'
  >(initialSubTab);
  const [tierFilter, setTierFilter] = useState<
    'All' | 'Super Dream' | 'Dream' | 'College Grant' | 'Core'
  >('All');
  const [showCgpaForm, setShowCgpaForm] = useState(false);
  const [showPostJob, setShowPostJob] = useState(false);

  // CGPA Registration state (Sem 1-8)
  const [branch, setBranch] = useState(user.branch || 'CSE');
  const [year, setYear] = useState('3');
  const [cgpas, setCgpas] = useState([
    '8.8',
    '8.9',
    '9.0',
    '8.9',
    '9.1',
    '9.0',
    '',
    '',
  ]);

  // College / T&P Post Opening state
  const [openingType, setOpeningType] =
    useState<JobOpening['opening_type']>('Placement Drive');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [salary, setSalary] = useState('');
  const [eligibility, setEligibility] = useState('');

  // Faculty Research Lab Post state
  const [showPostLab, setShowPostLab] = useState(false);
  const [labTitle, setLabTitle] = useState('');
  const [labType, setLabType] =
    useState<FacultyProjectSlot['type']>('Research Lab');
  const [labDesc, setLabDesc] = useState('');
  const [labSkills, setLabSkills] = useState('Python, PyTorch, React Native');
  const [labPerks, setLabPerks] = useState(
    'IEEE Paper Co-Authorship + Minor Project Credit'
  );

  // Townhall Proposal state
  const [proposalTitle, setProposalTitle] = useState('');
  const [proposalCat, setProposalCat] =
    useState<TownhallProposal['category']>('Lab & Infra');

  // Mentor message state
  const [activeMentor, setActiveMentor] = useState<Profile | null>(null);
  const [mentorMsg, setMentorMsg] = useState('');

  const canPostCollegeOpening =
    user.role === 'college_admin' ||
    (user.role === 'mentor' && user.mentor_type === 'Faculty');

  const filteredJobs =
    tierFilter === 'All'
      ? jobs
      : jobs.filter((j) => (j.tier || 'Dream') === tierFilter);

  const handleSavePlacement = () => {
    const valid = cgpas.map((c) => parseFloat(c)).filter((n) => !isNaN(n));
    const avg =
      valid.length > 0
        ? (valid.reduce((a, b) => a + b, 0) / valid.length).toFixed(2)
        : '8.92';
    onRegisterPlacementProfile(avg, branch, year);
    setShowCgpaForm(false);
  };

  const handleCreateJob = () => {
    if (!company.trim() || !role.trim() || !salary.trim()) return;
    onPostJob(
      company.trim(),
      role.trim(),
      salary.trim(),
      eligibility.trim(),
      openingType
    );
    setCompany('');
    setRole('');
    setSalary('');
    setEligibility('');
    setShowPostJob(false);
  };

  const handleCreateLab = () => {
    if (!labTitle.trim() || !labDesc.trim()) return;
    onPostFacultyLab(
      labTitle.trim(),
      labType,
      labDesc.trim(),
      labSkills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      labPerks.trim()
    );
    setLabTitle('');
    setLabDesc('');
    setShowPostLab(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Sub-navigation for Student–College & Student–Faculty Collaboration */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.topSegmentRow}
      >
        {(
          [
            { id: 'placements', label: '🏛️ College Openings & T&P' },
            { id: 'faculty-labs', label: '🎓 Faculty Research Labs' },
            { id: 'townhall', label: '📣 College Townhall' },
            { id: 'mentors', label: '💬 Mentors & Alumni' },
          ] as const
        ).map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.segmentPill,
              subTab === tab.id && styles.segmentPillActive,
            ]}
            onPress={() => setSubTab(tab.id)}
          >
            <Text
              style={[
                styles.segmentPillText,
                subTab === tab.id && styles.segmentPillTextActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {subTab === 'placements' && (
        <>
          {/* Student <-> College Banner */}
          <View style={styles.collegeBanner}>
            <Text style={styles.collegeBannerTag}>
              STUDENT ↔ COLLEGE • {collegeShortName.toUpperCase()} T&P & INCUBATION CELL
            </Text>
            <Text style={styles.collegeBannerTitle}>
              Official Placements, Campus Internships & Startup Grants
            </Text>
            <Text style={styles.collegeBannerSub}>
              Your college posts verified placement drives, paid ERP internships, and seed grants. Apply in 1 tap with your CGPA + GitHub portfolio.
            </Text>

            <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
              <TouchableOpacity
                style={styles.cgpaTriggerBtn}
                onPress={() => setShowCgpaForm(!showCgpaForm)}
              >
                <Text style={styles.cgpaTriggerText}>
                  📊 Sem 1–8 CGPA ({user.cgpa || '8.92'})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.facultyPostBtn}
                onPress={() => setShowPostJob(!showPostJob)}
              >
                <Text style={styles.facultyPostText}>
                  {showPostJob
                    ? '✕ Close'
                    : canPostCollegeOpening
                    ? '+ Post College Opening'
                    : '+ Demo Post Opening'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Tier Filter Pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tierRow}
          >
            {(
              ['All', 'Super Dream', 'Dream', 'College Grant', 'Core'] as const
            ).map((t) => (
              <TouchableOpacity
                key={t}
                style={[
                  styles.tierPill,
                  tierFilter === t && styles.tierPillActive,
                ]}
                onPress={() => setTierFilter(t)}
              >
                <Text
                  style={[
                    styles.tierPillText,
                    tierFilter === t && styles.tierPillTextActive,
                  ]}
                >
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {showCgpaForm && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                Verified Semester 1–8 CGPA Registration
              </Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Year (1-4)"
                  value={year}
                  onChangeText={setYear}
                />
                <TextInput
                  style={[styles.input, { flex: 2 }]}
                  placeholder="Branch (e.g. CSE)"
                  value={branch}
                  onChangeText={setBranch}
                />
              </View>
              <View style={styles.semGrid}>
                {cgpas.map((val, i) => (
                  <TextInput
                    key={i}
                    style={styles.semInput}
                    placeholder={`S${i + 1}`}
                    value={val}
                    onChangeText={(txt) => {
                      const next = [...cgpas];
                      next[i] = txt;
                      setCgpas(next);
                    }}
                    keyboardType="numeric"
                  />
                ))}
              </View>
              <TouchableOpacity
                style={styles.primaryCyanBtn}
                onPress={handleSavePlacement}
              >
                <Text style={styles.primaryBtnText}>
                  Save Verified CGPA Profile
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {showPostJob && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                🏛️ Post Official {collegeShortName} Opening
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                {(
                  [
                    'Placement Drive',
                    'Campus Internship',
                    'Incubation Grant',
                  ] as const
                ).map((ot) => (
                  <TouchableOpacity
                    key={ot}
                    style={[
                      styles.tierPill,
                      openingType === ot && styles.tierPillActive,
                    ]}
                    onPress={() => setOpeningType(ot)}
                  >
                    <Text
                      style={[
                        styles.tierPillText,
                        openingType === ot && styles.tierPillTextActive,
                      ]}
                    >
                      {ot}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput
                style={styles.input}
                placeholder="Company or College Cell (e.g. Microsoft / IIC Cell)"
                value={company}
                onChangeText={setCompany}
              />
              <TextInput
                style={styles.input}
                placeholder="Role / Grant Title (e.g. SDE Intern / Seed Grant)"
                value={role}
                onChangeText={setRole}
              />
              <TextInput
                style={styles.input}
                placeholder="Package / Grant Amount (e.g. 20 LPA or ₹50,000)"
                value={salary}
                onChangeText={setSalary}
              />
              <TextInput
                style={[styles.input, { minHeight: 56 }]}
                placeholder="Eligibility Criteria & Required Skills"
                multiline
                value={eligibility}
                onChangeText={setEligibility}
              />
              <TouchableOpacity
                style={styles.facultySubmitBtn}
                onPress={handleCreateJob}
              >
                <Text style={styles.primaryBtnText}>
                  Publish to {collegeShortName} Board
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {filteredJobs.map((job) => {
            const studentCgpa = parseFloat(user.cgpa || '8.92') || 8.92;
            const isEligible = !job.min_cgpa || studentCgpa >= job.min_cgpa;
            return (
              <View key={job.id} style={styles.jobCard}>
                <View style={styles.jobTop}>
                  <View style={{ flex: 1 }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 6,
                        flexWrap: 'wrap',
                      }}
                    >
                      <Text style={styles.jobCompany}>{job.company}</Text>
                      {job.opening_type && (
                        <View style={styles.tierTag}>
                          <Text style={styles.tierTagText}>
                            {job.opening_type}
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.jobRole}>{job.role}</Text>
                  </View>
                  <View style={styles.salaryBadge}>
                    <Text style={styles.salaryText}>{job.salary}</Text>
                  </View>
                </View>

                <Text style={styles.jobEligibility}>{job.eligibility}</Text>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: '800',
                      color: isEligible ? '#15803d' : '#dc2626',
                    }}
                  >
                    {isEligible
                      ? `✓ Eligible (Your CGPA: ${studentCgpa})`
                      : `Requires CGPA ≥ ${job.min_cgpa}`}
                  </Text>
                  <Text style={{ fontSize: 10, color: COLORS.textMuted }}>
                    {job.applicants_count || 24} campus applicants
                  </Text>
                </View>

                <TouchableOpacity
                  style={[
                    styles.applyJobBtn,
                    job.applied && { backgroundColor: '#16a34a' },
                  ]}
                  onPress={() => onApplyJob(job.id)}
                >
                  <Text style={styles.applyJobText}>
                    {job.applied
                      ? '✓ Applied with Verified GitHub + CGPA'
                      : 'Apply with College-Verified Portfolio →'}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </>
      )}

      {subTab === 'faculty-labs' && (
        /* Student <-> Faculty Collaboration: Research Labs & Major Projects */
        <View style={{ gap: 12 }}>
          <View style={[styles.collegeBanner, { backgroundColor: '#312e81' }]}>
            <Text style={[styles.collegeBannerTag, { color: '#a5b4fc' }]}>
              STUDENT ↔ FACULTY • RESEARCH LABS & MAJOR PROJECTS
            </Text>
            <Text style={styles.collegeBannerTitle}>
              Co-Author IEEE Papers & Build Funded Lab Projects
            </Text>
            <Text style={[styles.collegeBannerSub, { color: '#e0e7ff' }]}>
              Professors post open Research Assistant (RA) slots, Major Project topics, and SIH mentorship slots.
            </Text>
            <TouchableOpacity
              style={[styles.facultyPostBtn, { marginTop: 8, alignSelf: 'flex-start' }]}
              onPress={() => setShowPostLab(!showPostLab)}
            >
              <Text style={styles.facultyPostText}>
                {showPostLab ? '✕ Close Form' : '+ Post Faculty Research / Project Slot'}
              </Text>
            </TouchableOpacity>
          </View>

          {showPostLab && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                🎓 Post Faculty Research / Mentorship Slot
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Research / Project Title"
                value={labTitle}
                onChangeText={setLabTitle}
              />
              <TextInput
                style={[styles.input, { minHeight: 56 }]}
                placeholder="Description, expected outcomes & lab details..."
                multiline
                value={labDesc}
                onChangeText={setLabDesc}
              />
              <TextInput
                style={styles.input}
                placeholder="Required Student Skills (e.g. PyTorch, React Native)"
                value={labSkills}
                onChangeText={setLabSkills}
              />
              <TextInput
                style={styles.input}
                placeholder="Student Perks (e.g. IEEE Co-Authorship + Stipend)"
                value={labPerks}
                onChangeText={setLabPerks}
              />
              <TouchableOpacity
                style={styles.facultySubmitBtn}
                onPress={handleCreateLab}
              >
                <Text style={styles.primaryBtnText}>Publish Faculty Lab Slot</Text>
              </TouchableOpacity>
            </View>
          )}

          {facultyProjects.map((fp) => (
            <View
              key={fp.id}
              style={[styles.jobCard, { borderLeftColor: COLORS.indigo }]}
            >
              <View style={styles.jobTop}>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: '800',
                      color: COLORS.indigo,
                    }}
                  >
                    {fp.type.toUpperCase()} • {fp.department}
                  </Text>
                  <Text style={styles.jobCompany}>{fp.title}</Text>
                  <Text style={{ fontSize: 11, color: COLORS.textSecondary }}>
                    Mentor: {fp.faculty_name} ({fp.designation})
                  </Text>
                </View>
                <View style={styles.salaryBadge}>
                  <Text style={styles.salaryText}>{fp.slots_open} Slots</Text>
                </View>
              </View>

              <Text style={styles.jobEligibility}>{fp.description}</Text>

              <View style={styles.skillRow}>
                {fp.required_skills.map((sk) => (
                  <View key={sk} style={styles.skillBadge}>
                    <Text style={styles.skillBadgeText}>{sk}</Text>
                  </View>
                ))}
              </View>

              <Text style={{ fontSize: 11, fontWeight: '700', color: '#0f766e' }}>
                🎁 Perks: {fp.perks}
              </Text>

              <TouchableOpacity
                style={[
                  styles.applyJobBtn,
                  { backgroundColor: COLORS.indigo },
                  fp.applied && { backgroundColor: '#16a34a' },
                ]}
                onPress={() => onApplyFacultyLab(fp.id)}
              >
                <Text style={styles.applyJobText}>
                  {fp.applied
                    ? '✓ Applied to Faculty Lab (GitHub Sent)'
                    : 'Apply to Faculty Lab with GitHub Portfolio →'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {subTab === 'townhall' && (
        /* Student <-> College Townhall & Action Tracker */
        <View style={{ gap: 12 }}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              📣 {collegeShortName} Student–College Townhall
            </Text>
            <Text style={styles.cardSub}>
              Propose campus improvements, lab hours, or hackathon grants. Upvoted proposals get official responses from the Dean & T&P Cell.
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Propose an action item to your college administration..."
              value={proposalTitle}
              onChangeText={setProposalTitle}
            />
            <TouchableOpacity
              style={styles.primaryCyanBtn}
              onPress={() => {
                if (!proposalTitle.trim()) return;
                onAddTownhallProposal(proposalTitle.trim(), proposalCat);
                setProposalTitle('');
              }}
            >
              <Text style={styles.primaryBtnText}>
                Submit Proposal to College Admin
              </Text>
            </TouchableOpacity>
          </View>

          {townhallProposals.map((tp) => (
            <View key={tp.id} style={styles.jobCard}>
              <View style={styles.jobTop}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', gap: 6, marginBottom: 4 }}>
                    <View style={styles.tierTag}>
                      <Text style={styles.tierTagText}>{tp.category}</Text>
                    </View>
                    <View
                      style={[
                        styles.tierTag,
                        {
                          backgroundColor:
                            tp.status === 'Approved by Dean'
                              ? '#dcfce7'
                              : '#fef3c7',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.tierTagText,
                          {
                            color:
                              tp.status === 'Approved by Dean'
                                ? '#166534'
                                : '#92400e',
                          },
                        ]}
                      >
                        ✓ {tp.status}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.jobCompany}>{tp.title}</Text>
                </View>

                <TouchableOpacity
                  style={[
                    styles.upvoteBtn,
                    tp.upvoted && {
                      backgroundColor: '#0f766e',
                      borderColor: '#0f766e',
                    },
                  ]}
                  onPress={() => onUpvoteTownhall(tp.id)}
                >
                  <Text
                    style={[
                      styles.upvoteBtnText,
                      tp.upvoted && { color: '#ffffff' },
                    ]}
                  >
                    ▲ {tp.upvotes}
                  </Text>
                </TouchableOpacity>
              </View>

              {tp.college_response && (
                <View style={styles.officialResponseBox}>
                  <Text style={styles.officialResponseTitle}>
                    🏛️ Official College Response:
                  </Text>
                  <Text style={styles.officialResponseText}>
                    {tp.college_response}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      {subTab === 'mentors' && (
        /* Mentors Directory (Faculty · Alumni · Expert) */
        <View style={{ gap: 12 }}>
          {activeMentor && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                Message {activeMentor.name} ({activeMentor.mentor_type})
              </Text>
              <TextInput
                style={[styles.input, { minHeight: 72 }]}
                placeholder="Ask for a GitHub repo review, SIH guidance, LoR, or referral..."
                multiline
                value={mentorMsg}
                onChangeText={setMentorMsg}
              />
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity
                  style={[styles.primaryCyanBtn, { flex: 1 }]}
                  onPress={() => {
                    if (!mentorMsg.trim()) return;
                    onMessageMentor(activeMentor, mentorMsg.trim());
                    setMentorMsg('');
                    setActiveMentor(null);
                  }}
                >
                  <Text style={styles.primaryBtnText}>Send In-App Message</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setActiveMentor(null)}
                >
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {mentors.map((m) => (
            <View key={m.id} style={styles.mentorCard}>
              <View style={styles.mentorAvatar}>
                <Text style={styles.mentorAvatarText}>
                  {m.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <View
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
                >
                  <Text style={styles.mentorName}>{m.name}</Text>
                  <View
                    style={[
                      styles.mentorTypeBadge,
                      { backgroundColor: '#e0e7ff' },
                    ]}
                  >
                    <Text
                      style={[styles.mentorTypeText, { color: '#3730a3' }]}
                    >
                      {m.mentor_type || 'MENTOR'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.mentorExp}>{m.expertise}</Text>
              </View>
              <TouchableOpacity
                style={styles.msgIconBtn}
                onPress={() => setActiveMentor(m)}
              >
                <Text style={styles.msgIconText}>💬 Ask</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 14, paddingBottom: 90, gap: 12 },
  topSegmentRow: { gap: 8, paddingBottom: 2 },
  segmentPill: {
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  segmentPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  segmentPillText: { fontSize: 11, fontWeight: '700', color: COLORS.textSecondary },
  segmentPillTextActive: { color: '#ffffff', fontWeight: '800' },
  collegeBanner: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 15,
    gap: 5,
  },
  collegeBannerTag: {
    color: '#38bdf8',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  collegeBannerTitle: { color: '#ffffff', fontSize: 16, fontWeight: '800' },
  collegeBannerSub: { color: '#cbd5e1', fontSize: 11, lineHeight: 16 },
  tierRow: { gap: 8 },
  tierPill: {
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tierPillActive: { backgroundColor: COLORS.cyan, borderColor: COLORS.cyan },
  tierPillText: { fontSize: 11, fontWeight: '700', color: COLORS.textSecondary },
  tierPillTextActive: { color: '#ffffff' },
  cgpaTriggerBtn: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  cgpaTriggerText: { color: '#ffffff', fontSize: 11, fontWeight: '800' },
  facultyPostBtn: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    justifyContent: 'center',
  },
  facultyPostText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 10,
  },
  cardTitle: { fontSize: 15, fontWeight: '800', color: COLORS.textPrimary },
  cardSub: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 17 },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
  },
  semGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  semInput: {
    width: '23%',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingVertical: 8,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
  },
  primaryCyanBtn: {
    backgroundColor: COLORS.cyan,
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: 'center',
  },
  facultySubmitBtn: {
    backgroundColor: COLORS.purple,
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryBtnText: { color: '#fff', fontWeight: '800', fontSize: 12 },
  jobCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.cyan,
    gap: 9,
  },
  jobTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  jobCompany: { fontSize: 15, fontWeight: '800', color: COLORS.textPrimary },
  tierTag: {
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tierTagText: { fontSize: 9, fontWeight: '800', color: '#0369a1' },
  jobRole: { fontSize: 13, fontWeight: '700', color: COLORS.cyan, marginTop: 2 },
  salaryBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
  },
  salaryText: { fontSize: 11, fontWeight: '800', color: '#15803d' },
  jobEligibility: {
    fontSize: 11,
    color: COLORS.textSecondary,
    backgroundColor: '#f8fafc',
    padding: 8,
    borderRadius: 8,
    lineHeight: 16,
  },
  skillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  skillBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  skillBadgeText: { fontSize: 10, fontWeight: '700', color: '#334155' },
  applyJobBtn: {
    backgroundColor: COLORS.linkedinBlue,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  applyJobText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  upvoteBtn: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  upvoteBtnText: { fontSize: 12, fontWeight: '800', color: '#0f172a' },
  officialResponseBox: {
    backgroundColor: '#f0fdfa',
    borderWidth: 1,
    borderColor: '#99f6e4',
    padding: 10,
    borderRadius: 10,
    gap: 2,
  },
  officialResponseTitle: { fontSize: 10, fontWeight: '800', color: '#0f766e' },
  officialResponseText: { fontSize: 11, color: '#134e4a', lineHeight: 16 },
  mentorCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 13,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.indigo,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  mentorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e0e7ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mentorAvatarText: { color: '#3730a3', fontWeight: '800', fontSize: 15 },
  mentorName: { fontSize: 14, fontWeight: '800', color: COLORS.textPrimary },
  mentorTypeBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 999,
  },
  mentorTypeText: { fontSize: 9, fontWeight: '800', textTransform: 'uppercase' },
  mentorExp: { fontSize: 11, color: COLORS.textSecondary, marginTop: 3 },
  msgIconBtn: {
    backgroundColor: '#eef2ff',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
  },
  msgIconText: { color: COLORS.indigo, fontSize: 11, fontWeight: '800' },
  cancelBtn: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 14,
    justifyContent: 'center',
    borderRadius: 10,
  },
  cancelBtnText: { color: '#475569', fontSize: 12, fontWeight: '700' },
});
