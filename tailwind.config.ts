import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				trust: {
					DEFAULT: 'hsl(var(--trust))',
					foreground: 'hsl(var(--trust-foreground))'
				},
				watch: {
					DEFAULT: 'hsl(var(--watch))',
					foreground: 'hsl(var(--watch-foreground))'
				},
				vote: {
					DEFAULT: 'hsl(var(--vote))',
					foreground: 'hsl(var(--vote-foreground))'
				},
				zooz: {
					DEFAULT: 'hsl(var(--zooz))',
					foreground: 'hsl(var(--zooz-foreground))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'slide-up-out': {
					'0%': {
						opacity: '1',
						transform: 'translateY(0px)'
					},
					'100%': {
						opacity: '0',
						transform: 'translateY(-20px)'
					}
				},
				'slide-down-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0px)'
					}
				},
				'slide-up-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(-20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0px)'
					}
				},
				'slide-down-out': {
					'0%': {
						opacity: '1',
						transform: 'translateY(0px)'
					},
					'100%': {
						opacity: '0',
						transform: 'translateY(20px)'
					}
				},
				'like-bounce': {
					'0%': { transform: 'scale(1)' },
					'15%': { transform: 'scale(1.1)' },
					'30%': { transform: 'scale(1.25)' },
					'50%': { transform: 'scale(1.3)' },
					'70%': { transform: 'scale(1.1)' },
					'100%': { transform: 'scale(1)' }
				},
				'sparkle-1': {
					'0%': { 
						opacity: '0', 
						transform: 'translate(-8px, -8px) scale(0) rotate(0deg)' 
					},
					'20%': { 
						opacity: '1', 
						transform: 'translate(-8px, -8px) scale(1) rotate(90deg)' 
					},
					'100%': { 
						opacity: '0', 
						transform: 'translate(-12px, -12px) scale(0) rotate(180deg)' 
					}
				},
				'sparkle-2': {
					'0%': { 
						opacity: '0', 
						transform: 'translate(8px, -8px) scale(0) rotate(0deg)' 
					},
					'25%': { 
						opacity: '1', 
						transform: 'translate(8px, -8px) scale(1) rotate(90deg)' 
					},
					'100%': { 
						opacity: '0', 
						transform: 'translate(12px, -12px) scale(0) rotate(180deg)' 
					}
				},
				'sparkle-3': {
					'0%': { 
						opacity: '0', 
						transform: 'translate(-8px, 8px) scale(0) rotate(0deg)' 
					},
					'30%': { 
						opacity: '1', 
						transform: 'translate(-8px, 8px) scale(1) rotate(90deg)' 
					},
					'100%': { 
						opacity: '0', 
						transform: 'translate(-12px, 12px) scale(0) rotate(180deg)' 
					}
				},
				'sparkle-4': {
					'0%': { 
						opacity: '0', 
						transform: 'translate(8px, 8px) scale(0) rotate(0deg)' 
					},
					'35%': { 
						opacity: '1', 
						transform: 'translate(8px, 8px) scale(1) rotate(90deg)' 
					},
					'100%': { 
						opacity: '0', 
						transform: 'translate(12px, 12px) scale(0) rotate(180deg)' 
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'slide-up-out': 'slide-up-out 0.3s ease-out',
				'slide-down-in': 'slide-down-in 0.3s ease-out',
				'slide-up-in': 'slide-up-in 0.3s ease-out',
				'slide-down-out': 'slide-down-out 0.3s ease-out',
				'like-bounce': 'like-bounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
				'sparkle-1': 'sparkle-1 0.5s ease-out',
				'sparkle-2': 'sparkle-2 0.5s ease-out 0.1s',
				'sparkle-3': 'sparkle-3 0.5s ease-out 0.2s',
				'sparkle-4': 'sparkle-4 0.5s ease-out 0.3s'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
