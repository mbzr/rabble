export const ensureAuthenticated =
  (resolver: Function) =>
  async (parent: any, args: any, ctx: any, info: any) => {
    if (!ctx.user || !ctx.user.id) {
      return new Error('Unauthorized. You must be logged in to do this.')
    }

    return resolver(parent, args, ctx, info)
  }
