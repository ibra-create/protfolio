/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./smart_house.html"],
  theme: {
      extend: {
          fontFamily: {
              sans: ['Inter', 'sans-serif'],
              display: ['Space Grotesk', 'sans-serif'],
          },
          colors: {
              bgDark: '#050816',
              cardDark: '#101827',
              cyan: {
                  DEFAULT: '#00E5FF',
                  glow: 'rgba(0, 229, 255, 0.5)'
              },
              orange: {
                  DEFAULT: '#FFB800',
                  glow: 'rgba(255, 184, 0, 0.5)'
              },
              success: '#22C55E',
          },
          backgroundImage: {
              'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
          }
      }
  },
  plugins: [],
}
