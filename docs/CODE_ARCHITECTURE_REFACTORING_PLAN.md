# 🏗️ Code Architecture Refactoring Plan

**Project:** خواطر - Islamic Spiritual Texts App
**Current Version:** v0.1.0
**Date:** November 10, 2025
**Refactoring Duration:** 6-8 weeks

---

## ⚠️ Important Note

**This is a comprehensive theoretical plan (840+ lines)** created on November 10, 2025.

**For current, actionable tasks, see:**
- **[CLEANUP_PLAN.md](../CLEANUP_PLAN.md)** - Immediate cleanup tasks (recommended)
- **[TESTING_TUTORIAL.md](../TESTING_TUTORIAL.md)** - Testing improvements (recommended)

**Rationale for simplification:**
- Large-scale refactoring can be overwhelming
- Current codebase is production-ready and functional
- Testing tutorial provides immediate value
- Cleanup plan addresses real pain points now

---

## 📋 Executive Summary

This document outlines a systematic approach to refactor the codebase into small, manageable, and maintainable parts. The goal is to improve code quality, readability, testability, and reusability while following React and TypeScript best practices.

### Key Principles:
- 🎯 **Single Responsibility** - Each component/unit has one job
- 🔄 **Separation of Concerns** - Clear boundaries between layers
- ♻️ **Reusability** - DRY principle, extract common patterns
- 🧪 **Testability** - Small, focused units are easier to test
- 📦 **Composability** - Build complex UIs from simple parts
- 🚀 **Performance** - Optimize re-renders and bundle size

---

## 📊 Current Code Analysis

### Large Components (>150 lines)
| File | Lines | Issues |
|------|-------|--------|
| `Header.tsx` | 212 | Multiple responsibilities, no hooks |
| `PWAInstallPrompt.tsx` | 165 | Complex state logic, mixed concerns |
| `ContentRenderer.tsx` | 167 | Multiple rendering branches |

### Missing Architecture Patterns
- ❌ No custom hooks directory
- ❌ No error boundaries
- ❌ No context providers for global state
- ❌ No utility libraries for common patterns
- ❌ No service layer abstraction
- ❌ No type guards for better type safety

### Areas for Improvement
- Components doing too much logic
- State management scattered across components
- No clear data flow patterns
- Repeated code patterns
- No clear API abstraction

---

## 🎯 Refactoring Phases

### **Phase 1: Create Foundation & Hooks** (Week 1)
*Priority: High | Impact: High | Effort: Medium*

#### Goals:
- Establish a hooks directory structure
- Extract custom hooks from existing components
- Create base utilities and helpers
- Implement proper error boundaries

#### Steps:

1. **Create Hooks Directory Structure** (1 day)
   ```
   src/hooks/
   ├── index.ts
   ├── useBookmarks.ts
   ├── useFontSize.ts
   ├── useTheme.ts
   ├── usePWAInstall.ts
   ├── useNavigation.ts
   └── utils/
       ├── useMediaQuery.ts
       ├── useLocalStorage.ts
       └── useEventListener.ts
   ```

2. **Extract useTheme Hook** (0.5 day)
   - Extract theme logic from `ThemeToggle.tsx`
   - Create `src/hooks/useTheme.ts`
   - Update `ThemeToggle.tsx` to use the hook
   - Add tests

3. **Extract useFontSize Hook** (0.5 day)
   - Extract font size logic from `FontSizeControl.tsx`
   - Create `src/hooks/useFontSize.ts`
   - Update `FontSizeControl.tsx` to use the hook
   - Add tests

4. **Extract useBookmarks Hook** (1 day)
   - Extract bookmark logic from `bookmarks.ts`
   - Create `src/hooks/useBookmarks.ts`
   - Make it more React-friendly
   - Update components using bookmarks
   - Add tests

5. **Create usePWAInstall Hook** (1 day)
   - Extract PWA install logic from `PWAInstallPrompt.tsx`
   - Create `src/hooks/usePWAInstall.ts`
   - Simplify `PWAInstallPrompt.tsx`
   - Add tests

