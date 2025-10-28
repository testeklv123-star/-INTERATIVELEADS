import { z } from 'zod';

export const ThemeSchema = z.object({
  colors: z.object({
    primary: z.string().min(1),
    secondary: z.string().min(1),
    accent: z.string().optional(),
    background: z.string().optional(),
    text: z.string().optional(),
  }),
  logos: z.object({
    main: z.string().url(),
    secondary: z.string().url().optional(),
  }),
});

export const FormFieldSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  type: z.enum(['text', 'email', 'phone', 'select']),
  required: z.boolean().default(false),
  placeholder: z.string().optional(),
  options: z.array(z.string().min(1)).optional(),
});

export const FormSettingsSchema = z.object({
  fields: z.array(FormFieldSchema).nonempty(),
});

export const TenantConfigBaseSchema = z.object({
  tenantId: z.string().min(1),
  displayName: z.string().min(1),
  theme: ThemeSchema,
  formSettings: FormSettingsSchema,
});

export const TenantConfigCreateSchema = TenantConfigBaseSchema;

export const TenantConfigUpdateSchema = TenantConfigBaseSchema.partial({
  theme: true,
  formSettings: true,
  displayName: true,
});

export type TenantConfig = z.infer<typeof TenantConfigBaseSchema>;
export type TenantConfigCreateInput = z.infer<typeof TenantConfigCreateSchema>;
export type TenantConfigUpdateInput = z.infer<typeof TenantConfigUpdateSchema>;
