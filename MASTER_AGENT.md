# MASTER_AGENT.md

# Water Sort Puzzle - Master Development Agent

## Mission

You are the Lead Technical Director responsible for delivering a production-quality Water Sort Puzzle game using PixiJS 8 and TypeScript.

You must coordinate all specialized agents found in:

.antigravity/agents/

Never skip phases.

Never implement future phases before current phase is complete.

Always follow AGENTS.md and all project documentation.

---

# Project Goals

Target Platform

- Android
- Portrait Mode
- 60 FPS
- Mobile First

Technology

- PixiJS 8
- TypeScript
- Vite
- GSAP
- Howler
- LocalStorage

Future

- Capacitor
- AdMob
- Google Play Games
- Firebase Analytics

---

# Development Rules

Every phase must:

✓ Compile

✓ Run

✓ Have no console errors

✓ Pass QA

✓ Be reusable

✓ Be documented

Never leave TODOs.

Never create placeholder implementations unless explicitly requested.

Never duplicate code.

---

# File Ownership

Architect owns:

src/core

src/scenes

Gameplay owns:

src/game

src/levels

Rendering owns:

Rendering

UI owns:

src/ui

Animation owns:

effects

Audio owns:

audio

Optimization owns:

performance

QA owns:

tests

Ads owns:

AdManager

Analytics owns:

AnalyticsManager

Never modify another agent's files unless absolutely necessary.

---

# PHASE 1

## Architecture

Assigned Agent

Architect

Tasks

Create project structure

SceneManager

AssetLoader

Game bootstrap

StorageManager

InputManager

Config

Game Loop

Dependency Injection

Acceptance

Project starts successfully

No gameplay

No UI

No warnings

STOP

Wait for review.

---

# PHASE 2

Assigned Agent

Rendering

Tasks

BottleRenderer

LiquidRenderer

TextureManager

Responsive Layout

Sprite Factory

Texture Atlases

Acceptance

Can render empty bottles.

Can resize correctly.

STOP

---

# PHASE 3

Assigned Agent

Gameplay

Tasks

Bottle class

LiquidLayer

MoveValidator

Pour Logic

Undo

Restart

Win Detection

Acceptance

Game logic fully functional.

Independent from PixiJS.

STOP

---

# PHASE 4

Assigned Agent

Gameplay

Tasks

JSON Level Loader

Level Manager

Current Level

Progress

Completion

Acceptance

Playable first 20 levels.

STOP

---

# PHASE 5

Assigned Agent

UI

Tasks

Main Menu

HUD

Pause

Settings

Level Select

Buttons

Responsive UI

Acceptance

Menus fully functional.

STOP

---

# PHASE 6

Assigned Agent

Animation

Tasks

Bottle Tilt

Liquid Flow

Particles

Popup

Transitions

Win Animation

Acceptance

Everything animated smoothly.

STOP

---

# PHASE 7

Assigned Agent

Audio

Tasks

AudioManager

Music

SFX

Mute

Volume

Acceptance

All sounds working.

STOP

---

# PHASE 8

Assigned Agent

Gameplay

Tasks

Hint System

Undo Improvements

Difficulty Scaling

Coins

Stars

Acceptance

Game progression complete.

STOP

---

# PHASE 9

Assigned Agent

Gameplay

Tasks

Procedural Generator

Daily Challenge

Random Challenge

Acceptance

Infinite levels possible.

STOP

---

# PHASE 10

Assigned Agent

Ads

Tasks

AdManager

Rewarded API

Interstitial API

Callbacks

Stub Implementation

Acceptance

No SDK integration yet.

Interfaces only.

STOP

---

# PHASE 11

Assigned Agent

Analytics

Tasks

AnalyticsManager

Game Started

Level Started

Level Completed

Hint Used

Undo Used

Rewarded Watched

Acceptance

All events abstracted.

STOP

---

# PHASE 12

Assigned Agent

Optimization

Tasks

Object Pool

Sprite Pool

Memory Cleanup

Texture Optimization

Loading Optimization

Acceptance

Stable 60 FPS.

STOP

---

# PHASE 13

Assigned Agent

QA

Tasks

Test

Every level

Undo

Hints

Menus

Animations

Performance

Memory

Acceptance

Zero critical bugs.

STOP

---

# PHASE 14

Assigned Agent

Architect

Tasks

Project Cleanup

Dead Code Removal

Documentation

Final Review

Acceptance

Production Ready

Release Candidate

STOP

---

# After Every Phase

Run

- TypeScript compile
- Lint
- Build
- QA checks

If anything fails

Fix immediately.

Never continue.

---

# Git Workflow

After every successful phase

Create commit

Example

Phase 1 - Core Architecture

Phase 2 - Rendering

Phase 3 - Gameplay

...

Never continue without a clean build.

---

# Definition of Done

Every feature

✓ Reusable

✓ Mobile Ready

✓ Responsive

✓ Typed

✓ Documented

✓ Tested

✓ No warnings

✓ No duplicate code

✓ Performance optimized

Only proceed to the next phase when all acceptance criteria are satisfied.