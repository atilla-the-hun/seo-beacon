import { motion } from "framer-motion";

export function AnimatedCounter({
  value,
  suffix = "",
  decimals = 0,
  delay = 0,
}: {
  value: number;
  suffix?: string;
  decimals?: number;
  delay?: number;
}) {
  const formatted = value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <motion.span
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: "easeOut" }}
    >
      {formatted}
      {suffix}
    </motion.span>
  );
}
