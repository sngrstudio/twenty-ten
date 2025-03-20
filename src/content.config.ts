import { glob } from 'astro/loaders'
import { defineCollection } from 'astro:content'
import { z } from 'astro:schema'

const basicMenuItemSchema = z.object({
  label: z.string().max(64),
  url: z.string()
})

type MenuItemSchema = z.infer<typeof basicMenuItemSchema> & {
  children?: Array<MenuItemSchema>
}

const menuItemSchema: z.ZodType<MenuItemSchema> = basicMenuItemSchema.extend({
  children: z.lazy(() => menuItemSchema.array().optional())
})

export const collections = {
  site: defineCollection({
    loader: glob({ pattern: '**/*.json', base: 'src/content/site' }),
    schema: z.object({
      title: z.string().max(64),
      description: z.string().max(160),
      menu: menuItemSchema.array().optional()
    })
  })
}
