import os
import re

filepath = 'src/components/KpKundliDashboardView.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove html-to-image
content = content.replace('import { toJpeg } from "html-to-image";\n', '')

# Remove hidden PDF chart block
hidden_chart_regex = r'\{/\* Hidden Light Theme Charts for PDF Capture \*/\}.*?</div>\n      </div>'
content = re.sub(hidden_chart_regex, '', content, flags=re.DOTALL)

# Update handleDownloadPDF to use KpKundliPDF
old_download = """  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const d1El = document.getElementById("d1-chart-pdf");
      const d9El = document.getElementById("d9-chart-pdf");
      
      let d1Image = null;
      let d9Image = null;

      if (d1El) d1Image = await toJpeg(d1El, { quality: 1, backgroundColor: "#0F1123" });
      if (d9El) d9Image = await toJpeg(d9El, { quality: 1, backgroundColor: "#0F1123" });

      const { pdf } = await import("@react-pdf/renderer");
      const { KundliPDF } = await import("@/components/KundliPDF");

      const blob = await pdf(
        <KundliPDF
          chartData={chartData}
          name={name}
          dob={dob}
          tob={tob}
          pob={pob}
          d1Image={d1Image}
          d9Image={d9Image}
        />
      ).toBlob();"""

new_download = """  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const { pdf } = await import("@react-pdf/renderer");
      const { KpKundliPDF } = await import("@/components/KpKundliPDF");

      const blob = await pdf(
        <KpKundliPDF
          chartData={chartData}
          name={name}
          dob={dob}
          tob={tob}
          pob={pob}
        />
      ).toBlob();"""

content = content.replace(old_download, new_download)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated KpKundliDashboardView to use Vector SVG PDFs")
