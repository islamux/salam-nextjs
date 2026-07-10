'use client';

export interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: boolean | 'full' | string;
}

export function Skeleton({
  className: classNameProp = '',
  width: widthProp,
  height: heightProp,
  rounded: roundedProp = false,
}: SkeletonProps) {
  const style = {
    width: typeof widthProp === 'number' ? `${widthProp}px` : widthProp,
    height: typeof heightProp === 'number' ? `${heightProp}px` : heightProp,
  };

  const roundedClass = roundedProp === 'full'
    ? 'rounded-full'
    : roundedProp
      ? 'rounded-lg'
      : '';

  return (
    <div
      className={`relative overflow-hidden bg-gray-200 dark:bg-gray-800 ${roundedClass} ${classNameProp}`}
      style={style}
    >
      <div className="absolute inset-0 skeleton-shimmer" />
    </div>
  );
}

export interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

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

export type SkeletonCardProps = object;

export function SkeletonCard() {
  return (
    <div className="p-5 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
      <div className="flex items-center justify-between mb-3">
        <Skeleton width={36} height={36} rounded="full" />
        <Skeleton width={28} height={28} rounded="full" />
      </div>
      <div className="space-y-2">
        <Skeleton height={20} width="70%" rounded />
        <Skeleton height={14} width="50%" rounded />
      </div>
    </div>
  );
}

export type SkeletonSearchResultProps = object;

export function SkeletonSearchResult() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700">
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

export type SkeletonContentItemProps = object;

export function SkeletonContentItem() {
  return (
    <div className="space-y-4">
      <Skeleton height={32} width="75%" rounded />
      <SkeletonText lines={2} />
      <Skeleton height={20} width="50%" rounded />
    </div>
  );
}

export interface SkeletonProgressProps {
  showLabel?: boolean;
  labelWidth?: string;
}

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
      <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
        <div className="relative h-2 w-1/2 overflow-hidden">
          <div className="absolute inset-0 skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
}

export type SkeletonNavigationProps = object;

export function SkeletonNavigation() {
  return (
    <div className="flex justify-between items-center mt-12">
      <Skeleton width={192} height={48} rounded />
      <Skeleton width={192} height={48} rounded />
    </div>
  );
}

export interface SkeletonButtonProps {
  width?: number;
  height?: number;
}

export function SkeletonButton({
  width = 192,
  height = 48,
}: SkeletonButtonProps) {
  return <Skeleton width={width} height={height} rounded />;
}

export interface SkeletonGridProps {
  count?: number;
  className?: string;
}

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

export type SkeletonSearchInputProps = object;

export function SkeletonSearchInput() {
  return (
    <div className="h-12 relative overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-800">
      <div className="absolute inset-0 skeleton-shimmer" />
    </div>
  );
}

export interface SkeletonHeroProps {
  showButton?: boolean;
}

export function SkeletonHero({
  showButton = true,
}: SkeletonHeroProps) {
  return (
    <section className="text-center mb-16">
      <div className="mb-8">
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

export interface SkeletonSectionTitleProps {
  width?: string;
}

export function SkeletonSectionTitle({
  width = '25%',
}: SkeletonSectionTitleProps) {
  return (
    <h2 className="text-2xl font-bold mb-8 text-center">
      <div className="mx-auto relative overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-800" style={{ width, height: 40 }}>
        <div className="absolute inset-0 skeleton-shimmer" />
      </div>
    </h2>
  );
}
