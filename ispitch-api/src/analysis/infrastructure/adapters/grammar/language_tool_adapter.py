import language_tool_python
from ....domain.ports.output import GrammarCheckerPort
from ....domain.models.grammar import GrammarAnalysis, GrammarIssue

class LanguageToolAdapter(GrammarCheckerPort):
    def __init__(self):
        self.tool = language_tool_python.LanguageTool('pt-BR')

    def check(self, text: str) -> GrammarAnalysis:
        matches = self.tool.check(text)
        issues = []
        for match in matches:
            if 'AGREEMENT' in match.ruleId or 'CONCORDANCIA' in match.ruleId.upper():
                 issues.append(GrammarIssue(
                    offset=match.offset,
                    length=match.errorLength,
                    message=match.message,
                    short_message=match.category,
                    text=match.context[match.offset : match.offset + match.errorLength],
                    suggestions=match.replacements,
                    rule_id=match.ruleId
                ))

        return GrammarAnalysis(issues=issues)