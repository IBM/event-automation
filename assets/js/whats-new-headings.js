document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("whats-new-headings");
  const baseUrl = container?.dataset.baseurl?.replace(/\/+$/, "") || "";

  if (!container) return;

  // License > product > multiple version mapping
  const licenseMap = [
    {
      license: "1.2.0.0",
      products: {
        es: ["11.8", "12.0", "12.1", "12.2"],
        eem: ["11.6", "11.7"],
        ep: ["1.4"]
      }
    },
    {
      license: "1.1.0.0",
      products: {
        es: ["11.5", "11.6","11.7"],
        eem: ["11.3", "11.4", "11.5"],
        ep: ["1.2","1.3"]
      }
    },
    {
      license: "1.0.0.0",
      products: {
        es: ["11.2", "11.3", "11.4"],
        eem: ["11.0", "11.1", "11.2"],
        ep: ["1.0", "1.1"]
      }
    }
  ];

  // Sort descending by license version
  licenseMap.sort((a, b) => {
    const aNum = a.license.split(".").map(Number);
    const bNum = b.license.split(".").map(Number);
    for (let i = 0; i < Math.max(aNum.length, bNum.length); i++) {
      const aVal = aNum[i] || 0;
      const bVal = bNum[i] || 0;
      if (aVal !== bVal) return bVal - aVal;
    }
    return 0;
  });

  const products = [
    { prefix: "es", title: "Event Streams" },
    { prefix: "eem", title: "Event Endpoint Management" },
    { prefix: "ep", title: "Event Processing" }
  ];

  // helper: compare/sort version strings (descending)
  const sortDescVersions = arr => {
    return arr.slice().sort((a, b) => {
      const aParts = a.split(".").map(Number);
      const bParts = b.split(".").map(Number);
      for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
        const aVal = aParts[i] || 0;
        const bVal = bParts[i] || 0;
        if (aVal !== bVal) return bVal - aVal;
      }
      return 0;
    });
  };

  //  Determine global latest version per product
  const latestByProduct = {};
  for (const p of ["es", "eem", "ep"]) {
    let allVersions = [];
    for (const lic of licenseMap) {
      if (lic.products[p]) allVersions.push(...lic.products[p]);
    }
    latestByProduct[p] = sortDescVersions(allVersions)[0];
  }

  let finalHTML = "";

  for (const lic of licenseMap) {
    finalHTML += `<details class="details">\n`;
    finalHTML += `  <summary><b>Release ${lic.license}</b></summary>\n`;
    finalHTML += `  <p><a href="support/licensing/#ibm-event-automation-license-information">See license information.</a></p>\n`;
    finalHTML += `  <div class="release-info">\n  <!-- Assisted by WCA@IBM -->\n`;

    for (const p of products) {
      const versions = lic.products[p.prefix];
      if (!versions || versions.length === 0) continue;

      finalHTML += `  <details class="details">\n`;
      finalHTML += `    <summary><b>${p.title}</b></summary>\n`;

      const sortedVersions = sortDescVersions(versions);

      for (const version of sortedVersions) {
        const isLatest = version === latestByProduct[p.prefix];

        const url = isLatest
          ? `${baseUrl}/${p.prefix}/about/whats-new/`
          : `${baseUrl}/${p.prefix}/${p.prefix}_${version}/about/whats-new/`;

        console.log("Fetching:", url);

        try {
          const response = await fetch(url);
          if (!response.ok) throw new Error(`Failed to load ${url}`);

          const htmlText = await response.text();
          const parser = new DOMParser();
          const doc = parser.parseFromString(htmlText, "text/html");

          const headings = doc.querySelectorAll("h2, h3");
          if (headings.length === 0) continue;

          let currentH2 = null;
          let currentList = [];
          let anySectionAddedForThisVersion = false;

          finalHTML += `      <div class="product-version-block">\n`;

          headings.forEach((h, i) => {
            const text = h.textContent.trim();

            if (/Documentation:\s*Highlighting differences between versions/i.test(text)) return;

            const releaseNumMatch = text.match(/\d+(\.\d+)*/);
            const isReleaseHeading = /^Release\s+\d+(\.\d+)*|^\d+(\.\d+)+/.test(text);

            if (h.tagName === "H2" && isReleaseHeading) {
              if (!releaseNumMatch) return;

              const releaseNum = releaseNumMatch[0];
              if (!releaseNum.startsWith(version)) {
                currentH2 = null;
                currentList = [];
                return;
              }

              if (currentH2) {
                if (p.prefix === "ep" && currentH2.includes("Release 1.0.0")) {
                  finalHTML += `        <h4>${currentH2} - what's new:</h4>\n        <p>First General Availability release.</p>\n`;
                } else {
                  finalHTML += `        <h4>${currentH2} - what's new:</h4>\n        <ul>\n`;
                  currentList.forEach(item => (finalHTML += `          <li>${item}</li>\n`));
                  finalHTML += `        </ul>\n`;
                }
                anySectionAddedForThisVersion = true;
              }
              currentH2 = text;
              currentList = [];
            } else if (h.tagName === "H3" && currentH2) {
              currentList.push(text);
            }

            if (i === headings.length - 1 && currentH2) {
              if (p.prefix === "ep" && currentH2.includes("Release 1.0.0")) {
                finalHTML += `        <h4>${currentH2} - what's new:</h4>\n        <p>First General Availability release.</p>\n`;
              } else {
                finalHTML += `        <h4>${currentH2} - what's new:</h4>\n        <ul>\n`;
                currentList.forEach(item => (finalHTML += `          <li>${item}</li>\n`));
                finalHTML += `        </ul>\n`;
              }
              anySectionAddedForThisVersion = true;
            }
          });

          finalHTML += `      </div>\n\n`;

        } catch (err) {
          console.error(`Error loading ${p.prefix}_${version}:`, err);
          finalHTML += `      <p>Could not load version ${version} details for ${p.title}.</p>\n`;
        }
      }

      finalHTML += `  </details>\n\n`;
    }

    finalHTML += `  </div>\n</details>\n\n`;
  }

  container.innerHTML = finalHTML || "<p>No release notes available.</p>";
});
