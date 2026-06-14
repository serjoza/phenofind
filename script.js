(function () {
  "use strict";

  var STORAGE_KEY = "phenofind-validacija-results";

  var STATUS = {
    ready: "Pripravljeno",
    loading: "Nalagam ...",
    imageLoading: "Nalagam novo sliko ...",
    saving: "Shranjujem ...",
    saved: "Shranjeno",
    saveError: "Napaka pri shranjevanju"
  };

  var OFFICIAL_BBCH_STAGES = [
    { code: "00", description: "Mirovanje: listni brsti in debelejši socvetni brsti so zaprti in prekriti s temno rjavimi luskami", principal: "0", title: "Razvoj brstov" },
    { code: "01", description: "Začetek nabrekanja listnih brstov: brsti so vidno nabrekli, luske brstov so podaljšane in imajo svetlejše predele", principal: "0", title: "Razvoj brstov" },
    { code: "03", description: "Konec nabrekanja listnih brstov: luske brstov so svetlejše, nekateri deli so gosto prekriti z dlačicami", principal: "0", title: "Razvoj brstov" },
    { code: "07", description: "Začetek odpiranja brstov: prve zelene konice listov so komaj vidne", principal: "0", title: "Razvoj brstov" },
    { code: "09", description: "Zelene konice listov segajo približno 5 mm nad luske brsta", principal: "0", title: "Razvoj brstov" },
    { code: "10", description: "Stadij mišjega ušesa: zelene konice listov segajo približno 10 mm nad luske brsta, prvi listi se ločujejo", principal: "1", title: "Razvoj listov" },
    { code: "11", description: "Prvi listi so razprti, drugi se še razpirajo", principal: "1", title: "Razvoj listov" },
    { code: "15", description: "Razprtih je več listov, vendar še niso dosegli končne velikosti", principal: "1", title: "Razvoj listov" },
    { code: "19", description: "Prvi listi so popolnoma razviti", principal: "1", title: "Razvoj listov" },
    { code: "31", description: "Začetek rasti poganjkov: vidne so osi razvijajočih se poganjkov", principal: "3", title: "Razvoj poganjkov" },
    { code: "32", description: "Poganjki so dosegli približno 20 % končne dolžine", principal: "3", title: "Razvoj poganjkov" },
    { code: "33", description: "Poganjki so dosegli približno 30 % končne dolžine", principal: "3", title: "Razvoj poganjkov" },
    { code: "34", description: "Poganjki so dosegli približno 40 % končne dolžine", principal: "3", title: "Razvoj poganjkov" },
    { code: "35", description: "Poganjki so dosegli približno 50 % končne dolžine", principal: "3", title: "Razvoj poganjkov" },
    { code: "36", description: "Poganjki so dosegli približno 60 % končne dolžine", principal: "3", title: "Razvoj poganjkov" },
    { code: "37", description: "Poganjki so dosegli približno 70 % končne dolžine", principal: "3", title: "Razvoj poganjkov" },
    { code: "38", description: "Poganjki so dosegli približno 80 % končne dolžine", principal: "3", title: "Razvoj poganjkov" },
    { code: "39", description: "Poganjki so dosegli približno 90 % končne dolžine", principal: "3", title: "Razvoj poganjkov" },
    { code: "51", description: "Nabrekanje socvetnih brstov: luske brstov so podaljšane in imajo svetlejše predele", principal: "5", title: "Pojav socvetij" },
    { code: "52", description: "Konec nabrekanja brstov: vidne so svetlejše luske brstov, katerih deli so gosto prekriti z dlačicami", principal: "5", title: "Pojav socvetij" },
    { code: "53", description: "Odpiranje brstov: vidne so zelene konice listov, ki obdajajo cvetove", principal: "5", title: "Pojav socvetij" },
    { code: "54", description: "Stadij mišjega ušesa: zelene konice listov segajo približno 10 mm nad luske brsta, prvi listi se ločujejo", principal: "5", title: "Pojav socvetij" },
    { code: "55", description: "Cvetni brsti so vidni, vendar še zaprti", principal: "5", title: "Pojav socvetij" },
    { code: "56", description: "Stadij zelenega popka: posamezni cvetovi se ločujejo, vendar so še zaprti", principal: "5", title: "Pojav socvetij" },
    { code: "57", description: "Stadij rožnatega popka: venčni listi se podaljšujejo, čašni listi so rahlo odprti, konice venčnih listov so komaj vidne", principal: "5", title: "Pojav socvetij" },
    { code: "59", description: "Večina cvetov ima venčne liste oblikovane v votlo kroglo oziroma balon", principal: "5", title: "Pojav socvetij" },
    { code: "60", description: "Odprti so prvi cvetovi", principal: "6", title: "Cvetenje" },
    { code: "61", description: "Začetek cvetenja: odprtih je približno 10 % cvetov", principal: "6", title: "Cvetenje" },
    { code: "62", description: "Odprtih je približno 20 % cvetov", principal: "6", title: "Cvetenje" },
    { code: "63", description: "Odprtih je približno 30 % cvetov", principal: "6", title: "Cvetenje" },
    { code: "64", description: "Odprtih je približno 40 % cvetov", principal: "6", title: "Cvetenje" },
    { code: "65", description: "Polno cvetenje: odprtih je najmanj 50 % cvetov, prvi venčni listi odpadajo", principal: "6", title: "Cvetenje" },
    { code: "67", description: "Cvetovi venejo: večina venčnih listov je odpadla", principal: "6", title: "Cvetenje" },
    { code: "69", description: "Konec cvetenja: vsi venčni listi so odpadli", principal: "6", title: "Cvetenje" },
    { code: "71", description: "Plodovi so veliki do 10 mm; poteka odpadanje plodičev po cvetenju", principal: "7", title: "Razvoj plodov" },
    { code: "72", description: "Plodovi so veliki do 20 mm", principal: "7", title: "Razvoj plodov" },
    { code: "73", description: "Drugo odpadanje plodičev", principal: "7", title: "Razvoj plodov" },
    { code: "74", description: "Premer plodov je do 40 mm, plodovi so pokončni; spodnja stran ploda in pecelj oblikujeta črko T", principal: "7", title: "Razvoj plodov" },
    { code: "75", description: "Plodovi so dosegli približno polovico končne velikosti", principal: "7", title: "Razvoj plodov" },
    { code: "76", description: "Plodovi so dosegli približno 60 % končne velikosti", principal: "7", title: "Razvoj plodov" },
    { code: "77", description: "Plodovi so dosegli približno 70 % končne velikosti", principal: "7", title: "Razvoj plodov" },
    { code: "78", description: "Plodovi so dosegli približno 80 % končne velikosti", principal: "7", title: "Razvoj plodov" },
    { code: "79", description: "Plodovi so dosegli približno 90 % končne velikosti", principal: "7", title: "Razvoj plodov" },
    { code: "81", description: "Začetek zorenja: prvi pojav za sorto značilne barve", principal: "8", title: "Zorenje plodov in semen" },
    { code: "85", description: "Napredovalo zorenje: povečuje se intenzivnost za sorto značilne barve", principal: "8", title: "Zorenje plodov in semen" },
    { code: "87", description: "Plodovi so zreli za obiranje", principal: "8", title: "Zorenje plodov in semen" },
    { code: "89", description: "Plodovi so užitno zreli: imajo značilen okus in čvrstost", principal: "8", title: "Zorenje plodov in semen" },
    { code: "91", description: "Rast poganjkov je zaključena, terminalni brst je razvit, listje je še popolnoma zeleno", principal: "9", title: "Staranje in začetek mirovanja" },
    { code: "92", description: "Listi se začenjajo razbarvati", principal: "9", title: "Staranje in začetek mirovanja" },
    { code: "93", description: "Začetek odpadanja listov", principal: "9", title: "Staranje in začetek mirovanja" },
    { code: "95", description: "Razbarvanih je približno 50 % listov", principal: "9", title: "Staranje in začetek mirovanja" },
    { code: "97", description: "Vsi listi so odpadli", principal: "9", title: "Staranje in začetek mirovanja" },
    { code: "99", description: "Pridelek je pobran", principal: "9", title: "Staranje in začetek mirovanja" }
  ];

  var OFFICIAL_BY_CODE = OFFICIAL_BBCH_STAGES.reduce(function (map, stage) {
    map[stage.code] = stage;
    return map;
  }, {});

  var state = {
    records: [],
    results: new Map(),
    current: 0,
    filter: "all",
    saving: false,
    correctionOpen: false,
    displayedImageUrl: ""
  };

  var el = {};

  document.addEventListener("DOMContentLoaded", function () {
    bindElements();
    bindEvents();
    loadApplication();
  });

  function bindElements() {
    [
      "progressText", "progressFill", "statusIndicator", "errorBox", "app",
      "missingImage", "mainImage", "emptyImage", "metadataBody", "existingResult",
      "yesButton", "noButton", "correctionPanel", "correctionSelect", "manualFields",
      "manualBbch", "manualDescription", "saveCorrection", "cancelCorrection",
      "currentIndex", "prevButton", "nextButton", "showUnvalidated", "showAll",
      "exportResults", "resetButton", "lastResultsBox", "lastResults",
      "metadataUpload", "uploadSection"
    ].forEach(function (id) {
      el[id] = document.getElementById(id);
    });
  }

  function bindEvents() {
    el.yesButton.addEventListener("click", saveYes);
    el.noButton.addEventListener("click", openCorrectionPanel);
    el.saveCorrection.addEventListener("click", saveNoCorrection);
    el.cancelCorrection.addEventListener("click", closeCorrectionPanel);
    el.correctionSelect.addEventListener("change", renderManualFields);
    el.manualBbch.addEventListener("input", renderManualDescription);
    el.prevButton.addEventListener("click", function () { moveBy(-1); });
    el.nextButton.addEventListener("click", function () { moveBy(1); });
    el.showUnvalidated.addEventListener("click", function () {
      state.filter = "unvalidated";
      state.current = 0;
      state.correctionOpen = false;
      render();
    });
    el.showAll.addEventListener("click", function () {
      state.filter = "all";
      state.correctionOpen = false;
      render();
    });
    el.exportResults.addEventListener("click", exportResultsCsv);
    el.resetButton.addEventListener("click", resetProgress);
    if (el.metadataUpload) {
      el.metadataUpload.addEventListener("change", handleMetadataUpload);
    }
  }

  // ---------------------------------------------------------------------------
  // Startup: try metadata.json first, then fall back to upload UI
  // ---------------------------------------------------------------------------

  async function loadApplication() {
    setStatus(STATUS.loading);
    clearError();
    setBusy(true);

    // Load saved results from localStorage
    state.results = loadResultsFromStorage();

    // Try metadata.json first, then metadata.csv, then fall back to upload UI
    try {
      var jsonResponse = await fetch("metadata.json");
      if (jsonResponse.ok) {
        var data = await jsonResponse.json();
        state.records = Array.isArray(data) ? data : (data.records || []);
      } else {
        var csvResponse = await fetch("metadata.csv");
        if (!csvResponse.ok) {
          throw new Error("Nobena metadatoteka ni bila najdena.");
        }
        var csvText = await csvResponse.text();
        state.records = parseCsv(csvText);
      }
      state.current = firstIncompleteIndex(getVisibleRecords());
      setStatus(STATUS.ready);
      showApp();
      render();
    } catch (err) {
      // Neither file found — show the upload UI instead
      setBusy(false);
      setStatus("Čakam na datoteko ...");
      showUploadSection();
    }

    setBusy(false);
  }

  // ---------------------------------------------------------------------------
  // CSV upload fallback
  // ---------------------------------------------------------------------------

  function showUploadSection() {
    if (el.uploadSection) {
      el.uploadSection.classList.remove("hidden");
    }
    if (el.app) {
      el.app.classList.add("hidden");
    }
    if (el.lastResultsBox) {
      el.lastResultsBox.classList.add("hidden");
    }
  }

  function showApp() {
    if (el.uploadSection) {
      el.uploadSection.classList.add("hidden");
    }
    if (el.app) {
      el.app.classList.remove("hidden");
    }
  }

  function handleMetadataUpload(event) {
    var file = event.target.files && event.target.files[0];
    if (!file) {
      return;
    }
    var reader = new FileReader();
    reader.onload = function (e) {
      var text = e.target.result;
      try {
        var records = parseCsv(text);
        if (!records.length) {
          showError("CSV datoteka je prazna ali ni veljavna.");
          return;
        }
        state.records = records;
        state.current = firstIncompleteIndex(getVisibleRecords());
        clearError();
        setStatus(STATUS.ready);
        showApp();
        render();
      } catch (err) {
        showError("Napaka pri branju CSV: " + err.message);
      }
    };
    reader.readAsText(file, "UTF-8");
  }

  // Minimal RFC-4180 CSV parser
  function parseCsv(text) {
    var lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
    if (!lines.length) {
      return [];
    }
    var headers = splitCsvLine(lines[0]);
    var records = [];
    for (var i = 1; i < lines.length; i++) {
      var line = lines[i].trim();
      if (!line) {
        continue;
      }
      var values = splitCsvLine(line);
      var record = {};
      headers.forEach(function (header, index) {
        record[header.trim()] = (values[index] || "").trim();
      });
      records.push(record);
    }
    return records;
  }

  function splitCsvLine(line) {
    var result = [];
    var current = "";
    var inQuotes = false;
    for (var i = 0; i < line.length; i++) {
      var ch = line[i];
      if (inQuotes) {
        if (ch === '"' && line[i + 1] === '"') {
          current += '"';
          i++;
        } else if (ch === '"') {
          inQuotes = false;
        } else {
          current += ch;
        }
      } else {
        if (ch === '"') {
          inQuotes = true;
        } else if (ch === "," || ch === ";") {
          result.push(current);
          current = "";
        } else {
          current += ch;
        }
      }
    }
    result.push(current);
    return result;
  }

  // ---------------------------------------------------------------------------
  // localStorage persistence
  // ---------------------------------------------------------------------------

  function loadResultsFromStorage() {
    var map = new Map();
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return map;
      }
      var arr = JSON.parse(raw);
      if (!Array.isArray(arr)) {
        return map;
      }
      arr.forEach(function (result) {
        var key = resultKey(result);
        if (key) {
          map.set(key, result);
        }
      });
    } catch (err) {
      // Ignore corrupt data
    }
    return map;
  }

  function saveResultsToStorage() {
    try {
      var arr = Array.from(state.results.values());
      localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
    } catch (err) {
      // Storage might be full; non-fatal
    }
  }

  // ---------------------------------------------------------------------------
  // Export CSV
  // ---------------------------------------------------------------------------

  function exportResultsCsv() {
    var headers = [
      "ID", "ime_datoteke", "proposed_BBCH", "proposed_fenofaza",
      "validation_answer", "corrected_BBCH", "correction_source", "validation_datetime"
    ];
    var rows = [headers.join(",")];
    state.results.forEach(function (result) {
      var row = headers.map(function (h) {
        var value = String(result[h] || "");
        if (value.indexOf(",") !== -1 || value.indexOf('"') !== -1 || value.indexOf("\n") !== -1) {
          value = '"' + value.replace(/"/g, '""') + '"';
        }
        return value;
      });
      rows.push(row.join(","));
    });
    var csv = rows.join("\n");
    var blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "validacija_rezultati.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // ---------------------------------------------------------------------------
  // Validation save / reset (now localStorage-backed)
  // ---------------------------------------------------------------------------

  function saveValidation(payload) {
    state.saving = true;
    setBusy(true);
    setStatus(STATUS.saving);
    clearError();

    state.results.set(resultKey(payload), payload);
    saveResultsToStorage();

    state.correctionOpen = false;
    moveToNextIncomplete();
    render();
    setStatus(STATUS.imageLoading);

    waitForCurrentImage().then(function () {
      setStatus(STATUS.saved);
      state.saving = false;
      setBusy(false);
      render();
    });
  }

  function resetProgress() {
    if (state.saving || !window.confirm("Ali res želite izbrisati vse rezultate validacije?")) {
      return;
    }
    state.results = new Map();
    state.current = 0;
    state.filter = "all";
    state.correctionOpen = false;
    saveResultsToStorage();
    setStatus(STATUS.ready);
    render();
  }

  // ---------------------------------------------------------------------------
  // Image loading
  // ---------------------------------------------------------------------------

  function waitForCurrentImage() {
    var record = getVisibleRecords()[state.current];
    if (!record || !record.ime_datoteke) {
      return Promise.resolve();
    }
    // Images live in the "images/" folder next to index.html
    var imageUrl = "images/" + encodeURIComponent(record.ime_datoteke);
    return new Promise(function (resolve) {
      var settled = false;
      var timer = window.setTimeout(done, 30000);
      var image = new Image();
      function done() {
        if (settled) { return; }
        settled = true;
        window.clearTimeout(timer);
        resolve();
      }
      image.onload = done;
      image.onerror = done;
      image.src = imageUrl;
    });
  }

  // ---------------------------------------------------------------------------
  // Render helpers (unchanged from original)
  // ---------------------------------------------------------------------------

  function getVisibleRecords() {
    if (state.filter === "unvalidated") {
      return state.records.filter(function (record) { return !isCompleted(record); });
    }
    return state.records;
  }

  function firstIncompleteIndex(records) {
    var index = records.findIndex(function (record) { return !isCompleted(record); });
    return index === -1 ? 0 : index;
  }

  function resultKey(row) {
    return String(row.ID || "").trim() || String(row.ime_datoteke || "").trim();
  }

  function recordKey(record) {
    return String(record.ID || "").trim() || String(record.ime_datoteke || "").trim();
  }

  function resultFor(record) {
    return state.results.get(recordKey(record));
  }

  function isCompleted(record) {
    var result = resultFor(record);
    if (!result) { return false; }
    if (result.validation_answer === "DA") {
      return result.correction_source === "NOT_APPLICABLE";
    }
    return result.validation_answer === "NE"
      && isOfficialCode(result.corrected_BBCH)
      && (result.correction_source === "OFFICIAL_DROPDOWN" || result.correction_source === "MANUAL_ENTRY");
  }

  function render() {
    renderProgress();
    var visible = getVisibleRecords();
    el.app.classList.toggle("hidden", state.records.length === 0);
    el.lastResultsBox.classList.toggle("hidden", state.records.length === 0);

    if (!state.records.length) {
      el.emptyImage.textContent = "metadata.json / CSV je prazen ali manjka.";
      return;
    }
    if (!visible.length) {
      renderNoVisibleRecords();
      renderLastResults();
      return;
    }
    if (state.current >= visible.length) {
      state.current = Math.max(visible.length - 1, 0);
    }
    var record = visible[state.current];
    renderImage(record);
    renderMetadata(record);
    renderExistingResult(record);
    renderCorrectionPanel(record);
    renderNavigation(visible);
    renderLastResults();
    setBusy(state.saving);
  }

  function renderProgress() {
    var total = state.records.length;
    var count = state.records.reduce(function (sum, record) {
      return sum + (isCompleted(record) ? 1 : 0);
    }, 0);
    var percent = total ? Math.round((count / total) * 100) : 0;
    el.progressText.textContent = count + " / " + total + " (" + percent + " %)";
    el.progressFill.style.width = percent + "%";
  }

  function renderNoVisibleRecords() {
    el.metadataBody.innerHTML = "";
    el.existingResult.classList.add("hidden");
    el.correctionPanel.classList.add("hidden");
    el.mainImage.classList.add("hidden");
    el.emptyImage.classList.remove("hidden");
    el.emptyImage.textContent = "Vsi zapisi so pregledani.";
    el.missingImage.classList.add("hidden");
    el.currentIndex.textContent = "0 / 0";
    setBusy(true);
  }

  function renderImage(record) {
    var filename = record.ime_datoteke || "";
    // Images are served from the "images/" subfolder
    var imageUrl = filename ? "images/" + encodeURIComponent(filename) : "";
    el.mainImage.onload = function () {
      el.mainImage.classList.remove("hidden");
      el.emptyImage.classList.add("hidden");
      el.missingImage.classList.add("hidden");
    };
    el.mainImage.onerror = function () {
      el.mainImage.classList.add("hidden");
      el.emptyImage.classList.remove("hidden");
      el.emptyImage.textContent = "Slika ni na voljo.";
      el.missingImage.textContent = "Manjkajoča slika: " + filename;
      el.missingImage.classList.remove("hidden");
    };
    if (!filename) {
      state.displayedImageUrl = "";
      el.mainImage.removeAttribute("src");
      el.mainImage.onerror();
      return;
    }
    if (state.displayedImageUrl === imageUrl && el.mainImage.getAttribute("src") === imageUrl) {
      return;
    }
    state.displayedImageUrl = imageUrl;
    el.mainImage.classList.add("hidden");
    el.emptyImage.classList.remove("hidden");
    el.emptyImage.textContent = "Nalagam sliko ...";
    el.missingImage.classList.add("hidden");
    el.mainImage.src = imageUrl;
  }

  function renderMetadata(record) {
    var rows = [
      ["Predlagana BBCH ocena", record["BBCH ocena"]],
      ["Predlagana fenofaza", record.Fenofaza],
      ["Zanesljivost", record.Zanesljivost],
      ["Opomba", record.Opomba],
      ["Lokacija", record.lokacija || record.Lokacija],
      ["Datum", record.datum],
      ["Ura", record.ura]
    ];
    el.metadataBody.innerHTML = "";
    rows.forEach(function (row) {
      if (!row[1] && row[0] !== "Predlagana BBCH ocena" && row[0] !== "Predlagana fenofaza") {
        return;
      }
      var tr = document.createElement("tr");
      var th = document.createElement("th");
      var td = document.createElement("td");
      th.textContent = row[0];
      td.textContent = row[1] || "-";
      tr.appendChild(th);
      tr.appendChild(td);
      el.metadataBody.appendChild(tr);
    });
  }

  function renderExistingResult(record) {
    var result = resultFor(record);
    el.existingResult.innerHTML = "";
    el.existingResult.classList.toggle("hidden", !result);
    if (!result) { return; }
    var lines = [];
    if (result.validation_answer === "DA") {
      lines.push("Ocena je potrjena.");
    } else if (result.validation_answer === "NE") {
      lines.push("Ocena ni potrjena.");
      lines.push("Pravilna BBCH-koda: " + (result.corrected_BBCH || "-"));
      lines.push("Način popravka: " + correctionSourceLabel(result.correction_source));
      if (OFFICIAL_BY_CODE[result.corrected_BBCH]) {
        lines.push("Opis: " + OFFICIAL_BY_CODE[result.corrected_BBCH].description);
      }
    }
    lines.push("Datum: " + formatDate(result.validation_datetime));
    lines.forEach(function (line) {
      var div = document.createElement("div");
      div.textContent = line;
      el.existingResult.appendChild(div);
    });
  }

  function renderCorrectionPanel(record) {
    el.correctionPanel.classList.toggle("hidden", !state.correctionOpen);
    if (!state.correctionOpen) { return; }
    populateCorrectionSelect(record);
    renderManualFields();
  }

  function populateCorrectionSelect(record) {
    var current = resultFor(record);
    var previousValue = el.correctionSelect.value;
    el.correctionSelect.innerHTML = "";
    var groups = {};
    OFFICIAL_BBCH_STAGES.forEach(function (stage) {
      var label = stage.title;
      if (!groups[label]) {
        groups[label] = document.createElement("optgroup");
        groups[label].label = label;
        el.correctionSelect.appendChild(groups[label]);
      }
      var option = document.createElement("option");
      option.value = stage.code;
      option.textContent = "BBCH " + stage.code + " – " + stage.description;
      groups[label].appendChild(option);
    });
    var custom = document.createElement("option");
    custom.value = "custom";
    custom.textContent = "Drugo – ročni vnos BBCH-kode";
    el.correctionSelect.appendChild(custom);

    if (current && current.validation_answer === "NE") {
      if (current.correction_source === "MANUAL_ENTRY") {
        el.correctionSelect.value = "custom";
        el.manualBbch.value = current.corrected_BBCH || "";
      } else if (OFFICIAL_BY_CODE[current.corrected_BBCH]) {
        el.correctionSelect.value = current.corrected_BBCH;
      }
    } else if (previousValue) {
      el.correctionSelect.value = previousValue;
    }
  }

  function renderManualFields() {
    var isManual = el.correctionSelect.value === "custom";
    el.manualFields.classList.toggle("hidden", !isManual);
    renderManualDescription();
  }

  function renderManualDescription() {
    if (!el.manualDescription) { return; }
    var code = el.manualBbch.value.trim();
    if (!code) {
      el.manualDescription.textContent = "";
    } else if (isOfficialCode(code)) {
      el.manualDescription.textContent = OFFICIAL_BY_CODE[code].description;
    } else {
      el.manualDescription.textContent = "Vnesena BBCH-koda ni na uradnem seznamu razvojnih faz za pečkato sadje.";
    }
  }

  function renderNavigation(visible) {
    el.currentIndex.textContent = String(state.current + 1) + " / " + String(visible.length);
    el.prevButton.disabled = state.current <= 0 || state.saving;
    el.nextButton.disabled = state.current >= visible.length - 1 || state.saving;
    el.showUnvalidated.disabled = state.filter === "unvalidated" || state.saving;
    el.showAll.disabled = state.filter === "all" || state.saving;
  }

  function renderLastResults() {
    var results = Array.from(state.results.values())
      .filter(function (result) { return result.validation_datetime; })
      .sort(function (a, b) { return String(b.validation_datetime).localeCompare(String(a.validation_datetime)); })
      .slice(0, 10);
    el.lastResults.innerHTML = "";
    if (!results.length) {
      var empty = document.createElement("li");
      empty.textContent = "Ni še validacij.";
      el.lastResults.appendChild(empty);
      return;
    }
    results.forEach(function (result) {
      var li = document.createElement("li");
      if (result.validation_answer === "DA") {
        li.textContent = "DA – predlagana ocena potrjena – " + formatDate(result.validation_datetime);
      } else {
        li.textContent = "NE – popravljeno na BBCH " + result.corrected_BBCH + " – "
          + correctionSourceShortLabel(result.correction_source) + " – " + formatDate(result.validation_datetime);
      }
      el.lastResults.appendChild(li);
    });
  }

  function moveBy(delta) {
    var visible = getVisibleRecords();
    if (!visible.length || state.saving) { return; }
    state.current = Math.max(0, Math.min(visible.length - 1, state.current + delta));
    state.correctionOpen = false;
    clearError();
    render();
  }

  function saveYes() {
    var record = getVisibleRecords()[state.current];
    if (!record || state.saving) { return; }
    saveValidation(buildPayload(record, "DA", "", "NOT_APPLICABLE"));
  }

  function openCorrectionPanel() {
    if (state.saving) { return; }
    clearError();
    state.correctionOpen = true;
    el.manualBbch.value = "";
    render();
  }

  function closeCorrectionPanel() {
    if (state.saving) { return; }
    state.correctionOpen = false;
    clearError();
    render();
  }

  function saveNoCorrection() {
    var record = getVisibleRecords()[state.current];
    if (!record || state.saving) { return; }
    var correction = selectedCorrection();
    if (!correction) {
      showError("Vnesena BBCH-koda ni na uradnem seznamu razvojnih faz za pečkato sadje.");
      return;
    }
    saveValidation(buildPayload(record, "NE", correction.bbch, correction.source));
  }

  function selectedCorrection() {
    if (el.correctionSelect.value === "custom") {
      var bbch = el.manualBbch.value.trim();
      if (!/^\d{2}$/.test(bbch) || !isOfficialCode(bbch)) { return null; }
      return { bbch: bbch, source: "MANUAL_ENTRY" };
    }
    if (!isOfficialCode(el.correctionSelect.value)) { return null; }
    return { bbch: el.correctionSelect.value, source: "OFFICIAL_DROPDOWN" };
  }

  function buildPayload(record, answer, correctedBbch, correctionSource) {
    return {
      ID: record.ID || "",
      ime_datoteke: record.ime_datoteke || "",
      proposed_BBCH: record["BBCH ocena"] || "",
      proposed_fenofaza: record.Fenofaza || "",
      validation_answer: answer,
      corrected_BBCH: correctedBbch || "",
      correction_source: correctionSource,
      validation_datetime: new Date().toISOString()
    };
  }

  function moveToNextIncomplete() {
    var visible = getVisibleRecords();
    var next = visible.findIndex(function (record, index) {
      return index >= state.current && !isCompleted(record);
    });
    if (next === -1) {
      next = visible.findIndex(function (record) { return !isCompleted(record); });
    }
    state.current = next === -1 ? Math.min(state.current, Math.max(visible.length - 1, 0)) : next;
  }

  function isOfficialCode(code) {
    return typeof code === "string" && /^\d{2}$/.test(code) && Boolean(OFFICIAL_BY_CODE[code]);
  }

  function correctionSourceLabel(source) {
    if (source === "OFFICIAL_DROPDOWN") { return "izbor z uradnega seznama"; }
    if (source === "MANUAL_ENTRY") { return "ročni vnos"; }
    return "-";
  }

  function correctionSourceShortLabel(source) {
    return source === "MANUAL_ENTRY" ? "ročni vnos" : "izbor s seznama";
  }

  function setBusy(isBusy) {
    [
      el.yesButton, el.noButton, el.saveCorrection, el.cancelCorrection, el.exportResults,
      el.resetButton, el.correctionSelect, el.manualBbch
    ].forEach(function (control) {
      if (control) { control.disabled = Boolean(isBusy); }
    });
  }

  function setStatus(status) {
    el.statusIndicator.textContent = status;
  }

  function showError(message) {
    el.errorBox.textContent = message;
    el.errorBox.classList.remove("hidden");
  }

  function clearError() {
    el.errorBox.textContent = "";
    el.errorBox.classList.add("hidden");
  }

  function formatDate(value) {
    if (!value) { return "-"; }
    var date = new Date(value);
    if (Number.isNaN(date.getTime())) { return value; }
    return date.toLocaleString("sl-SI");
  }
}());
