/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: 'hsl(var(--card))',
        'card-foreground': 'hsl(var(--card-foreground))',
        primary: 'hsl(var(--primary))',
        'primary-foreground': 'hsl(var(--primary-foreground))',
        secondary: 'hsl(var(--secondary))',
        'secondary-foreground': 'hsl(var(--secondary-foreground))',
        accent: 'hsl(var(--accent))',
        'accent-foreground': 'hsl(var(--accent-foreground))',
        cta: 'hsl(var(--cta))',
        'cta-foreground': 'hsl(var(--cta-foreground))',
        muted: 'hsl(var(--muted))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        'text-primary': 'hsl(var(--text-primary))',
        'text-light': 'hsl(var(--text-light))',
        border: 'hsl(var(--border))',
        'border-accent': 'hsl(var(--border-accent))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      fontFamily: {
        manrope: ['var(--font-manrope)', 'sans-serif'],
        poppins: ['var(--font-poppins)', 'sans-serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
        dancing: ['Dancing Script', 'cursive'],
      },
      borderRadius: {
        'radius': 'var(--radius)',
      },
    },
  },
  plugins: [],
}