6. **Create Error Boundaries** (1 day)
   - `src/components/ErrorBoundary.tsx`
   - `src/components/AsyncErrorBoundary.tsx`
   - Wrap main app sections
   - Add fallback UI

7. **Create Base Hooks** (1 day)
   - `useLocalStorage.ts` - wrapper for localStorage
   - `useMediaQuery.ts` - responsive hooks
   - `useEventListener.ts` - generic event listener
   - Add tests

#### Deliverables:
- ✅ Hooks directory structure
- ✅ 5+ custom hooks extracted
- ✅ Error boundaries implemented
- ✅ 100% test coverage for hooks

#### Timeline: **5 working days**

---

### **Phase 2: Break Down Large Components** (Week 2-3)
*Priority: High | Impact: High | Effort: High*

#### Goals:
- Break down `Header.tsx` (212 lines)
- Break down `PWAInstallPrompt.tsx` (165 lines)
- Break down `ContentRenderer.tsx` (167 lines)
- Extract sub-components
- Simplify component logic

#### Steps:

1. **Refactor Header.tsx** (3 days)
   - Split into smaller components:
     - `Navigation.tsx` - Main navigation links
     - `InstallPromptButton.tsx` - Install button
     - `CacheStatus.tsx` - Cache checking logic
     - `MobileMenu.tsx` - Mobile menu
     - `HeaderLogo.tsx` - App logo
   - Extract logic into hooks:
     - `useNavigation.ts` - Navigation state
     - `useInstallPrompt.ts` - Install prompt
   - Result: Header.tsx ~50 lines

2. **Refactor PWAInstallPrompt.tsx** (2 days)
   - Split into components:
     - `InstallDialog.tsx` - Main dialog
     - `InstallActions.tsx` - Action buttons
     - `InstallIcon.tsx` - Icon display
   - Extract hooks:
     - Already created `usePWAInstall.ts`
   - Result: PWAInstallPrompt.tsx ~60 lines

3. **Refactor ContentRenderer.tsx** (3 days)
   - Split into renderers:
     - `TitleRenderer.tsx` - Render titles
     - `SubtitleRenderer.tsx` - Render subtitles
     - `TextRenderer.tsx` - Render text blocks
     - `AyahRenderer.tsx` - Render ayahs
     - `FooterRenderer.tsx` - Render footer
   - Create component mapper:
     - `ContentMapper.tsx` - Maps content type to renderer
   - Result: ContentRenderer.tsx ~70 lines

4. **Update Imports & Dependencies** (1 day)
   - Update all files importing old components
   - Update type exports
   - Update test files
   - Run full test suite

5. **Add PropTypes/Type Guards** (1 day)
   - Add runtime type checking where needed
   - Create type guards for data validation
   - Improve error messages

#### Deliverables:
- ✅ Header.tsx: 212 → ~50 lines (5 sub-components)
- ✅ PWAInstallPrompt.tsx: 165 → ~60 lines (3 sub-components)
- ✅ ContentRenderer.tsx: 167 → ~70 lines (5 renderers + 1 mapper)
- ✅ All imports updated
- ✅ Tests passing

#### Timeline: **10 working days**

---

### **Phase 3: Service Layer & Data Abstraction** (Week 3-4)
*Priority: High | Impact: High | Effort: Medium*

#### Goals:
- Create a clean service layer
- Abstract data fetching logic
- Implement caching strategies
- Add proper error handling

#### Steps:

1. **Create Service Layer** (2 days)
   ```
   src/services/
   ├── index.ts
   ├── khwater.service.ts
   ├── cache.service.ts
   ├── storage.service.ts
   └── types/
       ├── service.types.ts
       └── cache.types.ts
   ```
   - Refactor `khwater-service.ts` into proper service class
   - Add caching layer
   - Add storage abstraction
   - Add proper error handling

2. **Create Repository Pattern** (1 day)
   ```
   src/repositories/
   ├── index.ts
   ├── khwater.repository.ts
   └── base.repository.ts
   ```
   - Abstract data access
   - Add data transformation layer
   - Implement optimistic updates

