# Water Sort Puzzle - Production Architecture

## Overview
A production-ready, mobile-first Water Sort Puzzle game built with PixiJS 8, TypeScript, GSAP, Howler, and Vite. Designed to run at 60 FPS on mobile browsers and native Capacitor/Android webviews.

---

## System Architecture

```
                       +-------------------+
                       |      Game.ts      | (Main Bootstrap)
                       +---------+---------+
                                 |
                     +-----------+-----------+
                     |   ServiceContainer   | (Dependency Injection)
                     +-----------+-----------+
                                 |
   +-------------------+---------+---------+-------------------+
   |                   |                   |                   |
+--v------------+  +---v-----------+   +---v-----------+   +---v-----------+
| SceneManager  |  |  EventBus     |   |StorageManager |   |  InputManager |
+---------------+  +---------------+   +---------------+   +---------------+
```

---

## Domain Architecture & Layering

### 1. Core Architecture (`src/core/`)
* **`Game.ts`**: Game bootstrap, PixiJS 8 application lifecycle, ServiceContainer initialization.
* **`Config.ts`**: Global constants, target resolution (1080x1920 portrait), target FPS (60), colors.
* **`ServiceContainer.ts`**: Dependency Injection container managing manager singletons.
* **`EventBus.ts`**: Type-safe event emitter for decoupling components.
* **`StorageManager.ts`**: LocalStorage wrapper with JSON serialization error handling and key prefixing.
* **`InputManager.ts`**: Normalizes touch/pointer interactions and screen resize events.
* **`SceneManager.ts`**: Manages scene lifecycle, transitions, resize delegation, and frame updates.
* **`GameLoop.ts`**: PixiJS Ticker wrapper tracking delta time and FPS performance.

### 2. Rendering System (`src/rendering/`)
* **`BottleRenderer.ts`**: Container component drawing glass backings, specular sheen, selection highlights, and liquid masks.
* **`LiquidRenderer.ts`**: Renders multi-layer liquid blocks with top surface highlights.
* **`TextureManager.ts`**: Procedural GPU texture generator and caching manager.
* **`ResponsiveLayout.ts`**: Responsive grid calculator scaling and positioning bottles dynamically.
* **`SpriteFactory.ts`**: Factory helper for bottle renderers and background graphics.

### 3. Gameplay Engine (`src/game/`)
* **`WaterSortGame.ts`**: Primary domain controller managing level state, selection, moves, undo stack, and win checks.
* **`Bottle.ts`**: Pure domain model holding liquid layers and capacity limits (**0 PixiJS dependencies**).
* **`MoveValidator.ts`**: Validates Water Sort pour rules (color matching, space remaining, non-empty source).
* **`PourLogic.ts`**: Executes liquid transfer operations and creates immutable move records.
* **`UndoManager.ts`**: Manages move history and reverses liquid transfers.
* **`WinDetection.ts`**: Verifies victory condition (all non-empty bottles contain single-color full liquid).
* **`HintSolver.ts`**: Analyzes game state to compute optimal hint moves.
* **`EconomyManager.ts`**: Tracks player coins and 1-3 star level ratings backed by `StorageManager`.

### 4. Level System (`src/levels/`)
* **`levels.json`**: Predefined configurations for Levels 1–20.
* **`LevelLoader.ts`**: Loads JSON definitions for levels 1–20 and delegates to `LevelGenerator` for level 21+.
* **`LevelGenerator.ts`**: Reverse-pour shuffle generator creating 100% solvable infinite levels.
* **`DailyChallengeManager.ts`**: Date-seeded daily challenge generator (+100 coin completion reward).

### 5. UI System (`src/ui/`)
* **`UIButton.ts`**: Reusable interactive button with scale-press feedback and disabled states.
* **`HUD.ts`**: Top bar showing level number, move count, coin balance, and `Undo`, `Restart`, `Hint`, `Pause` buttons.
* **`ModalOverlay.ts`**: Modal backdrop and container card wrapper.
* **`PauseModal.ts`**: Pause menu overlay.
* **`SettingsModal.ts`**: Settings popup with SFX/Music toggles and progress reset.
* **`WinDialog.ts`**: Celebratory victory dialog displaying star ratings, coin rewards, and next level button.

### 6. Scenes (`src/scenes/`)
* **`BaseScene.ts`**: Abstract base scene extending PixiJS `Container`.
* **`BootScene.ts`**: Initial preloader and diagnostic test scene.
* **`MainMenuScene.ts`**: Title screen with Play, Daily Challenge, Level Select, and Settings options.
* **`LevelSelectScene.ts`**: 20-level grid displaying star badges and unlocked/locked level states.
* **`GameScene.ts`**: Main gameplay scene binding rendering, animations, audio, and game state logic.

### 7. Effects & Animations (`src/effects/`)
* **`BottleAnimator.ts`**: GSAP timeline manager for bottle selection lift, pour tilt, and return animation.
* **`LiquidStreamEffect.ts`**: Dynamic stream line renderer for pouring liquid.
* **`ParticleSystem.ts`**: Confetti particle explosion for victory celebrations.
* **`AnimationUtils.ts`**: Pop-in, pop-out, lift, and drop animation helpers.

### 8. Audio (`src/audio/`)
* **`SoundEffects.ts`**: Zero-asset Web Audio API synthesizer for taps, pours, clicks, victory chords, and undos.
* **`AudioManager.ts`**: Central audio controller handling SFX/Music mute states and volume settings.

### 9. Services & Architecture Support (`src/ads/`, `src/analytics/`, `src/performance/`, `src/tests/`)
* **`AdManager.ts`**: Provider interface and stub provider for rewarded video and interstitial ads.
* **`AnalyticsManager.ts`**: Event telemetry abstraction supporting `game_started`, `level_completed`, `hint_used`, etc.
* **`ObjectPool.ts`**: Instance recycler reducing garbage collection stutters.
* **`MemoryOptimizer.ts`**: Asset texture purge and container disposal utility.
* **`PerformanceTracker.ts`**: Real-time 60 FPS rolling frame rate monitor.
* **`qa.test.ts` & `gameplay.test.ts`**: Automated verification test suites.

---

## Build & Production Verification
* **TypeScript Compiler**: `tsc --noEmit` (Passed with 0 errors)
* **Vite Bundle**: `vite build` (Passed with 0 errors)
