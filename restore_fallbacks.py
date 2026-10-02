import os

files = [
    'src/app/actions/generateKundli.ts',
    'src/app/actions/generateKpKundli.ts',
    'src/app/actions/generateVarshaphal.ts',
    'src/app/actions/generateDailyInsight.ts'
]

fallback_code = """
      const fallbackModels = [
          "gemini-3.8-flash",
          "gemini-3.7-flash",
          "gemini-3.6-flash",
          "gemini-3.5-flash",
          "gemini-3-flash",
          "gemini-2.5-flash",
          "gemini-3.5-flash-lite",
          "gemini-3.1-flash-lite",
          "gemini-flash-lite-latest"
      ];
      
      let aiJson = null;
      let finalResponse = null;

      for (const modelName of fallbackModels) {
        try {
          const aiPromise = ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: { 
              temperature: 0.2, 
              responseMimeType: "application/json",
"""

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Let's fix the corrupted degrees symbol
    content = content.replace("23A 51' 11\"", "23 degrees 51 minutes 11 seconds")
    content = content.replace("23Â° 51' 11\"", "23 degrees 51 minutes 11 seconds")
    content = content.replace("23°", "23 degrees")
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
