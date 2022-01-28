const withLinaria = require('next-linaria');

/** @type {import('next').NextConfig} */
const config = {
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
};

module.exports = withLinaria(config);
