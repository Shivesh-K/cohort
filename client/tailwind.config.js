module.exports = {
  purge: {
    enabled: !process.env.ROLLUP_WATCH,
    mode: 'all',
    content: ['./public/index.html', './src/**/*.svelte'],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    fontFamily: {
      head: ['Quicksand', 'sans-serif'],
      body: ['Montserrat', 'sans-serif'],
    }
  },
  variants: {
    extend: {
      opacity: ['disabled']
    },
  },
  plugins: [],
}
