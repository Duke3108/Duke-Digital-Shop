/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    fontFamily: {
      main: ['Be Vietnam Pro', "Poppins", "sans-serif"]
    },
    extend: {
      width: {
        main: '1220px'
      },
      backgroundColor: {
        main: '#ee3131',
        overlay: 'rgba(0,0,0,0.3)'
      },
      colors: {
        main: '#ee3131'
      },
      flex: {
        '2': '2 2 0%',
        '3': '3 3 0%',
        '4': '4 4 0%',
        '5': '5 5 0%',
        '6': '6 6 0%',
        '7': '7 7 0%',
        '8': '8 8 0%',
      },
      keyframes: {
        'slide-top': {
          '0%': {
            '-webkit-transform': 'translateY(20px);',
            tranform: 'translateY(20px);'
          },
          '100%': {
            '-webkit-transform': 'translateY(0);',
            tranform: 'translateY(0);'
          }
        },
        'slide-top-sm': {
          '0%': {
            '-webkit-transform': 'translateY(8px);',
            tranform: 'translateY(8px);'
          },
          '100%': {
            '-webkit-transform': 'translateY(0);',
            tranform: 'translateY(0);'
          }
        },
        'scale-up-center': {
          '0%': {
            '-webkit-transform': 'scale(0.8);',
            transform: 'scale(0.8);'
          },
          '100%': {
            '-webkit-transform': 'scale(1);',
            transform: 'scale(1);'
          }
        }
      },
      animation: {
        'slide-top': 'slide-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;',
        'slide-top-sm': 'slide-top-sm 0.2s linear both;',
        'scale-up-center': 'scale-up-center 0.3s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;'
      }
    },
    listStyleType: {
      square: 'square',
      circle: 'circle',
      decimal: 'decimal',
      decimalLeadingZero: 'decimal-leading-zero',
      lowerAlpha: 'lower-alpha',
      upperAlpha: 'upper-alpha',
      lowerRoman: 'lower-roman',
      upperRoman: 'upper-roman'
    }
  },
  plugins: [
    "@tailwindcss/line-clamp",
    require('@tailwindcss/forms')
  ],
}