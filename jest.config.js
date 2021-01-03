module.exports = {
    preset: 'ts-jest',
    clearMocks: true,
    // verbose: true,
    transform: {
        '^.+\\.svelte$': [
            'svelte-jester',
            {
                preprocess: true
            }
        ],
        '^.+\\.ts$': 'ts-jest'
    },
    moduleFileExtensions: ['js', 'ts', 'svelte'],
    modulePathIgnorePatterns: [
        '<rootDir>/src/__tests__/static',
        '<rootDir>/src/__tests__/utils.ts'
    ]
}
