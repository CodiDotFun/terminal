
import type { Config } from "tailwindcss";

export default {
	darkMode: 'class',
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
				codi: {
					DEFAULT: '#97ff5f',
					50: '#f0fff4',
					100: '#dcfce7',
					200: '#bbf7d0',
					300: '#86efac',
					400: '#4ade80',
					500: '#97ff5f',
					600: '#16a34a',
					700: '#15803d',
					800: '#166534',
					900: '#14532d',
				}
			},
			fontFamily: {
				'mono': ['JetBrains Mono', 'Space Mono', 'Courier New', 'monospace'],
				'cyber': ['Orbitron', 'JetBrains Mono', 'monospace'],
				'code': ['JetBrains Mono', 'monospace'],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'textPulse': {
					'0%, 100%': { 
						textShadow: '0 0 5px rgba(151, 255, 95, 0.8), 0 0 10px rgba(151, 255, 95, 0.6), 0 0 15px rgba(151, 255, 95, 0.4)'
					},
					'50%': { 
						textShadow: '0 0 8px rgba(151, 255, 95, 1), 0 0 16px rgba(151, 255, 95, 0.8), 0 0 24px rgba(151, 255, 95, 0.6)'
					}
				},
				'cursorBlink': {
					'0%, 50%': { opacity: '1' },
					'51%, 100%': { opacity: '0' }
				},
				'backgroundShift': {
					'0%, 100%': { 
						backgroundPosition: '0 0, 0% 0%, 100% 100%, 0% 100%, center'
					},
					'25%': { 
						backgroundPosition: '25px 25px, 10% 20%, 90% 80%, 20% 80%, center'
					},
					'50%': { 
						backgroundPosition: '0 50px, 20% 40%, 80% 60%, 40% 60%, center'
					},
					'75%': { 
						backgroundPosition: '25px 75px, 30% 60%, 70% 40%, 60% 40%, center'
					}
				},
				'contentReveal': {
					'0%': { 
						opacity: '0', 
						transform: 'translateY(20px) scale(0.95)' 
					},
					'100%': { 
						opacity: '1', 
						transform: 'translateY(0) scale(1)' 
					}
				},
				'float': {
					'0%, 100%': { 
						transform: 'translateY(0px) rotate(0deg)' 
					},
					'33%': { 
						transform: 'translateY(-10px) rotate(1deg)' 
					},
					'66%': { 
						transform: 'translateY(5px) rotate(-1deg)' 
					}
				},
				'slideInFromLeft': {
					'0%': { 
						opacity: '0', 
						transform: 'translateX(-100px)' 
					},
					'100%': { 
						opacity: '1', 
						transform: 'translateX(0)' 
					}
				},
				'slideInFromRight': {
					'0%': { 
						opacity: '0', 
						transform: 'translateX(100px)' 
					},
					'100%': { 
						opacity: '1', 
						transform: 'translateX(0)' 
					}
				},
				'scaleIn': {
					'0%': { 
						opacity: '0', 
						transform: 'scale(0.8)' 
					},
					'100%': { 
						opacity: '1', 
						transform: 'scale(1)' 
					}
				},
				'glow': {
					'0%, 100%': { 
						boxShadow: '0 0 5px rgba(151, 255, 95, 0.4)' 
					},
					'50%': { 
						boxShadow: '0 0 20px rgba(151, 255, 95, 0.8), 0 0 30px rgba(151, 255, 95, 0.4)' 
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'text-pulse': 'textPulse 3s ease-in-out infinite',
				'cursor-blink': 'cursorBlink 2s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite',
				'background-shift': 'backgroundShift 20s ease-in-out infinite',
				'content-reveal': 'contentReveal 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards',
				'float': 'float 6s ease-in-out infinite',
				'slide-in-left': 'slideInFromLeft 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
				'slide-in-right': 'slideInFromRight 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
				'scale-in': 'scaleIn 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
				'glow': 'glow 2s ease-in-out infinite'
			},
			backdropBlur: {
				'xs': '2px',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
