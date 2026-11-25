/* eslint-disable */
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type CourseAccess =
  | 'FREE'
  | 'PREMIUM';

export type CourseStatus =
  | 'ARCHIVED'
  | 'DRAFT'
  | 'PUBLISHED';

export type StudioCoursesQueryVariables = Exact<{ [key: string]: never; }>;


export type StudioCoursesQuery = { studioCourses: Array<{ id: string, slug: string, title: string, status: CourseStatus, access: CourseAccess, lessonCount: number, enrolmentCount: number, updatedAt: string }> };


export const StudioCoursesDocument = {"__meta__":{"hash":"sha256:69de90ece93f5452287061986d578d7997a3c614f0465279d033f11b5bf58b8f"},"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"StudioCourses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studioCourses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"access"}},{"kind":"Field","name":{"kind":"Name","value":"lessonCount"}},{"kind":"Field","name":{"kind":"Name","value":"enrolmentCount"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<StudioCoursesQuery, StudioCoursesQueryVariables>;