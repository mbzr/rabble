import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: './lib/graphql/type-defs.ts',
  documents: ['app/**/*.{ts,tsx}', 'components/**/*.{ts,tsx}'],
  ignoreNoDocuments: true,
  generates: {
    // Server: resolver types, with Course mapped to what the service returns
    './lib/graphql/generated/resolvers.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        useTypeImports: true,
        mappers: { Course: '@/lib/server/courses#StudioCourse' },
        enumValues: {
          CourseStatus: {
            DRAFT: 'draft',
            PUBLISHED: 'published',
            ARCHIVED: 'archived',
          },
          CourseAccess: { FREE: 'free', PREMIUM: 'premium' },
        },
      },
    },
    // Client: typed documents, fragment masking and the persisted manifest
    './lib/graphql/generated/client/': {
      preset: 'client',
      presetConfig: { persistedDocuments: true },
      config: { useTypeImports: true, enumsAsTypes: true },
    },
  },
}

export default config
