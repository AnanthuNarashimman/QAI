# QAI - Quality AI Analyzer

An intelligent website auditor that analyzes non-functional aspects of websites using AI agents powered by Gemini.

![Status](https://img.shields.io/badge/status-under%20development-orange)


## What Does It Do?

QAI crawls websites and evaluates them based on critical design and user experience factors that often get overlooked:

- **CTA (Call-to-Action) Efficiency** - Analyzes button placement, contrast, copywriting, and conversion effectiveness
- **Theme Consistency** - Evaluates visual coherence, color palette usage, typography, and spacing
- **Intent Matching** - Compares the actual website design against the owner's intended vision

## How It Works

1. **User provides a URL** and optionally describes their intended design in natural language
2. **AI parses the intent** into structured criteria (website type, theme, tone, audience, goals)
3. **BFS crawler explores** the website systematically (configurable page limit)
4. **Gemini-powered agents** analyze each page using browser automation
5. **Detailed report** highlights issues, scores design elements, and provides actionable recommendations

## Key Features

- **Context-Aware Analysis** - Understands user's design intent through natural language prompts
- **Automated Crawling** - Discovers and analyzes multiple pages automatically
- **Objective Scoring** - Provides 0-100 scores for CTA efficiency and theme consistency
- **Specific Recommendations** - Points out exact elements that need improvement
- **Comparison Mode** - Identifies gaps between intended design and actual implementation

## Built For

Google Gemini 3 Hackathon - showcasing Gemini's capabilities in visual understanding, structured output generation, and browser automation.

## Tech Stack

- **Backend**: Python, Flask
- **Automation**: browser-use
- **AI**: Gemini 
- **Frontend**: React, Vite
