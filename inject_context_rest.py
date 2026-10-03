import os
import re

def inject_context_into_prompt(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Define the rule to inject
    context_rule = """
  [WAY 1: EXPLICIT CONTEXTUAL PROFILING (MANDATORY)]: The user explicitly states they are currently a ${lifeStage.toUpperCase()} and ${relationshipStatus.toUpperCase()}.
  - You MUST forcefully align all predictions to this reality.
  - If they are a STUDENT, career peaks mean Academic Success/Exams. NEVER predict corporate promotions.
  - If they are a FRESHER, career peaks mean First Job. NEVER predict senior leadership.
  - If they are SINGLE, relationship peaks mean finding a partner.
  - If they are MARRIED, relationship peaks mean marital milestones or marital crisis."""

    # For daily insight
    if 'generateDailyInsight' in filepath:
        # Update function signature
        content = re.sub(
            r"export async function fetchAIDailyInsightData\(\s*name: string,\s*dob: string,\s*tob: string,\s*pob: string,\s*targetDateStr\?: string\s*\)",
            "export async function fetchAIDailyInsightData(name: string, dob: string, tob: string, pob: string, lifeStage: string = \"student\", relationshipStatus: string = \"single\", targetDateStr?: string)",
            content
        )
        # Inject rule into prompt
        content = content.replace(
            "CRITICAL REAL-WORLD CLARITY RULE (NO GENERIC ASTROLOGY FLUFF):",
            "CRITICAL REAL-WORLD CLARITY RULE (NO GENERIC ASTROLOGY FLUFF):" + context_rule
        )

    # For Varshaphal
    if 'generateVarshaphal' in filepath:
        # Update function signature
        content = re.sub(
            r"export async function fetchAIVarshaphalData\(name: string, dob: string, tob: string, pob: string, targetYear\?: number\)",
            "export async function fetchAIVarshaphalData(name: string, dob: string, tob: string, pob: string, lifeStage: string = \"student\", relationshipStatus: string = \"single\", targetYear?: number)",
            content
        )
        # Inject rule into prompt
        content = content.replace(
            "CRITICAL REAL-WORLD CLARITY RULE (NO GENERIC ASTROLOGY FLUFF):",
            "CRITICAL REAL-WORLD CLARITY RULE (NO GENERIC ASTROLOGY FLUFF):" + context_rule
        )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

inject_context_into_prompt('src/app/actions/generateDailyInsight.ts')
inject_context_into_prompt('src/app/actions/generateVarshaphal.ts')
print("Successfully injected Contextual Profiling into Daily and Varshaphal")
