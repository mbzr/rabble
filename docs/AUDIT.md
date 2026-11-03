# Auditing v1

I built the first version of Rabble in 2022 while I was learning Next.js. Before rebuilding it from scratch, I went through the old code properly and wrote down everything that was wrong with it, so the new version doesn't repeat any of it. There are 19 items, and a few of them are serious.

The old code is tagged [`v1`](https://github.com/mbzr/rabble/tree/v1), and each item links to the file where the problem is. The app isn't deployed anymore and no keys were ever committed to the repo, but I revoked the old Vimeo token and rotated the AWS keys anyway.

The old code isn't patched. Each item became a requirement for v2 and has a test in the new code, so the same problem can't quietly come back. I'll link the tests here as they land.

## Critical

1. **Anyone logged in could read their own password hash through the API.** The GraphQL `User` type had a `password` field, and `currentUser` returned the whole database row. ([User.ts](https://github.com/mbzr/rabble/blob/v1/apollo/entities/User.ts), [getCurrentUser.ts](https://github.com/mbzr/rabble/blob/v1/apollo/resolvers/queries/user/getCurrentUser.ts))
   In v2, pages and resolvers only return the fields they need. The hash stays in Better Auth's account table.

2. **Sign-up sent the password hash back.** The route returned the new user row as it was. ([signup.ts](https://github.com/mbzr/rabble/blob/v1/pages/api/auth/signup.ts))
   In v2, sign-up goes through Better Auth, which returns a safe user object.

3. **Any logged-in user could edit any course or lesson.** `isCourseOwner` was still a TODO, so the edit mutations never checked who owned what. ([editCourse.ts](https://github.com/mbzr/rabble/blob/v1/apollo/resolvers/mutations/course/editCourse.ts), [editLesson.ts](https://github.com/mbzr/rabble/blob/v1/apollo/resolvers/mutations/lesson/editLesson.ts), [permissions.ts](https://github.com/mbzr/rabble/blob/v1/lib/utils/permissions.ts))
   In v2, every write checks that you own the course or you're an admin.

## High

4. **The video API routes had no auth at all.** Anyone could create folders and uploads on my Vimeo account. ([courses/index.ts](https://github.com/mbzr/rabble/blob/v1/pages/api/courses/index.ts), [create-upload.ts](https://github.com/mbzr/rabble/blob/v1/pages/api/lessons/create-upload.ts), [verify-upload.ts](https://github.com/mbzr/rabble/blob/v1/pages/api/lessons/verify-upload.ts))
   In v2, only someone who can edit the course gets an upload URL, and the server creates it.

5. **Any logged-in user could create courses.** ([createCourse.ts](https://github.com/mbzr/rabble/blob/v1/apollo/resolvers/mutations/course/createCourse.ts))
   In v2, you need the instructor or admin role.

6. **Most of the admin area wasn't protected.** The middleware only matched `/admin` itself, so `/admin/courses/...` was open to anyone. ([middleware.ts](https://github.com/mbzr/rabble/blob/v1/middleware.ts))
   In v2, every admin page and action checks the role on the server. The middleware (`proxy.ts` now) only handles redirects.

7. **Unpublished lessons were sent to the browser** and then hidden with a filter in the component. ([lessons.ts](https://github.com/mbzr/rabble/blob/v1/apollo/resolvers/queries/course/lessons.ts), [lessonView](https://github.com/mbzr/rabble/blob/v1/components/lessonView/index.tsx))
   In v2, the server leaves drafts out unless you can edit the course.

8. **Paid courses weren't really paid.** `isPremium` was never checked, and the Vimeo videos were public embeds, so anyone with a video ID could watch. ([vimeo/helpers.ts](https://github.com/mbzr/rabble/blob/v1/lib/vimeo/helpers.ts))
   In v2, the server checks your enrolment, and Mux only plays a video with a signed token.

9. **The dependencies were years out of date.** Next.js 13.0.0, Apollo Server 3 and aws-sdk v2 are all past end of life, and TypeScript was on 4.8. ([package.json](https://github.com/mbzr/rabble/blob/v1/package.json))
   In v2, everything is current and Dependabot checks weekly.

## Medium

10. **GraphQL introspection and debug mode were on in production,** along with a CORS header for Apollo Studio. ([graphql.ts](https://github.com/mbzr/rabble/blob/v1/pages/api/graphql.ts))
    In v2, the API only accepts the queries the app ships with, introspection is off and errors are masked.

11. **Login and sign-up told you which emails had accounts:** "No user found" on login, and a 409 on sign-up. ([[...nextauth].ts](https://github.com/mbzr/rabble/blob/v1/pages/api/auth/%5B...nextauth%5D.ts), [signup.ts](https://github.com/mbzr/rabble/blob/v1/pages/api/auth/signup.ts))
    In v2, a failed login gets one generic message.

12. **No password rules and no rate limiting.** The password rule was commented out. ([auth/helpers.ts](https://github.com/mbzr/rabble/blob/v1/lib/auth/helpers.ts))
    In v2, passwords need 10 characters and are checked against known leaked passwords, and sign-in, sign-up and reset are rate limited.

13. **Sessions couldn't be revoked, and banned users could still log in.** Sessions were JWTs, and `bannedAt` was never checked at login. ([[...nextauth].ts](https://github.com/mbzr/rabble/blob/v1/pages/api/auth/%5B...nextauth%5D.ts))
    In v2, sessions live in the database, and a ban signs the user out everywhere.

14. **Image uploads went through GraphQL,** and the user's file name ended up in the S3 key. ([graphql.ts](https://github.com/mbzr/rabble/blob/v1/pages/api/graphql.ts), [file-upload.ts](https://github.com/mbzr/rabble/blob/v1/lib/utils/file-upload.ts))
    In v2, the browser uploads straight to S3 with a short-lived signed form that limits file type and size, and the server picks the file name.

15. **You could change your email without verifying the new one.** ([editUser.ts](https://github.com/mbzr/rabble/blob/v1/apollo/resolvers/mutations/user/editUser.ts))
    In v2, the change only happens after you click the link sent to the new address.

16. **The database didn't enforce much.** Emails and slugs weren't unique, the join tables had no primary keys, and `date` columns dropped the time. ([init migration](https://github.com/mbzr/rabble/blob/v1/knex/migrations/20221230191601_init.ts))
    In v2, those rules are constraints in the database itself.

17. **The build ignored type and lint errors.** ([next.config.js](https://github.com/mbzr/rabble/blob/v1/next.config.js))
    In v2, CI blocks any merge with errors.

## Low

18. **The middleware printed the whole decoded session** on every `/admin` request. ([middleware.ts](https://github.com/mbzr/rabble/blob/v1/middleware.ts))
    In v2, `console.log` is a lint error.

19. **Plain bugs.** Lesson slugs were set from the lesson name, the edit mutations returned null, the lesson page had lorem ipsum and a hardcoded "3:52" duration, the delete buttons did nothing, and `/forgot` and `/courses` were empty pages. ([createLessonForm.tsx](https://github.com/mbzr/rabble/blob/v1/components/forms/createLessonForm.tsx), [lib/models](https://github.com/mbzr/rabble/tree/v1/lib/models), [lessonView](https://github.com/mbzr/rabble/blob/v1/components/lessonView/index.tsx), [forgot.tsx](https://github.com/mbzr/rabble/blob/v1/pages/forgot.tsx), [courses/index.tsx](https://github.com/mbzr/rabble/blob/v1/pages/courses/index.tsx))

## The main change

In v1 I checked permissions in a few places and trusted the rest. In v2 every check lives in one place on the server, and pages, actions, GraphQL and the API routes all go through it.
