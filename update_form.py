import os
import re

with open('src/components/BirthDetailsForm.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Update Zod schema
pattern_schema = r"pob: z\.string\(\)\.min\(2, \{ message: \"Place of birth is required\.\" \}\),"
replacement_schema = """pob: z.string().min(2, { message: "Place of birth is required." }),
  lifeStage: z.string().min(1, { message: "Please select your current life stage." }),
  relationshipStatus: z.string().min(1, { message: "Please select your relationship status." }),"""
content = content.replace(pattern_schema, replacement_schema)

# Update default values
pattern_defaults = r"pob: \"\","
replacement_defaults = """pob: "",
      lifeStage: "student",
      relationshipStatus: "single","""
content = content.replace(pattern_defaults, replacement_defaults)

# Add Select imports from lucide-react and UI components
# Actually we can just use native HTML <select> for simplicity, or we can use the existing UI components if available.
# Let's check if there is a Select component in components/ui.
# If not, a styled HTML select is perfectly fine.
select_jsx = """
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-indigo-500/20">
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
                    className="flex h-12 w-full items-center justify-between rounded-xl border border-indigo-500/30 bg-indigo-950/40 px-4 py-2 text-sm text-indigo-100 ring-offset-background placeholder:text-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all hover:bg-indigo-900/40"
                  >
                    <option value="student" className="bg-slate-900 text-indigo-100">Student / Higher Education</option>
                    <option value="fresher" className="bg-slate-900 text-indigo-100">Fresher / Job Seeker</option>
                    <option value="employed" className="bg-slate-900 text-indigo-100">Working Professional</option>
                    <option value="business" className="bg-slate-900 text-indigo-100">Business / Entrepreneur</option>
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
                    className="flex h-12 w-full items-center justify-between rounded-xl border border-indigo-500/30 bg-indigo-950/40 px-4 py-2 text-sm text-indigo-100 ring-offset-background placeholder:text-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all hover:bg-indigo-900/40"
                  >
                    <option value="single" className="bg-slate-900 text-indigo-100">Single</option>
                    <option value="committed" className="bg-slate-900 text-indigo-100">In a Relationship</option>
                    <option value="married" className="bg-slate-900 text-indigo-100">Married</option>
                    <option value="separated" className="bg-slate-900 text-indigo-100">Divorced / Separated</option>
                  </select>
                </FormControl>
                <FormMessage className="text-rose-400" />
              </FormItem>
            )}
          />
        </div>
"""

# Inject before the submit button
pattern_submit = r"(\s*)<Button\s+type=\"submit\""
content = re.sub(pattern_submit, r"\1" + select_jsx.replace('\n', r'\n\1') + r"\n\1<Button type=\"submit\"", content)

# Modify onSubmit query parameters
pattern_router = r"router\.push\(`\/\?name=\$\{encodeURIComponent\(values\.name\)\}.*?`\);"
replacement_router = r"router.push(`/?name=${encodeURIComponent(values.name)}&dob=${encodeURIComponent(values.dob)}&tob=${encodeURIComponent(values.tob)}&pob=${encodeURIComponent(values.pob)}&lat=${encodeURIComponent(selectedLat)}&lon=${encodeURIComponent(selectedLon)}&lifeStage=${encodeURIComponent(values.lifeStage)}&relationshipStatus=${encodeURIComponent(values.relationshipStatus)}`);"
content = re.sub(pattern_router, replacement_router, content)

with open('src/components/BirthDetailsForm.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated BirthDetailsForm.tsx")
