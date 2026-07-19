# Implementation Plan: Public Web Beta

**Branch**: `dev` | **Date**: 2026-07-19 | **Spec**: [spec.md](./spec.md)

## Summary

Publish the existing static React/Vite application as a GitHub Pages Web Beta
before investing in native application-store submission. Add a base-path-aware
public asset resolver, build the hosted variant below `/playground/`, provide a
plain-language privacy page and repository landing page, and add a gated Pages
deployment workflow. Existing NAS and Tauri releases keep `/` as their default
asset base.

## Technical Context

- React 19, TypeScript 5.8, Vite 7, Tauri 2
- Static bundled images and local Mandarin audio
- GitHub Actions and GitHub Pages
- No backend, account, analytics SDK, advertising SDK, or cloud storage

## Implementation

1. Add `vite.config.ts` with an environment-controlled base path whose default
   remains `/`.
2. Add one `publicAsset()` runtime helper and use it at every browser boundary:
   scene images, token images, brand images, launch audio, voice manifest, and
   manifest-provided audio files.
3. Make HTML icons and social preview assets use Vite's `%BASE_URL%` replacement.
4. Add `public/privacy.html`, `.nojekyll`, a public-facing `README.md`, and Web
   Beta deployment documentation.
5. Add a GitHub Pages workflow and source-level release contract tests.
6. Validate both the default root build and `/playground/` build, then run the
   curriculum, voice, release, and responsive browser checks.

## Release Boundary

This implementation prepares a deployable revision. Merging to `main`, pushing
the release revision, enabling GitHub Pages, and accepting the resulting public
URL are explicit publication actions and remain outside the local change until
the maintainer confirms them.

