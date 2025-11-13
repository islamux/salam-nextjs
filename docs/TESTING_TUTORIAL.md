# 🧪 Complete Testing Tutorial for Beginners

**Project**: خواطر - Islamic Spiritual Texts App
**From**: Senior Developer
**To**: Junior Developer (No prior testing experience required)

---

## Table of Contents
1. [Introduction to Testing](#introduction)
2. [Why We Test](#why-test)
3. [Types of Tests in Our Project](#types-of-tests)
4. [Testing Tools We Use](#tools)
5. [Running Existing Tests](#running-tests)
6. [Understanding Our Test Files](#understanding-tests)
7. [Writing Your First Unit Test](#first-unit-test)
8. [Testing Components](#testing-components)
9. [Testing Utilities](#testing-utilities)
10. [Writing E2E Tests](#writing-e2e)
11. [Best Practices](#best-practices)
12. [Common Patterns](#patterns)
13. [Troubleshooting](#troubleshooting)

---

## 🎓 Introduction to Testing {#introduction}

### What is Testing?
Testing is the practice of writing code that **verifies other code works correctly**. Think of it as having a robot that checks if your code does what you expect.

### Why This Matters
- **Catch bugs early** - Find problems before users do
- **Refactor safely** - Change code with confidence
- **Document behavior** - Tests show how code should work
- **Save time** - Automated tests are faster than manual testing
- **Build confidence** - Know your code works

### Your Role
As a developer, you'll:
- Run existing tests to ensure everything works
- Write tests for new features you create
- Fix failing tests when code changes
- Maintain test coverage

---

## 🎯 Why We Test {#why-test}

### Real-World Example
Imagine you're building a bookmark feature:

**Without tests:**
```javascript
// You manually test:
// 1. Bookmark a chapter
// 2. Check it appears in list
// 3. Unbookmark it
// 4. Verify it's gone
// 5. Refresh page, check it stays gone
// 6. Test with different chapters...
// This takes 10+ minutes every time!
```

**With tests:**
```bash
# Run all tests in 2 seconds
pnpm test

# Get instant feedback
✅ bookmarks: getBookmarks returns empty array
✅ bookmarks: returns bookmarks from localStorage
✅ bookmarks: addBookmark adds new bookmark
✅ bookmarks: removeBookmark removes bookmark
✅ bookmarks: toggleBookmark works correctly
```

**Result**: Save time, catch errors faster, work with confidence!

---

## 📊 Types of Tests in Our Project {#types-of-tests}

### 1. Unit Tests (Small, Fast)
**What**: Test individual functions or small pieces of code in isolation.

**Examples in our project**:
- `bookmarks.test.ts` - Tests bookmark functions
- `search-index.test.ts` - Tests search functionality
- `elm-service.test.ts` - Tests data service functions

**Run time**: < 1 second
**When to write**: For every utility function, service, or hook

---

### 2. Integration Tests (Medium Speed)
**What**: Test how multiple pieces work together.

**Examples in our project**:
- Testing component + hook combinations
- Testing service + data integration

**Run time**: 1-3 seconds
**When to write**: When multiple parts need to work together

---

### 3. End-to-End (E2E) Tests (Slow, Real)
**What**: Test the entire app like a real user would.

**Examples in our project**:
- `home.spec.ts` - Tests navigating to home page
- `chapter.spec.ts` - Tests reading a chapter

**Run time**: 10-30 seconds
**When to write**: For critical user journeys

---

## 🛠️ Testing Tools We Use {#tools}

### Vitest (Unit Testing)
- **Used for**: Unit tests
- **Location**: `src/**/__tests__/*.test.ts`
- **Why Vitest**: Fast, modern, works with TypeScript
- **Similar to**: Jest, but faster

### Testing Library
- **Used for**: Testing React components
- **Why we use it**: Tests components as users see them
- **Good for**: Button clicks, form submissions, rendering

### Playwright (E2E Testing)
- **Used for**: End-to-end tests
- **Location**: `e2e/*.spec.ts`
- **Why Playwright**: Works in real browsers (Chrome, Firefox, Safari)
- **Good for**: Full user workflows

---

## 🚀 Running Existing Tests {#running-tests}

### Basic Commands

```bash
# Run all tests in watch mode (reruns on file changes)
pnpm test

# Run tests once (for CI/CD)
pnpm test:run

# Run tests with UI (visual interface)
pnpm test:ui

# Run tests with coverage report
pnpm test:coverage

# Run only E2E tests
pnpm exec playwright test
```

### Watching Tests
```bash
pnpm test
```
This starts Vitest in watch mode:
- ✅ Shows test results
- 🔄 Automatically reruns when you change files
- 📊 Shows coverage percentage
- 🎯 Lets you filter which tests to run

---

## 📖 Understanding Our Test Files {#understanding-tests}

### Unit Test Example: Bookmarks

Let's look at `src/lib/utils/__tests__/bookmarks.test.ts`:

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getBookmarks, addBookmark } from '../bookmarks';

describe('bookmarks', () => {
  // Setup: Clear localStorage before each test
  beforeEach(() => {
    localStorage.clear();
  });

  describe('getBookmarks', () => {
    it('should return empty array when no bookmarks exist', () => {
      // Arrange
      localStorage.clear();

      // Act
      const bookmarks = getBookmarks();

      // Assert
      expect(bookmarks).toEqual([]);
    });

    it('should return bookmarks from localStorage', () => {
      // Arrange
      const mockBookmarks = [
        {
          id: '1-0-1234567890',
          chapterId: '1',
          itemIndex: 0,
          title: 'عنوان',
          content: 'محتوى',
          createdAt: 1234567890,
        },
      ];
      localStorage.setItem('elm-bookmarks', JSON.stringify(mockBookmarks));

      // Act
      const bookmarks = getBookmarks();

      // Assert
      expect(bookmarks).toEqual(mockBookmarks);
    });
  });
});
```

**Breaking it down**:
- `describe()` - Groups related tests together
- `it()` or `test()` - Individual test case
- `expect()` - Makes assertions about the result
- `beforeEach()` - Runs before each test (for setup)

---

### E2E Test Example: Home Page

Let's look at `e2e/home.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should display all chapters', async ({ page }) => {
    // Navigate to home page
    await page.goto('/home');

    // Check page title
    await expect(page).toHaveTitle(/خواطر/);

    // Check that chapter 1 is visible
    const chapter1 = page.locator('text=الفصل 1');
    await expect(chapter1).toBeVisible();

    // Check that all 29 chapters are listed
    const chapters = page.locator('a[href^="/khwater/"]');
    await expect(chapters).toHaveCount(29);
  });
});
```

**Breaking it down**:
- `test.describe()` - Groups related E2E tests
- `test()` - Individual E2E test
- `page.goto()` - Navigate to a URL
- `page.locator()` - Find elements on the page
- `await expect().toBeVisible()` - Wait for element to be visible
- `{ page }` - Playwright's browser instance

---

## ✍️ Writing Your First Unit Test {#first-unit-test}

### Step-by-Step Guide

Let's say you have a utility function:

```typescript
// src/lib/utils/calculate.ts
export function sum(a: number, b: number): number {
  return a + b;
}

export function multiply(a: number, b: number): number {
  return a * b;
}
```

### 1. Create Test File
```bash
# Create the test file
touch src/lib/utils/__tests__/calculate.test.ts
```

### 2. Write the Test
```typescript
import { describe, it, expect } from 'vitest';
import { sum, multiply } from '../calculate';

describe('calculate utilities', () => {
  describe('sum', () => {
    it('should add two positive numbers correctly', () => {
      // Arrange
      const a = 5;
      const b = 3;

      // Act
      const result = sum(a, b);

      // Assert
      expect(result).toBe(8);
    });

    it('should handle negative numbers', () => {
      const result = sum(-5, -3);
      expect(result).toBe(-8);
    });

    it('should handle zero', () => {
      const result = sum(0, 5);
      expect(result).toBe(5);
    });
  });

  describe('multiply', () => {
    it('should multiply two numbers correctly', () => {
      const result = multiply(4, 5);
      expect(result).toBe(20);
    });

    it('should return 0 when multiplying by zero', () => {
      const result = multiply(5, 0);
      expect(result).toBe(0);
    });
  });
});
```

### 3. Run the Test
```bash
pnpm test calculate
```

### 4. Expected Output
```
✅ calculate utilities
  ✅ sum
    ✅ should add two positive numbers correctly
    ✅ should handle negative numbers
    ✅ should handle zero
  ✅ multiply
    ✅ should multiply two numbers correctly
    ✅ should return 0 when multiplying by zero

Test Files: 1 passed
Tests: 5 passed
Time: 0.5s
```

---

## 🔧 Testing Components {#testing-components}

### Example: Testing a Button Component

Assume we have this component:

```tsx
// src/components/ui/Button.tsx
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export function Button({ children, onClick, disabled = false }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400"
    >
      {children}
    </button>
  );
}
```

### Write the Test

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button Component', () => {
  it('should render with text', () => {
    render(<Button>Click Me</Button>);

    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);

    const button = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Click Me</Button>);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should not call onClick when disabled', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick} disabled>Click Me</Button>);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });
});
```

### Running Component Tests

```bash
# Run component tests
pnpm test Button

# Run all tests in watch mode
pnpm test
```

---

## 🔨 Testing Utilities {#testing-utilities}

### Testing Our Search Function

From `src/lib/utils/__tests__/search-index.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { buildSearchIndex, searchIndex } from '../search-index';
import { KhwaterItem } from '@/lib/types/khwater';

const mockData: Record<string, KhwaterItem[]> = {
  '1': [
    {
      titles: ['الفصل الأول'],
      texts: ['نص تجريبي للبحث'],
      ayahs: ['آية قرآنية'],
      order: ['titles', 'texts', 'ayahs']
    }
  ]
};

describe('search-index', () => {
  describe('buildSearchIndex', () => {
    it('should create search index from data', () => {
      const index = buildSearchIndex(mockData);

      expect(index).toHaveLength(1);
      expect(index[0].chapterId).toBe('1');
    });
  });

  describe('searchIndex', () => {
    it('should find matching text', () => {
      const index = buildSearchIndex(mockData);
      const results = searchIndex(index, 'تجريبي');

      expect(results).toHaveLength(1);
      expect(results[0].chapterId).toBe('1');
    });

    it('should return empty array when no matches', () => {
      const index = buildSearchIndex(mockData);
      const results = searchIndex(index, 'not found');

      expect(results).toHaveLength(0);
    });
  });
});
```

### Testing Data Services

From `src/lib/data/__tests__/elm-service.test.ts`:

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loadKhwaterData, getChapterData } from '../khwater-service';

vi.mock('@/lib/utils/search-index', () => ({
  buildSearchIndex: vi.fn(() => []),
  searchIndex: vi.fn(() => []),
}));

describe('elm-service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('loadKhwaterData', () => {
    it('should load data successfully', async () => {
      const data = await loadKhwaterData();

      expect(data).toHaveProperty('version');
      expect(data).toHaveProperty('totalLists');
      expect(data.totalLists).toBe(29);
    });

    it('should handle missing chapter', async () => {
      await expect(getChapterData('999')).rejects.toThrow('Chapter 999 not found');
    });
  });
});
```

---

## 🌐 Writing E2E Tests {#writing-e2e}

### Example: Testing Chapter Reading

```typescript
import { test, expect } from '@playwright/test';

test.describe('Chapter Reading', () => {
  test('should navigate to chapter and display content', async ({ page }) => {
    // 1. Navigate to home
    await page.goto('/home');

    // 2. Click on Chapter 1
    await page.click('a[href="/khwater/1"]');

    // 3. Check URL changed
    await expect(page).toHaveURL('/khwater/1');

    // 4. Check chapter content is visible
    await expect(page.locator('h1')).toContainText('الفصل');

    // 5. Check that content is rendered
    const content = page.locator('[data-testid="chapter-content"]');
    await expect(content).toBeVisible();

    // 6. Check for specific text
    await expect(page.locator('text=بسم الله')).toBeVisible();
  });

  test('should bookmark a chapter', async ({ page }) => {
    await page.goto('/khwater/1');

    // Find and click bookmark button
    await page.click('[data-testid="bookmark-button"]');

    // Verify it's bookmarked (button changes state)
    const bookmarkButton = page.locator('[data-testid="bookmark-button"]');
    await expect(bookmarkButton).toHaveAttribute('data-bookmarked', 'true');
  });

  test('should search for content', async ({ page }) => {
    await page.goto('/search');

    // Type in search box
    await page.fill('input[placeholder="بحث..."]', 'آية');

    // Wait for results
    await page.waitForSelector('[data-testid="search-result"]', { timeout: 3000 });

    // Check results appear
    const results = page.locator('[data-testid="search-result"]');
    await expect(results).toHaveCount(5); // or whatever number you expect
  });
});
```

### Running E2E Tests

```bash
# Run all E2E tests
pnpm exec playwright test

# Run in headed mode (see browser)
pnpm exec playwright test --headed

# Run specific test file
pnpm exec playwright test home.spec.ts

# Run in debug mode
pnpm exec playwright test --debug
```

---

## ✅ Best Practices {#best-practices}

### 1. Test Structure: Arrange-Act-Assert

```typescript
// ✅ GOOD
it('should add bookmark correctly', () => {
  // Arrange
  const mockBookmark = { id: '1', title: 'Test', content: 'Content' };

  // Act
  addBookmark(mockBookmark);

  // Assert
  const bookmarks = getBookmarks();
  expect(bookmarks).toHaveLength(1);
  expect(bookmarks[0]).toEqual(mockBookmark);
});

// ❌ BAD
it('should add bookmark correctly', () => {
  addBookmark({ id: '1', title: 'Test', content: 'Content' });
  expect(getBookmarks()).toHaveLength(1); // Hard to read
});
```

### 2. Test Names Should Be Descriptive

```typescript
// ✅ GOOD
it('should return empty array when no bookmarks exist', () => { ... });

it('should call onClick handler when button is clicked', () => { ... });

// ❌ BAD
it('test bookmark', () => { ... });

it('test button', () => { ... });
```

### 3. One Thing Per Test

```typescript
// ✅ GOOD
describe('addBookmark', () => {
  it('adds bookmark to array', () => { ... });
  it('saves to localStorage', () => { ... });
  it('returns the new bookmark', () => { ... });
});

// ❌ BAD
it('adds bookmark, saves to storage, and returns it', () => {
  // Testing 3 things at once - not focused!
});
```

### 4. Mock External Dependencies

```typescript
// ✅ GOOD - Mock localStorage
import { vi } from 'vitest';

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

// ✅ GOOD - Mock API calls
vi.mock('@/lib/data/khwater-service', () => ({
  loadKhwaterData: vi.fn(() => Promise.resolve(mockData)),
}));
```

### 5. Test Edge Cases

```typescript
// ✅ Test happy path AND edge cases
it('should handle empty input', () => {
  const result = searchIndex(index, '');
  expect(result).toHaveLength(0);
});

it('should handle very long search terms', () => {
  const longTerm = 'a'.repeat(1000);
  const result = searchIndex(index, longTerm);
  expect(result).toHaveLength(0);
});
```

---

## 📝 Common Patterns {#patterns}

### Testing async/await

```typescript
it('should load data asynchronously', async () => {
  const data = await loadKhwaterData();
  expect(data).toBeDefined();
  expect(data.lists).toBeDefined();
});
```

### Testing with React Hooks

```typescript
it('should update theme when toggled', () => {
  const TestComponent = () => {
    const { theme, toggleTheme } = useTheme();
    return (
      <div>
        <span data-testid="theme">{theme}</span>
        <button onClick={toggleTheme}>Toggle</button>
      </div>
    );
  };

  render(<TestComponent />);

  expect(screen.getByTestId('theme')).toHaveTextContent('light');

  fireEvent.click(screen.getByText('Toggle'));
  expect(screen.getByTestId('theme')).toHaveTextContent('dark');
});
```

### Testing Error Handling

```typescript
it('should throw error when chapter not found', async () => {
  await expect(getChapterData('999'))
    .rejects
    .toThrow('Chapter 999 not found');
});
```

### Testing with Mock Data

```typescript
const mockChapter = {
  titles: ['فصل تجريبي'],
  texts: ['نص تجريبي'],
  order: ['titles', 'texts']
};

beforeEach(() => {
  localStorage.setItem('elm-bookmarks', JSON.stringify([mockBookmark]));
});
```

---

## 🐛 Troubleshooting {#troubleshooting}

### Tests Fail After Code Change

**Problem**: You changed code and tests are failing.

**Solution**:
1. Read the error message carefully
2. Check if the test is wrong or code is wrong
3. Fix the issue
4. Re-run tests

**Example**:
```
❌ Expected 5 bookmarks, got 4
```

Check:
- Did you change the bookmark logic?
- Did you break a function?
- Is the test expectation correct?

---

### Test Hangs or Times Out

**Problem**: Test runs forever.

**Solution**:
```typescript
// Add timeout
it('should complete within 5 seconds', async () => {
  await page.waitForSelector('.content', { timeout: 5000 });
}, 10000); // Set test timeout to 10s
```

---

### localStorage is Not Available

**Problem**: Tests fail with "localStorage is not defined".

**Solution**:
```typescript
import { vi } from 'vitest';

// In your test setup or beforeEach
beforeEach(() => {
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    },
  });
});
```

---

### E2E Tests Are Slow

**Problem**: E2E tests take too long.

**Solution**:
- Test only critical paths
- Use `test.describe.only()` to run specific tests
- Use `test.skip()` to skip slow tests temporarily
- Don't test every edge case in E2E (test in unit tests instead)

---

## 🎯 Testing Checklist for New Features

When you add a new feature, follow this checklist:

### ✅ Before Writing Code
- [ ] Understand what you're building
- [ ] Know what scenarios to test

### ✅ While Writing Code
- [ ] Write unit tests for utilities
- [ ] Write component tests for UI
- [ ] Mock external dependencies

### ✅ After Writing Code
- [ ] Run all tests: `pnpm test`
- [ ] Run E2E tests: `pnpm exec playwright test`
- [ ] Check coverage: `pnpm test:coverage`
- [ ] Fix any failing tests

### ✅ Before Submitting
- [ ] All tests pass locally
- [ ] Test coverage is good (aim for 80%+)
- [ ] Tests are readable and maintainable

---

## 📚 Learning Resources

### Recommended Reading
1. [React Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
2. [Vitest Guide](https://vitest.dev/guide/)
3. [Playwright Documentation](https://playwright.dev/docs/intro)
4. [Testing Library Queries](https://testing-library.com/docs/queries/about/)

### Practice Exercises
1. Write a test for a utility function
2. Write a test for a React component
3. Write an E2E test for a user flow
4. Add tests to existing code without tests

---

## 🚀 Next Steps

Now that you understand testing basics:

1. **Run the existing tests** to see how they work
2. **Write a test** for a simple utility function
3. **Add a test** to an existing component
4. **Create an E2E test** for a new feature

### Your First Task
Try this:
1. Run the existing tests: `pnpm test`
2. Look at one test file and understand it
3. Write a test for a simple function
4. Run your test: `pnpm test your-test-file`

Remember: **Everyone starts as a beginner!** Don't be afraid to make mistakes - that's how you learn.

---

## 💬 Getting Help

If you get stuck:
1. Check the error message carefully
2. Look at similar tests in the codebase
3. Ask for help from a senior developer
4. Read the documentation
5. Google the error (but understand what you find!)

---

## 📊 Test Coverage Goals

We aim for:
- **Unit Tests**: 90%+ coverage
- **Component Tests**: 80%+ coverage
- **E2E Tests**: Cover all critical user journeys

**Current status**:
- Unit Tests: Good coverage
- Component Tests: Needs improvement
- E2E Tests: Basic coverage, can expand

---

## 🎉 Conclusion

Testing is an investment in your project's future. It:
- Catches bugs early
- Makes refactoring safe
- Serves as documentation
- Builds confidence

Start small, learn as you go, and don't be afraid to ask questions!

---

**Happy Testing! 🧪**

*Remember: The best test is the one that catches bugs before your users do.*