3. **Add Data Validation** (1 day)
   - Create Zod schemas for type validation
   - Add runtime type checking
   - Create validation utilities
   - Add to service layer

4. **Implement Cache Strategy** (1 day)
   - Memory cache for sessions
   - LocalStorage for persistence
   - Cache invalidation strategy
   - Cache size limits

5. **Add Service Tests** (2 days)
   - Unit tests for services
   - Integration tests
   - Mock external dependencies
   - Test error cases

#### Deliverables:
- ✅ Clean service layer
- ✅ Repository pattern implemented
- ✅ Data validation with Zod
- ✅ Caching strategy
- ✅ 90%+ test coverage

#### Timeline: **7 working days**

---

### **Phase 4: State Management & Context** (Week 4-5)
*Priority: Medium | Impact: High | Effort: Medium*

#### Goals:
- Create context providers
- Extract global state
- Implement reducer pattern where needed
- Clear data flow

#### Steps:

1. **Create Context Structure** (1 day)
   ```
   src/contexts/
   ├── index.ts
   ├── AppContext.tsx
   ├── ThemeContext.tsx
   ├── FontSizeContext.tsx
   └── BookmarksContext.tsx
   ```

2. **Implement AppContext** (2 days)
   - Global app state
   - User preferences
   - App-wide actions
   - Reducer for complex state

3. **Implement ThemeContext** (1 day)
   - Theme state
   - Theme actions
   - LocalStorage integration
   - Sync across tabs

4. **Implement FontSizeContext** (1 day)
   - Font size state
   - Font size actions
   - LocalStorage integration

5. **Implement BookmarksContext** (1 day)
   - Bookmarks state
   - Bookmarks actions
   - Persistence logic

6. **Update Components** (1 day)
   - Replace hooks with context where appropriate
   - Update all consuming components
   - Remove redundant state

#### Deliverables:
- ✅ 4 context providers
- ✅ Global state management
- ✅ Clear data flow
- ✅ Sync across tabs

#### Timeline: **7 working days**

---

### **Phase 5: UI Component Library** (Week 5-6)
*Priority: Medium | Impact: Medium | Effort: Medium*

#### Goals:
- Create reusable UI components
- Implement design system
- Add animations and transitions
- Ensure consistency

#### Steps:

1. **Create Base Components** (2 days)
   ```
   src/components/ui/
   ├── Button/
   │   ├── Button.tsx
   │   ├── Button.stories.tsx
   │   └── Button.test.tsx
   ├── Dialog/
   ├── Input/
   ├── Card/
   └── ...
   ```
   - Button variants
   - Dialog/Modal
   - Input fields
   - Card components
   - Layout components

2. **Create Layout Components** (1 day)
   - Container
   - Grid system
   - Stack (vertical/horizontal)
   - Spacer
   - Center

3. **Create Feedback Components** (1 day)
   - Loading spinner
   - Skeleton
   - Toast/Notification
   - Progress bar
   - Empty state

4. **Add Animations** (1 day)
   - Framer Motion integration
   - Page transitions
   - Component animations
   - Micro-interactions

5. **Create Storybook** (1 day)
   - Install Storybook
   - Create stories for components
   - Add documentation
   - Add controls

#### Deliverables:
- ✅ 15+ reusable UI components
- ✅ Design system
- ✅ Animation library
- ✅ Storybook docs

#### Timeline: **6 working days**

---

### **Phase 6: Utilities & Helpers** (Week 6-7)
*Priority: Medium | Impact: Medium | Effort: Low*

#### Goals:
- Create utility libraries
- Extract common patterns
- Add type helpers
- Improve code organization

#### Steps:

1. **Create Utils Structure** (1 day)
   ```
   src/utils/
   ├── index.ts
   ├── date/
   ├── string/
   ├── array/
   ├── object/
   ├── number/
   └── validation/
   ```

2. **Add Common Utilities** (2 days)
   - Date formatting
   - String helpers (truncate, capitalize, etc.)
   - Array utilities (unique, group, etc.)
   - Object helpers (pick, omit, etc.)
   - Number formatting

