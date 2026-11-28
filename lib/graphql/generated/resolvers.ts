import type { GraphQLResolveInfo } from 'graphql';
import type { StudioCourse } from '@/lib/server/courses';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Course = {
  __typename?: 'Course';
  access: CourseAccess;
  category: CourseCategory;
  description: Scalars['String']['output'];
  enrolmentCount: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  instructor: Instructor;
  language: CourseLanguage;
  lessonCount: Scalars['Int']['output'];
  level: CourseLevel;
  slug: Scalars['String']['output'];
  status: CourseStatus;
  title: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export enum CourseAccess {
  Free = 'free',
  Premium = 'premium'
}

export enum CourseCategory {
  Business = 'business',
  Design = 'design',
  Development = 'development',
  Marketing = 'marketing',
  PersonalDevelopment = 'personal-development',
  PhotoVideo = 'photo-video'
}

export type CourseDetailsInput = {
  access: CourseAccess;
  category: CourseCategory;
  description: Scalars['String']['input'];
  /** Admins only. Instructors are credited to themselves */
  instructorId?: InputMaybe<Scalars['ID']['input']>;
  language: CourseLanguage;
  level: CourseLevel;
  slug: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export enum CourseLanguage {
  Ar = 'ar',
  En = 'en'
}

export enum CourseLevel {
  Advanced = 'advanced',
  Beginner = 'beginner',
  Intermediate = 'intermediate'
}

export enum CourseStatus {
  Archived = 'archived',
  Draft = 'draft',
  Published = 'published'
}

export type Instructor = {
  __typename?: 'Instructor';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Creates a draft course */
  createCourse: Course;
  /** An instructor without an account. Admins only */
  createInstructor: Instructor;
  updateCourse: Course;
};


export type MutationCreateCourseArgs = {
  input: CourseDetailsInput;
};


export type MutationCreateInstructorArgs = {
  name: Scalars['String']['input'];
};


export type MutationUpdateCourseArgs = {
  id: Scalars['ID']['input'];
  input: CourseDetailsInput;
};

export type Query = {
  __typename?: 'Query';
  /** Everyone you can credit on a course. Admins only */
  instructors: Array<Instructor>;
  /** One course you can edit */
  studioCourse: Course;
  /** Courses you can edit: your own, or every course for an admin */
  studioCourses: Array<Course>;
};


export type QueryStudioCourseArgs = {
  id: Scalars['ID']['input'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = Record<PropertyKey, never>, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;





/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Course: ResolverTypeWrapper<StudioCourse>;
  CourseAccess: CourseAccess;
  CourseCategory: CourseCategory;
  CourseDetailsInput: CourseDetailsInput;
  CourseLanguage: CourseLanguage;
  CourseLevel: CourseLevel;
  CourseStatus: CourseStatus;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Instructor: ResolverTypeWrapper<Instructor>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean']['output'];
  Course: StudioCourse;
  CourseDetailsInput: CourseDetailsInput;
  ID: Scalars['ID']['output'];
  Instructor: Instructor;
  Int: Scalars['Int']['output'];
  Mutation: Record<PropertyKey, never>;
  Query: Record<PropertyKey, never>;
  String: Scalars['String']['output'];
};

export type CourseResolvers<ContextType = any, ParentType extends ResolversParentTypes['Course'] = ResolversParentTypes['Course']> = {
  access?: Resolver<ResolversTypes['CourseAccess'], ParentType, ContextType>;
  category?: Resolver<ResolversTypes['CourseCategory'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  enrolmentCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  instructor?: Resolver<ResolversTypes['Instructor'], ParentType, ContextType>;
  language?: Resolver<ResolversTypes['CourseLanguage'], ParentType, ContextType>;
  lessonCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  level?: Resolver<ResolversTypes['CourseLevel'], ParentType, ContextType>;
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['CourseStatus'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type CourseAccessResolvers = { FREE: 'free', PREMIUM: 'premium' };

export type CourseCategoryResolvers = { BUSINESS: 'business', DESIGN: 'design', DEVELOPMENT: 'development', MARKETING: 'marketing', PERSONAL_DEVELOPMENT: 'personal-development', PHOTO_VIDEO: 'photo-video' };

export type CourseLanguageResolvers = { AR: 'ar', EN: 'en' };

export type CourseLevelResolvers = { ADVANCED: 'advanced', BEGINNER: 'beginner', INTERMEDIATE: 'intermediate' };

export type CourseStatusResolvers = { ARCHIVED: 'archived', DRAFT: 'draft', PUBLISHED: 'published' };

export type InstructorResolvers<ContextType = any, ParentType extends ResolversParentTypes['Instructor'] = ResolversParentTypes['Instructor']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createCourse?: Resolver<ResolversTypes['Course'], ParentType, ContextType, RequireFields<MutationCreateCourseArgs, 'input'>>;
  createInstructor?: Resolver<ResolversTypes['Instructor'], ParentType, ContextType, RequireFields<MutationCreateInstructorArgs, 'name'>>;
  updateCourse?: Resolver<ResolversTypes['Course'], ParentType, ContextType, RequireFields<MutationUpdateCourseArgs, 'id' | 'input'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  instructors?: Resolver<Array<ResolversTypes['Instructor']>, ParentType, ContextType>;
  studioCourse?: Resolver<ResolversTypes['Course'], ParentType, ContextType, RequireFields<QueryStudioCourseArgs, 'id'>>;
  studioCourses?: Resolver<Array<ResolversTypes['Course']>, ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Course?: CourseResolvers<ContextType>;
  CourseAccess?: CourseAccessResolvers;
  CourseCategory?: CourseCategoryResolvers;
  CourseLanguage?: CourseLanguageResolvers;
  CourseLevel?: CourseLevelResolvers;
  CourseStatus?: CourseStatusResolvers;
  Instructor?: InstructorResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
};

