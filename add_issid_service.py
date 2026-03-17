import sys
sys.path.insert(0, 'C:/Users/yuyu/.claude/plugins/cache/claude-scientific-writer/claude-scientific-writer/eef6dae6bd6a/skills/document-skills/docx')

from scripts.document import Document, DocxXMLEditor

doc = Document('c:/Users/yuyu/Desktop/Claudecode/Webpage/cv_unpacked')

rpr       = '<w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="20"/></w:rPr>'
rpr_bold  = '<w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:sz w:val="20"/></w:rPr>'
rpr_head  = '<w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:bCs/><w:sz w:val="20"/></w:rPr>'

# ── Find the VOLUNTEER heading paragraph ──────────────────────────────────────
volunteer_node = doc["word/document.xml"].get_node(tag="w:p", contains="VOLUNTEER")

# ── Build PROFESSIONAL SERVICE section heading ────────────────────────────────
service_heading = (
    '<w:p>'
    '<w:pPr><w:spacing w:line="276" w:lineRule="auto"/>'
    f'{rpr_head}</w:pPr>'
    f'<w:r>{rpr_head}<w:t>PROFESSIONAL SERVICE</w:t></w:r>'
    '</w:p>'
)

# ── Blank line after heading ──────────────────────────────────────────────────
blank = (
    '<w:p>'
    '<w:pPr><w:spacing w:line="276" w:lineRule="auto"/>'
    f'{rpr}</w:pPr>'
    '</w:p>'
)

# ── ISSID 2027 entry: "2026 – 2027  [tab]  Scientific Committee Member, ISSID 2027" ──
issid_main = (
    '<w:p>'
    '<w:pPr><w:spacing w:line="276" w:lineRule="auto"/>'
    f'{rpr}</w:pPr>'
    f'<w:r>{rpr}<w:t xml:space="preserve">2026 &#8211; 2027</w:t></w:r>'
    f'<w:r>{rpr}<w:tab/></w:r>'
    f'<w:r>{rpr_bold}<w:t xml:space="preserve">Scientific Committee Member, ISSID 2027</w:t></w:r>'
    '</w:p>'
)

# ── Sub-line: organisation and location ──────────────────────────────────────
issid_sub = (
    '<w:p>'
    '<w:pPr><w:spacing w:line="276" w:lineRule="auto"/><w:ind w:left="2160"/>'
    f'{rpr}</w:pPr>'
    f'<w:r>{rpr}<w:t xml:space="preserve">International Society for the Study of Individual Differences, Durham, UK</w:t></w:r>'
    '</w:p>'
)

# ── Blank separator before VOLUNTEER ─────────────────────────────────────────
blank2 = (
    '<w:p>'
    '<w:pPr><w:spacing w:line="276" w:lineRule="auto"/>'
    f'{rpr}</w:pPr>'
    '</w:p>'
)

xml_editor = doc["word/document.xml"]

# Insert before VOLUNTEER: [blank][SERVICE heading][blank][issid_main][issid_sub][blank2][VOLUNTEER]
prev = volunteer_node.previousSibling
inserted = xml_editor.insert_after(prev, blank)
inserted = xml_editor.insert_after(inserted[-1], service_heading)
inserted = xml_editor.insert_after(inserted[-1], blank)
inserted = xml_editor.insert_after(inserted[-1], issid_main)
inserted = xml_editor.insert_after(inserted[-1], issid_sub)
inserted = xml_editor.insert_after(inserted[-1], blank2)

doc.save(validate=False)
print("CV updated: PROFESSIONAL SERVICE section added with ISSID 2027.")
