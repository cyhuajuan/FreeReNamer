# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FreeReNamer is a batch file renaming tool with both a web version and a Tauri desktop client. It supports multiple rename rules per profile and multiple profiles.

## Commands

```bash
# Web development
pnpm dev

# Web production build
pnpm build

# Tauri desktop development
pnpm tauri dev

# Tauri production build
pnpm tauri build

# Lint with Biome
pnpm lint
```

## Architecture

### Dual Platform System

The app uses a platform abstraction layer to support both web and Tauri desktop:

- **Web mode**: Uses FileSystemHandle API for file operations, stores data in IndexedDB via `idb-keyval`
- **Tauri mode**: Uses native Rust APIs via Tauri commands, stores data in `tauri-plugin-store-api`

Platform is determined by the `PLATFORM` environment variable (`web` or `tauri`), set via cross-env in npm scripts. The `__PLATFORM__`, `__PLATFORM_TAURI__`, and `__PLATFORM_WEB__` globals are injected at build time via Vite's define config.

Key platform-specific implementations:
- `src/lib/file/file.tauri.ts` - Tauri file operations
- `src/lib/file/file.web.ts` - Web FileSystemHandle operations
- `src/components/file/files-panel.tauri.tsx` - Tauri file panel
- `src/components/file/files-panel.web.tsx` - Web file panel

### Rule System

Rules are pluggable and defined in `src/lib/rules/`. Each rule type (replace, delete, format, template, script, insert) has a `RuleDefine` that provides:
- `type`: unique identifier
- `label`: display name
- `getDefaultInfo()`: returns default config
- `getDescription(info)`: describes the rule configuration
- `exec(info, args)`: performs the rename operation

Rules are registered via `defineRule()` in `src/lib/rules/index.ts`.

### State Management

- **Jotai** for global UI state (atoms in `src/lib/atoms/index.ts`)
- **TanStack React Query** for async data fetching
- **TanStack Router** for file-based routing
- **LocalStore** (`src/lib/store.ts`) abstracts storage: Tauri plugin store for desktop, idb-keyval for web

### Routing

Uses TanStack Router with file-based routing in `src/routes/`:
- `src/routes/__root.tsx` - Root layout with GlobalDialog/GlobalAlert
- `src/routes/profile/$profileId.tsx` - Main renaming interface with FilesPanel and RulesPanel

### UI Components

shadcn/ui components in `src/components/ui/` with New York style. Custom components:
- `src/components/file/` - File list management
- `src/components/rule/` - Rule editing UI
- `src/components/profile/` - Profile navigation
- `src/components/global/` - Global dialog and alert overlays

## Tech Stack

- **Frontend**: React 18, TypeScript, TailwindCSS, shadcn/ui
- **Routing**: TanStack Router
- **State**: Jotai (atoms), TanStack Query
- **Forms**: React Hook Form + Zod
- **Desktop**: Tauri 1.x with Rust backend
- **Linting**: Biome