3. **Add Type Utilities** (1 day)
   - Type guards
   - Utility types
   - Branded types
   - Helper functions

4. **Add Validation Utils** (1 day)
   - Form validation
   - Schema validation
   - Error handling
   - Sanitization

5. **Add Test Utils** (1 day)
   - Test helpers
   - Mock generators
   - Setup functions
   - Assertions

#### Deliverables:
- ✅ 50+ utility functions
- ✅ Type utilities
- ✅ Validation helpers
- ✅ Test utilities

#### Timeline: **6 working days**

---

### **Phase 7: Integration & Polish** (Week 7-8)
*Priority: Low | Impact: Low | Effort: Medium*

#### Goals:
- Integrate all changes
- Optimize performance
- Add final touches
- Documentation

#### Steps:

1. **Integration Testing** (2 days)
   - Test all refactored components
   - Check for regressions
   - Performance testing
   - Cross-browser testing

2. **Performance Optimization** (2 days)
   - React.memo where needed
   - useMemo/useCallback optimization
   - Code splitting
   - Bundle analysis

3. **Final Code Review** (1 day)
   - Review all changes
   - Check naming conventions
   - Verify patterns
   - Remove dead code

4. **Documentation** (2 days)
   - Update component docs
   - Add architecture guide
   - Create migration guide
   - Update README

5. **Cleanup** (1 day)
   - Remove old files
   - Update imports
   - Run linter
   - Final tests

#### Deliverables:
- ✅ All changes integrated
- ✅ Performance optimized
- ✅ Documentation complete
- ✅ Code cleanup done

#### Timeline: **8 working days**

---

## 📅 Timeline Overview

| Phase | Duration | Key Deliverables |
|-------|----------|------------------|
| **Phase 1** | Week 1 | Hooks directory, 5+ custom hooks, error boundaries |
| **Phase 2** | Week 2-3 | 3 large components broken down, 15+ sub-components |
| **Phase 3** | Week 3-4 | Service layer, repository pattern, data validation |
| **Phase 4** | Week 4-5 | 4 context providers, global state management |
| **Phase 5** | Week 5-6 | 15+ UI components, design system, Storybook |
| **Phase 6** | Week 6-7 | 50+ utilities, type helpers, test utils |
| **Phase 7** | Week 7-8 | Integration, optimization, documentation |
| **Total** | **6-8 weeks** | **Fully refactored, maintainable codebase** |

---

## 🏗️ New Directory Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (routes)/
│   │   ├── home/
│   │   ├── khwater/
│   │   └── search/
│   ├── layout.tsx
│   └── page.tsx
│
├── components/                   # React Components
│   ├── ui/                      # Reusable UI components
│   │   ├── Button/
│   │   ├── Dialog/
│   │   ├── Input/
│   │   └── ...
│   ├── khwater/                 # Domain-specific components
│   │   ├── ContentRenderer/
│   │   │   ├── TitleRenderer.tsx
│   │   │   ├── TextRenderer.tsx
│   │   │   └── AyahRenderer.tsx
│   │   ├── ShareButton/
│   │   └── ChapterCard/
│   └── shared/                  # Shared components
│       ├── Header/
│       │   ├── Navigation.tsx
│       │   ├── Logo.tsx
│       │   ├── MobileMenu.tsx
│       │   └── InstallButton.tsx
│       ├── Footer/
│       ├── ThemeToggle/
│       ├── FontSizeControl/
│       ├── PWAInstallPrompt/
│       │   ├── InstallDialog.tsx
│       │   ├── InstallActions.tsx
│       │   └── InstallIcon.tsx
│       └── ErrorBoundary/
│
├── hooks/                        # Custom React Hooks
│   ├── index.ts
│   ├── useTheme.ts
│   ├── useFontSize.ts
│   ├── useBookmarks.ts
│   ├── usePWAInstall.ts
│   ├── useNavigation.ts
│   └── utils/
│       ├── useLocalStorage.ts
│       ├── useMediaQuery.ts
│       └── useEventListener.ts
│
├── contexts/                     # React Contexts
│   ├── index.ts
│   ├── AppContext.tsx
│   ├── ThemeContext.tsx
│   ├── FontSizeContext.tsx
│   └── BookmarksContext.tsx
│
├── services/                     # Business Logic Layer
│   ├── index.ts
│   ├── khwater.service.ts
│   ├── cache.service.ts
│   └── storage.service.ts
│
├── repositories/                 # Data Access Layer
│   ├── index.ts
│   ├── khwater.repository.ts
│   └── base.repository.ts
│
├── lib/                          # Core Library
│   ├── types/                    # TypeScript Types
│   │   ├── khwater.ts
│   │   ├── common.ts
│   │   └── api.ts
│   └── utils/                    # Utilities
│       ├── date/
│       ├── string/
│       ├── array/
│       ├── object/
│       └── validation/
│
└── styles/                       # Styles
    ├── globals.css
    └── components/
