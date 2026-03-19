/**
 * Theme Switcher for IBM Event Automation Documentation
 * Supports Light and Dark modes
 */

(function() {
  'use strict';

  const THEME_KEY = 'ibm-docs-theme';
  const THEMES = {
    LIGHT: 'light',
    DARK: 'dark'
  };

  class ThemeSwitcher {
    constructor() {
      this.currentTheme = this.getStoredTheme() || THEMES.LIGHT;
      this.init();
    }

    init() {
      // Apply theme immediately to prevent flash
      this.applyTheme(this.currentTheme);

      // Wait for DOM to be ready before setting up UI
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.setupUI());
      } else {
        this.setupUI();
      }
    }

    getStoredTheme() {
      try {
        return localStorage.getItem(THEME_KEY);
      } catch (e) {
        return null;
      }
    }

    setStoredTheme(theme) {
      try {
        localStorage.setItem(THEME_KEY, theme);
      } catch (e) {
        console.warn('Unable to save theme preference:', e);
      }
    }

    applyTheme(theme) {
      const html = document.documentElement;
      
      // Remove existing theme classes
      html.classList.remove('theme-light', 'theme-dark');
      
      // Add new theme class
      html.classList.add(`theme-${theme}`);
      
      // Set data attribute for CSS targeting
      html.setAttribute('data-theme', theme);
    }

    setTheme(theme) {
      this.currentTheme = theme;
      this.setStoredTheme(theme);
      this.applyTheme(theme);
      this.updateUI();
    }

    toggleTheme() {
      const newTheme = this.currentTheme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
      this.setTheme(newTheme);
    }

    setupUI() {
      const button = document.getElementById('theme-toggle');
      if (!button) return;

      button.addEventListener('click', () => this.toggleTheme());
      this.updateUI();
    }

    updateUI() {
      const button = document.getElementById('theme-toggle');
      if (!button) return;

      const icons = {
        light: button.querySelector('.theme-icon-light'),
        dark: button.querySelector('.theme-icon-dark')
      };

      // Hide all icons
      Object.values(icons).forEach(icon => {
        if (icon) icon.style.display = 'none';
      });

      // Show current icon (opposite of current theme - shows what it will switch TO)
      const iconToShow = this.currentTheme === THEMES.LIGHT ? icons.dark : icons.light;
      if (iconToShow) {
        iconToShow.style.display = 'block';
      }

      // Update aria-label
      const label = this.currentTheme === THEMES.LIGHT ? 'Switch to dark mode' : 'Switch to light mode';
      button.setAttribute('aria-label', label);
      button.setAttribute('title', label);
    }
  }

  // Initialize theme switcher
  window.themeSwitcher = new ThemeSwitcher();
})();