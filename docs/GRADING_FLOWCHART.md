# 🏌️ SwingVista Grading System Flowchart

```
                    GOLF SWING VIDEO
                           │
                           ▼
                ┌─────────────────────┐
                │   MediaPipe Pose    │
                │   Detection (33     │
                │   landmarks)        │
                └─────────────────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │   Swing Phase       │
                │   Detection         │
                │   (Address, Back,   │
                │    Down, Follow)    │
                └─────────────────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │   Trajectory        │
                │   Analysis          │
                │   (Club path,       │
                │    Hand movement)   │
                └─────────────────────┘
                           │
                           ▼
        ┌─────────────────────────────────────────────────┐
        │               5 CORE METRICS                   │
        └─────────────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   ⏱️ TEMPO   │    │  🔄 ROTATION │    │ ⚖️ WEIGHT   │
│             │    │             │    │ TRANSFER    │
│ • Backswing │    │ • Shoulders │    │ • Backswing │
│ • Downswing │    │ • Hips      │    │ • Impact    │
│ • Ratio     │    │ • X-Factor  │    │ • Finish    │
└─────────────┘    └─────────────┘    └─────────────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  🎯 SWING    │    │ 🎯 BODY      │    │   SCORING   │
│   PLANE     │    │ ALIGNMENT    │    │  SYSTEM     │
│             │    │             │    │             │
│ • Shaft     │    │ • Spine      │    │ • 0-100     │
│   Angle     │    │   Angle      │    │   per       │
│ • Plane     │    │ • Head       │    │   metric    │
│   Dev.      │    │   Movement   │    │ • Average   │
│             │    │ • Knee Flex  │    │   overall   │
└─────────────┘    └─────────────┘    └─────────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │   BENCHMARK         │
                │   COMPARISON        │
                │                     │
                │ • PGA Tour          │
                │   Standards         │
                │ • Amateur           │
                │   Standards         │
                └─────────────────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │   LETTER GRADE      │
                │                     │
                │ A (90-100) - Tour   │
                │ B (80-89) - Advanced│
                │ C (70-79) - Inter.  │
                │ D (60-69) - Begin.  │
                │ F (0-59) - Issues   │
                └─────────────────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │   AI ANALYSIS       │
                │                     │
                │ • Strengths         │
                │ • Improvements      │
                │ • Technical Notes   │
                │ • Key Tips          │
                │ • Recording Tips    │
                └─────────────────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │   FINAL REPORT      │
                │                     │
                │ • Overall Grade     │
                │ • Metric Scores     │
                │ • AI Feedback       │
                │ • Improvement Plan  │
                └─────────────────────┘
```

## 🔢 Scoring Formula

```
Individual Metric Score = 100 - (deviation from ideal / range) × 50

Overall Score = (Tempo + Rotation + Weight + Plane + Alignment) ÷ 5

Letter Grade:
- A: 90-100 (Tour level)
- B: 80-89 (Advanced amateur)
- C: 70-79 (Intermediate)
- D: 60-69 (Beginner)
- F: 0-59 (Needs work)
```

## 📊 Example Calculation

```
Tempo Score: 85/100
Rotation Score: 78/100
Weight Transfer: 92/100
Swing Plane: 88/100
Body Alignment: 81/100

Overall Score = (85 + 78 + 92 + 88 + 81) ÷ 5 = 84.8

Letter Grade: B (Advanced amateur level)
```

## 🎯 Key Features

- **Scientific**: Based on mathematical calculations, not opinion
- **Comprehensive**: 5 core metrics cover all swing fundamentals
- **Benchmarked**: Compared against PGA Tour and amateur standards
- **AI-Enhanced**: OpenAI provides contextual feedback
- **Trackable**: Save and compare multiple swings over time
