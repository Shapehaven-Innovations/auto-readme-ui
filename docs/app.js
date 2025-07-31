const API_BASE = "https://auto-readme-api.shapehaveninnovations.workers.dev";
const ORG = "Shapehaven-Innovations";

const scanBtn = document.getElementById("scanBtn");
const statusTable = document.querySelector("#statusTable tbody");
const codeArea = document.getElementById("codeArea");
const genBtn = document.getElementById("genBtn");
const preview = document.getElementById("preview");
const commitChk = document.getElementById("commitChk");
const repoSelect = document.getElementById("repoSelect");

async function scanOrg() {
  scanBtn.disabled = true;
  statusTable.innerHTML = "<tr><td colspan='2'>Scanning…</td></tr>";
  try {
    const res = await fetch(`${API_BASE}/scan?org=${ORG}`);
    const data = await res.json();
    // Populate table and dropdown
    statusTable.innerHTML = "";
    repoSelect.innerHTML = `<option value="">— Select repo —</option>`;
    data.forEach((d) => {
      const row = document.createElement("tr");
      row.innerHTML = `<td>${d.repo}</td><td>${d.hasReadme ? "✅" : "❌"}</td>`;
      statusTable.appendChild(row);
      if (!d.hasReadme) {
        const opt = document.createElement("option");
        opt.value = d.repo.split("/")[1];
        opt.textContent = d.repo.split("/")[1];
        repoSelect.appendChild(opt);
      }
    });
  } catch (e) {
    statusTable.innerHTML = `<tr><td colspan='2'>Error: ${e.message}</td></tr>`;
  } finally {
    scanBtn.disabled = false;
  }
}

async function generateReadme() {
  const code = codeArea.value.trim();
  const repo = repoSelect.value;
  if (!code) return alert("Please paste some code.");
  if (commitChk.checked && !repo) return alert("Select a repo to commit to.");
  genBtn.disabled = true;
  preview.textContent = "Generating…";
  try {
    const payload = { code, commit: commitChk.checked };
    if (commitChk.checked) payload.repo = repo;
    const res = await fetch(`${API_BASE}/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const { markdown } = await res.json();
    preview.textContent = markdown;
  } catch (e) {
    preview.textContent = `Error: ${e.message}`;
  } finally {
    genBtn.disabled = false;
  }
}

scanBtn.addEventListener("click", scanOrg);
genBtn.addEventListener("click", generateReadme);

// Auto-scan on load
scanOrg();
