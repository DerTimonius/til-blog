// Get theme data from local storage
const currentTheme = localStorage.getItem('theme');

function getPreferTheme() {
  // return theme value in local storage if it is set
  if (currentTheme) return currentTheme;

  // return user device's prefer color scheme
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

let themeValue = getPreferTheme();

function setPreference() {
  localStorage.setItem('theme', themeValue);
  reflectPreference();
}

function reflectPreference() {
  themeValue === 'dark'
    ? document.documentElement.classList.add('dark')
    : document.documentElement.classList.remove('dark');

  themeValue === 'dark'
    ? document.documentElement.setAttribute('data-theme', 'dark')
    : document.documentElement.setAttribute('data-theme', 'light');

  document.querySelector('#theme-btn')?.setAttribute('aria-label', themeValue);
  document.querySelector('#theme-btn2')?.setAttribute('aria-label', themeValue);
}

// set early so no page flashes / CSS is made aware
reflectPreference();

window.onload = () => {
  function setThemeFeature() {
    // set on load so screen readers can get the latest value on the button
    reflectPreference();

    // now this script can find and listen for clicks on the control
    document.querySelector('#theme-btn')?.addEventListener('click', () => {
      themeValue = themeValue === 'light' ? 'dark' : 'light';
      setPreference();
    });
    document.querySelector('#theme-btn2')?.addEventListener('click', () => {
      themeValue = themeValue === 'light' ? 'dark' : 'light';
      setPreference();
    });
  }

  setThemeFeature();

  // Runs on view transitions navigation
  document.addEventListener('astro:after-swap', setThemeFeature);
};

// sync with system changes
window
  .matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', ({ matches: isDark }) => {
    themeValue = isDark ? 'dark' : 'light';
    setPreference();
  });
