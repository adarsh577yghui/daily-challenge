import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Platform, Pressable, ScrollView, Share, StyleSheet, Text, View } from "react-native";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { GlassCard, palette, PrimaryButton, ProgressDots } from "@/components/challenge-ui";
import { calculateScore, getTodayChallenge } from "@/lib/challenges";
import { useChallengeStore } from "@/lib/challenge-store";

export default function PlayScreen() {
  const challenge = getTodayChallenge();
  const { progress, completeChallenge } = useChallengeStore();
  const [selected, setSelected] = useState<string | null>(null);
  const [resultScore, setResultScore] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const startedAt = useRef(Date.now());
  const didComplete = resultScore !== null;
  const remaining = Math.max(0, challenge.timeLimit - elapsed);

  useEffect(() => {
    if (didComplete) return;
    const interval = setInterval(() => {
      const nextElapsed = Math.floor((Date.now() - startedAt.current) / 1000);
      setElapsed(nextElapsed);
      if (nextElapsed >= challenge.timeLimit) {
        setSelected("__timeout__");
        setResultScore(0);
      }
    }, 250);
    return () => clearInterval(interval);
  }, [challenge.timeLimit, didComplete]);

  const answeredCorrectly = selected === challenge.correctAnswer;
  const progressPercent = Math.min(100, (elapsed / challenge.timeLimit) * 100);
  const feedbackTitle = selected === "__timeout__" ? "Time's up" : answeredCorrectly ? "Nice one!" : "Not this time";
  const feedbackColor = answeredCorrectly ? palette.mint : palette.coral;
  const displayScore = resultScore ?? 0;

  const chooseAnswer = async (answer: string) => {
    if (selected || didComplete) return;
    const seconds = Math.max(1, Math.floor((Date.now() - startedAt.current) / 1000));
    const score = calculateScore(challenge, answer === challenge.correctAnswer, seconds);
    setSelected(answer);
    setResultScore(score);
    await completeChallenge(challenge, score);
    if (Platform.OS !== "web") await Haptics.notificationAsync(answer === challenge.correctAnswer ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error);
  };

  const shareScore = async () => {
    await Share.share({ message: `I scored ${displayScore} points on today's DAILY CHALLENGE. Can you beat me?` });
  };

  const statusCopy = useMemo(() => {
    if (selected === "__timeout__") return "The correct answer was revealed.";
    if (!selected) return "Choose an answer before the timer runs out.";
    return answeredCorrectly ? challenge.explanation : `The answer was ${challenge.correctAnswer}. ${challenge.explanation}`;
  }, [answeredCorrectly, challenge.correctAnswer, challenge.explanation, selected]);

  return (
    <ScreenContainer containerClassName="bg-background" className="px-5" edges={["top", "left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.topBar}><Pressable accessibilityRole="button" onPress={() => router.back()} style={({ pressed }) => [styles.iconButton, pressed && { opacity: 0.65 }]}><MaterialIcons name="close" size={22} color={palette.text} /></Pressable><View style={styles.questionCount}><Text style={styles.questionCountText}>QUESTION <Text style={styles.questionCountAccent}>1/1</Text></Text></View><View style={styles.timer}><MaterialIcons name="timer" size={15} color={remaining <= 3 ? palette.coral : palette.yellow} /><Text style={[styles.timerText, remaining <= 3 && { color: palette.coral }]}>{remaining}s</Text></View></View>
        <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${progressPercent}%` }]} /></View>
        <View style={styles.intro}><Text style={styles.category}>{challenge.category.toUpperCase()}</Text><Text style={styles.title}>{challenge.question}</Text><Text style={styles.subtitle}>One answer. One chance. Trust your first instinct.</Text></View>
        <View style={styles.answers}>{challenge.options.map((option, index) => { const isSelected = selected === option; const isCorrect = option === challenge.correctAnswer; const stateStyle = didComplete && isCorrect ? styles.answerCorrect : isSelected ? styles.answerWrong : undefined; return <Pressable key={option} accessibilityRole="button" accessibilityState={{ disabled: Boolean(selected) }} onPress={() => chooseAnswer(option)} style={({ pressed }) => [styles.answer, stateStyle, pressed && !selected && styles.answerPressed]}><View style={[styles.answerLetter, didComplete && isCorrect && styles.answerLetterCorrect, isSelected && !isCorrect && styles.answerLetterWrong]}><Text style={[styles.answerLetterText, didComplete && isCorrect && { color: palette.bg }]}>{String.fromCharCode(65 + index)}</Text></View><Text style={[styles.answerText, didComplete && isCorrect && { color: palette.bg }]}>{option}</Text>{didComplete && isCorrect ? <MaterialIcons name="check-circle" size={22} color={palette.bg} style={styles.answerEnd} /> : isSelected ? <MaterialIcons name="cancel" size={22} color={palette.coral} style={styles.answerEnd} /> : null}</Pressable>; })}</View>
        {!didComplete ? <Text style={styles.helper}><MaterialIcons name="bolt" size={14} color={palette.yellow} /> Faster answers earn a small transparent bonus</Text> : <GlassCard style={styles.resultCard}><View style={styles.resultHeader}><View style={[styles.resultIcon, { backgroundColor: `${feedbackColor}20` }]}><MaterialIcons name={answeredCorrectly ? "check" : "priority-high"} size={23} color={feedbackColor} /></View><View><Text style={[styles.feedbackTitle, { color: feedbackColor }]}>{feedbackTitle}</Text><Text style={styles.feedbackCopy}>{statusCopy}</Text></View></View><View style={styles.scoreRow}><Text style={styles.scoreLabel}>YOUR SCORE</Text><Text style={styles.scoreValue}>{displayScore}</Text><Text style={styles.scoreUnit}>PTS</Text></View><View style={styles.resultMeta}><Text style={styles.resultMetaText}>🔥 {progress.currentStreak} day streak</Text><Text style={styles.resultMetaText}>✦ {challenge.points} base points</Text></View></GlassCard>}
        {didComplete ? <View style={styles.resultActions}><PrimaryButton icon="share" onPress={shareScore}>SHARE SCORE</PrimaryButton><Pressable accessibilityRole="button" onPress={() => { setSelected(null); setResultScore(null); setElapsed(0); startedAt.current = Date.now(); }} style={({ pressed }) => [styles.secondaryButton, pressed && { opacity: 0.7 }]}><Text style={styles.secondaryLabel}>PLAY AGAIN</Text><MaterialIcons name="replay" size={18} color={palette.purple} /></Pressable></View> : null}
        {!didComplete ? <View style={styles.bottomNote}><ProgressDots total={3} active={1} /><Text style={styles.bottomNoteText}>Daily challenges are server-published and refresh every day.</Text></View> : null}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 16, paddingBottom: 24 },
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 17 },
  iconButton: { width: 40, height: 40, borderRadius: 14, borderWidth: 1, borderColor: palette.line, backgroundColor: palette.panel, alignItems: "center", justifyContent: "center" },
  questionCount: { alignItems: "center" },
  questionCountText: { color: palette.muted, fontSize: 10, fontWeight: "900", letterSpacing: 1.2 },
  questionCountAccent: { color: palette.text },
  timer: { flexDirection: "row", alignItems: "center", gap: 5, minWidth: 52, justifyContent: "flex-end" },
  timerText: { color: palette.yellow, fontSize: 14, fontWeight: "900" },
  progressTrack: { height: 4, borderRadius: 4, backgroundColor: palette.line, overflow: "hidden", marginBottom: 33 },
  progressFill: { height: "100%", backgroundColor: palette.mint, borderRadius: 4 },
  intro: { marginBottom: 26 },
  category: { color: palette.purple, fontSize: 10, fontWeight: "900", letterSpacing: 1.5, marginBottom: 13 },
  title: { color: palette.text, fontSize: 29, lineHeight: 35, fontWeight: "900", letterSpacing: -0.8 },
  subtitle: { color: palette.faint, fontSize: 12, lineHeight: 18, marginTop: 10 },
  answers: { gap: 11 },
  answer: { minHeight: 67, borderRadius: 18, borderWidth: 1, borderColor: palette.line, backgroundColor: palette.panel, padding: 12, flexDirection: "row", alignItems: "center" },
  answerPressed: { transform: [{ scale: 0.985 }], borderColor: palette.purple },
  answerCorrect: { backgroundColor: palette.mint, borderColor: palette.mint },
  answerWrong: { borderColor: palette.coral, backgroundColor: "#281826" },
  answerLetter: { width: 38, height: 38, borderRadius: 13, backgroundColor: "#202039", alignItems: "center", justifyContent: "center", marginRight: 13 },
  answerLetterCorrect: { backgroundColor: "#B8F5E0" },
  answerLetterWrong: { backgroundColor: "#54283A" },
  answerLetterText: { color: palette.muted, fontSize: 14, fontWeight: "900" },
  answerText: { color: palette.text, fontSize: 15, fontWeight: "800", flex: 1 },
  answerEnd: { marginLeft: 8 },
  helper: { textAlign: "center", color: palette.faint, fontSize: 11, marginTop: 18 },
  resultCard: { padding: 17, marginTop: 22 },
  resultHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
  resultIcon: { width: 44, height: 44, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  feedbackTitle: { fontSize: 18, fontWeight: "900" },
  feedbackCopy: { color: palette.muted, fontSize: 11, lineHeight: 16, marginTop: 3, maxWidth: 240 },
  scoreRow: { flexDirection: "row", alignItems: "baseline", marginTop: 20, paddingTop: 17, borderTopWidth: 1, borderTopColor: palette.line },
  scoreLabel: { color: palette.faint, fontSize: 10, fontWeight: "900", letterSpacing: 1.2 },
  scoreValue: { color: palette.text, fontSize: 36, fontWeight: "900", marginLeft: "auto", letterSpacing: -1 },
  scoreUnit: { color: palette.purple, fontSize: 11, fontWeight: "900", marginLeft: 5 },
  resultMeta: { flexDirection: "row", justifyContent: "space-between", marginTop: 11 },
  resultMetaText: { color: palette.muted, fontSize: 10, fontWeight: "700" },
  resultActions: { gap: 11, marginTop: 17 },
  secondaryButton: { minHeight: 52, borderRadius: 17, borderWidth: 1, borderColor: palette.line, backgroundColor: palette.panel, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  secondaryLabel: { color: palette.purple, fontSize: 14, fontWeight: "900" },
  bottomNote: { alignItems: "center", gap: 12, marginTop: 27 },
  bottomNoteText: { color: palette.faint, fontSize: 10, textAlign: "center" },
});