```

---

## ✅ Success Criteria

### Code Quality
- ✅ No component >200 lines
- ✅ No component with >5 props
- ✅ All components have single responsibility
- ✅ 90%+ test coverage
- ✅ 0 ESLint errors
- ✅ All TypeScript errors resolved

### Architecture
- ✅ Separation of concerns maintained
- ✅ Clear data flow (Components → Hooks → Services → Repositories)
- ✅ Reusable components extracted
- ✅ Custom hooks for all stateful logic
- ✅ Error boundaries for graceful failures

### Performance
- ✅ Bundle size reduced by 20%
- ✅ Re-renders optimized
- ✅ Code splitting implemented
- ✅ Lazy loading where appropriate

### Maintainability
- ✅ Clear naming conventions
- ✅ Consistent code style
- ✅ Comprehensive documentation
- ✅ Easy to test
- ✅ Easy to modify

---

## 🚨 Risks & Mitigation

### High-Risk Items
1. **Breaking Existing Functionality**
   - Risk: Refactoring breaks features
   - Mitigation: Test each change, use feature flags, incremental deployment

2. **Component API Changes**
   - Risk: Breaking changes in component props
   - Mitigation: Version components, provide migration guide

3. **Performance Regression**
   - Risk: Refactoring impacts performance
   - Mitigation: Performance testing, bundle analysis, Lighthouse CI

### Medium-Risk Items
1. **Test Coverage**
   - Risk: Tests don't cover all cases
   - Mitigation: Write tests first, use TDD for critical parts

2. **Context Overuse**
   - Risk: Overusing context causes re-renders
   - Mitigation: Use selectors, memoization, careful context design

### Low-Risk Items
1. **Naming Conventions**
   - Risk: Inconsistent naming
   - Mitigation: Establish conventions, linting rules, code review

---

## 📚 Best Practices to Follow

### Component Design
1. **Single Responsibility** - One component, one job
2. **Composition over Inheritance** - Use composition patterns
3. **Props Interface** - Clear, typed props
4. **Default Props** - Provide sensible defaults
5. **PropTypes** - Runtime validation for critical props

### Hook Design
1. **Custom Hooks** - Extract reusable stateful logic
2. **Hook Naming** - Prefix with "use"
3. **Return Values** - Consistent return patterns
4. **Dependencies** - Correct dependency arrays
5. **Error Handling** - Graceful error handling

### Service Design
1. **Single Responsibility** - Each service has one job
2. **Dependency Injection** - Inject dependencies, don't import directly
3. **Error Handling** - Consistent error patterns
4. **Logging** - Structured logging
5. **Testing** - Easily mockable

### State Management
1. **Local State** - UseState for component-level state
2. **Context** - For global, low-frequency updates
3. **Reducer** - For complex state logic
4. **Zustand/Redux** - Only if Context isn't enough
5. **Persistence** - LocalStorage for preferences

---

## 🧪 Testing Strategy

### Unit Tests
- Components (rendering, props, events)
- Hooks (state, side effects, return values)
- Services (business logic, API calls)
- Utilities (pure functions)

### Integration Tests
- Component + Hook combinations
- Context providers + consumers
- Service + Repository integration

### E2E Tests
- User flows
- Navigation
- Search
- Bookmarks
- PWA installation

### Test Coverage Goals
- Components: 90%+
- Hooks: 95%+
- Services: 90%+
- Utils: 95%+
- Overall: 90%+

---

## 📝 Migration Strategy

### Before Starting
1. ✅ Backup current code
2. ✅ Create feature branch
3. ✅ Document current API
4. ✅ Set up CI/CD

### During Refactoring
1. Refactor one component at a time
2. Test after each change
3. Commit frequently with descriptive messages
4. Update documentation as you go

### After Refactoring
1. Run full test suite
2. Performance testing
3. Code review
4. Update documentation
5. Merge to main
6. Deploy to staging
7. Deploy to production

---

## 🔗 Resources

### Tools
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) - Component testing
- [MSW](https://mswjs.io/) - API mocking
- [Storybook](https://storybook.js.org/) - Component documentation
- [Zod](https://zod.dev/) - Schema validation
- [Framer Motion](https://www.framer.com/motion/) - Animations

### Articles
- [React Hooks Best Practices](https://react.dev/reference/react)
- [Component Design Patterns](https://react.dev/learn/thinking-in-react)
- [TypeScript Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
- [Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)

---

## 📊 Metrics & Measurement

### Code Quality Metrics
- Lines per component (target: <200)
- Cyclomatic complexity (target: <10)
- Test coverage (target: 90%+)
- Duplication rate (target: <5%)

### Performance Metrics
- Bundle size (target: -20%)
- First Contentful Paint (target: <1.5s)
- Time to Interactive (target: <2.0s)
- Cumulative Layout Shift (target: <0.1)

### Maintainability Metrics
- Time to fix bugs (target: -30%)
- Time to add features (target: -30%)
- Code review time (target: -20%)

---

## ✅ Checklist

### Phase 1
- [ ] Create hooks directory
- [ ] Extract useTheme hook
- [ ] Extract useFontSize hook
- [ ] Extract useBookmarks hook
- [ ] Extract usePWAInstall hook
- [ ] Create error boundaries
- [ ] Create base utility hooks
- [ ] All tests passing

### Phase 2
- [ ] Break down Header.tsx
- [ ] Break down PWAInstallPrompt.tsx
- [ ] Break down ContentRenderer.tsx
- [ ] Update all imports
- [ ] Add type guards
- [ ] All tests passing

### Phase 3
- [ ] Create service layer
- [ ] Implement repository pattern
- [ ] Add data validation
- [ ] Implement caching
- [ ] Service tests passing

### Phase 4
- [ ] Create contexts
- [ ] Implement AppContext
- [ ] Implement ThemeContext
- [ ] Implement FontSizeContext
- [ ] Implement BookmarksContext
- [ ] Update components

### Phase 5
- [ ] Create UI components
- [ ] Create layout components
- [ ] Create feedback components
- [ ] Add animations
- [ ] Set up Storybook

### Phase 6
- [ ] Create utilities
- [ ] Add type utilities
- [ ] Add validation utils
- [ ] Add test utils

### Phase 7
- [ ] Integration testing
- [ ] Performance optimization
- [ ] Code review
- [ ] Documentation
- [ ] Cleanup

---

**End of Refactoring Plan**

---

## 📝 Update (November 13, 2025)

**Status**: This comprehensive plan is complete but has been **superseded by simpler approaches**.

**Recommended Current Actions**:
1. **[CLEANUP_PLAN.md](../CLEANUP_PLAN.md)** - Remove duplicate files (low effort, high impact)
2. **[TESTING_TUTORIAL.md](../TESTING_TUTORIAL.md)** - Improve testing coverage (immediate value)
3. Continue with Phase 1 of this plan if time/resources permit

**Rationale**:
- Current codebase is production-ready
- Focus on immediate improvements over theoretical perfection
- Testing tutorial provides immediate developer value
- Cleanup addresses real technical debt

*This document remains for historical reference and comprehensive planning insights.*
