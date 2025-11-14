'use client';

// Reusable skeleton components following DRY principle
// Eliminates duplication across loading states

// =============================================================================
// BASE SKELETON COMPONENT
// =============================================================================

export interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: boolean | string;
}

// Base skeleton element with customizable dimensions
export function Skeleton({
  className: classNameProp = '',
  width: widthProp,
  height: heightProp,
  rounded: roundedProp = false,
}: {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: boolean | string;
}) {
  const className = classNameProp;
  const width = widthProp;
  const height = heightProp;
  const rounded = roundedProp;
  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  const roundedClass = rounded === 'full'
    ? 'rounded-full'
    : rounded
      ? 'rounded-lg'
      : '';

  return (
    <div
      className={`bg-gray-300 dark:bg-gray-700 animate-pulse ${roundedClass} ${className}`}
      style={style}
    />
  );
}

// =============================================================================
// TEXT SKELETON COMPONENTS
// =============================================================================

export interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

// Text line skeleton
export function SkeletonText({
  lines = 1,
  className = '',
}: SkeletonTextProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height={16}
          width={`${100 - i * 10}%`}
          rounded
        />
      ))}
    </div>
  );
}

export interface SkeletonTitleProps {
  className?: string;
  width?: string | number;
}

// Title skeleton (larger text)
export function SkeletonTitle({
  className = '',
  width = '60%',
}: SkeletonTitleProps) {
  return (
    <Skeleton
      height={40}
      width={width}
      rounded
      className={className}
    />
  );
}

// =============================================================================
// CARD SKELETON COMPONENTS
// =============================================================================

export interface SkeletonCardProps {}

// Card skeleton for chapter cards
export function SkeletonCard(_props: SkeletonCardProps = {}) {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <Skeleton width={40} height={40} rounded="full" />
        <Skeleton width={32} height={32} rounded="full" />
      </div>
      <div className="space-y-2">
        <Skeleton height={24} rounded />
        <Skeleton height={16} width="50%" rounded />
      </div>
    </div>
  );
}

export interface SkeletonSearchResultProps {}

// Search result skeleton
export function SkeletonSearchResult(_props: SkeletonSearchResultProps = {}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <Skeleton width="25%" height={24} rounded />
        <Skeleton width="33%" height={24} rounded />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, j) => (
          <div key={j} className="pb-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
            <Skeleton height={20} width="75%" rounded className="mb-2" />
            <SkeletonText lines={2} />
          </div>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// CONTENT SKELETON COMPONENTS
// =============================================================================

export interface SkeletonContentItemProps {}

// Content item skeleton (for chapter content)
export function SkeletonContentItem(_props: SkeletonContentItemProps = {}) {
  return (
    <div className="space-y-4">
      <Skeleton height={32} width="75%" rounded />
      <SkeletonText lines={2} />
      <Skeleton height={20} width="50%" rounded />
    </div>
  );
}

// =============================================================================
// PROGRESS SKELETON COMPONENTS
// =============================================================================

export interface SkeletonProgressProps {
  showLabel?: boolean;
  labelWidth?: string;
}

// Progress bar skeleton
export function SkeletonProgress({
  showLabel = false,
  labelWidth = '25%',
}: SkeletonProgressProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        {showLabel && <Skeleton width={labelWidth} height={20} rounded />}
        <Skeleton width={96} height={40} rounded />
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div className="bg-gray-300 dark:bg-gray-600 h-2 rounded-full animate-pulse" style={{ width: '50%' }} />
      </div>
    </div>
  );
}

// =============================================================================
// NAVIGATION SKELETON COMPONENTS
// =============================================================================

export interface SkeletonNavigationProps {}

// Navigation skeleton
export function SkeletonNavigation(_props: SkeletonNavigationProps = {}) {
  return (
    <div className="flex justify-between items-center mt-12">
      <Skeleton width={192} height={48} rounded />
      <Skeleton width={192} height={48} rounded />
    </div>
  );
}

// =============================================================================
// BUTTON SKELETON COMPONENTS
// =============================================================================

export interface SkeletonButtonProps {
  width?: number;
  height?: number;
}

// Button skeleton
export function SkeletonButton({
  width = 192,
  height = 48,
}: SkeletonButtonProps) {
  return <Skeleton width={width} height={height} rounded />;
}

// =============================================================================
// GRID SKELETON COMPONENTS
// =============================================================================

export interface SkeletonGridProps {
  count?: number;
  className?: string;
}

// Grid of skeleton cards
export function SkeletonGrid({
  count = 12,
  className = '',
}: SkeletonGridProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

// =============================================================================
// SEARCH SKELETON COMPONENTS
// =============================================================================

export interface SkeletonSearchInputProps {}

// Search input skeleton
export function SkeletonSearchInput(_props: SkeletonSearchInputProps = {}) {
  return (
    <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse" />
  );
}

// =============================================================================
// HERO SKELETON COMPONENTS
// =============================================================================

export interface SkeletonHeroProps {
  showButton?: boolean;
}

// Hero section skeleton
export function SkeletonHero({
  showButton = true,
}: SkeletonHeroProps) {
  return (
    <section className="text-center mb-16">
      <div className="mb-8 animate-pulse">
        <SkeletonTitle className="mb-6 mx-auto" width="75%" />
        <Skeleton height={32} width="50%" rounded className="mb-4 mx-auto" />
        <Skeleton height={24} width="33%" rounded className="mx-auto" />
      </div>

      {showButton && (
        <div className="flex justify-center">
          <SkeletonButton width={192} />
        </div>
      )}
    </section>
  );
}

// =============================================================================
// SECTION SKELETON COMPONENTS
// =============================================================================

export interface SkeletonSectionTitleProps {
  width?: string;
}

// Section title skeleton
export function SkeletonSectionTitle({
  width = '25%',
}: SkeletonSectionTitleProps) {
  return (
    <h2 className="text-2xl font-bold mb-8 text-center">
      <Skeleton height={40} width={width} rounded className="mx-auto" />
    </h2>
  );
}
