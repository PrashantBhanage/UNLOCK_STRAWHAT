package com.edubridge.service;

import com.edubridge.dto.AskResponseDto;
import com.edubridge.dto.FaqResponse;
import com.edubridge.dto.SlideResponse;
import com.edubridge.entity.FaqKnowledgeBase;
import com.edubridge.repository.FaqRepository;
import com.edubridge.repository.SlideContentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AiAssistantService {

    private static final String FALLBACK_MESSAGE =
            "No saved answer found, please ask a tutor.";

    private static final Set<String> STOP_WORDS = Set.of(
            "a", "an", "the", "is", "are", "was", "were", "be", "been", "being",
            "have", "has", "had", "do", "does", "did", "will", "would", "could",
            "should", "may", "might", "must", "shall", "can", "to", "of", "in",
            "for", "on", "with", "at", "by", "from", "as", "into", "through",
            "during", "before", "after", "above", "below", "between", "out",
            "off", "over", "under", "again", "further", "then", "once", "here",
            "there", "when", "where", "why", "how", "all", "each", "few", "more",
            "most", "other", "some", "such", "no", "nor", "not", "only", "own",
            "same", "so", "than", "too", "very", "what", "which", "who", "whom",
            "this", "that", "these", "those", "am", "it", "its", "i", "me", "my",
            "we", "our", "you", "your", "he", "him", "his", "she", "her", "they",
            "them", "their", "if", "or", "and", "but", "about", "up", "down"
    );

    private final SlideContentRepository slideContentRepository;
    private final FaqRepository faqRepository;

    @Transactional(readOnly = true)
    public List<SlideResponse> getSlidesForSubject(String subject) {
        return slideContentRepository.findBySubjectIgnoreCaseOrderBySlideNumberAsc(subject)
                .stream()
                .map(SlideResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<FaqResponse> getFaqForSubject(String subject) {
        return faqRepository.findBySubjectIgnoreCase(subject)
                .stream()
                .map(FaqResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public AskResponseDto ask(String question, String subject) {
        if (question == null || question.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Question is required");
        }
        if (subject == null || subject.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Subject is required");
        }

        List<FaqKnowledgeBase> faqs = faqRepository.findBySubjectIgnoreCase(subject);
        if (faqs.isEmpty()) {
            return new AskResponseDto(FALLBACK_MESSAGE, false);
        }

        Set<String> questionWords = tokenize(question);
        if (questionWords.isEmpty()) {
            return new AskResponseDto(FALLBACK_MESSAGE, false);
        }

        FaqKnowledgeBase bestMatch = null;
        int bestScore = 0;

        for (FaqKnowledgeBase faq : faqs) {
            int score = scoreKeywords(questionWords, faq.getKeywords());
            if (score > bestScore) {
                bestScore = score;
                bestMatch = faq;
            }
        }

        if (bestMatch == null || bestScore == 0) {
            return new AskResponseDto(FALLBACK_MESSAGE, false);
        }

        return new AskResponseDto(bestMatch.getAnswer(), true);
    }

    private int scoreKeywords(Set<String> questionWords, String keywords) {
        if (keywords == null || keywords.isBlank()) {
            return 0;
        }

        Set<String> keywordTokens = Arrays.stream(keywords.toLowerCase(Locale.ROOT).split(","))
                .map(String::trim)
                .filter(token -> !token.isEmpty())
                .flatMap(token -> Arrays.stream(token.split("\\s+")))
                .map(String::trim)
                .filter(token -> !token.isEmpty() && !STOP_WORDS.contains(token))
                .collect(Collectors.toSet());

        int score = 0;
        for (String word : questionWords) {
            if (keywordTokens.contains(word)) {
                score++;
                continue;
            }
            for (String keyword : keywordTokens) {
                if (word.length() >= 4 && (keyword.contains(word) || word.contains(keyword))) {
                    score++;
                    break;
                }
            }
        }
        return score;
    }

    private Set<String> tokenize(String text) {
        Set<String> words = new HashSet<>();
        for (String raw : text.toLowerCase(Locale.ROOT).split("\\W+")) {
            String word = raw.trim();
            if (word.length() >= 2 && !STOP_WORDS.contains(word)) {
                words.add(word);
            }
        }
        return words;
    }
}
