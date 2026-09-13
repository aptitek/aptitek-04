export default {
  '*.{js,mjs,cjs,jsx,ts,tsx}': (filenames) => {
    const files = filenames.filter((f) => !f.includes('.agents/'));
    return files.length
      ? [
          `eslint --fix --cache --cache-location node_modules/.cache/eslint/ --max-warnings=0 ${files.join(' ')}`,
          `prettier --write --cache ${files.join(' ')}`,
        ]
      : [];
  },
  '*.astro': (filenames) => {
    const files = filenames.filter((f) => !f.includes('.agents/'));
    return files.length
      ? [
          `eslint --fix --cache --cache-location node_modules/.cache/eslint/ --max-warnings=0 ${files.join(' ')}`,
          `prettier --write --cache ${files.join(' ')}`,
        ]
      : [];
  },
  '*.css': (filenames) => {
    const files = filenames.filter((f) => !f.includes('.agents/'));
    return files.length ? [`prettier --write --cache ${files.join(' ')}`] : [];
  },
  '*.md': (filenames) => {
    const files = filenames.filter((f) => !f.includes('.agents/'));
    return files.length
      ? [
          `markdownlint-cli2 --fix ${files.join(' ')}`,
          `prettier --write --cache ${files.join(' ')}`,
        ]
      : [];
  },
  '*.mdx': (filenames) => {
    const files = filenames.filter((f) => !f.includes('.agents/'));
    return files.length
      ? [
          `node scripts/lint-mdx-purity.mjs ${files.join(' ')}`,
          `prettier --write --cache ${files.join(' ')}`,
        ]
      : [];
  },
  '*.{json,yml,yaml}': (filenames) => {
    const files = filenames.filter((f) => !f.includes('.agents/') && !f.includes('map-style'));
    return files.length ? [`prettier --write --cache ${files.join(' ')}`] : [];
  },
};
