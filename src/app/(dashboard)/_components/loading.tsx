import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div className="flex h-full min-h-[300px] items-center justify-center">
      <div className="relative">
        {/* Texto de fundo */}
        <h1 className="select-none text-6xl font-black tracking-tight text-muted-foreground/20">
          Auge
        </h1>

        {/* Texto preenchido */}
        <motion.div
          className="absolute inset-0 overflow-hidden"
          animate={{
            width: ["0%", "100%", "0%"],
          }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <h1 className="select-none text-6xl font-black tracking-tight text-primary">
            Auge
          </h1>
        </motion.div>

        {/* Brilho passando */}
        <motion.div
          className="absolute inset-y-0 w-16 bg-linear-to-r from-transparent via-white/40 to-transparent dark:via-white/20 blur-sm"
          animate={{
            x: ["-120%", "220%"],
          }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
    </div>
  );
};

export { Loading };
