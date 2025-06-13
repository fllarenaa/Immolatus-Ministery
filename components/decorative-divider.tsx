import styles from "./decorative-divider.module.css"

interface DecorativeDividerProps {
  variant?: "small" | "medium" | "large"
}

export function DecorativeDivider({ variant = "large" }: DecorativeDividerProps) {
  return (
    <div className={`${styles.divider} ${styles[variant]}`}>
      {variant === "small" && (
        <>
          <div className={styles.line}></div>
          <div className={styles.icon}>✦</div>
          <div className={styles.line}></div>
        </>
      )}

      {variant === "medium" && (
        <>
          <div className={styles.line}></div>
          <div className={styles.icon}>✧ ✦ ✧</div>
          <div className={styles.line}></div>
        </>
      )}

      {variant === "large" && (
        <div className={styles.largeContainer}>
          <div className={styles.largeLine}>
            <div className={styles.largeBorder}></div>
          </div>
          <div className={styles.largeIcon}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={styles.iconSvg}
            >
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path d="M12 6V18" stroke="currentColor" strokeWidth="1.5" />
              <path d="M6 12H18" stroke="currentColor" strokeWidth="1.5" />
              <path d="M7.75736 7.75736L16.2426 16.2426" stroke="currentColor" strokeWidth="1.5" />
              <path d="M7.75736 16.2426L16.2426 7.75736" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      )}
    </div>
  )
}
