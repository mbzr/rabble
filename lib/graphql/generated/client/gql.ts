/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  fragment StudioCourseRow on Course {\n    id\n    title\n    status\n    access\n    lessonCount\n    enrolmentCount\n    updatedAt\n  }\n": typeof types.StudioCourseRowFragmentDoc,
    "\n  query StudioCourses {\n    studioCourses {\n      id\n      ...StudioCourseRow\n    }\n  }\n": typeof types.StudioCoursesDocument,
};
const documents: Documents = {
    "\n  fragment StudioCourseRow on Course {\n    id\n    title\n    status\n    access\n    lessonCount\n    enrolmentCount\n    updatedAt\n  }\n": types.StudioCourseRowFragmentDoc,
    "\n  query StudioCourses {\n    studioCourses {\n      id\n      ...StudioCourseRow\n    }\n  }\n": types.StudioCoursesDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment StudioCourseRow on Course {\n    id\n    title\n    status\n    access\n    lessonCount\n    enrolmentCount\n    updatedAt\n  }\n"): (typeof documents)["\n  fragment StudioCourseRow on Course {\n    id\n    title\n    status\n    access\n    lessonCount\n    enrolmentCount\n    updatedAt\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query StudioCourses {\n    studioCourses {\n      id\n      ...StudioCourseRow\n    }\n  }\n"): (typeof documents)["\n  query StudioCourses {\n    studioCourses {\n      id\n      ...StudioCourseRow\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;