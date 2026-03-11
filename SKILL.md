---
name: nextjs-app-builder
description: Build, refactor, and scale Next.js App Router applications with production-grade structure, performance, accessibility, and test coverage. Use when creating or improving pages, layouts, components, data flows, forms, route handlers, server actions, or frontend architecture in a Next.js TypeScript project.
---

# Next.js App Workflow

## Start With The Feature Boundary

- Identify the user role affected: `admin` or `staff`.
- Identify the domain impacted: `asset-types`, `assets`, `assignments`, or `assignment-history`.
- Keep feature code grouped by domain when the app grows instead of scattering logic across unrelated folders.

## Prefer Server-First Architecture

- Default to Server Components.
- Add `"use client"` only when state, effects, browser APIs, or event handlers are required.
- Fetch data on the server whenever possible.
- Keep authorization and role checks on the server side.
- Use route handlers or server actions for mutations; keep write paths explicit and auditable.

## Build For Scale

- Keep routes thin; move reusable business logic into feature or `lib` modules.
- Define clear types for domain entities and mutation payloads.
- Avoid duplicating validation, role checks, or formatting logic.
- Prefer composable UI primitives over page-specific one-off markup when patterns repeat.
- Design for extensibility so new asset states, asset fields, or history events can be added without rewriting the feature.

## Optimize Deliberately

- Minimize client-side JavaScript by reducing client component boundaries.
- Use streaming-friendly patterns with `loading.tsx` and sensible suspense boundaries when a route can benefit from them.
- Use `next/font`, optimized images, and dynamic imports where they materially reduce cost.
- Avoid unnecessary re-renders and unnecessary client fetch waterfalls.
- Ship simple data shapes to the client; keep transformation work on the server when possible.

## Keep The UI Professional

- Build accessible forms, tables, dialogs, and navigation.
- Include loading, empty, success, and error states for every important admin workflow.
- Favor clear information hierarchy over decorative complexity.
- Keep layouts responsive and usable on desktop and mobile.
- Make assignment status, assignee, and history easy to scan.

## Test The Behavior

- Add unit tests for utilities, validation, and business rules.
- Add component tests for critical interactive UI such as forms, filters, tables, and dialogs.
- Add end-to-end coverage for the core admin journey:
  - create asset type
  - create asset
  - assign asset to staff
  - review assignment history
- Prefer `Vitest` with React Testing Library for unit and component tests.
- Prefer `Playwright` for end-to-end flows.
- Target meaningful coverage on touched code. A practical baseline is `80%` coverage for lines, functions, and branches on the feature being added or changed.

## Delivery Checklist

- Keep TypeScript types strict and intention-revealing.
- Verify linting, build, and tests before closing the task.
- Check that metadata, accessibility labels, and responsive behavior are not left incomplete.
- Document any new conventions only when they are likely to be reused.
