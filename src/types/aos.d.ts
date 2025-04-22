/**
 * Type definitions for AOS (Animate On Scroll) library
 * Based on version 3.0.7
 */

/**
 * Configuration options for AOS
 */
export interface AosConfig {
  /**
   * Offset (in px) from the original trigger point
   */
  offset?: number;
  
  /**
   * Delay (in ms) from the original trigger point
   */
  delay?: number;
  
  /**
   * Duration (in ms) of the animation
   */
  duration?: number;
  
  /**
   * Easing function for the animation
   */
  easing?: string;
  
  /**
   * Whether animation should happen only once - while scrolling down
   */
  once?: boolean;
  
  /**
   * Whether elements should animate out while scrolling past them
   */
  mirror?: boolean;
  
  /**
   * Defines which position of the element regarding to window should trigger the animation
   */
  anchorPlacement?: string;
  
  /**
   * Whether to disable animations on mobile devices
   */
  disable?: boolean;
  
  /**
   * Whether to disable animations when user prefers reduced motion
   */
  disableReducedMotion?: boolean;
}

/**
 * AOS instance methods
 */
export interface AOSInstance {
  /**
   * Initialize AOS with configuration
   */
  init(config?: AosConfig): void;
  
  /**
   * Refresh AOS to recalculate positions of elements
   */
  refresh(): void;
  
  /**
   * Refresh AOS to recalculate positions of elements on window resize
   */
  refreshHard(): void;
}

/**
 * Extend Window interface to include AOS
 */
declare global {
  interface Window {
    AOS: AOSInstance;
  }
} 