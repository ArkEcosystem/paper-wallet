module.exports = {
    purge: {
        enabled: true,
        content: ["./src/**/*.vue"],
        defaultExtractor: (content) => {
            const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [];
            const innerMatches = content.match(/[^<>"'`\s.()]*[^<>"'`\s.():]/g) || [];

            return broadMatches.concat(innerMatches);
        },
        whitelist: ["html", "body"],
    },
    theme: {
        extend: {},
    },
    variants: {},
    plugins: [],
};
