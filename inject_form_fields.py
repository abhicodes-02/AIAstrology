import os

with open('src/components/BirthDetailsForm.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = '<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">'

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
                        className="flex h-12 w-full items-center justify-between rounded-xl border border-indigo-500/30 bg-indigo-950/40 px-4 py-2 text-sm text-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

content = content.replace(target, new_fields + "\n            " + target)

with open('src/components/BirthDetailsForm.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
