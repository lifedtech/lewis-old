import { motion } from 'framer-motion'

/**
 * PageTransition
 * 
 * Provides 60fps liquid-smooth page, card, and text transitions across LEWIS screens.
 * Uses high-perceptual responsiveness ease curve [0.16, 1, 0.3, 1] for instant feel.
 */
export const pageVariants = {
  initial: {
    opacity: 0,
    y: 12,
    scale: 0.99
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1]
    }
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.99,
    transition: {
      duration: 0.16,
      ease: [0.4, 0, 1, 1]
    }
  }
}

export const cardContainerVariants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.02
    }
  }
}

export const cardItemVariants = {
  initial: {
    opacity: 0,
    y: 10,
    scale: 0.98
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.28,
      ease: [0.16, 1, 0.3, 1]
    }
  }
}

export const textVariants = {
  initial: {
    opacity: 0,
    y: 8
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: [0.16, 1, 0.3, 1]
    }
  }
}

export default function PageTransition({ children, className = 'screen-container', style = {} }) {
  return (
    <motion.div
      className={className}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ width: '100%', height: '100%', ...style }}
    >
      {children}
    </motion.div>
  )
}
