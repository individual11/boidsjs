import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
    build: {
        lib: {
            entry: {
                index: resolve(__dirname, 'src/index.ts'),
                react: resolve(__dirname, 'src/react/index.tsx'),
            },
            formats: ['es', 'cjs'],
            fileName: (format, entryName) => {
                const ext = format === 'es' ? 'mjs' : 'js';
                if (entryName === 'react') {
                    return `react/index.${ext}`;
                }
                return `boidsjs.${ext}`;
            },
        },
        rollupOptions: {
            external: [/^(react|react-dom)(\/.*)?$/],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                },
            },
        },
    },
    plugins: [
        dts({
            insertTypesEntry: true,
            include: ['src'],
        }),
    ],
});
