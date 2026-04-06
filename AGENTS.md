<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:tailwindcss-v4-rules -->

# This is Tailwind CSS v4

The configuration is **CSS-first**. Forget `tailwind.config.js`.

- All theme variables, plugins, and custom utilities are defined using `@theme` blocks in your CSS files.
- Built on Lightning CSS; expect faster builds and stricter CSS compliance.
- Modern syntax only—no legacy CSS-in-JS configurations.
<!-- END:tailwindcss-v4-rules -->

<!-- BEGIN:motion-rules -->

# Use Motion (motion.dev), NOT framer-motion

We use the independent **Motion** library (motion.dev) for all animations.

- It is the performance-focused, lightweight evolution of the animation engine.
- Ensure you are using the correct imports from `motion` (core) or `motion/react` (for React components). Also make sure use "import \* as motion from "motion/react-client" " for RSC animation.
- Refer to [motion.dev](https://motion.dev) for the modern API; avoid legacy `framer-motion` patterns.
<!-- END:motion-rules -->
