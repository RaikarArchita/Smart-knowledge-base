from app.services import llm_service
import re
import json

class AIService:

    @staticmethod
    def _suggest_tags(content: str):
        prompt = f"""
            Analyze the following note and suggest 5 relevant tags.

            Rules:
            - Tags must be concise.
            - Prefer 1-2 words.
            - Tags should represent the main topics.
            - Do not generate generic tags such as "Note" or "Information".
            - If a tag contains multiple words, separate the words with spaces.
            - Do NOT use underscores.
            - Do NOT concatenate words.
            - Return only valid JSON.

            Return exactly this format:
                {{
                    "tags": [
                        "Customer Churn",
                        "Feature Engineering",
                        "Random Forest"
                    ]
                }}
            Note:
            {content}
            """
        llm_response = llm_service.generate(prompt)

        clean_response = re.sub(
            r"```json\s*|\s*```",
            "",
            llm_response
        ).strip()

        # Convert JSON string → Python dictionary
        data = json.loads(clean_response)

        # Return only the list
        return data["tags"]