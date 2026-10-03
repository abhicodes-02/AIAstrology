import os

with open('src/components/BirthDetailsForm.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Update Schema
content = content.replace(
    'pob: z.string().min(2, { message: "Place of birth is required." }),',
    'pob: z.string().min(2, { message: "Place of birth is required." }),\n  lifeStage: z.string().min(1, { message: "Life stage is required." }),\n  relationshipStatus: z.string().min(1, { message: "Relationship status is required." }),'
)

# Update Defaults
content = content.replace(
    'pob: "",',
    'pob: "",\n      lifeStage: "student",\n      relationshipStatus: "single",'
)

# Insert JSX fields right before the Submit buttons container
# Look for: <div className="grid grid-cols-2 gap-4 pt-4 border-t border-indigo-500/20 mt-4">
target_jsx = '<div className="grid grid-cols-2 gap-4 pt-4 border-t border-indigo-500/20 mt-4">'

new_fields = """
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 pb-2">
          <FormField
            control={form.control}
            name="lifeStage"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-indigo-200 font-medium tracking-wide flex items-center gap-2">
                  Current Life Stage
                </FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="flex h-12 w-full items-center justify-between rounded-xl border border-indigo-500/30 bg-indigo-950/40 px-4 py-2 text-sm text-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="student" className="bg-slate-900">Student / Higher Education</option>
                    <option value="fresher" className="bg-slate-900">Fresher / Job Seeker</option>
                    <option value="employed" className="bg-slate-900">Working Professional</option>
                    <option value="business" className="bg-slate-900">Business / Entrepreneur</option>
                  </select>
                </FormControl>
                <FormMessage className="text-rose-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="relationshipStatus"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-indigo-200 font-medium tracking-wide flex items-center gap-2">
                  Relationship Status
                </FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="flex h-12 w-full items-center justify-between rounded-xl border border-indigo-500/30 bg-indigo-950/40 px-4 py-2 text-sm text-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="single" className="bg-slate-900">Single</option>
                    <option value="committed" className="bg-slate-900">In a Relationship</option>
                    <option value="married" className="bg-slate-900">Married</option>
                    <option value="separated" className="bg-slate-900">Divorced / Separated</option>
                  </select>
                </FormControl>
                <FormMessage className="text-rose-400" />
              </FormItem>
            )}
          />
        </div>
"""

content = content.replace(target_jsx, new_fields + "\n        " + target_jsx)

# Update the Router Push URLs in onSubmit
content = content.replace(
    'router.push(`/?name=${encodeURIComponent(values.name)}',
    'router.push(`/?name=${encodeURIComponent(values.name)}&lifeStage=${encodeURIComponent(values.lifeStage)}&relationshipStatus=${encodeURIComponent(values.relationshipStatus)}'
)
content = content.replace(
    'router.push(`/kp-kundli?name=${encodeURIComponent(values.name)}',
    'router.push(`/kp-kundli?name=${encodeURIComponent(values.name)}&lifeStage=${encodeURIComponent(values.lifeStage)}&relationshipStatus=${encodeURIComponent(values.relationshipStatus)}'
)
content = content.replace(
    'router.push(`/kundli?name=${encodeURIComponent(values.name)}',
    'router.push(`/kundli?name=${encodeURIComponent(values.name)}&lifeStage=${encodeURIComponent(values.lifeStage)}&relationshipStatus=${encodeURIComponent(values.relationshipStatus)}'
)
content = content.replace(
    'router.push(`/varshaphal?name=${encodeURIComponent(values.name)}',
    'router.push(`/varshaphal?name=${encodeURIComponent(values.name)}&lifeStage=${encodeURIComponent(values.lifeStage)}&relationshipStatus=${encodeURIComponent(values.relationshipStatus)}'
)
content = content.replace(
    'router.push(`/daily-insight?name=${encodeURIComponent(values.name)}',
    'router.push(`/daily-insight?name=${encodeURIComponent(values.name)}&lifeStage=${encodeURIComponent(values.lifeStage)}&relationshipStatus=${encodeURIComponent(values.relationshipStatus)}'
)

with open('src/components/BirthDetailsForm.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Safely updated form")
